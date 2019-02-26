// author zhcyy
// time 2017-04-26

var shoppingOrderDetail = {
    tmpl: function (template, data) {
        return doT.template(template).apply(null, [data]);
    }
}

$(function () {
	
	function initData () {
		util.getQueryString('tradeId') && $.post(base + 'trade/getInventedTradeDetail.do', {
	        tradeId: util.getQueryString('tradeId')
	    }, function (res) {
	        if (res.status == '0') {
	            $('#orderInfo').html(shoppingOrderDetail.tmpl($('#orderInfoTmp').html(), res.data));
	            
	            if (res.data.tradeStatusStr == "待下单" || res.data.tradeStatusStr == "待采购") {
	            	$('#cancel').show()
	            } else {
	            	$('#cancel').hide()
	            }
	            
	        } else if (res.status == '9999') {
	            // 未登录
	            window.top.location.href = '../../login.html';
	        }
	    });
	}
	
	initData()
    
    
    $('#cancel').on('click',function () {
    	$("#modal-demo").modal("show")
    })
    $('#popSure').on('click',function () {
    	var tradeId = util.getQueryString('tradeId')
    	$.post(base + 'trade/cancelTrade.do',{tradeId: tradeId},function (res) {
    		if (res.status == 0) {
    			$.Huimodalalert("订单已取消", 2000);
    			$("#modal-demo").modal("hide")
    			initData()
    		} else {
    			 $.Huimodalalert(res.message, 2000);
    		}
    	})
    })
    
});