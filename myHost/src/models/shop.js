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
    modal2Visible:false,
    modal2ErrMsg:null,
    modal1Visible:false,
    modal1ErrMsg:null,
    modal3Visible:false,
    action:{
      operCode:'modify',
      type:null,
      values:null,
    },
  },
  reducers: {
  	save(state, { payload: { data: {shop, categorys,goods,items} } }) {
      categorys.sort((a, b) => a.sequence - b.sequence);
      return { ...state, shop, categorys,goods,items};
    },
    selectCategory(state, { payload: { select} } ) {
      return { ...state, select};
    },
    categorysSave(state, { payload: { data: {categorys} }  } ) {
      console.log({ payload: { data: {categorys} } });
      console.log(categorys);
      categorys.sort((a, b) => a.sequence - b.sequence);
      return { ...state, categorys};
    },
    goodsSave(state, { payload: { data: {goods} }  } ) {
      console.log({ payload: { data: {goods} } });
      console.log(goods);
      goods.sort((a, b) => a.sold - b.sold);
      return { ...state, goods};
    },
    itemsSave(state, { payload: { data: {items} }  } ) {
      console.log({ payload: { data: {items} } });
      console.log(items);
      items.sort((a, b) => a.sequence - b.sequence);

      return { ...state, items};
    },
    toggleMenu(state, { payload: { collapsed=false} } ) {
      collapsed=!collapsed;
      return { ...state, collapsed};
    },
    setModal2Visible(state, { payload: { modal2Visible,modal2ErrMsg,modal3Visible} } ) {
      return { ...state, modal2Visible,modal3Visible,modal2ErrMsg};
    },
    setModal1Visible(state, { payload: { modal1Visible,modal1ErrMsg} } ) {
      return { ...state, modal1Visible,modal1ErrMsg};
    },
    saveAction(state, { payload: { action} } ) {
      return { ...state, action};
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
    *add({ payload: xy }, { call, put,select }) {
      const action = yield select(state => state.shop.action);
      const { data, headers } = yield call(shopService.add, { action });
      // const data = JSON.parse(
      //   '{"categorys":[{"shopId":1,"id":1,"sequence":1,"name":"首饰"},{"shopId":1,"id":2,"sequence":2,"name":"吊坠"},{"shopId":1,"id":123,"sequence":3,"name":"新的分类"}]}'
      // );  
      console.log(action,data);
      if (data[action.type].on_err){
        yield put({
          type: 'setModal2Visible',
          payload: {
            modal2Visible:true,
            modal2ErrMsg:data[action.type].err_msg,
          },
        });
      }else{
        yield put({
          type: `${action.type}Save`,
          payload: {
            data,
          },
        });
        yield put({
          type: 'setModal2Visible',
          payload: {
            modal2Visible:false,
          },
        });
      }
    },
    *deletes({ payload: { action} }, { call, put }) {
      const { data, headers } = yield call(shopService.deletes, { action });   
      if (data[action.type].on_err){
        yield put({
          type: 'setModal1Visible',
          payload: {
            modal2Visible:true,
            modal2ErrMsg:data[action.type].err_msg,
          },
        });
      }else{
        yield put({
          type: `${action.type}Save`,
          payload: {
            data,
          },
        });
        yield put({
          type: 'setModal1Visible',
          payload: {
            modal1Visible:false,
          },
        });
      }
    },
    *modify({ payload: { xy} }, { call, put,select }) {
      const action = yield select(state => state.shop.action);
      const { data, headers } = yield call(shopService.modify, { action }); 
      console.log(data); 
      if (data[action.type].on_err){
        yield put({
          type: 'setModal1Visible',
          payload: {
            modal1Visible:true,
            modal1ErrMsg:data[action.type].err_msg,
          },
        });
      }else{
        yield put({
          type: `${action.type}Save`,
          payload: {
            data,
          },
        });
        yield put({
          type: 'setModal1Visible',
          payload: {
            modal1Visible:false,
          },
        });
      }
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
