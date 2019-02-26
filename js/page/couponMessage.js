var withdraw = {
	init: function () {
		this.orderStatus = '0';
		this.size = $('#selectPageSize :checked').text()
		this.pageing = {
		    pageNum: 1,
		    pageSize: 10
		};
		this.bindEvents();
		this.pageInit();
//		this.scree()
		util.checkForm();
		var className = {3:".terminal",4:".wdType"}
		util.initSelect(className,'3,4');
	},
	
	bindEvents: function () {
		var self = this;
		//点击选项卡
		$('.btn-group span').bind('click',function (ev) {
			var $target = $(this);
			var statu = $target.attr('val');
			$target.addClass('btn-primary');
			$target.siblings().removeClass('btn-primary').addClass('btn-default');
			self.orderStatus = statu
		})
		
		//筛选
		$('#screeBtn').bind('click',function (ev) {
			self.pageing.pageNum = 1;
			self.scree(self.pageing.pageNum)
		})
		//重置
		$('#resetBtn').bind('click',function (ev) {
			util.reset()
		})
		//导出
		$('#getOut').bind('click',function (ev) {
			self.scree(self.pageing.pageNum,'getOut')
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
	
	//筛选
	scree:function (currentPage,type) {
		
		var withdrawNo = $('.withdrawNo').val(),
		userName = $('.userName').val(),
		mobile = $('.mobile').val(),
		areas = $('.area').val(),
		amountMin = $('#amountMin').val(),
		amountMax = $('#amountMax').val(),
		$terminal = $('.terminal :checked'),
		$wdType = $('.wdType :checked'),
		datemin = $('#datemin').val(),
		datemax = $('#datemax').val(),
		$wdStatus = $('.wdStatus :checked');
		
		if (!currentPage) {
	        this.pageing['pageNum'] = 0;
	    } else {
	        this.pageing['pageNum'] = currentPage;
	    };
		
		var data = {};
			
		if (withdrawNo) {
			data['orderId'] = withdrawNo
		}
		if (userName) {
			data['realName'] = userName
		}

		if (mobile) {
			data['mobile'] = mobile
		}
		
		if (areas) {
			data['areas'] = areas
		}
		
		if (amountMin) {
			data['startMoney'] = amountMin
		}
		if (amountMax) {
			data['endMoney'] = amountMax
		}
		
		if ($terminal.text() != "全部") {
			data['origin'] = $terminal.attr('value')
		}
		
		if ($wdType.text() != "全部") {
			data['loanCode'] = $wdType.attr('value')
		}
		
		if (datemin) {
			data['startCreateTime'] = datemin
		}
		if (datemax) {
			data['endCreateTime'] = datemax
		}
		
//		if ($wdStatus.text() != "全部") {
//			data['status'] = $wdStatus.attr('value')
//		}
		data['status'] = this.orderStatus;
		if (type == 'getOut') {
			this.getOut(data)
		} else{
			this.queryList(data)
		}
		
	}
	,getOut: function (data) {
		var name = $('.fileName').text();
	    var exportUrl = base+"wallet/admin/order/exportOrderList.do?fileName=" + name;
	    console.log(exportUrl);
	    for (i in data) {
	        if (data[i]) {
	            exportUrl += '&' + i + '=' + data[i]
	        }
	    }
	    console.log(exportUrl);
	    location.href = exportUrl;
	}
	//发送请求获取数据
	,queryList: function (data) {
		var self = this;
//		data['status'] = self.orderStatus;
		data['pageSize'] = self.pageing.pageSize;
//		data['pageSize'] = '5';
		data['pageNum'] = +self.pageing.pageNum;
		$.post(base + 'wallet/admin/order/getOrderList.do',data,function (res) {
			if (status == 0) {
				$("#tableList").empty().append($('#withdrawList').tmpl(res.data));
//				self.pageInit();
				if (res.dataCount > 9) {
					$('#pagination').show()
				} else {
					$('#pagination').hide()
				}
			}
		})
	}
};
withdraw.init()