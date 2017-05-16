import React from 'react';
import styles from './Good.css';
import Slider from 'react-slick';
import { connect } from 'dva';
import { Icon,Card,Layout,Button  } from 'antd';
import { doDiscount } from '../constants';

const { Header, Footer, Sider, Content } = Layout;

function Good({imgUrl,price,discount,sold,stock}) {
  const settings = {
      dots: true,
      infinite: true,
      speed: 2000,
      autoplaySpeed:10000,
      slidesToShow: 1,
      adaptiveHeight: true,
      autoplay:true,
      slidesToScroll: 1,
      pauseOnHover:true,
    };


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
      <Button type="primary">我要买</Button>
      <Button>Default</Button>
      </div>
      <Footer style={{  padding:'5px',position: 'fixed', width: '100%',bottom:'0',display:'flex' }}>
        <span style={{  width: '40%'  }}>
        留言，点赞
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
  const { id, shopId,itemId,categoryId,detail,imgUrl,price,cost,sold,unit,name,discount,onSale,stock, } = state.good;
  return {
    // loading: state.loading.models.users,
    id, shopId,itemId,categoryId,detail,imgUrl,price,cost,sold,unit,name,discount,onSale,stock
  };
}

export default connect(mapStateToProps)(Good);
