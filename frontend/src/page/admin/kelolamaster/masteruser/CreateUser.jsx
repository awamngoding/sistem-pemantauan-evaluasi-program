import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Lock,
  Shield,
  MapPin,
  UserPlus,
  Info,
} from "lucide-react";
import Sidebar from "../../../../components/Sidebar";
import Card from "../../../../components/Card";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import Button from "../../../../components/Button";
import Swal from "sweetalert2";

const CreateUser = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [wilayah, setWilayah] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    id_role: "",
    id_wilayah: "",
    jenis: "pusat",
    status: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [resRoles, resWilayah] = await Promise.all([
          axios.get("http://localhost:3000/roles", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/wilayah", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setRoles(resRoles.data);
        setWilayah(resWilayah.data);
      } catch (err) {
        console.error("Gagal mengambil data referensi:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/users", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Berhasil!", "Akun pengguna baru telah diaktifkan", "success");
      navigate("/admin/users");
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Terjadi kesalahan sistem",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F7FE] overflow-hidden font-sans text-gray-800">
      <Sidebar />

      <main className="flex-1 flex flex-col p-4 lg:p-8 h-full overflow-hidden w-full bg-[#F4F7FE]">
        {/* HEADER AREA */}
        <header className="flex-none flex items-center justify-between bg-white p-5 rounded-3xl shadow-sm border border-gray-50 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-[#1E5AA5] transition-all border-none shadow-none"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight leading-none">
                Registrasi <span className="text-[#1E5AA5]">Pengguna Baru</span>
              </h1>
              <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-widest italic">
                Pembuatan kredensial akses sistem YPA-MDR
              </p>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <form
            onSubmit={handleSubmit}
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10"
          >
            {/* Kiri & Tengah: Identitas & Kredensial */}
            <Card className="lg:col-span-2 !p-8 !rounded-[2.5rem] !bg-white space-y-8 shadow-sm border border-gray-50">
              <h3 className="text-sm font-black uppercase border-b pb-3 flex items-center gap-2">
                <UserPlus size={18} className="text-[#1E5AA5]" /> Informasi Akun
                & Keamanan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label text="Nama Lengkap Personnel" required />
                  <Input
                    icon={<User size={18} />}
                    placeholder="Contoh: Budi Santoso"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label text="Alamat Email Resmi" required />
                  <Input
                    type="email"
                    icon={<Mail size={18} />}
                    placeholder="budi@ypamdr.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label text="Akses Peran (Role)" required />
                  <div className="relative">
                    <Shield
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <select
                      required
                      value={formData.id_role}
                      onChange={(e) =>
                        setFormData({ ...formData, id_role: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 outline-none appearance-none cursor-pointer focus:bg-white transition-all"
                    >
                      <option value="">Pilih Role...</option>
                      {roles.map((r) => (
                        <option key={r.id_role} value={r.id_role}>
                          {r.nama_role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label text="Setel Password Akses" required />
                  <Input
                    type="password"
                    icon={<Lock size={18} />}
                    placeholder="******"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label text="Wilayah Penugasan (Opsional)" />
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <select
                    value={formData.id_wilayah}
                    onChange={(e) =>
                      setFormData({ ...formData, id_wilayah: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 outline-none appearance-none cursor-pointer focus:bg-white transition-all"
                  >
                    <option value="">
                      Pilih Wilayah (Kosongkan jika Admin Pusat)...
                    </option>
                    {wilayah.map((w) => (
                      <option key={w.id_wilayah} value={w.id_wilayah}>
                        {w.nama_wilayah}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Kanan: Action & Info */}
            <div className="space-y-6">
              <Card className="!p-8 !rounded-[2.5rem] !bg-white shadow-sm border border-gray-50 flex flex-col">
                <h3 className="text-sm font-black uppercase border-b pb-3 mb-6 flex items-center gap-2">
                  <Info size={18} className="text-[#1E5AA5]" /> Verifikasi
                  Sistem
                </h3>

                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 mb-8 flex-1">
                  <p className="text-[10px] text-blue-700 font-bold uppercase leading-relaxed tracking-wider">
                    Setiap akun yang didaftarkan akan langsung memiliki hak
                    akses sesuai dengan Role yang dipilih. Pastikan alamat email
                    aktif untuk keperluan pemulihan password.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  text={loading ? "Mendaftarkan..." : "Daftarkan Pengguna"}
                  icon={<Save size={18} />}
                  className="!bg-[#1E5AA5] !py-4 !rounded-2xl !w-full shadow-xl shadow-blue-100 font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
                />
              </Card>

              <div className="flex justify-center text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
                YPA-MDR Security v2.0
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateUser;
