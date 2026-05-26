import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultThresholds, type Thresholds } from "@/lib/analysis";

export function SettingsDialog({
  open,
  onOpenChange,
  thresholds,
  setThresholds,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  thresholds: Thresholds;
  setThresholds: (t: Thresholds) => void;
}) {
  const upd = (path: string, val: number) => {
    const next = JSON.parse(JSON.stringify(thresholds)) as Thresholds;
    const [a, b] = path.split(".");
    // @ts-expect-error dynamic
    next[a][b] = val;
    setThresholds(next);
  };

  const Field = ({ label, path, value }: { label: string; path: string; value: number }) => (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-600">{label}</Label>
      <Input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => upd(path, parseFloat(e.target.value) || 0)}
        className="h-9"
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pengaturan Batas Kategori</DialogTitle>
          <DialogDescription>
            Ubah ambang batas klasifikasi untuk setiap indikator analisis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Tingkat Kesukaran (P)</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Batas SUKAR (P <)" path="difficulty.sukar" value={thresholds.difficulty.sukar} />
              <Field label="Batas MUDAH (P >)" path="difficulty.mudah" value={thresholds.difficulty.mudah} />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Daya Pembeda (DP)</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Field label="≤ SANGAT JELEK" path="discrimination.jelek" value={thresholds.discrimination.jelek} />
              <Field label="≤ JELEK" path="discrimination.cukup" value={thresholds.discrimination.cukup} />
              <Field label="≤ CUKUP" path="discrimination.baik" value={thresholds.discrimination.baik} />
              <Field label="≤ BAIK" path="discrimination.sangatBaik" value={thresholds.discrimination.sangatBaik} />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Validitas (r pbis)</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Batas TIDAK VALID (r <)" path="validity.tidak" value={thresholds.validity.tidak} />
              <Field label="Batas VALID (r >)" path="validity.valid" value={thresholds.validity.valid} />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Reliabilitas (KR-20)</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Field label="< SANGAT RENDAH" path="reliability.sangatRendah" value={thresholds.reliability.sangatRendah} />
              <Field label="< RENDAH" path="reliability.rendah" value={thresholds.reliability.rendah} />
              <Field label="< SEDANG" path="reliability.sedang" value={thresholds.reliability.sedang} />
              <Field label="< TINGGI" path="reliability.tinggi" value={thresholds.reliability.tinggi} />
            </div>
          </section>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => setThresholds(defaultThresholds)}>
            Reset Default
          </Button>
          <Button onClick={() => onOpenChange(false)}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
