import React from 'react';
import styles from './Shop.css';
import { connect } from 'dva';
import { Menu,Icon,Card,Layout,Row, Col } from 'antd';
import { doDiscount } from '../constants';

const { Header, Footer, Sider, Content } = Layout;

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function Shop({dispatch,shop, categorys, goods,items,select}) {
  const handleClick = (e) => {
  	dispatch({
      type: 'shop/selectCategory',
      payload: {
      	select:{
		  // categoryId:parseInt(e.key),
		  itemId:parseInt(e.key),
		},
      },
    });
    console.log('click ', e);
  }


  function deleteHandler(id) {
    console.warn(`TODO: ${id}`);
  }


  return (
    <Layout >
      <Header >{shop.shopName}</Header>
      <div>
      <Button type="primary">我要买</Button>
      <Button>Default</Button>
      </div>
      <Layout >
    <Sider width={120}>	
      <Menu className={styles.menu}
        onClick={handleClick.bind(null)}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['0']}
        mode="inline"
      >
	      {
	      	categorys.map(function (category) {
	            return (category.shopId===shop.id)?<SubMenu key={category.id} title={category.name}>
	              { 
	              	items.map(function (item) {
			      	  return (item.shopId===shop.id&&item.categoryId===category.id)?<Menu.Item key={item.id}>{item.name}</Menu.Item>:null  
	            	})
			      }
	            </SubMenu>:null
	          })
	      }
      </Menu>
      </Sider>
      <Content>
      	<Row>
      	  {
      	  	goods.map(function (good) {
	      	  return (good.onSale&&good.shopId===shop.id&&good.itemId===select.itemId)?
	      	  <Col span={12} key={good.id}>
		      	  <Card bodyStyle={{ padding: 0 }}>
				    <div className="custom-image">
				      <img className="custom-image2" height="120vh" alt="example" width="100%" src={good.imgUrl[0]} />
				    </div>
				    <div className="custom-card">
				      <h3>{good.name}</h3>
				      <ul>
				      	<li><s>¥{good.price}</s> <b>{good.discount}折</b></li>
				      	<li><b>¥{doDiscount(good.price,good.discount)}</b>已售:{good.sold}剩余:{good.stock}</li>
				      </ul>
				    </div>
				  </Card>
	      	  </Col>:null  
        	})
      	  }      	  
    	</Row>
      	
      </Content>
      </Layout>
    </Layout>
  );
}

function mapStateToProps(state) {
  const { shop, categorys, goods,items,select } = state.shop;
  return {
    // loading: state.loading.models.users,
    shop,
    select,
    categorys,
    items,
    goods,
  };
}

export default connect(mapStateToProps)(Shop);
