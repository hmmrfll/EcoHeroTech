import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { getUserByChatId } from '../services/userService';

const EchaContainer = styled.div`
  text-align: center;
  color: #fff;
  margin: 0;
  border-radius: 10px;
`;

const StyledH1 = styled.h1`
  font-size: 32px;
  font-family: "Jost";
  font-weight: Black;
  margin-top: 1vh;
  margin-bottom: 1vh;
  transition: transform 0.5s;
  &.echa-update {
    transform: scale(1.1);
  }
`;

const SemiTransparentSpan = styled.span`
  opacity: 0.5;
`;

const EchaBalance = ({ chatId }) => {
  const [echaCoins, setEchaCoins] = useState(0);
  const previousEchaCoins = useRef(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const location = useLocation();

  const fetchData = useCallback(async (animate = false) => {
    const data = await getUserByChatId(chatId);
    const newEchaCoins = parseFloat(data.echaCoins);
    if (newEchaCoins !== previousEchaCoins.current) {
      if (animate) {
        animateEchaChange(previousEchaCoins.current, newEchaCoins);
      } else {
        setEchaCoins(newEchaCoins);
      }
      previousEchaCoins.current = newEchaCoins;
    }
  }, [chatId]);

  useEffect(() => {
    if (chatId) {
      fetchData();
    }

    if (location.state && location.state.updatedEchaCoins !== undefined) {
      const updatedEchaCoins = parseFloat(location.state.updatedEchaCoins);
      setShowAnimation(true);
      animateEchaChange(previousEchaCoins.current, updatedEchaCoins);
      previousEchaCoins.current = updatedEchaCoins;
    }
  }, [chatId, location.state, fetchData]);

  useEffect(() => {
    if (showAnimation) {
      const echaElement = document.querySelector('.echa-balance');
      echaElement.classList.add('echa-update');
      setTimeout(() => {
        echaElement.classList.remove('echa-update');
      }, 500); 
      setShowAnimation(false);
    }
  }, [echaCoins, showAnimation]);

  const animateEchaChange = (start, end) => {
    const duration = 1000; //анимация
    const startTime = performance.now();

    const step = (currentTime) => {
      const progress = (currentTime - startTime) / duration;
      const value = progress * (end - start) + start;
      setEchaCoins(parseFloat(value.toFixed(2)));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setEchaCoins(parseFloat(end.toFixed(2)));
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <EchaContainer>
      <StyledH1 className="echa-balance">
        {new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          useGrouping: true
        }).format(echaCoins)}{' '}
        <SemiTransparentSpan>ECHA</SemiTransparentSpan>
      </StyledH1>
    </EchaContainer>
  );
};

export default EchaBalance;
