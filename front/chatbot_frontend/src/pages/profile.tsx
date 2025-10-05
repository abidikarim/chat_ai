import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import API from '../api/api';
import Navbar from '../components/navbar';
import { User } from 'lucide-react';

export default function ProfilePage() {
  const { i18n, t } = useTranslation();
  const [summary, setSummary] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    (async () => {
      try {  
        const summaryRes = await API.get(`/chat_ai/summary`, {
          params: { language: i18n.language },
        });
        setSummary(summaryRes.data.summary_text || '');
      } catch (err) {
        console.error(err);
      }
    })();
  }, [i18n.language]);

  return (
    <>
      <Navbar />
      <div
        className={`p-6 min-h-screen bg-gray-50 ${
          i18n.language === 'ar' ? 'text-right' : 'text-left'
        }`}
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="text-blue-600" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {i18n.language === 'ar'
                    ? `مرحبًا ${userName}!`
                    : `Hello, ${userName}!`}
                </h2>
                <p className="text-gray-500">
                  {i18n.language === 'ar'
                    ? 'إليك نظرة عامة على اهتماماتك حسب محادثاتك الأخيرة 🤖'
                    : 'Here’s a quick summary of your recent chat interests 🤖'}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-2">
                {i18n.language === 'ar' ? 'ملخص الذكاء الاصطناعي' : 'AI Summary'}
              </h3>
              <p className="text-gray-800 leading-relaxed">
                {summary.trim()
                  ? summary
                  : i18n.language === 'ar'
                  ? 'لا يوجد ملخص بعد. ابدأ المحادثة لإنشاء ملخص لملفك الشخصي!'
                  : 'No summary available yet. Start chatting to generate your profile summary!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
