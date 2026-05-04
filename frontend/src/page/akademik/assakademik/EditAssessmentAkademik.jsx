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

function EditAssessmentAkademik() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await fetch(`http://localhost:3000/assessment/${id}`);
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error("Gagal mengambil assessment", err);
      }
    };
    fetchAssessment();
  }, [id]);

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

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""] }]);
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

      navigate("/ho/assessment/akademik");
    } catch (err) {
      console.error("Gagal update assessment", err);
    }
  };

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
                    Edit <span className="text-[#2E5AA7]">Assessment Akademik</span>
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

            <div className="flex flex-row items-center gap-3 mb-6">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-[#1E5AA5] rounded-xl border border-blue-100 font-black text-[9px] uppercase tracking-[0.2em] shrink-0">
                Total: {questions.length} Pertanyaan
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-8 pb-6">
            {/* LIST PERTANYAAN */}
            <div className="space-y-6">
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
                        className="!mb-0 text-gray-700 font-bold"
                      />
                    </div>
                    <IconButton
                      icon={<Trash2 size={16} />}
                      variant="danger"
                      onClick={() => removeQuestion(index)}
                      title="Hapus Pertanyaan"
                    />
                  </div>

                  {/* Input Pertanyaan */}
                  <Input
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(index, e.target.value)
                    }
                    placeholder="Masukkan pertanyaan di sini..."
                    className="mb-5 bg-white font-medium"
                  />

                  {/* Grid Pilihan Jawaban */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-inner">
                    {q.options.map((opt, i) => (
                      <div key={i} className="space-y-1.5">
                        <Label
                          text={`Pilihan ${String.fromCharCode(65 + i)}`}
                          className="text-xs text-gray-500 font-semibold"
                        />
                        <Input
                          value={opt}
                          placeholder={`Jawaban ${String.fromCharCode(65 + i)}`}
                          onChange={(e) =>
                            handleOptionChange(index, i, e.target.value)
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
            <div className="flex mt-6">
              <Button
                text="Tambah Pertanyaan Baru"
                icon={<Plus size={18} />}
                onClick={addQuestion}
                variant="outline"
                className="w-full border-dashed border-2 border-blue-200 text-[#1E5AA5] hover:bg-blue-50 py-3.5 rounded-2xl font-bold transition-colors"
              />
            </div>
          </div>

          <div className="px-8 pb-6 shrink-0">
            {/* FOOTER ACTION (SIMPAN) */}
            <div className="flex justify-end pt-6 border-t border-gray-100">
              <Button
                text="Simpan Perubahan"
                icon={<Save size={18} />}
                onClick={handleSave}
                className="bg-[#1E5AA5] hover:bg-[#15437a] shadow-lg shadow-blue-900/20 px-8 py-3 rounded-xl font-bold"
              />
            </div>
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
}

export default EditAssessmentAkademik;
