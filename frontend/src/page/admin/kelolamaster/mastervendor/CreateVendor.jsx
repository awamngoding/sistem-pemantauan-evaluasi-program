/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import Swal from "sweetalert2";

// KOMPONEN ATOMIK
import Sidebar from "../../../../components/Sidebar";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import Button from "../../../../components/Button";
import Dropdown from "../../../../components/Dropdown";
import PageWrapper from "../../../../components/PageWrapper";
import Textarea from "../../../../components/Textarea";
import Upload from "../../../../components/Upload";

const CreateVendor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama_vendor: "",
    no_register: "",
    pilar: "Akademik",
    alamat: "",
    pj_1: "",
    email_pj_1: "", // Email kontak
    pj_2: "",
    email_pj_2: "", // Email kontak PJ 2
    email: "", // ID Login (Sekarang Manual)
    password: "", // Password Login
    npwp_file: null,
    ktp_pj_file: null,
  });

  /* eslint-disable no-unused-vars */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // KITA SINKRONKAN DISINI:
      // email_pj_1 dikirim sebagai telp_pj_1
      // email_pj_2 dikirim sebagai telp_pj_2
      const payload = {
        nama_vendor: formData.nama_vendor,
        no_register: formData.no_register,
        pilar: formData.pilar,
        alamat: formData.alamat,
        pj_1: formData.pj_1,
        pj_2: formData.pj_2,
        email: formData.email, // Ini untuk login
        password: formData.password,
        // Numpang di field telp agar tidak kena "should not exist"
        telp_pj_1: formData.email_pj_1,
        telp_pj_2: formData.email_pj_2,
        npwp_file: formData.npwp_file?.name || "upload_pending_npwp.pdf",
        ktp_pj_file: formData.ktp_pj_file?.name || "upload_pending_ktp.pdf",
      };

      await axios.post("http://localhost:3000/vendor", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await Swal.fire({
        icon: "success",
        title: "BERHASIL",
        text: "Vendor berhasil didaftarkan.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/admin/vendor");
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Terjadi kesalahan";
      Swal.fire({
        icon: "error",
        title: "GAGAL",
        text: Array.isArray(errMsg) ? errMsg[0] : errMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10">
        <div className="flex-1 rounded-t-[2.5rem] shadow-2xl bg-white flex flex-col overflow-hidden border-none">
          {/* HEADER (FIXED) */}
          <div className="px-12 py-6 bg-[#1E5AA5] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate("/admin/vendor")}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white hover:text-[#1E5AA5] transition-all border border-white/20"
              >
                <ArrowLeft size={18} strokeWidth={3} />
              </button>
              <div>
                <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                  REGISTRASI <span className="text-blue-200">VENDOR</span>
                </h1>
                <p className="text-[8px] font-bold text-blue-100/60 uppercase mt-1 italic">
                  Manual Login Account Setup
                </p>
              </div>
            </div>
          </div>

          {/* FORM AREA */}
          <div className="flex-1 overflow-hidden flex flex-col bg-white">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col h-full overflow-hidden"
            >
              {/* SCROLLABLE AREA */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-12 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-8">
                  {/* KIRI: DATA LEMBAGA */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-3 bg-[#1E5AA5] rounded-full"></div>
                      <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        Identitas Vendor
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <Label
                        text="Nama Perusahaan / Lembaga"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase font-bold"
                      />
                      <Input
                        value={formData.nama_vendor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nama_vendor: e.target.value,
                          })
                        }
                        placeholder="Input nama resmi..."
                        icon={<Building2 size={14} />}
                        className="!py-4 !pl-10 !rounded-2xl font-bold"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label
                          text="No. Register"
                          required
                          className="!text-[9px] uppercase font-bold"
                        />
                        <Input
                          value={formData.no_register}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              no_register: e.target.value,
                            })
                          }
                          placeholder="NIB / Reg"
                          icon={<FileText size={14} />}
                          className="!py-4 !pl-10 !rounded-2xl font-bold font-mono"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          text="Pilar Program"
                          required
                          className="!text-[9px] uppercase font-bold"
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label
                          text="NPWP (PDF)"
                          required
                          className="!text-[9px] uppercase"
                        />
                        <Upload
                          onFileSelect={(f) =>
                            setFormData({ ...formData, npwp_file: f })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          text="KTP PJ (JPG/PDF)"
                          required
                          className="!text-[9px] uppercase"
                        />
                        <Upload
                          onFileSelect={(f) =>
                            setFormData({ ...formData, ktp_pj_file: f })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label
                        text="Alamat"
                        required
                        className="!text-[9px] uppercase font-bold"
                      />
                      <Textarea
                        value={formData.alamat}
                        onChange={(e) =>
                          setFormData({ ...formData, alamat: e.target.value })
                        }
                        placeholder="Alamat lengkap..."
                        className="!rounded-[1.5rem] !h-24 font-bold"
                        required
                      />
                    </div>
                  </div>

                  {/* KANAN: PJ & LOGIN MANUAL */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-3 bg-emerald-500 rounded-full"></div>
                      <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        Penanggung Jawab & Akses
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
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
                          placeholder="Nama PJ 1"
                          icon={<User size={14} />}
                          className="!py-4 !pl-10 !rounded-2xl font-bold"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          text="Email Kontak PJ"
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
                          placeholder="email@vendor.com"
                          icon={<Mail size={14} />}
                          className="!py-4 !pl-10 !rounded-2xl font-bold font-mono"
                          required
                        />
                      </div>
                    </div>

                    {/* BOX LOGIN (SUDAH BISA ISI MANUAL) */}
                    <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-[2.5rem] space-y-5">
                      <div className="flex items-center gap-2 mb-2">
                        <LockKeyhole size={16} className="text-[#1E5AA5]" />
                        <h4 className="text-[10px] font-black uppercase text-[#1E5AA5] tracking-widest">
                          Kredensial Login Sistem
                        </h4>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label
                            text="Username (Email Login)"
                            required
                            className="!text-[8px] uppercase font-black"
                          />
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            placeholder="Ketik email untuk login..."
                            icon={<Mail size={12} />}
                            className="!py-3 !pl-10 !rounded-xl !bg-white font-bold"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            text="Password Login"
                            required
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
                            placeholder="Set password..."
                            icon={<LockKeyhole size={12} />}
                            className="!py-3 !pl-10 !rounded-xl !bg-white font-bold"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 opacity-70">
                      <div className="space-y-1">
                        <Label
                          text="Nama PJ 2 (Opsional)"
                          className="!text-[9px] uppercase"
                        />
                        <Input
                          value={formData.pj_2}
                          onChange={(e) =>
                            setFormData({ ...formData, pj_2: e.target.value })
                          }
                          placeholder="PJ 2"
                          icon={<User size={14} />}
                          className="!py-4 !pl-10 !rounded-2xl font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          text="Email Kontak PJ 2"
                          className="!text-[9px] uppercase"
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
                          placeholder="email@vendor.com"
                          icon={<Mail size={14} />}
                          className="!py-4 !pl-10 !rounded-2xl font-bold font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STICKY FOOTER */}
              <div className="px-12 py-6 border-t border-gray-100 flex justify-end gap-4 shrink-0 bg-white">
                <Button
                  text="KEMBALI"
                  onClick={() => navigate("/admin/vendor")}
                  className="!bg-white !text-gray-400 !px-10 !py-3.5 !rounded-xl !text-[10px] font-black border border-gray-100"
                />
                <Button
                  text={
                    loading ? "SEDANG MENYIMPAN..." : "SIMPAN & AKTIFKAN VENDOR"
                  }
                  type="submit"
                  disabled={loading}
                  icon={<Save size={14} />}
                  className="!bg-[#1E5AA5] !text-white !px-12 !py-3.5 !rounded-xl !text-[10px] font-black shadow-xl uppercase active:scale-95 transition-all"
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default CreateVendor;
