var category = {
    param: {},
    logSpuData: {
		id:'',//商品id
		before_logo: '',//logoimg
		after_pics:[],
	},
	//初始化
	init: function() {
		var path = location.href;
		if(path.indexOf("?") >= 0) {
			var params = path.substring(path.indexOf("?") + 1, path.length).split("&"),
				id = "";
			for(var i = 0; i < params.length; i++) {
				if(params[i].indexOf("id") != -1) {
					id = params[i].split("=")[1];
				} 
			}
			category.logSpuData.id = id;
			category.requestData(id);
			
		} else {
			$(".role-row").addClass("active");
		}
	},
	
	//获取数据列表
    requestData: function(id){
    	var url = base;
    	$.get(base+"category/getCategory", {id:id}, function(res) {
	      	if(res.status=="0"){
	      		res.data.imgPath = imgPath;
	      		$("#spu-cont").html(template("contacts", res.data));
	      	}
	    });
    },
    
    //提示窗
	"tip":function(msg){
		$.Huimodalalert(msg, 1500);
	},
	
    //项目概览,项目档案，操作档案，术前必读，提交
    "submitBtn1":function(nub){
    	var formData = {};
    		formData.id = $("#commodityId").val() || category.logSpuData.id;
    	if(nub==1){
    		if($("#name").val()==""){
				category.tip("请输入项目名称");
				return ;
			}else{
				formData.name = $("#name").val();
			}
			if($("#introduction").val()==""){
				category.tip("请输入项目简介");
				return ;
			}else{
				formData.introduction = $("#introduction").val();
			}
			if($("#feature").val()==""){
				category.tip("请输入项目特色");
				return ;
			}else{
				formData.feature = $("#feature").val();
			}
			if($("#alias").val() ==""){
				category.tip("请输入项目别名");
				return ;
			}else{
				formData.alias=$("#alias").val();
			}
			if($("#reference_price").val() ==""){
				category.tip("请输入参考价格");
				return ;
			}else{
				formData.reference_price = $("#reference_price").val();
			}
			if(!$("#before_logo").data("src")){
				category.tip("请上传项目介绍图片");
				return ;
			}else{
				formData.logo = $("#before_logo").attr("data-src")
			}
    	}else if(nub==2){
    		if($("#suit_crowds").val() ==""){
				category.tip("请输入适合人群描述");
				return ;
			}else{
				formData.suit_crowds = $("#suit_crowds").val();
			}
			if($("#aboo_crowd").val() ==""){
				category.tip("请输入禁忌人群描述");
				return ;
			}else{
				formData.aboo_crowd = $("#aboo_crowd").val();
			}
			if($("#merits").val() ==""){
				category.tip("请输入优点描述");
				return ;
			}else{
				formData.merits = $("#merits").val();
			}
			if($("#demerits").val() ==""){
				category.tip("请输入缺点描述");
				return ;
			}else{
				formData.demerits = $("#demerits").val();
			}
    	}else if(nub==3){
    		formData.treatment_day = $("#treatment_day").val();
    		formData.duration_day = $("#duration_day").val();
    		formData.anaesthesia_type = $("#anaesthesia_type").val();
    		formData.recovery_day = $("#recovery_day").val();
    		formData.treatment_cycle = $("#treatment_cycle").val();
    		formData.operator_qualification = $("#operator_qualification").val();
    		formData.operation_mode = $("#operation_mode").val();
    		formData.pain_perception = $("#pain_perception").val();
    	}else if(nub==5){
    		if($("#pre_reade").val() ==""){
				category.tip("请输入术前必读");
				return ;
			}else{
				formData.pre_reade = $("#pre_reade").val();
			}
    	}
    	//发送
		$.ajax({
			url: base+"category/uptCategory",
			type: "POST",
			data: JSON.stringify(formData),
			contentType: "application/json;charset=utf-8",
			success: function (data) {
				if (data.status == '0') {
					$.Huimodalalert("提交成功!", 2000);
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
    
    //常见问题保存、编辑
    issueSave: function(obj){
    	var parents = $(obj).parents(".issueList");
    	var listId = $(obj).parents(".issueList").attr("data-id");
    	var inpuTitle = parents.find(".appo_price").val();
    	var	textArea = parents.find(".introduce").val();
    	
    	if($(obj).val() == "保存"){
    		var formData ={};
    		if(inpuTitle !="" && textArea !=""){
    			formData.id = listId;
    			formData.question = inpuTitle;
    			formData.answer = textArea;
    			//发送
				$.ajax({
					url: base+"category/updateCategoryProblem",
					type: "POST",
					data: JSON.stringify(formData),
					contentType: "application/json;charset=utf-8",
					success: function (data) {
						if (data.status == '0') {
							$.Huimodalalert("提交成功!", 2000);
							setTimeout(function(){
								window.location.href = window.location.href;
							},1500)
						} else {
							$.Huimodalalert(data.message, 2000);
						}
					},
					error:function(err){
						layer.closeAll('loading');
						$.Huialert(err.message,1500)
					}
				});
    		}else{
    			$.Huimodalalert("问题或者答案不能为空!", 2000);
    			return
    		}
    	}else{
    		$(obj).val("保存");
            parents.find(".appo_price").removeAttr("disabled");
            parents.find(".introduce").removeAttr("disabled");
            parents.find(".appo_price").focus();
    	}
    },
    //常见问题删除
    issueDele: function(obj){
    	var listId = $(obj).parents(".issueList").attr("data-id");
		if(listId !="" && !$(obj).hasClass("newdele")){
			//发送
			$.ajax({
				url: base+"category/delCategoryProblem?id="+listId,
				type: "get",
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					if (data.status == '0') {
						$.Huimodalalert("删除成功!", 2000);
						setTimeout(function(){
							window.location.href = window.location.href;
						},1500)
					} else {
						$.Huimodalalert(data.message, 2000);
					}
				},
				error:function(err){
					layer.closeAll('loading');
					$.Huialert(err.message,1500)
				}
			});
		}else{
			$(obj).parent().parent().parent().remove();
		}
		
    },
    //新增问题列表
    addIssue: function(){
    	var div = '<div class="issueList">' +
	                '<div class="issueTxt">' +
	                	'<div class="issueTile">' +
	                		'<input id="appo_price" class="input-text appo_price" placeholder="请输入问题" type="text" maxlength="60" >' +
	                	'</div>' +
	                    '<textarea id="introduce" class="textarea introduce" type="text" name="introduce" placeholder="请输入答案"  maxlength="300"></textarea>' +
	                '</div>' +
	                '<div class="issueEvent">' +
	                	'<span class="compileSpan">' +
	                		'<input class="btn btn-primary compile" value="保存" type="button" onclick="category.newIssueSave(this)">' +
	                	'</span>' +
	                	'<span class="deletesSpan">' +
	                		'<input class="btn newdele" value="删除" type="button" onclick="category.issueDele(this)">' +
	                	'</span>' +
	                '</div>' +
                '</div>';
        $(div).appendTo("#issueListAll");
    },
    
    //新增问题保存
    newIssueSave:function(obj){
    	var classId = $("#commodityId").val() || category.logSpuData.id;
    	var questions = $(obj).parents(".issueList").find(".appo_price").val();
    	var	answers = $(obj).parents(".issueList").find(".introduce").val();
    	
		var datas ={};
		if(questions !="" && answers !=""){	
			datas.category_id = classId;
			datas.question = questions;
			datas.answer = answers;
			//发送
			$.ajax({
				url: base+"category/addCategoryProblem",
				type: "POST",
				data: JSON.stringify(datas),
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					if (data.status == '0') {
						$.Huimodalalert("提交成功!", 2000);
						setTimeout(function(){
							window.location.href = window.location.href;
						},1500)
					} else {
						$.Huimodalalert(data.message, 2000);
					}
				},
				error:function(err){
					layer.closeAll('loading');
					$.Huialert(err.message,1500)
				}
			});
		}else{
			$.Huimodalalert("问题或者答案不能为空!", 2000);
    		return
		}
    },
    
    //新增术后护理列表
    addNurse: function(){
    	var div = '<div class="nurseList" data-id="">' +
            		'<div class=" cl nurseTxt">' +
	                    '<label class="form-label col-xs-2 col-sm-2">' +
	                        '<span class="red">*</span>时间段/标题：' +
	                    '</label>' +
                        '<div class="nurseTile formControls col-xs-10 col-sm-10">' +
                			'<input class="inputNumber start_day"  type="number" min="0">天~' +
		            		'<input class="inputNumber end_day"  type="number" min="0">天 ' +
		            		'<input name="remark" class="input-text remark" placeholder=" " type="text" maxlength="100" value="">' +
                		'</div>' +
	                '</div>' +
	                '<div class="cl nurseTxt">' +
	                	'<label class="form-label col-xs-2 col-sm-2">' +
	                        '<span class="red">*</span>恢复提示：' +
	                    '</label>' +
	                    '<div class="nurseArea formControls col-xs-10 col-sm-10">' +
	                    	'<textarea class="textarea recovery_tips" type="text" name="introduce" placeholder="恢复提示描述"></textarea>' +
	                    '</div>	' +
	                '</div>' +
	                '<div class="cl nurseTxt">' +
	                	'<label class="form-label col-xs-2 col-sm-2">' +
	                        '<span class="red">*</span>护理方法：' +
	                    '</label>' +
	                    '<div class="nurseArea formControls col-xs-10 col-sm-10">' +
	                    	'<textarea class="textarea case_method" type="text" name="introduce" placeholder="护理方法描述"></textarea>' +
	                    '</div>' +
	                '</div> ' +
	                '<div class="nurseEvent">' +
	                	'<span class="compileSpan">' +
	                		'<input class="btn btn-primary compile" value="保存" type="button" onclick="category.nurseNewSave(this)">' +
	                	'</span>' +
	                	'<span class="deletesSpan">' +
	                		'<input class="btn  newdeles" value="删除" type="button" onclick="category.nurseDele(this)">' +
	                	'</span>' +
	                '</div>' +
                '</div>';
        $(div).appendTo("#nurseAll");
    },
    /*新建术后护理保存*/
	nurseNewSave:function(obj){
		var classId = $("#commodityId").val() || category.logSpuData.id;
    	var startDay = $(obj).parents(".nurseList").find(".start_day").val();
    	var	endDay = $(obj).parents(".nurseList").find(".end_day").val();
    	var	remark = $(obj).parents(".nurseList").find(".remark").val();
    	var	recoveryTips = $(obj).parents(".nurseList").find(".recovery_tips").val();
    	var	caseMethod = $(obj).parents(".nurseList").find(".case_method").val();
    	
		var datas ={};
		if(startDay !="" && endDay !="" && remark !="" && recoveryTips !="" && caseMethod !=""){	
			datas.category_id = classId;
			datas.start_day = startDay;
			datas.end_day = endDay;
			datas.remark = remark;
			datas.recovery_tips = recoveryTips;
			datas.case_method = caseMethod;
			//发送
			$.ajax({
				url: base+"category/addCategoryCase",
				type: "POST",
				data: JSON.stringify(datas),
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					if (data.status == '0') {
						$.Huimodalalert("提交成功!", 2000);
						setTimeout(function(){
							window.location.href = window.location.href;
						},1500)
					} else {
						$.Huimodalalert(data.message, 2000);
					}
				},
				error:function(err){
					layer.closeAll('loading');
					$.Huialert(err.message,1500)
				}
			});
		}else{
			$.Huimodalalert("内容不能为空!", 2000);
    		return
		}
	},
	
	//新建术后护理编辑、保存
	nurseSave:function(obj){
		var parents = $(obj).parents(".nurseList");
    	var listsId = $(obj).parents(".nurseList").attr("data-id");
    	var startDay = $(obj).parents(".nurseList").find(".start_day").val();
    	var	endDay = $(obj).parents(".nurseList").find(".end_day").val();
    	var	remark = $(obj).parents(".nurseList").find(".remark").val();
    	var	recoveryTips = $(obj).parents(".nurseList").find(".recovery_tips").val();
    	var	caseMethod = $(obj).parents(".nurseList").find(".case_method").val();
    	
    	if($(obj).val() == "保存"){
    		var formData ={};
    		if(startDay !="" && endDay !="" && remark !="" && recoveryTips !="" && caseMethod !=""){
    			formData.id = listsId;
				formData.start_day = startDay;
				formData.end_day = endDay;
				formData.remark = remark;
				formData.recovery_tips = recoveryTips;
				formData.case_method = caseMethod;
    			//发送
				$.ajax({
					url: base+"category/updateCategoryCase",
					type: "POST",
					data: JSON.stringify(formData),
					contentType: "application/json;charset=utf-8",
					success: function (data) {
						if (data.status == '0') {
							$.Huimodalalert("提交成功!", 2000);
							setTimeout(function(){
								window.location.href = window.location.href;
							},1500)
						} else {
							$.Huimodalalert(data.message, 2000);
						}
					},
					error:function(err){
						layer.closeAll('loading');
						$.Huialert(err.message,1500)
					}
				});
    		}else{
    			$.Huimodalalert("内容不能为空!", 2000);
    			return
    		}
    	}else{
    		$(obj).val("保存");
            parents.find(".readonly").removeAttr("readonly");
            parents.find(".start_day").focus();
    	}
	},
	//新建术后护理删除
	nurseDele:function(obj){
		var listId = $(obj).parents(".nurseList").attr("data-id");
		if(listId !="" && !$(obj).hasClass("newdeles")){
			//发送
			$.ajax({
				url: base+"category/delCategoryCase?id="+listId,
				type: "get",
				contentType: "application/json;charset=utf-8",
				success: function (data) {
					if (data.status == '0') {
						$.Huimodalalert("删除成功!", 2000);
						setTimeout(function(){
							window.location.href = window.location.href;
						},1500)
					} else {
						$.Huimodalalert(data.message, 2000);
					}
				},
				error:function(err){
					layer.closeAll('loading');
					$.Huialert(err.message,1500)
				}
			});
		}else{
			$(obj).parent().parent().parent().remove();
		}
	},
	//上传项目介绍图片
	'getImgEvent':function(obj,type){//type传值说明是手术后7张的
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
	},

    
}

$(function(){
	//初始化
  	category.init();
  	
  	
    
    //tab切换
    $(".spu-nav>ul>li").on("click",function(){ //给li标签添加事件  
     	var index=$(this).index();  //获取当前li标签的个数  
     	$(this).addClass("active").siblings().removeClass("active"); //li标签显示，同辈元素隐藏  
     	$(".spu-cont .form-step").eq(index).show().siblings().hide();
  	}) 
	
	//项目概览提交
	$("#spu-cont .submitBtn6").on("click",function () {
		console.log("1")
		
	});
	
	
	
	
});