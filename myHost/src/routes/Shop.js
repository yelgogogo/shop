import React from 'react';
import { connect } from 'dva';
import styles from './Shop.css';
import ShopComponent from '../components/Shop';

function Shop() {
  return (
    <div className={styles.normal}>
      <ShopComponent />
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect()(Shop);
