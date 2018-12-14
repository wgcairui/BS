/* jshint esversion:6 */
var JsBarcode = require('jsbarcode');
var Canvas = require('canvas');

module.exports = (str)=>{
    return JsBarcode(Canvas,str);
};
