import { useNavigate, useSearchParams } from 'react-router-dom';
import { WC_NOTIFICATION_TYPES } from 'consts';
import { useEffect, useState } from 'react';
import { useWalletConnect } from 'redux/hooks';
import { WalletConnectInit } from './WalletConnectInit';
import { EventPayload } from 'types';
import { Content } from 'Components';
import { SignRequest } from './SignRequest';

export const Notification:React.FC = () => {
  const [notificationType, setNotificationType] = useState<string>('');
  const [eventPayload, setEventPayload] = useState<EventPayload | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { createConnector, connector } = useWalletConnect();
  const walletConnectUriParam = searchParams.get('wc');

  // TEST: Only testing the rendering of the notification pages locally while offline, remove me!
  const offlineTest = searchParams.get('offline');
  useEffect(() => {
    console.log('Checking for offlineTest...')
    if (offlineTest) {
      console.log('Is offlineTest: ', offlineTest);
      setEventPayload({
        payload: {
          params: [
            { peerMeta: {
                description: 'description',
                url: 'url',
                name: 'name',
                icons: [],
            } }
          ]
        }
      })
      setNotificationType(offlineTest);
    }
  }, [offlineTest]);

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

  const renderNotificationContent = () => {
    if (!eventPayload) return null;
    switch(notificationType) {
      case 'session_request': return <WalletConnectInit data={eventPayload} />
      case 'provenance_sign': return <SignRequest data={eventPayload} />;
      default: return null;
    }
  };

  return (
    <Content>
      {renderNotificationContent()}
    </Content>
  );
};