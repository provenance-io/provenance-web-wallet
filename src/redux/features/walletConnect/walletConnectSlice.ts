import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';
import WalletConnectClient from '@walletconnect/client';
import type {
  IWalletConnectSession,
  NotificationRequest,
  SavedPendingRequests,
  SaveNotificationRequests,
} from 'types';
import {
  getSavedData,
  getStorageData,
  addSavedData,
  removeSavedData,
  clearStorageData,
} from 'utils';
import { WC_CONNECTION_TIMEOUT } from 'consts';

/**
 * TYPES
 */
interface ChromeInitialState {
  connectionDuration: number;
  connectionEST: number;
  connectionEXP: number;
  connectionReferral?: string;
  notificationRequests: SaveNotificationRequests;
  totalNotificationRequests: number;
  pendingRequests: SavedPendingRequests;
  totalPendingRequests: number;
  connectionTimer: number;
  killSession: boolean;
}

type Connector = IWalletConnectSession & WalletConnectClient;

type State = ChromeInitialState & {
  connector: Connector | null;
  session: IWalletConnectSession;
  initialDataPulled: boolean;
};
interface WalletconnectChromeSave {
  connectionEST?: number;
  connectionEXP?: number;
  connectionDuration?: number;
  connectionReferral?: string;
  notificationRequests?: SaveNotificationRequests;
  totalNotificationRequests?: number;
  pendingRequests?: SavedPendingRequests;
  totalPendingRequests?: number;
}

/**
 * STATE
 */
const chromeInitialState: ChromeInitialState = {
  connectionDuration: WC_CONNECTION_TIMEOUT,
  connectionReferral: '',
  connectionEST: 0,
  connectionEXP: 0,
  notificationRequests: {},
  totalNotificationRequests: 0,
  pendingRequests: {},
  totalPendingRequests: 0,
  connectionTimer: 0,
  killSession: false,
};
const initialState: State = {
  ...chromeInitialState,
  initialDataPulled: false,
  connector: null,
  session: {
    accounts: [],
    bridge: '',
    chainId: -1,
    clientId: '',
    clientMeta: null,
    connected: false,
    handshakeId: 0,
    handshakeTopic: '',
    key: '',
    peerId: '',
    peerMeta: null,
  },
};

/**
 * ASYNC ACTION TYPES
 */
const PULL_INITIAL_WCCONNECTION_DATA = 'PULL_INITIAL_WCCONNECTION_DATA';
const SAVE_WALLETCONNECT_DATA = 'SAVE_WALLETCONNECT_DATA';
const WALLETCONNECT_DISCONNECT = 'WALLETCONNECT_DISCONNECT';
const ADD_NOTIFICATION_REQUESTS = 'ADD_NOTIFICATION_REQUESTS';
const REMOVE_NOTIFICATION_REQUESTS = 'REMOVE_NOTIFICATION_REQUESTS';
const ADD_PENDING_REQUESTS = 'ADD_PENDING_REQUESTS';
const REMOVE_PENDING_REQUESTS = 'REMOVE_PENDING_REQUESTS';
const RESET_WALLETCONNECT_DATA = 'RESET_WALLETCONNECT_DATA';
const BUMP_WC_DURATION = 'BUMP_WC_DURATION';

/**
 * ASYNC ACTIONS
 */
const updateChromeBadge = async (totalPendingRequests: number) => {
  // Update badges
  await chrome.action.setBadgeText({
    text: totalPendingRequests ? `${totalPendingRequests}` : '',
  });
  await chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
};
// Remove all existing values from chrome storage
export const resetWalletConnectData = createAsyncThunk(
  RESET_WALLETCONNECT_DATA,
  async () => {
    // Remove all existing values from chrome storage
    await removeSavedData('walletconnect');
    // Reset initial chrome state values
    await addSavedData({ walletconnect: chromeInitialState });
  }
);
// Pull walletconnect connection data from chrome storage and local storage
export const pullInitialWCData = createAsyncThunk(
  PULL_INITIAL_WCCONNECTION_DATA,
  async () => {
    // Chrome storage (Default missing values to initialState values)
    const {
      notificationRequests = initialState.notificationRequests,
      totalNotificationRequests = initialState.totalNotificationRequests,
      pendingRequests = initialState.pendingRequests,
      totalPendingRequests = initialState.totalPendingRequests,
      connectionEST = initialState.connectionEST,
      connectionEXP = initialState.connectionEXP,
      connectionDuration = initialState.connectionDuration,
      killSession = initialState.killSession,
    } = (await getSavedData('walletconnect')) || {};
    // If background.js detected a disconnect, it will have set a killSession variable
    // Local storage
    if (killSession) {
      // Don't use the last localStorage saved value (instead, remove it)
      clearStorageData();
    }
    const session = getStorageData();
    // After attemting to pull chrome saved data, populate any potentially missing chrome storage values
    await addSavedData({
      walletconnect: {
        notificationRequests,
        totalNotificationRequests,
        pendingRequests,
        totalPendingRequests,
        connectionEST,
        connectionEXP,
        connectionDuration,
        killSession: false, // If we needed to kill the session, we did already above, so reset this value
      },
    });
    // Return combined values to update the redux store
    return {
      connectionEST,
      connectionEXP,
      connectionDuration,
      session,
      notificationRequests,
      totalNotificationRequests,
      pendingRequests,
      totalPendingRequests,
    };
  }
);
// Save walletconnect data into the chrome store (local storage is managed third party, don't save into it, only pull)
export const saveWalletConnectData = createAsyncThunk(
  SAVE_WALLETCONNECT_DATA,
  async (data: WalletconnectChromeSave) => {
    // Get existing saved data (to merge into)
    const existingData = await getSavedData('walletconnect');
    const newData = { ...existingData, ...data };
    // Save to chrome storage
    await addSavedData({ walletconnect: newData });
    // Update chrome badges as needed
    const total = newData.totalPendingRequests + newData.totalNotificationRequests;
    await updateChromeBadge(total);
    // Return new combined values to update redux store
    return newData;
  }
);
// Update and save pending/total requests
export const addPendingRequest = createAsyncThunk(
  ADD_PENDING_REQUESTS,
  async (data: { id: string; pendingRequest: WalletconnectChromeSave }) => {
    const { id, pendingRequest } = data;
    // Get existing saved data (to merge into)
    const existingData = await getSavedData('walletconnect');
    const { pendingRequests } = existingData;
    // PendingRequests should always be at least an empty {}, add this ID into the object
    pendingRequests[id] = pendingRequest;
    const totalPendingRequests = Object.keys(pendingRequests).length;
    // Save to chrome storage
    await addSavedData({
      walletconnect: { ...existingData, pendingRequests, totalPendingRequests },
    });
    // Update badges
    await updateChromeBadge(totalPendingRequests);
    // Return new combined values to update redux store
    return { pendingRequests, totalPendingRequests };
  }
);
export const removePendingRequest = createAsyncThunk(
  REMOVE_PENDING_REQUESTS,
  async (id: number) => {
    // Pull all walletconnect data
    const existingData = await getSavedData('walletconnect');
    // Get existing pendingRequests
    const { pendingRequests } = existingData;
    // PendingRequests should always be at least an empty {}, remove this ID from the object
    delete pendingRequests[id];
    const totalPendingRequests = Object.keys(pendingRequests).length;
    // Save to chrome storage
    await addSavedData({
      walletconnect: { ...existingData, pendingRequests, totalPendingRequests },
    });
    // Update badges
    await updateChromeBadge(totalPendingRequests);
    // Return new combined values to update redux store
    return { pendingRequests, totalPendingRequests };
  }
);

// Update and save notification/total requests
export const addNotificationRequest = createAsyncThunk(
  ADD_NOTIFICATION_REQUESTS,
  async (data: NotificationRequest) => {
    const { id } = data;
    // Get existing saved data (to merge into)
    const existingData = await getSavedData('walletconnect');
    const { notificationRequests } = existingData;
    // notificationRequests should always be at least an empty {}, add this ID into the object
    notificationRequests[id] = data;
    const totalNotificationRequests = Object.keys(notificationRequests).length;
    // Save to chrome storage
    await addSavedData({
      walletconnect: {
        ...existingData,
        notificationRequests,
        totalNotificationRequests,
      },
    });
    // Update badges
    await updateChromeBadge(totalNotificationRequests);
    // Return new combined values to update redux store
    return { notificationRequests, totalNotificationRequests };
  }
);
export const removeNotificationRequest = createAsyncThunk(
  REMOVE_NOTIFICATION_REQUESTS,
  async (id: number) => {
    // Pull all walletconnect data
    const existingData = await getSavedData('walletconnect');
    // Get existing pendingRequests
    const { notificationRequests } = existingData;
    // notificationRequests should always be at least an empty {}, remove this ID from the object
    delete notificationRequests[id];
    const totalNotificationRequests = Object.keys(notificationRequests).length;
    // Save to chrome storage
    await addSavedData({
      walletconnect: {
        ...existingData,
        notificationRequests,
        totalNotificationRequests,
      },
    });
    // Update badges
    await updateChromeBadge(totalNotificationRequests);
    // Return new combined values to update redux store
    return { notificationRequests, totalNotificationRequests };
  }
);
// Save walletconnect data into the chrome store (local storage is managed third party, don't save into it, only pull)
export const walletconnectDisconnect = createAsyncThunk(
  WALLETCONNECT_DISCONNECT,
  async () => {
    // Save initial values as chrome storage
    await addSavedData({
      walletconnect: {
        connectionEST: initialState.connectionEST,
        connectionEXP: initialState.connectionEXP,
        notificationRequests: initialState.notificationRequests,
        totalNotificationRequests: initialState.totalNotificationRequests,
        pendingRequests: initialState.pendingRequests,
        totalPendingRequests: initialState.totalPendingRequests,
      },
    });
    return;
  }
);
// Bump the wallet connect connection duration due to an action
export const bumpWCDuration = createAsyncThunk(BUMP_WC_DURATION, async () => {
  // Get existing saved data (to merge into)
  const existingData = await getSavedData('walletconnect');
  // Get existing unlock duration
  const { connectionEXP } = existingData;
  // Only bump/update the time if all connection values exist and are not already expired
  const connectionTimersExist = connectionEXP && WC_CONNECTION_TIMEOUT;
  if (connectionTimersExist) {
    // Current time
    const now = Date.now();
    const hasExpired = now > connectionEXP;
    if (!hasExpired) {
      const newConnectionEXP = now + WC_CONNECTION_TIMEOUT;
      // Save updated unlock data (and add back all other existing data)
      const newData = { ...existingData, connectionEXP: newConnectionEXP };
      await addSavedData({ walletconnect: newData });
      return { connectionEXP: newConnectionEXP };
    }
  }
  return {};
});

/**
 * SLICE
 */
const walletConnectSlice = createSlice({
  name: 'walletConnect',
  initialState,
  extraReducers: (builder) => {
    builder
      // Reset redux store to initial values
      .addCase(resetWalletConnectData.fulfilled, () => initialState)
      .addCase(pullInitialWCData.fulfilled, (state, { payload }) => {
        const {
          connectionEST,
          connectionEXP,
          connectionDuration,
          session,
          notificationRequests,
          totalNotificationRequests,
          pendingRequests,
          totalPendingRequests,
        } = payload;
        state.connectionEST = connectionEST;
        state.connectionEXP = connectionEXP;
        state.connectionDuration = connectionDuration;
        state.notificationRequests = notificationRequests;
        state.totalNotificationRequests = totalNotificationRequests;
        state.pendingRequests = pendingRequests;
        state.totalPendingRequests = totalPendingRequests;
        // If we have a peerId and an expiration date, start the walletconnect connection
        if (session && session.peerId) {
          const connector = new WalletConnectClient({ session }) as Connector;
          // Check if the session is already disconnected
          if (connector?.session?.connected) {
            // Make sure the session isn't expired, if it is we will kill the session
            const now = Date.now();
            if (!connectionEXP || now >= connectionEXP) {
              connector.killSession();
            }
            state.session = session;
            state.connector = connector;
          }
        }
        // Update to set initial data as pulled
        state.initialDataPulled = true;
      })
      .addCase(
        saveWalletConnectData.fulfilled,
        (state, { payload }: { payload: WalletconnectChromeSave }) => {
          const {
            connectionEST,
            connectionEXP,
            connectionDuration,
            connectionReferral,
            notificationRequests,
            totalNotificationRequests,
            pendingRequests,
            totalPendingRequests,
          } = payload;
          if (connectionEST) state.connectionEST = connectionEST;
          if (connectionEXP) state.connectionEXP = connectionEXP;
          if (connectionDuration) state.connectionDuration = connectionDuration;
          if (connectionReferral) state.connectionReferral = connectionReferral;
          if (notificationRequests)
            state.notificationRequests = notificationRequests;
          if (totalNotificationRequests)
            state.totalNotificationRequests = totalNotificationRequests;
          if (pendingRequests) state.pendingRequests = pendingRequests;
          if (totalPendingRequests)
            state.totalPendingRequests = totalPendingRequests;
        }
      )
      .addCase(walletconnectDisconnect.fulfilled, (state) => {
        // Reset all the values associated with a walletconnect connection
        state.connectionEST = initialState.connectionEST;
        state.connectionEXP = initialState.connectionEXP;
        state.connectionDuration = initialState.connectionDuration;
        state.pendingRequests = initialState.pendingRequests;
        state.totalPendingRequests = initialState.totalPendingRequests;
        // Clear any timeouts running and reset value
        if (state.connectionTimer) clearTimeout(state.connectionTimer);
        state.connectionTimer = initialState.connectionTimer;
        // Reset values for connector and session (third party should auto clear walletconnect from localstorage)
        state.connector = initialState.connector;
        state.session = initialState.session;
      })
      .addCase(
        addPendingRequest.fulfilled,
        (
          state,
          {
            payload,
          }: {
            payload: {
              totalPendingRequests: number;
              pendingRequests: SavedPendingRequests;
            };
          }
        ) => {
          const { totalPendingRequests, pendingRequests } = payload;
          state.pendingRequests = pendingRequests;
          state.totalPendingRequests = totalPendingRequests;
        }
      )
      .addCase(
        removePendingRequest.fulfilled,
        (
          state,
          {
            payload,
          }: {
            payload: {
              totalPendingRequests: number;
              pendingRequests: SavedPendingRequests;
            };
          }
        ) => {
          const { totalPendingRequests, pendingRequests } = payload;
          state.pendingRequests = pendingRequests;
          state.totalPendingRequests = totalPendingRequests;
        }
      )
      .addCase(
        addNotificationRequest.fulfilled,
        (
          state,
          {
            payload,
          }: {
            payload: {
              totalNotificationRequests: number;
              notificationRequests: SaveNotificationRequests;
            };
          }
        ) => {
          const { totalNotificationRequests, notificationRequests } = payload;
          state.notificationRequests = notificationRequests;
          state.totalNotificationRequests = totalNotificationRequests;
        }
      )
      .addCase(
        removeNotificationRequest.fulfilled,
        (
          state,
          {
            payload,
          }: {
            payload: {
              totalNotificationRequests: number;
              notificationRequests: SaveNotificationRequests;
            };
          }
        ) => {
          const { totalNotificationRequests, notificationRequests } = payload;
          state.notificationRequests = notificationRequests;
          state.totalNotificationRequests = totalNotificationRequests;
        }
      )
      .addCase(
        bumpWCDuration.fulfilled,
        (
          state,
          {
            payload,
          }: {
            payload: {
              connectionEXP?: number;
            };
          }
        ) => {
          const { connectionEXP } = payload;
          if (connectionEXP) {
            state.connectionEXP = connectionEXP;
          }
        }
      );
  },
  reducers: {
    setConnector: (state, { payload }) => {
      state.connector = payload;
    },
    createConnector: (state, { payload: uri }) => {
      const connector = new WalletConnectClient({ uri }) as Connector;
      // connector must have a peerId
      if (connector.peerId) {
        state.connector = connector;
      }
    },
    createConnectionTimer: (state, { payload }) => {
      const { callback, duration } = payload;
      // If another timer already exists, clear it and make a new one
      if (state.connectionTimer) clearTimeout(state.connectionTimer);
      // Run callback and clear out the timer value from state
      const newTimeout = window.setTimeout(() => {
        callback();
      }, duration);
      state.connectionTimer = newTimeout;
    },
    clearConnectionTimer: (state) => {
      if (state.connectionTimer) clearTimeout(state.connectionTimer);
      state.connectionTimer = initialState.connectionTimer;
    },
  },
});

/**
 * ACTIONS
 */
export const walletConnectActions = {
  ...walletConnectSlice.actions,
  pullInitialWCData,
  saveWalletConnectData,
  walletconnectDisconnect,
  addNotificationRequest,
  removeNotificationRequest,
  addPendingRequest,
  removePendingRequest,
  resetWalletConnectData,
  bumpWCDuration,
};

/**
 * SELECTORS
 */
export const selectWalletConnect = (state: RootState) => state.walletConnect;

export default walletConnectSlice.reducer;
