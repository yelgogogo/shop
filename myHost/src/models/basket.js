import * as shopService from '../services/shopService'; 

export default {
  namespace: 'basket',
  state: {
  	orders:[],
  	goods:[],
    action:{
      operCode:'modify',
      type:null,
      values:null,
    },
  },
  reducers: {
  	save(state, { payload: { data: {info,orders,goods } }}) {
      return { ...state,info,orders,goods};
    },
    saveAction(state, { payload: { action} } ) {
      return { ...state, action};
    },
  },
  effects: {
  	*fetch({ payload: { shopId, type} }, { call, put }) {
      // let orders={};
      // orders[type]={shopId}
  	  const { data, headers } = yield call(shopService.loadAll, { orders:{shopId}});
      console.log(data);
      // const orders = data.orders.map(o=>{delete o.goods; return o});
      const orders =data.orders.filter(o=>o.status!==5);
      let goods=[];
      orders.forEach(ord => {
        goods = ord.goods.map(g=>{g.orderId=ord.id; return g}).concat(goods);
        }
      )
    
	  // console.log({ payload : { id } });
		  // const data = JSON.parse(
		  // 	'{"orders":[{"id":1,"userId":1,"userName":"tester","totalPrice":10,"totalCount":10,"payMode":"offline","Address":"myAddress","status":3,"logistics":{"vendor":null,"trackingNo":0,"trackingStatus":null,"description":null}},{"id":2,"totalPrice":20,"totalCount":20,"payMode":"offline","Address":"myAddress2","status":2,"logistics":{"vendor":null,"trackingNo":0,"trackingStatus":null,"description":null}}],"goods":[{"id":1,"orderId":1,"shopId":1,"shopName":"测试小店","itemId":1,"categoryId":1,"detail":"very good","imgUrl":["http://www.starstech.tech:3200/uploads/shop/8.jpg","http://www.starstech.tech:3200/uploads/shop/9.jpg","http://www.starstech.tech:3200/uploads/shop/10.jpg"],"price":100,"unit":"只","name":"松石手镯","discount":9.5,"discountPrice":95,"onSale":true,"count":2},{"id":1,"orderId":2,"shopId":1,"shopName":"测试小店","itemId":1,"categoryId":1,"detail":"very good","imgUrl":["http://www.starstech.tech:3200/uploads/shop/8.jpg","http://www.starstech.tech:3200/uploads/shop/9.jpg","http://www.starstech.tech:3200/uploads/shop/10.jpg"],"price":100,"unit":"只","name":"松石手镯","discount":9.5,"discountPrice":95,"onSale":true,"count":3}]}'
    //   );       
		  yield put({
		    type: 'save',
		    payload: {
		      data:{orders,goods},
		  	},
		  });
		},
    *modify({ payload: { xy} }, { call, put,select }) {
      const action = yield select(state => state.basket.action);
      const { data, headers } = yield call(shopService.modify, { action }); 
      console.log(data); 
      if (data[action.type].on_err){
        // yield put({
        //   type: 'setModal1Visible',
        //   payload: {
        //     modal1Visible:true,
        //     modal1ErrMsg:data[action.type].err_msg,
        //   },
        // });
      }else{
        const orders =data.orders.filter(o=>o.status!==5);
        let goods=[];
        orders.forEach(ord => {
          // let ord = data.orders;
          goods = ord.goods.map(g=>{g.orderId=ord.id; return g}).concat(goods);
          }
        )
        yield put({
          type: 'save',
          payload: {
            data:{orders,goods},
          },
        });
        // yield put({
        //   type: 'setModal1Visible',
        //   payload: {
        //     modal1Visible:false,
        //   },
        // });
      }
    },
  },
  subscriptions: {
  	setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        // const match = pathToRegexp('/good/:id').exec(pathname);
        // if (match) {
        //   const id = match[1];
        //   dispatch({ type: 'fetch', payload: {id} });
        // }
        if (pathname === '/basket') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
