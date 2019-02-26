var userList = userList || {
	pageNum:'',
	pageRows:'',
    getData: function (obj) {
        try {
            var arrObj = $("#user-form").find("input,select").serializeObject();
           userList.pageNum = (obj && obj.curr) || 1; // 默认第1页
            userList.pageRows = (obj && obj.pageSize) || 20;// 默认一页20条数据
            arrObj['pageNum'] = userList.pageNum
            arrObj['pageRows'] = userList.pageRows
            var url = base + "/user/getUserList.do?r=" + Math.random();
            $.post(url, arrObj, function (data) {
                var result = typeof (data);
                if (result == "string") {
                    data = JSON.parse(data);
                }
                util.jumpLogin(data);
                if (data.status == "0" && data.data) {
                    if (data.data.length) {
                        $("#UserContent").empty().append($("#tmplUserList").tmpl(data));
                    } else {
                        $("#UserContent").empty().append("<tr><td colspan='11'  style='text-align:center; color:#ddd;'>暂无相关数据！</td></tr>");
                    }
                } else {
                    $.Huimodalalert(data.message, 1500);
                }
                setPagination({
                    elem: $('#pagination'),
                    totalCount: data.dataCount,
                    curr: arrObj['pageNum'],
                    callback: function (obj) {
                        userList.getData(obj);
                    }
                });
            }, "json");

        } catch (ex) {
            if (window.console) {
                console.dir(ex);
            }
        }
    },
    resetSearch: function () {
        $("#user-form").find("input[type='text'],select").val("");
        $("#user-form").find("input[type='radio']").removeAttr("checked");
    },
    getDetailMsg: function (id, obj) {
        $(obj).attr('data-href', 'view/user/userDetail.html?id=' + id);
        $(obj).attr('data-title', '用户详情');
        Hui_admin_tab($(obj).get());
    },
    initPage: function () {
        var className = { 2: ".user-status", 3: ".user-origin", 16: ".user-white", 37: ".user-channel"};
        util.initSelect(className, "2,3,16,37");
        //  util.checkForm();
        //userList.getData();
    },
    resetPaymentPwd: function (id, tel, name) {
        try {
            var msg = "<div class=\"user-msg\">";
            msg += "<span>" + name + "</span><span>" + tel + "</span></div>";
            util.popUp({
                "info": "确认要重置支付密码吗？", "msg": msg, "cancel": function () {
                }, "ok": function () {
                    var url = base + "/user/resetTraderPassword.do?r=" + Math.random();
                    $.post(url, { "userId": id, "mobile": tel }, function (data) {
                        var result = typeof (data);
                        if (result == "string") {
                            data = JSON.parse(data);
                        }
                        console.dir(data);
                        if (data.status == "0") {
                            showTit("重置支付密码成功！", "yes", function () {
                                userList.getData();
                            });
                        } else {
                            $.Huimodalalert(data.message, 1500);

                        }

                    }, "json");
                }
            });

        } catch (ex) {
            if (window.console) {
                console.dir(ex);
            }
        }
    },
    resetUserLoginPwd: function (id, tel, name) {
        try {
            var msg = "<div class=\"user-msg\">";
            msg += "<span>" + name + "</span><span>" + tel + "</span></div>";
            util.popUp({
                "info": "确认要重置用户密码吗？", "msg": msg, "cancel": function () {
                }, "ok": function () {
                    var url = base + "/user/resetLoginPassword.do?r=" + Math.random();
                    $.post(url, { "userId": id, "mobile": tel }, function (data) {
                        var result = typeof (data);
                        if (result == "string") {
                            data = JSON.parse(data);
                        }
                        console.dir(data);
                        if (data.status == "0") {
                            showTit("重置用户登录密码成功！", "yes", function () {
                                userList.getData();
                            });
                        } else {
                            $.Huimodalalert(data.message, 1500);
                        }

                    }, "json");
                }
            });

        } catch (ex) {
            if (window.console) {
                console.dir(ex);
            }
        }
    },
    formatNowTime: function () {
        var helper = function (val) {
            return +val < 10 ? ('0' + val) : val
        },
            time = new Date(),
            result = '';

        result += time.getFullYear() + '-' + (helper(time.getMonth() + 1)) + '-' + helper(time.getDate()) + ' ' + helper(time.getHours()) + ':' + helper(time.getMinutes()) + ':' + helper(time.getSeconds());

        return result;
    },
    exportExcel: function () {
        var dataCount = $.trim($("#dataCount").val());
        if (dataCount > 0) {
            util.popUp({
                "info": "确认要导出用户列表吗？", "msg": "用户列表数据", "cancel": function () {
                }, "ok": function () {
                    var filename = "用户列表导出_" + userList.formatNowTime().slice(0, 10);
                    var param = $("#user-form").serialize();
//                  param['pageNum'] = userList.pageNum;
//          		param['pageRows'] = userList.pageRows;
                    param = param + "&fileName=" + filename;
                    console.log(param)
                    location.href = base + "user/exportExcel.do?" + param;
                }
            });
        } else {
            $.Huimodalalert("导出数据不能为空！", 1500);
        }
    },
    
    //显示弹窗
    popShow: function (el) {
    	var $self = $(el);
    	var popType = $self.text();
    	var mobile = $self.attr('mobile'),
    		userName = $self.attr('userName'),
    		certId = $self.attr('certId'),
    		userId = $self.attr('userId');
    	$('#mymodal #submit').attr('userId',userId)
    	$('#mymodal').modal('show')
    	
    	$('#mymodal .pop-mobile').text(mobile)
    	$('#mymodal .pop-name').text(userName)
    	$('#mymodal .pop-certId').text(certId)
    	
    	if (popType == "变更手机号码") {
    		$('#mymodal .modal-title').text("变更手机号码")
    		$('#mymodal #submit').attr('type','change')
    		$('.cold-pop').hide()
    		$('.change-pop').show()
    	} else if (popType == "冻结") {
    		$('#mymodal .modal-title').text("冻结用户")
    		$('#mymodal #submit').attr('type','cold')
    		$('#mymodal .action-txt').text("冻结")
    		$('.pop-reason-wrap').show()
    		$('.un-cold-reason').hide()
    		$('#cold-reason').show()
    		$('.change-pop').hide()
    		$('.cold-pop').show()
    	} else if (popType == "解冻") {
    		var freezeReason = $self.attr('freezeReason');
    		$('#mymodal .modal-title').text("解除冻结")
    		$('#mymodal .action-txt').text("解除冻结")
    		$('#mymodal #submit').attr('type','un-cold')
    		$('.un-cold-reason').text(freezeReason)
    		$('.pop-reason-wrap').show()
    		$('.un-cold-reason').show()
    		$('#cold-reason').hide()
    		$('.change-pop').hide()
    		$('.cold-pop').show()
    	} else if (popType == "删除") {
    		$('#mymodal .modal-title').text("删除用户")
    		$('#mymodal .action-txt').text("删除")
    		$('#mymodal #submit').attr('type','delete')
    		$('.pop-reason-wrap').hide()
    		$('.change-pop').hide()
    		$('.cold-pop').show()
    	}
    },
    //点击确定
    submitFn: function (el) {
    	var btnType = $(el).attr('type');
    	var userId = $(el).attr('userId');
    	if (btnType == "change") {
    		this.changeFn(btnType,userId)
    	} else{
    		this.coldAndDelete(btnType,userId);
    	}
    },
    //冻结/解冻/删除
    coldAndDelete: function (type,id) {
    	var self = this;
    	var url,reason,useStatus;
    	var data = {};
    	if (type == "delete") {
    		url = 'user/deleteUser.do'
    	} else{
    		url = 'user/freezeUser.do'
    	}
    	if (type == "cold") {
    		reason = $('#cold-reason').val()
    		if (!reason) {
    			$.Huimodalalert("冻结原因不能为空！", 1500);
    			return false;
    		}
    		useStatus = 1
    	} else if (type == "un-cold") {
    		useStatus = 0
    	}
    	
    	data['userId'] = id;
    	data['useStatus'] = useStatus;
    	data['freezeReason'] = reason;
    	$.post(base + url,data,function (res) {
    		if (res.status == 0) {
    			$('#mymodal').modal('hide')
    			$.Huimodalalert("操作成功", 1500);
    			userList.getData();
    		} else{
    			$.Huimodalalert(res.message, 1500);
    		}
    	})
    },
    //变更手机号
    changeFn: function (type,id) {
    	var self = this;
    	var data = {};
    	var newMobile = $('#change-mobile').val();
    	var reg = /^1[34578]\d{9}$/;
    	if (!newMobile) {
    		$.Huimodalalert("请输入变更后的新号码", 1500);
    	} else if (!reg.test(newMobile)) {
    		$.Huimodalalert("请输入正确的手机号码", 1500);
    	}
    	
    	data['userId'] = id;
    	data['mobile'] = newMobile;
    	$.post(base + 'user/updateMobile.do',data,function (res) {
    		if (res.status == 0) {
    			$('#mymodal').modal('hide')
    			$.Huimodalalert("操作成功", 1500);
    			userList.getData();
    		} else{
    			$.Huimodalalert(res.message, 1500);
    		}
    	})
    },
    //点击钱包
    goTOwallet: function (el) {
    	// 详情
        var $self = $(el),
        	userId = $self.attr('userId')
        
        $self.attr('data-href', 'view/wallet/walletList.html?userId=' + userId)
        $self.attr('data-title', '钱包列表');
        Hui_admin_tab($self.get());
    }
    
};

//
jQuery(function ($) {
    userList.initPage();
    $(document.body).keydown(function (e) {
        if (e.keyCode == 13) {
            userList.getData();
        }
    });
});