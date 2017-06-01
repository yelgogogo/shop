    // "use strict";
    var _ = require('ramda');
    var express = require('express'); 
    var app = express(); 
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var fs=require("fs");  
    var fse = require('fs-extra');
    var zlib = require('zlib'); 
    var gzip = zlib.createGzip(); 
    var fstream = require('fstream');
    var tar = require('tar');
    var db = require('diskdb');
    var userdb = require('diskdb');
    var configdb = require('diskdb');
    
    var shopdata = require('./dal/shopdata');
    
    const request = require('request');
    const qs = require('querystring');

    const env = 'test';

    if (env === 'prod'){
        var https = require('https');
        var privateKey  = fs.readFileSync('/etc/nginx/cert/214053462170887.key', 'utf8');
        var certificate = fs.readFileSync('/etc/nginx/cert/214053462170887.pem', 'utf8');
        var credentials = {key: privateKey, cert: certificate};
        var httpsServer = https.createServer(credentials, app);
    }

    var iconv = require('iconv-lite');

    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        let weburl="http://localhost:8000";
        if (env === 'prod'){
            weburl="http://nstart.cc:83";
        }
        res.header("Access-Control-Allow-Origin", weburl);
        //res.header("Access-Control-Allow-Origin", "https://www.starstech.cc");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });

    /** Serving from the same express Server
    No cors required */
    app.use(express.static('../client'));
    app.use(bodyParser.json()); 
    //www-form-urlencoded
    //app.use(bodyParser.urlencoded({extended:true}));

    function del_id(obj){
        if( obj && obj._id){
            delete obj._id;
        }
        return obj;
    }

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            console.log(file);
            cb(null, file.originalname+'-' + datetimestamp);
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

    //加载dal模块
    app.use('/shopdata', shopdata);

    app.post('/upload/', function(req, res) {
        upload(req,res,function(err){
			console.log(req.file);
            if(err){
                res.json({error_code:1,err_desc:err});
                return;
            }
            var createTime = new Date();
            res.json({error_code:0,err_desc:null,createTime:createTime.toLocaleString(),destination:req.file.destination,filename:req.file.filename,path:req.file.path});
        });
    });

    app.get('/bay', function(req, res){
      var indata = JSON.parse(req.query.user);
      db.connect('db', ['storydb']);
      var query = {bayid:Number(indata.bayid)};
      var storyarr = db.storydb.find(query);

        db.connect('db', ['baydb']);
        query = {id:Number(indata.bayid)};
        var getdata = db.baydb.findOne(query); 
        //console.log(getdata.storys);
        if (getdata){
            if(!getdata.storys){getdata.storys=[]};
        	getdata.storys.forEach(function(baysty,index){
	          getdata.storys[index]=storyarr.find(function(fsty){return fsty.id===baysty.id;});	
              //console.log(getdata.storys[index],index);
	        });
	        //console.log(getdata.storys);
	        getdata.storys=getdata.storys.filter(function(f){
              //console.log(f);
	          return f.delflag!==true; 
	        });
        }
        res.json({data:del_id(getdata)});       
    });

    app.get('/delbay', function(req, res){
      var indata = JSON.parse(req.query.user);
      db.connect('db', ['storydb']);
      var query = {bayid:Number(indata.bayid)};
      var storyarr = db.storydb.find(query);
        db.connect('db', ['baydb']);
        query = {id:Number(indata.bayid)};
        var getdata = db.baydb.findOne(query); 
        //console.log(getdata.storys);
        if (getdata){
            if(!getdata.storys){getdata.storys=[]};
            getdata.storys.forEach(function(baysty,index){
              getdata.storys[index]=storyarr.find(function(fsty){return fsty.id===baysty.id;}); 
              //console.log(getdata.storys[index],index);
            });
            //console.log(getdata.storys);
            getdata.storys=getdata.storys.filter(function(f){
              //console.log(f);
              return f.delflag===true; 
            });
        }
        res.json({data:del_id(getdata)});       
    });

    app.put('/bay/:id', function(req, res) {
        db.connect('db', ['baydb']);
        var putdata = req.body;
        var query = {id:Number(req.params.id)};
        db.baydb.update(query,putdata);
        var getdata = db.baydb.findOne(query);

        res.json({data:del_id(getdata)}); 
    });

    //add new bay
    app.post('/bay', function(req, res) {
        db.connect('db', ['baydb']);
        //console.log(req.body); 
        var postw = req.body;
        var checkbay = db.baydb.findOne({createrid:Number(postw.createrid)});
        if (checkbay){
          postw.on_err=true;
          postw.err_msg='你只能拥有一个港口';     
        }else{
          postw.id = Date.now();
          db.baydb.save(postw);  
          postw=db.baydb.findOne({id:Number(postw.id)});
          console.log(postw);
          del_id(postw);
          console.log(postw);  
        }

        res.json({data:del_id(postw)});   
    });

    app.get('/mybay', function(req, res){
      var indata = JSON.parse(req.query.user);
        db.connect('db', ['baydb']);
        // console.log(indata);
        var query = {createrid:Number(indata.id)};
        var getdata = db.baydb.findOne(query);
        
        res.json({data:del_id(getdata)});       
    });

    app.get('/joinbay', function(req, res){
      var indata = JSON.parse(req.query.user);
        db.connect('db', ['baydb']);
        //console.log(indata);
        var query = {id:Number(indata.bayid)};
        var getdata = db.baydb.findOne(query);
        
        res.json({data:del_id(getdata)});       
    });

    app.get('/story', function(req, res){
        db.connect('db', ['storydb']);
        var getdata = db.storydb.find();

        res.json({data:del_id(getdata)});       
    });

    //add new story
    app.post('/story', function(req, res) {
        db.connect('db', ['storydb']);
        //console.log(req.body); 
        var postw = req.body; 
        postw.id = Date.now();
        // postw.description=postw.description.replace(/\n/g,'\r\n');
        db.storydb.save(postw);
        var querystory={id:postw.id}
        var newstory=db.storydb.findOne(querystory);
        db.connect('db', ['baydb']);
        var query = {id:Number(postw.bayid),delflag:false};
        var findbay= db.baydb.findOne(query);
        // console.log(postw);
        // console.log(findbay);
        // console.log(query);
        // console.log(db.baydb.findOne());
        if(!findbay.storys){findbay.storys=[]};
        findbay.storys.push({id:Number(postw.id),_id:newstory._id});
        
        db.baydb.update(query,{storys:findbay.storys});
        // console.log(db.baydb.find());
        res.json({data:del_id(postw)});   
    });

    //Update story
    app.put('/story', function(req, res) {
        db.connect('db', ['storydb']);
        
        var postw = req.body; 
        postw.delflag=false;
        var querystory={id:postw.id}
        console.log(postw);
        db.storydb.update(querystory,postw,{upsert: true});
        var oldstory=db.storydb.findOne(querystory);
        console.log(oldstory);
        db.connect('db', ['baydb']);
        var query = {id:Number(oldstory.bayid)};
        var findbay= db.baydb.findOne(query);
        
        // console.log(findbay);
        // console.log(query);
        // console.log(db.baydb.findOne());
        if(!findbay.storys){findbay.storys=[]};
        var pushcheck=findbay.storys.find(function(f){return f._id===oldstory._id});
        if (!pushcheck){
          findbay.storys.push({id:Number(postw.id),_id:oldstory._id});
          db.baydb.update(query,{storys:findbay.storys});
        }
        // console.log(db.baydb.find());
        res.json({data:del_id(postw)});   
    });

    function getClientIp(req) {
        //console.log(req.connection.socket.remoteAddress);
        return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    };

    app.get('/storybyid', function(req, res){
        var indata = JSON.parse(req.query.id);
        //console.log(getClientIp(req)); 
        let visitorip=getClientIp(req);
        db.connect('db', ['commentdb']);
        var querycomment = {storyid:Number(indata.id)};
        commentarr=db.commentdb.find(querycomment);

        db.connect('db', ['storydb']);
        // console.log(db.storydb.findOne({id:indata.id,delflag:false}));
        // var rdata=db.storydb.findOne();
        var querystory={id:indata.id};

        var getdata = db.storydb.findOne(querystory); 
        if(!getdata.visitors){getdata.visitors=[]};
        // var pushcheck=getdata.visitors.find(function(f){return f===visitorip});
        //   if (!pushcheck){
            getdata.visitors.push(visitorip);
            db.storydb.update(querystory,{visitors:getdata.visitors});
            getdata = db.storydb.findOne(querystory); 
          // }
        //console.log(getdata.visitors); 
        // console.log(getdata.comments);
        if (getdata){
            getdata.comments.forEach(function(baysty,index){
              getdata.comments[index]=commentarr.find(function(fsty){return fsty.id===baysty.id;}); 
              // console.log(getdata.comments[index],index);
            });
            //console.log(getdata.storys);
            getdata.comments=getdata.comments.filter(function(f){
              // console.log(f);
              return f.delflag!==true; 
            });
        }

        res.send({data:del_id(getdata)});
    });

    //soft delte story
    app.delete('/story/:id', function(req, res) {
      var indata = JSON.parse(req.query.parm).user;
      db.connect('db', ['storydb']);

      var query = {id:Number(req.params.id)};
      var deldata = db.storydb.findOne(query);
      console.log(query);
      console.log(deldata);
      options = {
        multi: false, // update multiple - default false 
        upsert: true // if object is not found, add it (update-insert) - default false 
	  };
	  // console.log(indata,deldata.ownerid);
	  if (deldata){
	  	if (Number(indata.id)===deldata.ownerid){
      	  db.storydb.update(query,{delflag:true},options); 
      	  console.log(db.storydb.findOne(query));
      	}
	  }
      
      deldata = db.storydb.findOne(query);
      res.json({data:del_id(deldata)}); 
      

    });

    //push new like
    app.put('/like', function(req, res) {
        let postw = req.body; 
        // let visitorip=getClientIp(req);
        db.connect('db', ['storydb']);
        var query = {id:postw.id};
        let findstory= db.storydb.findOne(query);
        if(findstory.likes){
            let findlike=findstory.likes.find(f=>f.id===postw.likes[0].id);
            if(!findlike){
                findstory.likes=findstory.likes.concat(postw.likes);
            }
        }else{
            findstory.likes=postw.likes;
        }
        // console.log(findbay.storys);
        //db.connect('db', ['storydb']);
        db.storydb.update(query,{likes:findstory.likes});
        findstory= db.storydb.findOne(query);
        // console.log(db.baydb.find());
        res.json({data:del_id(findstory)});   
    });

    //add new comment
    app.post('/comment', function(req, res) {
        var postw = req.body; 
        db.connect('db', ['storydb']);
        var query = {id:postw.storyid};
        var findstory= db.storydb.findOne(query);
        if(findstory.comments){
            postw.id=findstory.comments.length + 1;
        }else{
            postw.id=1;
            findstory.comments=[];
        }
        
        db.connect('db', ['commentdb']);
        db.commentdb.save(postw);
        var querycomment={id:postw.id,storyid:postw.storyid}
        postw=db.commentdb.findOne(querycomment);

        findstory.comments.push(postw);
        // console.log(findbay.storys);
        db.connect('db', ['storydb']);
        db.storydb.update(query,{comments:findstory.comments});
        // console.log(db.baydb.find());
        res.json({data:del_id(findstory)});   
    });

    var workspacesDB = 'db/workspacesdb.txt';
    app.put('/workspaces/:id', function(req, res) {
        db.connect('db', ['workspaces']);
        var putdata = req.body;
        var query = {id:req.params.id};
        db.workspaces.update(query,putdata);
        res.json(putdata); 
    });
    

    app.post('/workspaces', function(req, res) {
        db.connect('db', ['workspaces']);
        var postdata = req.body;
        wsDB=db.workspaces.find();
        if (wsDB.length === 0){
            postdata.id=1;
        }else{
            postdata.id=wsDB[wsDB.length-1].id+1;
        }
        postdata.path='works/'+postdata.owner+'/'+postdata.id;
        db.workspaces.save(postdata);
        fse.ensureDirSync(postdata.path);
        //console.log(postdata);
        res.json(db.workspaces.find());   
    });
//--------------regs-start------------------------------
    // Add new Regarray
    var regsDB = 'db/regsdb.txt';
    app.get('/regs', function(req, res){
        db.connect('db', ['regs']);
        var query = {visable:true};
        var backdata = db.regs.find(query).filter(function(f){return f.owner ===req.query.user || f.share===true;});
        console.log(backdata);
        res.json(backdata); 
    });
    // Update existing Regarray
    app.put('/regs/:wid', function(req, res) {
        db.connect('db', ['regs']);
        var postw = req.body;
        var query = {id:req.params.wid};
        db.regs.update(query,postw);
        res.json(postw); 
    });

    app.delete('/regs/:did', function(req, res) {
        db.connect('db', ['regs']);
        var query = {id:Number(req.params.did)};
        res.json(db.regs.update(query,{visable:false}));   
    });


//--------------regs-end------------------------------
    app.get('/download', function(req, res){
        var downzip = JSON.parse(req.query.workspace);
        var fileDownload = downzip.path; 
        var zippath=fileDownload+'-'+downzip.name+'.tar.gz';
        // var inp = fs.createReadStream(fileDownload); 
        // var out = fs.createWriteStream(workSpace.name+'.gz'); 
        // inp.pipe(gzip).pipe(out); 
        fstream.Reader({ 'path': fileDownload, 'type': 'Directory' }) /* Read the source directory */
        .pipe(tar.Pack()) /* Convert the directory to a .tar file */
        .pipe(zlib.Gzip()) /* Compress the .tar file */
        .pipe(fstream.Writer({ 'path': zippath }));
        downzip.zippath=zippath;
        res.download(zippath); // Set disposition and send it.
        console.log(zippath+' downloaded!');
        res.send(downzip);
    });



    app.get('/users', function(req, res){
        //db.connect('db', ['userdb']);
        //console.log(db.users.find());
        res.send('getUsers');
    });

    app.put('/users/:id', function(req, res) {

        // db.connect('db', ['userdb']);
        var putdata = req.body;
        putdata.on_err=false;
        putdata.err_msg={};
        var queryuser = {id:Number(req.params.id)};
        userdb.connect('db', ['userdb']);
        var udata=userdb.userdb.findOne(queryuser);
        // console.log(query);
        
        db.connect('db', ['baydb']);
        var querybay = {invitekey:putdata.invitekey};
        console.log(querybay);
         console.log(db.baydb.findOne(querybay));
        var fdata=db.baydb.findOne(querybay);
        if (fdata){
          putdata.bayid=fdata.id;
          if (!fdata.people){fdata.people=[]};
          var pushcheck=fdata.people.find(function(f){return f._id===udata._id});
          if (!pushcheck){
            fdata.people.push({id:Number(req.params.id),_id:udata._id});
            db.baydb.update(querybay,{people:fdata.people});
          }
          // db.connect('db', ['userdb']);
          // console.log(putdata);
          // console.log(queryuser);
          userdb.userdb.update(queryuser,
            {bayid:fdata.id,
            avatar:putdata.avatar,
            moneyimg:putdata.moneyimg,
            updatetime:putdata.updatetime}
          );
          //console.log(userdb.userdb.findOne(queryuser));
          // db.connect('db', ['userdb']);
          // db.userdb.update(queryuser,
          //   {bayid:fdata.id},
          //   {avatar:putdata.avatar},
          //   {updatetime:putdata.updatetime}
          // );
          // console.log(db.userdb.findOne(queryuser));
        }else{
          putdata.on_err=true;
          putdata.err_msg.invitekey_err='邀请码无效';
        }
        // if(putdata._id){console.log('yes');};
        // putdata= db.userdb.findOne(queryuser);

        // // var getdata = db.userdb.findOne(queryuser);
        // // getdata.on_err=putdata.on_err;
        // // getdata.err_msg=putdata.err_msg;
        // console.log(putdata);
        res.json({data:del_id(putdata)}); 
    });

    // app.get('/testu', function(req, res){
    //     userdb.connect('db', ['testdb']);
    //     userdb.testdb.remove();
    //     userdb.connect('db', ['testdb']);
    //     let user1={name:'mic',pw:'',mark:'user1'}
    //     let user2={name:'mic2',pw:'',mark:'user2'}
    //     userdb.testdb.save([user1,user2]);
    //     let query1={name:user1.name,pw:user1.pw}
    //     let query2={mark:user2.mark}
    //     userdb.testdb.update(query2,{mark:''});
    //     userdb.testdb.update(query1,{mark:'change1'});
    //     res.send(userdb.testdb.find());
    // });

    app.get('/userbyname', function(req, res){
        let user = JSON.parse(req.query.user);
        userdb.connect('db', ['userdb']);
        let query1={name:user.name,password:user.password};
        //console.log(db.userdb.findOne({name:indata.name,password:indata.password}));
        let rdata=userdb.userdb.findOne(query1);
        if(rdata){
          if (rdata.badge===undefined){
            rdata.badge=1;
          }
          if(user.openid){
            let updatedata={
              openid:user.openid,
              nickname:user.nickname,
              sex:user.sex,
              province:user.province,
              city:user.city,
              country:user.country,
              headimgurl:user.headimgurl,
              avatar:user.avatar,
              privilege:user.privilege
            };
   
            let query2={openid:user.openid};
       
            // console.log(query1);
            // console.log(query2);
            userdb.userdb.update(query2,{openid:''},{multi: false});
            // console.log(userdb.userdb.find(query1));
            // console.log(userdb.userdb.find(query2));
            userdb.userdb.update({_id:rdata._id},updatedata,{upsert: true});
            //userdb.userdb.update(query1,updatedata,{upsert: true});
            // console.log(userdb.userdb.find(query1));
            // console.log(userdb.userdb.find(query2));
            rdata=userdb.userdb.findOne(query1);
            //console.log(userdb.userdb.findOne(query2));
            //console.log(updatedata);
            //console.log(query1);
            //console.log(rdata);
          }
          delete rdata.password;
        }
        
        res.send({data:del_id(rdata)});
    });  

    app.post('/users', function(req, res) {
        db.connect('db', ['userdb']);

        var postw = req.body;
        postw.on_err=false;
        postw.err_msg={};
        if(db.userdb.findOne({name:postw.name})){
          postw.on_err=true;
          postw.err_msg.name_err='用户已存在';
        }else if(db.userdb.findOne({nickname:postw.nickname})){
          postw.on_err=true;
          postw.err_msg.nickname_err='昵称已存在';
        }else{
          postw.id = Date.now();
        
          db.connect('db', ['baydb']);
          var query = {invitekey:postw.invitekey};
          var fdata=db.baydb.findOne(query);
          if (fdata){
            
            postw.bayid=Number(fdata.id);
            db.connect('db', ['userdb']);

            db.userdb.save(postw);
            var newuser =db.userdb.findOne({name:postw.name},{nickname:postw.nickname});
            console.log(newuser);

            postw._id=newuser._id;
            var pushcheck=fdata.people.find(function(f){return f._id===postw._id});
            if(!pushcheck){
              fdata.people.push({id:postw.id,_id:postw._id});
              db.connect('db', ['baydb']);
              db.baydb.update(query,{people:fdata.people});       
            }
            
          }else{
            postw.on_err=true;
            postw.err_msg.invitekey_err='邀请码无效';
          }
        }
        // console.log(db.baydb.find());
        res.json({data:del_id(postw)});   
    });

    app.get('/repairstory/:id', function(req, res){
      var indata = JSON.parse(req.params.id);
      db.connect('db', ['userdb']);
      var alluser=db.userdb.find();

        db.connect('db', ['storydb']);
        var rstory=db.storydb.findOne({id:Number(indata.id)});
        if (rstory.owner){
	      var fusr=alluser.find(function(usr){
      	  	return usr.name===rstory.owner;
	      });
	      rstory.ownerid=fusr.id;
    	}else{
    	  rstory.ownerid=1;	
    	}
        
        res.send({data:del_id(rstory)});
    });

    //getWebToken
    function getToken(code,appid,secret) {
      let reqUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
      let params = {
        appid: appid,
        secret: secret,
        code: code,
        grant_type: 'authorization_code'
      };

      let options = {
        method: 'get',
        url: reqUrl+qs.stringify(params)
      };
      console.log(options.url);
      return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
          if (res) {
            resolve(body);
          } else {
            reject(err);
          }
        })
      })
    }

    //getUserInfo
    function getUserInfo(access_token, openid) {
      let reqUrl = 'https://api.weixin.qq.com/sns/userinfo?';
      let params = {
        access_token: access_token,
        openid: openid,
        lang: 'zh_CN'
      };

      let options = {
        method: 'get',
        url: reqUrl+qs.stringify(params)
      };
      
      return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
          if (res) {
            resolve(body);
          } else {
            reject(err);
          }
        });
      })
    }

    // function handleError(error: any): {
    //     console.error('An error occurred', error);
    //     return Promise.reject(error.message || error);
    // }

    app.get('/wxuser', function(req, res){
      console.log('getwx');
      userdb.connect('db', ['userdb']);
      configdb.connect('db', ['configdb']);
      //  console.log(userdb.userdb.find());
      // console.log(userdb.userdb.findOne());
      let indata = JSON.parse(req.query.data);
      let code = indata.code;
      let user = JSON.parse(indata.user);

      configdb.connect('db', ['configdb']);
      let config=configdb.configdb.findOne();
      getToken(code,config.appid,config.secret)
        .then(r=>{
          console.log(r);
          let robj=JSON.parse(r);
          let query1={openid:robj.openid};
          console.log(query1);
          let rtnuser=userdb.userdb.findOne(query1);
          if(rtnuser){
            res.send({data:del_id(rtnuser)});
          }else{
            getUserInfo(robj.access_token,robj.openid)
              .then(r2=>{
                let r2obj=JSON.parse(r2);
                if (r2obj.errcode){

                }else{
                    let query={id:user.id};
                    r2obj.avatar=r2obj.headimgurl.replace(/http\:/, "https:");
                    console.log(user);
                    console.log(r2obj);
                    userdb.userdb.update(query,user,{upsert: true});
                    userdb.userdb.update(query,r2obj,{upsert: true});
                    rtnuser=userdb.userdb.findOne(query);
                    res.send({data:del_id(rtnuser)});
                }
                
              })
              .catch(e=>console.log(e));      
          }
        })
        .catch(e=>console.log(e));
    });


    //add new bay
    app.put('/count', function(req, res) {
      db.connect('db', ['countdb']);
      //console.log(req); 
      //console.log(req.body); 
      let postw = req.body;
      let query={id:postw.id};
      postw.time = Date.now();
      db.countdb.update(query,postw,{upsert: true}) 
      postw=db.countdb.findOne({id:Number(postw.id)});
      res.json({data:del_id(postw)});   
    });

    // var sorted = _.sortBy(sf('horsepower'))

    app.get('/getrank', function(req, res){
      console.log(req.query);
      let {page,id} = req.query;
      id=parseInt(id);
      db.connect('db', ['countdb']);
      let alluser=db.countdb.find();
      // const sortuser=alluser.sortBy(alluser.record);
      // sortuser.slice(0,3).map(a=>{a.id,a.avatar,a.nickname,a.record});
      let sortRank=_.sort(_.descend(_.prop('record')));
      let sortUser=sortRank(alluser);
      const idRank=_.findIndex(_.propEq('id', id))(sortUser) + 1;
      db.countdb.update({id:id},{ranking:idRank},{upsert: true});
      alluser=db.countdb.find();
      // console.log(sortRank(alluser));
      //rProps:: a -> value -> [a] -> [value]
      let rProps = _.map(_.pick(['id','avatar','nickname','record']));
      let topcount=_.compose(rProps,_.slice(0,3));
      const rdata={list:topcount(sortUser),ranking:idRank}; 
      //console.log(rdata);
        
      res.send({data:del_id(rdata)});
    });
    app.get('/shop_add',function(req,res)
    {
        let {page,id} = req.query;
    });

    // /files/* is accessed via req.params[0]
    // but here we name it :file
    app.get('/:file(*)', function(req, res, next){
      var file = req.params.file;
      var path = __dirname + '/' + file;
      var folder1 = file.match(/[^\\\/]+/);
      if (folder1){
        switch (folder1.toString())
          {
            case 'works':
            case 'uploads':
                //console.log(path+' download!');
                res.download(path);
                break;
          }

      }
      
    });



    app.delete('/delconvf', function(req, res){
        var filer = JSON.parse(req.query.file);
        //console.log(filer);
        var file = filer.convPath;
        var path = __dirname + '/' + file;
        var folder1 = file.match(/[^\\\/]+/);
        //var deletef = JSON.parse(req.body);
        switch (folder1.toString()) {
        case 'works':
        case 'uploads':
            fs.exists(path,function(exists){  
                if(exists){  
                    fs.unlink(path, function(err){
                        if(err){
                            console.log(err);
                            //throw err;
                        }else{
                            console.log('file:'+path+' deleted!'); 
                            filer.convFlag = false;
                            res.send(filer);
                        }
                    });
                }else{
                    console.log('file:'+path+' not exist!'); 
                    filer.convFlag = false;
                    res.send(filer);
                }
            }); 
            break;
        }
        // filer.convFlag = false;
        // res.send(filer);
    });




    app.listen('3302', function(){
        console.log('running on 3302...');
    });

if (env === 'prod'){
    httpsServer.listen('3303', function() {
        console.log('HTTPS Server is running on:3303...');
    });
}

    