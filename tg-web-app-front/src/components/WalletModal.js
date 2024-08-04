import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.01);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Align items to the bottom */
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #041523;
  padding: 2rem;
  border-radius: 15px 15px 0 0; /* Round only the top corners */
  color: #fff;
  text-align: center;
  width: 80%; /* Full width */
  position: relative;
  margin: 0; /* Remove default margin */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
`;

const WalletInfo = styled.div`
  margin-top: 1rem;
  background: #2d606c;
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const DisconnectButton = styled.button`
  background: #ef8332;
  border: none;
  border-radius: 10px;
  width: 100%;
  padding: 1rem 1rem;
  cursor: pointer;
  color: black;
  font-size: 1rem;
  margin-top: 1rem;
`;

const CopyMessage = styled.span`
  position: absolute;
  bottom: -1rem;
  right: 0;
  font-size: 0.8rem;
  color: #ef8332;
`;

const WalletModal = ({ wallet, onClose, onDisconnect }) => {
  const [copyMessage, setCopyMessage] = useState('');

  const handleCopyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet).then(() => {
        setCopyMessage('Адрес скопирован!');
        setTimeout(() => setCopyMessage(''), 2000);
      }).catch(() => {
        setCopyMessage('Ошибка копирования');
        setTimeout(() => setCopyMessage(''), 2000);
      });
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Ваш кошелек</h2>
        <WalletInfo onClick={handleCopyAddress}>
          <span>{wallet ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}` : ''}</span>
          <span  style={{ cursor: 'pointer' }}>The Open Network</span>
          {copyMessage && <CopyMessage>{copyMessage}</CopyMessage>}
        </WalletInfo>
        <DisconnectButton onClick={onDisconnect}>Отключить кошелек</DisconnectButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default WalletModal;
