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
	imgs: [],
	
	// 获取查询参数
	getSearchValue: function() {
		var data = {},
			$wrap = $("#pageSearchForm");
		data.pub_date_start = $wrap.find("#pubDateStart").val() || "";
		data.pub_date_end = $wrap.find("#pubDateEnd").val() || ""; //审核状态
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

	// 获取列表数据
	getLogsList: function(obj) {
		var data = pageUtil.getSearchValue();

		data.pageNum = (obj && obj.curr) || 1; // 默认第1页
		data.pageSize = (obj && obj.pageSize) || 20; // 默认一页20条数据

		pageUtil.cache.pageInfo = {
			curr: data.pageNum,
			pageSize: data.size
		};
		data = pageUtil.filterEmpty(data);
		
		$.ajax({
          	type: "post",
          	url: base + "version/list",
          	processData: false,
          	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
          	dataType: "json",
          	data: JSON.stringify(data),
          	success: function(res) {
            	if(res.status == "0" && res.data) {
					if(res.data.length) {
						res.data.imgPath = imgPath;
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
          	}
        });

	},

	// 渲染列表
	renderLogsSku: function(data) {
		var html = "",
			obj = null;

		$.each(data, function(childIndex, child) {
			html +='<tr class="text-c list-line">'+
					'<td>' +(child.type || "") +'</td>'+	
					'<td>' +(child.version || "") +'</td>'+	
					'<td>' +(child.is_update =="1020"? "是": "否") +'</td>'+	
					'<td>' +(child.url || "") +'</td>'+	
					'<td>'+ (child.icon ? '<img class="avatar size-XL" src="'+imgPath+child.icon+'"/>' : "") + '</td>'+	
					'<td>' +(child.notes || "") +'</td>'+	
					'<td>' +(child.pub_date || "") +'</td>'+	
			'</tr>';

		});
		$("#listCtnWrap").html(html);
	}
};

$(function() {

	// 查询商品列表
	$("#screeBtn").on("click", function() {
		pageUtil.getLogsList();
	});
	
	//设置默认查询时间
    var t=new Date();
    var iToDay=t.getDate();
    var iToMon=t.getMonth();
    var iToYear=t.getFullYear();
    var newDay = new Date(iToYear,(iToMon-3),iToDay);
    $("#pubDateStart").val(newDay.Format("yyyy-MM-dd"));
    $("#pubDateEnd").val(new Date().Format("yyyy-MM-dd"));
    
	// 重置查询列表
	$("#resetBtn").on("click", function() {
		var $wrap = $("#pageSearchForm");
		$("#pubDateStart").val(newDay.Format("yyyy-MM-dd"));
    	$("#pubDateEnd").val(new Date().Format("yyyy-MM-dd"));
    	
		pageUtil.getLogsList();
	});

	// 新增按钮
	$("#addBtn").on("click", function() {
		var html = template("addVersions", {});
		layer.open({
			type: 1,
			title: "添加APP配置",
			shadeClose: true,
        	shade: [0.5, "#000"],
        	maxmin: false, //开启最大化最小化按钮
            area: ["80%", "60%"],
			content: html,
			success: function(layero, index) {
				$(".submits").on("click", function() {
					var data = {};
              		var $Wrap = $("#deleteWrap"),
              			type = $Wrap.find("#types option:selected").val(),
              			version = $Wrap.find(".version").val(),
              			isUpdate = $Wrap.find("#isUpdate option:selected").val(),
	                	url = $Wrap.find("#url").val(),
	                	icon = $Wrap.find("#icon").attr("data-src"),
	                	pub_date = $Wrap.find("#pub_date").val(),
	                	notes = $Wrap.find("#notes").val();
                  	if (version == "") {
                    	parent.layer.msg("请输入版本号！");
                    	return false
                  	} else if( type=="android" && url ==""){
              			parent.layer.msg("请上传下载地址！");
              			return false
                  	}else if(pub_date == ""){
                  		parent.layer.msg("请输入发布日期！");
                  		return false
                  	} else if(notes == ""){
                  		parent.layer.msg("请输入版本说明！");
                  		return false
                  	} else {
                  		data.type = type;
                  		data.version = version;
                  		data.is_update = isUpdate;
                  		data.url = url;
                  		data.pub_date = pub_date;
                  		data.notes = notes;
                  		data.icon = icon;
                    	submitFun(data);
                  	}
              	});
              	function submitFun(data) {
	                $.ajax({
	                  	type: "post",
	                  	url: base + "version/add",
	                  	processData: false,
	                  	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
	                  	dataType: "json",
	                  	data: JSON.stringify(data),
	                  	success: function(res) {
		                    if (res.status == "0") {
		                      	parent.layer.msg("发布成功！");
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
			}
		});
	});
		
       
	$("body")
		.on("change","#icon", function() {//上传图标
			getImgEvent($(this));
		})
		.on('change', '#types', function (e) {//切换系统类型
        	var p1=$(this).children('option:selected').val();//这就是selected的值  
        	if(p1=="android"){
        		$("#upcdaUrl").show();
        	}else{
        		$("#upcdaUrl").hide();
        		$("#url").val("");
        	}
       	})
		.on("change","#upUrl", function() {//上传文件
			uploadFile($(this),function(src){//上传文件
				if(src){
					$("#url").val(src);
				} else {
					$.Huialert("获取图片路径失败", 1500);
				}
			});
		})
	$("body").on("click", function(e) {
		var $target = $(e.target);

		if(!$target.hasClass("select-classify") &&
			!$target.hasClass("type-select-panel")
		) {
			$(".type-select-panel.classify").hide();
		}

		
	});
	function getImgEvent(obj, type, i) {
		//type传值说明是手术后7张的
		newUploadImg(obj, function(src) {
			pageUtil.imgs = [];
			if(src) {
				//$(".layui-layer-shade").remove();
				//$(".layui-layer").remove();
				layer.closeAll("loading");
				obj.attr("data-src", src);
				if(!!type) {
					spuUtils.after_pics[i] = src;
				}
				obj.next("label").prepend(
						$(
							'<img style="display: inline-block;width: 100px;height: 100px;" src=' +
							imgPath +
							src +
							">"
						)
					);
			} else {
				$.Huialert("获取图片路径失败", 1500);
			}
		});
	}

	$("#screeBtn").trigger("click");
});