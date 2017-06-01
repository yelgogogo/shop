var express = require('express');
var app = express();

var db = require('diskdb');

var router = express.Router();

function del_id(obj){
        if( obj && obj._id){
            delete obj._id;
        }
        return obj;
    }

router.get('/', function (req, res) {
    let id = JSON.parse(req.query.id);
    db.connect('db', ['categorysdb']);
    var categorys = db.categorysdb.findOne({ id: id });
    res.send(categorys);
}).post('/', function (req, res) {
    db.connect('db', ['categorysdb']);
    
    var categorys = req.body;
    var checkcategorys = db.categorysdb.findOne({ name: categorys.name });
    if (checkcategorys) {
        categorys.on_err = true;
        categorys.err_msg = '类别已存在';
    } else {
        categorys.id = Date.now();
        db.categorysdb.save(categorys);
        categorys = db.categorysdb.find({ shopId: Number(categorys.shopId) });
        console.log(categorys);
    }
    res.send({categorys});
    //res.json({ data: del_id(postw) });
}).put('/', function (req, res) {
    db.connect('db', ['categorysdb']);
    var categorys = req.body;
    var checkcategorys = db.categorysdb.findOne({ id: categorys.id });
    if (checkcategorys) {
        var options = {
            multi: false,
            upsert: false
        };
        db.categorysdb.update({ id: categorys.id }, categorys, options);
        categorys = db.categorysdb.find({ shopId: Number(categorys.shopId) });
    }
    else {
        categorys = db.categorysdb.find({ shopId: Number(categorys.shopId) });
        categorys.on_err = true;
        categorys.err_msg = '类别已存在,无法修改';
    }
    res.send({categorys});
    //res.json({ data: del_id(categorys) });
}).delete('/', function (req, res) {
    db.connect('db', ['categorysdb']);
    var categorys = req.body;
    var checkcategorys = db.categorysdb.findOne({ id: categorys.id });
    if (checkcategorys) {
        var options = {
            multi: false,
            upsert: false
        };
        db.categorysdb.remove({ id: categorys.id },false);
        categorys = db.categorysdb.find({ shopId: Number(categorys.shopId) });
    }
    else {
        categorys = db.categorysdb.find({ shopId: Number(categorys.shopId) });
        categorys.on_err = true;
        categorys.err_msg = '删除的数据不存在';
    }

    res.send({categorys});
});

module.exports = router;