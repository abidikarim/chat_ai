import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import API from '../api/api';
import { AIModel } from '../models/enums/ai_model';
import { Language } from '../models/enums/language';
import { ChatItem } from '../models/classes/chatItem';
import Navbar from '../components/navbar';
import { ChatGroup } from '../models/classes/chatGroup';

export default function ChatPage() {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [model, setModel] = useState<AIModel>(AIModel.falcon3);
  const [language, setLanguage] = useState<Language>(i18n.language as Language);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [typingId, setTypingId] = useState<number | null>(null);
  const [modelOpen, setModelOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Fetch chat history
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/chat_ai/chat`);
        const formatted = res.data.map((c: any, idx: number) => ({
          user: c.message,
          ai: c.ai_response,
          id: c.id ?? idx,
          date: c.created_at ?? new Date().toISOString(),
        }));
        setHistory(formatted);
        if (formatted.length) {
          const lastDay = formatted[formatted.length - 1].date.split('T')[0];
          setSelectedDay(lastDay);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, selectedDay, typingId]);

  const send = async () => {
    if (!message || typingId) return;

    const currentDate = new Date().toISOString();
    const typingMessage: ChatItem = {
      user: message,
      ai: 'typing...',
      id: Date.now(),
      date: currentDate,
    };

    const messageDay = currentDate.split('T')[0];
    if (!selectedDay) setSelectedDay(messageDay);

    setTypingId(typingMessage.id);
    setHistory(prev => [...prev, typingMessage]);
    setMessage('');

    try {
      const res = await API.post('/chat_ai/chat/', {
        message: typingMessage.user,
        language: language,
        model_used: model,
      });

      setHistory(prev =>
        prev.map(c =>
          c.id === typingMessage.id
            ? { ...c, ai: res.data.ai_response ?? res.data.reply ?? '' }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      setHistory(prev =>
        prev.map(c =>
          c.id === typingMessage.id
            ? { ...c, ai: 'Error: could not get response' }
            : c
        )
      );
    } finally {
      setTypingId(null);
    }
  };

  // Group chat messages by day
  const grouped: ChatGroup[] = Object.values(
    history.reduce((acc: Record<string, ChatGroup>, msg) => {
      const day = msg.date.split('T')[0];
      if (!acc[day]) acc[day] = { date: day, messages: [] };
      acc[day].messages.push(msg);
      return acc;
    }, {})
  );

  grouped.forEach(g => g.messages.sort((a, b) => a.id - b.id));
  grouped.sort((a, b) => a.date.localeCompare(b.date));
  const selectedGroup = grouped.find(g => g.date === selectedDay);

  return (
    <>
      <Navbar />

      <div className={`min-h-screen bg-gray-50 ${language === Language.Arabic ? 'text-right' : 'text-left'}`}>
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-4 p-4">

          {/* Mobile button to open sidebar */}
          <div className="md:hidden flex justify-between items-center mb-2">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="px-4 py-2 bg-blue-600 text-white rounded shadow"
            >
              {t('history')}
            </button>
          </div>

          {/* Sidebar */}
          <div className={`bg-white rounded shadow p-4 md:w-1/3 h-[calc(100vh-2rem)] overflow-auto ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
            <h2 className="text-lg font-bold mb-4">{t('history')}</h2>
            {grouped.slice().reverse().map(day => {
              const totalMessages = day.messages.reduce((count, msg) => {
                if (msg.user) count++;
                if (msg.ai) count++;
                return count;
              }, 0);
              return (
                <div
                  key={day.date}
                  onClick={() => setSelectedDay(day.date)}
                  className={`p-3 mb-2 cursor-pointer transition border-l-4 rounded ${selectedDay === day.date ? 'bg-blue-100 border-blue-600' : 'border-transparent hover:bg-gray-100'}`}
                >
                  <div className="font-medium">{day.date}</div>
                  <div className="text-xs text-gray-500 mt-1">{totalMessages} {t('messages')}</div>
                </div>
              )
            })}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Dropdowns on top */}
            <div className="flex gap-4 mb-2">
              <div className="relative">
                <button
                  onClick={() => setModelOpen(prev => !prev)}
                  className="border p-2 rounded w-36 text-left bg-white shadow hover:ring-1 hover:ring-blue-500"
                >
                  {model.toUpperCase()}
                </button>
                {modelOpen && (
                  <div className="absolute mt-1 w-36 bg-white border rounded shadow z-50">
                    {Object.entries(AIModel).map(([key, value]) => (
                      <div
                        key={key}
                        className="p-2 cursor-pointer hover:bg-blue-100"
                        onClick={() => { setModel(value); setModelOpen(false); }}
                      >
                        {key.toUpperCase()}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setLangOpen(prev => !prev)}
                  className="border p-2 rounded w-24 text-left bg-white shadow hover:ring-1 hover:ring-blue-500"
                >
                  {language.toUpperCase()}
                </button>
                {langOpen && (
                  <div className="absolute mt-1 w-24 bg-white border rounded shadow z-50">
                    {Object.entries(Language).map(([key, value]) => (
                      <div
                        key={key}
                        className="p-2 cursor-pointer hover:bg-blue-100"
                        onClick={() => { setLanguage(value); i18n.changeLanguage(value); setLangOpen(false); }}
                      >
                        {value.toUpperCase()}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="bg-white p-4 rounded shadow flex-1 overflow-auto flex flex-col gap-4 h-[70vh]">
              {selectedGroup ? (
                selectedGroup.messages.map(chat => (
                  <div key={chat.id} className="relative">
                    {chat.user && (
                      <div className="flex justify-between items-end">
                        <div className="p-3 bg-blue-100 rounded-lg max-w-[80%]">{chat.user}</div>
                        <div className="text-xs text-gray-500 ml-2">{new Date(chat.date).toLocaleTimeString()}</div>
                      </div>
                    )}
                    {chat.ai && (
                      <div className="flex justify-between items-end mt-1">
                        {chat.ai === 'typing...' ? (
                          <div className="p-3 bg-gray-100 rounded-lg inline-flex gap-1">
                            <span className="dot animate-bounce">.</span>
                            <span className="dot animate-bounce200">.</span>
                            <span className="dot animate-bounce400">.</span>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-100 rounded-lg max-w-[80%]">{chat.ai}</div>
                        )}
                        <div className="text-xs text-gray-500 ml-2">{new Date(chat.date).toLocaleTimeString()}</div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center mt-10">{t('no_history')}</div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 mt-4 items-center">
              <input
                className="flex-1 border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={t('chat_placeholder')}
                disabled={!!typingId}
              />
              <button
                onClick={send}
                className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!message || !!typingId}
              >
                {t('send')}
              </button>
            </div>
          </div>
        </div>

        {/* Typing animation CSS */}
        <style>
          {`
            .dot { display: inline-block; width: 6px; height: 6px; background-color: black; border-radius: 50%; }
            .animate-bounce { animation: bounce 1s infinite; }
            .animate-bounce200 { animation: bounce 1s infinite 0.2s; }
            .animate-bounce400 { animation: bounce 1s infinite 0.4s; }
            @keyframes bounce {
              0%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-8px); }
            }
          `}
        </style>
      </div>
    </>
  );
}
