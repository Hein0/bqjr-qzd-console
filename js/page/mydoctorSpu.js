var spuUtils = {
	doctorSpuData: {
		doctorspuName: "", //医生姓名--
		province: "", //省份--
		city: "", //城市--
		hospital_id: "", //所在医院--
		sex: "", //性别--
		position: "", //当前职务--
		zizhi: [], //医生资质--
		work_date: "", //从医时间--
		highest_degree: "", //最高学历--
		good_projects: [], //擅长项目--
		zhuzhen: "", //主诊医生证书--
		zige: "", //资格证书--
		congye: "", //从业证书--
		logo: "", //医生logo
		introduce: "", //医生介绍--
		// learn_exp: "", //学习经历--
		// work_exp: "", //职业经历--
		// zhuanye_xiehui: "", //专业协会--
		id: "", //id
		doctor_pics: [],//医生图片集合
		isTrue:true,
	},
	provinceList: [],
	hospitalList: [],
	config: {
		width: 828,
		// height: 1104,
		quality: 0.8
	},
	imgs: [],
	//初始化
	init: function() {
		var path = location.href;
		// 省份选择初始化
		$.ajax({
			async: true,
			type: "post",
			url: base + "adminAddress/getArea.do",
			data: {
				level: 1
			},
			success: function(res) {
				var html = '<option value="" selected>省份</option>';

				if(res.status == "0") {
					spuUtils.provinceList = res.data;

					$.each(res.data, function(index, item) {
						html +=
							'<option value="' + item.code + '">' + item.name + "</option>";
					});
					$("#parent").html(html);
				}
			}
		});
		// 步骤二擅长项目逻辑判断
		$(".spu-cont .formControls").on(
			"change",
			'input[name="good_projects"]',
			function() {
				// 所选项目不超过3个
				if($('.spu-cont input[name="good_projects"]:checked').length >= 3) {
					$('.spu-cont input[name="good_projects"]:not(input[name="good_projects"]:checked)').attr("disabled", "disabled");
				}
				if($('.spu-cont input[name="good_projects"]:checked').length < 3) {
					$('.spu-cont input[name="good_projects"]:not(input[name="good_projects"]:checked)').removeAttr("disabled");
				}
				// 回退步骤操作时改变所选项，则清空之前所保存的
				spuUtils.doctorSpuData.good_projects = [];
			}
		);
		
	},

	// 获取医院列表
	getHospital_id: function(option) {
		var $target = option.$target || $("#Idhospital");
		name = option.name || "";
		cityId = option.cityId || "";

		$.get(
			base + "hospital/myAllHospital", {
				cityId: cityId,
				name: name
			},
			function(res) {
				var html = "";
				if(res.status == "0" && res.data && res.data.length) {
					$.each(res.data, function(index, item) {
						html += '<li data-id="' + item.id + '">' + item.name + "</li>";
					});
				}
				$target.find("ul").html(html);
			}
		);
	},

	//保存SPU数据
	saveSPUData: function() {
		var data = {};

		data.name = spuUtils.doctorSpuData.doctorspuName; //医生姓名
		data.cityId = spuUtils.doctorSpuData.city; //城市编码
		data.hospital_id = spuUtils.doctorSpuData.hospital_id; //所在医院
		data.sex = spuUtils.doctorSpuData.sex; //性别
		data.position = spuUtils.doctorSpuData.position; //当前职务
		data.zizhi = spuUtils.doctorSpuData.zizhi.join(","); //医生资质
		data.work_date = spuUtils.doctorSpuData.work_date; //从医时间
		data.highest_degree = spuUtils.doctorSpuData.highest_degree; //最高学历
		data.good_projects = spuUtils.doctorSpuData.good_projects.join(","); //擅长项目
		data.zhuzhen = spuUtils.doctorSpuData.zhuzhen; //主诊医生证书
		data.zige = spuUtils.doctorSpuData.zige; //资格证书
		data.congye = spuUtils.doctorSpuData.congye; //从业证书
		data.logo = spuUtils.doctorSpuData.logo; //医生logo
		data.introduce = spuUtils.doctorSpuData.introduce; //医生介绍
		data.doctor_pics = spuUtils.doctorSpuData.doctor_pics; //医生图片集合
		// data.learn_exp = spuUtils.doctorSpuData.learn_exp; //学习经历
		// data.work_exp = spuUtils.doctorSpuData.work_exp; //职业经历
		// data.zhuanye_xiehui = spuUtils.doctorSpuData.zhuanye_xiehui; //专业协会
		if(spuUtils.doctorSpuData.id) {
			data.id = spuUtils.doctorSpuData.id;
		} else {
			data.id = "";
		}
		var index = layer.load(1, {
			shade: [0.8, "#fff"] //0.1透明度的白色背景
		});
//		layer.load(2);
		if(spuUtils.doctorSpuData.isTrue){
	        spuUtils.doctorSpuData.isTrue = false;
			$.ajax({
				type: "POST",
				url: base + "case/insertDoctor.do",
				data: JSON.stringify(data),
				contentType: "application/json;charset=utf-8",
				success: function(res) {
					if(res.message == "操作成功") {
						$.Huimodalalert(res.message, 1500);
						var index = parent.layer.getFrameIndex(window.name);
						//刷新列表
						window.parent.location.href = window.parent.location.href;
						parent.layer.close(index);
					} else {
						$.Huimodalalert(res.message, 1500);
					}
				},
				complete: function() {
					spuUtils.doctorSpuData.isTrue = true;
					layer.closeAll("loading");
				}
			});
		}	
	}
};

$(function() {
	//初始化
	spuUtils.init();
	spuUtils.getHospital_id({});

	// 步骤二省市选择
	$("#parent").on("change", function(e) {
		var ckeckVal = $(this).find("option:checked").val();
		var ckeckTxt = $(this).find("option:checked").text();
		if(ckeckVal =="110000" || ckeckVal =="120000" || ckeckVal =="310000" || ckeckVal =="500000"){
			var htm = '<option value="'+ckeckVal+'" selected>'+ckeckTxt+'</option>';
			$("#city").html(htm);
		}else{
			$.post(base + "adminAddress/getArea.do", {
					parentId: $(this).find("option:checked").val()
			},function(res) {
					if(res.status == "0" && res.data && res.data.length) {
						var html = '<option value="" selected>城市</option>';
						$.each(res.data, function(index, item) {
							html +=
								'<option value="' + item.code + '">' + item.name + "</option>";
						});
						$("#city").html(html);
					}
				}
			);
		}	
	});

	// 选择医院弹窗展示隐藏
	$(".select-hospital").on("click", function() {
		var $self = $(this),
			$target = $self.next(".hospitalId");
		 	$($target).toggle(0, function () { });
	});

	// 医院选择功能
	$(".hospitalId")
		.on("click", function(e) {
			e.stopPropagation();
		})
		.on("keyup", "input", function() {
			// 弹窗内搜索删选
			var $self = $(this),
				val = $self.val(),
				$target = $self.closest(".hospitalId"),
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

			$wrap.hide().siblings(".select-hospital").text(val).attr("data-id", id);
		});

	//上一步
	$(".spu-cont .pre-btn").on("click", function() {
		var $parentStepWrap = $(this).parents(".form-step"),
			index = $parentStepWrap.index() - 1;
		$(".spu-nav .goods-step").removeClass("active").eq(index).addClass("active");
		$parentStepWrap.removeClass("active").prev(".form-step").addClass("active");
	});
	//下一步
	$(".spu-cont .next-btn").on("click", function() {
		var $parentStepWrap = $(this).parents(".form-step"),
			index = $parentStepWrap.index() + 1;

		//记录数据
		if(index == 1) {
			//记录医生姓名
			spuUtils.doctorSpuData.doctorspuName = $(".spu-cont #doctorspuName").val();
			// 医生姓名非空判断
			if(!spuUtils.doctorSpuData.doctorspuName) {
				$.Huimodalalert("请填写医生姓名", 1500);
				return false;
			}
			// 步骤一填写的医院名保存至步骤二
			$(".spu-cont #doctorspuNameShow").text(spuUtils.doctorSpuData.doctorspuName);
		} else if(index == 2) {
			// 记录步骤二输入的数据
			spuUtils.doctorSpuData.sex = $('.spu-cont input[name="sex"]:checked').val();
			spuUtils.doctorSpuData.province = $(".spu-cont #parent").val();
			spuUtils.doctorSpuData.city = $(".spu-cont #city").val();
			spuUtils.doctorSpuData.hospital_id = $(".spu-cont .select-hospital").data("id");
			spuUtils.doctorSpuData.position = $(".spu-cont #position").val();
			spuUtils.doctorSpuData.work_date = $(".spu-cont #work_date").val();
			spuUtils.doctorSpuData.highest_degree = $(".spu-cont #highest_degree").val();
			spuUtils.doctorSpuData.introduce = $(".spu-cont #introduce").val();
			//   spuUtils.doctorSpuData.learn_exp = $(".spu-cont #learn_exp").val();
			//   spuUtils.doctorSpuData.work_exp = $(".spu-cont #work_exp").val();
			//   spuUtils.doctorSpuData.zhuanye_xiehui = $(
			//     ".spu-cont #zhuanye_xiehui"
			//   ).val();

			if(spuUtils.doctorSpuData.good_projects.length == 0) {
				$('.spu-cont input[name="good_projects"]:checked').each(function() {
					spuUtils.doctorSpuData.good_projects.push($(this).val());
				});
			} else {
				$('.spu-cont input[name="good_projects"]:checked').each(function() {
					var flag = true;
					var $this = $(this);
					spuUtils.doctorSpuData.good_projects.forEach(function(item) {
						if($this.val() == item) {
							flag = false;
							return;
						}
					});
					if(flag) {
						spuUtils.doctorSpuData.good_projects.push($(this).val());
					}
				});
			}
			if(spuUtils.doctorSpuData.zizhi.length == 0) {
				$('.spu-cont input[name="zizhi"]:checked').each(function() {
					spuUtils.doctorSpuData.zizhi.push($(this).val());
				});
			} else {
				$('.spu-cont input[name="zizhi"]:checked').each(function() {
					var flag = true;
					var $this = $(this);
					spuUtils.doctorSpuData.zizhi.forEach(function(item) {
						if($this.val() == item) {
							flag = false;
							return;
						}
					});
					if(flag) {
						spuUtils.doctorSpuData.zizhi.push($(this).val());
					}
				});
			}

			// 步骤二必填数据非空判断
			if(!spuUtils.doctorSpuData.province) {
				$.Huimodalalert("请选择省份", 1500);
				return false;
			}
			if(!spuUtils.doctorSpuData.city) {
				$.Huimodalalert("请选择城市", 1500);
				return false;
			}
			if(!spuUtils.doctorSpuData.hospital_id) {
				$.Huimodalalert("请选择所在医院", 1500);
				return false;
			}
			if(!spuUtils.doctorSpuData.position) {
				$.Huimodalalert("请选择当前职务", 1500);
				return false;
			}
			if(spuUtils.doctorSpuData.zizhi.length == 0) {
				$.Huimodalalert("请选择医生资质", 1500);
				return false;
			}
			if(!spuUtils.doctorSpuData.work_date) {
				$.Huimodalalert("请选择从医时间", 1500);
				return false;
			}
			if(!spuUtils.doctorSpuData.highest_degree) {
				$.Huimodalalert("请选择最高学历", 1500);
				return false;
			}
			if(spuUtils.doctorSpuData.good_projects.length == 0) {
				$.Huimodalalert("请选择擅长项目", 1500);
				return false;
			}
			if(!spuUtils.doctorSpuData.introduce) {
				$.Huimodalalert("请输入医生介绍", 1500);
				return false;
			}
		}
		$(".spu-nav .goods-step").removeClass("active").eq(index).addClass("active");
		$parentStepWrap.removeClass("active").next(".form-step").addClass("active");
	});
	// 本地读取上传文件
	$('.spu-cont input[name="file"]').change(function() {
		var _that = this;
		newUploadImg($(this), function(src) {
			$(_that).parents(".formControls").find($(".avatar")).remove();
			if(src) {
				var tmpPicItem = $(
					"<div class='avatar size-XXL'><img class='avatar size-XXL' data-src='" +
					src +
					"' src='" +
					imgPath +
					src +
					"'></div>"
				);
				$(_that).parents(".formControls").append(tmpPicItem);
			}
		});
	});
	$(".spu-cont .formControls").on("change", 'input[name="zizhi"]', function() {
		// 回退步骤操作时改变所选项，则清空之前所保存的
		spuUtils.doctorSpuData.zizhi = [];
	});

	//提交
	$(".spu-cont .submit-btn").on("click", function() {
		// 步骤四的非空判断
		spuUtils.doctorSpuData.logo = $(".spu-cont #logo").attr("data-src");
		spuUtils.doctorSpuData.zige = $(".spu-cont #zige").attr("data-src");
		spuUtils.doctorSpuData.congye = $(".spu-cont #congye").attr("data-src");
		spuUtils.doctorSpuData.zhuzhen = $(".spu-cont #zhuzhen").attr("data-src");

		// 步骤四的非空判断;
		if(!spuUtils.doctorSpuData.logo) {
			$.Huimodalalert("请上传医生头像", 1500);
			return false;
		}
		if(!spuUtils.doctorSpuData.zige) {
			$.Huimodalalert("请上传医师资格证书首页与详细信息页", 1500);
			return false;
		}
		if(!spuUtils.doctorSpuData.congye) {
			$.Huimodalalert("请上传医师执业证书首页与详细信息页", 1500);
			return false;
		}
		
		if(spuUtils.doctorSpuData.doctor_pics.length == 0) {
			$.Huimodalalert("请至少上传1张医生照片", 1500);
			return false;
		}
		spuUtils.saveSPUData();
	});

	function getImgEvent(obj, type, i) {
		//type传值说明是手术后7张的
		newUploadImg(obj, function(src) {
			spuUtils.imgs = [];
			if(src) {
				//$(".layui-layer-shade").remove();
				//$(".layui-layer").remove();
				layer.closeAll("loading");
				obj.attr("data-src", src);
				if(!!type) {
					spuUtils.doctorSpuData.doctor_pics[i] = src;
				}
				obj.next("label").prepend($('<img style="display: inline-block;width: 100px;height: 100px;" src=' + imgPath + src + ">" ));
			} else {
				$.Huialert("获取图片路径失败", 1500);
			}
		});
	}
	//医生6张照片
	$("#doctorPic1").on("change", function() {
		getImgEvent($(this), 1, 0);
	});
	$("#doctorPic2").on("change", function() {
		getImgEvent($(this), 1, 1);
	});
	$("#doctorPic3").on("change", function() {
		getImgEvent($(this), 1, 2);
	});
	$("#doctorPic4").on("change", function() {
		getImgEvent($(this), 1, 3);
	});
	$("#doctorPic5").on("change", function() {
		getImgEvent($(this), 1, 4);
	});
	$("#doctorPic6").on("change", function() {
		getImgEvent($(this), 1, 5);
	});
	
	//医生头像
	$("#logo").on("change", function() {
		getImgEvent($(this));
	});
	//医师资格证书首页与详细信息页
	$("#zige").on("change", function() {
		getImgEvent($(this));
	});
	//医师执业证书首页与详细信息页
	$("#congye").on("change", function() {
		getImgEvent($(this));
	});
	//医疗美容主诊医生资格证书详细信息页
	$("#zhuzhen").on("change", function() {
		getImgEvent($(this));
	});
	
	$('body').on('click', function (e) {
        var $target = $(e.target);

        if (!$target.hasClass('select-hospital') && !$target.hasClass('name-select-panel')) {
            $('.name-select-panel').hide();
        }
    })
	
	
});