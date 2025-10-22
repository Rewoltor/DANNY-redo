import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';
import tokens from '../../../../tokens.json';

export default function ExperimentExperimentalLanding() {
  let videoEl: HTMLVideoElement | null = null;
  const [watched, setWatched] = React.useState(false);
  const [ackChecked, setAckChecked] = React.useState(false);
  const navigate = useNavigate();
  const app = useAppContext();

  React.useEffect(() => {
    // Wait for app to initialize. If app is available and no user id is present, redirect.
    const uid =
      sessionStorage.getItem('studyUserID') || (app && (app.userID as string | undefined));
    console.debug(
      'ExperimentExperimentalLanding effect, session uid=',
      sessionStorage.getItem('studyUserID'),
      'app.userID=',
      app && (app.userID as any),
    );
    if (app) {
      if (!uid) {
        console.warn('No user id found in app or sessionStorage — redirecting to demographics');
        navigate('/DemographicForm/Demographics');
      }
    }
    // if app is not yet ready, do nothing — the debug panel / Continue anyway button allows proceeding
  }, [app, navigate]);

  const setVideoRef = (el: HTMLVideoElement | null) => {
    videoEl = el;
  };

  const handleEnded = () => {
    setWatched(true);
  };

  const handleStart = () => {
    // Keep same functionality: navigate immediately to experiment experimental
    navigate('/experiment/experimental');
  };

  const accent = tokens?.colors?.accent ?? '#2563eb';
  const muted = tokens?.colors?.muted ?? '#f1f5f9';
  const surface = tokens?.colors?.surface ?? '#f8fafc';

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6 bg-bg text-text"
      style={{ backgroundColor: tokens.colors.bg }}
    >
      <div
        className="w-full max-w-6xl bg-surface rounded-lg shadow-md p-6 border border-muted"
        style={{ backgroundColor: surface }}
      >
        <h1 className="text-2xl font-bold mb-4">experiment experimental (id starting with 1)</h1>

        <div className="mb-6 flex justify-center">
          <div className="w-full" style={{ maxWidth: 1100 }}>
            <div
              className="mb-6 rounded-md overflow-hidden"
              style={{ boxShadow: tokens.shadows.md, backgroundColor: '#000' }}
            >
              <video
                ref={setVideoRef}
                src="/video.mp4"
                controls
                onEnded={handleEnded}
                className="w-full rounded-md bg-black"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '65vh',
                  display: 'block',
                  borderRadius: '0.5rem',
                  backgroundColor: '#000',
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4">
          {watched && (
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={ackChecked}
                onChange={e => setAckChecked(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Megnéztem a videót</span>
            </label>
          )}

          <button
            onClick={handleStart}
            disabled={!(watched && ackChecked)}
            aria-disabled={!(watched && ackChecked)}
            className={`px-6 py-3 rounded-md font-semibold text-white transition-colors disabled:opacity-60`}
            style={{ backgroundColor: watched && ackChecked ? accent : muted }}
          >
            Kezdés →
          </button>

          {/* Debug panel (preserved) */}
          <div
            className="w-full max-w-2xl mt-6 text-left bg-white border p-3 rounded"
            style={{ borderColor: muted }}
          >
            <h4 className="font-semibold mb-2">Debug / session info</h4>
            <p className="text-sm">
              sessionStorage.studyUserID:{' '}
              <code>{sessionStorage.getItem('studyUserID') || 'null'}</code>
            </p>
            <p className="text-sm">
              app.userID: <code>{(app && (app.userID as any)) || 'null'}</code>
            </p>
            <p className="text-sm">
              app.treatmentGroup: <code>{(app && (app.treatmentGroup as any)) || 'null'}</code>
            </p>
            <div className="mt-2">
              <button
                onClick={() => navigate('/experiment/experimental')}
                className="px-3 py-1 bg-gray-200 rounded mr-2"
              >
                Continue anyway
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem('studyUserID');
                  navigate('/DemographicForm/Demographics');
                }}
                className="px-3 py-1 bg-red-100 rounded"
              >
                Clear session and restart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
