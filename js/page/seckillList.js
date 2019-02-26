 var seckillList = {
	init:function(){
		this.getActiveList();//加载活动列表
		this.bindEvents();//绑定事件
		this.activityId=null;//记录活动的id
		this.operation = "";//通过这个来判断点击确定时候要操作的事件

	},
	bindEvents:function(){
		var _self = this;
		//操作
		$('#activeList').on('click','.enabled',function(){
			//启用
            _self.operation = $(this).html();
            _self.activityId = $(this).parents('tr').attr('activityId');
			if(_self.operation == '停用'){
                $('.Operationtip').find('.content').html('确定停用该活动么？')
                $('.shadeboxseckill').show();
                $('.Operationtip').show()
			}else{
                $('.Operationtip').find('.content').html('确定启用该活动么？')
                $('.shadeboxseckill').show();
                $('.Operationtip').show()
			}
		}).on('click','.deletelist',function(){
            //删除
            _self.operation = $(this).html()
            _self.activityId = $(this).parents('tr').attr('activityId');
			$('.Operationtip').find('.content').html('确定删除该活动么？')
			$('.shadeboxseckill').show();
			$('.Operationtip').show()
		}).on('click','.lookmes',function(){
			//查看
            _self.activityId = $(this).parents('tr').attr('activityId');
            _self.lookActive(_self.activityId,0);
			$('.shadeboxseckill').show();
			$('.lookActiveMes').show();
		}).on('click','.decopy',function(){
            //复制
            _self.operation = $(this).html()
            _self.activityId = $(this).parents('tr').attr('activityId');
            $('.Operationtip').find('.content').html('确定复制该活动么？')
            $('.shadeboxseckill').show();
            $('.Operationtip').show()
        })
		//点击筛选按钮
		$('.button-wrap').on('click',function(){
            _self.getActiveList()
		})

		//关闭弹窗
		$('.fix_tips_close').on('click','a',function(){
			$('.shadeboxseckill').hide();
			$('.lookActiveMes').hide();
		})
		
		//确认与取消
		$('.Operationtip').on('click','a',function(){
			$('.shadeboxseckill').hide();
			$('.Operationtip').hide()
		}).on('click','.OperationBtn span:nth-child(1)',function(){
			switch(_self.operation){
				case '启用':
					_self.startActive(_self.activityId);
                	break;
                case '停用':
					_self.stopActive(_self.activityId);
                    break;
                case '删除':
                    _self.deleteActive(_self.activityId);
                    break;
                case '复制':
                    _self.decopyActive(_self.activityId);
                    break;
			};
			$('.shadeboxseckill').hide();
			$('.Operationtip').hide();
		}).on('click','.OperationBtn span:nth-child(2)',function(){
			$('.shadeboxseckill').hide();
			$('.Operationtip').hide();
		})
	},
	//加载活动列表

	getActiveList:function(obj){
	    var _self = this;
        var $wrap = $('#pageSearchForm'),
            data = {}
        data.theme = $wrap.find('.s-name').val()
        data.createTimeStart = $wrap.find('#createdBeginTime').val()
        data.status = $wrap.find('.s-status').val()
        data.beginTimeStr = $wrap.find('#overBeginTime').val()
        data.endTimeStr = $wrap.find('#overEndTime').val()
        data.pageNum = (obj && obj.curr) || 1; // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20; // 默认一页20条数据
        $.get(base+'seckill/activity', data , function(res) {
        	if(res.status == 0){            
                $('#activeList tr').not($('#activeList tr').eq(0)).remove();
        		if(res.data.length !=0){
                    for(var i = 0 ; i < res.data.length ; i ++){
                        var Status = null;
                        if(res.data[i].status == 1){
                            Status = '未开始'
                            var Td2 = $('<td class="Operation">'+
                                '<a href=seckill.html?activityId='+ res.data[i].activityId + '><span class="compile">编辑</span></a>'+
                                '<span class="enabled">'+ [res.data[i].isUse == 2 ? '停用' : '启用']+'</span>'+
                                '<span class="deletelist">删除</span>'+
                                '<span class="lookmes">查看</span>'+
                                '</td>');
                        }else if(res.data[i].status == 2){
                            Status = '进行中'
                            var Td2 = $('<td class="Operation">'+
                                '<a href=seckill.html?activityId='+ res.data[i].activityId + '><span class="compile">编辑</span></a>'+
                                '<span class="enabled">'+ [res.data[i].isUse == 2 ? '停用' : '启用']+'</span>'+
                                '<span class="lookmes">查看</span>'+
                                '</td>');
                        }else if(res.data[i].status == 3){
                            Status = '已停用'
                            var Td2 = $('<td class="Operation">'+
                                '<span class="decopy">复制</span>'+
                                '<span class="enabled">'+ [res.data[i].isUse == 2 ? '停用' : '启用']+'</span>'+
                                '<span class="lookmes">查看</span>'+
                                '</td>');
                        }else if(res.data[i].status == 4){
                            Status = '已结束'
                            var Td2 = $('<td class="Operation">'+
                                '<span class="decopy">复制</span>'+
                                '<span class="lookmes">查看</span>'+
                                '</td>');
                        }
                        var Tr = $('<tr activityId='+ res.data[i].activityId+'></tr>');
                        var Td1 = $('<td>'+res.data[i].theme+'</td>'+
                            '<td>'+res.data[i].createTime+'</td>'+
                            '<td>'+res.data[i].beginTime + '--' + res.data[i].endTime+'</td>'+
                            '<td>'+Status+'</td>');
                        Tr.append(Td1);
                        Tr.append(Td2);
                        $('#activeList').find('table').append(Tr)
                    }
                    // 设置分页
                    setPagination({
                        elem: $('#paginationList'),
                        totalCount: res.dataCount,
                        curr: data['pageNum'],
                        callback: function(obj) {
                            _self.getActiveList(obj);
                        }
                    });
				}else{
                    $('#activeList').find('table').append('<tr><td colspan="5" style="color: red;">暂无数据...</td></tr>')
				}
			}

		})
	},
	//启用
	startActive:function(activitId){
        var _self = this;
        $.post(base+'seckill/activity/'+activitId+'/enable?_method=put',function(res){
            if(res.status == 0){
                _self.getActiveList(0)
            }else {
                $.Huimodalalert(res.message, 2000);
            }
        })
	},
	//停用
	stopActive:function(activitId){
        var _self = this;
		$.post(base+'seckill/activity/'+activitId+'/disable?_method=put',function(res){
            if(res.status == 0){
                _self.getActiveList(0)
            }else {
                $.Huimodalalert("查询不到数据", 2000);
            }
		})
	},
	//删除活动
    deleteActive:function(activitId){
        var _self = this;
        $.post(base+'seckill/activity/'+activitId+'?_method=delete',function(res){
            if(res.status == 0){
                _self.getActiveList();
            }
        })
    },
    //复制活动
    decopyActive:function(activitId){
        var _self = this;       
        $.post(base+'seckill/activity/'+activitId+'/copy',function(res){          
            if(res.status == '0'){
                _self.getActiveList()
                // var Status = null;
                // if(res.data.status == 1){
                //     Status = '未开始'                  
                // }else if(res.data.status == 2){
                //     Status = '进行中'                   
                // }else if(res.data.status == 3){
                //     Status = '已停用'                  
                // }else if(res.data.status == 4){
                //     Status = '已结束'                  
                // }
                // var Td2 = $('<td class="Operation">'+
                //     '<a href=seckill.html?activityId='+ res.data.activityId + '><span class="compile">编辑</span></a>'+
                //     '<span class="enabled">'+ [res.data.isUse == 2 ? '停用' : '启用']+'</span>'+
                //     '<span class="lookmes">查看</span>'+
                //     '</td>');
                // var Tr = $('<tr activityId='+ res.data.activityId+'></tr>');
                // var Td1 = $('<td>'+res.data.theme+'</td>'+
                //     '<td>'+res.data.createTime+'</td>'+
                //     '<td>'+res.data.beginTime + '--' + res.data.endTime+'</td>'+
                //     '<td>'+Status+'</td>');
                // Tr.append(Td1);
                // Tr.append(Td2);
                // $('#activeList').find('table').find('tr').eq(0).after(Tr)
            }            
        })
        //var Tr = $('<tr></tr>')
    },
    //查看活动
    lookActive:function (activitId,obj) {
        var _self = this;
        var data = {}
        data.pageNum = (obj && obj.curr) || 1; // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20; // 默认一页20条数据
        $.get(base+'seckill/activity/'+activitId,data,function(res){           
            if(res.data && res.data.freeProductInfos){
                $('#lookactivelist tr').not($('#lookactivelist tr').eq(0)).remove();              
                if(res.data.freeProductInfos.length){
                    for (var i = 0 ; i < res.data.freeProductInfos.length ; i++){
                        var Tr1 = $('<tr>'+
                            '<td>'+res.data.freeProductInfos[i].skuName+'</td>'+
                            '<td>'+res.data.freeProductInfos[i].sn+'</td></tr>')
                        var Td0 = $('<td></td> ');
                        for(var j = 0 ; j < res.data.freeinterestActivityRules.length ; j++){
                            Td0.append(res.data.freeinterestActivityRules[j].itemId+"期"+JSON.parse(res.data.freeinterestActivityRules[j].itemValue).discount+"折,")
                        }
                        Tr1.append(Td0);
                        var Td1 = $('<td>'+res.data.freeProductInfos[i].clientPrice+'</td>'+
                            '<td>'+res.data.freeProductInfos[i].marketPrice+'</td>'+
                            '<td>'+res.data.freeProductInfos[i].activityPrice+'</td>'+
                            '<td>'+res.data.freeProductInfos[i].seckillPrice+'</td>'+
                            '<td>'+res.data.freeProductInfos[i].perLimitCount+'</td>')
                        Tr1.append(Td1);
                        $('#lookactivelist').append(Tr1);
                    }
                    setPagination({
                        elem: $('#lookactive'),
                        totalCount: res.dataCount,
                        curr: data['pageNum'],
                        callback: function(obj) {
                            _self.lookActive(this.activitId,obj);
                        }
                    });
                }
             }
        })
    }
}
seckillList.init();