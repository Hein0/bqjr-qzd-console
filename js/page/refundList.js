var refundList = {
	init: function () {
		this.parm = {};
		this.detParam;
		this.className = {31:".payWay",20:".refundStatus"}
		util.initSelect(this.className,'31,20');
//		this.initDate()
		this.bindEvents();
		this.search();
	}
	
	,bindEvents: function () {
		var self = this;
		//点击筛选
		$('#screeBtn').on('click',function () {
			$('#pagination').html('');
			self.search()
		})
		//重置
		$('#resetBtn').bind('click',function (ev) {
			util.reset()
		})
		//点击订单号去订单详情
		$('#tableList').on('click','.tradeId',function () {
			 // 详情
            var $self = $(this);
			var tradeId = $self.text();
            $self.attr('data-href', 'view/order/shoppingOrderDetail.html?tradeId=' + tradeId);
            $self.attr('data-title', '购物订单详情');

            Hui_admin_tab($self.get());
		})
		//导出
		$('#getOut').on('click',function () {
			var fileName = $('.fileName').text();
			$('#fileName').val(fileName);
			$('#mymodal').modal('show')
		})
		
	}
	//初始化时间
	,initDate: function () {
		var date = new Date();
		var year = date.getFullYear(),
			month = date.getMonth() + 1,
			myDate = date.getDate();
		if (month < 10) {
			month = "0" + month
		}
		var startTime = year + "-" + month + "-" + "01";
		var endTime = year + "-" + month + "-" + myDate;
		$('#datemin').val(startTime);
		$('#datemax').val(endTime)
	}
	//列表加载、筛选
    ,search: function(){
        this.param = util.serialize();
        this.detParam = this.param;
        this.queryData();
    }
	//加载列表
	,queryData: function (obj) {
		var self = this;
		self.detParam.pageNum = (obj && obj.curr) || 1 // 默认第1页
        self.detParam.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
		$.post( base + 'afterSales/getRefundList.do',self.detParam,function (res) {
			if (res.status == 0) {
				$("#tableList").empty().append($('#refundList').tmpl(res.data));
				setPagination({
			       elem: $('#pagination'),
			       totalCount: res.dataCount,
			       curr: self.detParam.pageNum,
				   callback: function (obj) {
                            self.queryData(obj);
                        }
			   });
			} else {
				$.Huimodalalert(res.message, 2000);
			}
		})
	}
	//导出
    ,export: function(){
        var fileName = $("#fileName").val();
        if(fileName == ""){
            $(".p").show();
            return;
        }
        var param = $(".search-form").serialize();
        param = param + "&fileName="+fileName;
        console.log(param);
        location.href = base+"afterSales/exportRefundList.do?"+param;
        $('#mymodal').modal('hide');
    }
}
refundList.init()