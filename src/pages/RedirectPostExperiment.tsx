import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function RedirectPostExperiment() {
  const params = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    const rest = params['rest'] || '';
    // Navigate to the equivalent /posttest/... route
    navigate(`/posttest/${rest}`, { replace: true });
  }, [params, navigate]);

  return null;
}
