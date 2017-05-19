import React from 'react';
import styles from './Basket.css';
import { connect } from 'dva';
import { Button,Icon,Layout,Steps,Card } from 'antd';
import {STEPS} from '../constants';

const { Header, Footer, Sider, Content } = Layout;

function Basket({info,orders,goods}) {
  function goBack(){
    history.back();
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
  const { info,orders,goods} = state.basket;
  return {
    // loading: state.loading.models.users,
    info,orders,goods
  };
}

export default connect(mapStateToProps)(Basket);
