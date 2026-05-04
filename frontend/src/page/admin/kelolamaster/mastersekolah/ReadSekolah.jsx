/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search as SearchIcon,
  School,
  MapPin,
  Database,
  Filter,
} from "lucide-react";
import Swal from "sweetalert2";

// Komponen Atomik Premium
import Sidebar from "../../../../components/Sidebar";
import Card from "../../../../components/Card";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import Table from "../../../../components/Table";
import PageWrapper from "../../../../components/PageWrapper";
import Pagination from "../../../../components/Pagination";
import Dropdown from "../../../../components/Dropdown";

// Action Buttons
import {
  EditButton,
  DetailButton,
  DeleteButton,
} from "../../../../components/ActionButtons";

const ReadSekolah = () => {
  const [sekolah, setSekolah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWilayah, setFilterWilayah] = useState("Semua");
  const [filterAkreditasi, setFilterAkreditasi] = useState("Semua");
  const [listWilayah, setListWilayah] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const [resSekolah, resWilayah] = await Promise.all([
        axios.get("http://localhost:3000/sekolah", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/wilayah", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setSekolah(resSekolah.data);
      setListWilayah(resWilayah.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal mengambil data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Hapus Sekolah?",
      text: `Unit ${name} akan dihapus secara permanen.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Ya, Hapus!",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/sekolah/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Berhasil", "Data sekolah telah dihapus.", "success");
        fetchData();
      } catch (err) {
        Swal.fire("Gagal", "Tidak dapat menghapus data", "error");
      }
    }
  };

  const filteredData = sekolah.filter((s) => {
    const matchSearch =
      s.nama_sekolah?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.npsn?.includes(searchTerm);
    const matchWilayah =
      filterWilayah === "Semua" || s.wilayah?.nama_wilayah === filterWilayah;
    const matchAkreditasi =
      filterAkreditasi === "Semua" || s.akreditasi === filterAkreditasi;
    return matchSearch && matchWilayah && matchAkreditasi;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // --- MAPPING DATA OPTIONS ---
  const wilayahOptions = [
    { value: "Semua", label: "SEMUA WILAYAH" },
    ...listWilayah.map((w) => ({
      value: w.nama_wilayah,
      label: w.nama_wilayah.split("/").pop().toUpperCase(),
    })),
  ];

  const akreditasiOptions = [
    { value: "Semua", label: "SEMUA AKREDITASI" },
    { value: "A", label: "GRADE A" },
    { value: "B", label: "GRADE B" },
    { value: "C", label: "GRADE C" },
  ];

  const tableColumns = [
    {
      header: "NPSN",
      align: "text-center w-[120px]",
      render: (row) => (
        <span className="text-[10px] font-mono font-black text-[#1E5AA5] bg-blue-50 px-2 py-1 rounded-md border border-blue-100 shadow-sm">
          {row.npsn || "PENDING"}
        </span>
      ),
    },
    {
      header: "UNIT PEMBINAAN",
      align: "text-left w-[30%]",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-[10px] uppercase shadow-sm shrink-0">
            {row.jenjang?.substring(0, 3)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black text-gray-800 uppercase text-[11px] truncate leading-none">
              {row.nama_sekolah}
            </span>
            <span className="text-[8px] text-gray-400 font-bold mt-1 uppercase tracking-widest">
              {row.jenjang} Education
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "WILAYAH",
      align: "text-center w-[20%]",
      render: (row) => (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-black text-gray-600 uppercase border border-gray-100">
            <MapPin size={10} className="text-[#1E5AA5]" />
            {row.wilayah?.nama_wilayah?.split("/").pop() || "NON-REGIONAL"}
          </div>
        </div>
      ),
    },
    {
      header: "AKREDITASI",
      align: "text-center w-[15%]",
      render: (row) => (
        <div className="flex justify-center">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black border border-emerald-100 shadow-sm">
            Grade {row.akreditasi || "-"}
          </span>
        </div>
      ),
    },
    {
      header: "AKSI",
      align: "text-center w-[160px]",
      render: (row) => (
        <div className="flex justify-center gap-2 scale-90">
          <DetailButton
            onClick={() => navigate(`/admin/sekolah/detail/${row.id_sekolah}`)}
          />
          <EditButton
            onClick={() => navigate(`/admin/sekolah/edit/${row.id_sekolah}`)}
          />
          <DeleteButton
            onClick={() => handleDelete(row.id_sekolah, row.nama_sekolah)}
          />
        </div>
      ),
    },
  ];

  return (
    <PageWrapper
      className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-12 pt-10">
        <Card className="flex-1 rounded-t-[2.5rem] bg-white flex flex-col overflow-hidden relative shadow-2xl">
          <div className="px-10 pt-8 pb-6 bg-white shrink-0">
            <header className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-[#2E5AA7] rounded-2xl text-white shadow-xl">
                  <School size={22} />
                </div>
                <div>
                  <h1 className="text-xl font-black text-gray-800 uppercase leading-none">
                    Master <span className="text-[#2E5AA7]">Sekolah</span>
                  </h1>
                </div>
              </div>
              <Button
                text="REGISTRASI UNIT"
                icon={<Plus size={14} />}
                onClick={() => navigate("/admin/sekolah/create")}
                className="!bg-[#2E5AA7] !rounded-xl !text-[10px] font-black text-white shadow-lg active:scale-95 transition-all"
              />
            </header>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-[#1E5AA5] rounded-xl font-black text-[9px] uppercase tracking-widest border border-blue-100">
                  <Database size={14} /> Total: {filteredData.length} Unit
                </div>
                <div className="relative flex-1">
                  <Input
                    placeholder="Cari nama sekolah atau NPSN..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full !pl-12 !py-2.5 !bg-gray-50 !rounded-xl !text-[11px] font-bold"
                  />
                  <SearchIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={16}
                  />
                </div>
              </div>

              {/* --- FILTER SECTION --- */}
              <div className="flex flex-row items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Filter size={12} strokeWidth={3} />
                  <span className="text-[9px] font-black uppercase tracking-tighter">
                    Filter:
                  </span>
                </div>

                <div className="w-[220px]">
                  {listWilayah.length > 0 ? (
                    <Dropdown
                      items={wilayahOptions}
                      value={filterWilayah}
                      onChange={(val) => {
                        setFilterWilayah(val);
                        setCurrentPage(1);
                      }}
                      className="!py-3 !rounded-xl text-[10px] font-black"
                    />
                  ) : (
                    <div className="h-10 w-full bg-gray-50 animate-pulse rounded-xl" />
                  )}
                </div>

                <div className="w-[220px]">
                  <Dropdown
                    items={akreditasiOptions}
                    value={filterAkreditasi}
                    onChange={(val) => {
                      setFilterAkreditasi(val);
                      setCurrentPage(1);
                    }}
                    className="!py-3 !rounded-xl text-[10px] font-black"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col px-10 pb-4">
            <div className="flex-1 bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col shadow-sm">
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <Table
                  columns={tableColumns}
                  data={currentData}
                  className="min-w-full"
                />
                {!loading && filteredData.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-20 opacity-30">
                    <School size={48} className="text-gray-400 mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Data Tidak Ditemukan
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PAGINATION PANEL */}
          <div className="px-10 py-5 bg-gray-50/50 shrink-0 border-t border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              loading={loading}
            />
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
};

export default ReadSekolah;
