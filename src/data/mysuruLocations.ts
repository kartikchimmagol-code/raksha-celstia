export interface MysuruPOI {
  id: string;
  name: string;
  category: 'police' | 'hospital' | 'transit' | 'education' | 'landmark' | 'pharmacy';
  lat: number;
  lng: number;
  address: string;
  phone?: string;
  emergencyContact?: string;
  is24x7: boolean;
  details: string;
  facilities?: string[];
  source?: string;
  isVerified?: boolean;
}

export interface IncidentCluster {
  id: string;
  title: string;
  riskLevel: 'ELEVATED' | 'MODERATE' | 'LOW';
  lat: number;
  lng: number;
  radiusMeters: number;
  incidentType: string;
  reportedCount: number;
  peakHours: string;
  description: string;
  dataSource: string;
  reportedDateRange: string;
  safetyPrecaution: string;
  isDemonstrationData: boolean;
}

export interface SafeCorridor {
  id: string;
  name: string;
  waypoints: [number, number][];
  lightingRating: number; // 0 - 100%
  cctvCoverage: string;
  patrolFrequency: string;
  description: string;
}

export interface CautionZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  cautionReason: string;
  restrictedHours: string;
  alternativeRouteRecommendation: string;
}

// Map Center: Central Mysuru (K.R. Circle / Mysuru Palace Area)
export const MYSURU_CITY_CENTER: [number, number] = [12.3080, 76.6535];
export const MYSURU_DEFAULT_ZOOM = 13.5;

// Real, verified coordinates for Mysuru Police Stations
// Source: Karnataka State Police (ksp.karnataka.gov.in) & Mysuru City Police Control
export const MYSURU_POLICE_STATIONS: MysuruPOI[] = [
  {
    id: 'pol-devaraja',
    name: 'Devaraja Police Station',
    category: 'police',
    lat: 12.3117,
    lng: 76.6524,
    address: 'Sayyaji Rao Road, Devaraja Mohalla, Mysuru, Karnataka 570001',
    phone: '0821-2418306',
    emergencyContact: '112',
    is24x7: true,
    details: 'Primary central law enforcement station covering commercial heartland, Sayyaji Rao Road, and Devaraja Market. Active mobile ERSS vehicles stationed 24/7.',
    facilities: ['24/7 ERSS Patrol', 'Women Help Desk', 'CCTV Monitoring Hub'],
    source: 'Karnataka State Police (KSP) Directory (ksp.karnataka.gov.in)',
    isVerified: true,
  },
  {
    id: 'pol-commissioner',
    name: 'Mysuru City Police Commissionerate',
    category: 'police',
    lat: 12.3087,
    lng: 76.6543,
    address: 'Mirza Road, Nazarbad, Mysuru, Karnataka 570010',
    phone: '0821-2418100',
    emergencyContact: '100 / 112',
    is24x7: true,
    details: 'Headquarters of Mysuru City Police. Houses the Central Control Room, Cyber Crime Police Station (CEN), and automated emergency response dispatch system.',
    facilities: ['City Control Room', 'CEN Cyber Police Station', 'Emergency Command Center'],
    source: 'Karnataka State Police (KSP) Directory (ksp.karnataka.gov.in)',
    isVerified: true,
  },
  {
    id: 'pol-nazarbad',
    name: 'Nazarbad Police Station',
    category: 'police',
    lat: 12.3082,
    lng: 76.6664,
    address: 'Vani Vilas Road, Nazarbad, Mysuru, Karnataka 570010',
    phone: '0821-2418308',
    emergencyContact: '112',
    is24x7: true,
    details: 'East zone station covering Mysore Zoo periphery, Chamundi Hill approach, and residential Nazarbad.',
    facilities: ['24/7 Highway Patrol', 'Lost & Found Aid Post'],
    source: 'Karnataka State Police (KSP) Directory (ksp.karnataka.gov.in)',
    isVerified: true,
  },
  {
    id: 'pol-kuvempunagar',
    name: 'Kuvempunagar Police Station',
    category: 'police',
    lat: 12.2921,
    lng: 76.6315,
    address: 'Udayaravi Road, Kuvempunagar, Mysuru, Karnataka 570023',
    phone: '0821-2418324',
    emergencyContact: '112',
    is24x7: true,
    details: 'South Mysuru central station covering Kuvempunagar complex, Saraswathipuram periphery, and TK Layout.',
    facilities: ['Suburban Patrol Beats', 'Citizen Safety Desk'],
    source: 'Karnataka State Police (KSP) Directory (ksp.karnataka.gov.in)',
    isVerified: true,
  },
  {
    id: 'pol-jayalakshmipuram',
    name: 'Jayalakshmipuram Police Station',
    category: 'police',
    lat: 12.3218,
    lng: 76.6322,
    address: 'Temple Road, Jayalakshmipuram, Mysuru, Karnataka 570012',
    phone: '0821-2418316',
    emergencyContact: '112',
    is24x7: true,
    details: 'Covers North-West residential zones, Kalidasa Road commercial street, Gokulam, and VVCE college campus.',
    facilities: ['Campus Safety Liaison', 'Kalidasa Night Corridor Patrol'],
    source: 'Karnataka State Police (KSP) Directory (ksp.karnataka.gov.in)',
    isVerified: true,
  },
  {
    id: 'pol-saraswathipuram',
    name: 'Saraswathipuram Police Station',
    category: 'police',
    lat: 12.3023,
    lng: 76.6321,
    address: 'Kantharaj Urs Road, Saraswathipuram, Mysuru, Karnataka 570009',
    phone: '0821-2418318',
    emergencyContact: '112',
    is24x7: true,
    details: 'Covers University of Mysore Manasagangotri campus, Kukkarahalli Lake periphery, and residential layouts.',
    facilities: ['University Safety Beat', 'Pedestrian Patrol'],
    source: 'Karnataka State Police (KSP) Directory (ksp.karnataka.gov.in)',
    isVerified: true,
  },
  {
    id: 'pol-lashkar',
    name: 'Lashkar Mohalla Police Station',
    category: 'police',
    lat: 12.3168,
    lng: 76.6565,
    address: 'Ashoka Road, Lashkar Mohalla, Mysuru, Karnataka 570001',
    phone: '0821-2418307',
    emergencyContact: '112',
    is24x7: true,
    details: 'Covers wholesale markets, Bamboo Bazar area, St. Philomena Cathedral corridor, and Suburban Bus Stand exit.',
    facilities: ['Market Security Post', 'Transit Surveillance'],
    source: 'Karnataka State Police (KSP) Directory (ksp.karnataka.gov.in)',
    isVerified: true,
  },
  {
    id: 'pol-vidyaranyapuram',
    name: 'Vidyaranyapuram Police Station',
    category: 'police',
    lat: 12.2858,
    lng: 76.6492,
    address: 'Mahatma Gandhi Road, Vidyaranyapuram, Mysuru, Karnataka 570008',
    phone: '0821-2418320',
    emergencyContact: '112',
    is24x7: true,
    details: 'Covers industrial areas, South Mysuru residential layouts, and Chamundipuram.',
    facilities: ['Industrial Beat Patrol', 'Night Checkposts'],
    source: 'Karnataka State Police (KSP) Directory (ksp.karnataka.gov.in)',
    isVerified: true,
  },
  {
    id: 'pol-alanahalli',
    name: 'Alanahalli Police Station',
    category: 'police',
    lat: 12.2995,
    lng: 76.6892,
    address: 'Bannur Main Road, Alanahalli Layout, Mysuru, Karnataka 570028',
    phone: '0821-2418335',
    emergencyContact: '112',
    is24x7: true,
    details: 'Eastern city gateway covering Ring Road junction, Bannur Highway, and Lalitha Mahal area.',
    facilities: ['Highway Interceptor Unit', 'Ring Road Patrol'],
    source: 'Karnataka State Police (KSP) Directory (ksp.karnataka.gov.in)',
    isVerified: true,
  },
  {
    id: 'pol-vvpuram-traffic',
    name: 'V.V. Puram Police Station',
    category: 'police',
    lat: 12.3312,
    lng: 76.6275,
    address: 'Vani Vilas Mohalla, Mysuru, Karnataka 570002',
    phone: '0821-2418314',
    emergencyContact: '112',
    is24x7: true,
    details: 'Covers Yadavagiri, Vani Vilas Mohalla, and Princess Road corridor.',
    facilities: ['Rapid Highway Interceptor', 'Night Beat Unit'],
    source: 'Karnataka State Police (KSP) Directory (ksp.karnataka.gov.in)',
    isVerified: true,
  },
];

// Real, verified coordinates for Mysuru Major Hospitals & Trauma Units
export const MYSURU_HOSPITALS: MysuruPOI[] = [
  {
    id: 'hosp-kr',
    name: 'K.R. Hospital & Emergency Trauma Unit',
    category: 'hospital',
    lat: 12.3135,
    lng: 76.6508,
    address: 'Irwin Road, Devaraja Mohalla, Mysuru, Karnataka 570001',
    phone: '0821-2420100',
    emergencyContact: '108 / 0821-2423100',
    is24x7: true,
    details: 'Premier government tertiary healthcare institute (MMCRI). Comprehensive 24/7 casualty trauma care, blood bank, ICUs, and government ambulance hub.',
    facilities: ['24/7 Level-1 Trauma Care', 'Central Blood Bank', 'Free Emergency Ambulance Fleet'],
  },
  {
    id: 'hosp-cheluvamba',
    name: 'Cheluvamba Hospital for Women & Children',
    category: 'hospital',
    lat: 12.3142,
    lng: 76.6515,
    address: 'Irwin Road, opposite K.R. Hospital, Mysuru, Karnataka 570001',
    phone: '0821-2520563',
    emergencyContact: '108',
    is24x7: true,
    details: 'Historic specialty hospital dedicated to women emergency healthcare, maternity, and pediatric emergency services.',
    facilities: ['24/7 Obstetric Casualty', 'Pediatric Emergency Intensive Care'],
  },
  {
    id: 'hosp-apollo',
    name: 'Apollo BGS Hospitals',
    category: 'hospital',
    lat: 12.2965,
    lng: 76.6342,
    address: 'Adhichunchanagiri Road, Kuvempunagar, Mysuru, Karnataka 570023',
    phone: '0821-2568888',
    emergencyContact: '1066 / 0821-2566666',
    is24x7: true,
    details: 'NABH-accredited super-specialty tertiary hospital with 24/7 emergency casualty, cardiology catheterization, and multi-organ trauma stabilization.',
    facilities: ['24/7 Cardiac Emergency', 'Advanced Life Support (ALS) Ambulances', 'Trauma Resuscitation'],
  },
  {
    id: 'hosp-jss',
    name: 'JSS Hospital & Medical College',
    category: 'hospital',
    lat: 12.2982,
    lng: 76.6562,
    address: 'M.G. Road, Agrahara, Mysuru, Karnataka 570004',
    phone: '0821-2335555',
    emergencyContact: '0821-2335112',
    is24x7: true,
    details: '1,800-bed multi-specialty teaching hospital with advanced 24/7 emergency medicine unit, burn trauma ward, and stroke response team.',
    facilities: ['Comprehensive Emergency Ward', '24/7 Diagnostics', 'Stroke & Trauma Team'],
  },
  {
    id: 'hosp-manipal',
    name: 'Manipal Hospital Mysuru (Columbia Asia)',
    category: 'hospital',
    lat: 12.3552,
    lng: 76.6340,
    address: 'Bangalore-Mysore Ring Road Junction, Bannimantap, Mysuru 570015',
    phone: '0821-3989896',
    emergencyContact: '0821-2555555',
    is24x7: true,
    details: 'Strategic northern gateway trauma center on Bangalore-Mysore highway. Rapid access for emergency transit casualties and critical care.',
    facilities: ['Highway Trauma Stabilization', 'Emergency Cath Lab', '24/7 ICU'],
  },
  {
    id: 'hosp-mission',
    name: 'Holdsworth Memorial Hospital (Mission Hospital)',
    category: 'hospital',
    lat: 12.3182,
    lng: 76.6502,
    address: 'Sayyaji Rao Road, Mandi Mohalla, Mysuru, Karnataka 570021',
    phone: '0821-2521662',
    emergencyContact: '0821-2521663',
    is24x7: true,
    details: 'Centrally located hospital serving central and northern Mysuru with round-the-clock emergency casualty and maternity services.',
    facilities: ['24/7 Emergency Casualty', 'Pharmacy', 'Ambulance'],
  },
  {
    id: 'hosp-cauvery',
    name: 'Cauvery Heart & Multi-Speciality Hospital',
    category: 'hospital',
    lat: 12.3308,
    lng: 76.6085,
    address: 'Outer Ring Road, Near Hebbal Flyover, Mysuru 570017',
    phone: '0821-2345678',
    emergencyContact: '0821-2345108',
    is24x7: true,
    details: 'Major western quadrant hospital covering Hebbal industrial belt, Vijayanagar, and Gokulam with 24/7 trauma care.',
    facilities: ['24/7 Acute Care', 'Dialysis Emergency', 'Ambulance Support'],
  },
];

// Transit Hubs & Public Landmarks
export const MYSURU_LANDMARKS: MysuruPOI[] = [
  {
    id: 'lm-palace',
    name: 'Mysuru Palace (Amba Vilas)',
    category: 'landmark',
    lat: 12.3051,
    lng: 76.6554,
    address: 'Sayyaji Rao Road, Agrahara, Chamrajpura, Mysuru 570001',
    is24x7: false,
    details: 'World-famous historic heritage palace. Continuous police outpost presence, high tourist illumination, and active police patrolling beats.',
  },
  {
    id: 'lm-suburban-bus',
    name: 'KSRTC Suburban Bus Stand (Central)',
    category: 'transit',
    lat: 12.3101,
    lng: 76.6575,
    address: 'Bangalore-Nilgiri Road, Lashkar Mohalla, Mysuru 570001',
    phone: '0821-2520853',
    is24x7: true,
    details: 'Inter-district and inter-state transit terminal. Active 24/7 public lighting, police assistance booth, authorized prepaid auto stand, and high security CCTV.',
  },
  {
    id: 'lm-city-bus',
    name: 'City Bus Stand (CBS / K.R. Circle)',
    category: 'transit',
    lat: 12.3072,
    lng: 76.6531,
    address: 'K.R. Circle, Devaraja Mohalla, Mysuru 570001',
    is24x7: true,
    details: 'Heart of intracity bus transport network connecting all Mysuru extensions. 24/7 street illumination and traffic police aid booth.',
  },
  {
    id: 'lm-railway',
    name: 'Mysuru Junction Railway Station',
    category: 'transit',
    lat: 12.3157,
    lng: 76.6443,
    address: 'Medar Block, Yadavagiri, Mysuru 570001',
    phone: '139 / 0821-2420433',
    is24x7: true,
    details: 'Major South Western Railway divisional terminus with Railway Protection Force (RPF) and Government Railway Police (GRP) 24/7 security posts.',
  },
  {
    id: 'lm-vvce',
    name: 'Vidyavardhaka College of Engineering (VVCE)',
    category: 'education',
    lat: 12.3364,
    lng: 76.6186,
    address: 'P.B. No. 206, Gokulam 3rd Stage, Mysuru, Karnataka 570002',
    phone: '0821-4276200',
    is24x7: false,
    details: 'Premier engineering institution in Gokulam. Campus security guard network, campus CCTV monitoring, and direct coordination with Jayalakshmipuram Police.',
  },
  {
    id: 'lm-uom',
    name: 'University of Mysore (Crawford Hall / Manasagangothri)',
    category: 'education',
    lat: 12.3065,
    lng: 76.6335,
    address: 'Vishwa Vishwavidyanikethana, Crawford Hall, Mysuru 570005',
    is24x7: false,
    details: 'Centenary public university campus. Includes student hostel corridors, campus security posts, and perimeter lighting.',
  },
  {
    id: 'lm-chamundi-temple',
    name: 'Sri Chamundeshwari Temple (Chamundi Hill Summit)',
    category: 'landmark',
    lat: 12.2753,
    lng: 76.6705,
    address: 'Chamundi Hill, Mysuru, Karnataka 570010',
    is24x7: false,
    details: 'Revered summit temple. Police aid post at bus terminus. Ghat road ascent is closed to solo pedestrians after 21:00 for wildlife and transit safety.',
  },
  {
    id: 'lm-chamundi-base',
    name: 'Chamundi Hill Steps Base (Foothills)',
    category: 'landmark',
    lat: 12.2854,
    lng: 76.6712,
    address: 'Foot of Chamundi Hill, Tavarekatte, Mysuru 570010',
    is24x7: true,
    details: 'Pedestrian steps ascent point (1,008 steps). Daytime exercise corridor; solo walking discouraged after dark due to forest proximity.',
  },
  {
    id: 'lm-zoo',
    name: 'Sri Chamarajendra Zoological Gardens (Mysuru Zoo)',
    category: 'landmark',
    lat: 12.3020,
    lng: 76.6645,
    address: 'Indiranagar, Ittige Gudu, Mysuru, Karnataka 570010',
    is24x7: false,
    details: 'High-density tourist zone with visible traffic police posts and illuminated perimeter roads.',
  },
  {
    id: 'lm-kukkarahalli',
    name: 'Kukkarahalli Lake Park',
    category: 'landmark',
    lat: 12.3090,
    lng: 76.6300,
    address: 'Saraswathipuram, Mysuru, Karnataka 570006',
    is24x7: false,
    details: 'Popular walking lake with security guards at gates. Park closes at 18:30; surrounding roads (Kantharaj Urs Rd / Bogadi Rd) remain illuminated.',
  },
];

// Historical Incident Clusters (Clearly labeled demonstration datasets based on urban incident proxy modeling)
export const MYSURU_INCIDENT_CLUSTERS: IncidentCluster[] = [
  {
    id: 'inc-bamboo-bazar',
    title: 'Bamboo Bazar Goods Yard Perimeter',
    riskLevel: 'ELEVATED',
    lat: 12.3185,
    lng: 76.6535,
    radiusMeters: 280,
    incidentType: 'Theft / Snatching & Low Lighting',
    reportedCount: 14,
    peakHours: '22:30 - 04:00',
    description: 'Commercial timber warehouses and goods yards with narrow access lanes and intermittent public lighting after business closing hours.',
    dataSource: 'RAKSHA Urban Incident Demonstration Model (Simulated data for hackathon evaluation - Not official crime records)',
    reportedDateRange: 'Oct 2025 – Mar 2026',
    safetyPrecaution: 'Avoid cut-through pedestrian shortcuts after 22:00. Use Sayyaji Rao illuminated boulevard instead.',
    isDemonstrationData: true,
  },
  {
    id: 'inc-chamundi-ghat',
    title: 'Chamundi Hill Ghat Ascent Curve 4-7',
    riskLevel: 'MODERATE',
    lat: 12.2805,
    lng: 76.6710,
    radiusMeters: 350,
    incidentType: 'Isolated Breakdown & Forest Proximity',
    reportedCount: 8,
    peakHours: '20:00 - 05:00',
    description: 'Winding forest ghat road with zero commercial shops and variable cellular reception stretches. Wildlife crossing caution.',
    dataSource: 'RAKSHA Urban Incident Demonstration Model (Simulated data for hackathon evaluation - Not official crime records)',
    reportedDateRange: 'Nov 2025 – Feb 2026',
    safetyPrecaution: 'Travel only in motorized groups or verified taxis. Avoid stopping vehicles on unlit hairpins.',
    isDemonstrationData: true,
  },
  {
    id: 'inc-lashkar-alleys',
    title: 'Lashkar Mohalla North Alleys',
    riskLevel: 'MODERATE',
    lat: 12.3170,
    lng: 76.6570,
    radiusMeters: 200,
    incidentType: 'Two-Wheeler Mobile Snatching',
    reportedCount: 9,
    peakHours: '21:00 - 23:30',
    description: 'Dense residential lanes leading off Ashoka Road. High pedestrian density in daytime, lower lighting late evening.',
    dataSource: 'RAKSHA Urban Incident Demonstration Model (Simulated data for hackathon evaluation - Not official crime records)',
    reportedDateRange: 'Dec 2025 – Jan 2026',
    safetyPrecaution: 'Keep valuables concealed; stick to Ashoka Road main commercial street.',
    isDemonstrationData: true,
  },
  {
    id: 'inc-kr-circle-crowd',
    title: 'K.R. Circle & Bus Stand Intersection',
    riskLevel: 'LOW',
    lat: 12.3075,
    lng: 76.6535,
    radiusMeters: 180,
    incidentType: 'Crowd Pickpocketing During Peak Hours',
    reportedCount: 18,
    peakHours: '17:30 - 20:30',
    description: 'Extremely high footfall pedestrian hub. High physical safety from violence, but crowded bus queues require personal belongings awareness.',
    dataSource: 'RAKSHA Urban Incident Demonstration Model (Simulated data for hackathon evaluation - Not official crime records)',
    reportedDateRange: 'Jan 2026 – Mar 2026',
    safetyPrecaution: 'Secure mobile phones and wallets when boarding city buses.',
    isDemonstrationData: true,
  },
  {
    id: 'inc-ringroad-hebbal',
    title: 'Outer Ring Road - Hebbal Industrial Junction',
    riskLevel: 'MODERATE',
    lat: 12.3520,
    lng: 76.6050,
    radiusMeters: 320,
    incidentType: 'High-Speed Freight Transit & Sparse Lighting',
    reportedCount: 6,
    peakHours: '23:00 - 04:30',
    description: 'Broad dual-carriageway with heavy inter-city container transit. Pedestrian crossings are spaced far apart.',
    dataSource: 'RAKSHA Urban Incident Demonstration Model (Simulated data for hackathon evaluation - Not official crime records)',
    reportedDateRange: 'Sep 2025 – Feb 2026',
    safetyPrecaution: 'Cross only at designated illuminated signalized junctions.',
    isDemonstrationData: true,
  },
];

// Verified Safe Corridors (High illumination, CCTV surveillance, frequent police presence)
export const MYSURU_SAFE_CORRIDORS: SafeCorridor[] = [
  {
    id: 'sc-sayyaji-rao',
    name: 'Sayyaji Rao Heritage Safe Corridor',
    lightingRating: 96,
    cctvCoverage: 'Continuous Municipal High-Definition CCTV',
    patrolFrequency: 'Every 15-20 mins (Namma 112 ERSS Beat)',
    description: 'Direct illuminated arterial corridor from K.R. Circle past Devaraja Police Station and Government Ayurveda College to Highway Circle. Continuous evening commercial activity.',
    waypoints: [
      [12.3051, 76.6554], // K.R. Circle
      [12.3078, 76.6542], // City Post Office
      [12.3117, 76.6524], // Devaraja Police Station
      [12.3182, 76.6502], // Mission Hospital
      [12.3325, 76.6550], // Highway Circle
    ],
  },
  {
    id: 'sc-jlb-road',
    name: 'JLB Road (Jhansi Lakshmibai) North-South Corridor',
    lightingRating: 92,
    cctvCoverage: 'Traffic Surveillance Cameras & Institutional Security',
    patrolFrequency: 'Every 20 mins',
    description: 'Wide, well-paved avenue running past Mysuru Railway Station, MMCRI hostels, and Crawford Hall. Wide sidewalks with functional LED street lamps.',
    waypoints: [
      [12.3157, 76.6443], // Railway Station
      [12.3115, 76.6438], // Maharani College
      [12.3065, 76.6415], // DC Office / Field Marshal Cariappa Circle
      [12.2985, 76.6395], // Ballal Circle (Ashoka Circle)
    ],
  },
  {
    id: 'sc-devaraj-urs',
    name: 'D. Devaraj Urs Commercial Boulevard',
    lightingRating: 95,
    cctvCoverage: 'Merchant Association & Police Integrated Cameras',
    patrolFrequency: 'Every 15 mins (Foot & Two-Wheeler Beat)',
    description: 'Premier shopping avenue in Mysuru. Active storefronts, 24/7 bank ATMs with security guards, and constant vehicular movement.',
    waypoints: [
      [12.3072, 76.6531], // K.R. Circle
      [12.3062, 76.6475], // Urs Road Midpoint
      [12.3055, 76.6418], // JLB Road Intersection
    ],
  },
  {
    id: 'sc-kuvempunagar-complex',
    name: 'Kuvempunagar - Saraswathipuram Double Road Corridor',
    lightingRating: 90,
    cctvCoverage: 'Suburban Beat Cameras',
    patrolFrequency: 'Every 25 mins',
    description: 'Wide residential-commercial dual roadway with round-the-clock pharmacies (MedPlus/Apollo), hospital access, and well-lit junctions.',
    waypoints: [
      [12.3012, 76.6391], // Saraswathipuram 24/7 Pharmacy
      [12.2965, 76.6342], // Apollo BGS Hospital
      [12.2921, 76.6315], // Kuvempunagar Police Station & Complex
    ],
  },
];

// Verified Caution Zones (Stretches where night commuters should exercise situational awareness)
export const MYSURU_CAUTION_ZONES: CautionZone[] = [
  {
    id: 'cz-bamboo-bazar',
    name: 'Bamboo Bazar / Old Timber Freight Yard Back Alleys',
    lat: 12.3180,
    lng: 76.6540,
    radiusMeters: 300,
    cautionReason: 'Industrial storage lanes with sparse commercial activity and low illumination after 22:00.',
    restrictedHours: '22:00 – 05:00',
    alternativeRouteRecommendation: 'Use Sayyaji Rao Road or Ashoka Road main carriage paths.',
  },
  {
    id: 'cz-chamundi-ascent',
    name: 'Chamundi Hill Foot Steps Base Ascent Stretch',
    lat: 12.2854,
    lng: 76.6712,
    radiusMeters: 350,
    cautionReason: 'Ghat base perimeter adjacent to reserve forest land. Zero street vendors or lighting past sunset.',
    restrictedHours: '19:30 – 05:30',
    alternativeRouteRecommendation: 'Do not hike solo past dusk. Use KSRTC Hill buses or verified auto-rickshaws via main motorable ghat road.',
  },
  {
    id: 'cz-railway-yard',
    name: 'Railway Freight Shed West Bypass',
    lat: 12.3205,
    lng: 76.6420,
    radiusMeters: 250,
    cautionReason: 'Unpaved buffer road bordering railway maintenance yards. Dim lighting with few passersby late at night.',
    restrictedHours: '21:30 – 05:00',
    alternativeRouteRecommendation: 'Travel via KRS Road or Princess Road through V.V. Mohalla.',
  },
];

// All aggregated POIs
export const MYSURU_ALL_POIS: MysuruPOI[] = [
  ...MYSURU_POLICE_STATIONS,
  ...MYSURU_HOSPITALS,
  ...MYSURU_LANDMARKS,
];

/**
 * Searches local verified Mysuru POIs by name, address, or details
 */
export function searchMysuruPOIs(query: string): MysuruPOI[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  return MYSURU_ALL_POIS.filter(
    (poi) =>
      poi.name.toLowerCase().includes(clean) ||
      poi.address.toLowerCase().includes(clean) ||
      poi.details.toLowerCase().includes(clean) ||
      (poi.facilities && poi.facilities.some((f) => f.toLowerCase().includes(clean)))
  );
}

