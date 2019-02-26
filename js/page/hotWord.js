var hotWord = {
	init: function () {
		this.times = null;
		this.isSave = false;
		this.goodsMenu = [];
		this.len = '';
		this.searchId = '';
		this.skuId = [];
		this.skuIdss = [];
		this.bindEvents();
		this.queryList();
		$.Huifold("#Huifold1 .item h4","#Huifold1 .item .info","fast",1,"click");
		$.Huifold("#Huifold2 .item2 h4","#Huifold2 .item2 .info","fast",1,"click");
	}
	
	,bindEvents: function () {
		var self = this;
		//点击保存
		$('#save').on('click',function (ev) {
			self.saveHotWord()
		})
		
		//双击热搜词修改
		$('.table_list').on('dblclick','.hot_word_change',function (ev) {
			clearTimeout(this.times);
			console.log(2);
			self.dblHotWord(this)
		})
		//双击热搜词修改
		$('.table_list').on('click','.hot_word_change',function (ev) {
			clearTimeout(this.times);
			this.times=setTimeout(function(){
				console.log(1)
				return false;
			},300);
			return false;
		})
		//点击输入框外保存修改
		$('body').on('click',function (ev) {
			self.changeHotWord()
		})
		//点击添加链接
		$('.table_list').on('click','.addLink',function (ev) {
			self.modaldemo(this)
		})
		//点击添加链接xx
		$('.close, .add_link_btn').on('click',function () {
			$('.mark_pop').hide();
		})
		//点击停用启用
		$('.table_list').on('click','.isUse',function (ev) {
			self.modaldemo(this)
		})
		//点击删除热搜词
		$('.table_list').on('click','.delect',function (ev) {
			self.modaldemo(this)
		})
		//点击对话弹窗确定
		$('.pop_sure').on('click',function (ev) {
			self.talkSureBtn(this)
		})
		
		//点击添加商品
		$('.table_list').on('click','.addGoods',function (ev) {
			self.goodsPopShow(this,'addGoods')
		})
		//点击商品弹窗取消
		$('.pop_cancel').on('click',function () {
			$('.pop_goods').hide()
			$('.mark_pop').hide();
		})
		//点击查看商品
		$('.table_list').on('click','.checkGoods',function (ev) {
			self.checkLinkGoods(this)
			
		})
		//弹窗XX关闭按钮
		$('.close_btn').on('click',function () {
			$('.check_goods').hide();
			$('.pop_goods').hide()
			$('.mark_pop').hide();
		})
		//关联商品弹窗选择商品
		$('#link_goods').on('change','input',function () {
			self.chooseGoods(this)
		})
		//点击全部
		$('#all').on('click',function () {
			self.clickAll()
		})
		//点击查看商品确认
		$('.check_sure').on('click',function () {
			$('.check_goods').hide()
			$('.mark_pop').hide();
		})
		//点击查询
		$('.pop_check').on('click',function () {
			self.popCheckFn()
		})
		//点击添加商品确认
		$('.pop_goods_submit').on('click',function (ev) {
			self.addGoodsToHot()
		})
		//点击弹窗菜单
		$('.menuTree span').on('click',function (ev) {
			self.clickMenu(this)
		})
	}
	//保存热搜词
	,saveHotWord: function () {
		var self = this;
		var searchName = $('#hot_word_inp').val();
		$.post(base + 'hotSearch/saveHotSearchData.do',{searchName:searchName},function (res) {
			if (res.status == 0) {
				$('#hot_word_inp').val('')
				$.Huimodalalert("热搜词保存成功", 2000);
				self.queryList();
			} else {
				$.Huimodalalert(res.message, 2000);
			}
		})
	}
	//双击热搜词
	,dblHotWord: function (el) {
		this.isSave = true;
		$(el).attr('readonly',false)
		$(el).css('border','1px solid gainsboro')
	}
	//修改热搜词
	,changeHotWord: function () {
		if (this.isSave) {
			var data = {}
			data['searchName'] = $('.hot_word_change').val();
			data['searchId'] = $('.hot_word_change').attr('searchId')
			$.post(base + 'hotSearch/updateHotSearchData.do',data,function (res) {
				if (res.status == 0) {
					$.Huimodalalert("热搜词修改成功", 2000);
				} else {
					$.Huimodalalert(res.message, 2000);
				}
			})
		$('.hot_word_change').attr('readonly',true);
		$('.hot_word_change').css('border','none');
		this.isSave = false;
		}
		
	}
	//加载热搜词列表
	,queryList: function (obj) {
		var self = this;
		var detParam={}
		detParam.pageNum = (obj && obj.curr) || 1 // 默认第1页
        detParam.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
		$.post(base + 'hotSearch/getHotSearchData.do',detParam,function (res) {
			if (res.status == 0) {
				$(".table_list").empty().append($('#hotWordList').tmpl(res.data));
				
				//设置分页
				setPagination({
			       elem: $('#pagination'),
			       totalCount: res.dataCount,
			       curr: detParam.pageNum,
				   callback: function (obj) {
				   			$(".table_list").empty()
	                        self.queryList(obj);
	                    }
			   });
			}
			
			
		})
	}
	//对话弹窗显示
	,modaldemo: function (el){
		var searchId = $(el).closest('li').attr('searchId')
		var btnType = $(el).attr('btnType')
		if (btnType == 'addLink') {
			var isGray = $(el).attr('isGray');
			var linkUrl = $(el).attr('linkUrl');
			if (isGray) {
				$.Huimodalalert("您已为该词关联商品，不能再添加链接", 2000);
				return;
			}
			$('.modal-title').text('添加链接');
			$('.add_link').html('添加链接<input type="text" value="'+ linkUrl +'" />');
		} else if (btnType == 'isUse') {
			var btnTxt = $(el).text()
			$('.modal-title').text(btnTxt+'热搜词');
			$('.add_link').html('确定'+btnTxt+'本条热搜词？');
			if (btnTxt == '启用') {
				$('.pop_sure').attr('status',0)
			} else{
				$('.pop_sure').attr('status',1)
			}
		} else{
			$('.modal-title').text('删除热搜词');
			$('.add_link').html('确定删除热搜词？');
		}
		$('.pop_sure').attr('btnType',btnType)
		$('.pop_sure').attr('searchId',searchId)
		$('.mark_pop').show();
		$("#modal-demo").modal("show")
	}
	//点击对话弹窗确定
	,talkSureBtn: function (el) {
		var self = this;
		var data = {};
		var btnType = $(el).attr('btnType');
		var searchId = $(el).attr('searchId');
		data['searchId'] = searchId;
		
		if (btnType == 'delect') {
			$.post(base + 'hotSearch/deleteHotSearchData.do',data,function (res) {
				if (res.status == 0) {
					$.Huimodalalert('热搜词已删除', 2000);
					$("#modal-demo").modal("hide")
					$('.mark_pop').hide();
					self.queryList()
				}
			})
		} else{
			if (btnType == 'addLink') {
				var linkUrl = $('.add_link input').val();
				if (!linkUrl) {
					$.Huimodalalert("请输入链接", 2000);
					return;
				}
				
				data['linkUrl'] = linkUrl;
			} else if (btnType == 'isUse') {
				var status = $(el).attr('status');
				data['status'] = status;
			}
			
			$.post(base + 'hotSearch/updateHotSearchData.do',data,function (res) {
				if (res.status == 0) {
					$.Huimodalalert(res.message, 2000);
					$("#modal-demo").modal("hide")
					$('.mark_pop').hide();
					self.queryList()
				} else {
					$.Huimodalalert(res.message, 2000);
				}
			})
		}
		
		
	}
	//点击添加商品
	,goodsPopShow: function (el,type) {
		var self = this;
		localStorage.removeItem('skuIds')
		var skuIds = $(el).attr('skuIds');
		if (skuIds) {
			skuIds = skuIds.split(',');
			localStorage.setItem('skuIds',skuIds)
			this.len = skuIds.length;
		}
		
		var isGray = $(el).attr('isGray');
		if (isGray) {
			$.Huimodalalert("您已为该词添加链家，不能再添加商品", 2000);
			return;
		}
		var searchId = $(el).closest('li').attr('searchId');
		self.searchId = searchId;
		$('.pop_goods_submit').attr('searchId',searchId)
			var data = {};
			//查询左侧分类列表
		$.get(base + 'goodsAdmin/selectAllCategory.do',{parentId:0},function (res) {
			if (res.status == 0) {
				self.goodsMenu = res.data;
				self.treeList(self.goodsMenu,1);
				self.addLinkGoods(searchId,data,0)
			}//请求结果
		})//请求开始
		
		var height = $(window).height()
		$('.mark_pop').css('height',height)
		$('.mark_pop').show();
		$('.pop_goods').show()
	}
	//选择关联商品
	,chooseGoods: function (el) {
		var skuId = $(el).attr('skuId');
		if ($(el).context.checked === true) {
			var skuIds = localStorage.getItem('skuIds');
			if (skuIds) {
				skuIds = skuIds.split(',')
				var flag = false;
				for (var i=0;i<skuIds.length;i++) {
					if (skuIds[i] != skuId) {
						flag = true;
					} else {
						flag = false;
						return false;
					}
				}
				if (flag) {
					skuIds.push(skuId)
				}
				localStorage.setItem('skuIds',skuIds)
			} else {
				var skuIds = [];
				skuIds.push(skuId)
				localStorage.setItem('skuIds',skuIds)
			}
		} else {
			var skuIds = localStorage.getItem('skuIds');
			if (skuIds) {
				skuIds = skuIds.split(',')
				for (var i=0;i<skuIds.length;i++) {
					if (skuIds[i] == skuId) {
						skuIds.splice(i,1)
						console.log(skuIds)
						localStorage.setItem('skuIds',skuIds)
					}
				}
			}
			
		}
	}
	//点击全部
	,clickAll: function () {
		var checkBoxs = $('.link_goods input[type=checkbox]');
		if ($('#all').is(':checked')){
			checkBoxs.prop('checked','checked');
			var skuIds = localStorage.getItem('skuIds');
			skuIds = skuIds.split(',')
			for (var i=0;i<this.skuIdss.length;i++) {
				skuIds.push(this.skuIdss[i])
			}
			console.log("111:" + skuIds);
			console.log(skuIds.length);
			//已选择商品suiIds去重
			var skuIdsObj = {}
			var newSkuIds = [];
			for (var i = 0; i < skuIds.length; i++) {
				if (!skuIdsObj[skuIds[i]]) {
					newSkuIds.push(skuIds[i]);
					skuIdsObj[skuIds[i]] = true;
				}
			}
			skuIds = newSkuIds;
			console.log("去重:" + skuIds);
			console.log(skuIds.length);
			localStorage.setItem('skuIds',skuIds)
		} else {
			checkBoxs.prop('checked','');
			var skuIds = localStorage.getItem('skuIds');
			skuIds = skuIds.split(',')
			for (var i=0;i<skuIds.length;i++) {
				for (var j=0;j<this.skuIdss.length;j++) {
					if (this.skuIdss[j] == skuIds[i]) {
						skuIds.splice(i,1);
						j = -1;
					}
				}
			}
			localStorage.setItem('skuIds',skuIds)
			console.log("删除:" + skuIds);
			console.log(skuIds.length);
		}
	}
	//添加关联商品
	,addLinkGoods: function (seachId,data,obj) {
		var self = this;
		console.log(seachId)
		
		data['searchId'] = seachId
		data.pageNum = (obj && obj.curr) || 1 // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
		
				$.post(base + 'hotSearch/getHotSearchSku.do',data,function (res) {
					if (res.status == 0) {
						$('#all').prop('checked','')
						var strHtml = ""
						if (res.data.length) {
							self.skuIdss = [];
							var className='';
							$.each(res.data, function(i,item) {
								self.skuIdss.push(item.skuId)
								if (i%2 == 0) {
									className = 'li_color';
								} else {
									className='';
								}
								var isChecked = '';
								if (item.isLink == 1) {
									isChecked = "checked"
								}else {
									isChecked = ""
								}
								
								strHtml += '<li class="'+className+'" skuIds="'+item.skuIds+'">' +
												'<input '+ isChecked +' type="checkbox" name="goods" class="isChecked" value="" skuId="'+ item.skuId +'" />' +
												'<img src="'+ imgPath +item.thumb+'"/>' +
												'<span class="link_name">'+item.skuName+'</span>' +
												'<span class="link_price">￥'+item.shopPrice+'</span>' +
												'<span class="link_kind">'+item.categoryName+'</span>' +
												'<span class="link_status">'+item.statusStr+'</span>' +
												'<span class="link_role">'+item.roleStr+'</span>' +
												'<span class="link_time">'+item.createTime+'</span>' +
											'</li>'
							});
							$('#link_goods').empty()
							$(strHtml).appendTo("#link_goods");
							
							if ($('.isChecked:checked').length == res.data.length) {
								$('#all').prop('checked',true)
							}else {
								$('#all').prop('checked',false)
							}
						} else {
							$.Huimodalalert("查询不到数据", 2000);
						}
						console.log(res.dataCount)
					
						//设置分页
						setPagination({
					       elem: $('#pop_pagination'),
					       totalCount: res.dataCount,
					       curr: data.pageNum,
						   callback: function (obj) {
						   			$("#link_goods").empty()
		                            self.addLinkGoods(self.searchId,data,obj);
		                        }
					   });
					
					} else {
						$.Huimodalalert(res.message, 2000);
					}
					
				})
				
			
	}
	//添加商品点击查询
	,popCheckFn: function () {
		var data = {};
		data['skuName'] = $('#keyword').val();
		data['skuStatus'] = $('#popstatus').val();
		this.addLinkGoods(this.searchId,data,0)
		
	}
	//点击确认添加商品关联热词
	,addGoodsToHot: function () {
		var self = this;
		var skuIds = localStorage.getItem('skuIds');
		if (!skuIds) {
			$.Huimodalalert("请选择关联商品", 2000);
			return false;
		}
//		var skuId = $('#link_goods input[name="goods"]:checked').closest('li').attr('skuId');   //单选
		//多选
//		var checkboxs = $('.link_goods input[type=checkbox]:checked');
//		if (checkboxs.length) {
//			
//			checkboxs.each(function (index,item) {
//				var skuId = $(item).closest('li').attr('skuId')
//				skuIds.push(skuId)
//			})
//		} else{
//			$.Huimodalalert("请选择关联商品", 2000);
//		}
//		skuIds = skuIds.join(',')
		
		var searchId = $('.pop_goods_submit').attr('searchId');
		var data = {};
		data['searchId'] = searchId;
		data['skuIds'] = skuIds;
		$.post(base + 'hotSearch/updateHotSearchData.do',data,function (res) {
			if (res.status == 0) {
				$.Huimodalalert("添加关联商品成功", 2000);
				localStorage.removeItem('skuIds')
				$('.pop_goods').hide();
				$('.mark_pop').hide();
				self.queryList();
			}
		})
	}
	//点击查看商品
	,checkLinkGoods: function (el,obj) {
		var data = {};
		var linkurl = $(el).siblings('.addLink').attr('linkurl');
		if (linkurl && linkurl.indexOf('skuId') != -1) {
			var skuId = linkurl.split('?')[1].split('&')[0].split('=')[1];
			data['skuIds'] = skuId;
		} else {
			data['skuIds'] = $(el).closest('li').attr('skuIds');
		}
		data.pageNum = (obj && obj.curr) || 1 // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
		$.post(base + 'goodsAdmin/getDataBySkuIds',data,function (res) {
			if (res.status == 0) {
				
				var strHtml = '';
				$.each(res.data, function(i,item) {
					strHtml += '<li>' +
					'<span class="dis_none"></span>' +
						'<img src="'+imgPath+item.thumb+'"/>' +
						'<span class="check_link_name">'+item.skuName+'</span>' +
						'<span class="check_link_price">￥'+item.shopPrice+'</span>' +
						'<span class="check_link_kind">'+item.categoryName+'</span>' +
						'<span class="check_link_status">'+item.statusStr+'</span>' +
						'<span class="check_link_role">'+item.roleStr+'</span>'
						'<span class="check_link_time">'+item.createTime+'</span>' +
					'</li>'
				});
				
				
				$('#check_link_goods').empty();
				$(strHtml).appendTo("#check_link_goods");
				
				//设置分页
				setPagination({
			       elem: $('#pagination'),
			       totalCount: res.dataCount,
			       curr: data.pageNum,
				   callback: function (obj) {
				   			$("#check_link_goods").empty()
                            self.checkLinkGoods(data,obj);
                        }
			   });
				
				
				$('.mark_pop').show();
				$('.check_goods').show()
			}
			
			
		})
		
	}
	//点击选择菜单
//	,clickMenu: function (el) {
//		$(el).addClass('choose')
//	}
	//树形列表
	,treeList:function (obj) {
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
				data['catId'] = $(this).attr('catId')
				self.addLinkGoods(self.searchId,data,0)
				
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
	}
}
hotWord.init()
