export interface SiteSettings {
  businessName: string;
  tagline: string;
  logoUrl?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  googleProfileUrl?: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  partnerName: string;
  partnerTagline: string;
  partnerUrl: string;
  esimPurchaseUrl?: string;
  workingHours: string;
  registrationNumber?: string;
  heroHeadline: string;
  heroSubheadline: string;
  disclaimerNotice: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
  coverImage: string;
  description: string;
  capital: string;
  majorCities: string[];
  currency: string;
  currencyCode: string;
  timeZone: string;
  mainLanguage: string;
  studyLevels: string[];
  intakes: string[];
  entryRequirements: string;
  englishRequirements: string;
  applicationProcess: string;
  visaOverview: string;
  scholarshipInfo: string;
  workOpportunities: string;
  postStudyOptions: string;
  generalSafety: string;
  drinkingWaterGuidance: string;
  officialVisaLink: string;
  officialUniversityLink: string;
  published: boolean;
  order: number;
}

export interface Course {
  id: string;
  name: string;
  category: 'English / Test Preparation' | 'Foreign Languages' | 'Overseas Academic Courses';
  subCategory: string;
  duration: string;
  studyLevel: string;
  indicativeFee: string;
  intakes: string[];
  entryRequirements: string;
  englishRequirements: string;
  careerInformation: string;
  description: string;
  countryIds: string[];
  universityIds: string[];
  published: boolean;
  order: number;
}

export interface University {
  id: string;
  name: string;
  countryId: string;
  city: string;
  logo: string;
  image: string;
  description: string;
  indicativeFee: string;
  intakes: string[];
  entryRequirements: string;
  englishRequirements: string;
  scholarshipInfo: string;
  accommodationInfo: string;
  applicationProcess: string;
  officialWebsite: string;
  officialAdmissionsLink: string;
  courseIds: string[];
  published: boolean;
  order: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  inclusions: string[];
  published: boolean;
  order: number;
}

export interface StudentEssential {
  id: string;
  title: string;
  countryId?: string;
  category: 'Accommodation' | 'Living Costs' | 'Food & Groceries' | 'Transport' | 'SIM & Internet' | 'Healthcare & Insurance' | 'Banking & Forex' | 'Checklist';
  summary: string;
  details: string;
  checklists?: string[];
  published: boolean;
  order: number;
}

export interface Scholarship {
  id: string;
  name: string;
  countryId: string;
  universityId?: string;
  courseCategory?: string;
  eligibility: string;
  amount: string;
  deadline: string;
  requirements: string;
  applicationProcess: string;
  officialLink: string;
  notes: string;
  published: boolean;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  published: boolean;
  order: number;
}

export interface Poster {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  countryId?: string;
  category: string;
  date: string;
  ctaText: string;
  customWhatsAppMsg?: string;
  published: boolean;
  order: number;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  posterUrl: string;
  ctaText: string;
  published: boolean;
}

export interface Testimonial {
  id: string;
  studentName: string;
  photoUrl: string;
  course: string;
  university: string;
  country: string;
  intake: string;
  quote: string;
  published: boolean;
}

export interface EsimProduct {
  id: string;
  destination: string;
  countryCode: string;
  flag: string;
  plans: {
    id: string;
    dataAmount: string;
    validity: string;
    priceInr: number;
    description: string;
  }[];
  features: string[];
  installationGuide: string;
  activationGuide: string;
  compatibleDevices: string[];
  published: boolean;
  order: number;
}

export type CandidateStatus =
  | 'New'
  | 'Contacted'
  | 'Counselling'
  | 'Shortlisted'
  | 'Applied'
  | 'Offer'
  | 'Visa'
  | 'Travel'
  | 'Arrived'
  | 'Completed'
  | 'Archived';

export interface EnquiryNote {
  id: string;
  timestamp: string;
  author: string;
  note: string;
}

export interface Enquiry {
  id: string;
  createdAt: string;
  fullName: string;
  whatsappMobile: string;
  email: string;
  highestQualification: string;
  currentLocation?: string;
  preferredCountry: string;
  preferredCourse: string;
  preferredIntake: string;
  englishTestStatus: string;
  workExperience: string;
  passportStatus: string;
  message: string;
  sourcePage?: string;
  status: CandidateStatus;
  followUpDate?: string;
  selectedUniversity?: string;
  internalRemarks?: string;
  notes: EnquiryNote[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminUser: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'LOGIN' | 'SETTINGS_CHANGE';
  entity: string;
  recordId: string;
  details: string;
}

export interface PublicBootstrapData {
  settings: SiteSettings;
  countries: Country[];
  courses: Course[];
  universities: University[];
  services: ServiceItem[];
  studentEssentials: StudentEssential[];
  scholarships: Scholarship[];
  faqs: FAQ[];
  posters: Poster[];
  events: EventItem[];
  testimonials: Testimonial[];
  esimProducts: EsimProduct[];
}

export interface CurrencyRate {
  code: string;
  name: string;
  rateInr: number;
}

export interface LiveCurrencyData {
  status: 'live' | 'unavailable';
  rates?: CurrencyRate[];
  timestamp?: string;
  source?: string;
  message?: string;
}

export interface WeatherDayForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
}

export interface LiveWeatherData {
  status: 'live' | 'unavailable';
  city?: string;
  country?: string;
  temperature?: number;
  feelsLike?: number;
  humidity?: number;
  windSpeed?: number;
  condition?: string;
  forecast?: WeatherDayForecast[];
  timestamp?: string;
  message?: string;
}
