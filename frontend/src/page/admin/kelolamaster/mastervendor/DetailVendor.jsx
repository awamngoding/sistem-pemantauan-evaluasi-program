/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Database,
  Edit3,
  ShieldCheck,
  User,
  Tags,
  FileText,
  LockKeyhole,
} from "lucide-react";
import Swal from "sweetalert2";

import Sidebar from "../../../../components/Sidebar";
import Button from "../../../../components/Button";
import PageWrapper from "../../../../components/PageWrapper";

const DetailVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:3000/vendor/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        Swal.fire("Error", "Gagal memuat data", "error");
        navigate("/admin/vendor");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#EEF5FF] font-black text-[#1E5AA5] animate-pulse text-[10px] tracking-[0.3em] uppercase">
        Retrieving Partner Metadata...
      </div>
    );

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <div className="flex-1 !m-0 !p-0 !rounded-t-[2.5rem] shadow-2xl bg-white flex flex-col overflow-hidden relative border-none">
          {/* HEADER SECTION */}
          <div className="px-8 md:px-16 pt-10 pb-8 flex flex-col md:flex-row items-center justify-between bg-[#1E5AA5] shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            <div className="flex items-center gap-6 relative z-10">
              <button
                onClick={() => navigate("/admin/vendor")}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white hover:text-[#1E5AA5] transition-all border border-white/20 shadow-lg group"
              >
                <ArrowLeft
                  size={16}
                  strokeWidth={3}
                  className="group-hover:-translate-x-1 transition-transform"
                />
              </button>
              <div>
                <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
                  PROFIL <span className="text-blue-200">VENDOR</span>
                </h1>
                <p className="text-[8px] font-bold text-blue-100/70 tracking-widest uppercase mt-2">
                  System Authorized Partnership Data
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white font-black text-[8px] uppercase tracking-widest relative z-10 shadow-inner">
              <ShieldCheck size={12} className="text-blue-200" /> STATUS:{" "}
              {data?.status?.toUpperCase()}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white px-8 md:px-16 pt-12">
            <div className="max-w-6xl mx-auto flex flex-col gap-12 pb-16">
              {/* TOP IDENTITY */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-gray-50 pb-10">
                <div className="relative shrink-0">
                  <div className="w-28 h-28 bg-blue-50 rounded-[2.5rem] border-4 border-white shadow-xl flex items-center justify-center text-[#1E5AA5] text-4xl font-black">
                    {data?.nama_vendor?.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black rounded-lg uppercase tracking-widest">
                      {data?.pilar?.toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-[#1E5AA5] border border-blue-100 text-[8px] font-black rounded-lg uppercase tracking-widest">
                      REG: {data?.no_register}
                    </span>
                  </div>
                  <h2 className="text-4xl font-[900] text-gray-800 uppercase tracking-tighter">
                    {data?.nama_vendor}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400 font-bold text-[9px] uppercase tracking-[0.2em] italic">
                    <MapPin size={12} className="text-red-400" /> {data?.alamat}
                  </div>
                </div>
                <Button
                  text="MODIFIKASI DATA"
                  icon={<Edit3 size={12} />}
                  onClick={() => navigate(`/admin/vendor/edit/${id}`)}
                  className="!bg-[#1E5AA5] !text-white !px-8 !py-3 !rounded-xl !text-[8px] font-black shadow-lg hover:shadow-blue-200 transition-all border-none uppercase shrink-0"
                />
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* PENANGGUNG JAWAB SECTION */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                    <h3 className="text-[10px] font-black uppercase text-gray-800 tracking-widest">
                      Penanggung Jawab (PJ)
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    {/* PJ 1 */}
                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl text-[#1E5AA5] shadow-sm">
                          <User size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                            PJ UTAMA (1)
                          </span>
                          <span className="text-sm font-black text-gray-700 uppercase">
                            {data?.pj_1 || "-"}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600">
                            {data?.telp_pj_1 || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PJ 2 */}
                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-between opacity-80">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl text-gray-400 shadow-sm">
                          <User size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                            PJ PENDAMPING (2)
                          </span>
                          <span className="text-sm font-black text-gray-700 uppercase">
                            {data?.pj_2 || "TIDAK ADA"}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500">
                            {data?.telp_pj_2 || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LOGIN & LEGALITY SECTION */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
                    <h3 className="text-[10px] font-black uppercase text-gray-800 tracking-widest">
                      Kredensial & Legalitas
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    {/* LOGIN EMAIL */}
                    <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
                      <LockKeyhole
                        size={80}
                        className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"
                      />
                      <div className="relative z-10 flex flex-col gap-1">
                        <span className="text-[8px] font-black text-blue-200 uppercase tracking-[0.2em]">
                          Username Akun Login
                        </span>
                        <span className="text-lg font-black lowercase truncate">
                          {data?.user?.email || data?.email}
                        </span>
                        <div className="mt-2 flex items-center gap-2">
                          <ShieldCheck size={12} className="text-blue-300" />
                          <span className="text-[8px] font-bold uppercase">
                            Multi-Role Authorization Active
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* DOKUMEN PREVIEW (MOCKUP) */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col gap-3">
                        <FileText size={20} className="text-red-400" />
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                            File NPWP
                          </span>
                          <span className="text-[9px] font-bold text-gray-600 truncate">
                            {data?.npwp_file || "NPWP_FILE.PDF"}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col gap-3">
                        <FileText size={20} className="text-blue-400" />
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                            File KTP PJ
                          </span>
                          <span className="text-[9px] font-bold text-gray-600 truncate">
                            {data?.ktp_pj_file || "KTP_PJ_FILE.PDF"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-8 md:px-16 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-end shrink-0">
            <Button
              text="KEMBALI KE DIREKTORI"
              onClick={() => navigate("/admin/vendor")}
              className="!bg-white !text-gray-400 !px-10 !py-3.5 !rounded-xl !text-[8px] font-black hover:!bg-gray-50 border border-gray-100 uppercase tracking-widest shadow-sm"
            />
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default DetailVendor;
