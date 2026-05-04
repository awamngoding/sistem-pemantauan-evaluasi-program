/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  School,
  Award,
  MapPin,
  Info,
  Database,
  BookOpen,
  Hash, // Icon tambahan untuk NPSN
  User,
  LockKeyhole,
} from "lucide-react";
import Swal from "sweetalert2";

// Komponen Atomik Premium
import Sidebar from "../../../../components/Sidebar";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import Button from "../../../../components/Button";
import Dropdown from "../../../../components/Dropdown";
import PageWrapper from "../../../../components/PageWrapper";

const CreateSekolah = () => {
  const navigate = useNavigate();
  const [wilayahList, setWilayahList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    npsn: "", // TAMBAHKAN INI
    nama_sekolah: "",
    jenjang: "SD",
    akreditasi: "A",
    id_wilayah: "",
    alamat: "",
    email_login: "",
    password_login: "",
  });

  useEffect(() => {
    const fetchWilayah = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/wilayah", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formatted = res.data.map((w) => ({
          value: w.id_wilayah,
          label: w.nama_wilayah, // Pakai nama full dulu buat ngetes
        }));
        setWilayahList(formatted);
      } catch (err) {
        console.error("Gagal ambil wilayah", err);
      }
    };
    fetchWilayah();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi awal di frontend
    if (!formData.id_wilayah) {
      return Swal.fire(
        "Peringatan",
        "Pilih wilayah penugasan terlebih dahulu",
        "warning",
      );
    }

    if (!formData.email_login || !formData.password_login) {
      return Swal.fire(
        "Peringatan",
        "Email login dan password wajib diisi",
        "warning",
      );
    }

    if (formData.password_login.length < 8) {
      return Swal.fire(
        "Peringatan",
        "Password minimal harus 8 karakter",
        "warning",
      );
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Pastikan payload bersih dan tipe data benar
      const payload = {
        ...formData,
        id_wilayah: Number(formData.id_wilayah), // Konversi manual tetap bagus untuk keamanan
        // Pastikan key email_login dan password_login ada di formData jika form ini sekaligus register login
      };

      await axios.post("http://localhost:3000/sekolah", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Unit sekolah baru telah didaftarkan",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/admin/sekolah");
    } catch (err) {
      // --- PROSES ERROR BIAR GAK MUNCUL [OBJECT OBJECT] ---
      const errorResponse = err.response?.data;
      let pesanError = "Terjadi kesalahan internal pada server.";

      if (errorResponse?.message) {
        // Jika NestJS kirim banyak error (Array), kita gabung pakai <br>
        if (Array.isArray(errorResponse.message)) {
          pesanError = errorResponse.message.join("<br>");
        } else {
          pesanError = errorResponse.message;
        }
      }

      // Tampilkan menggunakan 'html' supaya tag <br> terbaca sebagai baris baru
      Swal.fire({
        icon: "error",
        title: "Gagal Simpan",
        html: `<div style="text-align: left; font-size: 14px;">${pesanError}</div>`,
        confirmButtonText: "Perbaiki Data",
        confirmButtonColor: "#ef4444",
      });

      console.error("Detail Error:", errorResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <div className="flex-1 !m-0 !p-0 !rounded-t-[2.5rem] !rounded-b-none border-none shadow-2xl bg-white flex flex-col overflow-hidden relative">
          {/* HEADER BAR */}
          <div className="px-8 md:px-16 pt-12 pb-10 flex flex-col md:flex-row items-center justify-between bg-[#1E5AA5] shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-6 relative z-10">
              <button
                onClick={() => navigate("/admin/sekolah")}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white hover:text-[#1E5AA5] transition-all border border-white/20 shadow-lg backdrop-blur-md group"
              >
                <ArrowLeft
                  size={18}
                  strokeWidth={3}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </button>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
                  REGISTRASI <span className="text-blue-200">UNIT SEKOLAH</span>
                </h1>
                <p className="text-[9px] font-bold text-blue-100/70 tracking-widest uppercase italic mt-2">
                  Educational Entity Registry System
                </p>
              </div>
            </div>
          </div>

          {/* FORM AREA */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 md:px-16 py-10 bg-white">
            <form
              onSubmit={handleSubmit}
              className="max-w-6xl mx-auto h-full flex flex-col"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-10 pt-5 flex-1">
                {/* KOLOM KIRI */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-[#1E5AA5] rounded-full"></div>
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      School Identity
                    </h3>
                  </div>

                  {/* BARIS NPSN & NAMA (Grid 1:2) */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 space-y-2">
                      <Label
                        text="NPSN"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase"
                      />
                      <div className="relative">
                        <Input
                          placeholder="8 digit"
                          value={formData.npsn}
                          onChange={(e) =>
                            setFormData({ ...formData, npsn: e.target.value })
                          }
                          className="!py-4 !pl-10 !bg-white !border-gray-200 !rounded-2xl font-mono font-bold"
                          required
                        />
                        <Hash
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
                          size={14}
                        />
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label
                        text="Nama Lengkap Sekolah"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase"
                      />
                      <div className="relative">
                        <Input
                          placeholder="SMKN 01 Purworejo"
                          value={formData.nama_sekolah}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nama_sekolah: e.target.value,
                            })
                          }
                          className="!py-4 !pl-10 !bg-white !border-gray-200 !rounded-2xl font-bold"
                          required
                        />
                        <School
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
                          size={14}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        text="Jenjang"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase"
                      />
                      <Dropdown
                        icon={BookOpen}
                        value={formData.jenjang}
                        onChange={(val) =>
                          setFormData({ ...formData, jenjang: val })
                        }
                        items={[
                          { label: "SD", value: "SD" },
                          { label: "SMP", value: "SMP" },
                          { label: "SMA", value: "SMA" },
                          { label: "SMK", value: "SMK" },
                        ]}
                        className="!py-4 !rounded-2xl font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        text="Akreditasi"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase"
                      />
                      <Dropdown
                        icon={Award}
                        value={formData.akreditasi}
                        onChange={(val) =>
                          setFormData({ ...formData, akreditasi: val })
                        }
                        items={[
                          { label: "Grade A", value: "A" },
                          { label: "Grade B", value: "B" },
                          { label: "Grade C", value: "C" },
                        ]}
                        className="!py-4 !rounded-2xl font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* KOLOM KANAN */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      Regional Placement
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label
                      text="Wilayah Penugasan"
                      required
                      className="!text-[9px] text-[#1E5AA5] uppercase"
                    />
                    <Dropdown
                      icon={MapPin}
                      label="PILIH WILAYAH"
                      value={formData.id_wilayah}
                      onChange={(val) =>
                        setFormData({ ...formData, id_wilayah: val })
                      }
                      items={wilayahList}
                      className="!py-4 !rounded-2xl font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      text="Alamat Lengkap"
                      required
                      className="!text-[9px] text-[#1E5AA5] uppercase"
                    />
                    <textarea
                      className="w-full p-5 bg-gray-50 rounded-[2rem] outline-none h-28 text-xs font-bold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all border border-gray-100"
                      placeholder="Input alamat detail..."
                      value={formData.alamat}
                      onChange={(e) =>
                        setFormData({ ...formData, alamat: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      Login Credentials
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label
                      text="Email Login"
                      required
                      className="!text-[9px] text-[#1E5AA5] uppercase"
                    />
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="admin@sekolah.com"
                        value={formData.email_login}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email_login: e.target.value,
                          })
                        }
                        className="!py-4 !pl-10 !bg-white !border-gray-200 !rounded-2xl font-bold"
                        required
                      />
                      <User
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
                        size={14}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      text="Password Login"
                      required
                      className="!text-[9px] text-[#1E5AA5] uppercase"
                    />
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="Minimal 8 karakter"
                        value={formData.password_login}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password_login: e.target.value,
                          })
                        }
                        className="!py-4 !pl-10 !bg-white !border-gray-200 !rounded-2xl font-bold"
                        required
                      />
                      <LockKeyhole
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
                        size={14}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end items-center gap-4 pt-10 pb-10">
                <Button
                  text="BATALKAN"
                  onClick={() => navigate("/admin/sekolah")}
                  className="!bg-white !text-gray-400 !px-10 !py-3 !rounded-xl !text-[9px] font-black border border-gray-100 uppercase"
                />
                <Button
                  text={loading ? "SAVING..." : "SIMPAN UNIT SEKOLAH"}
                  type="submit"
                  disabled={loading}
                  icon={<Save size={14} />}
                  className="!bg-[#2E5AA7] !text-white !px-12 !py-3 !rounded-xl !text-[9px] font-black shadow-xl border-none uppercase"
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default CreateSekolah;
