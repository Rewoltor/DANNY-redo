import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Demographics from './pages/Demographics'
import PreTestLanding from './pages/PreTestLanding'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/demographics" element={<Demographics />} />
      <Route path="/pretest" element={<PreTestLanding />} />
    </Routes>
  )
}
