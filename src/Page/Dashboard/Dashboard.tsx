import { Button, FooterNav, Asset } from 'Components';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DashboardHeader } from './DashboardHeader';

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
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 80px;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <DashboardHeader />
      <PortfolioTitle>Portfolio Value</PortfolioTitle>
      <Value>$2,539.23</Value>
      <ButtonGroup>
        <Button variant='primary' onClick={() => navigate('./send')}>Send</Button>
        <Button variant='primary'>Receive</Button>
      </ButtonGroup>
      <AssetsTitle>My Assets</AssetsTitle>
      <AssetsContainer>
        <Asset img="hash" name="hash" amount={{ value: 500, change: 13.63 }} />
        <Asset img="usdf" name="usdf" />
        <Asset img="etf" name="etf" />
        <Asset img="inu" name="inu" />
      </AssetsContainer>
      <FooterNav />
    </>
  );
};
