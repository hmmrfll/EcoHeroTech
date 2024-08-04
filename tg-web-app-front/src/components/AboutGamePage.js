import React from 'react';
import styled from 'styled-components';
import BackButton from './BackButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-family: "Inter";
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  padding: 0 20px;
`;

const Header = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  margin-left: 4vh;
  margin-bottom: 1vh;
  font-family: "Jost";
  font-weight: Bold;
`;

const Description = styled.p`
  font-size: 12px;
  text-align: left;
  margin-left: 2vh;
  font-family: "Inter";
  font-weight: Regular;
  width: 90%;
`;

const JoinButton = styled.button`
  background-color: #EF8332;
  color: black;
  border: none;
  border-radius: 15px;
  padding: 2vh;
  width: 90%;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 1vh;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CentralImage = styled.img`
  height: 65vh;
`;

const AboutGamePage = ({ language }) => {
  const handleJoinClick = () => {
    window.open('https://t.me/fondlesnikov', '_blank');
  };

  return (
    <Container>
      <HeaderContainer>
        <BackButton />
        <Header>EcoHero</Header>
      </HeaderContainer>
      <Description>
        {language === 'ru' 
          ? 'Смотрите рекламу, зарабатывая в твердой валюте, отправляя на помощь животным. Все отчеты, куда потрачены средства, можно посмотреть в нашей группе.'
          : 'Watch ads, earning in hard currency, sending it to help animals. All reports on where the funds are spent can be viewed in our group.'}
      </Description>
      <JoinButton onClick={handleJoinClick}>
        {language === 'ru' ? 'Вступить в группу' : 'Join the group'}
      </JoinButton>
      <ImageContainer>
        <CentralImage src="/about-page/central-image.png" alt="Central" />
      </ImageContainer>
    </Container>
  );
};

export default AboutGamePage;
