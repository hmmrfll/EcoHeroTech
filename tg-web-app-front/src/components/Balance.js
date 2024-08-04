import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Удален useLocation
import { getUserByChatId } from '../services/userService';

const BalanceContainer = styled.div`
  padding: 1.5vh;
  width: 80%;
  background-color: rgba(45, 96, 108, 0.5);
  border-radius: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  color: #fff;
  position: relative;
  text-align: center;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1vh;
`;

const AvatarIcon = styled.div`
  background-color: #4c657d;
  width: 8vh;
  height: 8vh;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WalletBalanceContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  color: #fff;
  margin-left: 10px;
`;

const WalletBalanceText = styled.span`
  margin-left: 10px;
  font-size: 14px;
  transition: color 0.5s, transform 0.5s;
  &.balance-update {
    color: #4caf50;
    transform: scale(1.1);
  }
`;

const BalanceBoxContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.3vh;
`;

const BalanceBox = styled.div`
  flex: 1;
  background-color: rgba(4, 21, 35, 0.8);
  border-radius: 20px;
  padding: 4vh 3vh;
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
`;

const BalanceText = styled.p`
  margin: 0;
  font-size: 14px;
`;

const BalanceTextCount = styled.p`
  margin: 0;
  font-size: 16px;
  transition: color 0.5s, transform 0.5s;
  &.balance-update {
    color: #4caf50;
    transform: scale(1.1);
  }
`;

const DonatedTextCount = styled.p`
  font-size: 16px;
  margin: 0;
  transition: color 0.5s, transform 0.5s;
  &.donated-update {
    color: #4caf50;
    transform: scale(1.1);
  }
`;

const DonateButtonContainer = styled.div`
  position: relative;
  margin-top: 1vh;
`;

const DonateButton = styled.button`
  width: 100%;
  background-color: #2D606C;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 1.8vh;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  font-family: "Inter";
  margin-bottom: 1vh;
`;

const ButtonStrip = styled.div`
  width: 100%;
  height: 4vh;
  background-color: #3f6c78;
  border-radius: 0 0 20px 20px;
  position: absolute;
  bottom: 0.1vh;
  z-index: 0;
`;

const Balance = ({ chatId, setBalance, language, animate, setAnimate }) => {
  const [userData, setUserData] = useState({ balance: 0, donated: 0, echaCoins: 0, profilePhoto: '' });
  const [displayBalance, setDisplayBalance] = useState('0.00');
  const navigate = useNavigate();
  const previousBalance = useRef('0.00');
  const previousDonated = useRef('0.00');
  const [showBalanceAnimation, setShowBalanceAnimation] = useState(false);
  const [showDonatedAnimation, setShowDonatedAnimation] = useState(false);

  const animateBalanceChange = useCallback((start, end) => {
    const duration = 2000; // Продолжительность анимации в миллисекундах
    const startTime = performance.now();

    const step = (currentTime) => {
      const progress = (currentTime - startTime) / duration;
      const value = progress * (end - start) + parseFloat(start);
      setDisplayBalance(formatBalance(value, language));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayBalance(formatBalance(parseFloat(end), language));
      }
    };

    requestAnimationFrame(step);
  }, [language]);

  const animateDonatedChange = useCallback((start, end) => {
    const duration = 2000; // Продолжительность анимации в миллисекундах
    const startTime = performance.now();

    const step = (currentTime) => {
      const progress = (currentTime - startTime) / duration;
      const value = progress * (end - start) + parseFloat(start);
      setUserData((prevData) => ({
        ...prevData,
        donated: formatBalance(value, language),
      }));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setUserData((prevData) => ({
          ...prevData,
          donated: formatBalance(parseFloat(end), language),
        }));
      }
    };

    requestAnimationFrame(step);
  }, [language]);

  const fetchData = useCallback(async (animate) => {
    try {
      const data = await getUserByChatId(chatId);
      const newBalance = parseFloat(data.balance).toFixed(language === 'ru' ? 2 : 4);
      const newDonated = parseFloat(data.donated).toFixed(language === 'ru' ? 2 : 4);

      setUserData({ ...data, chatId });

      if (newBalance !== previousBalance.current) {
        if (animate) {
          animateBalanceChange(previousBalance.current, newBalance);
        } else {
          setDisplayBalance(newBalance);
        }
        setBalance(newBalance);
        previousBalance.current = newBalance;
        setShowBalanceAnimation(animate);
      } else {
        setDisplayBalance(newBalance);
      }

      if (newDonated !== previousDonated.current) {
        if (animate) {
          animateDonatedChange(previousDonated.current, newDonated);
        } else {
          setUserData((prevData) => ({
            ...prevData,
            donated: newDonated,
          }));
        }
        previousDonated.current = newDonated;
        setShowDonatedAnimation(animate);
      }
    } catch (error) {
      setUserData({ balance: 'Error', donated: 'Error', echaCoins: 'Error', profilePhoto: '', chatId: null });
    }
  }, [chatId, language, setBalance, animateBalanceChange, animateDonatedChange]);

  useEffect(() => {
    if (chatId) {
      fetchData(animate);
    }
    if (animate) {
      setAnimate(false);
    }
  }, [chatId, animate, setAnimate, fetchData]);

  useEffect(() => {
    if (showBalanceAnimation) {
      const balanceElements = document.querySelectorAll('.balance');
      balanceElements.forEach((element) => {
        element.classList.add('balance-update');
        setTimeout(() => {
          element.classList.remove('balance-update');
        }, 500); // Длительность анимации в миллисекундах
      });
      setShowBalanceAnimation(false);
    }
  }, [displayBalance, showBalanceAnimation]);

  useEffect(() => {
    if (showDonatedAnimation) {
      const donatedElements = document.querySelectorAll('.donated');
      donatedElements.forEach((element) => {
        element.classList.add('donated-update');
        setTimeout(() => {
          element.classList.remove('donated-update');
        }, 500); // Длительность анимации в миллисекундах
      });
      setShowDonatedAnimation(false);
    }
  }, [userData.donated, showDonatedAnimation]);

  const formatBalance = (number, lang) => {
    return lang === 'ru' ? parseFloat(number).toFixed(2) : parseFloat(number).toFixed(4);
  };

  const handleDonateClick = () => {
    navigate('/donation-page', { state: { balance: formatBalance(userData.balance, language), chatId: userData.chatId, language } });
  };

  return (
    <BalanceContainer>
      <IconContainer>
        <AvatarIcon>
          <img src={userData.profilePhoto || "/main-page/avatar.png"} alt="avatar" style={{ width: '100%', height: '100%' }} />
        </AvatarIcon>
        <WalletBalanceContainer>
          <img src="/main-page/wallet.png" alt="wallet" style={{ width: '5vh', height: '5vh' }} />
          <WalletBalanceText className="balance">{formatBalance(displayBalance, language)} {language === 'ru' ? '₽' : '$'}</WalletBalanceText>
        </WalletBalanceContainer>
      </IconContainer>
      <BalanceBoxContainer>
        <BalanceBox>
          <BalanceTextCount className="balance">{formatBalance(displayBalance, language)} {language === 'ru' ? '₽' : '$'}</BalanceTextCount>
          <BalanceText>{language === 'ru' ? "Вы заработали" : "You earned"}</BalanceText>
        </BalanceBox>
        <BalanceBox>
          <DonatedTextCount className="donated">{formatBalance(userData.donated, language)} {language === 'ru' ? '₽' : '$'}</DonatedTextCount>
          <BalanceText>{language === 'ru' ? "Пожертвовано за все время" : "Donated all time"}</BalanceText>
        </BalanceBox>
      </BalanceBoxContainer>
      <DonateButtonContainer>
        <DonateButton onClick={handleDonateClick}>{language === 'ru' ? "Пожертвовать" : "Donate"}</DonateButton>
        <ButtonStrip />
      </DonateButtonContainer>
    </BalanceContainer>
  );
};

export default Balance;
