/* eslint-disable no-unused-vars */
import Sidebar from "../../../components/Sidebar";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Label from "../../../components/Label";
import Input from "../../../components/Input";
import IconButton from "../../../components/IconButton";
import PageWrapper from "../../../components/PageWrapper";

import { Trash2, ArrowLeft, Save, Plus, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function EditAssessmentNonAkademik() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [questions, setQuestions] = useState([
    {
      question: "Apakah vendor memiliki standar keamanan kerja?",
      options: [
        "Ya, lengkap",
        "Ada tetapi tidak lengkap",
        "Tidak ada",
        "Tidak tahu",
      ],
    },
    {
      question: "Apakah vendor memiliki sertifikasi resmi?",
      options: ["ISO", "SNI", "Tidak memiliki", "Dalam proses"],
    },
    {
      question: "Bagaimana kualitas pelayanan vendor?",
      options: ["Sangat Baik", "Baik", "Cukup", "Buruk"],
    },
  ]);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await fetch(`http://localhost:3000/assessment/${id}`);
        const data = await res.json();

        console.log("DATA BACKEND:", data);

        setQuestions(data.questions || []);
      } catch (err) {
        console.error("Gagal mengambil assessment", err);
      }
    };

    fetchAssessment();
  }, [id]);

  // Edit pertanyaan
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  // Edit pilihan
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // Hapus soal
  const removeQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  // Tambah soal
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
      },
    ]);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:3000/assessment/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Gagal update assessment:", errorData);
        return;
      }

      const data = await res.json();
      console.log("UPDATE RESPONSE:", data);
      navigate("/ho/assessment/non-akademik");
    } catch (err) {
      console.error("Gagal update assessment", err);
    }
  };

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-auto px-4 md:px-12 pt-6 md:pt-10 pb-0">
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
                    Edit <span className="text-[#2E5AA7]">Assessment Non-Akademik</span>
                  </h1>
                </div>
              </div>

              <Button
                text="Kembali"
                icon={<ArrowLeft size={14} />}
                onClick={() => navigate("/ho/assessment/non-akademik")}
                className="group !bg-gray-100 hover:!bg-gray-200 !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-gray-600 shadow-lg active:scale-95 transition-all flex items-center gap-2"
              />
            </header>

            <div className="flex flex-row items-center gap-3 mb-6">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-[#2E5AA7] rounded-xl border border-blue-100 font-black text-[9px] uppercase tracking-[0.2em] shrink-0">
                <Plus size={14} /> Total: {questions.length} Pertanyaan
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-8 pb-6">
            <div className="space-y-6">
              {/* LIST PERTANYAAN */}
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
              <div className="flex justify-end pt-6 border-t border-gray-100">
                <Button
                  text="Simpan Perubahan"
                  icon={<Save size={14} />}
                  onClick={handleSave}
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

export default EditAssessmentNonAkademik;
