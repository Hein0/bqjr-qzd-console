
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
        data.name = $('#searchName').val() || '';
        data.status = $("#status option:selected").val() || ""; //审核状态
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

    // 获取医生列表
    'getDoctorList': function (obj) {
        var data = pageUtil.getSearchValue();

        data.pageNum = (obj && obj.curr) || 1; // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20; // 默认一页20条数据

        pageUtil.cache.pageInfo = {
            curr: data.pageNum,
            pageSize: data.size
        }

        data = pageUtil.filterEmpty(data);

        $.get(base + 'hospital/myDoctor', data, function (res) {
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
		        <td>' + (child.name || '') + '</td>\
		        <td>' + (child.sex == 1 ? '男' : '女') + '</td>\
		        <td>' + (child.cityName || '') + '</td>\
		        <td>' + (child.hospitalName || '') + '</td>\
		        <td>' + (child.position || '') + '</td>\
		        <td>'+ (child.good_projects || '') + '</td>\
		        <td>'+ (child.work_date || '') + '</td>\
		        <td>'+ (child.status == 10 || child.status == 11 ? child.status == 10 ? "已上线" : "已下线" : "") + '</td>\
		        <td>'+(child.reviewName || '')+'</td>\
		        <td>'+(child.reviewTelphone || '')+'</td>\
		        <td>'+ (child.status == 9 || child.status == 10 || child.status == 11
			          	? "审核成功"
			          	: child.status == 1 || child.status == 3 || child.status == 5 || child.status == 7
			          	? "审核中"
			          	: child.status == 2 || child.status == 4 || child.status == 6 || child.status == 8
			            ? "审核失败" : child.status) 
	        		+ '</td>\
		        <td class="f-14">\
		        	<a href="javascript:void(0)" class="seeDetail blues" target="">查看</a>\
			    </td>\
		    </tr>';
        })

        $('#listCtnWrap').html(html);

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

    // 查询医生列表
    $('#screeBtn').on('click', function () {
        pageUtil.getDoctorList();
    })

    // 重置查询列表
    $('#resetBtn').on('click', function () {
        var $wrap = $('#pageSearchForm');
        $wrap.find("#status").val("");
        $wrap.find('#searchName').val('');

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
            var goUrl = "mydoctorDetails.html?";
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


    // 新增按钮
    $('#addBtn').on('click', function () {
        layer.open({
            type: 2,
            title: '添加医生信息',
            shadeClose: false,
            shade: [0.5, '#000'],
            maxmin: false, //开启最大化最小化按钮
            area: ['90%', '90%'],
            content: 'mydoctorSPU.html'
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