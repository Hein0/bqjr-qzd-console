
var pageUtil = {
    cache: {},// 页面缓存
    role: {},//用户角色
    compileCache:{},//编辑时拿到的数据
    isTrue:true,//控制开关
    // 获取数据列表
    getBannerList: function () {
        $.get(base + 'article/findArticleSeq', {}, function (res) {
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
		        <td><input type="number" class="paixu" min="1" value="' + (child.seq || '') + '"/></td>\
		        <td>' + (child.title || '') + '</td>\
		        <td>' + (child.mediaType ==1 ? "图片 ":"视频") + '</td>\
		         <td>' + (child.topicName || '') + '</td>\
		        <td>' + (child.totalNum) + '</td>\
		        <td class="f-14">\
		        	<a href="javascript:void(0)" class="deleList malr06 blues" target="">删除排序</a>\
		        	<a href="javascript:void(0)" class="compile malr06 blues mls" target="">编辑</a>\
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
        .on('click', '.deleList', function () {//删除
            var $self = $(this),
                $parent = $self.closest('.list-line'),
                id = $parent.attr('data-id');
			$.ajax({
                // async: false,
                type: 'post',
                url: base + 'article/editArticleSeq',
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
        .on('click', '.compile', function () {//编辑
            var $self = $(this),
                $parent = $self.closest('.list-line'),
                id = $parent.attr('data-id');
			$.get(base + "article/findArticleDetail", {id:id}, function(jsons) {
				var result = typeof jsonData;
					if(result == "string") {
						jsons = JSON.parse(jsons);
					}
					if(jsons.status == "0") {
						pageUtil.compileCache = jsons.data;
						var html = template("compile", jsons.data);
				        layer.open({
				            type: 1,
				            title: '编辑帖子',
				            shadeClose: false,
				            shade: [0.5, '#000'],
				            maxmin: false, //开启最大化最小化按钮
				            area: ['95%', '95%'],
				            content: html,
				            success: function(layero, index) {
				            	//编辑帖子----渲染图片和视频
				            	let domTemp = ".searchWrapImg";
				            	let domUp = ".upImgVid";
				            	pageUtil.compileCache.urls && pageUtil.compileCache.urls.forEach(function(item, index) {
									if(pageUtil.compileCache.mediaType==1) {
										if(pageUtil.compileCache.urls.length==5){
						        			$(domUp).hide();//隐藏上传
						        		}
										if(item.indexOf("http")>-1){//视频或者图片自带域名
											$(domTemp).prepend('<div class="loadpic-wrap"><div class="loadpic"><img style="display: inline-block;width: 100%;height: 100%;" src=' + item + "><span data-srcs="+item+" class='deletes' >x</span></div></div>");                                    
										}else{
											$(domTemp).prepend('<div class="loadpic-wrap"><div class="loadpic"><img style="display: inline-block;width: 100%;height: 100%;" src=' + imgPath + item + "><span data-srcs="+item+" class='deletes' >x</span></div></div>");
										}
									}else if(pageUtil.compileCache.mediaType==2){
										if(pageUtil.compileCache.urls.length>0 && pageUtil.compileCache.urls.titlePage!=""){
											$(domUp).hide();//是视频就隐藏上传功能
										}
										if(item.indexOf("http")>-1){//视频或者图片自带域名
											$(domTemp).prepend('<div class="loadpic-wrap"><div class="loadpic"><video style="display: inline-block;width: 100%;height: 100%;" src=' +item + "></video><span data-srcs="+item+" class='deletes'>x</span></div></div>");                                    
										}else{
											$(domTemp).prepend('<div class="loadpic-wrap"><div class="loadpic"><video style="display: inline-block;width: 100%;height: 100%;" src=' + imgPath + item + "></video><span data-srcs="+item+" class='deletes'>x</span></div></div>");
										}
										
									}
								});
								//编辑帖子----添加视频封面
								if(pageUtil.compileCache.titlePage!=undefined && pageUtil.compileCache.titlePage!=""){
									if(pageUtil.compileCache.titlePage.indexOf("http")>-1){//视频或者图片自带域名
										$(domTemp).append('<div class="loadpic-wrap titlePage"><div class="loadpic"><img style="display: inline-block;width: 100%;height: 100%;" src=' +pageUtil.compileCache.titlePage + "><span data-srcs="+pageUtil.compileCache.titlePage+" class='deletes' >x</span></div></div>");                                    
									}else{
										$(domTemp).append('<div class="loadpic-wrap titlePage"><div class="loadpic"><img style="display: inline-block;width: 100%;height: 100%;" src=' + imgPath + pageUtil.compileCache.titlePage + "><span data-srcs="+pageUtil.compileCache.titlePage+" class='deletes' >x</span></div></div>");
									}
								}
				            	//编辑帖子----打开搜索列表
								$(".clickInpu").on("click",function(){
									$.get(base + "article/findRecomTopicList", {}, function(jsonData) {
										var result = typeof jsonData;
										if(result == "string") {
											jsonData = JSON.parse(jsonData);
										}
										if(jsonData.status == "0") {
											jsonData.data.topics = pageUtil.compileCache.topics;//已经选的回显
											var search = template("amendSearchList", jsonData.data);
											layer.open({
								                type: 1,
								                title: "搜索列表",
								                shadeClose: false,
								                shade: [0.5, "#000"],
								                maxmin: false, //开启最大化最小化按钮
								                area: ["95%", "95%"],
								                content: search,
								                success:function(){
								                	//编辑帖子----查询列表模板
								                	function addTemp(data){
									            		var htl = "";
									            		$.each(data, function(index, item) {
									            			htl +='<p class="listP2" data-id="'+item.id+'">'+(item.name)+'</p>';
									            		});
									            		if(htl){//如果有就显示
									            			$('#lists2').show();
									            			$('#lists2').html(htl);
									            		}
									            	};
									            	/*编辑帖子----话题搜索里的新建话题*/
									            	$(".addTopic").on("click", function() {
									            		var searchTopic = $(".searchTopic").val();
									            		if (searchTopic.replace(/(^s*)|(s*$)/g, "").length >= 0 && searchTopic != "") {
									                    	$.ajax({
											                  	type: "post",
											                  	url: base + "topic/insertTopic",
											                  	processData: false,
											                  	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
											                  	dataType: "json",
											                  	data: JSON.stringify({name:searchTopic}),
											                  	success: function(res) {
												                    if (res.status == "0") {
												                    	var data = {id:res.data,name:$(".searchTopic").val()};
												                      	addLiTemp(data);
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
									            	});
									            	/*编辑帖子----点击搜索出来的列表*/
									            	$("#lists2").on("click",".listP2",function(e){
									            		var $this = $(e.target);
									            		var obj = {id:$this.attr("data-id"),name:$this.text()};
									            		addLiTemp(obj);
									            	});
									            	//编辑帖子----点击推荐数据的列表 
									            	$(".clickUl").on("click","li",function(e){
									            		var $_thi = $(e.target);
									            		var objs = {id:$_thi.attr("data-id"),name:$_thi.text()};
									            		addLiTemp(objs);
									            	});
									            	//编辑帖子----删除选中已经选中的话题
									            	$(".definUl").on("click","li",function(e){
									            		var $self = $(e.target);
														var id = $self.attr("data-id");
														var name = $self.text();
														for(var i=0;i<pageUtil.compileCache.topics.length;i++){
															if( id == pageUtil.compileCache.topics[i].id ){
													        	$self.remove();
													        	pageUtil.compileCache.topics.splice(i,1);//删除json对象
													        	pageUtil.compileCache.topicName.splice($.inArray(name,pageUtil.compileCache.topicName),1);//删除数组的某个
													        }
														}
				
									            	});
								                	/*编辑帖子----查询列表*/
									            	$(".searchTopic").on("input",function(){
										            	$.get(base + 'article/searchAllTopicList', {name:$(".searchTopic").val()}, function (res) {
												            if (res.status == '0' && res.data) {
												                if (res.data.length) {
												                    addTemp(res.data);
												                }else {
												                    $('#lists2').html('');
												                    $.Huimodalalert("查询不到数据！", 2000);
												                }
												            }else {
												                $('#lists2').html('');
												                $.Huimodalalert(res.message, 2000);
												            }
												        })
									            	});
								                	
								                }
								            })
										} else {
											$.Huimodalalert(jsonData.message, 1500);
										}
									});
								            
								});
				            	/*编辑帖子----上传图片*/
							    $("#uploadVideo").on("change", function() {
									getImgEvent($(this),".upImgVid");
								});
								/*编辑帖子----删除图片或者视频*/
							    $(".searchWrapImg").on("click",".deletes", function(e) {
									var $self = $(e.target);
									var secs = $self.attr("data-srcs");
									var $part = $self.parents(".loadpic-wrap");
									if($part.hasClass("titlePage")){
										$part.remove();//移除框
										pageUtil.compileCache.titlePage = "";
										if(pageUtil.compileCache.urls.length<=0 && pageUtil.compileCache.titlePage==""){
											pageUtil.compileCache.mediaType = "";
									        $(".upImgVid input").attr("accept","image/*;video/*");
									        $(".upImgVid").show();//删除图片后显示上传功能
										}else if(pageUtil.compileCache.urls.length<=0 && pageUtil.compileCache.titlePage!=""){
											$(".upImgVid input").attr("accept","video/*");
											$(".upImgVid").show();//删除图片后显示上传功能
										}else if(pageUtil.compileCache.urls.length>0 && pageUtil.compileCache.titlePage==""){
											$(".upImgVid input").attr("accept","image/jpg,image/jpeg,image/png");
											$(".upImgVid").show();//删除图片后显示上传功能
										}
									}else{
										$.each(pageUtil.compileCache.urls,function(index,value){
									        if(value == secs ){
									        	$part.remove();//移除框
									        	pageUtil.compileCache.urls.splice($.inArray(secs,pageUtil.compileCache.urls),1);
									        	if(pageUtil.compileCache.mediaType==1){//图片
									        		if(pageUtil.compileCache.urls.length<=0){
									        			pageUtil.compileCache.mediaType = "";
									        			$(".upImgVid input").attr("accept","image/*;video/*");
									        		}else if(pageUtil.compileCache.urls.length<5){
									        			$(".upImgVid").show();//删除图片后后显示上传功能
									        		}
									        	}else if(pageUtil.compileCache.mediaType==2){//视频    
									        		if(pageUtil.compileCache.urls.length<=0 && pageUtil.compileCache.titlePage==""){
														pageUtil.compileCache.mediaType = "";
												        $(".upImgVid input").attr("accept","image/*;video/*");
												        $(".upImgVid").show();//删除图片后显示上传功能
													}else if(pageUtil.compileCache.urls.length<=0 && pageUtil.compileCache.titlePage!=""){
														$(".upImgVid input").attr("accept","video/*");
														$(".upImgVid").show();//删除图片后显示上传功能
													}else if(pageUtil.compileCache.urls.length>0 && pageUtil.compileCache.titlePage==""){
														$(".upImgVid input").attr("accept","image/jpg,image/jpeg,image/png");
														$(".upImgVid").show();//删除图片后显示上传功能
													}
									        	}
									        }
									    });
									}    
								});
								///编辑帖子----发布
				            	$(".submitBtns").on("click", function() {
				            		var infos = {};
					            		if(pageUtil.compileCache.mediaType=="2"){
					            			infos.titlePage = pageUtil.compileCache.titlePage;	
					            		}
				            			infos.id = pageUtil.compileCache.id; 
				            			infos.title = $("#titles").val();
				            			infos.topics = pageUtil.compileCache.topics;
				            			infos.urls = pageUtil.compileCache.urls;
				            			infos.mediaType = pageUtil.compileCache.mediaType;
				            			infos.content = $("#contents").val();
				            		if (pageUtil.compileCache.topics.length>0) {
				            			if(pageUtil.compileCache.mediaType=="2"&& pageUtil.compileCache.titlePage==""){
				            				parent.layer.msg("请添加视频封面");
					            			return
					            		}
				            			if (pageUtil.isTrue) {
            								pageUtil.isTrue = false;
					                    	$.ajax({
							                  	type: "post",
							                  	url: base + "article/editArticle",
							                  	processData: false,
							                  	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
							                  	dataType: "json",
							                  	data: JSON.stringify(infos),
							                  	success: function(res) {
								                    if (res.status == "0") {
								                      	parent.layer.msg("发布成功！");
								                      	window.setTimeout(function() {
								                        	layer.close(index);
								                        	window.location.reload();
								                      	}, 2000);
								                    } else {
								                      	parent.layer.msg(res.message);
								                    }
							                  	},
							                  	complete: function() {
													pageUtil.isTrue = true;
													layer.closeAll("loading");
												}
							                });
							            }    
				                  	} else {
				                    	parent.layer.msg("请添加话题！");
				                  	}
				            	});
				            }	
				        });
					}
			});//请求结束
		    	
    		
            	
        })
        .on('blur', '.paixu', function () {//排序失去焦点触发
            var $self = $(this),
            $parent = $self.closest('.list-line'),
            id = $parent.attr('data-id'),
            order = $self.val();
            if(order != ""){
            	$.ajax({
	                // async: false,
	                type: 'post',
	                url: base + 'article/editArticleSeq',
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
    ////编辑--------上传图片  或视频
    function getImgEvent(obj, pare, type) {//当前元素,父级,类型不传就单个,传就是多个
		newUploadImg(obj, function(src,typ) {//返回的是什么类型
			console.log(typ);
			if(src) {
				layer.closeAll("loading");
				if(typ.indexOf("video")>-1) {
					obj.parents(pare).before($('<div class="loadpic-wrap"><div class="loadpic"><video style="display: inline-block;width: 100%;height: 100%;" src='+ src + "></video><span data-srcs="+src+" class='deletes'>x</span></div></div>" ));
					obj.attr("accept","image/jpg,image/jpeg,image/png");//改变上传属性
					pageUtil.compileCache.urls = [];
					pageUtil.compileCache.mediaType = 2;//视频
					pageUtil.compileCache.urls.push(src);
					if(pageUtil.compileCache.urls.length>0 && pageUtil.compileCache.titlePage!=""){
						obj.parents(pare).hide();
					}
				}else if(typ.indexOf("image")>-1){
					if(pageUtil.compileCache.mediaType==2){//针对视频封面
						obj.attr("accept","image/jpg,image/jpeg,image/png");//改变上传属性
						obj.parents(pare).before($('<div class="loadpic-wrap titlePage"><div class="loadpic"><img style="display: inline-block;width: 100%;height: 100%;" src=' + imgPath + src + "><span data-srcs="+src+" class='deletes' >x</span></div></div>" ));
						pageUtil.compileCache.titlePage = src;//添加到视频封面
						obj.parents(pare).hide();
					}else{
						obj.attr("accept","image/jpg,image/jpeg,image/png");//改变上传属性
						obj.parents(pare).before($('<div class="loadpic-wrap"><div class="loadpic"><img style="display: inline-block;width: 100%;height: 100%;" src=' + imgPath + src + "><span data-srcs="+src+" class='deletes' >x</span></div></div>" ));
						pageUtil.compileCache.mediaType = 1;//图片
						pageUtil.compileCache.urls.push(src);//添加到数组
						if(pageUtil.compileCache.urls.length==5){
							obj.parents(pare).hide();
						}
					}	
				}
			} else {
				$.Huialert("获取图片路径失败", 1500);
			}
		});
	}    
    //添加搜索出来的条件   
	function addLiTemp(dataLit){
		var Li = "<li data-id='"+dataLit.id+"'>"+dataLit.name+"</li>";
		if(pageUtil.compileCache.topics.length>0){
			if(pageUtil.compileCache.topics.length==9){
				parent.layer.msg("最多只能添加9个话题！");
				return 
			}
			for(var i=0;i<pageUtil.compileCache.topics.length;i++){
				if(dataLit.id == pageUtil.compileCache.topics[i].id ){
					parent.layer.msg("已经添加过了！");
					return 
				}
			}
			pageUtil.compileCache.topicName.push(dataLit.name);//提供展示页面
			pageUtil.compileCache.topics.push(dataLit);//添加对象到数组
			$(".definUl").append(Li);
		}else{
			pageUtil.compileCache.topicName.push(dataLit.name);//提供展示页面
			pageUtil.compileCache.topics.push(dataLit);//添加对象到数组
			$(".definUl").append(Li);
		}
		$(".lists2").hide();
	};

    // 新增按钮
    $('#addBtn').on('click', function () {
    	var html = template("adds", {});
        layer.open({
            type: 1,
            title: '创建帖子排序',
            shadeClose: false,
            shade: [0.5, '#000'],
            maxmin: false, //开启最大化最小化按钮
            area: ['95%', '95%'],
            content: html,
            success: function(layero, index) {
            	$(".submitAdd").attr("disabled",true);
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
            		$.ajax({
	                  	type: "post",
	                  	url: base + "article/searchArticleList",
	                  	processData: false,
	                  	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
	                  	dataType: "json",
	                  	data: JSON.stringify({title:$(".searchName").val()}),
	                  	success: function(res) {
		                    if (res.status == '0' && res.data) {
				                if (res.data.length) {
				                	$(".submitAdd").attr("disabled",false);
            						$(".submitAdd").addClass("btnPrimary");
				                   	addTemp(res.data);
				                }else {
				                	$(".submitAdd").attr("disabled",true);
				                	$(".submitAdd").removeClass("btnPrimary");
				                    $('#lists').html('');
				                }
				            }else {
				                $('#lists').html('');
				                $.Huimodalalert(res.message, 2000);
				            }
	                  	}
	                });

            	});
            	
            	/*确认添加*/
            	$(".submitAdd").on("click", function() {
            		var searchName = $(".searchName").val();
            		if (searchName.replace(/(^s*)|(s*$)/g, "").length >= 0 && searchName != "") {
                    	$.get(base + 'article/addConfirm', {title:searchName}, function (res) {
				            if (res.status == "0") {
		                        layer.close(index);
		                        addTr(res.data);
		                    }else if(res.status == "2"){
		                    	parent.layer.msg(res.message);
		                    } else {
		                      	$.Huimodalalert(res.message, 1500);
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
		        <td>' + (data.title || '') + '</td>\
		        <td>' + (data.mediaType ==1 ? "图片 ":"视频") + '</td>\
		         <td>' + (data.topicName || '') + '</td>\
		        <td>' + (data.totalNum) + '</td>\
		        <td class="f-14">\
		        	<a href="javascript:void(0)" class="deleList malr06 blues" target="">删除排序</a>\
		        	<a href="javascript:void(0)" class="compile malr06 blues mls" target="">编辑</a>\
			    </td>\
		    </tr>';
		$("#listCtnWrap").prepend(htl);    
   	};
    
    /*模板引擎点击付给父级*/
   	$('body')
   		.on("click",".confirmBtns",function(e){
   			var $thi = $(e.target);
   			var times = $thi.parents(".layui-layer").attr("times");//获取当前弹窗
   			$("#layui-layer-shade"+times).remove();
			$("#layui-layer"+times).remove();
   	   		$(".inputText").val(pageUtil.compileCache.topicName)
   		})

    $('body').on('click', function (e) {
        var $target = $(e.target);
		if(!$target.hasClass("searchListWrap") && !$target.hasClass("lists")) {
			$(".lists").hide();
		}
		if(!$target.hasClass("searchListWrap") && !$target.hasClass("lists2")) {
			$(".lists2").hide();
		}
    })

})