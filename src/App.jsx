import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ActivityPage from './pages/ActivityPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ActivityPage />} />
      </Routes>
    </Router>
  )
}

export default App



