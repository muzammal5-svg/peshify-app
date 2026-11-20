export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "digitize-court-diary",
    title: "How Lawyers Can Digitize Their Court Hearing Diary",
    metaTitle: "How Lawyers Can Digitize Their Court Hearing Diary",
    metaDescription: "Learn step-by-step how advocates and law chambers can transition from paper diaries to a modern digital court hearing diary without losing crucial data.",
    excerpt: "Paper court registers are vulnerable to loss, water damage, and scheduling clashes. Discover how litigation chambers transition to digital daily cause lists effortlessly.",
    category: "Court Practice",
    readTime: "7 min read",
    publishedAt: "2024-11-15",
    author: {
      name: "Chamber Practice Editorial",
      role: "Litigation Advisory",
    },
  },
  {
    slug: "track-limitation-periods-deadlines",
    title: "How to Track Limitation Periods & Never Miss Deadlines",
    metaTitle: "How to Track Limitation Periods & Never Miss Deadlines",
    metaDescription: "A complete guide for litigation lawyers on calculating and tracking statutory limitation periods, civil revision deadlines, and appellate countdowns.",
    excerpt: "Statutory limitation is strictly enforced across civil and criminal courts. Here is how counsel can calculate deadlines, deduct Section 12 periods, and avoid dismissals.",
    category: "Legal Deadlines",
    readTime: "8 min read",
    publishedAt: "2024-11-16",
    author: {
      name: "Appellate Practice Group",
      role: "Litigation Advisory",
    },
  },
  {
    slug: "managing-law-chamber-accounts-ledger",
    title: "Best Practices for Managing Law Chamber Accounts & Fees",
    metaTitle: "Best Practices for Managing Law Chamber Accounts & Fees",
    metaDescription: "Master law chamber accounting: retainers, court expense disbursements, client ledgers, and associate fee distribution for growing law practices.",
    excerpt: "Stop mixing client retainers with personal cashflow. Learn how to maintain audit-proof chamber accounts, court fee stamp receipts, and transparent invoicing.",
    category: "Chamber Management",
    readTime: "8 min read",
    publishedAt: "2024-11-17",
    author: {
      name: "Chamber Practice Editorial",
      role: "Legal Practice Management",
    },
  },
  {
    slug: "why-lawyers-should-use-whatsapp-client-updates",
    title: "Why Lawyers Should Use WhatsApp for Client Case Updates",
    metaTitle: "Why Lawyers Should Use WhatsApp for Client Case Updates",
    metaDescription: "Discover how automated WhatsApp case alerts reduce repetitive client phone calls, improve client satisfaction, and safeguard professional boundaries.",
    excerpt: "Answering dozens of repetitive calls while arguing in court ruins concentration. Discover how 1-click WhatsApp hearing notices build client trust in seconds.",
    category: "Client Relations",
    readTime: "6 min read",
    publishedAt: "2024-11-18",
    author: {
      name: "Litigation Tech Advisory",
      role: "Legal Operations",
    },
  },
  {
    slug: "case-management-software-checklist-pakistan",
    title: "Case Management Software Checklist for Law Firms in Pakistan",
    metaTitle: "Case Management Software Checklist for Pakistani Law Firms",
    metaDescription: "Essential checklist for Pakistani advocates evaluating legal case management software: cause lists, High Court benches, limitation tracking & Urdu support.",
    excerpt: "Before purchasing legal software, verify that it handles Pakistani High Court cause lists, Section 12 limitation rules, multi-associate sync, and local workflows.",
    category: "Legal Tech",
    readTime: "9 min read",
    publishedAt: "2024-11-19",
    author: {
      name: "Legal Tech Evaluation Desk",
      role: "Bar Practice Standards",
    },
  },
];
