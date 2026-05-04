/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search as SearchIcon,
  Database,
  Phone,
  Mail,
  ShieldCheck,
  Handshake,
  Filter,
  User,
  Tags,
  FileCheck,
  Eye,
} from "lucide-react";
import Swal from "sweetalert2";

// Komponen Atomik
import Sidebar from "../../../../components/Sidebar";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import Table from "../../../../components/Table";
import PageWrapper from "../../../../components/PageWrapper";
import Pagination from "../../../../components/Pagination";
import Label from "../../../../components/Label";
import Dropdown from "../../../../components/Dropdown";

// Action Buttons
import {
  EditButton,
  ToggleStatusButton,
} from "../../../../components/ActionButtons";

const ReadVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/vendor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal memuat data rekanan vendor", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleToggleStatus = async (id, name, currentStatus) => {
    const isActivating = currentStatus === "Tidak Bermitra";
    const result = await Swal.fire({
      title: isActivating ? "Aktifkan Kemitraan?" : "Non-Aktifkan Kemitraan?",
      text: `Status ${name} akan diubah menjadi ${isActivating ? '"Bermitra"' : '"Tidak Bermitra"'}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isActivating ? "#10B981" : "#EF4444",
      confirmButtonText: "Ya, Update!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.patch(
          `http://localhost:3000/vendor/${id}`,
          { status: isActivating ? "Bermitra" : "Tidak Bermitra" },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        Swal.fire("Berhasil", "Status telah diperbarui.", "success");
        fetchVendors();
      } catch (err) {
        Swal.fire("Gagal", "Sistem gagal memperbarui status", "error");
      }
    }
  };

  const filteredData = vendors.filter((v) => {
    const search = searchTerm.toLowerCase();
    const matchSearch =
      v.nama_vendor?.toLowerCase().includes(search) ||
      v.pj_1?.toLowerCase().includes(search) ||
      v.pilar?.toLowerCase().includes(search);
    const matchStatus = statusFilter === "Semua" || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const tableColumns = [
    {
      header: "NO",
      align: "text-center w-[50px]",
      render: (_, index) => (
        <span className="text-[10px] font-mono font-bold text-gray-400">
          {String((currentPage - 1) * itemsPerPage + index + 1).padStart(
            2,
            "0",
          )}
        </span>
      ),
    },
    {
      header: "LEMBAGA VENDOR",
      align: "text-left w-[28%]",
      render: (row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#1E5AA5] font-black text-[10px] border border-blue-100 shadow-sm shrink-0 uppercase">
            {row.nama_vendor?.charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black text-gray-800 uppercase text-[11px] truncate leading-none">
              {row.nama_vendor}
            </span>
            <div className="flex items-center gap-1.5 mt-1.5 text-gray-400">
              <FileCheck size={10} className="text-[#1E5AA5]" />
              <span className="text-[8px] font-bold uppercase tracking-widest">
                Reg: {row.no_register || "-"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "BIDANG / PILAR",
      align: "text-left w-[18%]",
      render: (row) => (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
          <Tags size={10} className="text-[#1E5AA5]" />
          <span className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">
            {row.pilar}
          </span>
        </div>
      ),
    },
    {
      header: "PENANGGUNG JAWAB (PJ 1)",
      align: "text-left w-[24%]",
      render: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-800">
            <User size={11} className="text-[#1E5AA5]" />
            <span className="text-[10px] font-black uppercase tracking-tight">
              {row.pj_1 || "N/A"}
            </span>
          </div>

          {/* UPDATE DISINI: Row.user.email */}
          <div className="flex items-center gap-2 text-gray-500">
            <Mail size={10} className="text-blue-400" />
            <span className="text-[9px] font-bold lowercase italic">
              {/* Kita cek di user dulu, kalau gak ada baru cek field telp_pj_1 */}
              {row.user?.email || row.telp_pj_1 || "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "STATUS",
      align: "text-center w-[15%]",
      render: (row) => {
        const isBermitra = row.status === "Bermitra";
        return (
          <div className="flex justify-center">
            <span
              className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] border ${
                isBermitra
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-red-50 text-red-600 border-red-100"
              }`}
            >
              ● {row.status}
            </span>
          </div>
        );
      },
    },
    {
      header: "AKSI",
      align: "text-center w-[150px]",
      render: (row) => (
        <div className="flex justify-center gap-2 items-center">
          {/* TOMBOL DETAIL (MATA) */}
          <button
            onClick={() => navigate(`/admin/vendor/detail/${row.id_vendor}`)}
            className="p-2 rounded-lg bg-blue-50 text-[#1E5AA5] hover:bg-[#1E5AA5] hover:text-white transition-all shadow-sm"
            title="Lihat Detail"
          >
            <Eye size={14} strokeWidth={3} />
          </button>

          <EditButton
            onClick={() => navigate(`/admin/vendor/edit/${row.id_vendor}`)}
          />

          <ToggleStatusButton
            isActive={row.status === "Bermitra"}
            onClick={() =>
              handleToggleStatus(row.id_vendor, row.nama_vendor, row.status)
            }
          />
        </div>
      ),
    },
  ];

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10">
        <div className="flex-1 rounded-t-[2.5rem] shadow-2xl bg-white flex flex-col overflow-hidden relative">
          <div className="px-10 pt-8 pb-6 bg-white shrink-0 border-b border-gray-50">
            <header className="flex flex-row items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-gradient-to-br from-[#1E5AA5] to-[#164a8a] rounded-2xl text-white shadow-xl">
                  <Handshake size={22} />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase">
                    Manajemen <span className="text-[#1E5AA5]">Vendor</span>
                  </h1>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                    Educational Partner Registry
                  </p>
                </div>
              </div>
              <Button
                text="REGISTRASI VENDOR"
                icon={<Plus size={14} />}
                onClick={() => navigate("/admin/vendor/create")}
                className="!bg-[#1E5AA5] !rounded-xl !px-6 !py-3 !text-[10px] font-black text-white shadow-lg uppercase"
              />
            </header>

            <div className="flex flex-row items-center gap-4">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-[#1E5AA5] rounded-xl border border-blue-100 font-black text-[9px] uppercase tracking-widest shrink-0">
                <Database size={14} className={loading ? "animate-spin" : ""} />
                Total: {filteredData.length} Entities
              </div>
              <div className="relative flex-1">
                <Input
                  placeholder="Cari Vendor, PJ, atau Pilar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full !pl-12 !py-2.5 !bg-gray-50 !rounded-xl !text-[11px] !font-bold"
                />
                <SearchIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                  size={16}
                />
              </div>
              <div className="w-[220px]">
                <Dropdown
                  items={[
                    { value: "Semua", label: "SEMUA STATUS" },
                    { value: "Bermitra", label: "BERMITRA" },
                    { value: "Tidak Bermitra", label: "TIDAK BERMITRA" },
                  ]}
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val)}
                  className="!rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col px-10 py-6">
            <div className="flex-1 bg-white border border-gray-100 rounded-[2rem] overflow-hidden flex flex-col shadow-sm">
              <Table columns={tableColumns} data={currentData} />
            </div>
          </div>

          <div className="px-10 py-6 bg-gray-50/50 shrink-0 border-t border-gray-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.length}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default ReadVendor;
