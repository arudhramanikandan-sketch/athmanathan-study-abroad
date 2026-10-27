export interface VibeStudyTrack {
  id: 'regular' | 'fast_track' | 'progression';
  name: string;
  duration: string;
  feeLabel: string;
  totalFeeUsd: number | null; // null for Level 6 where variable
  feeNote: string;
  description: string;
}

export interface VibeCourse {
  id: string;
  title: string;
  code?: string;
  level: 'Level 3 Foundation' | 'Level 4 & 5 Diploma' | 'Level 5 Diploma' | 'Level 6 University Progression';
  levelCategory: 'level3' | 'level45' | 'level5' | 'level6';
  overview: string;
  availableTracks: VibeStudyTrack[];
  defaultTrackId: 'regular' | 'fast_track' | 'progression';
  credits: number;
  creditsNote?: string;
  studyMode: string;
  assessmentMethod: string;
  awardingBody: string;
  qualificationTitle: string;
  entryRequirements: string;
  progressionOpportunities: string;
  intakes: string[];
  discrepancyNote?: string; // Config note for admin / confirmation
}

export const VIBE_VISA_INFO = {
  feeNotice: 'USD 1,500, as communicated by VIBE Education. Please confirm the current amount and applicable payment instructions before making payment.',
  processingTimeNotice: 'Estimated entry permit processing time: 3–7 working days after the relevant visa process begins, subject to government procedures and approval.',
  overallTimeNotice: 'The overall process may take approximately 2–3 weeks if all steps proceed as planned. Actual timelines may vary depending on document verification, interview, government procedures, and individual circumstances.',
  steps: [
    {
      step: 1,
      title: 'Enquiry & Course Selection',
      description: 'Student selects their preferred course and submits an enquiry through Athmanathan Study Abroad.',
    },
    {
      step: 2,
      title: 'Document Submission',
      description: 'The student provides basic academic details and latest academic qualifications/transcripts for initial review.',
    },
    {
      step: 3,
      title: 'Admission Interview',
      description: 'VIBE Education conducts an academic/profile interview to evaluate candidate motivation and suitability.',
    },
    {
      step: 4,
      title: 'Official Offer Letter',
      description: 'If selected, the student receives an official offer letter specifying programme details and conditions.',
    },
    {
      step: 5,
      title: 'Visa Fee Payment',
      description: 'The student pays the stated visa fee (USD 1,500) as per official payment instructions issued with the offer.',
    },
    {
      step: 6,
      title: 'Entry Permit Processing',
      description: 'VIBE Education files and processes the UAE student entry permit with Dubai immigration authorities.',
    },
    {
      step: 7,
      title: 'Tuition Fee Payment',
      description: 'Once the visa / entry permit is issued and verified, the student pays the applicable tuition fee.',
    },
    {
      step: 8,
      title: 'Flight Booking & Travel Prep',
      description: 'The student books their flight after required payment confirmation and travel arrangements are finalized.',
    },
    {
      step: 9,
      title: 'Airport Pickup Coordination',
      description: 'Airport pickup in Dubai is coordinated after the student shares confirmed flight details with VIBE Education.',
    },
    {
      step: 10,
      title: 'Orientation & Emirates ID',
      description: 'After arriving in Dubai, the student attends orientation and completes mandatory biometric and Emirates ID procedures.',
    },
  ],
  visaRejectionRefundPolicy:
    'According to the Partnership Agreement provided by VIBE Education, 60% of the visa fee is refundable if a visa application is rejected. The applicable refund procedure, eligibility, required documents, and processing timeline must be confirmed directly with VIBE Education before payment. Refund eligibility is subject to the official agreement and applicable VIBE Education policies.',
  tuitionRefundPolicyNotice:
    'Official website: https://www.vibeedu.com/refund-policy. The official website contains a tuition withdrawal refund schedule. However, the applicable policy may differ depending on the programme and student category. Students must review the applicable official refund policy and obtain written confirmation from VIBE Education before making payment. Please confirm the applicable tuition fee refund terms with VIBE Education before making payment.',
  paymentTerms:
    'Tuition fee is payable after the visa/entry permit is issued, according to the information provided by VIBE Education. The exact tuition amount payable must be confirmed in the official offer letter or fee invoice. Any additional compulsory charges must be confirmed by VIBE Education before the student commits to the programme. Submitting an enquiry does not constitute an admission or fee commitment.',
  accommodationNotice:
    'Accommodation assistance may be available through third-party providers. Availability, monthly rent, deposits, and booking conditions must be confirmed directly before booking.',
  airportPickupNotice:
    'Airport pickup can be coordinated after the student\'s flight details are shared with VIBE Education. Please confirm whether any additional charge applies.',
  careerSupportDisclaimer:
    'VIBE Education may provide CV support, interview preparation, spoken English support, and referrals to employment opportunities. However, employment, internships, and job placements are not guaranteed. Outcomes depend on student eligibility, performance, available opportunities, employer decisions, and applicable regulations.',
  institutionNatureNotice:
    'VIBE Education provides vocational training and diploma programmes. It is not itself a university. University progression depends on the receiving university\'s admission and credit-transfer requirements.',
  subjectToConfirmationNotice:
    'Course details, eligibility, fees, and admission are subject to confirmation by VIBE Education.',
  officialLinks: [
    { label: 'VIBE Education Official Website', url: 'https://www.vibeedu.com/' },
    { label: 'VIBE Education Diploma Catalogue', url: 'https://www.vibeedu.com/diploma/' },
    { label: 'VIBE Education Official FAQ', url: 'https://www.vibeedu.com/faq' },
    { label: 'VIBE Education Refund Policy', url: 'https://www.vibeedu.com/refund-policy' },
    { label: 'VIBE Education Admission Guide', url: 'https://www.vibeedu.com/admission-guide' },
  ],
  termsAndConditionsList: [
    'Course information, entry criteria, and eligibility are subject to confirmation by VIBE Education.',
    'Programme tuition fees must be confirmed in the official offer letter or fee invoice issued by the institution.',
    'The visa fee communicated by VIBE Education is USD 1,500, subject to current confirmation and official invoicing.',
    'Estimated visa entry permit processing time is 3–7 working days, subject to government authority procedures and approvals.',
    'The overall admission process may take approximately 2–3 weeks if all documentation, interviews, and payments proceed as planned.',
    'Tuition fees are payable after the visa/entry permit is issued, according to VIBE Education\'s stated admission workflow.',
    'The Partnership Agreement mentions a 60% visa fee refund if the visa application is rejected by immigration authorities.',
    'Tuition fee withdrawal refunds are governed by the applicable official VIBE Education refund policy published at vibeedu.com/refund-policy.',
    'Visa approval, institutional admission, internships, employment, and job placements are not guaranteed by Athmanathan Study Abroad or VIBE Education.',
    'Accommodation and airport pickup costs, deposits, and availability must be confirmed directly before booking travel.',
    'University progression, advanced standing, and degree admission depend entirely on the receiving university\'s credit-transfer rules.',
    'Students must carefully read the official agreement, offer letter, fee invoice, and refund terms before transferring any funds.',
    'Athmanathan Study Abroad provides enquiry, student counselling, and admission guidance as an authorized education partner; final admission, visa processing, and course delivery decisions remain with the relevant institution and government authorities.',
  ],
};

export const VIBE_COURSES: VibeCourse[] = [
  // ==========================================
  // LEVEL 3 — FOUNDATION PROGRAMMES
  // ==========================================
  {
    id: 'vibe-l3-accounting',
    title: 'Accounting and Business / Accountancy',
    code: 'OTHM L3-ACC',
    level: 'Level 3 Foundation',
    levelCategory: 'level3',
    overview:
      'The Level 3 Foundation Diploma in Accountancy / Accounting and Business provides learners with foundational knowledge and practical understanding in financial recording, business calculation, and introductory commerce management. Ideal for students beginning their international business education.',
    availableTracks: [
      {
        id: 'regular',
        name: 'Regular Foundation Track',
        duration: '6 Months',
        feeLabel: 'USD 4,750',
        totalFeeUsd: 4750,
        feeNote: 'Single level fee as confirmed in the VIBE Education Academics PDF and Partnership Agreement.',
        description: 'Accelerated 6-month foundation pathway preparing students for Level 4 Higher Diplomas.',
      },
    ],
    defaultTrackId: 'regular',
    credits: 60,
    creditsNote: 'The official VIBE Education website lists a 6-month duration and 60 credits for its Accountancy foundation course.',
    studyMode: 'Full-time On-Campus (Dubai, UAE)',
    assessmentMethod: 'Assignment & coursework-based assessment (no written examination papers).',
    awardingBody: 'OTHM Qualifications (UK regulated awarding organisation approved and regulated by Ofqual)',
    qualificationTitle: 'OTHM Level 3 Foundation Diploma in Accountancy / Accounting and Business',
    entryRequirements: 'Open entry from age 16. Candidates should demonstrate basic English language comprehension (competency requirements may apply upon interview).',
    progressionOpportunities:
      'Direct progression to Level 4 Diploma in Accounting and Business or Level 4 Business Management in Dubai, or equivalent international study.',
    intakes: ['January', 'April', 'July', 'October (Rolling Intakes)'],
    discrepancyNote: 'Website lists 6 months and 60 credits for Accountancy foundation; Academics PDF references Level 3 foundation. Official website credit structure prioritized.',
  },
  {
    id: 'vibe-l3-business-mgmt',
    title: 'Business Management',
    code: 'OTHM L3-BM',
    level: 'Level 3 Foundation',
    levelCategory: 'level3',
    overview:
      'The Level 3 Foundation Diploma in Business Management introduces fundamental concepts of modern enterprises, marketing essentials, human resources, organizational communication, and customer relations.',
    availableTracks: [
      {
        id: 'regular',
        name: 'Regular Track',
        duration: '12 Months',
        feeLabel: 'USD 4,750',
        totalFeeUsd: 4750,
        feeNote: 'Confirmed fee for Level 3 Foundation in official agreement.',
        description: 'Comprehensive 12-month foundational grounding in international commerce.',
      },
    ],
    defaultTrackId: 'regular',
    credits: 120,
    creditsNote: 'The official VIBE Education website lists 12 months and 120 credits for this foundation qualification.',
    studyMode: 'Full-time On-Campus (Dubai, UAE)',
    assessmentMethod: 'Practical assignments, real-world case studies, and business portfolios.',
    awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
    qualificationTitle: 'OTHM Level 3 Foundation Diploma in Business Management',
    entryRequirements: 'Open entry from age 16. English language competency requirements may apply as evaluated during initial counselling.',
    progressionOpportunities:
      'Guaranteed progression pathway to OTHM Level 4 & 5 Diploma in Business Management in Dubai or bachelor degree pathways.',
    intakes: ['January', 'April', 'July', 'October (Rolling Intakes)'],
  },
  {
    id: 'vibe-l3-it',
    title: 'Information Technology',
    code: 'OTHM L3-IT',
    level: 'Level 3 Foundation',
    levelCategory: 'level3',
    overview:
      'The Level 3 Foundation Diploma in Information Technology equips students with core digital literacy, hardware architecture principles, software introduction, web basics, and fundamental computational logic.',
    availableTracks: [
      {
        id: 'regular',
        name: 'Regular Track',
        duration: '12 Months',
        feeLabel: 'USD 4,750',
        totalFeeUsd: 4750,
        feeNote: 'Confirmed Level 3 fee in VIBE Education official agreement.',
        description: '12-month foundational technology curriculum designed for aspiring IT professionals.',
      },
    ],
    defaultTrackId: 'regular',
    credits: 60,
    creditsNote: 'The official website lists 12 months and 60 credits. (Some academic references note varying structures; subject to confirmation with VIBE Education).',
    studyMode: 'Full-time On-Campus (Dubai, UAE)',
    assessmentMethod: 'Project assignments, laboratory tasks, and computing practicals.',
    awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
    qualificationTitle: 'OTHM Level 3 Foundation Diploma in Information Technology',
    entryRequirements: 'Open entry from age 16. Basic numeracy, digital curiosity, and English language competence.',
    progressionOpportunities:
      'Progression to Level 4 & 5 Diploma in Information Technology or international technology degree pathways.',
    intakes: ['January', 'April', 'July', 'October (Rolling Intakes)'],
    discrepancyNote: 'Website lists 60 credits while certain academic outlines reference 120 credits. Flagged for final confirmation with VIBE Education upon offer.',
  },

  // ==========================================
  // LEVEL 4 & 5 — DIPLOMA PROGRAMMES
  // ==========================================
  {
    id: 'vibe-l45-accounting',
    title: 'Accounting and Business',
    code: 'OTHM L4-5-ACC',
    level: 'Level 4 & 5 Diploma',
    levelCategory: 'level45',
    overview:
      'A comprehensive two-tier British-regulated diploma covering financial accounting, management reporting, taxation principles, business law, auditing, and corporate finance. Equivalent to Year 1 and Year 2 of a UK bachelor\'s degree.',
    availableTracks: [
      {
        id: 'regular',
        name: 'Regular Track (24 Months)',
        duration: '24 Months (12 mos Level 4 + 12 mos Level 5)',
        feeLabel: 'USD 4,750 × 2 levels',
        totalFeeUsd: 9500,
        feeNote: 'USD 4,750 per level (Total: USD 9,500 across 2 academic levels).',
        description: 'Standard pace spanning 24 months across Level 4 and Level 5.',
      },
      {
        id: 'fast_track',
        name: 'Fast Track (12 Months)',
        duration: '12 Months Intensive',
        feeLabel: 'USD 6,050',
        totalFeeUsd: 6050,
        feeNote: 'Consolidated one-year Fast Track tuition fee as per Partnership Agreement.',
        description: 'Intensive 12-month accelerated track completing both Level 4 & 5 qualifications.',
      },
    ],
    defaultTrackId: 'regular',
    credits: 240,
    creditsNote: '240 credits total (120 credits at Level 4 + 120 credits at Level 5).',
    studyMode: 'Full-time On-Campus (Dubai, UAE)',
    assessmentMethod: 'Continuous coursework, business balance sheet analysis, and case assignments.',
    awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
    qualificationTitle: 'OTHM Level 4 & Level 5 Extended Diploma in Accounting and Business',
    entryRequirements:
      'Relevant Level 3 qualification, high school diploma / 10+2, or equivalent academic background. Minimum age 18. English competency required.',
    progressionOpportunities:
      'Direct progression to Level 6 Bachelor\'s Degree final year (Top-Up) in UK, European, Australian, or UAE-based partner universities.',
    intakes: ['January', 'April', 'July', 'October'],
  },
  {
    id: 'vibe-l45-business-mgmt',
    title: 'Business Management',
    code: 'OTHM L4-5-BM',
    level: 'Level 4 & 5 Diploma',
    levelCategory: 'level45',
    overview:
      'Covers corporate governance, strategic marketing, organizational behavior, financial resource allocation, business operations, and leadership. Prepares graduates for executive business roles or university top-up degrees.',
    availableTracks: [
      {
        id: 'regular',
        name: 'Regular Track (24 Months)',
        duration: '24 Months (12 mos Level 4 + 12 mos Level 5)',
        feeLabel: 'USD 4,750 × 2 levels',
        totalFeeUsd: 9500,
        feeNote: 'USD 4,750 per level (Total: USD 9,500 across 2 academic levels).',
        description: 'Paced two-year immersion in international corporate management.',
      },
      {
        id: 'fast_track',
        name: 'Fast Track (12 Months)',
        duration: '12 Months Intensive',
        feeLabel: 'USD 6,050',
        totalFeeUsd: 6050,
        feeNote: 'Consolidated one-year Fast Track tuition fee as stated in official partner agreement.',
        description: 'Accelerated 1-year pathway through Level 4 and Level 5 curricula.',
      },
    ],
    defaultTrackId: 'regular',
    credits: 240,
    creditsNote: '240 credits total (120 credits at Level 4 + 120 credits at Level 5).',
    studyMode: 'Full-time On-Campus (Dubai, UAE)',
    assessmentMethod: 'Business plan development, diagnostic presentations, and analytical reports.',
    awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
    qualificationTitle: 'OTHM Level 4 & Level 5 Extended Diploma in Business Management',
    entryRequirements:
      'Relevant Level 3 qualification or equivalent high school certification (10+2). Minimum age 18. English language competence.',
    progressionOpportunities:
      'Entry into Level 6 (Final Year BA Hons Top-up) at leading universities worldwide, or direct junior management careers.',
    intakes: ['January', 'April', 'July', 'October'],
  },
  {
    id: 'vibe-l45-it',
    title: 'Information Technology',
    code: 'OTHM L4-5-IT',
    level: 'Level 4 & 5 Diploma',
    levelCategory: 'level45',
    overview:
      'Deep dive into software engineering foundations, database management, network administration, cybersecurity awareness, web architecture, and emerging digital innovations in Dubai\'s tech ecosystem.',
    availableTracks: [
      {
        id: 'regular',
        name: 'Regular Track (24 Months)',
        duration: '24 Months (Level 4 & 5)',
        feeLabel: 'USD 4,750 × 2 levels',
        totalFeeUsd: 9500,
        feeNote: 'USD 4,750 per level (Total: USD 9,500 across 2 academic levels).',
        description: 'Standard 24-month progression through core computing disciplines.',
      },
      {
        id: 'fast_track',
        name: 'Fast Track (12 Months)',
        duration: '12 Months Intensive',
        feeLabel: 'USD 6,050',
        totalFeeUsd: 6050,
        feeNote: 'Consolidated one-year Fast Track fee as per Partnership Agreement.',
        description: 'Intensive 12-month program for dedicated students seeking rapid qualification.',
      },
    ],
    defaultTrackId: 'regular',
    credits: 240,
    creditsNote: '240 credits total (120 credits Level 4 + 120 credits Level 5).',
    studyMode: 'Full-time On-Campus (Dubai, UAE)',
    assessmentMethod: 'Software code review, system design documentation, and technical assignments.',
    awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
    qualificationTitle: 'OTHM Level 4 & Level 5 Extended Diploma in Information Technology',
    entryRequirements:
      'Relevant Level 3 qualification in IT / Science / Business or equivalent 10+2 with IT background. Minimum age 18. English competency.',
    progressionOpportunities:
      'Progression to BSc (Hons) in Computing / IT Top-Up final year at UK and international partner universities.',
    intakes: ['January', 'April', 'July', 'October'],
  },
  {
    id: 'vibe-l45-tourism-hospitality',
    title: 'Tourism and Hospitality Management',
    code: 'OTHM L4-5-THM',
    level: 'Level 4 & 5 Diploma',
    levelCategory: 'level45',
    overview:
      'Designed to leverage Dubai\'s status as the world\'s leading luxury hospitality hub. Covers front office management, international resort operations, food and beverage systems, event design, and sustainable tourism.',
    availableTracks: [
      {
        id: 'regular',
        name: 'Regular Track (24 Months)',
        duration: '24 Months (12 mos Level 4 + 12 mos Level 5)',
        feeLabel: 'USD 4,750 × 2 levels',
        totalFeeUsd: 9500,
        feeNote: 'USD 4,750 per level (Total: USD 9,500 across 2 academic levels).',
        description: 'Comprehensive 2-year study of global tourism operations and hospitality standards.',
      },
      {
        id: 'fast_track',
        name: 'Fast Track (12 Months)',
        duration: '12 Months Intensive',
        feeLabel: 'USD 6,050',
        totalFeeUsd: 6050,
        feeNote: 'Consolidated one-year Fast Track fee as per official partner terms.',
        description: 'Accelerated 1-year diploma for students pursuing swift entry into the hospitality sector.',
      },
    ],
    defaultTrackId: 'regular',
    credits: 240,
    creditsNote: '240 credits total (120 credits at Level 4 + 120 credits at Level 5).',
    studyMode: 'Full-time On-Campus (Dubai, UAE)',
    assessmentMethod: 'Operational case studies, guest service audits, and strategic event proposals.',
    awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
    qualificationTitle: 'OTHM Level 4 & Level 5 Extended Diploma in Tourism and Hospitality Management',
    entryRequirements:
      'Level 3 qualification or equivalent 10+2 secondary education. Minimum age 18. Interest in global hospitality and customer service.',
    progressionOpportunities:
      'Top-up into BA (Hons) International Hospitality / Tourism Management final year, or direct entry into Dubai\'s hospitality market.',
    intakes: ['January', 'April', 'July', 'October'],
  },
  {
    id: 'vibe-l45-health-social-care',
    title: 'Health and Social Care Management',
    code: 'OTHM L4-5-HSCM',
    level: 'Level 4 & 5 Diploma',
    levelCategory: 'level45',
    overview:
      'Focuses on healthcare leadership, health policy analysis, clinical facility management, ethical care standards, human resource management in healthcare, and health safety regulations.',
    availableTracks: [
      {
        id: 'regular',
        name: 'Regular Track (24 Months)',
        duration: '24 Months (12 mos Level 4 + 12 mos Level 5)',
        feeLabel: 'USD 4,750 × 2 levels',
        totalFeeUsd: 9500,
        feeNote: 'USD 4,750 per level (Total: USD 9,500 across 2 academic levels).',
        description: 'Paced two-year management pathway for health sector professionals.',
      },
      {
        id: 'fast_track',
        name: 'Fast Track (12 Months)',
        duration: '12 Months Intensive',
        feeLabel: 'USD 6,050',
        totalFeeUsd: 6050,
        feeNote: 'Consolidated one-year Fast Track fee as stated in Partnership Agreement.',
        description: 'Fast-track 1-year progression covering both Level 4 & 5 modules.',
      },
    ],
    defaultTrackId: 'regular',
    credits: 240,
    creditsNote: '240 credits total (120 credits Level 4 + 120 credits Level 5).',
    studyMode: 'Full-time On-Campus (Dubai, UAE)',
    assessmentMethod: 'Healthcare management audits, ethical case portfolios, and policy critique papers.',
    awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
    qualificationTitle: 'OTHM Level 4 & Level 5 Extended Diploma in Health and Social Care Management',
    entryRequirements:
      'Level 3 qualification or equivalent 10+2 academic background. Minimum age 18. Interest in health services administration.',
    progressionOpportunities:
      'BSc (Hons) Health & Social Care Management Top-Up final year at UK / international universities, or clinic administration roles.',
    intakes: ['January', 'April', 'July', 'October'],
  },

  // ==========================================
  // LEVEL 5 PROGRAMMES
  // ==========================================
  {
    id: 'vibe-l5-education-training',
    title: 'Education and Training',
    code: 'OTHM L5-ET',
    level: 'Level 5 Diploma',
    levelCategory: 'level5',
    overview:
      'Prepares teachers, corporate instructors, and educational administrators with pedagogical skills, curriculum design techniques, modern instructional media, and learner assessment methodologies.',
    availableTracks: [
      {
        id: 'regular',
        name: 'Regular Track (12 Months)',
        duration: '12 Months',
        feeLabel: 'USD 4,750',
        totalFeeUsd: 4750,
        feeNote: 'Confirmed fee for Level 5 Education and Training as listed in official agreement.',
        description: '12-month professional teacher education and training qualification.',
      },
    ],
    defaultTrackId: 'regular',
    credits: 120,
    creditsNote: '120 credits total as confirmed in official curriculum guide.',
    studyMode: 'Full-time On-Campus (Dubai, UAE)',
    assessmentMethod: 'Micro-teaching portfolios, curriculum design projects, and pedagogical reflective journals.',
    awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
    qualificationTitle: 'OTHM Level 5 Diploma in Education and Training',
    entryRequirements:
      'Relevant Level 4 diploma, teaching experience, or equivalent educational background. Minimum age 19. English language proficiency.',
    progressionOpportunities:
      'Progression to BA (Hons) in Education final year top-up, or educational training appointments in UAE / international schools.',
    intakes: ['January', 'April', 'July', 'October'],
  },
  {
    id: 'vibe-l5-psychology',
    title: 'Psychology',
    code: 'OTHM L5-PSY',
    level: 'Level 5 Diploma',
    levelCategory: 'level5',
    overview:
      'Explores cognitive psychology, developmental behavior, social dynamics, research methods, and psychological assessment. Note: Offered strictly as a Fast Track intensive pathway as confirmed in the official VIBE Education Academics catalogue.',
    availableTracks: [
      {
        id: 'fast_track',
        name: 'Fast Track Only (12 Months)',
        duration: '12 Months Intensive (Fast Track Only)',
        feeLabel: 'USD 6,050',
        totalFeeUsd: 6050,
        feeNote: 'USD 6,050 — Offered strictly in Fast Track mode as listed in the supplied Academics PDF.',
        description: 'Intensive 1-year fast-track psychology curriculum covering 240 credits of diploma study.',
      },
    ],
    defaultTrackId: 'fast_track',
    credits: 240,
    creditsNote: '240 credits total; Fast Track only, as shown in the official catalogue and Academics PDF.',
    studyMode: 'Full-time On-Campus (Dubai, UAE)',
    assessmentMethod: 'Empirical research critiques, psychological case analyses, and experimental reporting.',
    awardingBody: 'OTHM Qualifications (UK Ofqual Regulated)',
    qualificationTitle: 'OTHM Level 5 Diploma in Psychology (Fast Track Progression)',
    entryRequirements:
      'Relevant Level 3 qualification or equivalent high school certification (10+2). Minimum age 18. Verified academic background in humanities, science, or general studies with strong English ability.',
    progressionOpportunities:
      'Progression to final year BSc (Hons) Psychology top-up degrees at accredited partner universities worldwide.',
    intakes: ['January', 'April', 'July', 'October'],
    discrepancyNote: 'Regular track is not offered for Psychology. Strictly Fast Track only (USD 6,050) as stipulated in source materials.',
  },

  // ==========================================
  // LEVEL 6 — UNIVERSITY PROGRESSION
  // ==========================================
  {
    id: 'vibe-l6-university-progression',
    title: 'University Progression / Bachelor\'s Degree Pathway',
    code: 'VIBE-L6-PATH',
    level: 'Level 6 University Progression',
    levelCategory: 'level6',
    overview:
      'After completing Level 5 diplomas at VIBE Education Dubai, students can smoothly articulate into the final year (Level 6 / Top-Up) of a recognized Bachelor\'s degree. Delivered in partnership with UK and global universities, either on-campus in Dubai, in the UK, or via accredited blended learning.',
    availableTracks: [
      {
        id: 'progression',
        name: 'University Degree Top-Up Pathway',
        duration: '1 to 2 Years (depends on chosen university)',
        feeLabel: 'Starting from USD 5,000',
        totalFeeUsd: null,
        feeNote: 'Starting from USD 5,000. The final fee depends on the selected university and programme.',
        description: 'Final year Bachelor\'s degree completion resulting in an internationally accredited undergraduate degree.',
      },
    ],
    defaultTrackId: 'progression',
    credits: 120,
    creditsNote: '120 credits for the final Top-Up year, completing the 360-credit UK Honours degree requirement.',
    studyMode: 'Full-time / Blended (Dubai campus, UK campus, or Partner University)',
    assessmentMethod: 'Dissertation, capstone project, and advanced academic assignments.',
    awardingBody: 'Partner Universities (UK / Europe / UAE accredited institutions)',
    qualificationTitle: 'Bachelor of Arts (BA Hons) / Bachelor of Science (BSc Hons) Degree',
    entryRequirements:
      'Successful completion of Level 5 Diploma (240 credits) or equivalent higher diploma from recognized awarding body; meeting English language proficiency standards of the chosen university.',
    progressionOpportunities:
      'Postgraduate Masters degrees (MBA, MSc, MA) or professional executive placement globally.',
    intakes: ['September / October', 'January / February (University-dependent)'],
    discrepancyNote: 'Final tuition fee and duration depend on the receiving university selected by the student.',
  },
];
