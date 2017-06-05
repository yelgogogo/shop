import React from 'react';

import { connect } from 'dva';
import { Button, Layout, Steps, Card } from 'antd';
import {STEPS} from '../constants';
import styles from './Basket.css';

const { Header, Footer, Content } = Layout;

function Basket({ dispatch, action, orders, goods }) {
  function goBack(){
    history.back();
  }

  // function doAction(action){
  //   dispatch({
  //     type: `basket/${action.operCode}`,
  //     payload: {
  //       action
  //     },
  //   });

  // }

  function changeStatus(order, typein, statusin) {
    console.log(order);
    dispatch({
      type: 'basket/saveAction',
      payload: {
        action: {
          ...action,
          type: typein,
          values: {
            id: order.id,
            status: statusin,
          }
        },
      },
    });

    dispatch({
      type: `basket/${action.operCode}`,
      payload: {
        action
      },
    });
  }

  return (
    <div className={styles.normal}>
      <Layout className={styles.normal}>
      	<Header>
      		买到的宝贝
      	</Header>
      	<Content>
      		{
      			orders.map(order=>
      				<Card bordered={false} style={{ width: '100%' }} key={order.id}>
		      	  	<Layout>
		      	  		<Content>
				    				{
				    					goods.filter(g=>g.orderId===order.id).map(fg=>
				    						<Card title={fg.shopName} key={fg.id} >
                          <div className={styles.goodInfo}>
				    							<span className="custom-image">
                            <img className={styles.customImage}  alt="example" width="100%" src={fg.imgUrl[0]} />
                          </span>

				    							<span className={styles.goodSpan}>{fg.name}</span>
				    							<span style={{ padding: '5px' }}>¥{fg.discountPrice}<br />x {fg.count}</span>
				    							<span ></span>
                          </div>

				    						</Card>
				    					)
				    				}
		      	  		</Content>
				    			<Footer>
                    <p>{order.id}</p>
                    <p>¥{order.totalPrice}</p>
                    <p>{STEPS[order.status].content}</p>
				    				<p>logistics info</p>
                    <Button icon="check-circle-o" onClick={changeStatus.bind(null,order,'orders',5)}>交易完成</Button>
				    			</Footer>
				    		</Layout>
				  		</Card>
		  			)
      		}
      	  
      	</Content>
      	<Footer className={styles.footer}>
          <Button shape="circle" icon="left" onClick={goBack.bind(null)}/>
      	</Footer>
      </Layout>
    </div>
  );
}

function mapStateToProps(state) {
  const { action,orders,goods} = state.basket;
  return {
    // loading: state.loading.models.users,
    action,orders,goods
  };
}

export default connect(mapStateToProps)(Basket);
