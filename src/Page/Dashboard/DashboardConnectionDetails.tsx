import styled from 'styled-components';
import { useWalletConnect } from 'redux/hooks';
import { BottomFloat, Button, Content, Header } from 'Components';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { DASHBOARD_URL, ICON_NAMES } from 'consts';
import { format } from 'date-fns';

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
  const {
    session,
    connector,
    connectionEST,
    connectionEXP,
  } = useWalletConnect();
  const [formattedEXP, setFormattedEXP] = useState('N/A');
  const [formattedEST, setFormattedEST] = useState('N/A');
  const { connected } = session;
  const navigate = useNavigate();

  useEffect(() => {
    setFormattedEXP(connectionEXP ? format(new Date(connectionEXP), 'MMM dd, h:mm:ssa') : 'N/A');
    setFormattedEST(connectionEST ? format(new Date(connectionEST), 'MMM dd, h:mm:ssa') : 'N/A');

  }, [connectionEST, connectionEXP]);

  // If we are not connected or there is no connector go back to the dashboard
  useEffect(() => {
    if (!connector || !connected) navigate(DASHBOARD_URL);
  }, [navigate, connector, connected]);

  const handleDisconnect = () => {
    if (connector) connector.killSession();
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
        <DataContent>Account</DataContent>
        <DataContent>{renderConnectedAccounts()}</DataContent>
      </DataRow>
      <DataRow>
        <DataContent>Connection Est.</DataContent>
        <DataContent>{formattedEST}</DataContent>
      </DataRow>
      <DataRow>
        <DataContent>Connection Exp.</DataContent>
        <DataContent>{formattedEXP}</DataContent>
      </DataRow>
      <BottomFloat>
        <Button onClick={handleDisconnect}>Disconnect</Button>
      </BottomFloat>
    </Content>
  )
};
