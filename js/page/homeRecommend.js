
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
        data.type = 3;
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
        $.get(base + 'redpacket/firstRichList', data, function (res) {
            if (res.status == '0' && res.data) {
                if (res.data.length) {
                    pageUtil.cache.listCache = res.data;
                    pageUtil.rendershopSku(res.data);
                } else {
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

    // 渲染数据列表
    'rendershopSku': function (data) {
        var html = '',
            obj = null,
            category = '';
        $.each(data, function (childIndex, child) {
           
            html += '<tr class="text-c list-line" data-id="' + child.id + '">\
		        <td>' + (child.goodId) + '</td>\
		        <td>' + (child.hospitalName) + '</td>\
		        <td>' + (child.city || '') + '</td>\
		        <td><input type="tel" class="paixu" value="' + (child.order || '') + '" disabled/></td>\
		        <td class="f-14">\
		        	<a href="javascript:void(0)" class="Sort blues malr06" target="">排序</a>\
		        	<a href="javascript:void(0)" class="Delete blues malr06" target="">删除</a>\
			    </td>\
		    </tr>';
        })
        $('#listCtnWrap').html(html);

    },
    
    //添加数据
    addDatas:function(cloes,data,type){
    	$.ajax({
			async: true,
			type: "post",
			url: base + "redpacket/firstRichAdd",
			data: JSON.stringify(data),
			contentType: "application/json;charset=utf-8",
			success: function(res) {
				if(res.status == "0") {
					$.Huimodalalert(res.message, 2000);
					if(type==2){
						layer.close(cloes);
						$('#screeBtn').trigger('click');
						setTimeout(function(){
							$("#addBtn").trigger('click');
						},1000)
					}else{
						layer.close(cloes);
						$('#screeBtn').trigger('click');
					}
					
				}else{
					layer.msg(res.message);
				}
			}
		});
    }

	
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
	// 查询列表
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
    //列表选择省	
	$("#province").on("change",function(){
		pageUtil.setSelectCitType($(this).get(0).selectedIndex-1,$("#city"));
	})
	
    // 商品列表相关事件绑定
    $('#listCtnWrap')
        .on('click', '.Sort', function () {//排序  
            var $self = $(this),
                $parent = $self.closest('.list-line');
            $parent.find(".paixu").removeAttr("disabled").focus();
        })
        .on('click', '.Delete', function () {//删除
            var $self = $(this),
            $parent = $self.closest('.list-line'),
            id = $parent.attr('data-id');
        	$.get(base + 'redpacket/firstRichDel?id='+id, {}, function (res) {
	            if (res.status == '0') {
	                $.Huimodalalert(res.message, 2000); 
	                $('#screeBtn').trigger('click');
	            } else {
	                $.Huimodalalert(res.message, 2000);
	            }
	        })
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
            	$.get(base + 'redpacket/firstRichOrder?id='+id+"&order="+order, {}, function (res) {
		            if (res.status == '0') {
		                $.Huimodalalert(res.message, 2000); 
		                $('#screeBtn').trigger('click');
		            } else {
		                $.Huimodalalert(res.message, 2000);
		            }
		        })	
            }
        	
        })


    // 新增按钮
    $('#addBtn').on('click', function () {
    	var html = template("addTempla", {});
        var winLay = layer.open({
            type: 1,
            title: '添加首页推荐',
            shadeClose: true,
            shade: [0.5, '#000'],
            maxmin: false, //开启最大化最小化按钮
            area: ['60%', '40%'],
            content: html,
            success: function (layero, index) {
            	
            	// 添加页面城市选择弹窗初始化
			    CacheData.getData('getArea', function (data) {
			        var html = ' <option value="">请选择省</option>';
			        pageUtil.provinceList = data;
			        $.each(data, function (index, item) {
			        	html += '<option value="' + item.province + '">' + item.province + '</option>'
			        });
			        $('#provinces').html(html);
			    });
			    //添加页面选择省	
				$("#provinces").on("change",function(){
					pageUtil.setSelectCitType($(this).get(0).selectedIndex-1,$("#citys"));
				})
            	
        		//提交
                $(".addBtns").on("click", function () {
                	var slef = $(this);
                	var data = {};
                	if ($("#goodId").val() == "") {
                        layer.msg("请输入商品ID!");
                        return;
                    }else{
                    	data.goodId = Number($("#goodId").val());
                    }
                	if ($("#provinces option:selected").val() == "") {
                        layer.msg("请选择省份!");
                        return;
                    }else{
                    	data.province = $("#provinces option:selected").val();
                    }
                    if ($("#citys option:selected").val() == "") {
                        layer.msg("请选择城市!");
                        return;
                    }else{
                    	data.city = $("#citys option:selected").val();
                    }
                	data.type = 3;
                	//添加数据
                	pageUtil.addDatas(winLay,data,1);
                })  
                //继续添加
                $(".continueAdd").on("click", function () {
                	var slef = $(this);
                	var data = {};
                	if ($("#goodId").val() == "") {
                        layer.msg("请输入商品ID!");
                        return;
                    }else{
                    	data.goodId = Number($("#goodId").val());
                    }
                	if ($("#provinces option:selected").val() == "") {
                        layer.msg("请选择省份!");
                        return;
                    }else{
                    	data.province = $("#provinces option:selected").val();
                    }
                    if ($("#citys option:selected").val() == "") {
                        layer.msg("请选择城市!");
                        return;
                    }else{
                    	data.city = $("#citys option:selected").val();
                    }
                	data.type = 3;
                	//添加数据
                	pageUtil.addDatas(winLay,data,2);
                }) 
            }
        });
    })

    $('body').on('click', function (e) {
        var $target = $(e.target);

    })

//  $('#screeBtn').trigger('click');
})