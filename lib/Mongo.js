/* jshint esversion: 6 */
const Client = require('mongodb').MongoClient;
const contstr = require('../passwd/mongo');

exports.setval = function(url,db,collection){
  if (url != 'null') contstr.url = url;
  if (db != 'null') contstr.db = db;
  if (collection != 'null') contstr.collection = collection;
};
/*
obj:查询对象
dbname:查询数据库
collection：查询集合
*/
exports.find = (dbname,collectionname,obj,callback)=>{
  Client.connect(contstr.url,(err,db)=>{
    if(err) return callback(err);
    const collection = db.db(dbname).collection(collectionname);
    collection.find(obj).toArray((err,result) => {
      if(err) return callback(err);
      callback(result);
    });
  });
};
/*
obj:查询对象
dbname:查询数据库
collection：查询集合
limit:条目数
*/
exports.findlimit = (dbname,collectionname,obj,limit,callback)=>{
  Client.connect(contstr.url,(err,db)=>{
    if(err) return callback(err);
    const collection = db.db(dbname).collection(collectionname);
    collection.find(obj).limit(limit).toArray((err,result) => {
      if(err) return callback(err);
      callback(result);
    });
  });
};

/*
obj:insert对象
dbname:查询数据库
collection：查询集合
*/
exports.insert = (dbname,collectionname,obj,callback) => {
  Client.connect(contstr.url,(err,db)=>{
    if(err) console.log(err);
    const collection = db.db(dbname).collection(collectionname);
    collection.insert(obj,(err,result) => {
      //if(err) console.log(err);
      callback(result);
    });
  });
};

/*
obj:insertmany对象
dbname:查询数据库
collection：查询集合
*/
exports.insertMany = (dbname,collectionname,obj,callback)=>{
  Client.connect(contstr.url,(err,db)=>{
    if(err) return callback(err);
    const collection = db.db(dbname).collection(collectionname);
    collection.insertMany(obj,(err,result) => {
      callback(result);
    });
  });
};

/*
obj:update对象
dbname:查询数据库
collection：查询集合
*/
exports.update = (dbname,collectionname,obj,callback)=>{
  Client.connect(contstr.url,(err,db)=>{
    if(err) return callback(err);
    const collection = db.db(dbname).collection(collectionname);
    collection.update(obj,(err,result) => {
      callback(result);
    });
  });
};

/*
obj:delete对象
dbname:查询数据库
collection：查询集合
*/
exports.delete = (dbname,collectionname,obj,callback)=>{
  Client.connect(contstr.url,(err,db)=>{
    if(err) return callback(err);
    const collection = db.db(dbname).collection(collectionname);
    collection.deleteOne(obj,(err,result) => {
      callback(result);
    });
  });
};






