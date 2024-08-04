import React from 'react';
import styled from 'styled-components';

const PlayContainer = styled.div`
  width: 85%;
  height: 20vh;
  background-image: url('/main-page/play-img.png'); 
  background-size: cover;
  background-position: center;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 2vh;
  overflow: hidden;
`;

const PlayText = styled.h1`
  color: white;
  font-size: 24px;
  font-family: 'Jost', sans-serif;
  position: absolute;
  bottom: 0.1vh;
  left: 3vh;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 2vh;
  right: 3vh;
  display: flex;
  align-items: flex-end;
  opacity: 0.8;
`;

const SoonButton = styled.button`
  background-color: rgba(63, 108, 120, 1); 
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 1vh 4vh;
  font-size: 18px;
  cursor: not-allowed; 
  font-family: 'Inter', sans-serif;
  position: relative;
  z-index: 1;
`;

const ButtonStrip = styled.div`
  width: 100%;
  height: 3vh;
  background-color:  #40555F;
  border-radius: 0 0 20px 20px;
  position: absolute;
  bottom: -0.5vh;
  right: 0;
  z-index: 0;
`;

const Play = ({ language }) => (
  <PlayContainer>
    <PlayText>{language === 'ru' ? "Играть" : "Play"}</PlayText>
    <ButtonWrapper>
      <SoonButton>{language === 'ru' ? "Скоро" : "Soon"}</SoonButton>
      <ButtonStrip />
    </ButtonWrapper>
  </PlayContainer>
);

export default Play;
