import Sidebar from "../../../components/Sidebar";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Search from "../../../components/Search";
import Dropdown from "../../../components/Dropdown";
import PageWrapper from "../../../components/PageWrapper";
import Label from "../../../components/Label";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import { toast } from "react-toastify";

import { useNavigate, useParams } from "react-router-dom";
import {
  Eye,
  FileText,
  Edit,
  ToggleLeft,
  ToggleRight,
  School,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";

function ListProgramnonAkademik() {
  const { id } = useParams(); // ID Sekolah
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("Semua");

  const [sekolahDetail, setSekolahDetail] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const limit = 10;
  const start = (page - 1) * limit;
  const end = start + limit;

  const handleToggleStatus = async (programId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "Aktif" ? "Draft" : "Aktif";

      const res = await fetch(
        `http://localhost:3000/program/${programId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status_program: newStatus }),
        },
      );

      if (!res.ok) throw new Error("Gagal mengubah status");

      toast.success(`Status program berhasil diubah menjadi ${newStatus}`);
      fetchData(); // Refresh data program
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengubah status program");
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [resProgram, resSekolah] = await Promise.all([
        fetch("http://localhost:3000/program?kategori=NON_AKADEMIK", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:3000/sekolah/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!resProgram.ok || !resSekolah.ok)
        throw new Error("Gagal mengambil data");

      const dataProgram = await resProgram.json();
      const dataSekolah = await resSekolah.json();

      setSekolahDetail(dataSekolah);

      // Filter program yang HANYA milik sekolah ini
      const schoolPrograms = (
        Array.isArray(dataProgram) ? dataProgram : []
      ).filter((p) => {
        if (p.id_sekolah && dataSekolah.id_sekolah) {
          return String(p.id_sekolah) === String(dataSekolah.id_sekolah);
        }
        return (
          p.sekolah?.trim().toLowerCase() ===
          dataSekolah.nama_sekolah?.trim().toLowerCase()
        );
      });

      setPrograms(schoolPrograms);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data program.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Filter Data untuk Tabel
  const filteredPrograms = programs
    .filter((p) => {
      if (filterStatus === "Semua") return true;
      return p.status_program === filterStatus;
    })
    .filter((p) =>
      [p.nama_program, p.kode_program]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  const currentData = filteredPrograms.slice(start, end);
  const totalPages = Math.ceil(filteredPrograms.length / limit) || 1;

  const filterOptions = [
    { label: "Semua Status", value: "Semua" },
    { label: "Aktif", value: "Aktif" },
    { label: "Draft", value: "Draft" },
  ];

  const tableColumns = [
    {
      header: "NO",
      align: "text-center w-[50px]",
      render: (_, index) => (
        <span className="text-[10px] font-mono font-bold text-gray-400">
          {String(start + index + 1).padStart(2, "0")}
        </span>
      ),
    },
    {
      header: "NAMA PROGRAM",
      align: "text-left",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-black text-[#2E5AA7] text-[11px] uppercase leading-tight">
            {row.nama_program || "-"}
          </span>
          <span className="text-[9px] text-gray-400 font-mono mt-0.5">
            {row.kode_program || "NO-CODE"}
          </span>
        </div>
      ),
    },
    {
      header: "NAMA HO (PIC)",
      align: "text-center",
      render: (row) => (
        <span className="text-gray-600 text-[10px] font-bold uppercase tracking-wider">
          {/* Pastikan backend mereturn field nama_ho atau creator */}
          {row.user?.nama || row.nama_ho || "PIC HO"}
        </span>
      ),
    },
    {
      header: "TAHUN",
      align: "text-center",
      render: (row) => (
        <span className="font-mono text-gray-600 text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded">
          {row.tahun || "-"}
        </span>
      ),
    },
    {
      header: "STATUS",
      align: "text-center",
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider border ${
            row.status_program === "Aktif"
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-amber-50 text-amber-600 border-amber-100"
          }`}
        >
          {row.status_program || "Draft"}
        </span>
      ),
    },
    {
      header: "AKSI",
      align: "text-center w-[140px]",
      render: (row) => (
        <div className="flex justify-center gap-2">
          {/* Detail */}
          <Button
            text=""
            icon={<Eye size={12} />}
            onClick={() =>
              navigate(`/ho/program/non-akademik/detail/${row.id_program}`)
            }
            className="!bg-amber-50 !text-amber-600 hover:!bg-amber-600 hover:!text-white !rounded-lg !px-3 !py-2 !w-auto !h-auto transition-all shadow-sm"
          />
          {/* Edit */}
          <Button
            text=""
            icon={<Edit size={12} />}
            onClick={() =>
              navigate(`/ho/program/non-akademik/edit/${row.id_program}`)
            }
            className="!bg-blue-50 !text-blue-600 hover:!bg-blue-600 hover:!text-white !rounded-lg !px-3 !py-2 !w-auto !h-auto transition-all shadow-sm"
          />
          {/* Toggle Status */}
          <Button
            text=""
            icon={
              row.status_program === "Aktif" ? (
                <ToggleRight size={12} />
              ) : (
                <ToggleLeft size={12} />
              )
            }
            onClick={() =>
              handleToggleStatus(row.id_program, row.status_program)
            }
            className={`!rounded-lg !px-3 !py-2 !w-auto !h-auto transition-all shadow-sm ${
              row.status_program === "Aktif"
                ? "!bg-emerald-50 !text-emerald-600 hover:!bg-emerald-600 hover:!text-white"
                : "!bg-gray-50 !text-gray-600 hover:!bg-gray-600 hover:!text-white"
            }`}
          />
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#EEF5FF]">
        <p className="text-xl font-bold text-[#2E5AA7] animate-pulse">
          Memuat Data Program...
        </p>
      </div>
    );
  }

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-t-[2.5rem] rounded-b-[2.5rem] border-none shadow-2xl bg-white overflow-hidden relative">
          <div className="px-8 pt-6 pb-6 shrink-0 border-b border-gray-100 bg-white z-10">
            <header className="flex flex-row items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-[#2E5AA7]/40 rounded-2xl blur opacity-20 group-hover:opacity-40 transition animate-pulse"></div>
                  <div className="relative p-3.5 bg-gradient-to-br from-[#2E5AA7] to-[#164a8a] rounded-2xl text-white shadow-xl">
                    <School size={22} strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-col -space-y-1">
                  <Label
                    text={`NPSN: ${sekolahDetail?.npsn || "-"}`}
                    className="!text-[8px] !text-gray-400 !font-black tracking-[0.3em] !mb-1 uppercase"
                  />
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Daftar Program{" "}
                    <span className="text-[#2E5AA7]">
                      {sekolahDetail?.nama_sekolah || "Sekolah"}
                    </span>
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  text="← Kembali ke Master Data"
                  icon={<ArrowLeft size={14} />}
                  onClick={() => navigate("/ho/program/non-akademik")}
                  className="group !bg-gray-100 hover:!bg-gray-200 !text-gray-600 !rounded-xl !px-5 !py-2.5 !text-[10px] font-black transition-all flex items-center gap-2"
                />
                <Button
                  text="+ Tambah Program"
                  icon={<Plus size={14} />}
                  onClick={() => navigate("/ho/program/non-akademik/create")}
                  className="group !bg-[#2E5AA7] hover:!bg-[#164a8a] !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
                />
              </div>
            </header>

            <div className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-[#2E5AA7] rounded-xl border border-blue-100 font-black text-[9px] uppercase tracking-[0.2em] shrink-0">
                <FileText size={14} /> Total: {filteredPrograms.length} Program
              </div>
              <div className="w-72">
                <Search
                  placeholder="Cari program..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="!pl-12 !pr-4 !py-2.5 !bg-gray-50/80 !border-gray-200/50 !rounded-xl !text-[11px] !font-bold outline-none focus:!bg-white focus:!ring-4 focus:!ring-[#2E5AA7]/30 transition-all shadow-sm"
                />
              </div>
              <div className="w-48">
                <Dropdown
                  label="Status"
                  items={filterOptions}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  className="!bg-gray-50/80 !border-gray-200/50 !rounded-xl !text-[11px] !font-bold focus:!bg-white focus:!ring-4 focus:!ring-[#2E5AA7]/30 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col px-10 pb-4 pt-6 bg-slate-50/50">
            <div className="flex-1 bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col shadow-sm">
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <Table
                  columns={tableColumns}
                  data={currentData}
                  className="min-w-full"
                />
                {currentData.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-20 opacity-30 text-gray-900">
                    <FileText size={40} className="mb-3 text-[#2E5AA7]" />
                    <p className="text-sm font-black uppercase tracking-widest">
                      Tidak Ada Program Ditemukan
                    </p>
                    <p className="text-[10px] font-bold text-gray-500 mt-2">
                      Sekolah ini belum memiliki program non-akademik.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-10 py-5 bg-white shrink-0 border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-10">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="!justify-center"
            />
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
}

export default ListProgramnonAkademik;
