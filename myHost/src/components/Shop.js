import React from 'react';
import styles from './Shop.css';
import { connect } from 'dva';
import { Menu,Icon,Card,Layout,Row, Col,Affix,Badge,Button,Modal,Input,Radio,Form } from 'antd';
import { doDiscount } from '../constants';
import { Link } from 'dva/router';
import GoodModal from './GoodModal';

// import dragula  from 'react-dragula';

const { Header, Footer, Sider, Content } = Layout;

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

function Shop({dispatch,shop, categorys, goods,items,select,collapsed,totalCount,action,modal1Visible,modal2Visible,modal3Visible,modal2ErrMsg,modal1ErrMsg}) {
  const handleClick = (e) => {
    const x=1;
  	dispatch({
      type: 'shop/selectCategory',
      payload: {
      	select:{
		      categoryId:parseInt(e.keyPath[1]),
		      itemId:parseInt(e.key),
		    },
      },
    });
    //console.log('click ', e);
  }


  function doAction(action){
    dispatch({
      type: `shop/${action.operCode}`,
      payload: {
        action
      },
    });

  }

  //add
  function setModal2Visible(visible,action,typeIn,obj) {
    
    console.log(visible,action,typeIn,obj);
    let setValues={};
    let payloaddata={};
    switch(typeIn){
      case 'categorys':
        setValues = {
          shopId:shop.id,
          sequence:categorys.length+1,
          name:'',
        };
        payloaddata={
          modal2Visible:visible,
        };
        break;
      case 'items':
        setValues = {
          shopId:shop.id,
          sequence:items.length+1,
          name:'',
          categoryId:obj.id,
        }
        payloaddata={
          modal2Visible:visible,
        };
        break;
      case 'goods':
        setValues = {
          shopId:shop.id,
          sequence:items.length+1,
          name:'',
          categoryId:obj.id,
        }
        payloaddata={
          modal3Visible:visible,
        };
        break;
    }

    dispatch({
      type: 'shop/setModal2Visible',
      payload: payloaddata,
    });

    dispatch({
      type: 'shop/saveAction',
      payload: {
        action:{
          operCode:'add',
          type:typeIn,
          values:setValues,
        },
      },
    });
  }

  //modify & delete
  function setModal1Visible(modal1Visible,action,typeIn,obj) {
    dispatch({
      type: 'shop/setModal1Visible',
      payload: {
        modal1Visible:modal1Visible,
      },
    });
    // console.log(modal1Visible,{category});
    const operCode= (action.operCode==='add')?'modify':action.operCode;
    if (obj) {
      dispatch({
        type: 'shop/saveAction',
        payload: {
          action:{
            ...action,
            operCode:operCode,
            type:typeIn,
            values:obj,
          },
        },
      });
    }
  }


  function setCategoryName(action,e){
    dispatch({
      type: 'shop/saveAction',
      payload: {
        action:{
          ...action,
          values:{
            ...action.values,
            name:e.target.value,
          }
        },
      },
    });
  }

  const toggle = () => {
    dispatch({
      type: 'shop/toggleMenu',
      payload: {
        collapsed:collapsed,
      }
    });

  }

  function changeRadio(action,e){
    console.log(e,action);
    dispatch({
      type: 'shop/saveAction',
      payload: {
        action:{...action,
          operCode:e.target.value,
        },
      },
    });
  }

  const FormItem = Form.Item;
  const record={};

  function editHandler(typeIn,operCodeIn,action,values) {
    console.log(typeIn,action,values);
    console.log({...values,shopId:shop.id});
    dispatch({
      type: 'shop/saveAction',
      payload: {
        action:{
          operCode:operCodeIn,
          type:typeIn,
          values:{...values,shopId:shop.id},
        },
      },
    });
    console.log(action);
    dispatch({
      type: `shop/${operCodeIn}`,
      payload: {
        action
      },
    });
  }

  function enterGoodModal(e){
    e.preventDefault(); 
  }

  return (
    <Layout>
         
        <Modal
          title="增加分类"
          wrapClassName={styles.verticalCenterModal}
          visible={modal2Visible}
          onOk={doAction.bind(null,action)}
          onCancel={() => setModal2Visible(false)}
        >
          <h3>请输入分类名称</h3>
          <Input placeholder="新的分类" onChange={setCategoryName.bind(null,action)}/>
          <p>{modal2ErrMsg}</p>
        </Modal>
        <Modal
          title="修改分类"
          wrapClassName={styles.verticalCenterModal}
          visible={modal1Visible}
          onOk={doAction.bind(null,action)}
          onCancel={() => setModal1Visible(false)}
        >
          <h3>{action.values?action.values.name:null}</h3>
          
          {action.operCode==='modify'?<div><h3>请输入分类名称</h3><Input placeholder="新的分类" onChange={setCategoryName.bind(null,action)}/></div>:null}
          
          <p>{modal1ErrMsg}</p>
          <RadioGroup defaultValue="modify" size="large" onChange={changeRadio.bind(null,action)}>
            <RadioButton value="deletes" >删除分类</RadioButton>
            <RadioButton value="modify" >修改分类</RadioButton>
            
          </RadioGroup>
        </Modal>
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
                  console.log(items);
                  return (category.shopId===shop.id)?<SubMenu key={category.id} title={<span><Button type="dashed" shape="circle" icon="edit" onClick={setModal1Visible.bind(null,true,action,'categorys',category)}></Button>{category.name}</span> }>
                    { 
                      items.map(function (item) {
                    return (item.shopId===shop.id&&item.categoryId===category.id)?<Menu.Item key={category.id,item.id}><Button type="dashed" shape="circle" icon="edit" onClick={setModal1Visible.bind(null,true,action,'items',item)}></Button>{item.name}</Menu.Item>:null  
                    })
                    }
                    <Menu.Item key={category.id}><Button onClick={setModal2Visible.bind(null,true,action,'items',category)}>增加种类</Button></Menu.Item>

                  </SubMenu>:null
                })
            }
          <Menu.Item ><Button onClick={setModal2Visible.bind(null,true,action,'categorys')}>增加分类</Button></Menu.Item>
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
          <Col span={12} >
              <Card bodyStyle={{ padding: 0 ,height:'27vh'}} onClick={setModal2Visible.bind(null,true,action,'goods',{itemId:select.itemId,shopId:shop.id,categoryId:select.categoryId,shopName:shop.shopName})}>
                
                <GoodModal record={{itemId:select.itemId,shopId:shop.id,categoryId:select.categoryId,shopName:shop.shopName,imgUrl:[]}} onOk={editHandler.bind(null,'goods','add',action)}>
                  <Button>增加商品</Button>
                </GoodModal>
              </Card>
          </Col>
          {
            goods.map(function (good) {
              console.log(good);
              console.log(good.onSale,good.shopId,shop.id,good.itemId,select.itemId);
              const linkPath="/good/"+good.id;
            return (good.onSale&&good.shopId===shop.id&&good.itemId===select.itemId)?
            <Col span={12} key={good.id}>
              <Link to={linkPath}>
              <Card bodyStyle={{ padding: 0 }} >
                <GoodModal record={good} onOk={editHandler.bind(null,'goods','modify',action)}>
                  <Button onClick={enterGoodModal}>编辑商品</Button>
                </GoodModal>
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
      <Affix style={{ position: 'absolute', top: 40, right: 20}}>
        
        <Badge count={totalCount} style={{ backgroundColor: '#87d068' }}>
          <Link to="/cart">
            <Button type="primary" shape="circle" icon="shopping-cart" style={{ width:'40px',height:'40px'}}></Button>
          </Link>
        </Badge>
      </Affix>
        </Layout>
    </Layout>
    
  );
}

function componentDidMount () {
    var container = React.findDOMNode(this);
    dragula([container]);
  }

function mapStateToProps(state) {
  const { shop, categorys, goods,items,select,collapsed,modal2Visible,modal2ErrMsg,modal1Visible,modal3Visible,modal1ErrMsg,action } = state.shop;
  const {totalCount} = state.cart;
  return {
    // loading: state.loading.models.users,
    shop,
    select,
    categorys,
    items,
    goods,
    totalCount,
    collapsed,
    modal2Visible,
    modal1Visible,
    modal3Visible,
    modal2ErrMsg,
    modal1ErrMsg,
    action,
  };
}

export default connect(mapStateToProps)(Shop);
