export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -right-32 -top-40 h-96 w-96 rounded-full bg-[#f0e0d7]/45 blur-3xl" />

      <div className="absolute -left-40 top-[42%] h-96 w-96 rounded-full bg-[#f4ede6]/60 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#e9d9d0]/25 blur-3xl" />
    </div>
  );
}
