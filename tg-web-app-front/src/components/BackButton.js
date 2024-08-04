import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const BackButtonContainer = styled.div`
  position: absolute;
  top: 3vh;
  right: 3vh;
  cursor: pointer;
`;

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <BackButtonContainer onClick={() => navigate('/')}>
      <img src="./menu-page/back.png" alt="Back" style={{ width: '30px', height: '30px' }} />
    </BackButtonContainer>
  );
};

export default BackButton;
