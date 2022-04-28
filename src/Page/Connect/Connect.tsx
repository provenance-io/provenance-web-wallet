import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Sprite } from 'Components';
import { DASHBOARD_URL, ICON_NAMES } from 'consts';
import { useWalletConnect } from 'services';
import { useEffect } from 'react';

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

// VIG RETURN HERE: FOR SOME REASON THE URL IS GETTING CHANGED AFTER LOADING.
// URL SHOULD LOAD, DATA PULLED, URL SEARCH PARAMS CLEARED, AND CONNECTION CREATED

export const Connect:React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { walletConnectService, walletConnectState } = useWalletConnect();
  const { connected } = walletConnectState;
  const walletConnectUriEncoded = searchParams.get('wc');
  if (!walletConnectUriEncoded) navigate(DASHBOARD_URL);
  const walletConnectUri = decodeURIComponent(walletConnectUriEncoded!);
  console.log('walletConnectUri: ', {walletConnectUri});
  useEffect(() => {
    if (!connected && walletConnectUri) {
      walletConnectService.createConnection(walletConnectUri);
      // Clear out the search params
      setSearchParams('');
    } else {
    }
  }, [walletConnectUri, walletConnectService, connected, setSearchParams]);

  const handleApprove = () => {
    // TODO: Add approve actions
    // onClick();
  }

  const handleDecline = () => {
    navigate('/dashboard');
  }

  return (
    <Container>
      <Title>Connection Request</Title>
      <SubTitle>
        Allow connection to localhost:3000?
      </SubTitle>
      <Sprite icon={ICON_NAMES.CHECK} />
        <Button variant='primary' onClick={handleApprove}>Approve</Button>
        <Button variant='transparent' onClick={handleDecline}>Reject</Button>
    </Container>
  );
};