import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getTopDonors, getDonationsByUsername } from '../services/userService';
import BackButton from './BackButton';

const LeaderboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #fff;
  width: 100%;
  overflow-y: auto; 
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Logo = styled.h1`
  color: #fff;
  margin:  2vh 0vh 1vh 4vh;
  display: flex;
  padding: 0;
  align-items: center;
  font-family: 'Jost', Bold;
`;

const TopThreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4vh 0 4vh 0;
  width: 90%;
  background-color: rgba(45, 96, 108, 0.5);
  border-radius: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  color: #fff;
  position: relative;
  text-align: center;
`;

const WeekLabel = styled.h2`
  font-size: 12px;
  text-align: left;
  margin-left: 3vh;
  margin-top: -10.8vh;
  font-family: "Inter";
  font-weight: Regular;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 13vh;
  text-align: left;
  margin-left: 3vh;
  margin-top: -2vh;
  font-family: "Inter";
  font-weight: Semi Bold;
`;

const TopUsersContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const TopUser = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  position: relative;
  margin-top: 2vh;
  ${props => props.isTop1 && `
    order: 0;
    transform: translateY(-20px);
  `}
`;

const TopUserImageContainer = styled.div`
  position: relative;
  width: 13vh;
  height: 13vh;
  margin-bottom: 10px;
  border: 1px solid black; 
  border-radius: 50%;
`;

const TopUserImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const Crown = styled.img`
  width: 7vh;
  height: 7vh;
  position: absolute;
  top: -5.2vh;
  left: 50%;
  transform: translateX(-50%);
`;

const RankBadge = styled.img`
  width: 4vh;
  height: 4.2vh;
  position: absolute;
  bottom: 9vh;
  right: -1vh;
`;

const TopUserName = styled.span`
  font-size: 1rem;
  font-family: "Inter";
  font-weight: Semi Bold;
  text-align: center;
`;

const TopUserAmount = styled.span`
  font-size: 0.8rem;
  margin-top: 1vh;
  color: #fff;
  font-family: "Inter";
  font-weight: Semi Bold;
  text-align: center;
`;

const UserList = styled.div`
  width: 90%;
  margin: 2vh;
  max-height: 22vh; 
  overflow-y: scroll; 
  scrollbar-width: none;
  -ms-overflow-style: none;
  border-radius: 15px; 
  
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const UserListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #274a5e;
  margin-bottom: 0;
  border-bottom: 1px solid #2d606c;

`;

const UserListRank = styled.span`
  font-size: 1rem;
  margin-right: 2vh;
  font-family: "Inter";
  font-weight: Semi Bold;
`;

const UserListAvatar = styled.img`
  width: 4vh;
  height: 4vh;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserListName = styled.span`
  font-size: 1rem;
  font-family: "Inter";
  font-weight: Semi Bold;
  flex-grow: 1;
`;

const UserListAmount = styled.span`
  font-size: 0.8rem;
  color: #fff;
  font-family: "Inter";
  font-weight: Semi Bold;
`;

const DonationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2vh;
  background-color: rgba(45, 96, 108, 0.5);
  border-radius: 20px;
  width: 90%;
  padding: 2vh 0 2vh 0;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
`;

const DonationAvatar = styled.img`
  width: 12vh;
  height: 12vh;
  border-radius: 50%;
  position: relative;
  padding-left: 3vh;
  margin-right: 10px;
`;

const DonationRankBadge = styled.div`
  display: flex;
  font-size: 20px;
  font-family: "Inter";
  font-weight: Semi Bold;
  justify-content: center;
  align-items: center;
  width: 4vh;
  height: 4vh;
  background-image: ${props => props.isTop1 ? 'url(/leaderboard-page/numberRank1.png)' : 'url(/leaderboard-page/numberBg.png)'};
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  color: #fff;
  margin-left: 2vh;
  margin-bottom: 8vh;
  position: absolute;
`;

const DonationInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const DonationUserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const DonationUsername = styled.span`
  font-size: 14px;
  text-align: left;
  font-family: "Inter";
  font-weight: Semi Bold;
`;

const DonationText = styled.span`
  font-size: 12px;
  color: #fff;
  padding-top:2vh;
  padding-right:3vh;
  text-align: left;
  font-family: "Inter";
  font-weight: Regular;
`;

const DonationAmount = styled.span`
  font-size: 0.8rem;
  color: #fff;
  padding-right:5vh;
  text-align: right;
  font-family: "Inter";
  font-weight: Semi Bold;
`;

const Leaderboard = ({ telegramUsername, language }) => {
  const [topUsers, setTopUsers] = useState([]);
  const [userDonation, setUserDonation] = useState(0);
  const [user, setUser] = useState(null);

  const fetchTopDonors = useCallback(async () => {
    const response = await getTopDonors();
    setTopUsers(response);
  }, []);

  const fetchUserDonations = useCallback(async () => {
    if (telegramUsername) {
      const response = await getDonationsByUsername(telegramUsername);
      setUserDonation(response.donated);
      setUser(response);
    }
  }, [telegramUsername]);

  useEffect(() => {
    fetchTopDonors();
  }, [fetchTopDonors]);

  useEffect(() => {
    fetchUserDonations();
  }, [fetchUserDonations]);

  const reorderedTopThree = [
    topUsers[1],
    topUsers[0],
    topUsers[2]
  ];

  const badgeOrder = [1, 0, 2];

  return (
    <LeaderboardContainer>
      <HeaderContainer>
        <BackButton />
        <Logo>EcoHero</Logo>
      </HeaderContainer>
      <TopThreeContainer>
        <Title>{language === 'ru' ? "Таблица лидеров пожертвований" : "Donation Leaderboard"}</Title>
        <WeekLabel>{language === 'ru' ? "Неделя" : "Week"}</WeekLabel>
        <TopUsersContainer>
          {reorderedTopThree.map((user, index) => (
            user && (
              <TopUser key={user._id} isTop1={index === 1}>
                <TopUserImageContainer>
                  <TopUserImage src={user.profilePhoto} alt={`User ${user.username}`} />
                  {index === 1 && <Crown src={`/leaderboard-page/crown.png`} alt="Crown" />}
                  <RankBadge src={`/leaderboard-page/rank${badgeOrder[index] + 1}.png`} alt={`Rank ${badgeOrder[index] + 1}`} />
                </TopUserImageContainer>
                <TopUserName>{user.username}</TopUserName>
                <TopUserAmount>{user.donated.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ₽</TopUserAmount>
              </TopUser>
            )
          ))}
        </TopUsersContainer>
      </TopThreeContainer>
      {user && (
        <DonationContainer>
          <DonationAvatar src={user.profilePhoto} alt={`Avatar of ${user.username}`} />
          <DonationRankBadge>{user.rank}</DonationRankBadge>
          <DonationInfo>
            <DonationUserInfo>
              <DonationUsername>{user.username} {language === 'ru' ? "(Я)" : "(Me)"}</DonationUsername>
              <DonationAmount>{userDonation.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ₽</DonationAmount>
            </DonationUserInfo>
            <DonationText>{language === 'ru' ? "В этом месяце вы поддержали животных на сумму" : "This month you supported animals with the amount of"}</DonationText>
          </DonationInfo>
        </DonationContainer>  
      )}
      <UserList>
        {topUsers.slice(3).map((user, index) => (
          <UserListItem key={user._id} index={index}>
            <UserListRank>{index + 4}</UserListRank>
            <UserListAvatar src={user.profilePhoto} alt={`Avatar of ${user.username}`} />
            <UserListName>{user.username}</UserListName>
            <UserListAmount>{user.donated.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ₽</UserListAmount>
          </UserListItem>
        ))}
      </UserList>
    </LeaderboardContainer>
  );
};

export default Leaderboard;
