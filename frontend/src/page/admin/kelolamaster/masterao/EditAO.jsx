/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Briefcase,
  MapPin,
  RefreshCcw,
  Database,
  Lock,
  Search,
  UserCheck,
  ShieldCheck,
  Mail,
  User,
  Phone,
} from "lucide-react";
import Swal from "sweetalert2";

// Komponen Custom
import Sidebar from "../../../../components/Sidebar";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import PageWrapper from "../../../../components/PageWrapper";
import Checkbox from "../../../../components/Checkbox";

const EditAO = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [wilayahList, setWilayahList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    id_wilayahs: [],
    no_telp: "",
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const token = localStorage.getItem("token");
        const resWilayah = await axios.get("http://localhost:3000/wilayah", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWilayahList(resWilayah.data);

        const resAO = await axios.get(`http://localhost:3000/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = resAO.data;
        setFormData({
          nama: user.nama || "",
          email: user.email || "",
          no_telp: user.no_telp || "",
          id_wilayahs: Array.isArray(user.wilayah)
            ? user.wilayah.map((w) => w.id_wilayah)
            : [],
        });
      } catch (error) {
        Swal.fire("Error", "Gagal sinkronisasi data AO", "error");
        navigate("/admin/ao");
      } finally {
        setFetching(false);
      }
    };
    initData();
  }, [id, navigate]);

  const handleToggleWilayah = (wilayahId) => {
    setFormData((prev) => {
      const isExist = prev.id_wilayahs.includes(wilayahId);
      if (isExist) {
        return {
          ...prev,
          id_wilayahs: prev.id_wilayahs.filter((item) => item !== wilayahId),
        };
      } else {
        return { ...prev, id_wilayahs: [...prev.id_wilayahs, wilayahId] };
      }
    });
  };

  const filteredWilayah = wilayahList.filter((w) =>
    w.nama_wilayah.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/users/${id}`,
        { id_wilayahs: formData.id_wilayahs },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      Swal.fire("Berhasil", "Penugasan Wilayah AO telah diperbarui", "success");
      navigate("/admin/ao");
    } catch (error) {
      Swal.fire("Gagal", "Gagal memperbarui penugasan", "error");
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
                  EDIT <span className="text-blue-200">PENUGASAN AO</span>
                </h1>
                <p className="text-[9px] font-bold text-blue-100/70 tracking-widest uppercase italic mt-2">
                  Structural Authority Update
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-2xl border border-white/20 text-white font-black text-[9px] uppercase tracking-widest backdrop-blur-md relative z-10 shadow-inner">
              <Database size={14} className="text-blue-200" /> SYSTEM CORE V.2
            </div>
          </div>

          {/* AREA FORM */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {fetching ? (
              <div className="flex-1 flex flex-col items-center justify-center text-[#1E5AA5] gap-4">
                <RefreshCcw className="animate-spin" size={40} />
                <p className="font-black text-[10px] tracking-[0.3em] uppercase italic">
                  Syncing Area Assignment...
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="flex-1 overflow-y-auto custom-scrollbar px-8 md:px-16 py-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
                    {/* LEFT: IDENTITY (Locked) */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 space-y-8">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-4 bg-[#1E5AA5] rounded-full"></div>
                          <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                            Verify Profile
                          </h3>
                        </div>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label
                              text="Nama Lengkap"
                              className="!text-[9px] text-gray-400 uppercase tracking-widest"
                            />
                            <div className="relative">
                              <Input
                                value={formData.nama}
                                disabled
                                className="!py-4 !pl-12 !bg-white !border-gray-100 !text-gray-400 !font-bold cursor-not-allowed !rounded-2xl shadow-sm"
                              />
                              <User
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                size={16}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label
                              text="Email Sistem"
                              className="!text-[9px] text-gray-400 uppercase tracking-widest"
                            />
                            <div className="relative">
                              <Input
                                value={formData.email}
                                disabled
                                className="!py-4 !pl-12 !bg-white !border-gray-100 !text-gray-400 !font-bold cursor-not-allowed !rounded-2xl shadow-sm"
                              />
                              <Mail
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                                size={16}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-white rounded-3xl border border-gray-50 shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck
                              size={16}
                              className="text-emerald-500"
                            />
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
                              Akses AO Terverifikasi
                            </span>
                          </div>
                          <p className="text-[9px] text-gray-400 leading-relaxed italic">
                            Identitas di atas bersifat permanen. Perubahan
                            profil personal dilakukan melalui menu Master
                            Pengurus.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: CONFIGURATION */}
                    <div className="lg:col-span-8 space-y-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50 pb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                          <h3 className="text-sm font-black uppercase text-gray-800 tracking-widest">
                            Konfigurasi Wilayah
                          </h3>
                        </div>

                        <div className="relative w-full md:w-80">
                          <input
                            type="text"
                            placeholder="Cari Wilayah Penugasan..."
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl font-bold text-[10px] outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <Search
                            size={14}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-4 custom-scrollbar px-1">
                        {filteredWilayah.length > 0 ? (
                          filteredWilayah.map((w) => (
                            <div
                              key={w.id_wilayah}
                              className="transform transition-all active:scale-[0.98]"
                            >
                              <Checkbox
                                label={w.nama_wilayah
                                  .split("/")
                                  .pop()
                                  .toUpperCase()}
                                value={w.id_wilayah}
                                checked={formData.id_wilayahs.includes(
                                  w.id_wilayah,
                                )}
                                onChange={handleToggleWilayah}
                                className="!bg-gray-50 hover:!bg-blue-50/50 !py-5 !px-6 !rounded-3xl !border-2 !border-transparent checked:!border-[#1E5AA5] transition-all"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <MapPin
                              size={40}
                              className="mx-auto text-gray-200 mb-4"
                            />
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                              Wilayah Tidak Ditemukan
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM ACTION BAR - LUXURY BANJIR */}
                <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl text-[#1E5AA5] shadow-md border border-gray-50">
                      <Database size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-gray-800 uppercase tracking-tight leading-none block">
                        {formData.id_wilayahs.length} Wilayah Ditugaskan
                      </span>
                      <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1 block">
                        Sync status: ready to update
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      text="BATALKAN"
                      onClick={() => navigate("/admin/ao")}
                      className="!bg-white !text-gray-400 !px-10 !py-3.5 !rounded-xl !text-[9px] font-black hover:!bg-gray-100 transition-all border border-gray-100 uppercase tracking-[0.2em]"
                    />
                    <Button
                      text={loading ? "MENYIMPAN..." : "SIMPAN PERUBAHAN TUGAS"}
                      type="submit"
                      disabled={loading}
                      className="!bg-[#2E5AA7] !text-white !px-12 !py-3.5 !rounded-xl !text-[9px] font-black shadow-xl shadow-blue-900/20 active:scale-95 transition-all border-none uppercase tracking-[0.2em]"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default EditAO;
