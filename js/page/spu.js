var spuUtils = {
	spuData: {
		name: "", //商品名称
		catid: "", //品类id
		cat: "", //品类名称
		doctor_id: "", //医生id
		hospital_id: "", //医院id
		keyword: "", //关键字
		qzd_price: "", //平台价
		hos_price: "", //医院价
		appo_price: "", //预约金
		left_price: "", //尾款
		discount: "", //活动
		goods_detail_url: "", //图片路径
		content: "", //详情内容
        brand: '', // 品牌名称
        standard: '', // 规格
		commitment: '无隐性消费,未使用随时退款',
        goods_video_url: '',
        goods_video_url_pic: '',
		id: "",
		his_id: "",
		status: "",
		img1: "",
		img2: "",
		img3: "",
		img4: "",
		img5: "",
		img6: "",
		video: '',
		goods_urls: [],
		config: {
			width: 828,
			// height: 1104,
			quality: 0.8
		},
		imgs: [],
		index:"",
		isTrue:true,
	},
	//初始化
	init: function() {
		var path = location.href;
		var index = parent.layer.getFrameIndex(window.name);
		spuUtils.spuData.index = index;
		if(path.indexOf("?") >= 0) {
			var params = path
				.substring(path.indexOf("?") + 1, path.length)
				.split("&"),
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

			function callBack() {
				$(".spu-cont .select-classify").attr("data-id", spuUtils.spuData.catid).text(spuUtils.spuData.cat);
				$("#spuName").val(spuUtils.spuData.name);
				$(".spu-cont .select-hospital").attr("data-id", spuUtils.spuData.hospital_id).text(spuUtils.spuData.hospital_name);
				$(".spu-cont .select-doctor").attr("data-id", spuUtils.spuData.doctor_id).text(spuUtils.spuData.doctor_name);
				$("#hos_price").val(spuUtils.spuData.hos_price);
				$("#qzd_price").val(spuUtils.spuData.qzd_price);
				$("#appo_price").val(spuUtils.spuData.appo_price);
				$("#left_price").val(spuUtils.spuData.left_price);
				if (spuUtils.spuData.brand) {
                    $('.select-brand-t').html(spuUtils.spuData.brand.split('>')[0]);
                    $('.select-brand').html(spuUtils.spuData.brand.split('>')[1]);
				}
				if (spuUtils.spuData.standard) {
                    $('.select-standard-detail').html(spuUtils.spuData.standard);
                    spuUtils.spuData.standard.indexOf('ml')>0 && $('.select-standard').html('毫升');
                    spuUtils.spuData.standard.indexOf('单位')>0 && $('.select-standard').html('单位');
                    spuUtils.spuData.standard.indexOf('CC')>0 && $('.select-standard').html('CC');
				}

				if (spuUtils.spuData.goods_detail_url) {
                    WEditor.txt.html('<img src='+ imgPath + spuUtils.spuData.goods_detail_url + ' />');
                    spuUtils.spuData.goods_detail_url = '';
				}
                spuUtils.spuData.detail_page && WEditor.txt.html(spuUtils.spuData.detail_page);
				if (spuUtils.spuData.commitment) {
                    spuUtils.spuData.commitment.indexOf('提前7天')>0 && $('#commitment').prop('checked', 'true')
				}

				spuUtils.spuData.goods_video_url && (function () {
					$('#uploadVideo').next().append('<video src=' + spuUtils.spuData.goods_video_url +' autoplay loop></video>')
                })()

                spuUtils.spuData.goods_video_url_pic && (function () {
                    $('#uploadVideoCover').attr('data-src', spuUtils.spuData.goods_video_url_pic).next().append('<img style="display: inline-block;width: 100%;height: 100%;" src='+ imgPath + spuUtils.spuData.goods_video_url_pic +'></img>')
                })()
				$('#validityTime').val(spuUtils.spuData.validityTime);
                $('#rebate').val(spuUtils.spuData.rebate);
                $('#rebate_endTime').val(spuUtils.spuData.rebate_endTime);
				spuUtils.spuData.goods_urls.forEach(function(item, index) {
					spuUtils.spuData["img" + (index + 1)] = item;
					if(spuUtils.spuData["img" + (index + 1)]) {
						let domTemp = "#before_" + (index + 1);
						$(domTemp)
							.attr("data-src", spuUtils.spuData["img" + (index + 1)])
							.next()
							.prepend(
								'<img style="display: inline-block;width: 100%;height: 100%;" src="' +
								imgPath +
								spuUtils.spuData["img" + (index + 1)] +
								'">'
							);

					}
				});

				!spuUtils.spuData.goods_video_url_pic && $('.upload-pic-wrap img').first().parents('.loadpic-wrap').append('<span class="pic-cover">封面</span>')
				if(spuUtils.spuData.goods_detail_url) {
					$("#commodityImg").attr("data-src", spuUtils.spuData.goods_detail_url).next().prepend(
							'<img style="display: inline-block;width: 100%;height: 100%;" src="' +
							imgPath +spuUtils.spuData.goods_detail_url +'">');
				}
			}
			spuUtils.spuData.status = status;
			if(status == "10" || status == "11") {
				if(id) {
					spuUtils.spuData.id = id;
					spuUtils.getGoodData(id, true, callBack);
				}
			} else {
				if(his_id) {
					spuUtils.spuData.his_id = his_id;
					spuUtils.getGoodData(his_id, false, callBack);
				}
			}
		} else {
			$(".role-row").addClass("active");
		}

		// 产品规格
		this.renderProductSpec()
	},
	//获取SPU数据
	getGoodData: function(id, boolean, callback) {
		var url = base,
			data = {};
		if(boolean) {
			(url += "mall/getGoods"), (data.id = id);
		} else {
			url += "mall/getGoodsByHisId";
			data.his_id = id;
		}
		$.get(url, data, function(res) {
			if(res.data != null) {
				spuUtils.cache = res.data;
				spuUtils.spuData.id = res.data.id; //id
				spuUtils.spuData.his_id = res.data.his_id; //id
				spuUtils.spuData.name = res.data.name; //商品名称
				spuUtils.spuData.appo_price = res.data.appo_price; //预约金
				spuUtils.spuData.discount = res.data.discount; //折扣
				spuUtils.spuData.cat = res.data.cat; //品类名称
                // res.data.goods_url && res.data.goods_urls.push(res.data.goods_url);
				spuUtils.spuData.goods_urls = res.data.goods_urls; //商品图片路径
				spuUtils.spuData.catid = res.data.catid; //品类id
				spuUtils.spuData.doctor_id = res.data.doctor_id; //医生id
				spuUtils.spuData.doctor_name = res.data.doctor_name; //医生id
				spuUtils.spuData.hospital_id = res.data.hospital_id; //医院id
				spuUtils.spuData.hospital_name = res.data.hospital_name; //医院名称
				spuUtils.spuData.hos_price = res.data.hos_price; //医院价
				spuUtils.spuData.keyword = res.data.keyword; //关键字
				spuUtils.spuData.left_price = res.data.left_price; //尾款
				spuUtils.spuData.qzd_price = res.data.qzd_price; //平台价
				spuUtils.spuData.goods_detail_url = res.data.goods_detail_url; // 图片
                spuUtils.spuData.goods_video_url = spuUtils.spuData.video = res.data.goods_video_url; // 视频
                spuUtils.spuData.goods_video_url_pic = res.data.goods_video_url_pic;// 视频封面

				spuUtils.spuData.brand = res.data.brand;
				spuUtils.spuData.standard = res.data.standard;
				spuUtils.spuData.commitment = res.data.commitment;
				spuUtils.spuData.validityTime = res.data.validityTime;
				spuUtils.spuData.rebate = res.data.rebate;
				spuUtils.spuData.rebate_endTime = res.data.rebate_endTime;
				spuUtils.spuData.detail_page = res.data.detail_page

            }
			callback();
		});
	},
	//清空规格图册
	clearSpecDataImg: function() {
		for(var k = 0; k < spuUtils.spuData.specData.length; k++) {
			for(var m = 0; m < spuUtils.spuData.specData[k].attrs.length; m++) {
				spuUtils.spuData.specData[k].attrs[m].img = "";
			}
		}
		for(var i = 0; i < spuUtils.spuData.skuList.length; i++) {
			spuUtils.spuData.skuList[i].imgs = "";
		}
	},


	//保存新添加数据
	saveSPUData: function() {
		var data = {};
		data.catid = $(".spu-cont #catid").attr("data-id"); //品类id
		data.cat = $(".spu-cont #catid").text(); //品类名称
		data.name = $(".spu-cont #spuName").val(); //商品名称
		data.hospital_id = $(".select-hospital").attr("data-id"); //医院id
		data.doctor_id = $(".select-doctor").data("id"); //医生id
		data.keyword = spuUtils.spuData.keyword; //关键字
		data.qzd_price = $("#qzd_price").val(); //平台价
		data.hos_price = $("#hos_price").val(); //医院价
		data.appo_price = $("#appo_price").val(); //预约金
		data.left_price = $("#left_price").val(); //尾款
		data.content = spuUtils.spuData.content; //详情内容
		data.brand = spuUtils.spuData.brand;
		data.standard = $('.select-standard-detail').html() == '请选择产品规格'?null:$('.select-standard-detail').html();
		data.commitment = spuUtils.spuData.commitment;
		data.detail_page = WEditor.txt.html();
		data.validityTime = $('#validityTime').val();
		data.rebate = $('#rebate').val();
		data.rebate_endTime = $('#rebate_endTime').val();
		data.goods_urls = spuUtils.spuData.goods_urls; //图片数组
		data.goods_video_url =  spuUtils.spuData.video || spuUtils.spuData.goods_video_url;
		data.goods_video_url_pic = $('#uploadVideoCover').attr('data-src') || spuUtils.spuData.goods_video_url_pic;
		data.goods_detail_url = spuUtils.spuData.goods_detail_url; //详情图片地址

//		layer.load(2);
		if(spuUtils.spuData.status) {
			data.his_id = spuUtils.spuData.his_id; //历史id
			if(spuUtils.spuData.id) {
				data.id = spuUtils.spuData.id; //商品id
			}
//			var flag = true;
//			for(const key in data) {
//				if(spuUtils.cache[key] != data[key]) {
//					flag = false;
//				}
//			}
//			if(flag) {
//				parent.layer.close(parent.layer.index);
//			} else {
			var index = layer.load(1, {
				shade: [0.8, "#fff"] //0.1透明度的白色背景
			});
			if(spuUtils.spuData.isTrue){
	        	spuUtils.spuData.isTrue = false;
				$.ajax({
					type: "POST",
					url: base + "mall/uptGoods",
					data: JSON.stringify(data),
					contentType: "application/json;charset=utf-8",
					success: function(res) {
						if(res.status == "0") {
							$.Huimodalalert(res.message ? res.message : "修改成功！", 1500);
							var _data = res.data;
							var goUrl = "goodNewDetail.html?";
           						goUrl +="hisId="+ _data.his_id + "&status=" + _data.status;
//								var index = parent.layer.getFrameIndex(window.name);
								parent.layer.iframeSrc(spuUtils.spuData.index, goUrl);//重置页面
//								parent.layer.close(parent.layer.index);
						} else {
							$.Huimodalalert(res.message, 1500);
						}
					},
					complete: function() {
						spuUtils.spuData.isTrue = true;
						layer.closeAll("loading");
					}
				});
			}
//			}
		} else {
			$.ajax({
				type: "POST",
				url: base + "mall/addGoods",
				data: JSON.stringify(data),
				contentType: "application/json;charset=utf-8",
				success: function(res) {
					if(res.status == "0") {
						$.Huimodalalert(res.message ? res.message : "添加成功！", 1500);
						setTimeout(function() {
							var index = parent.layer.getFrameIndex(window.name);
							parent.layer.close(index);
							//刷新列表
							window.parent.location.href = window.parent.location.href;
						}, 1500);
					} else {
						$.Huimodalalert(res.message, 1500);
					}
				},
				complete: function() {
					layer.closeAll("loading");
				}
			});
		}
	},

	// 获取设置分类信息
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

	//产品品牌
    renderProductBrandList: function () {
		CacheData.getData('brand', function (data) {
            renderDom(spuUtils.brandList = spuUtils.changeData(data,'category_name', 'brand_name'))
        })
		function renderDom(data) {
			var str = '';
			data.forEach(function (t) {
				str+='<li>'+ t.name +'</li>';
			})
			$('#brandNameList').html(str);
        }
       
    },

    // 更改数据格式
    changeData: function(data, parent_Key, child_key){
    	var json = [], inedx;	
		data.forEach(function(v){
			(index = delRep(json, v[parent_Key]))?json[index-1].child.push(v[child_key]):
    			json.push({name: v[parent_Key], child: [v[child_key]]});
			//console.log(index)
    	})

    	// 重复的不在添加
    	function delRep(data, name) {
    		var flag = null;
			data.forEach(function(v, index){
    			//console.log(index)
    			if (v.name == name) {
		    		flag = index;
    			} else {
    				flag = null;
    			}
    		})
			flag = flag === null?flag:++flag;
			return flag; // 去除0的情况
    	}

    	return json;
    }, 


    //产品品牌
    renderProductBrand: function (index) {
    	renderDom(spuUtils.brandList[index].child)
        function renderDom(data) {
            var str = '';
            data.forEach(function (t) {
                str+='<li>'+ t +'</li>'
            })
            $('#brandName').html(str);
        }
    },
	// 产品规格类型
	renderProductSpec: function () {
        CacheData.getData('standard', function (data) {
            renderDom(spuUtils.standardList =  spuUtils.changeData(data, 'type', 'number'))
        })
        function renderDom(data) {
            var str = '';
            data.forEach(function (t) {
                str+='<li>'+ t.name +'</li>'
            })
            $('#standardType').html(str);
        }
    },

	renderProduceSpecDetail:function (index) {
      	renderDom(spuUtils.standardList[index].child)
		function renderDom(data) {
            var str = '';
            data.forEach(function (t) {
                str+='<li>'+ t +'</li>'
            })
            $('#standard').html(str);
        }
	},

	// 设置封面
    setImgToCover:function ($self) {
		var str = '<span class="pic-cover">封面</span>';

		$('.pic-cover').remove();
		$self.parents('.loadpic-wrap').append(str);
        
        // 封面地址放到数组第一位
   		var arr = spuUtils.spuData.goods_urls;
		arr.unshift(arr.splice($self.index(), 1)[0])
		spuUtils.spuData.goods_urls = arr; 
    },

	// 删除
	delImg: function (index) {
		if (index == 1) { // 删除视频信息

			spuUtils.spuData.video = '';
			spuUtils.spuData.goods_video_url = '';
		} else if (index == 2) {

			$('#uploadVideoCover').attr('data-src', '');
			spuUtils.spuData.goods_video_url_pic = '';
		} else{
			spuUtils.spuData.goods_urls[index -3] = null;
			console.log(spuUtils.spuData.goods_urls)
		}
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

		var hospital_id = $(".select-hospital").attr("data-id");
		$.get(base + "case/getDoctorByHospitalId?hospital_id=" + hospital_id, {}, function(res) {
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
		video.unbind('canplay').bind('canplay', function () {
			time = this.duration.toFixed(2);
			if (time > 180) {
                layer.msg('视频长度超出180秒');
			} else {
				next();
			}
        })
		video.bind('error', function () {
            $.Huialert('视频错误,重新上传');
        })
    }
};

$(function() {
	//初始化
	spuUtils.init();
	spuUtils.getHospital_id({});
    spuUtils.renderProductBrandList();
	// 选择医院弹窗展示隐藏
	$(".select-hospital").on("click", function() {
		var $self = $(this),
			$target = $self.next(".hospital_id");
		$($target).toggle(0, function() {});
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
			// 点击选择医院列表
			var $self = $(this),
				$wrap = $self.closest(".name-select-panel"),
				$targ = $(".select-doctor"),
				val = $self.text(),
				id = $self.attr("data-id");
			$wrap.hide().siblings(".select-hospital").text(val).attr("data-id", id);
			spuUtils.spuData.hospital_id = $self.attr("data-id");
			$targ.text("请选择主治医生").attr("data-id", "");
//			spuUtils.getDoctor_id();
		});
	//选择医生功能
	$(".doctor_id")
		.on("click", function(e) {
			e.stopPropagation();
		})
		.on("keyup", "input", function() {
			// 弹窗内搜索删选
			var $self = $(this),
				val = $self.val(),
				$target = $self.closest(".doctor_id"),
				cityId = "";

			//				spuUtils.getHospital_id({
			//					'$target': $target,
			//					'name': val,
			//					'cityId': $('#city').data('id') || ''
			//				});
		})
		.on("click", "li", function() {
			// 点击选择擅长项目
			var $self = $(this),
				$wrap = $self.closest(".name-select-panel"),
				val = $self.text(),
				id = $self.attr("data-id");

			$wrap.hide().siblings(".select-doctor").text(val).attr("data-id", id);
		});
    CacheData.getData('selectAllCategory', function (data) {
        var html = "";
		$.each(data, function(index, item) {
			html += '<li data-id="' + item.id + '">' + item.name + "</li>";
		});
		$(".type-select-panel").find(".ul-1").html(html);

    })
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
			if(!$(".spu-cont #catid").attr("data-id")) {
				$.Huimodalalert("请选择商品分类", 1500);
				return false;
			} else {
				spuUtils.spuData.catid = $(".spu-cont #catid").attr("data-id");
				spuUtils.spuData.cat = $(".spu-cont #catid").text();
			}

            if( ($('#catid').text().indexOf('肉毒素')>0 || $('#catid').text().indexOf('玻尿酸')>0) && ($("span.select-brand").html() == '请选择产品品牌')) {
                tip("选择产品品牌");
                return;
            } else { 
            	var html1 = $(".select-brand-t").html() == '请选择产品品牌'?'':$(".select-brand-t").html() ;
				var html2 = $(".select-brand").html() == '请选择产品品牌'?'':$(".select-brand").html() ;
				spuUtils.spuData.brand = html1?(html1 + '>' + html2):null;
            }

            if(($('#catid').text().indexOf('肉毒素')>0 || $('#catid').text().indexOf('玻尿酸')>0) && $("span.select-standard").html() == '请选择产品规格') {
                tip("选择产品规格");
                return;
            } else {
                spuUtils.spuData.standard = $(".select-standard").html();
            }

			if(!$("#spuName").val()) {
				$.Huimodalalert("请填写商品名称", 1500);
				return false;
			} else {
				spuUtils.spuData.name = $(".spu-cont #spuName").val();
			}

			if(!$("span.select-hospital").data("id")) {
				tip("请选择医院");
				return;
			} else {
				spuUtils.spuData.hospital_id = $("span.select-hospital").data("id");
			}

			if(!$(".select-doctor").attr("data-id")) {
				tip("请选择医生");
				return;
			} else {
				spuUtils.spuData.doctor_id = $(".select-doctor").data("id");
			}
			if($('#commitment').prop('checked')) {
				spuUtils.spuData.commitment = spuUtils.spuData.commitment + ',需要提前7天预订';
			}

		} else if(index == 2) {
			if(!$("#hos_price").val()) {
				$.Huimodalalert("请填写全价", 1500);
				return false;
			} else {
				spuUtils.spuData.hos_price = $("#hos_price").val();
			}

			if(!$("#qzd_price").val()) {
				$.Huimodalalert("请填写平台价", 1500);
				return false;
			} else {
				spuUtils.spuData.qzd_price = $("#qzd_price").val();
			}

			if(!$("#appo_price").val()) {
				$.Huimodalalert("请填写预约金", 1500);
				return false;
			} else {
				spuUtils.spuData.appo_price = $("#appo_price").val();
			}
			//			spuUtils.spuData.discount = $('#discount').val();
			spuUtils.spuData.left_price = $("#left_price").val();
		} else if(index == 3) {
			//			editor.setContent(spuUtils.spuData.content);//富文本框
		}

		$(".spu-nav .goods-step").removeClass("active").eq(index).addClass("active");
		$parentStepWrap.removeClass("active").next(".form-step").addClass("active");
	});

	//图片
	$("#before_1").on("change", function() {
		getImgEvent($(this), 1, 0);
	})
	//图片
	$("#before_2").on("change", function() {
		getImgEvent($(this), 1, 1);
	});
	//图片
	$("#before_3").on("change", function() {
		getImgEvent($(this), 1, 2);
	});
	//图片
	$("#before_4").on("change", function() {
		getImgEvent($(this), 1, 3);
	});
	//图片
	$("#before_5").on("change", function() {
		getImgEvent($(this), 1, 4);
	});
	//图片
	$("#before_6").on("change", function() {
		getImgEvent($(this), 1, 5);
	});

	$("#uploadVideoCover").on("change", function() {
		getImgEvent($(this));
	});
	// 上传视频
	$('#uploadVideo').on('change', function () {
		var self = $(this), str;
		uploadVideoHandle($(this), function (data) {
			spuUtils.spuData.video = data;	
			str = '<video src='+ data +' autoplay loop></video>'
			self.next().append($(str));
        }, spuUtils.uploadVideoBefore)
    });

	// 拖放上传
	dragUploadFile($('input[upload]'), function (src, obj) {
		var index = $(obj).parents('.loadpic-wrap').index();
        if(src) {
            obj.attr("data-src", src);
			index>=3 && (spuUtils.spuData.goods_urls[index -3] = src);
            obj.next('label').find('img').remove();
			obj.next("label").prepend(
                $('<img style="display: inline-block;width: 122px;height: 122px;" src=' +
                    imgPath +src +">"
                )
            );
        }
	}, function (file, next) {
        if (file.size/1024/1024 > 1) {
            layer.msg('图片不能大于1M');
            return;
        }
        next(file);
    })
	// 删除
	$('.upload-pic-content .del-img').click(function () {
		$(this).parents('.loadpic-wrap').find('label img,label video,.pic-cover').remove().end().find('input').attr('data-src', '');
		spuUtils.delImg($(this).parents('.loadpic-wrap').index())

    })

	function getImgEvent(obj, type,i) {
		var file = obj.get(0).files[0];

		if (file.size/1024/1024 > 1) {
			layer.msg('图片不能大于1M');
			return;
		}
		//type传值说明是手术后7张的
		commodityUploadImg(obj, function(src) {
			spuUtils.spuData.imgs = [];
			if(src) {
				//$(".layui-layer-shade").remove();
				//$(".layui-layer").remove();
				layer.closeAll("loading");
				obj.attr("data-src", src);
				if(!!type) {
					spuUtils.spuData.goods_urls[i] = src;
					console.log(spuUtils.spuData.goods_urls)
				}
				obj.next('label').find('img').remove();
				obj.next("label").prepend(
						$('<img style="display: inline-block;width: 122px;height: 122px;" src=' +
							imgPath +src +">"
						)
					);
			} else {
				$.Huialert("获取图片路径失败", 1500);
			}
		});


	}

	//提交
	$(".spu-cont .submit-btn").on("click", function() {
		if(spuUtils.spuData.id || spuUtils.spuData.his_id) {
			if(!$(".spu-cont #catid").attr("data-id")) {
				$.Huimodalalert("请选择商品分类", 1500);
				return false;
			}
			if(!$("#spuName").val()) {
				$.Huimodalalert("请填写商品名称", 1500);
				return false;
			}

			if(!$("span.select-hospital").data("id")) {
				tip("请选择医院");
				return;
			}
			if(!$(".select-doctor").data("id")) {
				tip("请选择医生");
				return;
			}
			if(!$("#hos_price").val()) {
				$.Huimodalalert("请填写全价", 1500);
				return false;
			}

			if(!$("#qzd_price").val()) {
				$.Huimodalalert("请填写平台价", 1500);
				return false;
			}

			if(!$("#appo_price").val()) {
				$.Huimodalalert("请填写预约金", 1500);
				return false;
			}
			//			spuUtils.spuData.discount = $('#discount').val();
			spuUtils.spuData.left_price = $("#left_price").val();
		}
		if(!spuUtils.spuData.video && !$('#uploadVideoCover').attr('data-src') && !$("#before_1").attr("data-src") && !$("#before_2").attr("data-src") &&
			!$("#before_3").attr("data-src") &&!$("#before_4").attr("data-src") && !$("#before_5").attr("data-src") && !$("#before_6").data("src")
		) {
		
			tip("请上传至少一张商品图或视频!");
			return;

		} else {
	
			spuUtils.spuData.img1 = $("#before_1").data("src");
			spuUtils.spuData.img2 = $("#before_2").data("src");
			spuUtils.spuData.img3 = $("#before_3").data("src");
			spuUtils.spuData.img4 = $("#before_4").data("src");
			spuUtils.spuData.img5 = $("#before_5").data("src");
			spuUtils.spuData.img6 = $("#before_6").data("src");
		}

		if (spuUtils.spuData.video && !$('#uploadVideoCover').attr('data-src')) {
			 tip('请上传视频封面');
			 return;
		}
		if (!spuUtils.spuData.video && $('#uploadVideoCover').attr('data-src')) {
			 tip('请上传视频');
			 return;
		}
        
		if (!$('.upload-pic-wrap .pic-cover').length && !spuUtils.spuData.goods_video_url_pic && !$('#uploadVideoCover').attr('data-src')) {
			 tip('请设置封面');
            return
		}

		if(WEditor.txt.html().length <= 12) {
			tip("请填写商品详情");
			return;
		} else {
			spuUtils.spuData.detail_page = WEditor.txt.html();
		}

		if (WEditor.txt.html().length > 4000) {
            tip("商品详情内容过多");
            return;
		}
		if( ($('#catid').text().indexOf('肉毒素')>0 || $('#catid').text().indexOf('玻尿酸')>0) && ($("span.select-brand").html() == '请选择产品品牌')) {
                tip("选择产品品牌");
                return;
            } else { 
            	var html1 = $(".select-brand-t").html() == '请选择产品品牌'?'':$(".select-brand-t").html() ;
				var html2 = $(".select-brand").html() == '请选择产品品牌'?'':$(".select-brand").html() ;
				spuUtils.spuData.brand = html1?(html1 + '>' + html2):null;
        }
		//spuUtils.spuData.content = editor.getContent();
		

		spuUtils.saveSPUData();
	});

	//提示窗
	function tip(msg) {
		$.Huimodalalert(msg, 1500);
	}

	/*------------- 上传sku图片 --------------*/
	$(".spec-items").delegate(".sku-item", "click", function(e) {
		var _that = this;
		if($(".spec-items .sku-item.active").size() > 0) {
			layer.confirm("更改规格将清空该规格已上传的图片，是否确认更改？", {
					btn: ["确定", "取消"]
			},function() {
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
		if(!$target.hasClass("select-hospital") &&
			!$target.hasClass("name-select-panel")
		) {
			$(".hospital_id").hide();
		}
		if(!$target.hasClass("select-doctor") &&
			!$target.hasClass("name-select-panel")
		) {
			$(".doctor_id").hide();
		}
	});

	// 显示产品品牌
	$('.select-brand-t,.select-brand').click(function () {
		$(this).siblings('.name-select-panel').toggle()
    })

    // 显示产品规格
    $('.select-standard,.select-standard-detail').click(function () {
        $(this).siblings('.name-select-panel').toggle()
    })

	// 选择产品品牌项目分类
    $('#brandNameList').on('click', 'li', function () {
        $(this).parents('.long-ipt').find('span').html($(this).html()).end().find('.name-select-panel').hide().end().next().find('.select-brand').html('').trigger('click');

        // 加载产品品牌
		spuUtils.renderProductBrand($(this).index())
    })

	// 选择产品品牌
	$('#brandName').on('click', 'li', function () {
		$(this).parents('.long-ipt').find('span').html($(this).html()).end().find('.name-select-panel').hide()
    })

	// 选择产品规格类型
    $('#standardType').on('click', 'li', function () {
        $(this).parents('.long-ipt').find('span').html($(this).html()).end().find('.name-select-panel').hide().end().next().find('.select-standard-detail').html('').trigger('click');

        // 加载规格详情
        spuUtils.renderProduceSpecDetail($(this).index());
    })

	// 选择产品规格
    $('#standard').on('click', 'li', function () {
        $(this).parents('.long-ipt').find('span').html($(this).html()).end().find('.name-select-panel').hide()
	})

	//点击选择医院
	$(".select-hospital").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".name-select-panel");
		$target.toggle();
	});
	
	// 设置封面
	$('.default-pic-wrap .set-cover').click(function () {
		var length = $(this).parent().prev().find('img').length;
		length && spuUtils.setImgToCover($(this))
    });

	//点击选择医生
	$(".select-doctor").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".doctor_id");
		if($(".select-hospital").data("id")) {
			spuUtils.getDoctor_id($target, function (data) {
				if (data) {
					$target.toggle();
				} else { }
			});
		} else {
			$.Huimodalalert("请选择医院", 1500);
		}
	});

	//计算尾款
	$(".Hui-article")
		.on("input", "#qzd_price", function() {
			var $self = $(this),
				nubWk = "";
			var nubPt = $self.val();
			if(! /^\d+$/.test(nubPt)){
				$self.val("");
				$("#appo_price").val("");
				$("#left_price").val("");
				return
			}
			var amout = nubPt *2;
			var  end_value = amout/10;
			$("#appo_price").val(Math.ceil(end_value));
			var nubYy = $("#appo_price").val();
			if(Number(nubYy) <= Number(nubPt)) {
				nubWk = nubPt - nubYy;
			} else {

				$("#appo_price").val("");
				$("#left_price").val("");
				return false;
			}
			$("#left_price").val(nubWk);
		})
		.on("change", "#appo_price", function() {
			var $self = $(this),
				nubWk = "";
			var nubYy = $self.val();
			var nubPt = $("#qzd_price").val();
			if(Number(nubYy) < Number(nubPt)) {
				nubWk = nubPt - nubYy;
			} else {
				$("#appo_price").val("");
				$("#left_price").val("");
				return false;
			}
			$("#left_price").val(nubWk);
		});

	//选择项目弹窗展示隐藏
	$(".select-classify").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".type-select-panel");

		$target.toggle();
	});
	// 选择分类弹窗点击分类
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
				$parent = $self.closest(".type-select-panel"),
				$target = $parent.siblings(".select-classify"),
				id = $parent.find(".check:last").attr("data-id");

			$target.text(spuUtils.getSelectValue($self)).attr("data-id", id);
			spuUtils.spuData.keyword = $parent.find(".check:last").text(); //关键字填充
			$parent.hide();

			// 设置必填
			if (($target.text().indexOf('肉毒素')< 0) && ($target.text().indexOf('玻尿酸') < 0)) {
				$('.require').hide();
			} else {
                $('.require').show();
			}

			// 清空品牌
			$('.select-brand-t, .select-brand').html('请选择产品品牌');

			// 清空产品规格
			$('.select-standard-detail, .select-standard').html('请选择产品规格');
		});


});