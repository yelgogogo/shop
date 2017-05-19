
export default {
  namespace: 'basket',
  state: {
  	info:{
  	  userId: 0,
  	  userName: null,
  	},
  	orders:[],
  	goods:[]
  },
  reducers: {
  	save(state, { payload: { data: {info,orders,goods } }}) {
      return { ...state,info,orders,goods};
    },
  },
  effects: {
  	*fetch({ payload: { userId } }, { call, put }) {
	  // const { data, headers } = yield call(usersService.fetch, { page });
	  // console.log({ payload : { id } });
		  const data = JSON.parse(
		  	'{"info":{"userId":1,"userName":"tester"},"orders":[{"id":1,"totalPrice":10,"totalCount":10,"payMode":"offline","Address":"myAddress","status":3,"logistics":{"vendor":null,"trackingNo":0,"trackingStatus":null,"description":null}},{"id":2,"totalPrice":20,"totalCount":20,"payMode":"offline","Address":"myAddress2","status":2,"logistics":{"vendor":null,"trackingNo":0,"trackingStatus":null,"description":null}}],"goods":[{"id":1,"orderId":1,"shopId":1,"shopName":"测试小店","itemId":1,"categoryId":1,"detail":"very good","imgUrl":["http://www.starstech.tech:3200/uploads/shop/8.jpg","http://www.starstech.tech:3200/uploads/shop/9.jpg","http://www.starstech.tech:3200/uploads/shop/10.jpg"],"price":100,"unit":"只","name":"松石手镯","discount":9.5,"discountPrice":95,"onSale":true,"count":2},{"id":1,"orderId":2,"shopId":1,"shopName":"测试小店","itemId":1,"categoryId":1,"detail":"very good","imgUrl":["http://www.starstech.tech:3200/uploads/shop/8.jpg","http://www.starstech.tech:3200/uploads/shop/9.jpg","http://www.starstech.tech:3200/uploads/shop/10.jpg"],"price":100,"unit":"只","name":"松石手镯","discount":9.5,"discountPrice":95,"onSale":true,"count":3}]}'
      );       
		  yield put({
		    type: 'save',
		    payload: {
		      data,
		  	},
		  });
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
