/* eslint-disable no-undef */
import Sidebar from "../../../components/Sidebar";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Label from "../../../components/Label";
import Input from "../../../components/Input";
import IconButton from "../../../components/IconButton";
import PageWrapper from "../../../components/PageWrapper";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { Trash2, ArrowLeft, Save, Plus, FileText } from "lucide-react";
import { useState, useEffect } from "react";

function CreateAssessmentAkademik() {
  const navigate = useNavigate();
  const [hoList, setHoList] = useState([]);
  const [selectedHo, setSelectedHo] = useState(null);
  const [sekolahList, setSekolahList] = useState([]);
  const [selectedSekolah, setSelectedSekolah] = useState(null);
  const [loading, setLoading] = useState(false);
  const [namaAssessment, setNamaAssessment] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""] },
  ]);
  const [tenggat, setTenggat] = useState(7);

  useEffect(() => {
    const fetchHo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/users/ho", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // --- Filter khusus akademik ---
        if (Array.isArray(data)) {
          const filteredHo = data.filter((ho) => ho.jenis === "akademik");
          setHoList(filteredHo);
        } else {
          setHoList([]);
        }
      } catch (err) {
        console.error(err);
        setHoList([]);
      }
    };
    fetchHo();

    const fetchSekolah = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/sekolah", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSekolahList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setSekolahList([]);
      }
    };
    fetchSekolah();
  }, []);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""] }]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const saveAssessment = async () => {
    if (!selectedHo) return toast.error("Silakan pilih HO terlebih dahulu");
    if (!selectedSekolah)
      return toast.error("Silakan pilih sekolah terlebih dahulu");
    if (!namaAssessment.trim())
      return toast.error("Nama assessment harus diisi");

    for (let q of questions) {
      if (!q.question.trim())
        return toast.error("Pertanyaan tidak boleh kosong");
      if (q.options.some((opt) => !opt.trim()))
        return toast.error("Semua pilihan harus diisi");
    }

    const payload = {
      id_ho: Number(selectedHo),
      nama: namaAssessment.trim(),
      target_sekolah_ids: [Number(selectedSekolah)],
      tenggat: tenggat,
      jenis: "akademik",
      questions: questions.map((q) => ({
        question: q.question.trim(),
        options: q.options.map((opt) => opt.trim()),
      })),
    };

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resBody = await res.json();

      if (!res.ok) {
        toast.error(resBody.message || "Gagal membuat assessment");
        return;
      }

      toast.success("Assessment akademik berhasil dibuat!");
      navigate("/ho/assessment/akademik");
    } catch (err) {
      console.error(err);
      toast.error("Gagal membuat assessment. Cek console untuk detail.");
    } finally {
      setLoading(false);
    }
  };

  function HoPicker() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const selectedHoName =
      hoList.find((h) => h.id_user === selectedHo)?.nama || "Pilih HO";

    return (
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full border border-gray-200 px-4 py-2.5 text-left bg-white rounded-xl shadow-sm hover:border-[#1E5AA5] transition-colors text-sm text-gray-700 font-medium"
        >
          {selectedHoName}
        </button>
        {dropdownOpen && (
          <ul className="absolute z-10 w-full bg-white border border-gray-100 mt-2 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
            {hoList.map((ho) => (
              <li
                key={ho.id_user}
                onClick={() => {
                  setSelectedHo(ho.id_user);
                  setDropdownOpen(false);
                }}
                className="px-4 py-2.5 hover:bg-blue-50 hover:text-[#1E5AA5] cursor-pointer text-sm font-medium transition-colors"
              >
                {ho.nama}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  function SekolahPicker() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const selectedSekolahName =
      sekolahList.find((s) => s.id_sekolah === selectedSekolah)?.nama_sekolah ||
      "Pilih Sekolah";

    return (
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full border border-gray-200 px-4 py-2.5 text-left bg-white rounded-xl shadow-sm hover:border-[#1E5AA5] transition-colors text-sm text-gray-700 font-medium"
        >
          {selectedSekolahName}
        </button>
        {dropdownOpen && (
          <ul className="absolute z-10 w-full bg-white border border-gray-100 mt-2 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
            {sekolahList.map((s) => (
              <li
                key={s.id_sekolah}
                onClick={() => {
                  setSelectedSekolah(s.id_sekolah);
                  setDropdownOpen(false);
                }}
                className="px-4 py-2.5 hover:bg-blue-50 hover:text-[#1E5AA5] cursor-pointer text-sm font-medium transition-colors"
              >
                {s.nama_sekolah}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // === JSX HALAMAN UTAMA ===
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
                    className="!text-[8px] !text-[#1E5AA5] !font-black tracking-[0.3em] !mb-1 uppercase"
                  />
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Buat <span className="text-[#2E5AA7]">Assessment Akademik</span>
                  </h1>
                </div>
              </div>

              <Button
                text="Kembali"
                icon={<ArrowLeft size={14} />}
                onClick={() => navigate("/ho/assessment/akademik")}
                className="group !bg-[#2E5AA7] hover:!bg-[#1C5496] !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
              />
            </header>
          </div>

          <div className="flex-1 overflow-hidden px-8 pb-6">
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-6">
              {/* INPUT TARGET & JUDUL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label text="Nama HO" required />
                  <HoPicker />
                </div>
                <div className="space-y-2">
                  <Label text="Sekolah Tujuan" required />
                  <SekolahPicker />
                </div>
              </div>

              <div className="space-y-2">
                <Label text="Nama Assessment" required />
                <Input
                  placeholder="Masukkan nama assessment..."
                  value={namaAssessment}
                  onChange={(e) => setNamaAssessment(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label text="Tenggat Pengisian (hari)" required />
                <Input
                  type="number"
                  placeholder="Contoh: 7"
                  value={tenggat}
                  onChange={(e) => setTenggat(Number(e.target.value))}
                  min={1}
                />
              </div>

              <hr className="border-gray-100" />

              {/* LIST PERTANYAAN */}
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    Daftar Pertanyaan
                  </h3>
                </div>

                {questions.map((q, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 p-5 md:p-6 rounded-2xl bg-[#FAFCFF] shadow-sm relative transition-all duration-300 hover:shadow-md hover:border-[#1E5AA5]/30 group"
                  >
                    {/* Nomor Soal & Tombol Hapus */}
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E5AA5] flex items-center justify-center font-black text-sm border border-blue-100 group-hover:bg-[#1E5AA5] group-hover:text-white transition-colors">
                          {index + 1}
                        </div>
                        <Label
                          text="Pertanyaan"
                          required
                          className="!mb-0 text-[#1E5AA5] font-bold"
                        />
                      </div>
                      <IconButton
                        icon={<Trash2 size={16} />}
                        onClick={() => removeQuestion(index)}
                        variant="danger"
                        title="Hapus Pertanyaan"
                      />
                    </div>

                    {/* Input Pertanyaan */}
                    <Input
                      placeholder="Tulis pertanyaan di sini..."
                      value={q.question}
                      onChange={(e) =>
                        handleQuestionChange(index, e.target.value)
                      }
                      className="mb-5 bg-white font-medium"
                    />

                    {/* Grid Pilihan Jawaban */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-inner">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="space-y-1.5">
                          <Label
                            text={`Pilihan ${String.fromCharCode(65 + optIndex)}`}
                            className="text-xs text-gray-500 font-semibold"
                          />
                          <Input
                            value={opt}
                            placeholder={`Jawaban ${String.fromCharCode(65 + optIndex)}`}
                            onChange={(e) =>
                              handleOptionChange(index, optIndex, e.target.value)
                            }
                            className="bg-gray-50/50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* TOMBOL TAMBAH PERTANYAAN */}
              <div className="flex">
                <Button
                  text="Tambah Pertanyaan Baru"
                  icon={<Plus size={18} />}
                  onClick={addQuestion}
                  variant="outline"
                  className="w-full border-dashed border-2 border-blue-200 text-[#1E5AA5] hover:bg-blue-50 py-3.5 rounded-2xl font-bold transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="px-8 pb-6 shrink-0">
            {/* FOOTER ACTION (SIMPAN) */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <Button
                text="Batal"
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-medium px-6"
                onClick={() => navigate("/ho/assessment/akademik")}
              />
              <Button
                text={loading ? "Menyimpan..." : "Simpan Assessment"}
                icon={<Save size={18} />}
                onClick={saveAssessment}
                disabled={loading}
                className="bg-[#1E5AA5] hover:bg-[#15437a] shadow-lg shadow-blue-900/20 px-8 py-3 rounded-xl font-bold"
              />
            </div>
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
}

export default CreateAssessmentAkademik;
