import { Button } from 'Components';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getKey } from 'utils';
import { Carousel } from './Carousel';
import { WalletConnect } from 'Components';

const TextButton = styled.a`
  color: white;
  font-size: 1.4rem;
  margin-top: 32px;
  cursor: pointer;
  font-family: 'Gothic A1', sans-serif;
`;

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const savedKey = getKey();
  return (
    <>
      <WalletConnect />
      <Carousel />
      {savedKey ? (
        <Button variant="primary" onClick={() => navigate('/unlock')}>
          Unlock
        </Button>
      ) : (
        <Button variant="primary" onClick={() => navigate('/create')}>
          Create Wallet
        </Button>
      )}
      <TextButton onClick={() => navigate('/recover')}>Recover Wallet</TextButton>
    </>
  );
};
