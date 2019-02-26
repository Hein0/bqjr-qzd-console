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
	id:"",
	cache: {},
	//详情数据
	detalData:{},
	imgs: [],
	
	// 获取查询参数
	getSearchValue: function() {
		var data = {},
			$wrap = $("#pageSearchForm");
		data.hospitalName = $wrap.find("#hospitalName").val() || "";//医院名称
		data.beginTime = $wrap.find("#beginTime").val() || "";//开始时间
		data.endTime = $wrap.find("#endTime").val() || "";// 结束时间
		data.content = $wrap.find("#content").val() || "";//内容
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
		
		$.get(base + 'im/queryAllMessageList', data, function (res) {
            if(res.status == "0" && res.data) {
				if(res.data.length) {
//					res.data.imgPath = imgPath;
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
			html +='<tr class="text-c list-line" data-id="'+child.id+'" data-pos="'+child.tablePos+'" >'+
					'<td>' +(child.fromUserName || "") +'</td>'+	
					'<td>' +(child.toUserName || "") +'</td>'+	
					'<td>' +(child.msgType ==1 ? child.content : '<img class="avatar size-XL vevwImg" src="'+child.imageUrl+'">') +'</td>'+	
					'<td>' +(child.createTime ||"") +'</td>'+	
//					'<td>'+ '<a href="javascript:void(0)" class="seeDetail blues" target="">会话详情</a>' + '</td>'+	
			'</tr>';
		});
		$("#listCtnWrap").html(html);
	},
	
	//查看放大图
	imgShow: function(outerdiv, innerdiv, bigimg, _this){  
        var src = _this.attr("src");//获取当前点击的pimg元素中的src属性  
        $(bigimg).attr("src", src);//设置#bigimg元素的src属性  
      
            /*获取当前点击图片的真实大小，并显示弹出层及大图*/  
        $("<img/>").attr("src", src).load(function(){  
            var windowW = $(window).width();//获取当前窗口宽度  
            var windowH = $(window).height();//获取当前窗口高度  
            var realWidth = this.width;//获取图片真实宽度  
            var realHeight = this.height;//获取图片真实高度  
            var imgWidth, imgHeight;  
            var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放  
              
            if(realHeight>windowH*scale) {//判断图片高度  
                imgHeight = windowH*scale;//如大于窗口高度，图片高度进行缩放  
                imgWidth = imgHeight/realHeight*realWidth;//等比例缩放宽度  
                if(imgWidth>windowW*scale) {//如宽度扔大于窗口宽度  
                    imgWidth = windowW*scale;//再对宽度进行缩放  
                }  
            } else if(realWidth>windowW*scale) {//如图片高度合适，判断图片宽度  
                imgWidth = windowW*scale;//如大于窗口宽度，图片宽度进行缩放  
                            imgHeight = imgWidth/realWidth*realHeight;//等比例缩放高度  
            } else {//如果图片真实高度和宽度都符合要求，高宽不变  
                imgWidth = realWidth;  
                imgHeight = realHeight;  
            }  
                    $(bigimg).css("width",imgWidth);//以最终的宽度对图片缩放  
              
            var w = (windowW-imgWidth)/2;//计算图片与窗口左边距  
            var h = (windowH-imgHeight)/2;//计算图片与窗口上边距  
            $(innerdiv).css({"top":h, "left":w});//设置#innerdiv的top和left属性  
            $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg  
        });  
          
        $(outerdiv).click(function(){//再次点击淡出消失弹出层  
            $(this).fadeOut("fast");  
        });  
    },
    //查看更多前数据
    loadHisMessages:function(){
    	$.get(base + "im/queryMessagesByMsgId", {messageId: pageUtil.detalData.data.rows[0].id ,sourceMsgId:pageUtil.id ,tablePos:pageUtil.detalData.data.rows[0].tablePos,queryType:1,pageSize:20},function(res) {
			var result = typeof res;
			if(result == "string") {
				res = JSON.parse(res);
			}
			if(res.status == "0" && res.data) {
				pageUtil.detalData = res;
				pageUtil.detalData.data.isHis = res.data.hasData;
				pageUtil.detalData.data.rows = res.data.rows.concat(pageUtil.detalData.data.rows)
				$(".layui-layer-content")[0].innerHTML = template("contact", pageUtil.detalData);
				
			} else {
				$.Huimodalalert(res.message, 1500);
			}
		});
    },
	//查看更多后数据
    loadMeroMessages:function(){
    	$.get(base + "im/queryMessagesByMsgId", {messageId: pageUtil.detalData.data.rows[pageUtil.detalData.data.rows.length-1].id ,sourceMsgId:pageUtil.id ,tablePos:pageUtil.detalData.data.rows[pageUtil.detalData.data.rows.length-1].tablePos,queryType:2,pageSize:20},function(res) {
			var result = typeof res;
			if(result == "string") {
				res = JSON.parse(res);
			}
			if(res.status == "0" && res.data) {
				pageUtil.detalData = res;
				pageUtil.detalData.data.isMero = res.data.hasAfterData;
				pageUtil.detalData.data.rows = res.data.rows.concat(pageUtil.detalData.data.rows)
				$(".layui-layer-content")[0].innerHTML = template("contact", pageUtil.detalData);
				
			} else {
				$.Huimodalalert(res.message, 1500);
			}
		});
    },
    
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
    $("#beginTime").val(newDay.Format("yyyy-MM-dd"));
    $("#endTime").val(new Date().Format("yyyy-MM-dd"));
    
	// 重置查询列表
	$("#resetBtn").on("click", function() {
		var $wrap = $("#pageSearchForm");
		$("#beginTime").val(newDay.Format("yyyy-MM-dd"));
    	$("#endTime").val(new Date().Format("yyyy-MM-dd"));
    	$("#content").val("");//内容
    	$("#hospitalName").val("");//医院名称
		pageUtil.getLogsList();
	});
	
	//查看详情
	$("#listCtnWrap")
		.on("click", ".seeDetail", function() {
			var $self = $(this),
				$parent = $self.closest(".list-line"),
				id = $parent.attr("data-id"),
				pos = $parent.attr("data-pos");
				pageUtil.id = $parent.attr("data-id");//存储id
				$.get(base + "im/queryMessagesByMsgId", {messageId: id,sourceMsgId:id,tablePos:pos,queryType:3,pageSize:20},function(res) {
					var result = typeof res;
					if(result == "string") {
						res = JSON.parse(res);
					}
					if(res.status == "0") {
						pageUtil.detalData = res;
						pageUtil.detalData.data.isHis = res.data.hasData;
						pageUtil.detalData.data.isMero = res.data.hasAfterData;
						var html = template("contact", pageUtil.detalData);
						layer.open({
							type: 1,
							title: "会话详情",
							shadeClose: true,
							shade: [0.5, "#000"],
							maxmin: false,
							area: ["95%", "85%"],
							content: html,
							success: function(layero, index) {
//								$(".imgVew").on("click",function(){
//									var _this = $(this);//将当前的pimg元素作为_this传入函数  
//          						pageUtil.imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
//								})
								
							}
						});
					} else {
						$.Huimodalalert(res.message, 1500);
					}
				});
		})
		.on("click", ".vevwImg", function() {//查看图
			 var _this = $(this);//将当前的pimg元素作为_this传入函数  
            	pageUtil.imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);  
			
		})
       
	$("body").on("click", function(e) {
		var $target = $(e.target);
		
	});

	//初始化点击筛选
//	$("#screeBtn").trigger("click");
});