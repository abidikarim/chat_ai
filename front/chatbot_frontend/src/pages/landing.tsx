import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/navbar";

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const nav = useNavigate();

  return (
    <div className={`${i18n.language === "ar" ? "text-right" : "text-left"}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-sky-600 to-blue-800 text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{t("welcome")}</h1>
        <p className="text-lg md:text-2xl mb-8 max-w-2xl">
          {i18n.language === "ar"
            ? "تحدث مع نماذج الذكاء الاصطناعي المتقدمة وتعلم بسرعة وسهولة."
            : "Chat with advanced AI models and learn faster, smarter."}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => nav("/login")}
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
          >
            {t("login")}
          </button>
          <button
            onClick={() => nav("/signup")}
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-yellow-300 transition"
          >
            {t("signup")}
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">
          {i18n.language === "ar" ? "مميزات المنصة" : "Key Features"}
        </h2>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              title: i18n.language === "ar" ? "نماذج متعددة" : "Multiple AI Models",
              desc: i18n.language === "ar"
                ? "اختر بين ثلاثة نماذج ذكاء اصطناعي لتجربة فريدة."
                : "Choose from three AI models for unique responses.",
            },
            {
              title: i18n.language === "ar" ? "دعم لغتين" : "Bilingual Support",
              desc: i18n.language === "ar"
                ? "تحدث بالإنجليزية أو العربية بكل سهولة."
                : "Chat seamlessly in English or Arabic.",
            },
            {
              title: i18n.language === "ar" ? "واجهة تفاعلية" : "Interactive UI",
              desc: i18n.language === "ar"
                ? "واجهة دردشة بسيطة وجذابة تشبه ChatGPT."
                : "Clean, engaging chat interface similar to ChatGPT.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            {i18n.language === "ar" ? "حول المنصة" : "About Our Platform"}
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {i18n.language === "ar"
              ? "تم تطوير هذه المنصة لمساعدتك في التواصل مع نماذج الذكاء الاصطناعي وتحسين مهاراتك وفهمك للمفاهيم بسرعة."
              : "This platform is built to help you interact with AI models, gain insights, and explore intelligent conversations effortlessly."}
          </p>
        </div>
      </section>

       <footer className="bg-gray-900 text-white py-6 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} AI Chat.{" "}
            {i18n.language === "ar"
              ? "جميع الحقوق محفوظة."
              : "All rights reserved."}
          </p>
      </footer>
    </div>
  );
}
