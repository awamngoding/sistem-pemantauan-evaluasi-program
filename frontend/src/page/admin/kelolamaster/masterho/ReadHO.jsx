/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search as SearchIcon,
  Building2,
  Database,
  Phone,
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

// Import Action Buttons ( DNA Visual Modern )
import {
  EditButton,
  DeleteButton,
  DetailButton,
} from "../../../../components/ActionButtons";

const ReadHO = () => {
  const [hos, setHos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterDept, setFilterDept] = useState("all");
  const [filterTingkat, setFilterTingkat] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  const fetchHO = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/users/ho", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHos(response.data);
    } catch (error) {
      console.error("Gagal ambil data HO:", error);
      Swal.fire("Error", "Gagal memuat data Head Office", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHO();
  }, []);

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Hapus Personil HO?",
      text: `Akun ${name} akan kehilangan akses ke sistem monitoring pusat.`,
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
        Swal.fire("Terhapus!", "Data HO telah dihapus.", "success");
        fetchHO();
      } catch (error) {
        Swal.fire("Gagal!", "Gagal menghapus data.", "error");
      }
    }
  };

  const filteredData = hos.filter((ho) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      ho.nama?.toLowerCase().includes(search) ||
      ho.email?.toLowerCase().includes(search) ||
      ho.no_telp?.includes(searchTerm);

    const matchesDept = filterDept === "all" ? true : ho.jenis === filterDept;
    const matchesTingkat =
      filterTingkat === "all" ? true : ho.sub_jenis === filterTingkat;

    return matchesSearch && matchesDept && matchesTingkat;
  });

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
      header: "PERSONNEL HO",
      align: "text-left w-[30%]",
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
      header: "DEPARTMENT",
      align: "text-center w-[15%]",
      render: (row) => (
        <div className="flex justify-center">
          <span
            className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-sm ${
              row.jenis === "akademik"
                ? "bg-blue-50 text-[#2E5AA7] border-blue-100"
                : "bg-emerald-50 text-emerald-600 border-emerald-100"
            }`}
          >
            {row.jenis || "UMUM"}
          </span>
        </div>
      ),
    },
    {
      header: "FOKUS BIDANG",
      align: "text-center w-[15%]",
      render: (row) => (
        <div className="flex justify-center">
          <span
            className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-sm ${
              row.sub_jenis
                ? "bg-orange-50 text-orange-600 border-orange-100"
                : "bg-gray-50 text-gray-400 border-gray-100 italic"
            }`}
          >
            {row.sub_jenis || "—"}
          </span>
        </div>
      ),
    },
    // {
    //   header: "KONTAK",
    //   align: "text-center w-[15%]",
    //   render: (row) => (
    //     <div className="flex items-center justify-center gap-2 text-gray-600">
    //       <Phone size={10} className="text-[#1E5AA5]" />
    //       <span className="text-[10px] font-bold tracking-wider">
    //         {row.no_telp || "-"}
    //       </span>
    //     </div>
    //   ),
    // },
    {
      header: "AKSI",
      align: "text-center w-[160px]", // Dilebarkan sedikit agar muat 3 tombol
      render: (row) => (
        <div className="flex justify-center gap-2 items-center">
          {/* ✅ TOMBOL DETAIL DITAMBAHKAN */}
          <DetailButton
            onClick={() => navigate(`/admin/ho/detail/${row.id_user}`)}
          />
          <EditButton
            onClick={() => navigate(`/admin/ho/edit/${row.id_user}`)}
          />
          <DeleteButton onClick={() => handleDelete(row.id_user, row.nama)} />
        </div>
      ),
    },
  ];

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-10 pt-20 md:pt-10 pb-0">
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-t-[2.5rem] rounded-b-none border-none shadow-2xl bg-white overflow-hidden relative">
          <div className="px-10 pt-8 pb-6 shrink-0">
            <header className="flex flex-row items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition animate-pulse"></div>
                  <div className="relative p-3.5 bg-gradient-to-br from-[#2E5AA7] to-[#164a8a] rounded-2xl text-white shadow-xl">
                    <Building2 size={22} strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex flex-col -space-y-1">
                  <Label
                    text="Otoritas Administrator Pusat YPA-MDR"
                    className="!text-[8px] !text-[#1E5AA5] !font-black tracking-[0.3em] !mb-1 uppercase"
                  />
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Data <span className="text-[#2E5AA7]">Head Office</span>
                  </h1>
                </div>
              </div>

              <Button
                text="TAMBAH PERSONEL"
                icon={<Plus size={14} />}
                onClick={() => navigate("/admin/ho/create")}
                className="group !bg-[#2E5AA7] hover:!bg-[#1c5496] !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
              />
            </header>

            <div className="flex flex-row items-center gap-3">
              <div className="w-44">
                <Dropdown
                  label="Department"
                  value={filterDept}
                  onChange={(val) => {
                    setFilterDept(val);
                    setFilterTingkat("all");
                    setCurrentPage(1);
                  }}
                  items={[
                    { value: "all", label: "SEMUA DEPT" },
                    { value: "akademik", label: "AKADEMIK" },
                    { value: "non-akademik", label: "NON-AKADEMIK" },
                  ]}
                  className="h-[42px] !rounded-xl text-[10px]"
                />
              </div>

              <div className="w-48">
                <Dropdown
                  label="Fokus Tingkat"
                  value={filterTingkat}
                  disabled={filterDept !== "akademik"}
                  onChange={(val) => {
                    setFilterTingkat(val);
                    setCurrentPage(1);
                  }}
                  items={[
                    { value: "all", label: "SEMUA TINGKAT" },
                    { value: "SD & SMP", label: "SD & SMP" },
                    { value: "SMK", label: "SMK" },
                  ]}
                  className="h-[42px] !rounded-xl text-[10px]"
                />
              </div>

              <div className="relative flex-1">
                <Input
                  placeholder="Cari nama, email, atau telepon..."
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

export default ReadHO;
