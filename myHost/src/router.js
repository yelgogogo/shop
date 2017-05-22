import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';

import Shop from "./routes/Shop.js";

import Good from "./routes/Good.js";

import Cart from "./routes/Cart.js";

import Order from "./routes/Order.js";

import Basket from "./routes/Basket.js";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={Shop} />
      <Route path="/shop/:id" component={Shop} />
      <Route path="/good/:id" component={Good} />
      <Route path="/cart" component={Cart} />
      <Route path="/order" component={Order} />
      <Route path="/basket" component={Basket} />
    </Router>
  );
}

export default RouterConfig;
