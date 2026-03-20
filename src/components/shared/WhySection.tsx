"use client";

export default function WhySection() {
  const features = [
    {
      icon: "shield",
      title: "Security-First Validation",
      description: "Every tool undergoes our 10-point security assessment before listing. We check data handling, privacy policies, and compliance standards.",
    },
    {
      icon: "scale",
      title: "Zero Affiliate Bias",
      description: "We don't take affiliate commissions. Rankings are based purely on our evaluation criteria - never on who pays more.",
    },
    {
      icon: "chart",
      title: "Uniform Rating Criteria",
      description: "All tools evaluated using identical methodology. Apples-to-apples comparisons you can actually trust.",
    },
    {
      icon: "graduation",
      title: "IIT Bombay Backed",
      description: "Supported by IIT Bombay with academic mentorship, bringing research-grade rigor to AI tool evaluation.",
    },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "shield":
        return (
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case "scale":
        return (
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        );
      case "chart":
        return (
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case "graduation":
        return (
          <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-8 md:py-10 px-4 md:px-6 bg-[var(--gray-900)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-6">
          Why Founders Trust One9Founders
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[var(--gray-800)] border border-[var(--gray-700)] rounded-xl p-4 hover:border-purple-500/50 transition-colors"
            >
              <div className="mb-2">{getIcon(feature.icon)}</div>
              <h3 className="text-sm md:text-base font-semibold text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-[var(--gray-400)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
