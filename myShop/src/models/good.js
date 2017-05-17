import pathToRegexp from 'path-to-regexp';

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
  discountPrice:0,
	onSale: false,
  likes:[],
  likeFlag:false,
  },
  reducers: {
  	save(state, { payload: { data: {id, shopId,itemId,categoryId,detail,imgUrl,price,cost,sold,unit,name,discount,discountPrice,onSale,likes,likeFlag } }}) {
      return { ...state, id, shopId,itemId,categoryId,detail,imgUrl,price,cost,sold,unit,name,discount,discountPrice,onSale,likes,likeFlag};
    },
    saveLike(state, { payload: { data: {likes,likeFlag } }}) {
      return { ...state, likes,likeFlag};
    },
  },
  effects: {
  	*fetch({ payload: { id } }, { call, put }) {
      // const { data, headers } = yield call(usersService.fetch, { page });
      // console.log({ payload : { id } });
      const datas = JSON.parse(
      	'[{"id":1,"shopId":1,"itemId":1,"categoryId":1,"detail":"very good","imgUrl":["http://www.starstech.tech:3200/uploads/shop/8.jpg","http://www.starstech.tech:3200/uploads/shop/9.jpg","http://www.starstech.tech:3200/uploads/shop/10.jpg"],"price":100,"cost":90,"sold":1,"stock":2,"unit":"只","name":"松石手镯","discount":9.5,"discountPrice":95,"onSale":true},{"id":2,"detail":"very good","discount":9,"shopId":1,"itemId":2,"categoryId":1,"imgUrl":["http://www.starstech.tech:3200/uploads/shop/7.jpg"],"price":110,"cost":95,"discountPrice":95,"sold":1,"stock":2,"unit":"个","name":"耳钉","onSale":true},{"id":3,"detail":"very good","discountPrice":95,"discount":9,"shopId":1,"itemId":3,"categoryId":1,"imgUrl":["http://www.starstech.tech:3200/uploads/shop/4.jpg"],"price":10.5,"cost":9.5,"sold":1,"stock":2,"unit":"条","name":"手串","onSale":true},{"id":4,"detail":"very good","discountPrice":95,"discount":9,"itemId":4,"shopId":1,"categoryId":2,"imgUrl":["http://www.starstech.tech:3200/uploads/shop/5.jpg"],"price":100.5,"cost":9.5,"sold":1,"stock":2,"unit":"个","name":"桶珠","onSale":true},{"id":5,"detail":"very good","discountPrice":95,"discount":9,"itemId":5,"shopId":1,"categoryId":2,"imgUrl":["http://www.starstech.tech:3200/uploads/shop/6.jpg"],"price":100.5,"cost":9.5,"sold":1,"stock":2,"unit":"个","name":"弥勒","onSale":true},{"id":6,"detail":"very good","discountPrice":95,"discount":9,"itemId":5,"shopId":1,"categoryId":2,"imgUrl":["http://www.starstech.tech:3200/uploads/shop/1.jpg","http://www.starstech.tech:3200/uploads/shop/2.jpg","http://www.starstech.tech:3200/uploads/shop/3.jpg"],"price":100.5,"cost":9.5,"sold":1,"stock":2,"unit":"个","name":"绿度母","onSale":true}]'
      );       
      const data = datas.find(f=>f.id===parseInt(id));
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
  	setup({ dispatch, history }) {
    
      return history.listen(({ pathname, query }) => {
        const match = pathToRegexp('/good/:id').exec(pathname);
        // console.log(match);
        if (match) {
          const id = match[1];
          dispatch({ type: 'fetch', payload: {id} });
        }
        // if (pathname === '/good/1') {
        //   dispatch({ type: 'fetch', payload: query });
        // }
      });
    },
  },
};
