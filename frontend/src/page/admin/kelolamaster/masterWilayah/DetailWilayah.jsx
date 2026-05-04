/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Globe,
  Database,
  ShieldCheck,
  Edit3,
  Navigation,
  Calendar,
  Info,
  Users,
  GraduationCap,
  School,
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";

// Fix Marker Leaflet Icon
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Komponen Pendukung
import Sidebar from "../../../../components/Sidebar";
import Button from "../../../../components/Button";
import PageWrapper from "../../../../components/PageWrapper";
import Label from "../../../../components/Label";

const DetailWilayah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/wilayah/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Log untuk mempermudah debugging di console browser
        console.log("API Response:", res.data);
        setData(res.data);
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data wilayah", "error");
        navigate("/admin/wilayah");
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
            Mapping Regional Node...
          </span>
        </div>
      </div>
    );

  const locationParts = data?.nama_wilayah?.split("/") || [];
  const mainTitle = locationParts[locationParts.length - 1] || "Unknown Area";

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <div className="flex-1 !m-0 !p-0 !rounded-t-[2.5rem] border-none shadow-2xl bg-white flex flex-col relative overflow-hidden">
          {/* 1. HEADER BAR */}
          <div className="px-8 md:px-16 pt-8 pb-6 flex flex-col md:flex-row items-center justify-between bg-[#1E5AA5] shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-6 relative z-10">
              <button
                onClick={() => navigate("/admin/wilayah")}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white hover:text-[#1E5AA5] transition-all border border-white/20 shadow-lg backdrop-blur-md group"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={3}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </button>
              <div>
                <h1 className="text-lg font-black text-white tracking-tighter uppercase leading-none">
                  DETAIL <span className="text-blue-200">AREA BINAAN</span>
                </h1>
                <p className="text-[7px] font-bold text-blue-100/70 tracking-widest uppercase italic mt-1">
                  Spatial Intelligence & Regional Information
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white font-black text-[8px] uppercase tracking-widest backdrop-blur-md relative z-10 shadow-inner">
              <Globe size={12} className="text-blue-200" />
              GEO-REF: {id?.substring(0, 12)}
            </div>
          </div>

          {/* 2. CONTENT AREA */}
          <div className="flex-1 bg-white px-8 md:px-16 pt-8 flex flex-col overflow-hidden">
            <div className="max-w-7xl w-full mx-auto flex flex-col h-full gap-6">
              {/* Profile Section */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-50 pb-6 shrink-0">
                <div className="relative w-20 h-20 bg-gray-50 rounded-[2rem] border-4 border-white shadow-xl flex items-center justify-center text-[#1E5AA5]">
                  <MapPin size={32} strokeWidth={1.5} />
                </div>

                <div className="flex-1 flex flex-col gap-2 text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-[#1E5AA5] border border-blue-100 text-[7px] font-black rounded-lg uppercase tracking-widest">
                      Regional Node
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[7px] font-black border uppercase tracking-widest ${data?.status ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}
                    >
                      {data?.status ? "● Verified Active" : "○ Inactive"}
                    </span>
                  </div>
                  <h2 className="text-3xl font-[900] text-gray-800 uppercase tracking-tighter leading-tight">
                    {mainTitle}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400 font-bold text-[9px] uppercase tracking-widest italic">
                    <div className="flex items-center gap-1.5">
                      <Navigation size={11} className="text-[#1E5AA5]" />{" "}
                      {data?.latitude}, {data?.longitude}
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
                      <Calendar size={11} className="text-[#1E5AA5]" /> Binaan
                      Sejak {data?.tahun_awal_binaan}
                    </div>
                  </div>
                </div>

                <Button
                  text="MODIFIKASI DATA"
                  icon={<Edit3 size={11} />}
                  onClick={() => navigate(`/admin/wilayah/edit/${id}`)}
                  className="!bg-[#2E5AA7] !text-white !px-8 !py-3 !rounded-xl !text-[8px] font-black shadow-lg border-none uppercase tracking-widest shrink-0"
                />
              </div>

              {/* Data Grid */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden mb-6">
                {/* Kolom Kiri: Peta & Daftar Alamat Sekolah */}
                <div className="lg:col-span-7 flex flex-col gap-6 overflow-hidden">
                  <div className="flex-1 flex flex-col gap-3 overflow-hidden">
                    <Label
                      text="Peta Cakupan Wilayah (Kabupaten Level)"
                      className="!text-[9px] text-[#1E5AA5] uppercase tracking-[0.3em] shrink-0"
                    />
                    <div className="flex-1 rounded-[2.5rem] overflow-hidden border-4 border-gray-50 shadow-inner relative z-0">
                      <MapContainer
                        center={[
                          data?.latitude || -6.2,
                          data?.longitude || 106.8,
                        ]}
                        zoom={10}
                        scrollWheelZoom={false}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                          position={[
                            data?.latitude || -6.2,
                            data?.longitude || 106.8,
                          ]}
                        />
                      </MapContainer>
                    </div>
                  </div>

                  {/* INFO BOX: DYNAMIC LIST SEKOLAH */}
                  <div className="p-5 bg-[#F8FAFF] rounded-[2.5rem] border border-blue-100/50 flex flex-col gap-4 shadow-sm shrink-0 overflow-hidden">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#1E5AA5] shadow-sm border border-blue-50">
                        <School size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-[#1E5AA5] uppercase tracking-widest">
                          Alamat Unit Sekolah Terdaftar
                        </span>
                        <span className="text-[7px] text-gray-400 uppercase font-bold tracking-tighter">
                          Data bersumber dari Modul Registrasi Unit
                        </span>
                      </div>
                    </div>

                    <div className="max-h-[100px] overflow-y-auto custom-scrollbar space-y-3 pr-2">
                      {data?.sekolah && data.sekolah.length > 0 ? (
                        data.sekolah.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col border-l-2 border-blue-400 pl-4 py-1 bg-white/50 rounded-r-xl"
                          >
                            <span className="text-[10px] font-black text-gray-800 uppercase leading-none mb-1">
                              {item.nama_sekolah}
                            </span>
                            <span className="text-[9px] font-bold text-[#1E5AA5] italic leading-tight">
                              {item.alamat || "Alamat detail belum diatur"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col border-l-2 border-orange-200 pl-4 py-1">
                          <span className="text-[9px] font-black text-orange-500 uppercase">
                            Belum Ada Unit Sekolah
                          </span>
                          <span className="text-[8px] font-bold text-gray-400 italic">
                            {data?.alamat_lengkap}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Statistik & Info */}
                <div className="lg:col-span-5 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="p-5 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-[#1E5AA5]">
                      <Info size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        Deskripsi Geografis
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-500 leading-relaxed italic border-l-4 border-blue-200 pl-3">
                      "{data?.deskripsi || "Wilayah binaan strategis YPA-MDR."}"
                    </p>
                  </div>

                  {/* Statistik Agregasi */}
                  <div className="p-6 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-3 bg-[#1E5AA5] rounded-full"></div>
                      <h3 className="text-[9px] font-black uppercase text-gray-800 tracking-widest">
                        Cakupan Sekolah Binaan
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1 text-center">
                        <span className="text-[7px] font-black text-gray-400 uppercase leading-none">
                          SD
                        </span>
                        <span className="text-lg font-black text-[#1E5AA5] leading-none">
                          {data?.jumlah_sd || 0}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1 text-center">
                        <span className="text-[7px] font-black text-gray-400 uppercase leading-none">
                          SMP
                        </span>
                        <span className="text-lg font-black text-[#1E5AA5] leading-none">
                          {data?.jumlah_smp || 0}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-1 text-center">
                        <span className="text-[7px] font-black text-gray-400 uppercase leading-none">
                          SMK
                        </span>
                        <span className="text-lg font-black text-[#1E5AA5] leading-none">
                          {data?.jumlah_smk || 0}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[7px] font-black text-gray-400 uppercase">
                            Total Tenaga Pendidik
                          </span>
                          <span className="text-[10px] font-black text-gray-700 uppercase">
                            {data?.jumlah_guru || 0} Guru Terdaftar
                          </span>
                        </div>
                        <Users size={16} className="text-blue-200" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[7px] font-black text-gray-400 uppercase">
                            Total Siswa Binaan
                          </span>
                          <span className="text-[10px] font-black text-emerald-600 uppercase">
                            {data?.jumlah_siswa || 0} Siswa Aktif
                          </span>
                        </div>
                        <GraduationCap size={16} className="text-emerald-200" />
                      </div>
                    </div>
                  </div>

                  {/* Policy Card */}
                  <div className="p-5 bg-[#1E5AA5] rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group shrink-0">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <Database size={70} />
                    </div>
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          Data Integrity
                        </span>
                      </div>
                      <p className="text-[8px] font-bold leading-tight opacity-80 uppercase tracking-tight">
                        Informasi dihitung secara real-time berdasarkan unit
                        sekolah yang terhubung ke node wilayah ini.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ACTION BAR */}
          <div className="px-8 md:px-16 py-5 bg-gray-50/50 border-t border-gray-100 flex justify-end shrink-0">
            <Button
              text="KEMBALI KE LIST"
              onClick={() => navigate("/admin/wilayah")}
              className="!bg-white !text-gray-400 !px-10 !py-3 !rounded-xl !text-[8px] font-black hover:!bg-gray-50 border border-gray-100 uppercase tracking-widest shadow-sm"
            />
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default DetailWilayah;
