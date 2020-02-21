import React from "react";
import { Switch, Route } from "react-router-dom";

import Main from "./main/main_page";
import BizDetailContainer from './biz/biz_detail_container';

const App = () => (
  <Switch>
    <Route exact path="/" component={Main} />
    <Route exact path="/biz/:bizId" component={BizDetailContainer} />
  </Switch>
);

export default App;
