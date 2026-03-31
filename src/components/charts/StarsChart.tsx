'use client';

import { GitHubSnapshot } from '@/types/rag';

interface StarsChartProps {
  data: GitHubSnapshot[];
  height?: number;
}

export default function StarsChart({ data, height = 120 }: StarsChartProps) {
  if (!data || data.length < 2) {
    return (
      <div className="text-sm text-[var(--gray-500)] text-center py-4">
        Not enough data to show chart
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => new Date(a.snapshot_date).getTime() - new Date(b.snapshot_date).getTime());
  const stars = sorted.map((d) => d.stars);
  const minStars = Math.min(...stars);
  const maxStars = Math.max(...stars);
  const range = maxStars - minStars || 1;

  const width = 400;
  const padding = { top: 10, right: 10, bottom: 25, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const points = sorted.map((d, i) => {
    const x = padding.left + (i / (sorted.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.stars - minStars) / range) * chartHeight;
    return { x, y, stars: d.stars, date: d.snapshot_date };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  // Y-axis labels
  const yLabels = [...new Set([minStars, Math.round((minStars + maxStars) / 2), maxStars])];

  // X-axis labels (first and last dates)
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: `${height}px` }}>
      {/* Grid lines */}
      {yLabels.map((val) => {
        const y = padding.top + chartHeight - ((val - minStars) / range) * chartHeight;
        return (
          <g key={val}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--gray-800)" strokeWidth="1" />
            <text x={padding.left - 5} y={y + 4} textAnchor="end" fill="var(--gray-500)" fontSize="10">
              {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={areaPath} fill="url(#starsGradient)" opacity="0.3" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#a855f7" strokeWidth="2" />

      {/* Data points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#a855f7" stroke="var(--gray-900)" strokeWidth="1.5" />
      ))}

      {/* X-axis labels */}
      {sorted.length > 0 && (
        <>
          <text x={padding.left} y={height - 5} textAnchor="start" fill="var(--gray-500)" fontSize="10">
            {formatDate(sorted[0].snapshot_date)}
          </text>
          <text x={width - padding.right} y={height - 5} textAnchor="end" fill="var(--gray-500)" fontSize="10">
            {formatDate(sorted[sorted.length - 1].snapshot_date)}
          </text>
        </>
      )}

      {/* Gradient definition */}
      <defs>
        <linearGradient id="starsGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
