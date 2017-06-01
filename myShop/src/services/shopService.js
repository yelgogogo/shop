import request from '../utils/request';
import {HOST } from '../constants'

// const getHost = env=>env==='prod'?'https://www.starstech.tech:3300/':'http://localhost:3300/' 
// const HOST = getHost('test');
export function fetch({ data  }) {
  return request(`${HOST}wxuser?data=${data}`);
}

export function getRank({ page,id  }) {
  console.log('getRank',page,id);
  return request(`${HOST}getrank?page=${page}&id=${id}`);
}

export function loadAll(data) {
  console.log('loadAll');
  // console.log({shop,categorys,items,goods});
  // const data={shop,categorys,items,goods};
  console.log(data);
  // const action=JSON.stringify(values);
  // console.log(JSON.stringify(values));
  return request(`${HOST}shopdata/loadall?p=${JSON.stringify(data)}`);
}

export function get({id,type}) {
  console.log('get');
  return request(`${HOST}shopdata?id=${id}&dbname=${type}`);
}

export function add({action}) {
  console.log('add');
  console.log(action);
  let data={};
  data[action.type]=action.values;
  // const data={`${action.type}`:{action.values}}
  console.log(data);
  // const action=JSON.stringify(values);
  // console.log(JSON.stringify(values));
  return request(`${HOST}shopdata`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers :{'Content-Type': 'application/json'},
  });
}

export function deletes({action}) {
  console.log('delete');
  console.log(action);
  let data={};
  data[action.type]=action.values;
  return request(`${HOST}shopdata`, {
    method: 'DELETE',
    body: JSON.stringify(data),
    headers :{'Content-Type': 'application/json'},
  });
}

export function modify({action}) {
  console.log('modify');
  console.log(action);
  let data={};
  data[action.type]=action.values;
  return request(`${HOST}shopdata`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers :{'Content-Type': 'application/json'},
  });
}