var spuUtils = {
	// 页面缓存
	cache: {},
	logSpuData: {
		id: "",
		his_id: "",
		operationTime: "", //记录日期
		user_id: "", //用户
		order_sn: "", //订单
		hospital_id: "", //医院
		type: "", //机构类型
		doctor_id: "", //医生
		content: "", //正文
		show_status: "", //显示状态
		satisfaction: " ", //满意度
		swelling: "", //肿胀度
		pain: "", //疼痛感
		scar: "", //疤痕度
		price: "", //价格
		before_main_video:"",//术前视频
		before_main_video_pic:"",//视频封面
		before_main: "", //术前主图片
		before_two: "", //术前图片2
		before_three: "", //术前 图片3
		beforeContent:"",//术前日志
		goods_key_word: "", //商品关键字
		user_key_word: "", //用户关键字
		case_main_id: "", //案例id(0：新增 非0：追加)
		after_main_video:"",//术后视频
		after_pics: [],//术后图片集合
		case_slaves: [],
		isTrue:true,
		len:null,
		index:"",//当前弹窗
		signImg: '',//记号上传图片
		signVideo: '',//记号上传视频
		IMG:"",
		VIDEO:"",
	},
	selectHospital: "",
	config: {
		width: 828,
		// height: 1104,
		quality: 0.8
	},
	imgs: [],
	//初始化
	init: function () {
		var path = location.href;
		var index = parent.layer.getFrameIndex(window.name);
		spuUtils.logSpuData.index = index||"1";
		
	},	
	// 获取医院列表
	getHospital_id: function(option) {
		var $target = option.$target || $(".hospital_id");
		name = option.name || "";
		cityId = option.cityId || "";
		$.get(base + "hospital/myAllHospital", {}, function(res) {
			var html = "";
			if(res.status == "0" && res.data && res.data.length) {
				$.each(res.data, function(index, item) {
					html += '<li data-id="' + item.id + '">' + item.name + "</li>";
				});
			}
			$target.find("ul").html(html);
		});
	},
	// 获取医生列表
	getDoctor_id: function(option, callBack) {
		var $target = option.$target || $(".doctor_id");

		var hospital_id = spuUtils.logSpuData.hospital_id;
		$.get(base + "case/getDoctorByHospitalId?hospital_id="+hospital_id, {}, function(res) {
			var html = "";
			if(res.status == "0" && res.data && res.data.length) {
				callBack(true);
				$.each(res.data, function(index, item) {
					html += '<li data-id="' + item.id + '">' + item.name + "</li>";
				});
			}
			$target.find("ul").html(html);
		});
	},
	//获取商品列表
	getOrder_sn: function(option, callBack) {
		var $target = option.$target || $(".order_sn");
		var hospital_id = spuUtils.logSpuData.hospital_id;
		$.get(base + "case/getGoodsListByHospitalId.do", {
				hospital_id: hospital_id
		},function(res) {
				var html = "";
				if(res.status == "0" && res.data && res.data.length) {
					callBack(true);
					$.each(res.data, function(index, item) {
						html +=
							'<li data-id="' +item.id +'" data-keyword="' +item.keyword +'" data-cat="' +item.cat +'">' +item.name +"</li>";
					});
				}
				$target.find("ul").html(html);
			}
		);
	},
    // 设置分类信息
    setSelectType: function($self) {

        spuUtils.setSelectValue($self);

        CacheData.getData('selectAllCategory', function (data) {
            if ($self.parent().index() == 1) {
                data =  spuUtils.currentProData[$self.index()].hdGoodsCategory;
            } else if ($self.parent().index() == 0){
                data = spuUtils.currentProData = data[$self.index()].hdGoodsCategory;
            }
            var html = '';
            if(data.length) {
                $.each(data, function(index, item) {
                    html +=
                        '<li data-id="' +
                        item.id +
                        '" data-classname="' +
                        item.name +
                        '">' +
                        item.name +
                        "</li>";
                });

                $self
                    .parent()
                    .next()
                    .html(html);
            }
        })
    },
	// 设置分类信息选择值
	setSelectValue: function($self) {
		var $wrap = $self.closest(".type-select-panel"),
			$result = $wrap.find(".result em");

		$result.text(spuUtils.getSelectValue($self));
	},
	// 获取分类信息选择
	getSelectValue: function($self) {
		var $wrap = $self.closest(".type-select-panel"),
			$li = $wrap.find(".check"),
			html = "";

		if($li.length) {
			$li.each(function(index, item) {
				var $item = $(item);
				if(index) {
					html += " > " + $item.text();
				} else {
					html += " " + $item.text();
				}
			});
		}
		return html;
	},
	//清空规格图册
	clearSpecDataImg: function() {
		for(var k = 0; k < spuUtils.logSpuData.specData.length; k++) {
			for(var m = 0; m < spuUtils.logSpuData.specData[k].attrs.length; m++) {
				spuUtils.logSpuData.specData[k].attrs[m].img = "";
			}
		}
		for(var i = 0; i < spuUtils.logSpuData.skuList.length; i++) {
			spuUtils.logSpuData.skuList[i].imgs = "";
		}
	},
	// 术前视频图片删除
	befDelImg: function (objs,index,id) {
		$(objs).parents(".pic-wrapImg").find('label img,label video').remove();
		if (index == 0) { // 删除视频信息
			spuUtils.logSpuData[id] = '';
			$(objs).parents(".pic-wrapImg").find('input').attr("data-src","");
			if(spuUtils.logSpuData.before_main_video == '' && spuUtils.logSpuData.before_main_video_pic == ''){
				$(objs).parents(".upload-pic-content").find(".isNoShow").show();
				spuUtils.logSpuData.signVideo = '';	
			}
			
		} else {//删除图片
			spuUtils.logSpuData[id] = '';
			$(objs).parents(".pic-wrapImg").find('input').attr("data-src","");
			if(spuUtils.logSpuData.before_main=='' && spuUtils.logSpuData.before_two=='' && spuUtils.logSpuData.before_three=='' ){
				$(objs).parents(".upload-pic-content").find(".isNoShow").show();
				spuUtils.logSpuData.signImg = '';
			}
				
		}
    },
	// 术后视频、图片删除
	delImg: function (objs,index, id) {
		if (objs.parents('.videoWraps').length) { // 删除视频信息
			spuUtils.logSpuData[id] = '';
			objs.parents(".upload-pic-content").find(".isNoShow").show();
		} else {//删除图片
			spuUtils.logSpuData.after_pics.splice(index,1);
			spuUtils.logSpuData.after_pics = spuUtils.logSpuData.after_pics.filter(function(v){
					return v != "";
			})
			$(objs).parents(".pic-wrapImg").find('input').attr("data-src","");
			if(spuUtils.logSpuData.after_pics.length==0){
				objs.parents(".upload-pic-content").find(".isNoShow").show();
			}
		}
    },
    // 获取视频大小和时间
	uploadVideoBefore: function (file, next) {
    	var size = file.size/1024/1024, video, time;
    		size = size.toFixed(2);

		if (size > 10) {
			layer.msg('请上传小于10M的视频');
			return
		}
		$('#up-video-be').remove();
		video = '<video style="display: none" id="up-video-be"></video>';
		$(video).appendTo($('body'));
		video = $('#up-video-be');
		video.attr('src', URL.createObjectURL(file));
		video.bind('canplay', function () {
			time = this.duration.toFixed(2);
			if (time > 15) {
                layer.msg('视频长度超出15秒');
			} else {
				next();
			}
        })
		video.bind('error', function () {
            $.Huialert('视频错误,重新上传');
        })
   	},
    // 设置封面
    setImgToCover:function ($self) {
		var str = '<span class="pic-cover">封面</span>';
		$self.parents('.pic-wrapImg').siblings().children('.pic-cover').remove();
		$self.parents('.pic-wrapImg').append(str);
        
        // 封面地址放到数组第一位
		if ($self.parents('.upload-pic-wrap').prev().text().indexOf('术后照片') > 0) {
		     var arr = spuUtils.logSpuData.after_pics;
			arr.unshift(arr.splice($self.parents('.pic-wrapImg').index(), 1)[0])
			spuUtils.logSpuData.after_pics = arr; 	
		} else {
			var str = spuUtils.logSpuData.before_main, index = $self.parents('.pic-wrapImg').index(), arr = ['before_main', 'before_two', 'before_three'];
            spuUtils.logSpuData.before_main = spuUtils.logSpuData[arr[index]];
            spuUtils.logSpuData[arr[index]] = str;
		}
    },
	//保存SPU数据
	saveSPUData: function(types) {//types  区分是点击了提交还是继续续写
		var data = {}; 

		data.operationTime = spuUtils.logSpuData.operationTime + " 00:00:00"; //记录日期
		// data.user_id = spuUtils.logSpuData.user_id; //用户
		data.hospital_id = spuUtils.logSpuData.hospital_id; //医院
		data.type = spuUtils.logSpuData.type; //机构类型（1.医院 2.美容机构）
		data.doctor_id = spuUtils.logSpuData.doctor_id; //医生
		data.beforeContent = spuUtils.logSpuData.beforeContent; //术前日志
		// data.pain = spuUtils.logSpuData.pain; //疼痛感
		data.before_main_video = spuUtils.logSpuData.before_main_video;//术前视频
		data.before_main_video_pic = spuUtils.logSpuData.before_main_video_pic;//术前视频封面
		data.before_main = spuUtils.logSpuData.before_main; //术前主图片
		data.before_two = spuUtils.logSpuData.before_two; //术前图片2
		data.before_three = spuUtils.logSpuData.before_three; //术前 图片3
		data.scoreNum = spuUtils.logSpuData.scoreNum; //评星数
		data.goods_key_word = spuUtils.logSpuData.goods_key_word; //商品关键字
		data.user_key_word = spuUtils.logSpuData.user_key_word; //补充关键字
		data.goods_id = spuUtils.logSpuData.goods_id; //订单
		data.case_slaves = spuUtils.logSpuData.case_slaves; //续写
//		data.after_main_video = spuUtils.logSpuData.after_main_video;//术后视频
		// (data.scar = spuUtils.logSpuData.scar), //疤痕度
		//   (data.price = spuUtils.logSpuData.price), //价格
		//   (data.after_pics = spuUtils.logSpuData.after_pics), //术后图片
		//   (data.user_key_word = spuUtils.logSpuData.user_key_word), //用户关键字
		//   (data.case_main_id = spuUtils.logSpuData.case_main_id), //案例id(0：新增 非0：追加)
//		layer.load(2);
		var index = layer.load(1, {
			shade: [0.8, "#fff"] //0.1透明度的白色背景
		});
		if(spuUtils.logSpuData.isTrue){
	        spuUtils.logSpuData.isTrue = false;
			$.ajax({
				type: "POST",
				url: base + "case/insertCaseOrLog.do",
				data: JSON.stringify(data),
				contentType: "application/json;charset=utf-8",
				success: function(res) {
					if(res.status == "0") {
						var id = res.data.id;
						var status = res.data.status;
						var goUrl = "logContinue.html?";
						if(types && types=="2"){
//	           				goUrl +="id="+id + "&status=" + status;
//							parent.layer.iframeSrc(spuUtils.logSpuData.index, goUrl);//重置页面
							parent.layer.open({
								type: 2,
								title: "继续续写",
								shadeClose: true,
								shade: [0.5, "#000"],
								maxmin: false, //开启最大化最小化按钮
								area: ["80%", "90%"],
								content: goUrl +="id="+id + "&status=" + status,
								success: function(layero, index) {
									parent.layer.close(spuUtils.logSpuData.index);
								}
							});
//							parent.layer.close(spuUtils.logSpuData.index);
						}else{
							$.Huimodalalert(res.message, 1500);
							//刷新列表
							window.parent.location.href = window.parent.location.href;
							parent.layer.close(spuUtils.logSpuData.index);
						}
					} else {
						$.Huimodalalert(res.message, 1500);
					}
				},
				complete: function() {
					spuUtils.logSpuData.isTrue = true;
					layer.closeAll("loading");
				}
			});
		}	
	}
};


$(function() {
	//初始化
	spuUtils.init();
	//初始化医院列表
	spuUtils.getHospital_id({});
	
	// 分类/关键字选择弹窗初始化
    CacheData.getData('selectAllCategory', function (data) {
        var html = "";
        $.each(data, function(index, item) {
            html += '<li data-id="' + item.id + '">' + item.name + "</li>";
        });
        $(".type-select-panel").find(".ul-a").html(html);
    })

	// 选择医院弹窗展示隐藏
	$(".select-hospital").on("click", function() {
		var $self = $(this),
			$target = $self.next(".hospital_id");
			$($target).toggle(0, function() {});
	});
	// 选择医院弹窗展示隐藏
	$(".select-hospital").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".name-select-panel");
			$target.toggle();
	});
	//添加补充分类列表
	$(".addWrap").on("click",function(){
		var nube = $(".classWrap").find(".newAdd");
		var len =nube.length; 
		var html = '<div class="row cl newAdd">'+
	                        '<label class="form-label col-xs-2 col-sm-2">补充项目类别：</label>'+
	                        '<div class="long-iptK classification">'+
	                            '<input type="text" name=""  class="value-wrap longIptK"  data='+ len +' disabled="disabled" />'+
	                            
	                        '</div>'+
	                    '</div>';
		
		if(len<=2){
			$(".classWrap").append(html);
			len++
		}else{
			$.Huimodalalert("最多只能添加三个！", 1500);
		}
		spuUtils.logSpuData.len = len
		
	});
	
	//选择分类/关键词弹窗展示隐藏
//	$("body").on("click","input", function() {
//			var $self = $(this),
//			$target = $(".type-select-panel");
//			$target.toggle();
//		});
	//点击选择医生选项
	$(".select-doctor").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".doctor_id");
		if($(".select-hospital").data("id")) {
			spuUtils.getDoctor_id($target, function(data) {
				if(data) {
					$target.toggle();
				} else {}
			});
		} else {
			$.Huimodalalert("请选择医院", 1500);
		}
	});
	//点击选择商品选项
	$(".select-order").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".order_sn");
		if($(".select-hospital").data("id")) {
			spuUtils.getOrder_sn($target, function(data) {
				if(data) {
					$target.toggle();
				} else {}
			});
		} else {
			$.Huimodalalert("请选择医院", 1500);
		}
	});

	// 医院选择功能
	$(".hospital_id")
		.on("click", function(e) {
			e.stopPropagation();
		})
		.on("keyup", "input", function() {
			// 弹窗内搜索删选
			var $self = $(this),
				val = $self.val(),
				$target = $self.closest(".hospital_id"),
				cityId = "";

			spuUtils.getHospital_id({
				$target: $target,
				name: val,
				cityId: $("#city").data("id") || ""
			});
		})
		.on("click", "li", function() {
			// 点击选择擅长项目
			var $self = $(this),
				$wrap = $self.closest(".name-select-panel"),
				val = $self.text(),
				id = $self.attr("data-id");
			$(".select-order").siblings(".order_sn").find("ul").html("");
			$(".classification").find(".keywVal").val("");//清除项目类别
			$(".select-order").removeAttr("data-id").text("请选择商品");//清除商品的信息
			$(".select-doctor").siblings(".doctor_id").find("ul").html("");
			$(".select-doctor").removeAttr("data-id").text("请选择主治医生");//清除医生的信息
			$wrap.hide().siblings(".select-hospital").text(val).attr("data-id", id);
			spuUtils.logSpuData.hospital_id = $self.attr("data-id");
		});
	//医生选项下拉列表
	$(".doctor_id")
		.on("click", function(e) {
			e.stopPropagation();
		})
		.on("keyup", "input", function() {
			// 弹窗内搜索删选
			var $self = $(this),
				val = $self.val(),
				$target = $self.closest(".doctor"),
				cityId = "";

			spuUtils.getHospital_id({
				$target: $target,
				name: val,
				cityId: $("#city").data("id") || ""
			});
		})
		.on("click", "li", function() {
			// 点击选择擅长项目
			var $self = $(this),
				$wrap = $self.closest(".name-select-panel"),
				val = $self.text(),
				id = $self.attr("data-id");

			$wrap.hide().siblings(".select-doctor").text(val).attr("data-id", id);
		});

	//商品选项下来列表
	$(".order_sn")
		.on("click", function(e) {
			e.stopPropagation();
		})
		.on("keyup", "input", function() {
			// 弹窗内搜索删选
			var $self = $(this),
				val = $self.val(),
				$target = $self.closest(".order");

			spuUtils.getOrder_sn({
				$target: $target,
				name: val
			});
		})
		.on("click", "li", function() {
			// 点击选择擅长项目
			var $self = $(this),
				$wrap = $self.closest(".name-select-panel"),
				val = $self.text(),
				id = $self.attr("data-id");
				keyword = $self.attr("data-keyword"),
				cat = $self.attr("data-cat");
			$(".classification").find(".keywVal").val(cat);
			$wrap.hide().siblings(".select-order").text(val).attr("data-id", id).attr("data-keyword", keyword);
		});
	// 选择搜索关键字弹窗点击分类
	$(".type-select-panel")
		.on("click", function(e) {
			e.stopPropagation();
		})
		.on("click", "li", function() {
			// 点击选择项
			var $self = $(this),
				$parent = $self.parent();
			$self.addClass("check").siblings().removeClass("check");
			$parent.nextAll("ul").html("");

			spuUtils.setSelectType($self);
		})
		.on("click", ".close-panel", function() {
			// 关闭弹窗
			var $self = $(this),
				$parent = $self.closest(".type-select-panel");
				$parent.hide();
		})
		.on("click", ".get-result", function() {
			// 确认选择
			var $self = $(this),
				$parent = $self.closest(".type-select-panel");
				if (spuUtils.logSpuData.len) {
					$target = $("input[data="+ (spuUtils.logSpuData.len-1) +"]");
				}else {
					$target = $parent.siblings(".select-classify");
				}

			$target.val(spuUtils.getSelectValue($self)).attr("data-id", $parent.find(".check:last").attr("data-id"));
			$parent.hide();
			
		});
	//术前三张照片
	$("#before_main").on("change", function() {
		getImgEvent($(this), 2);
	});
	$("#before_two").on("change", function() {
		getImgEvent($(this),2);
	});
	$("#before_three").on("change", function() {
		getImgEvent($(this),2);
	});
	//术前视频封面
	$("#before_main_video_pic").on("change", function() {
		getImgEvent($(this));
	});
	//术前上传视频
	$("#before_main_video").on("change",function(){
		var self = $(this), str;
		uploadVideoHandle($(this), function (data) {
			spuUtils.logSpuData["before_main_video"] = data;
			self.attr("data-src",data);
			self.parents(".videoWraps").siblings().hide();//隐藏图片上传
			str = '<video src='+ data +' autoplay></video>'
			self.next().append($(str));
			spuUtils.logSpuData.signVideo = true;
        }, spuUtils.uploadVideoBefore)
	});
	
	// 术前删除视频图片
	$('.upload-pic-content .del-Befimg').click(function () {
		$(this).parents(".pic-wrapImg").find('label img,label video').remove();
		$(this).parents(".pic-wrapImg").find(".pic-cover").length&&$(this).parents(".pic-wrapImg").find(".pic-cover").remove();
		var idName = $(this).parents(".pic-wrapImg").find('input').attr("data-name");
		spuUtils.befDelImg($(this),$(this).index(),idName)
    })
	// 术后除视频图片
	$('.upload-pic-content .del-img').click(function () {
		$(this).parents(".pic-wrapImg").find('label img,label video').remove();
		$(this).parents(".pic-wrapImg").find(".pic-cover").length&&$(this).parents(".pic-wrapImg").find(".pic-cover").remove();
		var idName = $(this).parents(".pic-wrapImg").find('input').attr("data-name");
		spuUtils.delImg($(this),$(this).parents(".pic-wrapImg").index(),idName)
    })
	// 设置封面
	$('.default-pic-wrap .set-cover').click(function () {
		var length = $(this).parent().prev().find('img').length;
		length && spuUtils.setImgToCover($(this))
    });
	
	//术后上传视频封面
	$("#after_main_video_pic").on("change", function() {
		getImgEvent($(this));
	});
	//术后上传视频
	$("#after_main_video").on("change",function(){
		var self = $(this), str;
		uploadVideoHandle($(this), function (data) {
			
			self.attr("data-src",data);
			self.parents(".videoWraps").siblings().hide();
			str = '<video src='+ data +' autoplay></video>'
			self.next().append($(str));
        }, spuUtils.uploadVideoBefore)
	});
	//手术后7张照片
	$("#after1").on("change", function() {
		getImgEvent($(this), 1, 0);
	});
	$("#after2").on("change", function() {
		getImgEvent($(this), 1, 1);
	});
	$("#after3").on("change", function() {
		getImgEvent($(this), 1, 2);
	});
	$("#after4").on("change", function() {
		getImgEvent($(this), 1, 3);
	});
	$("#after5").on("change", function() {
		getImgEvent($(this), 1, 4);
	});
	$("#after6").on("change", function() {
		getImgEvent($(this), 1, 5);
	});
	$("#after7").on("change", function() {
		getImgEvent($(this), 1, 6);
	});
	
	
	//上一步
	$(".spu-cont .pre-btn").on("click", function() {
		var $parentStepWrap = $(this).parents(".form-step"),
			index = $parentStepWrap.index() - 1;
			spuUtils.logSpuData.signImg = spuUtils.logSpuData.IMG;
			spuUtils.logSpuData.signVideo = spuUtils.logSpuData.VIDEO;
		$(".spu-nav .goods-step").removeClass("active").eq(index).addClass("active");
		$parentStepWrap.removeClass("active").prev(".form-step").addClass("active");
	});
	//下一步
	$(".spu-cont .next-btn").on("click", function() {
		var $parentStepWrap = $(this).parents(".form-step"),
			index = $parentStepWrap.index() + 1;
		var $wraps = $(".classWrap").find(".newAdd");//补充类别
		var isFalse =true;
		
		if(index == 1) {
			
			if(!$(".spu-cont #operationTime").val() || $(".spu-cont #operationTime").val() == "") {
				tip("请选择手术时间");
				return ;
			} else {
				spuUtils.logSpuData.operationTime = $(".spu-cont #operationTime").val();
			}
		
			if(!spuUtils.logSpuData.signImg && !spuUtils.logSpuData.signVideo && !$('#before_main_video_pic').attr("data-src")){
				tip("请选择术前视频或图片");
				return ;
			}
			
			if (spuUtils.logSpuData.signImg && !$('.upload-pic-content').first().find('.pic-cover').length){
				tip("请设置封面");
				return ;
			}
			if (spuUtils.logSpuData.signVideo && !$("#before_main_video_pic").attr("data-src")){
				tip("请上传视频封面");
				return ;
			}
			var temp = $(".long-iptK>span").text().split(" > ");
				spuUtils.logSpuData.user_key_word = temp[temp.length - 1];
			if($("#radio-1").attr("checked")) {
				spuUtils.logSpuData.type = 1;
			} else {
				spuUtils.logSpuData.type = 2;
			}
			if(!$("span.select-hospital").attr("data-id")) {
				tip("请选择医院");
				return;
			} else {
				spuUtils.logSpuData.hospital_id = $("span.select-hospital").attr("data-id");
			}
			if(!$("span.select-order").attr("data-id")) {
				tip("请选择商品");
				return;
			} else {
				spuUtils.logSpuData.goods_key_word = $("span.select-order").attr("data-keyword");
				spuUtils.logSpuData.goods_id = $("span.select-order").attr("data-id");
			}
			if(!$(".select-doctor").attr("data-id")) {
				tip("请选择医生");
				return;
			} else {
				spuUtils.logSpuData.doctor_id = $(".select-doctor").attr("data-id");
			}
			if(!$("#result-5").attr("data-score")) {
				tip("请评分！");
				return;
			} else {
				spuUtils.logSpuData.scoreNum = $("#result-5").attr("data-score");
			}
			$(".spu-cont #hospitalspuNameShow").text(spuUtils.logSpuData.hospitalspuName);
			if(!$("#before_main_video").attr("data-src") && !$("#before_main").attr("data-src") &&!$("#before_two").attr("data-src") && !$("#before_three").attr("data-src")){
				tip("请至少上传一张术前照片或者术前视频");
				return;
			}else{
				if($("#before_main_video").attr("data-src")){
					spuUtils.logSpuData.before_main_video =  $("#before_main_video").attr("data-src");
				}
				if($("#before_main").attr("data-src")) {
					spuUtils.logSpuData.before_main =  spuUtils.logSpuData.before_main ||$("#before_main").attr("data-src");
				}
				if($("#before_two").attr("data-src")) {
					spuUtils.logSpuData.before_two = spuUtils.logSpuData.before_two ||$("#before_two").attr("data-src");
				}
				if($("#before_three").attr("data-src")) {
					spuUtils.logSpuData.before_three = spuUtils.logSpuData.before_three || $("#before_three").attr("data-src");
				} 
			}
			
			//判断是否有补充类别列表
			if($wraps.length){
				var arr = [], old_length,new_length, str;
				arr.push(str = $(".keywVal").val());
				$wraps.each(function(v,tiem){
					arr.push($(tiem).find("input").val())
					str+="," + $(tiem).find("input").val()
				})
				old_length = arr.length;
				function uniq(array){
				    var temp = [];
				    for(var i = 0; i < array.length; i++) {
				        if(array.indexOf(array[i]) == i){
				            temp.push(array[i])
				        }
				    }
    				return temp;
				}
				new_length = uniq(arr).length;
				
				if (old_length != new_length) {
					tip('补充项目类别重复或不能为空!');
					return;
				}
				spuUtils.logSpuData.user_key_word = str;
				
			}
		}
		
		if(isFalse){
			spuUtils.logSpuData.beforeContent = $("#beforeContent").val();//术前日志
			spuUtils.logSpuData.IMG = spuUtils.logSpuData.signImg;
			spuUtils.logSpuData.VIDEO = spuUtils.logSpuData.signVideo;
			spuUtils.logSpuData.signImg = '';
			spuUtils.logSpuData.signVideo = '';
			$(".spu-nav .goods-step").removeClass("active").eq(index).addClass("active");
			$parentStepWrap.removeClass("active").next(".form-step").addClass("active");
		}
		
	});
	//提交数据前判断逻辑
	$(".spu-cont .submit-btn").on("click", function() {
		submitBef()
	});
	//继续续写提交数据前判断逻辑
	$(".spu-cont .continueBtn").on("click", function() {
		submitBef("2");
	});
	
	function submitBef(type){
		spuUtils.logSpuData.case_slaves[0] = {};
		if(!$("#introduce").val() || $("#introduce").val() == "") {
			tip("请输入记录日记");
			return;
		} else {
			spuUtils.logSpuData.case_slaves[0].content = $("#introduce").val();
		}
		if($("#radio_1").attr("checked")) {
			spuUtils.logSpuData.case_slaves[0].show_status = 1;
		} else if($("#radio_2").attr("checked")) {
			spuUtils.logSpuData.case_slaves[0].show_status = 2;
		} else {
			spuUtils.logSpuData.case_slaves[0].show_status = 3;
		}
		
		if(!$("#after_main_video").attr("data-src") && spuUtils.logSpuData.after_pics.length<=0){
			tip("请上传术后图片或术后视频");
			return;
		}else{
			
			if ($('.videoWraps').last().find('video').length && !$('#after_main_video_pic').attr('data-src')) {
				tip("请上传术后封面");
				return;
			}
			
			if($("#after_main_video").attr("data-src")){//术后视频
				spuUtils.logSpuData.case_slaves[0].after_main_video = $("#after_main_video").attr("data-src");
			}
			if(spuUtils.logSpuData.after_pics != undefined && spuUtils.logSpuData.after_pics.length >= 0) {
				spuUtils.logSpuData.case_slaves[0].after_pics = spuUtils.logSpuData.after_pics;
			}
		}
		if(!$('.upload-pic-content').last().find('.pic-cover').length && !$('#after_main_video_pic').attr('data-src')){
			tip("请设置封面");
			return ;
		}
		if($('#after_main_video_pic').attr('data-src')){
			spuUtils.logSpuData.case_slaves[0].after_main_video_pic = $("#after_main_video_pic").attr("data-src");
		}
		if(!$("#result-1").attr("data-score")) {
			tip("请给满意度打分！");
			return;
		} else {
			spuUtils.logSpuData.case_slaves[0].satisfaction = $("#result-1").attr("data-score");
		}
		if(!$("#result-2").attr("data-score")) {
			tip("请给肿胀度打分！");
			return;
		} else {
			spuUtils.logSpuData.case_slaves[0].swelling = $("#result-2").attr("data-score");
		}
		if(!$("#result-3").attr("data-score")) {
			tip("请给疼痛感打分！");
			return;
		} else {
			spuUtils.logSpuData.case_slaves[0].pain = $("#result-3").attr("data-score");
		}
		if(!$("#result-4").attr("data-score")) {
			tip("请给疤痕度打分！");
			return;
		} else {
			spuUtils.logSpuData.case_slaves[0].scar = $("#result-4").attr("data-score");
		}
		spuUtils.saveSPUData(type);
	};

	/*------------- 上传sku图片 --------------*/
	$(".spec-items").delegate(".sku-item", "click", function(e) {
		var _that = this;
		if($(".spec-items .sku-item.active").size() > 0) {
			layer.confirm(
				"更改规格将清空该规格已上传的图片，是否确认更改？", {
					btn: ["确定", "取消"]
				},
				function() {
					layer.closeAll("dialog");
					$(_that).toggleClass("active").siblings().removeClass("active");
					var id = $(_that).attr("data-id");
					if($(_that).hasClass("active")) {
						var uploadSkuPic = $('.upload-sku-pic[data-id="' + id + '"]').addClass("active").siblings(".upload-sku-pic");
							uploadSkuPic.removeClass("active");
							uploadSkuPic.find(".pic-wrap").empty();
					} else {
						$('.upload-sku-pic[data-id="' + id + '"]').removeClass("active");
					}
					spuUtils.clearSpecDataImg(); //清空规格图册数据
				},
				function() {}
			);
		} else {
			$(_that).toggleClass("active").siblings().removeClass("active");
			var id = $(_that).attr("data-id");
			if($(_that).hasClass("active")) {
				var uploadSkuPic = $('.upload-sku-pic[data-id="' + id + '"]').addClass("active").siblings(".upload-sku-pic");
					uploadSkuPic.removeClass("active");
					uploadSkuPic.find(".pic-wrap").empty();
			} else {
				$('.upload-sku-pic[data-id="' + id + '"]').removeClass("active");
			}
			spuUtils.clearSpecDataImg(); //清空规格图册数据
		}
	});

	$("body").on("click", function(e) {
		var $target = $(e.target);
		//所在医院弹窗失去焦点
		if(!$target.hasClass("select-hospital") && ! $target.hasClass("name-select-panel")) {
			$(".hospital_id").hide();
		}
		//医生弹窗失去焦点
		if(!$target.hasClass("select-doctor") &&
			!$target.hasClass("name-select-panel")
		) {
			$(".doctor_id").hide();
		}
		//商品弹窗失去焦点
		if(!$target.hasClass("select-order") && !$target.hasClass("name-select-panel")) {
			$(".order_sn").hide();
		}
		//关键词、分类失去焦点
		if(!$target.hasClass("select-classify") &&!$target.hasClass("type-select-panel")) {
			$(".type-select-panel").hide();
		}
		 
		if($target.hasClass("longIptK")) {
			$(".type-select-panel").show();
			spuUtils.logSpuData.len = Number($target.attr('data')) + 1;
		}
		
	});
	//提示框方法
	function tip(msg) {
		$.Huimodalalert(msg, 1500);
	}
	
	function getImgEvent(obj, type, i) {
		//type传值说明是手术后7张的
		newUploadImg(obj, function(src) {
			spuUtils.imgs = [];
			var idName = $(obj).parents(".pic-wrapImg").find('input').attr("data-name");
			if(src) {
				layer.closeAll("loading");
				obj.attr("data-src", src);
				if(type === 1) {
					spuUtils.logSpuData.after_pics[i] = src;
				}else{
					spuUtils.logSpuData[idName] = src;
				}
				if(obj.parents().hasClass("videoWraps")){
					obj.parents(".upload-pic-content").find(".imgWraps").hide();
				}else{
					obj.parents(".upload-pic-content").find(".videoWraps").hide();
				}
				obj.next("label").prepend(
						$('<img style="display: inline-block;width: 122px;height: 122px;" src=' +
							imgPath +src +">"));
							
				type &&(spuUtils.logSpuData.signImg = true);			
			} else {
				$.Huialert("获取图片路径失败", 1500);
			}
		});
	}
	
	
});

