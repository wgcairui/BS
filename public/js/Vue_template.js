/*jshint multistr: true */
//el:head
//header 
Vue.component('app-header',{
    props:{
        'src':{
            default:'http://static.ghostchina.com/image/b/46/4f5566c1f7bc28b3f7ac1fada8abe.png'
        }
    },
    template:'<header class="container-fluid jumbotron headerimg" style="margin-bottom: 0">\
                <div class="row header-ico">\
                    <a class="tip " title="xxl" href="#">\
                    <img :src="src">\
                </a></div></header>'
});

//footer
Vue.component('app-footer',{
    template:'<footer class="footer">\
                <div class="container">\
                    <section class="col-md-4">\
                        <header class="footer-head">\
                            <h4 class="footer-tittle">最新动态</h4>\
                        </header>\
                        <ul>\
                            <li><a href="#" class="footer-show">news</a></li>\
                        </ul>\
                    </section>\
                    <section class="col-md-4">\
                        <header class="footer-head">\
                            <h4 class="footer-tittle">新客户</h4>\
                        </header>\
                    </section>\
                    <section class="col-md-4">\
                        <header class="footer-head">\
                            <h4 class="footer-tittle">联系咨询</h4>\
                        </header>\
                        <ul>\
                            <li><p><span class="glyphicon glyphicon-phone"></span> 杨先生：13972689305</p></li>\
                            <li><p><span class="glyphicon glyphicon-phone"></span> 邓先生：18118439727（技术支持）</p></li>\
                        </ul>\
                    </section>\
                </div>\
            </footer>',
});
//nav
Vue.component('app-nav',{
    props:{
        'title':{
            type:String,
            default:'Title'
        }
    },
    template:'<nav class="navbar navbar-default navbar-inverse" role="navigation" style="border-radius: 0">\
                <div class="navbar-header">\
                     <button class="navbar-toggle" data-toggle="collapse" data-target="#nav1" type="button">\
                        <span class="sr-only">sm show</span>\
                        <span class="icon-bar"></span>\
                        <span class="icon-bar"></span>\
                        <span class="icon-bar"></span>\
                        <span class="icon-bar"></span>\
                    </button>\
                    <a href="#" class="navbar-brand" >{{title}}</a>\
                </div>\
                <div class="collapse navbar-collapse pull-right" id="nav1">\
                    <ul class="nav navbar-nav">\
                        <slot></slot>\
                    </ul>\
                </div>\
            </nav>',
});
//body
//modal
Vue.component('app-modal',{
    template:'<div class="modal fade" role="dialog" tabindex="-1" aria-hidden="true" :id="ids">\
    			<div  class="modal-dialog">\
    				<div class="modal-content">\
    					<div class="modal-header">\
    						<button class="close" data-dismiss="modal">&times;</button>\
    						<h4 class="center-block">{{title}}</h4>\
    					</div>\
    					<div class="modal-body">\
    						<slot></slot>\
    					</div>\
    					<div class="modal-footer">\
    						<button class="btn btn-default" data-dismiss="modal">close</button>\
    						<button class="btn btn-default btn-success" @click="inc">{{btntext}}</button>\
    					</div>\
    				</div>\
    			</div>\
            </div>',
    //props:['id','tittle','btn_ok']
    props:{
        'ids':{
            type:String,
            default:'modal1'
        },
        'title':{
            type:String,
            default:'Modal'
        },
        'btntext':{
            type:String,
            default:'Yes'
        }
    },
    methods:{
        inc:function(){
            this.$emit('modal');
        }
    }
});

//block 创建块组件
Vue.component('app-block',{
    template:'<section class="block" id="s1">\
                <div class="block-tittle"><h4>{{title}}</h4></div>\
                <article class="block-cont">\
                    <p class="block-p">{{explain}}</p>\
                    <slot name="body">body</slot>\
                </article>\
                <footer class="block-footer">\
                    <slot name="footer"></slot>\
                </footer>\
            </section>',
    props:{
        'title':{
            type:String,
            default:'block title'
        },
        'explain':{
            type:String,
            default:''
        }

    }
})


