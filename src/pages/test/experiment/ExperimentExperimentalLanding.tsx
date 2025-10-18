import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';

export default function ExperimentExperimentalLanding() {
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

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-2xl font-bold mb-4">experiment experimental (id starting with 1)</h1>
        <p className="mb-6">Landing page for experimental group before experiment test.</p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/experiment/experimental')}
            className="px-6 py-3 bg-accent text-white rounded"
          >
            Start experiment (experimental)
          </button>
        </div>
        <div className="mt-6 text-left bg-white border p-3 rounded">
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
    </main>
  );
}
