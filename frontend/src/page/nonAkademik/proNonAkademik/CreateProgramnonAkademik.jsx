/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import {
  Save,
  Target,
  Info,
  FileText,
  Trash2,
  Plus,
  Layout,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  ListChecks,
} from "lucide-react";

import Sidebar from "../../../components/Sidebar";
import Card from "../../../components/Card";
import Button from "../../../components/Button";
import Label from "../../../components/Label";
import Input from "../../../components/Input";
import Textarea from "../../../components/Textarea";
import IconButton from "../../../components/IconButton";
import Dropdown from "../../../components/Dropdown";
import Upload from "../../../components/Upload";
import PageWrapper from "../../../components/PageWrapper";

function CreateProgramnonAkademik() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const PRIMARY_COLOR = "#1E5AA5";

  const [aoList, setAoList] = useState([]);
  const [allSekolah, setAllSekolah] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [availableWilayah, setAvailableWilayah] = useState([]);
  const [filteredSekolah, setFilteredSekolah] = useState([]);

  const [namaHO, setNamaHO] = useState("");
  const [selectedAO, setSelectedAO] = useState("");
  const [selectedWilayah, setSelectedWilayah] = useState("");
  const [selectedJenjang, setSelectedJenjang] = useState("");
  const [selectedSekolah, setSelectedSekolah] = useState("");
  const [namaProgram, setNamaProgram] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kpi, setKpi] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [fileMou, setFileMou] = useState(null);
  const [openDrop, setOpenDrop] = useState(null);
  const [kegiatan, setKubernetes] = useState([
    { nama_kegiatan: "", start_date: "", due_date: "" },
  ]);

  const [fases, setFases] = useState([
    { nama_fase: "", deskripsi: "", urutan: 1, kegiatans: [] },
  ]);
  const [expandedFase, setExpandedFase] = useState([true]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        if (token) {
          const decoded = jwtDecode(token);
          setNamaHO(decoded.nama || "PIC Head Office");
        }
        const fetchJson = async (url) => {
          const r = await fetch(url, { headers });
          return r.ok ? r.json() : [];
        };
        const [s, a, v] = await Promise.all([
          fetchJson("http://localhost:3000/sekolah"),
          fetchJson("http://localhost:3000/users/ao"),
          fetchJson("http://localhost:3000/vendor?kategori=NON_AKADEMIK"),
        ]);
        setAllSekolah(s);
        setAoList(a);
        setVendorList(v);
      } catch {
        toast.error("Gagal sinkronisasi data master");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedAO) {
      const ao = aoList.find((u) => u.id_user === Number(selectedAO));
      setAvailableWilayah(ao?.wilayah_binaan || []);
      setSelectedWilayah("");
    }
  }, [selectedAO, aoList]);

  useEffect(() => {
    let filtered = allSekolah.filter(
      (s) => s.id_wilayah === Number(selectedWilayah),
    );
    if (selectedJenjang)
      filtered = filtered.filter((s) => s.jenjang === selectedJenjang);
    setFilteredSekolah(filtered);
  }, [selectedWilayah, selectedJenjang, allSekolah]);

  const DropdownTrigger = ({ type, placeholder, value }) => (
    <button
      type="button"
      onClick={() => setOpenDrop(openDrop === type ? null : type)}
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${openDrop === type ? "border-blue-500 ring-2 ring-blue-500/10" : "border-gray-200 bg-gray-50/50 hover:border-gray-300"}`}
    >
      <span
        className={`truncate ${value ? "text-gray-800 font-bold" : "text-gray-400"}`}
      >
        {value || placeholder}
      </span>
      <ChevronDown
        size={14}
        className={`transition-transform ${openDrop === type ? "rotate-180 text-blue-500" : ""}`}
      />
    </button>
  );

  const addKegiatan = () =>
    setKegiatan([
      ...kegiatan,
      { nama_kegiatan: "", start_date: "", due_date: "" },
    ]);

  const removeKegiatan = (index) =>
    kegiatan.length > 1 && setKegiatan(kegiatan.filter((_, i) => i !== index));

  const handleKegiatanChange = (index, field, value) => {
    const updated = [...kegiatan];
    updated[index][field] = value;
    setKegiatan(updated);
  };

  const addFase = () => {
    const newFase = {
      nama_fase: "",
      deskripsi: "",
      urutan: fases.length + 1,
      kegiatans: [],
    };
    setFases([...fases, newFase]);
    setExpandedFase([...expandedFase, false]);
  };

  const removeFase = (index) => {
    const newFases = fases.filter((_, i) => i !== index);
    setFases(newFases.map((f, i) => ({ ...f, urutan: i + 1 })));
  };

  const updateFase = (index, field, value) => {
    const newFases = [...fases];
    newFases[index][field] = value;
    setFases(newFases);
  };

  const toggleFaseExpand = (index) => {
    const newExpanded = [...expandedFase];
    newExpanded[index] = !newExpanded[index];
    setExpandedFase(newExpanded);
  };

  const addActivitiesToFase = (faseIndex) => {
    const newFases = [...fases];
    newFases[faseIndex].kegiatans.push({
      nama_kegiatans: "",
      deskripsi: "",
      urutan: newFases[faseIndex].kegiatans.length + 1,
    });
    setFases(newFases);
  };

  const removeActivitiesFromFase = (faseIndex, kegIndex) => {
    const newFases = [...fases];
    newFases[faseIndex].kegiatans.splice(kegIndex, 1);
    setFases(
      newFases.map((f) => ({
        ...f,
        kegiatans: f.kegiatans.map((k, i) => ({ ...k, urutan: i + 1 })),
      })),
    );
  };

  const updateActivities = (faseIndex, kegIndex, field, value) => {
    const newFases = [...fases];
    newFases[faseIndex].kegiatans[kegIndex][field] = value;
    setFases(newFases);
  };

  const saveProgram = async () => {
    // 1. Validasi Input Dasar
    if (!namaProgram || !selectedAO || !tahun || !fileMou) {
      return toast.error("Lengkapi data yang wajib diisi!");
    }

    // 2. Filter hanya fase yang ada namanya, dan pastikan setiap fase punya kegiatan yang ada namanya
    const validFases = fases
      .filter((f) => f && f.nama_fase && f.nama_fase.trim() !== "")
      .map((f, i) => ({
        nama_fase: f.nama_fase.trim(), // Trim di sini juga
        deskripsi: f.deskripsi || "",
        urutan: i + 1,
        kegiatans: (f.kegiatans || [])
          .filter(
            (k) => k && k.nama_kegiatans && k.nama_kegiatans.trim() !== "",
          )
          .map((k, ki) => ({
            nama_kegiatans: k.nama_kegiatans.trim(),
            deskripsi: k.deskripsi || "",
            urutan: ki + 1,
          })),
      }));

    if (validFases.length === 0) {
      return toast.error("Tambahkan minimal 1 Nama Fase!");
    }

    const hasKegiatan = validFases.some((f) => f.kegiatans.length > 0);
    if (!hasKegiatan) {
      return toast.error("Setiap fase minimal harus memiliki 1 kegiatan!");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Append Data String & Number
      formData.append("nama_program", namaProgram);
      formData.append("deskripsi", deskripsi);
      formData.append("kpi", kpi);
      formData.append("tahun", tahun.toString());
      formData.append("id_pengawas", selectedAO); // Di backend ini id_pengawas
      formData.append("id_sekolah", selectedSekolah || "");
      formData.append("id_vendor", selectedVendor || "");
      formData.append("kategori", "NON_AKADEMIK");
      formData.append("status_program", "Draft");

      // ✨ PENTING: Gunakan key "file_mou" agar sinkron dengan Backend (Interceptor)
      if (fileMou) formData.append("file_mou", fileMou);

      // ✨ PENTING: Gunakan JSON.stringify agar @Transform di Backend bisa bekerja
      formData.append("fases", JSON.stringify(validFases));

      const r = await fetch("http://localhost:3000/program", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Jangan set 'Content-Type': 'application/json' di sini karena pakai FormData
        },
        body: formData,
      });

      if (r.ok) {
        toast.success("Program berhasil dibuat!");
        navigate("/ho/program/non-akademik");
      } else {
        const body = await r.json();
        toast.error(body.message || "Gagal menyimpan program");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

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
                  <div className="relative p-3.5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl text-white shadow-xl">
                    <Layout size={22} strokeWidth={2} />
                  </div>
                </div>
                <div className="flex flex-col -space-y-1">
                  <Label
                    text="Sistem Monitoring dan Evaluasi Program"
                    className="!text-[8px] !text-[#1E5AA5] !font-black tracking-[0.3em] !mb-1 uppercase"
                  />
                  <h1 className="text-xl font-black text-gray-800 tracking-tight uppercase leading-none">
                    Inisiasi Program{" "}
                    <span className="text-blue-500">Non Akademik</span>
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  text="← Kembali"
                  icon={<ArrowLeft size={14} />}
                  onClick={() => navigate("/ho/program/non-akademik")}
                  className="group !bg-gray-600 hover:!bg-gray-700 !rounded-xl !px-5 !py-2.5 !text-[10px] font-black text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
                />
              </div>
            </header>

            <div className="flex flex-row items-center gap-3 mb-6">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 font-black text-[9px] uppercase tracking-[0.2em] shrink-0">
                <BookOpen size={14} /> Kategori: Non Akademik
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col px-10 pb-4">
            <div className="flex-1 bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col shadow-sm">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Sasaran Program */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-100">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Target size={20} className="text-blue-600" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 uppercase tracking-wide">
                        Sasaran Program
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                        <div>
                          <Label text="PIC Head Office" />
                          <p className="text-sm font-black text-blue-600">
                            {namaHO}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label text="AO (Pengawas)" required />
                        <div className="relative">
                          <DropdownTrigger
                            type="ao"
                            placeholder="Pilih Pengawas"
                            value={
                              aoList.find((a) => a.id_user === selectedAO)?.nama
                            }
                          />
                          {openDrop === "ao" && (
                            <ul className="absolute z-40 w-full bg-white border border-gray-100 mt-2 rounded-xl shadow-2xl max-h-48 overflow-y-auto p-1">
                              {aoList.map((a) => (
                                <li
                                  key={a.id_user}
                                  onClick={() => {
                                    setSelectedAO(a.id_user);
                                    setOpenDrop(null);
                                  }}
                                  className="px-4 py-2 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-gray-600 transition-colors"
                                >
                                  {a.nama}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label text="Wilayah" />
                        <div className="relative">
                          <DropdownTrigger
                            type="wilayah"
                            placeholder="Pilih Wilayah"
                            value={
                              availableWilayah.find(
                                (w) => w.id_wilayah === selectedWilayah,
                              )?.nama_wilayah
                            }
                          />
                          {openDrop === "wilayah" && (
                            <ul className="absolute z-40 w-full bg-white border border-gray-100 mt-2 rounded-xl shadow-2xl max-h-48 overflow-y-auto p-1">
                              {availableWilayah.map((w) => (
                                <li
                                  key={w.id_wilayah}
                                  onClick={() => {
                                    setSelectedWilayah(w.id_wilayah);
                                    setOpenDrop(null);
                                  }}
                                  className="px-4 py-2 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-gray-600 transition-colors"
                                >
                                  {w.nama_wilayah}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label text="Jenjang" />
                        <div className="relative">
                          <DropdownTrigger
                            type="jenjang"
                            placeholder="Pilih Jenjang"
                            value={selectedJenjang}
                          />
                          {openDrop === "jenjang" && (
                            <ul className="absolute z-40 w-full bg-white border border-gray-100 mt-2 rounded-xl shadow-2xl p-1">
                              {["SD", "SMP", "SMK"].map((j) => (
                                <li
                                  key={j}
                                  onClick={() => {
                                    setSelectedJenjang(j);
                                    setOpenDrop(null);
                                  }}
                                  className="px-4 py-2 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-gray-600 transition-colors"
                                >
                                  {j}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label text="Sekolah" />
                        <div className="relative">
                          <DropdownTrigger
                            type="sekolah"
                            placeholder="Pilih Sekolah"
                            value={
                              filteredSekolah.find(
                                (s) => s.id_sekolah === selectedSekolah,
                              )?.nama_sekolah
                            }
                          />
                          {openDrop === "sekolah" && (
                            <ul className="absolute z-40 w-full bg-white border border-gray-100 mt-2 rounded-xl shadow-2xl max-h-48 overflow-y-auto p-1">
                              {filteredSekolah.map((s) => (
                                <li
                                  key={s.id_sekolah}
                                  onClick={() => {
                                    setSelectedSekolah(s.id_sekolah);
                                    setOpenDrop(null);
                                  }}
                                  className="px-4 py-2 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-gray-600 transition-colors"
                                >
                                  {s.nama_sekolah}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi & Aktivitas */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-100">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Info size={20} className="text-green-600" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 uppercase tracking-wide">
                        Deskripsi & Aktivitas
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label text="Nama Program" required />
                          <Input
                            placeholder="cth: Bank Sampah"
                            value={namaProgram}
                            onChange={(e) => setNamaProgram(e.target.value)}
                            className="bg-gray-50 border-transparent focus:bg-white font-bold"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label text="KPI Utama" />
                          <Input
                            placeholder="cth: Target 50 Ton"
                            value={kpi}
                            onChange={(e) => setKpi(e.target.value)}
                            className="bg-gray-50 border-transparent focus:bg-white font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label text="Deskripsi Program" />
                        <textarea
                          className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 h-32 resize-none"
                          placeholder="Tuliskan tujuan singkat..."
                          value={deskripsi}
                          onChange={(e) => setDeskripsi(e.target.value)}
                        />
                      </div>

                      <div className="pt-4 border-t border-dashed border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                            Rencana Kegiatan
                          </h3>
                          <button
                            onClick={addKegiatan}
                            className="text-[10px] font-black flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <Plus size={14} /> TAMBAH BARIS
                          </button>
                        </div>
                        {kegiatan.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50/50 p-4 rounded-2xl mb-3 relative border border-gray-100"
                          >
                            <IconButton
                              icon={<Trash2 size={14} />}
                              onClick={() => removeKegiatan(idx)}
                              variant="ghost"
                              className="absolute top-2 right-2 text-red-300 p-0 hover:text-red-400"
                            />
                            <div className="space-y-3 mt-2">
                              <Input
                                placeholder="Nama Kegiatan"
                                value={item.nama_kegiatan}
                                onChange={(e) =>
                                  handleKegiatanChange(
                                    idx,
                                    "nama_kegiatan",
                                    e.target.value,
                                  )
                                }
                                className="bg-white border-transparent focus:bg-white"
                              />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label text="Mulai" />
                                  <Input
                                    type="date"
                                    value={item.start_date}
                                    onChange={(e) =>
                                      handleKegiatanChange(
                                        idx,
                                        "start_date",
                                        e.target.value,
                                      )
                                    }
                                    className="bg-gray-50 border-transparent text-sm"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label text="Selesai" />
                                  <Input
                                    type="date"
                                    value={item.due_date}
                                    onChange={(e) =>
                                      handleKegiatanChange(
                                        idx,
                                        "due_date",
                                        e.target.value,
                                      )
                                    }
                                    className="bg-gray-50 border-transparent text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logistik & Berkas */}
                <div className="mt-8 space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-100">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText size={20} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-wide">
                      Logistik & Berkas
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label text="Tahun" required />
                      <Input
                        type="number"
                        value={tahun}
                        onChange={(e) => setTahun(e.target.value)}
                        className="bg-gray-50 border-transparent text-center font-black"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label text="Vendor Pelaksana" />
                      <div className="relative">
                        <DropdownTrigger
                          type="vendor"
                          placeholder="Pilih Vendor (Optional)"
                          value={
                            vendorList.find(
                              (v) => v.id_vendor === selectedVendor,
                            )?.nama_vendor
                          }
                        />
                        {openDrop === "vendor" && (
                          <ul className="absolute z-40 w-full bg-white border border-gray-100 mt-2 rounded-xl shadow-2xl max-h-48 overflow-y-auto p-1">
                            <li
                              onClick={() => {
                                setSelectedVendor(null);
                                setOpenDrop(null);
                              }}
                              className="px-4 py-2 hover:bg-gray-100 rounded-lg italic text-gray-400 text-sm"
                            >
                              Tanpa Vendor
                            </li>
                            {vendorList.map((v) => (
                              <li
                                key={v.id_vendor}
                                onClick={() => {
                                  setSelectedVendor(v.id_vendor);
                                  setOpenDrop(null);
                                }}
                                className="px-4 py-2 hover:bg-blue-50 rounded-lg cursor-pointer text-sm font-bold text-gray-600 transition-colors"
                              >
                                {v.nama_vendor}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label text="Upload MOU" required />
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-blue-50/30 hover:border-blue-500 transition-all cursor-pointer group">
                        <Upload
                          size={24}
                          className="text-gray-300 group-hover:text-blue-500 mb-2 transition-colors"
                        />
                        <div className="text-center px-4">
                          <p className="text-[10px] font-black text-gray-400 group-hover:text-blue-600 truncate w-full">
                            {fileMou ? fileMou.name : "KLIK UNTUK UNGGAH MOU"}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => setFileMou(e.target.files[0])}
                          accept=".pdf,.jpg,.png"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Fase & Kegiatan */}
                <div className="mt-8 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <ListChecks size={20} className="text-purple-600" />
                      </div>
                      <h3 className="text-lg font-black text-gray-800 uppercase tracking-wide">
                        Fase & Kegiatan Program
                      </h3>
                    </div>
                    <Button
                      text="Tambah Fase"
                      icon={<PlusCircle size={14} />}
                      onClick={addFase}
                      className="!bg-purple-50 !text-purple-600 hover:!bg-purple-600 hover:!text-white !rounded-xl !px-4 !py-2 !text-[10px] font-black transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-4">
                    {fases.map((fase, faseIndex) => (
                      <div
                        key={faseIndex}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
                          onClick={() => toggleFaseExpand(faseIndex)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-sm">
                              {faseIndex + 1}
                            </div>
                            <input
                              type="text"
                              placeholder={`Nama Fase ${faseIndex + 1}`}
                              value={fase.nama_fase}
                              onChange={(e) =>
                                updateFase(
                                  faseIndex,
                                  "nama_fase",
                                  e.target.value,
                                )
                              }
                              className="bg-transparent border-none font-black text-gray-800 placeholder-gray-400 focus:ring-0 w-48"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFase(faseIndex);
                              }}
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                            <ChevronRight
                              size={18}
                              className={`text-gray-400 transition-transform ${expandedFase[faseIndex] ? "rotate-90" : ""}`}
                            />
                          </div>
                        </div>

                        {expandedFase[faseIndex] && (
                          <div className="p-4 bg-white border-t border-gray-200 space-y-3">
                            <div className="flex items-center justify-between pt-2">
                              <h4 className="text-xs font-black text-gray-500 uppercase">
                                {" "}
                                kegiatan ({fase.kegiatans.length})
                              </h4>
                              <button
                                onClick={() => addActivitiesToFase(faseIndex)}
                                className="text-xs font-black text-blue-600 hover:text-blue-700"
                              >
                                + Tambah Kegiatan
                              </button>
                            </div>
                            <div className="space-y-2">
                              {fase.kegiatans.map((keg, kegIndex) => (
                                <div
                                  key={kegIndex}
                                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="w-6 h-6 rounded-md bg-orange-500 text-white flex items-center justify-center font-black text-[10px]">
                                    {kegIndex + 1}
                                  </div>
                                  <input
                                    type="text"
                                    placeholder={`Nama Kegiatan ${kegIndex + 1}`}
                                    value={keg.nama_kegiatans}
                                    onChange={(e) =>
                                      updateActivities(
                                        faseIndex,
                                        kegIndex,
                                        "nama_kegiatans",
                                        e.target.value,
                                      )
                                    }
                                    className="flex-1 bg-transparent border-none font-bold text-gray-700 placeholder-gray-400 focus:ring-0 text-sm"
                                  />
                                  <button
                                    onClick={() =>
                                      removeActivitiesFromFase(
                                        faseIndex,
                                        kegIndex,
                                      )
                                    }
                                    className="text-red-400 hover:text-red-600"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                  <Button
                    text={loading ? "Menyimpan..." : "Simpan Program"}
                    icon={<Save size={14} />}
                    disabled={loading}
                    onClick={saveProgram}
                    className="!bg-blue-50 !text-blue-600 hover:!bg-blue-600 hover:!text-white !rounded-xl !px-6 !py-3 !text-sm font-black transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
}

export default CreateProgramnonAkademik;
