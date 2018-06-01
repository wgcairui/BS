/* jshint esversion:6  */

export function upload(files,callback) {
    //files is $("#file")
        var data = new FormData();
        var file = files[0].files[0];
        //console.log(file);
        if(file.size > 50331648) return(alert('上传文件不能大于48MB'));
        var fileobj = {name:file.name,size:file.size,info:'正在上传'};
        //this.uploadfiles.push(fileobj);
        //data.append('file',file);
        //console.log(data);
        $.ajax({
            url:'/upload',
            type:'POST',
            dataType:'json',
            cache:false,
            processData:false,
            contentType:false,
            data:data,
            success:(data)=>{
               callback(data);
            }
        });
    
  }