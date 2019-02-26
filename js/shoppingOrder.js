var pageMethod = {
    // 电商采购渠道字典
    channel: {
        '1': true, // 苏宁易购
        '2': true,// 天猫旗舰店
        '3': true,// 国美商城
        '4': true,// 京东商城
        '5': true,// 1号店
        '6': true, // 亚马逊
        '8': true // 当当网
    },
	
	//订单状态
	type: 0,
    // 缓存
    cache: {},

    // 页面初始化
    init: function () {
        // 初始化时间选择
        pageMethod.initDateSelect();

        // 初始化表单验证
        pageMethod.initFormValidate();

        //选择当前页
        $('.real-btn').click();
        console.log("调用成功")
    },
	inint: function (){
		console.log("调用成功")
	},
	//获取京东拒收数量
	getJDcount: function () {
		$.get(base + 'trade/getJdRefuseCount.do',function (res) {
			if (res.status == 0) {
				$('.jd-refuse span').text(res.dataCount);
			}
		})
	},
	//获取京东预警数量
	getJDearlycount:function(){
		$.get(base + 'trade/getUseNotGetGoodsCount.do',function (res) {
			if (res.status == 0) {
				$('.jd-earlywarning span').text(res.dataCount);
			}
		})
	},
	
    // 时间选择初始化
    initDateSelect: function () {
        var $collections = $('.common-date-wrap');

        $collections.each(function (index, ele) {
            var $parent = $(ele),
                $input = $parent.find('input'),
                $first = null,
                $last = null;

            if ($input.length > 1) {
                $first = $input.eq(0);
                $last = $input.eq(1);

                $first.on('focus', function () {
                    var id = $last.attr('id');
                    WdatePicker({ maxDate: '#F{$dp.$D(\'' + id + '\')||\'%y-%M-%d\'}' });
                })

                $last.on('focus', function () {
                    var id = $first.attr('id');
                    WdatePicker({ minDate: '#F{$dp.$D(\'' + id + '\')}', maxDate: '%y-%M-%d' });
                })
            } else {
                $first = $input.eq(0);

                $first.on('focus', function () {
                    WdatePicker({ maxDate: '%y-%M-%d' });
                })
            }
        })
    },

    // 表单验证初始化
    initFormValidate: function () {
        var $collections = $('.common-form-wrap');

        $collections
            .on('blur', 'input,select', function (e) {
                var $self = $(this),
                    $parent = $self.parent(),
                    type = $self.attr('data-check'),
                    checkList = [];

                if (type && !$self.prop('disabled')) {
                    checkList = type.split(',');

                    $.each(checkList, function (index, ele) {
                        return checkInput[ele] && checkInput[ele]($self, $parent);
                    });
                }

            });
    },

    // 获取表单所有数据
    getFormValue: function ($form) {
        var $collections = $form.find('input,select'),
            result = {};

        $collections.each(function (index, ele) {
            var $self = $(ele),
                name = $self.attr('name');

            !$self.prop('disabled') && name && ($self.val() !== '') && (result[name] = $self.val());
        });

        return result;
    },

    // 重置表单所有数据
    resetFormValue: function ($form) {
        $form.find('input,select,textarea').val('').removeClass('error');
    },

    // 查询结果
    searchResult: function (obj) {
        // 获取表单所有数据值
        var data = pageMethod.getFormValue($('#pageSearchForm')),
            type = $('#tradeStatus').find('.btn-primary').attr('data-key');

        data['tradeStatus'] = type;
        pageMethod.type = type;

        data['pageNum'] = (obj && obj.curr) || 1 // 默认第1页
        data['pageSize'] = (obj && obj.pageSize) || 20 // 默认一页20条数据

        $.post(base + 'trade/getTradeList.do', data, function (res) {
            if (res.status == '0' && res.data) {
				
                if (res.data.length) {
                    pageMethod.cache.listCache = res.data;
                    $('#searchResultTable').html(doT.template($('#searchResultTableTmp').html())(res));
                } else {
                    $('#searchResultTable').html('');
                }

                // 设置分页
                setPagination({
                    elem: $('#pagination'),
                    totalCount: res.dataCount,
                    curr: data['pageNum'],
                    callback: function (obj) {
                        pageMethod.searchResult(obj);
                    }
                });
            } else if (res.status == '9999') {
                // 未登录
                window.top.location.href = '../../login.html';
            }
        })
    },



    // 获取公共字典表数据
    getCommonDict: function ($list) {
        var dict = {},
            data = $list.map(function (index, ele) {
                var $ele = $(ele);
                dict[$ele.attr('data-key')] = $ele;
                return $ele.attr('data-key');
            }).get().join(',');

        $.get(base + 'dictionary/getInfo.do', {
            type: data
        }, function (res) {
            // 渲染
            res.data && $.each(res.data, function (key, value) {
                var html = '<option value="">',
                    $ele = dict[key],
                    title = $ele.attr('data-tit');

                if (title) {
                    html += title + '</option>';
                } else {
                    html += '全部</option>';
                }

                value && $.each(value, function (key, value) {
                    html += '<option value="' + key + '">' + value + '</option>';
                });

                $ele.html(html);
            });
        });
    },

    // 获取采购渠道列表
    getBusinessCompanyList: function () {
        var $collections = $('.buy-channel');

        $.post(base + 'company/common', {
            type: 2
        }, function (res) {
            // 渲染
            var html = '<option value="">请选择采购渠道</option>';

            if (res.status == '0') {
                res.data && res.data.length && $.each(res.data, function (index, ele) {
                    html += '<option value="' + ele.id + '">' + ele.companyName + '</option>';
                });
            }

            $collections.html(html);
        });
    },

    // 获取物流公司列表
    getCreditExpressInfoList: function () {
        var $collections = $('#tranferCpy');

        $.post(base + 'trade/getCreditExpressInfoList.do', function (res) {
            // 渲染
            var html = '<option value="">请选择物流公司</option>';

            if (res.status == '0') {
                res.data && res.data.length && $.each(res.data, function (index, ele) {
                    html += '<option value="' + ele.expressId + '">' + ele.expressName + '</option>';
                });
            }

            $collections.html(html);
        });
    },

    // 格式化当前时间
    // return 2010-05-05 05:05:05
    formatNowTime: function () {
        var helper = function (val) {
            return +val < 10 ? ('0' + val) : val
        },
            time = new Date(),
            result = '';

        result += time.getFullYear() + '-' + (helper(time.getMonth() + 1)) + '-' + helper(time.getDate()) + ' ' + helper(time.getHours()) + ':' + helper(time.getMinutes()) + ':' + helper(time.getSeconds());

        return result;
    }

}

// 表单输入验证
var checkInput = {
    // 验证非空
    empty: function ($self, $parent) {
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
    number: function ($self, $parent) {
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

    // 验证值必须为手机号格式
    phone: function ($self, $parent) {
        var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/,
            val = $self.val();

        if (val && !(phoneReg.test(val))) {
            $self.addClass('error');
            $.Huimodalalert('手机号码格式错误', 2000);
            return false;
        }

        $self.removeClass('error');
    }
}

$(function () {
    //获取白名单下拉数据
    var className = {16:".white-list"};
    util.initSelect(className,"16");

    var tradeId = util.getQueryString('tradeId');
    tradeId && $('#pageSearchForm').find('input[name="tradeId"]').val(tradeId);

    pageMethod.init();

	//获取京东拒收数量
	pageMethod.getJDcount();

	//获取京东预警数量
	pageMethod.getJDearlycount();

    // 获取公共下拉列表数据
    pageMethod.getCommonDict($('.common-slide-list'));

    // 获取采购渠道数据
    pageMethod.getBusinessCompanyList();

    // 获取物流公司列表
    pageMethod.getCreditExpressInfoList();

	//初始化实体商品虚拟商品按钮
	$('.real-btn').css('border-bottom','2px solid blue')

    // 订单状态点击切换
    $('#tradeStatus').on('click', 'span', function () {
        // 切换选中按钮样式
        $(this).addClass('btn-primary').siblings().removeClass('btn-primary').addClass('btn-default');

        // 清空查询条件
        pageMethod.resetFormValue($('#pageSearchForm'));

        // 查询结果
        pageMethod.searchResult();
    })

    // 点击查询按钮
    $('#screeBtn').click(function () {
        pageMethod.searchResult();
    })

    // 点击重置按钮
    $('#resetBtn').on('click', function () {
        pageMethod.resetFormValue($('#pageSearchForm'));
    })

    // 订单列表中进行下单、发货操作
    $('#searchResultTable')
        .on('click', '.order-detail', function () {
            // 详情
            var $self = $(this),
                index = $self.closest('tr').index();

            $self.attr('data-href', 'view/order/shoppingOrderDetail.html?tradeId=' + pageMethod.cache.listCache[index].tradeId + '&tradeStatus=' + pageMethod.type);
            $self.attr('data-title', '购物订单详情');

            Hui_admin_tab($self.get());
        })
        .on('click', '.send-order', function () {
            // 下单
            var $self = $(this),
                index = $self.closest('tr').index(),
                $form = $('#sendOrderForm');

            pageMethod.resetFormValue($form);

            // 自动填入采购时间
            $form.find('.now-time').val(pageMethod.formatNowTime());

            // 自动填入商品金额
            $form.find('.goods-price').val(pageMethod.cache.listCache[index].amount);

            // 填入订单id
            $('#submitSendOrder').attr('data-id', pageMethod.cache.listCache[index].tradeId);

            $("#setOrderInfo").modal("show");
        })
        .on('click', '.send-goods', function () {
            // 发货
            var $self = $(this),
                index = $self.closest('tr').index(),
                $form = $('#sendGoodsForm');

            pageMethod.resetFormValue($form);

            // 填入订单id
            $('#submitSendGoods').attr('data-id', pageMethod.cache.listCache[index].tradeId);

            $("#setStreamInfo").modal("show");
        })

    // 下单表格选择采购渠道
    $('#setOrderInfo').on('change', '#sendOrderChannel', function () {
        var $form = $('#sendOrderForm'),
            $self = $(this);

        if (!pageMethod.channel[$self.val()]) {
            $form.find('.can-disabled').prop('disabled', true).parent().hide();
        } else {
            $form.find('.can-disabled').prop('disabled', false).parent().show();
        }
    })

    // 提交下单表格
    $('#submitSendOrder').click(function () {
        var $form = $('#sendOrderForm'),
            $self = $(this),
            data = null;

        $form.find('input,select').trigger('blur');

        if (!$form.find('.error').length && !$self.hasClass('uping')) {
            data = pageMethod.getFormValue($form);
            data.tradeId = $self.attr('data-id');

            $self.addClass('uping');

            $.post(base + 'trade/insertPurchaseInfo.do', data, function (res) {
                $self.removeClass('uping');

                if (res.status == '0') {
                    pageMethod.searchResult();
                    $("#setOrderInfo").modal("hide");
                }
            })
        }
    })

    // 提交发货表格
    $('#submitSendGoods').click(function () {
        var $form = $('#sendGoodsForm'),
            $self = $(this),
            data = null;

        $form.find('input,select').trigger('blur');

        if (!$form.find('.error').length && !$self.hasClass('uping')) {
            data = pageMethod.getFormValue($form);
            data.tradeId = $self.attr('data-id');

            $self.addClass('uping');

            $.post(base + 'trade/insertLogisticsInfo.do', data, function (res) {
                $self.removeClass('uping');

                if (res.status == '0') {
                    pageMethod.searchResult();
                    $("#setStreamInfo").modal("hide");
                }
            })
        }
    })

    // 导出购物订单列表
    $('#createExcel').click(function () {
        var data = pageMethod.getFormValue($('#pageSearchForm')),
            url = '',
            type = $('#tradeStatus').find('.btn-primary').attr('data-key');

        data['tradeStatus'] = type;

        url = base + 'trade/exportTradeList.do?fileName=实体商品订单详情_' + pageMethod.formatNowTime().slice(0, 10);

        $.each(data, function (key, value) {
            url += '&' + key + '=' + value;
        })

        location.href = url;
    })

    pageMethod.searchResult();

})