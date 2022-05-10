import { useNavigate, useSearchParams } from 'react-router-dom';
import { WC_NOTIFICATION_TYPES } from 'consts';
import { useEffect, useState } from 'react';
import { useWalletConnect } from 'redux/hooks';
import { EventPayload } from 'types';
import { Content } from 'Components';
import { WalletConnectInit } from './WalletConnectInit';
import { SignRequest } from './SignRequest';
import { getPendingRequest } from 'utils';

export const Notification:React.FC = () => {
  const [notificationType, setNotificationType] = useState<string>('');
  const [eventPayload, setEventPayload] = useState<EventPayload | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { createConnector, connector } = useWalletConnect();
  const walletConnectUriParam = searchParams.get('wc');

  // On load, create the walletConnect event listeners
  useEffect(() => {
    // Connector must exist to create events
    if (connector) {
      // Loop through each notification type and create event listener
      WC_NOTIFICATION_TYPES.forEach(NOTE_TYPE => {
        connector.on(NOTE_TYPE, (error, payload) => {
          setNotificationType(NOTE_TYPE);
          setEventPayload(payload);
        });
      });

      return () => {
        // Remove created event listeners
        WC_NOTIFICATION_TYPES.forEach(NOTE_TYPE => {
          connector.off(NOTE_TYPE);
        });
      }
    }
  }, [
    connector,
    navigate,
  ]);

  // Listen for a new walletConnect URI.  When one is passed, create a new connector
  useEffect(() => {
    if (!connector && walletConnectUriParam) {
      // Create new connector
      createConnector(walletConnectUriParam);
      // Clear out uri from search params
      setSearchParams('');
    }
  }, [connector, walletConnectUriParam, createConnector, setSearchParams]);

  // If there is no event payload we need to see if there is already a session_request event waiting for the user
  // Note: We won't get another triggered event from the dApp, so we need to search for a pending session_request
  useEffect(() => {
    const asyncSessionRequestSearch = async () => {
      const allPendingRequests = await getPendingRequest();
      // Look through each request and pull out the first one with a method of 'session_request' to display to the user
      const allPendingKeys = Object.keys(allPendingRequests);
      const sessionRequestId = allPendingKeys.filter(id => allPendingRequests[id].method === 'session_request')[0];
      const targetSessionRequest = allPendingRequests[sessionRequestId];
      // If we have a sessionRequest pending, use that data as the event payload and set the notification type
      if (targetSessionRequest) {
        setNotificationType('session_request');
        setEventPayload(targetSessionRequest);
      }
    };

    asyncSessionRequestSearch();
  }, []);

  const renderNotificationContent = () => {
    if (!eventPayload) return null;
    switch(notificationType) {
      case 'session_request': return <WalletConnectInit payload={eventPayload} />
      case 'provenance_sign': return <SignRequest payload={eventPayload} />;
      default: return null;
    }
  };

  return (
    <Content>
      {renderNotificationContent()}
    </Content>
  );
};