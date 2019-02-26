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
	role: {},
	// 设置分类信息
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

                $self
                    .parent()
                    .next()
                    .html(html);
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

	// 设置分类信息选择值
	setSelectValue: function($self) {
		var $wrap = $self.closest(".type-select-panel.classify"),
			$result = $wrap.find(".result em");

		$result.text(pageUtil.getSelectValue($self));
	},
	// 获取分类信息选择
	getSelectValue: function($self) {
		var $wrap = $self.closest(".type-select-panel.classify"),
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

	// 获取查询参数
	getSearchValue: function() {
		var data = {},
			$wrap = $("#pageSearchForm");
			
		data.cat = $wrap.find(".select-classify").text() || ""; //分类名称
//		data.catid = $wrap.find(".select-classify").attr("data-id") || ""; //分类id
		data.name = $("#searchName").val() || ""; //商品名称
		data.goodId = $("#goodId").val() || ""; //商品ID
		data.cityId = $wrap.find(".select-city").attr("data-id") || "";
		data.hospital_id = $wrap.find(".select-hospital").attr("data-id") || "";
		data.status = $("#progress option:selected").val() || ""; //审核状态
		if($("#Price").val() == "1") {
			data.qzd_price_min = $("#startAmount").val() || ""; //平台价最低
			data.qzd_price_max = $("#endAmount").val() || ""; //平台价最高
		} else {
			data.hos_price_min = $("#startAmount").val() || ""; //平台价最低
			data.hos_price_max = $("#endAmount").val() || ""; //平台价最高
		}

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
	getGoodsList: function(obj) {
		var data = pageUtil.getSearchValue();

		data.pageNum = (obj && obj.curr) || 1; // 默认第1页
		data.pageSize = (obj && obj.pageSize) || 20; // 默认一页20条数据

		pageUtil.cache.pageInfo = {
			curr: data.pageNum,
			pageSize: data.size
		};

		data = pageUtil.filterEmpty(data);
		if(pageUtil.role.id == "10") {
			$.get(base + "mall/myGoods", data, function(res) {
				console.log(res)

				if(res.status == "0" && res.data) {
					if(res.data.length) {
						pageUtil.cache.listCache = res.data;

						pageUtil.renderGoodsSpu(res.data);
					} else {
						$("#listCtnWrap").html("");
					}
					// 设置分页
					setPagination({
						elem: $("#pagination"),
						totalCount: res.dataCount,
						curr: data["pageNum"],
						callback: function(obj) {
							pageUtil.getGoodsList(obj);
						}
					});
				} else if(res.status == "9999") {
					// 未登录
					parent.window.top.location.href = "../../login.html";
				} else {
					$("#listCtnWrap").html("");
					$.Huimodalalert(res.message, 2000);
				}
			});
		} else {
			$.get(base + "mall/goodsList", data, function(res) {
				console.log(res)
				if(res.status == "0" && res.data) {
					if(res.data.length) {
						pageUtil.cache.listCache = res.data;

						pageUtil.renderGoodsSpu(res.data);
					} else {
						$("#listCtnWrap").html("");
					}

					// 设置分页
					setPagination({
						elem: $("#pagination"),
						totalCount: res.dataCount,
						curr: data["pageNum"],
						callback: function(obj) {
							pageUtil.getGoodsList(obj);
						}
					});
				} else if(res.status == "9999") {
					// 未登录
					parent.window.top.location.href = "../../login.html";
				} else {
					$("#listCtnWrap").html("");
					$.Huimodalalert(res.message, 2000);
				}
			});
		}
	},

	// 渲染商品列表
	renderGoodsSpu: function(data) {
		var html = "";

		$.each(data, function(index, item) {
			html +=
				'<tr class="text-c list-line" data-id="' +
				(item.id || "") +
				'" data-hisid="' +
				(item.his_id || "") +
				'" data-status="' +
				(item.status || "") +
				'">\
            <td>' +
				(item.id || "") +
				"</td>\
			<td>" +
				(item.name || "") +
				"</td>\
            <td>" +
				(item.cat || "") +
				"</td>\
            <td data-id='" +
				(item.cityId || "") +
				"'>" +
				(item.cityName || "") +
				"</td>\
            <td>" +
				(item.hospital_name || item.hospital_id || "") +
				"</td>\
            <td>" +
				(item.doctor_name || item.doctor_id || "") +
				"</td>\
            <td>" +
				(item.qzd_price || "") +
				"</td>\
            <td>" +
				(item.create_time || "") +
				"</td>\
            <td>" +
				(item.status == 10 || item.status == 11 ?
					item.status == 10 ? "上架" : "下架" :
					"") +
				'</td>\
            <td>\
                <a href="javascript:void(0)" class="see-detail blues contact">查看</a>\
            </td>\
            <td>' +
				(pageUtil.role.id == "10" ?
					item.status == 10 || item.status == 11 ?
					"" :
					item.status == 1 || item.status == 3 ?
					"审核中" :
					item.status == 2 || item.status == 4 ?
					"审核失败" :
					item.status == 5 ? "审核成功" : item.status ? item.status : "" :
					item.status == 10 || item.status == 11 ?
					"" :
					item.status == 1 ?
					"初审中" :
					item.status == 2 ?
					"初审失败" :
					item.status == 3 ?
					"复审中" :
					item.status == 4 ?
					"复审失败" :
					item.status == 5 ?
					"审核成功" :
					item.status ? item.status : "") +
				'</td>\
            <td class="f-14">\
                <a href="javascript:void(0)" class="see-detail blues goodDetail">查看</a>' +
                ((pageUtil.role.id == "1" || pageUtil.role.id == "2" || pageUtil.role.id == "3") ? "<a href='javascript:void(0)' class='Delete blues' target=''>删除</a>" : "")   + 
				((pageUtil.role.id == "1" || pageUtil.role.id == "7") &&
					item.status == 1 ?
					"&nbsp;<a href='javascript:void(0)' class='see-detail blues checkButton'>审核</a>" :
					"" ||
					((pageUtil.role.id == "1" || pageUtil.role.id == "2" || pageUtil.role.id == "3") &&item.status == 3) ?
					"&nbsp;<a href='javascript:void(0)' class='see-detail blues checkButton'>审核</a>" :
					"") +
				"</td>\
        </tr>";
		});
		$("#listCtnWrap").html(html);
	},
	// 获取医院列表
	getHospital_id: function(option) {
		var $target = option.$target || $(".hospital");
		name = option.name || "";
		cityId = option.cityId || "";

		$.get(base + "case/getHospitalByCityIdOrName.do", {
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
	}
};

$(function() {
	var $collections = $(".common-form-wrap");
	$.get(base + "sys/getUserHasRole", function(res) {
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
	});
	$collections
		.on("blur", "input,select", function(e) {
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
		})
		.on("change", "#Price", function() {
			console.log($(this).val());
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

	//选择分类弹窗展示隐藏
	$(".select-classify").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".type-select-panel.classify");

		$target.toggle();
	});

	// 选择城市弹窗展示隐藏
	$(".select-city").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".type-select-panel.city");

		$target.toggle();
	});
	$(".select-hospital").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".name-select-panel");
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

			$target
				.text(pageUtil.getSelectValue($self))
				.attr("data-id", $parent.find(".check:last").attr("data-id"));
			$parent.hide();
		});

	// 选择品牌弹窗
	$(".name-select-panel")
		.on("click", function(e) {
			e.stopPropagation();
		})
		.on("keyup", "input", function() {
			// 弹窗内搜索删选
			var $self = $(this),
				val = $self.val(),
				$target = $self.closest(".name-select-panel");
		})
		.on("click", "li", function() {
			// 点击选择品牌
			var $self = $(this),
				$wrap = $self.closest(".name-select-panel"),
				val = $self.text(),
				id = $self.attr("data-id");

			$wrap.hide().siblings(".select-brand").text(val).attr("data-id", id);
		});

	pageUtil.getHospital_id({});

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

	//所在医院
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
		pageUtil.getGoodsList();
	});

	// 重置查询列表
	$("#resetBtn").on("click", function() {
		var $wrap = $("#pageSearchForm");

		$wrap.find(".select-classify").attr("data-id", "").text("");
		$wrap.find(".condition-panel").find("ul:gt(0)").empty();
		$wrap.find(".condition-panel").find("li").removeClass("check");
		$wrap.find(".select-brand").attr("data-id", "").text("请选择品牌");
		$wrap.find(".name-select-panel").find("input").val("");
		$wrap.find(".name-select-panel").find("ul").empty();
		$wrap.find(".select-city").attr("data-id", "").text("请选择城市");
		$wrap.find(".select-hospital").attr("data-id", "").text("请选择所在医院");
		$wrap.find("#searchName").val("");
		$wrap.find("#roleStatus").val("");
		$wrap.find("#Price").val("");
		$wrap.find("#startAmount").val("");
		$wrap.find("#endAmount").val("");
		$wrap.find("#progress").val("");
		$wrap.find("#goodId").val("");
		pageUtil.getHospital_id({
			$target: $wrap.find(".hospital")
		});
		pageUtil.getGoodsList();
	});

	$(".goods-list")
		//商品查看
		.on("click", ".goodDetail", function() {
			var $self = $(this),
				$parent = $self.closest(".list-line"),
				id = $parent.attr("data-id"),
				his_id = $parent.attr("data-hisid"),
				status = $parent.attr("data-status");
			var toUrl = "goodDetail.html?";
			if(status == 10 || status == 11) {
				toUrl += "id=" + id + "&status=" + status;
			} else {
				toUrl += "hisId=" + his_id + "&status=" + status;
			}
			if(status) {
				layer.open({
					type: 2,
					title: "商品详情",
					shadeClose: false,
					shade: [0.5, "#000"],
					maxmin: false, //开启最大化最小化按钮
					area: ["90%", "90%"],
					content: toUrl
				});
			}
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
					url += "mall/getGoods";
					data.id = id;
				}
			} else {
				if(his_id) {
					url += "mall/getGoodsByHisId";
					data.his_id = his_id;
				}
			}
			$.get(url, data, function(res) {
				if(res.message) {
					$.Huimodalalert(res.message, 2000);
				} else if(!res.message) {
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
									url: base + "mall/revieweGoods",
									processData: false,
									contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
									dataType: "json",
									data: JSON.stringify(data),
									success: function(jsonData) {
										console.log(jsonData)
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
										console.log(strings)
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
		                  	url: base + "mall/deleGoods",
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
		// 相关联系人查看
		.on("click", ".contact", function() {
			var $self = $(this),
				$parent = $self.closest(".list-line"),
				his_id = $parent.attr("data-hisid");
			$.get(base + "mall/getGoodsContacts", {
				his_id: his_id
			}, function(
				jsonData
			) {
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
			});
		});

	// 新增按钮
	$("#addBtn").on("click", function() {
		layer.open({
			type: 2,
			title: "添加商品",
			shadeClose: false,
			shade: [0.5, "#000"],
			maxmin: false, //开启最大化最小化按钮
			area: ["80%", "90%"],
			content: "SPU.html"
		});
	});

	$("body").on("click", function(e) {
		var $target = $(e.target);

		if(!$target.hasClass("select-classify") &&
			!$target.hasClass("type-select-panel")
		) {
			$(".type-select-panel.classify").hide();
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
	});

	$("#marketPrice, #couponPrice").on("blur", function() {
		var $self = $(this),
			val = +$self.val();

		if(typeof val !== "number" || val < 0) {
			$self.val(0);
		}
	});
});