import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Book, Target, CheckCircle, Activity, Settings2 } from "lucide-react";
import { Thresholds } from "@/lib/analysis";

export function TheoryDialog({ 
  open, 
  onOpenChange,
  thresholds 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  thresholds: Thresholds;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Book className="h-6 w-6 text-purple-600" />
            Landasan Teori & Parameter
          </DialogTitle>
          <DialogDescription>
            Memahami metrik psikometrik yang digunakan dalam analisis ini. Angka kategori di bawah disesuaikan dengan **Setelan** Anda saat ini.
          </DialogDescription>
        </DialogHeader>

        <Accordion type="single" collapsible className="w-full space-y-2 mt-4">
          <AccordionItem value="item-1" className="border rounded-xl px-4 bg-slate-50/50">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <Target className="h-5 w-5 text-indigo-600" />
                <div>
                  <div className="font-bold text-slate-800">Tingkat Kesukaran (P)</div>
                  <div className="text-xs text-slate-500 font-normal">Mengukur proporsi siswa yang menjawab benar (P = B/N).</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-slate-600 leading-relaxed pb-4 space-y-3">
              <p>Indeks ini menunjukkan seberapa sulit atau mudah suatu butir soal bagi kelompok peserta tes. Semakin mendekati 1.00, semakin mudah soal tersebut.</p>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Settings2 className="h-3 w-3" /> Parameter Aktif:
                </div>
                <ul className="space-y-1 text-xs">
                  <li><span className="inline-block w-24 font-semibold text-slate-600">Sukar:</span> P &lt; {thresholds.difficulty.sukar.toFixed(2)}</li>
                  <li><span className="inline-block w-24 font-semibold text-purple-600">Sedang:</span> {thresholds.difficulty.sukar.toFixed(2)} - {thresholds.difficulty.mudah.toFixed(2)}</li>
                  <li><span className="inline-block w-24 font-semibold text-emerald-600">Mudah:</span> P &gt; {thresholds.difficulty.mudah.toFixed(2)}</li>
                </ul>
              </div>
              <p className="text-xs text-slate-500 mt-2">Pendidikan pada umumnya menganggap soal "Sedang" sebagai soal yang paling baik untuk mengukur kemampuan siswa karena memberikan informasi paling banyak.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-xl px-4 bg-slate-50/50">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <Activity className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-bold text-slate-800">Daya Pembeda (DP)</div>
                  <div className="text-xs text-slate-500 font-normal">Kemampuan soal membedakan siswa pandai dan kurang pandai.</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-slate-600 leading-relaxed pb-4 space-y-3">
              <p>Dihitung dengan selisih proporsi benar kelompok atas (30% skor tertinggi) minus kelompok bawah (30% skor terendah). Nilai yang tinggi menunjukkan soal tersebut valid secara internal.</p>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Settings2 className="h-3 w-3" /> Parameter Aktif:
                </div>
                <ul className="space-y-1 text-xs">
                  <li><span className="inline-block w-24 font-semibold text-slate-600">Jelek:</span> DP &lt; {thresholds.discrimination.cukup.toFixed(2)}</li>
                  <li><span className="inline-block w-24 font-semibold text-purple-600">Cukup:</span> {thresholds.discrimination.cukup.toFixed(2)} - {thresholds.discrimination.baik.toFixed(2)}</li>
                  <li><span className="inline-block w-24 font-semibold text-emerald-600">Baik/Sgt Baik:</span> DP &gt; {thresholds.discrimination.baik.toFixed(2)}</li>
                </ul>
              </div>
              <p className="text-xs text-slate-500">Soal dengan DP rendah atau negatif menunjukkan kemungkinan kunci jawaban salah atau kalimat soal membingungkan siswa pintar.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-xl px-4 bg-slate-50/50">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <div>
                  <div className="font-bold text-slate-800">Validitas (r-pbis)</div>
                  <div className="text-xs text-slate-500 font-normal">Korelasi skor butir soal dengan skor total peserta.</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-slate-600 leading-relaxed pb-4 space-y-3">
              <p>Menggunakan korelasi <i>Point Biserial</i>. Menunjukkan apakah siswa yang menjawab benar pada soal ini cenderung memiliki skor total yang tinggi (konsistensi internal).</p>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Settings2 className="h-3 w-3" /> Parameter Aktif:
                </div>
                <ul className="space-y-1 text-xs">
                  <li><span className="inline-block w-24 font-semibold text-slate-600">Tidak Valid:</span> r &lt; {thresholds.validity.tidak.toFixed(2)}</li>
                  <li><span className="inline-block w-24 font-semibold text-purple-600">Cukup Valid:</span> {thresholds.validity.tidak.toFixed(2)} - {thresholds.validity.valid.toFixed(2)}</li>
                  <li><span className="inline-block w-24 font-semibold text-emerald-600">Valid:</span> r &gt; {thresholds.validity.valid.toFixed(2)}</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-xl px-4 bg-slate-50/50">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-left">
                <Activity className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-bold text-slate-800">Reliabilitas (KR-20)</div>
                  <div className="text-xs text-slate-500 font-normal">Kekonsistenan hasil instrumen tes secara keseluruhan.</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-slate-600 leading-relaxed pb-4 space-y-3">
              <p>Formula Kuder-Richardson 20 digunakan untuk menghitung konsistensi internal seluruh paket tes. Nilai ini sangat penting untuk memastikan tes dapat diandalkan secara objektif.</p>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Settings2 className="h-3 w-3" /> Kriteria Reliabilitas:
                </div>
                <ul className="space-y-1 text-xs">
                  <li><span className="inline-block w-32 font-semibold text-slate-600">Sangat Rendah:</span> &lt; {thresholds.reliability.sangatRendah.toFixed(2)}</li>
                  <li><span className="inline-block w-32 font-semibold text-purple-600">Rendah-Sedang:</span> {thresholds.reliability.sangatRendah.toFixed(2)} - {thresholds.reliability.sedang.toFixed(2)}</li>
                  <li><span className="inline-block w-32 font-semibold text-emerald-600">Tinggi/Handal:</span> &gt; {thresholds.reliability.sedang.toFixed(2)}</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
