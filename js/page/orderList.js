//var seeDetailHref = (function() {
//  var href = location.href,
//      base = 'https://static.maimaiti.cn/',
//      reg = /(dev|sit|uat)/gi,
//      testArr = reg.exec(href);
//
//  if (testArr && testArr[0]) {
//      base += testArr[0] + '/wallet/shop/goodsDetails.html';
//  } else {
//      base += 'wallet/shop/goodsDetails.html';
//  }
//
//  return base;
//})()

// 表单输入验证
var checkInput = {
    // 验证非空
    empty: function($self, $parent) {
        var val = $self.val(),
            title = $parent.find('.title').text();

        if (val == '') {
            $self.addClass('error');
            $.Huimodalalert(title + '不能为空', 2000);
            return false;
        }

        $self.removeClass('error');
    },

    // 验证值必须为数字
    number: function($self, $parent) {
        var $collections = $parent.find('input'),
            length = $collections.length,
            val = +$self.val(),
            index = 0,
            compare;

        if (val === 0) {
            $self.val('');
        }

        if (isNaN(val)) {
            $self.addClass('error');
            $.Huimodalalert('请填写一个数字值', 2000);
            return false;
        }

        if (val < 0) {
            $self.addClass('error');
            $.Huimodalalert('数字值应为正数', 2000);
            return false;
        }

        if (length > 1) {
            if ($self.get(0) == $collections.get(0)) {
                compare = +$collections.eq(1).val();
                compare = isNaN(compare) ? 0 : compare;
                if (val && compare && val > compare) {
                    $self.addClass('error');
                    $.Huimodalalert('最小值应小于最大值', 2000);
                    return false;
                }
            } else {
                compare = +$collections.eq(0).val();
                compare = isNaN(compare) ? 0 : compare;
                if (val && compare && val < compare) {
                    $self.addClass('error');
                    $.Huimodalalert('最大值应大于最小值', 2000);
                    return false;
                }
            }
        }

        $self.removeClass('error');
    },

   
}


var pageUtil = {
    // 页面缓存
    'cache': {},
    
    orderData: {
		order_list:[],
	},

    // 获取查询参数
    'getSearchValue': function() {
        var data = {},
            $wrap = $('#pageSearchForm');
        data.voucher_no = $('#voucher_no').val() || '';//商品名称
        
        return data;
    },

    // 过滤空参数
    'filterEmpty': function(obj) {
        var keys = Object.keys(obj),
            i = 0,
            length = keys.length;

        for (i; i < length; i++) {
            if (!obj[keys[i]]) {
                delete obj[keys[i]];
            }
        }

        return obj;
    },

    // 获取商品列表
    'getGoodsList': function(obj) {
        var data = pageUtil.getSearchValue();

		$.ajax({
			url: base+"mall/orderGoods.do",
			type: "POST",
			contentType: 'application/json;charset=utf-8',
			data: JSON.stringify(data),
			dataType: "JSON",
			success: function (res) {
				if (res.status == '0' && res.data) {
	                if (res.data) {
	                    pageUtil.orderList(res.data);
	                } else {
	                    $('#listCtnWrap').html('');
	                }
	            } else if (res.status == '9999') {
	                // 未登录
	                window.top.location.href = '../../login.html';
	            } else {
	                $('#listCtnWrap').html('');
	                $.Huimodalalert(res.message, 2000);
	            }
			},
			error:function(err){
				layer.closeAll('loading');
				$.Huialert(err.message,1500)
			}
		});
    },
    // 渲染列表
    'orderList': function(data) {
    	if(data.goods.length){
    		pageUtil.orderData.order_list.push(data.goods);
    	}
        var html = '';

//      $.each(data, function(index, item) {
//
//          html += '<div class="one-line-wrap">\
//	                <div class="spu-wrap">\
//	                    <div class="list-line list-ctn cl" data-type="spu" data-id="' + item.id + '">\
//	                        <div class="list-one list-1"><input type="checkbox" value=""></div>\
//	                        <div class="list-one list-2">\
//	                            <span class="nameTiel" >' + item.telphone + '</span>\
//	                        </div>\
//	                        <div class="list-one list-3">' + item.doctor_name + '</div>\
//	                        <div class="list-one list-4">\
//	                            <p class="small-p">分类:' + item.cat + '</p>\
//	                        </div>\
//	                        <div class="list-one list-5">' + item.appoint_price + '</div>\
//	                        <div class="list-one list-6">'+ item.left_price +'</div>\
//	                        <div class="list-one list-7">'+ item.hos_price +'</div>\
//	                        <div class="list-one list-10">\
//	                            <span class="affirm">确认手术</span>\
//	                        </div>\
//	                    </div>\
//	                </div>\
//              </div>';
//      });

            html += '<div class="list-wrap" data-id="' + data.voucher_no + '">\
                	<div class="list-wrap-con">\
                		<div class="left-conTitle">手机号</div>\
                		<div class="right-conTxt">' + data.telphone + '</div>\
                	</div>\
                	<div class="list-wrap-con2">\
                		<div class="left-conTitle">所购商品</div>\
                		<div class="right-conTxt">';
                		if(data.goods.length>0){
	                    	var keywordName = '';    
	                		$.each(data.goods, function(index, item) {
	                			keywordName +=item.keyword +" ";
	                			html += '<div class="list-item">\
	                				<div class="listImg">\
	                					<img  src="'+imgPath+item.goods_url+'" alt="暂无图片 ">\
	                				</div>\
	                				<div class="listInd">\
	                					<h2 class="listIndTile">'+item.name+'</h2>\
	                					<p class="listIndCon">\
	                						<span class="reds">￥'+item.qzd_price+'</span>\
	                						<span class="hui">￥'+item.hos_price+'</span>\
	                					</p>\
	                				</div>\
	                			</div>';
	                		})
                		}
                	
                html += '</div>\
                	</div>\
                	<div class="list-wrap-con">\
                		<div class="left-conTitle">已支付预约金</div>\
                		<div class="right-conTxt">'+data.appoint_price+'</div>\
                	</div>\
                	<div class="list-wrap-con">\
                		<div class="left-conTitle">剩余尾款</div>\
                		<div class="right-conTxt">'+data.left_price+'</div>\
                	</div>\
                	<div class="list-wrap-con">\
                		<div class="left-conTitle">可能整形意向</div>\
                		<div class="right-conTxt">'+keywordName+'</div>\
                	</div>\
                	<div class="list-wrap-commit">\
                		<div class="commitBtu">确认手术</div>\
                	</div>\
                </div>';

        $('#listCtnWrap').html(html);
    },

    

    // 格式化当前时间
    // return 2010-05-05 05:05:05
    formatNowTime: function() {
        var helper = function(val) {
                return +val < 10 ? ('0' + val) : val
            },
            time = new Date(),
            result = '';

        result += time.getFullYear() + '-' + (helper(time.getMonth() + 1)) + '-' + helper(time.getDate()) + ' ' + helper(time.getHours()) + ':' + helper(time.getMinutes()) + ':' + helper(time.getSeconds());

        return result;
    },

}

$(function() {

    var $collections = $('.common-form-wrap');

    $collections
        .on('blur', 'input,select', function(e) {
            var $self = $(this),
                $parent = $self.parent(),
                type = $self.attr('data-check'),
                checkList = [];

            if (type && !$self.prop('disabled')) {
                checkList = type.split(',');

                $.each(checkList, function(index, ele) {
                    return checkInput[ele] && checkInput[ele]($self, $parent);
                });
            }

        })

    // 查询商品列表
    $('#screeBtn').on('click', function() {
    	if($("#voucher_no").val()){
    		pageUtil.getGoodsList();
    	}else{
    		$.Huimodalalert("支付凭证号不能为空!", 2000);
    	}
        
    })

    // 重置查询列表
    $('#resetBtn').on('click', function() {
        var $wrap = $('#pageSearchForm');
        $wrap.find('#voucher_no').val('');
    })

    // 订单列表相关事件绑定
    $('#listCtnWrap')
        .on('click', '.affirm', function() {
            // 确认提交
            var $self = $(this),
                $parent = $self.closest('.list-line');
			var data = {};
			data.voucher_no = $parent.attr('data-id');
            $.ajax({
				url: base+"mall/orderStatus.do",
				type: "POST",
				contentType: 'application/json;charset=utf-8',
				data: JSON.stringify(data),
				dataType: "JSON",
				success: function (res) {
					if (res.status == '0') {
						$.Huimodalalert(res.message?res.message:"确认成功!", 500);
						setTimeout(function () {
							var index = parent.layer.getFrameIndex(window.name);
							//刷新列表
							window.location.href = window.location.href;
							parent.layer.close(index);
						}, 1000);
		                
		            } else if (res.status == '9999') {
		                // 未登录
		                window.top.location.href = '../../login.html';
		            } else {
		                $('#listCtnWrap').html('');
		                $.Huimodalalert(res.message, 2000);
		            }
				},
				error:function(err){
					layer.closeAll('loading');
					$.Huialert(err.message,1500)
				}
			});
        })
        .on('click', '.commitBtu', function() {
            // 确认提交
            var $self = $(this),
                $parent = $self.closest('.list-wrap');
			var data = {};
			data.voucher_no = $parent.attr('data-id');
			if($parent.attr('data-id')){
				$.ajax({
					url: base+"mall/orderStatus.do",
					type: "POST",
					contentType: 'application/json;charset=utf-8',
					data: JSON.stringify(data),
					dataType: "JSON",
					success: function (res) {
						if (res.status == '0') {
							$.Huimodalalert(res.message?res.message:"确认成功!", 500);
							setTimeout(function () {
								//刷新列表
								window.location.href = window.location.href;
							}, 1000);
			                
			            } else if (res.status == '9999') {
			                // 未登录
			                window.top.location.href = '../../login.html';
			            } else {
			                $('#listCtnWrap').html('');
			                $.Huimodalalert(res.message, 2000);
			            }
					},
					error:function(err){
						layer.closeAll('loading');
						$.Huialert(err.message,1500)
					}
				});
			}else{
				alert("没有此订单",1500)
			}
            
        })

    // 列表全选及反选
    $('#checkAll').on('click', function() {
        var $self = $(this),
            $wrap = $('#listCtnWrap').find('input[type="checkbox"]');
        $wrap.prop('checked', $self.prop('checked'));
    })


    $('body').on('click', function(e) {
        var $target = $(e.target);

        if (!$target.hasClass('select-classify') && !$target.hasClass('type-select-panel')) {
            $('.type-select-panel').hide();
        }

        if (!$target.hasClass('select-brand') && !$target.hasClass('name-select-panel')) {
            $('.name-select-panel').hide();
        }
    })


//  $('#screeBtn').trigger('click');
})