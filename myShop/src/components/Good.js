import React from 'react';
import styles from './Good.css';
import Slider from 'react-slick';
import { connect } from 'dva';
import { Icon,Card,Layout,Button,Affix,Badge  } from 'antd';
import { doDiscount } from '../constants';
import { Link } from 'dva/router';

const { Header, Footer, Sider, Content } = Layout;

function Good({dispatch,id,shopId,itemId,categoryId,imgUrl,price,unit,name,discount,discountPrice,sold,stock,detail,likes,likeFlag,totalCount,goods}) {
  const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      autoplaySpeed:10000,
      slidesToShow: 1,
      adaptiveHeight: false,
      autoplay:true,
      slidesToScroll: 1,
      pauseOnHover:true,
    };

  function addLike() {
    dispatch({
      type: 'good/addLike',
      payload: {
        likes
      },
    });
  }

  function addCart(addGood) {
    const count=1;
    console.log(goods,addGood);
    if (goods.find(f=>f.id===addGood.id))
    {
      goods=goods.map(g=>
        g.id===addGood.id?{...g,count:(g.count+count)}:g
      );
    
    }else{
      goods.push({...addGood,count:count});
    }
    dispatch({
      type: 'cart/saveGoods',
      payload: {
        data:{goods},
      },
    });
  }


  function buyGood(functionIn,addGood){
    functionIn(addGood);

  }


  const shopLink=`/shop/${shopId}`;
  const cartLink=`/cart`;

  return (
    <Layout >
      
      <Content>
        <Slider {...settings}>
          
          {
      			imgUrl.map(function (imgsrc,i) {
      		    return <div className="custom-image" key={i}><img  className="custom-image2"  alt="example" width="100%" src={imgsrc} /></div>
      		  })
    		  }

        </Slider>
      </Content>
      <div>
        {detail}
      </div>
      <Affix style={{ position: 'absolute', top: 20, right: 20}}>
        
        <Badge count={totalCount} style={{ backgroundColor: '#87d068' }}>
          <Link to="/cart">
            <Button type="primary" shape="circle" icon="shopping-cart" style={{ width:'40px',height:'40px'}}></Button>
          </Link>
        </Badge>
      </Affix>
      <Icon type="like" />{likes?likes.length:0}
      <Footer style={{  padding:'5px',position: 'fixed', width: '100%',bottom:'0',display:'flex' }}>
        <span style={{  width: '30%'  }}>
          <Link to={shopLink}><Icon type="left" /></Link>
          <Button shape="circle" icon="message" />
          {likeFlag?<Button shape="circle" icon="like" onClick={addLike}/>:<Button shape="circle" icon="like-o" onClick={addLike}/>}
        </span>
        <span style={{ width: '30%'  }}>
          <ul>
                <li ><s>¥{price}</s> <b>{discount}折</b></li>
                <li ><b>¥{doDiscount(price,discount)}</b>剩余:{stock}</li>
              </ul>
        </span>
        
        <span style={{ width: '40%'   }}>
        <Button icon="shopping-cart" onClick={addCart.bind(null,{id,shopId,itemId,categoryId,imgUrl,price,unit,name,discount,discountPrice,detail})}>+</Button>
        <Link to={cartLink}><Button type="primary" onClick={buyGood.bind(null,addCart,{id,shopId,itemId,categoryId,imgUrl,price,unit,name,discount,discountPrice,detail})}>我要买</Button></Link>
        </span>
      </Footer>
    </Layout>
  );
}

function mapStateToProps(state) {
  const { id, shopId,itemId,categoryId,detail,imgUrl,price,cost,sold,unit,name,discount,discountPrice,onSale,stock,likes,likeFlag } = state.good;
  const {totalCount,goods} = state.cart;
  return {
    // loading: state.loading.models.users,
    totalCount,goods,id, shopId,itemId,categoryId,detail,imgUrl,price,cost,sold,unit,name,discount,discountPrice,onSale,stock,likes,likeFlag
  };
}

export default connect(mapStateToProps)(Good);
