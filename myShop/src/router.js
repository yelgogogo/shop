import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';

import Shop from "./routes/Shop.js";

import Good from "./routes/Good.js";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={Shop} />
      <Route path="/shop" component={Shop} />
      <Route path="/good" component={Good} />
    </Router>
  );
}

export default RouterConfig;
