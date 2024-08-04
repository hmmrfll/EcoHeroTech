import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { getReferrals, checkUserPremiumStatus } from '../services/userService';

const ModalOverlay = styled.div`
  position: fixed;
  margin-bottom: 3vh;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.01);
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
  overflow: hidden;
`;

const InviteButton = styled.button`
  background: #ef8332;
  border: none;
  border-radius: 10px;
  padding: 1rem;
  color: #fff;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const InviteButtonContainer = styled.div`
  width: 100%;
  margin-bottom: 1vh;
  border-bottom: 1px solid #3f6c78;
  padding-bottom: 1vh;
`;

const FriendsList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 0vh;
`;

const FriendItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
`;

const ReferralCount = styled.p`
  font-size: 14px;
  font-family: "Inter";
  font-weight: "Regular";
  margin-top: 1vh;
`;

const FriendsModal = ({ isOpen, onClose, chatId, referralCode, language }) => {
  const [referrals, setReferrals] = useState([]);

  const fetchReferrals = useCallback(async () => {
    const data = await getReferrals(chatId);
    const updatedReferrals = await Promise.all(
      data.referrals.map(async (username) => {
        const premiumStatus = await checkUserPremiumStatus(username);
        return { username, isPremium: premiumStatus };
      })
    );
    setReferrals(updatedReferrals);
  }, [chatId]);

  useEffect(() => {
    if (isOpen) {
      fetchReferrals();
    }
  }, [isOpen, fetchReferrals]);

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInviteClick = () => {
    const referralLink = `https://t.me/ECHA_EcoHero_bot?start=ref_${referralCode}`;
    const text = language === 'ru' 
      ? "Присоединяйтесь к EcoHero, чтобы помогать животным по всему миру!" 
      : "Join EcoHero to help animals around the world!";
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClickOutside}>
      <ModalContainer>
        <h2>{language === 'ru' ? 'Друзья' : 'Friends'}</h2>
        <p>{language === 'ru' 
          ? '+10000 ECHA за приглашенного друга. В 3 раза больше очков за друга с премиум аккаунтом!' 
          : '+10000 ECHA for each invited friend. 3x more points for a friend with a premium account!'}</p>
        <InviteButtonContainer>
          <InviteButton onClick={handleInviteClick}>
            {language === 'ru' ? 'Пригласить друзей' : 'Invite Friends'}
          </InviteButton>
        </InviteButtonContainer>
        <ReferralCount>{language === 'ru' ? `Вы пригласили друзей: ${referrals.length}` : `You invited friends: ${referrals.length}`}</ReferralCount>
        <FriendsList>
          {referrals.length > 0 ? referrals.map((friend, index) => (
            <FriendItem key={index}>
              <span>{friend.username}</span>
              <span>{friend.isPremium ? (language === 'ru' ? '+30000 ECHA' : '+30000 ECHA') : (language === 'ru' ? '+10000 ECHA' : '+10000 ECHA')}</span>
            </FriendItem>
          )) : <p>{language === 'ru' ? 'Нет друзей' : 'No friends'}</p>}
        </FriendsList>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default FriendsModal;
