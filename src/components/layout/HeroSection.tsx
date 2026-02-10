"use client";

import Link from "next/link";
import Image from "next/image";
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
    <section className="text-[var(--gray-600)] py-16 md:py-20 px-6 bg-[var(--gray-black)]">
      <div className="max-w-7xl mx-auto text-center">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-[var(--gray-900)] border border-[var(--gray-700)] px-4 py-2 rounded-full mb-6">
          <Image 
            src="/iitb-logo.png" 
            alt="IIT Bombay" 
            width={24} 
            height={24}
            className="rounded-sm"
          />
          <span className="text-sm text-[var(--gray-300)]">Supported by IIT Bombay</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          One9Founders: The Security-First AI Tools Directory
        </h1>
        <p className="text-md md:text-lg mb-4 text-[var(--gray-300)] max-w-3xl mx-auto">
          One9Founders is an AI-powered platform built for startup founders to discover, compare, and use the best AI tools for building and scaling startups.
        </p>
        <p className="text-md md:text-lg mb-8 text-[var(--gray-400)] max-w-3xl mx-auto">
          2,500+ AI tools tested with uniform rating criteria and zero affiliate bias.
          India&apos;s most trusted platform for startup founders to discover AI tools.
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-10">
          <div className="text-center">
            <span className="block text-3xl md:text-4xl font-bold text-orange-600">2,500+</span>
            <span className="text-sm text-[var(--gray-400)]">Tools Tested</span>
          </div>
          <div className="text-center">
            <span className="block text-3xl md:text-4xl font-bold text-orange-600">10-Point</span>
            <span className="text-sm text-[var(--gray-400)]">Security Check</span>
          </div>
          <div className="text-center">
            <span className="block text-3xl md:text-4xl font-bold text-orange-600">0%</span>
            <span className="text-sm text-[var(--gray-400)]">Affiliate Bias</span>
          </div>
          <div className="text-center">
            <span className="block text-3xl md:text-4xl font-bold text-orange-600">9</span>
            <span className="text-sm text-[var(--gray-400)]">Categories</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button className="btn-primary" onClick={scrollToTools}>
            Explore Tools
          </button>
          <Link href="/methodology">
            <button className="btn-secondary px-6 py-3">How We Rate Tools</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
