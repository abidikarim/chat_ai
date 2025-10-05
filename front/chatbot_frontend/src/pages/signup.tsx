import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/navbar';
import API from '../api/api';
import { Register } from '../models/classes/register';
import { Language } from '../models/enums/language';

export default function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState<Language>(Language.English); // Added state for language

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user_data: Register = {
        username: name,
        email: email,
        password: password,
        prefered_language: language, // use selected language
      };
      await API.post('/user/register/', user_data);
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert(t('signup') + ' failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">{t('signup')}</h2>

          <input
            type="text"
            placeholder={t('name')}
            value={name}
            onChange={e => setName(e.target.value)}
            className="p-2 border rounded"
            required
          />

          <input
            type="email"
            placeholder={t('email')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="p-2 border rounded"
            required
          />

          <input
            type="password"
            placeholder={t('password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="p-2 border rounded"
            required
          />

          {/* Language Dropdown */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="p-2 border rounded"
          >
            {Object.entries(Language).map(([key, value]) => (
              <option key={key} value={value}>{key}</option>
            ))}
          </select>

          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            {t('submit')}
          </button>

          <p>
            {t('already_account')}{' '}
            <Link to="/login" className="text-blue-500">
              {t('login')}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
