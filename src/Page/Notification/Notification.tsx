import { useNavigate, useSearchParams } from 'react-router-dom';
import { ACTIONS_URL, WC_NOTIFICATION_TYPES } from 'consts';
import { useEffect, useState } from 'react';
import { useWalletConnect } from 'redux/hooks';
import { EventPayload } from 'types';
import { Content } from 'Components';
import { WalletConnectInit } from './WalletConnectInit';
import { SignRequest } from './SignRequest';
import { getPendingRequest, addPendingRequest, removeAllPendingRequests } from 'utils';

type ExtensionTypes = 'extension' | 'browser' | '';

export const Notification:React.FC = () => {
  const [notificationType, setNotificationType] = useState<string>('');
  const [eventPayload, setEventPayload] = useState<EventPayload | null>(null);
  const [extensionType, setExtensionType] = useState<ExtensionTypes>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createConnector, connector, setSession } = useWalletConnect();
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
    const asyncPayloadFetch = async (id: number) => {
      const targetPendingRequest: EventPayload = await getPendingRequest(id);
      if (targetPendingRequest) {
        setEventPayload(targetPendingRequest);
        // Did this request come with a connector?
        if (targetPendingRequest.session) {
          console.log('Notification | useEffect | resuming walletConnect session from pendingRequest | session: ', targetPendingRequest.session);
          setSession(targetPendingRequest.session);
        }
      }
    }
    if (pendingRequestId) {
      asyncPayloadFetch(Number(pendingRequestId));
    }
  }, [searchParams, wcUriParam, setSession]);

  // On load, create the walletConnect event listeners
  useEffect(() => {
    // Connector must exist to create events
    if (connector) {
      // Loop through each notification type and create event listener
      WC_NOTIFICATION_TYPES.forEach(NOTE_TYPE => {
        connector.on(NOTE_TYPE, async (error, payload) => {
          setNotificationType(NOTE_TYPE);
          // Save the request locally
          // - If the user closes the window/popup or doesn't notice it in the background it can be retreived
          //    - Clicking QR Code modal connect button again
          //    - Opening extension directly (which should be showing a "1" notification in the icon)
          const { id } = payload;
          // Get the current date to timestamp request
          const date = Date.now();
          const finalPayload = { ...payload, date };
          setEventPayload(finalPayload);
          // Only add 'provenance_sign' and 'provenance_sendTransaction' to pendingRequest list
          if (NOTE_TYPE === 'provenance_sign' || NOTE_TYPE === 'provenance_sendTransaction') await addPendingRequest(id, finalPayload);
          // If we get a disconnect, just remove everything
          if (NOTE_TYPE === 'disconnect') await removeAllPendingRequests();
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
    wcUriParam,
    navigate,
  ]);

  // Listen for a new walletConnect URI.  When one is passed, create a new connector
  useEffect(() => {
    if (!connector && wcUriParam) {
      // Create new connector
      createConnector(wcUriParam);
      // Clear out uri from search params
      setSearchParams('');
    }
  }, [connector, wcUriParam, createConnector, setSearchParams]);

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
    switch(notificationType) {
      case 'session_request': return <WalletConnectInit payload={eventPayload} closeWindow={closeWindow} />
      case 'provenance_sign': return <SignRequest payload={eventPayload} closeWindow={closeWindow} />;
      default: return null;
    }
  };

  return (
    <Content>
      {renderNotificationContent()}
    </Content>
  );
};