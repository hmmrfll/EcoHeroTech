import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserByChatId } from '../services/userService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: #041523;
  border-radius: 20px;
  padding: 2vh;
  margin-bottom: 2vh;
  width: 90%;
  color: #fff;
  font-family: "Inter";
  font-weight: Regular;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1vh;
  width: 90%;
  font-family: "Inter";
  font-weight: Semi Bold;
`;

const Description = styled.p`
  font-size: 16px;
  margin-bottom: 3vh;
  width: 90%;
  font-family: "Inter";
  font-weight: Regular;
`;

const ShareButton = styled.button`
  width: 90%;
  background-color: rgba(111, 46, 24, 0.41);
  border: 1px solid #EF8332;
  color: #EF8332;
  border-radius: 15px;
  padding: 3.5vh;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  font-family: "Inter";
  font-weight: Semi Bold;
  margin-top: 2vh;
`;

const ThankYouPage = ({ chatId, language, setAnimate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount } = location.state || { amount: 0 };
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    const fetchReferralCode = async () => {
      const user = await getUserByChatId(chatId);
      setReferralCode(user.referralCode);
    };
    fetchReferralCode();
  }, [chatId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
      navigate('/', { state: { animateTransfer: true } });
    }, 3000); // Таймер перед переходом

    return () => clearTimeout(timer);
  }, [navigate, setAnimate]);

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      setAnimate(true);
      navigate('/', { state: { animateTransfer: true } });
    }
  };

  const handleInviteClick = () => {
    const referralLink = `https://t.me/ECHA_EcoHero_bot?start=ref_${referralCode}`;
    const text = language === 'ru'
      ? `Я пожертвовал ${amount.toFixed(2)} ₽ в поддержку животных через EcoHero! Присоединяйтесь ко мне и вдохновите других на добрые дела!`
      : `I donated ${amount.toFixed(2)} $ to support animals through EcoHero! Join me and inspire others to do good deeds!`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <ModalOverlay onClick={handleClickOutside}>
      <ModalContainer>
        <Title>{language === 'ru' ? 'Благодарим за пожертвование!' : 'Thank you for your donation!'}</Title>
        <Description>
          {language === 'ru'
            ? `Я пожертвовал ${amount.toFixed(2)} ₽ в поддержку животных через EcoHero! Присоединяйтесь ко мне и вдохновите других на добрые дела!`
            : `I donated ${amount.toFixed(2)} $ to support animals through EcoHero! Join me and inspire others to do good deeds!`}
        </Description>
        <ShareButton onClick={handleInviteClick}>{language === 'ru' ? 'Поделиться' : 'Share'}</ShareButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ThankYouPage;
