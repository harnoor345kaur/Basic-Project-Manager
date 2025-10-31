import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import ProtectedRoute from './components/ProtectedRoute';
import { clearToken, getToken } from './auth';

export default function App() {
  const isAuth = !!getToken();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container-pro flex items-center justify-between py-4">
          <Link to="/" className="text-xl font-semibold text-brand-700">MiniPM</Link>
          <nav className="space-x-4 text-lg">
            {isAuth ? (
              <>
                <Link className="text-gray-700 hover:text-brand-700" to="/dashboard">Dashboard</Link>
                <button className="btn" onClick={() => { clearToken(); window.location.href = '/'; }}>Logout</button>
              </>
            ) : (
              <Link className="btn" to="/auth">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 flex items-center">
        <div className="container-pro w-full py-10">
          <Routes>
            <Route path="/" element={<div className="card text-center"><h1 className="heading">Welcome to Mini Project Manager</h1><p className="mt-2 text-gray-600">Manage projects and tasks with ease.</p></div>} />
            <Route path="/auth" element={<LoginRegister />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

