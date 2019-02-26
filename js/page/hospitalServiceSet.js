
var pageUtil = {
    // 页面缓存
    'cache': {},
    'provinceList': [],
    'good_projectsList': [
        { id: '眼部整形', name: '眼部整形' },
        { id: '鼻部整形', name: '鼻部整形' },
        { id: '面部轮廓', name: '面部轮廓' },
        { id: '唇部整形', name: '唇部整形' },
        { id: '胸部整形', name: '胸部整形' },
        { id: '美体塑形', name: '美体塑形' },
        { id: '皮肤美容', name: '皮肤美容' },
        { id: '抗衰抗初老', name: '抗衰抗初老' },
        { id: '私密整形', name: '私密整形' },
        { id: '牙齿美容', name: '牙齿美容' },
        { id: '毛发种植', name: '毛发种植' },
        { id: '耳部整形', name: '耳部整形' },
        { id: '其他', name: '其他' },
        { id: '自体脂肪', name: '自体脂肪' },
        { id: '玻尿酸', name: '玻尿酸' },
        { id: '肉毒素', name: '肉毒素' },
        { id: '激光脱毛', name: '激光脱毛' },
        { id: '半永久妆', name: '半永久妆' },
        { id: '微整形', name: '微整形' },
        { id: '激光美肤', name: '激光美肤' },
        { id: '失败修复', name: '失败修复' },
    ],
    
    // 设置城市信息
    'setSelectType': function ($self) {
        $.post(base + 'adminAddress/getArea.do', {
            parentId: $self.data('id')
        }, function (res) {
            var html = '';
            if (res.status == '0' && res.data && res.data.length) {
                $.each(res.data, function (index, item) {
                    html += '<li data-id="' + item.code + '">' + item.name + '</li>'
                });
                $self.parent().next().html(html);
            }
            pageUtil.setSelectValue($self);
        })
    },

    // 设置城市信息选择值
    'setSelectValue': function ($self) {
        var $wrap = $self.closest('.type-select-panel'),
            $result = $wrap.find('.result em');
        $result.text(pageUtil.getSelectValue($self));
    },
    // 获取城市信息选择
    'getSelectValue': function ($self) {
        var $wrap = $self.closest('.type-select-panel'),
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
    
	// 获取查询参数
    'getSearchValue': function () {
        var data = {},
            $wrap = $('#pageSearchForm');
        data.name = $('#searchName').val() || '';//医院名称
        data.status = $("#status option:selected").val() || ""; //审核状态
        data.cityId = $wrap.find('.select-classify').attr('data-id') || '';//城市
        data.good_projects = $wrap.find('.select-brand').attr('data-id') || '';//项目
        return data;
    },
    // 获取商品列表
    'getHospitalList': function (obj) {
        var data = pageUtil.getSearchValue();
        data.pageNum = (obj && obj.curr) || 1; // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20; // 默认一页20条数据

        pageUtil.cache.pageInfo = {
            curr: data.pageNum,
            pageSize: data.size
        }
        $.ajax({
	        type: 'post',
	        url: base + 'hospital/getCustomerServiceInfoList',
	        contentType: "application/json;charset=utf-8",
	        data: JSON.stringify(data),
	        success: function (res) {
	            if (res.status == '0' && res.data) {
	                if (res.data.length) {
	                    pageUtil.cache.listCache = res.data;
	                    pageUtil.renderHospitalSku(res.data);
	                } else {
	                    $('#listCtnWrap').html('');
	                }
              		// 设置分页
	              	setPagination({
	                  	elem: $('#pagination'),
	                  	totalCount: res.dataCount,
	                  	curr: data['pageNum'],
	                  	callback: function (obj) {
	                      	pageUtil.getHospitalList(obj);
	                  	}
	              	});
	            } else if (res.status == '9999') {
	                // 未登录
	                window.top.location.href = '../../login.html';
	            } else {
	                $('#listCtnWrap').html('');
	                $.Huimodalalert(res.message, 2000);
	            }
	        }
	    });

    },

    // 渲染医院列表
    'renderHospitalSku': function (data) {
        var html = '',
            obj = null;

        $.each(data, function (childIndex, child) {
            
            html += '<tr class="text-c list-line" data-id="' + child.id + '" data-hisid="'+child.his_id+'" data-status="'+child.status+'">\
			        <td>' + (child.id || '') + '</td>\
			        <td>' + (child.name || '') + '</td>\
			        <td>' + (child.cityName || '') + '</td>\
			        <td>' + (child.telphone || '') + '</td>\
			        <td>'+ (child.good_projects || '') + '</td>\
			        <td>'+ (child.build_date || "") + '</td>\
			        <td class="f-14">\
			        	<a href="javascript:void(0)" class="set blues" target="">设置</a>\
				    </td>\
			    </tr>';
        })

        $('#listCtnWrap').html(html);

    },
    // 获取擅长项目列表
    'getGood_projects': function (option) {
        var $target = option.$target || $('.name-select-panel'),
            name = option.name || '';
        var html = '';
        $.each(pageUtil.good_projectsList, function (index, item) {
            if (item.name.indexOf(name) != -1) {
                html += '<li data-id="' + item.id + '">' + item.name + '</li>';
            }
        });
        $target.find('ul').html(html);
    },

    // 格式化当前时间    return 2010-05-05 05:05:05
    formatNowTime: function () {
        var helper = function (val) {
            return +val < 10 ? ('0' + val) : val
        },
            time = new Date(),
            result = '';

        result += time.getFullYear() + '-' + (helper(time.getMonth() + 1)) + '-' + helper(time.getDate()) + ' ' + helper(time.getHours()) + ':' + helper(time.getMinutes()) + ':' + helper(time.getSeconds());

        return result;
    },

}

$(function () {
	
	// 城市选择弹窗初始化
    $.ajax({
        async: true,
        type: 'post',
        url: base + 'adminAddress/getArea.do',
        data: { 'level': 1 },
        success: function (res) {
            var html = '';
            if (res.status == '0') {
                pageUtil.provinceList = res.data;
                $.each(res.data, function (index, item) {
                    html += '<li data-id="' + item.code + '">' + item.name + '</li>'
                });
                $('.type-select-panel').find('.ul-1').html(html);
            }
        }
    });
	
	// 擅长项目选择弹窗初始化
    pageUtil.getGood_projects({});
	pageUtil.getHospitalList();
	
	// 查询商品列表
    $('#screeBtn').on('click', function () {
        pageUtil.getHospitalList();
    })
    
	// 重置查询列表
    $('#resetBtn').on('click', function () {
        var $wrap = $('#pageSearchForm');

        $wrap.find('.select-classify').attr('data-id', '').text('请选择城市');
        $wrap.find('.condition-panel').find('ul:gt(0)').empty();
        $wrap.find('.condition-panel').find('li').removeClass('check');
        $wrap.find('.select-brand').attr('data-id', '').text('请选择擅长项目');
        $wrap.find('.name-select-panel').find('input').val('');
        $wrap.find('.name-select-panel').find('ul').empty();
        pageUtil.getGood_projects({'$target': $wrap.find('.name-select-panel')});
        $wrap.find('#searchName').val('');

        pageUtil.getHospitalList();
    })
    
    // 选择城市弹窗展示隐藏
    $('.select-classify').on('click', function () {
        var $self = $(this),
            $target = $self.siblings('.type-select-panel');

        $target.toggle();
    })
    // 选择城市弹窗点击城市
    $('.type-select-panel')
        .on('click', function (e) {
            e.stopPropagation();
        })
        .on('click', 'li', function () {
            // 点击选择项
            var $self = $(this),
                $parent = $self.parent();
            $self.addClass('check').siblings().removeClass('check');
            $parent.nextAll('ul').html('');

            pageUtil.setSelectType($self);
        })
        .on('click', '.close-panel', function () {
            // 关闭弹窗
            var $self = $(this),
                $parent = $self.closest('.type-select-panel');

            $parent.hide();
        })
        .on('click', '.get-result', function () {
            // 确认选择
            var $self = $(this),
                $parent = $self.closest('.type-select-panel'),
                $target = $parent.siblings('.select-classify');

            $target.text(pageUtil.getSelectValue($self)).attr('data-id', $parent.find('.check:last').attr('data-id'));
            $parent.hide();
        })
    
    // 选择擅长项目弹窗展示隐藏
    $('.select-brand').on('click', function () {
        var $self = $(this),
            $target = $self.siblings('.name-select-panel');

        $target.toggle();
    })
    
    // 选择擅长项目弹窗
    $('.name-select-panel')
        .on('click', function (e) {
            e.stopPropagation();
        })
        .on('keyup', 'input', function () {
            // 弹窗内搜索删选
            var $self = $(this),
                val = $self.val(),
                $target = $self.closest('.name-select-panel');

            pageUtil.getGood_projects({
                '$target': $target,
                'name': val
            });
        })
        .on('click', 'li', function () {
            // 点击选择擅长项目
            var $self = $(this),
                $wrap = $self.closest('.name-select-panel'),
                val = $self.text(),
                id = $self.attr('data-id');

            $wrap.hide().siblings('.select-brand').text(val).attr('data-id', id);
        })  
        
    // 医院列表相关事件绑定
    $('#listCtnWrap')
        .on('click', '.set', function () {//设置
            var $self = $(this),
                $parent = $self.closest('.list-line'),
                id = $parent.attr('data-id'),
                hisid = $parent.attr('data-hisid'),
                status = $parent.attr('data-status');
            var goUrl = "hospitalMess.html?id="+id + "&hisId=" + hisid + "&status=" + status;

            if (id) {
                layer.open({
                    type: 2,
                    title: '医院客服信息',
                    shadeClose: false,
                    shade: [0.5, '#000'],
                    maxmin: false, //开启最大化最小化按钮
                    area: ['90%', '90%'],
                    content: goUrl
                });
            }
        })
        

    $('body').on('click', function (e) {
        var $target = $(e.target);
		
        if (!$target.hasClass('select-classify') && !$target.hasClass('type-select-panel')) {
            $('.type-select-panel').hide();
        }
    })

    
})