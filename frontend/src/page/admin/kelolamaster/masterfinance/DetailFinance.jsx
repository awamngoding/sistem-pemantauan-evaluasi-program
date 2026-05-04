/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Wallet,
  Mail,
  Phone,
  ShieldCheck,
  FileCheck,
  CreditCard,
  Edit3,
  UserCheck,
  Activity,
  History,
} from "lucide-react";
import Swal from "sweetalert2";

// Komponen Atomik Premium
import Sidebar from "../../../../components/Sidebar";
import Card from "../../../../components/Card";
import Button from "../../../../components/Button";
import PageWrapper from "../../../../components/PageWrapper";

const DetailFinance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // Menggunakan endpoint /users karena Finance adalah bagian dari user personnel
      const res = await axios.get(`http://localhost:3000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal mengambil data personil finance", "error");
      navigate("/admin/finance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#EEF5FF]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-[#1E5AA5] rounded-full animate-spin"></div>
          <span className="font-black text-[#1E5AA5] text-[10px] tracking-[0.3em] uppercase">
            Verifikasi Otoritas Keuangan...
          </span>
        </div>
      </div>
    );

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-10 pt-20 md:pt-10 pb-6">
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden relative">
          {/* 1. HEADER SECTION */}
          <div className="px-10 pt-10 pb-10 bg-gradient-to-b from-emerald-50/30 to-transparent shrink-0">
            <button
              onClick={() => navigate("/admin/finance")}
              className="flex items-center gap-2 text-[#1E5AA5] font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all mb-8"
            >
              <ArrowLeft size={14} /> Kembali ke Master Finance
            </button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                {/* Finance Profile Icon with Soft Emerald Glow */}
                <div className="relative group">
                  <div className="absolute -inset-2 bg-emerald-400 rounded-[2rem] blur opacity-5 group-hover:opacity-10 transition duration-500"></div>
                  <div className="relative w-24 h-24 bg-emerald-600 rounded-[2rem] shadow-2xl flex items-center justify-center text-white">
                    <Wallet size={40} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-600 text-white text-[8px] font-black rounded-lg uppercase tracking-[0.2em]">
                      Finance Authority
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-sm ${
                        data?.status !== false
                          ? "bg-blue-50 text-[#1E5AA5] border-blue-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}
                    >
                      {data?.status !== false
                        ? "● System Active"
                        : "○ Access Revoked"}
                    </span>
                  </div>
                  <h1 className="text-4xl font-black text-gray-800 uppercase tracking-tighter">
                    {data?.nama}
                  </h1>
                  <p className="text-gray-400 font-bold text-sm tracking-wide flex items-center gap-2 uppercase">
                    <CreditCard size={16} className="text-emerald-600" />
                    Financial Controller Pusat
                  </p>
                </div>
              </div>

              <Button
                text="EDIT PERSONEL"
                icon={<Edit3 size={14} />}
                onClick={() => navigate(`/admin/finance/edit/${id}`)}
                className="!bg-[#1E5AA5] !px-8 !py-4 !rounded-2xl shadow-xl !text-[10px] font-black tracking-widest hover:scale-105 transition-all"
              />
            </div>
          </div>

          {/* 2. INFORMATION GRID */}
          <div className="flex-1 px-10 py-4 overflow-y-auto custom-scrollbar mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1: Peran & Otoritas */}
              <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex flex-col gap-6 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 text-[#1E5AA5] font-black text-[10px] uppercase tracking-[0.3em]">
                  <FileCheck size={16} /> Otoritas Audit
                </div>
                <div className="space-y-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                      Jabatan
                    </label>
                    <p className="font-black text-gray-700 text-lg uppercase tracking-tight">
                      {data?.jabatan || "Staff Finance Pusat"}
                    </p>
                  </div>
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">
                        Verified Auditor
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Komunikasi */}
              <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex flex-col gap-6 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 text-[#1E5AA5] font-black text-[10px] uppercase tracking-[0.3em]">
                  <Mail size={16} /> Jalur Koordinasi
                </div>
                <div className="space-y-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                      Email Korespondensi
                    </label>
                    <p className="font-bold text-gray-700 text-sm lowercase">
                      {data?.email}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                      Nomor Telepon
                    </label>
                    <p className="font-bold text-gray-700 text-sm tracking-widest">
                      {data?.no_telp || "+62 ———— ————"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Aktivitas Sistem */}
              <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex flex-col gap-6 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 text-[#1E5AA5] font-black text-[10px] uppercase tracking-[0.3em]">
                  <History size={16} /> Log Aktivitas
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-black text-gray-400 uppercase">
                      Approval Terakhir
                    </span>
                    <span className="text-[10px] font-black text-gray-800">
                      2 Jam Lalu
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-black text-gray-400 uppercase">
                      Status Otoritas
                    </span>
                    <UserCheck size={16} className="text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. FOOTER */}
          <footer className="px-10 py-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-emerald-600">
                <Activity size={14} />
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">
                Finance & Billing Control System
              </span>
            </div>
            <div className="text-[9px] text-gray-300 font-black uppercase tracking-[0.1em] italic">
              Integrated MDR-Financial Protocol v1.0
            </div>
          </footer>
        </Card>
      </main>
    </PageWrapper>
  );
};

export default DetailFinance;
