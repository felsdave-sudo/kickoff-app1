import { FolderGit2, History, Layers } from "lucide-react";

interface HeaderProps {
  activeTab: "intake" | "history";
  setActiveTab: (tab: "intake" | "history") => void;
  historyCount: number;
}

export default function Header({ activeTab, setActiveTab, historyCount }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-xs" id="app-header">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-100">
              <FolderGit2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                PM Launchpad
              </h1>
              <p className="text-xs text-slate-500 font-medium sm:block hidden">
                Project Intake & Tailored Kick-off Generator
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-2" aria-label="Tabs" id="main-navigation">
            <button
              onClick={() => setActiveTab("intake")}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-all ${
                activeTab === "intake"
                  ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-700/10"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              id="tab-intake"
            >
              <Layers className="h-4 w-4" />
              <span>Intake Form</span>
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-all relative ${
                activeTab === "history"
                  ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-700/10"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              id="tab-history"
            >
              <History className="h-4 w-4" />
              <span>History</span>
              {historyCount > 0 && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  {historyCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
