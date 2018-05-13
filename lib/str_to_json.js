/* jshint esversion:6 */
module.exports = (cookiestr,callback)=>{
    var cookies_arr = cookiestr.split(';');
    var cookie_json = {};
    for(var i = 0;i<cookies_arr.length;i++){
        var cookie_split = cookies_arr[i].split('=');
        cookie_json[cookie_split[0]] = cookie_split[1];
    }
    callback(cookie_json);
};