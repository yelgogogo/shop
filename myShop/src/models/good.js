// import pathToRegexp from 'path-to-regexp';

export default {
  namespace: 'good',
  state: {
	id: 0,
	shopId: 0,
	itemId: 0,
	categoryId: 0,
	detail: null,
	imgUrl: [	],
	price: 0,
	cost: 0,
	sold: 0,
	stock: 0,
	unit: null,
	name: null,
	discount: 0,
	onSale: false,
  likes:[],
  likeFlag:false,
  },
  reducers: {
  	save(state, { payload: { data: {id, shopId,itemId,categoryId,detail,imgUrl,price,cost,sold,unit,name,discount,onSale,likes,likeFlag } }}) {
      return { ...state, id, shopId,itemId,categoryId,detail,imgUrl,price,cost,sold,unit,name,discount,onSale,likes,likeFlag};
    },
    saveLike(state, { payload: { data: {likes,likeFlag } }}) {
      return { ...state, likes,likeFlag};
    },
  },
  effects: {
  	*fetch({ payload: { id } }, { call, put }) {
      // const { data, headers } = yield call(usersService.fetch, { page });
      const data = JSON.parse(
      	'{"id":1,"shopId":1,"itemId":1,"categoryId":1,"detail":"very good","imgUrl":["http://www.starstech.tech:3200/uploads/shop/8.jpg","http://www.starstech.tech:3200/uploads/shop/9.jpg","http://www.starstech.tech:3200/uploads/shop/10.jpg"],"price":100,"cost":90,"sold":1,"stock":2,"unit":"只","name":"松石手镯","discount":9.5,"onSale":true}'     
      	);
      yield put({
        type: 'save',
        payload: {
          data,
          // total: parseInt(headers['x-total-count'], 10),
          // page: parseInt(page, 10),
        },
      });
    },
    *addLike({ payload: { likes } }, { call, put }) {
      // const { data, headers } = yield call(usersService.fetch, { page });

      const data = JSON.parse(
        '{"likes":[1],"likeFlag":true}');
      yield put({
        type: 'saveLike',
        payload: {
          data,
          // total: parseInt(headers['x-total-count'], 10),
          // page: parseInt(page, 10),
        },
      });
    },
  },
  subscriptions: {
 //  	const match = pathToRegexp('/good/:id').exec(pathname);
	// if (match) {
	//   const id = match[1];
	//   dispatch({ type: 'fetch', payload: query });
	// }
  	setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/good') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
