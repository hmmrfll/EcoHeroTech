import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateUserBalanceAndDonated } from '../services/userService';

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
  margin-bottom: 4vh;
  text-align: left;
  width: 90%;
  font-family: "Inter";
  font-weight: Semi Bold;
`;

const AmountContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: 90%;
  font-size: 18px;
  margin-bottom: 1vh;
`;

const AmountTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AmountText = styled.span`
  font-size: 24px;
  text-align: right;
  font-family: "Inter";
  font-weight: Bold;
  margin-right: 1rem;
  margin-bottom: 0vh;
`;

const AmountDescription = styled.span`
  margin-left: 1rem;
  font-size: 12px;
  text-align: left;
  font-family: "Inter";
  font-weight: Regular;
`;

const SemiTransparentHR = styled.hr`
  width: 90%;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: -0.2vh 0 0 0;
`;

const CloseButton = styled.button`
  background: #ef8332;
  border: none;
  border-radius: 15px;
  padding: 3vh;
  color: black;
  cursor: pointer;
  font-size: 14px;
  font-family: "Inter";
  font-weight: Regular;
  width: 90%; 
  margin-top: 2vh;
  margin-bottom: 3vh;
`;

const ConfirmationPage = ({ language }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { originalAmount, doubledAmount, chatId } = location.state || {};

  const handleDonate = async () => {
    await updateUserBalanceAndDonated(chatId, originalAmount);
    navigate('/thank-you-page', { state: { amount: originalAmount, chatId } }); 
  };

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      window.history.back();
    }
  };

  const currencySymbol = language === 'ru' ? '₽' : '$';
  const formatAmount = (amount) => language === 'ru' ? amount.toFixed(2) : amount.toFixed(4);

  return (
    <ModalOverlay onClick={handleClickOutside}>
      <ModalContainer>
        <Title>{language === 'ru' ? 'Вклад EcoHero' : 'EcoHero Contribution'}</Title>
        <AmountContainer>
          <AmountTextContainer>
            <AmountText>&nbsp;{formatAmount(originalAmount)} {currencySymbol}</AmountText>
          </AmountTextContainer>
          <AmountDescription>{language === 'ru' ? 'Ваше пожертвование' : 'Your Donation'}</AmountDescription>
        </AmountContainer>
        <AmountContainer>
          <AmountTextContainer>
            <AmountText>+ {formatAmount(originalAmount)} {currencySymbol}</AmountText>
          </AmountTextContainer>
          <AmountDescription>{language === 'ru' ? 'Вклад EcoHero' : 'EcoHero Contribution'}</AmountDescription>
        </AmountContainer>
        <SemiTransparentHR />
        <AmountContainer>
          <AmountTextContainer>
            <AmountText>= {formatAmount(doubledAmount)} {currencySymbol}</AmountText>
          </AmountTextContainer>
          <AmountDescription>{language === 'ru' ? 'Всего' : 'Total'}</AmountDescription>
        </AmountContainer>
        <CloseButton onClick={handleDonate}>{language === 'ru' ? 'Пожертвовать' : 'Donate'}</CloseButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ConfirmationPage;
