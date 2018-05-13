/* jshint esversion:6 */
module.exports = (json_str)=>{
    if(typeof(json_str) != 'string' || json_str == '') json_str = "{data:null}";
    return JSON.parse(json_str);
};