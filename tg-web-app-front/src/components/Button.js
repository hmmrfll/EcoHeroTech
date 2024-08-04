import React from 'react';
import styled from 'styled-components';
import { handleShowAd } from '../services/adsgram';
import { useNavigate } from 'react-router-dom';

const StyledButton = styled.button`
  display: block;
  width: 85%;
  margin: 2vh 0 0vh 0;
  padding: 3vh;
  background-color: #EF8332;
  color: black;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
`;

const Button = ({ text, color, chatId, language, setAnimate }) => {
  const navigate = useNavigate();

  const handleAdClick = async () => {
    await handleShowAd(chatId, language, setAnimate, navigate);
  };

  return (
    <StyledButton color={color} onClick={handleAdClick}>
      {text}
    </StyledButton>
  );
};

export default Button;
