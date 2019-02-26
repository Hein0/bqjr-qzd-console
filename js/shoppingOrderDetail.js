// author zhcyy
// time 2017-04-26

var shoppingOrderDetail = {
    tmpl: function (template, data) {
        return doT.template(template).apply(null, [data]);
    }
}

$(function () {
	var assId,
		isClick = true;
	
	function initData () {
		util.getQueryString('tradeId') && $.post(base + 'trade/getTradeDetail.do', {
	        tradeId: util.getQueryString('tradeId')
	    }, function (res) {
	        if (res.status == '0') {
	            $('#orderInfo').html(shoppingOrderDetail.tmpl($('#orderInfoTmp').html(), res.data));
	            $('#otherInfo').html(shoppingOrderDetail.tmpl($('#otherInfoTmp').html(), res.data));
	            
	            //是否显示已排查按钮
	            var tradeStatus = util.getQueryString('tradeStatus') || res.data.tradeStatus;
	            if (tradeStatus == 10) {
	            	$('#checkOut').show()
	            } else{
	            	$('#checkOut').hide()
	            }
	            //初始化销单退款弹窗
	            $('.pop-orderNo').text(res.data.tradeId)
	            $('.pop-assServiceId').text(res.data.channelOrderId)
	            $('.pop-amount').text(res.data.amount)
	            $('.pop-cash').text(res.data.payAmount)
	            $('.pop-loan').text(res.data.loadAmount)
	            $('.pop-most').text(res.data.payAmount)
	            
	            //取消订单显示隐藏
	            if (res.data.tradeStatusStr == "待下单" || res.data.tradeStatus == 20 || res.data.tradeStatus == 25 || res.data.tradeStatus == 30) {
	            	$('#cancel').show()
	            } else {
	            	$('#cancel').hide()
	            }
	            //销单显示隐藏
	            if (res.data.tradeStatus == 50) {
	            	$('#backout').show()
	            } else {
	            	$('#backout').hide()
	            }
	            
	            
	        } else if (res.status == '9999') {
	            // 未登录
	            window.top.location.href = '../../login.html';
	        }
	    });
	}
	
	initData()
    
    //取消订单
    $('#cancel').on('click',function () {
    	isClick = true;
    	$('.company').text($('.goodsChannel').text())
    	$('.modal-title').text("取消订单")
    	$("#modal-demo").modal("show")
    	$('.cancel-pop').show().siblings('div').hide();
    	$('#popSure').text("确定");
    	$('#popSure').attr('type','cancel');
    	$('.close-pop').text("取消");
    	
    })
    //销单
    $('#backout').on('click',function () {
    	isClick = true;
    	$('.modal-title').text("销单")
    	$("#modal-demo").modal("show")
    	$('.backout-pop').show().siblings('div').hide();
    	$('#popSure').text("已到账执行销单");
    	$('#popSure').attr('type','backout');
    	$('.close-pop').text("未到账不销单");
    })
    $('#checkOut').on('click',function () {
    	isClick = true;
    	$('.modal-title').text("提示")
    	$("#modal-demo").modal("show")
    	$('.checkout-pop').show().siblings('div').hide();
    	$('#popSure').attr('type','checkout');
    	$('#popSure').text("确定");
    	$('.close-pop').text("取消");
    })
    
    $('#popSure').on('click',function () {
    	if (isClick) {
    		isClick = false;
    		var type = $(this).attr('type')
	    	switch (type){
	    		case "backout":
	    		backoutFn(this)
	    			break;
	    		case "refund":
	    		refundQuery()
	    			break;
	    		case "checkout":
	    		checkoutFn(this)
	    			break;
	    		default:
	    		cancelQuery()
	    			break;
	    	}
    	}
    	
    })
    
    function cancelQuery () {
    	var tradeId = util.getQueryString('tradeId');
    	var remark = $('.cancelRemark').val();
    	$.post(base + 'trade/cancelTrade.do',{tradeId: tradeId, remark: remark},function (res) {
    		if (res.status == 0) {
    			$.Huimodalalert("订单已取消", 2000);
    			$("#modal-demo").modal("hide")
    			initData()
    		} else if (res.status == 1) {
    			 $.Huimodalalert(res.message, 2000);
    		} else {
    			 $.Huimodalalert(res.message, 2000);
    		}
    		isClick = true;
    	})
    }
    
    function backoutFn (el) {
    	isClick = true;
    	$(el).attr('type','refund')
    	$('#popSure').text("确定");
    	$('.close-pop').text("取消");
    	$('.pop-refund-wrap').show().siblings('div').hide();
    	
    }
    
    function checkoutFn (el) {
    	var tradeId = util.getQueryString('tradeId');
    	$.post(base + 'trade/cancelTradeWarning',{tradeId: tradeId}, function (res) {
    		if (res.status == 0) {
    			$.Huimodalalert("已取消预警", 2000);
    			$("#modal-demo").modal("hide")
    			$('#checkOut').hide();
    			setTimeout(function () {
    				window.parent.initShopping();
					var parent = window.parent.document.getElementById('min_title_list')
					$(parent).find('.active i').click()
    			},2000)
				
    		} else{
    			$.Huimodalalert(res.message, 2000);
    		}
    		isClick = true;
    	})
    }
    
    function refundQuery () {
    	var refundMoney = Number($('.pop-most-inp').val());
    	var mostRefund = Number($('.pop-most').text());
    	var remark = $('.pop-refund-wrap input[type="radio"]:checked').val();
    	if (!refundMoney && refundMoney !== 0) {
    		 $.Huimodalalert("请输入退款金额", 2000);
    	} else if (refundMoney > mostRefund){
    		 $.Huimodalalert("退款金额不能大于现金支付金额", 2000);
    	}
    	if (!remark) {
			remark = $('#otherReason').val();
			if (!remark) {
				$.Huimodalalert("请输入退款原因", 2000);
				return;
			}
		}
    	$.post(base + 'trade/rejectAndCancelOrder.do',{tradeId: util.getQueryString('tradeId'), refundMoney: refundMoney, refundMemo: remark},function (res) {
    		if (res.status == 0) {
    			$.Huimodalalert("退款成功，已销单", 2000);
    			$("#modal-demo").modal("hide")
    			initData()
    		} else{
    			$.Huimodalalert(res.message, 2000);
    		}
    		isClick = true;
    	})
    }
    
    //退款选择其他
		$('#others').on('change',function () {
			$('#otherReason').attr('disabled',false)
		})
		//退款选择非其他
		$('.noOthers').on('click',function () {
			$('#otherReason').attr('disabled',true)
		})
    
});