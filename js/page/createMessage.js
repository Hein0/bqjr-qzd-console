/**
 * Created by Administrator on 2017/4/26.
 */

var flag = false;

var pushType = util.getQueryString("pushType") || 1;
var isEmpty = false;
var options = {};
var mobileList = "";
var sendType = 0;
var titleObj = {};
//判断是否是详情页面
var info = util.getQueryString("info");
var groupId = util.getQueryString("groupId");
function loadData(groupId) {
    $.post(base + "/message/selectMessageInfoDetail.do", { groupId: groupId }, function (json) {
        //console.log(json);
        if (json.data) {
            if (json.data.pushType == "0") {
                $("#radio-2").prop("checked", true);

                // pushType = 0;
                $("#insidePushType").val(json.data.insidePushType);
                $(".insidePushType").show();
            } else {
                $("#radio-1").prop("checked", true);
            }
            if (json.data.title) {
                $("#title").val(json.data.title);
            }
            if (json.data.context) {
                $("#context").val(json.data.context);
            }
            if (json.data.messageKey) {
                $("#messageKey").val(json.data.messageKey);
            }
            if (json.data.messageValue) {
                $("#messageValue").val(json.data.messageValue);
            }
            if (json.data.type == "3") {
                $("#radio-4").prop("checked", true);
                $("#download-user").show();
                if (info == 1) {
                    $("#fileElemForm").show();
                }
            }
            if (json.data.sendType == "1") {
                $("#radio-6").prop("checked", true);
                $("#pushBookTime").show();
                $("#pushBookTime").val(json.data.pushBookTime)
                $("#pushBookTime").attr("disabled", false);
                sendType = 1;
            }
            if (json.data.corner == "1") {
                $("#radio-8").prop("checked", true);
            }
            if (json.data.mobileList) {
                //    var tel = "";
                for (var i = 0; i < json.data.mobileList.length; i++) {
                    var it = json.data.mobileList;
                    mobileList += it[i] + ",";
                    // tel += "<li>" + it[i] + "</li>";
                }
                //    $("#userList").append(tel).show();
            }
            $("#returnBtn").on("click", function () {
                $(titleObj).attr({'data-title': '消息管理','data-href': 'view/operate/messageManagement.html'});
                Hui_admin_tab($(titleObj).get());
            });

            if (info == 1) {
            	if ($("#radio-1:checked").length > 0) {
	        		$('#file').attr('disabled',true)
	            	$('.img-up-btn').css('background','lightgray')
	            	$("#insidePushType").attr('disabled',true)
	            	$("#insidePushType").css('color','lightgray')
	        	} else if ($("#radio-2:checked").length > 0) {
	        		$('#file').attr('disabled',false)
	            	$('.img-up-btn').css('background','#5a98de')
	            	$('#up-img').attr('src',json.data.img)
	            	$("#insidePushType").attr('disabled',false)
	            	$("#insidePushType").css('color','black')
	        	}

	            if ($("#radio-4:checked").length > 0) {
	        		$('#fileElem').attr('disabled',false)
		            $('.up-file-btn').css('background','#5a98de')
		            $('.up-file-btn').css('border-color','lightgray')
	        	} else {
	        		$('#fileElem').attr('disabled',true)
		            $('.up-file-btn').css('background','lightgray')
		            $('.up-file-btn').css('border-color','lightgray')
	        	}
            }

        }
    });
}

function createMessage(index) {
    $(".submitButton").attr("disabled", "disabled");
    var urlPath = "/message/insertMessage.do";
    if (groupId) {
        urlPath = "/message/updateMessage.do";
        options["groupId"] = groupId;
    }
    if ($("#radio-4:checked")) {
        options["mobileList"] = mobileList;
    }

    if (flag) {
        return false;
    }

    flag = true;

    $.post(base + urlPath, options, function (json) {
        flag = false;
        if (json) {
            if (json.status == "0") {
                if (index == -1) {
                    $.Huimodalalert("保存草稿成功!", 2000);
                } else {
                    $("#tip-modal").modal("hide");
                    if (groupId) {
                        $.Huimodalalert("修改推送成功!", 2000);
                    } else {
                        $.Huimodalalert("新建推送成功!", 2000);
                    }
                    $(".submitButton").removeAttr("disabled");
                }
                setTimeout(function () {
                    $(titleObj).attr({ 'data-title': '消息管理', 'data-href': 'view/operate/messageManagement.html' });
                    Hui_admin_tab($(titleObj).get());
                  //  window.location = "messageManagement.html";
                }, 2000);
            } else {
                $(".submitButton").removeAttr("disabled");
                $.Huimodalalert("保存失败！", 2000);
                location.reload();
            }
        }
    })
}

//格式化时间
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//提交表单
function submitFrom(index) {
    //var validates = [
    //    {
    //        id: "title",
    //        items: ["require"],
    //        message: {
    //            require: "标题不能为空！"
    //        }
    //    }, {
    //        id: "context",
    //        items: ["require"],
    //        message: {
    //            require: "推送内容不能为空！"
    //        }
    //    },
    //    {
    //        id: "messageValue",
    //        items: ["require"],
    //        message: {
    //            require: "value不能为空！"
    //        }
    //    },
    //    {
    //        name: "type",
    //        items: ["require"],
    //        message: {
    //            require: "请选择目标用户！"
    //        }
    //    },
    //    {
    //        name: "pushBookTime",
    //        items: ["require"],
    //        message: {
    //            require: "请选择预约推送时间！"
    //        }
    //    },
    //    {
    //        name: "corner",
    //        items: ["require"],
    //        message: {
    //            require: "请选择角标！"
    //        }
    //    },
    //    {
    //        id: "insidePushType",
    //        items: ["require"],
    //        message: {
    //            require: "请选择消息类型！"
    //        }
    //    }
    //];
    var title = $.trim($("#title").val());
    if (title.length == 0) {
        $("#title").focus();
        $.Huimodalalert("标题不能为空！", 1500);
        return false;
    }
    var context = $.trim($("#context").val());
    if (context.length == 0) {
        $("#context").focus();
        $.Huimodalalert("推送内容不能为空！", 1500);
        return false;
    }
    if ($("#radio-2:checked").length > 0){
    	 var imgUrl = $('#up-img').attr('src');
	    if (!imgUrl) {
	    	 $.Huimodalalert("请上传图片！", 1500);
	    	 return false;
	    }
    }


    if ($("#radio-1:checked").val()) {
        var messageKey = $.trim($("#messageKey").val());
        $("#messageKey").focus();
        if (messageKey.length == 0) {
            $.Huimodalalert("key值不能为空！", 1500);
            return false;
        }
    }
    var messageValue = $.trim($("#messageValue").val());
    if (messageValue.length == 0) {
        $("#messageValue").focus();
        $.Huimodalalert("value不能为空！", 1500);
        return false;
    }
    if ($("#radio-2:checked").val()) {
        var insidePushType = $.trim($("#insidePushType").val());
        if (insidePushType.length == 0) {
            $.Huimodalalert("请选择消息类型！", 1500);
            return false;
        }
    }
    if (info != 1) {
        if ($("#radio-4:checked").val()) {
            var fileElem = $.trim($("#fileElem").val());
            if (fileElem.length == 0) {
                $.Huimodalalert("上传文件不能为空！", 1500);
                return false;
            }
        }
    }
    var datas = $("#createmsg-form").find("input,select,textarea").serializeObject();
    //   console.log(datas);
    //消息状态
    datas["status"] = index;
    datas['img'] = imgUrl;
    // datas["pushType"] = pushType;
    //datas["sendType"] = sendType;

    //-1:草稿
    //0未发送(推送/定时推送)

    if (index == -1) {
        options = datas;
        // console.log(datas);
        createMessage(index);
        return false;
    }
    var pushTime = "";
    if (datas.pushBookTime == "") {
        pushTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    } else {
        pushTime = datas.pushBookTime;
    }
    $("#startTime").text(pushTime);
    options = datas;
    $("#tip-modal").modal("show");


    //if (datas.pushBookTime == 1) {
    //    datas.pushBookTime = $("#pushBookTime").val();
    //} else {
    //    datas.pushBookTime = "";
    //}

    //if (isEmpty) {
    //    if (datas.pushBookTime == "") {
    //        $.Huimodalalert("请选择推送时间！", 1500);
    //        return false;
    //    }
    //}

    //if (!util.isBreak) {
    //    datas["pushType"] = pushType;
    //    datas["sendType"] = sendType;
    //    if (index == -1) {
    //        options = datas;
    //        // console.log(datas);
    //        createMessage(index);
    //        return false;
    //    }
    //    var pushTime = "";
    //    if (datas.pushBookTime == "") {
    //        pushTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
    //    } else {
    //        pushTime = datas.pushBookTime;
    //    }
    //    $("#startTime").text(pushTime);
    //    options = datas;
    //    $("#tip-modal").modal("show");
    //}

}

function exportExcel() {
    var title = $.trim($("#title").val());
    util.popUp({
        "info": "确认要下载用户列表吗？", "msg": "用户列表数据", "cancel": function () {
        }, "ok": function () {
            var filename = "用户列表_" + title + "_" + new Date().Format("yyyy-MM-dd");
            location.href = base + "/message/exportMessageUser.do?groupId=" + groupId + "&fileName=" + filename;
        }
    });
}

$(function () {
    //切换表单
    var form1 = $("#demoform-1");
    var form2 = $("#demoform-2");
    $("#radio-1,#radio-2").click(function () {
        if ($("#radio-1:checked").length > 0) {
            $("#keyBox").show();
//      	$('.tips-way').show();
//          $(".insidePushType").hide();
//          $('.up-img-wrap').hide();
            $('#messageKey').attr('disabled',false)
            $('#file').attr('disabled',true)
            $('.img-up-btn').css('background','lightgray')
            $("#insidePushType").attr('disabled',true)
            $("#insidePushType").css('color','lightgray')
            $('#radio-7').attr('disabled',false)
            $('#radio-7').attr('checked',true)
            $('#radio-8').attr('disabled',false)

            //  pushType = 1;
        } else if ($("#radio-2:checked").length > 0) {
//          $("#keyBox").hide();
//          $('.tips-way').hide();
//          $(".insidePushType").show();
//          $('.up-img-wrap').show();
            $('#messageKey').attr('disabled',true)
            $('#file').attr('disabled',false)
            $('.img-up-btn').css('background','#5a98de')
            $("#insidePushType").attr('disabled',false)
            $("#insidePushType").css('color','black')
            $('#radio-7').attr('disabled',true)
            $('#radio-7').attr('checked',false)
            $('#radio-8').attr('disabled',true)
            //  pushType = 0;
        } else {
//      	$("#keyBox").show();
//      	$('.tips-way').show();
//      	$(".insidePushType").show();
//          $('.up-img-wrap').show();
            $('#messageKey').attr('disabled',false)
            $('#file').attr('disabled',false)
            $('.img-up-btn').css('background','#5a98de')
            $('.img-up-btn').css('background','#5a98de')
            $("#insidePushType").attr('disabled',false)
            $("#insidePushType").css('color','black')
            $('#radio-7').attr('disabled',false)
            $('#radio-7').attr('checked',true)
            $('#radio-8').attr('disabled',false)
        }
    });

    //定时推送切换
    //$("#pushBookTime").attr("disabled", true);
    $("#radio-5,#radio-6").click(function () {
        if ($("#radio-5:checked").length > 0) {
            //  $("#pushBookTime").attr("disabled", true);
            $("#pushBookTime").hide();
			$(".submitButton").val("立即推送");
            isEmpty = false;
            sendType = 0;
        } else if ($("#radio-6:checked").length > 0) {
            //  $("#pushBookTime").attr("disabled", false);
            $("#pushBookTime").show();
            $(".submitButton").val("定时推送");
            isEmpty = true;
            sendType = 1;
        }
    });

    $("#radio-3").change(function () {
        if ($("#radio-3:checked")) {
//          $("#fileElemForm").hide();
//          $("#download-user").hide();
            $('#fileElem').attr('disabled',true)
            $('.up-file-btn').css('background','lightgray')
            $('.up-file-btn').css('border-color','lightgray')
        }
    });
    $("#radio-4").change(function () {
        if ($("#radio-4:checked")) {
//          $("#fileElemForm").show();
//          $("#download-user").show();
            $('#fileElem').attr('disabled',false)
            $('.up-file-btn').css('background','#5a98de')
            $('.up-file-btn').css('border-color','#5a98de')
        }
    });

//判断详情和编辑
    if (groupId) {
        //编辑
        if (info == 1) {
            // $(".submitButton").val("编辑");
            $("#a-add").text("编辑");
            $("#xjxx").text("编辑消息");
            if (pushType == 1) {
                $("#keyBox").show();
            } else {
                $("#keyBox").hide();
            }
//           $('#insidePushType').attr('disabled',false);
//      	$("#insidePushType").css('color','black')
//      	$('#file').attr('disabled',false)
//          $('.img-up-btn').css('background','#5a98de')

//          if ($("#radio-1:checked").length > 0) {
//      		$('#file').attr('disabled',true)
//          	$('.img-up-btn').css('background','lightgray')
//          	$("#insidePushType").attr('disabled',true)
//          	$("#insidePushType").css('color','lightgray')
//      	} else if ($("#radio-2:checked").length > 0) {
//      		$('#file').attr('disabled',false)
//          	$('.img-up-btn').css('background','#5a98de')
//          	$("#insidePushType").attr('disabled',false)
//          	$("#insidePushType").css('color','black')
//      	}
//
//          if ($("#radio-4:checked").length > 0) {
//      		$('#fileElem').attr('disabled',false)
//	            $('.up-file-btn').css('background','#5a98de')
//	            $('.up-file-btn').css('border-color','lightgray')
//      	} else {
//      		$('#fileElem').attr('disabled',true)
//	            $('.up-file-btn').css('background','lightgray')
//	            $('.up-file-btn').css('border-color','lightgray')
//      	}
        } else {

        	$('#file').attr('disabled',true)
            $('.img-up-btn').css('background','lightgray')
            $('#fileElem').attr('disabled',true)
            $('.up-file-btn').css('background','lightgray')
            $('.up-file-btn').css('border-color','lightgray')
            $("#returnBox").show();
            $("#a-add").text("消息详情");
            $("#xjxx").text("详情信息");
            $("#pushBookTime").removeAttr("onfocus").attr("onfocus", "this.blur();");
            $("#createmsg-form").find("input,textarea,select").attr("disabled", "disabled").css("backgroundColor", "#f7f4f4");
            $(".saveUpdateButton").hide();
            if (pushType == 1) {
                $("#keyBox").show();
            } else {
                $("#keyBox").hide();
            }
        }
        loadData(groupId);

    }



    //上传
    $("#fileElem").off("change").on("change", function () {
        // 判断文件类型
        var uploadFile = document.getElementById('fileElem').files[0],
            fileName = uploadFile.name,
            type = '';
        type = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();

        if (type !== 'xls' && type !== 'xlsx') {
            $.Huimodalalert('只能上传excel文件', 1500);
            return false;
        }

        $("#fileElemForm").ajaxSubmit({
            url: base + "/message/inportSupplierQuote.do",
            type: "post",
            dataType: "json",
            success: function (data) {
                //var result = typeof (data);
                //if (result == "string") {
                //    data = JSON.parse(data);
                //}
                mobileList = data.data;
                $.Huimodalalert('上传成功！', 1500);
            },
            error: function (error) { alert(error); }
        });
    });

    //图片上传
    upLoadImg()
});

 //图片上传
    function upLoadImg() {
        $("#file").change(function(){
            var formData = new FormData();
            formData.append("file", $("#file").get(0).files[0]);
            $.ajax({
                url: base+"common/upload",
                type: "POST",
                processData: false,
                contentType: false,
                data: formData,
                dataType:"JSON",
                success: function(data){
                    if(data.status=='0'){
                        console.log(data);
                        var imgUrl = imgPath + data.data
                        $('#up-img').attr('src',imgUrl)
                    }else{
                        $.Huimodalalert(data.message, 2000);
                    }
                }
            });

        });
    }