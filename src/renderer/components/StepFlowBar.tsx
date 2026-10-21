import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ActiveNavTab, useProjectStore } from '../store/projectStore';

interface StepFlowBarProps {
  currentStepNumber: number;
  totalSteps?: number;
  stepTitle: string;
  nextStepHint: string;
  prevTab?: ActiveNavTab;
  prevLabel?: string;
  nextTab?: ActiveNavTab;
  nextLabel?: string;
  onNextCustom?: () => void;
}

export const StepFlowBar: React.FC<StepFlowBarProps> = ({
  currentStepNumber,
  totalSteps = 5,
  stepTitle,
  nextStepHint,
  prevTab,
  prevLabel,
  nextTab,
  nextLabel,
  onNextCustom,
}) => {
  const { setActiveTab, theme } = useProjectStore();
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';

  return (
    <div
      className={`${cardClass} rounded-[16px] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
    >
      {/* Left: Previous Step & Progress Indicator */}
      <div className="flex items-center gap-3.5 min-w-0">
        {prevTab && prevLabel && (
          <button
            type="button"
            onClick={() => setActiveTab(prevTab)}
            className="vv-btn-secondary px-3.5 py-2 text-xs shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{prevLabel}</span>
          </button>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#0099ff]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                Tahap {currentStepNumber} dari {totalSteps} &bull; {stepTitle}
              </span>
            </span>
          </div>
          <p className="text-xs text-[var(--vv-text-muted)] mt-0.5 truncate">
            {nextStepHint}
          </p>
        </div>
      </div>

      {/* Right: Primary Next Step Action */}
      {(nextTab || onNextCustom) && nextLabel && (
        <button
          type="button"
          onClick={() => {
            if (onNextCustom) {
              onNextCustom();
            } else if (nextTab) {
              setActiveTab(nextTab);
            }
          }}
          className="vv-btn-accent px-5 py-2.5 text-xs font-semibold shrink-0"
        >
          <span>{nextLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
