import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Theme } from 'theme';
import { store } from 'redux/store';
import { NOTIFICATION_URL } from 'consts';
import { localChromeSpoof } from 'utils';
import App from './App';
import { LockCheck } from 'LockCheck';

const isChromeExtension = !!chrome?.extension;
// Detect if running locally, if so, set up chrome storage spoof
if (process.env.REACT_APP_ENV === 'local') {
  // If this isn't a chrome browser extension, spoof the browsers functions
  if (!isChromeExtension) localChromeSpoof();
  // Set up mock service worker
  const { worker } = require('./mocks/browser');
  worker.start({ onUnhandledRequest: 'bypass' });
}

const isNotificationPage = window?.location?.pathname === NOTIFICATION_URL;
// Chrome extension should be using memoryRouter unless it's on the notification page
const Router =
  isChromeExtension && !isNotificationPage ? MemoryRouter : BrowserRouter;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store()}>
      <Router>
        <Theme>
          <LockCheck>
            <App />
          </LockCheck>
        </Theme>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
