import styled from 'styled-components';
import { FooterNav, Content } from 'Components';
import { useEffect, useState } from 'react';
import { getPendingRequest } from 'utils';

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

export const Actions:React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState({});
  useEffect(() => {
    const asyncGetPendingRequests = async () => {
      const allPendingRequests = await getPendingRequest();
      setPendingRequests(allPendingRequests);
    };

    asyncGetPendingRequests();
  }, []);

  const renderPendingRequests = () => {
    // Loop through each pending request to create it
    /*
      {
      "id": 1652309210026083,
      "jsonrpc": "2.0",
      "method": "session_request",
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

  const totalPendingRequests = Object.keys(pendingRequests).length;

  return (
    <Content>
      <Title>Pending Actions</Title>
      {totalPendingRequests ? <div>this is a request</div> : (
        <SubTitle>You have no pending requests at this time.</SubTitle>
      )}
      <FooterNav />
    </Content>
  );
};
