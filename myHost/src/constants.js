export const doDiscount = (price,discount) => {
  	return parseInt(price*discount/10)}


export const STEPS = [{
  title: '拍下',
  content: '已拍下',
}, {
  title: '付款',
  content: '已付款',
}, {
  title: '发货',
  content: '已发货',
}, {
  title: '成功',
  content: '交易成功',
}, {
  title: '评价',
  content: '已评价',
}, {
  title: '完成',
  content: '已完成',
}];

const getHost = env=>env==='prod'?'http://www.starstech.tech:3302/':'http://localhost:3302/' 

export const HOST = getHost('prod');