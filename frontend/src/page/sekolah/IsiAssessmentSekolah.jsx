import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import Button from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

function IsiAssessmentSekolah() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [jawaban, setJawaban] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [namaPengisi, setNamaPengisi] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [sisaHari, setSisaHari] = useState(0);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/assessment/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.message || "Gagal memuat assessment");

        // LOGIKA CEK WAKTU
        const now = new Date();
        const deadline = new Date(data.tanggal_selesai);
        deadline.setHours(23, 59, 59, 999);

        const diffTime = deadline - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setSisaHari(diffDays);
        setIsExpired(now > deadline);

        setAssessment({
          ...data,
          questions: Array.isArray(data.questions) ? data.questions : [],
        });
      } catch (err) {
        console.error(err);
        toast.error("Gagal mengambil data assessment");
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  const handleJawab = (id_pertanyaan, jawaban_dipilih) => {
    if (isExpired) return;
    setJawaban((prev) => ({ ...prev, [id_pertanyaan]: jawaban_dipilih }));
  };

  const handleSubmit = async () => {
    if (!assessment || isExpired)
      return toast.error("Periode pengisian telah berakhir.");
    if (!namaPengisi.trim())
      return toast.error("Silakan isi Nama Lengkap Anda!");

    const totalSoal = assessment.questions.length;
    const totalDijawab = Object.keys(jawaban).length;
    if (totalDijawab < totalSoal)
      return toast.error("Harap jawab semua pertanyaan!");

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const id_user = decoded.sub;

      const payload = {
        id_user,
        nama_pengisi: namaPengisi,
        jawaban: Object.entries(jawaban).map(([id_pertanyaan, jawaban]) => ({
          id_pertanyaan: Number(id_pertanyaan),
          jawaban,
        })),
      };

      const res = await fetch(`http://localhost:3000/assessment/${id}/jawab`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal submit jawaban");

      toast.success("Jawaban berhasil dikirim!");
      navigate("/sekolah/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengirim jawaban");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen font-bold text-[#1E5AA5]">
        Loading...
      </div>
    );

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-t-[2.5rem] rounded-b-[2.5rem] border-none shadow-2xl bg-white overflow-auto">
          <div className="px-8 py-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#1E5AA5] font-black mb-1">
                    Isi Assessment Sekolah
                  </p>
                  <h1 className="text-3xl font-black text-gray-800 uppercase italic">
                    {assessment?.nama ?? "Assessment"}
                  </h1>
                </div>
                <Button
                  text="← Kembali"
                  variant="ghost"
                  onClick={() => navigate("/sekolah/dashboard")}
                  className="!rounded-xl border border-gray-200"
                />
              </div>

              {/* STATUS ALERT - REVISI DISINI */}
              <div
                className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                  isExpired
                    ? "bg-red-50 border-red-100 text-red-700"
                    : "bg-emerald-50 border-emerald-100 text-emerald-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${isExpired ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`}
                  />
                  <div>
                    <p className="text-sm font-black uppercase tracking-wider">
                      Status:{" "}
                      {isExpired ? "Selesai / Berakhir" : "Masa Pengisian"}
                    </p>
                    <p className="text-xs opacity-80">
                      Batas: {formatTanggal(assessment?.tanggal_selesai)}
                    </p>
                  </div>
                </div>
                {!isExpired && (
                  <div className="bg-emerald-100 px-4 py-2 rounded-xl text-center">
                    <p className="text-[10px] uppercase font-bold leading-tight">
                      Sisa Waktu
                    </p>
                    <p className="text-lg font-black leading-tight">
                      {sisaHari} Hari
                    </p>
                  </div>
                )}
              </div>

              {/* Input Nama */}
              <div className="p-6 bg-white border border-gray-100 rounded-[1.75rem] shadow-sm">
                <label className="text-sm font-bold text-gray-700 block mb-2">
                  Nama Lengkap Pengisi (Guru){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={namaPengisi}
                  onChange={(e) => setNamaPengisi(e.target.value)}
                  disabled={isExpired}
                  placeholder="Masukkan nama lengkap Anda..."
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                    isExpired
                      ? "bg-gray-50 border-gray-200 text-gray-400"
                      : "border-gray-300 focus:ring-2 focus:ring-[#1E5AA5]"
                  }`}
                />
              </div>

              {/* List Pertanyaan */}
              {assessment?.questions.map((q, index) => (
                <div
                  key={q.id_pertanyaan || index}
                  className="p-6 bg-white border border-gray-100 rounded-[1.75rem] shadow-sm"
                >
                  <p className="font-bold text-gray-800 mb-5 flex gap-2">
                    <span>{index + 1}.</span> <span>{q.question}</span>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((opt, i) => {
                      const isSelected = jawaban[q.id_pertanyaan] === opt;
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isExpired}
                          onClick={() => handleJawab(q.id_pertanyaan, opt)}
                          className={`w-full px-5 py-4 rounded-2xl border text-left text-sm font-bold transition-all duration-200 
                            ${
                              isSelected
                                ? "bg-[#1E5AA5] text-white border-[#1E5AA5] shadow-lg"
                                : isExpired
                                  ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-[#1E5AA5] hover:bg-blue-50"
                            }`}
                        >
                          <span className="mr-3 opacity-60">
                            {String.fromCharCode(65 + i)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-10 mt-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-500 font-medium italic">
                {isExpired
                  ? "Assessment sudah ditutup."
                  : "Pastikan semua pertanyaan terjawab."}
              </p>
              <Button
                text={submitting ? "Mengirim..." : "Kirim Jawaban Sekarang"}
                onClick={handleSubmit}
                disabled={submitting || isExpired}
                className={isExpired ? "opacity-50" : "shadow-xl"}
              />
            </div>
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
}

export default IsiAssessmentSekolah;
