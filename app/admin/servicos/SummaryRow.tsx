export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#f0e5e0] pb-3 last:border-0 last:pb-0">
      <span className="text-[9px] text-[#ad9489]">{label}</span>

      <span className="text-[10px] font-bold text-[#765e55]">{value}</span>
    </div>
  );
}
