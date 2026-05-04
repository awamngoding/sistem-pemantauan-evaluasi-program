/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Lock,
  Database,
  Globe,
  MapPin,
  Layers,
  Info,
} from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";

// IMPORT KOMPONEN UI PREMIUM
import Sidebar from "../../../../components/Sidebar";
import Button from "../../../../components/Button";
import Label from "../../../../components/Label";
import Input from "../../../../components/Input";
import PageWrapper from "../../../../components/PageWrapper";
import Dropdown from "../../../../components/Dropdown";

// Fix Marker Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function EditWilayah() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama_wilayah: "",
    deskripsi: "",
    latitude: -6.2,
    longitude: 106.816666,
    keterangan: "Absolute",
    tahun_awal_binaan: "",
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/wilayah/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setFormData({
          nama_wilayah: data.nama_wilayah || "",
          deskripsi: data.deskripsi || "",
          latitude: parseFloat(data.latitude) || -6.2,
          longitude: parseFloat(data.longitude) || 106.816666,
          keterangan: data.keterangan || "Absolute",
          tahun_awal_binaan: data.tahun_awal_binaan || "",
        });
      } catch (err) {
        Swal.fire("Error", "Gagal load data wilayah", "error");
        navigate("/admin/wilayah");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchDetail();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/wilayah/${id}`,
        { keterangan: formData.keterangan },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Status Wilayah Diperbarui!",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/admin/wilayah");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "GAGAL",
        text: error.response?.data?.message || "Server Error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-screen flex items-center justify-center bg-[#EEF5FF]">
        <div className="flex flex-col items-center gap-4 text-[#1E5AA5]">
          <RefreshCw className="animate-spin" size={48} />
          <span className="font-black text-[10px] tracking-[0.3em] uppercase italic">
            Syncing Spatial Data...
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
                  MODIFIKASI{" "}
                  <span className="text-blue-200">STATUS WILAYAH</span>
                </h1>
                <p className="text-[8px] font-bold text-blue-100/70 tracking-widest uppercase italic mt-1.5">
                  Regional Authority Synchronization
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white font-black text-[8px] uppercase tracking-widest backdrop-blur-md relative z-10 shadow-inner">
              <Globe size={12} className="text-blue-200" /> ID:{" "}
              {id?.substring(0, 8)}
            </div>
          </div>

          {/* AREA CONTENT - SPLIT SCREEN */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">
            {/* LEFT SIDE: THE MAP (LOCKED VISUAL) */}
            <div className="flex-[6] relative bg-gray-50 border-r border-gray-100 min-h-[300px] opacity-90">
              <MapContainer
                key={`${formData.latitude}-${formData.longitude}`}
                center={[formData.latitude, formData.longitude]}
                zoom={12}
                dragging={false}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[formData.latitude, formData.longitude]} />
              </MapContainer>
              <div className="absolute top-6 right-6 z-[1000] bg-[#1E5AA5] text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase flex items-center gap-2 shadow-2xl border border-white/20 backdrop-blur-md">
                <Lock size={12} strokeWidth={3} /> Geo-Spatial Locked
              </div>
            </div>

            {/* RIGHT SIDE: THE FORM (EDITABLE SECTION) */}
            <div className="flex-[4] flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar px-8 md:px-12 py-10">
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* READ ONLY SECTION */}
                  <div className="space-y-6 opacity-60">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-4 bg-gray-300 rounded-full"></div>
                      <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        Metadata Wilayah (Read Only)
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Label
                        text="Nama Wilayah Terdaftar"
                        className="!text-[9px] text-gray-400 uppercase tracking-widest"
                      />
                      <div className="relative">
                        <Input
                          value={formData.nama_wilayah}
                          disabled
                          className="!py-4 !pl-12 !bg-gray-50 !border-gray-100 !text-gray-400 !font-bold cursor-not-allowed !rounded-2xl"
                        />
                        <MapPin
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          size={16}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          text="Provinsi / Area"
                          className="!text-[9px] text-gray-400 uppercase tracking-widest"
                        />
                        <Input
                          value={formData.deskripsi}
                          disabled
                          className="!py-3 !bg-gray-50 !border-gray-100 !text-gray-400 !font-bold cursor-not-allowed !rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          text="Tahun Binaan"
                          className="!text-[9px] text-gray-400 uppercase tracking-widest"
                        />
                        <Input
                          value={formData.tahun_awal_binaan}
                          disabled
                          className="!py-3 !bg-gray-50 !border-gray-100 !text-gray-400 !font-bold cursor-not-allowed !rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* EDITABLE SECTION */}
                  <div className="space-y-6 pt-10 border-t-2 border-dashed border-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-4 bg-[#1E5AA5] rounded-full"></div>
                      <h3 className="text-[10px] font-black uppercase text-[#1E5AA5] tracking-widest">
                        Configuration Update
                      </h3>
                    </div>

                    <div className="space-y-3">
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
                        className="!py-4 !rounded-2xl font-black text-gray-700 shadow-sm border-blue-100"
                      />
                    </div>

                    <div className="p-5 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex gap-4">
                      <Info
                        size={18}
                        className="text-[#1E5AA5] shrink-0 mt-0.5"
                      />
                      <p className="text-[9px] text-blue-600/70 font-bold leading-relaxed">
                        Perubahan status wilayah akan memengaruhi kalkulasi
                        pelaporan dan integrasi data pada modul monitoring Area
                        Officer.
                      </p>
                    </div>
                  </div>
                </form>
              </div>

              {/* ACTION BUTTON - RATA KANAN (POPPINS) */}
              <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end items-center gap-4 shrink-0">
                <Button
                  text="BATALKAN"
                  onClick={() => navigate("/admin/wilayah")}
                  className="!bg-white !text-gray-400 !px-10 !py-3.5 !rounded-xl !text-[8px] font-black hover:!bg-gray-50 border border-gray-100 uppercase tracking-widest"
                />
                <Button
                  text={loading ? "SAVING..." : "UPDATE STATUS WILAYAH"}
                  icon={<Database size={14} />}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="!bg-[#2E5AA7] !text-white !px-12 !py-4 !rounded-xl !text-[8px] font-black shadow-xl shadow-blue-900/20 active:scale-95 transition-all border-none uppercase tracking-[0.2em]"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
