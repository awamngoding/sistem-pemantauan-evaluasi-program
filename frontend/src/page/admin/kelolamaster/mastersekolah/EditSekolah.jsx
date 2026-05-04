/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  School,
  MapPin,
  RefreshCcw,
  Info,
  Database,
  Lock,
  Globe,
  Award,
  Navigation,
} from "lucide-react";
import Swal from "sweetalert2";

// Import Komponen Atomik Premium
import Sidebar from "../../../../components/Sidebar";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import Button from "../../../../components/Button";
import PageWrapper from "../../../../components/PageWrapper";

const EditSekolah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama_sekolah: "",
    alamat: "",
    latitude: "",
    longitude: "",
    jenjang: "",
    npsn: "",
    akreditasi: "",
  });

  // --- 1. FETCH DATA SEKOLAH ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setFetching(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/sekolah/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setFormData({
            nama_sekolah: res.data.nama_sekolah || "",
            alamat: res.data.alamat || "",
            latitude: res.data.latitude || "",
            longitude: res.data.longitude || "",
            jenjang: res.data.jenjang || "",
            npsn: res.data.npsn || "",
            akreditasi: res.data.akreditasi || "",
          });
        }
      } catch (err) {
        Swal.fire("Error", "Gagal mensinkronisasi data sekolah", "error");
        navigate("/admin/sekolah");
      } finally {
        setFetching(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  // --- 2. HANDLE SUBMIT UPDATE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        nama_sekolah: formData.nama_sekolah,
        alamat: formData.alamat,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
      };

      await axios.patch(`http://localhost:3000/sekolah/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data Sekolah Telah Diperbarui",
        confirmButtonColor: "#1E5AA5",
      });
      navigate("/admin/sekolah");
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Internal Server Error",
        "error",
      );
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
            Syncing Entity Metadata...
          </span>
        </div>
      </div>
    );

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
                  MODIFIKASI <span className="text-blue-200">UNIT SEKOLAH</span>
                </h1>
                <p className="text-[9px] font-bold text-blue-100/70 tracking-widest uppercase italic mt-2">
                  Entity Configuration & Geo-Spatial Update
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-2xl border border-white/20 text-white font-black text-[9px] uppercase tracking-widest backdrop-blur-md relative z-10 shadow-inner">
              <Database size={14} className="text-blue-200" /> ID ENTITY: #
              {id.slice(-6).toUpperCase()}
            </div>
          </div>

          {/* AREA FORM - SCROLLABLE */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 md:px-16 py-10 bg-white">
            <form
              onSubmit={handleSubmit}
              className="max-w-7xl mx-auto h-full flex flex-col"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 flex-1">
                {/* KIRI: INFORMASI SISTEM (READ-ONLY) */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 space-y-8 relative overflow-hidden">
                    <div className="absolute top-6 right-6 text-gray-200">
                      <Lock size={60} opacity={0.1} />
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-4 bg-gray-400 rounded-full"></div>
                      <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                        Master Identifier
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          text="Nomor NPSN (Read Only)"
                          className="!text-[9px] text-gray-400 uppercase tracking-widest"
                        />
                        <div className="relative">
                          <Input
                            value={formData.npsn}
                            disabled
                            className="!py-4 !pl-12 !bg-white !border-gray-100 !text-gray-400 !font-bold cursor-not-allowed !rounded-2xl shadow-sm"
                          />
                          <Database
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                            size={16}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          text="Jenjang & Akreditasi"
                          className="!text-[9px] text-gray-400 uppercase tracking-widest"
                        />
                        <div className="relative">
                          <Input
                            value={`${formData.jenjang} • AKREDITASI ${formData.akreditasi}`}
                            disabled
                            className="!py-4 !pl-12 !bg-white !border-gray-100 !text-gray-400 !font-bold cursor-not-allowed !rounded-2xl shadow-sm"
                          />
                          <Award
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                            size={16}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-2 text-amber-500">
                        <Info size={16} />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          Admin Note
                        </span>
                      </div>
                      <p className="text-[8px] text-gray-400 leading-relaxed font-bold uppercase tracking-tighter">
                        Data Identitas Pokok bersifat permanen di sistem.
                        Hubungi departemen IT Pusat untuk sinkronisasi ulang
                        NPSN.
                      </p>
                    </div>
                  </div>
                </div>

                {/* KANAN: UPDATE LOKASI & ALAMAT */}
                <div className="lg:col-span-8 space-y-10">
                  <div className="flex items-center gap-3 border-l-4 border-[#2E5AA7] pl-4 mb-2">
                    <h3 className="text-[10px] font-black uppercase text-gray-800 tracking-widest">
                      Geographical & Official Address
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        text="Nama Resmi Unit Sekolah"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                      />
                      <div className="relative">
                        <Input
                          icon={<School size={18} />}
                          value={formData.nama_sekolah}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nama_sekolah: e.target.value,
                            })
                          }
                          className="!py-4.5 !pl-12 !bg-white !border-gray-200 !rounded-2xl font-bold shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        text="Alamat Operasional Lengkap"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                      />
                      <textarea
                        className="w-full p-6 bg-gray-50 rounded-[2.5rem] outline-none h-32 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all border border-gray-100 shadow-inner custom-scrollbar"
                        value={formData.alamat}
                        onChange={(e) =>
                          setFormData({ ...formData, alamat: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label
                          text="Latitude Coordinate"
                          required
                          className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                        />
                        <div className="relative">
                          <Input
                            value={formData.latitude}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                latitude: e.target.value,
                              })
                            }
                            className="!py-4.5 !pl-12 !bg-gray-50/50 !border-gray-200 !rounded-2xl font-mono text-sm"
                          />
                          <Navigation
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                            size={16}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          text="Longitude Coordinate"
                          required
                          className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                        />
                        <div className="relative">
                          <Input
                            value={formData.longitude}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                longitude: e.target.value,
                              })
                            }
                            className="!py-4.5 !pl-12 !bg-gray-50/50 !border-gray-200 !rounded-2xl font-mono text-sm"
                          />
                          <Globe
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                            size={16}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100 flex gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50 shrink-0">
                        <MapPin size={22} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter">
                          Geo-Tagging Calibration
                        </span>
                        <p className="text-[9px] text-emerald-600 font-bold leading-relaxed uppercase">
                          Perubahan koordinat GPS akan secara otomatis
                          memperbarui titik sebaran pada Dashboard Spasial
                          Administrator dan Laporan Wilayah.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BAR - RATA KANAN (POPPINS) */}
              <div className="flex justify-end items-center gap-4 pt-12 pb-16 shrink-0">
                <Button
                  text="BATALKAN"
                  onClick={() => navigate("/admin/sekolah")}
                  className="!bg-white !text-gray-400 !px-10 !py-3 !rounded-xl !text-[9px] font-black hover:!bg-gray-50 border border-gray-100 uppercase tracking-widest shadow-sm"
                />
                <Button
                  text={loading ? "SAVING..." : "SIMPAN PERUBAHAN DATA"}
                  type="submit"
                  disabled={loading}
                  icon={<Save size={14} />}
                  className="!bg-[#2E5AA7] !text-white !px-12 !py-3 !rounded-xl !text-[9px] font-black shadow-xl shadow-blue-900/10 active:scale-95 transition-all border-none uppercase tracking-widest"
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default EditSekolah;
