import React, { useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { UI_TEXT } from '../i18n/translations';
import { StepFlowBar } from './StepFlowBar';
import { ProjectIdentityForm } from './setup/ProjectIdentityForm';
import { SafetyReserveCard } from './setup/SafetyReserveCard';
import { SafetyReserveGuideModal } from './setup/SafetyReserveGuideModal';
import { HelpCircle, Sliders } from 'lucide-react';

export const ProjectSetupView: React.FC = () => {
  const {
    project,
    language,
    theme,
    setProjectName,
    setTargetVideos,
    setFinalDurationSeconds,
    setCadanganMultiplier,
  } = useProjectStore();

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const t = UI_TEXT[language];
  const isId = language === 'id';
  const cardClass = theme === 'dark' ? 'glass-card-dark' : 'glass-card-light';
  const { assumptions, calculation, exchange_rate } = project;
  const cadanganCount = assumptions.default_attempts_per_shot || 2;

  return (
    <div className="space-y-6">
      {/* Header Langkah 2 */}
      <div
        className={`${cardClass} rounded-[16px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="vv-badge-pill">
              <Sliders className="w-3.5 h-3.5 text-[#0099ff]" />
              <span>
                {isId
                  ? 'Langkah 02 • Nama Proyek, Durasi & Dana Jaga-Jaga'
                  : 'Step 02 • Project Name, Duration & Safety Reserve'}
              </span>
            </span>
          </div>
          <h1 className="text-2xl font-medium tracking-[-0.035em]">
            {isId ? (
              <>
                Identitas Proyek &{' '}
                <span className="vv-accent text-[#0099ff]">
                  Dana Jaga-Jaga (Cadangan)
                </span>
              </>
            ) : (
              <>
                Project Identity &{' '}
                <span className="vv-accent text-[#0099ff]">
                  Safety Reserve
                </span>
              </>
            )}
          </h1>
          <p className="text-xs text-[var(--vv-text-muted)] mt-1">
            {isId
              ? 'Tentukan nama proyek, target durasi per video, dan angka cadangan percobaan. Rincian shot diatur di Langkah 3.'
              : 'Set project name, target duration per video, and reserve multiplier. Shot details are configured in Step 3.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="vv-btn-secondary px-4 py-2.5 text-xs shrink-0"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#0099ff]" />
          <span>
            {isId ? 'Panduan Dana Jaga-Jaga' : 'Safety Reserve Guide'}
          </span>
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Kolom Kiri (6 Cols): Identitas Proyek, Target Video, Durasi & Kurs */}
        <ProjectIdentityForm
          language={language}
          theme={theme}
          projectName={project.project_name}
          assumptions={assumptions}
          exchangeRate={exchange_rate}
          onProjectNameChange={setProjectName}
          onTargetVideosChange={setTargetVideos}
          onFinalDurationSecondsChange={setFinalDurationSeconds}
        />

        {/* Kolom Kanan (6 Cols): Dana Jaga-Jaga (Cadangan) & Ringkasan Dampak Anggaran */}
        <SafetyReserveCard
          language={language}
          theme={theme}
          items={project.items}
          calculation={calculation}
          cadanganCount={cadanganCount}
          onCadanganMultiplierChange={setCadanganMultiplier}
        />
      </div>

      {/* Guided Step Flow Footer */}
      <StepFlowBar
        currentStepNumber={2}
        stepTitle={t.navSetup}
        nextStepHint={
          isId
            ? 'Langkah selanjutnya: Tambahkan atau atur daftar shot / gambar video AI yang ingin diproduksi.'
            : 'Next step: Add or configure the AI video shots and images you want to produce.'
        }
        prevTab="dashboard"
        prevLabel={t.navDashboard}
        nextTab="planner"
        nextLabel={
          isId
            ? 'Lanjut ke Langkah 3: Daftar Pekerjaan AI'
            : 'Continue to Step 3: AI Production List'
        }
      />

      {/* Modal Panduan Cadangan */}
      <SafetyReserveGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        language={language}
        theme={theme}
      />
    </div>
  );
};
