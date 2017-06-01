var express = require('express');
var app = express();

var db = require('diskdb');

var router = express.Router();

router.get('/', function (req, res) {
    let id = JSON.parse(req.query.id);
    db.connect('db', ['itemsdb']);
    var items = db.itemsdb.findOne({ id: id });
    res.send({items});
}).post('/', function (req, res) {
    db.connect('db', ['itemsdb']);
    var items = req.body;
    var checkitems = db.itemsdb.findOne({ name: items.name });
    if (checkitems) {
        items.on_err = true;
        items.err_msg = '类别已存在';
    } else {
        items.id = Date.now();
        db.itemsdb.save(items);
        // items = db.itemsdb.findOne({ id: Number(items.id) });
        items = db.itemsdb.find({ shopId: Number(items.shopId) });
    }
    // items = db.itemsdb.find({ shopId: Number(items.shopId) });
        console.log(items);
    res.send({items});
    //res.json({ data: del_id(postw) });
}).put('/', function (req, res) {
    db.connect('db', ['itemsdb']);
    var items = req.body;
    var checkitems = db.itemsdb.findOne({ id: items.id });
    if (checkitems) {
        var options = {
            multi: false,
            upsert: false
        };
        db.itemsdb.update({ id: items.id }, items, options);
        items = db.itemsdb.find({ shopId: Number(items.shopId) });
    }
    else {
        items.on_err = true;
        items.err_msg = '类别不存在,无法修改';
    }
    console.log(items);
    res.send({items});
    //res.json({ data: del_id(items) });
}).delete('/', function (req, res) {
    db.connect('db', ['itemsdb']);
    var items = req.body;
    var checkitems = db.itemsdb.findOne({ id: items.id });
    if (checkitems) {
        var options = {
            multi: false,
            upsert: false
        };
        db.itemsdb.remove({ id: items.id },false);
        items = db.itemsdb.find({ shopId: Number(items.shopId) });
    }
    else {
        items.on_err = true;
        items.err_msg = '删除的数据不存在';
    }
    res.send({items});
});

module.exports = router;