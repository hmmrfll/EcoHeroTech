import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { startFarming, getFarmingStatus, updateEchaCoins } from '../services/userService';

const FarmingButtonContainer = styled.div`
  position: relative;
  width: 85%;
`;

const FarmingButton = styled.button`
  width: 100%;
  background-color: ${props => (props.isFarming ? 'rgba(111, 46, 24, 0.41)' : '#2D606C')};
  color: ${props => (props.isFarming ? '#EF8332' : '#fff')};
  border: ${props => (props.isFarming ? '1px solid #EF8332' : 'none')};
  border-radius: 20px;
  padding: 2.8vh;
  font-size: 14px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  font-family: "Inter";
  font-weight: Semi Bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const ButtonStrip = styled.div`
  width: 100%;
  height: 4vh;
  background-color: #3f6c78;
  border-radius: 0 0 20px 20px;
  position: absolute;
  bottom: -0.5vh;
  z-index: 0;
  display: ${props => (props.isFarming ? 'none' : 'block')};
`;

const TimeLeft = styled.span`
  font-size: 14px;
  color: #ff851b;
  position: absolute;
  right: 2vh;
  opacity: 0.6;
`;

const Farming = ({ chatId, onUpdateEcha, language }) => {
  const [isFarming, setIsFarming] = useState(false);
  const [minedEcha, setMinedEcha] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60); // 12 часов

  const formatTimeLeft = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleFarmingEnd = useCallback(async () => {
    const data = await updateEchaCoins(chatId, 150000); // Изменено на 150000
    if (data.success) {
      onUpdateEcha(data.echaCoins); // Обновляем ECHA в родительском компоненте
    }
  }, [chatId, onUpdateEcha]);

  useEffect(() => {
    const checkFarmingStatus = async () => {
      const data = await getFarmingStatus(chatId);
      if (data.farmingStartTime) {
        const startTime = new Date(data.farmingStartTime);
        const elapsedTime = (new Date() - startTime) / 1000;
        if (elapsedTime < 12 * 60 * 60) { // 12 часов 
          setIsFarming(true);
          setTimeLeft(12 * 60 * 60 - elapsedTime);
          setMinedEcha((elapsedTime / (12 * 60 * 60)) * 150000); // 12 часов 
        } else {
          setMinedEcha(150000);
          setIsFarming(false);
          await handleFarmingEnd();
        }
      }
    };

    checkFarmingStatus();
  }, [chatId, handleFarmingEnd]);

  useEffect(() => {
    let timer;
    if (isFarming) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 0) {
            clearInterval(timer);
            setIsFarming(false);
            setMinedEcha(150000);
            handleFarmingEnd();
            return 0;
          }
          setMinedEcha(((12 * 60 * 60 - prevTime) / (12 * 60 * 60)) * 150000); // 12 часов в секундах
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFarming, handleFarmingEnd]);

  const handleFarmingStart = async () => {
    const data = await startFarming(chatId);
    if (data.success) {
      setIsFarming(true);
      setTimeLeft(12 * 60 * 60); // 12 часов 
      setMinedEcha(0);
    }
  };

  return (
    <FarmingButtonContainer>
      <FarmingButton onClick={handleFarmingStart} disabled={isFarming} isFarming={isFarming}>
        {isFarming
          ? <>
              <span>{language === 'ru' ? `Фарминг ${minedEcha.toFixed(3)} ECHA` : `Farming ${minedEcha.toFixed(3)} ECHA`}</span>
              <TimeLeft>{formatTimeLeft(timeLeft)}</TimeLeft>
            </>
          : language === 'ru' ? 'Фармить 150 000 ECHA' : 'Farm 150,000 ECHA'}
      </FarmingButton>
      {!isFarming && <ButtonStrip />}
    </FarmingButtonContainer>
  );
};

export default Farming;
