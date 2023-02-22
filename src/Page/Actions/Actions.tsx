import styled from 'styled-components';
import { FooterNav, Content, Sprite } from 'Components';
import { format } from 'date-fns';
import { ICON_NAMES, NOTIFICATION_URL } from 'consts';
import { COLORS } from 'theme';
import circleIcon from 'images/circle-icon.svg';
import { useNavigate } from 'react-router';
import { useWalletConnect } from 'redux/hooks';

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
const RequestItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-top: 1px solid ${COLORS.NEUTRAL_600};
  padding: 16px;
  box-sizing: content-box;
  transition: 250ms all;
  &:hover {
    background: #2b3349;
  }
`;
const RequestIcon = styled.div`
  height: 40px;
  width: 40px;
  flex-shrink: 0;
  margin-right: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const RequestIconBg = styled.img``;
const RequestIconPeer = styled.img`
  position: absolute;
`;
const AllRequests = styled.div``;
const RequestData = styled.div`
  flex-shrink: 0;
`;
const RequestTitle = styled.div`
  font-size: 1.4rem;
  margin-bottom: 8px;
`;
const RequestDate = styled.div`
  font-size: 1rem;
`;
const RequestArrow = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
`;

export const Actions: React.FC = () => {
  const navigate = useNavigate();
  const { pendingRequests, totalPendingRequests } = useWalletConnect();

  const getMethodDisplayName = (rawName: string) => {
    switch (rawName) {
      case 'session_request':
        return 'Session Request';
      case 'provenance_sign':
        return 'Sign Request';
      case 'eol':
        return 'Wallet End of Life';
      default:
        return rawName;
    }
  };

  const handleRequestClick = (id: string) => {
    navigate(`${NOTIFICATION_URL}?pid=${id}`);
  };

  const renderPendingRequests = () => {
    const allPendingIds = Object.keys(pendingRequests);
    // Loop through each pending request ID to create it
    return allPendingIds.map((pendingId: string) => {
      const targetRequest = pendingRequests[pendingId];
      const methodName = getMethodDisplayName(targetRequest.method!);
      const requestDate = targetRequest?.date
        ? format(new Date(targetRequest.date), 'MMM d, h:mm:ss a')
        : 'N/A';
      const peerMeta = targetRequest?.params?.[0]?.peerMeta || { icons: [] };
      const peerIcon = peerMeta?.icons?.[0] || '';

      return (
        <RequestItem
          onClick={() => {
            handleRequestClick(pendingId);
          }}
        >
          <RequestIcon>
            <RequestIconBg src={circleIcon} alt="request background" />
            {!!peerIcon && <RequestIconPeer src={peerIcon} alt="peer logo" />}
          </RequestIcon>
          <RequestData>
            <RequestTitle>{methodName}</RequestTitle>
            <RequestDate>{requestDate}</RequestDate>
          </RequestData>
          <RequestArrow>
            <Sprite icon={ICON_NAMES.CHEVRON} size="1rem" />
          </RequestArrow>
        </RequestItem>
      );
    });
    /*
      {
      "id": 1652309210026083,
      "jsonrpc": "2.0",
      "method": "session_request",
      "date": 1230234505443,
      "params": [
        {
            "chainId": null,
            "peerId": "e681ebd0-38e5-46fc-b8ac-4f3916f1f7e8",
            "peerMeta": {
                "description": "Connect your existing Figure or Provenance wallet using WalletConnect",
                "icons": [
                    "https://test.figure.tech/walletconnect/figure-favicons/favicon-32x32.png",
                    "https://test.figure.tech/walletconnect/figure-favicons/android-icon-192x192.png"
                ],
                "name": "Figure Tech | WalletConnect",
                "url": "https://test.figure.tech"
              }
            }
          ]
        }
    */
  };

  return (
    <Content>
      <Title>Pending Actions</Title>
      {totalPendingRequests ? (
        <AllRequests>{renderPendingRequests()}</AllRequests>
      ) : (
        <SubTitle>You have no pending requests at this time.</SubTitle>
      )}
      <FooterNav />
    </Content>
  );
};
