import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { 
  FolderGit2, 
  Layers, 
  History, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  RefreshCw, 
  Info, 
  AlertCircle,
  FileText,
  User,
  Calendar,
  Layers3,
  Plug,
  MessageSquare,
  Users,
  Plus,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  ClipboardCheck,
  Zap
} from "lucide-react";
import Header from "./components/Header";
import ProductSelector from "./components/ProductSelector";
import UpsellSelector from "./components/UpsellSelector";
import IntegrationSelector from "./components/IntegrationSelector";
import StakeholderManager from "./components/StakeholderManager";
import CommunicationPreferencesForm from "./components/CommunicationPreferencesForm";
import { ProjectIntake, GeneratedEmailRecord, Stakeholder, PREDEFINED_UPSELLS } from "./types";

const INITIAL_INTAKE: ProjectIntake = {
  projectName: "",
  clientName: "",
  pmName: "",
  targetKickoffDate: "",
  selectedProducts: [],
  selectedIntegrationCategories: [],
  specificSocialMediaPlatforms: "",
  integrationDetails: {},
  apiIntegrations: "",
  designPackage: "Standard",
  communicationPreferences: {
    frequency: "Weekly",
    channels: ["Email"],
    tone: "Professional and collaborative",
    timeOfDay: "Morning (9 AM - 12 PM)",
  },
  stakeholders: [],
  specialRequests: "",
  additionalNotes: "",
  selectedUpsells: [],
};

const SAMPLE_PROJECTS = [
  {
    projectName: "City of Oakridge Municipal Digitalization",
    clientName: "City of Oakridge, OR",
    pmName: "Dave Fels",
    targetKickoffDate: "2026-07-20",
    selectedProducts: ["Web Accessibility", "Next Request", "Agenda & Meeting Management"],
    selectedIntegrationCategories: ["Payment Gateways", "Enterprise Resource Planning (ERP)", "Social Media Platforms"],
    specificSocialMediaPlatforms: "City of Oakridge Facebook Page, Municipal Clerk YouTube Channel",
    integrationDetails: {
      "Payment Gateways": "Stripe for recreation registrations and building permit applications",
      "Enterprise Resource Planning (ERP)": "Tyler Technologies Munis ERP for general ledger updates",
      "Social Media Platforms": "City of Oakridge Facebook Page, Municipal Clerk YouTube Channel"
    },
    apiIntegrations: "Active Directory, Okta, Stripe for payments",
    designPackage: "Premium",
    communicationPreferences: {
      frequency: "Weekly",
      channels: ["Email", "Video"],
      tone: "Professional and collaborative",
      timeOfDay: "Morning (9 AM - 12 PM)",
    },
    stakeholders: [
      { id: "1", name: "Mayor Marcus Vance", role: "Executive Sponsor", email: "mvance@oakridge.gov", department: "Administration" },
      { id: "2", name: "Sarah Jenkins", role: "IT Director & Security Officer", email: "sjenkins@oakridge.gov", department: "Information Technology" },
      { id: "3", name: "Clerk Evelyn Reed", role: "Billing & Meeting Compliance", email: "ereed@oakridge.gov", department: "Finance" }
    ],
    specialRequests: "Client wants a strong focus on compliance, rapid training turnarounds, and automated FOIA tracking workflows.",
    additionalNotes: "Mayor is highly hands-on; we need to keep notifications concise and high-level, whereas Sarah needs deep technical integration details.",
    selectedUpsells: ["Virtual Webmaster", "Additional Training"],
  },
  {
    projectName: "Metro Utility Billing & Outreach Portal",
    clientName: "Metro Water District",
    pmName: "Dave Fels",
    targetKickoffDate: "2026-08-05",
    selectedProducts: ["Utility Billing", "Mass Notification", "Social Media Archiving"],
    selectedIntegrationCategories: ["Payment Gateways", "Social Media Platforms", "Communication and Messaging"],
    specificSocialMediaPlatforms: "Metro Water District Official Facebook Feed, LinkedIn Service Status Updates",
    integrationDetails: {
      "Payment Gateways": "Stripe for utility invoice processing",
      "Social Media Platforms": "Metro Water District Official Facebook Feed, LinkedIn Service Status Updates",
      "Communication and Messaging": "Twilio SMS gateway for automated leak notifications"
    },
    apiIntegrations: "Tyler Technologies ERP, Twilio, Facebook Graph API",
    designPackage: "Standard",
    communicationPreferences: {
      frequency: "Bi-weekly",
      channels: ["Slack", "Email"],
      tone: "Direct and concise",
      timeOfDay: "Afternoon (1 PM - 5 PM)",
    },
    stakeholders: [
      { id: "1", name: "Reginald Sterling", role: "General Manager", email: "rsterling@metrowater.org", department: "Executive" },
      { id: "2", name: "Tariq Mahmood", role: "Billing Lead", email: "tmahmood@metrowater.org", department: "Finance" }
    ],
    specialRequests: "Minimize client homework in the first 2 weeks. Highlight the ease of migration from legacy system.",
    additionalNotes: "Previous software vendor had security breaches. Reassure them of our SOC 2 Type II compliance and security best practices.",
    selectedUpsells: ["ChatBot"],
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"intake" | "history">("intake");
  const [intake, setIntake] = useState<ProjectIntake>(INITIAL_INTAKE);
  const [history, setHistory] = useState<GeneratedEmailRecord[]>([]);
  const [activeRecord, setActiveRecord] = useState<GeneratedEmailRecord | null>(null);
  
  // Status flags
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copiedState, setCopiedState] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load history & draft from LocalStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("pm_launchpad_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    const savedDraft = localStorage.getItem("pm_launchpad_draft");
    if (savedDraft) {
      try {
        setIntake(JSON.parse(savedDraft));
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []);

  // Save draft whenever intake form changes
  const saveDraft = (updatedIntake: ProjectIntake) => {
    localStorage.setItem("pm_launchpad_draft", JSON.stringify(updatedIntake));
    showNotification("Draft saved locally");
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 2500);
  };

  const handleInputChange = (field: keyof ProjectIntake, value: any) => {
    const updated = { ...intake, [field]: value };
    setIntake(updated);
    // Silent auto-save draft without annoying notifications
    localStorage.setItem("pm_launchpad_draft", JSON.stringify(updated));
  };

  const toggleProduct = (productName: string) => {
    const selected = [...intake.selectedProducts];
    if (selected.includes(productName)) {
      handleInputChange("selectedProducts", selected.filter((p) => p !== productName));
    } else {
      handleInputChange("selectedProducts", [...selected, productName]);
    }
  };

  const toggleIntegrationCategory = (categoryName: string) => {
    const selected = [...(intake.selectedIntegrationCategories || [])];
    if (selected.includes(categoryName)) {
      handleInputChange("selectedIntegrationCategories", selected.filter((c) => c !== categoryName));
    } else {
      handleInputChange("selectedIntegrationCategories", [...selected, categoryName]);
    }
  };

  const toggleUpsell = (upsellName: string) => {
    const selected = [...(intake.selectedUpsells || [])];
    if (selected.includes(upsellName)) {
      handleInputChange("selectedUpsells", selected.filter((u) => u !== upsellName));
    } else {
      handleInputChange("selectedUpsells", [...selected, upsellName]);
    }
  };

  const fillSample = (index: number) => {
    const sample = SAMPLE_PROJECTS[index];
    setIntake(sample);
    localStorage.setItem("pm_launchpad_draft", JSON.stringify(sample));
    showNotification(`Loaded demo: "${sample.projectName}"`);
  };

  const clearForm = () => {
    if (confirm("Are you sure you want to clear the entire form? Your local draft will be reset.")) {
      setIntake(INITIAL_INTAKE);
      localStorage.removeItem("pm_launchpad_draft");
      showNotification("Form reset successfully");
    }
  };

  const triggerGeneration = async () => {
    if (!intake.projectName.trim()) {
      setError("Please specify a Project Name.");
      return;
    }
    if (!intake.clientName.trim()) {
      setError("Please specify a Client Name.");
      return;
    }
    if (intake.selectedProducts.length === 0) {
      setError("Please select at least one Product/Module to implement.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationStep("Analyzing selected modules...");

    try {
      setTimeout(() => setGenerationStep("Integrating stakeholder communication styles..."), 1200);
      setTimeout(() => setGenerationStep("Drafting custom 3rd party API integration strategy..."), 2400);
      setTimeout(() => setGenerationStep("Gemini AI is crafting the email draft..."), 3600);

      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intake),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      let result;
      try {
        result = await response.json();
      } catch (err) {
        console.error("Failed to parse JSON response:", err);
        throw new Error("The server returned an invalid response (not JSON). Please try again or check server logs.");
      }

      const newRecord: GeneratedEmailRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        projectName: intake.projectName,
        clientName: intake.clientName,
        subject: result.subject,
        body: result.body,
        keyMeetingAgenda: result.keyMeetingAgenda || [],
        clientToDos: result.clientToDos || [],
        pmNotes: result.pmNotes || "",
        intakeData: JSON.parse(JSON.stringify(intake)),
      };

      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("pm_launchpad_history", JSON.stringify(updatedHistory));

      setActiveRecord(newRecord);
      showNotification("Email draft generated successfully!");
      
      // Smooth scroll to the generated email draft section below
      setTimeout(() => {
        const previewElement = document.getElementById("email-preview-section");
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedState(true);
      showNotification("Copied to clipboard!");
      setTimeout(() => setCopiedState(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const deleteHistoryRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this historical record?")) {
      const updated = history.filter((r) => r.id !== id);
      setHistory(updated);
      localStorage.setItem("pm_launchpad_history", JSON.stringify(updated));
      if (activeRecord?.id === id) {
        setActiveRecord(updated[0] || null);
      }
      showNotification("Record removed");
    }
  };

  const loadHistoryRecord = (record: GeneratedEmailRecord) => {
    setActiveRecord(record);
    setIntake(record.intakeData);
    setActiveTab("intake");
    showNotification(`Restored session: "${record.projectName}"`);
    
    // Smooth scroll to the restored email draft section
    setTimeout(() => {
      const previewElement = document.getElementById("email-preview-section");
      if (previewElement) {
        previewElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#fafbfe] font-sans antialiased text-slate-800" id="app-root-container">
      {/* Header component */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        historyCount={history.length} 
      />

      {/* Persistent Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-2xl flex items-center gap-2 border border-slate-700 animate-slideUp text-sm font-semibold">
          <Zap className="h-4 w-4 text-amber-400 animate-bounce" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Body Layout */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Dynamic Warning Alert */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 shadow-xs flex items-start gap-3" id="error-alert">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-800">Validation Error Encountered</h4>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-800 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-red-100 transition-all"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeTab === "intake" ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            
            {/* Input Forms */}
            <div className="space-y-6">
              
              {/* Demo Templates Quick Fill banner */}
              <div className="bg-white border border-indigo-100 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Want a fast preview?</h3>
                    <p className="text-xs text-slate-500">Load a prefilled complex municipal or utility sample with 1-click.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  <button
                    onClick={() => fillSample(0)}
                    className="px-2.5 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
                  >
                    Load Sample A (City)
                  </button>
                  <button
                    onClick={() => fillSample(1)}
                    className="px-2.5 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
                  >
                    Load Sample B (Utility)
                  </button>
                </div>
              </div>

              {/* Form Section 1: Basic Project Details */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <span>Project Setup Details</span>
                  </h3>
                  <button
                    onClick={clearForm}
                    className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 font-semibold hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Reset Form</span>
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Project Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={intake.projectName}
                        onChange={(e) => handleInputChange("projectName", e.target.value)}
                        placeholder="e.g. Missoula Website - Premium"
                        className="w-full rounded-lg border border-slate-300 bg-white pl-3 pr-10 py-2 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        id="input-project-name"
                      />
                      <FolderGit2 className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Municipality <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={intake.clientName}
                        onChange={(e) => handleInputChange("clientName", e.target.value)}
                        placeholder="e.g. City of Missoula"
                        className="w-full rounded-lg border border-slate-300 bg-white pl-3 pr-10 py-2 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        id="input-client-name"
                      />
                      <User className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Lead Project Manager
                    </label>
                    <input
                      type="text"
                      value={intake.pmName}
                      onChange={(e) => handleInputChange("pmName", e.target.value)}
                      placeholder="e.g. Norman Maclean"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      id="input-pm-name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Target Kick-off Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={intake.targetKickoffDate}
                        onChange={(e) => handleInputChange("targetKickoffDate", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white pl-3 pr-10 py-2 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        id="input-kickoff-date"
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Design Package
                    </label>
                    <div className="relative">
                      <select
                        value={intake.designPackage || "Standard"}
                        onChange={(e) => handleInputChange("designPackage", e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white pl-3 pr-10 py-2 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer font-medium"
                        id="input-design-package"
                      >
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                        <option value="Ultimate">Ultimate (Enterprise)</option>
                      </select>
                      <Layers className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                    
                    {/* Standard Implementation Timelines */}
                    <div className="mt-2 text-[11px] text-indigo-950 bg-indigo-50/40 border border-indigo-100/80 rounded-lg p-3 space-y-1 shadow-xs">
                      <span className="font-bold block uppercase tracking-wider text-[9px] text-indigo-900">Project Timeline Baseline:</span>
                      {(!intake.designPackage || intake.designPackage === "Standard") && (
                        <p className="leading-relaxed"><strong>8-10 weeks:</strong> Focuses on core configuration and basic training.</p>
                      )}
                      {intake.designPackage === "Premium" && (
                        <p className="leading-relaxed"><strong>12-16 weeks:</strong> Includes deep integrations, custom data mapping, and extended staff training.</p>
                      )}
                      {intake.designPackage === "Ultimate" && (
                        <p className="leading-relaxed"><strong>20–24 weeks:</strong> Includes full ERP integration, custom workflow development, and phased go-live support.</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Form Section 2: Product Selector (Interactive) */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <ProductSelector 
                  selectedProducts={intake.selectedProducts} 
                  toggleProduct={toggleProduct} 
                />
              </section>

              {/* Form Section 3: Integrations & Communication Prefs */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Plug className="h-5 w-5 text-indigo-600" />
                    <span>3rd Party API Integrations</span>
                  </h3>
                </div>

                <IntegrationSelector 
                  selectedCategories={intake.selectedIntegrationCategories || []}
                  specificSocialMediaPlatforms={intake.specificSocialMediaPlatforms || ""}
                  integrationDetails={intake.integrationDetails}
                  onToggleCategory={toggleIntegrationCategory}
                  onSocialMediaChange={(text) => handleInputChange("specificSocialMediaPlatforms", text)}
                  onDetailsChange={(category, text) => {
                    const updatedDetails = { ...(intake.integrationDetails || {}) };
                    updatedDetails[category] = text;
                    handleInputChange("integrationDetails", updatedDetails);
                  }}
                />

                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Legacy Systems & Other Integration Notes
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Specify legacy systems, authentication standards, or tools that must be connected (e.g. Active Directory, Okta SSO, Twilio, Salesforce, Payment Processors).
                  </p>
                  <textarea
                    rows={2}
                    value={intake.apiIntegrations}
                    onChange={(e) => handleInputChange("apiIntegrations", e.target.value)}
                    placeholder="e.g. Okta SAML SSO, Microsoft Active Directory synchronization, Custom legacy database sync."
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    id="input-api-integrations"
                  />
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <CommunicationPreferencesForm 
                    preferences={intake.communicationPreferences}
                    setPreferences={(prefs) => handleInputChange("communicationPreferences", prefs)}
                  />
                </div>
              </section>

              {/* Form Section 4: Stakeholder Manager (Dynamic Component) */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <StakeholderManager 
                  stakeholders={intake.stakeholders}
                  setStakeholders={(list) => handleInputChange("stakeholders", list)}
                />
              </section>

              {/* Form Section 5: Upsell Opportunities */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <UpsellSelector 
                  selectedUpsells={intake.selectedUpsells || []}
                  toggleUpsell={toggleUpsell}
                />
              </section>

              {/* Form Section 6: PM Strategic Notes & Custom Prompts */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Special Instructions &amp; Context</h3>
                  <p className="text-xs text-slate-500">Add client characteristics, specific compliance benchmarks, or unique requests to feed the generator.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Special Requests / Demands
                    </label>
                    <textarea
                      rows={3}
                      value={intake.specialRequests}
                      onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                      placeholder="e.g. Client requested no meetings on Fridays. They have a hard legal deadline by November 1st."
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Additional PM Notes / Off-Record Info
                    </label>
                    <textarea
                      rows={3}
                      value={intake.additionalNotes}
                      onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                      placeholder="e.g. The IT Lead is brand new. Be sure to explain complex database migration terms simply in the emails."
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={triggerGeneration}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-500 cursor-pointer ${
                      isGenerating ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Crafting email with Gemini AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Generate Custom Kick-off Email</span>
                      </>
                    )}
                  </button>
                </div>
              </section>
            </div>

            {/* Below: Output Preview Pane */}
            <div className="space-y-6 scroll-mt-24 border-t border-slate-200/60 pt-8" id="email-preview-section">
              
              {isGenerating ? (
                /* Beautiful Loading state with stepper indicators */
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-md min-h-[500px] flex flex-col justify-center items-center space-y-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                    <Sparkles className="h-6 w-6 text-indigo-600 absolute top-5 left-5 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 animate-pulse">Engaging Gemini 3.5 Flash</h3>
                  <div className="rounded-lg bg-slate-50 px-4 py-2 border border-slate-100 text-xs font-semibold text-slate-600 tracking-wide max-w-[300px]">
                    {generationStep}
                  </div>
                  <p className="text-xs text-slate-400 max-w-[280px]">
                    We are analyzing your inputs, configuring integrations, planning stakeholder assignments, and writing a clean Markdown email body.
                  </p>
                </div>
              ) : activeRecord ? (
                /* Actual Generated output styled in "Clean Minimalism" */
                <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col min-h-[500px]" id="email-preview-pane">
                  
                  {/* Banner Header */}
                  <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Tailored Draft Generated</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Ready for Project Launch</span>
                  </div>

                  {/* Core Email info */}
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider w-16 mt-0.5">Subject:</span>
                      <h4 className="text-sm font-bold text-slate-900 flex-1 leading-snug">{activeRecord.subject}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-slate-400 uppercase tracking-wider w-16">To:</span>
                      <span>
                        {activeRecord.intakeData.stakeholders.length > 0 
                          ? activeRecord.intakeData.stakeholders.map(s => `${s.name} (${s.role})`).join(", ") 
                          : `${activeRecord.clientName} Stakeholders`
                        }
                      </span>
                    </div>
                  </div>

                  {/* Multi-Tab Toggle view for Email Body vs. PM Strategy Guides */}
                  <div className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[550px] scrollbar-thin">
                    
                    {/* Primary Email Body Render */}
                    <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed" id="email-body-markdown">
                      <ReactMarkdown>{activeRecord.body}</ReactMarkdown>
                    </div>

                    {/* Key Agenda Grid block */}
                    {activeRecord.keyMeetingAgenda && activeRecord.keyMeetingAgenda.length > 0 && (
                      <div className="border-t border-slate-100 pt-5 space-y-2.5">
                        <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>Proposed Meeting Agenda</span>
                        </h4>
                        <ul className="grid gap-1.5 text-xs text-slate-600">
                          {activeRecord.keyMeetingAgenda.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-indigo-50/20 p-2.5 rounded-lg border border-indigo-100/30">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                                {idx + 1}
                              </span>
                              <span className="leading-tight mt-0.5">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Client Homework block */}
                    {activeRecord.clientToDos && activeRecord.clientToDos.length > 0 && (
                      <div className="border-t border-slate-100 pt-5 space-y-2.5">
                        <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4" />
                          <span>Immediate Client Actions Required</span>
                        </h4>
                        <ul className="grid gap-1.5 text-xs text-slate-600">
                          {activeRecord.clientToDos.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-amber-50/30 p-2.5 rounded-lg border border-amber-100/30">
                              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700 mt-0.5">
                                ✓
                              </span>
                              <span className="leading-tight">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* PM Advisory Field notes */}
                    {activeRecord.pmNotes && (
                      <div className="border-t border-slate-100 pt-5 p-4 rounded-xl bg-emerald-50/30 border border-emerald-100/50 space-y-1.5">
                        <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                          <Info className="h-4 w-4" />
                          <span>PM Advisor &amp; Delivery Tips</span>
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed">{activeRecord.pmNotes}</p>
                      </div>
                    )}

                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => copyToClipboard(`Subject: ${activeRecord.subject}\n\n${activeRecord.body}`)}
                      className="flex-1 py-3 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 shadow-md shadow-indigo-100 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {copiedState ? (
                        <>
                          <ClipboardCheck className="h-4 w-4" />
                          <span>Copied Email Body!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy Email &amp; Subject</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={triggerGeneration}
                      className="px-4 py-3 text-xs font-bold text-slate-700 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1"
                      title="Regenerate Draft with updated inputs"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Regen</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Unpopulated state */
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center flex flex-col justify-center items-center min-h-[500px] text-slate-500 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <FileText className="h-6 w-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Email Draft Sandbox</h4>
                    <p className="text-xs text-slate-500 max-w-[260px] mx-auto mt-1">
                      Complete the intake parameters on the left and click **"Generate Custom Kick-off Email"** to invoke Gemini.
                    </p>
                  </div>
                  <div className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase flex items-center gap-1 justify-center bg-indigo-50/50 px-3 py-1.5 rounded-lg border border-indigo-100/30">
                    <Sparkles className="h-3.5 w-3.5 animate-bounce" />
                    <span>Gemini 3.5 Powered</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          /* History tab */
          <div className="space-y-6 animate-fadeIn" id="history-container">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Historical Email Archive</h2>
                <p className="text-xs text-slate-500">View and reload previously configured project setups and their custom AI drafts.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                {history.length} records saved locally
              </span>
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white max-w-lg mx-auto">
                <History className="h-12 w-12 text-slate-300 stroke-[1.2] mb-3" />
                <h3 className="text-sm font-bold text-slate-900">Archive is currently empty</h3>
                <p className="text-xs text-slate-500 max-w-[280px] mt-1 mx-auto leading-normal">
                  Your generated emails are automatically archived in your browser cache. Fill the intake form and trigger generation to see them here!
                </p>
                <button
                  onClick={() => setActiveTab("intake")}
                  className="mt-4 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all cursor-pointer"
                >
                  Go to Intake Form
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {history.map((record) => (
                  <div
                    key={record.id}
                    onClick={() => loadHistoryRecord(record)}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      {/* Header block with date */}
                      <div className="flex items-center justify-between mb-3 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                        <span className="truncate max-w-[150px] text-indigo-600">{record.clientName}</span>
                        <span>{record.timestamp.split(",")[0]}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                        {record.projectName}
                      </h3>

                      {/* Products badge row */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {record.intakeData.selectedProducts.map((p) => (
                          <span key={p} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                            {p}
                          </span>
                        ))}
                      </div>

                      {/* Subject summary */}
                      <p className="text-xs text-slate-500 mt-3 line-clamp-2 italic leading-relaxed">
                        Subject: "{record.subject}"
                      </p>
                    </div>

                    {/* Footer buttons */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">
                        PM: {record.intakeData.pmName || "TBD"}
                      </span>
                      
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(`Subject: ${record.subject}\n\n${record.body}`);
                          }}
                          className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                          title="Copy email text"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => deleteHistoryRecord(record.id, e)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                          title="Delete historical entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Aesthetic minimalist footer in style with the Clean Minimalism design instructions */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-10" id="app-footer">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            PM Launchpad Internal Tooling
          </p>
          <p className="text-[11px] text-slate-400">
            Powered securely by the Google Gemini 3.5 API. All generated insights and templates are archived strictly client-side.
          </p>
        </div>
      </footer>
    </div>
  );
}
