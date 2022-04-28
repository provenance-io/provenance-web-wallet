import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { Theme } from "theme";
import { store } from "redux/store";
import { WalletConnectContextProvider } from 'services';
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <WalletConnectContextProvider>
        <Router>
          <Theme>
            <App />
          </Theme>
        </Router>
      </WalletConnectContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
