var detParam = {},
	param = {};
var noData = '<tr><td colspan="8" style="text-align:center;">暂无相关数据！</td></tr>';	
var withdraw = {
	orderStatus:'',
	accouType:{},
	init: function () {
		accouType = JSON.parse(localStorage.getItem('storData'));
		orderStatus = '';
		
		this.size = $('#selectPageSize :checked').text();
		this.pageing = {
		    pageNum: 1,
		    pageSize: 10
		};
		this.bindEvents();
		this.search();
		util.checkForm();
	},
	
	bindEvents: function () {
		var self = this;
		//点击选项卡
		$('.btn-group span.btn').bind('click',function (ev) {
			var $target = $(this);
			var statu = $target.attr('val');
			var div = '';
			if(statu){
				$(".batch-no").addClass("hidden");
                $(".market-day").addClass("hidden");
                $(".change-day").removeClass("hidden");
                $(".batch-day").addClass("hidden");
			}else{
                $(".batch-no").removeClass("hidden");
                $(".market-day").removeClass("hidden");
                $(".change-day").addClass("hidden");
                $(".batch-day").removeClass("hidden");
			}
			util.reset();
			$target.addClass('btn-primary');
			$target.siblings().removeClass('btn-primary').not(".todayText").addClass('btn-default');
			orderStatus = statu

			self.search()
		});
		
		
		
		//筛选
		$('#screeBtn').bind('click',function (ev) {
			self.pageing.pageNum = 1;
			$('#pagination').html('');
			self.search()
//			self.scree(self.pageing.pageNum)
		});
		//重置
		$('#resetBtn').bind('click',function (ev) {
			util.reset();
		});
		//导出
		$('#getOut').bind('click',function (ev) {
			var fileName = $('.fileName').text();
			$('#fileName').val(fileName);
			$('#mymodal').modal('show')
		});

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
        detParam = param;
        this.queryList(10);
    },
		
	//筛选
	scree:function (currentPage,type) {
		
		var batchNo = $('.batchNo').val(),//批次
            startDay = $('#startDay').val(), //开始统计日期
            endDay = $('#endDay').val(),//结束统计日期
            nameBelong = $('.nameBelong').val(),//名单归属
            startBatchTime = $('#startBatchTime').val(), // 开始分配日期
            endBatchTime = $('#endBatchTime').val();//结束分配日期
			startDate = $("#startDate").val();
			endDate = $("#endDate").val();
		
		var data = {};
			
		if (batchNo) {
			data['batchNo'] = batchNo
		}
		
		if (startDay) {
			data['startDay'] = startDay
		}
		if (endDay) {
			data['endDay'] = endDay
		}
		if (nameBelong) {
			data['nameBelong'] = nameBelong
		}
		if (startBatchTime) {
			data['startBatchTime'] = startBatchTime
		}
        if (endBatchTime) {
            data['endBatchTime'] = endBatchTime
        }
        if (startDate) {
            data['startDate'] = startDate
        }
        if (endDate) {
            data['endDate'] = endDate
        }
		
		data['status'] = this.orderStatus;
		if (type == 'getOut') {
			this.getOut(data)
		} else{
			this.queryList(data)
		}
		
	},
	//导出
    export: function(){
        var fileName = $("#fileName").val();
        if(fileName == ""){
            $(".p").show();
            return;
        }
        var param = $(".search-form").serialize();
        param = param + "&status=" + orderStatus + "&fileName="+fileName;
        console.log(param);
        if(orderStatus){
            location.href = base+"telemarketing/exportDayChange.do?"+param;
        }else{
            location.href = base+"telemarketing/exportBacthChange.do?"+param;
        }
        $('#mymodal').modal('hide');
    }
	//发送请求获取数据
	,queryList: function (obj) {
		var self = this;
        detParam.pageNum = (obj && obj.curr) || 1 // 默认第1页
        detParam.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
        if(orderStatus==""){  //批次转化数据
        	$.post(base + 'telemarketing/getBacthChange.do',detParam,function (res) {
				if (res.status == 0 && res.data) {
					$(".tableAll").show().siblings('.table-con').hide();
					$("#tableAllList").empty().append($('#allList').tmpl(res.data));
					setPagination({
				       	elem: $('#pagination'),
				       	totalCount: res.dataCount,
				       	curr: detParam.pageNum,
					   	callback: function (obj) {
		                    self.queryList(obj);
		                }
				   	});
				}else{
					$("#tableAllList").empty().append(noData)
				}
			});
        	
        }else{//日转化数据
			$.post(base + "telemarketing/getDayChange.do",detParam, function(data) {
		        if(data.status == 0){
					$(".tableTwo").show().siblings('.table-con').hide();
					$("#tableTwoList").empty().append($('#twoList').tmpl(data.data));
					setPagination({
				       	elem: $('#pagination'),
				       	totalCount: data.dataCount,
				       	curr: detParam.pageNum,
					   	callback: function (obj) {
		                    self.queryList(obj);
		                }
				   	});
			   	}else{
					$("#tableTwoList").empty().append(noData)
				}
		    });
		}
	}
};
withdraw.init()