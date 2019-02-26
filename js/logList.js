// 表单输入验证
var checkInput = {
	// 验证非空
	empty: function($self, $parent) {
		var val = $self.val(),
			title = $parent.find(".title").text();

		if(val == "") {
			$self.addClass("error");
			$.Huimodalalert(title + "不能为空", 2000);
			return false;
		}

		$self.removeClass("error");
	},

	// 验证值必须为数字
	number: function($self, $parent) {
		var $collections = $parent.find("input"),
			length = $collections.length,
			val = +$self.val(),
			index = 0,
			compare;

		if(val === 0) {
			$self.val("");
		}

		if(isNaN(val)) {
			$self.addClass("error");
			$.Huimodalalert("请填写一个数字值", 2000);
			return false;
		}

		if(val < 0) {
			$self.addClass("error");
			$.Huimodalalert("数字值应为正数", 2000);
			return false;
		}

		if(length > 1) {
			if($self.get(0) == $collections.get(0)) {
				compare = +$collections.eq(1).val();
				compare = isNaN(compare) ? 0 : compare;
				if(val && compare && val > compare) {
					$self.addClass("error");
					$.Huimodalalert("最小值应小于最大值", 2000);
					return false;
				}
			} else {
				compare = +$collections.eq(0).val();
				compare = isNaN(compare) ? 0 : compare;
				if(val && compare && val < compare) {
					$self.addClass("error");
					$.Huimodalalert("最大值应大于最小值", 2000);
					return false;
				}
			}
		}

		$self.removeClass("error");
	},

	// 验证值必须为手机号格式
	phone: function($self, $parent) {
		var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/,
			val = $self.val();

		if(val && !phoneReg.test(val)) {
			$self.addClass("error");
			$.Huimodalalert("手机号码格式错误", 2000);
			return false;
		}

		$self.removeClass("error");
	}
};

var pageUtil = {
	// 页面缓存
	cache: {},
	hospitalList: [],
	role: {},
	// 设置项目信息
    setSelectType: function($self) {
        pageUtil.setSelectValue($self);

        CacheData.getData('selectAllCategory', function (data) {

            if ($self.parent().index() == 1) {
                data = pageUtil.currentProData[$self.index()].hdGoodsCategory;

            } else if($self.parent().index() == 0) {
                data = pageUtil.currentProData = data[$self.index()].hdGoodsCategory;
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

                $self.parent().next().html(html);
            }
        })
    },

	setSelectCity: function($self) {
        CacheData.getData('getArea', function (data) {
            data = data[$self.index()].citys;
            var html = '';
            $.each(data, function (index, item) {
                html += '<li data-id="' + item.code + '">' + item.city + '</li>'
            });
            $self.parent().next().html(html);
            pageUtil.setSelectCityValue($self);
        })
	},
	// 设置城市信息选择值
	setSelectCityValue: function($self) {
		var $wrap = $self.closest(".type-select-panel.city"),
			$result = $wrap.find(".result em");

		$result.text(pageUtil.getSelectCityValue($self));
	},
	// 获取城市信息选择
	getSelectCityValue: function($self) {
		var $wrap = $self.closest(".type-select-panel.city"),
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

	// 设置项目信息选择值
	setSelectValue: function($self) {
		var $wrap = $self.closest(".type-select-panel"),
			$result = $wrap.find(".result em");

		$result.text(pageUtil.getSelectValue($self));
	},
	// 获取项目信息选择
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
		var $target = option.$target || $(".hospital");
		name = option.name || "";
		cityId = option.cityId || "";

		$.get(
			base + "case/getHospitalByCityIdOrName.do", {
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

	// 获取品牌列表
	getBrand: function(option) {
		var $target = option.$target || $(".name-select-panel"),
			name = option.name || 0;

		$.post(
			base + "mall/selectAllCategory.do", {
				parentId: name
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

	// 获取查询参数
	getSearchValue: function() {
		var data = {},
			$wrap = $("#pageSearchForm");
		data.cityId = $wrap.find(".select-city").attr("data-id") || "";
//		data.project = $wrap.find(".select-classify").attr("data-id") || "";
		data.project = $wrap.find(".select-classify").text() || "";
		data.hospital_id = $wrap.find(".select-hospital").attr("data-id") || "";
		data.status = $("#progress option:selected").val() || ""; //审核状态
		data.caseId = $("#caseId").val() || ""; //审核状态
		return data;
	},

	// 过滤空参数
	filterEmpty: function(obj) {
		var keys = Object.keys(obj),
			i = 0,
			length = keys.length;

		for(i; i < length; i++) {
			if(!obj[keys[i]]) {
				delete obj[keys[i]];
			}
		}

		return obj;
	},

	// 获取商品列表
	getLogsList: function(obj) {
		var data = pageUtil.getSearchValue();

		data.pageNum = (obj && obj.curr) || 1; // 默认第1页
		data.pageSize = (obj && obj.pageSize) || 20; // 默认一页20条数据

		pageUtil.cache.pageInfo = {
			curr: data.pageNum,
			pageSize: data.size
		};

		data = pageUtil.filterEmpty(data);

		if(pageUtil.role.id == "10") {
			$.get(base + "case/myCase", data, function(res) {
				if(res.status == "0" && res.data) {
					if(res.data.length) {
						pageUtil.cache.listCache = res.data;
						pageUtil.renderLogsSku(res.data);
					} else {
						$("#listCtnWrap").html("");
					}

					// 设置分页
					setPagination({
						elem: $("#pagination"),
						totalCount: res.dataCount,
						curr: data["pageNum"],
						callback: function(obj) {
							// pageUtil.getGoodsList(obj);
							pageUtil.getLogsList(obj);
						}
					});
				} else if(res.status == "9999") {
					// 未登录
					window.top.location.href = "../../login.html";
				} else {
					$("#listCtnWrap").html("");
					$.Huimodalalert(res.message, 2000);
				}
			});
		} else {
			$.get(base + "case/getCaseOrLog.do", data, function(res) {
				if(res.status == "0" && res.data) {
					if(res.data.length) {
						pageUtil.cache.listCache = res.data;
						pageUtil.renderLogsSku(res.data);
					} else {
						$("#listCtnWrap").html("");
					}

					// 设置分页
					setPagination({
						elem: $("#pagination"),
						totalCount: res.dataCount,
						curr: data["pageNum"],
						callback: function(obj) {
							// pageUtil.getGoodsList(obj);
							pageUtil.getLogsList(obj);
						}
					});
				} else if(res.status == "9999") {
					// 未登录
					window.top.location.href = "../../login.html";
				} else {
					$("#listCtnWrap").html("");
					$.Huimodalalert(res.message, 2000);
				}
			});
		}
	},

	// 渲染纯 sku 的商品列表
	renderLogsSku: function(data) {
		var html = "",
			obj = null;

		$.each(data, function(childIndex, child) {
			pageUtil.hospitalList.forEach(function(hospitalItem) {
				// console.log(hospitalItem.id+'===='+child.hospital_id);
				if(hospitalItem.id == child.hospital_id) {
					child.hospital = hospitalItem.name;
					return;
				}
			});
			html +=
				'<tr class="text-c list-line" data-id="' +
				(child.id || "") +
				'" data-hisid="' +
				(child.his_id || "") +
				'" data-status="' +
				(child.status || "") +
				'">\
			        <td>' +
				(child.id || "") +
				"</td>\
					<td>" +
				(child.project || "") +
				"</td>\
			        <td>" +
				(child.hospital_name || "") +
				"</td>\
			        <td>" +
				(child.doctor_name || "") +
				"</td>\
			        <td>" +
				(child.goods_name || "") +
				"</td>\
			        <td>" +
				(child.city_name || "") +
				'</td>\
			        <td class='+ (child.before_main_video? "video" : "") +'> <img class="avatar size-XL" src="' +
				(child.before_main ? imgPath + child.before_main : imgPath + child.before_main_video_pic) +
				'"></td><td class='+ (child.after_main_video ? "video" : "" )+ '><img class="avatar size-XL" src="' +
				(child.after_main_pic ? imgPath + child.after_main_pic : '') +
				'"></td><td>' +
				(child.addTime.substring(0, 10) || "") +
				"</td>\
			        <td>" +
				(child.status == 10 || child.status == 11 ?
					child.status == 10 ? "上架" : "下架" :
					"") +
				'</td>\
			        <td><a href="javascript:void(0)" class="see-detail blues contact">查看</a></td>\
			        <td>' +
				(pageUtil.role.id == "10" ?
					child.status == 10 || child.status == 11 ?
					"" :
					child.status == 1 || child.status == 3 ?
					"审核中" :
					child.status == 2 || child.status == 4 ?
					"审核失败" :
					child.status == 5 ?
					"审核成功" :
					child.status ? child.status : "" :
					child.status == 10 || child.status == 11 ?
					"" :
					child.status == 1 ?
					"初审中" :
					child.status == 2 ?
					"初审失败" :
					child.status == 3 ?
					"复审中" :
					child.status == 4 ?
					"复审失败" :
					child.status == 5 ?
					"审核成功" :
					child.status ? child.status : "") +
				'</td>\
			        <td class="f-14">\
			        	<a href="javascript:void(0)" class="see-detail blues see">查看</a><span class="edit"></span>' +
					((pageUtil.role.id == "1" || pageUtil.role.id == "2" || pageUtil.role.id == "3") ? "<a href='javascript:void(0)' class='Delete blues' target=''>删除</a>" : "")   + 	
					(((pageUtil.role.id == "1" || pageUtil.role.id == "7") &&
						child.status == 1) ?
					"&nbsp;<a href='javascript:void(0)' class='see-detail blues checkButton'>审核</a>" :
					"" ||
					((pageUtil.role.id == "1" ||
							pageUtil.role.id == "2" ||
							pageUtil.role.id == "3") &&
						child.status == 3) ?
					"&nbsp;<a href='javascript:void(0)' class='see-detail blues checkButton'>审核</a>" :
					"") +
				"</td>\
        </tr>";
		});
		$("#listCtnWrap").html(html);
	}
};

$(function() {
	$.ajax({
		async: true,
		type: "get",
		url: base + "sys/getUserHasRole",
		data: {},
		success: function(res) {
			if(res.status == "0") {
				pageUtil.role = res.data[0];
				if(pageUtil.role.id == "10") {
					$("#progress").val("");
					$("#progress").parent().hide();
					$(".select-city").parent().parent().hide();
					$(".select-hospital").parent().parent().hide();
				} 
				$("#screeBtn").trigger("click");
			}
		}
	});
	$.ajax({
		async: true,
		type: "get",
		url: base + "case/getHospitalByCityIdOrName.do",
		data: {
			cityId: "",
			name: ""
		},
		success: function(res) {
			var html = "";
			if(res.status == "0") {
				pageUtil.hospitalList = res.data;
			}
		}
	});
	$.get(base + "sys/getUserHasRole", function(res) {
		if(res.status == "0") {
			pageUtil.role = res.data[0];
			if(pageUtil.role.id == "10") {} else if(pageUtil.role.id == "7") {} else if(
				pageUtil.role.id == "1" ||
				pageUtil.role.id == "2" ||
				pageUtil.role.id == "3"
			) {} else {
				// $("#progress").val("");
			}
			// $("#screeBtn").trigger("click");
		}
	});
	// 城市选择弹窗初始化
	CacheData.getData('getArea', function (data) {
        var html = "";
        pageUtil.provinceList = data;
        $.each(data, function(index, item) {
            html += '<li data-id="' + item.code + '">' + item.province + "</li>";
        });
        $(".type-select-panel.city")
            .find(".ul-1")
            .html(html);
    })

	var $collections = $(".common-form-wrap");
	$collections.on("blur", "input,select", function(e) {
		var $self = $(this),
			$parent = $self.parent(),
			type = $self.attr("data-check"),
			checkList = [];

		if(type && !$self.prop("disabled")) {
			checkList = type.split(",");

			$.each(checkList, function(index, ele) {
				return checkInput[ele] && checkInput[ele]($self, $parent);
			});
		}
	});

	// 分类选择弹窗初始化
	CacheData.getData('selectAllCategory', function (data) {
        var html = "";
        $.each(data, function(index, item) {
            html += '<li data-id="' + item.id + '">' + item.name + "</li>";
        });

        $(".type-select-panel.classify")
            .find(".ul-1")
            .html(html);
    })

	// // 擅长项目选择弹窗初始化
	// pageUtil.getGood_projects({});
	// 医院选择弹窗初始化
	pageUtil.getHospital_id({});
	// // 品牌选择弹窗初始化
	// pageUtil.getBrand({});

	//选择项目弹窗展示隐藏
	$(".select-classify").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".type-select-panel.classify");

		$target.toggle();
	});
	// 选择分类弹窗点击分类
	$(".type-select-panel.classify")
		.on("click", function(e) {
			e.stopPropagation();
		})
		.on("click", "li", function() {
			// 点击选择项
			var $self = $(this),
				$parent = $self.parent();

			$self.addClass("check").siblings().removeClass("check");

			$parent.nextAll("ul").html("");

			pageUtil.setSelectType($self);
		})
		.on("click", ".close-panel", function() {
			// 关闭弹窗
			var $self = $(this),
				$parent = $self.closest(".type-select-panel.classify");

			$parent.hide();
		})
		.on("click", ".get-result", function() {
			// 确认选择
			var $self = $(this),
				$parent = $self.closest(".type-select-panel.classify"),
				$target = $parent.siblings(".select-classify");

			$target.text(pageUtil.getSelectValue($self)).attr("data-id", $parent.find(".check:last").attr("data-id"));
			$parent.hide();
		});
	// 选择弹窗展示隐藏
	$(".select-brand").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".name-select-panel");

		$target.toggle();
	});
	$(".select-hospital").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".name-select-panel");

		$target.toggle();
	});
	$(".select-doctor").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".name-select-panel");

		$target.toggle();
	});

	// 选择城市弹窗展示隐藏
	$(".select-city").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".type-select-panel.city");

		$target.toggle();
	});
	// 选择城市弹窗点击城市
	$(".type-select-panel.city")
		.on("click", function(e) {
			e.stopPropagation();
		})
		.on("click", "li", function() {
			// 点击选择项
			var $self = $(this),
				$parent = $self.parent();

			$self.addClass("check").siblings().removeClass("check");

			$parent.nextAll("ul").html("");

			pageUtil.setSelectCity($self);
		})
		.on("click", ".close-panel", function() {
			// 关闭弹窗
			var $self = $(this),
				$parent = $self.closest(".type-select-panel.city");

			$parent.hide();
		})
		.on("click", ".get-result", function() {
			// 确认选择
			var $self = $(this),
				$parent = $self.closest(".type-select-panel.city"),
				$target = $parent.siblings(".select-city");

			$target
				.text(pageUtil.getSelectCityValue($self))
				.attr("data-id", $parent.find(".check:last").attr("data-id"));
			$parent.hide();
		});
	//------------------------------------------------------------------------
	// 选择擅长项目弹窗
	$(".projects")
		.on("click", function(e) {
			e.stopPropagation();
		})
		.on("keyup", "input", function() {
			// 弹窗内搜索删选
			var $self = $(this),
				val = $self.val(),
				$target = $self.closest(".projects");

			pageUtil.getGood_projects({
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

			$wrap.hide().siblings(".select-brand").text(val).attr("data-id", id);
		});
	// 选择医院弹窗
	$(".hospital")
		.on("click", function(e) {
			e.stopPropagation();
		})
		.on("keyup", "input", function() {
			// 弹窗内搜索删选
			var $self = $(this),
				val = $self.val(),
				$target = $self.closest(".hospital"),
				cityId = "";

			pageUtil.getHospital_id({
				$target: $target,
				name: val,
				cityId: $(".select-city").data("id") || ""
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

	// 查询商品列表
	$("#screeBtn").on("click", function() {
		pageUtil.getLogsList();
	});
	//----------------------------------------------------------------------
	// 重置查询列表
	$("#resetBtn").on("click", function() {
		var $wrap = $("#pageSearchForm");
		$wrap.find("#operationTime").val("");
		$wrap.find(".select-classify").attr("data-id", "").text("");
		$wrap.find(".condition-panel").find("li").removeClass("check");
		$wrap.find(".select-hospital").attr("data-id", "").text("请选择医院");
		$wrap.find(".select-city").attr("data-id", "").text("请选择城市");
		pageUtil.getHospital_id({
			$target: $wrap.find(".hospital")
		});
		$wrap.find("#good_projects").val("");
		$wrap.find("#hospital_id").val("");
		$wrap.find("#doctor_id").val("");
		$wrap.find("#progress").val("");
		$wrap.find("#caseId").val("");

		pageUtil.getLogsList();
	});

	// 新增按钮
	$("#addBtn").on("click", function() {
		layer.open({
			type: 2,

			title: "添加日记信息",
			shadeClose: false,
			shade: [0.5, "#000"],
			maxmin: false, //开启最大化最小化按钮
			area: ["80%", "90%"],
			content: "logSPU.html"
		});
	});

	$(".goods-list")
		// 相关联系人
		.on("click", ".contact", function() {
			var $self = $(this),
				$parent = $self.closest(".list-line"),
				his_id = $parent.attr("data-hisid");
			// console.log(his_id)
			$.get(
				base + "case/getCaseContacts", {
					his_id: his_id
				},
				function(jsonData) {
					console.log(jsonData);
					var result = typeof jsonData;
					if(result == "string") {
						jsonData = JSON.parse(jsonData);
					}
					if(jsonData.status == "0") {
						if(pageUtil.role.id == "10") {
							if(jsonData.data[0]) {
								jsonData.data = [jsonData.data[0]];
							}
						}
						var html = template("contact", jsonData);
						layer.open({
							type: 1,
							title: "相关联系人",
							shadeClose: true,
							shade: [0.5, "#000"],
							maxmin: false,
							area: ["80%", "90%"],
							content: html,
							success: function(layero, index) {}
						});
					} else {
						$.Huimodalalert(jsonData.message, 1500);
					}
				}
			);
		})
		.on("click", ".see", function() {
			var $self = $(this),
				$parent = $self.closest(".list-line"),
				id = $parent.attr("data-id"),
				his_id = $parent.attr("data-hisid"),
				status = $parent.attr("data-status");
			var toUrl = "logDetail.html?";
			if(status == 10 || status == 11) {
				toUrl += "id=" + id + "&status=" + status;
			} else {
				toUrl += "hisId=" + his_id + "&status=" + status;
			}
			if(status) {
				layer.open({
					type: 2,
					title: "案例详情",
					shadeClose: false,
					shade: [0.5, "#000"],
					maxmin: false, //开启最大化最小化按钮
					area: ["90%", "90%"],
					content: toUrl
				});
			}
		})
		.on('click', '.Delete', function () {//删除
        	var $self = $(this),
        		$parent = $self.closest(".list-line"),
        		id = $parent.attr("data-id"),
        		hisid = $parent.attr("data-hisid"),
        		status = $parent.attr("data-status");
        	html = template("delete", {id:id,hisid:hisid,status:status});
          	layer.open({
            	type: 1,
            	title: "删除",
            	shadeClose: true,
            	shade: [0.5, "#000"],
            	maxmin: false,
	            area: ["80%", "35%"],
	            content: html,
	            success: function(layero, index) {
	              	function deleteFun(ids, msg, staT, hisId) {
		                var data = {};
		                if (staT >= 10) {
		                  	data.id = ids;
		                  	data.delete_msg = msg;
		                }else{
		                	data.his_id = hisId;
		                	data.delete_msg = msg;
		                }
		                $.ajax({
		                  	type: "post",
		                  	url: base + "case/deleCase",
		                  	processData: false,
		                  	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
		                  	dataType: "json",
		                  	data: JSON.stringify(data),
		                  	success: function(res) {
			                    if (res.status == "0") {
			                      	parent.layer.msg("删除成功！");
			                      	window.setTimeout(function() {
			                        	layer.close(index);
			                        	window.location.reload();
			                      	}, 2000);
			                    } else {
			                      	$.Huimodalalert(res.message, 1500);
			                    }
		                  	}
		                });
		            }
	              	$(".submitDelete").on("click", function() {
	              		var $Wrap = $(".deleteWrap"),
	              			getId = $Wrap.attr("data-id"),
	              			types = $Wrap.attr("data-status"),
	              			hisId = $Wrap.attr("data-hisid"),
		                	vals = $Wrap.find("#delete_msg").val();
	                  	if (vals.replace(/(^s*)|(s*$)/g, "").length >= 0 && vals != "") {
	                    	deleteFun(getId, vals, types, hisId);
	                  	} else {
	                    	parent.layer.msg("请输入删除原因！");
	                  	}
	              	});
            	}
	        });	
        })
		//商品审核
		.on("click", ".checkButton", function() {
			var $self = $(this),
				$parent = $self.closest(".list-line"),
				id = $parent.attr("data-id"),
				his_id = $parent.attr("data-hisid"),
				status = $parent.attr("data-status");
			var url = base,
				data = {},
				html = "";
			if(status == "10" || status == "11") {
				if(id) {
					url += "case/getCaseById";
					data.id = id;
				}
			} else {
				if(his_id) {
					url += "case/getCaseByHisId";
					data.his_id = his_id;
				}
			}
			$.get(url, data, function(res) {
				if(res.message) {
					$.Huimodalalert(res.message, 2000);
				} else if(!res.message) {
					if(res.data == undefined) {
						return;
					}
					res.data.imgPath = imgPath;
					html = template("check", res.data);
					layer.open({
						type: 1,
						title: "审核",
						shadeClose: true,
						shade: [0.5, "#000"],
						maxmin: false,
						area: ["80%", "90%"],
						content: html,
						success: function(layero, index) {
							function check(type, msg) {
								var data = {};
								if(id) {
									data.id = parseInt(id);
								}
								if(his_id) {
									data.his_id = parseInt(his_id);
								}
								if(status) {
									data.status = parseInt(status);
								}
								if(type == 1) {
									data.result = 1;
									data.msg = "";
								} else if(type == 2) {
									data.result = 2;
									data.msg = msg;
								} else {
									return;
								}
								$.ajax({
									type: "post",
									url: base + "case/revieweCase",
									processData: false,
									contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
									dataType: "json",
									data: JSON.stringify(data),
									success: function(jsonData) {
										var result = typeof jsonData;
										if(result == "string") {
											jsonData = JSON.parse(jsonData);
										}
										if(jsonData.status == "0") {
											// $.Huimodalalert("审核完成", 1500);
											parent.layer.msg("审核完成", {
												time: 1500
											});
											window.setTimeout(function() {
												layer.close(index);
												window.location.reload();
											}, 2000);
										} else {
											$.Huimodalalert(jsonData.message, 1500);
										}
									}
								});
							}
							$("#pass").on("click", function() {
								layer.confirm(
									"确认审核通过？", {
										btn: ["提交", "取消"] //按钮
									},
									function() {
										check(1);
									},
									function() {}
								);
							});
							$("#refuse").on("click", function() {
								layer.prompt({
									title: "拒绝原因",
									formType: 2,
									yes: function(index, layero) {
										var strings = layero.find(".layui-layer-input").val();
										if(
											strings.replace(/(^s*)|(s*$)/g, "").length > 0 &&
											strings != ""
										) {
											check(2, layero.find(".layui-layer-input").val());
										} else {
											parent.layer.msg("请填写拒绝原因！");
										}
									}
								});
							});
						}
					});
				}
			});
		});

	$("body").on("click", function(e) {
		var $target = $(e.target);

		if(!$target.hasClass("select-classify") &&
			!$target.hasClass("type-select-panel")
		) {
			$(".type-select-panel.classify").hide();
		}

		if(!$target.hasClass("select-brand") &&
			!$target.hasClass("name-select-panel")
		) {
			$(".projects").hide();
		}

		if(!$target.hasClass("select-hospital") &&
			!$target.hasClass("name-select-panel")
		) {
			$(".hospital").hide();
		}
		if(!$target.hasClass("select-city") &&
			!$target.hasClass("type-select-panel.city")
		) {
			$(".type-select-panel.city").hide();
		}
		if(!$target.hasClass("select-doctor") &&
			!$target.hasClass("name-select-panel")
		) {
			$(".doctor").hide();
		}
	});

	$("#marketPrice, #couponPrice").on("blur", function() {
		var $self = $(this),
			val = +$self.val();

		if(typeof val !== "number" || val < 0) {
			$self.val(0);
		}
	});

	//$("#screeBtn").trigger("click");
});