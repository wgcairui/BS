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
        },
        //select文件列表
        filelist:{},
        filelisttemp:[],//存放getfilelist
        filelist_select:0,
        //修改文件列表缓存
        reg_filename:{
            new:'',
            old:''
        },
        //month
        Month:new Date().getMonth()
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
    computed: {
        //选择文件列表-名称
        selectlist(){
            var arr = [];
            for(var i in this.filelist_select){
                var ni = Number(this.filelist_select[i]);
                arr.push(this.filelist[ni]);
            }
            return(arr);
        }  
    },
    methods:{
        //rm file
        RM_file(){
            this.AJAX("rm_file",this.selectlist,'GET','get',(data)=>{
                if(data.stat == 200){
                    this.filelist_select = [];
                    this.GET_filelist();
                }
                
            });
        },
        //click filename
        click_rename:function($event){
            this.reg_filename.old = $event.target.innerText;
            this.reg_filename.new = $event.target.innerText;
            $("#reg_name").modal("show");
        },
        //rename filename
        reg_filenames(){
            //console.log(this.reg_filename);
            this.AJAX("reg_filename",this.reg_filename,"GET","get",(data)=>{
                if(data.stat == 200){
                    $("#reg_name").modal("hide");
                    this.GET_filelist();

                }
                
            });
            
        },
        Cmn(code){
            let coder = this.arg[code];
            //console.log(coder);
            return ((coder.pf*0.942)+coder.sl+coder.sx-coder.tf+coder.zc+(this.pe/3));
        },
        num(item){
            var val = 0;
            for(var i in item){
                val += item[i].cost;
            }
            return val;
        },
        input_modal(){
            $("#modal1").modal('show');
        },
       //ParesXlsx 解构xlsx文档
       ParesXlsx(){
           var p = {};
           var pc = '';
           //console.log(typeof(this.filelisttemp));
           for(var i of this.filelisttemp){
               //console.log(i);
               if(i.includes(this.Month+'月')){
                if(i.includes('预付款对账统计')){
                    pc = i;
                }else if(i.includes('签收查询')){
                    p.qs = i;
                }else{
                    p.mx = i;
                }
               }
           }
           this.AJAX('ParesXlsx',p,'GET','get',(data)=>{
            vm.Accpt = data;
           });
           this.AJAX('ParesXlsx_company',pc,'GET','get',(data)=>{
            vm.Company = data;
           });
       },
       //get filelist
       GET_filelist(){
        this.AJAX('get_fielist',{},'GET','get',(data)=>{
            var j = {};
            vm.filelisttemp = data;
                for(var i=0;i<data.length;i++){
                    j[i] = data[i];
                }
                vm.filelist = j;
           });
       },
       AJAX(id,json,type,url,callback){
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
    
    },
    created () {
        this.GET_filelist();
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
      vm.GET_filelist();
    },//上传成功回调函数
    errorFunc: function(res) {
      console.log('失败回调', res);
    },//上传失败回调函数
    deleteFunc: function(res) {
      console.log('删除回调', res);
    }//删除文件回调函数
  });