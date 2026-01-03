export function Button({ children, color = "indigo", onClick }: any) {
  const base =
    "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-sm transition transform active:scale-95";
  const colors: any = {
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-600 hover:bg-red-700",
    gray: "bg-gray-500 hover:bg-gray-600",
  };
  return (
    <button onClick={onClick} className={`${base} ${colors[color]}`}>
      {children}
    </button>
  );
}
