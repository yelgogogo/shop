var express = require('express');
var app = express();

var db = require('diskdb');

var router = express.Router();

router.get('/', function (req, res) {
    let id = JSON.parse(req.query.id);
    db.connect('db', ['shopdb']);
    var shop = db.shopdb.findOne({ id: id });
    res.send(shop);
}).post('/', function (req, res) {
    db.connect('db', ['shopdb']);
    var shop = req.body;
    var checkshop = db.shopdb.findOne({ shopName: shop.shopName });
    if (checkshop) {
        shop.on_err = true;
        shop.err_msg = '店名已存在';
    } else {
        shop.id = Date.now();
        db.shopdb.save(shop);
        shop = db.shopdb.findOne({ id: Number(shop.id) });
    }
    res.send(shop);
    //res.json({ data: del_id(postw) });
}).put('/', function (req, res) {
    db.connect('db', ['shopdb']);
    var shop = req.body;
    var checkshop = db.shopdb.findOne({ id: shop.id });
    if (checkshop) {
        var options = {
            multi: false,
            upsert: false
        };
        db.shopdb.update({ id: shop.id }, shop, options);
    }
    else {
        shop.on_err = true;
        shop.err_msg = '店名不存在,无法修改';
    }
    res.send(shop);
    //res.json({ data: del_id(shop) });
}).delete('/', function (req, res) {
    db.connect('db', ['shopdb']);
    var shop = req.body;
    var checkshop = db.shopdb.findOne({ id: shop.id });
    if (checkshop) {
        var options = {
            multi: false,
            upsert: false
        };
        db.shopdb.remove({ id: shop.id },false);
    }
    else {
        shop.on_err = true;
        shop.err_msg = '删除的数据不存在';
    }
    res.send(shop);
});

module.exports = router;