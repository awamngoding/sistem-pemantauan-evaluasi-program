/* eslint-disable no-undef */
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
  Edit,
  ToggleLeft,
  ToggleRight,
  School,
  ArrowLeft,
  Plus,
  LayoutGrid,
  UserCheck,
} from "lucide-react";
import { useState, useEffect } from "react";

function ListProgramAkademik() {
  const { id } = useParams(); // ID Sekolah
  const navigate = useNavigate();

  // --- 1. STATE MANAGEMENT ---
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [sekolahDetail, setSekolahDetail] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [masterUsers, setMasterUsers] = useState([]); // Master data HO
  const [loading, setLoading] = useState(true);

  const limit = 7; // MAKSIMAL 7 DATA PER HALAMAN

  const filterOptions = [
    { label: "Semua Status", value: "Semua" },
    { label: "Aktif", value: "Aktif" },
    { label: "Draft", value: "Draft" },
  ];

  // --- 2. FETCH DATA (PROGRAM, SEKOLAH, & MASTER USER HO) ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [resProgram, resSekolah, resUsers] = await Promise.all([
        fetch("http://localhost:3000/program?kategori=AKADEMIK", { headers }),
        fetch(`http://localhost:3000/sekolah/${id}`, { headers }),
        fetch("http://localhost:3000/users/ho", { headers }),
      ]);

      const dataProgram = await resProgram.json();
      const dataSekolah = await resSekolah.json();
      const dataUsers = await resUsers.json();

      setSekolahDetail(dataSekolah);

      // Pastikan masterUsers adalah ARRAY murni (Handle jika dibungkus properti 'data')
      const pureUserArray = Array.isArray(dataUsers)
        ? dataUsers
        : dataUsers.data || [];
      setMasterUsers(pureUserArray);

      // LOG UNTUK DEBUG (Cek di Console F12)
      console.log("Master Users Loaded:", pureUserArray);

      // Filter program spesifik sekolah ini
      const schoolPrograms = (
        Array.isArray(dataProgram) ? dataProgram : dataProgram.data || []
      ).filter((p) => {
        return String(p.id_sekolah) === String(id);
      });

      setPrograms(schoolPrograms);
    } catch (err) {
      console.error(err);
      toast.error("Gagal sinkronisasi data master.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // --- 3. LOGIKA SEARCH, FILTER, & PAGINATION ---
  const filteredPrograms = programs
    .filter((p) =>
      filterStatus === "Semua" ? true : p.status_program === filterStatus,
    )
    .filter((p) =>
      [p.nama_program, p.kode_program]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  // FIX NaN: Berikan fallback 0 dan 1
  const totalItems = filteredPrograms?.length || 0;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const start = (page - 1) * limit;
  const currentData = filteredPrograms.slice(start, start + limit);

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
      if (res.ok) {
        toast.success(`Status diperbarui ke ${newStatus}`);
        fetchData();
      }
    } catch (err) {
      toast.error("Gagal update status");
    }
  };

  // --- 4. DEFINISI KOLOM TABEL (RATA KIRI & HO MAPPING) ---
  const tableColumns = [
    {
      header: "NO",
      align: "text-center w-[60px]",
      render: (_, index) => (
        <span className="text-[10px] font-black text-gray-300">
          {String(start + index + 1).padStart(2, "0")}
        </span>
      ),
    },
    {
      header: "PROGRAM AKADEMIK",
      align: "text-left",
      render: (row) => (
        <div className="flex flex-col py-1">
          <span className="font-black text-[#1E5AA5] text-[11px] uppercase tracking-tight leading-tight">
            {row.nama_program || "-"}
          </span>
          <span className="text-[9px] text-gray-400 font-mono tracking-tighter">
            {row.kode_program || "PGR-NEW"}
          </span>
        </div>
      ),
    },
    {
      header: "HO",
      align: "text-left",
      render: (row) => {
        // 1. Kita cari ID-nya di field 'dibuat_oleh' sesuai data Network kamu
        const pic = masterUsers.find(
          (u) => String(u.id_user || u.id) === String(row.dibuat_oleh),
        );

        return (
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-50/50 rounded-lg text-[#1E5AA5] border border-blue-100/50">
              <UserCheck size={12} />
            </div>
            <span className="text-gray-700 text-[10px] font-black uppercase tracking-tight">
              {/* Prioritas: Master User > Fallback nama dari row */}
              {pic ? pic.nama : row.user?.nama || "TIDAK TERDETEKSI"}
            </span>
          </div>
        );
      },
    },
    {
      header: "TAHUN",
      align: "text-left",
      render: (row) => (
        <span className="font-mono text-[#1E5AA5] text-[10px] font-black bg-blue-50 px-3 py-1 rounded border border-blue-100 shadow-sm">
          {row.tahun || "-"}
        </span>
      ),
    },
    {
      header: "STATUS",
      align: "text-left",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.1em] border inline-block ${
            row.status_program === "Aktif"
              ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-100"
              : "bg-gray-50 text-gray-400 border-gray-100"
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
          <Button
            text=""
            icon={<Eye size={14} />}
            onClick={() =>
              navigate(`/ho/program/akademik/detail/${row.id_program}`)
            }
            className="!bg-white !text-[#1E5AA5] border border-gray-100 !rounded-xl !px-3 !py-2.5 transition-all shadow-sm active:scale-90"
          />
          <Button
            text=""
            icon={<Edit size={14} />}
            onClick={() =>
              navigate(`/ho/program/akademik/edit/${row.id_program}`)
            }
            className="!bg-white !text-blue-500 border border-gray-100 !rounded-xl !px-3 !py-2.5 transition-all shadow-sm active:scale-90"
          />
          <button
            onClick={() =>
              handleToggleStatus(row.id_program, row.status_program)
            }
            className={`p-2.5 rounded-xl border transition-all active:scale-90 ${
              row.status_program === "Aktif"
                ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white"
                : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-600 hover:text-white"
            }`}
          >
            {row.status_program === "Aktif" ? (
              <ToggleRight size={20} />
            ) : (
              <ToggleLeft size={20} />
            )}
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <PageWrapper className="h-screen bg-[#F8FAFC] flex items-center justify-center !p-0">
        <p className="text-sm font-black text-[#1E5AA5] uppercase tracking-widest animate-pulse">
          Syncing Master Data...
        </p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-t-[3rem] border-none shadow-2xl bg-white overflow-hidden relative">
          <div className="px-10 pt-8 pb-7 shrink-0 bg-white border-b border-gray-50 z-20">
            <header className="flex flex-row items-center justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-gradient-to-br from-[#1E5AA5] to-[#113a6e] rounded-2xl text-white shadow-2xl shadow-blue-900/10">
                  <School size={28} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col text-left">
                  <Label
                    text={`NPSN: ${sekolahDetail?.npsn || "00000000"}`}
                    className="!text-[9px] !text-[#1E5AA5] !font-black tracking-[0.4em] !mb-1.5 uppercase opacity-60"
                  />
                  <h1 className="text-2xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Daftar Program{" "}
                    <span className="text-[#1E5AA5]">Akademik</span>
                  </h1>
                  <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-widest">
                    {sekolahDetail?.nama_sekolah || "Pilih Sekolah"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  text="Kembali"
                  icon={<ArrowLeft size={16} />}
                  onClick={() => navigate("/ho/program/akademik")}
                  className="!bg-gray-50 !text-gray-500 hover:!bg-gray-100 !rounded-[1.2rem] !px-7 !py-3.5 !text-[11px] font-black border border-gray-100 transition-all shadow-inner"
                />
                <Button
                  text="Tambah Program"
                  icon={<Plus size={16} />}
                  onClick={() => navigate("/ho/program/akademik/create")}
                  className="!bg-[#1E5AA5] !text-white hover:!bg-[#154483] !rounded-[1.2rem] !px-7 !py-3.5 !text-[11px] font-black shadow-xl shadow-blue-200 transition-all active:scale-95"
                />
              </div>
            </header>

            <div className="flex flex-row items-center gap-4 bg-[#F8FAFC] p-3 rounded-[2.5rem] border border-gray-100 shadow-inner">
              <div className="flex items-center gap-3 px-6 py-3 bg-white text-[#1E5AA5] rounded-full border border-blue-100 font-black text-[10px] uppercase tracking-widest shadow-sm">
                <LayoutGrid size={15} /> {totalItems} Kontrak Terdata
              </div>

              <div className="flex-1 max-w-lg">
                <Search
                  placeholder="Cari Judul atau Kode Program..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="!pl-12 !pr-6 !py-3.5 !bg-white !border-gray-100 !rounded-full !text-[11px] !font-bold focus:!ring-4 focus:!ring-blue-50 shadow-sm"
                />
              </div>

              <div className="w-60">
                <Dropdown
                  items={filterOptions}
                  value={filterStatus}
                  onChange={(val) => {
                    setFilterStatus(val);
                    setPage(1);
                  }}
                  className="!bg-white !border-gray-100 !rounded-full !text-[10px] !font-black !uppercase tracking-[0.15em] shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col px-10 pt-8 pb-4 bg-[#F8FAFC]/50">
            <div className="flex-1 bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden flex flex-col shadow-inner">
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <Table
                  columns={tableColumns}
                  data={currentData}
                  className="min-w-full"
                />

                {totalItems === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center py-28 opacity-20">
                    <LayoutGrid size={40} className="text-gray-100" />
                    <p className="text-sm font-black uppercase tracking-[0.3em] mt-4">
                      Data Tidak Ditemukan
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-10 py-6 bg-white shrink-0 border-t border-gray-50 flex justify-center z-10 shadow-inner">
            <div className="w-full max-w-xs transform hover:scale-105 transition-all">
              <Pagination
                currentPage={page}
                totalPages={totalPages || 1}
                onPageChange={setPage}
                totalItems={totalItems} // FIX NaN in Record Tracking
                itemsPerPage={limit}
                className="!gap-2.5"
              />
            </div>
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
}

export default ListProgramAkademik;
