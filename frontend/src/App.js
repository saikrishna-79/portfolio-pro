import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Links from './pages/Links';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Register from './pages/Register';
import Skills from './pages/Skills';
import Work from './pages/Work';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                  <Dashboard />
              } />
              <Route path="/profile" element={
                  <Profile />
              } />
              <Route path="/skills" element={
                  <Skills />
              } />
              <Route path="/projects" element={
                  <Projects />
              } />
              <Route path="/work" element={
                  <Work />
              } />
              <Route path="/links" element={
                  <Links />
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
