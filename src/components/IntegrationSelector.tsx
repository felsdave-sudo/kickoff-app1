import { 
  CreditCard, 
  Share2, 
  Cloud, 
  Mail, 
  BarChart3, 
  MapPin, 
  Database, 
  MessageSquareCode, 
  Check,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IntegrationSelectorProps {
  selectedCategories: string[];
  specificSocialMediaPlatforms: string;
  integrationDetails?: Record<string, string>;
  onToggleCategory: (category: string) => void;
  onSocialMediaChange: (text: string) => void;
  onDetailsChange?: (category: string, text: string) => void;
}

export interface IntegrationCategory {
  name: string;
  description: string;
  iconName: string;
}

const INTEGRATION_INPUTS: Record<string, {
  label: string;
  description: string;
  placeholder: string;
  icon: string;
}> = {
  "Payment Gateways": {
    label: "Specify Payment Gateway Details",
    description: "Type the payment processors, merchant accounts, or gatekeeper portals (e.g. Stripe, PayPal, Authorize.Net, Tyler Payments, automated billing systems).",
    placeholder: "e.g. Stripe integration for community pool registrations, custom merchant ID for utility billing autopay.",
    icon: "CreditCard",
  },
  "Social Media Platforms": {
    label: "Specify Social Media Platforms",
    description: "Type the social media networks to be integrated or archived (e.g. Facebook Page API, Instagram, X/Twitter, LinkedIn, YouTube).",
    placeholder: "e.g. City Facebook Official Feed, Police Department Twitter/X feed, Municipal LinkedIn Page.",
    icon: "Share2",
  },
  "Cloud Storage and File Management": {
    label: "Specify Cloud Storage & File Management Details",
    description: "Type the target directories, bucket paths, or cloud drives (e.g. Google Drive folders, OneDrive folders, Amazon S3 Buckets, Azure Blob).",
    placeholder: "e.g. Upload agenda packets directly to municipal Google Drive folder, archive FOIA attachments in AWS S3 buckets.",
    icon: "Cloud",
  },
  "Email Marketing and Automation": {
    label: "Specify Email Marketing & Newsletters Details",
    description: "Type the marketing services or email list providers (e.g. Mailchimp, Constant Contact, ActiveCampaign, HubSpot).",
    placeholder: "e.g. Synchronize active subscriber lists with Mailchimp for automated emergency advisory newsletter dispatches.",
    icon: "Mail",
  },
  "Web Analytics and Monitoring": {
    label: "Specify Web Analytics & Monitoring Details",
    description: "Type the tracking IDs, service endpoints, or monitoring tools (e.g. Google Analytics G-ID, Hotjar, Pingdom, Sentry, Datadog).",
    placeholder: "e.g. Google Analytics 4 (GA4) configuration for city portal, setup Pingdom real-time uptime monitoring alerts.",
    icon: "BarChart3",
  },
  "Mapping and Location Services": {
    label: "Specify Mapping & GIS Details",
    description: "Type the mapping libraries, GIS layers, or geocoding services (e.g. Google Maps JavaScript API, ESRI ArcGIS servers, Mapbox, OpenStreetMap).",
    placeholder: "e.g. Google Maps API for community park location map, import parcel layers from ESRI ArcGIS Server for planning.",
    icon: "MapPin",
  },
  "Enterprise Resource Planning (ERP)": {
    label: "Specify ERP Systems Details",
    description: "Type the administrative databases, payroll logs, or inventory registries (e.g. Tyler Technologies ERP, SAP, Oracle Cloud, Workday, Salesforce).",
    placeholder: "e.g. Sync utility billing transactions with Tyler Technologies Munis ERP ledger, map customer accounts.",
    icon: "Database",
  },
  "Communication and Messaging": {
    label: "Specify Communication & Notification Channels",
    description: "Type the messaging services, webhook targets, or phone/SMS APIs (e.g. Twilio SMS, Slack webhooks, MS Teams channels, SendGrid).",
    placeholder: "e.g. Twilio API credentials for mass SMS alerts, post citizen feedback alerts to public-safety-leads Slack channel.",
    icon: "MessageSquareCode",
  },
};

const INTEGRATION_CATEGORIES: IntegrationCategory[] = [
  {
    name: "Payment Gateways",
    description: "Credit card processing, digital wallets, automatic recurring invoice portals.",
    iconName: "CreditCard",
  },
  {
    name: "Social Media Platforms",
    description: "Publishing feeds, single-sign-on (SSO), page metadata sync, and feeds archiving.",
    iconName: "Share2",
  },
  {
    name: "Cloud Storage and File Management",
    description: "Google Drive, Microsoft OneDrive, Amazon S3 bucket archiving and attachments storage.",
    iconName: "Cloud",
  },
  {
    name: "Email Marketing and Automation",
    description: "Campaign dispatch, citizen newsletters, automatic subscriber list synchronization.",
    iconName: "Mail",
  },
  {
    name: "Web Analytics and Monitoring",
    description: "Google Analytics, Hotjar, uptime monitoring, performance telemetry tracks.",
    iconName: "BarChart3",
  },
  {
    name: "Mapping and Location Services",
    description: "Google Maps Platform integration, ESRI ArcGIS maps, geographic parcel visuals.",
    iconName: "MapPin",
  },
  {
    name: "Enterprise Resource Planning (ERP)",
    description: "Core accounting ledgers, internal city payroll databases, vendor records syncing.",
    iconName: "Database",
  },
  {
    name: "Communication and Messaging",
    description: "Slack webhooks, Microsoft Teams chats, automated Twilio SMS triggers.",
    iconName: "MessageSquareCode",
  },
];

const IconMap: Record<string, React.ComponentType<any>> = {
  CreditCard,
  Share2,
  Cloud,
  Mail,
  BarChart3,
  MapPin,
  Database,
  MessageSquareCode,
};

export default function IntegrationSelector({
  selectedCategories,
  specificSocialMediaPlatforms,
  integrationDetails,
  onToggleCategory,
  onSocialMediaChange,
  onDetailsChange,
}: IntegrationSelectorProps) {
  return (
    <div className="space-y-5" id="integration-selector-container">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          3rd Party Integration Categories
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Select which pre-configured API integration categories are scoped for this implementation project.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" id="integration-categories-grid">
        {INTEGRATION_CATEGORIES.map((cat) => {
          const isSelected = selectedCategories.includes(cat.name);
          const IconComponent = IconMap[cat.iconName] || Cloud;

          return (
            <motion.div
              key={cat.name}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onToggleCategory(cat.name)}
              className={`relative flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer transition-all shadow-xs ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600/30"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
              }`}
              id={`integration-category-${cat.name.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    <IconComponent className="h-3.5 w-3.5" />
                  </div>
                  <div className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                    isSelected 
                      ? "border-indigo-600 bg-indigo-600 text-white" 
                      : "border-slate-300 bg-white"
                  }`}>
                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  {cat.name}
                </h4>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Conditional Detail Text Areas for each selected category */}
      <div className="space-y-4 pt-2">
        <AnimatePresence>
          {selectedCategories.map((catName) => {
            const config = INTEGRATION_INPUTS[catName];
            if (!config) return null;
            
            const IconComponent = IconMap[config.icon] || Cloud;
            const currentValue = catName === "Social Media Platforms" 
              ? (integrationDetails?.[catName] || specificSocialMediaPlatforms || "")
              : (integrationDetails?.[catName] || "");

            return (
              <motion.div
                key={catName}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl bg-indigo-50/30 border border-indigo-100/60 p-4 space-y-2 shadow-xs">
                  <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                    <IconComponent className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
                    <span>{config.label}</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    {config.description}
                  </p>
                  <textarea
                    rows={2}
                    value={currentValue}
                    onChange={(e) => {
                      const text = e.target.value;
                      if (onDetailsChange) {
                        onDetailsChange(catName, text);
                      }
                      if (catName === "Social Media Platforms") {
                        onSocialMediaChange(text);
                      }
                    }}
                    placeholder={config.placeholder}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
                    id={`input-specific-${catName.replace(/\s+/g, "-").toLowerCase()}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
