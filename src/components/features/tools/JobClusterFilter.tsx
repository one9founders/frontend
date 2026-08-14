'use client';

import { HugeiconsIcon, UserIcon } from '@/components/ui/icons';
import { JOB_CLUSTERS } from '@/lib/tool-content';

interface JobClusterFilterProps {
  selectedClusters: string[];
  onClustersChange: (clusters: string[]) => void;
}

export default function JobClusterFilter({ selectedClusters, onClustersChange }: JobClusterFilterProps) {
  const toggleCluster = (cluster: string) => {
    if (selectedClusters.includes(cluster)) {
      onClustersChange(selectedClusters.filter((c) => c !== cluster));
    } else {
      onClustersChange([...selectedClusters, cluster]);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-[var(--gray-300)] mb-3 flex items-center gap-2">
        <HugeiconsIcon icon={UserIcon} size={16} />
        Job Cluster
      </h3>
      <div className="flex flex-wrap gap-2">
        {JOB_CLUSTERS.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleCluster(option.value)}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              selectedClusters.includes(option.value)
                ? `${option.color} text-white`
                : 'bg-[var(--gray-700)] text-[var(--gray-300)] hover:bg-[var(--gray-600)]'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
