/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  ArrowLeft,
  LogOut,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  ChevronDown,
  Database,
  Clock,
  Menu as MenuIcon,
  X,
  User,
  ShieldCheck, // Ganti Shield biasa
  Users, // Untuk Data AO agar beda dengan HO
  MapPin,
  School, // Untuk Data Sekolah
  Truck, // Untuk Data Vendor
  Settings,
  CalendarDays,
  Activity, // Tambahan ikon estetik
} from "lucide-react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import logo_ypamdr from "../assets/img/logo_ypamdr.png";

export default function Sidebar() {
  const [time, setTime] = useState({ hour: "", minute: "", second: "" });
  const [date, setDate] = useState("");
  const [user, setUser] = useState({ nama: "", role: "", jenis: null });
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // --- LOGIC TIME ---
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime({
        hour: now.getHours().toString().padStart(2, "0"),
        minute: now.getMinutes().toString().padStart(2, "0"),
        second: now.getSeconds().toString().padStart(2, "0"),
      });
      setDate(
        now.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // --- LOGIC AUTH ---
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
  }, [location.pathname, navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const roleUser = (user.role?.trim() || "").toLowerCase();
  const isAdmin = roleUser === "admin";
  const isHO = roleUser === "ho";
  const jenisRaw = (user.jenis?.trim() || "").toLowerCase();
  const isNonAkademik = jenisRaw.includes("non");
  const isAkademik = !isNonAkademik && jenisRaw.includes("akademik");

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  // --- NAV ITEMS ---
  const navItems = [
    ...(isAdmin
      ? [
          {
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
            path: "/admin/dashboard",
            exact: true,
          },
        ]
      : []),

    ...(isHO
      ? [
          {
            icon: <LayoutDashboard size={20} />,
            label: "Dashboard",
            path: isAkademik
              ? "/ho/dashboard/akademik"
              : "/ho/dashboard/non-akademik",
            exact: true,
          },
          {
            icon: <ClipboardCheck size={20} />,
            label: "Assessment",
            path: isAkademik
              ? "/ho/assessment/akademik"
              : "/ho/assessment/non-akademik",
          },
          {
            icon: <FolderKanban size={20} />,
            label: "Program Kegiatan",
            path: isAkademik
              ? "/ho/program/akademik"
              : "/ho/program/non-akademik",
          },
          {
            icon: <CalendarDays size={20} />,
            label: "List Schedule",
            path: isAkademik
              ? "/ho/penjadwalan/akademik"
              : "/ho/penjadwalan/non-akademik",
          },
        ]
      : []),

    ...(!isHO && !isAdmin
      ? [
          {
            icon: <ClipboardCheck size={20} />,
            label: "Assessment",
            path: "/sekolah/dashboard",
          },
          {
            icon: <FolderKanban size={20} />,
            label: "Program Kegiatan",
            path: "/sekolah/program",
          },
        ]
      : []),
  ];

  // --- MASTER DATA ITEMS (Sudah Unik) ---
  const masterItems = [
    {
      label: "Data Pengurus",
      path: "/admin/pengurus",
      icon: <User size={18} />,
    },
    { label: "Data HO", path: "/admin/ho", icon: <ShieldCheck size={18} /> },
    { label: "Data AO", path: "/admin/ao", icon: <Users size={18} /> },
    {
      label: "Data Wilayah",
      path: "/admin/wilayah",
      icon: <MapPin size={18} />,
    },
    {
      label: "Data Sekolah",
      path: "/admin/sekolah",
      icon: <School size={18} />,
    },
    { label: "Data Vendor", path: "/admin/vendor", icon: <Truck size={18} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full font-sans text-white bg-[#1E5AA5]">
      <div className="flex items-center justify-between px-6 pt-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg bg-black/10 hover:bg-black/20 text-white transition-colors"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>
          <div className="flex-1 flex justify-center mr-8">
            <img
              src={logo_ypamdr}
              alt="Logo"
              className="h-6 w-auto brightness-0 invert opacity-95"
            />
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 mb-8">
        <div className="p-3.5 rounded-[1.25rem] bg-black/10 border border-white/5 flex items-center gap-4 hover:bg-black/20 transition-colors">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full border-[2px] border-white/20 bg-white/10 p-[2px]">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-[#1E5AA5] text-lg uppercase">
                {user.nama?.charAt(0)}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-[2.5px] border-[#1E5AA5] rounded-full" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-bold text-white truncate tracking-tight">
              {user.nama || "Memuat..."}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-[#1E5AA5] bg-white px-2 py-0.5 rounded shadow-sm uppercase tracking-[0.1em]">
                {user.role}
              </span>
              {user.jenis && (
                <span className="text-[11px] text-white/70 truncate font-medium">
                  • {user.jenis}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 custom-scrollbar pb-4">
        <div className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase ml-3 mb-3">
          Menu Utama
        </div>
        {navItems.map((item) => {
          const active = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center rounded-xl px-4 py-3.5 transition-all duration-200 ${active ? "bg-white text-[#1E5AA5] shadow-sm" : "hover:bg-black/10 text-white/80 hover:text-white"}`}
            >
              <span
                className={`transition-colors duration-200 ${active ? "text-[#1E5AA5]" : "text-white/60"}`}
              >
                {item.icon}
              </span>
              <span
                className={`ml-3.5 text-[14px] tracking-wide ${active ? "font-bold" : "font-semibold"}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {isAdmin && (
          <div className="pt-4 mt-2">
            <div className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase ml-3 mb-2">
              Administrasi
            </div>
            <button
              onClick={() => setIsMasterOpen(!isMasterOpen)}
              className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 transition-colors ${isMasterOpen ? "bg-black/10 text-white" : "hover:bg-black/10 text-white/80 hover:text-white"}`}
            >
              <div className="flex items-center gap-3.5">
                <Database
                  size={20}
                  className={isMasterOpen ? "text-white/90" : "text-white/60"}
                />
                <span className="text-[14px] font-semibold tracking-wide">
                  Master Data
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${isMasterOpen ? "rotate-180 text-white" : "text-white/50"}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isMasterOpen ? "max-h-[400px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}
            >
              <div className="mx-3 pl-3 py-2 space-y-1 border-l-2 border-white/20">
                {masterItems.map((item) => {
                  const active = location.pathname.startsWith(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? "bg-white text-[#1E5AA5] font-bold shadow-sm" : "text-white/70 hover:text-white hover:bg-black/10 font-medium"}`}
                    >
                      <span
                        className={active ? "text-[#1E5AA5]" : "text-white/60"}
                      >
                        {item.icon}
                      </span>
                      <span className="text-[13px] tracking-wide">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="p-5 border-t border-white/10 bg-black/10">
        <div className="rounded-2xl p-4 bg-white/5 border border-white/10 mb-5 transition-colors hover:bg-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity size={13} strokeWidth={2.5} className="text-white/50" />
              <span className="text-white/50 uppercase tracking-[0.15em] text-[10px] font-bold">
                Local Time
              </span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="flex items-end gap-1.5 font-sans mt-2">
            <span className="text-[28px] leading-none font-bold text-white tabular-nums tracking-tight">
              {time.hour || "00"}:{time.minute || "00"}
            </span>
            <span className="text-[13px] font-medium text-white/40 mb-1 tabular-nums">
              {time.second || "00"}
            </span>
          </div>
          <p className="text-[11px] font-medium text-white/50 mt-2 tracking-wide">
            {date}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsSettingOpen(true)}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-black/10 text-white hover:bg-black/20 border border-white/5 transition-colors"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl font-bold text-[13px] uppercase tracking-wider bg-[#E23E57] hover:bg-[#c82333] text-white border border-transparent transition-colors shadow-sm"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>
      <div className="lg:hidden fixed top-0 left-0 w-full bg-[#1E5AA5] px-6 py-4 flex justify-between items-center z-[100] border-b border-white/10 shadow-sm">
        <img
          src={logo_ypamdr}
          alt="Logo"
          className="h-6 w-auto brightness-0 invert opacity-95"
        />
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 bg-black/10 hover:bg-black/20 transition-colors rounded-lg text-white"
        >
          <MenuIcon size={24} />
        </button>
      </div>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full z-[95] w-72 lg:hidden transition-transform duration-300 ease-in-out shadow-2xl ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-lg text-white/80 hover:text-white transition-colors z-50"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
        <SidebarContent />
      </div>
      <aside className="hidden lg:flex flex-col h-screen w-[280px] flex-shrink-0 z-10 shadow-[8px_0_24px_rgba(0,0,0,0.1)] relative">
        <SidebarContent />
      </aside>
    </>
  );
}
