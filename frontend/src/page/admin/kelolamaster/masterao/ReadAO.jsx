/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search as SearchIcon,
  Briefcase,
  MapPin,
  Database,
  RefreshCcw,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Komponen Custom
import Sidebar from "../../../../components/Sidebar";
import Card from "../../../../components/Card";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import Table from "../../../../components/Table";
import PageWrapper from "../../../../components/PageWrapper";
import Label from "../../../../components/Label";
import Pagination from "../../../../components/Pagination";
import Dropdown from "../../../../components/Dropdown";

// Import Action Buttons (Standard Modern)
import {
  EditButton,
  DeleteButton,
  DetailButton,
} from "../../../../components/ActionButtons";

const ReadAO = () => {
  const [aos, setAos] = useState([]);
  const [wilayahList, setWilayahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [sortOrder, setSortOrder] = useState("asc");
  const [filterWilayah, setFilterWilayah] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const resAO = await axios.get("http://localhost:3000/users/ao", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAos(resAO.data);

      const resWilayah = await axios.get("http://localhost:3000/wilayah", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWilayahList(resWilayah.data);
    } catch (error) {
      Swal.fire("Error", "Gagal sinkronisasi data sistem", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Hapus Area Officer?",
      text: `Akun ${name} akan dihapus secara permanen dari sistem.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Terhapus!", "Akun AO telah dihapus.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Gagal!", "Gagal menghapus data AO.", "error");
      }
    }
  };

  const filteredData = aos
    .filter((ao) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        ao.nama?.toLowerCase().includes(search) ||
        ao.email?.toLowerCase().includes(search) ||
        (Array.isArray(ao.wilayah) &&
          ao.wilayah.some((w) =>
            w.nama_wilayah?.toLowerCase().includes(search),
          ));

      const matchesWilayah =
        filterWilayah === "all"
          ? true
          : Array.isArray(ao.wilayah) &&
            ao.wilayah.some((w) => w.id_wilayah === Number(filterWilayah));

      return matchesSearch && matchesWilayah;
    })
    .sort((a, b) => {
      const nameA = a.nama?.toLowerCase() || "";
      const nameB = b.nama?.toLowerCase() || "";
      if (sortOrder === "asc") return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const tableColumns = [
    {
      header: "NO",
      align: "text-center w-[60px]",
      render: (_, index) => (
        <span className="text-[10px] font-mono font-bold text-gray-400">
          {String(indexOfFirstItem + index + 1).padStart(2, "0")}
        </span>
      ),
    },
    {
      header: "IDENTITAS AO",
      align: "text-left w-[25%]",
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
      header: "WILAYAH PENUGASAN",
      align: "text-left w-[40%]",
      render: (row) => {
        const listWilayah = Array.isArray(row.wilayah) ? row.wilayah : [];
        return (
          <div className="flex flex-wrap gap-1.5 py-1">
            {listWilayah.length > 0 ? (
              listWilayah.map((w, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50/50 rounded-lg border border-blue-100 shadow-sm hover:bg-blue-100 transition-colors"
                >
                  <MapPin size={8} className="text-[#1E5AA5]" />
                  <span className="text-[8px] font-black text-gray-600 uppercase tracking-tight">
                    {w.nama_wilayah?.split("/").pop() || "N/A"}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-[9px] text-gray-300 italic flex items-center gap-1 font-bold">
                <Database size={10} /> BELUM ADA WILAYAH
              </span>
            )}
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
            className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
              row.status !== false
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-red-50 text-red-600 border-red-100"
            }`}
          >
            {row.status !== false ? "● ACTIVE" : "○ INACTIVE"}
          </span>
        </div>
      ),
    },
    {
      header: "AKSI",
      align: "text-center w-[150px]",
      render: (row) => (
        <div className="flex justify-center gap-2 items-center">
          <DetailButton
            onClick={() => navigate(`/admin/ao/detail/${row.id_user}`)}
          />
          <EditButton
            onClick={() => navigate(`/admin/ao/edit/${row.id_user}`)}
          />
          <DeleteButton onClick={() => handleDelete(row.id_user, row.nama)} />
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
                    <Briefcase size={22} strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-col -space-y-1">
                  <Label
                    text="Sistem Monitoring dan Evaluasi Program"
                    className="!text-[8px] !text-[#1E5AA5] !font-black tracking-[0.3em] !mb-1 uppercase"
                  />
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Data <span className="text-[#2E5AA7]">Area Officer</span>
                  </h1>
                </div>
              </div>

              <Button
                text="REGISTRASI AO"
                icon={<Plus size={14} />}
                onClick={() => navigate("/admin/ao/create")}
                className="group !bg-[#2E5AA7] hover:!bg-[#1c5496] !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
              />
            </header>

            <div className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-[#1E5AA5] rounded-xl border border-blue-100 font-black text-[9px] uppercase tracking-[0.2em] shrink-0">
                <UserCheck
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />{" "}
                Total: {filteredData.length} Personnel
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
              <div className="w-48">
                <Dropdown
                  label="Wilayah Kerja"
                  value={filterWilayah}
                  onChange={(val) => {
                    setFilterWilayah(val);
                    setCurrentPage(1);
                  }}
                  items={[
                    { value: "all", label: "SEMUA WILAYAH" },
                    ...wilayahList.map((w) => ({
                      value: w.id_wilayah.toString(),
                      label: w.nama_wilayah.split("/").pop().toUpperCase(),
                    })),
                  ]}
                  className="h-[42px] !rounded-xl text-[10px]"
                />
              </div>
              <div className="relative flex-1">
                <Input
                  placeholder="Cari nama, email, atau wilayah..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full !pl-12 !pr-4 !py-2.5 !bg-gray-50/80 !border-gray-200/50 !rounded-xl !text-[11px] !font-bold outline-none focus:!bg-white focus:!ring-4 focus:!ring-blue-100/50 transition-all shadow-sm"
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
              onPageChange={(page) => setCurrentPage(page)}
              loading={loading}
            />
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
};

export default ReadAO;
