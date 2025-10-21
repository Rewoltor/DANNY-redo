import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import tokens from '../../../tokens.json';

const PersonalityLanding: React.FC = () => {
  const navigate = useNavigate();
  const app = useAppContext();

  const userID =
    app?.userID || (typeof window !== 'undefined' ? sessionStorage.getItem('studyUserID') : null);

  // Extract tokens for inline styles
  const colors = tokens.colors;
  const shadows = tokens.shadows;
  const radii = tokens.radii;

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{
        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.surface} 100%)`,
      }}
    >
      <div
        className="max-w-4xl w-full"
        style={{
          backgroundColor: colors.bg,
          borderRadius: radii.xl,
          boxShadow: shadows.lg,
          overflow: 'hidden',
        }}
      >
        {/* Header Section with Gradient */}
        <div
          className="px-6 py-12 sm:px-10 sm:py-14 text-center"
          style={{
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors['accent-2']} 100%)`,
            color: '#ffffff',
          }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#ffffff' }}>
            Személyiség kérdőív
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>5 perc</span>
            </div>
            <div className="opacity-50">|</div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>44 kérdés</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-10 sm:px-10 sm:py-12">
          {/* What's Next Card */}
          <div
            className="mb-8 p-6 rounded-xl"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.muted}`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg"
                style={{ backgroundColor: colors.accent, color: '#ffffff' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
                  Mi következik?
                </h3>
                <p className="leading-relaxed" style={{ color: colors.text, opacity: 0.8 }}>
                  Egy rövid személyiségteszt, amely öt alapvető személyiségdimenziót mér. Nincsenek
                  jó vagy rossz válaszok – csak az számít, hogy őszintén válaszolj.
                </p>
              </div>
            </div>
          </div>

          {/* Why Important Card */}
          <div
            className="mb-8 p-6 rounded-xl"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.muted}`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg"
                style={{ backgroundColor: colors['accent-2'], color: '#ffffff' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
                  Miért fontos ez a teszt?
                </h3>
                <p className="leading-relaxed" style={{ color: colors.text, opacity: 0.8 }}>
                  A kutatás azt vizsgálja, hogy a személyiségbeli különbségek befolyásolják-e a
                  tanulást és a teljesítményt orvosi képek értékelésében. Az eredmények segítenek
                  megérteni, ki hogyan tanul és dolgozik mesterséges intelligencia segítségével.
                </p>
              </div>
            </div>
          </div>

          {/* Important Tips Warning Card */}
          <div
            className="mb-8 p-6 rounded-xl border-l-4"
            style={{
              backgroundColor: '#fef3c7',
              borderLeftColor: '#f59e0b',
              border: '1px solid #fde68a',
              borderLeft: '4px solid #f59e0b',
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-3xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-4" style={{ color: '#92400e' }}>
                  Fontos:
                </h3>
                <ul className="space-y-2" style={{ color: '#78350f' }}>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Válaszolj őszintén – nincs elvárt vagy "helyes" válasz</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Olvasd el figyelmesen a kérdéseket</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Az első válaszod általában a legjobb</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>A teszt ~5 percet vesz igénybe</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => navigate('/DemographicForm/Personality')}
              className="px-8 py-4 font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg"
              style={{
                backgroundColor: colors.accent,
                color: '#ffffff',
              }}
            >
              Tovább a teszthez →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PersonalityLanding;
