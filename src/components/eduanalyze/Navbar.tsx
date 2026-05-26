import { GraduationCap, Settings, BookOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar({
  onOpenSettings,
  onOpenTutorial,
  onOpenTheory,
}: {
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
  onOpenTheory: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100/50 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 shadow-lg shadow-purple-200/40">
            <GraduationCap className="h-5.5 w-5.5 text-white" />
          </div>
          <div className="leading-tight">
            <h1 className="text-[15px] font-semibold text-slate-900 sm:text-base tracking-tight">
              EduAnalyze
            </h1>
            <p className="hidden text-[12px] text-slate-500 font-medium sm:block">
              Analisis Butir Soal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenTheory}
            className="gap-2 text-slate-700 hover:text-purple-700 hover:bg-purple-50 font-medium"
          >
            <BookOpen className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">Teori</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenTutorial}
            className="gap-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100/60 font-medium"
          >
            <Info className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">Panduan</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="gap-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100/60 font-medium"
          >
            <Settings className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">Setelan</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
