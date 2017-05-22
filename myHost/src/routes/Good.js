import React from 'react';
import { connect } from 'dva';
import styles from './Good.css';
import GoodComponent from '../components/Good';

function Good() {
  return (
    <div className={styles.normal}>
      <GoodComponent />
    </div>
  );
}

// function mapStateToProps() {
//   return {};
// }

export default connect()(Good);
