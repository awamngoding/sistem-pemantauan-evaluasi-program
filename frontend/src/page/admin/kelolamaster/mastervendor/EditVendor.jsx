/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  Building2,
  Mail,
  ShieldCheck,
  User,
  LockKeyhole,
  FileText,
  RefreshCcw,
  Tags,
  MapPin,
} from "lucide-react";
import Swal from "sweetalert2";

// Import Komponen Atomik
import Sidebar from "../../../../components/Sidebar";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import Button from "../../../../components/Button";
import PageWrapper from "../../../../components/PageWrapper";
import Dropdown from "../../../../components/Dropdown";
import Textarea from "../../../../components/Textarea";

const EditVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama_vendor: "",
    no_register: "",
    pilar: "Akademik",
    alamat: "",
    pj_1: "",
    email_pj_1: "", // Kontak PJ 1
    pj_2: "",
    email_pj_2: "", // Kontak PJ 2
    email: "", // Akun Login
    password: "", // Kosongkan jika tidak ingin ganti pass
    status: "Bermitra",
  });

  // --- 1. FETCH DATA VENDOR ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setFetching(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/vendor/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setFormData({
          nama_vendor: data.nama_vendor,
          no_register: data.no_register,
          pilar: data.pilar || "Akademik",
          alamat: data.alamat,
          pj_1: data.pj_1,
          email_pj_1: data.telp_pj_1, // Kita ambil dari field telp
          pj_2: data.pj_2 || "",
          email_pj_2: data.telp_pj_2 || "", // Kita ambil dari field telp
          email: data.user?.email || data.email || "", // Ambil dari relation user
          status: data.status,
          password: "", // Jangan tampilkan password lama
        });
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data rekanan", "error");
        navigate("/admin/vendor");
      } finally {
        setFetching(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  // --- 2. SUBMIT UPDATE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Sinkronisasi: Mapping email kontak kembali ke field telp di DB
      const updatePayload = {
        pilar: formData.pilar,
        alamat: formData.alamat,
        pj_1: formData.pj_1,
        telp_pj_1: formData.email_pj_1,
        pj_2: formData.pj_2,
        telp_pj_2: formData.email_pj_2,
        email: formData.email, // Update email login
        status: formData.status,
      };

      // Hanya kirim password jika diisi (untuk ganti password)
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      await axios.patch(`http://localhost:3000/vendor/${id}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Swal.fire({
        icon: "success",
        title: "Update Berhasil",
        text: "Profil vendor dan akun telah diperbarui.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/admin/vendor");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Gagal menyimpan perubahan";
      Swal.fire("Gagal", Array.isArray(errMsg) ? errMsg[0] : errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-screen flex items-center justify-center bg-[#EEF5FF]">
        <div className="flex flex-col items-center gap-4 text-[#1E5AA5]">
          <RefreshCcw className="animate-spin" size={48} />
          <span className="font-black text-[10px] tracking-[0.3em] uppercase italic">
            Synchronizing Data...
          </span>
        </div>
      </div>
    );

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10">
        <div className="flex-1 rounded-t-[2.5rem] shadow-2xl bg-white flex flex-col overflow-hidden border-none">
          {/* HEADER SECTION */}
          <div className="px-12 py-8 bg-[#1E5AA5] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate("/admin/vendor")}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white hover:text-[#1E5AA5] transition-all border border-white/20"
              >
                <ArrowLeft size={18} strokeWidth={3} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                  MODIFIKASI <span className="text-blue-200">VENDOR</span>
                </h1>
                <p className="text-[9px] font-bold text-blue-100/70 tracking-widest uppercase mt-2 italic">
                  ID: #{id.slice(-6).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* FORM AREA */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-12 py-10 bg-white">
            <form
              onSubmit={handleSubmit}
              className="max-w-6xl mx-auto flex flex-col gap-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-12">
                {/* KIRI: DATA LEMBAGA (BEBERAPA LOCKED) */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-gray-300 rounded-full"></div>
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      Master Identity (Fixed)
                    </h3>
                  </div>

                  <div className="space-y-2 opacity-60">
                    <Label
                      text="Nama Perusahaan / Lembaga"
                      className="!text-[9px] uppercase"
                    />
                    <Input
                      value={formData.nama_vendor}
                      disabled
                      icon={<Building2 size={14} />}
                      className="!py-4 !pl-10 !rounded-2xl font-bold bg-gray-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 opacity-60">
                      <Label
                        text="No. Register"
                        className="!text-[9px] uppercase"
                      />
                      <Input
                        value={formData.no_register}
                        disabled
                        icon={<FileText size={14} />}
                        className="!py-4 !pl-10 !rounded-2xl font-bold font-mono bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        text="Pilar Program"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase font-black"
                      />
                      <Dropdown
                        value={formData.pilar}
                        onChange={(val) =>
                          setFormData({ ...formData, pilar: val })
                        }
                        items={[
                          { label: "AKADEMIK", value: "Akademik" },
                          { label: "KARAKTER", value: "Karakter" },
                          { label: "SENI BUDAYA", value: "Seni Budaya" },
                          {
                            label: "KECAKAPAN HIDUP",
                            value: "Kecakapan Hidup",
                          },
                        ]}
                        className="!py-4 !rounded-2xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      text="Alamat Operasional"
                      required
                      className="!text-[9px] text-[#1E5AA5] uppercase font-black"
                    />
                    <Textarea
                      value={formData.alamat}
                      onChange={(e) =>
                        setFormData({ ...formData, alamat: e.target.value })
                      }
                      placeholder="Update alamat..."
                      className="!rounded-[1.5rem] !h-32 font-bold"
                      required
                    />
                  </div>
                </div>

                {/* KANAN: PJ & LOGIN (EDITABLE) */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      Update Penanggung Jawab & Akses
                    </h3>
                  </div>

                  {/* PJ 1 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        text="Nama PJ Utama"
                        required
                        className="!text-[9px] uppercase"
                      />
                      <Input
                        value={formData.pj_1}
                        onChange={(e) =>
                          setFormData({ ...formData, pj_1: e.target.value })
                        }
                        icon={<User size={14} />}
                        className="!py-4 !pl-10 !rounded-2xl font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        text="Email Kontak PJ 1"
                        required
                        className="!text-[9px] uppercase"
                      />
                      <Input
                        type="email"
                        value={formData.email_pj_1}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email_pj_1: e.target.value,
                          })
                        }
                        icon={<Mail size={14} />}
                        className="!py-4 !pl-10 !rounded-2xl font-bold font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* BOX LOGIN (MANUAL EDIT) */}
                  <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-[2.5rem] space-y-5 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <LockKeyhole size={16} className="text-[#1E5AA5]" />
                      <h4 className="text-[10px] font-black uppercase text-[#1E5AA5] tracking-widest">
                        Akses Login System
                      </h4>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label
                          text="Username Login (Email)"
                          required
                          className="!text-[8px] uppercase font-black"
                        />
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          icon={<Mail size={12} />}
                          className="!py-3 !pl-10 !rounded-xl !bg-white font-bold"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          text="Password Baru (Opsional)"
                          className="!text-[8px] uppercase font-black"
                        />
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          placeholder="Isi jika ingin ganti password"
                          icon={<LockKeyhole size={12} />}
                          className="!py-3 !pl-10 !rounded-xl !bg-white font-bold text-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PJ 2 (BISA DITAMBAHKAN DI SINI) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        text="Nama PJ 2 (Pendamping)"
                        className="!text-[9px] uppercase text-gray-400"
                      />
                      <Input
                        value={formData.pj_2}
                        onChange={(e) =>
                          setFormData({ ...formData, pj_2: e.target.value })
                        }
                        placeholder="Tambahkan PJ 2..."
                        icon={<User size={14} />}
                        className="!py-4 !pl-10 !rounded-2xl font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        text="Email Kontak PJ 2"
                        className="!text-[9px] uppercase text-gray-400"
                      />
                      <Input
                        type="email"
                        value={formData.email_pj_2}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email_pj_2: e.target.value,
                          })
                        }
                        placeholder="email@pj2.com"
                        icon={<Mail size={14} />}
                        className="!py-4 !pl-10 !rounded-2xl font-bold font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-4 pt-10 pb-10 border-t border-gray-100 shrink-0">
                <Button
                  text="BATALKAN"
                  onClick={() => navigate("/admin/vendor")}
                  className="!bg-white !text-gray-400 !px-10 !py-3.5 !rounded-xl !text-[10px] font-black border border-gray-100 uppercase"
                />
                <Button
                  text={
                    loading ? "SEDANG MENYIMPAN..." : "PERBARUI DATA VENDOR"
                  }
                  type="submit"
                  disabled={loading}
                  icon={<Save size={14} />}
                  className="!bg-[#1E5AA5] !text-white !px-12 !py-3.5 !rounded-xl !text-[10px] font-black shadow-xl border-none uppercase tracking-widest active:scale-95 transition-all"
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default EditVendor;
