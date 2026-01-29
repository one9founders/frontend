"use client";

import Link from "next/link";
import posthog from "posthog-js";

export default function HeroSection() {
  const scrollToTools = () => {
    posthog.capture("explore_tools_clicked", {
      source: "hero_section",
    });

    const toolsSection = document.querySelector("#tools-section");
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="text-white py-20 px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Find, Compare and Choose
          <br />
          the Right AI Tools Superfast
        </h1>
        <p className="text-md mb-8 text-[var(--gray-400)] max-w-2xl mx-auto">
          Discover the right AI tools crafted to boost your startup&apos;s
          productivity. Explore curated solutions designed to streamline
          workflows and accelerate growth. Make smarter decisions faster with
          clarity, not clutter.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="btn-primary" onClick={scrollToTools}>
            Explore Tools
          </button>
          <Link href="/submit">
            <button className="btn-secondary px-6 py-3">Submit a Tool</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
