/* jshint esversion:6*/
//初始化ajax默认参数
$.ajaxSetup({
    type: "GET",
    url: "/",
    dataType: "json"
});

//vue
var vm2 = new Vue({
    el:'#code',
    data:{
        BarcodeText:'',
        line:[],
        thet:0,
        c1:false,
        size:{
            w:2.9,
            h:90
        }

    },
    methods:{
        Barcode(){
            this.line = [];
            this.line = this.toline();
             this.tobarcode();   
             this.c1 = true;        
        },
        tobarcode(){
            //if(this.line[this.thet] == '') return (alert('val is'))
            for(let i=0;i<12;i++){
                JsBarcode(document.getElementById(i),this.line[this.thet],{
                    width:this.size.w,
                    height:this.size.h
                });  
                this.thet += 1;                         
            }
        },
        toline(){
            return this.BarcodeText.split(/[\s\n]/);
        },
        toright(){
            console.log(this.thet);
            this.tobarcode();
        }
    },
});
