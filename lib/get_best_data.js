/* jshint esversion:6 */
const stj = require('./str_to_json');
const mongo = require('./Mongo');
const request = require('request');
const request_jar = require('request').jar();

const cookie = 'SCOUTER=z2end0bcpbu75e; sid=fcbcca45-9d7a-4b91-8eb8-0a2c363d22eb; UM_distinctid=15fbad83ace3fe-01883c4fa67f05-24414032-15f900-15fbad83ad0139; userName=4302011';
const cookiea = 'SCOUTER=z6apruv1h0b8ou';
const cookieb = 'sid=fcbcca45-9d7a-4b91-8eb8-0a2c363d22eb';
const cookiec = 'UM_distinctid=15fbad83ace3fe-01883c4fa67f05-24414032-15f900-15fbad83ad0139';
const cookied = 'userName=4302011';

//签收率url
const url_searchTransOrderStatusSummary = 'https://v5.800best.com/ltlv5-war/web/transOrder/searchTransOrderStatusSummary';
const json_searchTransOrderStatusSummary = {siteId: 8035859, type: "ALL"};
//费用明细url
const url_selectBalanceStatementBySoForFrontPage = 'https://v5.800best.com/ltlv5-war/web/balanceDetail/selectBalanceStatementBySoForFrontPage';
const json_selectBalanceStatementBySoForFrontPage = {};
//扫描率url
const url_searchScanRate = 'https://v5.800best.com/ltlv5-war/web/scan/searchScanRate';
const json_searchScanRate ={checkDate: "2018-05-09 22:04:17"};

request_jar.setCookie(request.cookie(cookiea),url_selectBalanceStatementBySoForFrontPage);
request_jar.setCookie(request.cookie(cookieb),url_selectBalanceStatementBySoForFrontPage);
request_jar.setCookie(request.cookie(cookiec),url_selectBalanceStatementBySoForFrontPage);
request_jar.setCookie(request.cookie(cookied),url_selectBalanceStatementBySoForFrontPage);


stj(cookie,(cookiejson)=>{
    
    request.post({url:url_selectBalanceStatementBySoForFrontPage,jar:request_jar,form:json_selectBalanceStatementBySoForFrontPage},(err,res,body)=>{
        console.log(res);
    });
});

