import Image from "next/image";

export default function PartnersSection() {
  return (
    <section className="py-10 md:py-14 px-4 md:px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-lg md:text-xl font-semibold text-[var(--gray-400)] mb-8">
          Backed by
        </h2>

        <div className="flex justify-center items-center gap-8">
          <div className="flex items-center gap-3 bg-[var(--gray-900)] border border-[var(--gray-800)] rounded-xl px-6 py-4">
            <Image
              src="/iitb-logo.png"
              alt="IIT Bombay"
              width={40}
              height={40}
              className="rounded-sm"
            />
            <span className="text-sm md:text-base text-[var(--gray-300)] font-medium">
              Supported by IIT Bombay
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
