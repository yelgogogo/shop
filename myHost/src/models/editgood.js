
export default {
  namespace: 'editgood',
  state: {
  	info:{
	    id: 0,
	    shopId: 0,
	    shopName: null,
	  },
	  itemId: 0,
    categoryId: 0,
    sold: 0,
    detail: null,
    imgUrl: [ ],
    price: 0,
    cost: 0,
    stock: 0,
    unit: null,
    name: null,
    discount: 0,
    discountPrice:0,
    onSale: false,
	   
  },
  reducers: {
  	save(state, { payload: { data: {info,itemId,categoryId,sold,detail,imgUrl,price,cost,stock,unit,name,discount,discountPrice,onSale } }}) {
      return { ...state, info,itemId,categoryId,sold,detail,imgUrl,price,cost,stock,unit,name,discount,discountPrice,onSale};
    },
  },
  effects: {},
  subscriptions: {},
};
