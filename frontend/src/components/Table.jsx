/* eslint-disable react/prop-types */
export default function Table({ columns = [], data = [], footer }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden ring-1 ring-black/[0.02]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* HEADER: Premium Solid Blue with Deep Bottom Accent */}
          <thead>
            <tr className="bg-[#1E5AA5]">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/95 whitespace-nowrap border-b-4 border-[#123b70] ${
                    col.align || "text-left"
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY: Clean Rows with Premium Hover State */}
          <tbody className="text-gray-600">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`group border-b border-gray-50 last:border-0 transition-all duration-300 ${
                  rowIndex % 2 === 0 ? "bg-white" : "bg-[#fbfcff]"
                } hover:bg-[#F0F5FF]`}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap ${
                      col.align || "text-left"
                    }`}
                  >
                    <div className="text-[13px] font-semibold text-gray-700 group-hover:text-[#1E5AA5] transition-colors duration-300">
                      {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          {/* FOOTER */}
          {footer && (
            <tfoot className="bg-[#F8FAFF] border-t-2 border-[#1E5AA5]/10">
              {footer}
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
