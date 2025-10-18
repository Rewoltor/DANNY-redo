import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const PersonalityLanding: React.FC = () => {
  const navigate = useNavigate();
  const app = useAppContext();

  const userID =
    app?.userID || (typeof window !== 'undefined' ? sessionStorage.getItem('studyUserID') : null);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Next: Personality Questions</h1>
      <p className="mb-6">
        We'll now ask a few brief personality questions. Your answers help us analyze results and
        are stored with your participant ID.
      </p>
      {/* <div className="mb-4 text-sm text-gray-600">Session: {userID || 'No session found'}</div> */}

      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={() => navigate('/DemographicForm/Personality')}
        >
          Start Personality
        </button>

        {/* <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => {
            sessionStorage.removeItem('studyUserID');
            navigate('/');
          }}
        >
          Cancel and return
        </button> */}
      </div>
    </div>
  );
};

export default PersonalityLanding;
