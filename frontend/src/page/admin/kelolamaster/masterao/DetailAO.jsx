/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Database,
  Edit3,
  UserCheck,
  Award,
  Globe,
} from "lucide-react";
import Swal from "sweetalert2";

// Komponen Premium
import Sidebar from "../../../../components/Sidebar";
import Button from "../../../../components/Button";
import PageWrapper from "../../../../components/PageWrapper";
import Label from "../../../../components/Label";

const DetailAO = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        Swal.fire("Error", "Gagal mengambil data Area Officer", "error");
        navigate("/admin/ao");
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
            Retrieving AO Identity...
          </span>
        </div>
      </div>
    );

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <div className="flex-1 !m-0 !p-0 !rounded-t-[2.5rem] !rounded-b-none border-none shadow-2xl bg-white flex flex-col overflow-hidden relative">
          {/* 1. TOP HEADER BAR - BLUE LUXURY */}
          <div className="px-8 md:px-16 pt-10 pb-8 flex flex-col md:flex-row items-center justify-between bg-[#1E5AA5] shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-6 relative z-10">
              <button
                onClick={() => navigate("/admin/ao")}
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
                  DETAIL <span className="text-blue-200">AREA OFFICER</span>
                </h1>
                <p className="text-[8px] font-bold text-blue-100/70 tracking-widest uppercase italic mt-1.5">
                  Verified Field Management
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white font-black text-[8px] uppercase tracking-widest backdrop-blur-md relative z-10 shadow-inner">
              <Database size={12} className="text-blue-200" />
              ID: {id?.substring(0, 8)}
            </div>
          </div>

          {/* 2. AREA CONTENT - WIDE & SIMETRIS */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden px-8 md:px-16 items-center">
            <div className="max-w-6xl w-full h-full flex flex-col items-center justify-between mx-auto">
              {/* Profile Section (Center) */}
              <div className="flex flex-col items-center text-center gap-4 pt-12 pb-8 w-full border-b border-gray-50 shrink-0">
                <div className="relative group shrink-0">
                  <div className="absolute -inset-1.5 bg-blue-500 rounded-[2rem] blur opacity-10"></div>
                  <div className="relative w-24 h-24 bg-gray-50 rounded-[2rem] border-4 border-white shadow-xl flex items-center justify-center text-[#1E5AA5] overflow-hidden uppercase text-4xl font-black">
                    {data?.nama?.charAt(0)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-center gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black rounded-lg uppercase tracking-widest">
                      ● Active AO Account
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-[#1E5AA5] border border-blue-100 text-[8px] font-black rounded-lg uppercase tracking-widest">
                      AREA OFFICER
                    </span>
                  </div>
                  <h2 className="text-3xl font-[900] text-gray-800 uppercase tracking-tighter leading-none">
                    {data?.nama}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-gray-400 font-bold text-[9px] uppercase tracking-widest italic">
                    <Award size={12} className="text-[#1E5AA5]" />
                    Field Monitoring Specialist YPA-MDR
                  </div>
                </div>
              </div>

              {/* Information Grid (WIDE - 2 Column) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10 py-10 w-full flex-1 items-start">
                {/* Kolom Kiri: Contact & Identity */}
                <div className="space-y-10 flex flex-col items-center md:items-start w-full">
                  <div className="space-y-3 w-full flex flex-col items-center md:items-start text-center md:text-left">
                    <Label
                      text="Kontak Personel"
                      className="!text-[9px] text-[#1E5AA5] uppercase tracking-[0.3em]"
                    />
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-[#1E5AA5] transition-all shrink-0 shadow-sm">
                          <Mail size={16} />
                        </div>
                        <span className="font-bold text-gray-700 text-sm lowercase leading-none">
                          {data?.email}
                        </span>
                      </div>
                      {/* <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-[#1E5AA5] transition-all shrink-0 shadow-sm">
                          <Phone size={16} />
                        </div>
                        <span className="font-bold text-gray-700 text-sm tracking-[0.1em]">
                          {data?.no_telp || "+62 ———— ————"}
                        </span>
                      </div> */}
                    </div>
                  </div>

                  <div className="space-y-3 w-full flex flex-col items-center md:items-start text-center md:text-left">
                    <Label
                      text="Security Status"
                      className="!text-[9px] text-[#1E5AA5] uppercase tracking-[0.3em]"
                    />
                    <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-50">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono font-black text-gray-700 text-sm tracking-tighter uppercase">
                          AO_VERIFIED_IDENTITY
                        </span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">
                          Secured by YPA-MDR Cloud System
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan: Wilayah Penugasan */}
                <div className="space-y-3 w-full flex flex-col items-center md:items-start">
                  <Label
                    text="Wilayah Penugasan Terdaftar"
                    className="!text-[9px] text-[#1E5AA5] uppercase tracking-[0.3em]"
                  />
                  <div className="w-full flex flex-wrap gap-2 justify-center md:justify-start">
                    {data?.wilayah && data.wilayah.length > 0 ? (
                      data.wilayah.map((w, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 px-4 py-2 bg-blue-50/50 rounded-xl border border-blue-100 hover:bg-blue-50 transition-colors shadow-sm"
                        >
                          <MapPin size={12} className="text-[#1E5AA5]" />
                          <span className="text-[10px] font-black text-gray-700 uppercase tracking-tight">
                            {w.nama_wilayah?.split("/").pop()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="w-full py-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center opacity-40">
                        <Globe size={24} className="text-gray-400 mb-2" />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          Belum Ada Penugasan
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. ACTION AREA - RATA KANAN (POPPINS) */}
              <div className="w-full flex justify-end items-center gap-4 pt-4 pb-12 shrink-0">
                <Button
                  text="KEMBALI"
                  onClick={() => navigate("/admin/ao")}
                  className="!bg-white !text-gray-400 !px-10 !py-3.5 !rounded-xl !text-[8px] font-black hover:!bg-gray-50 border border-gray-100 uppercase tracking-widest shadow-sm"
                />
                <Button
                  text="MODIFIKASI DATA"
                  icon={<Edit3 size={12} />}
                  onClick={() => navigate(`/admin/ao/edit/${id}`)}
                  className="!bg-[#2E5AA7] !text-white !px-12 !py-3.5 !rounded-xl !text-[8px] font-black shadow-lg shadow-blue-900/10 active:scale-95 border-none uppercase tracking-widest"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default DetailAO;
