/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";

export default function Search({
  placeholder = "Cari data...",
  className = "",

  // 🔹 MODE SIMPLE
  data,
  keys = [],
  onResult,

  // 🔹 MODE ADVANCED (override logic)
  onSearch,

  // 🔹 MODE CONTROLLED (opsional)
  value,
  onChange,
}) {
  const [internalQuery, setInternalQuery] = useState("");

  const isControlled = value !== undefined;
  const query = isControlled ? value : internalQuery;

  const handleChange = (e) => {
    const val = e.target.value;

    if (isControlled) {
      onChange && onChange(e);
    } else {
      setInternalQuery(val);
    }

    // 🔥 PRIORITAS 1: custom search
    if (onSearch) {
      onSearch(val);
      return;
    }

    // 🔥 PRIORITAS 2: auto filter bawaan
    if (data && onResult && keys.length > 0) {
      const filtered = data.filter((item) =>
        keys.some((key) =>
          String(item[key]).toLowerCase().includes(val.toLowerCase()),
        ),
      );

      onResult(filtered);
    }
  };

  // reset hasil kalau query kosong
  useEffect(() => {
    if (!query && data && onResult) {
      onResult(data);
    }
  }, [query, data, onResult]);

  return (
    <div className={`relative group w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        <SearchIcon
          size={18}
          className="text-gray-400 group-focus-within:text-[#1E5AA5] transition-colors duration-300"
        />
      </div>

      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="
          w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl
          text-sm text-gray-700 placeholder-gray-400
          shadow-[0_2px_10px_rgba(0,0,0,0.04)]
          hover:shadow-[0_4px_15px_rgba(30,90,165,0.08)]
          focus:outline-none focus:border-[#1E5AA5]
          focus:ring-4 focus:ring-[#1E5AA5]/15
          transition-all duration-300
        "
      />
    </div>
  );
}
