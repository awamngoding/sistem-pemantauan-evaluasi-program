/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Briefcase,
  Phone,
  RefreshCcw,
  User,
  Mail,
  Database,
} from "lucide-react";
import Swal from "sweetalert2";

import Sidebar from "../../../../components/Sidebar";
import Card from "../../../../components/Card";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import Button from "../../../../components/Button";
import PageWrapper from "../../../../components/PageWrapper";
import Dropdown from "../../../../components/Dropdown";

const EditPengurus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    jabatan: "Ketua Pengurus",
    id_role: 1,
  });

  const jabatanOptions = [
    { value: "Ketua Pengurus", label: "KETUA PENGURUS" },
    { value: "Sekretaris", label: "SEKRETARIS" },
    { value: "Bendahara", label: "BENDAHARA" },
    { value: "Anggota Pengurus", label: "ANGGOTA PENGURUS" },
  ];

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
            jabatan: res.data.jabatan || "Ketua Pengurus",
            id_role: 1,
          });
        }
      } catch (err) {
        Swal.fire("Error", "Gagal sinkronisasi data", "error");
        navigate("/admin/pengurus");
      } finally {
        setFetching(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://localhost:3000/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Berhasil", "Data Otoritas Pusat Telah Diperbarui", "success");
      navigate("/admin/pengurus");
    } catch (err) {
      Swal.fire("Gagal", "Internal Server Error", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-screen flex items-center justify-center bg-[#EEF5FF]">
        <div className="flex flex-col items-center gap-4 text-[#1E5AA5] font-black text-[10px] tracking-widest uppercase italic">
          <RefreshCcw className="animate-spin" size={40} /> Syncing...
        </div>
      </div>
    );

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <div className="flex-1 !m-0 !p-0 !rounded-t-[2.5rem] !rounded-b-none border-none shadow-2xl bg-white flex flex-col overflow-hidden relative">
          <div className="px-8 md:px-16 pt-12 pb-10 flex flex-col md:flex-row items-center justify-between bg-[#1E5AA5] shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-6 relative z-10">
              <button
                onClick={() => navigate("/admin/pengurus")}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white hover:text-[#1E5AA5] transition-all border border-white/20 shadow-lg backdrop-blur-md group"
              >
                <ArrowLeft
                  size={18}
                  strokeWidth={3}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </button>
              <div>
                <h1 className="text-2xl font-black text-white uppercase leading-none">
                  EDIT <span className="text-blue-200">PENGURUS</span>
                </h1>
                <p className="text-[9px] font-bold text-blue-100/70 tracking-widest uppercase italic mt-2">
                  Structural Authority Update
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-white/10 rounded-2xl border border-white/20 text-white font-black text-[9px] uppercase tracking-widest backdrop-blur-md relative z-10 shadow-inner">
              <Database size={14} className="text-blue-200" /> ID:{" "}
              <span className="opacity-70">{id?.substring(0, 8)}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 md:px-16 py-10 bg-white">
            <form
              onSubmit={handleSubmit}
              className="max-w-5xl mx-auto h-full flex flex-col"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pt-20 flex-1">
                <div className="space-y-8">
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
                      text="Alamat Email (Locked)"
                      className="!text-[9px] text-gray-400 uppercase tracking-widest"
                    />
                    <div className="relative">
                      <Input
                        value={formData.email}
                        disabled
                        className="!py-4.5 !pl-12 !bg-gray-50/50 !border-gray-100 !text-gray-400 !font-bold cursor-not-allowed !rounded-2xl"
                      />
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                        size={16}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <Label
                      text="Posisi Struktural"
                      required
                      className="!text-[9px] text-[#1E5AA5] uppercase tracking-widest"
                    />
                    <Dropdown
                      icon={Briefcase}
                      value={formData.jabatan}
                      onChange={(val) =>
                        setFormData({ ...formData, jabatan: val })
                      }
                      items={jabatanOptions}
                      className="!py-4.5 !bg-white !border-gray-200 !rounded-2xl font-extrabold text-gray-700 shadow-sm"
                    />
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
                        onChange={(e) =>
                          setFormData({ ...formData, no_telp: e.target.value })
                        }
                        placeholder="0812xxxx"
                        className="!py-4.5 !pl-12 !bg-white !border-gray-200 !rounded-2xl font-extrabold shadow-sm"
                      />
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                        size={16}
                      />
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center gap-3 pt-12 pb-16 shrink-0">
                <Button
                  text="BATALKAN"
                  onClick={() => navigate("/admin/pengurus")}
                  className="!bg-white !text-gray-400 !px-7 !py-2.5 !rounded-xl !text-[9px] font-black border border-gray-100 uppercase"
                />
                <Button
                  text={loading ? "SAVING..." : "SIMPAN PERUBAHAN"}
                  type="submit"
                  disabled={loading}
                  className="!bg-[#2E5AA7] !text-white !px-10 !py-2.5 !rounded-xl !text-[9px] font-black shadow-lg uppercase"
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default EditPengurus;
