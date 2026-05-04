/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  School,
  MapPin,
  Award,
  Database,
  Edit3,
  Info,
  Map as MapIcon,
  Globe,
  Navigation,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import Swal from "sweetalert2";

// Komponen Premium
import Sidebar from "../../../../components/Sidebar";
import Button from "../../../../components/Button";
import PageWrapper from "../../../../components/PageWrapper";
import Label from "../../../../components/Label";

const DetailSekolah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/sekolah/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        Swal.fire("Error", "Gagal memuat profil sekolah", "error");
        navigate("/admin/sekolah");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#EEF5FF]">
        <div className="flex flex-col items-center gap-4 text-[#1E5AA5]">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-[#1E5AA5] rounded-full animate-spin"></div>
          <span className="font-black text-[10px] tracking-[0.3em] uppercase italic">
            Retrieving Educational Metadata...
          </span>
        </div>
      </div>
    );

  const jenjangColor =
    data?.jenjang === "SD"
      ? "bg-red-50 text-red-600 border-red-100"
      : data?.jenjang === "SMP"
        ? "bg-blue-50 text-blue-600 border-blue-100"
        : "bg-emerald-50 text-emerald-600 border-emerald-100";

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <div className="flex-1 !m-0 !p-0 !rounded-t-[2.5rem] !rounded-b-none border-none shadow-2xl bg-white flex flex-col overflow-hidden relative">
          {/* 1. TOP HEADER BAR */}
          <div className="px-8 md:px-16 pt-10 pb-8 flex flex-col md:flex-row items-center justify-between bg-[#1E5AA5] shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-6 relative z-10">
              <button
                onClick={() => navigate("/admin/sekolah")}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white hover:text-[#1E5AA5] transition-all border border-white/20 shadow-lg backdrop-blur-md group"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={3}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </button>
              <div>
                <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
                  PROFIL <span className="text-blue-200">UNIT SEKOLAH</span>
                </h1>
                <p className="text-[8px] font-bold text-blue-100/70 tracking-widest uppercase italic mt-1.5">
                  Verified Educational Entity Information
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white font-black text-[8px] uppercase tracking-widest backdrop-blur-md relative z-10 shadow-inner">
              <Database size={12} className="text-blue-200" />
              NPSN: {data?.npsn || "00000000"}
            </div>
          </div>

          {/* 2. AREA CONTENT */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white px-8 md:px-16 pt-12">
            <div className="max-w-7xl mx-auto flex flex-col gap-12 pb-16">
              {/* Header Profile Section */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-gray-50 pb-12">
                <div className="relative group shrink-0">
                  <div className="absolute -inset-1.5 bg-[#1E5AA5] rounded-[2.5rem] blur opacity-10"></div>
                  <div className="relative w-28 h-28 bg-gray-50 rounded-[2.5rem] border-4 border-white shadow-xl flex items-center justify-center text-[#1E5AA5]">
                    <School size={48} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-3 text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-[8px] font-black border uppercase tracking-widest ${jenjangColor}`}
                    >
                      Jenjang {data?.jenjang}
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black rounded-lg uppercase tracking-widest">
                      ● Active Binaan
                    </span>
                  </div>
                  <h2 className="text-4xl font-[900] text-gray-800 uppercase tracking-tighter leading-tight">
                    {data?.nama_sekolah}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400 font-bold text-[10px] uppercase tracking-widest italic">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-[#1E5AA5]" />{" "}
                      {data?.wilayah?.nama_wilayah?.split("/").pop()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award size={12} className="text-orange-500" /> Akreditasi{" "}
                      {data?.akreditasi || "Proses"}
                    </div>
                  </div>
                </div>

                <Button
                  text="MODIFIKASI UNIT"
                  icon={<Edit3 size={12} />}
                  onClick={() => navigate(`/admin/sekolah/edit/${id}`)}
                  className="!bg-[#2E5AA7] !text-white !px-10 !py-3.5 !rounded-xl !text-[8px] font-black shadow-lg shadow-blue-900/10 active:scale-95 border-none uppercase tracking-widest shrink-0"
                />
              </div>

              {/* Data Detail Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="p-8 bg-gray-50/50 rounded-[3rem] border border-gray-100 space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-4 bg-[#1E5AA5] rounded-full"></div>
                      <h3 className="text-[10px] font-black uppercase text-gray-800 tracking-widest">
                        Master Identity
                      </h3>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                            Nomor NPSN
                          </span>
                          <span className="text-sm font-black text-gray-700 font-mono tracking-widest">
                            {data?.npsn || "00000000"}
                          </span>
                        </div>
                        <BookOpen size={20} className="text-blue-200" />
                      </div>
                      <div className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                            Wilayah Penugasan
                          </span>
                          <span className="text-sm font-black text-[#1E5AA5] uppercase truncate max-w-[200px]">
                            {data?.wilayah?.nama_wilayah || "Global Area"}
                          </span>
                        </div>
                        <Globe size={20} className="text-gray-200" />
                      </div>
                      <div className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                            Status Kelembagaan
                          </span>
                          <span className="text-sm font-black text-emerald-600 uppercase">
                            YPA-MDR Certified
                          </span>
                        </div>
                        <ShieldCheck size={20} className="text-emerald-200" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-7 space-y-10">
                  <div className="space-y-4">
                    <Label
                      text="Alamat Operasional Lengkap"
                      className="!text-[10px] text-[#1E5AA5] uppercase tracking-[0.3em]"
                    />
                    <div className="p-8 bg-gray-50/50 rounded-[3rem] border border-gray-100 flex gap-6 min-h-[160px] items-center">
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#1E5AA5] shadow-sm shrink-0 border border-blue-50">
                        <MapIcon size={24} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-gray-600 leading-relaxed italic first-letter:uppercase whitespace-pre-line">
                          {data?.alamat || data?.alamat_lengkap ? (
                            `"${data?.alamat || data?.alamat_lengkap}"`
                          ) : (
                            <span className="text-gray-400 not-italic font-medium text-[11px] uppercase tracking-tighter">
                              Detail lokasi alamat resmi sekolah belum
                              diperbarui dalam database.
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-4 group hover:bg-blue-50 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#1E5AA5] shrink-0">
                        <Navigation size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-400 uppercase">
                          Latitude
                        </span>
                        <span className="text-xs font-mono font-bold text-gray-700">
                          {data?.latitude || "0.000"}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-4 group hover:bg-blue-50 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#1E5AA5] shrink-0">
                        <Globe size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-400 uppercase">
                          Longitude
                        </span>
                        <span className="text-xs font-mono font-bold text-gray-700">
                          {data?.longitude || "0.000"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-amber-50/50 p-6 rounded-[2.5rem] border border-amber-100">
                    <Info
                      size={20}
                      className="text-amber-600 shrink-0 mt-0.5"
                    />
                    <p className="text-[9px] text-amber-700 font-bold leading-relaxed uppercase tracking-tight">
                      Informasi koordinat geospasial digunakan untuk integrasi
                      pada peta monitoring sebaran program nasional YPA-MDR.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ACTION BAR */}
          <div className="px-8 md:px-16 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-end shrink-0">
            <Button
              text="KEMBALI KE MASTER"
              onClick={() => navigate("/admin/sekolah")}
              className="!bg-white !text-gray-400 !px-10 !py-3.5 !rounded-xl !text-[8px] font-black hover:!bg-gray-50 border border-gray-100 uppercase tracking-widest shadow-sm"
            />
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default DetailSekolah;
