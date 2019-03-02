/* jshint esversion:6   */
const xlsx = require('node-xlsx').default;
const mongo = require('./Mongo');
const path = require('path');
const py = require('node-pinyin');

//const

const Collect_Time = new Date();
const Month = Collect_Time.getMonth()+1;
const Store = '武昌水果湖二派';
const StoreID = '4302011';
const a = 'V5导出-预付款明细查询';
const b = 'V5导出-预付款对账统计';
const c = 'V5导出-签收查询';
//const Data arg
const DB = 'BS';
//
const ag = {
    count:{
        Accept:0,//签收数据计数
        tel:{},//人员计数
        Codeindo:0,//对账单元数目计数
        Collect:0,//单号条目
    }
};
const Tel_to_Name = {
    4302011:"other",
    13871000261:"曾涛",
    15337364316:"蔡瑞",
    13437187257:"李飞",
    18573173106:"曾辉"
};
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
        //存放派件人员tel
        let telarr = [];
        let telnum = 7;
        let oddnum = 0;
        let sitenum = 18;
        for(let i of data.data){            
            if(i[sitenum].val == Store){
                ag.count.Accept += 1;
                let tel =i[telnum].val;
                if(!telarr.includes(tel)){
                    telarr.push(tel);
                    ag.count.tel[tel] = 0;
                    console.log('派件员：'+tel);
                }
                
            }
        }
        console.log('遍历签收数据，合计数'+ag.count.Accept);
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
                if(i == v[telnum].val){
                    ag.count.tel[i] =+1;
                    arr.push(v[oddnum].val);
                }
            }
            Accept_user[i] = arr;
            console.log('遍历'+i+',合计数'+ag.count.tel[i]);            
        }
        //遍历单号，提取4302011
        {
            let arr = [];
            ag.count.tel[StoreID] = 0;
            for(let i of data.data){
                if(typeof(i[telnum].val) == "undefined"){
                    ag.count.tel[StoreID] += 1;
                    arr.push(i[oddnum].val);
                }
            }
            console.log('遍历'+StoreID+',合计数'+ag.count.tel[StoreID]);
            Accept_user[StoreID] = arr;
        }
        mongo.insert(DB,Accept_unit,Structuring_Data(data),(result)=>{});//console.info(result);});
        mongo.insert(DB,Accept_collect,Structuring_Data(Accept_user),(result)=>{});

        callback(Accept_user);
        //console.log(Accept_user);
    });
};

//提取V5导出-预付款对账统计.xlsx
const Codeinfo = (Codeinfo_filename,Accept_filename,callback)=>{ //codeinfofilename对账单表，Accept_filename签收元数据
    
    Result_Parse_Xlsx(Codeinfo_filename,(Codeinfo_data)=>{ 
        let oddnum = 10;

        Accept(Accept_filename,(Accept_data)=>{  //Accept——data为提取签收数据后统计的每人对应单号json

            let tellist = [];//派件人员手机号列表
            let codeinfolist = {};
            for(let i of Codeinfo_data.data){
                //console.log(i);
                //测试隔断代码
                /*
                if(ag.count.Codeindo > 20) break;
                ag.count.Codeindo += 1;
                */
                //
                for(let v in Accept_data){
                    //此处可以把if初始化单独做出来，懒，下次搞
                    if(!tellist.includes(v)){
                        tellist.push(v); 
                        codeinfolist[v] = [];
                    }              
                    if(Accept_data[v].includes(i[oddnum].val)){
                        codeinfolist[v].push(i);
                    }else if(typeof(i[oddnum].val) == "undefined"){
                        codeinfolist[StoreID].push(i);
                    }
                }
            }
            //console.log(codeinfolist);
            console.log('对账单明细，遍历数据条目'+ ag.count.Codeindo);
            mongo.insert(DB,Codeindo_collect,Structuring_Data(codeinfolist),(result)=>{});
            callback(codeinfolist);
        });
        mongo.insert(DB,Codeindo_unit,Structuring_Data(codeinfolist),(result)=>{});
    });
};

//分类列出每个人的明细，汇总到每个人
/*
const Collect_Codeinfo = (Codeinfo_filename,Accept_filename,callback)=>{
    Codeinfo(Codeinfo_filename,Accept_filename,(Codeinfo_data)=>{
        let tellist = Codeinfo_data.tellist;
        let json = Codeinfo_data.json;
        let Collect = {};
        //console.log(json);
        for(let tel of tellist){
            let n = 0;
            let arr = [];
            for(let f of json){
                //console.log(f);
                if(f[0].code == tel){
                    n +=1;
                    arr.push(f[0].info);
                }
            }
            Collect[tel] = arr;
            console.log(tel+'有'+n+'条账单数据');
        }
       return
        {
            '1':[[],[]],
            '2;:[[],[]]
        }
       
        mongo.insert(DB,Codeinfo_classify,Structuring_Data(Collect),(result)=>{});
        callback(Collect);
    });
};
*/
//汇总每个人的数据
exports.Classify_Codeinfo = (Codeinfo_filename,Accept_filename,callback)=>{
    Codeinfo(Codeinfo_filename,Accept_filename,(data)=>{
        let classifynum = 0;
        let cttnum = 5;
        let ctnum = 8;


        //console.log(data);
        let Classifycollect = {};
        for(let i in data){
            Classifycollect[i] = { //初始化小票补贴
                xp:{
                    xp_num:0,
                    xp_cost:0
                }
            };            
            let Classify = Classifycollect[i];
            let rw =[];//存放流水号，避免重复
            for(let arr of data[i]){ //arr为单个人的帐目明细
                //console.log(arr);
                if(!rw.includes(arr[classifynum].val)){
                    rw.push(arr[classifynum].val);
                    let costtype = arr[cttnum].val;
                    let cost =parseFloat(arr[ctnum].val);
                    //统计小票补贴
                    if(costtype == "派件费"){
                        if(cost < 20 && cost > 9.5){
                            Classify.xp.xp_num +=1;
                            Classify.xp.xp_cost += cost;
                        }
                    }
                //格式化收费类型
                    let pycost = py(costtype,{style:'normal'}).join('');
                    if(typeof(Classify[pycost])=='undefined') Classify[pycost] ={costtype:costtype,cost:0,num:0};
                    Classify[pycost].cost += cost;
                    Classify[pycost].num +=1;
                }                                
            }
        }
        
        //zarise classifycollect
        {
            for(let i in Classifycollect){
                var cla_temp = Classifycollect[i];
                cla_temp.name = Tel_to_Name[i];
                cla_temp.xp.xp_bt = (cla_temp.xp.xp_num*20) - cla_temp.xp.xp_cost;
            }
        }
        console.log(Classifycollect);
        mongo.insert(DB,Classify_collect,Structuring_Data(Classifycollect),(result)=>{});
        callback(Classifycollect);
    });
};

//格式化对账单
exports.Classify_Company = (companyfile,callback)=>{
    Result_Parse_Xlsx(companyfile,(json)=>{
        let company_data = [];
        for(let i of json.data[0]){
            if(i.val !='' && i.val != '0' && typeof(i.val) != 'undefined' && !(i.name.includes('当前')) && !(i.name.includes('应收')) && !(i.name.includes('往来方')) && !(i.name.includes('短信费')) && !(i.name.includes('操作费'))){
                company_data.push(i);
            }
        }
        callback(company_data);
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

