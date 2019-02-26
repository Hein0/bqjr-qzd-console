
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
    'hospitalList': [],//所在医院列表
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
        CacheData.getData('getArea', function (data) {
            data = data[$self.index()].citys;
            var html = '';
            $.each(data, function (index, item) {
                html += '<li data-id="' + item.code + '">' + item.city + '</li>'
            });
            $self.parent().next().html(html);
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

    // 获取擅长项目列表
    'getGood_projects': function (option) {
        var $target = option.$target || $('.projects');
        name = option.name || '';
        var html = '';
        $.each(pageUtil.good_projectsList, function (index, item) {
            if (item.name.indexOf(name) != -1) {
                html += '<li data-id="' + item.id + '">' + item.name + '</li>';
            }
        });
        $target.find('ul').html(html);
    },
    // 获取医院列表
    'getHospital_id': function (option) {
        var $target = option.$target || $('.hospital');
        name = option.name || '';
        cityId = option.cityId || '';

        $.get(base + 'case/getHospitalByCityIdOrName.do', {
            'cityId': cityId,
            'name': name
        }, function (res) {
            var html = '';
            if (res.status == '0' && res.data && res.data.length) {
                $.each(res.data, function (index, item) {
                    html += '<li data-id="' + item.id + '">' + item.name + '</li>';
                });
            }
            $target.find('ul').html(html);
        });
    },

    // 获取查询参数
    'getSearchValue': function () {
        var data = {},
            $wrap = $('#pageSearchForm');
        data.name = $('#searchName').val() || '';//医生姓名
        data.id = $('#dictotId').val() || '';//医生ID
        data.status = $("#status option:selected").val() || ""; //审核状态
        data.cityId = $wrap.find('.select-classify').attr('data-id') || '';
        data.hospital_id = $wrap.find('.select-hospital').attr('data-id') || '';
        data.good_projects = $wrap.find('.select-brand').attr('data-id') || '';
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

    // 获取商品列表
    'getDoctorList': function (obj) {
        var data = pageUtil.getSearchValue();

        data.pageNum = (obj && obj.curr) || 1; // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20; // 默认一页20条数据

        pageUtil.cache.pageInfo = {
            curr: data.pageNum,
            pageSize: data.size
        }

        data = pageUtil.filterEmpty(data);

        $.get(base + 'case/getDoctorInfos.do', data, function (res) {
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
                        pageUtil.getDoctorList(obj);
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

    // 渲染医院列表
    'renderHospitalSku': function (data) {
        var html = '',
            obj = null,
            category = '';
        $.each(data, function (childIndex, child) {
            pageUtil.hospitalList.forEach(function (provinceItem) {
                if (provinceItem.id == child.hospital_id) {
                    child.hospital = provinceItem.name;
                    return;
                }
            });
            switch (child.position) {
                case '15':
                    child.position = '院长';
                    break;
                case '16':
                    child.position = '代表院长';
                    break;
                case '17':
                    child.position = '执行院长';
                    break;
                case '74':
                    child.position = '院长';
                    break;
                case '75':
                    child.position = '副院长';
                    break;
                case '76':
                    child.position = '主任医师';
                    break;
                case '77':
                    child.position = '副主任医师';
                    break;
                case '78':
                    child.position = '医生';
                    break;
                case '79':
                    child.position = '实习医生';
                    break;
                case '86':
                    child.position = '外聘教授';
                    break;
                case '142':
                    child.position = '中心主任';
                    break;
                case '143':
                    child.position = '主诊医生';
                    break;
                case '144':
                    child.position = '研究员';
                    break;
                case '145':
                    child.position = '副研究员';
                    break;
                case '80':
                    child.position = '院长';
                    break;
                case '81':
                    child.position = '整形外科医师';
                    break;
                case '82':
                    child.position = '外科医师';
                    break;
                case '83':
                    child.position = '医师';
                    break;
                default:
                    break;
            }
            html += '<tr class="text-c list-line" data-id="' + child.id + '" data-hisid="'+child.his_id+'" data-status="'+child.status+'">\
		        <td>' + (child.id || '') + '</td>\
		        <td>' + (child.name || '') + '</td>\
		        <td>' + (child.sex == 1 ? '男' : '女') + '</td>\
		        <td>' + (child.cityName || '') + '</td>\
		        <td>' + (child.hospitalName || '') + '</td>\
		        <td>' + (child.position || '') + '</td>\
		        <td>'+ (child.good_projects || '') + '</td>\
		        <td>'+ (child.work_date || '') + '</td>\
		        <td>'+ (child.status == 10 || child.status == 11 ? child.status == 10 ? "已上线" : "已下线" : "") + '</td>\
		        <td>\
		        	<a href="javascript:void(0)" class="contacts blues" target="_blank">查看</a>\
		        </td>\
		        <td>'+ (child.status == 10 || child.status == 11
				          	? "审核成功"
				          	: child.status == 1
				          	? "初审中"
				          	: child.status == 2
				            ? "初审失败"
				            : child.status == 3
				            ? "复审中"
				            : child.status == 4
				            ? "复审失败"
				            : child.status == 5 
				            ? "风控审核中" 
				            : child.status == 6
			        		? "风控审核失败"
			        		: child.status == 7
			        		? "终审中"
			        		: child.status == 8
			        		? "终审失败"
			        		: child.status == 9 ? "审核成功" : child.status) 
	        		+ '</td>\
		        <td class="f-14">\
		        	<a href="javascript:void(0)" class="seeDetail blues" target="">查看</a>' +
    				((pageUtil.role.id == "1" || pageUtil.role.id == "2" || pageUtil.role.id == "3") ? "<a href='javascript:void(0)' class='Delete blues' target=''>删除</a>" : "")   + 	
    				((pageUtil.role.id == "1" || pageUtil.role.id == "8" || pageUtil.role.id == "9") && child.status == 1
			          ? "&nbsp;<a href='javascript:void(0)' class='auditDoctor blues' target=''>审核</a>"
			          : "" ||
			        (pageUtil.role.id == "6" &&  child.status == 7)
			          ? "&nbsp;<a href='javascript:void(0)' class='auditDoctor blues' target=''>审核</a>"
			          : "" ||
			        (pageUtil.role.id == "4" &&  child.status == 3)
			          ? "&nbsp;<a href='javascript:void(0)' class='auditDoctor blues' target=''>审核</a>"
			          : "" ||
			        (pageUtil.role.id == "5" &&  child.status == 5)
			          ? "&nbsp;<a href='javascript:void(0)' class='auditDoctor blues' target=''>审核</a>"
			          : "") +
			    '</td>\
		    </tr>';
        })

        // <span class="edit">编辑</span>

        $('#listCtnWrap').html(html);
        $('#listCtnWrap .list-4 span').each(function (index, domItem) {
            if ($(domItem).attr('title')) {
                pageUtil.provinceList.forEach(function (provinceItem) {
                    if (provinceItem.code.toString().substring(0, 2) == $(domItem).attr('title').substring(0, 2)) {
                        var html = ""
                        html += provinceItem.name;
                        $.ajax({
                            // async: false,
                            type: 'post',
                            url: base + 'adminAddress/getArea.do',
                            data: { parentId: provinceItem.code },
                            success: function (res) {
                                if (res.status == '0' && res.data && res.data.length) {
                                    $.each(res.data, function (index, item) {
                                        if (item.code == $(domItem).attr('title')) {
                                            html += item.name || '';
                                            $(domItem).html(html);
                                            return;
                                        } else {
                                            $(domItem).html(html);
                                        }
                                    });
                                }
                            }
                        });
                        return;
                    }
                });
            }
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
    },
    //医生格式化学历
    'highest_degree': function(education){
    	switch (education) {
            case '5':
                return '博士后';
                break;
            case '7':
                return '双博士';
                break;
            case '9':
                return '博士';
                break;
            case '11':
                return '双硕士';
                break;
            case '13':
                return '硕士';
                break;
            case '14':
                return '本科';
                break;
            case '116':
                return '进修';
                break;
            case '125':
                return '专科';
                break;
            default:
                break;
        };
    },
    //position 职务
	'position':function(position){
		switch (position) {
            case '15':
                return '院长';
                break;
            case '16':
                return '代表院长';
                break;
            case '17':
                return '执行院长';
                break;
            case '74':
                return '院长';
                break;
            case '75':
                return '副院长';
                break;
            case '76':
                return '主任医师';
                break;
            case '77':
                return '副主任医师';
                break;
            case '78':
                return '医生';
                break;
            case '79':
                return '实习医生';
                break;
            case '86':
                return '外聘教授';
                break;
            case '142':
                return '中心主任';
                break;
            case '143':
                return '主诊医生';
                break;
            case '144':
                return '研究员';
                break;
            case '145':
                return '副研究员';
                break;
            case '80':
                return '院长';
                break;
            case '81':
                return '整形外科医师';
                break;
            case '82':
                return '外科医师';
                break;
            case '83':
                return '医师';
                break;
            default:
                break;
        };
	},

	
	
}

$(function () {

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


    // 城市选择弹窗初始化
    CacheData.getData('getArea', function (data) {
        var html = '';
        pageUtil.provinceList = data;
        $.each(data, function (index, item) {
            html += '<li data-id="' + item.code + '">' + item.province + '</li>'
        });
        $('.type-select-panel').find('.ul-1').html(html);

    })
    //获取用户信息
    $.ajax({
        async: true,
        type: 'get',
        url: base + 'sys/getUserHasRole',
        data: { 'level': 1 },
        success: function (res) {
            if (res.status == '0' && res.data.length>0) {
                pageUtil.role = res.data[0];
            }
        }
    });
    //获取所在医院列表
    $.ajax({
        async: true,
        type: 'get',
        url: base + 'case/getHospitalByCityIdOrName.do',
        data: {
            'cityId': '',
            'name': ''
        },
        success: function (res) {
            var html = '';
            if (res.status == '0') {
                pageUtil.hospitalList = res.data;
            }
        }
    });

    // 擅长项目选择弹窗初始化
    pageUtil.getGood_projects({});
    pageUtil.getHospital_id({});

    // 选择城市弹窗展示隐藏
    $('.select-classify').on('click', function () {
        var $self = $(this),
            $target = $self.siblings('.type-select-panel');

        $target.toggle();
    })

    // 选择擅长项目弹窗展示隐藏
    $('.select-brand').on('click', function () {
        var $self = $(this),
            $target = $self.siblings('.name-select-panel');

        $target.toggle();
    })
    $('.select-hospital').on('click', function () {
        var $self = $(this),
            $target = $self.siblings('.name-select-panel');
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

    // 选择擅长项目弹窗
    $('.projects')
        .on('click', function (e) {
            e.stopPropagation();
        })
        .on('keyup', 'input', function () {
            // 弹窗内搜索删选
            var $self = $(this),
                val = $self.val(),
                $target = $self.closest('.projects');

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
    //所在医院    
    $('.hospital')
        .on('click', function (e) {
            e.stopPropagation();
        })
        .on('keyup', 'input', function () {
            // 弹窗内搜索删选
            var $self = $(this),
                val = $self.val(),
                $target = $self.closest('.hospital'),
                cityId = '';

            pageUtil.getHospital_id({
                '$target': $target,
                'name': val,
                'cityId': $('.select-classify').data('id') || ''
            });
        })
        .on('click', 'li', function () {
            // 点击选择擅长项目
            var $self = $(this),
                $wrap = $self.closest('.name-select-panel'),
                val = $self.text(),
                id = $self.attr('data-id');

            $wrap.hide().siblings('.select-hospital').text(val).attr('data-id', id);
        })

    // 查询医生列表
    $('#screeBtn').on('click', function () {
        pageUtil.getDoctorList();
    })

    // 重置查询列表
    $('#resetBtn').on('click', function () {
        var $wrap = $('#pageSearchForm');

        $wrap.find('.select-classify').attr('data-id', '').text('请选择城市');
        $wrap.find('.condition-panel').find('ul:gt(0)').empty();
        $wrap.find('.condition-panel').find('li').removeClass('check');
        $wrap.find('.select-brand').attr('data-id', '').text('请选择擅长项目');
        $wrap.find('.select-hospital').attr('data-id', '').text('请选择所在医院');
        $wrap.find('.name-select-panel').find('input').val('');
        $wrap.find('.name-select-panel').find('ul').empty();
        $wrap.find("#status").val("");
        pageUtil.getGood_projects({'$target': $wrap.find('.projects')});
        pageUtil.getHospital_id({'$target': $wrap.find('.hospital')});
        $wrap.find('#searchName').val('');
        $wrap.find('#dictotId').val('');

        pageUtil.getDoctorList();
    })

    // 商品列表相关事件绑定
    $('#listCtnWrap')
        .on('click', '.seeDetail', function () {//查看详情
            var $self = $(this),
                $parent = $self.closest('.list-line'),
                id = $parent.attr('data-id'),
                hisid = $parent.attr('data-hisid'),
                status = $parent.attr('data-status');
            var goUrl = "doctorDetails.html?";
            if(status ==10 || status==11){
            	goUrl +="id="+ id + "&status=" + status;
            }else{
            	goUrl +="hisId="+ hisid + "&status=" + status;
            }
            if (id) {
                layer.open({
                    type: 2,
                    title: '医生详情',
                    shadeClose: false,
                    shade: [0.5, '#000'],
                    maxmin: false, //开启最大化最小化按钮
                    area: ['90%', '90%'],
                    content: goUrl
                });
            }
        })
        .on('click', '.edit', function () {
            // 编辑 SKU 数据
            var $self = $(this),
                $parent = $self.closest('.list-line'),
                id = $parent.attr('data-id');
            layer.open({
                type: 2,
                title: '编辑医生',
                shadeClose: false,
                shade: [0.5, '#000'],
                maxmin: false, //开启最大化最小化按钮
                area: ['90%', '90%'],
                content: 'doctorSPU.html?id=' + id
            });
        })
        .on('click', '.Delete', function () {//删除
        	var $self = $(this),
        		$parent = $self.closest(".list-line"),
        		id = $parent.attr("data-id"),
        		hisid = $parent.attr("data-hisid"),
        		status = $parent.attr("data-status");
        	html = template("delete", {id:id,hisid:hisid,status:status});
          	layer.open({
            	type: 1,
            	title: "删除",
            	shadeClose: true,
            	shade: [0.5, "#000"],
            	maxmin: false,
	            area: ["80%", "35%"],
	            content: html,
	            success: function(layero, index) {
	              	function deleteFun(ids, msg , staT, hisId) {
		                var data = {};
		                if (staT >= 10) {
		                  	data.id = ids;
		                  	data.delete_msg = msg;
		                }else{
		                	data.his_id = hisId;
		                	data.delete_msg = msg;
		                }
		                parent.layer.msg("删除成功！");
		                $.ajax({
		                  	type: "post",
		                  	url: base + "hospital/deleDoctor",
		                  	processData: false,
		                  	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
		                  	dataType: "json",
		                  	data: JSON.stringify(data),
		                  	success: function(res) {
			                    if (res.status == "0") {
			                      	parent.layer.msg("删除成功！");
			                      	window.setTimeout(function() {
			                        	layer.close(index);
			                        	window.location.reload();
			                      	}, 2000);
			                    } else {
			                      	$.Huimodalalert(res.message, 1500);
			                    }
		                  	}
		                });
		            }
	              	$(".submitDelete").on("click", function() {
	              		var $Wrap = $(".deleteWrap"),
	              			getId = $Wrap.attr("data-id"),
	              			types = $Wrap.attr("data-status"),
	              			hisId = $Wrap.attr("data-hisid"),
		                	vals = $Wrap.find("#delete_msg").val();
	                  	if (vals.replace(/(^s*)|(s*$)/g, "").length >= 0 && vals != "") {
	                    	deleteFun(getId, vals, types, hisId);
	                  	} else {
	                    	parent.layer.msg("请输入删除原因！");
	                  	}
	              	});
            	}
	        });	
        })
        .on("click", ".contacts", function() {//点击查看相关联系人
	      	var $self = $(this),
	        	$parent = $self.closest(".list-line"),
	        	his_id = $parent.attr("data-hisid");
	      	$.get(base + "hospital/getDoctorContacts", { his_id: his_id }, function(jsonData) {
	        	var result = typeof jsonData;
		        if (result == "string") {
		          jsonData = JSON.parse(jsonData);
		        }
		        if (jsonData.status == "0") {
		          var html = template("contacts", jsonData);
		          layer.open({
		            type: 1,
		            title: "相关联系人",
		            shadeClose: true,
		            shade: [0.5, "#000"],
		            maxmin: false,
		            area: ["80%", "60%"],
		            content: html,
		            success: function(layero, index) {}
		          });
		        } else {
		          $.Huimodalalert(jsonData.message, 1500);
		        }
	      	});
	    })
        .on('click', '.auditDoctor', function () {//医生审核
	      	var $self = $(this),
	        	$parent = $self.closest(".list-line"),
	        	id = $parent.attr("data-id"),
	        	his_id = $parent.attr("data-hisid"),
	        	status = $parent.attr("data-status");
	      	var url = base,
	        	data = {},
	        	html = "";
	      	if (status == "10" || status == "11") {
		        if (id) {
		          url += "case/getDoctorInfoById";
		          data.id = id;
		        }
	      	} else {
		        if (his_id) {
		          url += "hospital/getDoctorByHisId";
		          data.his_id = his_id;
		        }
	      	}
		    $.get(url, data, function(res) {
			        if (res.message) {
			          	$.Huimodalalert(res.message, 2000);
			        } else if (!res.message) {
			          	res.data.imgPath = imgPath;
			          	res.data.highest_degree = pageUtil.highest_degree(res.data.highest_degree);//医生学历
			          	res.data.position = pageUtil.position(res.data.position);//医生学历
			          	pageUtil.hospitalList.forEach(function (provinceItem) {//所在医院
			                if (provinceItem.id == res.data.hospital_id) {
			                    res.data.hospital = provinceItem.name;
			                    return
			                }
			           	});
			          	html = template("checks", res.data);
			          	layer.open({
			            	type: 1,
			            	title: "审核",
			            	shadeClose: true,
			            	shade: [0.5, "#000"],
			            	maxmin: false,
				            area: ["80%", "60%"],
				            content: html,
				            success: function(layero, index) {
				              	function check(type, msg) {
					                var data = {};
					                if (id) {
					                  	data.id = parseInt(id);
					                }
					                if (his_id) {
					                  	data.his_id = parseInt(his_id);
					                }
					                if (status) {
					                  	data.status = parseInt(status);
					                }
					                if (type == 1) {
					                  	data.result = 1;
					                  	data.msg = "";
					                } else if (type == 2) {
					                  	data.result = 2;
					                  	data.msg = msg;
					                } else {
					                  	return;
					                }
					                $.ajax({
					                  	type: "post",
					                  	url: base + "hospital/revieweDoctor",
					                  	processData: false,
					                  	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
					                  	dataType: "json",
					                  	data: JSON.stringify(data),
					                  	success: function(jsonData) {
					                    	var result = typeof jsonData;
						                    if (result == "string") {
						                      	jsonData = JSON.parse(jsonData);
						                    }
						                    if (jsonData.status == "0") {
						                      	$.Huimodalalert("审核完成", 1500);
						                      	window.setTimeout(function() {
						                        	layer.close(index);
						                        	window.location.reload();
						                      	}, 1500);
						                    } else {
						                      	$.Huimodalalert(jsonData.message, 1500);
						                    }
					                  	}
					                });
					            }
			              	$("#pass").on("click", function() {
				                layer.confirm("确认审核通过？",
				                  {
				                    btn: ["提交", "取消"] //按钮
				                  },
				                  function() {
				                    check(1);
				                  },
				                  function() {}
				                );
			              	});
			              	$("#refuse").on("click", function() {
				                layer.prompt({ title: "拒绝原因", formType: 2, 
					                yes:function(index,doms) {
					                	var vals = doms.find(".layui-layer-input").val();
					                  	if (vals.replace(/(^s*)|(s*$)/g, "").length >= 0 && vals != "") {
					                    	check(2, vals);
					                  	} else {
					                    	parent.layer.msg("请填写拒绝原因！");
					                  	}
				                	} 
				                });
			              	});
			            }
			        });
		        }
		    });
            
        })


    // 图片排序及删除
    $('#imglistWrap')
        .on('click', '.delete', function () {
            var $self = $(this),
                $target = $self.parent(),
                $wrap = $('#imglistWrap');

            if (window.confirm('是否删除图片')) {
                $target.remove();

                $wrap.find('.img-one').removeClass('default').eq(0).addClass('default');
            }
        })
        .on('click', '.set-default', function () {
            var $self = $(this),
                $target = $self.parent(),
                $wrap = $('#imglistWrap');

            $target.addClass('default').siblings().removeClass('default');

            $wrap.prepend($target);
        })

    // 图片上传
    $("#fileUpload").on('change', function () {
        var formData = new FormData(),
            $wrap = $('#imglistWrap');

        formData.append("file", $("#fileUpload").get(0).files[0]);

        $.ajax({
            url: base + "common/upload",
            type: "POST",
            processData: false,
            contentType: false,
            data: formData,
            dataType: "JSON",
            success: function (data) {
                var html = '',
                    pageUrl = '';

                if (data.status == '0') {
                    pageUrl = imgPath + data.data;
                    html += '<div class="img-one">\
                                <img src="' + pageUrl + '" data-src="' + data.data + '">\
                                <span class="delete">✕</span>\
                                <span class="set-default">默认主图</span>\
                            </div>';

                    $wrap.append(html);
                } else {
                    $.Huimodalalert(data.message, 2000);
                }
            }
        });

    });



    $('body').on('click', function (e) {
        var $target = $(e.target);

        if (!$target.hasClass('select-classify') && !$target.hasClass('type-select-panel')) {
            $('.type-select-panel').hide();
        }

        if (!$target.hasClass('select-brand') && !$target.hasClass('name-select-panel')) {
            $('.projects').hide();
        }
        if (!$target.hasClass('select-hospital') && !$target.hasClass('name-select-panel')) {
            $('.hospital').hide();
        }
    })

    $('#marketPrice, #couponPrice').on('blur', function () {
        var $self = $(this),
            val = +$self.val();

        if (typeof val !== 'number' || val < 0) {
            $self.val(0)
        }
    })

    $('#screeBtn').trigger('click');
})