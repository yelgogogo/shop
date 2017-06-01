var express = require('express');
var app = express();

var db = require('diskdb');
var router = express.Router();

function validateData(dbname, data) {

}
function loadData(dbname, queryString) {
    db.connect('db', [dbname]);
    var datas = db[dbname].find(queryString);
    for (var d in datas)
        del_id(datas[d]);
    return datas;
}
function addData(dbname, data) {
    db.connect('db', [dbname]);
    data.id = Date.now();
    db[dbname].save(data);
    var datas = db[dbname].find();
    for (var d in datas)
        del_id(datas[d]);
    return datas;
}
function editData(dbname, data) {
    db.connect('db', [dbname]);
    var options = {
            multi: false,
            upsert: false
        };
    db[dbname].update({ id: data.id }, data, options);
    var datas = db[dbname].find();
    for (var d in datas)
        del_id(datas[d]);
    return datas;
}
function deleteData(dbname, data) {
    db.connect('db', [dbname]);
    db[dbname].remove({ id: data.id },false);
    var datas = db[dbname].find();
    for (var d in datas)
        del_id(datas[d]);
    return datas;
}
function del_id(obj) {
    if (obj && obj._id) {
        delete obj._id;
    }
    return obj;
}
router.get('/', function (req, res) {
    let id = Number(req.query.id);
    var obj = req.query.dbname;
    let dbname = obj + 'db';
    db.connect('db', [dbname]);
    var data = db[dbname].findOne({ id: id });
    del_id(data);
    var o = new Object();
    o[obj] = data;
    res.send(o);
}).post('/', function (req, res) {
    var data = req.body;
    for (var d in data) {
        let dbname = d + 'db';
        validateData(dbname, data);
        data[d] = addData(dbname, data[d]);
    }
    res.send(data);
}).get('/loadAll', function (req, res) {
    var data = JSON.parse(req.query.p);
    for (var d in data) {
        let dbname = d + 'db';
        data[d] = loadData(dbname, data[d]);
    }
    res.send(data);
}).put('/', function (req, res) {
    var data = req.body;
    for (var d in data) {
        let dbname = d + 'db';
        validateData(dbname, data);
        data[d] = editData(dbname, data[d]);
    }
    res.send(data);
}).delete('/', function (req, res) {
    var data = req.body;
    for (var d in data) {
        let dbname = d + 'db';
        validateData(dbname, data);
        data[d] = deleteData(dbname, data[d]);
    }
    res.send(data);
}).all('/', function (req, res) {
    var data = req.body;
    for (var d in data) {
        let dbname = d + 'db';
        validateData(dbname, data);
        data[d] = deleteData(dbname, data[d]);
    }
    res.send(data);
});

module.exports = router;