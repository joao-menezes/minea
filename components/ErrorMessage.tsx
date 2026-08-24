type ErrorMessageProps = {
  error?: string;
};

export function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) {
    return null;
  }

  return (
    <div className="minea-error mt-4 flex items-start gap-3 rounded-2xl border border-[#f1d9d4] bg-[#fbefed] px-4 py-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d98f82] text-[10px] text-white">
        !
      </div>

      <p className="text-xs leading-relaxed text-[#9b5d53]">{error}</p>
    </div>
  );
}
