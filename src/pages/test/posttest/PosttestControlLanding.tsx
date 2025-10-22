import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import tokens from '../../../../tokens.json';

export default function PosttestControlLanding() {
  const navigate = useNavigate();
  const app = useAppContext();

  React.useEffect(() => {
    const uid =
      sessionStorage.getItem('studyUserID') || (app && (app.userID as string | undefined));
    if (!uid) navigate('/DemographicForm/Demographics');
  }, []);

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: tokens.colors.bg }}
    >
      <div
        className="w-full max-w-2xl rounded-xl overflow-hidden"
        style={{ backgroundColor: tokens.colors.surface, boxShadow: tokens.shadows.lg }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${tokens.colors.accent} 0%, ${tokens.colors['accent-2']} 100%)`,
          }}
        >
          <h1 className="text-2xl font-bold text-white">Utolsó szakasz</h1>
          <p className="text-white/90 mt-1">30 kép</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-base mb-6" style={{ color: tokens.colors.text }}>
            Szép munka, majdnem kész vagy!
            <br />
            Ez az utolsó értékelési szakasz. Még 30 képet kell értékelned, ugyanazzal a módszerrel,
            mint eddig.
          </p>

          <div className="p-4 rounded-md mb-6" style={{ backgroundColor: tokens.colors.muted }}>
            <h3 className="font-semibold mb-2" style={{ color: tokens.colors.text }}>
              Mit kell tenned:
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-sm" style={{ color: tokens.colors.text }}>
              <li>Értékelj 30 radiológiai képet</li>
              <li>Döntsd el: van-e artritisz</li>
              <li>Jelöld meg a gyanús területet</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate('/posttest/control')}
              className="px-8 py-3 rounded-lg font-semibold text-white"
              style={{ backgroundColor: tokens.colors.accent, boxShadow: tokens.shadows.md }}
            >
              Kezdés →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
