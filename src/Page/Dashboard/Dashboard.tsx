import { Button, FooterNav, Asset } from 'Components';
import styled from 'styled-components';
import bg from 'images/bg.png';
import { DashboardHeader } from './DashboardHeader';

const Wrapper = styled.div`
  padding: 42px 32px;
  background: url(${bg}) no-repeat;
  background-size: cover;
  display: flex;
  height: 100vh;
  min-height: 100%;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  font-family: 'Montserrat', 'sans-serif';
  box-sizing: border-box;
  z-index: 10;
`;
const PortfolioTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  margin-top: 40px;
  font-family: 'Gothic A1';
`;
const Value = styled.div`
  font-size: 4.4rem;
  font-weight: 300;
  line-height: 54px;
  letter-spacing: 0.02rem;
`;
const ButtonGroup = styled.div`
  display: flex;
  margin-top: 24px;
  width: 100%;
  button:first-of-type {
    margin-right: 8px;
  }
`;
const AssetsTitle = styled.div`
  margin-top: 32px;
  padding-bottom: 12px;
  font-size: 1.8rem;
  font-family: 'Gothic A1';
  font-weight: 700;
  width: 100%;
  border-bottom: 1px solid #3D4151;
`;
const AssetsContainer = styled.div`
  width: 100%;
`;

export const Dashboard = () => {

  return (
    <>
      <Wrapper>
        <DashboardHeader />
        <PortfolioTitle>Portfolio Value</PortfolioTitle>
        <Value>$2,539.23</Value>
        <ButtonGroup>
          <Button variant='primary'>Send</Button>
          <Button variant='primary'>Receive</Button>
        </ButtonGroup>
        <AssetsTitle>My Assets</AssetsTitle>
        <AssetsContainer>
          <Asset img="hash" name="hash" amount={{ value: 500, change: 13.63 }} />
          <Asset img="usdf" name="usdf" />
          <Asset img="etf" name="etf" />
          <Asset img="inu" name="inu" />
        </AssetsContainer>
      </Wrapper>
      <FooterNav />
    </>
  );
};
