/* jshint esversion:6   */

$.ajaxSetup({
    type:"POST",
    url:"/post",
    dataType:"json"
});

//vm
const vm = new Vue({
    el:'vm',
    data:{

    },
    methods:{
       //upload
       upload:function(){
        var data = new FormData();
        var file = $("#file")[0].files[0];
        //console.log(file);
        if(file.size > 50331648) return(alert('上传文件不能大于48MB'));
        var fileobj = {name:file.name,size:file.size,info:'正在上传'};
        this.uploadfiles.push(fileobj);
        data.append('file',file);
        //console.log(data);
        $.ajax({
            url:'/upload',
            type:'POST',
            dataType:'json',
            cache:false,
            processData:false,
            contentType:false,
            data:data,
            success:function(data){
                for(var i=0;i<manage1.uploadfiles.length;i++){
                    if(manage1.uploadfiles[i].name === fileobj.name){
                        console.log(fileobj.name);
                        manage1.uploadfiles[i].info = data.info;
                    }
                }
                //alert(data.info);
            }
        });
    } 
    }
});

//vm2
const vm2 = new Vue({
    el:'#head'
});