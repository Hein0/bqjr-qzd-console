
var seckill = {
	init:function(){
		this.attendtipsindex = '0'; //记录选择 添加 已经参加活动的商品的索引值
		this.goodsArr=[];//用来存放添加选中的商品
		this.selecdgoodsarr = [];//用来存放选中添加到页面上的商品
		this.goodsPopShow();//商品分类
		this.bindEvents();//绑定事件
		this.ARRGOODS=[];
		this.activityId = '';
		this.getAddGoods();
		this.skuCatId = '';
		this.crossgoods=[];
		this.noCross = [];
		this.Cross = [];
		this.flag = true;
	},
	bindEvents:function(){
		var _self = this;
		//监听活动标题长度
		$('#actTitle').blur(function(){
			if($(this).val().length >30 ){
				$.Huimodalalert("标题长度不能长于30个字符", 2000);
			}
		}),
		//全选按钮
		$('.table_list').on('click','.checkall',function(){			
			var flag = $(this).is(":checked")
			var inputarr = $(this).parent().parent().parent().parent().find('tr');
			if(flag){
				for(var i = 1 ; i < inputarr.length ; i++){
					$(inputarr[i]).find('input').prop('checked',true)				
				}
			}else{
				for(var i = 1 ; i < inputarr.length ; i++){
					$(inputarr[i]).find('input').prop('checked',false)				
				}
			}			
		});
		//选择是否参加过活动
		$('.isattend').eq(0).on('click','input',function(){
			_self.addLinkGoods(_self.skuCatId,0);
            $('#cross').hide();
            $('#nocross').show();
		}).end().eq(1).on('click','input',function(){
			_self.addLinkGoods(_self.skuCatId,0);
            $('#cross').show();
            $('#nocross').hide();
		});		
		//点击添加商品按钮
		$('.addgoodsbtn').on("click",function(){
			//清空选中的商品列表数组
			var Title = $('#actTitle').val();
            var begin = $('#freeStart').val();
			var end = $('#freeEnd').val();
			//检验规则
			var rulesArr = $('.count-wrap')
			var rulesFlag = true;
			for(var i = 0 ; i < rulesArr.length ; i++){
				if($(rulesArr[i]).find('input').val() != 10){
					rulesFlag = false;	
				}				
			}			
            if( Title && begin && end){
				if(Title.length > 30 ){
					$.Huimodalalert("标题长度不能长于30个字符", 2000);
					return ;
				}else{
					if(!rulesFlag){
						if(!$('#extendInfo').val()){
							$.Huimodalalert("请确认免息标签", 1000);
							return;
						}
					};
					_self.goodsArr = [];
					$('.shadeboxseckill').show();
					$('.pop_goods').show();
					_self.addLinkGoods(_self.skuCatId,0);
				}
			}else {
                $.Huimodalalert("标题、活动时间不能为空", 2000);
			}
		});
		//点击确认添加商品按钮
		$('.pop_goods_submit').on('click',function(){					
			var nocrossgoods = $('#nocross').find('tr');
			var crossgoods = $('#cross').find('tr');
			//查找选中未参加活动商品
			for(var i = 1 ; i < nocrossgoods.length ; i++){
				if($(nocrossgoods[i]).find('input').is(":checked")){
					_self.goodsArr.push(_self.ARRGOODS[i-1])
				}
			}
			//查找选中参加活动商品
			for(var i = 1 ; i < crossgoods.length ; i++){
				if($(crossgoods[i]).find('input').is(":checked")){
					_self.goodsArr.push(_self.ARRGOODS[i-1])
				}
			}			
			//将选中的商品添加在页面上
			for(var i = 0;i<_self.goodsArr.length;i++){
				var Tr = $('<tr itemId = '+ _self.goodsArr[i].itemId+ '>'+
                    '<td><input class="attendtips" type="checkbox" name="" value="" /></td>'+
                    '<td><img src='+_self.goodsArr[i].skuThumb+'/></td>'+
                    '<td>'+_self.goodsArr[i].skuName+'</td>'+
                    '<td>¥'+_self.goodsArr[i].clientPrice+'</td>'+
                    '<td>¥'+_self.goodsArr[i].marketPrice+'</td>'+
                    '<td style="color: #0000FF;" class="activeprice">¥<input style="color:#0000FF" type="text" name="" id="" value='+_self.goodsArr[i].activityPrice+' />元</td>'+
                    '<td>¥<input type="text" />元</td>'+
                    '<td><input type="text" style="width: 50px;"/>件</td>'+
                    '<td><input type="text" style="width: 50px;"/>件</td>'+
                    '<td><input type="text" />%</td>'+
                    '<td class="se_delete">删除</td>'+
                    '</tr>')						
				$('.addcheckgoods').append(Tr)				 
			}
			//判断页面上已经选中的商品有多少
			_self.havegoods();
			//将所有选中的商品让其未选中状态		
			var nocrossgoods = $('#nocross').find('tr');
			var crossgoods = $('#cross').find('tr');
			//查找选中未参加活动商品
			for(var i = 0 ; i < nocrossgoods.length ; i++){
				$(nocrossgoods[i]).find('input').prop('checked',false)
			}
			//查找选中参加活动商品
			for(var i = 0 ; i < crossgoods.length ; i++){
				$(crossgoods[i]).find('input').prop('checked',false)
			}
			//让未参与其他活动商品单选框选中
			$('.isattend').eq(0).find('input').prop("checked",true);
			//让未参与其他活动的商品列表显示
			$('#nocross').show();
			$('#cross').hide();
			$('.shadeboxseckill').hide();
			$('.pop_goods').hide();
		});
		//弹窗XX关闭按钮
		$('.close_btn').on('click',function () {
			$('.shadeboxseckill').hide();
			$('.pop_goods').hide()			
		});
		//点击商品弹窗取消
		$('.pop_cancel').on('click',function () {
			$('.shadeboxseckill').hide();
			$('.pop_goods').hide()	
		});
		//在交叉与非交叉时间的提示弹窗
		$('.fix_tips_btn').on('click','span:nth-child(1)',function(){
			//取消							
			$('.fix_tips').hide();
			$('.shadeboxseckill').css('zIndex',300);			
			$('#cross').find('.attendtips').eq(_self.attendtipsindex).prop("checked",false);
		}).on('click','span:nth-child(2)',function(){
			//确定
			if(_self.flag){
                $('#cross').find('.attendtips').eq(_self.attendtipsindex).prop("checked",false);
                var str =  '';
                for (var i = 0 ; i < _self.Cross.length ; i++ ){
                    str+= '<p style="color: red">'+(_self.Cross[i].theme)+'</p>'
                }
                //如果选择在交叉时间参与活动
                $('.shadeboxseckill').css('zIndex',1000);
                $('.cross').show();
                $('.nocross').hide()
                $('.fix_tips_content').find('.cross').find('div').html(str)
                $('.fix_tips').show();
                _self.flag = false;
			}else {
                $('#cross').find('.attendtips').eq(_self.attendtipsindex).prop("checked",true);
                $('.fix_tips').hide();
                $('.shadeboxseckill').css('zIndex',300);
            }
		});
		//点击交叉与非交叉关闭按钮
		$('.fix_tips_close').find('a').on('click',function(){
			$('.fix_tips').hide();
			$('.shadeboxseckill').css('zIndex',300);
			$('#cross').find('.attendtips').eq(_self.attendtipsindex).prop("checked",false);
		});
		//选择添加活动的商品
		$('.table_list').on('click','.attendtips',function(){			
			var flag = $(this).is(':checked')	//判断是否是选中  来决定全选按钮是否被选中		
			if(flag){
				//判断正在参与别的活动的按钮是否选中
				var ass = $('.isattend').eq(1).find('input').is(":checked");				
				if(ass){
					_self.attendtipsindex = $(this).parent().parent().index()	
					//如果正在参加别的活动的商品
						//如果选择在交时间件参与活动
					//console.log(_self.crossgoods)
					var index = $(this).parents('tr').index() - 1
                    _self.noCross = [];
                    _self.Cross = [];
                    var freeStart = $('#freeStart').val();
                    var freeEnd = $('#freeEnd').val();
					for (var i = 0 ; i < _self.crossgoods[index].length;i++){
						var beginTime = _self.crossgoods[index][i].beginTime;
                        var endTime = _self.crossgoods[index][i].endTime;
						if((new Date(beginTime).getTime() >= new Date(freeEnd).getTime()) ||
							new Date(endTime).getTime() <= new Date(freeStart).getTime()){
                            _self.noCross.push(_self.crossgoods[index][i]);
						}else {
                            _self.Cross.push(_self.crossgoods[index][i]);
						}
					}				
					if(_self.Cross.length ==0 && _self.noCross.length !=0){
						var str =  '';
						for (var i = 0 ; i < _self.noCross.length ; i++ ){
                            str+= ' <span style="color: red">'+( _self.noCross[i].theme )+'</span> '
						}
						$('.shadeboxseckill').css('zIndex',1000);
						$('.cross').hide();
						$('.nocross').show()
						$('.fix_tips_content').find('.nocross').html('该商品在非交叉时间内已参与'+str+'活动，是否还参与秒杀活动？')
						$('.fix_tips').show();
						_self.flag = false;
					}else if(_self.Cross.length !=0 && _self.noCross.length ==0){
                        var str =  '';
                        //console.log(_self.noCross)
                        for (var i = 0 ; i < _self.Cross.length ; i++ ){
                            str+= '<p style="color: red">'+(_self.Cross[i].theme)+'</p>'
                        }
						//如果选择在交叉时间参与活动
						$('.shadeboxseckill').css('zIndex',1000);
						$('.cross').show();
						$('.nocross').hide()
                        $('.fix_tips_content').find('.cross').find('div').html(str)
						$('.fix_tips').show();
                        _self.flag = false;
					}else{
						var str =  '';
					
                        for (var i = 0 ; i < _self.noCross.length ; i++ ){
                            str+= ' <span style="color: red">'+( _self.noCross[i].theme )+'</span> '
						}
						
                        $('.shadeboxseckill').css('zIndex',1000);
                        $('.cross').hide();
                        $('.nocross').show()
                        $('.fix_tips_content').find('.nocross').html('该商品在非交叉时间内已参与'+str+'活动，是否还参与秒杀活动？')
                        $('.fix_tips').show();
                        _self.flag = true;
					}
				}							
			}else{
				var checktbn = $(this).parent().parent().parent().parent().find('tr').eq(0).find('input');
				$(checktbn).prop('checked',false)
			}
		});
		//删除选在页面上面商品
		$('#GOODSLIST').on('click','.se_delete',function(){
			$(this).parent().remove();
			_self.havegoods();
		});
		//批量删除选在页面上面商品
		$('.batchdelete').on('click',function(){
			_self.selectegoods();
			var GOODSLIST = $('#GOODSLIST').find('tr');			
			for(var i = 0 ; i <_self.selecdgoodsarr.length;i++){
				for(var j = 1 ; j < GOODSLIST.length;j++){										
					if($(GOODSLIST[j]).attr('selectindex') == _self.selecdgoodsarr[i]){						
						$(GOODSLIST[j]).remove();
					}
				}
			}
			_self.havegoods();
		});
		//选中输入框
		$('#GOODSLIST').find('input[type=text]').on('focus',function(){
			$(this).css('border','1px solid #0000FF')
		})
		$('#GOODSLIST').find('input[type=text]').on('blur',function(){
			$(this).css('border','1px solid #ddd')
		})
		//查询
		$('.pop_check').on('click',function () {
			_self.addLinkGoods(_self.skuCatId,0)
        })
		//保存
		$('.keepBtn').on('click',function(){
			_self.keepAddGoods()
		})
	},
	//获取activityId
	getActivityId:function(){
		var locationArr = location.href.split('=');
		if(locationArr.length >1){
            this.activityId = locationArr[locationArr.length-1];
		}else{
            this.activityId='';
		}
	},
	goodsPopShow:function(){
		var self = this;
		$.get(base + 'goodsAdmin/selectAllCategory.do',{parentId:0},function (res) {
			if (res.status == 0) {
				self.goodsMenu = res.data;
				self.treeList(self.goodsMenu,1);				
			}//请求结果
		})//请求开始	
	},
	//判断页面上选中的商品的数量来决定哪一个添加商品按钮显示隐藏
	havegoods:function(){
		var GOODSLIST = $('#GOODSLIST').find('tr');
		if(GOODSLIST.length>1){
			$('.addBtn').find('.addgoodsbtn').hide();//隐藏下面添加商品按钮
			$('.addBtn').find('div').show();//显示确认保存和取消选中的按钮
			$('.operation').show();//显示上面添加商品和批量删除按钮
		}else{
			$('.addBtn').find('.addgoodsbtn').show();
			$('.addBtn').find('div').hide();
			$('.operation').hide();
			$('.checkall').prop('checked',false);//删掉了所有的选中的商品后让全选按钮未选中状态
		}
	},
	//页面上选种的商品索引集合
	selectegoods:function(){
		var _self = this;
		var GOODSLIST = $('#GOODSLIST').find('tr');
		_self.selecdgoodsarr=[];
		for(var i = 0 ; i < GOODSLIST.length;i++){
			$(GOODSLIST[i]).attr('selectindex',i);
			if($(GOODSLIST[i]).find('input').is(':checked')){
				_self.selecdgoodsarr.push(i)
			}
		}
	},
	//获取新增商品列表
    getAddGoods:function(){
		var _self = this;
        _self.getActivityId();//获取activityId      
        var re = /^\d+$/;
		if(re.test(_self.activityId)){
            $.get(base+'seckill/activity/'+this.activityId,function(res){

				$('#actTitle').val(res.data.theme)
				$('#freeStart').val(res.data.beginTime);
				$('#freeEnd').val(res.data.endTime);
				$('#extendInfo').val(res.data.memo)
				//商品列表
				if(res.data && res.data.freeProductInfos){					
                    $('#GOODSLIST').find('tr').not($('#GOODSLIST').find('tr').eq(0)).remove();                 
                    if(res.data.freeProductInfos.length){
						for(var i = 0 ; i < res.data.freeProductInfos.length ; i++){
                        	var Tr = $('<tr itemId = '+ res.data.freeProductInfos[i].itemId +' ruleId = '+ res.data.freeProductInfos[i].ruleId+'>'+
                            '<td><input class="attendtips" type="checkbox" name="" value="" /></td>'+
                            '<td><img src='+res.data.freeProductInfos[i].skuThumb+'/></td>'+
                            '<td>'+res.data.freeProductInfos[i].skuName+'</td>'+
                            '<td>¥'+res.data.freeProductInfos[i].shopPrice+'</td>'+
                            '<td>¥'+res.data.freeProductInfos[i].marketPrice+'</td>'+
                            '<td style="color: #0000FF;" class="activeprice">¥<input style="color:#0000FF" type="text" name="" id="" value='+res.data.freeProductInfos[i].activityPrice+'>元</td>'+
                            '<td>¥<input type="text" value='+res.data.freeProductInfos[i].seckillPrice+ '>元</td>'+
                            '<td><input type="text" style="width: 50px;" value='+res.data.freeProductInfos[i].perLimitCount+ '>件</td>'+
                            '<td><input type="text" style="width: 50px;" value='+res.data.freeProductInfos[i].totalCount+ '>件</td>'+
                            '<td><input type="text"  value='+res.data.freeProductInfos[i].saleProgress+ '>%</td>'+
                            '<td class="se_delete">删除</td>'+
                            '</tr>')
							$('#GOODSLIST').append(Tr);
						}
                        _self.havegoods();
                    }
				}
				//规则
				if(res.data && res.data.freeinterestActivityRules){
					if(res.data.freeinterestActivityRules.length){
						var discountnum = $('.discount-num')
						for (var i = 0 ;i < res.data.freeinterestActivityRules.length; i++){
                            $('.discount-num').eq(i).val(JSON.parse(res.data.freeinterestActivityRules[i].itemValue).discount)
						}
					}
				}
            })
		}else {

		}
	},
	treeList:function (obj) {
		var self = this;
		/*递归实现获取无级树数据并生成DOM结构*/
		var str = "";
		var forTree = function(o,num){
		 	for(var i=0;i<o.length;i++){
		   		 var urlstr = "";
				 try{	
				 		if (o[i]["hdGoodsCategory"].length) {
				 			urlstr = "<div><span class='tree_span"+num+"' catId='"+o[i]["id"]+"'><b>[+]</b>"+ o[i]["name"] +"</span><ul>";
				 		} else {
				 			urlstr = "<div><span class='tree_span"+num+"' catId='"+o[i]["id"]+"'><img src='../../images/sub.gif'/>"+ o[i]["name"] +"</span><ul>";
				 		}
				 			 				
		 			str += urlstr;
		 			if(o[i]["hdGoodsCategory"] != null){
		 				forTree(o[i]["hdGoodsCategory"],num+1);
		 			}
		   		 str += "</ul></div>";
		 		}catch(e){}
		 }
		 return str;
		}
		/*添加无级树*/
		document.getElementById("menuTree").innerHTML = forTree(obj,1);

		/*树形菜单*/
		var menuTree = function(){
		 //给有子对象的元素加
			 $("#menuTree ul").each(function(index, element) {
		 		var ulContent = $(element).html();
		 		var spanContent = $(element).siblings("span").html();
		 		if(ulContent){
					 $(element).siblings("span").html(spanContent) 
		 		}
			 });
	
			 $("#menuTree").find("div span").click(function(){
			 	var _self = this;
			 	 var ul = $(this).siblings("ul");
				 var spanStr = $(this).text();
				 $(this).addClass('choose')
				 $(this).parents('div').siblings('div').removeClass('choose').find('span').removeClass('choose')
				 
				 if(ul.find("div").html() != null){
					 if(ul.css("display") == "none"){
						 ul.show(300);
						 $(this).find('b').html("[-]");
			 		 }else{
			 			ul.hide(300);
			 			 $(this).find('b').html("[+]");
			 		 }
			 	}
			 	var data = {};
				data['catId'] = $(this).attr('catId');
				self.addLinkGoods($(this).attr('catId'),0)
			 })
		}()

		/*树形列表展开*/
		$("#btn_open").click(function(){
			$("#menuTree ul").show(300);
		 	curzt("-");
		})
		/*收缩*/
		$("#btn_close").click(function(){
		 	$("#menuTree ul").hide(300);
		 	curzt("+");
		})
		function curzt(v){
		 $("#menuTree span").each(function(index, element) {
			 var ul = $(this).siblings("ul");
			 var spanStr = $(this).html();
			 var spanContent = spanStr.substr(3,spanStr.length);
			 if(ul.find("div").html() != null){
		 		$(this).html("["+ v +"] " + spanContent);
		 	 }
		 }); 
		}
	},
	//点击弹窗出来的添加确定按钮
	addLinkGoods: function (skuCatId,obj) {
		var self = this;
		var data = {},
        $wrap = $('#pageSearchForm');
		data['skuCatId'] = skuCatId;
		data['skuKeyword'] = $wrap.find('#keyword').val();
        data['skuStatus'] = $('#popstatus').val();
        data['joinActivity'] = !$wrap.find('.isattend').eq(0).find('input').is(":checked");
		data.pageNum = (obj && obj.curr) || 1 // 默认第1页
		data.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
		$.get(base + 'seckill/sku',data,function (res) {
			console.log(res)
			self.ARRGOODS = [];
			self.ARRGOODS = res.data;
			if (res.status == 0) {
                $('#nocross tr').not($('#nocross tr').eq(0)).remove();
                $('#cross tr').not($('#cross tr').eq(0)).remove();
                $('.shadeboxseckill').css('height',0);
                self.crossgoods = [];
				if (res.data.length) {
                	for (var i = 0 ; i < res.data.length ; i++ ){
                		if(res.data[i].skuStatus == -1){
							var Str = "删除"
						}else if(res.data[i].skuStatus == 1){
							var Str = "已上架"
						}else{
                            var Str = "已下架"
						}
						if($wrap.find('.isattend').eq(0).find('input').is(":checked")){
                            var Tr = $('<tr>'+
								'<td><input class="attendtips" type="checkbox" name=""  value="" /></td>'+
								'<td>'+res.data[i].sn+'</td>'+
                                '<td><img src=imgPath'+res.data[i].skuThumb+'/></td>'+
                                '<td>'+res.data[i].skuName+'</td>'+
                                '<td>¥'+res.data[i].marketPrice+'</td>'+
                                '<td>'+res.data[i].skuCategoryName+'</td>'+
                                '<td>'+Str+'</td>'+
                                '<td>'+res.data[i].skuCreateTime+'</td>'+
                                '<td>'+res.data[i].skuNumber+'</td>'+
                                '</tr>')
                            $('#nocross').append(Tr);
						}else{
							var StrActive = '';
                            self.crossgoods.push(res.data[i].activityList);
							for (var j = 0 ; j < res.data[i].activityList.length;j++){
                                StrActive+=('<p>'+res.data[i].activityList[j].theme+'</p>')
							}
                            var Tr = $('<tr>'+
								'<td><input class="attendtips" type="checkbox" name=""  value="" /></td>'+
								'<td>'+res.data[i].sn+'</td>'+
                                '<td><img src=imgPath'+res.data[i].skuThumb+'/></td>'+
                                '<td>'+res.data[i].skuName+'</td>'+
                                '<td>¥'+res.data[i].marketPrice+'</td>'+
                                '<td>'+res.data[i].skuCategoryName+'</td>'+
                                '<td>'+StrActive+'</td>'+
                                '<td>'+Str+'</td>'+
                                '<td>'+res.data[i].skuCreateTime+'</td>'+
                                '<td>'+res.data[i].skuNumber+'</td>'+
                                '</tr>')
                            $('#cross').append(Tr);
						}
					}
					$('.shadeboxseckill').css('height',$(document).height());
				} else {
					$.Huimodalalert("查询不到数据", 2000);
				}
				//设置分页
				setPagination({
					elem: $('#pop_pagination'),
					totalCount: res.dataCount,
					curr: data.pageNum,
					callback: function (obj) {
						self.addLinkGoods(self.searchId,obj);
					}
				});
			} else {
				$.Huimodalalert(res.message, 2000);
			}
		})
	},
	//保存按钮
    keepAddGoods:function () {
		var Title = $('#actTitle').val();
		var begin = $('#freeStart').val();
		var end = $('#freeEnd').val();
		var rulesArr = $('.count-wrap')
		var rulesFlag = true;
		for(var i = 0 ; i < rulesArr.length ; i++){
			if($(rulesArr[i]).find('input').val() != 10){
				rulesFlag = false;	
			}				
		}	
		if( Title && begin && end){
			if(Title.length > 30 ){
				$.Huimodalalert("标题长度不能长于30个字符", 2000);
				return ;
			}else{
				if(!rulesFlag){
					if(!$('#extendInfo').val()){
						$.Huimodalalert("请确认免息标签", 1000);
						return;
					}
				};				
			}
		}else {
			$.Huimodalalert("标题、活动时间不能为空", 2000);
			return;
		}
		var _self = this;		
    	var data = {
    		"theme":$('#actTitle').val(),
            "beginTime":$('#freeStart').val(),
            "endTime":$('#freeEnd').val(),
            "memo":$('#extendInfo').val(),
            "freeinterestActivityRules":[],
            "freeProductInfos":[],
		}		
        //规则
		var countwraparr = $('.count-wrap');
		for(var i = 0 ; i < countwraparr.length ; i++){
            data.freeinterestActivityRules.push({
				'itemId':$(countwraparr[i]).find('span').html(),
				'itemValue': JSON.stringify({"discount":$(countwraparr[i]).find("input").val()}),
            })
		}
		//添加新增的商品
		var addGoods = $('#GOODSLIST').find('tr');

		if(_self.activityId){
            for(var i = 1 ; i < addGoods.length ; i++){
                if(!$(addGoods[i]).find('td').eq(5).find('input').val() ||
                    !$(addGoods[i]).find('td').eq(6).find('input').val()||
                    !$(addGoods[i]).find('td').eq(8).find('input').val()
                ){
                    $.Huimodalalert("请将价格、数量填写完整", 2000);
                    return ;
                }else {
                    if(!$(addGoods[i]).find('td').eq(9).find('input').val()){
                        data.freeProductInfos.push({
                            'itemId':$(addGoods[i]).attr('itemId'),
                            'itemValue':JSON.stringify({
                                'activityPrice':$(addGoods[i]).find('td').eq(5).find('input').val(),
                                'seckillPrice':$(addGoods[i]).find('td').eq(6).find('input').val(),
                                'perLimitCount':$(addGoods[i]).find('td').eq(7).find('input').val() || null,
                                'totalCount':$(addGoods[i]).find('td').eq(8).find('input').val() || 0,
                            }),
                            'ruleId':$(addGoods[i]).attr('ruleId') || ''
                        })
                    }else {
                        data.freeProductInfos.push({
                            'itemId':$(addGoods[i]).attr('itemId'),
                            'itemValue':JSON.stringify({
                                'activityPrice':$(addGoods[i]).find('td').eq(5).find('input').val(),
                                'seckillPrice':$(addGoods[i]).find('td').eq(6).find('input').val(),
                                'perLimitCount':$(addGoods[i]).find('td').eq(7).find('input').val() || null,
                                'totalCount':$(addGoods[i]).find('td').eq(8).find('input').val() || 0,
                                'saleProgress':$(addGoods[i]).find('td').eq(9).find('input').val()
                            }),
                            'ruleId':$(addGoods[i]).attr('ruleId') || ''
                        })
                    }
                }
            }
            $.ajax({
                type: 'PUT',
                url: base + 'seckill/activity/'+_self.activityId ,
                data:JSON.stringify(data),
                contentType: "application/json",
                success: function(res){
                    if(res.status){
                    	$.Huimodalalert("保存成功", 1000);
                    	setTimeout(function(){
                    		_self.getAddGoods();
                    	},1500)
                    }
                },
                dataType: 'json'
            });
		}else {
            for(var i = 1 ; i < addGoods.length ; i++){
                if(!$(addGoods[i]).find('td').eq(5).find('input').val() ||
                    !$(addGoods[i]).find('td').eq(6).find('input').val()||
                    !$(addGoods[i]).find('td').eq(8).find('input').val()
                ){
                    $.Huimodalalert("请将价格、数量填写完整", 2000);
                    return ;
                }else {
                    if(!$(addGoods[i]).find('td').eq(9).find('input').val()){
                        data.freeProductInfos.push({
                            'itemId':$(addGoods[i]).attr('itemId'),
                            'itemValue':JSON.stringify({
                                'activityPrice':$(addGoods[i]).find('td').eq(5).find('input').val(),
                                'seckillPrice':$(addGoods[i]).find('td').eq(6).find('input').val(),
                                'perLimitCount':$(addGoods[i]).find('td').eq(7).find('input').val() || null,
                                'totalCount':$(addGoods[i]).find('td').eq(8).find('input').val() || 0,
                                /*'saleCount':0,*/
                            }),
                            'ruleId':$(addGoods[i]).attr('ruleId') || ''
                        })
                    }else {
                        data.freeProductInfos.push({
                            'itemId':$(addGoods[i]).attr('itemId'),
                            'itemValue':JSON.stringify({
                                'activityPrice':$(addGoods[i]).find('td').eq(5).find('input').val(),
                                'seckillPrice':$(addGoods[i]).find('td').eq(6).find('input').val(),
                                'perLimitCount':$(addGoods[i]).find('td').eq(7).find('input').val() || null,
                                'totalCount':$(addGoods[i]).find('td').eq(8).find('input').val() || 0,
                                'saleProgress':$(addGoods[i]).find('td').eq(9).find('input').val(),
								/*'saleCount':0,*/
                            }),
                            'ruleId':$(addGoods[i]).attr('ruleId') || ''
                        })
                    }
                }
            }
            $.ajax({
                type: 'POST',
                url:base +  'seckill/activity/',
                data:JSON.stringify(data),
                contentType: "application/json",
                success: function(res){
					if(res.status){
						$.Huimodalalert("保存成功", 1000);
						setTimeout(function(){
							location.href = 'seckillList.html';
						},1000)
                        
					}
                },
                dataType: 'json'
            });
		}
    },
}
seckill.init()
