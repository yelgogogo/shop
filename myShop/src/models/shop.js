import pathToRegexp from 'path-to-regexp';
import * as shopService from '../services/shopService'; 

export default {
  namespace: 'shop',
  state: {
  	shop: {},
  	categorys: [],
  	items:[],
  	goods: [],
  	select:{
  	  categoryId:0,
  	  itemId:0,
  	},
    collapsed: false,
  },
  reducers: {
  	save(state, { payload: { data: {shop, categorys,goods,items} } }) {
      return { ...state, shop, categorys,goods,items};
    },
    selectCategory(state, { payload: { select} } ) {
      return { ...state, select};
    },
    toggleMenu(state, { payload: { collapsed=false} } ) {
      collapsed=!collapsed;
      return { ...state, collapsed};
    },
  },
  effects: {
  	*fetch({ payload: { id } }, { call, put }) {
      const shopId=id;
      const { data, headers } = yield call(shopService.loadAll, { shop:{id},categorys:{shopId},items:{shopId},goods:{shopId} });
      console.log(data);
      data.shop=data.shop[0];
      // const data = JSON.parse(
      // 	'{"shop":{"owner":"Michael","shopName":"测试小店","id":1},"categorys":[{"shopId":1,"id":1,"sequence":11,"name":"首饰"},{"shopId":1,"id":2,"sequence":2,"name":"吊坠"}],"items":[{"id":1,"shopId":1,"categoryId":1,"name":"手镯"},{"id":2,"shopId":1,"categoryId":1,"name":"耳钉"},{"id":3,"shopId":1,"categoryId":1,"name":"手链"},{"id":4,"shopId":1,"categoryId":2,"name":"桶珠"},{"id":5,"shopId":1,"categoryId":2,"name":"佛像"}],"goods":[{"id":1,"shopId":1,"itemId":1,"categoryId":1,"detail":"very good","imgUrl":["http://www.starstech.tech:3200/uploads/shop/8.jpg","http://www.starstech.tech:3200/uploads/shop/9.jpg","http://www.starstech.tech:3200/uploads/shop/10.jpg"],"price":100,"cost":90,"sold":1,"stock":2,"unit":"只","name":"松石手镯","discount":9.5,"discountPirce":95,"onSale":true},{"id":2,"detail":"very good","discount":9,"shopId":1,"itemId":2,"categoryId":1,"imgUrl":["http://www.starstech.tech:3200/uploads/shop/7.jpg"],"price":110,"cost":95,"sold":1,"stock":2,"unit":"个","name":"耳钉","discountPirce":95,"onSale":true},{"id":3,"discountPirce":95,"detail":"very good","discount":9,"shopId":1,"itemId":3,"categoryId":1,"imgUrl":["http://www.starstech.tech:3200/uploads/shop/4.jpg"],"price":10.5,"cost":9.5,"sold":1,"stock":2,"unit":"条","name":"手串","onSale":true},{"id":4,"discountPirce":95,"detail":"very good","discount":9,"itemId":4,"shopId":1,"categoryId":2,"imgUrl":["http://www.starstech.tech:3200/uploads/shop/5.jpg"],"price":100.5,"cost":9.5,"sold":1,"stock":2,"unit":"个","name":"桶珠","onSale":true},{"id":5,"discountPirce":95,"detail":"very good","discount":9,"itemId":5,"shopId":1,"categoryId":2,"imgUrl":["http://www.starstech.tech:3200/uploads/shop/6.jpg"],"price":100.5,"cost":9.5,"sold":1,"stock":2,"unit":"个","name":"弥勒","onSale":true},{"id":6,"discountPirce":95,"detail":"very good","discount":9,"itemId":5,"shopId":1,"categoryId":2,"imgUrl":["http://www.starstech.tech:3200/uploads/shop/1.jpg","http://www.starstech.tech:3200/uploads/shop/2.jpg","http://www.starstech.tech:3200/uploads/shop/3.jpg"],"price":100.5,"cost":9.5,"sold":1,"stock":2,"unit":"个","name":"绿度母","onSale":true}]}'
      // );
      yield put({
        type: 'save',
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
        const match = pathToRegexp('/shop/:id').exec(pathname);
        if (match) {
          const id = parseInt(match[1]);
          dispatch({ type: 'fetch', payload: {id} });
        }
        // if (pathname === '/shop') {
        //   dispatch({ type: 'fetch', payload: query });
        // }
      });
    },
  },
};
