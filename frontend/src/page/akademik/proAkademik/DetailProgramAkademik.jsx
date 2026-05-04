/* eslint-disable no-undef */
import Sidebar from "../../../components/Sidebar";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import PageWrapper from "../../../components/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  Download,
  UserCheck,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  BarChart3,
  Zap,
  Activity,
  Building2,
  Clock,
  ChevronRight,
  Layers,
  Target,
  TrendingUp,
  Calendar,
  Users,
  Check,
  CreditCard,
  FileCheck,
  FolderOpen,
} from "lucide-react";
import { toast } from "react-toastify";

function DetailProgramAkademik() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(2); // default ke Pelaksanaan
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);

  // Data Dummy
  const dummyFases = [
    {
      id: 0,
      nama_fase: "Inisiasi",
      status: "completed",
      progress: 100,
      tanggal: "Jan 2024",
      kegiatan: [
        {
          id: 1,
          nama_kegiatan: "Kick-off Meeting & Pembentukan Tim",
          status: "completed",
          tanggal: "5 Jan 2024",
          pic: "Project Manager",
          deskripsi: "Pertemuan awal untuk membahas scope program.",
          termin: [
            {
              id: 1,
              nama: "Notulensi Meeting",
              jenis: "dokumentasi",
              status: "completed",
              tanggal: "5 Jan 2024",
              file: true,
            },
            {
              id: 2,
              nama: "Daftar Hadir Tim",
              jenis: "dokumentasi",
              status: "completed",
              tanggal: "5 Jan 2024",
              file: true,
            },
            {
              id: 3,
              nama: "Pembayaran Termin I",
              jenis: "pembayaran",
              status: "completed",
              tanggal: "10 Jan 2024",
              jumlah: "Rp 75.000.000",
            },
          ],
        },
        {
          id: 2,
          nama_kegiatan: "Studi Kelayakan",
          status: "completed",
          tanggal: "12 Jan 2024",
          pic: "Tim Analis",
          deskripsi: "Analisis kelayakan program.",
          termin: [
            {
              id: 1,
              nama: "Laporan Studi Kelayakan",
              jenis: "dokumentasi",
              status: "completed",
              tanggal: "15 Jan 2024",
              file: true,
            },
            {
              id: 2,
              nama: "Pembayaran Termin II",
              jenis: "pembayaran",
              status: "completed",
              tanggal: "20 Jan 2024",
              jumlah: "Rp 40.000.000",
            },
          ],
        },
      ],
    },
    {
      id: 1,
      nama_fase: "Perencanaan",
      status: "completed",
      progress: 100,
      tanggal: "Feb 2024",
      kegiatan: [
        {
          id: 1,
          nama_kegiatan: "Perencanaan Kurikulum",
          status: "completed",
          tanggal: "5 Feb 2024",
          pic: "Tim Akademik",
          deskripsi: "Penyusunan kurikulum dan modul pembelajaran.",
          termin: [
            {
              id: 1,
              nama: "Dokumen Kurikulum",
              jenis: "dokumentasi",
              status: "completed",
              tanggal: "8 Feb 2024",
              file: true,
            },
            {
              id: 2,
              nama: "Modul Ajar",
              jenis: "dokumentasi",
              status: "completed",
              tanggal: "12 Feb 2024",
              file: true,
            },
            {
              id: 3,
              nama: "Pembayaran",
              jenis: "pembayaran",
              status: "completed",
              tanggal: "15 Feb 2024",
              jumlah: "Rp 50.000.000",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      nama_fase: "Pelaksanaan",
      status: "active",
      progress: 65,
      tanggal: "Mar-Mei 2024",
      kegiatan: [
        {
          id: 1,
          nama_kegiatan: "Pelaksanaan Program Inti",
          status: "in-progress",
          tanggal: "1 Mar 2024",
          pic: "Tim Lapangan",
          deskripsi: "Pelaksanaan program sesuai kurikulum.",
          termin: [
            {
              id: 1,
              nama: "Laporan Mingguan",
              jenis: "dokumentasi",
              status: "completed",
              tanggal: "7 Mar 2024",
              file: true,
            },
            {
              id: 2,
              nama: "Dokumentasi Kegiatan",
              jenis: "dokumentasi",
              status: "completed",
              tanggal: "15 Mar 2024",
              file: true,
            },
            {
              id: 3,
              nama: "Pembayaran Termin I",
              jenis: "pembayaran",
              status: "completed",
              tanggal: "15 Mar 2024",
              jumlah: "Rp 100.000.000",
            },
            {
              id: 4,
              nama: "Laporan Bulanan",
              jenis: "dokumentasi",
              status: "pending",
              tanggal: "31 Mar 2024",
              file: false,
            },
            {
              id: 5,
              nama: "Pembayaran Termin II",
              jenis: "pembayaran",
              status: "pending",
              tanggal: "30 Apr 2024",
              jumlah: "Rp 100.000.000",
            },
          ],
        },
        {
          id: 2,
          nama_kegiatan: "Monitoring & Evaluasi",
          status: "in-progress",
          tanggal: "Ongoing",
          pic: "Supervisor",
          deskripsi: "Monitoring harian dan evaluasi mingguan.",
          termin: [
            {
              id: 1,
              nama: "Form Monitoring",
              jenis: "dokumentasi",
              status: "completed",
              tanggal: "Daily",
              file: true,
            },
            {
              id: 2,
              nama: "Laporan Evaluasi",
              jenis: "dokumentasi",
              status: "in-progress",
              tanggal: "Setiap Jumat",
              file: false,
            },
            {
              id: 3,
              nama: "Pembayaran",
              jenis: "pembayaran",
              status: "pending",
              tanggal: "Akhir Bulan",
              jumlah: "Rp 50.000.000",
            },
          ],
        },
      ],
    },
    {
      id: 3,
      nama_fase: "Monitoring",
      status: "pending",
      progress: 0,
      tanggal: "Jun 2024",
      kegiatan: [
        {
          id: 1,
          nama_kegiatan: "Pengawasan & Pengendalian Mutu",
          status: "pending",
          tanggal: "TBD",
          pic: "Tim QA",
          deskripsi: "Pengawasan kualitas pelaksanaan program.",
          termin: [
            {
              id: 1,
              nama: "Checklist Kualitas",
              jenis: "dokumentasi",
              status: "pending",
              tanggal: "TBD",
              file: false,
            },
            {
              id: 2,
              nama: "Laporan Audit",
              jenis: "dokumentasi",
              status: "pending",
              tanggal: "TBD",
              file: false,
            },
            {
              id: 3,
              nama: "Pembayaran",
              jenis: "pembayaran",
              status: "pending",
              tanggal: "TBD",
              jumlah: "Rp 75.000.000",
            },
          ],
        },
      ],
    },
    {
      id: 4,
      nama_fase: "Evaluasi",
      status: "pending",
      progress: 0,
      tanggal: "Jul 2024",
      kegiatan: [
        {
          id: 1,
          nama_kegiatan: "Evaluasi Capaian Program",
          status: "pending",
          tanggal: "TBD",
          pic: "Tim Evaluator",
          deskripsi: "Evaluasi capaian program.",
          termin: [
            {
              id: 1,
              nama: "Laporan Evaluasi",
              jenis: "dokumentasi",
              status: "pending",
              tanggal: "TBD",
              file: false,
            },
            {
              id: 2,
              nama: "Pembayaran",
              jenis: "pembayaran",
              status: "pending",
              tanggal: "TBD",
              jumlah: "Rp 60.000.000",
            },
          ],
        },
      ],
    },
    {
      id: 5,
      nama_fase: "Pelaporan",
      status: "pending",
      progress: 0,
      tanggal: "Aug 2024",
      kegiatan: [
        {
          id: 1,
          nama_kegiatan: "Penyusunan Laporan Akhir",
          status: "pending",
          tanggal: "TBD",
          pic: "Tim Admin",
          deskripsi: "Penyusunan laporan akhir.",
          termin: [
            {
              id: 1,
              nama: "Draft Laporan",
              jenis: "dokumentasi",
              status: "pending",
              tanggal: "TBD",
              file: false,
            },
            {
              id: 2,
              nama: "Pembayaran Akhir",
              jenis: "pembayaran",
              status: "pending",
              tanggal: "TBD",
              jumlah: "Rp 40.000.000",
            },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const resDetail = await fetch(`http://localhost:3000/program/${id}`, {
          headers,
        });
        const detailJson = await resDetail.json();
        const apiData = detailJson.data || detailJson;

        setData({
          ...apiData,
          fases: dummyFases,
          nama_sekolah: "SMK Negeri 1 Jakarta",
          wilayah: "DKI Jakarta",
          npsn: "20109321",
          nama_ho: "Dr. Ahmad Budiman, M.Pd",
          nama_ao: "Drs. Slamet Riyadi, M.Si",
          daftar_vendor: "PT Edukasi Nusantara, CV Sarana Prima",
        });
      } catch (err) {
        toast.error("Gagal mengambil data");
        setData({
          id_program: id,
          nama_program: "Program Akademik",
          fases: dummyFases,
          nama_sekolah: "SMK Negeri 1 Jakarta",
          wilayah: "DKI Jakarta",
          npsn: "20109321",
          nama_ho: "Dr. Ahmad Budiman, M.Pd",
          nama_ao: "Drs. Slamet Riyadi, M.Si",
          daftar_vendor: "PT Edukasi Nusantara, CV Sarana Prima",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getDokumentasiCount = (termin) =>
    termin.filter((t) => t.jenis === "dokumentasi").length;
  const getDokumentasiCompleted = (termin) =>
    termin.filter((t) => t.jenis === "dokumentasi" && t.status === "completed")
      .length;
  const getPaymentStatus = (termin) => {
    const payments = termin.filter((t) => t.jenis === "pembayaran");
    const completed = payments.filter((p) => p.status === "completed").length;
    if (payments.length === 0)
      return { text: "No Payment", color: "text-slate-400" };
    if (completed === payments.length)
      return { text: "Lunas", color: "text-emerald-600" };
    if (completed > 0) return { text: "Sebagian", color: "text-amber-600" };
    return { text: "Belum Dibayar", color: "text-red-500" };
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return null;

  const currentFase = data.fases[selectedPhaseIndex];
  const kegiatanList = currentFase?.kegiatan || [];
  const selectedKegiatanData = kegiatanList.find(
    (k) => k.id === selectedKegiatan?.id,
  );

  return (
    <PageWrapper className="h-screen overflow-hidden flex bg-white !p-0 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <header className="shrink-0 bg-white border-b border-slate-100 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">
                  {data.nama_program}
                </h1>
                <p className="text-[10px] text-slate-400">
                  ID: {data.id_program} • NPSN: {data.npsn}
                </p>
              </div>
            </div>
            <Button
              text="Back"
              icon={<ArrowLeft size={14} />}
              onClick={() => navigate(-1)}
              className="!bg-white !text-slate-600 !border !border-slate-200 !rounded-lg !px-3 !py-1.5 !text-[11px]"
            />
          </div>

          <div className="grid grid-cols-4 gap-4 text-left">
            <div>
              <p className="text-[9px] font-medium text-slate-400 uppercase">
                Sekolah
              </p>
              <p className="text-xs font-semibold text-slate-800">
                {data.nama_sekolah}
              </p>
              <p className="text-[10px] text-slate-400">{data.wilayah}</p>
            </div>
            <div>
              <p className="text-[9px] font-medium text-slate-400 uppercase">
                Penanggung Jawab
              </p>
              <p className="text-xs font-semibold text-slate-800">
                {data.nama_ho}
              </p>
              <p className="text-[10px] text-slate-400">AO: {data.nama_ao}</p>
            </div>
            <div>
              <p className="text-[9px] font-medium text-slate-400 uppercase">
                Mitra
              </p>
              <p className="text-xs font-semibold text-slate-800">
                {data.daftar_vendor}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-slate-400" />
                <span className="text-xs text-slate-600">
                  {data.file_mou || "MOU_2024.pdf"}
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <Download size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* LEFT SIDEBAR - LIST KEGIATAN (bukan fase) */}
          <div className="w-80 bg-white border border-slate-100 rounded-xl overflow-hidden flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-100 bg-slate-50/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen size={12} className="text-blue-500" />
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    Kegiatan
                  </span>
                </div>
                <span className="text-[9px] text-slate-400">
                  {currentFase.nama_fase} • {kegiatanList.length} item
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {kegiatanList.map((keg, idx) => {
                const docComplete = getDokumentasiCompleted(keg.termin);
                const docTotal = getDokumentasiCount(keg.termin);
                const payment = getPaymentStatus(keg.termin);

                return (
                  <button
                    key={keg.id}
                    onClick={() => setSelectedKegiatan(keg)}
                    className={`w-full p-3 text-left transition-all ${
                      selectedKegiatan?.id === keg.id
                        ? "bg-blue-50/50 border-l-2 border-l-blue-500"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5 ${
                          keg.status === "completed"
                            ? "bg-emerald-100 text-emerald-600"
                            : keg.status === "in-progress"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-slate-700 truncate">
                          {keg.nama_kegiatan}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] text-slate-400">
                            {keg.tanggal}
                          </span>
                          <span className="text-[8px] text-slate-400">•</span>
                          <span className="text-[8px] text-slate-400">
                            {keg.pic}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[7px] font-medium text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
                            📄 {docComplete}/{docTotal}
                          </span>
                          <span
                            className={`text-[7px] font-medium px-1 py-0.5 rounded ${payment.color} bg-slate-50`}
                          >
                            💰 {payment.text}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        size={12}
                        className={`text-slate-300 mt-2 ${selectedKegiatan?.id === keg.id ? "text-blue-500" : ""}`}
                      />
                    </div>
                  </button>
                );
              })}
              {kegiatanList.length === 0 && (
                <div className="p-6 text-center">
                  <p className="text-[10px] text-slate-400">
                    Belum ada kegiatan
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - DETAIL TERMIN */}
          <div className="flex-1 flex flex-col gap-5 overflow-hidden">
            {/* INFO FASE SAAT INI */}
            <div className="bg-white border border-slate-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-medium text-slate-400 uppercase">
                      Fase Saat Ini
                    </span>
                    <span
                      className={`text-[8px] font-medium px-1.5 py-0.5 rounded ${
                        currentFase.status === "completed"
                          ? "bg-emerald-50 text-emerald-600"
                          : currentFase.status === "active"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {currentFase.status === "completed"
                        ? "Selesai"
                        : currentFase.status === "active"
                          ? "Berjalan"
                          : "Belum Mulai"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {currentFase.nama_fase}
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {currentFase.tanggal} • Progress {currentFase.progress}%
                  </p>
                </div>
                <div className="w-32">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${currentFase.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* DETAIL TERMIN DARI KEGIATAN YANG DIPILIH */}
            {selectedKegiatanData ? (
              <div className="flex-1 bg-white border border-slate-100 rounded-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[8px] font-medium px-1.5 py-0.5 rounded ${
                            selectedKegiatanData.status === "completed"
                              ? "bg-emerald-50 text-emerald-600"
                              : selectedKegiatanData.status === "in-progress"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {selectedKegiatanData.status === "completed"
                            ? "Selesai"
                            : selectedKegiatanData.status === "in-progress"
                              ? "Berjalan"
                              : "Menunggu"}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          Target: {selectedKegiatanData.tanggal}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">
                        {selectedKegiatanData.nama_kegiatan}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        PIC: {selectedKegiatanData.pic}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Deskripsi */}
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-[11px] text-slate-600">
                      {selectedKegiatanData.deskripsi}
                    </p>
                  </div>

                  {/* DAFTAR TERMIN (Checkpoint) */}
                  <div>
                    <p className="text-[9px] font-medium text-slate-400 uppercase mb-2">
                      Termin & Checkpoint
                    </p>
                    <div className="space-y-2">
                      {selectedKegiatanData.termin.map((term, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2.5 rounded-lg border ${
                            term.status === "completed"
                              ? "border-emerald-100 bg-emerald-50/20"
                              : term.status === "in-progress"
                                ? "border-blue-100 bg-blue-50/20"
                                : "border-slate-100"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                term.jenis === "dokumentasi"
                                  ? "bg-blue-100"
                                  : "bg-amber-100"
                              }`}
                            >
                              {term.jenis === "dokumentasi" ? (
                                term.status === "completed" ? (
                                  <FileCheck
                                    size={12}
                                    className="text-blue-600"
                                  />
                                ) : (
                                  <FileText
                                    size={12}
                                    className="text-blue-400"
                                  />
                                )
                              ) : term.status === "completed" ? (
                                <CheckCircle2
                                  size={12}
                                  className="text-emerald-600"
                                />
                              ) : (
                                <CreditCard
                                  size={12}
                                  className="text-amber-500"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-[11px] font-medium text-slate-700">
                                {term.nama}
                              </p>
                              <p className="text-[8px] text-slate-400">
                                {term.tanggal}
                                {term.jumlah && ` • ${term.jumlah}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {term.status === "completed" && (
                              <span className="text-[7px] font-medium text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                                Selesai
                              </span>
                            )}
                            {term.status === "in-progress" && (
                              <span className="text-[7px] font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                Proses
                              </span>
                            )}
                            {term.status === "pending" && (
                              <span className="text-[7px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                Menunggu
                              </span>
                            )}
                            {term.file && (
                              <button className="p-1 text-slate-400 hover:text-slate-600">
                                <Download size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-lg text-center">
                      <p className="text-[8px] font-medium text-slate-400 uppercase">
                        Dokumen
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {getDokumentasiCompleted(selectedKegiatanData.termin)}/
                        {getDokumentasiCount(selectedKegiatanData.termin)}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg text-center">
                      <p className="text-[8px] font-medium text-slate-400 uppercase">
                        Pembayaran
                      </p>
                      <p
                        className={`text-sm font-bold ${getPaymentStatus(selectedKegiatanData.termin).color}`}
                      >
                        {getPaymentStatus(selectedKegiatanData.termin).text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-white border border-slate-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FolderOpen size={20} className="text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400">
                    Pilih kegiatan untuk melihat termin
                  </p>
                </div>
              </div>
            )}

            {/* ========== CHEVRON PROGRESS INDICATOR (6 STEP) ========== */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 overflow-x-auto">
              <div className="flex items-center justify-between min-w-[600px]">
                {data.fases.map((fase, index) => {
                  const isCompleted = fase.status === "completed";
                  const isActive = fase.status === "active";

                  return (
                    <div key={index} className="flex items-center">
                      {index !== 0 && (
                        <div
                          className="w-10 h-[2px] bg-slate-200 mr-[-6px] z-0"
                          style={{
                            clipPath:
                              "polygon(0% 0%, 92% 0%, 100% 50%, 92% 100%, 0% 100%)",
                          }}
                        ></div>
                      )}
                      <div
                        className={`relative flex flex-col items-center cursor-pointer transition-all duration-300 z-10 ${
                          selectedPhaseIndex === index ? "scale-110" : ""
                        }`}
                        onClick={() => {
                          setSelectedPhaseIndex(index);
                          setSelectedKegiatan(null);
                        }}
                      >
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            isCompleted
                              ? "bg-emerald-500 text-white shadow-md"
                              : isActive
                                ? "bg-blue-600 text-white shadow-md ring-4 ring-blue-100"
                                : "bg-white text-slate-400 border-2 border-slate-200"
                          }`}
                        >
                          {isCompleted ? (
                            <Check size={18} />
                          ) : isActive ? (
                            <Activity size={16} className="animate-pulse" />
                          ) : (
                            String(index + 1).padStart(2, "0")
                          )}
                        </div>
                        <p
                          className={`text-[9px] font-semibold mt-1.5 ${
                            selectedPhaseIndex === index
                              ? "text-blue-600"
                              : "text-slate-400"
                          }`}
                        >
                          {fase.nama_fase.substring(0, 5)}
                        </p>
                        <p className="text-[7px] text-slate-300">
                          {fase.progress}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}

export default DetailProgramAkademik;
