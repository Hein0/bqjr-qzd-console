
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


var pageUtil = {
    // 页面缓存
    'cache': {},
    'role': {},//用户角色
    'provinceList': [],

    // 获取查询参数
    'getSearchValue': function () {
        var data = {},
            $wrap = $('#pageSearchForm');
        data.province = $wrap.find("#province option:selected").val();    
        data.city = $wrap.find("#city option:selected").val();
        data.type = 2;
        return data;
    },

    // 过滤空参数
    'filterEmpty': function (obj) {
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
     // 格式化当前时间// return 2010-05-05 05:05:05
    formatNowTime: function () {
        var helper = function (val) {
            return +val < 10 ? ('0' + val) : val
        },
        time = new Date(),
        result = '';
        result += time.getFullYear() + '-' + (helper(time.getMonth() + 1)) + '-' + helper(time.getDate()) + ' ' + helper(time.getHours()) + ':' + helper(time.getMinutes()) + ':' + helper(time.getSeconds());
        return result;
    },
    
    // 设置城市信息(添加和列表通用)
    'setSelectCitType': function (index,$Dom) {
    	if(index>=0){
    		CacheData.getData('getArea', function (data) {
	            data = data[index].citys;
	            var html = '<option value="">请选择城市</option>';
	            $.each(data, function (index, item) {
	                html += '<option value="' + item.city + '">' + item.city + '</option>'
	            });
	            $Dom.html(html);
	        })
    	}else{
    		var html = '<option value="">请选择城市</option>';
    		$Dom.html(html);
    	}
    },

    // 获取banner数据列表
    'getBannerList': function (obj) {
        var data = pageUtil.getSearchValue();
        data.pageNum = (obj && obj.curr) || 1; // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20; // 默认一页20条数据
        pageUtil.cache.pageInfo = {
            curr: data.pageNum,
            pageSize: data.size
        }

        data = pageUtil.filterEmpty(data);
        $.get(base + 'redpacket/bannerList', data, function (res) {
            if (res.status == '0' && res.data) {
                if (res.data.length) {
                	res.data.imgPath = imgPath;
                    pageUtil.cache.listCache = res.data;
                    pageUtil.rendershopSku(res.data);
                }else {
                    $('#listCtnWrap').html('');
                    $.Huimodalalert("查询不到数据！", 2000);
                }

                // 设置分页
                setPagination({
                    elem: $('#pagination'),
                    totalCount: res.dataCount,
                    curr: data['pageNum'],
                    callback: function (obj) {
                        pageUtil.getBannerList(obj);
                    }
                });
            } else if (res.status == '9999') {
                // 未登录
                window.top.location.href = '../../login.html';
            } else {
                $('#listCtnWrap').html('');
                $.Huimodalalert(res.message, 2000);
            }
        })
    },

    // 渲染banner首页数据列表
    'rendershopSku': function (data) {
        var html = '',
            obj = null,
            category = '';
        $.each(data, function (childIndex, child) {
           
            html += '<tr class="text-c list-line" data-id="' + child.id + '" data-imgUrl="' + child.imgUrl + '" data-province="' + child.province + '" data-link="' + child.link + '" data-city="' + child.city + '" >\
		        <td><input type="tel" class="paixu" value="' + (child.order || '') + '" disabled/></td>\
		        <td>' + (child.province+">"+child.city) + '</td>\
		        <td><img class="avatar size-XL" src="' + (imgPath +child.imgUrl || '') + '"></td>\
		        <td>' + (child.link || '') + '</td>\
		        <td class="f-14">\
		        	<a href="javascript:void(0)" class="Sort malr06 blues" target="">排序</a>\
		        	<a href="javascript:void(0)" class="Edit malr06 blues" target="">编辑</a>\
		        	<a href="javascript:void(0)" class="Delete malr06 blues" target="">删除</a>\
			    </td>\
		    </tr>';
        })
        $('#listCtnWrap').html(html);

    },

	
}

$(function () {

	// 城市选择弹窗初始化
    CacheData.getData('getArea', function (data) {
        var html = ' <option value="">请选择省</option>';
        pageUtil.provinceList = data;
        $.each(data, function (index, item) {
        	html += '<option value="' + item.province + '">' + item.province + '</option>'
        });
        $('#province').html(html);
    })
    
    //列表选择省	
	$("#province").on("change",function(){
		pageUtil.setSelectCitType($(this).get(0).selectedIndex-1,$("#city"));
	})

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
	// 查询商城banner列表
    $('#screeBtn').on('click', function () {
    	if($("#province").val()!=""){
        	pageUtil.getBannerList();
        }	
    })

    // 重置查询列表
    $('#resetBtn').on('click', function () {
        var $wrap = $('#pageSearchForm');
        $wrap.find("#province").val("").trigger("change");

//      pageUtil.getBannerList();
    })
    //查询地区显示隐藏
    $(".select-citytal").on("click", function() {
		var $self = $(this),
			$target = $self.siblings(".name-select-panel");

		$target.toggle();
	});
    // 查询地区弹窗
	$(".citytal")
		.on("click", function(e) {
			e.stopPropagation();
		})
		.on("click", "li", function() {
			// 点击选择擅长项目
			var $self = $(this),
				$wrap = $self.closest(".name-select-panel"),
				val = $self.text(),
				id = $self.attr("data-id");

			$wrap.hide().siblings(".select-citytal").text(val).attr("data-id", id);
		});

    // 商品列表相关事件绑定
    $('#listCtnWrap')
    	.on('click', '.Sort', function () {//排序
            var $self = $(this),
                $parent = $self.closest('.list-line');
            	$parent.find(".paixu").removeAttr("disabled").focus();
        })
    	.on('blur', '.paixu', function () {//排序失去焦点触发
            var $self = $(this),
            $parent = $self.closest('.list-line'),
            id = $parent.attr('data-id'),
            order = $self.val();
            if(order == ""){
            	$.Huimodalalert("顺序不能为空", 2000); 
            	return 
            }else{
            	$.get(base + 'redpacket/bannerOrder?id='+id+"&order="+order, {}, function (res) {
		            if (res.status == '0') {
		                $.Huimodalalert(res.message, 2000); 
		                $('#screeBtn').trigger('click');
		            } else {
		                $.Huimodalalert(res.message, 2000);
		            }
		        })	
            }
        })
        .on('click', '.Edit', function () {//编辑
            var $self = $(this),
                $parent = $self.closest('.list-line'),
                id = $parent.attr('data-id'),
                imgUrl = $parent.attr('data-imgUrl'),
                province = $parent.attr('data-province'),
                city = $parent.attr('data-city'),
                links = $parent.attr('data-link');
            var goUrl = "starSameModify.html?&byId="+ id +"&imgUrl="+ imgUrl +"&province="+ province +"&city="+ city +"&links="+ links;

            if (id) {
            	layer.open({
		            type: 2,
		            title: '编辑',
		            shadeClose: true,
		            shade: [0.5, '#000'],
		            maxmin: false, //开启最大化最小化按钮
		            area: ['60%', '50%'],
		            content: goUrl,
		        });
                
            }
        })
        .on('click', '.Delete', function () {//删除
            var $self = $(this),
                $parent = $self.closest('.list-line'),
                id = $parent.attr('data-id');
            	$.get(base + 'redpacket/bannerDel?id='+id, {}, function (res) {
		            if (res.status == '0') {
		                $.Huimodalalert(res.message, 2000); 
		                $('#screeBtn').trigger('click');
		            } else {
		                $.Huimodalalert(res.message, 2000);
		            }
		        })
        })


    // 新增按钮
    $('#addBtn').on('click', function () {
        layer.open({
            type: 2,
            title: '添加',
            shadeClose: true,
            shade: [0.5, '#000'],
            maxmin: false, //开启最大化最小化按钮
            area: ['60%', '50%'],
            content: 'starSameSpu.html?type='+1,
        });
    })

    $('body').on('click', function (e) {
        var $target = $(e.target);

        if (!$target.hasClass('select-classify') && !$target.hasClass('type-select-panel')) {
            $('.type-select-panel').hide();
        }

        if (!$target.hasClass('select-brand') && !$target.hasClass('name-select-panel')) {
            $('.projects').hide();
        }
        if (!$target.hasClass('select-citytal') && !$target.hasClass('name-select-panel')) {
            $('.citytal').hide();
        }
    })

//  $('#screeBtn').trigger('click');
})