export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
      <div className="w-10 h-10 border-3 border-[#B99A61]/30 border-t-[#B99A61] rounded-full animate-spin" />
      <p className="mt-4 font-serif text-sm tracking-widest text-[#641E2B] uppercase font-medium animate-pulse">
        Kavish Atelier
      </p>
    </div>
  );
}
