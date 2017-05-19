import React from 'react';
import { connect } from 'dva';
import styles from './Cart.css';
import CartComponent from '../components/Cart';

function Cart() {
  return (
    <div className={styles.normal}>
      <CartComponent />
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Cart);
