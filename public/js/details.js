/* jshint esversion:6   */

$.ajaxSetup({
    type:"POST",
    url:"/post",
    dataType:"json"
});

//vm
const vm = new Vue({
    el:'#vm',
    data:{
        file:[],
        Accpt:{},
        Company:{},
        publicEx:0,
        arg:{           
            cr:{
                pf:0,
                sl:0,
                sx:0,
                tf:0,
                zc:0,
                dk:0
            },
            lf:{
                pf:0,
                sl:0,
                sx:0,
                tf:0,
                zc:0,
                dk:0
            },
            zt:{
                pf:0,
                sl:0,
                sx:0,
                tf:0,
                zc:0,
                dk:0
            },
            lp:{
                pf:0,
                sl:0,
                sx:0,
                tf:0,
                zc:0,
                dk:0
            }
        }
    },
    watch:{
        CpublicEx(){
            let pe = 0;
            for(let i in this.arg){
                pe += i.zc;
            }
            this.publicEx = pe;
            return pe;
        }
    },
    methods:{
        Cmn(code){
            let coder = this.arg[code];
            console.log(coder);
            return ((coder.pf*0.942)+coder.sl+coder.sx-coder.tf+coder.zc+(this.pe/3));
        },
        num(item){
            var val = 0;
            for(var i in item){
                val += item[i].cost;
            }
            return val;
        },
       //ParesXlsx 解构xlsx文档
       ParesXlsx(){
           $.ajax({
            type:'GET',
            url:'get',
            data:{
                id:'ParesXlsx'
            },
            success:(data)=>{
                vm.Accpt = data;
            }
           });

           $.ajax({
            type:'GET',
            url:'get',
            data:{
                id:'ParesXlsx_company'
            },
            success:(data)=>{
                vm.Company = data;
            }
           });
       }
    
    }
});

//vm2
const vm2 = new Vue({
    el:'#head'
});

$('#easyContainer').easyUpload({
    allowFileTypes: '*.jpg;*.xlsx',//允许上传文件类型，格式';*.doc;*.pdf'
    allowFileSize: 100000,//允许上传文件大小(KB)
    selectText: '选择文件',//选择文件按钮文案
    multi: true,//是否允许多文件上传
    multiNum: 5,//多文件上传时允许的文件数
    showNote: true,//是否展示文件上传说明
    note: '提示：最多上传5个文件，支持格式为xlsx',//文件上传说明
    showPreview: true,//是否显示文件预览
    url: 'upload',//上传文件地址
    fileName: 'file',//文件filename配置参数
    formParam: {
      //token: $.cookie('token_cookie')//不需要验证token时可以去掉
    },//文件filename以外的配置参数，格式：{key1:value1,key2:value2}
    timeout: 30000,//请求超时时间
    okCode: 200,//与后端返回数据code值一致时执行成功回调，不配置默认200
    successFunc: function(res) {
      console.log('成功回调', res);
    },//上传成功回调函数
    errorFunc: function(res) {
      console.log('失败回调', res);
    },//上传失败回调函数
    deleteFunc: function(res) {
      console.log('删除回调', res);
    }//删除文件回调函数
  });