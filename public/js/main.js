/* jshint esversion:6 */
/*
$.getScript('js/wait.js');
	$.ajaxSetup({
		type:'GET',
		url:'/',
		dataType:'json'
	});
	*/
//el:vm
	var vm = new Vue({
		el:'#vm',
		data:{
			newdata:false,
			searchTransOrderStatusSummary:'',
			selectBalanceStatementBySoForFrontPage:'{}',
			searchScanRate:'',
			json:{
				searchTransOrderStatusSummary:{},
				selectBalanceStatementBySoForFrontPage:{},
				searchScanRate:{},
				feeList:{}
			},
			select:{
				a:{
					name:'开单差错',
					val:0
				},
				b:{
					name:'客户要求明天收',
					val:0
				},
				c:{
					name:'客户电话无人接听',
					val:0
				},
				d:{
					name:'客户要求下周一收',
					val:0
				}
			},
			argment:{
				siteName:'',
				StatusSummary:{
					dispShouldAcceptCount:0,
					dispAcceptedCount:0,
					dispUnAcceptCount:0,
					dispAcceptPromptness:0
				},
				ScanRate:{
					curArrvShouldScanCount:0,
					curArrvScanedCount:0,
					curArrvNotScanCount:0,
					curArrvScanRate:0
				}
			}
		},
		computed:{
			dispUnAcceptCount(){
				return(this.json.searchTransOrderStatusSummary.dispUnAcceptCount);
			},
			bulletin(){
				const date = new Date();
				let bulletinHeader = "\【武昌水果湖二派网点"+(date.getMonth()+1)+"."+(date.getDate())+"日质量汇报】\n";
				let wq = "";
				let select = this.select;
				for(let i in select){
					console.log(select[i].val);
					if(select[i].val != 0 && typeof(select[i].val) != "undefined"){
						wq = wq+select[i].val+"票"+select[i].name+",";
					}
				}
				let dispAcceptPromptness = "1,签收率："+this.argment.StatusSummary.dispAcceptPromptness+"%,应签"+this.argment.StatusSummary.dispShouldAcceptCount+"票，已签"+this.argment.StatusSummary.dispAcceptedCount+"票，未签"+this.argment.StatusSummary.dispUnAcceptCount+"票，其中"+wq+"\n";
				let ls = "。";
				if(this.argment.ScanRate.curArrvNotScanCount != 0){
					ls = ",全部为漏扫。\n";
				}
				let curArrvScanRate = "2,扫描率："+this.argment.ScanRate.curArrvScanRate+"%,应扫"+this.argment.ScanRate.curArrvShouldScanCount+",已扫"+this.argment.ScanRate.curArrvScanedCount+",未扫"+this.argment.ScanRate.curArrvNotScanCount+ls;
				let dispUnAcceptCountCause = "";
				return bulletinHeader+dispAcceptPromptness+curArrvScanRate+dispUnAcceptCountCause;
			}
		},
		methods:{
			postV5Data(){
				$.ajax({
					url:'get',
					data:{
						id:'postV5Data',
						data:{
							searchTransOrderStatusSummary:this.searchTransOrderStatusSummary,
							selectBalanceStatementBySoForFrontPage:this.selectBalanceStatementBySoForFrontPage,
							searchScanRate:this.searchScanRate
						}
					},
					success:(data)=>{
						vm.newdata = true;
						vm.json.searchScanRate = data.searchScanRate;
						vm.json.searchTransOrderStatusSummary = data.searchTransOrderStatusSummary;
						vm.json.selectBalanceStatementBySoForFrontPage = data.selectBalanceStatementBySoForFrontPage;
						vm.json.feeList = data.selectBalanceStatementBySoForFrontPage.feeList;
						//
						vm.argment.siteName = data.searchScanRate.siteName;
						vm.argment.StatusSummary.dispShouldAcceptCount = data.searchTransOrderStatusSummary.dispShouldAcceptCount;
						vm.argment.StatusSummary.dispAcceptedCount = data.searchTransOrderStatusSummary.dispAcceptedCount;
						vm.argment.StatusSummary.dispUnAcceptCount = data.searchTransOrderStatusSummary.dispUnAcceptCount;
						vm.argment.StatusSummary.dispAcceptPromptness = data.searchTransOrderStatusSummary.dispAcceptPromptness;
						//
						vm.argment.ScanRate.curArrvNotScanCount = data.searchScanRate.curArrvNotScanCount;
						vm.argment.ScanRate.curArrvScanedCount = data.searchScanRate.curArrvScanedCount;
						vm.argment.ScanRate.curArrvScanRate = data.searchScanRate.curArrvScanRate;
						vm.argment.ScanRate.curArrvShouldScanCount = data.searchScanRate.curArrvShouldScanCount;
						//
						//console.log(vm.json.feeList);
					}
				});
				
			}
		}
		
	});

	var vm2 = new Vue({
		el:"#head",
		data:{
			
		},
		
		
	});
	