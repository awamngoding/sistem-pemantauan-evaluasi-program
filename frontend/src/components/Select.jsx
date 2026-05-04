/* eslint-disable react/prop-types */
import React from "react";
import { ChevronDown } from "lucide-react";

const Select = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  required,
  className = "",
}) => {
  return (
    <div className={`relative group min-w-[160px] ${className}`}>
      {/* Icon Utama di Sisi Kiri (Opsional) */}
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1E5AA5] transition-colors duration-200 pointer-events-none">
        {Icon && <Icon size={16} strokeWidth={2} />}
      </div>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full 
          ${Icon ? "pl-10" : "pl-4"} pr-10 py-2.5 
          bg-white hover:bg-gray-50/50
          border border-gray-200
          rounded-xl 
          font-medium 
          text-[13px] 
          text-gray-700 
          outline-none 
          cursor-pointer
          transition-all duration-200
          appearance-none
          shadow-sm shadow-gray-200/50
          focus:bg-white 
          focus:border-[#1E5AA5]
          focus:ring-[3px] 
          focus:ring-[#1E5AA5]/10
        `}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.id} value={opt.id} className="text-gray-700 font-medium">
            {opt.label}
          </option>
        ))}
      </select>

      {/* Chevron Icon Sisi Kanan */}
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#1E5AA5] group-focus-within:text-[#1E5AA5] transition-colors duration-200">
        <ChevronDown size={16} strokeWidth={2} className="group-focus-within:rotate-180 transition-transform duration-300" />
      </div>
    </div>
  );
};

export default Select;
