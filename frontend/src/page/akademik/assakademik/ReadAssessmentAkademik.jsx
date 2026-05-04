import Sidebar from "../../../components/Sidebar";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Search from "../../../components/Search";
import Table from "../../../components/Table";
import Toggle from "../../../components/Toggle";
import Dropdown from "../../../components/Dropdown";
import PageWrapper from "../../../components/PageWrapper";
import Label from "../../../components/Label";
import Pagination from "../../../components/Pagination";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Send, ClipboardCheck, FileText } from "lucide-react";

import { useState, useEffect } from "react";

function ReadAssessmentAkademik() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("aktif");
  const [toggling, setToggling] = useState({});
  const [assessments, setAssessments] = useState([]);

  const limit = 10;
  const start = (page - 1) * limit;
  const end = start + limit;

  const hitungRemaining = (sent_at, tenggat) => {
    if (!sent_at) return "-";
    const deadline = new Date(sent_at);
    deadline.setDate(deadline.getDate() + (tenggat ?? 7));
    const now = new Date();
    const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} hari lagi` : "Tenggat habis";
  };

  const filteredAssessments = assessments
    .filter((item) => {
      if (filterStatus === "aktif") return item.aktif;
      if (filterStatus === "nonaktif") return !item.aktif;
      return true;
    })
    .filter((item) =>
      [item.nama, item.ho, item.sekolah]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const id_ho = decoded.sub;

        const res = await fetch(
          `http://localhost:3000/assessment?jenis=akademik&id_ho=${id_ho}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Gagal mengambil assessment");
        }
        if (!Array.isArray(data)) {
          throw new Error("Response assessment bukan array");
        }

        const mapped = data.map((item) => ({
          id: item.id_assessment,
          nama: item.nama ?? "-",
          ho: item.ho ?? "-",
          sekolah: item.daftar_sekolah ?? "-",
          jumlah_pengisi: item.jumlah_pengisi ?? item.jumlah_guru_mengisi ?? 0,
          sent: item.status === "Proses Pengisian",
          sent_at: item.sent_at,
          tenggat: item.tenggat ?? 7,
          aktif: item.aktif ?? true,
        }));

        setAssessments(mapped);
      } catch (err) {
        console.error("Gagal mengambil assessment", err);
      }
    };

    fetchAssessments();
  }, []);

  const currentData = filteredAssessments.slice(start, end);
  const totalPages = Math.ceil(filteredAssessments.length / limit) || 1;

  const handleSend = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/assessment/${id}/send`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);

      setAssessments((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, sent: true, sent_at: new Date().toISOString() }
            : item,
        ),
      );

      toast.success("Assessment berhasil dikirim ke sekolah!");
    } catch (err) {
      console.error("Gagal mengirim assessment:", err);
      toast.error("Gagal mengirim assessment");
    }
  };

  const handleToggleAktif = async (id) => {
    try {
      if (toggling[id]) return;
      setToggling((prev) => ({ ...prev, [id]: true }));

      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/assessment/${id}/toggle-aktif`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error(`Status ${res.status}`);

      setAssessments((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, aktif: !item.aktif } : item,
        ),
      );
    } catch (err) {
      console.error("Gagal toggle aktif:", err);
    } finally {
      setToggling((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filterOptions = [
    { label: "Semua", value: "semua" },
    { label: "Aktif", value: "aktif" },
    { label: "Nonaktif", value: "nonaktif" },
  ];

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-t-[2.5rem] rounded-b-[2.5rem] border-none shadow-2xl bg-white overflow-hidden relative">
          <div className="px-8 pt-6 pb-6 shrink-0">
            <header className="flex flex-row items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition animate-pulse"></div>
                  <div className="relative p-3.5 bg-gradient-to-br from-[#2E5AA7] to-[#164a8a] rounded-2xl text-white shadow-xl">
                    <FileText size={22} strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-col -space-y-1">
                  <Label
                    text="Sistem Monitoring dan Evaluasi Program"
                    className="!text-[8px] !text-[#1E5AA5] !font-black tracking-[0.3em] !mb-1 uppercase"
                  />
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Riwayat{" "}
                    <span className="text-[#2E5AA7]">Assessment Akademik</span>
                  </h1>
                </div>
              </div>

              <Button
                text="+ Tambah Assessment"
                icon={<Send size={14} />}
                onClick={() => navigate("/ho/assessment/akademik/create")}
                className="group !bg-[#2E5AA7] hover:!bg-[#1c5496] !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
              />
            </header>

            <div className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-[#1E5AA5] rounded-xl border border-blue-100 font-black text-[9px] uppercase tracking-[0.2em] shrink-0">
                <ClipboardCheck size={14} /> Total: {filteredAssessments.length}{" "}
                Assessment
              </div>
              <div className="w-72">
                <Search
                  placeholder="Cari assessment..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="!pl-12 !pr-4 !py-2.5 !bg-gray-50/80 !border-gray-200/50 !rounded-xl !text-[11px] !font-bold outline-none focus:!bg-white focus:!ring-4 focus:!ring-blue-100/50 transition-all shadow-sm"
                />
              </div>
              <div className="w-48">
                <Dropdown
                  label="Status"
                  items={filterOptions}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  className="h-[42px] !rounded-xl text-[10px]"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-8 pb-6">
            <Table
              columns={[
                {
                  header: "No",
                  align: "text-center",
                  render: (row, idx) => (
                    <span className="text-gray-400 text-xs font-mono">
                      {start + idx + 1}
                    </span>
                  ),
                },
                {
                  header: "Nama Assessment",
                  accessor: "nama",
                  render: (row) => (
                    <span className="font-bold text-gray-700">{row.nama}</span>
                  ),
                },
                { header: "Nama HO", accessor: "ho" },
                {
                  header: "Nama Sekolah",
                  accessor: "sekolah", // Ini mengambil properti 'sekolah' dari mapped
                  render: (row) => {
                    // Karena array material, biasanya datanya string dipisah koma (ex: "SDN 1, SDN 2")
                    const daftarSekolah =
                      row.sekolah && row.sekolah !== "-"
                        ? row.sekolah.split(",")
                        : [];

                    return (
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {daftarSekolah.length > 0 ? (
                          daftarSekolah.map((nama, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-blue-50 text-[#1E5AA5] rounded-lg text-[9px] font-black border border-blue-100 uppercase tracking-tighter"
                            >
                              {nama.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic text-[10px]">
                            Tidak ada sekolah
                          </span>
                        )}
                      </div>
                    );
                  },
                },
                {
                  header: "Jumlah Pengisi",
                  align: "text-center",
                  render: (row) => (
                    <span className="text-gray-600 text-sm font-medium">
                      {row.jumlah_pengisi} Guru
                    </span>
                  ),
                },
                {
                  header: "Tenggat",
                  align: "text-center",
                  render: (row) => (
                    <span
                      className={`text-xs font-bold ${row.sent_at ? "text-blue-600" : "text-gray-400"}`}
                    >
                      {row.sent_at
                        ? hitungRemaining(row.sent_at, row.tenggat)
                        : `${row.tenggat} hari`}
                    </span>
                  ),
                },
                {
                  header: "Aksi",
                  align: "text-center",
                  render: (row) => (
                    <div className="flex justify-center gap-2">
                      <Button
                        icon={<Eye size={16} />}
                        variant="ghost"
                        className="text-amber-500 hover:text-amber-600 hover:bg-transparent shadow-none"
                        onClick={() =>
                          navigate(`/ho/assessment/akademik/detail/${row.id}`)
                        }
                      />
                      {!row.sent && (
                        <Button
                          icon={<Pencil size={16} />}
                          variant="ghost"
                          className="text-blue-500 hover:text-blue-600 hover:bg-transparent shadow-none"
                          onClick={() =>
                            navigate(`/ho/assessment/akademik/edit/${row.id}`)
                          }
                        />
                      )}
                      {!row.sent && (
                        <Button
                          icon={<Send size={16} />}
                          variant="ghost"
                          className="text-green-500 hover:text-green-600 hover:bg-transparent shadow-none"
                          onClick={() => handleSend(row.id)}
                        />
                      )}
                      <Toggle
                        checked={row.aktif}
                        onChange={() => handleToggleAktif(row.id)}
                        disabled={toggling[row.id]}
                      />
                    </div>
                  ),
                },
              ]}
              data={currentData}
            />
          </div>

          <div className="px-8 pb-6 shrink-0">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredAssessments.length}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
}

export default ReadAssessmentAkademik;
