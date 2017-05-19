
export default {
  namespace: 'order',
  state: {
  	info:{
  	  id:0,
  	  userId: 0,
  	  userName: null,
  	  totalPrice: 0,
  	  totalCount: 0,
  	  payMode:'offline',
      Address:null,
  	},
  	sellerInfo:{
  	  shopId: 0,
  	  owner:null,
  	  shopName: null,
  	},
	
  	status:0,
    logistics:{
      vendor:null,
      trackingNo:0,
      trackingStatus:null,
      description:null,	
    },
  	goods:[

  	],
  },
  reducers: {
  	save(state, { payload: { data: {goods,info,status,sellerInfo } }}) {
  	  // const totalCount=goods.length;
     //  let subTotal;
     //  goods=goods.map(g=>{return {...g,subTotal:g.count*g.discountPrice}});
     //  const totalValue=goods.reduce((pre,cur)=>{
     //    return {subTotal:parseInt(pre.subTotal+cur.subTotal)}},{subTotal:0});
      return { ...state, goods,info,status,sellerInfo};
    },
  },
  effects: {},
  subscriptions: {},
};
