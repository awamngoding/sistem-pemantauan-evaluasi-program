/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  User,
  Mail,
  Shield,
  Key,
  Activity,
  Edit3,
  Fingerprint,
  ShieldCheck,
  Lock,
} from "lucide-react";
import Swal from "sweetalert2";

// Komponen Atomik Premium
import Sidebar from "../../../../components/Sidebar";
import Card from "../../../../components/Card";
import Button from "../../../../components/Button";
import PageWrapper from "../../../../components/PageWrapper";

const DetailUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal mengambil profil pengguna", "error");
      navigate("/admin/users");
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
            Menganalisa Otoritas...
          </span>
        </div>
      </div>
    );

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-10 pt-20 md:pt-10 pb-6">
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden relative">
          {/* 1. HEADER PROFILE SECTION */}
          <div className="px-10 pt-10 pb-10 bg-gradient-to-b from-gray-50/50 to-transparent shrink-0">
            <button
              onClick={() => navigate("/admin/users")}
              className="flex items-center gap-2 text-[#1E5AA5] font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all mb-8"
            >
              <ArrowLeft size={14} /> Kembali ke Manajemen User
            </button>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                {/* User Avatar Circle */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-[#1E5AA5] to-blue-300 rounded-full blur opacity-20"></div>
                  <div className="relative w-24 h-24 bg-white rounded-full shadow-2xl border-4 border-white flex items-center justify-center text-[#1E5AA5] overflow-hidden">
                    <span className="text-4xl font-black uppercase">
                      {data?.nama?.charAt(0)}
                    </span>
                  </div>
                  <div
                    className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-white ${data?.status ? "bg-emerald-500" : "bg-red-500 shadow-lg"}`}
                  ></div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gray-900 text-white text-[8px] font-black rounded-lg uppercase tracking-[0.2em]">
                      UID: {String(data?.id_user).padStart(4, "0")}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-sm ${
                        data?.status
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}
                    >
                      {data?.status ? "● Verified Account" : "○ Suspended"}
                    </span>
                  </div>
                  <h1 className="text-4xl font-black text-gray-800 uppercase tracking-tighter">
                    {data?.nama}
                  </h1>
                  <p className="text-gray-400 font-bold text-sm tracking-wide flex items-center gap-2">
                    <Mail size={16} className="text-[#1E5AA5]" />
                    {data?.email}
                  </p>
                </div>
              </div>

              <Button
                text="UPDATE USER"
                icon={<Edit3 size={14} />}
                onClick={() => navigate(`/admin/users/edit/${id}`)}
                className="!bg-[#1E5AA5] !px-8 !py-4 !rounded-2xl shadow-xl !text-[10px] font-black tracking-widest hover:scale-105 transition-all"
              />
            </div>
          </div>

          {/* 2. SECURITY & ACCESS GRID */}
          <div className="flex-1 px-10 py-4 overflow-y-auto custom-scrollbar mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card: Hak Akses */}
              <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex flex-col gap-6 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center gap-2 text-[#1E5AA5] font-black text-[10px] uppercase tracking-[0.3em]">
                  <Shield size={16} /> Level Otoritas
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                      Role Name
                    </label>
                    <p className="font-black text-[#1E5AA5] text-lg uppercase tracking-tight">
                      {data?.role?.nama_role || "Standard User"}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                    <p className="text-[10px] text-blue-600 font-bold leading-relaxed italic">
                      "Memiliki akses penuh untuk mengelola modul sesuai dengan
                      kebijakan IT YPA-MDR."
                    </p>
                  </div>
                </div>
              </div>

              {/* Card: Informasi Akun */}
              <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex flex-col gap-6 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 text-[#1E5AA5] font-black text-[10px] uppercase tracking-[0.3em]">
                  <Fingerprint size={16} /> Metadata Akun
                </div>
                <div className="space-y-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                      Username
                    </label>
                    <p className="font-bold text-gray-700 text-sm">
                      {data?.username ||
                        data?.nama?.toLowerCase().replace(/\s/g, "")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                      Phone Number
                    </label>
                    <p className="font-bold text-gray-700 text-sm tracking-widest">
                      {data?.no_telp || "+62 ———— ————"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card: Security Check */}
              <div className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex flex-col gap-6 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 text-[#1E5AA5] font-black text-[10px] uppercase tracking-[0.3em]">
                  <Lock size={16} /> Keamanan
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <span className="text-[10px] font-black text-emerald-600 uppercase">
                      Status Password
                    </span>
                    <ShieldCheck size={16} className="text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-100/50 rounded-2xl border border-gray-200">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">
                      2FA Not Enabled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. FOOTER */}
          <footer className="px-10 py-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-[#1E5AA5]">
                <Activity size={14} />
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">
                Identity & Access Management
              </span>
            </div>
            <div className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em] italic">
              Security Protocol v4.0.2
            </div>
          </footer>
        </Card>
      </main>
    </PageWrapper>
  );
};

export default DetailUser;
