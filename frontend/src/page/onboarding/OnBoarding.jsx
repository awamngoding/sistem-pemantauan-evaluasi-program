/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// IMPORT ICONS
import {
  Database,
  MapPin,
  Globe,
  Search as SearchIcon,
  BookOpen,
  Navigation,
  ShieldCheck,
  Activity,
  Eye,
  Rocket,
  Mountain,
  Target,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  MoveRight,
  School,
  GraduationCap,
  Layers,
  ArrowUpRight,
} from "lucide-react";

// IMPORT COMPONENTS ATOMIK
import Navbar from "../../components/Navbar";
import Dropdown from "../../components/Dropdown";
import Footer from "../../components/Footer";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Card from "../../components/Card";

// ASSETS
import seniImg from "../../assets/img/senibudaya.jpg";
import picturependidikan from "../../assets/img/pichture_pendidikan 1.png";

// FIX MARKER ICON LEAFLET
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [22, 36],
  iconAnchor: [11, 36],
});
L.Marker.prototype.options.icon = DefaultIcon;

const Onboarding = () => {
  const [wilayahList, setWilayahList] = useState([]);
  const [sekolahList, setSekolahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilayah, setSelectedWilayah] = useState(null);
  const [mapCenter, setMapCenter] = useState([-2.5, 118]);

  // State Pagination Tabel Sekolah
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resWilayah, resSekolah] = await Promise.all([
          axios.get("http://localhost:3000/wilayah"),
          axios.get("http://localhost:3000/sekolah"),
        ]);
        setWilayahList(resWilayah.data.filter((w) => w.status === true));
        setSekolahList(resSekolah.data);
      } catch (err) {
        console.error("Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Sekolah
  const filteredSekolah = selectedWilayah
    ? sekolahList.filter((s) => s.id_wilayah === selectedWilayah.id_wilayah)
    : [];

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSekolah.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSekolah.length / itemsPerPage);

  // Options Dropdown
  const wilayahOptions = [
    { value: "all", label: "PILIH WILAYAH BINAAN" },
    ...wilayahList.map((w) => ({
      value: w.id_wilayah,
      label: w.nama_wilayah.split("/").pop().toUpperCase(),
    })),
  ];

  function MapController({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
      if (center) map.flyTo(center, zoom || 9, { duration: 2 });
    }, [center, zoom, map]);
    return null;
  }

  // Kolom Tabel Sekolah
  const schoolColumns = [
    {
      header: "NPSN",
      align: "text-center w-20",
      render: (row) => (
        <span className="text-[9px] font-mono font-bold text-gray-400">
          {row.npsn}
        </span>
      ),
    },
    {
      header: "INSTITUSI PENDIDIKAN",
      align: "text-left",
      render: (row) => (
        <div className="flex flex-col py-1">
          <span className="font-black text-[#1E5AA5] text-[10px] uppercase tracking-tighter leading-none">
            {row.nama_sekolah}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[7px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-black uppercase">
              {row.jenjang}
            </span>
            <span className="text-[7px] text-gray-400 font-bold uppercase italic">
              Grade {row.akreditasi}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "INFO",
      align: "text-right w-12",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          className="p-1.5 hover:bg-blue-50 text-[#1E5AA5] rounded-lg"
          icon={<ArrowRight size={12} />}
        />
      ),
    },
  ];

  // Data 4 Pilar
  const pillarsData = [
    {
      title: "Akademik",
      icon: <BookOpen size={28} />,
      description:
        "Meningkatkan kualitas pendidikan melalui berbagai program, salah satunya dengan memberikan pelatihan akademik untuk meningkatkan kompetensi sumber daya manusia (SDM) di lingkungan sekolah binaan.",
    },
    {
      title: "Karakter",
      icon: <ShieldCheck size={28} />,
      description:
        "Warga sekolah diberikan pembinaan untuk mengembangkan karakter yang berlandaskan nilai-nilai luhur bangsa Indonesia.",
    },
    {
      title: "Kecakapan Hidup",
      icon: <Activity size={28} />,
      description:
        "Siswa dibekali dengan kecakapan hidup agar dapat meningkatkan perekonomian di daerahnya.",
    },
    {
      title: "Seni Budaya",
      icon: <Globe size={28} />,
      description:
        "Pembinaan seni budaya diberikan agar seni budaya lokal dapat dilestarikan.",
    },
  ];

  // Data Manifesto
  const manifestoData = [
    {
      title: "Vision",
      icon: <Eye size={24} />,
      description:
        "Menjadi lembaga sosial yang kredibel untuk meningkatkan mutu elemen pendidikan daerah binaan.",
    },
    {
      title: "Mission",
      icon: <Rocket size={24} />,
      description:
        "Mendorong pembinaan sekolah melalui 4 Pilar Pendidikan dan membangun sinergitas stakeholders.",
    },
    {
      title: "Goal",
      icon: <Mountain size={24} />,
      description:
        "Mewujudkan sekolah unggul binaan yang mandiri, berprestasi, dan berwawasan global.",
    },
    {
      title: "Aim",
      icon: <Target size={24} />,
      description:
        "Melahirkan generasi muda yang kompeten untuk mewujudkan Indonesia yang lebih sejahtera.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] font-sans selection:bg-[#1E5AA5] selection:text-white overflow-x-hidden">
      <Navbar
        isDashboard
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* --- SECTION 1: HERO --- */}
      <section className="bg-[#F7F8F0] pt-32 pb-24 px-6 relative flex items-center min-h-[85vh]">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1E5AA5]/[0.01] pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-16 w-full relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-white px-4 py-1.5 rounded-full shadow-sm border border-blue-50">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-[9px] font-black text-[#1E5AA5] uppercase tracking-[0.4em]">
                Corporate Social Impact
              </span>
            </div>
            <h1 className="text-6xl lg:text-[84px] font-[1000] text-gray-900 leading-[0.85] tracking-tighter uppercase">
              SATU <br /> <span className="text-[#1E5AA5]">INDONESIA</span>{" "}
              <br /> CERDAS
            </h1>
            <p className="text-gray-500 text-sm md:text-lg leading-relaxed max-w-md font-medium border-l-4 border-[#1E5AA5] pl-8">
              Membangun fondasi pendidikan unggul di pelosok negeri demi
              mewujudkan generasi emas Indonesia yang mandiri.
            </p>
            <div className="flex items-center gap-6">
              <Button
                onClick={() =>
                  window.open("https://yayasanastra-ypamdr.or.id/", "_blank")
                }
                text="Jelajahi Yayasan Pendidikan Astra Michael D. Ruslim YUK!"
                icon={<MoveRight size={16} />} // Masukkan icon ke prop icon
                className="bg-[#1E5AA5] text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#164786] shadow-xl shadow-blue-900/20 active:scale-95"
              />
            </div>
          </div>
          <div className="hidden lg:flex justify-end animate-in fade-in zoom-in duration-1000">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-100/50 rounded-[4rem] blur-3xl" />
              <img
                src={picturependidikan}
                alt="Hero"
                className="w-[450px] relative z-10 drop-shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: 4 PILAR --- */}
      <section className="py-32 px-6 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-px bg-[#1E5AA5]/30" />
              <span className="text-[10px] font-bold text-[#1E5AA5] tracking-[0.3em] uppercase">
                4 Pilar Utama
              </span>
              <div className="w-10 h-px bg-[#1E5AA5]/30" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Fondasi Transformasi Pendidikan
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              YPA-MDR berkomitmen membangun pendidikan Indonesia melalui empat
              pilar utama yang saling terintegrasi
            </p>
          </div>

          {/* 4 Pilar Grid menggunakan Card component */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillarsData.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group relative"
              >
                <Card
                  className="relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
                  padding="none"
                >
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[#1E5AA5]/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-[#1E5AA5]/10 to-[#1E5AA5]/5 rounded-2xl flex items-center justify-center text-[#1E5AA5] group-hover:bg-[#1E5AA5] group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-lg">
                      {pillar.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-xs leading-relaxed mb-6 font-medium line-clamp-4">
                    {pillar.description}
                  </p>

                  {/* Separator */}
                  <div className="w-12 h-px bg-gray-200 group-hover:w-full group-hover:bg-[#1E5AA5] transition-all duration-500 mb-6" />

                  {/* Stats */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#1E5AA5]">
                      {pillar.stat}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase tracking-wider">
                      {pillar.statLabel}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 3: DASHBOARD GEOSPATIAL --- */}
      <section className="py-32 px-6 bg-[#EEF5FF]">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="text-center mb-16 space-y-3">
            <span className="text-[#1E5AA5] font-black text-[10px] uppercase tracking-[0.6em] block">
              Sistem Informasi Geografis
            </span>
            <h2 className="text-4xl lg:text-5xl font-[1000] text-gray-900 tracking-tighter uppercase leading-none">
              SEBARAN <span className="text-[#1E5AA5]">Sekolah Binaan</span>
            </h2>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden bg-white rounded-[1rem]">
            {/* LEFT: MAP INTERFACE */}
            <div className="lg:col-span-7 h-[600px] relative bg-gray-50 border-r border-gray-100">
              <MapContainer
                center={mapCenter}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  opacity={0.6}
                />
                <ZoomControl position="bottomright" />
                <MapController
                  center={mapCenter}
                  zoom={selectedWilayah ? 11 : 5}
                />

                {wilayahList.map((w) => (
                  <Marker
                    key={w.id_wilayah}
                    position={[w.latitude, w.longitude]}
                    eventHandlers={{
                      click: () => {
                        setMapCenter([w.latitude, w.longitude]);
                        setSelectedWilayah(w);
                        setCurrentPage(1);
                      },
                    }}
                  >
                    <Popup className="custom-popup-flat-premium">
                      <div className="p-3 min-w-[150px] text-center space-y-1">
                        <p className="font-black text-[#1E5AA5] uppercase text-[10px]">
                          {w.nama_wilayah.split("/").pop()}
                        </p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase italic">
                          Klik untuk filter data sekolah
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              <div className="absolute top-6 left-6 z-[1000] bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">
                  Live Node Tracking
                </span>
              </div>
            </div>

            {/* RIGHT: SCHOOL LIST PANEL */}
            <div className="lg:col-span-5 flex flex-col h-[600px] bg-white">
              <div className="p-8 bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic underline decoration-blue-200">
                      Current Wilayah:
                    </span>
                    <h3 className="text-xl font-[1000] text-[#1E5AA5] uppercase leading-none tracking-tighter">
                      {selectedWilayah
                        ? selectedWilayah.nama_wilayah.split("/").pop()
                        : "Pilih Wilayah"}
                    </h3>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-[#1E5AA5]">
                    <School size={20} />
                  </div>
                </div>

                <Dropdown
                  items={wilayahOptions}
                  value={selectedWilayah?.id_wilayah || "all"}
                  onChange={(val) => {
                    const found = wilayahList.find((w) => w.id_wilayah === val);
                    if (found) {
                      setMapCenter([found.latitude, found.longitude]);
                      setSelectedWilayah(found);
                      setCurrentPage(1);
                    }
                  }}
                  className="!rounded-xl !border-gray-200 !text-[10px] font-black uppercase"
                />
              </div>

              <div className="flex-1 overflow-hidden flex flex-col p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={14} className="text-gray-300" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Inventory List
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-[#1E5AA5] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase italic">
                    {filteredSekolah.length} Unit
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1">
                  {selectedWilayah ? (
                    filteredSekolah.length > 0 ? (
                      <Table
                        columns={schoolColumns}
                        data={currentItems}
                        className="min-w-full hover-row-blue-flat"
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-10 grayscale opacity-40">
                        <GraduationCap size={48} strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase mt-4 tracking-widest">
                          Data sekolah belum terintegrasi
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10">
                      <Navigation
                        size={40}
                        className="text-blue-100 mb-6 animate-pulse"
                      />
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                        Silakan interaksi dengan peta <br /> untuk memuat basis
                        data sekolah
                      </p>
                    </div>
                  )}
                </div>

                {/* MINI PAGINATION */}
                {selectedWilayah && filteredSekolah.length > itemsPerPage && (
                  <div className="pt-6 mt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-30"
                        icon={<ChevronLeft size={14} />}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-30"
                        icon={<ChevronRight size={14} />}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: SENI & BUDAYA --- */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex items-end justify-between border-l-8 border-[#1E5AA5] pl-8">
            <h2 className="text-4xl lg:text-5xl font-[1000] text-gray-900 uppercase tracking-tighter leading-[0.85]">
              RAGAM <br /> <span className="text-[#1E5AA5]">SENI BUDAYA</span>
            </h2>
            <p className="hidden md:block text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] max-w-[250px] text-right italic leading-relaxed">
              Mewarisi kearifan lokal melalui pengembangan kreativitas seni di
              lingkungan sekolah binaan.
            </p>
          </div>

          <div className="flex overflow-x-auto gap-8 pb-12 scrollbar-hide snap-x">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div
                key={i}
                className="relative min-w-[280px] w-80 h-[420px] group snap-center overflow-hidden rounded-2xl shadow-lg bg-gray-100 flex-shrink-0"
              >
                {/* GAMBAR - full cover, tidak kepotong */}
                <img
                  src={seniImg}
                  alt="Budaya"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition duration-700"
                />
                {/* Overlay gelap biar teks kebaca */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Konten teks di atas gambar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider bg-black/30 px-2 py-0.5 rounded-full">
                      CULTURAL PRESERVATION
                    </span>
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tight mb-2">
                    Gelar Seni Budaya Nusantara {i + 1}
                  </h4>
                  <button className="flex items-center gap-2 text-[10px] font-bold text-white/80 hover:text-white transition group/btn">
                    Eksplorasi Karya
                    <ArrowRight
                      size={14}
                      className="group-hover/btn:translate-x-1 transition"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 5: MANIFESTO --- */}
      <section className="py-32 bg-[#F7F8F0] px-6">
        <div className="max-w-7xl mx-auto border-y border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {manifestoData.map((item, idx) => (
              <Card
                key={idx}
                className="p-12 space-y-8 hover:bg-white transition-all duration-500 group rounded-none shadow-none border-0"
                padding="none"
              >
                <div className="text-[#1E5AA5] group-hover:scale-125 transition-transform duration-500">
                  {item.icon}
                </div>
                <h3 className="text-xl font-[1000] text-gray-900 uppercase tracking-tighter">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-400 font-bold uppercase tracking-wide italic">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Onboarding;
