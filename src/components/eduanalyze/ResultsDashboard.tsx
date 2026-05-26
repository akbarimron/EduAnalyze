import { useMemo, useState, Fragment } from "react";
import * as XLSX from "xlsx";
import { Download, CheckCircle2, XCircle, Users, ListChecks, Activity, ChevronDown, ChevronUp, Info, BrainCircuit, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { categoryColor, type AnalysisResult } from "@/lib/analysis";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ResultsDashboard({ result }: { result: AnalysisResult }) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const validCount = result.items.filter((i) => i.rCat === "VALID").length;
  const cukupValidCount = result.items.filter((i) => i.rCat === "CUKUP VALID").length;
  const tidakValidCount = result.items.filter((i) => i.rCat === "TIDAK VALID" || i.rCat === "TIDAK VALID (NEGATIF)").length;

  const difficultyData = useMemo(() => {
    const counts = { MUDAH: 0, SEDANG: 0, SUKAR: 0 } as Record<string, number>;
    result.items.forEach((i) => (counts[i.pCat] = (counts[i.pCat] || 0) + 1));
    return [
      { name: "Mudah", value: counts.MUDAH, color: "#10b981" }, // Emerald 500
      { name: "Sedang", value: counts.SEDANG, color: "#8b5cf6" }, // Purple 500
      { name: "Sukar", value: counts.SUKAR, color: "#64748b" }, // Slate 500
    ];
  }, [result]);

  const itemChart = result.items.map((i) => ({
    soal: `S${i.no}`,
    P: +i.p.toFixed(2),
    DP: +i.dp.toFixed(2),
    r: +i.rpbis.toFixed(2),
  }));

  const exportExcel = () => {
    const rows = [
      ["No. Soal", "P", "Kategori P", "DP", "Kategori DP", "r pbis", "Status Validitas"],
      ...result.items.map((i) => [
        i.no,
        +i.p.toFixed(4),
        i.pCat,
        +i.dp.toFixed(4),
        i.dpCat,
        +i.rpbis.toFixed(4),
        i.rCat,
      ]),
      [],
      ["Total Siswa (N)", result.N],
      ["Total Soal (k)", result.k],
      ["Mean Total", +result.meanTotal.toFixed(4)],
      ["Stdev Total", +result.stdevTotal.toFixed(4)],
      ["Reliabilitas (KR-20)", +result.reliability.toFixed(4)],
      ["Kategori Reliabilitas", result.reliabilityCat],
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hasil Analisis");
    XLSX.writeFile(wb, "laporan-analisis-butir-soal.xlsx");
  };

  const relColor =
    result.reliability >= 0.7
      ? "from-purple-600 to-indigo-600"
      : result.reliability >= 0.4
        ? "from-indigo-400 to-purple-500"
        : "from-rose-500 to-rose-700";

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Total Siswa"
          value={String(result.N)}
          tint="purple"
        />
        <StatCard
          icon={<ListChecks className="h-4 w-4" />}
          label="Total Soal"
          value={String(result.k)}
          tint="indigo"
        />
        <StatCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Soal Valid"
          value={String(validCount)}
          sub={`${cukupValidCount} cukup valid`}
          tint="emerald"
        />
        <StatCard
          icon={<XCircle className="h-4 w-4" />}
          label="Tidak Valid"
          value={String(tidakValidCount)}
          tint="rose"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Kelompok Atas ({result.upperGroup.length} Siswa)</h3>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            {result.upperGroup.map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-emerald-50/50 px-3 py-2 text-sm">
                <span className="font-medium text-slate-700">{s.name}</span>
                <span className="font-bold text-emerald-700">{s.score} poin</span>
              </div>
            ))}
            {result.upperGroup.length === 0 && <p className="text-xs text-slate-400 text-center py-2">Data tidak cukup untuk pembagian kelompok.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Kelompok Bawah ({result.lowerGroup.length} Siswa)</h3>
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            {result.lowerGroup.map((s, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-rose-50/50 px-3 py-2 text-sm">
                <span className="font-medium text-slate-700">{s.name}</span>
                <span className="font-bold text-rose-700">{s.score} poin</span>
              </div>
            ))}
            {result.lowerGroup.length === 0 && <p className="text-xs text-slate-400 text-center py-2">Data tidak cukup untuk pembagian kelompok.</p>}
          </div>
        </div>
      </div>

      {/* Reliability hero */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${relColor} p-6 text-white shadow-lg`}>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Activity className="h-4 w-4" /> Reliabilitas KR-20
          </div>
          <div className="mt-3 text-5xl font-bold tracking-tight">
            {result.reliability.toFixed(3)}
          </div>
          <div className="mt-2 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur">
            {result.reliabilityCat}
          </div>
          <div className="mt-4 text-xs opacity-80">
            Mean: {result.meanTotal.toFixed(2)} · Stdev: {result.stdevTotal.toFixed(2)}
          </div>
        </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            Distribusi Tingkat Kesukaran
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={difficultyData} dataKey="value" nameKey="name" outerRadius={70} label>
                  {difficultyData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">
          Grafik Indikator Per Soal
        </h3>
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={itemChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="soal" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="P" fill="#8b5cf6" name="Tingkat Kesukaran" />
              <Bar dataKey="DP" fill="#6366f1" name="Daya Pembeda" />
              <Bar dataKey="r" fill="#10b981" name="r pbis" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Hasil Analisis Per Soal</h3>
            <p className="text-xs text-slate-500">Tingkat kesukaran, daya pembeda, dan validitas untuk setiap butir soal.</p>
          </div>
          <Button onClick={exportExcel} className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-medium">
            <Download className="h-4 w-4" /> Unduh Laporan
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50/80 text-slate-700 border-b border-slate-100/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">No. Soal</th>
                <th className="px-4 py-3 text-left font-semibold">Tingkat Kesukaran</th>
                <th className="px-4 py-3 text-left font-semibold">Daya Pembeda</th>
                <th className="px-4 py-3 text-left font-semibold">Validitas (r-pbis)</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {result.items.map((it) => (
                <Fragment key={it.no}>
                  <tr 
                    className={`hover:bg-slate-50/60 cursor-pointer transition-colors ${expandedRow === it.no ? "bg-slate-50/80" : ""}`}
                    onClick={() => setExpandedRow(expandedRow === it.no ? null : it.no)}
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      Soal {it.no}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-700">{it.p.toFixed(3)}</span>
                        <Badge cat={it.pCat} />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="font-mono">{it.dp.toFixed(3)}</span>
                        <Badge cat={it.dpCat} />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="font-mono">{it.rpbis.toFixed(3)}</span>
                        <Badge cat={it.rCat} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {expandedRow === it.no ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </td>
                  </tr>
                  {expandedRow === it.no && (
                    <tr className="bg-slate-50/40">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="flex items-start gap-3 rounded-xl border border-purple-100 bg-white p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="mt-0.5 rounded-full bg-purple-100 p-1.5 flex-shrink-0">
                            <Info className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                              <BrainCircuit className="h-4 w-4 text-purple-600" />
                              Analisis Komprehensif:
                            </h4>
                            <div className="prose prose-sm prose-slate max-w-none text-slate-700 leading-relaxed font-medium">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {it.recommendation}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Badge({ cat }: { cat: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${categoryColor(cat)}`}
    >
      {cat}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  tint: "blue" | "indigo" | "emerald" | "slate" | "purple" | "rose";
}) {
  const tints: Record<string, string> = {
    blue: "bg-blue-50/70 text-blue-600",
    indigo: "bg-indigo-50/70 text-indigo-600",
    emerald: "bg-emerald-50/70 text-emerald-600",
    slate: "bg-slate-50/70 text-slate-600",
    purple: "bg-purple-50/70 text-purple-600",
    rose: "bg-rose-50/70 text-rose-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tints[tint]}`}>
          {icon}
        </span>
      </div>
      <div className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-slate-600 font-medium">{sub}</div>}
    </div>
  );
}
