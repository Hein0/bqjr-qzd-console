var login = login || {};
var register = register || {};
//登录
login.userLogin = function() {
	try {
		var account = $.trim($("#account").val());
		if(account.length == 0) {
			$.Huimodalalert("对不起，用户名不能为空！", 1500);
			$("#account").focus();
			return false;
		}
		var password = $.trim($("#password").val());
		if(password.length == 0) {
			$.Huimodalalert("对不起，密码不能为空！", 1500);
			$("#password").focus();
			return false;
		}
		var yzm = $.trim($("#imgYzm").val());
		if(yzm.length == 0) {
			$.Huimodalalert("对不起，验证码不能为空！", 1500);
			$("#imgYzm").focus();
			return false;
		}
		var url = base + "account/login.do?r=" + Math.random();
		//console.log(hex_md5(password));
		var data = {
			account: account,
			password: hex_md5(password),
			imgCode: yzm
		};
		$.post(url,data,function(jsonData) {
				var result = typeof jsonData;
				if(result == "string") {
					jsonData = JSON.parse(jsonData);
				}
				if(jsonData.status == "0") {
					var objx = JSON.stringify({
						accountType: jsonData.data.accountType,
						fullName: jsonData.data.fullName,
						accountId: jsonData.data.accountId
					});
					localStorage.setItem("storData", objx);
					location.href = "index.html";
				} else {
					$.Huimodalalert(jsonData.message, 1500);
				}
			},"json");
	} catch(ex) {
		if(window.console) {
			console.log(ex);
		}
	}
};


login.changeCode = function() {
	$("#imgCode").attr("src", base + "account/imageCode.do?r=" + Math.random());
};
login.cancel = function() {
	$("#loginform").find("input[type='text'],input[type='password']").val("");
};
//注册
register.userLogin = function() {
	if(register.rightAccount && register.rightPassword && register.rightName && register.rightId_card && register.rightTelphone) {                        
		try {
			var account = $.trim($("#registerAccount").val());
			if(account.length == 0) {
				$.Huimodalalert("对不起，帐号不能为空！", 1500);
				$("#registerAccount").focus();
				return false;
			} else if(account.length < 6) {
				$.Huimodalalert("对不起，帐号至少6位！", 1500);
				$("#registerAccount").focus();
				return false;
			}
			var password = $.trim($("#registerPassword").val());
			if(password.length == 0) {
				$.Huimodalalert("对不起，密码不能为空！", 1500);
				$("#registerPassword").focus();
				return false;
			} else if(password.length < 6) {
				$.Huimodalalert("对不起，密码至少6位！", 1500);
				$("#registerPassword").focus();
				return false;
			}
			var name = $.trim($("#name").val());
			if(name.length == 0) {
				$.Huimodalalert("对不起，真实姓名不能为空！", 1500);
				$("#name").focus();
				return false;
			} else if(!/^[\u4e00-\u9fa5]{2,6}$/.test(name)) {
				$.Huimodalalert("对不起，请输入真实姓名！", 1500);
				$("#name").focus();
				return false;
			}
			var id_card = $.trim($("#id_card").val());
			var checkFlag = new clsIDCard(id_card);
			if(id_card.length == 0) {
				$.Huimodalalert("对不起，身份证号码不能为空！", 1500);
				$("#id_card").focus();
				return false;
			} else if(!checkFlag.IsValid()) {
				$.Huimodalalert(
					"对不起，输入的身份证号无效,请输入真实的身份证号！",
					1500
				);
				$("#id_card").focus();
				return false;
			}
			var telphone = $.trim($("#telphone").val());
			var myreg = /^(((13[0-9]{1})|(14[0,7,9]{1})|(15[0-9]{1})|(166)|(17[0-9]{1})|(18[0-9]{1}|(19[8-9]{1})))+\d{8})$/;
			if(telphone.length == 0) {
				$.Huimodalalert("对不起，手机号不能为空！", 1500);
				$("#telphone").focus();
				return false;
			} else if(telphone.length != 11) {
				$.Huimodalalert("对不起，请输入11位的手机号！", 1500);
				$("#telphone").focus();
				return false;
			} else if(!myreg.test(telphone)) {
				$.Huimodalalert("对不起，请输入正确的手机号！", 1500);
				$("#telphone").focus();
				return false;
			}
			var yzm = $.trim($("#registerImgYzm").val());
			if(yzm.length == 0) {
				$.Huimodalalert("对不起，验证码不能为空！", 1500);
				$("#registerImgYzm").focus();
				return false;
			}
			var data = {
				account: account,
				password: password,
				name: name,
				id_card: id_card,
				telphone: telphone,
				imgCode: yzm
			};
			$.ajax({
				type: "post",
				url: base + "sys/addUser",
				processData: false,
				contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
				dataType: "json",
				data: JSON.stringify(data),
				success: function(jsonData) {
					var result = typeof jsonData;
					if(result == "string") {
						jsonData = JSON.parse(jsonData);
					}
					if(jsonData.status == "0") {
						$.Huimodalalert("注册成功", 1500);
						$("#loginform").show();
						login.changeCode();
						$("#registerform").hide();
					} else {
						$.Huimodalalert(jsonData.message, 1500);
					}
				}
			});
		} catch(ex) {
			if(window.console) {
				console.log(ex);
			}
		}
	} else {
		return false;
	}
};
register.changeCode = function() {
	$("#registerImgCode").attr("src",base + "account/imageCode.do?r=" + Math.random());
};
register.cancel = function() {
	$("#registerform").find("input[type='text'],input[type='password'],input[type='number']").val("");
};
$(function() {
	login.changeCode();
	$(document.body).keydown(function(e) {
		if(e.keyCode == 13) {
			login.userLogin();
		}
	});
	//点击立即注册切换
	$("#register").on("click", function() {
		$("#loginform").hide();
		$("#registerform").show();
		register.changeCode();
	});
	//点击返回登录
	$("#toLogin").on("click", function() {
		$("#loginform").show();
		$("#registerform").hide();
	});
	$("#registerAccount").on("focus", function() {
		$(this).next().text("*");
	});
	
	//注册账号---验证账号是否已经存在
	$("#registerAccount").on("blur", function() {
		var data = {};
		data.account = $.trim($("#registerAccount").val());
		if(data.account.length == 0) {
			$("#registerAccount").next().text("对不起，帐号不能为空！");
			register.rightAccount = false;
			return false;
		} else if(data.account.length < 6) {
			$("#registerAccount").next().text("对不起，帐号至少6位！");
			register.rightAccount = false;
			return false;
		} else {
			$.ajax({
				type: "post",
				url: base + "sys/getUser",
				processData: false,
				contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
				dataType: "json",
				data: JSON.stringify(data),
				success: function(jsonData) {
					var result = typeof jsonData;
					if(result == "string") {
						jsonData = JSON.parse(jsonData);
					}
					if(jsonData.status == "0") {
						if(jsonData.dataCount > 0) {
							$("#registerAccount").next().text("帐号已被注册，请重新输入！");
							register.rightAccount = false;
						} else {
							register.rightAccount = true;
						}
					} else {
						$.Huimodalalert(jsonData.message, 1500);
					}
				}
			});
		}
	});
	$("#registerPassword").on("focus", function() {
		$(this).next().text("*");
	});
	$("#registerPassword").on("blur", function() {
		var password = $.trim($("#registerPassword").val());
		if(password.length == 0) {
			$("#registerPassword").next().text("对不起，密码不能为空！");
			register.rightPassword = false;
			return false;
		} else if(password.length < 6) {
			$("#registerPassword").next().text("对不起，密码至少6位！");
			register.rightPassword = false;
			return false;
		} else {
			register.rightPassword = true;
		}
	});
	$("#registerPassword1").on("focus", function() {
		$(this).next().text("*");
	});
	$("#registerPassword1").on("blur", function() {
		var password = $.trim($("#registerPassword").val());
		var passwordC = $.trim($("#registerPassword1").val());
		if(passwordC.length == 0) {
			$("#registerPassword1").next().text("对不起，请再次输入密码确认！");
			register.rightPassword = false;
			return false;
		} else if(password != passwordC) {
			$("#registerPassword1").next().text("两次密码输入不一致！");
			register.rightPassword = false;
			return false;
		} else {
			$("#registerPassword1").next().text("*");
			register.rightPassword = true;
		}
	});
	$("#name").on("focus", function() {
		$(this).next().text("*");
	});
	$("#name").on("blur", function() {
		var name = $.trim($("#name").val());
		if(name.length == 0) {
			$("#name").next().text("对不起，真实姓名不能为空！");
			register.rightName = false;
			return false;
		} else if(!/^[\u4e00-\u9fa5]{2,6}$/.test(name)) {
			$("#name").next().text("对不起，请输入真实姓名！");
			register.rightName = false;
			return false;
		} else {
			$("#name").next().text("*");
			register.rightName = true;
		}
	});
	$("#id_card").on("focus", function() {
		$(this).next().text("*");
	});
	$("#id_card").on("blur", function() {
		var id_card = $.trim($("#id_card").val());
		var checkFlag = new clsIDCard(id_card);
		if(id_card.length == 0) {
			$("#id_card").next().text("对不起，身份证号码不能为空！");
			register.rightId_card = false;
			return false;
		} else if(!checkFlag.IsValid()) {
			$("#id_card").next().text("对不起，输入的身份证号无效,请输入真实的身份证号！");
			register.rightId_card = false;
			return false;
		} else {
			$("#id_card").next().text("*");
			register.rightId_card = true;
		}
	});
	$("#telphone").on("focus", function() {
		$(this).next().text("*");
	});
	$("#telphone").on("blur", function() {
		var telphone = $.trim($("#telphone").val());
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(16[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
		if(telphone.length == 0) {
			$("#telphone").next().text("对不起，手机号码不能为空！");
			register.rightTelphone = false;
			return false;
		} else if(!myreg.test(telphone)) {
			$("#telphone").next().text("对不起，请输入正确的手机号！");
			register.rightTelphone = false;
			return false;
		} else {
			$("#telphone").next().text("*");
			register.rightTelphone = true;
		}
	});
});