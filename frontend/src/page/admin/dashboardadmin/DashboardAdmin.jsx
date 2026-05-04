/* eslint-disable no-unused-vars */
import React from "react";
import Sidebar from "../../../components/Sidebar";
import Card from "../../../components/Card";
import InformationCard from "../../../components/InformationCard";
import Button from "../../../components/Button";
import Table from "../../../components/Table";

// Icons
import {
  Calendar as CalendarIcon,
  Clock,
  LayoutDashboard,
  AlertCircle,
  Briefcase,
  CheckCircle2,
  FileText,
  Plus,
  Zap,
} from "lucide-react";

// FullCalendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function DashboardAdmin() {
  const events = [
    {
      id: "1",
      title: "Kunjungan Cabang Bogor",
      start: "2026-04-12",
      extendedProps: { category: "Visit", time: "09:00", status: "Upcoming" },
    },
    {
      id: "2",
      title: "Audit Internal SMK 1",
      start: "2026-04-15",
      extendedProps: { category: "Audit", time: "13:00", status: "Pending" },
    },
  ];

  // --- CONFIG UNTUK TABLE.JSX ---
  const tableHeaders = ["AGENDA", "KATEGORI", "WAKTU", "STATUS"];
  const tableData = events.map((ev) => ({
    agenda: (
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-gray-800 text-[13px]">{ev.title}</span>
        <span className="text-[11px] text-gray-500 font-medium">
          Center of Excellence
        </span>
      </div>
    ),
    category: (
      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-[#1E5AA5] border border-blue-100">
        {ev.extendedProps.category}
      </span>
    ),
    time: (
      <div className="flex items-center gap-2 text-gray-600 font-semibold text-[12px]">
        <Clock size={14} className="text-gray-400" />
        {ev.extendedProps.time} WIB
      </div>
    ),
    status: (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full shadow-sm ${ev.extendedProps.status === "Upcoming" ? "bg-emerald-500 shadow-emerald-500/50" : "bg-amber-500 shadow-amber-500/50"}`}
        />
        <span
          className={`font-bold text-[11px] ${ev.extendedProps.status === "Upcoming" ? "text-emerald-600" : "text-amber-600"}`}
        >
          {ev.extendedProps.status}
        </span>
      </div>
    ),
  }));

  const stats = [
    {
      title: "24",
      sub: "Total Agenda",
      icon: <CalendarIcon size={24} strokeWidth={2.5} />,
      color: "text-[#1E5AA5]",
      iconBg: "bg-blue-50 border border-blue-100",
      glowColor: "bg-blue-500",
    },
    {
      title: "08",
      sub: "Visit Cabang",
      icon: <Briefcase size={24} strokeWidth={2.5} />,
      color: "text-indigo-600",
      iconBg: "bg-indigo-50 border border-indigo-100",
      glowColor: "bg-indigo-500",
    },
    {
      title: "03",
      sub: "Urgent Task",
      icon: <AlertCircle size={24} strokeWidth={2.5} />,
      color: "text-rose-600",
      iconBg: "bg-rose-50 border border-rose-100",
      glowColor: "bg-rose-500",
    },
    {
      title: "12",
      sub: "Completed",
      icon: <CheckCircle2 size={24} strokeWidth={2.5} />,
      color: "text-emerald-600",
      iconBg: "bg-emerald-50 border border-emerald-100",
      glowColor: "bg-emerald-500",
    },
  ];

  return (
    <>
      <style>{`
        /* 1. Reset & Global locked view */
        html, body, #root { height: 100vh; overflow: hidden; background-color: #F4F7FB; font-family: 'Plus Jakarta Sans', sans-serif; }
        
        /* 2. FIX TABLE: Override style agar rapi dalam container (Premium Clean) */
        .fix-table-style table { width: 100% !important; border-collapse: separate !important; border-spacing: 0 !important; }
        
        /* Header Minimalis */
        .fix-table-style thead tr { background-color: #f8fafc !important; }
        .fix-table-style thead th { 
          color: #64748b !important; 
          font-size: 11px !important; 
          font-weight: 700 !important; 
          text-transform: uppercase !important; 
          letter-spacing: 0.05em !important; 
          padding: 14px 20px !important; 
          text-align: left !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }

        /* Rounded Corners untuk Header */
        .fix-table-style thead th:first-child { border-top-left-radius: 12px !important; border-left: 1px solid #e2e8f0 !important; border-top: 1px solid #e2e8f0 !important; }
        .fix-table-style thead th:last-child { border-top-right-radius: 12px !important; border-right: 1px solid #e2e8f0 !important; border-top: 1px solid #e2e8f0 !important;}
        .fix-table-style thead th:not(:first-child):not(:last-child) { border-top: 1px solid #e2e8f0 !important; }

        /* Body Cells Styling */
        .fix-table-style tbody td { 
          padding: 14px 20px !important; 
          border-bottom: 1px solid #f1f5f9 !important; 
          background-color: white !important;
          vertical-align: middle !important;
        }
        .fix-table-style tbody tr:hover td { background-color: #f8fafc !important; cursor: pointer; }
        .fix-table-style tbody tr:last-child td:first-child { border-bottom-left-radius: 12px !important; border-left: 1px solid #e2e8f0 !important; border-bottom: 1px solid #e2e8f0 !important; }
        .fix-table-style tbody tr:last-child td:last-child { border-bottom-right-radius: 12px !important; border-right: 1px solid #e2e8f0 !important; border-bottom: 1px solid #e2e8f0 !important;}
        .fix-table-style tbody tr:not(:last-child) td:first-child { border-left: 1px solid #e2e8f0 !important; }
        .fix-table-style tbody tr:not(:last-child) td:last-child { border-right: 1px solid #e2e8f0 !important; }

        /* 3. FullCalendar Customization (SaaS Clean Style) */
        .fc { height: 100% !important; border: none !important; font-family: 'Plus Jakarta Sans', sans-serif !important; }
        
        /* Kalender Header */
        .fc-theme-standard th { border-color: #f1f5f9 !important; padding: 14px 0 !important; background: #f8fafc !important; color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; border-bottom: 2px solid #e2e8f0 !important; }
        
        /* Grid Garis Kalender */
        .fc-theme-standard td { border-color: #f1f5f9 !important; }
        .fc-daygrid-day { transition: background-color 0.2s ease; }
        .fc-daygrid-day:hover { background-color: #f8fafc !important; }
        .fc-day-today { background-color: #eff6ff !important; }
        
        /* Nomer Tanggal */
        .fc-daygrid-day-number { color: #334155 !important; font-weight: 700 !important; font-size: 13px !important; padding: 8px 12px !important; margin: 4px; border-radius: 8px; transition: all 0.2s; }
        .fc-daygrid-day-number:hover { color: white !important; background: #1E5AA5 !important; }
        
        .fc-col-header-cell-cushion { padding: 8px !important; }
        
        /* Judul Bulan */
        .fc-toolbar-title { font-weight: 900 !important; color: #0f172a !important; font-size: 1.4rem !important; letter-spacing: -0.03em !important; text-transform: uppercase; }
        
        /* Tombol Navigasi */
        .fc-button-primary { background: white !important; color: #475569 !important; border: 1px solid #e2e8f0 !important; font-weight: 700 !important; border-radius: 10px !important; text-transform: capitalize !important; font-size: 13px !important; padding: 8px 16px !important; box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important; transition: all 0.2s ease !important; }
        .fc-button-primary:hover { background: #f8fafc !important; border-color: #cbd5e1 !important; color: #1E5AA5 !important; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(0,0,0,0.04) !important; }
        .fc-button-active { background: #1E5AA5 !important; color: white !important; border-color: #1E5AA5 !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1) !important; }
        
        /* Event Indikator (Lebih Mencolok) */
        .fc-event { border-radius: 6px !important; border: none !important; border-left: 4px solid #facc15 !important; padding: 6px 8px !important; font-size: 11px !important; font-weight: 800 !important; background: #1E5AA5 !important; color: white !important; margin: 4px 6px !important; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(30, 90, 165, 0.2) !important; }
        .fc-event-main { color: white !important; }
        .fc-event:hover { transform: translateY(-2px) !important; background: #154483 !important; border-left-color: #fbbf24 !important; box-shadow: 0 6px 12px rgba(30, 90, 165, 0.3) !important; z-index: 10 !important; }

        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      <div className="flex h-screen w-full bg-[#F4F7FB] overflow-hidden">
        <Sidebar />

        <main className="flex-1 flex flex-col h-screen overflow-hidden p-6 gap-6 relative">
          {/* HEADER DASHBOARD - PREMIUM COE */}
          <header className="flex-none flex items-center justify-between bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-[#1E5AA5]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gradient-to-tr from-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-6 relative z-10">
              {/* Premium Icon Container */}
              <div className="relative group">
                <div className="absolute inset-0 bg-[#1E5AA5] blur-xl opacity-30 rounded-2xl group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#1E5AA5] via-[#1a4b8c] to-[#0f2d57] text-white rounded-[1.25rem] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_20px_rgba(30,90,165,0.4)] relative border border-white/10 ring-4 ring-white z-10 transform transition-transform duration-300 group-hover:scale-105">
                  <LayoutDashboard size={26} strokeWidth={2} />
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3.5 mb-1.5">
                  <h1 className="text-[28px] font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-[#1E5AA5]">
                    Center of Excellence
                  </h1>
                  <div className="px-2.5 py-1 bg-[#1E5AA5]/10 text-[#1E5AA5] text-[10px] font-bold uppercase tracking-widest rounded-lg border border-[#1E5AA5]/20 shadow-sm">
                    Admin Panel
                  </div>
                </div>
                <p className="text-[13px] text-slate-500 font-semibold tracking-wide flex items-center gap-2.5">
                  <span>Monitoring & Evaluasi Operasional</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span className="text-[#1E5AA5] font-bold">YPA-MDR Platform</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shadow-sm relative z-10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[11px] font-bold uppercase tracking-widest leading-none">
                System Active
              </span>
            </div>
          </header>

          {/* STATS SECTION - CUSTOM PREMIUM CARDS */}
          <div className="flex-none grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center gap-5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group cursor-pointer"
              >
                {/* Dekorasi Hover Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full blur-2xl ${item.glowColor} pointer-events-none`} />
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm relative z-10 transition-transform duration-300 group-hover:scale-110 ${item.iconBg} ${item.color}`}>
                  {item.icon}
                </div>
                <div className="relative z-10">
                  <p className="text-[12px] font-semibold text-gray-500 mb-1 tracking-wide">
                    {item.sub}
                  </p>
                  <h3 className="text-2xl font-black text-gray-800 tracking-tight leading-none">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM CONTENT AREA */}
          <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* LEFT: CALENDAR CARD */}
            <Card className="xl:col-span-6 flex flex-col h-full !rounded-[1.5rem] !p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden bg-white">
              <div className="flex-1 min-h-0">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{ left: "title", right: "prev,next today" }}
                  events={events}
                  height="100%"
                />
              </div>
            </Card>

            {/* RIGHT: TABLE CARD */}
            <Card className="xl:col-span-6 flex flex-col h-full !rounded-[1.5rem] !p-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden bg-white relative">
              <div className="flex items-center justify-between p-6 pb-5 flex-none border-b border-gray-50 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#1E5AA5] border border-blue-100 shadow-sm">
                    <FileText size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-[15px] tracking-tight">
                      Agenda Terdekat
                    </h3>
                    <p className="text-[12px] text-gray-500 font-medium mt-0.5">Jadwal monitoring operasional</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E5AA5] hover:bg-[#154483] text-white text-[12px] font-bold transition-all shadow-[0_4px_12px_rgba(30,90,165,0.25)] hover:shadow-[0_6px_16px_rgba(30,90,165,0.3)] hover:-translate-y-0.5 active:scale-95">
                  <Plus size={16} strokeWidth={3} />
                  <span>Tambah</span>
                </button>
              </div>

              {/* TABLE AREA - Menggunakan Class fix-table-style */}
              <div className="flex-1 overflow-auto custom-scrollbar p-6 fix-table-style relative z-10 bg-white">
                <Table headers={tableHeaders} data={tableData} />
              </div>

              <div className="p-4 flex-none text-center border-t border-gray-50 bg-gray-50/50 relative z-10">
                <p className="text-[10px] text-gray-400 font-bold tracking-[0.3em] uppercase">
                  YPA-MDR Platform • v1.0
                </p>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
