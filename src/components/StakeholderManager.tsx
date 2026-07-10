import { useState } from "react";
import { Stakeholder } from "../types";
import { Users, Plus, Trash2, Mail, Briefcase, Building } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StakeholderManagerProps {
  stakeholders: Stakeholder[];
  setStakeholders: (stakeholders: Stakeholder[]) => void;
}

const SUGGESTED_ROLES = [
  "Executive Sponsor",
  "Project Lead",
  "IT Administrator",
  "Billing Contact",
  "Subject Matter Expert (SME)",
];

const SUGGESTED_DEPTS = [
  "Administration",
  "Information Technology",
  "Finance / Clerk",
  "Parks & Recreation",
  "Communications",
];

export default function StakeholderManager({ stakeholders, setStakeholders }: StakeholderManagerProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleAddStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!name.trim()) {
      setValidationError("Stakeholder name is required.");
      return;
    }

    const newStakeholder: Stakeholder = {
      id: Date.now().toString(),
      name: name.trim(),
      role: role.trim() || "Stakeholder",
      email: email.trim(),
      department: department.trim() || "General",
      notes: notes.trim(),
    };

    setStakeholders([...stakeholders, newStakeholder]);

    // Reset form
    setName("");
    setRole("");
    setEmail("");
    setDepartment("");
    setNotes("");
  };

  const handleRemoveStakeholder = (id: string) => {
    setStakeholders(stakeholders.filter((s) => s.id !== id));
  };

  // Helper to get initials
  const getInitials = (nameStr: string) => {
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4" id="stakeholder-manager-container">
      <div>
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-600" />
          <span>Stakeholders &amp; Team Directory</span>
        </h3>
        <p className="text-xs text-slate-500">
          Identify client-side and internal stakeholders to tailor specific responsibilities and actions in the kick-off email.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Stakeholder Intake Form Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 lg:col-span-1">
          <h4 className="text-sm font-bold text-slate-800 mb-3">Add Stakeholder</h4>
          <form onSubmit={handleAddStakeholder} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena Rodriguez"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. IT Director"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              {/* Quick suggestions for role */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {SUGGESTED_ROLES.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                  >
                    {r.split(" ")[0] === "Subject" ? "SME" : r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. info@city.gov"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Administration"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {SUGGESTED_DEPTS.slice(0, 3).map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDepartment(d)}
                    className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-50"
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {validationError && (
              <p className="text-xs font-medium text-red-600">{validationError}</p>
            )}

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add to Directory</span>
            </button>
          </form>
        </div>

        {/* Stakeholder Directory List Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <h4 className="text-sm font-bold text-slate-800">Stakeholder Directory</h4>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-600/10">
                {stakeholders.length} Members
              </span>
            </div>

            {stakeholders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                <Users className="h-8 w-8 text-slate-300 stroke-[1.5]" />
                <p className="mt-2 text-sm font-medium text-slate-600">No stakeholders added yet</p>
                <p className="text-xs text-slate-400 max-w-[240px] mt-1">
                  Add some team members on the left to include them in the generated kick-off email.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 max-h-[320px] overflow-y-auto pr-1" id="stakeholder-list">
                <AnimatePresence>
                  {stakeholders.map((s) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-start justify-between rounded-lg border border-slate-200 bg-slate-50/30 p-3 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all group"
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Avatar */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                          {getInitials(s.name)}
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="text-xs font-bold text-slate-900 leading-tight">
                            {s.name}
                          </h5>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Briefcase className="h-3 w-3 shrink-0 text-slate-400" />
                            <span className="truncate max-w-[120px]">{s.role}</span>
                          </div>
                          {s.email && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                              <span className="truncate max-w-[120px]">{s.email}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Building className="h-3 w-3 shrink-0 text-slate-400" />
                            <span>{s.department}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveStakeholder(s.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                        title="Remove Stakeholder"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {stakeholders.length > 0 && (
            <p className="text-[10px] text-slate-400 mt-4 italic border-t border-slate-100 pt-2">
              Tip: The AI will integrate these names &amp; roles to personalize action items and greetings in the output.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
