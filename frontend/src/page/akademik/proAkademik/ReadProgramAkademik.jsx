/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import Sidebar from "../../../components/Sidebar";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Search from "../../../components/Search";
import Dropdown from "../../../components/Dropdown";
import PageWrapper from "../../../components/PageWrapper";
import Label from "../../../components/Label";
import Pagination from "../../../components/Pagination";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import {
  Eye,
  FileText,
  Plus,
  Edit,
  ToggleLeft,
  ToggleRight,
  MapPin,
  X,
  School,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { useState, useEffect } from "react";

function ReadProgramAkademik() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterWilayah, setFilterWilayah] = useState("Semua");
  const [programs, setPrograms] = useState([]);
  const [sekolahs, setSekolahs] = useState([]);
  
  // State untuk Drawer
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const limit = 12;
  const start = (page - 1) * limit;
  const end = start + limit;

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "Aktif" ? "Draft" : "Aktif";

      const res = await fetch(`http://localhost:3000/program/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status_program: newStatus }),
      });

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
        fetch("http://localhost:3000/program?kategori=AKADEMIK", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:3000/sekolah", {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (!resProgram.ok || !resSekolah.ok) throw new Error("Gagal mengambil data");

      const dataProgram = await resProgram.json();
      const dataSekolah = await resSekolah.json();
      
      setPrograms(Array.isArray(dataProgram) ? dataProgram : []);
      setSekolahs(Array.isArray(dataSekolah) ? dataSekolah : []);
      
      // Jika drawer sedang buka, perbarui data selectedSchool dengan mapping ulang
      if (selectedSchool) {
        const updatedSchool = (Array.isArray(dataSekolah) ? dataSekolah : []).find(s => s.id_sekolah === selectedSchool.id_sekolah);
        if (updatedSchool) {
          const matchedPrograms = (Array.isArray(dataProgram) ? dataProgram : []).filter(p => p.sekolah === updatedSchool.nama_sekolah);
          setSelectedSchool({
            ...updatedSchool,
            program_list: matchedPrograms,
            total_program: matchedPrograms.length
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data master.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter Master Sekolah
  const filteredSekolahs = sekolahs
    .filter((s) => {
      if (filterWilayah === "Semua") return true;
      return s.wilayah?.nama_wilayah === filterWilayah;
    })
    .filter((s) =>
      [s.nama_sekolah, s.npsn]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  // Mapping Program ke Sekolah
  const schoolsArray = filteredSekolahs.map(sekolah => {
    const matchedPrograms = programs.filter(p => {
      // Lebih aman mencocokkan id_sekolah jika ada, atau fallback ke nama sekolah (case-insensitive & trim)
      if (p.id_sekolah && sekolah.id_sekolah) {
        return String(p.id_sekolah) === String(sekolah.id_sekolah);
      }
      return p.sekolah?.trim().toLowerCase() === sekolah.nama_sekolah?.trim().toLowerCase();
    });
    
    return {
      ...sekolah,
      program_list: matchedPrograms,
      total_program: matchedPrograms.length || 0,
      aktif_count: matchedPrograms.filter(p => p.status_program === 'Aktif').length || 0,
      draft_count: matchedPrograms.filter(p => p.status_program === 'Draft').length || 0,
    };
  });

  const currentData = schoolsArray.slice(start, end);
  const totalPages = Math.ceil(schoolsArray.length / limit) || 1;

  // Dapatkan list wilayah unik dari data sekolah
  const uniqueWilayahs = [...new Set(sekolahs.map(s => s.wilayah?.nama_wilayah).filter(Boolean))];
  const filterOptions = [
    { label: "Semua Wilayah", value: "Semua" },
    ...uniqueWilayahs.map(w => ({ label: w.split("/").pop().toUpperCase(), value: w }))
  ];

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-t-[2.5rem] rounded-b-[2.5rem] border-none shadow-2xl bg-white overflow-hidden relative">
          <div className="px-8 pt-6 pb-6 shrink-0 z-10 bg-white">
            <header className="flex flex-row items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition animate-pulse"></div>
                  <div className="relative p-3.5 bg-gradient-to-br from-[#1E5AA5] to-[#113a6e] rounded-2xl text-white shadow-xl">
                    <School size={22} strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-col -space-y-1">
                  <Label
                    text="Sistem Monitoring dan Evaluasi Program"
                    className="!text-[8px] !text-[#1E5AA5] !font-black tracking-[0.3em] !mb-1 uppercase"
                  />
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Master Data{" "}
                    <span className="text-[#1E5AA5]">Program Akademik</span>
                  </h1>
                </div>
              </div>

              <Button
                text="+ Tambah Program"
                icon={<Plus size={14} />}
                onClick={() => navigate("/ho/program/akademik/create")}
                className="group !bg-[#1E5AA5] hover:!bg-[#154483] !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
              />
            </header>

            <div className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-[#1E5AA5] rounded-xl border border-blue-100 font-black text-[9px] uppercase tracking-[0.2em] shrink-0">
                <School size={14} /> Total: {schoolsArray.length} Sekolah Binaan
              </div>
              <div className="w-72">
                <Search
                  placeholder="Cari sekolah atau NPSN..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="!pl-12 !pr-4 !py-2.5 !bg-gray-50/80 !border-gray-200/50 !rounded-xl !text-[11px] !font-bold outline-none focus:!bg-white focus:!ring-4 focus:!ring-blue-100/50 transition-all shadow-sm"
                />
              </div>
              <div className="w-56">
                <Dropdown
                  label="Wilayah"
                  items={filterOptions}
                  value={filterWilayah}
                  onChange={setFilterWilayah}
                  className="!bg-gray-50/80 !border-gray-200/50 !rounded-xl !text-[11px] !font-bold focus:!bg-white focus:!ring-4 focus:!ring-blue-100/50 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-8 py-8">
              {currentData.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40 text-gray-900 bg-white border-2 border-dashed border-gray-200 rounded-3xl h-64">
                  <School size={48} className="mb-4 text-[#1E5AA5]" />
                  <p className="text-sm font-black uppercase tracking-widest text-gray-500">
                    Tidak Ada Sekolah Ditemukan
                  </p>
                </div>
              ) : (
                currentData.map((item, index) => {
                  const imageUrl = `https://ui-avatars.com/api/?name=${item.nama_sekolah}&background=1E5AA5&color=fff&size=512&font-size=0.15&bold=true`;
                  
                  return (
                  <div key={item.id_sekolah || index} className="group relative bg-white rounded-[2rem] overflow-hidden border border-gray-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(30,90,165,0.12)] transition-all duration-500 flex flex-col h-auto transform hover:-translate-y-1.5">
                    
                    {/* Header Image Section */}
                    <div className="h-48 relative overflow-hidden shrink-0 bg-[#f1f5f9]">
                      <img 
                        src={imageUrl} 
                        alt={item.nama_sekolah}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 blur-[0.5px] opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#0f172a]/40 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
                      
                      {/* Total Program Badge */}
                      <div className="absolute top-5 right-5">
                        <div className="px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white flex items-center gap-2 shadow-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.total_program} Program</span>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="absolute bottom-5 left-6 right-6">
                        <div className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/10 text-white text-[8px] font-black tracking-[0.2em] uppercase mb-2">
                            NPSN: {item.npsn || "-"}
                        </div>
                        <h3 className="text-white font-black text-[20px] leading-snug line-clamp-2 drop-shadow-lg group-hover:text-blue-100 transition-colors duration-300">
                            {item.nama_sekolah}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body - Summary Stats */}
                    <div className="flex-1 p-6 flex flex-col justify-between bg-white relative">
                      {/* Floating Button overlap */}
                      <div className="absolute right-6 -top-6">
                         <button 
                           onClick={() => navigate(`/ho/program/akademik/list/${item.id_sekolah}`)} 
                           className="w-12 h-12 bg-[#1E5AA5] hover:bg-[#154483] text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(30,90,165,0.3)] hover:shadow-[0_12px_25px_rgba(30,90,165,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 group/btn"
                         >
                            <ArrowRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
                         </button>
                      </div>

                      <div className="mt-2 mb-2">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Ringkasan Status</p>
                        <div className="flex items-center gap-8">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Aktif</span>
                            </div>
                            <span className="text-[28px] font-black text-gray-800 leading-none">{item.aktif_count || 0}</span>
                          </div>
                          <div className="w-px h-10 bg-gray-100"></div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Draft</span>
                            </div>
                            <span className="text-[28px] font-black text-gray-800 leading-none">{item.draft_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/50 group-hover:bg-[#1E5AA5]/5 transition-colors duration-300 cursor-pointer" onClick={() => navigate(`/ho/program/akademik/list/${item.id_sekolah}`)}>
                      <div className="w-full flex items-center justify-between text-[#1E5AA5] group-hover:text-[#154483]">
                        <span className="text-[10px] font-black uppercase tracking-widest">Lihat Semua Program</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                )})
              )}
            </div>
          </div>

          <div className="px-10 py-5 bg-white shrink-0 border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.01)] z-10">
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

export default ReadProgramAkademik;
