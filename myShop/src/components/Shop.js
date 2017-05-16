import React from 'react';
import styles from './Shop.css';
import { connect } from 'dva';
import { Menu,Icon,Card,Layout,Row, Col } from 'antd';
import { doDiscount } from '../constants';
import { Link } from 'dva/router';

const { Header, Footer, Sider, Content } = Layout;

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function Shop({dispatch,shop, categorys, goods,items,select,collapsed}) {
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

  // const state = {
  //   collapsed: false,
  // };
  // let imgheight='120vh';
  const toggle = () => {
    dispatch({
      type: 'shop/toggleMenu',
      payload: {
        collapsed:collapsed,
      }
    });
    // imgheight=collapsed?'120vh':'150vh';
    // console.log('collapsed ', collapsed,imgheight);
    // this.setState({
    //   collapsed: !this.state.collapsed,
    // });
  }


  return (
    <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={120}
          collapsedWidth={0}
        >
          <Menu className={styles.menu}
            onClick={handleClick.bind(null)}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['1']}
            mode="inline"
          >
            {
              categorys.map(function (category,i) {
                  return (category.shopId===shop.id)?<SubMenu key={i} title={category.name}>
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
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={toggle}

            />{shop.shopName}
          </Header>
          <Content>
        <Row>
          {
            goods.map(function (good) {
            return (good.onSale&&good.shopId===shop.id&&good.itemId===select.itemId)?
            <Col span={12} key={good.id}>
              <Link to="/good">
              <Card bodyStyle={{ padding: 0 }} onClick={toggle}>
                <div className="custom-image">
                  <img className="custom-image2" height={collapsed ? '180vh' : '120vh'} alt="example" width="100%" src={good.imgUrl[0]} />
                </div>
                <div className="custom-card">
                  <h3>{good.name}</h3>
                  <ul>
                    <li><s>¥{good.price}</s> <b>{good.discount}折</b></li>
                    <li><b>¥{doDiscount(good.price,good.discount)}</b>已售:{good.sold}剩余:{good.stock}</li>
                  </ul>
                </div>
              </Card>
              </Link>
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
  const { shop, categorys, goods,items,select,collapsed } = state.shop;
  return {
    // loading: state.loading.models.users,
    shop,
    select,
    categorys,
    items,
    goods,
    collapsed,
  };
}

export default connect(mapStateToProps)(Shop);
