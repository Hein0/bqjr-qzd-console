
var pageUtil = {
    // 页面缓存
    'cache': {},
    'role': {},//用户角色
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

    // 获取查询参数
    'getSearchValue': function () {
        var data = {},
            $wrap = $('#pageSearchForm');
        data.name = $('#searchName').val() || '';//医院名称
        data.id = $('#hospid').val() || '';//医院ID
        data.status = $("#status option:selected").val() || ""; //审核状态
        data.cityId = $wrap.find('.select-classify').attr('data-id') || '';//城市
        data.good_projects = $wrap.find('.select-brand').attr('data-id') || '';//项目
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
    'getHospitalList': function (obj) {
        var data = pageUtil.getSearchValue();

        data.pageNum = (obj && obj.curr) || 1; // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20; // 默认一页20条数据

        pageUtil.cache.pageInfo = {
            curr: data.pageNum,
            pageSize: data.size
        }

        data = pageUtil.filterEmpty(data);

        $.get(base + 'case/getHospitalInfos.do', data, function (res) {
            if (res.status == '0' && res.data) {
                if (res.data.length) {
//                  res.data.forEach(function (items, key) {
//                      items.build_date = res.data[key].build_date.substring(0, 10)
//                  });
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
			        <td>' + (child.id || '') + '</td>\
			        <td>' + (child.name || '') + '</td>\
			        <td>' + (child.anotherName || '') + '</td>\
			        <td>' + (child.cityName || '') + '</td>\
			        <td>' + (child.telphone || '') + '</td>\
			        <td>' + (child.good_projects || '') + '</td>\
			        <td>'+ (child.build_date || '') + '</td>\
			        <td>'+ (child.status == 10 || child.status == 11 ? child.status == 10 ? "已上线" : "已下线" : "") + '</td>\
			        <td><span class=" blues contacts">查看</span></td>\
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
	        		<td>'+ (child.account || '') + '</td>\
			        <td class="f-14">\
			        	<a href="javascript:void(0)" class="seeDetail blues" target="">查看</a>' +
			        	((pageUtil.role.id == "1" || pageUtil.role.id == "2" || pageUtil.role.id == "3") ? "<a href='javascript:void(0)' class='Delete blues' target=''>删除</a>" : "")   +   
			        	
        				((pageUtil.role.id == "1" || pageUtil.role.id == "8" || pageUtil.role.id == "9") && child.status == 1 
				          ? "&nbsp;<a href='javascript:void(0)' class='auditDetail blues' target=''>审核</a>"
				          : "" ||
				        (pageUtil.role.id == "6" &&  child.status == 7)
				          ? "&nbsp;<a href='javascript:void(0)' class='auditDetail blues' target=''>审核</a>"
				          : "" ||
				        (pageUtil.role.id == "4" &&  child.status == 3)
				          ? "&nbsp;<a href='javascript:void(0)' class='auditDetail blues' target=''>审核</a>"
				          : "" ||
				        (pageUtil.role.id == "5" &&  child.status == 5)
				          ? "&nbsp;<a href='javascript:void(0)' class='auditDetail blues' target=''>审核</a>"
				          : "") +
				    '</td>\
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

    // 擅长项目选择弹窗初始化
    pageUtil.getGood_projects({});
//  pageUtil.getHospitalList();

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

    // 查询商品列表
    $('#screeBtn').on('click', function () {
        pageUtil.getHospitalList();
    })

    // 重置查询列表
    $('#resetBtn').on('click', function () {
        var $wrap = $('#pageSearchForm');

        $wrap.find('.select-classify').attr('data-id', '').text('请选择城市');
        $wrap.find('.condition-panel').find('ul:gt(0)').empty();
        $wrap.find("#status").val("");
        $wrap.find('.condition-panel').find('li').removeClass('check');
        $wrap.find('.select-brand').attr('data-id', '').text('请选择擅长项目');
        $wrap.find('.name-select-panel').find('input').val('');
        $wrap.find('.name-select-panel').find('ul').empty();
        pageUtil.getGood_projects({'$target': $wrap.find('.name-select-panel')});
        $wrap.find('#searchName').val('');
        $wrap.find('#hospid').val('');

        pageUtil.getHospitalList();
    })

    // 商品列表相关事件绑定
    $('#listCtnWrap')
        .on('click', '.seeDetail', function () {//查看详情
            var $self = $(this),
                $parent = $self.closest('.list-line'),
                id = $parent.attr('data-id'),
                hisid = $parent.attr('data-hisid'),
                status = $parent.attr('data-status');
            var goUrl = "hospitalDetails.html?";
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
	              	function deleteFun(ids, msg, staT, hisId) {
		                var data = {};
		                if (staT >= 10) {
		                  	data.id = ids;
		                  	data.delete_msg = msg;
		                }else{
		                	data.his_id = hisId;
		                	data.delete_msg = msg;
		                }
		                $.ajax({
		                  	type: "post",
		                  	url: base + "hospital/deleHospital",
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
			                      	}, 1500);
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
        .on('click', '.auditDetail', function () {//审核
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
		          url += "case/getHospitalInfoById";
		          data.id = id;
		        }
	      	} else {
		        if (his_id) {
		          url += "hospital/getHospitalByHisId";
		          data.his_id = his_id;
		        }
	      	}
		    $.get(url, data, function(res) {
			        if (res.message) {
			          	$.Huimodalalert(res.message, 2000);
			        } else if (!res.message) {
			          	res.data.imgPath = imgPath;
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
					                  	url: base + "hospital/revieweHospital",
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
        .on("click", ".contacts", function() {//点击查看相关联系人
	      	var $self = $(this),
	        	$parent = $self.closest(".list-line"),
	        	his_id = $parent.attr("data-hisid");
	      	$.get(base + "hospital/getHospitalContacts", { his_id: his_id }, function(jsonData) {
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
	    });


    $('body').on('click', function (e) {
        var $target = $(e.target);
		
        if (!$target.hasClass('select-classify') && !$target.hasClass('type-select-panel')) {
            $('.type-select-panel').hide();
        }

        if (!$target.hasClass('select-brand') && !$target.hasClass('name-select-panel')) {
            $('.name-select-panel').hide();
        }
    })
    
	//自动触发筛选功能
    $('#screeBtn').trigger('click');
    
})