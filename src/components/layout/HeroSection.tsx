"use client";

import posthog from "posthog-js";

export default function HeroSection() {
  const scrollToTools = () => {
    // Capture explore tools click event
    posthog.capture("explore_tools_clicked", {
      source: "hero_section",
    });

    const toolsSection = document.querySelector("#tools-section");
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="text-white py-20 px-6"
      style={{ backgroundColor: "var(--gray-black)" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-6">
            Find, Compare and Choose 
            <br />
            the Right AI Tools Superfast
          </h1>
          <p className="text-md mb-8" style={{color: "var(--gray-400"}}>
            Discover the right AI tools crafted to boost your startup's
            productivity. Explore curated solutions designed to streamline
            workflows and accelerate growth. Make smarter decisions faster with
            clarity, not clutter.
          </p>
          <button className="btn-primary" onClick={scrollToTools}>
            Explore Tools
          </button>
        </div>
        <div className="flex justify-center">
          <img src="https://4cqs2zpl07.ucarecd.net/636b69e0-d0b7-4613-b09a-b0362f2451a0/-/preview/2912x1632/" />
        </div>
      </div>
    </section>
  );
}
