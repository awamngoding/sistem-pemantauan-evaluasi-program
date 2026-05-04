/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Upload as UploadIcon, X, FileCheck, AlertCircle } from "lucide-react";

const Upload = ({
  label,
  file,
  onFileSelect,
  required = false,
  className = "",
}) => {
  const [error, setError] = useState(null);

  const validateFile = (selectedFile) => {
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf", // Tambahin PDF karena tadi butuh NPWP/KTP PDF kan?
      "video/mp4",
      "video/quicktime",
      "video/x-matroska",
    ];

    // 1. Cek Tipe File
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Format gagal! Gunakan Gambar, PDF, atau Video.");
      if (onFileSelect) onFileSelect(null);
      return false;
    }

    // 2. Cek Ukuran File
    if (selectedFile.size > MAX_SIZE) {
      setError("Ukuran terlalu besar! Maksimal 100MB.");
      if (onFileSelect) onFileSelect(null);
      return false;
    }

    // Jika lolos semua
    setError(null);
    if (onFileSelect) onFileSelect(selectedFile); // Kirim file ke Parent
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateFile(selectedFile);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    if (onFileSelect) onFileSelect(null); // Beritahu parent kalau file dihapus
    setError(null);
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative group">
        <label
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer overflow-hidden
          ${
            file
              ? "border-emerald-500 bg-emerald-50/30"
              : error
                ? "border-red-500 bg-red-50/50 animate-shake"
                : "border-gray-200 bg-gray-50/50 hover:bg-blue-50/50 hover:border-[#1E5AA5]"
          }`}
        >
          <div className="flex flex-col items-center justify-center p-5 text-center">
            {file ? (
              <div className="flex flex-col items-center animate-in zoom-in duration-300">
                <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200 mb-3">
                  <FileCheck size={20} />
                </div>
                <p className="text-[9px] font-black uppercase text-emerald-600 tracking-tighter truncate max-w-[150px]">
                  {file.name}
                </p>
                <p className="text-[8px] text-emerald-400 mt-1 font-bold">
                  READY TO UPLOAD
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center animate-in fade-in duration-300">
                <div className="p-3 rounded-2xl bg-red-500 text-white shadow-lg mb-3">
                  <AlertCircle size={20} />
                </div>
                <p className="text-[9px] font-black uppercase text-red-600 tracking-tighter">
                  {error}
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-2xl bg-white text-gray-300 shadow-sm mb-3 group-hover:text-[#1E5AA5] group-hover:shadow-md transition-all">
                  <UploadIcon size={20} />
                </div>
                <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest group-hover:text-[#1E5AA5]">
                  Pilih Dokumen
                </p>
                <p className="text-[7px] text-gray-300 mt-1 font-bold italic uppercase tracking-tighter">
                  Maks. 100MB (PDF/JPG)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,image/*,video/*"
          />
        </label>

        {file && (
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-all z-20"
          >
            <X size={12} strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Upload;
