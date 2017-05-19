import React from 'react';
import styles from './Order.css';
import { connect } from 'dva';
import { Button,Icon,Layout,Steps,Card } from 'antd';
import {STEPS} from '../constants';


const Step = Steps.Step;

const { Header, Footer, Sider, Content } = Layout;

function Order({goods,info,status,payMode,Address}) {
  console.log(status);
  return (
    <div className={styles.normal}>
      <Layout className={styles.normal}>
      	<Header style={{padding:'0',height:'inherit',lineHeight:1.2}}>
      	  <Steps current={status}>
          {STEPS.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className="steps-content">{STEPS[status].content}</div>

      	</Header>
      	<Content>
      	  <Card title="卖家" bordered={false} style={{ width: '100%' }}>
		    <p>Card content</p>
		    <p>Card content</p>
		    <p>Card content</p>
		  </Card>
		  <Card title="Card title" bordered={false} style={{ width: '100%' }}>
		    <p>Card content</p>
		    <p>Card content</p>
		    <p>Card content</p>
		  </Card>
		  <Card title="Card title" bordered={false} style={{ width: '100%' }}>
		    <p>Card content</p>
		    <p>Card content</p>
		    <p>Card content</p>
		  </Card>
		  <Card title="Card title" bordered={false} style={{ width: '100%' }}>
		    <p>Card content</p>
		    <p>Card content</p>
		    <p>Card content</p>
		  </Card>
		  <Card title="Card title" bordered={false} style={{ width: '100%' }}>
		    <p>Card content</p>
		    <p>Card content</p>
		    <p>Card content</p>
		  </Card>
      	</Content>
      	<Footer>
      	</Footer>
      </Layout>
    </div>
  );
}

function mapStateToProps(state) {
  const { goods,info,status,payMode,Address} = state.order;
  return {
    // loading: state.loading.models.users,
    goods,info,status,payMode,Address
  };
}

export default connect(mapStateToProps)(Order);
