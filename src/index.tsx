import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { Theme } from "theme";
import { store } from "redux/store";
import { NOTIFICATION_URL } from 'consts';
import App from "./App";

const isChromeExtension = !!chrome?.extension;
const isNotificationPage = window?.location?.pathname === NOTIFICATION_URL;
// Chrome extension should be using memoryRouter unless it's on the notification page
const Router = (isChromeExtension && !isNotificationPage) ? MemoryRouter : BrowserRouter;
console.log('isChromeExtension :', isChromeExtension);
console.log('isNotificationPage :', isNotificationPage);
console.log('window?.location: ', window.location);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Theme>
          <App />
        </Theme>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
