import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save, Banknote, CreditCard, Landmark } from "lucide-react";
import Swal from "sweetalert2";

// Komponen Atomik
import Sidebar from "../../../../components/Sidebar";
import Card from "../../../../components/Card";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import Button from "../../../../components/Button";

const CreateFinance = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_akun: "",
    nomor_rekening: "",
    bank: "Permata",
    keterangan: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/finance", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Berhasil", "Akun finance telah terdaftar", "success");
      navigate("/admin/finance");
    } catch (err) {
      Swal.fire("Gagal", "Periksa koneksi database", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F7FE] overflow-hidden font-sans text-gray-800">
      <Sidebar />
      <main className="flex-1 flex flex-col p-4 lg:p-8 overflow-hidden bg-[#F4F7FE]">
        <header className="flex-none flex items-center gap-4 bg-white p-5 rounded-3xl shadow-sm mb-8 border border-gray-50">
          <button
            onClick={() => navigate("/admin/finance")}
            className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-[#1E5AA5] transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              Registrasi <span className="text-[#1E5AA5]">Finance</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Input Sumber Dana Baru
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 pb-10"
          >
            <Card className="!p-8 !rounded-[2.5rem] !bg-white space-y-6">
              <h3 className="text-sm font-black uppercase border-b pb-3 flex items-center gap-2">
                <Banknote size={18} className="text-[#1E5AA5]" /> Informasi Dana
              </h3>
              <div className="space-y-4">
                <div>
                  <Label text="Nama Akun (Sumber Dana)" required />
                  <Input
                    placeholder="Contoh: CSR Astra 2026"
                    value={formData.nama_akun}
                    onChange={(e) =>
                      setFormData({ ...formData, nama_akun: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label text="Pilih Bank" required />
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 outline-none cursor-pointer"
                    value={formData.bank}
                    onChange={(e) =>
                      setFormData({ ...formData, bank: e.target.value })
                    }
                  >
                    <option value="Permata">Bank Permata</option>
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BNI">BNI</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="!p-8 !rounded-[2.5rem] !bg-white flex flex-col space-y-6">
              <h3 className="text-sm font-black uppercase border-b pb-3 flex items-center gap-2">
                <CreditCard size={18} className="text-[#1E5AA5]" /> Detail
                Rekening
              </h3>
              <div className="space-y-4 flex-1">
                <div>
                  <Label text="Nomor Rekening" required />
                  <Input
                    icon={<Landmark size={18} />}
                    placeholder="0000-0000-0000"
                    value={formData.nomor_rekening}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nomor_rekening: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label text="Keterangan" />
                  <textarea
                    className="w-full p-4 bg-gray-50 rounded-2xl h-20 outline-none focus:bg-white text-sm font-medium"
                    placeholder="Opsional..."
                    value={formData.keterangan}
                    onChange={(e) =>
                      setFormData({ ...formData, keterangan: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                text={loading ? "Proses..." : "Simpan Akun"}
                icon={<Save size={18} />}
                className="!bg-[#1E5AA5] !py-4 !rounded-2xl shadow-xl font-black uppercase mt-6 hover:brightness-110 active:scale-95 transition-all"
              />
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateFinance;
