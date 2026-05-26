import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

export function TutorialDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const downloadTemplate = () => {
    const data = [
      ["Nama Siswa", "Soal 1", "Soal 2", "Soal 3", "Soal 4", "Soal 5"],
      ["Andi", 1, 0, 1, 1, 0],
      ["Budi", 1, 1, 1, 0, 1],
      ["Citra", 0, 1, 1, 1, 0],
      ["Dewi", 1, 0, 0, 1, 1],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template-eduanalyze.xlsx");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Format File Excel</DialogTitle>
          <DialogDescription>
            Ikuti format berikut agar data dapat diproses dengan benar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
              <li>Baris pertama berisi <b>header</b>: kolom 1 = nama siswa, kolom selanjutnya = nama soal.</li>
              <li>Setiap baris berikutnya = 1 siswa.</li>
              <li>Isi sel jawaban dengan <b>1</b> (benar) atau <b>0</b> (salah).</li>
              <li>Format file: <b>.xlsx</b> atau <b>.csv</b>.</li>
            </ol>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Nama Siswa</th>
                  <th className="px-3 py-2 text-center font-medium">Soal 1</th>
                  <th className="px-3 py-2 text-center font-medium">Soal 2</th>
                  <th className="px-3 py-2 text-center font-medium">Soal 3</th>
                  <th className="px-3 py-2 text-center font-medium">Soal 4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {[
                  ["Andi", 1, 0, 1, 1],
                  ["Budi", 1, 1, 1, 0],
                  ["Citra", 0, 1, 1, 1],
                ].map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j} className={j === 0 ? "px-3 py-2" : "px-3 py-2 text-center"}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button onClick={downloadTemplate} className="w-full gap-2 sm:w-auto">
            <Download className="h-4 w-4" /> Unduh Template Excel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
