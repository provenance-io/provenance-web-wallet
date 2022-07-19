import { useNavigate, useSearchParams } from 'react-router-dom';
import { ACTIONS_URL, WC_NOTIFICATION_TYPES } from 'consts';
import { useEffect, useState } from 'react';
import { useWalletConnect } from 'redux/hooks';
import { EventPayload, WCNotification } from 'types';
import { Content } from 'Components';
import { WalletConnectInit } from './WalletConnectInit';
import { SignRequest } from './SignRequest';
import { SendTransaction } from './SendTransaction';
import { RequestFailed } from './RequestFailed';

type ExtensionTypes = 'extension' | 'browser' | '';

export const Notification:React.FC = () => {
  const [notificationType, setNotificationType] = useState<WCNotification>('unknown');
  const [eventPayload, setEventPayload] = useState<EventPayload | null>(null);
  const [extensionType, setExtensionType] = useState<ExtensionTypes>('');
  const [failedMessage, setFailedMessage] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    createConnector,
    connector,
    pendingRequests,
    saveWalletconnectData,
    addPendingRequest,
  } = useWalletConnect();
  const wcUriParam = searchParams.get('wc')
  // On load, attempt to detect the way the extension loaded
  useEffect(() => {
    const asyncExtensionType = async () => {
      const tabsExist = await chrome?.tabs?.getCurrent();
      const newExtensionType = tabsExist ? 'browser' : 'extension';
      setExtensionType(newExtensionType);
    };
    asyncExtensionType();
  });
  
  // On page load, if a payloadId was passed in, search for that payload in storage
  // Also check url search params for wc session or pending requests
  useEffect(() => {
    const pendingRequestId = searchParams.get('pid');
    if (pendingRequestId) {
        const targetPendingRequest: EventPayload = pendingRequests[pendingRequestId];
        if (targetPendingRequest) {
          setEventPayload(targetPendingRequest);
          if (targetPendingRequest?.method) setNotificationType(targetPendingRequest.method as WCNotification);
        }
    }
  }, [searchParams, pendingRequests]);

  // On load, create the walletConnect event listeners
  useEffect(() => {
    // Connector must exist to create events
    if (connector) {
      // Loop through each notification type and create event listener
      WC_NOTIFICATION_TYPES.forEach(NOTE_TYPE => {
        connector.on(NOTE_TYPE, (error, payload) => {
          setNotificationType(NOTE_TYPE as WCNotification);
          // Save the request locally
          // - If the user closes the window/popup or doesn't notice it in the background it can be retreived
          //    - Clicking QR Code modal connect button again
          //    - Opening extension directly (which should be showing a "1" notification in the icon)
          const { id } = payload;
          // Get the current date to timestamp request
          // const date = Date.now();
          // const finalPayload = { ...payload, date };
          // setEventPayload(finalPayload);
          setEventPayload(payload);
          // Only add 'provenance_sign' and 'provenance_sendTransaction' to pendingRequest list
          if (NOTE_TYPE === 'provenance_sign' || NOTE_TYPE === 'provenance_sendTransaction') {
            // Add current date to the pending request data
            const newPendingRequestData = { id, pendingRequest: { ...payload, date: Date.now() } };
            addPendingRequest(newPendingRequestData);
          }
          // If we get a disconnect, remove all pending requests
          if (NOTE_TYPE === 'disconnect') saveWalletconnectData({ pendingRequests: {}, totalPendingRequests: 0 });
        });
      });

      return () => {
        // Remove created event listeners
        WC_NOTIFICATION_TYPES.forEach(NOTE_TYPE => {
          connector.off(NOTE_TYPE);
        });
      }
    }
  }, [connector, saveWalletconnectData, addPendingRequest]
  );

  // Listen for a new walletConnect URI.  When one is passed, create a new connector
  useEffect(() => {
    if (!connector && wcUriParam) {
      // Create new connector
      createConnector(wcUriParam);
      // Clear out uri from search params
      setSearchParams('');
    }
  }, [connector, wcUriParam, createConnector, setSearchParams]);

  const closeWindow = async () => {
    if (extensionType === 'extension') {
      // If we remove the window in extension mode all of chrome will close, instead just redirect to the actions page
      navigate(ACTIONS_URL);
    } else {
      // Since this is a stand-alone popup we can close this entire tab/window
      const currentWindow = await chrome.windows.getCurrent();
      if (currentWindow.id) {
        chrome.windows.remove(currentWindow.id);
      }
    }
  };

  const renderNotificationContent = () => {
    if (!eventPayload) return null;
    const pageProps = { payload: eventPayload, closeWindow, setFailedMessage };
    if (failedMessage) return <RequestFailed failedMessage={failedMessage} {...pageProps} />
    switch(notificationType) {
      case 'session_request': return <WalletConnectInit {...pageProps} />
      case 'provenance_sendTransaction': return <SendTransaction {...pageProps} />
      case 'provenance_sign': return <SignRequest {...pageProps}  />;
      default: { console.log('Notification.tsx | renderNotificationContent | default case'); return null; }
    }
  };

  return (
    <Content>
      {renderNotificationContent()}
    </Content>
  );
};