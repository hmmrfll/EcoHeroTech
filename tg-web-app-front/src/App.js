import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Balance from './components/Balance';
import Button from './components/Button';
import EchaBalance from './components/EchaBalance';
import Farming from './components/Farming';
import Play from './components/Play';
import MainScreen from './components/MenuScreen';
import Leaderboard from './components/Leaderboard'; 
import AboutGamePage from './components/AboutGamePage';
import DonationNotification from './components/DonationNotification';
import DonationPage from './components/DonationPage';
import ConfirmationPage from './components/ConfirmationPage';
import ThankYouPage from './components/ThankYouPage';
import { getChatIdByUsername, getUserLanguage } from './services/userService';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import 'web-animations-js'; // Импорт полифила для анимаций

const AppContainer = styled.div`
  background-image: url('/main-page/background.png');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  overflow-x: hidden;
`;

const AppContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AppContentWithRouter = () => {
  const [chatId, setChatId] = useState(null);
  const [telegramUsername, setTelegramUsername] = useState('');
  const [updatedEchaCoins, setUpdatedEchaCoins] = useState(0);
  const [language, setLanguage] = useState('en');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.Telegram.WebApp.ready();
    const initData = window.Telegram.WebApp.initDataUnsafe;
    setTelegramUsername(initData.user.username);
  }, []);

  useEffect(() => {
    const fetchChatIdAndLanguage = async () => {
        const data = await getChatIdByUsername(telegramUsername);
        setChatId(data.chatId);
        const userLanguage = await getUserLanguage(data.chatId);
        setLanguage(userLanguage === 'ru' ? 'ru' : 'en');
    };

    if (telegramUsername) {
      fetchChatIdAndLanguage();
    }
  }, [telegramUsername]);

  const location = useLocation();
  const hideHeaderPaths = ['/menu', '/about-game', '/leaderboard'];

  return (
    <AppContainer>
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      <AppContent>
        <Routes>
          <Route path="/" element={
            <>
              {chatId && <Balance chatId={chatId} setBalance={() => {}} language={language} animate={animate} setAnimate={setAnimate} />}
              <Button text={language === 'ru' ? "Смотреть рекламу и зарабатывать" : "Watch ads and earn"} color="#ff851b" chatId={chatId} language={language} setAnimate={setAnimate} />
              {chatId && <EchaBalance chatId={chatId} updatedEchaCoins={updatedEchaCoins} />}
              {chatId && <Farming chatId={chatId} language={language} onUpdateEcha={setUpdatedEchaCoins} />}
              <Play language={language}/>  
            </>
          } />
          <Route path="/menu" element={<MainScreen chatId={chatId} language={language}/>} />
          <Route path="/leaderboard" element={<Leaderboard telegramUsername={telegramUsername} language={language}/>} />
          <Route path="/about-game" element={<AboutGamePage language={language}/>} />
          <Route path="/donation-notification" element={<DonationNotification language={language}/>} />
          <Route path="/donation-page" element={<DonationPage language={language}/>} />
          <Route path="/confirmation-page" element={<ConfirmationPage language={language}/>} />
          <Route path="/thank-you-page" element={<ThankYouPage chatId={chatId} language={language} setAnimate={setAnimate} />} />
        </Routes>
      </AppContent>
    </AppContainer>
  );
};

const App = () => (
  <TonConnectUIProvider 
    manifestUrl="https://raw.githubusercontent.com/daanicccch/tonconnect-manifest.json/0b296931f4ab3d2fe8500ccea215f5edbf4302b2/tonconnect-manifest.json"
    enableAndroidBackHandler={false} // Отключаем обработчик кнопки "назад" на Android
  >
    <Router>
      <AppContentWithRouter />
    </Router>
  </TonConnectUIProvider>
);

export default App;
