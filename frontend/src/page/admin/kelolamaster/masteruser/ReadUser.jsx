/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Edit,
  Trash2,
  Plus,
  Users,
  Shield,
  UserCheck,
  UserX,
  Database,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Komponen Custom
import Sidebar from "../../../../components/Sidebar";
import Card from "../../../../components/Card";
import Button from "../../../../components/Button";
import Search from "../../../../components/Search";
import Table from "../../../../components/Table";
import Dropdown from "../../../../components/Dropdown";
import PageWrapper from "../../../../components/PageWrapper";
import Label from "../../../../components/Label";
import Pagination from "../../../../components/Pagination";

const ReadUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Gagal ambil data user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus user ${name}?`)) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("User berhasil dihapus!");
        fetchUsers();
      } catch (error) {
        toast.error("Gagal menghapus user.");
      }
    }
  };

  const filteredData = users
    .filter((u) => {
      if (filterStatus === "aktif") return u.status;
      if (filterStatus === "nonaktif") return !u.status;
      return true;
    })
    .filter(
      (u) =>
        u.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const tableColumns = [
    {
      header: "NO",
      align: "text-center w-[60px]",
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
      header: "IDENTITAS PENGGUNA",
      align: "text-left w-[35%]",
      render: (row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#1E5AA5] font-black text-xs border border-blue-100 shadow-sm shrink-0 uppercase">
            {row.nama?.charAt(0)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-black text-gray-800 uppercase text-[11px] tracking-tight leading-none truncate">
              {row.nama}
            </span>
            <span className="text-[9px] text-gray-400 font-bold mt-1 truncate tracking-wider lowercase">
              {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "ROLE ACCESS",
      align: "text-center",
      render: (row) => (
        <div className="flex justify-center">
          <span className="px-3 py-1 bg-blue-50 text-[#1E5AA5] rounded-lg text-[8px] font-black uppercase border border-blue-100 tracking-widest shadow-sm">
            {row.role?.nama_role || "NO ROLE"}
          </span>
        </div>
      ),
    },
    {
      header: "STATUS",
      align: "text-center",
      render: (row) => (
        <div className="flex justify-center">
          <span
            className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider border ${
              row.status
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-red-50 text-red-600 border-red-100"
            }`}
          >
            {row.status ? "● ACTIVE" : "○ SUSPENDED"}
          </span>
        </div>
      ),
    },
    {
      header: "AKSI",
      align: "text-center w-[120px]",
      render: (row) => (
        <div className="flex justify-center gap-2">
          <Button
            text=""
            icon={<Edit size={12} />}
            onClick={() => navigate(`/admin/users/edit/${row.id_user}`)}
            className="!bg-blue-50 !text-[#1E5AA5] hover:!bg-[#1E5AA5] hover:!text-white !rounded-lg !px-3 !py-2 !w-auto !h-auto transition-all shadow-sm"
          />
          <Button
            text=""
            icon={<Trash2 size={12} />}
            onClick={() => handleDelete(row.id_user, row.nama)}
            className="!bg-red-50 !text-red-600 hover:!bg-red-600 hover:!text-white !rounded-lg !px-3 !py-2 !w-auto !h-auto transition-all shadow-sm"
          />
        </div>
      ),
    },
  ];

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-10 pt-20 md:pt-10 pb-6">
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden">
          <div className="px-10 pt-8 pb-6 shrink-0">
            <header className="flex flex-row items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition animate-pulse"></div>
                  <div className="relative p-3.5 bg-gradient-to-br from-[#2E5AA7] to-[#164a8a] rounded-2xl text-white shadow-xl">
                    <Users size={22} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex flex-col -space-y-1">
                  <Label
                    text="Otoritas Akses Personil Sistem YPA-MDR"
                    className="!text-[8px] !text-[#1E5AA5] !font-black tracking-[0.3em] !mb-1 uppercase"
                  />
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Manajemen <span className="text-[#2E5AA7]">Pengguna</span>
                  </h1>
                </div>
              </div>
              <Button
                text="TAMBAH USER"
                icon={<Plus size={14} />}
                onClick={() => navigate("/admin/users/create")}
                className="group !bg-[#2E5AA7] hover:!bg-[#1c5496] !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
              />
            </header>

            <div className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-[#1E5AA5] rounded-xl border border-blue-100 font-black text-[9px] uppercase tracking-[0.2em] shrink-0">
                <Database size={14} />
                Total: {filteredData.length} Users
              </div>
              <div className="w-72">
                <Search
                  placeholder="Cari nama atau email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="!pl-12 !pr-4 !py-2.5 !bg-gray-50/80 !border-gray-200/50 !rounded-xl !text-[11px] !font-bold outline-none focus:!bg-white focus:!ring-4 focus:!ring-blue-100/50 transition-all shadow-sm"
                />
              </div>
              <div className="w-48">
                <Dropdown
                  label="Status"
                  items={[
                    { label: "Semua", value: "semua" },
                    { label: "Aktif", value: "aktif" },
                    { label: "Nonaktif", value: "nonaktif" },
                  ]}
                  value={filterStatus}
                  onChange={(value) => {
                    setFilterStatus(value);
                    setCurrentPage(1);
                  }}
                  className="!bg-gray-50/80 !border-gray-200/50 !rounded-xl !text-[11px] !font-bold focus:!bg-white focus:!ring-4 focus:!ring-blue-100/50 transition-all shadow-sm"
                />
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
                {!loading && currentData.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full py-20 opacity-20 text-gray-900">
                    <Database size={40} className="mb-2" />
                    <p className="text-xs font-black uppercase tracking-widest">
                      Data Tidak Ditemukan
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
              totalItems={filteredData.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              loading={loading}
            />
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
};

export default ReadUser;
