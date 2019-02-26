var spuUtils = {
	hospitalSpuData: {
		hospitalspuName: "", //医院名称--
		anotherName:"",//医院简称
		province: "", //省份--
		city: "", //城市--
		street: "", //街道地址--
		service_type: "", //服务类型--
		ziben_type: "", //资本类型--
		hospital_type: "", //医院类型--
		service_grade: "", //业务等级--
		good_projects: [], //擅长项目--
		build_date: "", //成立时间--
		introduce: "", //医院介绍--
		business_license: "", //营业执照图片--
		licence: "", //许可证图片--
		examination: "", //审查证明图片--
		business_date: "", //营业执照有效期
		licence_date: "", //许可证有效期
		examination_date: "", //审查证明有效期
		telphone: "", //座机
		email: "", //邮箱
		propaganda: "", //医院宣传语
		legal_name:"",//医院法人姓名
		legal_id_card:"",//医院法人身份证号
		legal_telphone:"",//医院法人手机号
		logo: "", //医院logo
		id: "", //id
		pic_urls:[],//医院图片
		honor : [],//荣誉奖项图片集合
		brand : [],//品牌认证图片集合
		config: {
			width: 828,
			// height: 1104,
			quality: 0.8
		},
		imgs: [],
		isTrue :true,
	},
	provinceList: [],
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
						html +='<option value="' + item.code + '">' + item.name + "</option>";
					});
					$("#parent").html(html);
				}
			}
		});
		// 步骤二擅长项目逻辑判断
		$(".spu-cont .formControls").on(
			"change",
			'input[type="checkbox"]',
			function() {
				// 所选项目不超过3个
				if($('.spu-cont input[type="checkbox"]:checked').length >= 3) {
					$(
						'.spu-cont input[type="checkbox"]:not(input[type="checkbox"]:checked)'
					).attr("disabled", "disabled");
				}
				if($('.spu-cont input[type="checkbox"]:checked').length < 3) {
					$(
						'.spu-cont input[type="checkbox"]:not(input[type="checkbox"]:checked)'
					).removeAttr("disabled");
				}
				// 回退步骤操作时改变所选项，则清空之前所保存的
				spuUtils.hospitalSpuData.good_projects = [];
			}
		);
		
	},

	//保存SPU数据
	saveSPUData: function() {
		var data = {};

		data.name = spuUtils.hospitalSpuData.hospitalspuName; //医院名称
		data.anotherName = spuUtils.hospitalSpuData.anotherName; //医院简称
		data.cityId = spuUtils.hospitalSpuData.city; //城市编码
		data.service_type = spuUtils.hospitalSpuData.service_type; //服务类型
		data.ziben_type = spuUtils.hospitalSpuData.ziben_type; //资本类型
		data.hospital_type = spuUtils.hospitalSpuData.hospital_type; //医院类型
		data.service_grade = spuUtils.hospitalSpuData.service_grade; //业务等级
		data.good_projects = spuUtils.hospitalSpuData.good_projects.join(","); //擅长项目
		data.build_date = spuUtils.hospitalSpuData.build_date; //成立时间
		data.introduce = spuUtils.hospitalSpuData.introduce; //医院介绍
		data.telphone = spuUtils.hospitalSpuData.telphone; //座机
		data.email = spuUtils.hospitalSpuData.email; //邮件
		data.business_license = spuUtils.hospitalSpuData.business_license; //营业执照图片
		data.licence = spuUtils.hospitalSpuData.licence; //许可证图片
		data.examination = spuUtils.hospitalSpuData.examination; //审查证明图片
		data.business_date = spuUtils.hospitalSpuData.business_date; //营业执照有效期
		data.licence_date = spuUtils.hospitalSpuData.licence_date; //许可证有效期
		data.examination_date = spuUtils.hospitalSpuData.examination_date; //审查证明有效期
		data.logo = spuUtils.hospitalSpuData.logo; //logo
		data.propaganda = spuUtils.hospitalSpuData.propaganda; //医院宣传语
		data.legal_name = spuUtils.hospitalSpuData.legal_name; //医院法人姓名
		data.legal_id_card = spuUtils.hospitalSpuData.legal_id_card; //医院法人身份证号
		data.legal_telphone = spuUtils.hospitalSpuData.legal_telphone; //医院法人手机号
		data.pic_urls = spuUtils.hospitalSpuData.pic_urls; //医院图片集合
		data.honor = spuUtils.hospitalSpuData.honor; //荣誉奖项图片集合
		data.brand = spuUtils.hospitalSpuData.brand; //品牌认证图片集合
		data.street = spuUtils.hospitalSpuData.street; //街道地址
		if(spuUtils.hospitalSpuData.id) {
			data.id = spuUtils.hospitalSpuData.id;
		} else {
			data.id = "";
		}
//		layer.load(2);
		var index = layer.load(1, {
			shade: [0.8, "#fff"] //0.1透明度的白色背景
		});

		if(spuUtils.hospitalSpuData.isTrue){//防止重复提交
	        spuUtils.hospitalSpuData.isTrue = false;
			$.ajax({
				type: "POST",
				url: base + "case/insertHospital.do",
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
					spuUtils.hospitalSpuData.isTrue = true;
					layer.closeAll("loading");
				}
			});
		}	
	}
};

$(function() {
	//初始化
	spuUtils.init();
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
							html +='<option value="' + item.code + '">' + item.name + "</option>";
						});
						$("#city").html(html);
					}
				}
			);
		}
		
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
			//记录医院名称
			spuUtils.hospitalSpuData.hospitalspuName = $(".spu-cont #hospitalspuName").val();
			// 医院名称非空判断
			if(!spuUtils.hospitalSpuData.hospitalspuName) {
				$.Huimodalalert("请填写医院名称", 1500);
				return false;
			}
			// 医院简称非空判断
			if(!$(".spu-cont #anotherName").val()) {
				$.Huimodalalert("请填写医院简称", 1500);
				return false;
			}else{
				spuUtils.hospitalSpuData.anotherName = $(".spu-cont #anotherName").val();
			}
			// 步骤一填写的医院名保存至步骤二
			$(".spu-cont #hospitalspuNameShow").text(spuUtils.hospitalSpuData.hospitalspuName);
		} else if(index == 2) {
			// 记录步骤二输入的数据
			spuUtils.hospitalSpuData.province = $(".spu-cont #parent").val();
			spuUtils.hospitalSpuData.city = $(".spu-cont #city").val();
			spuUtils.hospitalSpuData.street = $(".spu-cont #hospitalStreet").val();
			spuUtils.hospitalSpuData.service_type = $(".spu-cont #service_type").val();
			spuUtils.hospitalSpuData.ziben_type = $(".spu-cont #ziben_type").val();
			spuUtils.hospitalSpuData.hospital_type = $(".spu-cont #hospital_type").val();
			spuUtils.hospitalSpuData.service_grade = $(".spu-cont #service_grade").val();
			spuUtils.hospitalSpuData.build_date = $(".spu-cont #build_date").val();
			spuUtils.hospitalSpuData.introduce = $(".spu-cont #introduce").val();
			if(spuUtils.hospitalSpuData.good_projects.length == 0) {
				$('.spu-cont input[type="checkbox"]:checked').each(function() {
					spuUtils.hospitalSpuData.good_projects.push($(this).val());
				});
			} else {
				$('.spu-cont input[type="checkbox"]:checked').each(function() {
					var flag = true;
					var $this = $(this);
					spuUtils.hospitalSpuData.good_projects.forEach(function(item) {
						if($this.val() == item) {
							flag = false;
							return;
						}
					});
					if(flag) {
						spuUtils.hospitalSpuData.good_projects.push($(this).val());
					}
				});
			}
			// 步骤二必填数据非空判断
			if(!spuUtils.hospitalSpuData.province) {
				$.Huimodalalert("请选择省份", 1500);
				return false;
			}
			if(!spuUtils.hospitalSpuData.city) {
				$.Huimodalalert("请选择城市", 1500);
				return false;
			}
			if(!spuUtils.hospitalSpuData.street) {
				$.Huimodalalert("请填写街道地址", 1500);
				return false;
			}
			// if (!spuUtils.hospitalSpuData.service_type) {
			// 	$.Huimodalalert('请选择服务类型', 1500);
			// 	return false;
			// }
			if(!spuUtils.hospitalSpuData.ziben_type) {
				$.Huimodalalert("请选择资本类型", 1500);
				return false;
			}
			if(!spuUtils.hospitalSpuData.hospital_type) {
				$.Huimodalalert("请选择医院类型", 1500);
				return false;
			}
			if(!spuUtils.hospitalSpuData.good_projects.length) {
				$.Huimodalalert("请选择擅长项目", 1500);
				return false;
			}
			if(!spuUtils.hospitalSpuData.build_date) {
				$.Huimodalalert("请选择成立时间", 1500);
				return false;
			}
			if(!spuUtils.hospitalSpuData.introduce) {
				$.Huimodalalert("请输入医院介绍", 1500);
				return false;
			}
		} else if(index == 3) {
			//记录步骤三录入的数据
			spuUtils.hospitalSpuData.business_license = $(".spu-cont #business_license").attr("data-src");
			spuUtils.hospitalSpuData.licence = $(".spu-cont #licence").attr("data-src");
			spuUtils.hospitalSpuData.examination = $(".spu-cont #examination").attr("data-src");
			spuUtils.hospitalSpuData.business_date = $(".spu-cont #business_date").val();
			spuUtils.hospitalSpuData.licence_date = $(".spu-cont #licence_date").val();
			spuUtils.hospitalSpuData.examination_date = $(".spu-cont #examination_date").val();
			// 必填项非空判断
			if(!spuUtils.hospitalSpuData.business_license) {
				$.Huimodalalert("请上传营业执照or民办非企业单位证书", 1500);
				return false;
			}
			if(!spuUtils.hospitalSpuData.business_date) {
				$.Huimodalalert("请选择营业执照or民办非企业单位证书有效期", 1500);
				return false;
			}
			if(!spuUtils.hospitalSpuData.licence) {
				$.Huimodalalert("请上传医疗机构执业许可证", 1500);
				return false;
			}
			if(!spuUtils.hospitalSpuData.licence_date) {
				$.Huimodalalert("请选择医疗机构执业许可证有效期", 1500);
				return false;
			}
			if(!spuUtils.hospitalSpuData.examination) {
				$.Huimodalalert("请上传医疗广告审查证明", 1500);
				return false;
			}
			if(!spuUtils.hospitalSpuData.examination_date) {
				$.Huimodalalert("请选择医疗广告审查证明有效期", 1500);
				return false;
			}
		}
		$(".spu-nav .goods-step").removeClass("active").eq(index).addClass("active");
		$parentStepWrap.removeClass("active").next(".form-step").addClass("active");
	});
	// 本地读取上传文件
	$('.spu-cont input[type="file"]').change(function() {
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
				$(_that)
					.parents(".formControls")
					.append(tmpPicItem);
			}
		});
	});
	//提交
	$(".spu-cont .submit-btn").on("click", function() {
		// 步骤四的非空判断
		spuUtils.hospitalSpuData.telphone = $(".spu-cont #hospitalTelphone").val();
		spuUtils.hospitalSpuData.email = $(".spu-cont #hospitalEmail").val();
		spuUtils.hospitalSpuData.propaganda = $(".spu-cont #hospitalPropaganda").val();
		spuUtils.hospitalSpuData.legal_name = $(".spu-cont #legal_name").val();
		spuUtils.hospitalSpuData.legal_id_card = $(".spu-cont #legal_id_card").val();
		spuUtils.hospitalSpuData.legal_telphone = $(".spu-cont #legal_telphone").val();
		spuUtils.hospitalSpuData.logo = $('.spu-cont input[name="logo"]').attr("data-src");
		var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; 
//		var phone = /^0\d{2,3}-?\d{7,8}$/;//座机
		var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;//电话
		var idCadReg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;//身份证号
		// 步骤四的非空判断
		if(!spuUtils.hospitalSpuData.telphone) {
			$.Huimodalalert("请输入座机", 1500);
			return false;
		}
//		else if(!phone.test(spuUtils.hospitalSpuData.telphone)){
//			$.Huimodalalert("请输入座机格式不正确!", 1500);
//			return false;
//		}
		if(!spuUtils.hospitalSpuData.email) {
			$.Huimodalalert("请输入邮箱", 1500);
			return false;
		}else if(!myreg.test(spuUtils.hospitalSpuData.email)){
			$.Huimodalalert("输入邮箱格式不正确!", 1500);
			return false;
		}
		if(!spuUtils.hospitalSpuData.propaganda) {
			$.Huimodalalert("请输入医院宣传语", 1500);
			return false;
		}
		if(!spuUtils.hospitalSpuData.legal_name) {
			$.Huimodalalert("请输入医院法人姓名", 1500);
			return false;
		}
		if(!spuUtils.hospitalSpuData.legal_id_card) {
			$.Huimodalalert("请输入医院法人身份证号", 1500);
			return false;
		}else if(!idCadReg.test(spuUtils.hospitalSpuData.legal_id_card)){
			$.Huimodalalert("输入医院法人身份证号不正确!", 1500);
			return false;
		}
		if(spuUtils.hospitalSpuData.legal_telphone && !phoneReg.test(spuUtils.hospitalSpuData.legal_telphone)){
			$.Huimodalalert("输入医院法人手机号不正确!", 1500);
			return false;
		}
		if(!spuUtils.hospitalSpuData.logo) {
			$.Huimodalalert("请上传医院Logo", 1500);
			return false;
		}
		if(spuUtils.hospitalSpuData.pic_urls.length == 0) {
			$.Huimodalalert("请至少上传1张医院照片", 1500);
			return false;
		}

		spuUtils.saveSPUData();
	});
	
	//营业执照or民办非企业单位证书
	$("#business_license").on("change", function() {
		getImgEvent($(this));
	});
	//医疗机构职业许可证
	$("#licence").on("change", function() {
		getImgEvent($(this));
	});
	//医疗广告审查证明
	$("#examination").on("change", function() {
		getImgEvent($(this));
	});
	//医院logo
	$("#uploadlogo").on("change", function() {
		getImgEvent($(this));
	});
	
	//荣誉奖项
	$("#honor1").on("change", function() {
		getImgEvent($(this), 1, 0, "honor");
	});
	$("#honor2").on("change", function() {
		getImgEvent($(this), 1, 1, "honor");
	});
	$("#honor3").on("change", function() {
		getImgEvent($(this), 1, 2, "honor");
	});
	$("#honor4").on("change", function() {
		getImgEvent($(this), 1, 3, "honor");
	});
	$("#honor5").on("change", function() {
		getImgEvent($(this), 1, 4, "honor");
	});
	$("#honor6").on("change", function() {
		getImgEvent($(this), 1, 5, "honor");
	});	

	//品牌认证图片
	$("#brand1").on("change", function() {
		getImgEvent($(this), 1, 0, "brand");
	});
	$("#brand2").on("change", function() {
		getImgEvent($(this), 1, 1, "brand");
	});
	$("#brand3").on("change", function() {
		getImgEvent($(this), 1, 2, "brand");
	});
	$("#brand4").on("change", function() {
		getImgEvent($(this), 1, 3, "brand");
	});
	$("#brand5").on("change", function() {
		getImgEvent($(this), 1, 4, "brand");
	});
	$("#brand6").on("change", function() {
		getImgEvent($(this), 1, 5, "brand");
	});
	
	//医院6张照片
	$("#hospitalPic1").on("change", function() {
		getImgEvent($(this), 1, 0);
	});
	$("#hospitalPic2").on("change", function() {
		getImgEvent($(this), 1, 1);
	});
	$("#hospitalPic3").on("change", function() {
		getImgEvent($(this), 1, 2);
	});
	$("#hospitalPic4").on("change", function() {
		getImgEvent($(this), 1, 3);
	});
	$("#hospitalPic5").on("change", function() {
		getImgEvent($(this), 1, 4);
	});
	$("#hospitalPic6").on("change", function() {
		getImgEvent($(this), 1, 5);
	});
	
	function getImgEvent(obj, type, i,name) {
		//type传值说明是手术后7张的
		newUploadImg(obj, function(src) {
			spuUtils.hospitalSpuData.imgs = [];
			if(src) {
				layer.closeAll("loading");
				obj.attr("data-src", src);
				if(!!type) {
					if(name == "honor"){
						spuUtils.hospitalSpuData.honor[i] = src;
					}else if(name == "brand"){
						spuUtils.hospitalSpuData.brand[i] = src;
					}else{
						spuUtils.hospitalSpuData.pic_urls[i] = src;
					}
				}
				obj.next("label").prepend($('<img style="display: inline-block;width: 100px;height: 100px;" src=' + imgPath + src + ">" ));
			} else {
				$.Huialert("获取图片路径失败", 1500);
			}
		});
	}
	
});