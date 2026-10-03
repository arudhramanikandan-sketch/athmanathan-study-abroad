import {
  PublicBootstrapData,
  LiveCurrencyData,
  LiveWeatherData,
  Enquiry,
  CandidateStatus,
} from './types';
import fallbackBootstrapData from '../public/bootstrap.json';

const BASE_URL = '/api';

export async function fetchPublicData(): Promise<PublicBootstrapData> {
  // 1. Primary: live backend API endpoint
  try {
    const res = await fetch(`${BASE_URL}/public/bootstrap`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        if (json && json.settings && Array.isArray(json.countries)) {
          return json as PublicBootstrapData;
        }
      }
    }
  } catch (apiErr) {
    console.warn('API /api/public/bootstrap request failed, falling back to static cache:', apiErr);
  }

  // 2. Secondary fallback: static edge CDN cache (/bootstrap.json)
  try {
    const staticRes = await fetch('/bootstrap.json', {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (staticRes.ok) {
      const json = await staticRes.json();
      if (json && json.settings && Array.isArray(json.countries)) {
        return json as PublicBootstrapData;
      }
    }
  } catch (staticErr) {
    console.warn('Static /bootstrap.json request failed, falling back to bundled data:', staticErr);
  }

  // 3. Guaranteed fallback: statically bundled bootstrap data
  return fallbackBootstrapData as unknown as PublicBootstrapData;
}

export async function fetchLiveCurrency(): Promise<LiveCurrencyData> {
  try {
    const res = await fetch(`${BASE_URL}/public/live/currency`);
    if (!res.ok) throw new Error('Live currency data unavailable');
    return await res.json();
  } catch {
    return { status: 'unavailable', message: 'Live data currently unavailable.' };
  }
}

export async function fetchLiveWeather(city: string): Promise<LiveWeatherData> {
  try {
    const res = await fetch(`${BASE_URL}/public/live/weather?city=${encodeURIComponent(city)}`);
    if (!res.ok) throw new Error('Live weather data unavailable');
    return await res.json();
  } catch {
    return { status: 'unavailable', message: 'Live data currently unavailable.' };
  }
}

export async function submitEnquiry(payload: Partial<Enquiry>): Promise<{ success: boolean; message: string; enquiryId?: string }> {
  const res = await fetch(`${BASE_URL}/public/enquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit enquiry.');
  }
  return data;
}

// Helper to construct WhatsApp click-to-chat links
export function buildWhatsAppLink(customMessage: string, customPhone?: string): string {
  const phone = (customPhone || '919994986650').replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(customMessage.trim());
  return `https://wa.me/${phone}?text=${encodedText}`;
}

// Admin API & Token Management
const ADMIN_TOKEN_KEY = 'athmanathan_admin_jwt';

export function getAdminToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;
}

export function setAdminToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }
}

export function removeAdminToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(options.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  if (data.token) {
    setAdminToken(data.token);
  }
  return data;
}

export async function adminVerifyMfa(challengeId: string, code: string) {
  const res = await fetch(`${BASE_URL}/admin/mfa/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ challengeId, code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Verification failed');
  if (data.token) {
    setAdminToken(data.token);
  }
  return data;
}

export async function adminGetMe() {
  const res = await adminFetch(`${BASE_URL}/admin/me`);
  if (!res.ok) return null;
  return res.json();
}

export async function adminLogout() {
  try {
    await adminFetch(`${BASE_URL}/admin/logout`, { method: 'POST' });
  } finally {
    removeAdminToken();
  }
}

export async function adminGetAllData() {
  const res = await adminFetch(`${BASE_URL}/admin/all-data`);
  if (!res.ok) throw new Error('Failed to load administrative records.');
  return res.json();
}

export async function adminSaveCountry(data: any, id?: string) {
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE_URL}/admin/countries/${id}` : `${BASE_URL}/admin/countries`;
  const res = await adminFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save country');
  return res.json();
}

export async function adminDeleteCountry(id: string) {
  const res = await adminFetch(`${BASE_URL}/admin/countries/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete country');
  return res.json();
}

export async function adminSaveCourse(data: any, id?: string) {
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE_URL}/admin/courses/${id}` : `${BASE_URL}/admin/courses`;
  const res = await adminFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save course');
  return res.json();
}

export async function adminDeleteCourse(id: string) {
  const res = await adminFetch(`${BASE_URL}/admin/courses/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete course');
  return res.json();
}

export async function adminSaveUniversity(data: any, id?: string) {
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE_URL}/admin/universities/${id}` : `${BASE_URL}/admin/universities`;
  const res = await adminFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save university');
  return res.json();
}

export async function adminDeleteUniversity(id: string) {
  const res = await adminFetch(`${BASE_URL}/admin/universities/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete university');
  return res.json();
}

export async function adminSavePoster(data: any, id?: string) {
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE_URL}/admin/posters/${id}` : `${BASE_URL}/admin/posters`;
  const res = await adminFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save poster');
  return res.json();
}

export async function adminDeletePoster(id: string) {
  const res = await adminFetch(`${BASE_URL}/admin/posters/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete poster');
  return res.json();
}

export async function adminSaveScholarship(data: any, id?: string) {
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE_URL}/admin/scholarships/${id}` : `${BASE_URL}/admin/scholarships`;
  const res = await adminFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save scholarship');
  return res.json();
}

export async function adminDeleteScholarship(id: string) {
  const res = await adminFetch(`${BASE_URL}/admin/scholarships/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete scholarship');
  return res.json();
}

export async function adminSaveFaq(data: any, id?: string) {
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE_URL}/admin/faqs/${id}` : `${BASE_URL}/admin/faqs`;
  const res = await adminFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save FAQ');
  return res.json();
}

export async function adminDeleteFaq(id: string) {
  const res = await adminFetch(`${BASE_URL}/admin/faqs/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete FAQ');
  return res.json();
}

export async function adminSaveEvent(data: any, id?: string) {
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE_URL}/admin/events/${id}` : `${BASE_URL}/admin/events`;
  const res = await adminFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save event');
  return res.json();
}

export async function adminDeleteEvent(id: string) {
  const res = await adminFetch(`${BASE_URL}/admin/events/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete event');
  return res.json();
}

export async function adminSaveTestimonial(data: any, id?: string) {
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE_URL}/admin/testimonials/${id}` : `${BASE_URL}/admin/testimonials`;
  const res = await adminFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save testimonial');
  return res.json();
}

export async function adminDeleteTestimonial(id: string) {
  const res = await adminFetch(`${BASE_URL}/admin/testimonials/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete testimonial');
  return res.json();
}

export async function adminSaveEsim(data: any, id?: string) {
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE_URL}/admin/esim/${id}` : `${BASE_URL}/admin/esim`;
  const res = await adminFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save eSIM product');
  return res.json();
}

export async function adminDeleteEsim(id: string) {
  const res = await adminFetch(`${BASE_URL}/admin/esim/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete eSIM product');
  return res.json();
}

export async function adminUpdateEnquiry(id: string, updates: { status?: CandidateStatus; followUpDate?: string; selectedUniversity?: string; internalRemarks?: string }) {
  const res = await adminFetch(`${BASE_URL}/admin/enquiries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update enquiry');
  return res.json();
}

export async function adminAddEnquiryNote(id: string, note: string) {
  const res = await adminFetch(`${BASE_URL}/admin/enquiries/${id}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note }),
  });
  if (!res.ok) throw new Error('Failed to add candidate note');
  return res.json();
}

export async function adminDeleteEnquiry(id: string) {
  const res = await adminFetch(`${BASE_URL}/admin/enquiries/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete enquiry');
  return res.json();
}

export async function adminUpdateSettings(settings: any) {
  const res = await adminFetch(`${BASE_URL}/admin/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

export async function adminUploadImage(base64Data: string, filename: string): Promise<string> {
  const res = await adminFetch(`${BASE_URL}/admin/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Data, filename }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to upload image');
  return data.url;
}
