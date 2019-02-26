var detParam = {},
	param = {},
	firstLoad = 1;
var dataCount;
var currTab = 1; //为1是全部订单 0为其他状态
var withdraw = {
	init: function () {
		this.orderStatus = '0';
		this.size = $('#selectPageSize :checked').text()
		this.pageing = {
		    pageNum: 1,
		    pageSize: 10
		};
		this.bindEvents();
//		this.pageInit();
//		this.scree()
//		this.search()
		util.checkForm();
		var className = {1:".status",3:".terminal",4:".wdType",38:".capital"}
		util.initSelect(className,'1,3,4,38');
	},
	
	bindEvents: function () {
		var self = this;
		//点击选项卡
		$('.btn-group span').bind('click',function (ev) {
			var $target = $(this);
			$target.addClass('btn-primary');
			$target.siblings().removeClass('btn-primary').addClass('btn-default');
			var index = $(this).index();
			if(index == 0){
				$("#statusLabel").show();
                self.orderStatus = 0;
                currTab = 1;
			}else{
                $("#statusLabel").hide();
                var statu = $target.attr('val');
                self.orderStatus = statu;
                currTab = 0;
			}
			self.search()
		})
		
		//筛选
		$('#screeBtn').bind('click',function (ev) {
			self.pageing.pageNum = 1;
			$('#pagination').html('');
			self.search()
//			self.scree(self.pageing.pageNum)
		})
		//重置
		$('#resetBtn').bind('click',function (ev) {
			util.reset()
		})

		//点击详情
		$('#tableList').on('click','.toDetail',function () {
			var $self = $(this)
			var orderId = $self.attr('orderId');
            $self.attr('data-href', 'view/order/withdrawDetail.html?orderId=' + orderId);
            $self.attr('data-title', '提现订单详情');

            Hui_admin_tab($self.get());
		})
	},

	//列表搜索
    search: function(){
        param = util.serialize();
        detParam = param;
        if(!currTab){
            detParam.status = withdraw.orderStatus;
        }
        firstLoad = 1;
        this.queryList(0);
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
		var capital = $(".capital").val();
		var status = $(".status").val();
		
//		if (!currentPage) {
//	        this.pageing['pageNum'] = 0;
//	    } else {
//	        this.pageing['pageNum'] = currentPage;
//	    };
		
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
        if (capital) {
            data['capital'] = capital;
        }
		
//		if ($wdStatus.text() != "全部") {
//			data['status'] = $wdStatus.attr('value')
//		}
        if (status) {
            data['status'] = status;
        }
		if (type == 'getOut') {
			this.getOut(data)
		} else{
			this.queryList(data)
		}
		
	}
	//导出
	,getOut: function () {
		var name = $('.fileName').text();
	    var exportUrl = base+"order/exportOrderList.do?fileName=" + name;
	    console.log(exportUrl);
	    for (i in detParam) {
	        if (detParam[i]) {
	            exportUrl += '&' + i + '=' + detParam[i]
	        }
	    }
	    console.log(exportUrl);
	    location.href = exportUrl;
	},
	//导出
    export: function(){
        var fileName = $("#fileName").val();
        if(fileName == ""){
            $(".p").show();
            return;
        }
        // var param = $(".search-form").serialize();
        var param = util.serialize();
        if(!currTab){
            param.status = withdraw.orderStatus;
        }
        var paramStr = "";
        for(key in param){
            paramStr += (key +"="+ param[key] + "&");
		}
        paramStr += ("fileName="+fileName);
		console.log(paramStr);
        location.href = base+"order/exportOrderList.do?"+paramStr;
        $('#mymodal').modal('hide');
    }
	//发送请求获取数据
	,queryList: function (obj) {
		var self = this;
        detParam.pageNum = (obj && obj.curr) || 1 // 默认第1页
        detParam.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
		$.post(base + 'order/getOrderList.do',detParam,function (res) {
			if (res.status == 0) {
				if(firstLoad){
                    dataCount = res.data.orderCount
                    $("#total").text('共'+dataCount+'单，提现金额共'+res.data.totalMoney+'元');
				}
                firstLoad = 0;
//				self.pageInit();

				setPagination({
			       elem: $('#pagination'),
			       totalCount: dataCount,
			       curr: detParam.pageNum,
				   callback: function (obj) {
                            self.queryList(obj);
                        }
			    });

                $("#tableList").empty().append($('#withdrawList').tmpl(res.data.result));

			}
		})
	}
};
withdraw.init()