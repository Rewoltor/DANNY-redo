import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Demographics from './pages/DemographicForm/Demographics';
import Personality from './pages/DemographicForm/Personality';
import Cognitive from './pages/DemographicForm/Cognitive';
import PersonalityLanding from './pages/DemographicForm/PersonalityLanding';
import CognitiveLanding from './pages/DemographicForm/CognitiveLanding';
import PreTestLanding from './pages/PreTestLanding';
import InstructionsPage from './pages/InstructionsPage/InstructionsPage';
import TestScreenContainer from './components/TestScreenContainer';
import { useParams } from 'react-router-dom';
// Pretest pages
import PretestControlLanding from './pages/test/pretest/PretestControlLanding';
import PretestControlTest from './pages/test/pretest/PretestControlTest';
import PretestExperimentalLanding from './pages/test/pretest/PretestExperimentalLanding';
import PretestExperimentalTest from './pages/test/pretest/PretestExperimentalTest';
// Baseline pages
import BaselineControlLanding from './pages/test/baseline/BaselineControlLanding';
import BaselineControlTest from './pages/test/baseline/BaselineControlTest';
import BaselineExperimentalLanding from './pages/test/baseline/BaselineExperimentalLanding';
import BaselineExperimentalTest from './pages/test/baseline/BaselineExperimentalTest';
// Experiment pages
import ExperimentControlLanding from './pages/test/experiment/ExperimentControlLanding';
import ExperimentControlTest from './pages/test/experiment/ExperimentControlTest';
import ExperimentExperimentalLanding from './pages/test/experiment/ExperimentExperimentalLanding';
import ExperimentExperimentalTest from './pages/test/experiment/ExperimentExperimentalTest';
// Posttest pages
import PosttestControlLanding from './pages/test/posttest/PosttestControlLanding';
import PosttestControlTest from './pages/test/posttest/PosttestControlTest';
import PosttestExperimentalLanding from './pages/test/posttest/PosttestExperimentalLanding';
import PosttestExperimentalTest from './pages/test/posttest/PosttestExperimentalTest';
import RedirectPostExperiment from './pages/RedirectPostExperiment';
import DoneThankYou from './pages/DoneThankYou';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/DemographicForm/Demographics" element={<Demographics />} />
      <Route path="/DemographicForm/PersonalityLanding" element={<PersonalityLanding />} />
      <Route path="/DemographicForm/Personality" element={<Personality />} />
      <Route
        path="/test/baseline"
        element={<TestScreenContainer phase={'baseline'} mode={'noai'} poolFolder={'baseline'} />}
      />
      <Route
        path="/test/:phase"
        element={
          <TestScreenContainer phase={undefined as any} mode={'noai'} poolFolder={'baseline'} />
        }
      />
      <Route path="/pretest" element={<Navigate to="/baseline/control-landing" replace />} />
      <Route path="/pretest/control-landing" element={<PretestControlLanding />} />
      <Route path="/pretest/control" element={<PretestControlTest />} />
      <Route path="/pretest/experimental-landing" element={<PretestExperimentalLanding />} />
      <Route path="/pretest/experimental" element={<PretestExperimentalTest />} />

      <Route path="/baseline/control-landing" element={<BaselineControlLanding />} />
      <Route path="/baseline/control" element={<BaselineControlTest />} />
      <Route path="/baseline/experimental-landing" element={<BaselineExperimentalLanding />} />
      <Route path="/baseline/experimental" element={<BaselineExperimentalTest />} />

      <Route path="/experiment/control-landing" element={<ExperimentControlLanding />} />
      <Route path="/experiment/control" element={<ExperimentControlTest />} />
      <Route path="/experiment/experimental-landing" element={<ExperimentExperimentalLanding />} />
      <Route path="/experiment/experimental" element={<ExperimentExperimentalTest />} />

      <Route path="/posttest/control-landing" element={<PosttestControlLanding />} />
      <Route path="/posttest/control" element={<PosttestControlTest />} />
      <Route path="/posttest/experimental-landing" element={<PosttestExperimentalLanding />} />
      <Route path="/posttest/experimental" element={<PosttestExperimentalTest />} />
      {/* legacy support: map /post_experiment/* to /posttest/* */}
      <Route path="/post_experiment/:rest" element={<RedirectPostExperiment />} />
      <Route path="/done" element={<DoneThankYou />} />
      <Route path="/DemographicForm/CognitiveLanding" element={<CognitiveLanding />} />
      <Route path="/DemographicForm/Cognitive" element={<Cognitive />} />
      <Route path="/InstructionsPage/InstructionsPage" element={<InstructionsPage />} />
    </Routes>
  );
}
