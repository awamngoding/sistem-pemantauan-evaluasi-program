/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search as SearchIcon,
  MapPin,
  Globe,
  Database,
} from "lucide-react";
import Swal from "sweetalert2";

// IMPORT KOMPONEN UI PREMIUM
import Sidebar from "../../../../components/Sidebar";
import Card from "../../../../components/Card";
import Button from "../../../../components/Button";
import PageWrapper from "../../../../components/PageWrapper";
import Table from "../../../../components/Table";
import Pagination from "../../../../components/Pagination";
import Dropdown from "../../../../components/Dropdown";
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
// Tambahkan DetailButton di import
import {
  EditButton,
  ToggleStatusButton,
  DetailButton,
} from "../../../../components/ActionButtons";

const ReadWilayah = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [wilayahList, setWilayahList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterKeterangan, setFilterKeterangan] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchWilayah = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/wilayah", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWilayahList(response.data);
    } catch (error) {
      Swal.fire("Error", "Gagal sinkronisasi data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWilayah();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/wilayah/${id}`,
        { status: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchWilayah();
    } catch (error) {
      Swal.fire("Gagal", "Gagal memperbarui status", "error");
    }
  };

  const filteredWilayah = wilayahList
    .filter((w) => {
      const matchesSearch = w.nama_wilayah
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "active"
            ? w.status === true
            : w.status === false;

      const matchesKeterangan =
        filterKeterangan === "all" ? true : w.keterangan === filterKeterangan;

      return matchesSearch && matchesStatus && matchesKeterangan;
    })
    .sort((a, b) => {
      const nameA = a.nama_wilayah.toLowerCase();
      const nameB = b.nama_wilayah.toLowerCase();
      if (sortOrder === "asc") return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });

  const currentItems = filteredWilayah.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredWilayah.length / itemsPerPage);

  const columns = [
    {
      header: "NO",
      align: "text-center w-[50px]",
      render: (_, idx) => (
        <span className="text-[10px] font-mono font-bold text-gray-400">
          {String((currentPage - 1) * itemsPerPage + idx + 1).padStart(2, "0")}
        </span>
      ),
    },
    {
      header: "WILAYAH BINAAN",
      align: "text-left w-[30%]",
      render: (row) => {
        const parts = row.nama_wilayah.split("/");
        const mainName = parts[parts.length - 1];
        const subLocation =
          parts.length > 1 ? parts.slice(1, 3).join(" • ") : row.deskripsi;

        return (
          <div className="flex items-center gap-3 py-1 group">
            <div
              className={`p-2 rounded-xl transition-all duration-300 ${row.status ? "bg-blue-50 text-[#2E5AA7]" : "bg-gray-100 text-gray-400"}`}
            >
              <MapPin size={14} />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className={`text-[11px] font-black uppercase truncate tracking-tight ${row.status ? "text-gray-800" : "text-gray-400 line-through"}`}
              >
                {mainName}
              </span>
              <span className="text-[8px] font-bold text-gray-400 truncate tracking-wide">
                {subLocation}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "STATUS",
      align: "text-center w-[12%]",
      render: (row) => (
        <div className="flex justify-center">
          <span
            className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${row.status ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}
          >
            {row.status ? "● ACTIVE" : "○ INACTIVE"}
          </span>
        </div>
      ),
    },
    {
      header: "KLASIFIKASI",
      align: "text-center w-[12%]",
      render: (row) => (
        <div className="flex justify-center">
          <span
            className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${row.keterangan === "Independent" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}
          >
            {row.keterangan ? row.keterangan.toUpperCase() : "ABSOLUTE"}
          </span>
        </div>
      ),
    },
    {
      header: "OPSI",
      align: "text-center w-[180px]", // Lebarkan kolom biar muat 3 icon
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          {/* ✅ TOMBOL DETAIL DITAMBAHKAN */}
          <DetailButton
            onClick={() => navigate(`/admin/wilayah/detail/${row.id_wilayah}`)}
          />
          <EditButton
            onClick={() => navigate(`/admin/wilayah/edit/${row.id_wilayah}`)}
          />
          <ToggleStatusButton
            isActive={row.status}
            onClick={() => handleToggleStatus(row.id_wilayah, row.status)}
          />
        </div>
      ),
    },
  ];

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-t-[2.5rem] rounded-b-none border-none shadow-2xl bg-white overflow-hidden relative">
          <div className="px-10 pt-8 pb-6 shrink-0">
            <header className="flex flex-row items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition animate-pulse"></div>
                  <div className="relative p-3.5 bg-gradient-to-br from-[#2E5AA7] to-[#164a8a] rounded-2xl text-white shadow-xl">
                    <Globe size={22} strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-col -space-y-1">
                  <Label
                    text="Spatial & Regional Database Center"
                    className="!text-[8px] !text-[#1E5AA5] !font-black tracking-[0.3em] !mb-1 uppercase"
                  />
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Data <span className="text-[#2E5AA7]">Wilayah Binaan</span>
                  </h1>
                </div>
              </div>

              <Button
                text="SET AREA BARU"
                icon={<Plus size={14} />}
                onClick={() => navigate("/admin/wilayah/create")}
                className="group !bg-[#2E5AA7] hover:!bg-[#1c5496] !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
              />
            </header>

            <div className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-[#1E5AA5] rounded-xl border border-blue-100 font-black text-[9px] uppercase tracking-[0.2em] shrink-0">
                <Database size={14} className={loading ? "animate-spin" : ""} />{" "}
                {filteredWilayah.length} Geo-Locations
              </div>

              <div className="w-40">
                <Dropdown
                  label="Urutan"
                  value={sortOrder}
                  onChange={(val) => setSortOrder(val)}
                  items={[
                    { value: "asc", label: "A - Z (ASC)" },
                    { value: "desc", label: "Z - A (DESC)" },
                  ]}
                  className="h-[42px] !rounded-xl text-[10px]"
                />
              </div>

              <div className="w-44">
                <Dropdown
                  label="Status Filter"
                  value={filterStatus}
                  onChange={(val) => {
                    setFilterStatus(val);
                    setCurrentPage(1);
                  }}
                  items={[
                    { value: "all", label: "SEMUA STATUS" },
                    { value: "active", label: "WILAYAH AKTIF" },
                    { value: "inactive", label: "NON-AKTIF" },
                  ]}
                  className="h-[42px] !rounded-xl text-[10px]"
                />
              </div>

              <div className="w-44">
                <Dropdown
                  label="Klasifikasi"
                  value={filterKeterangan}
                  onChange={(val) => {
                    setFilterKeterangan(val);
                    setCurrentPage(1);
                  }}
                  items={[
                    { value: "all", label: "SEMUA TIPE" },
                    { value: "Independent", label: "INDEPENDENT" },
                    { value: "Absolute", label: "ABSOLUTE" },
                  ]}
                  className="h-[42px] !rounded-xl text-[10px]"
                />
              </div>

              <div className="relative flex-1">
                <Input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari koordinat atau nama wilayah..."
                  className="w-full !pl-12 !pr-4 !py-2.5 !bg-gray-50/80 !border-gray-200/50 !rounded-xl !text-[11px] !font-bold outline-none focus:!bg-white transition-all shadow-sm"
                />
                <SearchIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                  size={16}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col px-10 pb-4">
            <div className="flex-1 bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col shadow-sm">
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <Table
                  columns={columns}
                  data={currentItems}
                  className="min-w-full"
                />
                {!loading && currentItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-gray-900">
                    <Database size={40} className="mb-2" />
                    <p className="text-xs font-black uppercase tracking-widest">
                      No Spatial Data Found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-10 py-5 bg-gray-50/50 shrink-0 border-t border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredWilayah.length}
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

export default ReadWilayah;
