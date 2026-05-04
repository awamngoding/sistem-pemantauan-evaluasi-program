/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RefreshCcw,
  UserCheck,
  Lock,
  Shield,
  Mail,
  Phone,
  Briefcase,
  Layers,
  Database,
  User,
} from "lucide-react";
import Swal from "sweetalert2";

// Komponen Custom
import Sidebar from "../../../../components/Sidebar";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import Dropdown from "../../../../components/Dropdown";
import PageWrapper from "../../../../components/PageWrapper";

const EditHO = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    jenis: "akademik",
    sub_jenis: "",
    jabatan: "Staff Head Office",
    no_telp: "",
  });

  // --- FETCH DATA DETAIL ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setFormData({
            nama: res.data.nama || "",
            email: res.data.email || "",
            jenis: res.data.jenis || "akademik",
            sub_jenis: res.data.sub_jenis || "",
            jabatan: res.data.jabatan || "Staff Head Office",
            no_telp: res.data.no_telp || "",
          });
        }
      } catch (error) {
        Swal.fire("Error", "Data personil tidak ditemukan", "error");
        navigate("/admin/ho");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchDetail();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDropdownChange = (name, value) => {
    const selectedValue = value?.target ? value.target.value : value;
    setFormData((prev) => ({
      ...prev,
      [name]: selectedValue,
      ...(name === "jenis" && selectedValue === "non-akademik"
        ? { sub_jenis: "" }
        : {}),
      ...(name === "jenis" && selectedValue === "akademik" && !prev.sub_jenis
        ? { sub_jenis: "SD & SMP" }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire(
        "Berhasil",
        "Informasi Head Office telah diperbarui",
        "success",
      );
      navigate("/admin/ho");
    } catch (error) {
      Swal.fire("Gagal", "Gagal memperbarui data personil", "error");
    } finally {
      setLoading(false);
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
                onClick={() => navigate("/admin/ho")}
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
                  MODIFIKASI <span className="text-blue-200">HEAD OFFICE</span>
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse"></div>
                  <p className="text-[9px] font-bold text-blue-100/70 tracking-widest uppercase italic">
                    Structural Authority Synchronization
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
            {fetching ? (
              <div className="h-full flex flex-col items-center justify-center text-[#1E5AA5] gap-4">
                <RefreshCcw className="animate-spin" size={40} />
                <p className="font-black text-[10px] tracking-[0.3em] uppercase italic">
                  Retrieving Authority Data...
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="max-w-5xl mx-auto h-full flex flex-col"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pt-10 flex-1">
                  {/* KOLOM KIRI: PERSONAL */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-4 bg-[#1E5AA5] rounded-full"></div>
                      <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        Identity Details
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Label
                        text="Nama Lengkap (Locked)"
                        className="!text-[9px] text-gray-400 uppercase tracking-widest"
                      />
                      <div className="relative">
                        <Input
                          value={formData.nama}
                          disabled
                          className="!py-4.5 !pl-12 !bg-gray-50/50 !border-gray-100 !text-gray-400 !font-bold cursor-not-allowed !rounded-2xl"
                        />
                        <User
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          size={16}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        text="Email Korporat"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                      />
                      <div className="relative">
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
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
                        text="Nomor WhatsApp"
                        className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                      />
                      {/* <div className="relative">
                        <Input
                          name="no_telp"
                          value={formData.no_telp}
                          onChange={handleChange}
                          placeholder="0812xxxx"
                          className="!py-4.5 !pl-12 !bg-white !border-gray-200 !rounded-2xl font-bold shadow-sm"
                        />
                        <Phone
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          size={16}
                        />
                      </div> */}
                    </div>
                  </div>

                  {/* KOLOM KANAN: ASSIGNMENT */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                      <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        Authority Scope
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Label
                        text="Bidang Tugas Utama"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                      />
                      <Dropdown
                        icon={Briefcase}
                        value={formData.jenis}
                        onChange={(val) => handleDropdownChange("jenis", val)}
                        items={[
                          { label: "AKADEMIK", value: "akademik" },
                          { label: "NON-AKADEMIK", value: "non-akademik" },
                        ]}
                        className="!py-4.5 !bg-white !border-gray-200 !rounded-2xl font-extrabold text-gray-700 shadow-sm"
                      />
                    </div>

                    {formData.jenis === "akademik" && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label
                          text="Tingkat Pengawasan"
                          required
                          className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                        />
                        <Dropdown
                          icon={Layers}
                          value={formData.sub_jenis}
                          onChange={(val) =>
                            handleDropdownChange("sub_jenis", val)
                          }
                          items={[
                            { label: "SD & SMP", value: "SD & SMP" },
                            { label: "SMK", value: "SMK" },
                          ]}
                          className="!py-4.5 !bg-white !border-gray-200 !rounded-2xl font-extrabold text-gray-700 shadow-sm"
                        />
                      </div>
                    )}

                    <div className="flex items-start gap-4 bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100">
                      <Shield
                        size={20}
                        className="text-[#1E5AA5] shrink-0 mt-0.5"
                      />
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-[#1E5AA5] uppercase tracking-tighter">
                          Otoritas Update
                        </span>
                        <p className="text-[9px] text-blue-600/70 font-bold leading-relaxed">
                          Perubahan pada lingkup tugas akan secara instan
                          mengubah filter data pada modul monitoring dan laporan
                          berkala personel.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS - POJOK KANAN BAWAH */}
                <div className="flex justify-end items-center gap-3 pt-12 pb-16 shrink-0">
                  <Button
                    text="BATALKAN"
                    onClick={() => navigate("/admin/ho")}
                    className="!bg-white !text-gray-400 !px-7 !py-2.5 !rounded-xl !text-[9px] font-black hover:!bg-gray-50 transition-all border border-gray-100 uppercase tracking-[0.2em]"
                  />
                  <Button
                    text={loading ? "SAVING..." : "SIMPAN PERUBAHAN DATA"}
                    type="submit"
                    disabled={loading}
                    className="!bg-[#2E5AA7] !text-white !px-10 !py-2.5 !rounded-xl !text-[9px] font-black shadow-lg shadow-blue-900/10 active:scale-95 transition-all border-none uppercase tracking-[0.2em]"
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default EditHO;
