/*
 * liangjiacheng
 * 2017/06/07
 */
var pagePhone = {
	init: function () {
		this.goodsListMore;
		this.data = [];
		this.leftId = '';
		this.isDelect = false;
		this.isOpenSwiper = true;
		this.plateCode = '';
		this.leftId = '';
		this.isChange = false;
		this.imgList = [{leftId:"",plateCode:this.plateCode,imgSort:"",imgLink:"",imgUrl:"",skuId:"",terminal:0}];
		this.imgNum = 0;
		this.bindEvents();
		this.upLoadImg()
	},
	
	bindEvents: function () {
		var self = this;
//      $(".pannel-discover").click();

		//点击轮播图片切换面板
		$('#left-menu-panel').on('click','.change-panel',function () {
			self.changePanel(this)
		})
		
		//点击顶部banner打开弹窗
		$('.ph-top-banner-box').on('click','.top-banner-a',function (ev) {
			self.cliTopBanner(this,"#ph-head-banner","ME01")
		})
		$('.ph-top-banner-box').on('click','.click-edit',function () {
			self.cliTopBanner(this,"#ph-head-banner","ME01")
		})
		
		//点击商品打开弹窗
		$('.ph-goods-list p').on('click',function (ev) {
			self.cliTopBanner(this,"#ph-goods-panel","ME02")
		})
		$('.ph-goods-list').on('click','li',function (ev) {
			self.cliTopBanner(this,"#ph-goods-panel","ME02")
		})
		
		//点击底部banner图片打开编辑主题弹窗
		$('.ph-foot-banner-box').on('click','.show-pop',function (ev) {
			self.cliTopBanner(this,"#ph-foot-banner","ME03")
		})
		$('.ph-foot-banner-box').on('click','.click-edit',function () {
			self.cliTopBanner(this,"#ph-foot-banner","ME03")
		})
		
		//点击底部推荐商品图片打开编辑主题弹窗
		$('.ph-recomd-list li').on('click',function (ev) {
			self.cliTopBanner(this,"#ph-recomd-panel","ME04")
		})
		$('.ph-recomd-list').on('click','li',function (ev) {
			self.cliTopBanner(this,"#ph-recomd-panel","ME04")
		})
		//关闭编辑主题弹窗
		$('.ph-close').on('click',function (ev) {
			$('.ph-img-list li').css('background','ghostwhite')
			$('.ph-img-list li').css('color','black')
			$('.ph-save').attr('imgsort','')
			$('.ph-right').hide()
			self.isDelect = false;
		})

		//选择图片号码
		$('.ph-img-list').on('click','li',function (ev) {
			self.chooseImgNum(this)
		})
		//点击加号
		$('.ph-add-img').on('click',function (ev) {
			self.addImgLi()
		})
		
		//点击保存
		$('.ph-save').on('click',function (ev) {
			self.saveEdit(this);
		})
		//点击删除
		$('.ph-delect').on('click',function (ev) {
			self.clearPop()
		})
		//点击查看更多
		$('.check-more').on('click',function (ev) {
			self.checkMore();
		})
		
		//点击发布
		$('.ph-issue').on('click',function (ev) {
			self.issue();
		})
		
		
		//商品弹窗方法开始
		//关闭弹窗
		$('.close_btn, .pop_cancel').on('click',function () {
			$('.pop_goods').hide()
		})
		//打开弹窗，初始化商品列表
		$('.open-pop').on('click',function (ev) {
			self.openPop()
		})
		//点击搜索
		$('#screeBtn').on('click',function (ev) {
			self.search()
		})
		//重置
		$('#resetBtn').bind('click',function (ev) {
			util.reset()
		})
		
		//点击弹窗确定
		$('.pop_goods_submit').on('click',function (ev) {
			self.goodsSubmit();
		})
		//商品弹窗方法结束
		
	}
	
	//列表加载、筛选
    ,search: function(){
        this.param = util.serialize();
        this.detParam = this.param;
        this.queryGoods(this.detParam,0)
    }
	
	//弹窗方法开始
	,openPop: function () {
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
	
	//弹窗方法结束
	
	//切换面板
	,changePanel: function (el) {
		$('.ph-right').hide();
		var leftId = $(el).attr('leftId');
		this.initQuery(leftId);
		$('.phone-main').attr('leftId',leftId)
		//给轮播容器添加class
		$('.swiper-container2').addClass('swiper-container-' + leftId)
		$('.phone-main').show()
		
	}
	//判断空对象
	,isEmptyObject: function (e) {
		var t;  
	    for (t in e)  
	        return !1;  
	    return !0  
	}
	//加载数据
	,initQuery: function (leftId) {
		var self = this;
		$.get(base + 'plate/getPlate.do', {leftId:leftId},function  (res) {
			if (res.status == 0) {
				if (res.data) {
					var topBannerStr = '',
						goodsListStr = '',
						footBannerStr = '',
						recomdStr = '',
						goodsListNow;
						
						
						this.data = res.data;
						//顶部banner加载
						if (res.data.ME01) {
							console.log(res.data.ME01)
							$.each(res.data.ME01.plateImageList, function(i,topItem) {
								topBannerStr += '<div class="swiper-slide ph-banner-edit"> <a class="top-banner-a" href="javascript:;"><img src="'+ imgPath + topItem.imgUrl +'"/><p>点击我进行编辑</p></a></div>' 
							});
							$('.ph-top-banner-box').empty();
							$(topBannerStr).appendTo('.ph-top-banner-box')
							$('.ph-top-banner-box').closest('.swiper-container2').addClass('swiper-container'+leftId)
						} else {
							topBannerStr = '<p class="click-edit">点击我进行编辑</p>';
							$('.ph-top-banner-box').empty();
							$(topBannerStr).appendTo('.ph-top-banner-box')
						}
						
						//商品列表加载
						if (res.data.ME02) {
							if (res.data.ME02.plateImageList.length > 4) {
								goodsListNow = res.data.ME02.plateImageList.slice(0,4);
								self.goodsListMore = res.data.ME02.plateImageList.slice(4)
							}
							if (res.data.ME02.plateImageList.length > 4) {
								$.each(goodsListNow, function(j,goodsItem) {
									goodsListStr += '<li><img src="'+ imgPath + goodsItem.imgUrl +'"><p>点击我进行编辑</p></li>' 
								});
								$('.ph-goods-list').empty();
								$(goodsListStr).appendTo('.ph-goods-list')
							} else {
								var $img = $('.ph-goods-list img');
								$.each(res.data.ME02.plateImageList, function(j,goodsItem) {
									var imgUrl = imgPath + goodsItem.imgUrl
									$img.eq(j).attr('src',imgUrl)
								});
							}
							$('#goods-panel-title').text(res.data.ME02.plateName)
						} else {
							$('.ph-goods-list li img').attr('src','')
						}
						
						//底部banner加载
						if (res.data.ME03) {
							$.each(res.data.ME03.plateImageList, function(k,footItem) {
								footBannerStr += '<div class="swiper-slide ph-banner-edit"> <a class="show-pop" href="javascript:;"><img src="'+ imgPath + footItem.imgUrl +'"/><p>点击我进行编辑</p></a></div>' 
							});
							$('.ph-foot-banner-box').empty();
							$(footBannerStr).appendTo('.ph-foot-banner-box')
							$('#foot-banner-title').text(res.data.ME03.plateName)
							$('.ph-foot-banner-box').closest('.swiper-container2').addClass('swiper-container'+leftId)
						} else {
							footBannerStr = '<p class="click-edit">点击我进行编辑</p>'
							$('.ph-foot-banner-box').empty();
							$(footBannerStr).appendTo('.ph-foot-banner-box')
						}
						
						
						//底部推荐商品加载
						if (res.data.ME04) {
							$.each(res.data.ME04.plateImageList, function(l,recomdItem) {
								recomdStr += '<li><img src="'+ imgPath + recomdItem.imgUrl +'"><p>点击我进行编辑</p></li>'
							});
							$('.ph-recomd-list').empty();
							$(recomdStr).appendTo('.ph-recomd-list')
							$('#recomd-panel-title').text(res.data.ME04.plateName)
						} else {
							recomdStr = '<li><img src=""><p>点击我进行编辑</p></li>' 
							$('.ph-recomd-list').empty();
							$(recomdStr).appendTo('.ph-recomd-list')
						}
						
						self.openPlateSwiper(leftId);
				}
					
				
			}
		})
	}
	//打开弹窗
	,cliTopBanner:function (el,elem,num) {
		var self = this;
		if (self.isDelect) {
			$.Huimodalalert("请先保存删除", 2000);
					return false;
		}
		var plateCode = $(el).parents(elem).attr('plateCode')
		self.plateCode = plateCode;
		var topHeight = $(elem).offset().top;
		var mainTopHeight = $('#phone-main').offset().top;
		var marginTop = topHeight - mainTopHeight;
		var title = $(elem).find('.ph-panel-title').text();
		$('#ph-madel-name').val(title)
		$('.ph-right').css('margin-top',marginTop)
//		var leftId = $('#phone-main').attr('leftId');
		var leftId = localStorage.getItem('leftId');
		if (self.imgList.length) {
			self.imgList[0]['leftId'] = leftId;
			self.imgList[0]['plateCode'] = plateCode;
		}
		
		//添加商品是否显示
		if (num == "ME02" || num == "ME04") {
			$('.ph-goods').show()
			$('.ph-ass').show()
		} else {
			$('.ph-goods').hide()
			$('.ph-ass').hide()
		}
		
		var data = {};
			data['leftId'] = leftId;
			data['plateCode'] = plateCode;
		$.get(base + 'plate/getPlate.do',data,function (res) {
			if (res.status == 0) {
				console.log(num)
				if (!self.isEmptyObject(res.data)) {
					var imgData;
					if (num == "ME01" && res.data.ME01.plateImageList.length) {
						imgData = res.data.ME01.plateImageList
						$('#ph-madel-name').val(res.data.ME01.plateName)
					} else if(num == "ME02" && res.data.ME02.plateImageList.length){
						imgData = res.data.ME02.plateImageList
					} else if (num == "ME03" && res.data.ME03.plateImageList.length) {
						imgData = res.data.ME03.plateImageList
					} else if (num == "ME04" && res.data.ME04.plateImageList.length) {
						imgData = res.data.ME04.plateImageList
					}
					if (imgData) {
						var liStr = '';
						$.each(imgData, function(i,item) {
							liStr += '<li plateImgId="'+item.plateImgId+'" skuId="'+item.skuId+'" skuName="'+item.skuName+'" thumb="'+item.thumb+'" plateName="'+item.plateName+'" imgLink="'+item.imgLink+'" imgUrl="'+item.imgUrl+'" >图片<span>'+ (i+1) +'</span></li>'
						});
						
						self.imgList = [];
						for (var i=0;i<imgData.length;i++) {
							self.imgList.push({leftId:leftId,plateCode:plateCode,imgSort:imgData[i].imgSort,imgLink:imgData[i].imgLink,imgUrl:imgData[i].imgUrl,skuId:imgData[i].skuId,terminal:0})
							
						}
						
						$('.ph-img-list').empty()
						$('.ph-img-list').append($(liStr));
						$('.ph-img-list li:first').click()
					}
				} else {
					var liStr = '<li skuId="">图片<span>1</span></li>';
					$('#ph-madel-link').val('');
					$('#ph-madel-img').val('');
					$("#ph-skuId").val('');
					$('.ph-img-list').empty()
					$('.ph-img-list').append($(liStr));
					$('.ph-img-list li:last').click()
				}
			}
		})
		
		$('.ph-save').attr('plateCode',plateCode)
		$('.ph-save').attr('imgsort','')
		$('.ph-right').attr('plateNum',num)
		$('.ph-right').show()
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
		var imgSort = $self.find('span').text();
		var skuId =  $("#ph-skuId").val();
		if (this.imgList.length) {
			if (!this.isDelect) {
				if (this.isChange) {
					this.imgList[this.imgNum]['imgLink'] = imgLink;
					this.imgList[this.imgNum]['imgUrl'] = imgUrl;
					this.imgList[this.imgNum]['imgSort'] = this.imgNum +1;
					this.imgList[this.imgNum]['skuId'] = skuId;
					console.log(this.imgList);
				}
			}
			
		}
		this.imgNum = imgSort -1;
		console.log("imgNum:"+this.imgNum);
//		console.log("imgNum2222:"+this.imgList[this.imgNum]['imgLink']);
		$('#ph-madel-link').val(this.imgList[this.imgNum]['imgLink'])
		$('#ph-madel-img').val(this.imgList[this.imgNum]['imgUrl'])
		$("#ph-skuId").val(this.imgList[this.imgNum]['skuId'])
		this.isDelect = false;
		this.isChange = true;
		
		var plateCode = $('.ph-save').attr('plateCode');
		if (plateCode == 'ME02' || plateCode == 'ME04') {
			if ($(el).attr("skuId")) {
				console.log('2222222')
				console.log("skuID:"+$(el).attr("skuId"))
				$(".ph-ass").show();
	            $('#ph-skuId').val($(el).attr('skuId'))
	            $(".ph-ass img").attr("src",imgPath+$(el).attr("thumb"));
	            $(".ph-ass p").text($(el).attr("skuName"));
			} else {
				console.log('111111')
	            $(".ph-ass").hide();
	            $(".ph-ass img").attr("src","");
	            $(".ph-ass p").text("");
			}
			
		}




	}
	
	//点击加号方法
	,addImgLi: function () {
		var leftId = localStorage.getItem('leftId')
		this.imgList.push({leftId:leftId,plateCode:this.plateCode,imgSort:"",imgLink:"",imgUrl:"",skuId:"",terminal:0})
		console.log(this.imgList)
		var num = $('.ph-img-list li:last-child span').text();
			num =Number(num) + 1
		var liStr = '<li>图片<span>'+num+'</span></li>';
		$(liStr).appendTo('.ph-img-list')
		$('.ph-img-list li:last').click()
	}
	
	//保存编辑方法
	,saveEdit: function (el) {
		var self = this;
		var data = {};
		var plateName = $('#ph-madel-name').val();
		var imgLink = $('#ph-madel-link').val();
		var imgUrl = $('#ph-madel-img').val();
		var skuId =  $("#ph-skuId").val();
		if (self.imgList.length) {
				self.imgList[self.imgNum]['imgLink'] = imgLink;
				self.imgList[self.imgNum]['imgUrl'] = imgUrl;
				self.imgList[self.imgNum]['imgSort'] = self.imgNum +1;
				self.imgList[self.imgNum]['skuId'] = skuId;
				console.log(self.imgList);
		}
		
			var leftId = localStorage.getItem('leftId')
			data['leftId'] = leftId;
			data['plateCode'] = $(el).attr('plateCode');
			data['plateName'] = plateName;
			data['plateExtendListJson'] = JSON.stringify(self.imgList);
		$.post(base + 'plate/editPlate.do',data,function (res) {
			if (res.status == 0) {
				self.isDelect = false
				$.Huimodalalert("主题信息保存成功", 2000);
//				$('.ph-right').hide();
//				var leftId = $('#phone-main').attr('leftId');
				var leftId = localStorage.getItem('leftId');
				self.initQuery(leftId);
			}
		})
		
	}
	    //打开添加商品弹窗
    ,openAddPop: function(){
        var self = this;
        $.get(base + 'plate/getClassify.do',function (res) {
            if (res.status == 0) {
                self.treeList(res.data,1);
                var data = {};
                self.queryGoods(data,0);
            }
        })
        $('.pop_goods').show();
    }
      //获取商品列表
    ,queryGoods: function (data,obj) {
        var self = this;
        data.pageNum = (obj && obj.curr) || 1 // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
        $.get(base + 'plate/getSkuGoodsCollectRightMenu.do',data,function (res) {
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
      //选择商品确定
    ,goodsSubmit: function () {
        var checkbox = $('.link_goods input[type=radio]:checked');
        if(checkbox.length){
            $(".ph-ass").show();
            var skuId = $(checkbox).closest('li').attr('skuid');
            $("#ph-skuId").val(skuId);
            $(".ph-acon img").attr("src",$(checkbox).closest('li').children("img").attr("src"));
            $(".ph-acon p").text($(checkbox).closest('li').children(".link_name").text());
            $('.pop_goods').hide();
            $('.pop_add').show();
        }else{
            $.Huimodalalert("请选择关联商品", 2000);
        }
    }
	//点击删除方法
	,clearPop: function () {
		$('.ph-img-list li:last').remove();
		$('.ph-img-list li').eq(this.imgNum).attr('skuId','')
		console.log("d:"+this.imgNum);
		for (var i=this.imgNum+1;i<this.imgList.length;i++) {
			this.imgList[i]['imgSort'] = this.imgList[i]['imgSort'] - 1;
		}
		this.imgList.splice(this.imgNum,1);
		
		console.log(this.imgList);
		this.isDelect = true;
		
		$('.ph-img-list li:last').click()

	}
	//点击查看更多
	,checkMore: function () {
		var goodsListStr = '';
		//商品列表加载
		$.each(this.goodsListMore, function(i,goodsItem) {
			goodsListStr += '<li><img src="'+ goodsItem.imgUrl +'"></li>' 
		});
		$(goodsListStr).appendTo('.ph-goods-list')
		$('.check-more').hide()
	}
	//发布主题
	,issue: function () {
//		var leftId = $('#phone-main').attr('leftId');
		var leftId = localStorage.getItem('leftId');
		$.post(base + 'plate/sendPlate.do',{leftId:leftId},function (res) {
			$.Huimodalalert(res.message, 2000);
		})
	}

	//跳转到板块
	,loadPhone: function(leftId){
        $(".page-con").load("pagePhone.html");
        localStorage.setItem('leftId',leftId)
	}
	
	//初始化左向菜单（顶部面板轮播）
	,queryLeftPlate: function () {
		var self = this;
		$.get(base + 'plate/getMenuLeftList.do', function (res) {
			$('#left-menu-panel').empty()
			if (res.status == 0) {
				var strHtml = '';
				$.each(res.data, function(i,item) {
                    strHtml += '<div class="swiper-slide red-slide"> <a leftId="'+ item.leftId +'" class="change-panel change-panel-plate" href="javascript:;" onclick="pagePhone.loadPhone('+ item.leftId +');"><img src="../../images/phonePlate.jpg"/><p>'+ item.leftMenuName +'</p></a></div>'
				});
//				$('#left-menu-panel').empty()
				$(strHtml).appendTo('#left-menu-panel')
				if (self.isOpenSwiper) {
					self.openLeftSwiper()
					self.isOpenSwiper = false;
				}
				
//				$('#left-menu-panel .change-panel:first').click();
			}
		})
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
		$("#file").takungaeImgup({
		    formData: { "path": "Content/Images/", "name": "OrderScrshotCol" }, //path参数会发送给服务器，name参数代表上传图片成功后，自动生成input元素的name属性值
		    url:base + 'common/upload',    //发送请求的地址，服务器地址
		    success: function (data) {
		 			this.imgUrl = data.data;
		 			console.log("公共啊")
		    },
		    error: function (err) {
		    	$.Huimodalalert(err, 2000);
		    }
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
pagePhone.init()

