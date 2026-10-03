import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import {
  getDb,
  saveDb,
  Country,
  Course,
  University,
  ServiceItem,
  StudentEssential,
  Scholarship,
  FAQ,
  Poster,
  EventItem,
  Testimonial,
  EsimProduct,
  Enquiry,
  CandidateStatus,
} from './db';
import {
  hashPassword,
  verifyPassword,
  generateBase32Secret,
  verifyTotpCode,
  getOtpAuthUrl,
  createSessionToken,
  revokeSession,
  requireAdminAuth,
  checkLoginAttempts,
  recordFailedLogin,
  resetFailedLogins,
  SESSION_COOKIE_NAME,
} from './auth';
import { fetchLiveCurrency, fetchLiveWeather } from './live-data';

export const router = express.Router();

// Temporary memory for pending 2FA authentication steps
interface Pending2FA {
  userId: string;
  username: string;
  tempSecret?: string;
  isEnrollment: boolean;
  expiresAt: number;
}
const pendingMfaChallenges = new Map<string, Pending2FA>();

// -------------------------------------------------------------
// PUBLIC ROUTES
// -------------------------------------------------------------

// Comprehensive public bootstrap data (strictly published items only)
router.get('/public/bootstrap', (req: Request, res: Response) => {
  try {
    const db = getDb();

    // Security: Only return published content and non-sensitive fields
    res.json({
      settings: db.settings,
      countries: db.countries.filter((c) => c.published).sort((a, b) => a.order - b.order),
      courses: db.courses.filter((c) => c.published).sort((a, b) => a.order - b.order),
      universities: db.universities.filter((u) => u.published).sort((a, b) => a.order - b.order),
      services: db.services.filter((s) => s.published).sort((a, b) => a.order - b.order),
      studentEssentials: db.studentEssentials.filter((e) => e.published).sort((a, b) => a.order - b.order),
      scholarships: db.scholarships.filter((s) => s.published),
      faqs: db.faqs.filter((f) => f.published).sort((a, b) => a.order - b.order),
      posters: db.posters.filter((p) => p.published).sort((a, b) => a.order - b.order),
      events: db.events.filter((e) => e.published),
      testimonials: db.testimonials.filter((t) => t.published),
      esimProducts: db.esimProducts.filter((e) => e.published).sort((a, b) => a.order - b.order),
    });
  } catch (error) {
    console.error('Error fetching public bootstrap data:', error);
    res.status(500).json({ error: 'Unable to load data. Please try again.' });
  }
});

// Live Currency
router.get('/public/live/currency', async (req: Request, res: Response) => {
  const result = await fetchLiveCurrency();
  res.json(result);
});

// Live Weather
router.get('/public/live/weather', async (req: Request, res: Response) => {
  const city = (req.query.city as string) || 'london';
  const result = await fetchLiveWeather(city);
  res.json(result);
});

// Public IP Location lookup for auto-filling current location
router.get('/public/ip-location', async (req: Request, res: Response) => {
  try {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const clientIp = Array.isArray(rawIp) ? rawIp[0] : String(rawIp).split(',')[0].trim();

    let geoData: any = null;
    try {
      const isLocal = !clientIp || clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.startsWith('10.') || clientIp.startsWith('192.168.');
      const queryUrl = isLocal ? 'https://ipapi.co/json/' : `https://ipapi.co/${clientIp}/json/`;
      const ipRes = await fetch(queryUrl, { signal: AbortSignal.timeout(3500) });
      if (ipRes.ok) {
        geoData = await ipRes.json();
      }
    } catch {
      // fallback handled below
    }

    if (geoData && (geoData.city || geoData.country_name)) {
      const city = geoData.city || '';
      const region = geoData.region || '';
      const country = geoData.country_name || '';
      const formatted = [city, region, country].filter(Boolean).join(', ');
      return res.json({
        success: true,
        city,
        region,
        country,
        countryCode: geoData.country_code || '',
        formatted: formatted || 'Tamil Nadu, India',
      });
    }

    return res.json({
      success: true,
      city: 'Chennai',
      region: 'Tamil Nadu',
      country: 'India',
      countryCode: 'IN',
      formatted: 'Tamil Nadu, India',
    });
  } catch (err: any) {
    return res.json({
      success: false,
      formatted: 'Tamil Nadu, India',
      country: 'India',
    });
  }
});

// Candidate Enquiry Submission (No candidate account required)
router.post('/public/enquiry', (req: Request, res: Response) => {
  try {
    const {
      fullName,
      whatsappMobile,
      email,
      highestQualification,
      currentLocation,
      preferredCountry,
      preferredCourse,
      preferredIntake,
      englishTestStatus,
      workExperience,
      passportStatus,
      message,
      sourcePage,
    } = req.body;

    if (!fullName || !whatsappMobile) {
      res.status(400).json({ error: 'Full Name and WhatsApp / Mobile Number are required.' });
      return;
    }

    const db = getDb();
    const newEnquiry: Enquiry = {
      id: 'enq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      fullName: String(fullName).trim(),
      whatsappMobile: String(whatsappMobile).trim(),
      email: String(email || '').trim(),
      highestQualification: String(highestQualification || '').trim(),
      currentLocation: String(currentLocation || '').trim(),
      preferredCountry: String(preferredCountry || '').trim(),
      preferredCourse: String(preferredCourse || '').trim(),
      preferredIntake: String(preferredIntake || '').trim(),
      englishTestStatus: String(englishTestStatus || '').trim(),
      workExperience: String(workExperience || '').trim(),
      passportStatus: String(passportStatus || '').trim(),
      message: String(message || '').trim(),
      sourcePage: String(sourcePage || '').trim(),
      status: 'New',
      notes: [],
    };

    db.enquiries.unshift(newEnquiry);
    saveDb(db, 'PUBLIC_USER', 'CREATE', 'ENQUIRY', `New enquiry submitted by ${newEnquiry.fullName} (${newEnquiry.whatsappMobile})`);

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received successfully! Our senior education counsellor will connect with you via WhatsApp.',
      enquiryId: newEnquiry.id,
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ error: 'Unable to submit enquiry at this time. Please contact via WhatsApp.' });
  }
});

// -------------------------------------------------------------
// SECURE ADMIN AUTHENTICATION ROUTES
// -------------------------------------------------------------

// Step 1: Admin Password Verification
router.post('/admin/login', async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown_ip';
  const attempts = checkLoginAttempts(ip);
  if (!attempts.allowed) {
    res.status(429).json({
      error: `Too many failed login attempts. Please wait ${attempts.remainingWaitSec} seconds before trying again.`,
    });
    return;
  }

  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username/Email and Password are required.' });
    return;
  }

  const db = getDb();
  const user = db.adminUsers.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()
  );

  if (!user) {
    recordFailedLogin(ip);
    res.status(401).json({ error: 'Invalid credentials.' });
    return;
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    recordFailedLogin(ip);
    res.status(401).json({ error: 'Invalid credentials.' });
    return;
  }

  // Password verified! Now check 2FA status
  const challengeId = 'mfa_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);

  if (!user.mfaEnabled || !user.mfaSecret) {
    // Generate new TOTP secret for initial enrollment
    const newSecret = generateBase32Secret(20);
    const otpAuthUrl = getOtpAuthUrl(newSecret, user.email);
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);

    pendingMfaChallenges.set(challengeId, {
      userId: user.id,
      username: user.username,
      tempSecret: newSecret,
      isEnrollment: true,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes to setup
    });

    res.json({
      step: 'mfa_enrollment',
      requireMfa: true,
      setupRequired: true,
      challengeId,
      secret: newSecret,
      qrCodeDataUrl,
      message: 'Initial 2FA Setup Required. Scan the QR code using Google Authenticator or Microsoft Authenticator, then enter the 6-digit code.',
    });
  } else {
    // Already enrolled, prompt for TOTP code
    pendingMfaChallenges.set(challengeId, {
      userId: user.id,
      username: user.username,
      tempSecret: user.mfaSecret,
      isEnrollment: false,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // Always generate and return QR code for the secret so the admin can scan it
    const otpAuthUrl = getOtpAuthUrl(user.mfaSecret, user.email);
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);

    res.json({
      step: 'mfa_verify_required',
      requireMfa: true,
      setupRequired: false,
      challengeId,
      secret: user.mfaSecret,
      qrCodeDataUrl,
      message: 'Enter the 6-digit verification code from your Authenticator App.',
    });
  }
});

// Step 2: Complete MFA (Enrollment or Routine Login)
router.post('/admin/mfa/verify', async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown_ip';
  const { challengeId, code } = req.body;

  if (!challengeId || !code) {
    res.status(400).json({ error: 'Challenge ID and 6-digit Code are required.' });
    return;
  }

  const pending = pendingMfaChallenges.get(challengeId);
  if (!pending || pending.expiresAt < Date.now()) {
    pendingMfaChallenges.delete(challengeId);
    res.status(401).json({ error: 'MFA session expired. Please start login again.' });
    return;
  }

  const isValid = verifyTotpCode(pending.tempSecret!, code);
  if (!isValid) {
    recordFailedLogin(ip);
    res.status(401).json({ error: 'Invalid 6-digit verification code. Please check your Authenticator clock.' });
    return;
  }

  // Code is verified! Reset failed attempts
  resetFailedLogins(ip);
  pendingMfaChallenges.delete(challengeId);

  const db = getDb();
  const user = db.adminUsers.find((u) => u.id === pending.userId);
  if (!user) {
    res.status(404).json({ error: 'User record not found.' });
    return;
  }

  if (pending.isEnrollment) {
    user.mfaEnabled = true;
    user.mfaSecret = pending.tempSecret;
    saveDb(db, user.username, 'UPDATE', 'ADMIN_MFA', 'Completed initial TOTP 2FA enrollment');
  }

  user.lastLogin = new Date().toISOString();
  saveDb(db, user.username, 'LOGIN', 'ADMIN_USER', 'Successful admin login with 2FA');

  const sessionToken = createSessionToken(user);

  // Set secure HttpOnly cookie
  res.cookie(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 12 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    token: sessionToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      mfaEnabled: user.mfaEnabled,
    },
    admin: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      mfaEnabled: user.mfaEnabled,
    },
  });
});

// Admin Logout
router.post('/admin/logout', requireAdminAuth, (req: Request, res: Response) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME] || req.headers.authorization?.slice(7);
  if (token) {
    revokeSession(token);
  }
  res.clearCookie(SESSION_COOKIE_NAME);
  res.json({ success: true, message: 'Logged out securely.' });
});

// Check Current Session Status
router.get('/admin/me', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession;
  const db = getDb();
  const user = db.adminUsers.find((u) => u.id === session.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      mfaEnabled: user.mfaEnabled,
    },
    admin: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      mfaEnabled: user.mfaEnabled,
    },
  });
});

// -------------------------------------------------------------
// SECURE ADMIN CONTENT & ENQUIRIES API (CRUD)
// -------------------------------------------------------------

// Full Admin Data Payload (Including internal records, audit logs, enquiries)
router.get('/admin/all-data', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const db = getDb();
    res.json({
      settings: db.settings,
      countries: db.countries,
      courses: db.courses,
      universities: db.universities,
      services: db.services,
      studentEssentials: db.studentEssentials,
      scholarships: db.scholarships,
      faqs: db.faqs,
      posters: db.posters,
      events: db.events,
      testimonials: db.testimonials,
      esimProducts: db.esimProducts,
      enquiries: db.enquiries,
      auditLogs: db.auditLogs.slice(0, 100),
    });
  } catch (error) {
    console.error('Error loading admin data:', error);
    res.status(500).json({ error: 'Failed to load database records.' });
  }
});

// 1. Countries CRUD
router.post('/admin/countries', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const country: Country = {
    id: 'cnt_' + Date.now(),
    name: req.body.name,
    code: req.body.code || 'GL',
    flag: req.body.flag || '🌍',
    coverImage: req.body.coverImage || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    description: req.body.description || '',
    capital: req.body.capital || '',
    majorCities: Array.isArray(req.body.majorCities) ? req.body.majorCities : [],
    currency: req.body.currency || '',
    currencyCode: req.body.currencyCode || 'USD',
    timeZone: req.body.timeZone || '',
    mainLanguage: req.body.mainLanguage || 'English',
    studyLevels: Array.isArray(req.body.studyLevels) ? req.body.studyLevels : [],
    intakes: Array.isArray(req.body.intakes) ? req.body.intakes : [],
    entryRequirements: req.body.entryRequirements || '',
    englishRequirements: req.body.englishRequirements || '',
    applicationProcess: req.body.applicationProcess || '',
    visaOverview: req.body.visaOverview || '',
    scholarshipInfo: req.body.scholarshipInfo || '',
    workOpportunities: req.body.workOpportunities || '',
    postStudyOptions: req.body.postStudyOptions || '',
    generalSafety: req.body.generalSafety || '',
    drinkingWaterGuidance: req.body.drinkingWaterGuidance || '',
    officialVisaLink: req.body.officialVisaLink || '',
    officialUniversityLink: req.body.officialUniversityLink || '',
    published: req.body.published !== false,
    order: db.countries.length + 1,
  };
  db.countries.push(country);
  saveDb(db, admin, 'CREATE', 'COUNTRY', `Created country: ${country.name}`);
  res.status(201).json(country);
});

router.put('/admin/countries/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const index = db.countries.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Country not found.' });
    return;
  }
  db.countries[index] = { ...db.countries[index], ...req.body, id: req.params.id };
  saveDb(db, admin, 'UPDATE', 'COUNTRY', `Updated country: ${db.countries[index].name}`);
  res.json(db.countries[index]);
});

router.delete('/admin/countries/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const item = db.countries.find((c) => c.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Country not found.' });
    return;
  }
  db.countries = db.countries.filter((c) => c.id !== req.params.id);
  // Also clean up relationships in courses and universities
  db.courses.forEach((crs) => {
    crs.countryIds = crs.countryIds.filter((cid) => cid !== req.params.id);
  });
  saveDb(db, admin, 'DELETE', 'COUNTRY', `Deleted country: ${item.name} (${item.id})`);
  res.json({ success: true, message: `Country ${item.name} deleted permanently.` });
});

// 2. Courses CRUD
router.post('/admin/courses', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const course: Course = {
    id: 'crs_' + Date.now(),
    name: req.body.name,
    category: req.body.category || 'Overseas Academic Courses',
    subCategory: req.body.subCategory || '',
    duration: req.body.duration || '',
    studyLevel: req.body.studyLevel || 'Postgraduate',
    indicativeFee: req.body.indicativeFee || '',
    intakes: Array.isArray(req.body.intakes) ? req.body.intakes : [],
    entryRequirements: req.body.entryRequirements || '',
    englishRequirements: req.body.englishRequirements || '',
    careerInformation: req.body.careerInformation || '',
    description: req.body.description || '',
    countryIds: Array.isArray(req.body.countryIds) ? req.body.countryIds : [],
    universityIds: Array.isArray(req.body.universityIds) ? req.body.universityIds : [],
    published: req.body.published !== false,
    order: db.courses.length + 1,
  };
  db.courses.push(course);
  saveDb(db, admin, 'CREATE', 'COURSE', `Created course: ${course.name}`);
  res.status(201).json(course);
});

router.put('/admin/courses/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const index = db.courses.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Course not found.' });
    return;
  }
  db.courses[index] = { ...db.courses[index], ...req.body, id: req.params.id };
  saveDb(db, admin, 'UPDATE', 'COURSE', `Updated course: ${db.courses[index].name}`);
  res.json(db.courses[index]);
});

router.delete('/admin/courses/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const item = db.courses.find((c) => c.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Course not found.' });
    return;
  }
  db.courses = db.courses.filter((c) => c.id !== req.params.id);
  db.universities.forEach((u) => {
    u.courseIds = u.courseIds.filter((cid) => cid !== req.params.id);
  });
  saveDb(db, admin, 'DELETE', 'COURSE', `Deleted course: ${item.name} (${item.id})`);
  res.json({ success: true, message: `Course ${item.name} deleted permanently.` });
});

// 3. Universities CRUD
router.post('/admin/universities', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const uni: University = {
    id: 'uni_' + Date.now(),
    name: req.body.name,
    countryId: req.body.countryId,
    city: req.body.city || '',
    logo: req.body.logo || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80',
    image: req.body.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80',
    description: req.body.description || '',
    indicativeFee: req.body.indicativeFee || '',
    intakes: Array.isArray(req.body.intakes) ? req.body.intakes : [],
    entryRequirements: req.body.entryRequirements || '',
    englishRequirements: req.body.englishRequirements || '',
    scholarshipInfo: req.body.scholarshipInfo || '',
    accommodationInfo: req.body.accommodationInfo || '',
    applicationProcess: req.body.applicationProcess || '',
    officialWebsite: req.body.officialWebsite || '',
    officialAdmissionsLink: req.body.officialAdmissionsLink || '',
    courseIds: Array.isArray(req.body.courseIds) ? req.body.courseIds : [],
    published: req.body.published !== false,
    order: db.universities.length + 1,
  };
  db.universities.push(uni);
  saveDb(db, admin, 'CREATE', 'UNIVERSITY', `Created university: ${uni.name}`);
  res.status(201).json(uni);
});

router.put('/admin/universities/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const index = db.universities.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'University not found.' });
    return;
  }
  db.universities[index] = { ...db.universities[index], ...req.body, id: req.params.id };
  saveDb(db, admin, 'UPDATE', 'UNIVERSITY', `Updated university: ${db.universities[index].name}`);
  res.json(db.universities[index]);
});

router.delete('/admin/universities/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const item = db.universities.find((u) => u.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'University not found.' });
    return;
  }
  db.universities = db.universities.filter((u) => u.id !== req.params.id);
  saveDb(db, admin, 'DELETE', 'UNIVERSITY', `Deleted university: ${item.name} (${item.id})`);
  res.json({ success: true, message: `University ${item.name} deleted permanently.` });
});

// 4. Posters / Latest Updates CRUD
router.post('/admin/posters', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const poster: Poster = {
    id: 'pst_' + Date.now(),
    title: req.body.title,
    description: req.body.description || '',
    imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    countryId: req.body.countryId || '',
    category: req.body.category || 'Latest Announcement',
    date: req.body.date || new Date().toISOString().split('T')[0],
    ctaText: req.body.ctaText || 'Chat on WhatsApp',
    customWhatsAppMsg: req.body.customWhatsAppMsg || '',
    published: req.body.published !== false,
    order: db.posters.length + 1,
  };
  db.posters.push(poster);
  saveDb(db, admin, 'CREATE', 'POSTER', `Created poster: ${poster.title}`);
  res.status(201).json(poster);
});

router.put('/admin/posters/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const index = db.posters.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Poster not found.' });
    return;
  }
  db.posters[index] = { ...db.posters[index], ...req.body, id: req.params.id };
  saveDb(db, admin, 'UPDATE', 'POSTER', `Updated poster: ${db.posters[index].title}`);
  res.json(db.posters[index]);
});

router.delete('/admin/posters/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const item = db.posters.find((p) => p.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Poster not found.' });
    return;
  }
  db.posters = db.posters.filter((p) => p.id !== req.params.id);
  saveDb(db, admin, 'DELETE', 'POSTER', `Deleted poster: ${item.title} (${item.id})`);
  res.json({ success: true, message: `Poster ${item.title} deleted permanently.` });
});

// 5. Scholarships CRUD
router.post('/admin/scholarships', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const sch: Scholarship = {
    id: 'sch_' + Date.now(),
    name: req.body.name,
    countryId: req.body.countryId,
    universityId: req.body.universityId,
    courseCategory: req.body.courseCategory,
    eligibility: req.body.eligibility || '',
    amount: req.body.amount || '',
    deadline: req.body.deadline || '',
    requirements: req.body.requirements || '',
    applicationProcess: req.body.applicationProcess || '',
    officialLink: req.body.officialLink || '',
    notes: req.body.notes || '',
    published: req.body.published !== false,
  };
  db.scholarships.push(sch);
  saveDb(db, admin, 'CREATE', 'SCHOLARSHIP', `Created scholarship: ${sch.name}`);
  res.status(201).json(sch);
});

router.put('/admin/scholarships/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const index = db.scholarships.findIndex((s) => s.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Scholarship not found.' });
    return;
  }
  db.scholarships[index] = { ...db.scholarships[index], ...req.body, id: req.params.id };
  saveDb(db, admin, 'UPDATE', 'SCHOLARSHIP', `Updated scholarship: ${db.scholarships[index].name}`);
  res.json(db.scholarships[index]);
});

router.delete('/admin/scholarships/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const item = db.scholarships.find((s) => s.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Scholarship not found.' });
    return;
  }
  db.scholarships = db.scholarships.filter((s) => s.id !== req.params.id);
  saveDb(db, admin, 'DELETE', 'SCHOLARSHIP', `Deleted scholarship: ${item.name} (${item.id})`);
  res.json({ success: true, message: `Scholarship ${item.name} deleted permanently.` });
});

// 6. FAQs CRUD
router.post('/admin/faqs', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const faq: FAQ = {
    id: 'faq_' + Date.now(),
    category: req.body.category || 'General',
    question: req.body.question,
    answer: req.body.answer,
    published: req.body.published !== false,
    order: db.faqs.length + 1,
  };
  db.faqs.push(faq);
  saveDb(db, admin, 'CREATE', 'FAQ', `Created FAQ: ${faq.question.substring(0, 30)}`);
  res.status(201).json(faq);
});

router.put('/admin/faqs/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const index = db.faqs.findIndex((f) => f.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'FAQ not found.' });
    return;
  }
  db.faqs[index] = { ...db.faqs[index], ...req.body, id: req.params.id };
  saveDb(db, admin, 'UPDATE', 'FAQ', `Updated FAQ: ${db.faqs[index].question.substring(0, 30)}`);
  res.json(db.faqs[index]);
});

router.delete('/admin/faqs/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  db.faqs = db.faqs.filter((f) => f.id !== req.params.id);
  saveDb(db, admin, 'DELETE', 'FAQ', `Deleted FAQ id: ${req.params.id}`);
  res.json({ success: true, message: 'FAQ deleted permanently.' });
});

// 7. Events CRUD
router.post('/admin/events', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const evt: EventItem = {
    id: 'evt_' + Date.now(),
    title: req.body.title,
    date: req.body.date,
    time: req.body.time || '',
    location: req.body.location || '',
    description: req.body.description || '',
    posterUrl: req.body.posterUrl || '',
    ctaText: req.body.ctaText || 'Register on WhatsApp',
    published: req.body.published !== false,
  };
  db.events.push(evt);
  saveDb(db, admin, 'CREATE', 'EVENT', `Created event: ${evt.title}`);
  res.status(201).json(evt);
});

router.put('/admin/events/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const index = db.events.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Event not found.' });
    return;
  }
  db.events[index] = { ...db.events[index], ...req.body, id: req.params.id };
  saveDb(db, admin, 'UPDATE', 'EVENT', `Updated event: ${db.events[index].title}`);
  res.json(db.events[index]);
});

router.delete('/admin/events/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  db.events = db.events.filter((e) => e.id !== req.params.id);
  saveDb(db, admin, 'DELETE', 'EVENT', `Deleted event id: ${req.params.id}`);
  res.json({ success: true, message: 'Event deleted permanently.' });
});

// 8. Testimonials CRUD
router.post('/admin/testimonials', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const item: Testimonial = {
    id: 'tst_' + Date.now(),
    studentName: req.body.studentName,
    photoUrl: req.body.photoUrl || '',
    course: req.body.course || '',
    university: req.body.university || '',
    country: req.body.country || '',
    intake: req.body.intake || '',
    quote: req.body.quote || '',
    published: req.body.published !== false,
  };
  db.testimonials.push(item);
  saveDb(db, admin, 'CREATE', 'TESTIMONIAL', `Created testimonial for: ${item.studentName}`);
  res.status(201).json(item);
});

router.put('/admin/testimonials/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const index = db.testimonials.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Testimonial not found.' });
    return;
  }
  db.testimonials[index] = { ...db.testimonials[index], ...req.body, id: req.params.id };
  saveDb(db, admin, 'UPDATE', 'TESTIMONIAL', `Updated testimonial for: ${db.testimonials[index].studentName}`);
  res.json(db.testimonials[index]);
});

router.delete('/admin/testimonials/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  db.testimonials = db.testimonials.filter((t) => t.id !== req.params.id);
  saveDb(db, admin, 'DELETE', 'TESTIMONIAL', `Deleted testimonial id: ${req.params.id}`);
  res.json({ success: true, message: 'Testimonial deleted permanently.' });
});

// 9. eSIM Products CRUD
router.post('/admin/esim', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const item: EsimProduct = {
    id: 'esim_' + Date.now(),
    destination: req.body.destination,
    countryCode: req.body.countryCode || 'GL',
    flag: req.body.flag || '🌐',
    plans: Array.isArray(req.body.plans) ? req.body.plans : [],
    features: Array.isArray(req.body.features) ? req.body.features : [],
    installationGuide: req.body.installationGuide || '',
    activationGuide: req.body.activationGuide || '',
    compatibleDevices: Array.isArray(req.body.compatibleDevices) ? req.body.compatibleDevices : [],
    published: req.body.published !== false,
    order: db.esimProducts.length + 1,
  };
  db.esimProducts.push(item);
  saveDb(db, admin, 'CREATE', 'ESIM', `Created eSIM product for: ${item.destination}`);
  res.status(201).json(item);
});

router.put('/admin/esim/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const index = db.esimProducts.findIndex((e) => e.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'eSIM product not found.' });
    return;
  }
  db.esimProducts[index] = { ...db.esimProducts[index], ...req.body, id: req.params.id };
  saveDb(db, admin, 'UPDATE', 'ESIM', `Updated eSIM product: ${db.esimProducts[index].destination}`);
  res.json(db.esimProducts[index]);
});

router.delete('/admin/esim/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  db.esimProducts = db.esimProducts.filter((e) => e.id !== req.params.id);
  saveDb(db, admin, 'DELETE', 'ESIM', `Deleted eSIM product id: ${req.params.id}`);
  res.json({ success: true, message: 'eSIM product deleted permanently.' });
});

// 10. Candidate CRM / Enquiry Management
router.put('/admin/enquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const enquiry = db.enquiries.find((e) => e.id === req.params.id);
  if (!enquiry) {
    res.status(404).json({ error: 'Enquiry record not found.' });
    return;
  }

  const { status, followUpDate, selectedUniversity, internalRemarks } = req.body;
  const oldStatus = enquiry.status;

  if (status) enquiry.status = status as CandidateStatus;
  if (followUpDate !== undefined) enquiry.followUpDate = followUpDate;
  if (selectedUniversity !== undefined) enquiry.selectedUniversity = selectedUniversity;
  if (internalRemarks !== undefined) enquiry.internalRemarks = internalRemarks;

  saveDb(
    db,
    admin,
    'UPDATE',
    'ENQUIRY',
    `Updated candidate ${enquiry.fullName} (${enquiry.id}): status ${oldStatus} -> ${enquiry.status}`
  );
  res.json(enquiry);
});

router.post('/admin/enquiries/:id/notes', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const { note } = req.body;
  if (!note || !note.trim()) {
    res.status(400).json({ error: 'Note text is required.' });
    return;
  }

  const db = getDb();
  const enquiry = db.enquiries.find((e) => e.id === req.params.id);
  if (!enquiry) {
    res.status(404).json({ error: 'Enquiry not found.' });
    return;
  }

  const newNote = {
    id: 'n_' + Date.now(),
    timestamp: new Date().toISOString(),
    author: admin,
    note: String(note).trim(),
  };
  enquiry.notes.push(newNote);
  saveDb(db, admin, 'UPDATE', 'ENQUIRY_NOTE', `Added note to candidate ${enquiry.fullName}`);
  res.status(201).json(newNote);
});

router.delete('/admin/enquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  const enquiry = db.enquiries.find((e) => e.id === req.params.id);
  if (!enquiry) {
    res.status(404).json({ error: 'Enquiry not found.' });
    return;
  }
  db.enquiries = db.enquiries.filter((e) => e.id !== req.params.id);
  saveDb(db, admin, 'DELETE', 'ENQUIRY', `Deleted enquiry for candidate: ${enquiry.fullName}`);
  res.json({ success: true, message: `Enquiry for ${enquiry.fullName} deleted permanently.` });
});

// 11. Site Settings Update
router.put('/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  const admin = (req as any).adminSession.username;
  const db = getDb();
  db.settings = { ...db.settings, ...req.body };
  saveDb(db, admin, 'SETTINGS_CHANGE', 'SITE_SETTINGS', 'Updated business and contact settings');
  res.json({ success: true, settings: db.settings });
});

// 12. Direct File / Image Upload (Stores securely on disk in /public/uploads)
router.post('/admin/upload', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { base64Data, filename } = req.body;
    if (!base64Data || !filename) {
      res.status(400).json({ error: 'base64Data and filename are required.' });
      return;
    }

    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: 'Invalid base64 image data string.' });
      return;
    }

    const ext = path.extname(filename).toLowerCase() || '.jpg';
    if (!['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
      res.status(400).json({ error: 'Only JPG, PNG, WEBP, SVG, and GIF image files are allowed.' });
      return;
    }

    const buffer = Buffer.from(matches[2], 'base64');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const safeFilename = `${Date.now()}_${path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '')}${ext}`;
      const filePath = path.join(uploadsDir, safeFilename);

      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/${safeFilename}`;

      res.json({ success: true, url: publicUrl });
    } catch (diskErr) {
      console.warn('Filesystem write to /public/uploads unavailable, using data URI fallback:', diskErr);
      // Works universally in <img src="..."> even on read-only serverless platforms like Vercel
      res.json({ success: true, url: base64Data });
    }
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload image file.' });
  }
});
