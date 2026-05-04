import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save, RefreshCcw } from "lucide-react";
import Swal from "sweetalert2";

// Komponen Atomik
import Sidebar from "../../../../components/Sidebar";
import Card from "../../../../components/Card";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import Button from "../../../../components/Button";

const EditFinance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_akun: "",
    nomor_rekening: "",
    bank: "",
    keterangan: "",
  });

  // --- FETCH DATA LAMA ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/finance/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
      } catch (err) {
        console.error("Gagal mengambil data finance:", err);
        navigate("/admin/finance");
      } finally {
        setFetching(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/finance/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Berhasil", "Data akun diperbarui", "success");
      navigate("/admin/finance");
    } catch (err) {
      Swal.fire("Gagal", "Gagal memperbarui data akun", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F4F7FE]">
        <RefreshCcw className="animate-spin text-[#1E5AA5]" size={40} />
      </div>
    );

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
              Edit <span className="text-[#1E5AA5]">Finance</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Update Informasi Rekening: #{id}
            </p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 pb-10"
          >
            <Card className="!p-8 !rounded-[2.5rem] !bg-white space-y-6">
              <h3 className="text-sm font-black uppercase border-b pb-3 text-[#1E5AA5]">
                Identitas Akun
              </h3>
              <div className="space-y-4">
                <div>
                  <Label text="Nama Akun" required />
                  <Input
                    value={formData.nama_akun}
                    onChange={(e) =>
                      setFormData({ ...formData, nama_akun: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label text="Nama Bank" required />
                  <Input
                    value={formData.bank}
                    onChange={(e) =>
                      setFormData({ ...formData, bank: e.target.value })
                    }
                  />
                </div>
              </div>
            </Card>

            <Card className="!p-8 !rounded-[2.5rem] !bg-white flex flex-col space-y-6">
              <h3 className="text-sm font-black uppercase border-b pb-3 text-[#1E5AA5]">
                Konfigurasi Transfer
              </h3>
              <div className="flex-1 space-y-6">
                <div>
                  <Label text="Nomor Rekening" required />
                  <Input
                    value={formData.nomor_rekening}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nomor_rekening: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                text={loading ? "Proses..." : "Simpan Perubahan"}
                icon={<Save size={18} />}
                className="!bg-[#1E5AA5] !py-4 !rounded-2xl shadow-xl font-black uppercase mt-10 hover:brightness-110 active:scale-95 transition-all"
              />
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditFinance;

