import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 20px;
  background-color: rgba(0,0,0,0.3);
  text-align: center;
  color: #fff;
  a {
    color: #fff;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      Stardew Valley Craftables Calculator - For bug report please report issue <a href="https://github.com/felixsusanto/stardew-craft-calculator/issues">here</a><br />
      Stardew Valley is developed by <a href="http://twitter.com/concernedape">ConcernedApe</a>
    </FooterContainer>
  );
};

export default Footer;

