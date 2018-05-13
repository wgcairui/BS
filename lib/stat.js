/*jshint esversion:6  */
const xlsx = require('./xlsx');
const mongo = require('./Mongo');
const fs = require('fs');
const path = require('path');
const filepath = path.join(__dirname,'../file/');
const store = '水果湖二派';
const date = new Date().getMonth();

//for file floter,pares xlsx to mongo everyone
const Parse_xlsx_to_json = (filepath,store)=>{
    fs.readdir(filepath,(err,filelist)=>{
        const mongo_json = {};
        for(var i in filelist){
            xlsx(path.join(filepath,filelist[i]),store);
        }        
    });
};

//Parse_xlsx_to_json(filepath,store);
const get_statement = (date,store,callback)=>{
    const var_statics = [];
    //get sign_query table list
    mongo.find('BS','sign_query',{store:store,date:date},(data)=>{
        const sign_query = data[0].data.data;
        //get ststement_details tables
        mongo.find('BS','Statement_details',{store:store,date:date},(data)=>{
            const Statement_details = data[0].data.data;

            //for statement_details
            for (let i in Statement_details){
                //get odd in sign of statement
               let var_statement = pox_statement(sign_query,i,Statement_details);
               //if pox-statement return 'undefined', pox-statemnet is 改单操作费之类，赋值sys
               if(typeof(var_statement) == 'undefined'){
                    var_statement = Statement_details[i];
                    var_statement.name = i;
                    var_statement.id = 'sys';
               } 
               var_statics.push(var_statement);
               //console.log(var_statement);
               //drop statement list已提取的数据
               delete Statement_details[var_statement.name];              
            }

        const statics_details = {
            date:date,
            store:store,
            data:[]
        };
        statics_details.data = var_statics;
        
        callback(statics_details);
        });
    });
    //pox_statement 比较每个statement对象odd单号属性，是否包含在sign其中属性数组中，true则add id,name
    function pox_statement(sign,item,statement) { 
        for(let i in sign){
            if(sign[i].includes(statement[item].odd)){
                statement[item].name = item;
                statement[item].id = i;
                return statement[item];
            }
        }
    }
};


function equ_details_list(date,store,callback){
    get_statement(date,store,(statement_details)=>{
        mongo.delete('BS','statics_details',{date:date,store:store},()=>{
            mongo.insert('BS','statics_details',statement_details,(result)=>{
                callback(result.result.ok);
            });
        });
    });
  }

  equ_details_list(date,store);