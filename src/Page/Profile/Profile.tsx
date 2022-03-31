import { Title, FooterNav } from 'Components';
import styled from 'styled-components';
import bg from 'images/bg.png';

const Wrapper = styled.div`
  padding: 42px 16px;
  background: url(${bg}) no-repeat;
  background-size: cover;
  display: flex;
  height: 100vh;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: 'Montserrat', 'sans-serif';
  box-sizing: border-box;
  z-index: 10;
`;

export const Profile = () => {

  return (
    <>
      <Wrapper>
        <Title size="1.6rem" weight={600}>Profile</Title>
      </Wrapper>
      <FooterNav />
    </>
  );
};
