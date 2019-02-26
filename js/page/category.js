var category = {
    param: {},
    logSpuData: {
		id:'',//商品id
		before_main: '',//logoimg
		after_pics:[],
	},
    //保存
    save: function(obj){
        var input = $(obj).parent().parent().find("input");
        if($(obj).text() == "保存"){
            if(!input.val()){
                $.Huimodalalert("分类名称不能为空", 2000);
                $(obj).parent().parent().find("input").focus();
                return;
            }else{
                category.param.name = input.val();
                if(input.attr("id")){
                    //编辑
                    category.param.id = input.attr("id");
                    $.post(base+"/goodsAdmin/addOrUpdateCategory.do",category.param,function(data){
                       util.jumpLogin(data);
                        if(data.status == 0){
                            input.attr("id",data.data.catId);
                            $(obj).text("编辑");
                            input.attr("readonly","true");
                        }else{
                            $.Huimodalalert(data.message, 2000);
                        }
                    });
                }else{
                    //新增
                    delete category.param.id;
                    var parent = $(obj).closest(".opt");
                    var saveIndex = $(obj).attr("saveIndex");
                    switch(saveIndex){
                        case "secondSave":
                            var firstId = parent.find(".firstId").attr("id");
                            category.param.firstId = firstId;
                            break;
                        case "thirdSave":
                            var firstId = parent.find(".firstId").attr("id");
                            category.param.firstId = firstId;
                            var secondId = $(obj).closest(".opt-s").find(".secondId").attr("id");
                            category.param.secondId = secondId;
                            break;
                        case "fourSave":
                            var firstId = parent.find(".firstId").attr("id");
                            category.param.firstId = firstId;
                            var secondId = $(obj).closest(".opt-s").find(".secondId").attr("id");
                            category.param.secondId = secondId;
                            var thirdId = $(obj).closest(".opt-t").find(".thirdId").attr("id");
                            category.param.thirdId = thirdId;
                            break;
                    }
                    $.post(base+"/goodsAdmin/addOrUpdateCategory.do",category.param,function(data){
                        util.jumpLogin(data);
                        if(data.status == 0){
                            input.attr("id",data.data.catId);
                            $(obj).text("编辑");
                            input.attr("readonly","true");
                        }else{
                            $.Huimodalalert(data.message, 2000);
                        }
                    });
                }
            }
        }else{
            $(obj).text("保存");
            input.removeAttr("readonly");
            input.focus();
        }
    },

    //分类列表删除
    del: function(obj){
        var input = $(obj).parent().parent().find("input");
        if(!input.val()){
            if($(obj).hasClass("first")){
                $(obj).parent().parent().parent().parent().remove();
            }else{
                $(obj).parent().parent().parent().remove();
            }
        }else{
            var delParam = {id: input.attr("id") || "",status:"0",name:input.val()};
//          $.post(base+"/goodsAdmin/deleteCategory.do",delParam,function(data){//原删除
            $.post(base+"goodsAdmin/addOrUpdateCategory.do",delParam,function(data){
                util.jumpLogin(data);
                if(data.status == 0){
                    if($(obj).hasClass("first")){
                        $(obj).parent().parent().parent().parent().remove();
                    }else{
                        $(obj).parent().parent().parent().remove();
                    }
                }else{
                    $.Huimodalalert(data.message, 2000);
                }
            });
        }
    },
    
    //添加logo
    addLogo:function(id,img){
    	layer.open({
            type: 1,
            title: '添加商品标志',
            skin: 'yourclass',
            shadeClose: true,
            shade: [0.5, '#000'],
            maxmin: false, //开启最大化最小化按钮
            area: ['80%', '350px'],
            content: $("#Hui-article"),
        });
        $("#userId").val(id);
        if(img){
        	$("#before_main").next("label").prepend($('<img style="display: inline-block;width: 100px;height: 100px;" src='+imgPath+img+'>'))
        }
        
    },
    //关联部位
    'addRelevance':function(id){
    	layer.open({
            type: 1,
            title: '关联部位',
            skin: 'yourclass',
            shadeClose: true,
            shade: [0.5, '#000'],
            maxmin: false, //开启最大化最小化按钮
            area: ['80%', '350px'],
            content: $("#relevance-article"),
            end: function () {
                $("#wrap-ul").empty();
            }
        });
        $("#commodityId").val(id);
        $.ajax({
			url: base+"mall/regionList.do?category_id="+id,
			type: "get",
//			dataType: "JSON",
			success: function (data) {
				if (data.status == '0') {
					if(data.data.length){
						$.each(data.data,function(i,item){
							 var checked = item.is_attention==1?'checked':'';
							 var Ll = '<li>'+
                            			'<input type="checkbox" value="'+item.id+'" name="check" '+checked+' /> '+
                            			'<label>'+item.name+'</label>'+
                            		'</li>';
                            	$("#wrap-ul").append(Ll);
						});
							
					}
				} else {
					$.Huimodalalert(data.message, 2000);
				}
			},
			error:function(err){
				layer.closeAll('loading');
				$.Huialert(err.message,1500)
			}
		});
        
    },
    //手术关键词科普资料
    dataDatum:function(id){
    	var goUrl ="categorySpu.html?id="+id;
    	layer.open({
            type: 2,
            title: '手术关键词科普资料',
            skin: 'yourclass',
            shadeClose: true,
            shade: [0.5, '#000'],
            maxmin: false, //开启最大化最小化按钮
            area: ['100%', '100%'],
            content: goUrl,
       	});
        
    },
    
    //保存提交的部位数据
    "commodityData":function(Id,Arr){
    	var formDatas = {};
    		formDatas.category_id =Id;
    		formDatas.list =Arr;
    	$.ajax({
			url: base+"mall/addRc.do",
			type: "POST",
			contentType: 'application/json;charset=utf-8',
			data: JSON.stringify(formDatas),
			dataType: "JSON",
			success: function (data) {
				if (data.status == '0') {
					$.Huimodalalert(data.message, 1000);
					setTimeout(function () {
						var index = parent.layer.getFrameIndex(window.name);
						
						//刷新列表
						window.location.href = window.location.href;
						parent.layer.close(index);
					}, 1500);
				} else {
					$.Huimodalalert(data.message, 2000);
				}
			},
			error:function(err){
				layer.closeAll('loading');
				$.Huialert(err.message,1500)
			}
		});
    	
    },

	//保存logo图片
	'saveSPUData': function () {
		var data = {};
		data.id = $("#userId").val(),//商品id
		data.img = category.logSpuData.before_main;//术前主图片
		layer.load(2);

		var path = base+'case/uploadClassLogo.do';
		$.ajax({
			type: 'POST',
			url: path,
			data: JSON.stringify(data),
			contentType: 'application/json;charset=utf-8',
			success: function (res) {
				if (res.status == '0') {
					$.Huimodalalert(res.message ? res.message :"更新成功！", 1500);
					setTimeout(function () {
						var index = parent.layer.getFrameIndex(window.name);
						
						//刷新列表
						window.location.href = window.location.href;
						parent.layer.close(index);
					}, 1500);

				} else {
					$.Huimodalalert(res.message, 1500);
				}
			},
			complete: function () {
				layer.closeAll('loading');
			}
		});
	},

    //添加一级分类
    addFirst: function(){
        var div = '<div class="opt">' +
            '<div class="opt-f">' +
            '<div class="opt-fcon">' +
            '<div class="opt-fn">' +
            '<span onclick="category.toggle(this)"></span><input type="text" class="firstId" />' +
            '</div>' +
            '<div class="opt-operate text-c"><a href="javascript:" class="tab-A first" onclick="category.del(this)">删除</a><a href="javascript:" class="tab-A edit" onclick="category.save(this)">保存</a></div>' +
            '</div>' +
            '<div class="opt-fsub">' +
            '<a class="opt-add"><span></span><i onclick="category.addSecond(this)">添加二级分类</i></a>' +
            '</div>' +
            '</div>' +
            '</div>';
        $(div).appendTo(".cate-con");
    },

    //添加二级分类
    addSecond: function(obj){
        var text = $(obj).parent().parent().prev().find(".edit").text();
        if(text == "保存"){
            $.Huimodalalert("父级还没有保存", 2000);
            $(obj).parent().parent().prev().find("input").focus();
            return;
        }
        var div = '<div class="opt-s">' +
            '<div class="opt-fcon">' +
            '<div class="opt-sn">' +
            '<span onclick="category.toggle(this)"></span><samp></samp><input type="text" class="secondId" />' +
            '</div>' +
            '<div class="opt-operate text-c"><a href="javascript:" class="tab-A" onclick="category.del(this)">删除</a><a href="javascript:" class="tab-A edit" saveIndex = "fourSave" onclick="category.save(this,\'fourSave\')">保存</a></div>' +
            '</div>' +
            '<div class="opt-ssub">' +
            '<a class="opt-add"><span></span><i onclick="category.addThird(this)">添加三级分类</i></a>' +
            '</div>' +
            '</div>';
        $(div).appendTo($(obj).parent().parent());
    },

    //添加三级分类
    addThird: function(obj){
        var text = $(obj).parent().parent().prev().find(".edit").text();
        if(text == "保存"){
            $(obj).parent().parent().prev().find("input").focus();
            $.Huimodalalert("父级还没有保存", 2000);
            return;
        }
        var div = '<div class="opt-t">' +
            '<div class="opt-fcon">' +
            '<div class="opt-tn">' +
            '<span onclick="category.toggle(this)"></span><samp></samp><input type="text" class="thirdId" />' +
            '</div>' +
            '<div class="opt-operate text-c"><a href="javascript:" class="tab-A" onclick="category.del(this)">删除</a><a href="javascript:" class="tab-A edit" saveIndex = "thirdSave" onclick="category.save(this)">保存</a></div>' +
            '</div>' +
            '<div class="opt-tsub">' +
//          '<a class="opt-add"><span></span><i onclick="category.addFour(this)">添加四级分类</i></a>' +
            '</div>' +
            '</div>';
        $(div).appendTo($(obj).parent().parent());
    },

    //添加四级分类
    addFour: function(obj){
        var text = $(obj).parent().parent().prev().find(".edit").text();
        if(text == "保存"){
            $.Huimodalalert("父级还没有保存", 2000);
            $(obj).parent().parent().prev().find("input").focus();
            return;
        }
        var div = '<div class="opt-ff">' +
            '<div class="opt-fcon">' +
            '<div class="opt-tn">' +
            '<samp></samp><input type="text" class="fourId" />' +
            '</div>' +
            '<div class="opt-operate text-c"><a href="javascript:" class="tab-A" onclick="category.del(this)">删除</a><a href="javascript:" class="tab-A edit" saveIndex = "fourSave" onclick="category.save(this,\'fourSave\')">保存</a></div>' +
            '</div>' +
            '</div>';
        $(div).appendTo($(obj).parent().parent());
    },

    //展开/收起分类
    toggle: function(obj){
        if($(obj).hasClass("opt-up")){
            $(obj).removeClass("opt-up");
            $(obj).parent().parent().next().show();
        }else{
            $(obj).addClass("opt-up");
            $(obj).parent().parent().next().hide();
        }
    },


    //获取数据列表
    requestData: function(){
        $.get(base+"/goodsAdmin/selectAllCategory.do?parentId=0",function(data){
            util.jumpLogin(data);
            if(data.status == 0){
                if(data.data.length){
                    //第一级分类
                    $.each(data.data,function(i,item){
                        var div = '<div class="opt">' +
                            '<div class="opt-f">' +
                            '<div class="opt-fcon">' +
                            '<div class="opt-fn">' +
                            '<span onclick="category.toggle(this)" class="opt-up"></span><input type="text" value="'+item.name+'" class="firstId" id="'+item.id+'" readonly />' +
                            '</div>' +
                            '<div class="opt-operate text-c"><a href="javascript:" class="tab-A first" onclick="category.del(this)">删除</a><a href="javascript:" class="tab-A edit" onclick="category.dataDatum(\''+item.id+'\')">编辑</a><a href="javascript:" class="tab-A" onclick="category.addLogo(\''+item.id+'\',\''+item.img+'\')">上传</a><a href="javascript:" class="tab-A" onclick="category.addRelevance(\''+item.id+'\')">关联</a></div>' +
                            '</div>' +
                            '<div class="opt-fsub hide">' +
                            '<a class="opt-add"><span></span><i onclick="category.addSecond(this)">添加二级分类</i></a>';
                        //第二级分类
                        if(item.hdGoodsCategory.length){
                            $.each(item.hdGoodsCategory,function(j,res1){
//                              console.log(res1);
                                div += '<div class="opt-s">' +
                                    '<div class="opt-fcon">' +
                                    '<div class="opt-sn">' +
                                    '<span onclick="category.toggle(this)" class="opt-up"></span><samp></samp><input type="text" value="'+res1.name+'" class="secondId" id="'+res1.id+'" readonly />' +
                                    '</div>' +
                                    '<div class="opt-operate text-c"><a href="javascript:" class="tab-A" onclick="category.del(this)">删除</a><a href="javascript:" class="tab-A edit" onclick="category.dataDatum(\''+res1.id+'\')">编辑</a><a href="javascript:" class="tab-A" onclick="category.addLogo(\''+res1.id+'\',\''+res1.img+'\')">上传</a></div>' +
                                    '</div>' +
                                    '<div class="opt-ssub hide">' +
                                    '<a class="opt-add"><span></span><i onclick="category.addThird(this)">添加三级分类</i></a>';
                                //第三级分类
                                if(res1.hdGoodsCategory.length){
                                    $.each(res1.hdGoodsCategory,function(k,res2){
                                        div += '<div class="opt-t">' +
                                            '<div class="opt-fcon">' +
                                            '<div class="opt-tn">' +
                                            '<span onclick="category.toggle(this)" class="opt-up"></span><samp></samp><input type="text" value="'+res2.name+'" class="thirdId" id="'+res2.id+'" readonly />' +
                                            '</div>' +
                                            '<div class="opt-operate text-c"><a href="javascript:" class="tab-A" onclick="category.del(this)">删除</a><a href="javascript:" class="tab-A edit" onclick="category.dataDatum(\''+res2.id+'\')">编辑</a><a href="javascript:" class="tab-A" onclick="category.addLogo(\''+res2.id+'\',\''+res2.img+'\')">上传</a></div>' +
                                            '</div>' +
                                            '<div class="opt-tsub hide">';
                                        if(res2.hdGoodsCategory.length){
                                            $.each(res2.hdGoodsCategory,function(l,res3){
                                                div += '<div class="opt-ff">' +
                                                    '<div class="opt-fcon">' +
                                                    '<div class="opt-tn">' +
                                                    '<samp></samp><input type="text" value="'+res3.name+'" class="fourId" id="'+res3.id+'" readonly />' +
                                                    '</div>' +
                                                    '<div class="opt-operate text-c"><a href="javascript:" class="tab-A" onclick="category.del(this)">删除</a><a href="javascript:" class="tab-A edit" onclick="category.dataDatum(\''+res3.id+'\')">编辑</a><a href="javascript:" class="tab-A" onclick="category.addLogo(\''+res3.id+'\',\''+res3.img+'\')">上传</a></div>' +
                                                    '</div>' +
                                                    '</div>';
                                            })
                                            div += '</div></div>';
                                        }else{
                                            div += '</div></div>';
                                        }

                                    });
                                    div += '</div></div>';
                                }else{
                                    div += '</div></div>';
                                }
                            });
                        }
                        div += '</div></div></div>';
                        $(div).appendTo(".cate-con");
                    });
                }
            }else{
                $.Huimodalalert(data.message, 2000);
            }
        });
    }
}

$(function(){
    category.requestData();
    
    //图片
	$("#before_main").on("change",function(){
		getImgEvent($(this));
	});
	function getImgEvent(obj,type){//type传值说明是手术后7张的
		newUploadImg(obj,function(src){
			if(src){
				//$(".layui-layer-shade").remove();
				//$(".layui-layer").remove();
				layer.closeAll('loading');
				obj.attr("data-src",src);
				if(!!type){
					category.logSpuData.after_pics[0] = src;
				}
				obj.next("label").prepend($('<img style="display: inline-block;width: 100px;height: 100px;" src='+imgPath+src+'>'))
			}else{
				$.Huialert("获取图片路径失败",1500);
			}
		});
	};
	
	//提交
	$('.spu-cont .submitBtn').on('click', function () {
		
		if(!$("#before_main").data("src")){
			tip("请上传图片");
			return ;
		}else{
			category.logSpuData.before_main=$("#before_main").data("src");
		}
		category.logSpuData.case_main_id=0;
		category.saveSPUData();
	});
	
	//部位选择
	$('.spu-conts .commodityBtn').on('click', function () {
		var codeId = $("#commodityId").val();
		var arr = [];
		if(!$("#wrap-ul").length){
			tip("没有可保存的部位选项！");
			return ;
		}
		 $('#wrap-ul input[name="check"]:checked').each(function(i){
            arr.push($(this).val());
        });
		category.commodityData(codeId,arr);
	});
	
	//提示窗
	function tip(msg){
		$.Huimodalalert(msg, 1500);
	}
	
});