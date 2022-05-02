import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Sprite } from 'Components';
import { DASHBOARD_URL, ICON_NAMES, CHAINID_TESTNET } from 'consts';
import { useEffect } from 'react';
import { useWalletConnect, useAccount } from 'redux/hooks';

const Container = styled.div`
  width: 100%;
  font-family: 'Gothic A1', sans-serif;
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  button {
    margin: 10px 0;
  }
`;
const Title = styled.div`
  font-weight: 600;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.32em;
  line-height: 20px;
  font-size: 1.6rem;
  text-align: center;
  margin-bottom: 20px;
`;
const SubTitle = styled.div`
  font-weight: 400;
  font-family: 'Gothic A1', sans-serif;
  letter-spacing: 0.04em;
  font-size: 1.4rem;
  line-height: 160%;
`;

interface LocationState {
  payload: any
}

export const Connect:React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { payload } = state as LocationState;
  const { connector } = useWalletConnect();
  const { accounts, activeAccountIndex } = useAccount();
  const activeAccount = accounts[activeAccountIndex];

  useEffect(() => {
    if (!connector) {
      console.log('Connect | No URI | Navigating to Dashboard');
      navigate(DASHBOARD_URL);
    }
  }, [
    connector,
    navigate,
  ]);

  const handleApprove = () => {
    if (connector) {
      const data = {
        chainId: CHAINID_TESTNET,
        accounts: [{
          publicKey: activeAccount.publicKey,
          address: activeAccount.address,
          jwt: `${btoa('123')}.${btoa('456')}.${btoa('789')}`,
          walletInfo: {
            id: 'id',
            name: activeAccount.accountName,
            coin: 'coin'
          }
        }],
      };
      connector.approveSession(data as any);
    }
  }

  const handleDecline = () => {
    if (connector && payload) {
      connector.rejectSession(payload);
    }
    navigate(DASHBOARD_URL);
  }

  return (
    <Container>
      <Title>Connection Request</Title>
      <SubTitle>
        Allow connection to localhost:3000?
      </SubTitle>
      <Sprite icon={ICON_NAMES.CHECK} />
        <Button onClick={handleApprove}>Approve</Button>
        <Button variant='transparent' onClick={handleDecline}>Reject</Button>
    </Container>
  );
};