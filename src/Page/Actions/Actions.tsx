import styled from 'styled-components';
import {
  FooterNav,
  Content,
  Sprite,
  Typo,
  Header,
  Tabs,
  PillInline,
} from 'Components';
import { format } from 'date-fns';
import { ICON_NAMES, NOTIFICATION_URL, DASHBOARD_URL } from 'consts';
import { COLORS } from 'theme';
import { useNavigate } from 'react-router';
import { useAccount, useActiveAccount, useWalletConnect } from 'redux/hooks';
import { useState } from 'react';
import { EventPayload, IClientMeta } from 'types';
import { trimAddress } from 'utils';

const AllRequests = styled.div``;
const WalletAction = styled.div`
  margin-bottom: 26px;
`;
const WalletContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;
const WalletInfo = styled.div`
  flex-grow: 1;
`;
const RequestItem = styled.div`
  display: flex;
  cursor: pointer;
  padding: 20px;
  transition: 250ms all;
  margin-bottom: 1px;
  background: ${COLORS.NEUTRAL_700};
  &:hover {
    background: ${COLORS.NEUTRAL_650};
  }
`;
const RequestData = styled.div`
  flex-grow: 1;
`;
const RequestArrow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const Actions: React.FC = () => {
  const navigate = useNavigate();
  const { pendingRequests, totalPendingRequests } = useWalletConnect();
  const { address: activeAddress } = useActiveAccount();
  const { accounts } = useAccount();
  const totalNotificationRequests = 0;
  const [activeTab, setActiveTab] = useState(0);

  const getMethodDisplayName = (rawName: string) => {
    switch (rawName) {
      case 'session_request':
        return 'Session Request';
      case 'provenance_sign':
        return 'Provenance Sign';
      case 'provenance_sendTransaction':
        return 'Provenance Transaction';
      default:
        return rawName;
    }
  };

  const handleRequestClick = (id: string | number) => {
    navigate(`${NOTIFICATION_URL}?pid=${id}`);
  };

  const renderWalletDetails = () => {
    // Pending actions will need to be changed to be stored by address, then by id.
    // For now, just loop through all the pending requests and create a new array of wallets
    const pendingWallets: { [key: string]: EventPayload[] } = {};
    Object.keys(pendingRequests).forEach((pendingId: string) => {
      const targetRequest: EventPayload = pendingRequests[pendingId];
      const { address }: IClientMeta = JSON.parse(targetRequest.params[0]!);
      // Add target request into wallet request list
      pendingWallets[address] = pendingWallets[address]
        ? pendingWallets[address]
        : [];
      pendingWallets[address].push(targetRequest);
    });
    // Loop through each wallet and build out all pending actions associated with it
    return Object.keys(pendingWallets).map((address: string, index: number) => {
      const allRequests = pendingWallets[address];
      const isActive = address === activeAddress;
      // Filter through all existing accounts and find the matching address to get the name
      const { name = 'N/A' } = accounts.find(
        ({ address: accountAddress }) => address === accountAddress
      )!;
      return (
        <WalletAction key={`${address}_${index}`}>
          <WalletContainer>
            <WalletInfo>
              <Typo type="body" bold align="left">
                {name}
              </Typo>
              <Typo type="footnote" color="WHITE" align="left">
                ({trimAddress(address)}) &#8226; {allRequests.length} Action
                {allRequests.length > 1 && 's'}
              </Typo>
            </WalletInfo>
            {isActive && <PillInline title="Active" active />}
          </WalletContainer>
          {allRequests.map((pendingRequest) => {
            const methodName = getMethodDisplayName(pendingRequest.method!);
            const requestDate = pendingRequest?.date
              ? format(new Date(pendingRequest.date), 'MMM d, h:mm:ss a')
              : 'N/A';

            return (
              <RequestItem
                onClick={() => {
                  handleRequestClick(pendingRequest.id);
                }}
              >
                <RequestData>
                  <Typo type="body" align="left">
                    {methodName}
                  </Typo>
                  <Typo type="footnote" align="left">
                    {requestDate}
                  </Typo>
                </RequestData>
                <RequestArrow>
                  <Sprite icon={ICON_NAMES.CHEVRON} size="1rem" />
                </RequestArrow>
              </RequestItem>
            );
          })}
        </WalletAction>
      );
    });
  };

  const renderActions = () =>
    totalPendingRequests ? (
      <AllRequests>{renderWalletDetails()}</AllRequests>
    ) : (
      <Typo type="footnote">No actions at this time</Typo>
    );
  const renderNotifications = () =>
    totalNotificationRequests ? (
      <AllRequests>Notifications here</AllRequests>
    ) : (
      <Typo type="footnote">No notifications at this time</Typo>
    );

  return (
    <Content>
      <Header title="" backLocation={DASHBOARD_URL} />
      <Tabs
        tabs={[
          `Actions (${totalPendingRequests})`,
          `Notifications (${totalNotificationRequests})`,
        ]}
        activeIndex={activeTab}
        setActiveIndex={setActiveTab}
      />
      {activeTab === 0 ? renderActions() : renderNotifications()}
      <FooterNav />
    </Content>
  );
};
