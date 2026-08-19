export function ServiceDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#eee4df] bg-[#faf6f3] p-3.5">
      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#bda095]">{label}</p>

      <p className="mt-1.5 truncate text-[11px] font-semibold text-[#80685e]">{value}</p>
    </div>
  );
}
