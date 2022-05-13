import styled from 'styled-components';
import { useWalletConnect } from 'redux/hooks';
import { Button, Content, Header } from 'Components';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { DASHBOARD_URL, ICON_NAMES } from 'consts';
import { removeAllPendingRequests } from 'utils';

const DataRow = styled.div`
  border-top: 2px solid #2C2F3A;
  padding: 25px 8px;
  display: flex;
  justify-content: space-between;
`;
const DataContent = styled.div`
  font-size: 1.4rem;
  &:nth-child(1) {
    margin-right: 6px;
    min-width: 80px;
  }
  &:nth-child(2) {
    margin-left: 6px;
    text-align: right;
  }
`;

export const DashboardConnectionDetails:React.FC = () => {
  const { session, connector, killSession } = useWalletConnect();
  const { connected } = session;
  const navigate = useNavigate();

  // If we are not connected or there is no connector go back to the dashboard
  useEffect(() => {
    if (!connector || !connected) navigate(DASHBOARD_URL);
  }, [navigate, connector, connected]);

  const handleDisconnect = async () => {
    if (connector && connector.peerId) {
      // Kill wc session
      await connector.killSession();
    }
    // Remove wc data from redux store
    killSession();
    // Remove all pendingActions on a disconnect
    await removeAllPendingRequests();
    navigate(DASHBOARD_URL);
  };

  const renderConnectedAccounts = () => (session && session.accounts) ?
  session.accounts.map(({ walletInfo = {} }, index) => `${walletInfo.name}${index ? ',' : ''}`) :
  'N/A';

  return (
    <Content>
      <Header title='Connection Details' iconLeft={ICON_NAMES.CLOSE} backLocation={DASHBOARD_URL} />
      <DataRow>
        <DataContent>Platform</DataContent>
        <DataContent>{session?.peerMeta?.name || 'N/A'}</DataContent>
      </DataRow>
      <DataRow>
        <DataContent>URL</DataContent>
        <DataContent>{session?.peerMeta?.url || 'N/A'}</DataContent>
      </DataRow>
      <DataRow>
        <DataContent>Bridge</DataContent>
        <DataContent>{session?.bridge || 'N/A'}</DataContent>
      </DataRow>
      <DataRow>
        <DataContent>Accounts</DataContent>
        <DataContent>{renderConnectedAccounts()}</DataContent>
      </DataRow>
      <Button onClick={handleDisconnect}>Disconnect</Button>
    </Content>
  )
};
