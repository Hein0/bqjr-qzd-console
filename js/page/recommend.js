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
		data.startTime = $wrap.find("#pubDateStart").val() || "";
		data.endTime = $wrap.find("#pubDateEnd").val() || "";//审核状态
		data.referee = $wrap.find("#referee").val() || "";
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
		
		$.get(base + 'recommend/recommendList', data, function (res) {
            if(res.status == "0" && res.data) {
				if(res.data.length) {
					res.data.imgPath = imgPath;
					pageUtil.cache.listCache = res.data;
					pageUtil.renderListData(res.data);
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
       	})
	},

	// 渲染列表
	renderListData: function(data) {
		var html = "";

		$.each(data, function(Index, child) {
			html +='<tr class="text-c list-line" data-referee="'+child.referee+'">'+
					'<td>' +(child.referee || "") +'</td>'+	
					'<td>' +(child.phone || "") +'</td>'+	
					'<td>' +(child.number ||"") +'</td>'+	
					'<td>'+ '<a href="javascript:void(0)" class="seeDetail blues" target="">详情</a>' + '</td>'+	
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
    var newDay = new Date(iToYear,(iToMon-1),iToDay);
    $("#pubDateStart").val(newDay.Format("yyyy-MM-dd"));
    $("#pubDateEnd").val(new Date().Format("yyyy-MM-dd"));
    
	// 重置查询列表
	$("#resetBtn").on("click", function() {
		var $wrap = $("#pageSearchForm");
		$("#pubDateStart").val(newDay.Format("yyyy-MM-dd"));
    	$("#pubDateEnd").val(new Date().Format("yyyy-MM-dd"));
    	
		pageUtil.getLogsList();
	});
	
	//查看详情
	$("#listCtnWrap")
		.on("click", ".seeDetail", function() {
			var $self = $(this),$wrap = $("#pageSearchForm"),
		        startTime = $wrap.find("#pubDateStart").val() || "",
		        endTime = $wrap.find("#pubDateEnd").val() || "",
				$parent = $self.closest(".list-line"),
				referee = $parent.attr("data-referee");
			$.get(base + "recommend/recommendDetail", {
				referee: referee,startTime:startTime,endTime:endTime
			},function(res) {
					var result = typeof res;
					if(result == "string") {
						res = JSON.parse(res);
					}
					if(res.status == "0") {
						
						var html = template("contact", res);
						layer.open({
							type: 1,
							title: "详情",
							shadeClose: true,
							shade: [0.5, "#000"],
							maxmin: false,
							area: ["80%", "60%"],
							content: html,
							success: function(layero, index) {}
						});
					} else {
						$.Huimodalalert(res.message, 1500);
					}
				}
			);
		})
       
	$("body").on("click", function(e) {
		var $target = $(e.target);
		
	});

	//初始化点击筛选
	$("#screeBtn").trigger("click");
});