import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LoginPage from './components/LoginPage';
import Navigation from './components/Navigation';
import DynamicBackground from './components/DynamicBackground';
import HomePage from './components/HomePage';
import PlantCarePage from './components/PlantCarePage';
import DevicesPage from './components/DevicesPage';
import CommunityPage from './components/CommunityPage';
import FeedbackPage from './components/FeedbackPage';
import AIAssistant from './components/AIAssistant';
import { setMqttCallback } from "./mqtt";

function AppContent() {
  const { user, loading, guestMode } = useAuth();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState('home');
  const [city, setCity] = useState('苏州');
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    humidity: "--",
  });

  // ✅ 自动加载 Umami 脚本（等价于官方 <script defer ...>）
  useEffect(() => {
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://cloud.umami.is/script.js';
    script.setAttribute('data-website-id', 'a98724a7-4dfc-47fe-84a6-4d780ae229ee');
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
  setMqttCallback((data) => {
    setSensorData({
      temperature: data.temperature,
      humidity: data.humidity,
    });
  });
}, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('加载中...', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  if (!user && !guestMode) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage city={city} onCityChange={setCity} />;
      case 'plants':
        return <PlantCarePage />;
      case 'devices':
        return <DevicesPage sensorData={sensorData} />;
      case 'community':
        return <CommunityPage />;
      case 'feedback':
        return <FeedbackPage onNavigateHome={() => setCurrentPage('home')} />;
      default:
        return <HomePage city={city} onCityChange={setCity} />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <DynamicBackground city={city} />

      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="max-w-7xl mx-auto px-4 py-6 mt-16 md:mt-20 pb-20">
        {renderPage()}
      </main>

      <AIAssistant />

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-3 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-xs text-gray-500 text-center space-y-0.5">
            <p>{t('⚠️ 本应用为 Alpha 测试版本', '⚠️ This is an Alpha test version')}</p>
            <p>{t('👩‍💻 由西交利物浦大学学生开发', '👩‍💻 Developed by XJTLU students')}</p>
            <p>{t('🚫 本应用为非商业项目，仅供教学与实验使用', '🚫 Non-commercial project for educational purposes only')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
