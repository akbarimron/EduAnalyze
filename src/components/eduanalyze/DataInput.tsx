import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, Plus, Trash2, Play, BookOpen, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export type DataState = {
  names: string[];
  questions: string[];
  matrix: number[][];
};

export function DataInput({
  data,
  setData,
  onAnalyze,
  onOpenTutorial,
  hasResult,
  onOpenResults,
}: {
  data: DataState;
  setData: (d: DataState) => void;
  onAnalyze: () => void;
  onOpenTutorial: () => void;
  hasResult?: boolean;
  onOpenResults?: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, blankrows: false });
        if (rows.length < 2) throw new Error("File kosong");
        const header = rows[0] as any[];
        const questions = header.slice(1).map((h) => String(h ?? ""));
        const names: string[] = [];
        const matrix: number[][] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i] as any[];
          if (!row || row.length === 0) continue;
          names.push(String(row[0] ?? `Siswa ${i}`));
          const r: number[] = [];
          for (let j = 0; j < questions.length; j++) {
            const v = row[j + 1];
            r.push(Number(v) === 1 ? 1 : 0);
          }
          matrix.push(r);
        }
        setData({ names, questions, matrix });
        toast.success(`Berhasil memuat ${names.length} siswa × ${questions.length} soal`);
      } catch (err: any) {
        toast.error("Gagal membaca file: " + err.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  const addRow = () => {
    setData({
      ...data,
      names: [...data.names, `Siswa ${data.names.length + 1}`],
      matrix: [...data.matrix, new Array(data.questions.length).fill(0)],
    });
  };
  const addCol = () => {
    setData({
      ...data,
      questions: [...data.questions, `Soal ${data.questions.length + 1}`],
      matrix: data.matrix.map((r) => [...r, 0]),
    });
  };
  const delRow = (i: number) => {
    setData({
      ...data,
      names: data.names.filter((_, k) => k !== i),
      matrix: data.matrix.filter((_, k) => k !== i),
    });
  };
  const delCol = (j: number) => {
    setData({
      ...data,
      questions: data.questions.filter((_, k) => k !== j),
      matrix: data.matrix.map((r) => r.filter((_, k) => k !== j)),
    });
  };
  const updateCell = (i: number, j: number, v: number) => {
    const m = data.matrix.map((r) => [...r]);
    m[i][j] = v ? 1 : 0;
    setData({ ...data, matrix: m });
  };
  const updateName = (i: number, v: string) => {
    const names = [...data.names];
    names[i] = v;
    setData({ ...data, names });
  };

  const canAnalyze = data.names.length >= 2 && data.questions.length >= 2;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <Tabs defaultValue="upload" className="w-full">
        <div className="border-b border-slate-100 px-4 pt-4 sm:px-6">
          <TabsList className="grid w-full max-w-sm grid-cols-2 bg-slate-100/60">
            <TabsTrigger value="upload" className="font-medium">Upload File</TabsTrigger>
            <TabsTrigger value="manual" className="font-medium">Input Manual</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="upload" className="p-4 sm:p-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => fileRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors sm:p-12 ${
              dragOver
                ? "border-purple-500 bg-purple-50/60"
                : "border-slate-300/50 bg-slate-50/60 hover:border-purple-400 hover:bg-purple-50/40"
            }`}
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100/70">
              <Upload className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-slate-900 sm:text-base">
              Klik atau seret file Excel di sini
            </p>
            <p className="mt-1 text-xs text-slate-500">Format: .xlsx, .xls, atau .csv</p>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          <button
            onClick={onOpenTutorial}
            className="mt-4 flex w-full items-center justify-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium sm:text-sm"
          >
            <BookOpen className="h-4 w-4" /> Lihat template dan tutorial
          </button>

          {data.names.length > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50/80 px-3 py-2.5 text-sm text-emerald-700 font-medium">
              <FileSpreadsheet className="h-4 w-4" />
              {data.names.length} siswa × {data.questions.length} soal siap dianalisis
            </div>
          )}
        </TabsContent>

        <TabsContent value="manual" className="space-y-3 p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={addRow} 
              className="gap-1.5 font-medium border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors"
            >
              <Plus className="h-4 w-4" /> Tambah Siswa
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={addCol} 
              className="gap-1.5 font-medium border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-colors"
            >
              <Plus className="h-4 w-4" /> Tambah Soal
            </Button>
            {data.names.length === 0 && (
              <Button
                size="sm"
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 font-medium transition-all"
                onClick={() => {
                  const names = ["Siswa 1", "Siswa 2", "Siswa 3", "Siswa 4", "Siswa 5"];
                  const questions = ["Soal 1", "Soal 2", "Soal 3", "Soal 4", "Soal 5"];
                  const matrix = [
                    [1, 1, 1, 0, 1],
                    [1, 0, 1, 1, 0],
                    [1, 1, 1, 1, 1],
                    [0, 0, 1, 0, 0],
                    [1, 1, 0, 1, 1]
                  ];
                  setData({ names, questions, matrix });
                }}
              >
                Mulai dengan contoh
              </Button>
            )}
          </div>


          <div className="overflow-x-auto rounded-lg border border-slate-200/60 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/40">
                <tr>
                  <th className="sticky left-0 z-10 bg-slate-50/80 px-3 py-2.5 text-left font-semibold text-slate-700">
                    Nama Siswa
                  </th>
                  {data.questions.map((q, j) => (
                    <th key={j} className="px-2 py-2.5 text-center font-semibold text-slate-700">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-medium">{q}</span>
                        <button
                          onClick={() => delCol(j)}
                          className="text-slate-400 hover:text-purple-600 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.names.map((name, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="sticky left-0 z-10 bg-white px-2 py-1">
                      <Input
                        value={name}
                        onChange={(e) => updateName(i, e.target.value)}
                        className="h-8 min-w-[120px] text-sm"
                      />
                    </td>
                    {data.questions.map((_, j) => (
                      <td key={j} className="px-1 py-1 text-center">
                        <select
                          value={data.matrix[i][j]}
                          onChange={(e) => updateCell(i, j, Number(e.target.value))}
                          className="h-8 w-14 rounded-md border border-slate-200/70 bg-white text-center text-sm focus:border-purple-500 focus:outline-none font-medium"
                        >
                          <option value={0}>0</option>
                          <option value={1}>1</option>
                        </select>
                      </td>
                    ))}
                    <td className="px-2">
                      <button
                        onClick={() => delRow(i)}
                        className="text-slate-400 hover:text-purple-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {data.names.length === 0 && (
                  <tr>
                    <td colSpan={data.questions.length + 2} className="py-8 text-center text-sm text-slate-500">
                      Belum ada data. Klik "Tambah Siswa" dan "Tambah Soal" untuk memulai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col items-stretch gap-3 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p className="text-xs text-slate-500/80 font-medium">
          {canAnalyze
            ? `Siap menganalisis ${data.names.length} siswa × ${data.questions.length} soal.`
            : "Unggah file atau isi data (min. 2 siswa & 2 soal) untuk memulai."}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {hasResult && onOpenResults && (
            <Button
              onClick={onOpenResults}
              variant="outline"
              size="lg"
              className="gap-2 border-purple-200 text-purple-600 hover:bg-purple-50 font-semibold"
            >
              <Activity className="h-4 w-4" /> Lihat Hasil
            </Button>
          )}
          <Button
            onClick={onAnalyze}
            size="lg"
            disabled={!canAnalyze}
            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-semibold shadow-md"
          >
            <Play className="h-4 w-4" /> Analisis Data
          </Button>
        </div>
      </div>

    </div>
  );
}
