/* eslint-disable no-unused-vars */
import Sidebar from "../../../components/Sidebar";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import Label from "../../../components/Label";
import PageWrapper from "../../../components/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Users,
  BarChart3,
  Activity,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  FileText,
} from "lucide-react";

// 🎨 PREMIUM GRADIENT PALETTE
const MODERN_GRADIENTS = [
  "from-[#2E5AA7] to-[#3b82f6]", // Brand Blue
  "from-[#0ea5e9] to-[#38bdf8]", // Sky Blue
  "from-[#8b5cf6] to-[#a855f7]", // Violet
  "from-[#10b981] to-[#34d399]", // Emerald
  "from-[#f59e0b] to-[#fbbf24]", // Amber
];

export default function DetailAssessmentNonAkademik() {
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
          <div className="w-16 h-16 border-4 border-[#2E5AA7] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
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
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-t-[2.5rem] rounded-b-[2.5rem] border-none shadow-2xl bg-white overflow-hidden relative">
          <div className="px-8 pt-6 pb-6 shrink-0">
            <header className="flex flex-row items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition animate-pulse"></div>
                  <div className="relative p-3.5 bg-gradient-to-br from-[#2E5AA7] to-[#164a8a] rounded-2xl text-white shadow-xl">
                    <FileText size={22} strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-col -space-y-1">
                  <Label
                    text="Sistem Monitoring dan Evaluasi Program"
                    className="!text-[8px] !text-[#2E5AA7] !font-black tracking-[0.3em] !mb-1 uppercase"
                  />
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Detail <span className="text-[#2E5AA7]">Assessment Non-Akademik</span>
                  </h1>
                </div>
              </div>

              <Button
                text="Kembali"
                icon={<ArrowLeft size={16} />}
                variant="outline"
                className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-bold px-6"
                onClick={() => navigate("/ho/assessment/non-akademik")}
              />
            </header>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden px-8 pb-6">
            {/* ================= DASHBOARD SPLIT-PANE ================= */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
              <div className="w-full lg:w-[320px] xl:w-[380px] flex flex-col gap-4 flex-none overflow-hidden">
                <div className="grid grid-cols-2 gap-4 flex-none">
                  <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
                    <div className="relative z-10">
                      <Users size={20} className="text-[#2E5AA7] mb-2" />
                      <p className="text-3xl font-black text-gray-800">{totalPengisi}</p>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Responden
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
                    <div className="relative z-10">
                      <CheckCircle2 size={20} className="text-emerald-500 mb-2" />
                      <p className="text-3xl font-black text-gray-800">{questions.length}</p>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Total Soal
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#2E5AA7] to-[#15437a] rounded-3xl p-5 shadow-lg shadow-blue-900/20 text-white relative overflow-hidden">
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
                    Sistem telah merekam total <strong className="text-white text-lg">{totalJawaban}</strong> interaksi jawaban dari seluruh guru.
                  </p>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex flex-col gap-4">
                    {questions.map((question, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm text-gray-500 uppercase tracking-[0.2em] font-bold">
                              Soal {index + 1}
                            </p>
                            <h2 className="text-lg font-semibold text-gray-900">
                              {question.question}
                            </h2>
                          </div>
                          <span className="text-xs font-semibold text-[#2E5AA7] uppercase tracking-[0.2em]">
                            {question.stats?.reduce((sum, option) => sum + option.count, 0) || 0} Respon
                          </span>
                        </div>
                        <div className="space-y-2">
                          {question.stats?.map((option, optIndex) => {
                            const percent = question.stats.reduce(
                              (total, item) => total + item.count,
                              0,
                            );
                            const width = percent ? Math.round((option.count / percent) * 100) : 0;
                            return (
                              <div key={optIndex} className="space-y-1">
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                  <span>{option.option}</span>
                                  <span className="font-semibold text-gray-800">{option.count}</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                                  <div className="h-full rounded-full bg-gradient-to-r from-[#2E5AA7] to-[#4f46e5]" style={{ width: `${width}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
}
