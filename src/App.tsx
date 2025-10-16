import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Demographics from './pages/DemographicForm/Demographics';
import Personality from './pages/DemographicForm/Personality';
import Cognitive from './pages/DemographicForm/Cognitive';
import PreTestLanding from './pages/PreTestLanding';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/DemographicForm/Demographics" element={<Demographics />} />
      <Route path="/DemographicForm/Personality" element={<Personality />} />
      <Route path="/pretest" element={<PreTestLanding />} />
      <Route path="/DemographicForm/Cognitive" element={<Cognitive />} />
    </Routes>
  );
}
