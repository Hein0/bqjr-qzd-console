var detParam = {},
	param = {};
var noData = '<tr><td colspan="10" style="text-align:center;">暂无相关数据！</td></tr>';	
var withdraw = {
	orderStatus:'',//选择状态
	provinceList: [],//城市列表数据
	init: function () {
		orderStatus = '';
		
		this.size = $('#selectPageSize :checked').text();
		this.pageing = {
		    pageNum: 1,
		    pageSize: 20
		};
		//设置默认查询时间
	    var t=new Date();
	    var iToDay=t.getDate();
	    var iToMon=t.getMonth();
	    var iToYear=t.getFullYear();
	    var newDay = new Date(iToYear,(iToMon-1),iToDay);
	    $("#beginTime").val(newDay.Format("yyyy-MM-dd"));
	    $("#endTime").val(new Date().Format("yyyy-MM-dd"));
		
		this.getOrderNub();
		this.initData();
		this.search();
		this.bindEvents();
	},
	//获取订单数量
	getOrderNub:function(){

		$.ajax({
			type: "POST",
			url: base + "orderMag/hospitalOrder/count",
			data: JSON.stringify(detParam),
			contentType: "application/json;charset=utf-8",
			success: function(res) {
				if(res.status == "0" && res.data) {
					$(".qb").text(res.data.statusTotal ? res.data.statusTotal : 0);
					$(".dzf").text(res.data.status0 ? res.data.status0 : 0);
					$(".dyz").text(res.data.status1 ? res.data.status1 : 0);
					$(".yyz").text(res.data.status2 ? res.data.status2 : 0);
					$(".rz").text(res.data.status5 ? res.data.status5 : 0);
					$(".ytk").text(res.data.status4 ? res.data.status4 : 0);
					$(".ysx").text(res.data.status3 ? res.data.status3 : 0);
				} else {
					$.Huimodalalert(res.message, 1500);
				}
			},
			complete: function() {
				layer.closeAll("loading");
			}
		});
	},
	
	//初始化城市数据----分类
	initData:function(){
		
		
		// 分类选择弹窗初始化
	    CacheData.getData('selectAllCategory', function (data) {
	        var html = "";
	        $.each(data, function(index, item) {
	            html += '<li data-id="' + item.id + '">' + item.name + "</li>";
	        });
	        $(".type-select-panel.classify").find(".ul-1").html(html);
	    })

		// 城市选择弹窗初始化
	    CacheData.getData('getArea', function (data) {
	        var html = "";
	        withdraw.provinceList = data;
	        $.each(data, function(index, item) {
	            html += '<li data-id="' + item.code + '">' + item.province + "</li>";
	        });
	        $(".type-select-panel.city").find(".ul-1").html(html);
	
	    })
	    
	    
	},
	
    // 设置分类信息
    setSelectType: function($self) {
        withdraw.setSelectValue($self);
        CacheData.getData('selectAllCategory', function (data) {
            if ($self.parent().index() == 1) {
                data = withdraw.currentProData[$self.index()].hdGoodsCategory;
            } else if($self.parent().index() == 0) {
                data = withdraw.currentProData = data[$self.index()].hdGoodsCategory;
            }
            var html = '';
            if(data.length) {
                $.each(data, function(index, item) {
                    html +='<li data-id="' +item.id +'" data-classname="' +item.name +'">' + item.name + "</li>";                                 
                });

                $self.parent().next().html(html);
            }
        })
    },
    // 设置分类信息选择值
    setSelectValue: function ($self) {
        var $wrap = $self.closest('.type-select-panel.classify'),
            $result = $wrap.find('.result em');

        $result.text(withdraw.getSelectValue($self));
    },
    // 获取分类信息选择
    getSelectValue: function ($self) {
        var $wrap = $self.closest('.type-select-panel.classify'),
            $li = $wrap.find('.check'),
            html = '';
        if ($li.length) {
            $li.each(function (index, item) {
                var $item = $(item);
                if (index) {
                    html += ' > ' + $item.text();
                } else {
                    html += ' ' + $item.text();
                }
            })
        }
        return html;
    },
    /****获取城市******/
   	setSelectCity: function($self) {
        CacheData.getData('getArea', function (data) {
            data = data[$self.index()].citys;
            var html = '';
            $.each(data, function (index, item) {
                html += '<li data-id="' + item.code + '">' + item.city + '</li>'
            });
            $self.parent().next().html(html);
            withdraw.setSelectCityValue($self);
        })
    },
	// 设置城市信息选择值
	setSelectCityValue: function($self) {
		var $wrap = $self.closest(".type-select-panel.city"),
			$result = $wrap.find(".result em");
			$result.text(withdraw.getSelectCityValue($self));
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

    
	//初始化事件
	bindEvents: function () {
		var self = this;
		
		//选择分类弹窗展示隐藏
		$(".select-classify").on("click", function() {
			var $self = $(this),
				$target = $self.siblings(".type-select-panel.classify");
				$target.toggle();
		});

		//点击选项卡
		$('.btn-group span.btn').bind('click',function (ev) {
			var $target = $(this);
			var statu = $target.attr('val');
			var div = '';

//			util.reset();//清空筛选
			$target.addClass('btn-primary');
			$target.siblings().removeClass('btn-primary').not(".todayText").addClass('btn-default');
			orderStatus = statu

			self.search()
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
					withdraw.setSelectType($self);
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
					$target.text(withdraw.getSelectValue($self)).attr("data-id", $parent.find(".check:last").attr("data-id"));
					$parent.hide();
			});
		
		//筛选
		$('#screeBtn').bind('click',function (ev) {
			self.pageing.pageNum = 1;
			$('#pagination').html('');
			self.search()
		});
		//重置
		$('#resetBtn').bind('click',function (ev) {
			var $wrap = $('#pageSearchForm');
			$wrap.find("#province").val("").trigger("change");
			util.reset();
		});

		$('body').on('click', function (e) {
	        var $target = $(e.target);
	
	        if(!$target.hasClass("select-classify") && !$target.hasClass("type-select-panel")) {
			  	$(".type-select-panel.classify").hide();
		    }
	        if(!$target.hasClass("select-city") && !$target.hasClass("type-select-panel.city")) {
				$(".type-select-panel.city").hide();
			}
	    })

	},
	
	//分页初始化
	pageInit: function(){
		var self = this;
		setPagination({
		    elem: $('#pagination'),
		    totalPage: 100,
		    curr: 1,
		    callback: function(obj) {
		        console.log(obj)
		        self.pageing.pageSize = $('#selectPageSize :checked').text()
		        self.scree(obj.curr)
		    }
		});
	},
	//列表搜索
    search: function(){
        param = util.serialize();
        param.project = $(".select-classify").attr("data-id") || ""; //分类id
		param.city = $(".select-city").attr("data-id") || "";
		param.hospital = $(".select-hospital").attr("data-id") || "";
        detParam = param;
        this.queryList();
        this.getOrderNub();
    },

	//发送请求获取数据
	queryList: function (obj) {
		var self = this;
		
        detParam.pageNum = (obj && obj.curr) || 1 // 默认第1页
        detParam.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
        detParam.status = orderStatus;
        
        $.ajax({
			type: "POST",
			url: base + "orderMag/hospitalOrder",
			data: JSON.stringify(detParam),
			contentType: "application/json;charset=utf-8",
			success: function(res) {
				if (res.status == 0 && res.data) {
					var html = template("goodInfo", res);
                		$('#tableAllList').html(html);
					setPagination({
				       	elem: $('#pagination'),
				       	totalCount: res.dataCount,
				       	curr: detParam.pageNum,
					   	callback: function (obj) {
		                    self.queryList(obj);
		                }
				   	});
				}else{
					$.Huimodalalert("暂无相关数据！", 2000);
					$("#tableAllList").empty().append(noData)
				}
			},
			complete: function() {
				layer.closeAll("loading");
			}
		});
        	
        
	},

	
};
withdraw.init()