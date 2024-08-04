import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';

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
  padding: 5vh;
  margin-bottom: 2vh;
  width: 76%;
  color: #fff;
  font-family: "Inter";
  font-weight: Regular;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const RewardTextContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: 1rem 0;
`;

const AmountText = styled.div`
  font-size: 24px;
`;

const EchaText = styled.div`
  font-size: 24px;
  opacity: 0.5;
`;

const StyledH2 = styled.h2`
  font-size: 24px;
  margin: 1rem 0;
  font-family: "Inter";
  font-weight: Semi Bold;
`;

const StyledP = styled.p`
  font-size: 14px;
  text-align: left;
  margin: 1rem 0;
  font-family: "Inter";
  font-weight: Regular;
`;

const CloseButton = styled.button`
  background: #ef8332;
  border: none;
  border-radius: 15px;
  color: black;
  cursor: pointer;
  font-size: 1rem;
  width: 100%; 
  padding: 3vh;
  margin-top: 2vh;
`;

const DonationNotification = ({ language }) => {
  const location = useLocation();
  const { amount = 0, echaCoins = 0 } = location.state || {};

  return (
    <ModalOverlay>
      <ModalContainer>
        <RewardTextContainer>
          <AmountText>+{amount.toFixed(2)} ₽</AmountText>
          <EchaText>+{echaCoins} ECHA</EchaText>
        </RewardTextContainer>
        <StyledH2>{language === 'ru' ? 'Спасибо за просмотр!' : 'Thank you for watching!'}</StyledH2>
        <StyledP>
          {language === 'ru'
            ? 'Вы можете пожертвовать заработанные средства за просмотр рекламы на помощь животным. Все отчеты мы публикуем у нас на канале и на сайте.'
            : 'You can donate the earnings from watching ads to help animals. We publish all reports on our channel and website.'}
        </StyledP>
        <CloseButton onClick={() => window.history.back()}>
          {language === 'ru' ? 'Пожертвовать' : 'Donate'}
        </CloseButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DonationNotification;
