export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  notes?: string;
}

export interface CommunicationPreferences {
  frequency: string;
  channels: string[];
  tone: string;
  timeOfDay: string;
}

export interface ProjectIntake {
  projectName: string;
  clientName: string;
  pmName: string;
  targetKickoffDate: string;
  selectedProducts: string[];
  selectedIntegrationCategories?: string[];
  specificSocialMediaPlatforms?: string;
  integrationDetails?: Record<string, string>;
  apiIntegrations: string;
  designPackage?: string;
  communicationPreferences: CommunicationPreferences;
  stakeholders: Stakeholder[];
  specialRequests: string;
  additionalNotes: string;
  selectedUpsells?: string[];
}

export interface GeneratedEmailRecord {
  id: string;
  timestamp: string;
  projectName: string;
  clientName: string;
  subject: string;
  body: string;
  keyMeetingAgenda: string[];
  clientToDos: string[];
  pmNotes: string;
  intakeData: ProjectIntake;
}

export interface PredefinedProduct {
  name: string;
  category: string;
  description: string;
  iconName: string;
}

export const PREDEFINED_PRODUCTS: PredefinedProduct[] = [
  {
    name: "Web Accessibility",
    category: "Compliance & Inclusion",
    description: "ADA and WCAG compliance scanning, ongoing remediation, and public reporting tools.",
    iconName: "Accessibility",
  },
  {
    name: "Recreation Management",
    category: "Community & Parks",
    description: "Activity registration, sports leagues, facility reservations, and membership management.",
    iconName: "Trees",
  },
  {
    name: "Mass Notification",
    category: "Safety & Emergency",
    description: "Multi-channel broadcast alerts (SMS, email, voice), geo-targeting, and internal team callouts.",
    iconName: "Megaphone",
  },
  {
    name: "Utility Billing",
    category: "Finance & Infrastructure",
    description: "Meter-to-cash billing engine, online customer account portals, and automated autopay.",
    iconName: "DollarSign",
  },
  {
    name: "Social Media Archiving",
    category: "Records Compliance",
    description: "Continuous compliant record-capture, indexing, and FOIA discovery of social accounts.",
    iconName: "Archive",
  },
  {
    name: "Next Request",
    category: "Transparency & FOIA",
    description: "Public records request portal, redaction workspace, and inter-departmental workflows.",
    iconName: "FileSpreadsheet",
  },
  {
    name: "Community Development",
    category: "Planning & Zoning",
    description: "Digital permitting, land use, plans reviews, inspections, and code enforcement workflows.",
    iconName: "Home",
  },
  {
    name: "Agenda & Meeting Management",
    category: "Governance",
    description: "Automated packet assembly, minute tracking, live voting integration, and civic streaming.",
    iconName: "CalendarDays",
  },
  {
    name: "Codification",
    category: "Legal & Publishing",
    description: "Legal analysis, ordinance codification, and hosting of searchable municipal databases.",
    iconName: "BookOpen",
  },
];

export interface PredefinedUpsell {
  name: string;
  description: string;
}

export const PREDEFINED_UPSELLS: PredefinedUpsell[] = [
  {
    name: "Virtual Webmaster",
    description: "This gives the client blocks of 10 hours a month to have us do website editing, posting, roadmapping, etc.",
  },
  {
    name: "ChatBot",
    description: "An interactive customer service ChatBot to save client staff time",
  },
  {
    name: "Additional Training",
    description: "3 hour blocks of website training to keep current and new staff empowered to use the website to the fullest.",
  },
];

