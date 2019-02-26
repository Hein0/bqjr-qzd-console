var spuUtils = {
	
	"cache": {},// 页面缓存
	"role": {},//用户角色
	selectHospital: "",
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
		satisfaction: "", //满意度
		swelling: "", //肿胀度
		pain: "", //疼痛感
		scar: "", //疤痕度
		before_main: "", //术前主图片
		before_two: "", //术前图片2
		before_three: "", //术前 图片3
		goods_key_word: "", //商品关键字
		user_key_word: "", //用户关键字
		case_main_id: "", //案例id(0：新增 非0：追加)
		after_pics: [],
		case_slaves: [],
		index:"",//当前弹窗
		isTrue:true,
		len:null,
		signImg: '',
		signVideo: '',
		beforeCoverIndex: 0
	},
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
		spuUtils.logSpuData.index = index;
		if (path.indexOf("?") >= 0) {
			var params = path.substring(path.indexOf("?") + 1, path.length).split("&"),
				id = "",status = "";
			for (var i = 0; i < params.length; i++) {
				if (params[i].indexOf("id") != -1) {
					id = params[i].split("=")[1];
				} else if (params[i].indexOf("status") != -1) {
					status = params[i].split("=")[1];
				}
			}
			spuUtils.role.status = status;
			if (status == "10" || status == "11") {
				spuUtils.role.id = id;
				spuUtils.getLogData(id, true, callBack);
			} 
			
			function callBack() {
				var html = template("edit", spuUtils.cache);
				$('.spu-cont').html(html);
				spuUtils.getHospital_id({});
				// 分类选择弹窗初始化
                CacheData.getData('selectAllCategory', function (data) {
                    var html = "";
                    $.each(data, function(index, item) {
                        html += '<li data-id="' + item.id + '">' + item.name + "</li>";
                    });
                    $(".type-select-panel").find(".ul-a").html(html);
                })
				//获取用户接口
				$.get(base + "sys/getUserHasRole", {}, function (res) {
					if (res.status == "0" && res.data.length > 0) {
						spuUtils.role = res.data[0];
					}
				});

				// 设置项目类别

				$("#star-5").raty({
					hints: ['1', '2', '3', '4', '5'],
					starOff: 'iconpic-star-S-default.png',
					starOn: 'iconpic-star-S.png',
					path: '../../static/h-ui/images/star',
					number: 5,
					score: spuUtils.cache.scoreNum, //初始值是设置
					showHalf: true,
					targetKeep: true,
					click: function (score, evt) {//点击事件
						//第一种方式：直接取值
						$("#result-5").html('你的评分是' + score + '分');
						$("#result-5").attr("data-score", score);
					}
				});
				if (spuUtils.cache.case_slaves != undefined && spuUtils.cache.case_slaves.length > 0) {
					spuUtils.cache.case_slaves.forEach((element, index) => {
						var tempDom1 = "#star-1" + index;
						var tempDom2 = "#star-2" + index;
						var tempDom3 = "#star-3" + index;
						var tempDom4 = "#star-4" + index;
						var tempDom11 = "#result-1" + index;
						var tempDom22 = "#result-2" + index;
						var tempDom33 = "#result-3" + index;
						var tempDom44 = "#result-4" + index;
						var afterTempDom1 = "#after1" + index;
						var afterTempDom2 = "#after2" + index;
						var afterTempDom3 = "#after3" + index;
						var afterTempDom4 = "#after4" + index;
						var afterTempDom5 = "#after5" + index;
						var afterTempDom6 = "#after6" + index;
						var afterTempDom7 = "#after7" + index;
						var video = "#afterVideo" + index;
						var videoCover = "#after_main_video_pic" + index;
						var afertDele = "#afertDele" + index;
						$(tempDom1).raty({
							hints: ['1', '2', '3', '4', '5'],
							starOff: 'iconpic-star-S-default.png',
							starOn: 'iconpic-star-S.png',
							path: '../../static/h-ui/images/star',
							number: 5,
							score: element.satisfaction, //初始值是设置
							showHalf: true,
							targetKeep: true,
							click: function (score, evt) {//点击事件
								//第一种方式：直接取值
								$(tempDom11).html('你的评分是' + score + '分');
								$(tempDom11).attr("data-score", score);
							}
						});
						$(tempDom2).raty({
							hints: ['1', '2', '3', '4', '5'],
							starOff: 'iconpic-star-S-default.png',
							starOn: 'iconpic-star-S.png',
							path: '../../static/h-ui/images/star',
							number: 5,
							score: element.swelling, //初始值是设置
							showHalf: true,
							targetKeep: true,
							click: function (score, evt) {//点击事件
								//第一种方式：直接取值
								$(tempDom22).html('你的评分是' + score + '分');
								$(tempDom22).attr("data-score", score);
							}
						});
						$(tempDom3).raty({
							hints: ['1', '2', '3', '4', '5'],
							starOff: 'iconpic-star-S-default.png',
							starOn: 'iconpic-star-S.png',
							path: '../../static/h-ui/images/star',
							number: 5,
							score: element.pain, //初始值是设置
							showHalf: true,
							targetKeep: true,
							click: function (score, evt) {//点击事件
								//第一种方式：直接取值
								$(tempDom33).html('你的评分是' + score + '分');
								$(tempDom33).attr("data-score", score);
							}
						});
						$(tempDom4).raty({
							hints: ['1', '2', '3', '4', '5'],
							starOff: 'iconpic-star-S-default.png',
							starOn: 'iconpic-star-S.png',
							path: '../../static/h-ui/images/star',
							number: 5,
							score: element.scar, //初始值是设置
							showHalf: true,
							targetKeep: true,
							click: function (score, evt) {//点击事件
								//第一种方式：直接取值
								$(tempDom44).html('你的评分是' + score + '分');
								$(tempDom44).attr("data-score", score);
							}
						});
						//手术后7张照片
						$(afterTempDom1).on("change", function () {
							getImgEvent($(this), 1, index, 0);
						});
						$(afterTempDom2).on("change", function () {
							getImgEvent($(this), 1, index, 1);
						});
						$(afterTempDom3).on("change", function () {
							getImgEvent($(this), 1, index, 2);
						});
						$(afterTempDom4).on("change", function () {
							getImgEvent($(this), 1, index, 3);
						});
						$(afterTempDom5).on("change", function () {
							getImgEvent($(this), 1, index, 4);
						});
						$(afterTempDom6).on("change", function () {
							getImgEvent($(this), 1, index, 5);
						});
						$(afterTempDom7).on("change", function () {
							getImgEvent($(this), 1, index, 6);
						});
//						$(video).on('change', function () {
//							afterVideo($(this));
//						})
						$(videoCover).on('change', function () {
							getImgEvent($(this),4, index);
						});
						//术后视频封面删除
						$(afertDele).on('click',function(){
							spuUtils.delImg($(this),400, index)
						})
						
					});
				}
				//提交
				$(".spu-cont").on("click", ".submit-btn",function () {
					var $wraps = $(".classWrap").find(".newAdd");//补充类别
					var isFalse =true;
					
					//时间
					if (!$(".spu-cont #operationTime").val() || $(".spu-cont #operationTime").val() == "") {
						tip("请选择时间");
						return;
					} else {
						spuUtils.cache.operationTime = $(".spu-cont #operationTime").val();
					}
					var temp = $(".long-iptK>span").text().split(" > ");
					spuUtils.cache.user_key_word = temp[temp.length - 1];
					if ($("#radio-1").attr("checked")) {
						spuUtils.cache.type = 1;
					} else {
						spuUtils.cache.type = 2;
					}
					//医院
					if (!$("span.select-hospital").data("id")) {
						tip("请选择医院");
						return;
					} else {
						spuUtils.cache.hospital_id = $("span.select-hospital").data("id");
					}
					//商品
					if (!$("span.select-order").attr("data-id")) {
						tip("请选择商品");
						return;
					} else {
						spuUtils.cache.user_key_word = $("span.select-order").attr("data-keyword");
						spuUtils.cache.goods_id = $("span.select-order").attr("data-id");
						spuUtils.cache.goods_name = $("span.select-order").text();
					}
					//医生
					if (!$(".select-doctor").data("id")) {
						tip("请选择医生");
						return;
					} else {
						spuUtils.cache.doctor_id = $(".select-doctor").data("id");
					}
					//评分
					if (!$("#result-5").attr("data-score")) {
						tip("请评分！");
						return;
					} else {
						spuUtils.cache.scoreNum = $("#result-5").attr("data-score");
					}
					$(".spu-cont #hospitalspuNameShow").text(spuUtils.cache.hospitalspuName);
					
					if(!spuUtils.logSpuData.signImg && !spuUtils.logSpuData.signVideo){
						tip("请选择术前视频或图片");
						return ;
					}
					
					if (spuUtils.logSpuData.signImg && !$('.upload-pic-content').first().find('.pic-cover').length && !$('#before_main_video_pic').attr('data-src')){
						tip("请设置术前封面");
						return ;
					}
					if (spuUtils.logSpuData.signVideo && !$("#before_main_video_pic").attr("data-src")){
						tip("请上传术前视频封面");
						return ;
					}
					
					//上传术前照片
					if (spuUtils.logSpuData.signImg && !$("#before_main").attr("data-src") && !$("#before_two").attr("data-src") && !$("#before_three").attr("data-src") && !$('#before_main_video').attr('data-src')) {
						tip("请至少上传一张术前照片");
						return;
					} else {
						spuUtils.cache.before_main = $("#before_main").data("src");
					}
					if (spuUtils.logSpuData.signImg && !$("#before_two").data("src")) {
						// tip("请上传第二张图片");
						//  return ;
					} else {
						spuUtils.cache.before_two = $("#before_two").data("src");
					}
					if (spuUtils.logSpuData.signImg && !$("#before_three").data("src")) {
						// tip("请上传第三张图片");
						//  return ;
					} else {
						spuUtils.cache.before_three = $("#before_three").data("src");
					}
					for (var i=0;i<$(".form-step-2").length;i++){
								//记录日记
						if (!$("#introduce" + i).val() || $("#introduce").val() == "") { } else {
							spuUtils.cache.case_slaves[i].content = $("#introduce" + i).val();
						}
						//显示状态
						if ($("#radio_1" + i).prop("checked")) {
							spuUtils.cache.case_slaves[i].show_status = 1;
						} else if ($("#radio_2" + i).prop("checked")) {
							spuUtils.cache.case_slaves[i].show_status = 2;
						} else {
							spuUtils.cache.case_slaves[i].show_status = 3;
						}
						//术后图片
						if (!spuUtils.cache.case_slaves[i].after_main_video && spuUtils.cache.case_slaves[i].after_pics.length == 0) {
							console.log(spuUtils.cache.case_slaves[i])
							tip("请上传术后图片");
							return;
						} 
						
						if (spuUtils.cache.case_slaves[i].after_main_video && !spuUtils.cache.case_slaves[i].after_main_video_pic) {
							tip("请上传视频封面");
							return;
						} 
						if (!spuUtils.cache.case_slaves[i].after_main_video && spuUtils.cache.case_slaves[i].after_pics.length) {
							if (!$('.form-step-2').eq(i).find('.pic-cover').length){
								tip("请设置术后封面");
								return;
							}
						
						} 
						//满意度打分
						if (!$("#result-1" + i).attr("data-score")) {
							tip("请给满意度打分！");
							return;
						} else {
							spuUtils.cache.case_slaves[i].satisfaction = $("#result-1" + i).attr("data-score");
						}
						//肿胀度打分
						if (!$("#result-2" + i).attr("data-score")) {
							tip("请给肿胀度打分！");
							return;
						} else {
							spuUtils.cache.case_slaves[i].swelling = $("#result-2" + i).attr("data-score");
						}
						//疼痛感打分
						if (!$("#result-3" + i).attr("data-score")) {
							tip("请给疼痛感打分！");
							return;
						} else {
							spuUtils.cache.case_slaves[i].pain = $("#result-3" + i).attr("data-score");
						}
						///疤痕度打分
						if (!$("#result-4" + i).attr("data-score")) {
							tip("请给疤痕度打分！");
							return;
						} else {
							spuUtils.cache.case_slaves[i].scar = $("#result-4" + i).attr("data-score");
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
						spuUtils.cache.user_key_word = str;
//						$wraps.each(function(v,tiem){
//							if($(".keywVal").val().indexOf($(tiem).find("input").val())!=-1){
//								tip("补充项目类别不能重复选择或不能为空！");
//								isFalse = false
//							}else{
//								spuUtils.cache.user_key_word += ","+$(tiem).find("input").val();
//							}
//						})
					}
					//validate()
					
					if(isFalse){
						spuUtils.cache.beforeContent = $("#beforeContent").val();//术前日志
						
						//保存数据
						spuUtils.saveSPUData();
					}
				});
				//选择分类弹窗展示隐藏
				$(".select-classify").on("click", function () {
					var $self = $(this),
						$target = $self.siblings(".type-select-panel");
						$target.toggle();
				});

				// 选择医院弹窗展示隐藏
				$(".select-hospital").on("click", function () {
					var $self = $(this),
						$target = $self.siblings(".name-select-panel");
					$target.toggle();
				});
				//术前封面图
				$('.spu-cont').on('change', '#before_main_video_pic', function(){
					getImgEvent($(this),3);
				})
				//术前照片
				$("#before_main").on("change", function () {
					getImgEvent($(this),2);
				});
				//图片
				$("#before_two").on("change", function () {
					getImgEvent($(this),2);
				});
				//图片
				$("#before_three").on("change", function () {
					getImgEvent($(this),2);
				});

				// 选择搜索关键字弹窗点击分类
				$(".type-select-panel")
					.on("click", function (e) {
						e.stopPropagation();
					})
					.on("click", "li", function () {
						// 点击选择项
						var $self = $(this),
							$parent = $self.parent();

						$self.addClass("check").siblings().removeClass("check");
						$parent.nextAll("ul").html("");
						spuUtils.setSelectType($self);
					})
					.on("click", ".close-panel", function () {
						// 关闭弹窗
						var $self = $(this),
							$parent = $self.closest(".type-select-panel");

						$parent.hide();
					})
					.on("click", ".get-result", function () {
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

				// 医院选择功能
				$(".hospital_id")
					.on("click", function (e) {
						e.stopPropagation();
					})
					.on("keyup", "input", function () {
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
					.on("click", "li", function () {
						// 点击选择擅长项目
						var $self = $(this),
							$wrap = $self.closest(".name-select-panel"),
							val = $self.text(),
							id = $self.attr("data-id");
						
						$(".select-order").siblings(".order_sn").find("ul").html("");
						$(".select-order").removeAttr("data-id").text("请选择商品");//清除商品的信息
						$(".select-doctor").siblings(".doctor_id").find("ul").html("");
						$(".select-doctor").removeAttr("data-id").text("请选择主治医生");
						$wrap.hide().siblings(".select-hospital").text(val).attr("data-id", id);
						spuUtils.logSpuData.hospital_id = $self.attr("data-id");
					});
				//医生选择
				$(".doctor_id")
					.on("click", function (e) {
						e.stopPropagation();
					})
					.on("keyup", "input", function () {
						// 弹窗内搜索删选
						var $self = $(this),
							val = $self.val(),
							$target = $self.closest(".doctor_id"),
							cityId = "";

						spuUtils.getHospital_id({
							$target: $target,
							name: val,
							cityId: $("#city").data("id") || ""
						});
					})
					.on("click", "li", function () {
						// 点击选择擅长项目
						var $self = $(this),
							$wrap = $self.closest(".name-select-panel"),
							val = $self.text(),
							id = $self.attr("data-id");

						$wrap.hide().siblings(".select-doctor").text(val).attr("data-id", id);
					});
				//商品选择
				$(".order_sn")
					.on("click", function (e) {
						e.stopPropagation();
					})
					.on("keyup", "input", function () {
						// 弹窗内搜索删选
						var $self = $(this),
							val = $self.val(),
							$target = $self.closest(".order_sn"),
							cityId = "";

						spuUtils.getHospital_id({
							$target: $target,
							name: val,
							cityId: $("#city").data("id") || ""
						});
					})
					.on("click", "li", function () {
						// 商品选择
						var $self = $(this),
							$wrap = $self.closest(".name-select-panel"),
							val = $self.text(),
							id = $self.attr("data-id");
							keyword = $self.attr("data-keyword"),
							cat = $self.attr("data-cat");
							$(".classification").find(".keywVal").val(cat);
							spuUtils.cache.user_key_word = keyword;
						$wrap.hide().siblings(".select-order").text(val).attr("data-id", id).attr("data-keyword", keyword);;
					});
					
				//选择医院才可以选择商品和医生	
				$(".select-doctor").on("click", function () {
					var $self = $(this),
						$target = $self.siblings(".doctor_id");
					if ($(".select-hospital").data("id")) {
						spuUtils.getDoctor_id($target, function (data) {
							if (data) {
								$target.toggle();
							} else { }
						});
					} else {
						$.Huimodalalert("请选择医院", 1500);
					}
				});
				//点击商品
				$(".select-order").on("click", function () {
					var $self = $(this),
						$target = $self.siblings(".order_sn");
					if ($(".select-hospital").data("id")) {
						spuUtils.getOrder_sn($target, function (data) {
							if (data) {
								$target.toggle();
							} else { }
						});
					} else {
						$.Huimodalalert("请选择医院", 1500);
					}
				});
			}
		}
	},
	//生成术后图片模板
	renderImgDom: function (ele, index) {
		var str = $('#imgTemplate').html();
		var item = '', arr = [];
		for (var i=0;i<7;i++){
			arr.push({index: index})
		}
		console.log(arr)
		var html = template("imgTemplate", {name:arr})
		item = '<div class="imgWraps isNoShow">' + html + '</div>';
		$(ele).append($(item));
		var afterTempDom1 = "#after1" + index;
		var afterTempDom2 = "#after2" + index;
		var afterTempDom3 = "#after3" + index;
		var afterTempDom4 = "#after4" + index;
		var afterTempDom5 = "#after5" + index;
		var afterTempDom6 = "#after6" + index;
		var afterTempDom7 = "#after7" + index;
		//手术后7张照片
		$(afterTempDom1).on("change", function () {
			getImgEvent($(this), 1, index, 0);
		});
		$(afterTempDom2).on("change", function () {
			getImgEvent($(this), 1, index, 1);
		});
		$(afterTempDom3).on("change", function () {
			getImgEvent($(this), 1, index, 2);
		});
		$(afterTempDom4).on("change", function () {
			getImgEvent($(this), 1, index, 3);
		});
		$(afterTempDom5).on("change", function () {
			getImgEvent($(this), 1, index, 4);
		});
		$(afterTempDom6).on("change", function () {
			getImgEvent($(this), 1, index, 5);
		});
		$(afterTempDom7).on("change", function () {
			getImgEvent($(this), 1, index, 6);
		});
		
	},
	//生成术后视频和视频封面模板
	renderVideoDom:function(ele, index){
		var str = $('#imgTemplate').html();
		
		var html = template("videoTemplate", {name:index})
		$(ele).prepend(html);
		
		var video = "#afterVideo" + index;
		var videoCover = "#after_main_video_pic" + index;
		$(video).on('change', function () {
			spuUtils.afterVideo($(this),index);
		})
		$(videoCover).on('change', function () {
			getImgEvent($(this),4, index);
		});
	},
	//生成术前视频和视频封面模板
	befoerVideoDom:function(ele){
		
		var html = template("beferVideoTem", {})
		$(ele).prepend(html);
		//术前视频
		$("#before_main_video").on("change", function () {
			spuUtils.uploadVid($(this))
		});
		$("#before_main_video_pic").on("change", function () {
			getImgEvent($(this),3);
		});
	},
	//生成术前模板
	befoerImgDom:function(ele){
		var html = template("beferTemplate", {})
		$(ele).append(html);
		//术前照片
		$("#before_main").on("change", function () {
			getImgEvent($(this),2);
		});
		$("#before_two").on("change", function () {
			getImgEvent($(this),2);
		});
		$("#before_three").on("change", function () {
			getImgEvent($(this),2);
		});
	},
	
	//获取SPU数据
	getLogData: function (id, boolean, callback) {
		var data = {};
			data.id = id;

		$.get(base+"case/getCaseById", data, function (res) {
			if (res.data != null) {
				res.data.imgPath = imgPath;

//				var keyword = res.data.user_key_word;
//				var arr = keyword.split(',');
//				res.data.user_key_word = arr[0];
//				arr.shift();
//				
//				res.data.keyword = arr
				spuUtils.cache = res.data;
				//如果有术前视频封面图。就显示视频+封面图		
				if (res.data.before_main_video_pic) {
					spuUtils.logSpuData.signVideo = true;
				} else {
					spuUtils.logSpuData.signImg = true;
				}
			}
			callback();
		});
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


	// 术前视频图片删除
	befDelImg: function (objs,index,idName) {
		
		$(objs).parents(".pic-wrapImg").find('label img,label video').remove();
		$(objs).parent().next().remove();
		if (index == 0) { // 删除视频信息
			spuUtils.cache[idName] = '';
			$(objs).parents(".pic-wrapImg").find('input').attr("data-src","");
			if(!spuUtils.cache.before_main_video && !spuUtils.cache.before_main_video_pic){
				//添加图片模板
				spuUtils.befoerImgDom($(objs).parents('.upload-pic-content'));
				spuUtils.logSpuData.signVideo = '';
			}
			
		} else  {//删除图片
			spuUtils.cache[idName] = '';
			$(objs).parents(".pic-wrapImg").find('input').attr("data-src","");
			$(objs).parents(".pic-wrapImg").find(".pic-cover").length&&$(this).parents(".pic-wrapImg").find(".pic-cover").remove();
			if(spuUtils.cache.before_main=='' && spuUtils.cache.before_two=='' && spuUtils.cache.before_three=='' ){
				//添加视频和视频封面模板
				spuUtils.befoerVideoDom($(objs).parents('.upload-pic-content'));
				spuUtils.logSpuData.signImg = '';
			}
			
		}
    },
	// 术后视频图片删除
	delImg: function (objs,index,i) {
		if(!$(objs).parents(".pic-wrapImg").find('label img,label video').length){
			return ;
		}
		$(objs).parents(".pic-wrapImg").find('label img,label video').remove();
		$(objs).parent().next().remove();
		if (index == 0) { // 删除视频信息
			spuUtils.cache.case_slaves[i].after_main_video = '';
			$(objs).parents(".pic-wrapImg").find('input').attr("data-src","");
			$(objs).parents(".upload-pic-content").find(".pic-wrapImg").show();
			
			spuUtils.renderImgDom($(objs).parents('.upload-pic-content'), i)
		} else if(index == 400){ // 删除术后视频封面
			spuUtils.cache.case_slaves[i].after_main_video_pic = '';
		}else if($(objs).parents('.imgWraps').length){//删除图片
			spuUtils.cache.case_slaves[i].after_pics.splice(index-1,1);
			$(objs).parents(".pic-wrapImg").find(".pic-cover").length&&$(this).parents(".pic-wrapImg").find(".pic-cover").remove();
			if(spuUtils.cache.case_slaves[i].after_pics.length==0){
				$(objs).parents(".upload-pic-content").find(".pic-wrapImg").show();
				spuUtils.renderVideoDom($(objs).parents('.upload-pic-content'), i)
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
	//术前视频上传
	uploadVid:function(obj){
		var str;
		uploadVideoHandle($(obj), function (data) {
			spuUtils.cache.before_main_video = data;
			$(obj).attr("data-src",data);
			$(obj).parents(".videoWraps").siblings().hide();
			str = '<video src='+ data +'></video>'
			$(obj).next().append($(str));
			spuUtils.logSpuData.signVideo = true
        }, spuUtils.uploadVideoBefore)
	},
	//术后上传视频
	afterVideo:function(obj,index){
		var str;
		uploadVideoHandle($(obj), function (data) {
			spuUtils.cache.case_slaves[index].after_main_video=data;
			console.log($(obj))
			$(obj).attr("data-src",data);
			$(obj).parents(".videoWraps").siblings().hide();
			str = '<video src='+ data +'></video>'
			$(obj).next().append($(str));
			
        }, spuUtils.uploadVideoBefore)
	},
	// 术前设置封面
	befSetImgToCover:function ($self) {
		var str = '<span class="pic-cover">封面</span>';
		$self.parents('.pic-wrapImg').siblings().children('.pic-cover').remove();
		$self.parents('.pic-wrapImg').append(str);
		spuUtils.logSpuData.beforeCoverIndex =  $self.parents('.pic-wrapImg').index();
    },
    // 术后设置封面
    setImgToCover:function ($self) {
		var str = '<span class="pic-cover">封面</span>';
		$self.parents('.pic-wrapImg').siblings().children('.pic-cover').remove();
		$self.parents('.pic-wrapImg').append(str);
        // 封面地址放到数组第一位
        var arr = spuUtils.cache.case_slaves[$self.attr('data-index')].after_pics;
		arr.unshift(arr.splice($self.parents('.pic-wrapImg').index(), 1)[0])
		spuUtils.cache.case_slaves[$self.attr('data-index')].after_pics = arr;
    },
	// 获取医院列表
	getHospital_id: function (option) {
		var $target = option.$target || $(".hospital_id");
		name = option.name || "";
		cityId = option.cityId || "";
		$.get(base + "hospital/myAllHospital", {}, function (res) {
			var html = "";
			if (res.status == "0" && res.data && res.data.length) {
				$.each(res.data, function (index, item) {
					html += '<li data-id="' + item.id + '">' + item.name + "</li>";
				});
			}
			$target.find("ul").html(html);
		});
	},

	// 获取医生列表
	getDoctor_id: function (option, callBack) {
		var $target = option.$target || $(".doctor_id");
		var hospital_id = $(".select-hospital").attr("data-id");
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
	getOrder_sn: function (option, callBack) {
		var $target = option.$target || $(".order_sn");
		var hospital_id = $(".select-hospital").attr("data-id");
		
		$.get(base + "case/getGoodsListByHospitalId.do", {
			hospital_id: hospital_id
		},function (res) {
				var html = "";
				if (res.status == "0" && res.data && res.data.length) {
					callBack(true);
					$.each(res.data, function (index, item) {
						html +=
							'<li data-id="' +item.id +'" data-keyword="' +item.keyword +'" data-cat="' +item.cat +'">' +item.name +"</li>";
					});
				}
				$target.find("ul").html(html);
		});
	},

	// 设置分类信息选择值
	setSelectValue: function ($self) {
		var $wrap = $self.closest(".type-select-panel"),
			$result = $wrap.find(".result em");

		$result.text(spuUtils.getSelectValue($self));
	},
	// 获取分类信息选择
	getSelectValue: function ($self) {
		var $wrap = $self.closest(".type-select-panel"),
			$li = $wrap.find(".check"),
			html = "";

		if ($li.length) {
			$li.each(function (index, item) {
				var $item = $(item);
				if (index) {
					html += " > " + $item.text();
				} else {
					html += " " + $item.text();
				}
			});
		}
		return html;
	},

	//保存SPU数据
	saveSPUData: function () {
//		layer.load(2);
		var data = spuUtils.cache, arr = ['before_main', 'before_two', 'before_three'], index;
		delete data.imgPath;

		// 设置术前封面
		if (index = spuUtils.logSpuData.beforeCoverIndex) {
            var str = data.before_main
            data.before_main = data[arr[index]];
            data[arr[index]] = str;
		}
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
				success: function (res) {
					if (res.message == "操作成功") {
						$.Huimodalalert(res.message, 1500);
						var _data = res.data;
						var goUrl = "logNewDetail.html?";
	           				goUrl +="id="+ _data.id + "&status=" + _data.status;
	//						var index = parent.layer.getFrameIndex(window.name);
							parent.layer.iframeSrc(spuUtils.logSpuData.index, goUrl);//重置页面
							//刷新列表
	//						parent.layer.close(index);
					} else {
						$.Huimodalalert(res.message, 1500);
					}
				},
				complete: function () {
					spuUtils.logSpuData.isTrue = true;
					layer.closeAll("loading");
				}
			});
		}	
	}
};

$(function () {
	//初始化
	spuUtils.init();
	
	// 术后设置封面
	$('.spu-cont').on('click','.default-pic-wrap .set-cover',function(){
		var length = $(this).parent().prev().find('img').length;
		length && spuUtils.setImgToCover($(this))
	})
	
	//添加补充分类列表
	$(".spu-cont ").on("click",".addWrap",function(){
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
		spuUtils.logSpuData.len = len;
	});
	
	//body点击下
	$("body").on("click", function (e) {
		var $target = $(e.target);
		//关键词、分类失去焦点
		if (!$target.hasClass("select-classify") && !$target.hasClass("type-select-panel")) {
			$(".type-select-panel").hide();
		}

		if (!$target.hasClass("select-order") && !$target.hasClass("name-select-panel")) {
			$(".order_sn").hide();
		}

		if (!$target.hasClass("select-hospital") && !$target.hasClass("name-select-panel")) {
			$(".hospital_id").hide();
		}

		if (!$target.hasClass("select-doctor") && !$target.hasClass("name-select-panel")) {
			$(".doctor_id").hide();
		}
		
		if($target.hasClass("longIptK")) {
			$(".type-select-panel").show();
			spuUtils.logSpuData.len = Number($target.attr('data')) + 1;
		}

	});
	
	

	
});

//上传图片处理
function getImgEvent(obj, type, i ,j) {
	//type传值说明是手术后7张的
	newUploadImg(obj, function (src) {
		spuUtils.imgs = [];
		var idName = $(obj).parents(".pic-wrapImg").find('input').attr("data-name");
		if (src) {
			
			layer.closeAll("loading");
			obj.attr("data-src", src);
            type &&(spuUtils.logSpuData.signImg = true);
            if (type===1) {
				spuUtils.cache.case_slaves[i].after_pics[j] = src;
				console.log(type, i, j)
			}else if(type===3){
				spuUtils.cache.before_main_video_pic = src;
                spuUtils.logSpuData.signImg = '';
                spuUtils.logSpuData.signVideo = true;
            } else if(type===4){
					spuUtils.cache.case_slaves[i].after_main_video_pic = src;
			}else{
				spuUtils.cache[idName] = src;
			}
			if(obj.parents().hasClass("videoWraps")){
				obj.parents(".upload-pic-content").find(".imgWraps").hide();
			}else{
				obj.parents(".upload-pic-content").find(".videoWraps").hide();
			}
			obj.next("label").prepend($(
						'<img style="display: inline-block;width: 122px;height: 122px;" src=' +
						imgPath +src +">"));
		} else {
			$.Huialert("获取图片路径失败", 1500);
		}
	});
}


function tip(msg) {
	$.Huimodalalert(msg, 1500);
}
