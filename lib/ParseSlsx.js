/* jshint esversion:6   */
const xlsx = require('node-xlsx').default;
const mongo = require('./Mongo');
const path = require('path');
const py = require('node-pinyin');

//const
const Month = 5;
const Collect_Time = new Date();
const Store = '武昌水果湖二派';
const a = 'V5导出-预付款明细查询';
const b = 'V5导出-预付款对账统计';
const c = 'V5导出-签收查询';
//const Data arg
const DB = 'BS';
//签收元数据
const Accept_unit = 'Accept_unit';
//签收汇总数据
const Accept_collect = 'Accept_collect';
//明细元数据
const Codeindo_unit = 'Codeinfo_unit';
//明细汇总数据
const Codeindo_collect = 'Codeinfo_collect';
//明细个人分类数据
const Codeinfo_classify = 'Codeinfo_classify';
//分类汇总
const Classify_collect = 'Classify_collect';



//写入签收数据，提取汇总数据；
const Accept = (filenme,callback)=>{
    Result_Parse_Xlsx(filenme,(data)=>{        
        //提取派件人员
        let telarr = [];
        for(let i of data.data){
            if(i[2].val == '武昌水果湖二派'){
                let tel = i[1].val;
                if(!telarr.includes(tel)){
                    telarr.push(tel);
                }
            }
        }

        //序列化
        let Accept_user = {};
        for(let i of telarr){
            if(typeof(i) != "undefined"){
                Accept_user[i] = [];
            }
        }

        //遍历单号，归类对应手机号
        for(let i in Accept_user){
            let arr = [];
            for(let v of data.data){
                if(i == v[1].val){
                    arr.push(v[0].val);
                }
            }
            Accept_user[i] = arr;
        }
        //遍历单号，提取4302011
        {
            let arr = [];
            for(let i of data.data){
                if(typeof(i[1].val) == "undefined"){
                    arr.push(i[0].val);
                }
            }
            Accept_user['4302011'] = arr;
        }
        mongo.insert(DB,Accept_unit,Structuring_Data(data),(result)=>{});//console.info(result);});
        mongo.insert(DB,Accept_collect,Structuring_Data(Accept_user),(result)=>{});

        callback(Accept_user);
        //console.log(Accept_user);
    });
};

//提取V5导出-预付款对账统计.xlsx
const Codeinfo = (Codeinfo_filename,Accept_filename,callback)=>{
    
    Result_Parse_Xlsx(Codeinfo_filename,(Codeinfo_data)=>{
        //console.log(Codeinfo_data.data);
        Accept(Accept_filename,(Accept_data)=>{
            let Codeinfo_json = [];
            let tellist = [];
            for(let i of Codeinfo_data.data){
                for(let v in Accept_data){
                    if(!tellist.includes(v)) tellist.push(v);                  
                    if(Accept_data[v].includes(i[3].val)){
                        Codeinfo_json.push([{code:v,info:i}]);
                    }else if(typeof(i[3].val) == "undefined"){
                        Codeinfo_json.push([{code:'4302011',info:i}]);
                    }
                }
            }
            mongo.insert(DB,Codeindo_collect,Structuring_Data(Codeinfo_json),(result)=>{});
            callback({tellist:tellist,json:Codeinfo_json});
        });
        mongo.insert(DB,Codeindo_unit,Structuring_Data(Codeinfo_data),(result)=>{});
    });
};

//分类列出每个人的明细，汇总到每个人

const Collect_Codeinfo = (Codeinfo_filename,Accept_filename,callback)=>{
    Codeinfo(Codeinfo_filename,Accept_filename,(Codeinfo_data)=>{
        let tellist = Codeinfo_data.tellist;
        let json = Codeinfo_data.json;
        let Collect = {};
        //console.log(json);
        for(let tel of tellist){
            let arr = [];
            for(let f of json){
                //console.log(f);
                if(f[0].code == tel){
                    arr.push(f[0].info);
                }
            }
            Collect[tel] = arr;
        }
       /*return
        {
            '1':[[],[]],
            '2;:[[],[]]
        }
       */
        mongo.insert(DB,Codeinfo_classify,Structuring_Data(Collect),(result)=>{});
        callback(Collect);
    });
};

//汇总每个人的数据
const Classify_Codeinfo = (Codeinfo_filename,Accept_filename,callback)=>{
    Collect_Codeinfo(Codeinfo_filename,Accept_filename,(data)=>{
        //console.log(data);
        let Classifycollect = {};
        for(let i in data){
            Classifycollect[i] = {};            
            let Classify = Classifycollect[i];
            let rw =[];
            for(let arr of data[i]){
                if(!rw.includes(arr[0].val)){
                    rw.push(arr[0].val);
                    let costtype = arr[1].val;
                    let cost =parseFloat(arr[2].val);
                //格式化收费类型
                    let pycost = py(costtype,{style:'normal'}).join('');
                    if(typeof(Classify[pycost])=='undefined') Classify[pycost] ={costtype:costtype,cost:0};
                    Classify[pycost].cost += cost;
                }
                                
            }
        }
        mongo.insert(DB,Classify_collect,Structuring_Data(Classifycollect),(result)=>{});
        callback(Classifycollect);
    });
};


//格式化存储的json
let Structuring_Data = (data)=>{
    return {
        Month:Month,
        Collect_Time:Collect_Time,
        Data:data
    };
};

//解构传入的xlsx，return json结构化数据
var Result_Parse_Xlsx = (filename,callback)=>{
    filepath = path.join('./public/file/',filename);
    let json = xlsx.parse(filepath)[0];
    let data = {};
    data.data=[];
    data.name = filename;// json.name;
    let title = json.data[0];
    json.data.shift();

    for(let i of json.data){
        let temparr = [];
        for(let r=0;r<i.length;r++){
            let arrjson = {name:title[r],val:i[r]};
            temparr.push(arrjson);
        }
        data.data.push(temparr);
    }
    callback(data);
};

module.exports = Classify_Codeinfo;