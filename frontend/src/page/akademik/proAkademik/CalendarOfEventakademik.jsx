/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import Card from "../../../components/Card";
import {
  Calendar as CalendarIcon,
  FileText,
  LayoutDashboard,
  Clock,
} from "lucide-react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarOfEventakademik() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data program dari backend
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:3000/program?kategori=AKADEMIK",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Gagal mengambil data program");

        const data = await res.json();
        
        // Memetakan data dari backend ke format FullCalendar
        const mappedEvents = data.map((item, index) => {
          // Jika backend belum memiliki tgl spesifik, kita sebar di bulan ini sebagai fallback sementara
          // Agar program yang "belum dijalankan" tetap terbaca di kalender
          const today = new Date();
          const fallbackDay = (today.getDate() + (index % 5)).toString().padStart(2, "0");
          const fallbackMonth = (today.getMonth() + 1).toString().padStart(2, "0");
          const fallbackDate = `${today.getFullYear()}-${fallbackMonth}-${fallbackDay}`;

          return {
            id: item.id_program,
            title: item.nama_program || "Program Tanpa Nama",
            // Gunakan tgl_pelaksanaan dari backend jika ada, jika tidak gunakan fallback
            start: item.tgl_pelaksanaan || fallbackDate,
            backgroundColor: item.status_program === "Aktif" ? "#eff6ff" : "#fffbeb",
            borderColor: item.status_program === "Aktif" ? "#3b82f6" : "#f59e0b",
            textColor: item.status_program === "Aktif" ? "#1d4ed8" : "#b45309",
            extendedProps: { 
              category: item.kode_program || "Akademik", 
              time: "08:00 WIB",
              status: item.status_program || "Draft",
              sekolah: item.sekolah || "-"
            },
          };
        });

        setEvents(mappedEvents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <>
      <style>{`
        /* FullCalendar Customization (SaaS Clean Style) */
        .fc { height: 100% !important; border: none !important; font-family: 'Plus Jakarta Sans', sans-serif !important; }
        .fc-theme-standard th { border-color: #f1f5f9 !important; padding: 14px 0 !important; background: #f8fafc !important; color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; border-bottom: 2px solid #e2e8f0 !important; }
        .fc-theme-standard td { border-color: #f1f5f9 !important; }
        .fc-daygrid-day { transition: background-color 0.2s ease; }
        .fc-daygrid-day:hover { background-color: #f8fafc !important; }
        .fc-day-today { background-color: #eff6ff !important; }
        .fc-daygrid-day-number { color: #334155 !important; font-weight: 700 !important; font-size: 13px !important; padding: 8px 12px !important; margin: 4px; border-radius: 8px; transition: all 0.2s; }
        .fc-daygrid-day-number:hover { color: white !important; background: #1E5AA5 !important; }
        .fc-toolbar-title { font-weight: 900 !important; color: #0f172a !important; font-size: 1.4rem !important; letter-spacing: -0.03em !important; text-transform: uppercase; }
        .fc-button-primary { background: white !important; color: #475569 !important; border: 1px solid #e2e8f0 !important; font-weight: 700 !important; border-radius: 10px !important; text-transform: capitalize !important; font-size: 13px !important; padding: 8px 16px !important; box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important; transition: all 0.2s ease !important; }
        .fc-button-primary:hover { background: #f8fafc !important; border-color: #cbd5e1 !important; color: #1E5AA5 !important; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(0,0,0,0.04) !important; }
        .fc-button-active { background: #1E5AA5 !important; color: white !important; border-color: #1E5AA5 !important; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1) !important; }
        
        /* Event Indikator (Lebih Mencolok) */
        .fc-event { border-radius: 6px !important; border: none !important; border-left: 4px solid #facc15 !important; padding: 6px 8px !important; font-size: 11px !important; font-weight: 800 !important; background: #1E5AA5 !important; color: white !important; margin: 4px 6px !important; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(30, 90, 165, 0.2) !important; }
        .fc-event-main { color: white !important; }
        .fc-event:hover { transform: translateY(-2px) !important; background: #154483 !important; border-left-color: #fbbf24 !important; box-shadow: 0 6px 12px rgba(30, 90, 165, 0.3) !important; z-index: 10 !important; }
      `}</style>
      <div className="flex h-screen bg-[#EEF5FF] overflow-hidden font-sans">
        <Sidebar />
        <main className="flex-1 flex flex-col p-4 lg:p-6 h-full overflow-hidden">
          <header className="flex-none flex items-center justify-between bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#1E5AA5] to-[#113a6e] text-white rounded-2xl flex items-center justify-center shadow-[0_8px_16px_rgba(30,90,165,0.3)]">
                <CalendarIcon size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-800 tracking-tight leading-none uppercase mb-1">
                  Academic <span className="text-[#1E5AA5]">Schedule</span>
                </h1>
                <p className="text-[13px] text-gray-500 font-semibold tracking-wide flex items-center gap-2">
                  <span>Kalender Operasional</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-[#1E5AA5]">YPA-MDR</span>
                </p>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full pb-4">
              <div className="xl:col-span-8">
                <Card className="!p-6 !rounded-[2rem] bg-white border border-gray-100 shadow-sm h-full relative z-0">
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{ left: "title", right: "prev,next today" }}
                    events={events}
                    height="auto"
                  />
                </Card>
              </div>
              <div className="xl:col-span-4 flex flex-col gap-6">
                <Card className="!p-6 !rounded-[2rem] bg-white border border-gray-100 shadow-sm flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <h3 className="font-black text-gray-800 text-[15px] uppercase flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                        <FileText size={16} strokeWidth={2.5} />
                      </div>
                      Agenda Akademik
                    </h3>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold">
                      {events.length} Program
                    </span>
                  </div>
                  
                  <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
                    {loading ? (
                      <div className="text-center py-10 text-gray-400 font-bold text-sm">
                        Memuat data program...
                      </div>
                    ) : events.length === 0 ? (
                      <div className="text-center py-10 text-gray-400 font-bold text-sm">
                        Belum ada program terbuat.
                      </div>
                    ) : (
                      events.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                        >
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${ev.extendedProps.status === 'Aktif' ? 'bg-[#1E5AA5]' : 'bg-amber-400'}`}></div>
                          
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                              {ev.extendedProps.category}
                            </span>
                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${ev.extendedProps.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {ev.extendedProps.status}
                            </span>
                          </div>
                          
                          <p className="font-bold text-gray-800 text-[13px] leading-snug mb-3">
                            {ev.title}
                          </p>
                          
                          <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 border-t border-gray-50 pt-3">
                            <span className="flex items-center gap-1.5">
                              <Clock size={12} className="text-[#1E5AA5]" /> {ev.start}
                            </span>
                            <span className="truncate max-w-[100px] text-right">
                              {ev.extendedProps.sekolah}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

