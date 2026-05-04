/* eslint-disable no-unused-vars */
import Sidebar from "../../../components/Sidebar";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import PageWrapper from "../../../components/PageWrapper";
import Label from "../../../components/Label";
import { toast } from "react-toastify";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  MapPin,
  User,
  Calendar,
  FileText,
  Download,
  Briefcase,
  Info,
  LayoutDashboard,
  Eye,
} from "lucide-react";

function DetailProgramNonAkademik() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/program/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProgram(data);
      } catch (error) {
        console.error("Gagal mengambil detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F4F7FE] font-black text-orange-500 animate-pulse uppercase tracking-widest">
        Membuka Berkas Program...
      </div>
    );
  }

  if (!program) {
    return (
      <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
          <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-t-[2.5rem] rounded-b-[2.5rem] border-none shadow-2xl bg-white overflow-hidden relative">
            <div className="px-8 pt-6 pb-6 shrink-0">
              <header className="flex flex-row items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-red-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition animate-pulse"></div>
                    <div className="relative p-3.5 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl text-white shadow-xl">
                      <Info size={22} strokeWidth={2} />
                    </div>
                  </div>
                  <div className="flex flex-col -space-y-1">
                    <Label
                      text="Data Tidak Ditemukan"
                      className="!text-[8px] !text-red-500 !font-black tracking-[0.3em] !mb-1 uppercase"
                    />
                    <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                      Program <span className="text-red-500">Tidak Ada</span>
                    </h1>
                  </div>
                </div>
                <Button
                  text="← Kembali"
                  icon={<ArrowLeft size={14} />}
                  onClick={() => navigate("/ho/program/non-akademik")}
                  className="group !bg-gray-600 hover:!bg-gray-700 !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
                />
              </header>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col px-10 pb-4">
              <div className="flex-1 bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col shadow-sm">
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-gray-900">
                    <Info size={40} className="mb-2" />
                    <p className="text-xs font-black uppercase tracking-widest">
                      Data Program Tidak Ditemukan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-t-[2.5rem] rounded-b-[2.5rem] border-none shadow-2xl bg-white overflow-hidden relative">
          <div className="px-8 pt-6 pb-6 shrink-0">
            <header className="flex flex-row items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition animate-pulse"></div>
                  <div className="relative p-3.5 bg-gradient-to-br from-[#2E5AA7] to-[#164a8a] rounded-2xl text-white shadow-xl">
                    <FileText size={22} strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-col -space-y-1">
                  <Label
                    text="Sistem Monitoring dan Evaluasi Program"
                    className="!text-[8px] !text-[#1E5AA5] !font-black tracking-[0.3em] !mb-1 uppercase"
                  />
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Detail Program{" "}
                    <span className="text-[#2E5AA7]">Non Akademik</span>
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                    program.status_program === "Aktif"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}
                >
                  {program.status_program || "Draft"}
                </span>
                <Button
                  text="← Kembali"
                  icon={<ArrowLeft size={14} />}
                  onClick={() => navigate("/ho/program/non-akademik")}
                  className="group !bg-gray-600 hover:!bg-gray-700 !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
                />
              </div>
            </header>

            <div className="flex flex-row items-center gap-3 mb-6">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-[#1E5AA5] rounded-xl border border-blue-100 font-black text-[9px] uppercase tracking-[0.2em] shrink-0">
                <FileText size={14} /> Program: {program.nama_program}
              </div>
              <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-50 text-gray-600 rounded-xl border border-gray-100 font-black text-[9px] uppercase tracking-[0.2em] shrink-0">
                <LayoutDashboard size={14} /> Kode: {program.kode_program}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col px-10 pb-4">
            <div className="flex-1 bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col shadow-sm">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Informasi Utama */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-100">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Info size={20} className="text-blue-600" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 uppercase tracking-wide">
                        Informasi Utama
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User
                          size={16}
                          className="text-gray-400 mt-1 flex-shrink-0"
                        />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                            Head Office
                          </p>
                          <p className="text-sm font-bold text-gray-800">
                            {program.nama_pembuat || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin
                          size={16}
                          className="text-gray-400 mt-1 flex-shrink-0"
                        />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                            Sekolah Tujuan
                          </p>
                          <p className="text-sm font-bold text-gray-800">
                            {program.sekolah || "-"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {program.wilayah_kota || "-"},{" "}
                            {program.wilayah_provinsi || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Briefcase
                          size={16}
                          className="text-gray-400 mt-1 flex-shrink-0"
                        />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                            Area Officer
                          </p>
                          <p className="text-sm font-bold text-gray-800">
                            {program.pengawas || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <LayoutDashboard
                          size={16}
                          className="text-gray-400 mt-1 flex-shrink-0"
                        />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                            Vendor
                          </p>
                          <p className="text-sm font-bold text-gray-800">
                            {program.nama_vendor || "Tidak menggunakan vendor"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detail Pelaksanaan */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-100">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Calendar size={20} className="text-green-600" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 uppercase tracking-wide">
                        Detail Pelaksanaan
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <Calendar
                            size={16}
                            className="text-gray-400 mt-1 flex-shrink-0"
                          />
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                              Tahun
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                              {program.tahun || "-"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Calendar
                            size={16}
                            className="text-gray-400 mt-1 flex-shrink-0"
                          />
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                              Tanggal Mulai
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                              {program.tanggal_mulai
                                ? new Date(
                                    program.tanggal_mulai,
                                  ).toLocaleDateString("id-ID")
                                : "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FileText
                          size={16}
                          className="text-gray-400 mt-1 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                            Deskripsi
                          </p>
                          <div className="bg-gray-50 p-4 rounded-xl border text-sm text-gray-700 min-h-[100px]">
                            {program.deskripsi || "Tidak ada deskripsi."}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Download
                          size={16}
                          className="text-gray-400 mt-1 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                            Dokumen MOU
                          </p>
                          {program.file_mou_nama ? (
                            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-4 rounded-xl">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <FileText
                                  size={20}
                                  className="text-blue-500 flex-shrink-0"
                                />
                                <span className="text-sm text-blue-700 font-bold truncate">
                                  {program.file_mou_nama}
                                </span>
                              </div>
                              <a
                                href={`http://localhost:3000/${program.file_mou_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                              >
                                Lihat
                              </a>
                            </div>
                          ) : (
                            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                              <p className="text-sm text-gray-500 italic">
                                Belum ada dokumen MOU yang diunggah.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                  <Button
                    text="Edit Program"
                    icon={<Edit3 size={14} />}
                    onClick={() =>
                      navigate(
                        `/ho/program/non-akademik/edit/${program.id_program}`,
                      )
                    }
                    className="!bg-amber-50 !text-amber-600 hover:!bg-amber-600 hover:!text-white !rounded-xl !px-6 !py-3 !text-sm font-black transition-all shadow-sm"
                  />
                  <Button
                    text="Kelola Kegiatan"
                    icon={<LayoutDashboard size={14} />}
                    onClick={() =>
                      navigate(
                        `/ho/program/non-akademik/calendar/${program.id_program}`,
                      )
                    }
                    className="!bg-blue-50 !text-blue-600 hover:!bg-blue-600 hover:!text-white !rounded-xl !px-6 !py-3 !text-sm font-black transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
}

export default DetailProgramNonAkademik;
