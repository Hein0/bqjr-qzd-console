var detParam = {},
	param = {};
var noData = '<tr><td colspan="8" style="text-align:center;">暂无相关数据！</td></tr>';	
var withdraw = {
	orderStatus:'',//选择状态
	provinceList: [],//城市列表数据
	init: function () {
		orderStatus = '1';
		
		this.size = $('#selectPageSize :checked').text();
		this.pageing = {
		    pageNum: 1,
		    pageSize: 20
		};
		this.getAreaData();
//		this.search();
		this.bindEvents();
	},
	
	//初始化城市数据
	getAreaData:function(){
		// 城市选择弹窗初始化
	    CacheData.getData('getArea', function (data) {
	        var html = ' <option value="">请选择省</option>';
	        withdraw.provinceList = data;
	        $.each(data, function (index, item) {
	        	html += '<option value="' + item.province + '">' + item.province + '</option>'
	        });
	        $('#province').html(html);
	    })
	},
	// 设置城市信息(添加和列表通用)
    setSelectCitType: function (index,$Dom) {
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
	//初始化事件
	bindEvents: function () {
		var self = this;
		$(".tableAll").show();
		//点击选项卡
		$('.btn-group span.btn').bind('click',function (ev) {
			var $target = $(this);
			var statu = $target.attr('val');
			var div = '';
			if(statu=="1"){
				$(".famousDoctor").show();
                $(".famousCourtyard").hide();
                $(".tableAll").show().siblings('.tableTwo').hide();
			}else{
				$(".famousCourtyard").show();
                $(".famousDoctor").hide();
                $(".tableTwo").show().siblings('.tableAll').hide();
			}
			util.reset();//清空筛选
			$target.addClass('btn-primary');
			$target.siblings().removeClass('btn-primary').not(".todayText").addClass('btn-default');
			orderStatus = statu

//			self.search()
		});
	
	    //列表选择省	
		$("#province").on("change",function(){
			withdraw.setSelectCitType($(this).get(0).selectedIndex-1,$("#city"));
		})
		
		//筛选
		$('#screeBtn').bind('click',function (ev) {
			self.pageing.pageNum = 1;
			$('#pagination').html('');
			if($("#province").val()!=""){
				self.search()	
			}
//			self.search()
		});
		//重置
		$('#resetBtn').bind('click',function (ev) {
			var $wrap = $('#pageSearchForm');
			$wrap.find("#province").val("").trigger("change");
//			util.reset();
		});
		
		// 商品列表相关事件绑定
	    $('.listCtnWrap')
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
	            	$.get(base + 'redpacket/famousHdOrder?id='+id+"&order="+order, {}, function (res) {
			            if (res.status == '0') {
			                $.Huimodalalert(res.message, 2000); 
			                $('#screeBtn').trigger('click');
			            } else {
			                $.Huimodalalert(res.message, 2000);
			            }
			        })	
	            }
	        })
	        .on('click', '.Delete', function () {//删除
	            var $self = $(this),
	                $parent = $self.closest('.list-line'),
	                id = $parent.attr('data-id');
	            	$.get(base + 'redpacket/famousHdDel?id='+id, {}, function (res) {
			            if (res.status == '0') {
			                $.Huimodalalert(res.message, 2000); 
			                $('#screeBtn').trigger('click');
			            } else {
			                $.Huimodalalert(res.message, 2000);
			            }
			        })
	        })
		// 添加名医按钮
	    $('#addBtnDoctor').on('click', function () {
	        layer.open({
	            type: 2,
	            title: '添加名医',
	            shadeClose: true,
	            shade: [0.5, '#000'],
	            maxmin: false, //开启最大化最小化按钮
	            area: ['60%', '40%'],
	            content: 'famousAdd.html?type='+1+"&dom="+"addBtnDoctor",
	        });
	    })
	    
	    // 添加名院按钮
	    $('#addBtnCourtyard').on('click', function () {
	        layer.open({
	            type: 2,
	            title: '添加名院',
	            shadeClose: true,
	            shade: [0.5, '#000'],
	            maxmin: false, //开启最大化最小化按钮
	            area: ['60%', '40%'],
	            content: 'famousAdd.html?type='+2+"&dom="+"addBtnCourtyard",
	        });
	    })

	},
	
	//分页初始化
	pageInit: function(){
		var self = this;
		setPagination({
		    elem: $('#pagination'),
		    totalPage: 100,
		    curr: 1,
		    callback: function(obj) {
		        console.log(obj)
		        self.pageing.pageSize = $('#selectPageSize :checked').text()
		        self.scree(obj.curr)
		    }
		});
	},
	//列表搜索
    search: function(){
        param = util.serialize();
        detParam = param;
        this.queryList();
    },

	//发送请求获取数据
	queryList: function (obj) {
		var self = this;
        detParam.pageNum = (obj && obj.curr) || 1 // 默认第1页
        detParam.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
        detParam.type = orderStatus;
        if(orderStatus=="1"){  //名医数据
        	$.get(base + 'redpacket/famousHdList',detParam,function (res) {
				if (res.status == 0 && res.data) {
//					$(".tableAll").show().siblings('.tableTwo').hide();
					withdraw.rendersTmpl($('#tableAllList'),res.data)
//					$("#tableAllList").empty().append($('#allList').tmpl(res.data));
					setPagination({
				       	elem: $('#pagination'),
				       	totalCount: res.dataCount,
				       	curr: detParam.pageNum,
					   	callback: function (obj) {
		                    self.queryList(obj);
		                }
				   	});
				}else{
					$.Huimodalalert("查询不到数据！", 2000);
					$("#tableAllList").empty().append(noData)
				}
			});
        	
        }else{//名院数据
			$.get(base + "redpacket/famousHdList",detParam, function(data) {
		        if(data.status == 0 && data.data){
//					$(".tableTwo").show().siblings('.tableAll').hide();
					withdraw.rendersTmpl($('#tableTwoList'),data.data)
//					$("#tableTwoList").empty().append($('#twoList').tmpl(data.data));
					setPagination({
				       	elem: $('#pagination'),
				       	totalCount: data.dataCount,
				       	curr: detParam.pageNum,
					   	callback: function (obj) {
		                    self.queryList(obj);
		                }
				   	});
			   	}else{
			   		$.Huimodalalert("查询不到数据！", 2000);
					$("#tableTwoList").empty().append(noData)
				}
		    });
		}
	},
	
	//渲染模板
	rendersTmpl:function($wrap,data){
        var html = '';
        $.each(data, function (childIndex, child) {
            html += '<tr class="text-c list-line" data-id="' + child.id + '" >\
		        <td>' + (child.name || '') + '</td>\
		        <td>' + (child.number || '') + '</td>\
		        <td><input type="tel" class="paixu" value="' + (child.order || '') + '" disabled/></td>\
		        <td class="f-14">\
		        	<a href="javascript:void(0)" class="Sort malr06 blues" target="">排序</a>\
		        	<a href="javascript:void(0)" class="Delete malr06 blues" target="">删除</a>\
			    </td>\
		    </tr>';
        })
        $wrap.html(html);
	}
	
};
withdraw.init()