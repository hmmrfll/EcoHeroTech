import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Jost";
  padding: 1vh 1vh 0;
  width: 100%;
`;

const Logo = styled.h1`
  color: #fff;
  margin: 0; 
  padding: 0 5vh;
`;

const MenuIcon = styled.div`
  background: url('/main-page/menu-icon.png') no-repeat center center;
  background-size: contain;
  width: 6vh;
  height: 6vh;
  padding: 0 5vh;
  cursor: pointer;
`;

const Header = () => {
  const navigate = useNavigate(); 

  const handleMenuClick = () => {
    navigate('/menu');
  };

  return (
    <HeaderContainer>
      <Logo>EcoHero</Logo>
      <MenuIcon onClick={handleMenuClick} />
    </HeaderContainer>
  );
};

export default Header;
