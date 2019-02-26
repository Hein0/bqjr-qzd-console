/*
creat by ljc 
2017/11/28
*/

var pageNew = {
	init: function () {
		this.allData = [];
		this.fixedBannerData = [];
		this.addType = ''
		this.removeEl = null;
		this.leftId = '';
		this.pageId = '';
		this.pageName = '';
		this.isDelect = false;
		this.isChange = false;
		this.removeIndex = 0
		this.imgList = [{sortNo:0,relationUrl:"",imageUrl:"",goodsId:""}];
		this.imgNum = 0;
		this.isNew = false;
		//初始化左向菜单
		this.queryLeftPlate()
		//绑定事件
		this.bindEvents()
		//初始化拖动事件//产品说不要拖动排序了，在右向菜单那里可以排序
//		$('.gridly').gridly({
//			gutter:0,
//			columns:8
//		});
		//图片上传
		this.upLoadImg()
	}
	
	,bindEvents: function () {
		var self = this;
		
		//点击切换板块
		$('#left-menu-panel').on('click','.change-panel',function () {
			self.loadPlate(this)
		})
		$('.plate-wrap').on('click','.swiper-button-next',function () {
			return false;
		})
		
		//('.swiper-button-next, .swiper-button-prev')
		//删除模块
		$('.plate-wrap').on('click','.remove',function () {
			self.removeFn(this)
			return false
		})
//		$('.ph-left').on('click','.remove',function () {
//			self.removeFn(this)
//			return false
//		})
		//删除模块确定
		$('#modal-demo #popSure').on('click',function () {
			self.removeComfirm()
		})
		
		//模块上下移动
		$('.plate-wrap').on('click','.up',function () {
			self.up(this)
			return false;
		})
		//模块上下移动
		$('.plate-wrap').on('click','.down',function () {
			self.down(this)
			return false;
		})
		//模块置顶置底
		$('.plate-wrap').on('click','.go-top',function () {
			self.toTop(this)
			return false;
		})
		//模块置顶置底
		$('.plate-wrap').on('click','.go-foot',function () {
			self.toBtm(this)
			return false;
		})
		
		//添加主题
		$('.add-box').on('click',function () {
			self.clickAdd(this)
		})
		$('.firstBanner').on('click','.add-box',function () {
			self.clickAdd(this)
		})
		
		//编辑banner大图模块
		$('.firstBanner').on('click','.line-one',function () {
			self.clickBanner(this,'fixedBanner')
		})
		$('.plate-wrap').on('click','.line-one',function () {
			self.clickBanner(this,'banner')
		})
		//编辑活动模块
		$('.plate-wrap').on('click','.ms-plate',function () {
			self.clickBanner(this,'activity')
		})
		//编辑banner一行2个
		$('.plate-wrap').on('click','.line-two',function () {
			self.clickBanner(this,'banner2')
		})
		//编辑商品一行3个
		$('.plate-wrap').on('click','.three-goods',function () {
			self.clickBanner(this,'goods3')
		})
		//编辑商品一行2个
		$('.plate-wrap').on('click','.two-goods',function () {
			self.clickBanner(this,'goods')
		})
		//编辑商品一行1个
		$('.plate-wrap').on('click','.one-goods',function () {
			self.clickBanner(this,'goods')
		})
		
		//关闭弹窗
		$('.ph-close').on('click',function () {
			$('.pop').hide()
			self.isDelect = false;
		})
		
		//选择模块
		$('.add-ul').on('click','li',function () {
			self.choosePlate(this)
		})
		
		//选择图片号码
		$('.ph-img-list').on('click','li',function (ev) {
			self.chooseImgNum(this)
		})
		
		//点击加号
		$('.ph-add-img').on('click',function (ev) {
			self.addImgLi()
		})
		
		//打开商品列表弹窗
		$('.open-goods').on('click',function () {
			self.openGoodsPop()
		})
		
		//点击弹窗确定
		$('.pop_goods_submit').on('click',function (ev) {
			self.goodsSubmit();
		})
		//关闭商品列表弹窗
		$('.close_btn, .pop_cancel').on('click',function () {
			$('.pop_goods').hide()
		})
		
		//点击保存
		$('.ph-save').on('click',function (ev) {
			self.saveEdit(this);
		})
		//点击删除
		$('.ph-delect').on('click',function (ev) {
			self.clearPop(this)
		})
		//点击查看更多
		$('.check-more').on('click',function (ev) {
			self.checkMore();
		})
		
		//点击发布
		$('.ph-issue').on('click',function (ev) {
			self.issue();
		})
		//点击左边保存
		$('.left-save').on('click',function () {
			self.saveLeft()
		})
	}
	
	//初始化左向菜单（顶部面板轮播）
	,queryLeftPlate: function () {
		var self = this;
		$.get(base + 'plate/getMenuLeftList.do', function (res) {
			if (res.status == 0) {
				self.leftList = res.data;
				var strHtml = '';
				$.each(res.data, function(i,item) {
                    strHtml += '<div class="swiper-slide red-slide"><a leftId="'+ item.leftId +'" leftMenuName="'+ item.leftMenuName +'" class="change-panel change-panel-plate" href="javascript:;"><img src="../../images/phonePlate.jpg"/><img class="activityImg" src="../../images/activityIcon.png"/><p>'+ item.leftMenuName +'</p></a></div>'
				});
//				$('#left-menu-panel').empty()
				$(strHtml).appendTo('#left-menu-panel')
					self.openLeftSwiper()
				$('#left-menu-panel .change-panel:first').click();
			}
		})
	}
	
	//跳转到板块
    ,loadPlate: function(el){
    	this.leftId = $(el).attr('leftId');
    	this.pageName = $(el).attr('leftMenuName')
        $(el).find('.activityImg').addClass('activity')
        $(el).closest('.swiper-slide').siblings().find('.activityImg').removeClass('activity')
        this.initData(this.leftId)
        var index = $(el).closest('div').index()
        this.loadNav(this.leftId,index)
        $('.pop').hide()
    }
	
		//启动轮播
	,openLeftSwiper: function () {
		var mySwiper = new Swiper('.swiper-container1', {
				width:200,
				height: 200,
				prevButton:'.swiper-button-prev',
				nextButton:'.swiper-button-next',
				initialSlide :0,
				grabCursor : true,
				autoHeight: true, //高度随内容变化
				mousewheelControl : true,//开启鼠标控制Swiper切换。
				keyboardControl : true,//使用键盘方向键控制slide滑动
				//pagination : '.swiper-pagination',//分页器
				paginationClickable :true,
		})
	}
	
	//获取右向菜单导航
	,loadNav: function (leftId,index) {
		var navStr = '';
		if (index == 0) {
			$.each(this.leftList, function(i,item) {
				navStr += '<li><img src="'+ imgPath + item.leftImgUrl + '"/><br /><span class="nav-txt">'+ item.leftMenuName +'</span></li>'
			});
		} else{
			$.get(base + 'menu/getRightMenuByLeftId.do',{leftId: leftId},function (res) {
				if (res.status == 0) {
					$.each(res.data, function(i,item) {
						navStr += '<li><img src="'+ imgPath + item.imgUrl + '"/><br /><span class="nav-txt">'+ item.rightMenuName +'</span></li>'
					});
				} else{
				
				}
			})
		}
		$('.navList').empty().append($(navStr))
	}
	
	//初始化数据
	,initData: function (leftId) {
		var self = this;
		$.post(baseNew + 'page/getPlateInfo.do', {leftId:leftId},function  (res) {
			if (res.status == 'success') {
				if (res.data) {
					
					//是否有顶部banner数据
					var fixedBannerdata = false;
					
					self.allData = res.data[0].mallPageSubjectResponse
					$('.plate-wrap').empty()//容器清空
					$.each(res.data[0].mallPageSubjectResponse,function (i,items) {
						var bannerStr1,bannerStr2,msStr,goodsStr1,goodsStr2,goodsStr3,goodsListNow;
						switch (items.subjectType){
							case 'BANNER':
								var imgStr = '';
								$.each(items.mallPageSubjectRelationResponse, function(j,item) {
									imgStr += '<div class="swiper-slide ph-banner-edit"> <a class="top-banner-a" href="javascript:;"><img src="'+ imgPath + item.imageUrl +'"/></a></div>'
								});
								var num = $('.line-one').length
								bannerStr1 = '<div newPlate="false" plateSort="'+ i +'" pageId="'+ items.pageId +'" subjectId="'+ items.subjectId +'" subjectSortNo="'+ items.subjectSortNo +'" subjectName="'+ items.subjectName +'" subjectType="BANNER" class="mt-10 ph-head-banner plate line-one line-one-'+ num +'">' +
													'<a href="javascript:;" class="remove">X</a>' +
													'<span class="change-box"><a class="go-top" href="javascript:;"></a><a class="up ml-3" href="javascript:;"></a><a class="down ml-3" href="javascript:;"></a><a class="go-foot" href="javascript:;"></a></span>' +
													'<div class="swiper-container swiper-container2 height_112">' +
													   ' <div class="swiper-wrapper height_112 ph-top-banner-box">' +
														imgStr +
													    '</div>' +
												    	'<div class="swiper-pagination"></div>' +
													'</div>' +
												'</div>'
								
								$('.plate-wrap').append($(bannerStr1))
								break;
							case 'FIXED_BANNER':
								fixedBannerdata = true;
								var imgStr = '';
								$.each(items.mallPageSubjectRelationResponse, function(j,item) {
									imgStr += '<div class="swiper-slide ph-banner-edit"> <a class="top-banner-a" href="javascript:;"><img src="'+ imgPath + item.imageUrl +'"/></a></div>'
								});
								var num = $('.line-one').length
								bannerStr1 = '<div newPlate="false" plateSort="'+ i +'" pageId="'+ items.pageId +'" subjectId="'+ items.subjectId +'" subjectSortNo="'+ items.subjectSortNo +'" subjectName="'+ items.subjectName +'" subjectType="FIXED_BANNER" class="ph-head-banner plate line-one line-one-'+ num +'">' +
													'<div class="swiper-container swiper-container2 height_112">' +
													   ' <div class="swiper-wrapper height_112 ph-top-banner-box">' +
														imgStr +
													    '</div>' +
												    	'<div class="swiper-pagination"></div>' +
													'</div>' +
												'</div>'
								$('.firstBanner').empty().append($(bannerStr1))
								self.fixedBannerData = self.allData[i]
//								self.allData.splice(i,1)
								break
							case 'BANNER_TWO':
									var imgStr = '';
									var item = items.mallPageSubjectRelationResponse
									var firstImg,secImg,thdImg;
									if (item[0].imageUrl) {
										firstImg = '<div class="two-left"><img src="'+ imgPath + item[0].imageUrl +'"/></div>'
									} else{
										firstImg = '<div class="two-left"><p class="click-me">点击进行编辑</p></div>'
									}
									if (item[1].imageUrl) {
										secImg = '<div class="two-left"><img src="'+ imgPath + item[1].imageUrl +'"/></div>'
									} else{
										secImg = '<div class="two-left"><p class="click-me">点击进行编辑</p></div>'
									}
									
									var num = $('.line-two').length
									bannerStr2 = '<div newPlate="false" plateSort="'+ i +'" pageId="'+ items.pageId +'" subjectId="'+ items.subjectId +'" subjectSortNo="'+ items.subjectSortNo +'" subjectName="'+ items.subjectName +'" subjectType="BANNER_TWO" class="mt-10 plate line-two line-two-'+ num +'">' +
														'<p id="two-panel-title" class="ph-panel-title">'+ items.subjectName +'</p>' +
														'<a href="javascript:" class="remove">X</a>' +
														'<span class="change-box"><a class="go-top" href="javascript:;"></a><a class="up ml-3" href="javascript:;"></a><a class="down ml-3" href="javascript:;"></a><a class="go-foot" href="javascript:;"></a></span>' +
														firstImg +
														secImg +
													'</div>'
								
								$('.plate-wrap').append($(bannerStr2))
								break
							case 'ACTIVITY_SECKILL':
								var item = items.mallPageSubjectRelationResponse;
								var firstImg,secImg,thdImg;
								if (item[0].imageUrl) {
									firstImg = '<div class="ms-left"><img src="'+ imgPath + item[0].imageUrl +'"/></div>'
								} else{
									firstImg = '<div class="ms-left"><p class="click-me">点击进行编辑</p></div>'
								}
								if (item[1].imageUrl) {
									secImg = '<div class="ms-right-opt"><img src="'+ imgPath + item[1].imageUrl +'"/></div>'
								} else{
									secImg = '<div class="ms-right-opt"><p class="click-me">点击进行编辑</p></div>'
								}
								if (item[2].imageUrl) {
									thdImg = '<div class="ms-right-opt"><img src="'+ imgPath + item[2].imageUrl +'"/></div>'
								} else{
									thdImg = '<div class="ms-right-opt"><p class="click-me">点击进行编辑</p></div>'
								}
								var num = $('.line-one').length
								msStr = '<div newPlate="false" plateSort="'+ i +'" pageId="'+ items.pageId +'" subjectId="'+ items.subjectId +'" subjectSortNo="'+ items.subjectSortNo +'" subjectName="'+ items.subjectName +'" subjectType="ACTIVITY_SECKILL" class="mt-10 plate ms-plate ms-plate-'+ num +'">' +
												'<p id="ms-panel-title" class="ph-panel-title">'+ items.subjectName +'</p>' +
												'<a href="javascript:;" class="remove">X</a>' +
												'<span class="change-box"><a class="go-top" href="javascript:;"></a><a class="up ml-3" href="javascript:;"></a><a class="down ml-3" href="javascript:;"></a><a class="go-foot" href="javascript:;"></a></span>' +
												firstImg +
												'<div class="ms-right">' +
													secImg +
													thdImg +
												'</div>' +
											'</div>'
								$('.plate-wrap').append($(msStr))
								break
							case 'GOODS_ONE':
								var imgStr = '';
								$.each(items.mallPageSubjectRelationResponse, function(j,item) {
									imgStr += '<img src="'+ imgPath + item.thumb +'"/>'
								});
								var num = $('.one-goods').length
								var goodsStr1 = '<div newPlate="false" plateSort="'+ i +'" pageId="'+ items.pageId +'" subjectId="'+ items.subjectId +'" subjectSortNo="'+ items.subjectSortNo +'" subjectName="'+ items.subjectName +'" subjectType="GOODS_ONE" class="mt-10 plate one-goods one-goods-'+ num +'">' +
													'<p id="goods-panel-title" class="ph-panel-title">'+ items.subjectName +'</p>' +
													'<a href="javascript:" class="remove">X</a>' +
													'<span class="change-box"><a class="go-top" href="javascript:;"></a><a class="up ml-3" href="javascript:;"></a><a class="down ml-3" href="javascript:;"></a><a class="go-foot" href="javascript:;"></a></span>' +
													imgStr +
												'</div>'
								$('.plate-wrap').append($(goodsStr1))
								break
							case 'GOODS_TWO':
								var imgStr = '',moreStr = '';
								if (items.mallPageSubjectRelationResponse.length > 4){
									goodsListNow = items.mallPageSubjectRelationResponse.plateImageList.slice(0,4);
									self.goodsListMore = items.mallPageSubjectRelationResponse.plateImageList.slice(4);
									moreStr = '<p class="check-more">查看更多</p>'
								} else {
									goodsListNow = items.mallPageSubjectRelationResponse;
								}
								$.each(goodsListNow, function(j,item) {
									imgStr += '<li><img src="'+ imgPath + item.thumb +'"/></li>'
								});
								var num = $('.two-goods').length
								var goodsStr2 = '<div newPlate="false" plateSort="'+ i +'" pageId="'+ items.pageId +'" subjectId="'+ items.subjectId +'" subjectSortNo="'+ items.subjectSortNo +'" subjectName="'+ items.subjectName +'" subjectSortNo="'+ items.subjectSortNo +'" subjectType="GOODS_TWO" class="ph-goods-panel mt-10 plate two-goods two-goods-'+ num +'">' +
													'<p id="goods-panel-title" class="ph-panel-title">'+ items.subjectName +'</p>' +
													'<a href="javascript:" class="remove">X</a>' +
													'<span class="change-box"><a class="go-top" href="javascript:;"></a><a class="up ml-3" href="javascript:;"></a><a class="down ml-3" href="javascript:;"></a><a class="go-foot" href="javascript:;"></a></span>' +
													'<ul class="ph-goods-list">' +
														imgStr +
													'</ul>' +
													moreStr +
												'</div>'
								$('.plate-wrap').append($(goodsStr2))
								break
							case 'GOODS_TREEE':
								var num = $('.three-goods').length
								var item = items.mallPageSubjectRelationResponse
								var firstImg,secImg,thdImg;
								if (item[0].thumb) {
									firstImg = '<div class="three-left"><img src="'+ imgPath + item[0].thumb +'"/></div>'
								} else{
									firstImg = '<div class="three-left"><p class="click-me">点击进行编辑</p></div>'
								}
								if (item[1].thumb) {
									secImg = '<div class="three-left"><img src="'+ imgPath + item[1].thumb +'"/></div>'
								} else{
									secImg = '<div class="three-left"><p class="click-me">点击进行编辑</p></div>'
								}
								if (item[2].thumb) {
									thdImg = '<div class="three-left"><img src="'+ imgPath + item[2].thumb +'"/></div>'
								} else{
									thdImg = '<div class="three-left"><p class="click-me">点击进行编辑</p></div>'
								}
								var goodsStr3 = '<div newPlate="false" plateSort="'+ i +'" pageId="'+ items.pageId +'" subjectId="'+ items.subjectId +'" subjectSortNo="'+ items.subjectSortNo +'" subjectName="'+ items.subjectName +'" subjectType="GOODS_TREEE" class="mt-10 plate three-goods three-goods-'+ num +'">' +
													'<p id="three-panel-title" class="ph-panel-title">'+ items.subjectName +'</p>' +
													'<a href="javascript:" class="remove">X</a>' +
													'<span class="change-box"><a class="go-top" href="javascript:;"></a><a class="up ml-3" href="javascript:;"></a><a class="down ml-3" href="javascript:;"></a><a class="go-foot" href="javascript:;"></a></span>' +
													firstImg +
													secImg +
													thdImg +
												'</div>'
								
								$('.plate-wrap').append($(goodsStr3))
								break
							default:
								break;
						}
					})
					
					if (!fixedBannerdata) {
						var addStr = '<div class="add-wrap mt-30"><div class="add-box" addType="banner">+</div><br /><span>添加BANNER</span></div>'
						$('.firstBanner').empty().append($(addStr))
					}
					
				} else {
					self.allData = []
					var addStr = '<div class="add-wrap mt-30"><div class="add-box" addType="banner">+</div><br /><span>添加BANNER</span></div>'
					$('.firstBanner').empty().append($(addStr))
					$('.plate-wrap').empty()//容器清空
				}
				self.openPlateSwiper(2)
			}
		})
	}
	
	//删除模块
	,removeFn: function (el) {
		$("#modal-demo").modal("show")
		this.removeEl = $(el).closest('.plate')
		this.removeIndex = this.removeEl.index()
	}
	//删除模块确定
	,removeComfirm: function () {
		var self = this;
		var data = {};
		if (self.removeEl) {
			if (self.removeEl.attr('newPlate') != "false") {
				self.removeEl.remove();
				$('.ph-right').hide();
				self.allData[self.removeIndex].mallPageSubjectRelationResponse.splice(self.removeIndex,1)
			} else{
				data['leftId'] = self.leftId;
				data['subjectId'] = self.removeEl.attr('subjectId')
				var plateSort = self.removeEl.attr('plateSort')
				self.allData[self.removeIndex].mallPageSubjectRelationResponse.splice(plateSort,1);
				data['htmlTemplet'] = self.sendHtml()
			
				$.post(baseNew + 'page/deletePageTemplet.do',data,function (res) {
					if (res.status == 'success') {
						self.removeEl.remove();
						$('.ph-right').hide();
						self.allData[self.removeIndex].mallPageSubjectRelationResponse.splice(self.removeIndex,1)
					} else{
						$.Huimodalalert(res.message, 2000);
					}
				})
			}
		}
		
		$("#modal-demo").modal("hide")
	}
	
	//上下移动
	,up: function (el) {
		var $self = $(el),
		curBox = $self.closest('div'),
		prevBox = $self.closest('div').prev(),
		index = curBox.index()
		if (prevBox.length == 0) {
			$.Huimodalalert("第一行啦!", 2000);
			return
		} else{
			prevBox.before(curBox)
			var opt = this.allData[index].mallPageSubjectRelationResponse[index]
			this.allData[index].mallPageSubjectRelationResponse[index] = this.allData[index].mallPageSubjectRelationResponse[index - 1]
			this.allData[index].mallPageSubjectRelationResponse[index - 1] = opt;
			//$.Huimodalalert("重新排序后需保存才生效!", 2000);
		}
	}
	,down: function (el) {
		var $self = $(el),
		curBox = $self.closest('div'),
		nextBox = $self.closest('div').next(),
		index = curBox.index()
		if (nextBox.length == 0) {
			$.Huimodalalert("最后行啦!", 2000);
			return
		} else{
			nextBox.after(curBox)
			var opt = this.allData[index].mallPageSubjectRelationResponse[index]
			this.allData[index].mallPageSubjectRelationResponse[index] = this.allData[index].mallPageSubjectRelationResponse[index + 1]
			this.allData[index].mallPageSubjectRelationResponse[index + 1] = opt;
			//$.Huimodalalert("重新排序后需保存才生效!", 2000);
		}
	}
	//置顶置底
	,toTop: function (el) {
		var $self = $(el),
		curBox = $self.closest('div'),
		index = curBox.index();
		if ($('.plate-wrap .plate').length > 1 && curBox.index() != 0){
			curBox.insertBefore($('.plate-wrap .plate:first'))
			var removeArr = this.allData[index].mallPageSubjectRelationResponse.splice(index,1)
			this.allData[index].mallPageSubjectRelationResponse.unshift(removeArr[0])
			//$.Huimodalalert("重新排序后需保存才生效!", 2000);
		}
	}
	,toBtm: function (el) {
		var $self = $(el),
		curBox = $self.closest('div'),
		index = curBox.index();
		if ($('.plate-wrap .plate').length > 1 && curBox.index() != $('.plate-wrap .plate').length -1){
			curBox.insertAfter($('.plate-wrap .plate:last'))
			var removeArr = this.allData[index].mallPageSubjectRelationResponse.splice(index,1)
			this.allData[index].mallPageSubjectRelationResponse.push(removeArr[0])
			//$.Huimodalalert("重新排序后需保存才生效!", 2000);
		}
	}
	
	//添加主题
	,clickAdd: function (el) {
		this.addType = $(el).attr('addType')
		if (this.addType == 'banner') {
			$('.add-ul li:first').siblings().hide()
		} else {
			$('.add-ul li:first').siblings().show()
		}
		var clientHeight = $(el).closest('.add-wrap').position().top
		$('.add-pop').css('margin-top',clientHeight)
		$('.ph-right').hide()
		$('.add-pop').show()
	}
	
	//编辑主题
	,clickBanner: function (el,type) {
		var self = this;
		var $el = $(el)
		var clientHeight = $el.position().top;
		$('.ph-right').css('margin-top',clientHeight)
		
		//编辑删除操作未保存
		if (self.isDelect) {
			$.Huimodalalert("请先保存删除", 2000);
					return false;
		}
		
		$('#ph-madel-name').val($el.attr('subjectName'))
		
		//是商品还是banner图
		if (type == 'banner' || type == 'fixedBanner' || type == 'banner2' || type == 'activity') {
			$('.add-img-box').show()
			$('.ph-goods').hide()
		} else{
			$('.add-img-box').hide()
			$('.ph-goods').show()
		}
		
		var subjectType = $el.attr('subjectType')
		
		var index = $el.index() + $('.firstBanner .plate').length;
		//渲染弹窗图片模块
		if (type == 'fixedBanner') {
			if (self.fixedBannerData.subjectId) {
				self.isNew = false
				$('.ph-save').attr('subjectId',self.fixedBannerData.subjectId)
				$('.ph-save').attr('pageId',$el.attr('pageId'))
			} else{
				self.isNew = true
			}
			self.imgList = self.fixedBannerData.mallPageSubjectRelationResponse;
		} else{
			if (self.allData[index].subjectId) {
				self.isNew = false
				$('.ph-save').attr('subjectId',self.allData[index].subjectId)
				$('.ph-save').attr('pageId',$el.attr('pageId'))
			} else{
				self.isNew = true
			}
			self.imgList = self.allData[index].mallPageSubjectRelationResponse;
		}
		self.renderImgLi(type,self.imgList)
		
		$('.ph-save').attr('subjectSortNo',index)
		$('.ph-save').attr('subjectType',subjectType)
		$('.ph-delect').attr('subjectType',subjectType)
		$('.add-pop').hide()
		$('.ph-right').show()
		$('.ph-img-list li:first').click()
	}
	//渲染弹窗图片模块    goodsId为商品skuId
	,renderImgLi: function (type,data) {
		//是banner模块还是商品模块或者固定数量的模块
		if (type == 'banner' || type == 'fixedBanner') {//banner大图
			var liStr = '';
			if (data.length > 0){
				$.each(data,function(i,item) {
					liStr += '<li imgLink="'+ item.imgLink +'"  imgUrl="'+ item.imageUrl +'">图片<span>'+ (i+1) +'</span></li>'
				});
			} else {
				liStr += '<li imgLink=""  imgUrl="">图片<span>1</span></li>'
			}
			$('.ph-img-list').empty().append($(liStr))
			$('.ph-goods').hide()
			$('.ph-add-img').show()
			$('.ph-img').show()
		} else if(type == 'banner2'){//banner一行2个
			if (data.length > 0) {
				var liStr = '<li imgLink="'+ data[0].imgLink +'"  imgUrl="'+ data[0].imageUrl +'">图片<span>1</span></li><li goodsId="'+ data[0].goodsId +'" imgLink="'+ data[0].imgLink +'"  imgUrl="'+ data[0].imageUrl +'">图片<span>2</span></li>';
			} else{
				var liStr = '<li>图片<span>1</span></li><li>图片<span>2</span></li>';
			}
			$('.ph-img-list').empty().append($(liStr))
			$('.ph-goods').hide()
			$('.ph-add-img').hide()
			$('.ph-img').show()
		} else if(type == 'goods'){//商品一行1/2个
			var liStr = '';
			if (data.length > 0) {
				$.each(data, function(i,item) {
					liStr += '<li goodsId="'+ item.goodsId +'" skuName="'+ item.skuName +'" thumb="'+ item.thumb +'">图片<span>'+ (i+1) +'</span></li>'
				});
			} else{
				liStr += '<li goodsId="">图片<span>1</span></li>'
			}
			$('.ph-img-list').empty().append($(liStr))
			$('.ph-img').hide()
			$('.ph-add-img').show()
			$('.ph-goods').show()
		} else if(type == 'goods3'){//商品一行3个
			if (data.length > 0) {
				var liStr = '<li goodsId="'+ data[0].goodsId +'" skuName="'+ data[0].skuName +'" thumb="'+ data[0].thumb +'">图片<span>1</span></li><li goodsId="'+ data[1].goodsId +'"skuName="'+ data[1].skuName +'" thumb="'+ data[1].thumb +'">图片<span>2</span></li><li goodsId="'+ data[2].goodsId +'" skuName="'+ data[2].skuName +'" thumb="'+ data[2].thumb +'">图片<span>3</span></li>';
			} else{
				var liStr = '<li>图片<span>1</span></li><li>图片<span>2</span></li><li>图片<span>3</span></li>';
			}
			$('.ph-img-list').empty().append($(liStr))
			$('.ph-goods').show()
			$('.ph-add-img').hide()
			$('.ph-img').hide()
		} else {//活动
			if (data.length > 0) {
				var liStr = '<li imgLink="'+ data[0].relationUrl +'"  imgUrl="'+ data[0].imageUrl +'">图片<span>1</span></li><li goodsId="'+ data[1].goodsId +'" imgLink="'+ data[1].relationUrl +'"  imgUrl="'+ data[1].imageUrl +'">图片<span>2</span></li><li imgLink="'+ data[2].relationUrl +'"  imgUrl="'+ data[2].imageUrl +'">图片<span>3</span></li>';
			} else{
				var liStr = '<li>图片<span>1</span></li><li>图片<span>2</span></li><li>图片<span>3</span></li>';
			}
			$('.ph-img-list').empty().append($(liStr))
			$('.ph-goods').hide()
			$('.ph-add-img').hide()
			$('.ph-img').show()
		}
	}
	
	//选择模块
	,choosePlate: function (el) {
		var type = $(el).attr('type');
		var bannerLen = 0//$('.firstBanner .plate').length
		switch (type){
			case 'ms':
				var num = $('.line-one').length
				var msStr = '<div newPlate="true" subjectType="ACTIVITY_SECKILL" class="mt-10 plate ms-plate ms-plate-'+ num +'">' +
								'<p id="ms-panel-title" class="ph-panel-title">秒杀板块</p>' +
								'<a href="javascript:;" class="remove">X</a>' +
								'<span class="change-box"><a class="go-top" href="javascript:;"></a><a class="up ml-3" href="javascript:;"></a><a class="down ml-3" href="javascript:;"></a><a class="go-foot" href="javascript:;"></a></span>' +
								'<div class="ms-left"><p class="click-me">点击进行编辑</p></div>' +
								'<div class="ms-right">' +
									'<div class="ms-right-opt"><p class="click-me">点击进行编辑</p></div>' +
									'<div class="ms-right-opt"><p class="click-me">点击进行编辑</p></div>' +
								'</div>' +
							'</div>'
				
				$('.plate-wrap').append($(msStr))
				$('.add-pop').hide()
				var sort = $('.plate-wrap .plate').length - 1 + bannerLen
				this.allData.push({'mallPageSubjectRelationResponse':[{'sortNo': 0},{'sortNo': 1},{'sortNo': 2}],'sortNo': sort})
				$('.ms-plate-' + num).click()
				break;
			case 'banner1':
				var num = $('.line-one').length
				var subjectType,sortHtml;
				if (this.addType == 'banner') {
					subjectType = 'FIXED_BANNER';
					sortHtml = '';
				} else{
					subjectType = 'BANNER';
					sortHtml = '<a href="javascript:;" class="remove">X</a><span class="change-box"><a class="go-top" href="javascript:;"></a><a class="up ml-3" href="javascript:;"></a><a class="down ml-3" href="javascript:;"></a><a class="go-foot" href="javascript:;"></a></span>'
				}
				var bannerStr1 = '<div newPlate="true" subjectType="'+ subjectType +'" class="ph-head-banner plate line-one line-one-'+ num +'">' +
									sortHtml +
									'<div class="swiper-container swiper-container2 height_112">' +
									   ' <div class="swiper-wrapper height_112 ph-top-banner-box">' +
									    	'<div class="swiper-slide ph-banner-edit"> <a class="top-banner-a" href="javascript:;"><p>点击我进行编辑</p></a></div>' +
									    '</div>' +
								    	'<div class="swiper-pagination"></div>' +
									'</div>' +
								'</div>'
				if (this.addType == 'banner') {
					$('.firstBanner').empty().append($(bannerStr1))
					$.each(this.allData, function(i,item) {
						item.sortNo += 1
					});
					this.allData.unshift({'mallPageSubjectRelationResponse':[{'sortNo': 0}],'sortNo': 0})
					this.fixedBannerData = {'mallPageSubjectRelationResponse':[{'sortNo': 0}],'sortNo': 0}
				} else{
					$('.plate-wrap').append($(bannerStr1))
					var sort = $('.plate-wrap .plate').length - 1 + bannerLen
					this.allData.push({'mallPageSubjectRelationResponse':[{'sortNo': 0}],'sortNo': sort})
				}
				$('.add-pop').hide()
				$('.line-one-' + num).click()
				break;
			case 'banner2':
				var num = $('.line-two').length
				var bannerStr2 = '<div newPlate="true" subjectType="BANNER_TWO" class="mt-10 plate line-two line-two-'+ num +'">' +
									'<p id="two-panel-title" class="ph-panel-title">banner一行2个</p>' +
									'<a href="javascript:" class="remove">X</a>' +
									'<span class="change-box"><a class="go-top" href="javascript:;"></a><a class="up ml-3" href="javascript:;"></a><a class="down ml-3" href="javascript:;"></a><a class="go-foot" href="javascript:;"></a></span>' +
									'<div class="two-left"><p class="click-me">点击进行编辑</p></div>' +
									'<div class="two-right"><p class="click-me">点击进行编辑</p></div>' +
								'</div>'
				$('.plate-wrap').append($(bannerStr2))
				$('.add-pop').hide()
				var sort = $('.plate-wrap .plate').length - 1 + bannerLen
				this.allData.push({'mallPageSubjectRelationResponse':[{'sortNo': 0},{'sortNo': 1}],'sortNo': sort})
				$('.line-two-' + num).click()
				break;
			case 'goods3':
				var num = $('.three-goods').length
				var goodsStr3 = '<div newPlate="true" subjectType="GOODS_TREEE" class="mt-10 plate three-goods three-goods-'+ num +'">' +
									'<p id="three-panel-title" class="ph-panel-title">商品一行3个</p>' +
									'<a href="javascript:" class="remove">X</a>' +
									'<span class="change-box"><a class="go-top" href="javascript:;"></a><a class="up ml-3" href="javascript:;"></a><a class="down ml-3" href="javascript:;"></a><a class="go-foot" href="javascript:;"></a></span>' +
									'<div class="three-left"><p class="click-me">点我进行编辑</p></div>' +
									'<div class="three-mid"><p class="click-me">点我进行编辑</p></div>' +
									'<div class="three-right"><p class="click-me">点我进行编辑</p></div>' +
								'</div>'
				$('.plate-wrap').append($(goodsStr3))
				$('.add-pop').hide()
				var sort = $('.plate-wrap .plate').length - 1 + bannerLen
				this.allData.push({'mallPageSubjectRelationResponse':[{'sortNo': 0},{'sortNo': 1},{'sortNo': 2}],'sortNo': sort})
				$('.three-goods-' + num).click()
				break;
			case 'goods2':
				var num = $('.two-goods').length
				var goodsStr2 = '<div newPlate="true" subjectType="GOODS_TWO" class="ph-goods-panel mt-10 plate two-goods two-goods-'+ num +'">' +
									'<p id="goods-panel-title" class="ph-panel-title">商品一行2个</p>' +
									'<a href="javascript:" class="remove">X</a>' +
									'<span class="change-box"><a class="go-top" href="javascript:;"></a><a class="up ml-3" href="javascript:;"></a><a class="down ml-3" href="javascript:;"></a><a class="go-foot" href="javascript:;"></a></span>' +
									'<ul class="ph-goods-list">' +
										'<li><img src=""/><p>点击我进行编辑</p></li>' +
										'<li><img src=""/><p>点击我进行编辑</p></li>' +
										'<li><img src=""/><p>点击我进行编辑</p></li>' +
										'<li><img src=""/><p>点击我进行编辑</p></li>' +
									'</ul>' +
									'<p class="check-more">查看更多</p>' +
								'</div>'
				$('.plate-wrap').append($(goodsStr2))
				$('.add-pop').hide()
				var sort = $('.plate-wrap .plate').length - 1 + bannerLen
				this.allData.push({'mallPageSubjectRelationResponse':[{'sortNo': 0},{'sortNo': 1}],'sortNo': sort})
				$('.two-goods-' + num).click()
				break;
			case 'goods1':
			var num = $('.one-goods').length
				var goodsStr1 = '<div newPlate="true" subjectType="GOODS_ONE" class="mt-10 plate one-goods one-goods-'+ num +'">' +
									'<p id="goods-panel-title" class="ph-panel-title">商品一行1个</p>' +
									'<a href="javascript:" class="remove">X</a>' +
									'<span class="change-box"><a class="go-top" href="javascript:;"></a><a class="up ml-3" href="javascript:;"></a><a class="down ml-3" href="javascript:;"></a><a class="go-foot" href="javascript:;"></a></span>' +
									//'<img src="../../images/goods.png"/>' +
									'<p class="click-me">点击我进行编辑</p>'
								'</div>'
				$('.plate-wrap').append($(goodsStr1))
				$('.add-pop').hide()
				var sort = $('.plate-wrap .plate').length - 1 + bannerLen
				this.allData.push({'mallPageSubjectRelationResponse':[{'sortNo': 0},{'sortNo': 1},{'sortNo': 2}],'sortNo': sort})
				$('.one-goods-' + num).click()
				break;
			default:
				break;
		}
	}
	//选择图片序号
	,chooseImgNum: function (el) {
		var $self = $(el);
		$self.css('background','dodgerblue')
		$self.css('color','white')
		$self.siblings().css('background','ghostwhite')
		$self.siblings().css('color','black')
		
		var imgLink = $('#ph-madel-link').val();
		var imgUrl = $('#ph-madel-img').val();
		console.log("this.imgList:"+this.imgList);
		console.log("this.imgNum:"+this.imgNum);
		var sortNo = $self.find('span').text();
		var skuId =  $("#ph-skuId").val();
		if (this.imgList.length) {
			if (!this.isDelect) {
				if (this.isChange) {
					this.imgList[this.imgNum].relationUrl = imgLink;
					this.imgList[this.imgNum].imageUrl= imgUrl;
					this.imgList[this.imgNum].sortNo = this.imgNum;
					this.imgList[this.imgNum].goodsId = skuId;
				}
			}
			
		}
		this.imgNum = sortNo -1;
		console.log("imgNum:"+this.imgNum);
		$('#ph-madel-link').val(this.imgList[this.imgNum].relationUrl)
		$('#ph-madel-img').val(this.imgList[this.imgNum].imageUrl)
		$("#ph-skuId").val(this.imgList[this.imgNum].goodsId)
		this.isDelect = false;
		this.isChange = true;
		
		
		//商品信息是否显示
		var subjectType = $('.ph-save').attr('subjectType');
		if (subjectType == 'GOODS_ONE' || subjectType == 'GOODS_TWO' || subjectType == 'GOODS_TREEE') {
			if ($(el).attr("goodsId") != "null" && $(el).attr("goodsId") != "undefined" && $(el).attr("goodsId") != "") {
				console.log("skuID:"+$(el).attr("skuId"))
				$(".ph-ass").show();
	            $('#ph-skuId').val($(el).attr('goodsId'))
	            $(".ph-ass img").attr("src",imgPath+$(el).attr("thumb"));
	            $(".ph-ass p").text($(el).attr("skuName"));
			} else {
	            $(".ph-ass").hide();
	            $(".ph-ass img").attr("src","");
	            $(".ph-ass p").text("");
			}
			
		}
	}
	//点击加号方法
	,addImgLi: function () {
		var leftId = localStorage.getItem('leftId')
		this.imgList.push({sortNo:"",relationUrl:"",imageUrl:"",goodsId:""})
		console.log(this.imgList)
		var num = $('.ph-img-list li:last-child span').text();
			num =Number(num) + 1
		var liStr = '<li>图片<span>'+num+'</span></li>';
		$(liStr).appendTo('.ph-img-list')
		$('.ph-img-list li:last').click()
	}
	
		//弹窗方法开始
	,openGoodsPop: function () {
		var self = this;
		$.get(base + 'plate/getClassify.do',function (res) {
			if (res.status == 0) {
				self.treeList(res.data,1);
				var data = {};
				self.queryGoods(data,0);
			}
		})
		$('.pop_goods').show()
	}
	
	//保存编辑方法
	,saveEdit: function (el) {
		var self = this;
		var data = {};
		var subjectSortNo = $(el).attr('subjectSortNo')
		var subjectName = $('#ph-madel-name').val();
		var imgLink = $('#ph-madel-link').val();
		var imgUrl = $('#ph-madel-img').val();
		var skuId =  $("#ph-skuId").val();
		if (self.imgList.length) {
				self.imgList[self.imgNum].relationUrl = imgLink;
				self.imgList[self.imgNum].imageUrl = imgUrl;
				self.imgList[self.imgNum].sortNo = self.imgNum;
				self.imgList[self.imgNum].goodsId = skuId;
		}
		
		
		//是新增还是编辑
		var url;
		if (self.isNew) {
			url = 'page/savePageTemplet.do'
		} else{
			url = 'page/editPageTemplet.do'
			data['subjectId'] = $(el).attr('subjectId');
			data['pageId'] = $(el).attr('pageId');
		}
		
		data['leftId'] = self.leftId;
		data['pageName'] = self.pageName;
		data['subjectType'] = $(el).attr('subjectType');
		data['subjectSortNo'] = $(el).attr('subjectSortNo');
		data['subjectName'] = subjectName;
		data['detailList'] = JSON.stringify(self.imgList);
		data['htmlTemplet'] = self.sendHtml();
		data['htmlFileName'] = 'leftId' + self.leftId +'.html'
		
		$.post(baseNew + url,data,function (res) {
			if (res.status == 'success') {
				self.isDelect = false
				$('.ph-right').hide()
				$.Huimodalalert("主题信息保存成功", 2000);
				self.initData(self.leftId);
			}
		})
		
	}
	
	//点击删除方法
	,clearPop: function (el) {
		var type = $(el).attr('subjectType')
		if (type == 'BANNER_TWO' || type == 'ACTIVITY_SECKILL' || type == 'GOODS_TREEE') {
			this.imgList[this.imgNum]['goodsId'] = '';
			this.imgList[this.imgNum]['thumb'] = '';
			this.imgList[this.imgNum]['skuName'] = '';
			this.imgList[this.imgNum]['relationUrl'] = '';
			this.imgList[this.imgNum]['imageUrl'] = '';
		} else{
			$('.ph-img-list li:last').remove();
			for (var i=this.imgNum+1;i<this.imgList.length;i++) {
				this.imgList[i]['sortNo'] = this.imgList[i]['sortNo'] - 1;
			}
			this.imgList.splice(this.imgNum,1);
		}
		$('.ph-img-list li').eq(this.imgNum).attr('goodsId','')
		$('.ph-img-list li').eq(this.imgNum).attr('thumb','')		
		$('.ph-img-list li').eq(this.imgNum).attr('skuName','')
		$('.ph-img-list li').eq(this.imgNum).attr('imgLink','')
		$('.ph-img-list li').eq(this.imgNum).attr('imageUrl','')
		this.isDelect = true;
		$('.ph-img-list li:last').click()
		

	}
	//点击查看更多
	,checkMore: function () {
		var goodsListStr = '';
		//商品列表加载
		$.each(this.goodsListMore, function(i,goodsItem) {
			goodsListStr += '<li><img src="'+ goodsItem.imageUrl +'"></li>' 
		});
		$(goodsListStr).appendTo('.ph-goods-list')
		$('.check-more').hide()
	}
	//发布主题
	,issue: function () {
		var self = this;
		$.post(baseNew + 'page/publishPlate.do',{htmlFileName: 'leftId' + self.leftId +'.html'},function (res) {
			$.Huimodalalert(res.message, 2000);
		})
	}
	//保存左边排序信息
	,saveLeft: function () {
		var self = this;
		var plateArr = $('.plate-wrap .plate');
		var bannerArr = $('.firstBanner .plate');
		var valueArr = [];
		var data = {};
		if (bannerArr.length > 0) {
			var valueObj = {};
			valueObj.subjectId = bannerArr.attr('subjectId');
			valueObj.sortNo = 0;
			valueArr.push(valueObj)
		}
		$.each(plateArr, function(i,item) {
			var valueObj = {};
			valueObj.subjectId = $(item).attr('subjectId');
			valueObj.sortNo = bannerArr.length > 0 ? i+1 : i;
			valueArr.push(valueObj)
		});
		
		data['htmlTemplet'] = self.sendHtml()
		data['mallPageSubjectListStr'] = JSON.stringify(valueArr)
		$.post(baseNew + 'page/sortPageTemplet.do',data,function (res) {
			if (res.status == 'success') {
				$.Huimodalalert("保存成功", 2000);
				self.initData()
			} else{
				$.Huimodalalert(res.message, 2000);
			}
		})
		
	}
	
	//选择商品确定
    ,goodsSubmit: function () {
        var checkbox = $('.link_goods input[type=radio]:checked');
        if(checkbox.length){
            $(".ph-ass").show();
            var skuId = $(checkbox).closest('li').attr('skuId');
            $("#ph-skuId").val(skuId);
            $(".ph-acon img").attr("src",$(checkbox).closest('li').children("img").attr("src"));
            $(".ph-acon p").text($(checkbox).closest('li').children(".link_name").text());
            $('.pop_goods').hide();
            $('.pop_add').show();
        }else{
            $.Huimodalalert("请选择关联商品", 2000);
        }
    }
	
	//请求商品列表
	,queryGoods: function (data,obj) {
		var self = this;
		data.pageNum = (obj && obj.curr) || 1 // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
		$.get(base + 'menu/getConnectGoodsList.do',data,function (res) {
			if (res.status == 0) {
				$("#link_goods").empty().append($('#popGoodsList').tmpl(res.data));
				
				//设置分页
				setPagination({
			       elem: $('#pop_pagination'),
			       totalCount: res.dataCount,
			       curr: data.pageNum,
				   callback: function (obj) {
				   			$("#link_goods").empty()
                            self.queryGoods(data,obj);
                        }
			   });
			}
		})
	}
	
	,sendHtml: function () {
		var self = this;
		var htmlStr = '';
		var data = JSON.stringify(self.allData)
		var bannerNum = 0,
			banner2Num = 0,
			goods1Num = 0,
			goods2Num = 0,
			goods3Num = 0,
			msNum = 0;
		
		$.each(self.allData,function (i,item) {
			switch (item.subjectType){
				case 'FIXED_BANNER':
					htmlStr = '<banner-one :order="0" :data="banners"></banner-one>' + htmlStr
					break;
				case 'BANNER':
					htmlStr += '<banner-one :order="'+ bannerNum +'" :data="banners"></banner-one>';
					bannerNum++
					break;
				case 'BANNER_TWO':
					htmlStr += ' <banner-two :order="'+ banner2Num +'" :data="bannerTwoData"></banner-two>';
					banner2Num++
					break;
				case 'ACTIVITY_SECKILL':
					htmlStr += ' <ms-list :order="'+ msNum +'" :data="msList" :time-wrap="timeWrap"></ms-list>';
					msNum++
					break;
				case 'GOODS_ONE':
					htmlStr += '<goods-one :order="'+ goods1Num +'" :data="goodsOneData"></goods-one>';
					goods1Num++
					break;
				case 'GOODS_TWO':
					htmlStr += ' <goods-two :order="'+ goods2Num +'" :data="goodsTwoData"></goods-two>';
					goods2Num++
					break;
				default: //GOODS_TREEE
					htmlStr += '<goods-three :order="'+ goods3Num +'" :data="goodsThreeData"></goods-three>';
					goods3Num++
					break;
			}
		})
		var bannerHtml = '<!DOCTYPE html>' +
						'<html lang="en">' +
						'<head>' +
						    '<meta charset="UTF-8">' +
						    '<meta name="apple-mobile-web-app-capable" content="yes">' +
						    '<meta name="format-detection" content="telephone=no">' +
						    '<meta name="apple-mobile-web-app-status-bar-style" content="black">' +
						    '<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=0">' +
						    '<title>分期商城</title>' +
						
						    '<link rel="stylesheet" type="text/css" href="../js/plugins/swiper/css/swiper.min.css">' +
						    '<link rel="stylesheet" type="text/css" href="../css/reset.css">' +
						    '<link rel="stylesheet" type="text/css" href="../css/newHot.min.css">' +
						
						    '<script type="text/javascript" src="../js/public/response.js"></script>' +
						    '<script type="text/javascript" src="../js/public/jquery-3.2.1.min.js"></script>' +
						    '<script type="text/javascript" src="../js/public/common.js"></script>' +
						    '<script type="text/javascript" src="../js/public/vue.min.js"></script>' +
						    '<script type="text/javascript" src="../js/plugins/swiper/js/swiper.min.js"></script>' +
						'</head>' +
						'<body>' +
							'<init-data class="init-data" hidden="true">'+ data +'</init-data>' +
						    '<section class="main-body" :class="{one-px-style:onePx}" id="mainBody" v-cloak>' +
						        '<!-- 导航区域 -->' +
						       ' <nav-top :message-num="messageNum" :nav-fix="navFix"></nav-top>' +
						        htmlStr +
						   ' </section>' +
						
						    '<script type="text/javascript" src="../js/page/hot.js"></script>' +
						'</body>' +
						'</html>'
						
		
		return bannerHtml;
	}
	
	//启动板块轮播
	,openPlateSwiper: function (classNum) {
		console.log("classNum:"+classNum)
		var mySwipers = new Swiper('.swiper-container' + classNum, {
			autoplay: 2000,//可选选项，自动滑动
			width:320,
			height: 100,
			prevButton:'.swiper-button-prev',
			nextButton:'.swiper-button-next',
			initialSlide :0,
			grabCursor : true,//鼠标为手指形状
			mousewheelControl : true,//开启鼠标控制Swiper切换。
			keyboardControl : true,//使用键盘方向键控制slide滑动
			pagination : '.swiper-pagination-2',//分页器
			paginationClickable :true,
		})
	}
	//图片上传
	,upLoadImg: function () {
		$("#file").change(function(){
            var formData = new FormData();
            formData.append("file", $("#file").get(0).files[0]);
            $.ajax({
                url: base+"common/upload",
                type: "POST",
                processData: false,
                contentType: false,
                data: formData,
                dataType:"JSON",
                success: function(data){
                    if(data.status=='0'){
                        console.log(data);
                        var imgVal = $('#ph-madel-img');
						if (imgVal) {
							imgVal.val(data.data)
						}
                    }else{
                        $.Huimodalalert(data.message, 2000);
                    }
                }
            });

        });
	}
	
		//树形列表
	,treeList:function (obj) {
		var self = this;
		/*递归实现获取无级树数据并生成DOM结构*/
		var str = "";
		var forTree = function(o,num){
			
		 	for(var i=0;i<o.length;i++){
		   		 var urlstr = "";
				 try{	
				 		urlstr = "<div><span class='tree_span"+num+"' leftId='"+o[i]["leftId"]+"'><b>[+]</b>"+ o[i]["leftMenuName"] +"</span><ul>";
				 		if (o[i]["rightMenusExtend"].length) {
				 			$.each(o[i]["rightMenusExtend"], function(i,item) {
				 				urlstr += "<div><span class='tree_span"+num+"' rightId='"+item.rightId+"'><img src='../../images/sub.gif'/>"+ item.rightMenuName +"</span>";
				 			});
				 			
				 		}
				 		 				
		 			str += urlstr;
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
				data['rightId'] = $(this).attr('rightId')
				if (data['rightId']) {
					self.queryGoods(data,0)
				}
				
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
pageNew.init()