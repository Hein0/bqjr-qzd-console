
var pageUtil = {
    // 页面缓存
    'cache': {},
    'role': {},//用户角色
    'provinceList': [],


    // 获取商品列表
    'getHospitalList': function (obj) {
        var data = {};

        data.pageNum = (obj && obj.curr) || 1; // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20; // 默认一页20条数据

        pageUtil.cache.pageInfo = {
            curr: data.pageNum,
            pageSize: data.size
        }

        $.get(base + 'hospital/myHospital', data, function (res) {
            if (res.status == '0' && res.data) {
                if (res.data.length) {
//                  res.data.forEach(function (items, key) {
//                      items.build_date = res.data[key].build_date.length>10 ? res.data[key].build_date.substring(0, 10) : res.data[key].build_date;
//                  });
                    pageUtil.cache.listCache = res.data;
                    pageUtil.renderHospitalSku(res.data);
                } else {
                    $('#listCtnWrap').html('');
                }
//              // 设置分页
//              setPagination({
//                  elem: $('#pagination'),
//                  totalCount: res.dataCount,
//                  curr: data['pageNum'],
//                  callback: function (obj) {
//                      pageUtil.getHospitalList(obj);
//                  }
//              });
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
            switch (child.service_type) {
                case 1:
                    child.service_type = '医疗美容';
                    break;
                case 2:
                    child.service_type = '综合';
                    break;
                case 3:
                    child.service_type = '口腔专科';
                    break;
                case 4:
                    child.service_type = '眼科专科';
                    break;
                case 5:
                    child.service_type = '皮肤科专科';
                    break;
                default:
                    break;
            }
            html += '<tr class="text-c list-line" data-id="' + child.id + '" data-hisid="'+child.his_id+'" data-status="'+child.status+'">\
			        <td>' + (child.name || '') + '</td>\
			        <td>' + (child.anotherName || '') + '</td>\
			        <td>' + (child.cityName || '') + '</td>\
			        <td>' + (child.telphone || '') + '</td>\
			        <td>' + (child.good_projects || '') + '</td>\
			        <td>'+ (child.addTime || '') + '</td>\
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
	        		<td>'+(child.account || '')+'</td>\
			        <td class="f-14">\
			        	<a href="javascript:void(0)" class="seeDetail blues" target="">查看</a>\
				    </td>\
			    </tr>';
            
        })


        $('#listCtnWrap').html(html);

        $('#listCtnWrap .list-3 span').each(function (index, domItem) {
            if ($(domItem).attr('title')) {
                pageUtil.provinceList.forEach(function (provinceItem) {
                    if (provinceItem.code.toString().substring(0, 2) == $(domItem).attr('title').substring(0, 2)) {
                        var html = ""
                        html += provinceItem.name;
                        $.ajax({
                            // async: false,
                            type: "post",
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
	
	pageUtil.getHospitalList();


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
        
    // 商品列表相关事件绑定
    $('#listCtnWrap')
        .on('click', '.seeDetail', function () {//查看详情
            var $self = $(this),
                $parent = $self.closest('.list-line'),
                id = $parent.attr('data-id'),
                hisid = $parent.attr('data-hisid'),
                status = $parent.attr('data-status');
            var goUrl = "myhospitalDetails.html?";
            if(status ==10 || status==11){
            	goUrl +="id="+ id + "&status=" + status;
            }else{
            	goUrl +="hisId="+ hisid + "&status=" + status;
            }
            if (id) {
                layer.open({
                    type: 2,
                    title: '医院详情',
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
            title: '添加医院信息',
            shadeClose: true,
            shade: [0.5, '#000'],
            maxmin: false, //开启最大化最小化按钮
            area: ['80%', '80%'],
            content: 'myhospitalSPU.html'
        });
    })

    $('body').on('click', function (e) {
        var $target = $(e.target);
		
        if (!$target.hasClass('select-classify') && !$target.hasClass('type-select-panel')) {
            $('.type-select-panel').hide();
        }
    })

    
})