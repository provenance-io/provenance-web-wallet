import { useEffect, useState } from 'react';
import { Button } from 'Components';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getFromLocalStorage } from 'utils';
import { Carousel } from './Carousel';

const TextButton = styled.a`
  color: white;
  font-size: 1.4rem;
  margin-top: 32px;
  cursor: pointer;
  font-family: 'Gothic A1', sans-serif;
`;

interface LocalAccount {
  walletName?: string,
  key?: string,
}

export const Landing: React.FC = () => {
  const [localAccount, setLocalAccount] = useState<LocalAccount>({});
  const navigate = useNavigate();

  // On load, check to see if the user has an account in localStorage
  useEffect(() => {
    const localAccountData = getFromLocalStorage('provenance-web-wallet');
    setLocalAccount(localAccountData);
  }, []);

  return (
    <>
      <Carousel />
      {localAccount.key ? (
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
