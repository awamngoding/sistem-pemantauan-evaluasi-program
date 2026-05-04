import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FileText, Pencil, Building2, AlertCircle } from "lucide-react";

// Komponen Custom
import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import Search from "../../components/Search";
import Table from "../../components/Table";
import PageWrapper from "../../components/PageWrapper";
import IconButton from "../../components/IconButton";

function DashboardSekolah() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const hitungRemaining = (sent_at, tenggat) => {
    if (!sent_at) return "-";
    const deadline = new Date(sent_at);
    deadline.setDate(deadline.getDate() + (tenggat ?? 7));
    const now = new Date();
    const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    if (diff > 0)
      return <span className="text-blue-600 font-bold">{diff} Hari Lagi</span>;
    if (diff === 0)
      return <span className="text-orange-500 font-bold">Hari Ini!</span>;
    return <span className="text-red-500 font-bold">Tenggat Habis</span>;
  };

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const decoded = jwtDecode(token);
        console.log("DECODED TOKEN SEKOLAH:", decoded);

        // AMANKAN ID USER & SEKOLAH (Sub biasanya berisi ID User)
        const id_sekolah = decoded.id_sekolah || 0;
        const id_user = decoded.sub || decoded.id_user || 0;

        // Menggunakan URLSearchParams agar query string rapi dan aman
        const queryParams = new URLSearchParams({
          id_user: id_user.toString(),
        });

        const res = await fetch(
          `http://localhost:3000/assessment/sekolah/${id_sekolah}?${queryParams}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Gagal mengambil assessment");
        }
        console.log("DATA DARI API:", data);

        setAssessments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal mengambil assessment:", err);
        setErrorMessage(
          "Gagal memuat data. Pastikan akun sekolah sudah terhubung dengan data sekolah atau hubungi admin.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [navigate]);

  const filteredData = assessments.filter((item) => {
    if (!searchTerm) return true;
    const namaMatch = (item.nama || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const hoMatch = (item.ho || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return namaMatch || hoMatch;
  });

  const tableColumns = [
    {
      header: "No",
      align: "text-center w-16",
      render: (_, idx) => (
        <span className="text-gray-400 font-mono text-xs font-medium bg-gray-100 px-2 py-1 rounded-md">
          {idx + 1}
        </span>
      ),
    },
    {
      header: "Nama Assessment",
      render: (row) => (
        <span className="font-bold text-gray-800">{row.nama}</span>
      ),
    },
    {
      header: "HO Pengirim",
      accessor: "ho",
      align: "text-gray-500 font-medium",
    },
    {
      header: "Sisa Waktu",
      align: "text-center",
      render: (row) => hitungRemaining(row.sent_at, row.tenggat),
    },
    {
      header: "Status",
      align: "text-center",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            row.sudah_diisi
              ? "bg-emerald-100 text-emerald-600"
              : "bg-rose-100 text-rose-600"
          }`}
        >
          {row.sudah_diisi ? "Selesai" : "Belum Diisi"}
        </span>
      ),
    },
    {
      header: "Aksi",
      align: "text-center",
      render: (row) => (
        <div className="flex justify-center gap-2">
          <IconButton
            icon={<FileText size={16} />}
            onClick={() =>
              navigate(`/sekolah/assessment/isi/${row.id_assessment}`)
            }
            className="text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white"
            title="Lihat Detail"
          />
          {!row.sudah_diisi && (
            <IconButton
              icon={<Pencil size={16} />}
              onClick={() =>
                navigate(`/sekolah/assessment/isi/${row.id_assessment}`)
              }
              className="text-orange-500 bg-orange-50 hover:bg-orange-500 hover:text-white"
              title="Kerjakan"
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-t-[2.5rem] rounded-b-[2.5rem] border-none shadow-2xl bg-white overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-[#1E5AA5] shadow-sm border border-blue-100">
                  <Building2 size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                    Dashboard <span className="text-[#1E5AA5]">Sekolah</span>
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    List assessment yang telah dikirim ke sekolahmu.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-2xl border border-blue-100 text-[#1E5AA5] font-black text-[11px] uppercase tracking-[0.2em]">
                  <span>Total</span>
                  <span className="text-[#164a8a]">{filteredData.length}</span>
                </div>
                <div className="w-full sm:w-72">
                  <Search
                    placeholder="Cari assessment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="!pl-12 !pr-4 !py-3 !rounded-xl !bg-gray-50/80 !border-gray-200 focus:!bg-white focus:!ring-4 focus:!ring-blue-100/50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-8 pb-8">
            {loading ? (
              <div className="text-center py-10 text-gray-400 font-medium animate-pulse">
                Memuat data...
              </div>
            ) : errorMessage ? (
              <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
                <AlertCircle className="mx-auto text-red-300 mb-3" size={32} />
                <p className="text-red-500 font-medium text-sm">
                  {errorMessage}
                </p>
              </div>
            ) : filteredData.length > 0 ? (
              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <Table columns={tableColumns} data={filteredData} />
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <AlertCircle className="mx-auto text-gray-300 mb-3" size={32} />
                <p className="text-gray-400 font-medium text-sm">
                  Tidak ada tugas assessment saat ini.
                </p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
}

export default DashboardSekolah;
