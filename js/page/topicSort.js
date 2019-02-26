
var pageUtil = {
    // 页面缓存
    'cache': {},
    'role': {},//用户角色
    'provinceList': [],
    
    // 获取数据列表
    getBannerList: function () {
        $.get(base + 'topic/findTopicSeq', {}, function (res) {
            if (res.status == '0' && res.data) {
                if (res.data.length) {
                	res.data.imgPath = imgPath;
                    pageUtil.cache.listCache = res.data;
                    pageUtil.rendershopSku(res.data);
                }else {
                    $('#listCtnWrap').html('');
                    $.Huimodalalert("查询不到数据！", 2000);
                }

            }else {
                $('#listCtnWrap').html('');
                $.Huimodalalert(res.message, 2000);
            }
        })
    },
    // 渲染数据列表
    rendershopSku: function (data) {
        var html = '',
            obj = null,
            category = '';
        $.each(data, function (childIndex, child) {
           
            html += '<tr class="text-c list-line" data-id="' + child.id + '" data-imgUrl="' + child.imgUrl + '" data-province="' + child.province + '" data-link="' + child.link + '" >\
		        <td>' + (childIndex+1) + '</td>\
		        <td><input type="tel" class="paixu" value="' + (child.seq || '') + '"/></td>\
		        <td>' + (child.name || '') + '</td>\
		        <td>' + (child.articleNum || '') + '</td>\
		        <td>' + (child.totalNum || '') + '</td>\
		        <td class="f-14">\
		        	<a href="javascript:void(0)" class="bannerDelete malr06 blues" target="">删除排序</a>\
			    </td>\
		    </tr>';
        })
        $('#listCtnWrap').html(html);
    },
}

$(function () {
	
	pageUtil.getBannerList();

    // 商品列表相关事件绑定
    $('#listCtnWrap')
        .on('click', '.bannerDelete', function () {//删除
            var $self = $(this),
                $parent = $self.closest('.list-line'),
                id = $parent.attr('data-id');
			$.ajax({
                // async: false,
                type: 'post',
                url: base + 'topic/deleteTopicSeq',
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify({ id:id }),
                success: function (res) {
                    if (res.status == "0") {
                    	$.Huimodalalert("删除成功！", 1500);
                      	window.setTimeout(function() {
                        	window.location.reload();
                      	}, 2000);
                    } else {
                      	$.Huimodalalert(res.message, 1500);
                    }
                }
            });
            	
        })
        .on('blur', '.paixu', function () {//排序失去焦点触发
            var $self = $(this),
            $parent = $self.closest('.list-line'),
            id = $parent.attr('data-id'),
            order = $self.val();
            if(order == ""){
            	$.Huimodalalert("排序不能为空", 2000); 
            	return 
            }else{
            	$.ajax({
	                // async: false,
	                type: 'post',
	                url: base + 'topic/saveTopicSeq',
	                contentType: "application/json;charset=utf-8",
	                data: JSON.stringify({ id: id,seq: order }),
	                success: function (res) {
	                    if (res.status == "0") {
	                    	$.Huimodalalert(res.message, 1000);
	                      	window.setTimeout(function() {
	                        	window.location.reload();
	                      	}, 2000);
	                    } else {
	                      	$.Huimodalalert(res.message, 1500);
	                    }
	                }
	            });
            		
            }
        	
        })


    // 新增按钮
    $('#addBtn').on('click', function () {
    	var html = template("adds", {});
        layer.open({
            type: 1,
            title: '创建话题排序',
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
                    	$.get(base + 'topic/addConfirm', {name:searchName}, function (res) {
				            if (res.status == '0' && res.data) {
		                        layer.close(index);
		                        addTr(res.data);
				            }else if(res.status == "2"){
			                    parent.layer.msg(res.message);
			                }else {
				                $('#listCtnWrap').html('');
				                $.Huimodalalert(res.message, 2000);
				            }
				        })
                  	} else {
                    	parent.layer.msg("请输入话题名称！");
                  	}
            	})
            }	
        });
    })
    
    /*向列表添加tr*/
    function addTr(data){
   		var htl= '<tr class="text-c list-line" data-id="' + data.id + '" >\
		        <td></td>\
		        <td><input type="number" class="paixu" min="1" value="' + (data.seq || '') + '"/></td>\
		        <td>' + (data.name || '') + '</td>\
		        <td>' + (data.articleNum || '') + '</td>\
		        <td>' + (data.totalNum) + '</td>\
		        <td class="f-14">\
		        	<a href="javascript:void(0)" class="bannerDelete malr06 blues" target="">删除排序</a>\
			    </td>\
		    </tr>';
		$("#listCtnWrap").prepend(htl);    
   	};

    $('body').on('click', function (e) {
        var $target = $(e.target);
		if(!$target.hasClass("searchListWrap") && !$target.hasClass("lists")) {
			$(".lists").hide();
		}
    })

})