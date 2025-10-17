import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';

export default function BaselineExperimentalLanding() {
  const navigate = useNavigate();
  const app = useAppContext();

  React.useEffect(() => {
    const uid =
      sessionStorage.getItem('studyUserID') || (app && (app.userID as string | undefined));
    if (!uid) navigate('/DemographicForm/Demographics');
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-2xl font-bold mb-4">baseline experimental (id starting with 1)</h1>
        <p className="mb-6">Landing page for experimental group before baseline test.</p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/baseline/experimental')}
            className="px-6 py-3 bg-accent text-white rounded"
          >
            Start baseline (experimental)
          </button>
        </div>
      </div>
    </main>
  );
}
