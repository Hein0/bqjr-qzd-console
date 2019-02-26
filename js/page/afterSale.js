var afterSale = {
	init: function () {
		this.parm = {};
		this.detParam;
		this.assId = '';
		this.companyName = '';
		this.isCheckDeal = 1;
		this.className = {17:".assType",18:".assStatus"}
		util.initSelect(this.className,'17,18');
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
		//前往售后详情
		$('#tableList').on('click','.toDetail',function () {
			// 详情
            var $self = $(this),
            	assId = $self.attr('assId'),
            	companyName = $self.attr('companyName')
            
            $self.attr('data-href', 'view/afterSale/afterSaleDetail.html??assId=' + assId + '&companyName=' + companyName)
            $self.attr('data-title', '售后服务详情');
            Hui_admin_tab($self.get());
		})
		//导出
		$('#getOut').on('click',function () {
			var fileName = $('.fileName').text();
			$('#fileName').val(fileName);
			$('#mymodal').modal('show')
		})
		//点击查看未处理
		$('#all').on('click',function () {
			if ($('#all').is(':checked')) {
				self.isCheckDeal = 1;
			} else {
				self.isCheckDeal = 0;
			}
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
		if (myDate < 10) {
			myDate = "0" + myDate
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
        self.detParam.type = self.isCheckDeal;			//是否查询未处理
		$.post( base + 'afterSales/getAfterSales.do',self.detParam,function (res) {
			if (res.status == 0) {
				//查询未处理
				self.queryUndeal();
				
				self.assId = res.data.assId;
				self.companyName = res.data.companyName;
				$("#tableList").empty().append($('#afterList').tmpl(res.data));
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
	
	//查询未处理数量
	,queryUndeal: function(){
		var self = this;
		$.get(base + 'afterSales/getAfterSalesCount.do',function (res) {
			if (res.status == 0) {
				window.parent.num = res.dataCount;
				window.parent.setNum();
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
        param = param + "&type=" + this.isCheckDeal + "&fileName="+fileName;
        console.log(param);
        location.href = base+"afterSales/exportAfterSales.do?"+param;
        $('#mymodal').modal('hide');
    }
}
afterSale.init()