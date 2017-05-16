import React from 'react';
import styles from './Good.css';
import Slider from 'react-slick';
import { connect } from 'dva';
import { Icon,Card,Layout,Button  } from 'antd';
import { doDiscount } from '../constants';
import { Link } from 'dva/router';

const { Header, Footer, Sider, Content } = Layout;

function Good({dispatch,imgUrl,price,discount,sold,stock,detail,likes,likeFlag}) {
  const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      autoplaySpeed:10000,
      slidesToShow: 1,
      adaptiveHeight: true,
      autoplay:true,
      slidesToScroll: 1,
      pauseOnHover:true,
    };

  function addLike() {
    console.log(likes,likeFlag);
    dispatch({
      type: 'good/addLike',
      payload: {
        likes
      },
    });
  }


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
      <Icon type="like" />{likes?likes.length:0}
      <Footer style={{  padding:'5px',position: 'fixed', width: '100%',bottom:'0',display:'flex' }}>
        <span style={{  width: '40%'  }}>
          <Link to="/shop"><Icon type="left" /></Link>
          <Button shape="circle" icon="message" />
          {likeFlag?<Button shape="circle" icon="like" onClick={addLike}/>:<Button shape="circle" icon="like-o" onClick={addLike}/>}
        </span>
        <span style={{ width: '30%'  }}>
          <ul>
                <li ><s>¥{price}</s> <b>{discount}折</b></li>
                <li ><b>¥{doDiscount(price,discount)}</b>剩余:{stock}</li>
              </ul>
        </span>
        
        <span style={{ width: '30%'   }}>

        <Button type="primary">我要买</Button>
        </span>
      </Footer>
    </Layout>
  );
}

function mapStateToProps(state) {
  const { id, shopId,itemId,categoryId,detail,imgUrl,price,cost,sold,unit,name,discount,onSale,stock,likes,likeFlag } = state.good;
  return {
    // loading: state.loading.models.users,
    id, shopId,itemId,categoryId,detail,imgUrl,price,cost,sold,unit,name,discount,onSale,stock,likes,likeFlag
  };
}

export default connect(mapStateToProps)(Good);
