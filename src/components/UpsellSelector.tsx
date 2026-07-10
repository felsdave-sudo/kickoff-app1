import { PREDEFINED_UPSELLS } from "../types";
import { 
  Globe, 
  MessageSquare, 
  GraduationCap, 
  Check,
  TrendingUp
} from "lucide-react";
import { motion } from "motion/react";

interface UpsellSelectorProps {
  selectedUpsells: string[];
  toggleUpsell: (upsellName: string) => void;
}

const IconMap: Record<string, React.ComponentType<any>> = {
  "Virtual Webmaster": Globe,
  "ChatBot": MessageSquare,
  "Additional Training": GraduationCap,
};

export default function UpsellSelector({ selectedUpsells, toggleUpsell }: UpsellSelectorProps) {
  return (
    <div className="space-y-4" id="upsell-selector-container">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span>Upsell Opportunities</span>
          </h3>
          <p className="text-xs text-slate-500">
            Select additional opportunities to present in a low-pressure manner to open doors for client conversations.
          </p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
          {selectedUpsells.length} selected
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3" id="upsell-grid">
        {PREDEFINED_UPSELLS.map((upsell) => {
          const isSelected = selectedUpsells.includes(upsell.name);
          const IconComponent = IconMap[upsell.name] || Globe;

          return (
            <motion.div
              key={upsell.name}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toggleUpsell(upsell.name)}
              className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all shadow-xs ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-600/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
              }`}
              id={`upsell-card-${upsell.name.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div className="space-y-3">
                {/* Header & Checkbox */}
                <div className="flex items-center justify-between">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                    isSelected 
                      ? "border-emerald-600 bg-emerald-600 text-white" 
                      : "border-slate-300 bg-white"
                  }`}>
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1">
                    {upsell.name}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {upsell.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
