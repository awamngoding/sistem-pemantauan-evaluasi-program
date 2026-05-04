/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Search as SearchIcon,
  Database,
  Globe,
  Calendar,
  Info,
  Layers,
  Map as MapIcon,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";

// Komponen Internal Premium
import Sidebar from "../../../../components/Sidebar";
import Button from "../../../../components/Button";
import Label from "../../../../components/Label";
import Input from "../../../../components/Input";
import PageWrapper from "../../../../components/PageWrapper";
import Dropdown from "../../../../components/Dropdown";
import Textarea from "../../../../components/Textarea"; // Import Textarea

// Fix icon Marker Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== -6.2) {
      map.flyTo(center, 16, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [center, map]);
  return null;
}

const CreateWilayah = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [formData, setFormData] = useState({
    nama_wilayah: "",
    latitude: -6.2,
    longitude: 106.816666,
    deskripsi: "",
    alamat_lengkap: "", // Field Baru
    tahun_awal_binaan: new Date().getFullYear(),
    status: true,
    tipe_wilayah: "Binaan",
    jenis_wilayah: "Non-Akademik",
    keterangan: "Absolute",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocation = async (query) => {
    if (!query || query.length < 3) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&q=${query}, Indonesia&limit=8&accept-language=id&countrycodes=id`,
      );
      const data = await res.json();
      setSuggestions(data || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Pencarian gagal", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        searchValue.length >= 3 &&
        !formData.nama_wilayah.includes(searchValue)
      ) {
        searchLocation(searchValue);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSelectLocation = async (loc) => {
    const { lat, lon, address, display_name } = loc;

    const prov = address.state || address.region || "";
    const kota = address.city || address.county || address.regency || "";
    const kec =
      address.city_district ||
      address.suburb ||
      address.municipality ||
      address.district ||
      "";

    let namaDetail =
      address.amenity ||
      address.village ||
      address.hamlet ||
      address.suburb ||
      address.road ||
      kec ||
      kota.replace("Kabupaten ", "").replace("Kota ", "");

    const formatNama = `Indonesia/${prov}/${kota}/${namaDetail}`
      .replace(/\/+/g, "/")
      .trim();

    try {
      const token = localStorage.getItem("token");
      const safeName = encodeURIComponent(formatNama);
      const response = await axios.get(
        `http://localhost:3000/wilayah/check-name?nama=${safeName}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.isDuplicate) {
        Swal.fire({
          icon: "warning",
          title: "WILAYAH SUDAH TERDATA",
          text: `Entitas "${namaDetail}" di wilayah ini sudah ada dalam database.`,
          confirmButtonColor: "#2E5AA7",
        });
        setSearchValue("");
        return;
      }

      const deskripsiParts = [
        namaDetail,
        address.village || address.hamlet || "",
        kec,
        kota,
        prov,
      ].filter((val, index, self) => val && self.indexOf(val) === index);

      const deskripsiFinal = deskripsiParts.join(", ") + " - Indonesia";

      setFormData((prev) => ({
        ...prev,
        nama_wilayah: formatNama,
        deskripsi: deskripsiFinal,
        alamat_lengkap: display_name, // Otomatis mengisi alamat lengkap dari API
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      }));

      setSearchValue(namaDetail);
      setShowDropdown(false);
    } catch (error) {
      console.error("Gagal sinkronisasi data wilayah", error);
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=id`,
      );
      const data = await res.json();
      if (data.address) handleSelectLocation(data);
    } catch (err) {
      console.error(err);
    }
  };

  function MapEvents() {
    useMapEvents({
      click(e) {
        fetchAddress(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.alamat_lengkap) {
      return Swal.fire({
        icon: "warning",
        title: "DATA BELUM LENGKAP",
        text: "Mohon isi Alamat Lengkap wilayah tersebut!",
      });
    }

    if (!formData.deskripsi.toLowerCase().includes("indonesia")) {
      return Swal.fire({
        icon: "error",
        title: "WILAYAH ILEGAL",
        text: "Pilih lokasi di Indonesia!",
      });
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        tahun_awal_binaan:
          parseInt(formData.tahun_awal_binaan) || new Date().getFullYear(),
      };

      await axios.post("http://localhost:3000/wilayah", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data Tersimpan!",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/admin/wilayah");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "GAGAL SIMPAN",
        text: error.response?.data?.message || "Kesalahan pada koordinat!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <div className="flex-1 !m-0 !p-0 !rounded-t-[2.5rem] !rounded-b-none border-none shadow-2xl bg-white flex flex-col overflow-hidden relative">
          {/* HEADER */}
          <div className="px-8 md:px-16 pt-10 pb-8 flex flex-col md:flex-row items-center justify-between bg-[#1E5AA5] shrink-0 relative overflow-hidden">
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
                <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
                  SET <span className="text-blue-200">AREA BINAAN</span>
                </h1>
                <p className="text-[8px] font-bold text-blue-100/70 tracking-widest uppercase italic mt-1.5">
                  Spatial Data Management & Geolocation
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white font-black text-[8px] uppercase tracking-widest backdrop-blur-md relative z-10 shadow-inner">
              <Globe size={12} className="text-blue-200" /> CENTRAL GEODETIC V.2
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">
            {/* MAP SIDE */}
            <div className="flex-[6] relative bg-gray-50 border-r border-gray-100 min-h-[300px]">
              <MapContainer
                center={[formData.latitude, formData.longitude]}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ChangeView center={[formData.latitude, formData.longitude]} />
                <Marker position={[formData.latitude, formData.longitude]} />
                <MapEvents />
              </MapContainer>
              <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-xl border border-blue-100 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-[#1E5AA5] uppercase tracking-widest">
                  Live Coordinate Tracking
                </span>
              </div>
            </div>

            {/* FORM SIDE */}
            <div className="flex-[4] flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar px-8 md:px-12 py-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* SEARCH */}
                  <div className="space-y-4" ref={dropdownRef}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-4 bg-[#1E5AA5] rounded-full"></div>
                      <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        Location Search
                      </h3>
                    </div>
                    <div className="space-y-2 relative">
                      <Label
                        text="Cari Nama Wilayah / Alamat"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                      />
                      <div className="relative">
                        <Input
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          placeholder="Ketik wilayah (contoh: Jakarta)..."
                          className="!py-4 !pl-12 !bg-gray-50 !border-gray-100 !rounded-2xl font-bold"
                        />
                        <SearchIcon
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E5AA5]"
                          size={16}
                        />
                      </div>
                      {showDropdown && suggestions.length > 0 && (
                        <div className="absolute left-0 right-0 z-[1001] bg-white border border-blue-100 rounded-2xl shadow-2xl mt-2 overflow-hidden">
                          <ul className="max-h-[250px] overflow-y-auto">
                            {suggestions.map((suggestion, i) => (
                              <li
                                key={i}
                                onClick={() => handleSelectLocation(suggestion)}
                                className="px-6 py-4 hover:bg-blue-50 cursor-pointer border-b border-gray-50 flex flex-col gap-1 transition-colors"
                              >
                                <span className="font-black text-[#1E5AA5] text-[10px] uppercase">
                                  {suggestion.display_name.split(",")[0]}
                                </span>
                                <span className="text-gray-400 text-[8px] truncate italic">
                                  {suggestion.display_name}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="space-y-6 pt-4 border-t border-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          text="Nama Wilayah Terpilih"
                          className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                        />
                        <Input
                          value={formData.nama_wilayah}
                          readOnly
                          className="!py-3 !bg-blue-50/30 !border-blue-100 !text-[#1E5AA5] !font-black !text-[10px] !rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          text="Tahun Awal Binaan"
                          className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                        />
                        <Input
                          type="number"
                          value={formData.tahun_awal_binaan}
                          onChange={(val) =>
                            setFormData({ ...formData, tahun_awal_binaan: val })
                          }
                          className="!py-3 !rounded-xl font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        text="Deskripsi Geografis"
                        className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                      />
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4">
                        <Info
                          size={16}
                          className="text-gray-400 shrink-0 mt-1"
                        />
                        <p className="text-[10px] font-bold text-gray-500 italic leading-relaxed">
                          {formData.deskripsi ||
                            "Silakan pilih titik di peta atau cari lokasi melalui kolom pencarian."}
                        </p>
                      </div>
                    </div>

                    {/* KOMPONEN BARU: TEXTAREA ALAMAT LENGKAP */}
                    <div className="space-y-2">
                      <Label
                        text="Alamat Lengkap (Spesifik)"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                      />
                      <Textarea
                        value={formData.alamat_lengkap}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            alamat_lengkap: e.target.value,
                          })
                        }
                        placeholder="Masukkan detail alamat (No Rumah, RT/RW, Patokan)..."
                        className="!bg-white !border-gray-200 !rounded-2xl !text-[10px] font-bold shadow-sm"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        text="Status Independensi"
                        required
                        className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                      />
                      <Dropdown
                        icon={Layers}
                        value={formData.keterangan}
                        onChange={(val) =>
                          setFormData({ ...formData, keterangan: val })
                        }
                        items={[
                          { value: "Absolute", label: "ABSOLUTE" },
                          { value: "Independent", label: "INDEPENDENT" },
                        ]}
                        className="!py-3.5 !rounded-2xl font-black text-gray-700"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* ACTION BUTTON */}
              <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end shrink-0">
                <Button
                  text={loading ? "SAVING..." : "DAFTARKAN WILAYAH"}
                  icon={<Database size={14} />}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="!bg-[#2E5AA7] !text-white !px-12 !py-4 !rounded-2xl !text-[10px] font-black shadow-xl uppercase tracking-[0.2em]"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default CreateWilayah;
