export default function PartnersSection() {
  return (
    <section className="py-10 md:py-14 px-4 md:px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-lg md:text-xl font-bold text-white mb-8">Backed by</h2>

        <div className="flex justify-center items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[var(--gray-900)] border border-[var(--gray-800)]">
            <img src="/iitb-logo.png" alt="IIT Bombay" className="h-8" draggable={false} />
            <span className="text-sm text-[var(--gray-300)] font-medium">
              Supported by <span className="font-bold text-white">IIT Bombay</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
