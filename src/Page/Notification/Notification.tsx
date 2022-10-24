import WalletConnectClient from '@walletconnect/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ACTIONS_URL, WC_NOTIFICATION_TYPES } from 'consts';
import { useEffect, useState } from 'react';
import { useAccount, useWalletConnect } from 'redux/hooks';
import type {
  EventPayload,
  WCNotification,
  WCInitEventPayload,
  ExtensionTypes,
  NotificationType,
} from 'types';
import { Loading } from 'Components';
import { WalletConnectInit } from './WalletConnectInit';
import { SignRequest } from './SignRequest';
import { TransactionRequest } from './TransactionRequest';
import { RequestFailed } from './RequestFailed';
import { TransactionComplete } from './TransactionComplete';
import { MissingAccount } from './MissingAccount';
import { Disconnected } from './Disconnected';

type PayloadTypes = EventPayload | WCInitEventPayload;

interface DefaultProps {
  closeWindow: () => void;
  changeNotificationPage: (type: NotificationType, data: {}) => void;
  pageData: {};
  extensionType: ExtensionTypes;
}

type PageProps = DefaultProps & {
  payload: EventPayload;
};
type WCInitPageProps = DefaultProps & {
  payload: WCInitEventPayload;
};

export const Notification: React.FC = () => {
  const [notificationType, setNotificationType] = useState<NotificationType>('');
  const [eventPayload, setEventPayload] = useState<PayloadTypes | null>(null);
  const [extensionType, setExtensionType] = useState<ExtensionTypes>('');
  const [pageData, setPageData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    setConnector,
    connector,
    pendingRequests,
    saveWalletconnectData,
    addPendingRequest,
  } = useWalletConnect();
  const { accounts } = useAccount();
  const hasAccount = !!accounts.length;
  const wcUriParam = searchParams.get('wc');
  const durationUriParam = searchParams.get('duration');
  // On load, attempt to detect the way the extension loaded
  useEffect(() => {
    const asyncExtensionType = async () => {
      const tabsExist = await chrome?.tabs?.getCurrent();
      const newExtensionType = tabsExist ? 'browser' : 'extension';
      setExtensionType(newExtensionType);
      if (newExtensionType === 'browser') {
        // If we're attempting to connect (session_request) and we're not already connected when we "x" out of the popup, reject the request
        window.addEventListener('beforeunload', () => {
          if (
            connector &&
            notificationType === 'session_request' &&
            !connector.connected
          ) {
            connector.rejectSession({ message: 'Connection rejected by user' });
          }
        });
      }
    };
    asyncExtensionType();
  }, [connector, notificationType]);

  // On page load, if a payloadId was passed in, search for that payload in storage
  // Also check url search params for wc session or pending requests
  useEffect(() => {
    const pendingRequestId = searchParams.get('pid');
    if (pendingRequestId) {
      const targetPendingRequest: EventPayload = pendingRequests[pendingRequestId];
      if (targetPendingRequest) {
        setEventPayload(targetPendingRequest);
        if (targetPendingRequest?.method)
          setNotificationType(targetPendingRequest.method as WCNotification);
      }
    }
  }, [searchParams, pendingRequests]);

  // On load, create the walletConnect event listeners
  useEffect(() => {
    // If we are missing an account, set the notification type to account_missing
    if (!hasAccount) setNotificationType('missing_account');
    // Connector must exist to create events
    if (connector) {
      // Loop through each notification type and create event listener
      WC_NOTIFICATION_TYPES.forEach((NOTE_TYPE) => {
        connector.on(NOTE_TYPE, async (error, payload) => {
          setEventPayload(payload);
          setNotificationType(NOTE_TYPE as WCNotification);
          // Save the request locally
          // - If the user closes the window/popup or doesn't notice it in the background it can be retreived
          //    - Clicking QR Code modal connect button again
          //    - Opening extension directly (which should be showing a "1" notification in the icon)
          const { id } = payload;
          // Only add 'provenance_sign' and 'provenance_sendTransaction' to pendingRequest list
          if (
            NOTE_TYPE === 'provenance_sign' ||
            NOTE_TYPE === 'provenance_sendTransaction'
          ) {
            // Add current date to the pending request data
            const newPendingRequestData = {
              id,
              pendingRequest: { ...payload, date: Date.now() },
            };
            addPendingRequest(newPendingRequestData);
          }
          // If we get a disconnect, remove all pending requests
          if (NOTE_TYPE === 'disconnect') {
            await saveWalletconnectData({
              pendingRequests: {},
              totalPendingRequests: 0,
            });
          }
        });
      });
    }
  }, [connector, saveWalletconnectData, addPendingRequest, hasAccount]);

  // Listen for a new walletConnect URI.  When one is passed, create a new connector
  useEffect(() => {
    if (!connector && wcUriParam) {
      const asyncSaveData = async () => {
        // If we have a custom connection timeout, save it
        if (durationUriParam) {
          await saveWalletconnectData({
            connectionDuration: Number(durationUriParam),
          });
          // Create new connector
          const connector = new WalletConnectClient({ uri: wcUriParam });
          // Save connector into redux store
          setConnector(connector);
          // Clear out uri from search params
          setSearchParams('');
        }
      };
      asyncSaveData();
    }
  }, [
    connector,
    wcUriParam,
    setSearchParams,
    setConnector,
    durationUriParam,
    saveWalletconnectData,
  ]);

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

  // Manually change the notification page and pass along any data
  const changeNotificationPage = (noteType: NotificationType, data: {}) => {
    setPageData(data);
    setNotificationType(noteType);
  };

  const renderNotificationContent = () => {
    const pageProps = {
      payload: eventPayload,
      closeWindow,
      changeNotificationPage,
      pageData,
      extensionType,
    };
    // If we get a disconnect due to rejecting the connection, just return nothing (don't flash content)
    if (
      eventPayload &&
      eventPayload.method === 'session_request' &&
      (eventPayload as WCInitEventPayload).params[0]?.peerMeta?.message ===
        'Connection rejected by user'
    ) {
      return <></>;
    }

    switch (notificationType) {
      case 'missing_account':
        return <MissingAccount {...(pageProps as PageProps)} />;
      case 'session_request':
        return <WalletConnectInit {...(pageProps as WCInitPageProps)} />;
      case 'provenance_sendTransaction':
        return <TransactionRequest {...(pageProps as PageProps)} />;
      case 'provenance_sign':
        return <SignRequest {...(pageProps as PageProps)} />;
      case 'failed':
        return <RequestFailed {...(pageProps as PageProps)} />;
      case 'complete':
        return <TransactionComplete {...(pageProps as PageProps)} />;
      case 'disconnect':
        return <Disconnected {...(pageProps as PageProps)} />;
      case 'connect': // fallthrough
      default:
        // Just return empty since we are changing the note type to bounce into 'failed'
        return <></>;
    }
  };

  return notificationType ? renderNotificationContent() : <Loading />;
};
