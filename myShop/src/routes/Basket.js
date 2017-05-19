import React from 'react';
import { connect } from 'dva';
import styles from './Basket.css';
import BasketComponent from '../components/Basket';

function Basket() {
  return (
    <div className={styles.normal}>
      <BasketComponent />
    </div>
  );
}

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Basket);
