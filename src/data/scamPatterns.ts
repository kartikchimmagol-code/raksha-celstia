export interface ScamTemplate {
  id: string;
  title: string;
  category: string;
  sampleText: string;
  typicalVerdict: 'DANGEROUS' | 'SUSPICIOUS';
  explanation: string;
}

export const SCAM_TEMPLATES: ScamTemplate[] = [
  {
    id: 'scam-bescom-cesc',
    title: 'CESC Mysuru / BESCOM Power Cutoff SMS',
    category: 'Utility Phishing',
    sampleText: 'Dear Consumer, Your electricity power supply will be disconnected tonight at 9:30 PM from CESC Mysuru office because your previous month bill was not updated. Please immediately contact our electricity officer Rahul Sharma at 9876543210 or update through http://cesc-bill-update.apk to avoid power cut.',
    typicalVerdict: 'DANGEROUS',
    explanation: 'CESC/BESCOM never sends disconnection SMS asking consumers to call personal phone numbers or download APK files. Legitimate bills are paid only via KarnatakaOne or the official CESC portal.',
  },
  {
    id: 'scam-sbi-kyc',
    title: 'SBI / Bank Account Suspension KYC Phishing',
    category: 'Banking / APK Trojan',
    sampleText: 'SBI Alert: Your YONO account has been blocked due to unverified PAN card KYC. Click here immediately to update your Aadhaar and avoid permanent card blockage: https://sbi-kyc-verify-portal.net/update.apk',
    typicalVerdict: 'DANGEROUS',
    explanation: 'Banks never ask you to install APK files or click unverified links. Official SBI domains end strictly with ".sbi" or "onlinesbi.sbi".',
  },
  {
    id: 'scam-telegram-task',
    title: 'Part-Time Rating / YouTube Prepayment Task',
    category: 'Investment Fraud',
    sampleText: 'Congratulations! You have been selected for Part-Time Remote Job with Google Reviews & Hotel Ratings. Earn Rs. 3,500 - 8,000 daily from home. No experience needed. Join our Telegram manager @EarnDailyHR immediately to claim your Rs. 500 joining bonus.',
    typicalVerdict: 'DANGEROUS',
    explanation: 'Classic advance-fee task scam. Victims are given small initial payouts then coerced into depositing large sums ("crypto or trading balance") which can never be withdrawn.',
  },
  {
    id: 'scam-digital-arrest',
    title: 'FedEx / Mumbai Police Digital Arrest Notice',
    category: 'Impersonation Extortion',
    sampleText: 'URGENT: A parcel sent in your name containing 5 passports and illegal contraband was intercepted at Mumbai Airport Customs. A non-bailable warrant has been issued. Connect via Skype with CBI Officer immediately for Digital Verification to avoid physical arrest.',
    typicalVerdict: 'DANGEROUS',
    explanation: 'Indian Law Enforcement never conducts "Digital Arrests" or demands bail money / fund verification over Skype or WhatsApp video calls. Report immediately to 1930.',
  },
];
