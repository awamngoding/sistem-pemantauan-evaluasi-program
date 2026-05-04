import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Banknote, Plus, Search, Edit, Trash2, Landmark } from "lucide-react";
import Swal from "sweetalert2";

// Komponen Atomik
import Sidebar from "../../../../components/Sidebar";
import Table from "../../../../components/Table";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";

const ReadFinance = () => {
  const [finance, setFinance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchFinance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/finance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFinance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Akun Finance?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/finance/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Terhapus!", "Akun telah dihapus.", "success");
        fetchFinance();
      } catch (err) {
        Swal.fire("Gagal!", "Gagal menghapus data akun.", "error");
      }
    }
  };

  const columns = [
    {
      header: "No",
      render: (_, idx) => (
        <span className="text-gray-400 text-xs font-mono">{idx + 1}</span>
      ),
    },
    {
      header: "Nama Akun / Sumber Dana",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-black text-gray-800 uppercase text-sm tracking-tight">
            {row.nama_akun}
          </span>
          <span className="text-[10px] text-gray-400 font-bold italic uppercase">
            {row.keterangan || "Internal YPA-MDR"}
          </span>
        </div>
      ),
    },
    {
      header: "Bank",
      render: (row) => (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#1E5AA5] rounded-lg text-[10px] font-black uppercase">
          <Landmark size={12} /> {row.bank}
        </div>
      ),
    },
    {
      header: "No. Rekening",
      accessor: "nomor_rekening",
      align: "text-center",
      render: (row) => (
        <span className="font-mono text-xs text-gray-600">
          {row.nomor_rekening}
        </span>
      ),
    },
    {
      header: "Aksi",
      align: "text-center",
      render: (row) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => navigate(`/admin/finance/edit/${row.id_finance}`)}
            className="p-2.5 bg-blue-50 text-[#1E5AA5] rounded-xl hover:bg-[#1E5AA5] hover:text-white transition-all shadow-sm"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id_finance)}
            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-[#F4F7FE] overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col p-4 lg:p-8 overflow-hidden bg-[#F4F7FE]">
        <header className="flex-none flex items-center justify-between bg-white p-5 rounded-3xl shadow-sm mb-6 border border-gray-50 text-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1E5AA5] rounded-2xl text-white shadow-lg shadow-blue-200">
              <Banknote size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tight">
                Master <span className="text-[#1E5AA5]">Finance</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Manajemen Alokasi Dana Project
              </p>
            </div>
          </div>
          <Button
            text="Tambah Akun"
            icon={<Plus size={18} />}
            onClick={() => navigate("/admin/finance/create")}
            className="!bg-[#1E5AA5] !py-3 !px-6 !rounded-2xl shadow-xl shadow-blue-100 font-black uppercase text-xs transition-transform hover:scale-105"
          />
        </header>

        <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden border border-gray-50">
          <div className="p-6 border-b border-gray-50">
            <div className="relative max-w-md w-full">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Cari akun anggaran..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!pl-12 !bg-gray-50/50 !border-none !rounded-2xl"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Table
              columns={columns}
              data={finance.filter((f) =>
                f.nama_akun.toLowerCase().includes(searchTerm.toLowerCase()),
              )}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReadFinance;
