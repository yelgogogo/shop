import React from 'react';
import styles from './Cart.css';
import { connect } from 'dva';
import { Table } from 'antd';
import { Menu, Dropdown, Button,Icon,Layout,Radio,Tabs   } from 'antd';
import { Link } from 'dva/router';
import BasketComponent from './Basket';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { Header, Footer, Sider, Content } = Layout;
const TabPane = Tabs.TabPane;

function Cart({dispatch,goods,totalPrice,payMode}) {

  const menu = (
	<Menu>
	  <Menu.Item>
	    <Button icon="delete" >删除</Button>
	  </Menu.Item>
	  <Menu.Item>
	    <Button icon="edit" >修改</Button>
	  </Menu.Item>
	</Menu> 
  );
	
  const columns = [{
	  title: '商品',
	  dataIndex: 'name',
	},{
	  title: '折扣',
	  dataIndex: 'discount',
    render: (text,record) => <span><s>{record.price}</s> <b>{record.discount}折</b></span>,
  },{
	  title: '单价',
	  dataIndex: 'discountPrice',
	  render: (text,record) => <span><b>¥{record.discountPrice}</b></span>,
	},{
	  title: 'Count',
	  dataIndex: 'count',
    render: (text,record) => <span><Button shape="circle" icon="minus" onClick={changeGood.bind(null,record.id,-1)}/><b>{record.count}</b><Button shape="circle" icon="plus" onClick={changeGood.bind(null,record.id,1)} /></span>,
	},{
	  title: '', dataIndex: '', key: 'x', 
	  render: (text,record) => <Button shape="circle" icon="delete" onClick={changeGood.bind(null,record.id,-99999)}></Button>,
	}];

  function goBack(){
    history.back();
  }

  function changePaymode(e){
    dispatch({
      type: 'cart/changePaymode',
      payload: {
        payMode:e.target.value,
      },
    });
  }

  function changeGood(id,num){
    // console.log(id,num);
    goods=goods.map(g=>
      g.id===id?{...g,count:(g.count+num)}:g
    ).filter(f=>f.count>0);
    dispatch({
      type: 'cart/saveGoods',
      payload: {
        data:{goods},
      },
    });
  }

  function buyGood(id,functionIn){
    functionIn(id,1);
  }

  function callback(key) {
    console.log(key);
    switch (key){
      case 'basket' :
        dispatch({ type: 'basket/fetch', payload: {} });
        break; 
    }
  }

  return (
    <Layout>
    <Header>
      <h4>我的购物车</h4>
    </Header>
    <Content style={{backgroundColor: 'white'}}>
    <Tabs onChange={callback} type="card">
    <TabPane tab="待付款" key="paying">
      <Layout className={styles.normal}>

      <Content>
        
        <Table columns={columns} dataSource={goods} size="small" rowKey={record => record.id} 
          expandedRowRender={record => <p>
              <img className="custom-image2" width="100px" height="100px" src={record.imgUrl[0]} />
              <span>单位:{record.unit}</span>
              <span>{record.detail}</span>
            </p>}
        />
      </Content>

      <Footer style={{  padding:'5px',position: 'fixed', width: '100%',bottom:'0',display:'flex',flexFlow: 'row wrap' }}>
        <div style={{  width: '100%',textAlign:'right'}}>
        <span style={{     position: 'relative'  }}>请选择支付方式:
        </span>
        <span style={{     position: 'relative'  }}> 
          <RadioGroup defaultValue="offline" onChange={changePaymode.bind(null)} size="large">
            <RadioButton value="offline" >线下交易</RadioButton>
            <RadioButton value="online" >线上支付</RadioButton>
          </RadioGroup>
        </span>
        </div>
        <div style={{  width: '100%',height:'32px'  }}>
        </div>
        <span style={{  width: '30%'  }}>
          <Button shape="circle" icon="left" onClick={goBack.bind(null)}/>
          <Button shape="circle" icon="message" />
          
        </span>
        <span style={{ width: '30%'  }}>
          <ul>
                <li ><b>¥{totalPrice}</b></li>
              </ul>
        </span>
        
        <span style={{ width: '40%'   }}>
        <Button type="primary" style={{  right: '0px',    position: 'absolute'  }}>提交</Button>
        </span>
    
      </Footer>
    </Layout>
    </TabPane>
    <TabPane tab="交易中" key="basket">
      <BasketComponent />
    </TabPane>
    <TabPane tab="已完成" key="3">Content of Tab Pane 3</TabPane>
    </Tabs>
    </Content>
    </Layout>
    
  );
}

function mapStateToProps(state) {
  const { userId,userName,shopId,totalPrice,totalCount,goods,payMode} = state.cart;
  return {
    // loading: state.loading.models.users,
    userId,userName,shopId,totalPrice,totalCount,goods,payMode
  };
}

export default connect(mapStateToProps)(Cart);
