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

  const handleFeaturedToolClick = () => {
    posthog.capture("featured_tool_clicked", {
      source: "hero_section",
      tool: "Substack",
    });
  };

  return (
    <section className="text-white py-20 px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-6">
            Find, Compare and Choose
            <br />
            the Right AI Tools Superfast
          </h1>
          <p className="text-md mb-8 text-[var(--gray-400)]">
            Discover the right AI tools crafted to boost your startup&apos;s
            productivity. Explore curated solutions designed to streamline
            workflows and accelerate growth. Make smarter decisions faster with
            clarity, not clutter.
          </p>
          <div className="flex gap-4">
            <button className="btn-primary" onClick={scrollToTools}>
              Explore Tools
            </button>
            <Link href="/submit">
              <button className="btn-secondary px-6 py-3">Submit a Tool</button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <Link
            href="/#tools-section"
            onClick={handleFeaturedToolClick}
            className="relative group"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--gray-900)] to-[var(--gray-800)] border border-[var(--gray-700)] hover:border-[var(--gray-600)] transition-all duration-300 shadow-2xl">
              <div className="aspect-video w-full max-w-lg overflow-hidden">
                <img
                  src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8ed3c50c-c989-4b1f-9351-b4dc5b7cb242_1456x816.png"
                  alt="Substack"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Substack</h3>
                  <span className="px-3 py-1 text-xs font-medium bg-purple-600 text-white rounded-full">
                    Featured
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
