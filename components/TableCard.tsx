export default function TableCard({ title, columns, data, actions }: any) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-800 font-semibold">
            <tr>
              {columns.map((col: any, i: number) => (
                <th key={i} className="px-4 py-3 border-b border-gray-200">
                  {col}
                </th>
              ))}
              {actions && <th className="px-4 py-3 border-b border-gray-200 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-6 text-gray-500 italic"
                >
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((row: any, i: number) => (
                <tr
                  key={i}
                  className={`hover:bg-indigo-50 transition duration-150 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {columns.map((col: string, j: number) => (
                    <td key={j} className="px-4 py-2 border-b border-gray-100">
                      {row[col]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-2 text-center border-b border-gray-100">{actions(row)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
