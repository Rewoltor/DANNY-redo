import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import tokens from '../../../../tokens.json';

export default function ExperimentControlLanding() {
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
        <div
          className="px-8 py-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${tokens.colors.accent} 0%, ${tokens.colors['accent-2']} 100%)`,
          }}
        >
          <h1 className="text-2xl font-bold text-white">2. szakasz</h1>
          <p className="text-white/90 mt-1">5 kép</p>
        </div>

        <div className="p-6">
          <p className="text-base mb-6" style={{ color: tokens.colors.text }}>
            Jó munkát végeztél!
            <br />
            Most következik a második értékelési szakasz, összesen háromból. Ugyanazt a feladatot
            fogod végezni: artritisz felismerése és jelölése a képeken.
          </p>

          <div className="mb-6 p-4 rounded-md" style={{ backgroundColor: tokens.colors.muted }}>
            <h3 className="font-semibold mb-2" style={{ color: tokens.colors.text }}>
              Mit kell tenned:
            </h3>
            <ul className="list-disc pl-5 text-left" style={{ color: tokens.colors.text }}>
              <li>Értékelj 5 radiológiai képet</li>
              <li>Törekedj a maximális pontosságra</li>
              <li>Dolgozz a saját tempódban</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate('/experiment/control')}
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
