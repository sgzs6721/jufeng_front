import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ActivityPage from './pages/ActivityPage'
import MemberListPage from './pages/MemberListPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ActivityPage />} />
        <Route path="/list-all-members" element={<MemberListPage />} />
      </Routes>
    </Router>
  )
}

export default App



