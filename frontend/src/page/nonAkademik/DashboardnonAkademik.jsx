import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import PageWrapper from "../../components/PageWrapper";
import Label from "../../components/Label";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { 
  ClipboardCheck, 
  School, 
  MapPin, 
  Activity,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Recharts & Leaflet
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet Default Icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Icon untuk Sekolah (Warna Non-Akademik / Sedikit berbeda hue-nya jika ada, tapi pakai blue standar aman)
const schoolIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Fungsi untuk men-generate dummy coordinates di area Pulau Jawa berdasarkan index
const getDummyCoords = (index) => {
  const baseLat = -7.0; // Jawa Tengah / DIY
  const baseLng = 110.0;
  // Menambahkan variasi random kecil tapi deterministik berdasarkan index
  const latOffset = (Math.sin(index * 1.5) * 1.5);
  const lngOffset = (Math.cos(index * 1.5) * 3.5);
  
  return [baseLat + latOffset, baseLng + lngOffset];
};

export default function DashboardnonAkademik() {
  const [user, setUser] = useState({ nama: "", role: "", jenis: null });
  const [sekolahs, setSekolahs] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const d = jwtDecode(token);
        setUser({
          nama: d.nama ?? d.email ?? "User",
          role: d.nama_role ?? d.role ?? "-",
          jenis: d.jenis ?? null,
        });
      } catch {
        localStorage.clear();
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [resSekolah, resAss] = await Promise.all([
          fetch("http://localhost:3000/sekolah", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:3000/assessment?kategori=NON_AKADEMIK", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (resSekolah.ok && resAss.ok) {
          const dataSekolah = await resSekolah.json();
          const dataAss = await resAss.json();
          
          setAssessments(Array.isArray(dataAss) ? dataAss : []);
          
          // Gabungkan koordinat ke data sekolah
          const mappedSekolah = (Array.isArray(dataSekolah) ? dataSekolah : []).map((s, idx) => ({
            ...s,
            coords: s.latitude && s.longitude ? [parseFloat(s.latitude), parseFloat(s.longitude)] : getDummyCoords(idx)
          }));
          setSekolahs(mappedSekolah);
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil data dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- LOGIC STATISTIK ---
  const totalSekolah = sekolahs.length;
  const totalAssessment = assessments.length;
  
  const statsAss = assessments.reduce((acc, curr) => {
    const status = curr.status_assessment || "Draft";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statsAss).map((key) => ({
    name: key,
    value: statsAss[key]
  }));
  const COLORS = ['#2E5AA7', '#10B981', '#F59E0B', '#EF4444'];

  // Data Assessment per Sekolah untuk Bar Chart (Top 5)
  const assPerSchool = sekolahs.map(s => {
    const assCount = assessments.filter(a => a.sekolah === s.nama_sekolah).length;
    return { name: s.nama_sekolah?.substring(0,10) + "..", total: assCount, full_name: s.nama_sekolah };
  }).sort((a,b) => b.total - a.total).slice(0, 5);

  // Detail Assessment untuk Sekolah yang dipilih di Peta
  const selectedSchoolAssessments = selectedSchool 
    ? assessments.filter(a => a.sekolah === selectedSchool.nama_sekolah)
    : [];

  return (
    <PageWrapper className="h-screen bg-[#EEF5FF] flex overflow-hidden !p-0">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden px-4 md:px-12 pt-6 md:pt-10 pb-0">
        <Card className="flex-1 flex flex-col !m-0 !p-0 rounded-t-[2.5rem] rounded-b-[2.5rem] border-none shadow-2xl bg-white overflow-hidden relative">
          
          {/* HEADER PREMIUM */}
          <div className="px-10 pt-8 pb-6 bg-gradient-to-r from-[#2E5AA7] to-[#164a8a] shrink-0 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <Label text="Center of Excellence" className="!text-[10px] !text-blue-200 !font-black tracking-[0.3em] !mb-2 uppercase" />
                <h1 className="text-3xl font-black tracking-tight leading-none mb-1">
                  Dashboard <span className="text-blue-300">Non-Akademik</span>
                </h1>
                <p className="text-sm font-medium text-blue-100 mt-2 flex items-center gap-2">
                  <Activity size={14} className="text-blue-300" /> Real-time Monitoring & Evaluation
                </p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Active User</p>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 font-black text-sm">
                  {user.nama}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-50">
            
            {/* STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#2E5AA7] flex items-center justify-center shrink-0">
                  <School size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Sekolah</p>
                  <h3 className="text-3xl font-black text-gray-800 leading-none">{totalSekolah}</h3>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                  <ClipboardCheck size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Assessment</p>
                  <h3 className="text-3xl font-black text-gray-800 leading-none">{totalAssessment}</h3>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Assessment Selesai</p>
                  <h3 className="text-3xl font-black text-gray-800 leading-none">{statsAss['Selesai'] || 0}</h3>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <AlertCircle size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Draft / Pending</p>
                  <h3 className="text-3xl font-black text-gray-800 leading-none">{statsAss['Draft'] || 0}</h3>
                </div>
              </div>
            </div>

            {/* MAIN DASHBOARD CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT COL: MAP & CHARTS */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* MAP CONTAINER */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[400px]">
                  <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-white z-10 relative">
                    <div>
                      <h3 className="font-black text-gray-800 text-lg">Peta Persebaran Sekolah</h3>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Klik pin untuk melihat detail assessment</p>
                    </div>
                    <div className="px-3 py-1 bg-blue-50 text-[#2E5AA7] rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={12} /> {totalSekolah} Titik
                    </div>
                  </div>
                  <div className="flex-1 relative z-0">
                    <MapContainer center={[-6.200000, 106.816666]} zoom={5} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://carto.com/">Carto</a>'
                      />
                      {sekolahs.map((sekolah, index) => (
                        <Marker 
                          key={index} 
                          position={sekolah.coords} 
                          icon={schoolIcon}
                          eventHandlers={{
                            click: () => {
                              setSelectedSchool(sekolah);
                            },
                          }}
                        >
                          <Popup className="font-sans">
                            <div className="font-bold text-gray-800 text-sm mb-1">{sekolah.nama_sekolah}</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">{sekolah.npsn || 'NPSN TIDAK TERSEDIA'}</div>
                            <button 
                              onClick={() => setSelectedSchool(sekolah)}
                              className="text-[10px] font-bold bg-[#2E5AA7] text-white px-3 py-1.5 rounded-lg w-full mt-1"
                            >
                              Lihat Assessment
                            </button>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </div>

                {/* CHARTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="font-black text-gray-800 mb-6">Status Assessment</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="font-black text-gray-800 mb-6">Top 5 Sekolah (Volume)</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={assPerSchool} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} width={80} />
                          <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                          <Bar dataKey="total" fill="#2E5AA7" radius={[0, 4, 4, 0]} barSize={16}>
                            {assPerSchool.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#2E5AA7' : '#94a3b8'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COL: SCHOOL DETAILS & ASSESSMENT LIST */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-250px)] lg:h-auto">
                <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-gray-100 shrink-0">
                  <h3 className="font-black text-gray-800 text-lg mb-1">Detail Sekolah</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Assessment yang ditugaskan</p>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
                  {!selectedSchool ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-40 text-center">
                      <MapPin size={48} className="text-[#2E5AA7] mb-4" />
                      <p className="text-sm font-black uppercase tracking-widest text-gray-500">
                        Pilih Sekolah di Peta
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 mt-2 max-w-[200px]">
                        Klik salah satu pin biru di peta untuk melihat daftar assessment sekolah tersebut.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                      
                      {/* SCHOOL INFO CARD */}
                      <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2E5AA7] flex items-center justify-center shrink-0">
                            <School size={20} />
                          </div>
                          <div>
                            <div className="inline-block px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                              NPSN: {selectedSchool.npsn || '-'}
                            </div>
                            <h4 className="font-black text-gray-800 leading-tight">{selectedSchool.nama_sekolah}</h4>
                            <p className="text-[11px] font-bold text-gray-500 mt-1 flex items-center gap-1.5">
                              <MapPin size={12}/> {selectedSchool.wilayah?.nama_wilayah?.split("/").pop() || "Tanpa Wilayah"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* ASSESSMENT LIST */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="font-black text-gray-700 text-sm">Daftar Assessment</h5>
                          <span className="px-2 py-1 bg-blue-100 text-[#2E5AA7] rounded-md text-[10px] font-black">
                            {selectedSchoolAssessments.length} Total
                          </span>
                        </div>

                        {selectedSchoolAssessments.length === 0 ? (
                          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
                            <FileText size={24} className="mx-auto text-gray-300 mb-2" />
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Belum ada assessment</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {selectedSchoolAssessments.map(ass => (
                              <div key={ass.id_assessment} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#2E5AA7]/30 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-[9px] font-black uppercase tracking-widest border border-slate-100">
                                    {ass.kode_assessment || 'NO KODE'}
                                  </span>
                                  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                                    ass.status_assessment === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                  }`}>
                                    {ass.status_assessment || 'Draft'}
                                  </span>
                                </div>
                                <h6 className="font-bold text-gray-800 text-sm leading-snug mb-3 group-hover:text-[#2E5AA7] transition-colors">
                                  {ass.nama_assessment}
                                </h6>
                                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 border-t border-gray-50 pt-3">
                                  <span className="flex items-center gap-1"><Clock size={12}/> {ass.tahun || '-'}</span>
                                  <span className="flex items-center gap-1"><User size={12}/> {ass.pembuat || 'Sistem'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </Card>
      </main>
    </PageWrapper>
  );
}
