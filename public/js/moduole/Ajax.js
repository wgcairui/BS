/*jshint esversion:6*/
var AJAX = (id,json,type,url,callback)=>{
        $.ajax({
            type:type,
            url:url,
            data:{
                id:id,
                data:json
            },
            success:(data)=>{
                callback(data);
            }
        });
         }