/* jshint esversion:6 */
var express = require('express');
var router = express.Router();
const parse = require('../lib/json_parse');
const mongo = require('../lib/Mongo');
const fs = require('fs');
const path = require('path');
const ParesXlsx = require('../lib/ParseSlsx');

/* GET home page. */
router.get('/get', function(req, res) {
  let id = req.query.id;
  switch(id){
    case 'postV5Data':
      let postV5Data = ()=>{
        const data = {};
        let query = req.query.data;
        for(let i in query){
          data[i] = parse(query[i]).vo;
        }
        return data;
      };

      res.json(postV5Data());
    break;

    case 'bulletinWriteLog':
      const bulletinWriteLog = ()=>{
        let query = req.query.data;
        let json = {date:new Date(),data:query};
          mongo.insert('BS','bulletin',json,(result)=>{
            res.json(result);
          });
      };
      bulletinWriteLog();
    break;

    case 'get_bulletin':
      const get_bulletin = ()=>{
        mongo.findlimit('BS','bulletin',{},10,(result)=>{
          res.json(result);
        });
      };
      get_bulletin();
    break;

    case 'ParesXlsx':
      
    break;

  }
});

//响应upload上传请求；
router.post('/upload',function (req,res) {
  if(!req.files) return res.json({code:-1,info:'file err'});
  if(req.files.length === 0){
    return res.json({status:0,info:'upload error,no file object'});
  } 
  if(req.files[0].size > 50331648){
    return res.json({status:0,info:'upload error,file size maxsize out'});
  } 
 
  //console.log(req.files);
  const files = req.files[0];
  let originalname = files.originalname;
  let tempPath = files.path;
  fs.rename(tempPath,path.join('public/file/',originalname),(err)=>{
    if(err){
      console.log(err);
      return res.json({code:-1,info:err});
    }
    return res.json({code:200,info:path.join("文件",originalname,"上传已完成")});
  });


});


module.exports = router;
