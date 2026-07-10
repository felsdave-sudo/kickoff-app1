import { CommunicationPreferences } from "../types";
import { MessageSquare, CalendarClock, Eye, Sparkles } from "lucide-react";

interface CommunicationPreferencesFormProps {
  preferences: CommunicationPreferences;
  setPreferences: (prefs: CommunicationPreferences) => void;
}

const FREQUENCY_OPTIONS = [
  { value: "Daily", label: "Daily Digests", desc: "Short daily updates" },
  { value: "Weekly", label: "Weekly Progress", desc: "Comprehensive weekly reports" },
  { value: "Bi-weekly", label: "Bi-Weekly Syncs", desc: "Every two weeks milestones" },
  { value: "Monthly", label: "Monthly Reviews", desc: "High-level monthly summaries" },
];

const TONE_OPTIONS = [
  { value: "Professional and collaborative", label: "Collaborative & Warm", desc: "Friendly, supportive, and teamwork-focused" },
  { value: "Formal and structured", label: "Formal & Detailed", desc: "Highly structured, precise, and business-focused" },
  { value: "Direct and concise", label: "Direct & Concise", desc: "Short, bullet-oriented, action-focused" },
  { value: "Technical and technical-oriented", label: "Technical & Deep", desc: "Focused on specifications, APIs, and systems" },
];

const TIME_OPTIONS = [
  { value: "Morning (9 AM - 12 PM)", label: "Mornings", desc: "Ideal for AM alignment" },
  { value: "Afternoon (1 PM - 5 PM)", label: "Afternoons", desc: "PM reviews and wraps" },
  { value: "Flexible / As needed", label: "Flexible Hours", desc: "Based on calendar availability" },
];

const CHANNEL_OPTIONS = [
  { id: "Email", label: "Email Correspondence" },
  { id: "Slack", label: "Slack Channel / Chat" },
  { id: "Teams", label: "Microsoft Teams" },
  { id: "Video", label: "Video Meetings (Zoom/Meet)" },
  { id: "Phone", label: "Direct Phone Calls" },
];

export default function CommunicationPreferencesForm({
  preferences,
  setPreferences,
}: CommunicationPreferencesFormProps) {
  
  const handleFrequencySelect = (val: string) => {
    setPreferences({ ...preferences, frequency: val });
  };

  const handleToneSelect = (val: string) => {
    setPreferences({ ...preferences, tone: val });
  };

  const handleTimeSelect = (val: string) => {
    setPreferences({ ...preferences, timeOfDay: val });
  };

  const handleChannelToggle = (channelId: string) => {
    const channels = [...preferences.channels];
    if (channels.includes(channelId)) {
      setPreferences({
        ...preferences,
        channels: channels.filter((c) => c !== channelId),
      });
    } else {
      setPreferences({
        ...preferences,
        channels: [...channels, channelId],
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn" id="communication-preferences-container">
      {/* Title */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
          <span>Client Communication Blueprint</span>
        </h3>
        <p className="text-xs text-slate-500">
          Tailor how you interface with this client to automatically align the tone, sync frequency, and deliverables in your kick-off communication.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Sync Frequency Choice */}
        <div className="bg-slate-50/40 border border-slate-200/60 rounded-2xl p-5 space-y-3.5 shadow-xs hover:bg-slate-50/60 transition-colors" id="comm-sync-frequency">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Sync Frequency
          </label>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {FREQUENCY_OPTIONS.map((opt) => {
              const isSelected = preferences.frequency === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => handleFrequencySelect(opt.value)}
                  className={`border rounded-xl p-3 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <h4 className="text-xs font-bold text-slate-900 min-w-0 whitespace-normal break-normal">{opt.label}</h4>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-normal whitespace-normal break-normal">{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tone and Writing Style */}
        <div className="bg-slate-50/40 border border-slate-200/60 rounded-2xl p-5 space-y-3.5 shadow-xs hover:bg-slate-50/60 transition-colors" id="comm-tone-style">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Tone &amp; Style
          </label>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {TONE_OPTIONS.map((opt) => {
              const isSelected = preferences.tone === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => handleToneSelect(opt.value)}
                  className={`border rounded-xl p-3 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <h4 className="text-xs font-bold text-slate-900 min-w-0 whitespace-normal break-normal">{opt.label}</h4>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-normal whitespace-normal break-normal">{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channels Selector */}
        <div className="bg-slate-50/40 border border-slate-200/60 rounded-2xl p-5 space-y-3.5 shadow-xs hover:bg-slate-50/60 transition-colors" id="comm-preferred-channels">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Preferred Comm Channels
          </label>
          <div className="flex flex-wrap gap-2.5">
            {CHANNEL_OPTIONS.map((opt) => {
              const isSelected = preferences.channels.includes(opt.id);
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => handleChannelToggle(opt.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time of Day */}
        <div className="bg-slate-50/40 border border-slate-200/60 rounded-2xl p-5 space-y-3.5 shadow-xs hover:bg-slate-50/60 transition-colors" id="comm-meeting-slot">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Preferred Meeting Slot
          </label>
          <div className="flex flex-col gap-2.5">
            {TIME_OPTIONS.map((opt) => {
              const isSelected = preferences.timeOfDay === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => handleTimeSelect(opt.value)}
                  className={`border rounded-xl p-3 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-1.5 min-w-0">
                    <CalendarClock className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <h4 className="text-xs font-bold text-slate-900 leading-tight whitespace-normal break-normal flex-1 min-w-0">{opt.label}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-normal whitespace-normal break-normal">{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
