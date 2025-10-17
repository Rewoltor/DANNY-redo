import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../contexts/AppContext';

export default function PretestControlLanding() {
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
        <h1 className="text-2xl font-bold mb-4">pre-test control (id starting with 0)</h1>
        <p className="mb-6">
          This is the landing page for control participants (userID starts with 0). Press start to
          begin the pre-test.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/pretest/control')}
            className="px-6 py-3 bg-accent text-white rounded"
          >
            Start pre-test (control)
          </button>
        </div>
      </div>
    </main>
  );
}
