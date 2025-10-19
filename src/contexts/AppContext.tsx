import * as React from 'react';

// Minimal, resilient AppContext implementation that avoids fragile TypeScript React typings in this environment.
type AppState = {
  userID: string | null;
  treatmentGroup: 'treatment' | 'control' | null;
  sessionActive: boolean;
  sessionStartTime: string | null;
  setUserID: (id: string | null) => void;
  setTreatmentGroup: (g: 'treatment' | 'control' | null) => void;
  setSessionActive: (v: boolean) => void;
};

const defaultState: AppState = {
  userID: null,
  treatmentGroup: null,
  sessionActive: false,
  sessionStartTime: null,
  setUserID: () => {},
  setTreatmentGroup: () => {},
  setSessionActive: () => {},
};

// Use any casts to avoid mismatches in this environment.
const AppContext = (React as any).createContext(defaultState);

export const useAppContext = () => (React as any).useContext(AppContext) as AppState;

export const AppProvider = ({ children }: { children: any }) => {
  // Initialize from sessionStorage synchronously so children see the values on first render.
  const [userID, setUserIDState] = (React as any).useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('studyUserID') || null;
    return null;
  });

  const [treatmentGroup, setTreatmentGroupState] = (React as any).useState(() => {
    if (typeof window !== 'undefined') {
      const g = sessionStorage.getItem('treatmentGroup');
      return g === 'treatment' || g === 'control' ? (g as 'treatment' | 'control') : null;
    }
    return null;
  });

  const [sessionActive, setSessionActiveState] = (React as any).useState(() => {
    if (typeof window !== 'undefined') return !!sessionStorage.getItem('studyUserID');
    return false;
  });

  const [sessionStartTime, setSessionStartTime] = (React as any).useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('sessionStartTime') || null;
    return null;
  });

  // Defensive sync effect: if something changed in sessionStorage after initialization, keep state consistent.
  (React as any).useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = sessionStorage.getItem('studyUserID');
    const storedGroup = sessionStorage.getItem('treatmentGroup');
    const storedStart = sessionStorage.getItem('sessionStartTime');
    if (stored && !userID) {
      setUserIDState(stored);
    }
    if (
      storedGroup &&
      !treatmentGroup &&
      (storedGroup === 'treatment' || storedGroup === 'control')
    ) {
      setTreatmentGroupState(storedGroup as 'treatment' | 'control');
    }
    if (storedStart && !sessionStartTime) setSessionStartTime(storedStart);
    if (stored && !sessionActive) setSessionActiveState(true);
  }, []);

  const setUserID = (id: string | null) => {
    setUserIDState(id);
    if (id) sessionStorage.setItem('studyUserID', id);
    else sessionStorage.removeItem('studyUserID');
  };

  const setTreatmentGroup = (g: 'treatment' | 'control' | null) => {
    setTreatmentGroupState(g);
    if (g) sessionStorage.setItem('treatmentGroup', g);
    else sessionStorage.removeItem('treatmentGroup');
  };

  const setSessionActive = (v: boolean) => {
    setSessionActiveState(v);
    if (v) {
      const now = new Date().toISOString();
      setSessionStartTime(now);
      sessionStorage.setItem('sessionStartTime', now);
    } else {
      setSessionStartTime(null);
      sessionStorage.removeItem('sessionStartTime');
    }
  };

  return (React as any).createElement(
    AppContext.Provider,
    {
      value: {
        userID,
        treatmentGroup,
        sessionActive,
        sessionStartTime,
        setUserID,
        setTreatmentGroup,
        setSessionActive,
      },
    },
    children,
  );
};
