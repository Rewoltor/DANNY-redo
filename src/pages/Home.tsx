import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import tokens from '../../tokens.json';

// Local aliases to avoid TypeScript React type-resolution issues in this environment
const useState: any = (React as any).useState;
type ChangeEvent<T = any> = any;

export default function Home() {
  const navigate = useNavigate();
  const [consentGiven, setConsentGiven] = useState(false);

  const handleStart = () => {
    if (consentGiven) {
      navigate('/DemographicForm/Demographics');
    }
  };

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
        className="max-w-5xl w-full"
        style={{
          backgroundColor: colors.bg,
          borderRadius: radii.xl,
          boxShadow: shadows.lg,
          overflow: 'hidden',
        }}
      >
        {/* Header Section with Gradient */}
        <div
          className="px-6 py-12 sm:px-10 sm:py-16 text-center"
          style={{
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors['accent-2']} 100%)`,
            color: '#ffffff',
          }}
        >
          <div
            className="inline-block px-4 py-2 mb-4 rounded-full text-xs uppercase tracking-widest font-semibold"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            Kutatásban való részvétel
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            style={{ color: '#ffffff' }}
          >
            Orvosi képek értékelése
            <br />
            mesterséges intelligencia támogatással
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>
                <strong>Kutató:</strong> Baltay Márton, MSc hallgató
              </span>
            </div>
            <div className="hidden sm:block opacity-50">|</div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>
                <strong>Egyetem:</strong> Pázmány Péter Katolikus Egyetem
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-10 sm:px-10 sm:py-12">
          {/* Task Description Card */}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
                  Mi a feladat?
                </h3>
                <p className="leading-relaxed" style={{ color: colors.text, opacity: 0.8 }}>
                  Radiológiai képeken artritisz jelenlétének felismerése – eldönti, van-e artritisz,
                  és megjelöli a gyanús területet.
                </p>
              </div>
            </div>
          </div>

          {/* Time Estimate Card */}
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
                  Mennyi idő?
                </h3>
                <p className="mb-4" style={{ color: colors.text, opacity: 0.8 }}>
                  <strong>90-120 perc összesen:</strong>
                </p>
                <ul className="space-y-2" style={{ color: colors.text }}>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: colors.accent }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Bevezető előadás (20-30 perc)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: colors.accent }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>5 gyakorló kép</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: colors.accent }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Több értékelési szakasz (~30 kép/szakasz)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Important Conditions Warning Card */}
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
                <h3
                  className="text-lg font-bold mb-3 flex items-center gap-2"
                  style={{ color: '#92400e' }}
                >
                  Fontos feltételek
                </h3>
                <p className="mb-3 font-semibold" style={{ color: '#78350f' }}>
                  A tesztet egyetlen ülésben, megszakítás nélkül kell elvégezni!
                </p>
                <ul className="space-y-2" style={{ color: '#78350f' }}>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>Napközben végezze, amikor pihent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>Biztosítson zavartalan környezetet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>Nem lehet szünetet tartani vagy kilépni</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Privacy Card */}
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
                  Adatkezelés
                </h3>
                <p className="leading-relaxed" style={{ color: colors.text, opacity: 0.8 }}>
                  Adatai anonimizálva, kizárólag kutatási célra kerülnek felhasználásra.
                </p>
              </div>
            </div>
          </div>

          {/* Consent Section */}
          <div
            className="mb-8 p-6 rounded-xl"
            style={{
              backgroundColor: colors.surface,
              border: `2px solid ${colors.muted}`,
            }}
          >
            <p className="mb-4 font-semibold" style={{ color: colors.text }}>
              A továbblépéssel kijelentem, hogy:
            </p>
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConsentGiven(e.target.checked)}
                className="mt-1 w-5 h-5 cursor-pointer"
                style={{ accentColor: colors.accent }}
              />
              <span
                className="flex-1 leading-relaxed group-hover:opacity-80 transition-opacity"
                style={{ color: colors.text }}
              >
                Elolvastam a tájékoztatót és megértettem a kutatás célját, menetét és feltételeit.
                Önként vállalom a részvételt.
              </span>
            </label>
          </div>

          {/* Footer Section */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t-2"
            style={{ borderTopColor: colors.muted }}
          >
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold mb-2" style={{ color: colors.text }}>
                Kérdése van?
              </p>
              <div className="space-y-1">
                <a
                  href="mailto:baltay.marton@gmail.com"
                  className="block text-sm hover:underline transition-all"
                  style={{ color: colors.accent }}
                >
                  baltay.marton@gmail.com
                </a>
                <a
                  href="tel:+36203971061"
                  className="block text-sm hover:underline transition-all"
                  style={{ color: colors.accent }}
                >
                  +36 20 397 1061
                </a>
              </div>
            </div>
            <button
              onClick={handleStart}
              disabled={!consentGiven}
              className="px-8 py-4 font-bold text-lg rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg disabled:shadow-none"
              style={{
                backgroundColor: consentGiven ? colors.accent : colors.muted,
                color: consentGiven ? '#ffffff' : colors.text,
                opacity: consentGiven ? 1 : 0.5,
              }}
            >
              Kezdés →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
