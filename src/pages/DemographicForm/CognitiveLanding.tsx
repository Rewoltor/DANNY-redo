import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const CognitiveLanding: React.FC = () => {
  const navigate = useNavigate();
  const app = useAppContext();

  const userID =
    app?.userID || (typeof window !== 'undefined' ? sessionStorage.getItem('studyUserID') : null);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Next: Cognitive Test</h1>
      <p className="mb-6">
        Next you'll complete a short cognitive task. Make sure you're in a quiet place and ready to
        proceed.
      </p>
      {/* <div className="mb-4 text-sm text-gray-600">Session: {userID || 'No session found'}</div> */}

      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded"
          onClick={() => navigate('/DemographicForm/Cognitive')}
        >
          Start Cognitive
        </button>

        {/* <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => {
            sessionStorage.removeItem('studyUserID')
            navigate('/')
          }}
        >
          Cancel and return
        </button> */}
      </div>
    </div>
  );
};

export default CognitiveLanding;
