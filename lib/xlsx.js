
/* jshint esversion:6   */
const xlsx = require('node-xlsx').default;
const mongo = require('./Mongo');

function Requst_xlsx_parse (filename,store) {
    const file = xlsx.parse(filename);
    const data = {};
    data.data = {};
    const xlsx_name = file[0].name;
    data.name = xlsx_name;
    const data_array = file[0].data;
    if(xlsx_name.indexOf('预付款明细查询') != -1) {
        DataA();
        mongo_insert('Statement_details',store,data);
    }
    if(xlsx_name.indexOf('签收查询') != -1) {
        DataB();
        mongo_insert('sign_query',store,data);
    }
    if(xlsx_name.indexOf('预付款对账统计') != -1) {
        DataC();
        mongo_insert('Statement_statistics',store,data);
    }
    //匹配结算明细数据
    function DataA() {        
            data.name = xlsx_name;
            for (var i = 1;i<data_array.length;i++){
                const d = data_array[i];
                data.data[i] = {
                    odd:d[10],
                    type:d[5],
                    money:d[8],
                    time:d[16]
                };
            }
      }
    //匹配签收数据
    function DataB() {
        data.data = {};
        const cr = [];
        const lf = [];
        const zt = [];
        const sg = [];      
        for (var i = 1;i<data_array.length;i++){
            const d = data_array[i];
            if(d[13] == '武昌水果湖二派'){                
                switch(d[7]){
                    case 15337364316:
                        cr.push(d[0]);
                    break;
                    case 13437187257:
                        lf.push(d[0]);
                    break;
                    case 13871000261:
                        zt.push(d[0]);
                    break;
                    default:
                        sg.push(d[0]);
                    break;
                }
            }
        }
        data.data.cr = cr;
        data.data.lf = lf;
        data.data.zt = zt;
        data.data.sg = sg;
    }  
    //匹配对账单数据
    function DataC() {        
        data.name = xlsx_name;
        const d = data_array[1];
        const json = {
            DaoFu_service_charge:d[14],
            DaoFu:d[16],
            PaiJian_charge:d[17],
            receipt_service:d[23],
            network_manage_charge:d[29],
            system_manage_charge:d[31],
            JiangFa:d[34],
            recharge:d[36],
            big_service_charge:d[48],
            up_charge:d[51],
            PaiFei_tixian:d[52],
            Gaidan_charge:d[56],
            COD_service_charge:d[65],
            storage_charge:d[69]
        };
        data.data = json;
    }  
    return data;
}
    
  //insert mongo
  const mongo_insert = (collcetion,store,data)=>{
    console.info("匹配到"+data.name+"表格，检索数据并写入到mongo");
    const date = new Date().getMonth();
    const json = {store:store,date:date,data:data};
    mongo.delete('BS',collcetion,{date:date,store:store},(result)=>{
        //console.log(result);
    });
    mongo.insert('BS',collcetion,json,(data)=>{
        //console.log(data);
    });
  };
module.exports = Requst_xlsx_parse;