import React, { JSX } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './i18n';
import LandingPage from './pages/landing';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import ProfilePage from './pages/profile';
import ChatPage from './pages/chatPage';


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chat" element={<PrivateRoute><ChatPage/></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage/></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

