/* eslint-disable no-unused-vars */
import Sidebar from "../../../components/Sidebar";
import Button from "../../../components/Button";
import PageWrapper from "../../../components/PageWrapper";
import Label from "../../../components/Label";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Users,
  BarChart3,
  Activity,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

// 🎨 PREMIUM GRADIENT PALETTE
const MODERN_GRADIENTS = [
  "from-[#1E5AA5] to-[#3b82f6]", // Brand Blue
  "from-[#0ea5e9] to-[#38bdf8]", // Sky Blue
  "from-[#8b5cf6] to-[#a855f7]", // Violet
  "from-[#10b981] to-[#34d399]", // Emerald
  "from-[#f59e0b] to-[#fbbf24]", // Amber
];

export default function DetailAssessmentAkademik() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [daftarPengisi, setDaftarPengisi] = useState([]);
  const [totalPengisi, setTotalPengisi] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await fetch(`http://localhost:3000/assessment/${id}`);
        const data = await res.json();

        setQuestions(data.questions || []);
        setDaftarPengisi(data.daftar_pengisi || []);
        setTotalPengisi(data.total_pengisi || 0);
      } catch (error) {
        console.error("Gagal mengambil detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F4F7FE]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-dashed rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-[#1E5AA5] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  // === RUMUS UNTUK MENCARI INSIGHT KECIL ===
  const totalJawaban = questions.reduce(
    (acc, q) => acc + (q.stats?.reduce((sum, s) => sum + s.count, 0) || 0),
    0,
  );

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <div className="flex-1 flex flex-col rounded-t-[2.5rem] rounded-b-[2.5rem] border-none shadow-2xl bg-white overflow-hidden relative">
          <div className="px-8 pt-6 pb-6 shrink-0">
            <header className="flex flex-row items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition animate-pulse"></div>
                  <div className="relative p-3.5 bg-gradient-to-br from-[#2E5AA7] to-[#164a8a] rounded-2xl text-white shadow-xl">
                    <BarChart3 size={22} strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-col -space-y-1">
                  <Label
                    text="Sistem Monitoring dan Evaluasi Program"
                    className="!text-[8px] !text-[#1E5AA5] !font-black tracking-[0.3em] !mb-1 uppercase"
                  />
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Analytics <span className="text-[#2E5AA7]">Assessment Akademik</span>
                  </h1>
                </div>
              </div>

              <Button
                text="Kembali"
                icon={<ArrowLeft size={14} />}
                onClick={() => navigate("/ho/assessment/akademik")}
                className="group !bg-gray-100 hover:!bg-gray-200 !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-gray-600 shadow-lg active:scale-95 transition-all flex items-center gap-2"
              />
            </header>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden px-8 pb-6">
            {/* PANEL KIRI: SUMMARY & RESPONDEN (Lebar Tetap) */}
            <div className="w-full lg:w-[320px] xl:w-[380px] flex flex-col gap-4 flex-none overflow-hidden">
              {/* GRID STATS ATAS */}
              <div className="grid grid-cols-2 gap-4 flex-none">
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
                  <div className="relative z-10">
                    <Users size={20} className="text-[#1E5AA5] mb-2" />
                    <p className="text-3xl font-black text-gray-800">
                      {totalPengisi}
                    </p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Responden
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
                  <div className="relative z-10">
                    <CheckCircle2 size={20} className="text-emerald-500 mb-2" />
                    <p className="text-3xl font-black text-gray-800">
                      {questions.length}
                    </p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Total Soal
                    </p>
                  </div>
                </div>
              </div>

              {/* INSIGHT CARD */}
              <div className="bg-gradient-to-br from-[#1E5AA5] to-[#15437a] rounded-3xl p-5 shadow-lg shadow-blue-900/20 flex-none text-white relative overflow-hidden">
                <Activity className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white opacity-5" />
                <div className="flex items-center gap-2 mb-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                  </span>
                  <span className="text-xs font-bold text-blue-200 tracking-wider uppercase">
                    Status Live
                  </span>
                </div>
                <p className="text-sm font-medium text-blue-100 leading-snug">
                  Sistem telah merekam total{" "}
                  <strong className="text-white text-lg">{totalJawaban}</strong>{" "}
                  interaksi jawaban dari seluruh guru.
                </p>
              </div>

              {/* DAFTAR RESPONDEN - Bisa di-scroll internal kalau kepanjangan */}
              <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                <div className="p-5 border-b border-gray-50 flex-none">
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                    Log Responden
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                  {daftarPengisi && daftarPengisi.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {daftarPengisi.map((nama, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-2xl transition-colors cursor-default group"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1E5AA5] flex items-center justify-center text-xs font-black group-hover:bg-[#1E5AA5] group-hover:text-white transition-colors">
                            {nama.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-gray-700 truncate">
                            {nama}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                      <Users size={32} className="mb-2" />
                      <p className="text-xs font-medium">Belum ada data masuk</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PANEL KANAN: DETAIL PERTANYAAN & STATISTIK */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative">
              {/* STICKY HEADER PANEL KANAN */}
              <div className="flex-none p-5 lg:p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black text-gray-800">
                    Distribusi Jawaban
                  </h2>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    Analisis per butir soal
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-blue-50 text-[#1E5AA5] rounded-lg text-xs font-bold border border-blue-100">
                  {questions.length} Items
                </div>
              </div>

              {/* AREA SCROLL KHUSUS SOAL */}
              <div className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-8 custom-scrollbar">
                {questions.map((q, index) => (
                  <div key={index} className="relative group">
                    {/* Garis Kiri Indikator */}
                    <div className="absolute -left-5 lg:-left-8 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#1E5AA5]/20 rounded-r-md transition-colors"></div>

                    {/* Header Pertanyaan */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center font-black text-sm shrink-0 border border-gray-200 group-hover:bg-[#1E5AA5] group-hover:text-white group-hover:border-[#1E5AA5] transition-all">
                        {index + 1}
                      </div>
                      <h3 className="text-base lg:text-lg font-bold text-gray-800 pt-1 leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    {/* Barisan Statistik Jawaban */}
                    <div className="space-y-3 lg:pl-12">
                      {q.stats?.map((stat, i) => {
                        const percentage =
                          totalPengisi > 0
                            ? (stat.count / totalPengisi) * 100
                            : 0;
                        const gradientClass =
                          MODERN_GRADIENTS[i % MODERN_GRADIENTS.length];
                        const isHighest =
                          Math.max(...q.stats.map((s) => s.count)) ===
                            stat.count && stat.count > 0;

                        return (
                          <div
                            key={i}
                            className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6"
                          >
                            {/* Label Jawaban */}
                            <div className="flex-1 flex items-start md:items-center gap-3">
                              <div
                                className={`mt-1 md:mt-0 w-2.5 h-2.5 rounded-full bg-gradient-to-br ${gradientClass} flex-shrink-0 shadow-sm`}
                              />
                              <span
                                className={`text-sm ${isHighest ? "font-bold text-gray-900" : "font-semibold text-gray-600"}`}
                              >
                                {stat.label}
                              </span>
                            </div>

                            {/* Progress Bar & Value */}
                            <div className="w-full md:w-[40%] flex items-center gap-4 flex-shrink-0">
                              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                <div
                                  className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-1000 ease-out`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <div className="flex items-center gap-2 w-16 justify-end">
                                <span
                                  className={`text-sm font-bold ${isHighest ? "text-[#1E5AA5]" : "text-gray-500"}`}
                                >
                                  {stat.count}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400">
                                  ({Math.round(percentage)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pemisah antar soal */}
                    {index < questions.length - 1 && (
                      <div className="h-px w-full bg-gray-100 mt-8"></div>
                    )}
                  </div>
                ))}

                {/* Spacer Bawah */}
                <div className="h-4"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
