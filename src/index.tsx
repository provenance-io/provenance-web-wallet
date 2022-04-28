import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { Theme } from "theme";
import { store } from "redux/store";
import App from "./App";

const Router = process.env.NODE_ENV === 'development' ? BrowserRouter : MemoryRouter;

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
