import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';
import Navbar from '../components/navbar';
import { useTranslation } from 'react-i18next';
import { Login } from '../models/classes/login';

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

 const submit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const userLogin: Login = { email, password };
    const res = await API.post("/user/login/", userLogin);
    
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh)

    if (res.data.preferred_language)
      localStorage.setItem("lang", res.data.user.preferred_language);

    nav("/chat");

  } catch (err: any) {
    console.error("Login error:", err);
    alert(err.response?.data?.detail || "Login failed");
  }
};

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
        <h2 className="text-xl mb-4">{t('login')}</h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('email')}
            className="border p-2"
          />
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder={t('password')}
            className="border p-2"
          />
          <button className="bg-blue-600 text-white p-2 rounded">{t('login')}</button>
        </form>
        <p className="mt-3">
          {t('dont_have_account')}{' '}
          <Link to="/signup" className="text-blue-500">{t('signup')}</Link>
        </p>
      </div>
    </>
  );
}
