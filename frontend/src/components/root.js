import React from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
// We'll create this soon
import App from './app';

import CssBaseline from "@material-ui/core/CssBaseline";
import ScrollToTop from "./scroll_to_top";

const Root = ({ store }) => (
  <Provider store={store}>
    <HashRouter>
      <ScrollToTop />
      <App />
    </HashRouter>
  </Provider>
);

export default Root;
