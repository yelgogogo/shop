import {HOST} from '../constants';
import * as shopService from '../services/shopService'; 

export default {
  namespace: 'cart',
  state: {
    id:0,
  	userId: 0,
  	userName: null,
  	shopId: 0,
  	totalPrice: 0,
  	totalCount: 0,
    payMode:'offline',
    status: 0,
  	goods:[

  	],
    action:{
      operCode:'add',
      type:null,
      values:null,
    },
  },
  reducers: {
  	saveGoods(state, { payload: { data: {goods } }}) {
  	  const totalCount=goods.length;
      let subTotal;
      goods=goods.map(g=>{return {...g,subTotal:g.count*g.discountPrice}});
      const totalValue=goods.reduce((pre,cur)=>{
        return {subTotal:parseInt(pre.subTotal+cur.subTotal)}},{subTotal:0});
      return { ...state, goods,totalCount,totalPrice:totalValue.subTotal};
    },
    changePaymode(state, { payload: { payMode }}) {
      return { ...state, payMode};
    },
    saveUser(state, { payload: { data:user }}) {
      console.log({ payload: { data:user }});
      return { ...state, userId:user.id,userName:user.nickname};
    },
    saveAction(state, { payload: { action} } ) {
      return { ...state, action};
    },
    ordersSave(state, { payload: { data: {orders } }}) {
      return { ...state, ...orders};
    }

  },
  effects: {
    *add({ payload: xy }, { call, put,select }) {
      const action = yield select(state => state.cart.action);
      const { data, headers } = yield call(shopService.add, { action });
      console.log(data);
      if (data[action.type].on_err){
        // yield put({
        //   type: 'setModal2Visible',
        //   payload: {
        //     modal2Visible:true,
        //     modal2ErrMsg:data[action.type].err_msg,
        //   },
        // });
      }else{
        const initValue={
    // id:0,
    // userId: 0,
    // userName: null,
    // shopId: 0,
    totalPrice: 0,
    totalCount: 0,
    status: 0,
    payMode:'offline',
    goods:[

    ],
    action:{
      operCode:'add',
      type:null,
      values:null,
    },
  };
        yield put({
          type: `${action.type}Save`,
          payload: {
            data:{orders:initValue},
          },
        });
        // yield put({
        //   type: 'setModal2Visible',
        //   payload: {
        //     modal2Visible:false,
        //   },
        // });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => { 
        console.log(pathname );
        if (pathname === '/cart' ) {
          dispatch({ type: 'saveUser', payload: {code:query.code?query.code:'',data:getuser()} });
        }
      });
    },
  },
};


function getuser(){
  let user={};
  if(localStorage.getItem('shop_user') ){
    user=JSON.parse(localStorage.getItem('shop_user'));
  }else{
    user.id=Date.now();
    user.avatar="https://www.starstech.tech:3201/uploads/defaultuser.jpg";
    user.badge=0;
    user.openid=null;
    user.nickname='访客';
    let body = JSON.stringify(user);
    localStorage.setItem('shop_user', body);
  }
  return user;
}