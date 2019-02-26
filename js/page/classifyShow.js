var detParam = {},
	param = {};
var classifyShow = {
	init: function () {
		this.leftOrRight = '';
		this.isEdit = false;
		this.catagoryId = '';
		this.brandId = '';
		this.leftId = '';
		this.rightId = '';
		this.parentId = '';
		this.skuIdss = [];
		this.skuIds = [];
		this.isStore = true;
		this.checkTime = 0;
		this.linkSkuIds = [];
		this.sign = 3;
		this.len = '';
		this.btnType = '';
		this.bindEvents();
		this.search();
		this.upLoadImg()
	}
	,bindEvents: function () {
		var self = this;
		//点击添加
		$('#add').bind('click',function (ev){
			self.showAddPop()
		})
		
		//点击弹窗取消
		$('.cancel').bind('click',function () {
			$('#kind_inp').val('请选择分类');
			$('#brand_inp').val('请选择商品');
			$('.pop_add').hide();
			$('.type-select-panel').hide();
			$('#classify-list').show()
		})
		
		//点击查询
		$('#check').bind('click',function (ev) {
			self.search()
		})
		
		//点击启用
		$('#tableList').on('click','.isUse',function (ev) {
			self.isUse(this)
			
		})
		//点击未选择、已选择、全部
		$('#all-goods,#no-choose,#have-choose').on('change',function () {
			if (self.checkTime > 1) {
				self.isStore = false;
				console.log(self.isStore)
			}
			
		})
		//点击编辑
		$('#tableList').on('click','.edit',function (ev) {
			self.editFn(ev,"edit")
		})
		//点击加号
		$('#tableList').on('click','.add_icon',function (ev) {
			self.editFn(ev,"addImg")
		})
		//点击三角箭头
		$('.glyphicon').on('click',function (ev) {
			self.arrow(ev)
		})
		//点击添加编辑弹窗确定
		$('.submit_btn').bind('click',function (ev) {
			self.addSubmitFn()
		})
		
		//点击选择商品
		$('.choose_goods').bind('click',function (ev) {
			localStorage.removeItem('skuIds');
			self.skuIds = [];
			self.scree();
			$('#all').attr('checked',false);
			self.btnType = $('.submit_btn').attr('btnType');
			$('.pop_add').hide();
			$('.pop_goods').show();
			$("#link_goods").empty();
			$('#pop_pagination').hide();
		})
		
		//点击关联商品查询
		$('.pop_check').bind('click',function (ev) {
			self.scree()
		})
		//pop点击全部
		$('#all').on('click',function (ev) {
			self.allCheckbox(ev)
		})
		//点击多选框选择商品
		$('#link_goods').on('change','input',function () {
			self.chooseGoods(this)
		})
		//关联商品取消
		$('.pop_cancel').bind('click',function (ev) {
			$('#pop_pagination').empty();
			$('.pop_goods').hide();
			$('.pop_add').show();
			
		})
		//关联商品确定
		$('.pop_goods_submit').bind('click',function (ev) {
			self.linkGoods()
		})
		//添加商品弹窗选择分类
		$('.choose_kind').on('click',function (ev) {
			self.chooseKind()
		})
		//添加商品列表弹窗选择分类
		$('.link_kind_btn').on('click',function (ev) {
			self.chooseKind("linkGoods")
		})
		//获取二级分类
		$('.ul-1').on('click','li',function (ev) {
			$('.ul-2, .ul-3, .ul-4').empty()
			$('.choose-kind-4,.choose-kind-2,.choose-kind-3').text('');
			self.getKindTwo(this,2)
		})
		//获取3级分类
		$('.ul-2').on('click','li',function (ev) {
			$('.ul-3, .ul-4').empty()
			$('.choose-kind-3,.choose-kind-4').text('');
			self.getKindTwo(this,3)
		})
		//获取4级分类
		$('.ul-3').on('click','li',function (ev) {
			$('.ul-4').empty();
			$('.choose-kind-4').text('');
			self.getKindTwo(this,4)
		})
		//选择第四级分类
		$('.ul-4').on('click','li',function (ev) {
			self.catagoryId = $(this).attr('parentId');
			var chooseTxt = $(this).text();
			$('.choose-kind-4').text(chooseTxt)
			$(this).addClass('check').siblings('li').removeClass('check')
		})
		//选择分类确定按钮
		$('.get-result').on('click',function (ev) {
			self.getResult(this)
		})
		//选择分类取消按钮
		$('.close-panel').on('click',function () {
			self.catagoryId = '';
			$('.mark_pop').hide();
			$('.type-select-panel').hide();
		})
		//选择品牌
		$('.choose_brand').on('click',function () {
			self.showBrand()
			return false;
		})
		//点击品牌
		$('.name-select-panel').on('click','li',function (ev) {
			self.chooseBrand(this)
			return false
		})
		//阻止事件冒泡
		$('.name-select-panel').on('click',function () {
			return false
		})
		//品牌列表失去焦点
		$('.pop_add').on('click',function () {
			$('.name-select-panel').hide()
		})
		//点击品牌搜索
		$('.name-select-panel i').on('click',function (ev) {
			var brandName = $('.name-select-panel input').val();
			self.showBrand(brandName)
		})
	}
	//点击添加方法
	,showAddPop: function () {
		
		//获取左向菜单虚拟商品分类
		var className = {23:".leftMenuType"}
		$('#pop_left_type').empty();
		util.initSelect(className,'23');
		$('.submit_btn').attr('btnType','addBtn')
		$('#pop_left_name').val('');
		$('#pop_left_sort').val('');
		$('.right_panel').hide()
		$('#classify-list').hide()
		$('.left_img').show()
		$('.submit_btn').attr('level',"parent")
		$('.pop_add').show();
	}
	//列表搜索
    ,search: function(){
        param = util.serialize();
        detParam = param;
        this.queryList(0);
        
    }
	//点击启用
	,isUse:function (el) {
		var self = this;
		var data = {};
		data['leftId'] = $(el).attr('leftId')
		data['rightId'] = $(el).attr('rightId')
		if ($(el).text() == '启用') {
			data['isUse'] = 1
		} else{
			data['isUse'] = 0
		}
		$.post(base + '/menu/openOrCloseMenu.do',data,function (res) {
			if (res.status == 0) {
				if ($(el).text() == '启用') {
					$(el).text('停用')
				} else{
					$(el).text('启用')
				}
				self.search();
				$.Huimodalalert(res.message, 2000);
			}
		})
	}
	//编辑方法
	,editFn:function (ev,type) {
		var self = ev.target;
		var leftName = $(self).closest('tr').find('.leftMenu').text() || $(self).attr('leftName');
		var leftSort = $(self).closest('tr').find('.leftSort').text() || $(self).attr('leftSort');
		var rightName = $(self).closest('tr').find('.rightMenu').text();
		var rightSort = $(self).closest('tr').find('.rightSort').text();
		if (type == "addImg") {
			this.leftOrRight = 'right';
			//获取右向菜单虚拟商品分类
			$.ajaxSettings.async = false;
			var className = {22:".rightMenuType",23:".leftMenuType"}
			$('#pop_left_type, #pop_right_type').empty();
			util.initSelect(className,'22,23');
			$.ajaxSettings.async = true;
			var leftMenuType = $(self).attr('leftMenuType');
			$('.leftMenuType').val(leftMenuType)
			
			$('.left_img ').show();
			$('.up_img_box ').show();
			$('.right_panel').show()
			$('#pop_left_name').val(leftName)
			$('#pop_left_sort').val(leftSort)
			$('#pop_right_name').val('')
			$('#pop_right_sort').val('')
			$('.submit_btn').attr('level',"child")
			$('.submit_btn').attr('btnType','addBtn')
			this.leftId = $(self).attr('leftId')
			$('#pop_left_name').attr('disabled',true)
			$('#pop_left_sort').attr('disabled',true)
			$('.edit-img-box').remove();
			$('#kind_inp').val('请选择分类')
			$('#brand_inp').val('请选择品牌')
		} else {
			
			//左向菜单图片
			var leftImgurl = $(self).attr('leftImgurl');
			if (leftImgurl && leftImgurl != "undefined") {
				$('.up_img_box ').hide();
				var leftImgStr = '<div class="up-section fl loading edit-img-box">'+
			               		'<span class="up-span"></span>'+
			               		'<img src="../../images/a7.png" class="close-upimg">'+
			               		'<img class="edit-img" src="'+ imgPath + leftImgurl +'"/>'+
			               	'</div>';
			    $('.edit-img-box').remove();
			    $(leftImgStr).appendTo('.left_img .z_photo');
			    $('.up-section').show();
			} else {
				$('.up_img_box ').show();
			}
			$('.left_img ').show();
			
			var level = $(self).attr('level');
			var leftMenuType = $(self).attr('leftMenuType');
			if (level == "parent") {
				this.leftOrRight = 'left';
				this.isEdit = true;
				$('.right_panel').hide();
				$('#pop_left_name').val(leftName);
				$('#pop_left_sort').val(leftSort);
				$('#pop_left_name').attr('disabled',false);
				$('#pop_left_sort').attr('disabled',false);
				//获取左右向菜单实物虚拟分类
				$.ajaxSettings.async = false;
				var className = {23:".leftMenuType"}
				$('#pop_left_type').empty();
				util.initSelect(className,'23');
				$.ajaxSettings.async = true;
				$('.leftMenuType').val(leftMenuType)
				
			} else {
				this.leftOrRight = 'right';
				
				var leftMenuType = $(self).attr('leftMenuType')
				var rightMenuType = $(self).attr('rightMenuType')
				
				//获取左右向菜单实物虚拟分类
				$.ajaxSettings.async = false;
				var className = {22:".rightMenuType",23:".leftMenuType"}
				$('#pop_left_type, #pop_right_type').empty();
				util.initSelect(className,'22,23');
				$.ajaxSettings.async = true;
				
				$('.leftMenuType').val(leftMenuType)
				$('.rightMenuType').val(rightMenuType)
				
				var types = $(self).attr('types');
				if (types) {
					types = types.split(',');
					localStorage.setItem('types',types)
					this.len = types.length;
				}
				var imgurl = $(self).attr('imgurl');
				if (imgurl) {
					$('.right_img .up_img_box ').hide();
					var imgStr = '<div class="up-section fl loading edit-img-box">'+
				               		'<span class="up-span"></span>'+
				               		'<img src="../../images/a7.png" class="close-upimg">'+
				               		'<img class="edit-img" src="'+ imgPath + imgurl +'"/>'+
				               	'</div>';
				    $('.right_img .edit-img-box').remove();
				    $(imgStr).appendTo('.right_img .z_photo');
				    $('.up-section').show();
				}
				
				var catagoryName = $(self).attr('catagoryName')
				var brandName = $(self).attr('brandName')
				if (catagoryName) {
					$('#kind_inp').val(catagoryName)
				}
				if (brandName) {
					$('#brand_inp').val(brandName)
				}
				
				this.isEdit = true;
				this.rightId = $(self).attr('rightId')
				$('.right_panel').show();
				var imgUrl = $(self).attr('imgUrl');
				localStorage.setItem('imgUrl',imgUrl)
				$('#pop_left_name').val(leftName)
				$('#pop_left_sort').val(leftSort)
				$('#pop_right_name').val(rightName)
				$('#pop_right_sort').val(rightSort)
				$('#pop_left_name').attr('disabled',true)
				$('#pop_left_sort').attr('disabled',true)
				$('#pop_right_name').attr('disabled',false)
				$('#pop_right_sort').attr('disabled',false)
			}
			this.leftId = $(self).attr('leftId')
			$('.submit_btn').attr('btnType','editBtn')
			$('.submit_btn').attr('level',level)
		}
		$('.z_file').siblings('section').remove()
		$('.right_select p input[type=radio]').attr('checked',false)
//		$('#kind_inp').val('请选择分类');
//		$('#brand_inp').val('请选择商品');
		$('#classify-list').hide();
		$('.pop_add').show()
		var type = $(self).attr('type');
		if (type == 1) {
			$('#input_text_goods').prop("checked","checked")
		} else if(type == 2){
			$('#input_text_cary').prop("checked","checked")
		}
	}
	//点击添加弹窗确定方法
	,addSubmitFn:function () {
		var self = this;
		var data = {};
//		var leftId = $('#pop_left_name').attr('leftId')
		var leftMenuName = $('#pop_left_name').val();
		var leftSort = $('#pop_left_sort').val();
		var leftType = $('#pop_left_type').val();
		var rightMenuName = $('#pop_right_name').val();
		var rightSort = $('#pop_right_sort').val();
		var rightType = $('#pop_right_type').val();
		var typeNo = $('.right_select p input:checked').attr('typeNo');
		var isUse = $('.is_use input:checked').attr('isUse');
		var numReg = /^[0-9]*$/;
		var btnType = $('.submit_btn').attr('btnType')
		var urlstr = ''
		if (btnType == "addBtn") {
			urlstr =base + '/menu/addMenu.do'
			
			if (!leftMenuName) {
				$.Huimodalalert("左菜单不能为空", 2000);
				return false;
			}
			
			if (!leftSort) {
				$.Huimodalalert("左菜单排序不能为空", 2000);
				return false;
			} else if (!numReg.test(leftSort)) {
				$.Huimodalalert("左菜单排序只能为数字", 2000);
				return false;
			}
			
			var leftImgUrl = $('.left_img .up-img').attr('src') || $('.left_img .edit-img').attr('src');
			if (!leftImgUrl) {
				$.Huimodalalert("请上传左向菜单图片", 2000);
				return false;
			} else {
				data['leftImgUrl'] = localStorage.getItem('leftImgUrl');
			}
			var level = $('.submit_btn').attr('level')
			if (level == 'child') {
				
				var imgUrl = $('.right_img .up-img').attr('src');
				
				
				if (!rightMenuName) {
					$.Huimodalalert("右菜单不能为空", 2000);
					return false;
				}
				
				if (!imgUrl) {
					$.Huimodalalert("请上传右向菜单图片", 2000);
					return false;
				} else {
					data['imgUrl'] = localStorage.getItem('imgUrl');
				}
				
				if (!rightSort) {
					$.Huimodalalert("右菜单排序不能为空", 2000);
					return false;
				}else if (!numReg.test(rightSort)) {
					$.Huimodalalert("右菜单排序只能为数字", 2000);
					return false;
				}
				
				if (rightSort&&!numReg.test(rightSort)) {
					$.Huimodalalert("右菜单排序只能为数字", 2000);
					return false;
				}
				
				if (typeNo == 1) {
					var skuIds = localStorage.getItem('skuIds')
					if (skuIds) {
						data['skuIds'] = skuIds;
						self.linkSkuIds = skuIds.split(',')
						localStorage.setItem('linkSkuIds',self.linkSkuIds)
					} else {
						$.Huimodalalert("请选择商品", 2000);
						return;
					}
				} else if (typeNo == 2) {
					if (!this.catagoryId) {
						$.Huimodalalert("请选择商品分类", 2000);
						return;
					}
					data['catagoryId'] = this.catagoryId
					data['brandId'] = this.brandId
				} else {
					$.Huimodalalert("请选择商品或分类", 2000);
						return;
				}
				
			}
			
		} else if(btnType == "editBtn"){
			urlstr =base + '/menu/editMenu.do'
			if (this.rightId) {
				data['rightId'] = this.rightId
			}
			var level = $('.submit_btn').attr('level');
			if (level == 'child'){
				if (typeNo == 1) {
					var skuIds = localStorage.getItem('skuIds')
					if (skuIds) {
						data['skuIds'] = skuIds
						self.linkSkuIds = skuIds.split(',')
						console.log(self.linkSkuIds)
						localStorage.setItem('linkSkuIds',self.linkSkuIds)
					} 
				} else if (typeNo == 2) {
					data['catagoryId'] = this.catagoryId
					data['brandId'] = this.brandId
				} else {
					$.Huimodalalert("请选择商品或分类", 2000);
						return;
				}
				var imgUrl = $('.right_img .up-img').attr('src') || $('.right_img .edit-img').attr('src');
				if (!imgUrl) {
					$.Huimodalalert("请上传右向菜单图片", 2000);
					return false;
				} else {
					data['imgUrl'] = localStorage.getItem('imgUrl');
				}
			} else {
				var leftImgUrl = $('.left_img .up-img').attr('src') || $('.left_img .edit-img').attr('src');
				if (!leftImgUrl) {
					$.Huimodalalert("请上传左向菜单图片", 2000);
					return false;
				} else {
					data['leftImgUrl'] = localStorage.getItem('leftImgUrl');
				}
			}
		}
		
		data['leftMenuName'] = leftMenuName;
		data['leftSort'] = leftSort;
		data['leftMenuType'] = leftType;
		data['rightMenuName'] = rightMenuName;
		data['rightSort'] = rightSort;
		data['rightMenuType'] = rightType;
		data['type'] = typeNo;
		data['isUse'] = isUse;
		if (this.leftId) {
			data['leftId'] = this.leftId;
		}
		
		$.post(urlstr,data,function (res) {
			if (res.status == 0) {
				$('.pop_add').hide();
				$('#classify-list').show();
				self.search();
			}
		})
		
	}
	//选择品牌弹窗点击方法
	,chooseBrand:function (el) {
		var brand = $(el).text();
		this.brandId = $(el).attr('brandId')
		$('#brand_inp').val(brand)
	}
	//点击选择分类放法
	,chooseKind: function (type) {
		//清空列表
		$('.ul-1, .ul-2, .ul-3, .ul-4').empty();
		$('.choose-kind-1,.choose-kind-2,.choose-kind-3,.choose-kind-4').text('');
		//获取一级菜单
		$.get(base + 'goodsAdmin/getCategory.do',{parentId: 0},function (res) {
			if (res.status == 0) {
				var li = ''
				if (res.data.length) {
					//一级分类
					$.each(res.data,function (i,item) {
						var liOne = '<li parentId="'+item.id+'">'+ item.name +'</li>'
						$(liOne).appendTo('.ul-1')
					})
				}	
			}
		})
		if (type == "linkGoods") {
			$('.get-result').attr('btnType',type)
		}
		$('.mark_pop').show();
		$('.type-select-panel').show();
	}
	//获取2,3,4级分类
	,getKindTwo: function (el,Num) {
		var $self = $(el);
		var parentId = $self.attr('parentId');
		this.catagoryId = parentId;
		$self.addClass('check').siblings('li').removeClass('check');
		var chooseTxt = $self.text();
		$('.choose-kind-'+(Num-1)).text(chooseTxt+'>')
		$.get(base + 'goodsAdmin/getCategory.do',{parentId: parentId},function (res) {
			if (res.status == 0) {
				if (res.data.length) {
					$.each(res.data,function (i,item) {
						var liOne = '<li parentId="'+item.id+'">'+ item.name +'</li>';
						$(liOne).appendTo('.ul-'+Num);
					})
				}
			}
		})
	}
	//点击分类弹窗确定方法
	,getResult: function (el) {
		var btnType = $(el).attr('btnType')
		if (btnType) {
			this.scree()
		} else {
			var chooseKind = $('.choose-kind-1').text() + $('.choose-kind-2').text() + $('.choose-kind-3').text() + $('.choose-kind-4').text();
			$('#kind_inp').val(chooseKind);
			$('#brand_inp').val("请选择商品")
		}
		
		$('.mark_pop').hide();
		$('.type-select-panel').hide();
	}
	//点击选择品牌
	,showBrand: function(name){
		$('.brandList').empty();
		$.post(base + 'goodsAdmin/getBrand.do',{name:name},function (res) {
			if(res.status == 0){
				if (res.data.length) {
					$.each(res.data, function(i,item) {
						var li = '<li brandId="'+item.id+'">'+ item.name +'</li>';
						$(li).appendTo('.brandList');
					});
					
				}
			}
		})
		$('.name-select-panel').show()
	}
	//点击全部方法
	,allCheckbox:function (ev) {
		var self = ev.target;
		if ($('#all').is(':checked')) {
			var checkBoxs = $('.link_goods input[type=checkbox]');
			checkBoxs.prop('checked','checked');
			if (this.skuIds.length) {
				for (var i=0;i<this.skuIds.length;i++) {
					this.skuIdss.push(this.skuIds[i])
				}
			}
			
			//已选择商品suiIds去重
			var skuIdsObj = {}
			var newSkuIds = [];
			for (var i = 0; i < this.skuIdss.length; i++) {
				if (!skuIdsObj[this.skuIdss[i]]) {
					newSkuIds.push(this.skuIdss[i]);
					skuIdsObj[this.skuIdss[i]] = true;
				}
			}
			this.skuIdss = newSkuIds
			console.log(this.skuIdss)
			
			//取到剩余skuId加入全部skuId中
			var skuIds = localStorage.getItem('skuIds');
			if (skuIds) {
				skuIds = skuIds.split(',')
				for (var i = 0; i < skuIds.length; i++) {
					this.skuIdss.push(skuIds[i])
				}
			}
			
			localStorage.setItem('skuIds',this.skuIdss)
			
		} else{
			$('.link_goods input[type=checkbox]').prop('checked','')
			var linkSkuIds = localStorage.getItem('linkSkuIds');
			linkSkuIds = linkSkuIds.split(',');
			console.log('all:'+this.skuIdss)
			console.log('all:'+this.skuIdss.length)
			console.log('link:'+linkSkuIds)
			console.log('link:'+linkSkuIds.length)
			for (var i=0;i<linkSkuIds.length;i++) {
				for (var j=0;j<this.skuIdss.length;j++) {
					if (this.skuIdss[j] == linkSkuIds[i]) {
						linkSkuIds.splice(i,1);
						j = -1;
					}
				}
			}
			console.log(linkSkuIds)
			localStorage.setItem('skuIds',linkSkuIds);
		}
	}
	//选择关联商品
	,chooseGoods: function (el) {
		var skuId = $(el).attr('skuId');
		if ($(el).context.checked === true) {
			var skuIds = this.skuIds
			if (skuIds.length) {
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
				this.skuIds = skuIds;
			} else {
				var skuIds = [];
				skuIds.push(skuId)
				localStorage.setItem('skuIds',skuIds)
				this.skuIds = skuIds;
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
	//弹窗获取列表
	,scree:function () {
		var sign = $('.checkbox input[type=radio]:checked').val();
		var keyword = $('#keyword').val();
		var status = $('#popstatus').val();
		var catid = this.catagoryId;
		var btnType = $('.submit_btn').attr('btnType');
		
		var data = {};
		data['sign'] = sign;
		data['keyword'] = keyword;
		data['status'] = status;
		data['catid'] = catid;
		if (btnType == "addBtn") {
			data['rightId'] = 0;
			data['types'] = 0;
		} else {
			data['rightId'] = this.rightId;
			data['types'] = localStorage.getItem('types')
		}
		this.queryGooodsList(data,0)
	}
	//点击三角箭头方法
	,arrow:function (ev) {
		var self = ev.target;
		var status = $(self).closest('tr').attr('status');
		if (status == 'close') {
			$(self).closest('tr').attr('status','open');
		} else {
			$(self).closest('tr').attr('status','close');
		}
		
	}
	//分类展示列表
	,queryList:function (obj) {
		var self = this;
        detParam.pageNum = (obj && obj.curr) || 1 // 默认第1页
        detParam.pageRows = (obj && obj.pageSize) || 20 // 默认一页20条数据
		$.get(base + 'menu/getMenuList.do',detParam,function (res) {
			if (res.status == 0) {
				var strHtml = "";
				if (res.data.length) {
					$.each(res.data,function (i,item) {
						if (item.isUse == 0) {
							var isUseTxt = "启用"
						} else{
							var isUseTxt = "停用"
						}
						i += 1 
						strHtml += '<tr status="close" class="text-c" data-id="'+i+'" data-parent="">' +
				                      ' <td class="leftMenu text-l" leftId="'+item.leftId+'">'+item.leftMenuName+'</td>' +
				                      ' <td class="leftSort">'+item.leftSort+'</td>' +
				                       '<td class="rightMenu"><img addType="right" level="chidl" leftId="'+item.leftId+'" leftMenuType="'+item.leftMenuType+'" class="add_icon" src="../../images/add.png"/>增加右向菜单</td>' +
				                      ' <td></td>' +
				                       '<td><a leftId="'+item.leftId+'" level="parent" leftMenuType="'+item.leftMenuType+'" leftImgurl="'+item.leftImgUrl+'" class="edit" href="javascript:;">编辑</a><a leftId="'+item.leftId+'" level="parent" class="isUse" href="javascript:;">'+isUseTxt+'</a></td>' +
			                       ' </tr>'
					
						if (item.rightMenusExtend.length) {
							$.each(item.rightMenusExtend, function(j,rightItem) {
								var catagoryName = "";
								if (rightItem.rightId) {
									var styleStr = ''
								} else {
									var styleStr = 'style="display:none;"'
								}
								if (rightItem.isUse == 0) {
									var isUseTxt = "启用"
								} else{
									var isUseTxt = "停用"
								}
								if (rightItem.catagoryNameList.length) {
									var rightCatagoryName = rightItem.catagoryNameList[0]
									catagoryName += rightCatagoryName.name + rightCatagoryName.thirdName + rightCatagoryName.secondName + rightCatagoryName.firstName
									if (rightCatagoryName.firstName) {
										catagoryName = rightCatagoryName.firstName
									}
									if (rightCatagoryName.secondName) {
										catagoryName += ">"
										catagoryName += rightCatagoryName.secondName;
									}
									if (rightCatagoryName.thirdName) {
										catagoryName += ">"
										catagoryName += rightCatagoryName.thirdName;
									}
									if (rightCatagoryName.fourthName) {
										catagoryName += ">"
										catagoryName += rightCatagoryName.fourthName;
									}
								}
								strHtml += '<tr class="text-c" data-parent="'+i+'">' +
												'<td class="text-l"></td>' +
												'<td><img src="../../images/sub.gif"/></td>' +
												'<td class="rightMenu"><img leftName="'+item.leftMenuName+'" leftSort="'+item.leftSort+'" level="child" rightId="'+rightItem.rightId+'" leftId="'+rightItem.leftId+'" leftMenuType="'+item.leftMenuType+'" class="add_icon" src="../../images/add.png"/>'+rightItem.rightMenuName+'</td>' +
												'<td class="rightSort">'+rightItem.rightSort+'</td>' +
												'<td><a '+ styleStr +' imgUrl="'+rightItem.imgUrl+'" leftName="'+item.leftMenuName+'" leftSort="'+item.leftSort+'" rightId="'+rightItem.rightId+'" leftId="'+item.leftId+'" leftImgUrl="'+ item.leftImgUrl +'" types="'+ rightItem.types +'" type="'+ rightItem.type +'" level="child" catagoryName="'+ catagoryName +'" catagoryId="'+ rightItem.catagoryId +'" brandId="'+ rightItem.brandId +'" brandName="'+ rightItem.brandName +'" leftMenuType="'+item.leftMenuType+'" rightMenuType="'+rightItem.rightMenuType+'" class="edit" href="javascript:;">编辑</a><a '+ styleStr +' class="isUse" leftId="'+item.leftId+'" rightId="'+rightItem.rightId+'" level="child" href="javascript:;">'+isUseTxt+'</a></td>' +
											'</tr>'

								
							});
						}
					})
					$('#tableList').empty()
					$(strHtml).appendTo("#tableList");
					
					
					//设置下拉表格
					$('#tableList').aCollapTable({
					    startCollapsed: true,
					    addColumn: false,
					    plusButton: '<i class="glyphicon glyphicon-triangle-right"></i>', 
					    minusButton: '<i class="glyphicon glyphicon-triangle-bottom"></i>' 
					});
				} else {
					 $("#tableList").empty().append("<tr><td colspan='5'  style='text-align:center; color:#ddd;'>暂无相关数据！</td></tr>");
				}
				
				//设置分页
				setPagination({
			       elem: $('#pagination'),
			       totalCount: res.dataCount,
			       curr: detParam.pageNum,
				   callback: function (obj) {
                            self.queryList(obj);
                        }
			   });

			}
		})
	}
	//弹窗关联商品列表
	,queryGooodsList:function (data,obj) {
		var self = this;
        data.pageNum = (obj && obj.curr) || 1 // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
		$.get(base + 'menu/getConnectGoodsList.do',data,function (res) {
			if (res.status == 0) {
				self.skuIdss = [];
				var strHtml = ""
				if (res.data.length) {
					var className='';
//					var skuIds = [];
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
							self.skuIds.push(item.skuId)
						}else {
							isChecked = ""
						}
						if (data.sign == 2) {
							isChecked = "checked"
							$('#all').prop('checked',true)
							self.skuIds.push(item.skuId)
						}
						
						strHtml += '<li class="'+className+'" skuId="'+item.skuId+'">' +
										'<input '+ isChecked +' type="checkbox" name="" class="isChecked" value="" skuId="'+ item.skuId +'"/>' +
										'<img src="'+ imgPath +item.thumb+'"/>' +
										'<span class="link_name">'+item.skuName+'</span>' +
										'<span class="link_price">￥'+item.shopPrice+'</span>' +
										'<span class="link_kind">'+item.categoryName+'</span>' +
										'<span class="link_status">'+item.statusStr+'</span>' +
										'<span class="link_role">'+item.roleStr+'</span>' +
										'<span class="link_time">'+item.createTime+'</span>' +
									'</li>'
					});
					console.log(self.skuIdss)
					console.log(self.skuIds)
					
					//已选择商品suiIds去重
					var skuIdsObj = {}
					var newSuiIds = [];
					for (var i = 0; i < self.skuIds.length; i++) {
						if (!skuIdsObj[self.skuIds[i]]) {
							newSuiIds.push(self.skuIds[i]);
							skuIdsObj[self.skuIds[i]] = true;
						}
					}
					console.log("newSuiIds:" + newSuiIds);
					self.skuIds = newSuiIds;
					var skuIds = localStorage.getItem('skuIds');

					$('#link_goods').empty()
					$(strHtml).appendTo("#link_goods");
					var $li = $('#link_goods li')
				} else {
					$('#link_goods').empty()
					$.Huimodalalert("没有数据", 2000);
				}
				
				if ($('.isChecked:checked').length == res.data.length) {
					$('#all').prop('checked',true)
				}else {
					$('#all').prop('checked',false)
				}
				
				//设置分页
				setPagination({
			       elem: $('#pop_pagination'),
			       totalCount: res.dataCount,
			       curr: data.pageNum,
				   callback: function (obj) {
				   			$("#link_goods").empty()
                            self.queryGooodsList(data,obj);
                        }
			   });

			}
		})
	}
	//关联商品提交上传
	,linkGoods:function () {

		var skuIds = localStorage.getItem('skuIds');
		if (!skuIds && this.btnType == 'addImg') {
			$.Huimodalalert("请选择关联商品", 2000);
				return false;
		} else {
			$('.pop_goods').hide();
			$('.pop_add').show()
		}
		
	}
	//图片上传
	,upLoadImg: function () {
		$("#file").takungaeImgup({
		    formData: { "path": "Content/Images/", "name": "OrderScrshotCol" }, //path参数会发送给服务器，name参数代表上传图片成功后，自动生成input元素的name属性值
		    url:base + 'common/upload',    //发送请求的地址，服务器地址
		    success: function (data) {
		    },
		    error: function (err) {
		    	$.Huimodalalert(err, 2000);
		    },
		    leftOrRight: this.leftOrRight
		});
	}
}
classifyShow.init()