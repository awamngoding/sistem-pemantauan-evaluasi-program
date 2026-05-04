/* eslint-disable react/prop-types */
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  loading,
}) => {
  const from = (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0 && !loading) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-auto pt-6 px-2 shrink-0 gap-4 bg-transparent">
      {/* INFO DATA: Gaya Minimalis */}
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 bg-[#1E5AA5] rounded-full opacity-20 hidden md:block"></div>
        <div className="flex flex-col -space-y-1">
          <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">
            Record Tracking
          </span>
          <span className="text-[11px] font-bold text-gray-400">
            {from}—{to} <span className="text-gray-200 mx-1">of</span>{" "}
            {totalItems}
          </span>
        </div>
      </div>

      {/* NAVIGATION: Full Transparent & Glassy feel */}
      <div className="flex items-center gap-1">
        {/* Tombol Previous */}
        <button
          type="button"
          disabled={currentPage === 1 || loading}
          onClick={() => onPageChange(currentPage - 1)}
          className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 ${
            currentPage === 1
              ? "text-gray-100 cursor-not-allowed"
              : "text-gray-400 hover:text-[#1E5AA5] hover:bg-blue-50 active:scale-90"
          }`}
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        {/* Page Info: Tanpa Border, cuma Spacing */}
        <div className="px-4 flex items-baseline gap-1.5">
          <span className="text-sm font-black text-[#1E5AA5]">
            {currentPage}
          </span>
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            of {totalPages || 1}
          </span>
        </div>

        {/* Tombol Next */}
        <button
          type="button"
          disabled={currentPage >= totalPages || totalPages === 0 || loading}
          onClick={() => onPageChange(currentPage + 1)}
          className={`flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 ${
            currentPage >= totalPages || totalPages === 0
              ? "text-gray-100 cursor-not-allowed"
              : "text-gray-400 hover:text-[#1E5AA5] hover:bg-blue-50 active:scale-90"
          }`}
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
