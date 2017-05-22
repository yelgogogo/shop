import request from '../utils/request';


let getHost = env=>env==='prod'?'https://www.starstech.tech:3300/':'http://localhost:3300/' 
const HOST = getHost('test');
export function fetch({ data  }) {
  return request(`${HOST}wxuser?data=${data}`);
}

export function getRank({ page,id  }) {
  console.log('getRank',page,id);
  return request(`${HOST}getrank?page=${page}&id=${id}`);
}

export function add({action}) {
  console.log('add');
  console.log(action);
  // const action=JSON.stringify(values);
  // console.log(JSON.stringify(values));
  return request(`${HOST}${action.type}`, {
    method: 'POST',
    body: JSON.stringify(action.values),
    headers :{'Content-Type': 'application/json'},
  });
}

export function deletes({action}) {
  console.log('delete');
  console.log(action);
  return request(`${HOST}${action.type}`, {
    method: 'DELETE',
    body: JSON.stringify(action.values),
    headers :{'Content-Type': 'application/json'},
  });
}

export function modify({action}) {
  console.log('modify');
  console.log(action);
  return request(`${HOST}${action.type}`, {
    method: 'PUT',
    body: JSON.stringify(action.values),
    headers :{'Content-Type': 'application/json'},
  });
}