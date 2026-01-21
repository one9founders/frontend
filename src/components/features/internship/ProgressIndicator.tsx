export default function ProgressIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[var(--gray-400)] text-sm">Step {currentStep} of {totalSteps}</span>
        <span className="text-[var(--gray-400)] text-sm">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-[var(--gray-800)] rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-tertiary)] h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
