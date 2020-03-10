import React from "react";
import { Switch, Route } from "react-router-dom";

import Main from "./main/main_page";
import BizDetailContainer from './biz/biz_detail_container';
import BizListContainer from './biz/biz_list_container';
import Modal from './modal/modal';
import NavBarContainer from './navbar/navbar_container';

const App = () => (
  <div>
    <Modal />
    {/* <header>
      <NavBarContainer />
    </header> */}
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/search" component={BizListContainer} />
      <Route exact path="/biz/:bizId" component={BizDetailContainer} />
    </Switch>
  </div>
);

export default App;
