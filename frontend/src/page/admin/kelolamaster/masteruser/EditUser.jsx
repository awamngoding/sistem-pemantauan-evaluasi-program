import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  ShieldCheck,
  RefreshCcw,
  Info,
} from "lucide-react";
import Swal from "sweetalert2";

// Komponen Atomik Anda
import Sidebar from "../../../../components/Sidebar";
import Card from "../../../../components/Card";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import Button from "../../../../components/Button";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    id_role: "",
    status: true,
  });

  // --- FETCH DATA LAMA ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          nama: res.data.nama,
          email: res.data.email,
          id_role: res.data.role?.id_role || "",
          status: res.data.status,
        });
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data pengguna", "error");
        navigate("/admin/users");
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Berhasil!", "Profil pengguna telah diperbarui", "success");
      navigate("/admin/users");
    } catch (err) {
      Swal.fire("Gagal", "Gagal memperbarui data pengguna", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F4F7FE]">
        <RefreshCcw className="animate-spin text-[#1E5AA5] mb-4" size={48} />
        <p className="font-black text-[10px] tracking-[0.3em] text-gray-400 uppercase">
          Sinkronisasi Profil...
        </p>
      </div>
    );

  return (
    <div className="flex h-screen bg-[#F4F7FE] overflow-hidden font-sans text-gray-800">
      <Sidebar />
      <main className="flex-1 flex flex-col p-4 lg:p-8 h-full overflow-hidden w-full bg-[#F4F7FE]">
        {/* HEADER AREA */}
        <header className="flex-none flex items-center justify-between bg-white p-5 rounded-3xl shadow-sm border border-gray-50 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-[#1E5AA5] transition-all border-none shadow-none"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight leading-none">
                Update <span className="text-[#1E5AA5]">Profil Pengguna</span>
              </h1>
              <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest italic">
                ID Akun: #{id.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#1E5AA5] rounded-xl border border-blue-100">
            <RefreshCcw size={12} className={loading ? "animate-spin" : ""} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Mode Pembaruan
            </span>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10"
          >
            {/* CARD KIRI: DATA UTAMA */}
            <Card className="lg:col-span-2 !p-8 !rounded-[2.5rem] !bg-white space-y-8 shadow-sm border border-gray-50">
              <h3 className="text-sm font-black uppercase border-b pb-3 flex items-center gap-2 text-gray-800">
                <User size={18} className="text-[#1E5AA5]" /> Informasi Dasar
                Pengguna
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label text="Nama Lengkap" required />
                  <Input
                    icon={<User size={18} />}
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label text="Email Sistem" required />
                  <Input
                    type="email"
                    icon={<Mail size={18} />}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label text="Status Aktivasi Akun" required />
                <div className="relative">
                  <ShieldCheck
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                    size={18}
                  />
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value === "true",
                      })
                    }
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 outline-none cursor-pointer focus:bg-white transition-all"
                  >
                    <option value="true">AKUN AKTIF / DIAKTIVASI</option>
                    <option value="false">NONAKTIF / SUSPENDED</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* CARD KANAN: KONFIRMASI */}
            <div className="space-y-6">
              <Card className="!p-8 !rounded-[2.5rem] !bg-white shadow-sm border border-gray-50 flex flex-col">
                <h3 className="text-sm font-black uppercase border-b pb-3 mb-6 flex items-center gap-2 text-gray-800">
                  <Info size={18} className="text-[#1E5AA5]" /> Verifikasi
                </h3>

                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 mb-8 flex-1">
                  <p className="text-[10px] text-blue-700 font-bold uppercase leading-relaxed tracking-wider">
                    Pastikan email sudah benar. Jika status diubah menjadi
                    Nonaktif, pengguna tidak akan bisa melakukan login sampai
                    status diaktifkan kembali oleh Admin.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    text={loading ? "Proses..." : "Update Profil"}
                    icon={<Save size={18} />}
                    className="!bg-[#1E5AA5] !py-4 !rounded-2xl !w-full shadow-xl shadow-blue-100 font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    text="Batal"
                    onClick={() => navigate("/admin/users")}
                    className="!w-full font-bold text-gray-400"
                  />
                </div>
              </Card>

              <div className="flex justify-center text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
                System Security v2.0
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditUser;
