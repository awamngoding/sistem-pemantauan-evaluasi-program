/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  MapPin,
  ShieldCheck,
  Info,
  Lock,
  Mail,
  User,
  X,
  Plus as PlusIcon,
  Database,
  Phone,
  Briefcase,
} from "lucide-react";
import Swal from "sweetalert2";

// Komponen Internal
import Sidebar from "../../../../components/Sidebar";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import Dropdown from "../../../../components/Dropdown";
import PageWrapper from "../../../../components/PageWrapper";

const Create_AO = () => {
  const navigate = useNavigate();
  const [is_loading, set_is_loading] = useState(false);
  const [wilayah_options, set_wilayah_options] = useState([]);

  const [form_data, set_form_data] = useState({
    nama_lengkap: "",
    email_user: "",
    password_user: "",
    role_user: "AO",
    wilayah_ids: [""],
    nomor_whatsapp: "",
  });

  useEffect(() => {
    const fetch_wilayah = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/wilayah", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formatted = res.data
          .filter((item) => item.status === true)
          .map((item) => ({
            value: item.id_wilayah,
            label: item.nama_wilayah.split("/").pop().toUpperCase(),
          }));
        set_wilayah_options(formatted);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    fetch_wilayah();
  }, []);

  const addWilayahField = () => {
    set_form_data({
      ...form_data,
      wilayah_ids: [...form_data.wilayah_ids, ""],
    });
  };

  const removeWilayahField = (index) => {
    const updated = [...form_data.wilayah_ids];
    updated.splice(index, 1);
    set_form_data({ ...form_data, wilayah_ids: updated });
  };

  const handleWilayahChange = (index, value) => {
    const updated = [...form_data.wilayah_ids];
    updated[index] = value;
    set_form_data({ ...form_data, wilayah_ids: updated });
  };

  const handle_input_change = (e) => {
    const { name, value } = e.target;
    set_form_data((prev) => ({ ...prev, [name]: value }));
  };

  const handle_form_submit = async (e) => {
    e.preventDefault();
    const finalWilayahIds = form_data.wilayah_ids.filter((id) => id !== "");

    if (finalWilayahIds.length === 0)
      return Swal.fire(
        "Peringatan",
        "Minimal satu wilayah wajib dipilih!",
        "warning",
      );

    set_is_loading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        nama: form_data.nama_lengkap,
        email: form_data.email_user,
        password: form_data.password_user,
        id_wilayahs: finalWilayahIds.map((id) => Number(id)),
        no_telp: form_data.nomor_whatsapp,
        id_role: 4,
        jabatan: "Area Officer",
      };

      await axios.post("http://localhost:3000/users/register_ao", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Akun Area Officer Telah Diaktifkan",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/admin/ao");
    } catch (error) {
      Swal.fire(
        "Gagal",
        error.response?.data?.message || "Terjadi kesalahan server",
        "error",
      );
    } finally {
      set_is_loading(false);
    }
  };

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <div className="flex-1 !m-0 !p-0 !rounded-t-[2.5rem] !rounded-b-none border-none shadow-2xl bg-white flex flex-col overflow-hidden relative">
          {/* TOP HEADER BAR - BLUE LUXURY */}
          <div className="px-8 md:px-16 pt-12 pb-10 flex flex-col md:flex-row items-center justify-between bg-[#1E5AA5] shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-6 relative z-10">
              <button
                onClick={() => navigate("/admin/ao")}
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
                  REGISTRASI <span className="text-blue-200">AREA OFFICER</span>
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <p className="text-[9px] font-bold text-blue-100/70 tracking-widest uppercase italic">
                    Field Monitoring & Area Management
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-2xl border border-white/20 text-white font-black text-[9px] uppercase tracking-widest backdrop-blur-md relative z-10 shadow-inner">
              <Database size={14} className="text-blue-200" /> SYSTEM CORE V.2
            </div>
          </div>

          {/* AREA FORM - SCROLLABLE */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 md:px-16 py-10 bg-white">
            <form
              onSubmit={handle_form_submit}
              className="max-w-6xl mx-auto h-full flex flex-col"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10 pt-10 flex-1">
                {/* KOLOM KIRI: PERSONAL IDENTITY */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-4 bg-[#1E5AA5] rounded-full"></div>
                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      Personal Identity
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label
                      text="Nama Lengkap Personnel"
                      required
                      className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                    />
                    <div className="relative">
                      <Input
                        name="nama_lengkap"
                        value={form_data.nama_lengkap}
                        onChange={handle_input_change}
                        placeholder="Ketik nama lengkap..."
                        className="!py-4.5 !pl-12 !bg-white !border-gray-200 !rounded-2xl font-bold shadow-sm"
                        required
                      />
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                        size={16}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        text="Email Korporat"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                      />
                      <div className="relative">
                        <Input
                          type="email"
                          name="email_user"
                          value={form_data.email_user}
                          onChange={handle_input_change}
                          placeholder="ao@ypamdr.or.id"
                          className="!py-4.5 !pl-12 !bg-white !border-gray-200 !rounded-2xl font-bold shadow-sm"
                          required
                        />
                        <Mail
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          size={16}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        text="Access Password"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                      />
                      <div className="relative">
                        <Input
                          type="password"
                          name="password_user"
                          value={form_data.password_user}
                          onChange={handle_input_change}
                          placeholder="••••••••"
                          className="!py-4.5 !pl-12 !bg-white !border-gray-200 !rounded-2xl font-bold shadow-sm"
                          required
                        />
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          size={16}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="space-y-2">
                    <Label
                      text="Nomor WhatsApp"
                      className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                    />
                    <div className="relative">
                      <Input
                        name="nomor_whatsapp"
                        value={form_data.nomor_whatsapp}
                        onChange={handle_input_change}
                        placeholder="0812xxxx"
                        className="!py-4.5 !pl-12 !bg-white !border-gray-200 !rounded-2xl font-bold shadow-sm"
                      />
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                        size={16}
                      />
                    </div>
                  </div> */}

                  <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex gap-4">
                    <ShieldCheck
                      size={20}
                      className="text-[#1E5AA5] shrink-0 mt-0.5"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-[#1E5AA5] uppercase tracking-tighter">
                        Otoritas Area
                      </span>
                      <p className="text-[9px] text-blue-600/70 font-bold leading-relaxed">
                        Akun Area Officer memiliki wewenang untuk melakukan
                        monitoring langsung pada wilayah yang ditugaskan.
                      </p>
                    </div>
                  </div>
                </div>

                {/* KOLOM KANAN: DYNAMIC ASSIGNMENT */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                      <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        Assignment Area
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={addWilayahField}
                      className="text-[9px] font-black text-[#1E5AA5] hover:text-blue-700 flex items-center gap-1 group transition-all"
                    >
                      <PlusIcon
                        size={12}
                        className="group-hover:rotate-90 transition-transform"
                      />{" "}
                      TAMBAH WILAYAH?
                    </button>
                  </div>

                  <div className="space-y-5">
                    {form_data.wilayah_ids.map((selectedId, index) => (
                      <div
                        key={index}
                        className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300"
                      >
                        <Label
                          text={
                            index === 0
                              ? "Wilayah Tugas Utama"
                              : `Wilayah Tambahan ${index}`
                          }
                          required={index === 0}
                          className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                        />
                        <div className="flex gap-3">
                          <div className="flex-1 relative">
                            <Dropdown
                              icon={MapPin}
                              value={selectedId}
                              onChange={(val) =>
                                handleWilayahChange(index, val)
                              }
                              items={wilayah_options.filter(
                                (opt) =>
                                  !form_data.wilayah_ids.includes(opt.value) ||
                                  opt.value === selectedId,
                              )}
                              label="PILIH WILAYAH OPERASIONAL"
                              className="!py-4.5 !bg-white !border-gray-200 !rounded-2xl font-extrabold text-gray-700 shadow-sm"
                            />
                          </div>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeWilayahField(index)}
                              className="w-14 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 border border-red-100 transition-all active:scale-90"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 flex gap-4">
                    <Info
                      size={20}
                      className="text-emerald-600 shrink-0 mt-0.5"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter">
                        Policy Penugasan
                      </span>
                      <p className="text-[9px] text-emerald-600 font-bold leading-relaxed">
                        Satu AO dapat membawahi beberapa wilayah sekaligus,
                        namun setiap wilayah hanya boleh dipantau oleh satu AO
                        aktif.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end items-center gap-3 pt-12 pb-16 shrink-0">
                <Button
                  text="BATALKAN"
                  onClick={() => navigate("/admin/ao")}
                  className="!bg-white !text-gray-400 !px-7 !py-2.5 !rounded-xl !text-[9px] font-black hover:!bg-gray-50 transition-all border border-gray-100 uppercase tracking-[0.2em]"
                />
                <Button
                  text={
                    is_loading ? "PROCESSING..." : "AKTIVASI AKUN AREA OFFICER"
                  }
                  type="submit"
                  disabled={is_loading}
                  className="!bg-[#2E5AA7] !text-white !px-10 !py-2.5 !rounded-xl !text-[9px] font-black shadow-lg shadow-blue-900/10 active:scale-95 transition-all border-none uppercase tracking-[0.2em]"
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default Create_AO;
