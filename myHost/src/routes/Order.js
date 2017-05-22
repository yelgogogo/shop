import React from 'react';
import { connect } from 'dva';
import styles from './Order.css';
import OrderComponent from '../components/Order';

function Order() {
  return (
    <div className={styles.normal}>
      <OrderComponent />
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Order);
