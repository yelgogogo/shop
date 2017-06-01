var express = require('express');
var app = express();

var db = require('diskdb');

var router = express.Router();

router.get('/', function (req, res) {
    let id = JSON.parse(req.query.id);
    db.connect('db', ['goodsdb']);
    var goods = db.goodsdb.findOne({ id: id });
    res.send(goods);
}).post('/', function (req, res) {
    db.connect('db', ['goodsdb']);
    var goods = req.body;
    var checkgoods = db.goodsdb.findOne({ name: goods.name });
    if (checkgoods) {
        goods.on_err = true;
        goods.err_msg = '货品已存在';
    } else {
        goods.id = Date.now();
        db.goodsdb.save(goods);
        goods = db.goodsdb.findOne({ id: Number(goods.id) });
    }
    res.send(goods);
    //res.json({ data: del_id(postw) });
}).put('/', function (req, res) {
    db.connect('db', ['goodsdb']);
    var goods = req.body;
    var checkgoods = db.goodsdb.findOne({ id: goods.id });
    if (checkgoods) {
        var options = {
            multi: false,
            upsert: false
        };
        db.goodsdb.update({ id: goods.id }, goods, options);
    }
    else {
        goods.on_err = true;
        goods.err_msg = '货品不存在,无法修改';
    }
    res.send(goods);
    //res.json({ data: del_id(goods) });
}).delete('/', function (req, res) {
    db.connect('db', ['goodsdb']);
    var goods = req.body;
    var checkgoods = db.goodsdb.findOne({ id: goods.id });
    if (checkgoods) {
        var options = {
            multi: false,
            upsert: false
        };
        db.goodsdb.remove({ id: goods.id },false);
    }
    else {
        goods.on_err = true;
        goods.err_msg = '删除的数据不存在';
    }
    res.send(goods);
});

module.exports = router;