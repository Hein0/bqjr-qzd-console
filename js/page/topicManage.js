
var pageUtil = {
    // 页面缓存
    'cache': {},
    'role': {},//用户角色
    'provinceList': [],

    // 获取查询参数
    getSearchValue: function () {
        var data = {},
            $wrap = $('#pageSearchForm');
        data.name = $wrap.find("#names").val();
        data.beginTime = $wrap.find("#beginTime").val() ? $wrap.find("#beginTime").val()+" 00:00:00" :"";
        data.endTime = $wrap.find("#endTime").val()? $wrap.find("#endTime").val()+ " 23:59:59": "";
        return data;
    },
    // 获取banner数据列表
    getBannerList: function (obj) {
        var data = pageUtil.getSearchValue();
        data.pageNum = (obj && obj.curr) || 1; // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20; // 默认一页20条数据
        pageUtil.cache.pageInfo = {
            curr: data.pageNum,
            pageSize: data.size
        }

        data = checkInput.filterEmpty(data);
        $.ajax({
          	type: "post",
          	url: base + "topic/findTopicList",
          	processData: false,
          	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
          	dataType: "json",
          	data: JSON.stringify(data),
          	success: function(res) {
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
	            }else {
	                $('#listCtnWrap').html('');
	                $.Huimodalalert(res.message, 2000);
	            }
          	}
        });

    },

    // 渲染banner首页数据列表
    rendershopSku: function (data) {
        var html = '',
            obj = null,
            category = '';
        $.each(data, function (childIndex, child) {
           
            html += '<tr class="text-c list-line" data-id="' + child.id + '" data-imgUrl="' + child.imgUrl + '" data-province="' + child.province + '" data-link="' + child.link + '" >\
		        <td>' + (child.id || '') + '</td>\
		        <td>' + (child.name || '') + '</td>\
		        <td>' + (child.totalNum || '') + '</td>\
		        <td>' + (child.articleNum || '') + '</td>\
		        <td>' + (child.browseNum || '') + '</td>\
		        <td>' + (child.likeNum || '') + '</td>\
		        <td>' + (child.commentNum || '') + '</td>\
		        <td>' + (child.shareNum || '') + '</td>\
		        <td>' + (child.createName || '') + '</td>\
		        <td>' + (child.createTime || '') + '</td>\
		        <td class="f-14">\
		        	<a href="javascript:void(0)" class="bannerDelete malr06 blues" target="">删除话题</a>\
			    </td>\
		    </tr>';
        })
        $('#listCtnWrap').html(html);

    },

	
}

$(function () {

	// 查询商城banner列表
    $('#screeBtn').on('click', function () {
    	if($("#names").val()=="" && $("#beginTime").val()=="" && $("#endTime").val()=="" ){
    		$.Huimodalalert("请至少输入一项查询条件!", 2000);
    		return
    	}else if($("#beginTime").val()!="" && $("#endTime").val()=="" ){
    		$.Huimodalalert("请输入结束时间!", 2000);
    		return
    	}else if($("#beginTime").val()=="" && $("#endTime").val()!="" ){
    		$.Huimodalalert("请输入开始时间!", 2000);
    		return
    	}
    	pageUtil.getBannerList();
        
    })

    // 重置查询列表
    $('#resetBtn').on('click', function () {
        var $wrap = $('#pageSearchForm');
        $wrap.find("#names").val("");
        $wrap.find("#beginTime").val("");
        $wrap.find("#endTime").val("");

//      pageUtil.getBannerList();
    })

    // 商品列表相关事件绑定
    $('#listCtnWrap')
        .on('click', '.bannerDelete', function () {//删除
            var $self = $(this),
                $parent = $self.closest('.list-line'),
                id = $parent.attr('data-id');
			layer.confirm('确认删除此话题？', {
			  btn: ['确定删除','取消'] 
			}, function(){
				$.ajax({
                    // async: false,
                    type: 'post',
                    url: base + 'topic/deleteTopic',
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({ id:id }),
                    success: function (res) {
                        if (res.status == "0") {
	                      	parent.layer.msg("删除成功！");
	                      	window.setTimeout(function() {
	                        	window.location.reload();
	                      	}, 1000);
	                    } else {
	                      	$.Huimodalalert(res.message, 1500);
	                    }
                    }
                });
			}, function(){
			  
			})
            	
        })


    // 新增按钮
    $('#addBtn').on('click', function () {
    	var html = template("adds", {});
        layer.open({
            type: 1,
            title: '创建话题',
            shadeClose: false,
            shade: [0.5, '#000'],
            maxmin: false, //开启最大化最小化按钮
            area: ['95%', '95%'],
            content: html,
            success: function(layero, index) {
            	
            	function addTemp(data){
            		var htl = "";
            		$.each(data, function(index, item) {
            			htl +='<p class="listP">'+(item)+'</p>';
            		});
            		if(htl){
            			$('#lists').show();
            			$('#lists').html(htl);
            		}
            	};
            	/*点击列表*/
            	$("#lists").on("click",".listP",function(e){
            		var $this = $(e.target);
            		$(".searchName").val($this.text());
            	});
            	/*查询列表*/
            	$(".searchName").on("input",function(){
	            	$.get(base + 'topic/searchTopicList', {name:$(".searchName").val()}, function (res) {
			            if (res.status == '0' && res.data) {
			                if (res.data.length) {
			                   addTemp(res.data);
			                }else {
			                    $('#lists').html('');
			                    $.Huimodalalert("查询不到数据！", 2000);
			                }
			            }else {
			                $('#lists').html('');
			                $.Huimodalalert(res.message, 2000);
			            }
			        })
            	});
            	
            	/*确认添加*/
            	$(".submitAdd").on("click", function() {
            		var searchName = $(".searchName").val();
            		if (searchName.replace(/(^s*)|(s*$)/g, "").length >= 0 && searchName != "") {
                    	$.ajax({
		                  	type: "post",
		                  	url: base + "topic/insertTopic",
		                  	processData: false,
		                  	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
		                  	dataType: "json",
		                  	data: JSON.stringify({name:searchName}),
		                  	success: function(res) {
			                    if (res.status == "0") {
			                      	parent.layer.msg("创建成功！");
			                      	window.setTimeout(function() {
			                        	layer.close(index);
			                        	window.location.reload();
			                      	}, 2000);
			                    }else if(res.status == "2"){
			                    	parent.layer.msg(res.message);
			                    } else {
			                      	$.Huimodalalert(res.message, 1500);
			                    }
		                  	}
		                });
                  	} else {
                    	parent.layer.msg("请输入话题名称！");
                  	}
            	})
            }	
        });
    })

    $('body').on('click', function (e) {
        var $target = $(e.target);
		if(!$target.hasClass("searchListWrap") && !$target.hasClass("lists")) {
			$(".lists").hide();
		}
    })

//  $('#screeBtn').trigger('click');
})