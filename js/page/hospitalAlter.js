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
		img1: "",
	    img2: "",
	    img3: "",
	    img4: "",
	    img5: "",
	    img6: "",
		pic_urls:[],//医院图片
		honor : [],//荣誉奖项图片集合
		brand : [],//品牌认证图片集合
		logo: "", //医院logo
		id: "", //id
		user_id:"",//user_id
		his_id:"",//历史id
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
		
		// 步骤二擅长项目逻辑判断
		$(".spu-cont .formControls").on("change", 'input[type="checkbox"]', function() {
			// 所选项目不超过3个
			if($('.spu-cont input[type="checkbox"]:checked').length >= 3) {
				$('.spu-cont input[type="checkbox"]:not(input[type="checkbox"]:checked)').attr("disabled", "disabled");
			}
			if($('.spu-cont input[type="checkbox"]:checked').length < 3) {
				$('.spu-cont input[type="checkbox"]:not(input[type="checkbox"]:checked)').removeAttr("disabled");
			}
			// 回退步骤操作时改变所选项，则清空之前所保存的
			spuUtils.hospitalSpuData.good_projects = [];
		});
		if(path.indexOf("?") >= 0) {
			var params = path.substring(path.indexOf("?") + 1, path.length).split("&"),
				id = "",
				his_id = "",
				status = "";
			for(var i = 0; i < params.length; i++) {
				if(params[i].indexOf("id") != -1) {
					id = params[i].split("=")[1];
				} else if(params[i].indexOf("hisId") != -1) {
					his_id = params[i].split("=")[1];
				} else if(params[i].indexOf("status") != -1) {
					status = params[i].split("=")[1];
				}
			}
			//设置状态
			spuUtils.hospitalSpuData.status = status;
		    if (status == "10" || status == "11") {
		        if (id) {
		          spuUtils.hospitalSpuData.id = id;
		          spuUtils.getHospitalData(id, true, callBack);
		        }
		    } else {
		        if (his_id) {
		          spuUtils.hospitalSpuData.his_id = his_id;
		          spuUtils.getHospitalData(his_id, false, callBack);
		        }
		    }
			
			function callBack() {

                var index = '';
                CacheData.getData('getArea', function ( data) {
                    spuUtils.provinceList = data;
                    var html = '<option value="" selected>省份</option>';
                    $.each(data, function(i, item) {
                        if(item.code.toString().substring(0, 2) == spuUtils.hospitalSpuData.city.substring(0, 2)) {
                            spuUtils.hospitalSpuData.province = item.code;
                            index = i;
                            html +='<option value="' + item.code + '" selected>' + item.province + "</option>";
                        }else{
                            html +='<option value="' + item.code + '">' + item.province + "</option>";
                        }
                    });
                    $("#parent").html(html);
                })
                CacheData.getData('getArea', function ( data) {

                    data = data[index].citys;
                    var html = '<option value="" selected>城市</option>';
                    $.each(data, function(index, item) {
                        html +='<option value="' +item.code +'">' +item.city + "</option>";
                    });
                    $("#city").html(html);
                    $('.spu-cont #parent option[value="' +spuUtils.hospitalSpuData.province +'"]').attr("selected", true);
                    $('.spu-cont #city option[value="' +spuUtils.hospitalSpuData.city +'"]').attr("selected", true);
                });
				
				//医院图片遍历
				spuUtils.hospitalSpuData.pic_urls.length>0 ? spuUtils.hospitalSpuData.pic_urls.forEach(function(item, index) {
		          	spuUtils.hospitalSpuData["img" + (index + 1)] = item;
			        if (spuUtils.hospitalSpuData["img" + (index + 1)]) {
			            let domTemp = "#hospitalPic_" + (index + 1);
			            $(domTemp).attr("data-src", spuUtils.hospitalSpuData["img" + (index + 1)]).next().prepend(
			                '<img style="display: inline-block;width: 100px;height: 100px;" src="' +
			                  imgPath + spuUtils.hospitalSpuData["img" + (index + 1)] + '">'
			              );
			        }
		        }) : [];
		        //honor : [],//荣誉奖项图片集合
				spuUtils.hospitalSpuData.honor.length>0 ? spuUtils.hospitalSpuData.honor.forEach(function(ite, ind) {
		            let domTemp2 = "#honor" + (ind + 1);
		            $(domTemp2).attr("data-src", ite).next().prepend(
		                '<img style="display: inline-block;width: 100px;height: 100px;" src="' +
		                  imgPath + ite + '">'
		              );
		        }) : [];
		        //brand : [],//品牌认证图片集合
				spuUtils.hospitalSpuData.brand.length>0 ? spuUtils.hospitalSpuData.brand.forEach(function(it, inde) {
		            let domTemp2 = "#brand" + (inde + 1);
		            $(domTemp2).attr("data-src", it).next().prepend(
		                '<img style="display: inline-block;width: 100px;height: 100px;" src="' +
		                  imgPath + it + '">'
		              );
		        }) : [];
				//填充内容
				$(".spu-cont #hospitalspuName").data("id", spuUtils.hospitalSpuData.id).val(spuUtils.hospitalSpuData.hospitalspuName);
				$(".spu-cont #anotherName").val(spuUtils.hospitalSpuData.anotherName);//医院简称
				// $('.spu-cont #city').html('<option value="' + spuUtils.hospitalSpuData.city + '">' + spuUtils.hospitalSpuData.city + '</option>');
				$(".spu-cont #hospitalStreet").val(spuUtils.hospitalSpuData.street);
				$(".spu-cont #service_type").val(spuUtils.hospitalSpuData.service_type);
				$(".spu-cont #ziben_type").val(spuUtils.hospitalSpuData.ziben_type);
				$(".spu-cont #hospital_type").val(spuUtils.hospitalSpuData.hospital_type);
				$(".spu-cont #service_grade").val(spuUtils.hospitalSpuData.service_grade);
				spuUtils.hospitalSpuData.good_projects.forEach(function(currentValue) {
					$(".spu-cont input[name='good_projects'][value='" + currentValue + "']").attr("checked", true);
				});
				$('.spu-cont .formControls input[type="checkbox"]:checked').trigger("change");
				$(".spu-cont #build_date").val(spuUtils.hospitalSpuData.build_date);
				$(".spu-cont #introduce").val(spuUtils.hospitalSpuData.introduce);
				$(".spu-cont #business_date").val(spuUtils.hospitalSpuData.business_date);
				$(".spu-cont #licence_date").val(spuUtils.hospitalSpuData.licence_date);
				$(".spu-cont #examination_date").val(spuUtils.hospitalSpuData.examination_date);
				$(".spu-cont #hospitalTelphone").val(spuUtils.hospitalSpuData.telphone);
				$(".spu-cont #hospitalEmail").val(spuUtils.hospitalSpuData.email);
				$(".spu-cont #hospitalPropaganda").val(spuUtils.hospitalSpuData.propaganda);
				$(".spu-cont #legal_name").val(spuUtils.hospitalSpuData.legal_name);
			    $(".spu-cont #legal_id_card").val(spuUtils.hospitalSpuData.legal_id_card);
			    $(".spu-cont #legal_telphone").val(spuUtils.hospitalSpuData.legal_telphone);

				
				//单张图片显示  
				$("#uploadlogo").attr("data-src", spuUtils.hospitalSpuData.logo).next().prepend('<img style="display: inline-block;width: 100px;height: 100px;" src="' +imgPath +spuUtils.hospitalSpuData.logo +'">');                                             
				$("#business_license").attr("data-src", spuUtils.hospitalSpuData.business_license).next().prepend('<img style="display: inline-block;width: 100px;height: 100px;" src="' +imgPath +spuUtils.hospitalSpuData.business_license +'">');
				$("#licence").attr("data-src", spuUtils.hospitalSpuData.licence).next().prepend('<img style="display: inline-block;width: 100px;height: 100px;" src="' +imgPath +spuUtils.hospitalSpuData.licence +'">');
				$("#examination").attr("data-src", spuUtils.hospitalSpuData.examination).next().prepend('<img style="display: inline-block;width: 100px;height: 100px;" src="' +imgPath +spuUtils.hospitalSpuData.examination +'">');

			}
			
			
		}
	},
	
	//获取SPU数据
	getHospitalData: function(id,boolean, callback) {
		var url = base,
      		data = {};
		if(boolean){
    		url+="case/getHospitalInfoById";
    		data.id = id;
    	}else{
    		url+="hospital/getHospitalByHisId";
    		data.his_id = id;
    	}
		$.get(url , data , function(res) {
			if(res.data != null) {
				spuUtils.cache = res.data;
				spuUtils.hospitalSpuData.id = res.data.id; //id
				spuUtils.hospitalSpuData.user_id = res.data.user_id;//ueserid
				spuUtils.hospitalSpuData.city = res.data.cityId; //城市编号
				spuUtils.hospitalSpuData.hospitalspuName = res.data.name; //医院名称
				spuUtils.hospitalSpuData.anotherName = res.data.anotherName; //医院简称
				// spuUtils.hospitalSpuData.service_type = res.data.service_type; //服务类型
				spuUtils.hospitalSpuData.ziben_type = res.data.ziben_type; //资本类型
				spuUtils.hospitalSpuData.hospital_type = res.data.hospital_type; //医院类型
				spuUtils.hospitalSpuData.service_grade = res.data.service_grade; //业务等级
				res.data.good_projects = res.data.good_projects.split(",");
				spuUtils.hospitalSpuData.good_projects = res.data.good_projects; //擅长项目
				spuUtils.hospitalSpuData.build_date = res.data.build_date; //成立时间
				spuUtils.hospitalSpuData.introduce = res.data.introduce; //医院介绍
				spuUtils.hospitalSpuData.telphone = res.data.telphone; //座机
				spuUtils.hospitalSpuData.email = res.data.email; //邮箱
				spuUtils.hospitalSpuData.business_license = res.data.business_license; //营业执照图片
				spuUtils.hospitalSpuData.licence = res.data.licence; //许可证图片
				spuUtils.hospitalSpuData.examination = res.data.examination; //审查证明图片
				spuUtils.hospitalSpuData.business_date = res.data.business_date; //营业执照有效期
				spuUtils.hospitalSpuData.licence_date = res.data.licence_date; //营业执照有效期
				spuUtils.hospitalSpuData.examination_date = res.data.examination_date; //营业执照有效期
				spuUtils.hospitalSpuData.logo = res.data.logo; //医院logo
				spuUtils.hospitalSpuData.propaganda = res.data.propaganda; //宣传语
				spuUtils.hospitalSpuData.legal_name = res.data.legal_name; //医院法人姓名
				spuUtils.hospitalSpuData.legal_id_card = res.data.legal_id_card; //医院法人身份证号
				spuUtils.hospitalSpuData.legal_telphone = res.data.legal_telphone; //医院法人手机号
				spuUtils.hospitalSpuData.pic_urls = res.data.pic_urls; //医院相册集合
				spuUtils.hospitalSpuData.honor = res.data.honor; //honor : [],//荣誉奖项图片集合
				spuUtils.hospitalSpuData.brand = res.data.brand; //brand : [],//品牌认证图片集合
				spuUtils.hospitalSpuData.street = res.data.street; //街道
				spuUtils.hospitalSpuData.his_id = res.data.his_id;//历史id
			}
			callback();
		});
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
		data.user_id = spuUtils.hospitalSpuData.user_id;//user_id
		data.his_id = spuUtils.hospitalSpuData.his_id;//历史id
		if(spuUtils.hospitalSpuData.id){
			data.id =spuUtils.hospitalSpuData.id;//id
		}

//		layer.load(2);
		
		
//		var flag = true;
//    	for (const key in data) {
//	        if (spuUtils.cache[key] != data[key]) {
//	          flag = false;
//	        }
//    	}
//	    if (flag) {
//	    	var index = parent.layer.getFrameIndex(window.name);
//	        parent.layer.close(index);
//	    } else {
		var index = layer.load(1, {
			shade: [0.8, "#fff"] //0.1透明度的白色背景
		});
		if(spuUtils.hospitalSpuData.isTrue){
	        spuUtils.hospitalSpuData.isTrue = false;
			$.ajax({
				type: "POST",
				url: base + "case/insertHospital.do",
				data: JSON.stringify(data),
				contentType: "application/json;charset=utf-8",
				success: function(res) {
					if(res.status == "0") {
						$.Huimodalalert(res.message, 1500);
						var _data = res.data;
						var goUrl = "hospitalNewDetails.html?";
           					goUrl +="id="+ _data.id + "&status=" + _data.status;
							var index = parent.layer.getFrameIndex(window.name);
							parent.layer.iframeSrc(index, goUrl);//重置页面
//							parent.layer.close(index);
//						spuUtils.openHospDetail(_data);
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
//		}	
	},
	
};

$(function() {
	//初始化
	spuUtils.init();
	// 步骤二省市选择
	$("#parent").on("change", function(e) {
		var self = this;
        CacheData.getData('getArea', function ( data) {
        	data = data[$(self).find("option:checked").index() -1].citys;
        	if (data.length) {
                var html = '<option value="" selected>城市</option>';
                $.each(data, function(index, item) {
                    html +=
                        '<option value="' + item.code + '">' + item.city + "</option>";
                });
                $("#city").html(html);
			}
        })
	});

	// 本地读取上传文件
	$('.spu-cont input[type="file"]').change(function() {
		var _that = this;
		newUploadImg($(this), function(src) {
//			$(_that).parents(".formControls").find($(".avatar")).remove();
			if(src) {
				layer.closeAll("loading");
				$(_that).attr("data-src", src);
				$(_that).next("label").prepend($('<img style="display: inline-block;width: 100px;height: 100px;" src=' + imgPath + src + ">" ));
			} else {
				$.Huialert("获取图片路径失败", 1500);
			}
		});
	});

	//提交
	$(".spu-cont .submit-btn").on("click", function() {
		
		var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; 
//		var phone = /^0\d{2,3}-?\d{7,8}(-\d{1,6})?$/;
		var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;//电话
		var idCadReg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;//身份证号
		//记录医院名称
		spuUtils.hospitalSpuData.hospitalspuName = $(".spu-cont #hospitalspuName").val();
		//记录医院简称
		spuUtils.hospitalSpuData.anotherName = $(".spu-cont #anotherName").val();
		//省份
		spuUtils.hospitalSpuData.province = $(".spu-cont #parent").val();
		//城市
		spuUtils.hospitalSpuData.city = $(".spu-cont #city").val();
		//街道地址
		spuUtils.hospitalSpuData.street = $(".spu-cont #hospitalStreet").val();
		//服务类型
		spuUtils.hospitalSpuData.service_type = $(".spu-cont #service_type").val();
		//资本类型
		spuUtils.hospitalSpuData.ziben_type = $(".spu-cont #ziben_type").val();
		//医院类型
		spuUtils.hospitalSpuData.hospital_type = $(".spu-cont #hospital_type").val();
		//业务等级
		spuUtils.hospitalSpuData.service_grade = $(".spu-cont #service_grade").val();
		//成立时间
		spuUtils.hospitalSpuData.build_date = $(".spu-cont #build_date").val();
		//医院介绍
		spuUtils.hospitalSpuData.introduce = $(".spu-cont #introduce").val();

		if(spuUtils.hospitalSpuData.good_projects.length == 0) {
			$('.spu-cont input[type="checkbox"]:checked').each(function() {
				//擅长项目
				spuUtils.hospitalSpuData.good_projects.push($(this).val());
			});
		} else {
			$('.spu-cont input[type="checkbox"]:checked').each(function() {
				var flag = true;
				var $this = $(this);
				//擅长项目
				spuUtils.hospitalSpuData.good_projects.forEach(function(item) {
					if($this.val() == item) {
						flag = false;
						return;
					}
				});
				if(flag) {
					//擅长项目
					spuUtils.hospitalSpuData.good_projects.push($(this).val());
				}
			});
		}
		//营业执照or民办非企业单位证书
		spuUtils.hospitalSpuData.business_license = $(".spu-cont #business_license").attr("data-src");
		//医疗机构执业许可证
		spuUtils.hospitalSpuData.licence = $(".spu-cont #licence").attr("data-src");
		//医疗广告审查证明
		spuUtils.hospitalSpuData.examination = $(".spu-cont #examination").attr("data-src");
		//营业执照or民办非企业单位证书有效期
		spuUtils.hospitalSpuData.business_date = $(".spu-cont #business_date").val();
		//医疗机构执业许可证有效期
		spuUtils.hospitalSpuData.licence_date = $(".spu-cont #licence_date").val();
		//医疗广告审查证明有效期
		spuUtils.hospitalSpuData.examination_date = $(".spu-cont #examination_date").val();
		//电话
		spuUtils.hospitalSpuData.telphone = $(".spu-cont #hospitalTelphone").val();
		//邮件
		spuUtils.hospitalSpuData.email = $(".spu-cont #hospitalEmail").val();
		//医院宣传语
		spuUtils.hospitalSpuData.propaganda = $(".spu-cont #hospitalPropaganda").val();
		//医院法人姓名
		spuUtils.hospitalSpuData.legal_name = $(".spu-cont #legal_name").val();
		//医院法人身份证号
		spuUtils.hospitalSpuData.legal_id_card = $(".spu-cont #legal_id_card").val();
		//医院法人手机号
		spuUtils.hospitalSpuData.legal_telphone = $(".spu-cont #legal_telphone").val();
		//医院Logo
		spuUtils.hospitalSpuData.logo = $('.spu-cont input[name="logo"]').attr("data-src");

		// 医院名称非空判断
		if(!spuUtils.hospitalSpuData.hospitalspuName) {
			$.Huimodalalert("请填写医院名称", 1500);
			return false;
		}
		// 医院简称非空判断
		if(!spuUtils.hospitalSpuData.anotherName) {
			$.Huimodalalert("请填写医院简称", 1500);
			return false;
		}
		//省份
		if(!spuUtils.hospitalSpuData.province) {
			$.Huimodalalert("请选择省份", 1500);
			return false;
		}
		//城市
		if(!spuUtils.hospitalSpuData.city) {
			$.Huimodalalert("请选择城市", 1500);
			return false;
		}
		//街道地址
		if(!spuUtils.hospitalSpuData.street) {
			$.Huimodalalert("请填写街道地址", 1500);
			return false;
		}
		//资本类型
		if(!spuUtils.hospitalSpuData.ziben_type) {
			$.Huimodalalert("请选择资本类型", 1500);
			return false;
		}
		//医院类型
		if(!spuUtils.hospitalSpuData.hospital_type) {
			$.Huimodalalert("请选择医院类型", 1500);
			return false;
		}
		//擅长项目
		if(!spuUtils.hospitalSpuData.good_projects.length) {
			$.Huimodalalert("请选择擅长项目", 1500);
			return false;
		}
		//成立时间
		if(!spuUtils.hospitalSpuData.build_date) {
			$.Huimodalalert("请选择成立时间", 1500);
			return false;
		}
		//医院介绍
		if(!spuUtils.hospitalSpuData.introduce) {
			$.Huimodalalert("请输入医院介绍", 1500);
			return false;
		}
		//营业执照or民办非企业单位证书
		if(!spuUtils.hospitalSpuData.business_license) {
			$.Huimodalalert("请上传营业执照or民办非企业单位证书", 1500);
			return false;
		}
		//营业执照or民办非企业单位证书有效期
		if(!spuUtils.hospitalSpuData.business_date) {
			$.Huimodalalert("请选择营业执照or民办非企业单位证书有效期", 1500);
			return false;
		}
		//医疗机构执业许可证
		if(!spuUtils.hospitalSpuData.licence) {
			$.Huimodalalert("请上传医疗机构执业许可证", 1500);
			return false;
		}
		//医疗机构执业许可证有效期
		if(!spuUtils.hospitalSpuData.licence_date) {
			$.Huimodalalert("请选择医疗机构执业许可证有效期", 1500);
			return false;
		}
		//医疗广告审查证明
		if(!spuUtils.hospitalSpuData.examination) {
			$.Huimodalalert("请上传医疗广告审查证明", 1500);
			return false;
		}
		//医疗广告审查证明有效期
		if(!spuUtils.hospitalSpuData.examination_date) {
			$.Huimodalalert("请选择医疗广告审查证明有效期", 1500);
			return false;
		}
		// 座机
		if(!spuUtils.hospitalSpuData.telphone) {
			$.Huimodalalert("请输入座机", 1500);
			return false;
		}
//		else if(!phone.test(spuUtils.hospitalSpuData.telphone)){
//			$.Huimodalalert("请输入座机格式不正确!", 1500);
//			return false;
//		}
		//邮箱
		if(!spuUtils.hospitalSpuData.email) {
			$.Huimodalalert("请输入邮箱", 1500);
			return false;
		}else if(!myreg.test(spuUtils.hospitalSpuData.email)){
			$.Huimodalalert("请输入邮箱格式不正确!", 1500);
			return false;
		}
		//宣传语
		if(!spuUtils.hospitalSpuData.propaganda) {
			$.Huimodalalert("请输入医院宣传语", 1500);
			return false;
		}
		//医院法人姓名
		if(!spuUtils.hospitalSpuData.legal_name) {
			$.Huimodalalert("请输入医院法人姓名", 1500);
			return false;
		}
		//医院法人身份证号
		if(!spuUtils.hospitalSpuData.legal_id_card) {
			$.Huimodalalert("请输入医院法人身份证号", 1500);
			return false;
		}else if(!idCadReg.test(spuUtils.hospitalSpuData.legal_id_card)){
			$.Huimodalalert("输入医院法人身份证号不正确!", 1500);
			return false;
		}
		//医院法人手机号
		if(spuUtils.hospitalSpuData.legal_telphone && !phoneReg.test(spuUtils.hospitalSpuData.legal_telphone)){
			$.Huimodalalert("输入医院法人手机号不正确!", 1500);
			return false;
		}
		//医院Logo
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
	$("#hospitalPic_1").on("change", function() {
		getImgEvent($(this), 1, 0);
	});
	$("#hospitalPic_2").on("change", function() {
		getImgEvent($(this), 1, 1);
	});
	$("#hospitalPic_3").on("change", function() {
		getImgEvent($(this), 1, 2);
	});
	$("#hospitalPic_4").on("change", function() {
		getImgEvent($(this), 1, 3);
	});
	$("#hospitalPic_5").on("change", function() {
		getImgEvent($(this), 1, 4);
	});
	$("#hospitalPic_6").on("change", function() {
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