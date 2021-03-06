
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
  },
  effects: {

  },
  subscriptions: {

  },
};
