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

function CreateAssessmentNonAkademik() {
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

  // FETCH HO LIST
  useEffect(() => {
    const fetchHo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/users/ho", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("[DEBUG 1] Data Asli dari Backend:", data);

        // --- PERUBAHAN DI SINI: Filter khusus non-akademik ---
        if (Array.isArray(data)) {
          if (data.length > 0) {
            console.log("[DEBUG 2] Contoh satu data user:", data[0]);
            console.log(
              "[DEBUG 3] Apakah ada properti 'jenis'?:",
              data[0].jenis !== undefined ? "ADA" : "TIDAK ADA",
            );
          }
          const filteredHo = data.filter((ho) => ho.jenis === "non-akademik");

          console.log("[DEBUG 4] Hasil Setelah Difilter:", filteredHo);
          setHoList(filteredHo);
        } else {
          setHoList([]);
        }
        // -----------------------------------------------------

        console.log("HO DATA:", data);
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

  // TAMBAH PERTANYAAN
  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""] }]);
  };

  // HAPUS PERTANYAAN
  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // EDIT PERTANYAAN
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  // EDIT PILIHAN
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

      const resBody = await res.json(); // HARUS di atas

      console.log("RESPONSE BODY:", JSON.stringify(resBody, null, 2));

      if (!res.ok) {
        console.error("BACKEND ERROR:", JSON.stringify(resBody, null, 2));
        toast.error(resBody.message || "Gagal membuat assessment");
        return;
      }

      toast.success("Assessment berhasil dibuat!");
      navigate("/ho/assessment/non-akademik");
    } catch (err) {
      console.error(err);
      toast.error("Gagal membuat assessment. Cek console untuk detail.");
    } finally {
      setLoading(false);
    }
  };

  // === HoPicker Component ===
  function HoPicker() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSelect = (hoId) => {
      setSelectedHo(hoId);
      setDropdownOpen(false);
    };

    const selectedHoName =
      hoList.find((h) => h.id_user === selectedHo)?.nama || "Pilih HO";

    return (
      <div className="relative w-full max-w-xs">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full border px-4 py-2 text-left bg-white rounded shadow"
        >
          {selectedHoName}
        </button>

        {dropdownOpen && (
          <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-y-auto">
            {hoList.map((ho) => (
              <li
                key={ho.id_user}
                onClick={() => handleSelect(ho.id_user)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
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
      <div className="relative w-full max-w-xs">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full border px-4 py-2 text-left bg-white rounded shadow"
        >
          {selectedSekolahName}
        </button>

        {dropdownOpen && (
          <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-y-auto">
            {sekolahList.map((s) => (
              <li
                key={s.id_sekolah}
                onClick={() => {
                  setSelectedSekolah(s.id_sekolah);
                  setDropdownOpen(false);
                }}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
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
                    className="!text-[8px] !text-[#2E5AA7] !font-black tracking-[0.3em] !mb-1 uppercase"
                  />
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Buat <span className="text-[#2E5AA7]">Assessment Non-Akademik</span>
                  </h1>
                </div>
              </div>

              <Button
                text="Kembali"
                icon={<ArrowLeft size={14} />}
                onClick={() => navigate("/ho/assessment/non-akademik")}
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
                  className="!pl-4 !pr-4 !py-2.5 !bg-gray-50/80 !border-gray-200/50 !rounded-xl !text-sm !font-medium outline-none focus:!bg-white focus:!ring-4 focus:!ring-blue-100/50 transition-all shadow-sm"
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
                  className="!pl-4 !pr-4 !py-2.5 !bg-gray-50/80 !border-gray-200/50 !rounded-xl !text-sm !font-medium outline-none focus:!bg-white focus:!ring-4 focus:!ring-blue-100/50 transition-all shadow-sm"
                />
              </div>

              <hr className="border-gray-100" />

              {/* LIST PERTANYAAN */}
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    Daftar Pertanyaan
                  </h3>
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-[#2E5AA7] rounded-xl border border-blue-100 font-black text-[9px] uppercase tracking-[0.2em] shrink-0">
                    <Plus size={14} /> Total: {questions.length} Pertanyaan
                  </div>
                </div>

                {questions.map((q, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 p-5 rounded-xl bg-[#FAFCFF] shadow-sm relative transition-all duration-300 hover:shadow-md hover:border-[#2E5AA7]/30"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <Label
                        text={`Pertanyaan ${index + 1}`}
                        required
                        className="text-[#2E5AA7] font-bold"
                      />
                      <IconButton
                        icon={<Trash2 size={16} />}
                        onClick={() => removeQuestion(index)}
                        variant="danger"
                        title="Hapus Pertanyaan"
                      />
                    </div>

                    <Input
                      placeholder="Tulis pertanyaan di sini..."
                      value={q.question}
                      onChange={(e) =>
                        handleQuestionChange(index, e.target.value)
                      }
                      className="mb-4 !pl-4 !pr-4 !py-2.5 !bg-white !border-gray-200/50 !rounded-xl !text-sm !font-medium outline-none focus:!bg-white focus:!ring-4 focus:!ring-blue-100/50 transition-all shadow-sm"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-gray-100">
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
                            className="!pl-4 !pr-4 !py-2.5 !bg-gray-50/80 !border-gray-200/50 !rounded-xl !text-sm !font-medium outline-none focus:!bg-white focus:!ring-4 focus:!ring-blue-100/50 transition-all shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  text="+ Tambah Pertanyaan"
                  icon={<Plus size={16} />}
                  onClick={addQuestion}
                  variant="ghost"
                  className="w-full max-w-md border-dashed border-2 border-blue-200 text-[#2E5AA7] hover:bg-blue-50 py-3 !rounded-xl"
                />
              </div>

              {/* TOMBOL ACTION */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <Button
                  text="Batal"
                  icon={<ArrowLeft size={14} />}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 !rounded-xl !px-5 !py-2.5"
                  onClick={() => navigate("/ho/assessment/non-akademik")}
                />
                <Button
                  text="Simpan Assessment"
                  icon={<Save size={14} />}
                  onClick={saveAssessment}
                  loading={loading}
                  className="group !bg-[#2E5AA7] hover:!bg-[#1c5496] !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
                />
              </div>
            </div>
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
}
export default CreateAssessmentNonAkademik;
