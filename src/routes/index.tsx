import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/eduanalyze/Navbar";
import { DataInput, type DataState } from "@/components/eduanalyze/DataInput";
import { ResultsDashboard } from "@/components/eduanalyze/ResultsDashboard";
import { SettingsDialog } from "@/components/eduanalyze/SettingsDialog";
import { TutorialDialog } from "@/components/eduanalyze/TutorialDialog";
import { TheoryDialog } from "@/components/eduanalyze/TheoryDialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  analyze,
  defaultThresholds,
  type AnalysisResult,
  type Thresholds,
} from "@/lib/analysis";
import { toast } from "sonner";
import { BrainCircuit, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [data, setData] = useState<DataState>({ names: [], questions: [], matrix: [] });
  const [thresholds, setThresholds] = useState<Thresholds>(defaultThresholds);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [openTutorial, setOpenTutorial] = useState(false);
  const [openTheory, setOpenTheory] = useState(false);
  const [openResults, setOpenResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const runAnalysis = () => {
    if (data.names.length < 2 || data.questions.length < 2) {
      toast.error("Minimal 2 siswa dan 2 soal diperlukan");
      return;
    }
    const r = analyze(data.matrix, data.names, thresholds);
    setResult(r);
    toast.success("Analisis selesai");
    setOpenResults(true);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30 font-sans">
      <Navbar
        onOpenSettings={() => setOpenSettings(true)}
        onOpenTutorial={() => setOpenTutorial(true)}
        onOpenTheory={() => setOpenTheory(true)}
      />

      <TheoryDialog 
        open={openTheory} 
        onOpenChange={setOpenTheory} 
        thresholds={thresholds}
      />
      
      <SettingsDialog
        open={openSettings}
        onOpenChange={setOpenSettings}
        thresholds={thresholds}
        setThresholds={setThresholds}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
        <section className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Uji Instrumen Evaluasi
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              {" "}Pembelajaran
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 leading-relaxed font-medium">
            Analisis mudah dan akurat untuk butir soal pilihan ganda. Hitung tingkat kesukaran, daya pembeda, validitas, dan reliabilitas langsung di browser.
          </p>
        </section>

        <DataInput
          data={data}
          setData={setData}
          onAnalyze={runAnalysis}
          onOpenTutorial={() => setOpenTutorial(true)}
          hasResult={!!result}
          onOpenResults={() => setOpenResults(true)}
        />

        <Sheet open={openResults} onOpenChange={setOpenResults}>
          <SheetContent side="right" className="w-full !max-w-4xl overflow-y-auto sm:w-[95vw]">
            <SheetHeader className="pb-6 border-b border-slate-100">
              <SheetTitle className="flex items-center gap-2 text-2xl">
                <BrainCircuit className="h-6 w-6 text-purple-600" />
                Hasil Analisis Instrumen
              </SheetTitle>
              <SheetDescription>
                Analisis mendalam berdasarkan parameter yang telah ditentukan.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              {result && <ResultsDashboard result={result} />}
            </div>
          </SheetContent>
        </Sheet>

        <footer className="mt-20 border-t border-slate-200/50 pt-8 text-center text-xs text-slate-500/80">
          EduAnalyze · Semua perhitungan dilakukan secara lokal di perangkat Anda.
        </footer>
      </main>

      <TutorialDialog open={openTutorial} onOpenChange={setOpenTutorial} />
      <Toaster position="top-right" richColors />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-purple-100 opacity-75"></div>
        <div className="relative h-12 w-12 animate-bounce">
          <GraduationCap className="h-full w-full text-purple-600" />
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
          EduAnalyze
        </h2>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.3s]"></div>
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]"></div>
          <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-600"></div>
        </div>
      </div>
    </div>
  );
}