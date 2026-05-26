// Analisis Butir Soal - Pilihan Ganda (1/0)

export type Thresholds = {
  difficulty: { sukar: number; mudah: number }; // P < sukar => SUKAR; P > mudah => MUDAH
  discrimination: { jelek: number; cukup: number; baik: number; sangatBaik: number };
  validity: { tidak: number; valid: number }; // r < tidak => TIDAK; r > valid => VALID
  reliability: { sangatRendah: number; rendah: number; sedang: number; tinggi: number };
};

export const defaultThresholds: Thresholds = {
  difficulty: { sukar: 0.3, mudah: 0.7 },
  discrimination: { jelek: 0.0, cukup: 0.2, baik: 0.4, sangatBaik: 0.7 },
  validity: { tidak: 0.3, valid: 0.6 },
  reliability: { sangatRendah: 0.2, rendah: 0.4, sedang: 0.6, tinggi: 0.8 },
};

export type ItemAnalysis = {
  no: number;
  p: number;
  pCat: string;
  dp: number;
  dpCat: string;
  rpbis: number;
  rCat: string;
  recommendation: string;
};

export type AnalysisResult = {
  N: number;
  k: number;
  reliability: number;
  reliabilityCat: string;
  meanTotal: number;
  stdevTotal: number;
  items: ItemAnalysis[];
  totals: number[];
  studentNames: string[];
  upperGroup: { name: string; score: number }[];
  lowerGroup: { name: string; score: number }[];
};

export function classifyDifficulty(p: number, t: Thresholds): string {
  if (p < t.difficulty.sukar) return "SUKAR";
  if (p > t.difficulty.mudah) return "MUDAH";
  return "SEDANG";
}

export function classifyDiscrimination(dp: number, t: Thresholds): string {
  if (dp < 0) return "SANGAT JELEK (NEGATIF)";
  if (dp <= t.discrimination.jelek) return "SANGAT JELEK";
  if (dp <= t.discrimination.cukup) return "JELEK";
  if (dp <= t.discrimination.baik) return "CUKUP";
  if (dp <= t.discrimination.sangatBaik) return "BAIK";
  return "SANGAT BAIK";
}

export function classifyValidity(r: number, t: Thresholds): string {
  if (r < 0) return "TIDAK VALID (NEGATIF)";
  if (r < t.validity.tidak) return "TIDAK VALID";
  if (r > t.validity.valid) return "VALID";
  return "CUKUP VALID";
}

export function classifyReliability(r: number, t: Thresholds): string {
  if (r < t.reliability.sangatRendah) return "SANGAT RENDAH";
  if (r < t.reliability.rendah) return "RENDAH";
  if (r < t.reliability.sedang) return "SEDANG";
  if (r < t.reliability.tinggi) return "TINGGI";
  return "SANGAT TINGGI";
}

export function getRecommendation(pCat: string, dpCat: string, rCat: string, p: number, dp: number, rpbis: number): string {
  let explanation = "";
  
  // Analisis Tingkat Kesukaran
  if (pCat === "SUKAR") {
    explanation += `Soal ini tergolong **Sukar** (P=${p.toFixed(2)}), artinya kurang dari 30% siswa yang menjawab benar. Hal ini mungkin disebabkan oleh materi yang belum diajarkan, kalimat yang ambigu, atau pengecoh yang terlalu kuat. `;
  } else if (pCat === "MUDAH") {
    explanation += `Soal ini tergolong **Mudah** (P=${p.toFixed(2)}), dimana lebih dari 70% siswa menjawab benar. Soal seperti ini baik untuk memotivasi siswa, namun kurang menantang untuk mengukur kemampuan tingkat tinggi. `;
  } else {
    explanation += `Tingkat kesukaran soal adalah **Sedang** (P=${p.toFixed(2)}), yang merupakan proporsi ideal dalam sebuah tes. `;
  }

  // Analisis Daya Pembeda
  if (dp < 0) {
    explanation += `Daya pembeda bernilai **Negatif** (DP=${dp.toFixed(2)}). Ini adalah anomali serius dimana siswa kelompok bawah justru lebih banyak menjawab benar dibandingkan kelompok atas. Kemungkinan ada kesalahan kunci jawaban atau soal ini sangat menyesatkan. `;
  } else if (dpCat === "SANGAT JELEK" || dpCat === "JELEK") {
    explanation += `Daya pembeda soal ini **Lemah** (DP=${dp.toFixed(2)}). Soal tidak mampu membedakan antara siswa kelompok atas dan kelompok bawah secara efektif. `;
  } else if (dpCat === "SANGAT BAIK") {
    explanation += `Daya pembeda soal sangat **Tajam** (DP=${dp.toFixed(2)}), sangat efektif memisahkan siswa yang menguasai materi dengan yang belum. `;
  } else {
    explanation += `Daya pembeda soal sudah **Cukup/Baik** (DP=${dp.toFixed(2)}). `;
  }

  // Analisis Validitas
  if (rpbis < 0) {
    explanation += `Validitas korelasi bernilai **Negatif** (r-pbis=${rpbis.toFixed(2)}). Ini menunjukkan bahwa siswa yang secara keseluruhan pintar justru cenderung salah pada soal ini. Butir soal ini sangat bermasalah. `;
  } else if (rCat === "TIDAK VALID" || rCat === "TIDAK VALID (NEGATIF)") {
    explanation += `Secara statistik, butir soal ini **Tidak Valid** (r-pbis=${rpbis.toFixed(2)}). Nilai korelasi yang rendah menunjukkan bahwa skor pada soal ini tidak konsisten dengan skor total tes. `;
  } else {
    explanation += `Butir soal ini dinyatakan **Valid** (r-pbis=${rpbis.toFixed(2)}). `;
  }

  // Kesimpulan Akhir
  explanation += "\n\n**Rekomendasi:** ";
  if (dp < 0 || rpbis < 0) {
    explanation += "🛑 **BUANG SOAL**. Butir soal ini kontra-produktif dan memberikan data yang menyesatkan tentang kemampuan siswa.";
  } else if (rCat === "VALID" && (dpCat === "BAIK" || dpCat === "SANGAT BAIK")) {
    explanation += "Pertahankan soal ini dalam Bank Soal karena memiliki kualitas psikometrik yang tinggi.";
  } else if (rCat === "TIDAK VALID" || dpCat === "SANGAT JELEK") {
    explanation += "Ganti atau lakukan revisi total pada opsi jawaban dan kesesuaian materi.";
  } else {
    explanation += "Lakukan revisi pada bagian yang lemah (misal: perbaiki pengecoh jika terlalu mudah) sebelum digunakan kembali.";
  }

  return explanation;
}

export function analyze(
  data: number[][],
  names: string[],
  thresholds: Thresholds
): AnalysisResult {
  const N = data.length;
  const k = data[0]?.length ?? 0;
  const totals = data.map((row) => row.reduce((s, v) => s + (v ? 1 : 0), 0));
  const meanTotal = totals.length > 0 ? totals.reduce((a, b) => a + b, 0) / (N || 1) : 0;
  const variance = totals.length > 0 
    ? totals.reduce((s, x) => s + (x - meanTotal) ** 2, 0) / (N || 1)
    : 0;
  const stdevTotal = Math.sqrt(variance);

  // Sort indices by total desc for DP groups
  const idxSorted = totals
    .map((t, i) => ({ t, i }))
    .sort((a, b) => b.t - a.t)
    .map((x) => x.i);
  const half = Math.floor(N / 2);
  const upper = idxSorted.slice(0, half);
  const lower = idxSorted.slice(N - half);

  let sumPQ = 0;
  const items: ItemAnalysis[] = [];

  for (let j = 0; j < k; j++) {
    const col: number[] = data.map((r) => (r[j] ? 1 : 0));
    const p = N > 0 ? col.reduce((a, b) => a + b, 0) / N : 0;
    const q = 1 - p;
    sumPQ += p * q;

    const pa =
      upper.length > 0 ? upper.reduce((s, i) => s + col[i], 0) / upper.length : 0;
    const pb =
      lower.length > 0 ? lower.reduce((s, i) => s + col[i], 0) / lower.length : 0;
    const dp = pa - pb;

    let rpbis = 0;
    if (p > 0 && q > 0 && stdevTotal > 0) {
      const correctTotals = totals.filter((_, i) => col[i] === 1);
      const Mp =
        correctTotals.length > 0 
          ? correctTotals.reduce((a, b) => a + b, 0) / correctTotals.length 
          : 0;
      rpbis = ((Mp - meanTotal) / stdevTotal) * Math.sqrt(p / q);
    }

    const pCat = classifyDifficulty(p, thresholds);
    const dpCat = classifyDiscrimination(dp, thresholds);
    const rCat = classifyValidity(rpbis, thresholds);

    items.push({
      no: j + 1,
      p,
      pCat,
      dp,
      dpCat,
      rpbis,
      rCat,
      recommendation: getRecommendation(pCat, dpCat, rCat, p, dp, rpbis),
    });
  }

  const Vt = variance;
  let reliability = 0;
  if (k > 1 && Vt > 0) {
    reliability = (k / (k - 1)) * (1 - sumPQ / Vt);
  }

  const upperGroup = upper.map((i) => ({ name: names[i] || `Siswa ${i + 1}`, score: totals[i] }));
  const lowerGroup = lower.map((i) => ({ name: names[i] || `Siswa ${i + 1}`, score: totals[i] }));

  return {
    N,
    k,
    reliability,
    reliabilityCat: classifyReliability(reliability, thresholds),
    meanTotal,
    stdevTotal,
    items,
    totals,
    studentNames: names,
    upperGroup,
    lowerGroup,
  };
}

export function categoryColor(cat: string): string {
  const map: Record<string, string> = {
    MUDAH: "bg-emerald-100 text-emerald-700 border-emerald-200",
    SEDANG: "bg-purple-100 text-purple-700 border-purple-200",
    SUKAR: "bg-slate-100 text-slate-700 border-slate-200",
    "SANGAT JELEK": "bg-rose-100 text-rose-700 border-rose-200",
    "SANGAT JELEK (NEGATIF)": "bg-red-100 text-red-700 border-red-200",
    JELEK: "bg-orange-100 text-orange-700 border-orange-200",
    CUKUP: "bg-purple-100 text-purple-700 border-purple-200",
    BAIK: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "SANGAT BAIK": "bg-emerald-200 text-emerald-800 border-emerald-300",
    "TIDAK VALID": "bg-rose-100 text-rose-700 border-rose-200",
    "TIDAK VALID (NEGATIF)": "bg-red-100 text-red-700 border-red-200",
    "CUKUP VALID": "bg-purple-100 text-purple-700 border-purple-200",
    VALID: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "SANGAT RENDAH": "bg-rose-100 text-rose-700 border-rose-200",
    RENDAH: "bg-orange-100 text-orange-700 border-orange-200",
    SEDANG: "bg-purple-100 text-purple-700 border-purple-200",
    TINGGI: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "SANGAT TINGGI": "bg-emerald-200 text-emerald-800 border-emerald-300",
  };
  return map[cat] ?? "bg-slate-50 text-slate-600 border-slate-100";
}
