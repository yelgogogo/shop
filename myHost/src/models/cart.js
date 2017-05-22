
export default {
  namespace: 'cart',
  state: {
  	userId: 0,
  	userName: null,
  	shopId: 0,
  	totalPrice: 0,
  	totalCount: 0,
    payMode:'offline',
  	goods:[

  	],
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
