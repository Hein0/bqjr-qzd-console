;(function(RCS,$1){
	var utils = RCS.utils;
	var emoji = RCS.emoji;
	var render = utils.render;
	var conversation = {};
	conversation.lastSendTime = 0;
	conversation.messageContent = [];
	var configs = {};//初始化对象
	var listData = {};//查询列表数据
	var parame ={//参数--传参
		"pageNum" :1, // 默认第1页
        "pageSize" :20, // 默认一页20条数据
        "type" : 1,//类型  默认为 1  全部
        "showConversitionList": true
	};
	var voicePlay = null;
	var userInfoValue = {};//保存收集用户信息的相关数据
	var templates = {};
	var $ = utils.$;
	var terminal;
	var supportNot = false;//页面是否支持notification

	//加载模板
	var getTemplates = function(callback){
		templates = RCS.getTemplates();
		callback && callback();
	}

	//键盘回车发送
	var keySend = function(event){
		if (event.keyCode == '13' && !event.shiftKey) {
			event.preventDefault()
			send();
		} else {
			inputChange();
		}
	}
	//发送
	var send = function(){
		var inputMsg = $(".rongcloud-text")[0];
		var message = inputMsg.value;
		if (message) {
			message = emoji.symbolToEmoji(message);
			//提交数据
			sendMessage(new RongIMLib.TextMessage({content:message,extra:"附加信息"}));
			inputMsg.value = '';
			inputMsg.focus();
		}
	}
	//每6秒执行一次正在输入消息发送
	var inputChange = function(){
	 	var timespan = new Date().getTime() - conversation.lastSendTime;
        if (timespan > 1000 * 6) {
            conversation.lastSendTime += timespan;
            sendTyping();
        }
	}
	//正在输入中
	var sendTyping = function(){
        if (conversation.targetType == RongIMLib.ConversationType.CUSTOMER_SERVICE) {
        	var msg = new RongIMLib.TypingStatusMessage({
                typingContentType:'RC:TxtMsg',
                data:null
            });
            var callback = function(){};
            sendMessage(msg,callback);
        }
	}
	//显示表情
	var showemoji = function(event){
		event.stopPropagation();
		var emojiContent = $('.rongcloud-expressionWrap')[0];
		if (emojiContent.style.display == 'none') {
			utils.show(emojiContent);
		} else {
			utils.hide(emojiContent);
		}
	}
	//表情点击
	var chooseEmoji = function(event){
		event.stopPropagation();
		var emojiContent = $('.rongcloud-expressionWrap')[0];
		var thisTarget = event.target || event.srcElement;
		var textArea = $('.rongcloud-text')[0];
		var emojiName = thisTarget.getAttribute('name');
		if (emojiName) {
			textArea.value += emojiName;
			utils.hide(emojiContent);	
			if (terminal == 'pc') {
				textArea.focus();
				range = document.createRange();
				range.selectNodeContents(textArea);
				range.collapse(true);
				range.setEnd(textArea, textArea.childNodes.length);
				range.setStart(textArea, textArea.childNodes.length);
				sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			}
		}
	}

	function textMessageFormat(content) {
	    if(content.length === 0){
	        return '';
	    }

	    content = utils.encodeHtmlStr(content);

	    content = utils.replaceUri(content, function(uri, protocol) {
	        var link = uri;
	        if (!protocol) {
	            link = 'http://' + uri;
	        }
	        return '<a class="rong-link-site" target="_blank" href="'+ link +'">' + uri + '</a>';
	    });

	    content = utils.replaceEmail(content, function(email) {
	        return '<a class="rong-link-email" href="mailto:' + email + '">' + email + '<a>';
	    });

	    return emoji.emojiToHTML(content, 18);
	}

	//发送消息---提交消息
	var sendMessage = function(msg,callback){
		var targetId = conversation.id; // 目标 Id
		var data ={};
			data.toUserId = targetId;// 发送目标 Id
			data.messageName = msg.messageName;//消息类型
			data.imageUri = msg.imageUri ? msg.imageUri : "";//如果是图片就传
			data.content = msg.content;//文本内容
		$1.ajax({
          	type: "post",
          	url: base + "im/sendPrivateMsg",
          	processData: false,
          	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
          	dataType: "json",
          	data: JSON.stringify(data),
          	success: function(res) {
            	var templa = {};
	        	if(res.status=="0" && res.data){
	        		callback && callback();
	                if (!callback) {
	//              	updateConversationList();
	                	updateMessage(res.data);//显示消息
	                }
	        	}
          	}
        });		

	}

	//显示新消息
	var updateMessage = function(message){
		if (message.messageType == 'ReadReceiptMessage') {
			return;//ReadReceiptMessage的messageType  
		}else if(message.messageType != 'TextMessage' && message.messageType != 'ImageMessage' && message.messageType != 'RichContentMessage'){
			return;//SyncReadStatusMessage
		}
		//监听到数据后刷新聊天会话列表
		setTimeout(function(){
			createIMConversation(RCS.config,parame.type);
		},2000)
		
		if (message.targetId != conversation.id) {
			pushMessage(message);
			return
		}
		
		conversation.messageContent.push(message);
		var newMessage = modifyMessage(utils.cloneObj(message));
		if (message.messageDirection != 1 && supportNot) {
			if(message.messageType != 'TypingStatusMessage'){
				pushMessage(newMessage);
			}
		}
		var messageList = $(".rcs-message-box")[0];
		if (!messageList) {
			return;
		}
		if (newMessage.sentTime - conversation.lastSendTime >= 60000) {//超过1分钟
			var messageTime = {};
			messageTime.content = {};
			messageTime.messageType = 'TimeMessage';
			messageTime.sentTime = utils.getTime(newMessage.sentTime);
			messageList.innerHTML += render(templates.imMessageTemplate,messageTime);
			conversation.lastSendTime = newMessage.sentTime;
		}
		newMessage.logo = conversation.logo ? conversation.logo : "images/touxiang.png" ;
		newMessage.hosLogo = RCS.config.logoUrl ? RCS.config.logoUrl : "images/touxiang.png" ;
		newMessage.targetId = conversation.name ? conversation.name : newMessage.targetId;
		messageList.innerHTML += render(templates.imMessageTemplate,newMessage);
		messageList.scrollTop = messageList.scrollHeight;
	}

	//web push message消息提醒
	var pushMessage = function(msg){
		if (terminal == 'pc') {
			var title = '消息提醒';
			var options = {
		        body: "您有一条新消息，请及时回复",
		        icon: (msg.content.user&&msg.content.user.icon) ? msg.content.user.icon : "./images/kefu.png",
		    };
		    var notification = new Notification(title,options);

		    notification.onclick = function(event) {
		        window.focus();
		        notification.close();
		    }
		    notification.onshow = function() {  
	            setTimeout(function() {  
	                notification.close();
	            }, 5000);  
	        };
		}
	}

	//图片新消息图片加载完毕滚动到最下面
	var scrollBottom = function(){
		var messageList = $(".rcs-message-box")[0];
		messageList.scrollTop = messageList.scrollHeight;
	}
	//加载历史消息
	var loadHisMessages = function(){
		var callbacks = function(list,hasMsg){
			var messageBox = $(".rcs-message-box")[0];
			var messageList = {};
			messageList.hasMore = hasMsg;
			messageList.logo = conversation.logo ? conversation.logo :"images/touxiang.png";//用户头像
			messageList.hosLogo = RCS.config.logoUrl ? RCS.config.logoUrl : "images/touxiang.png" ;//医院头像
			messageList.list = modificateMessage(conversation.messageContent);//修饰消息
			var oldHeight = messageBox.scrollHeight;
			messageBox.innerHTML = render(templates.imMessage,messageList);
			var newHeight = messageBox.scrollHeight;
			messageBox.scrollTop = newHeight-oldHeight;
		}
		getHisMessage(conversation.id,null,20,callbacks);
	}
	//创建列表数据--获取列表数据
	var createIMConversation = function(config,val){
		var datas = {};
		$1.ajax({
          	type: "post",
          	url: base + "im/queryConversationList",
          	processData: false,
          	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
          	dataType: "json",
          	data: JSON.stringify(parame),
          	success: function(res) {
	        	if(res.status=="0"){
	        		listData.list = res.data.length>0 ? timestampFun(res.data) : res.data;
	        		$(".btn-primary")[0].children[0].innerText = res.dataCount;//切换时更新数据
	        		listData.list.length<res.dataCount? listData.isMore = true : listData.isMore = false;
	//            	datas.conversationList = render(templates.conversation, obj);
	//				$(".customer-service")[0].innerHTML = render(templates.imMain,datas);
					$(".customer-service")[0].innerHTML = '';
					datas = render(templates.conversation, listData);
					$(".customer-service")[0].innerHTML = datas;
	        	}
          	}
        });
		
//		var callback = function(list){
//			var obj = {};
//			obj.list = list;
//			data.conversationList = render(templates.conversation, obj);
//			$(".customer-service")[0].innerHTML = render(templates.imMain,data);
//		}
//		getConversationList(callback);
	}
	//时间戳转换
	var timestampFun = function(list){
		for (var i = 0; i < list.length; i++) {
			list[i].lastMsg.sentTime = utils.getTime(list[i].lastMsg.sentTime)
		}
		return list
	}
	//查看更多数据
	var moreDataList = function(event){
		parame.pageNum = parame.pageNum + 1;

		$1.ajax({
          	type: "post",
          	url: base + "im/queryConversationList",
          	processData: false,
          	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
          	dataType: "json",
          	data: JSON.stringify(parame),
          	success: function(res) {
            	var templa = {};
	        	if(res.status=="0"){
	        		listData.list = res.data.concat(listData.list);
	        		listData.list.length<res.dataCount? listData.isMore = true : listData.isMore = false;                  
	        		
					$(".customer-service")[0].innerHTML = '';
					templa = render(templates.conversation, listData);
					$(".customer-service")[0].innerHTML = templa;
	        	}
          	}
        });

	}

	//开始会话
	var startConversation = function(event){
		var thisTarget = event.target || event.srcElement;
		if (thisTarget.className.indexOf('rongcloud-sprite') != -1) {
			event.currentTarget.parentNode.removeChild(event.currentTarget);
			removeConversation(event.currentTarget.getAttribute("_cid"));
			if (conversation.id == event.currentTarget.getAttribute("_cid")) {
				$('.rcs-chat-wrapper')[0].innerHTML = '';
			}
			return;
		}
		if (conversation.id == event.currentTarget.getAttribute("_cid") && $('.rcs-chat-wrapper')[0].innerHTML !="") {
			return;
		}
		conversation.messageContent = [];
		conversation.id = event.currentTarget.getAttribute("_cid");//目标id
		conversation.name = event.currentTarget.getAttribute("_name");//目标名称
		conversation.logo = event.currentTarget.getAttribute("_logo");//目标头像
		conversation.mcount = event.currentTarget.getAttribute('_mcount');
		if (conversation.mcount != 0) {
			var badge = event.currentTarget.querySelector('.rongcloud-badgeNub');
			if (badge) {
				badge.parentNode.removeChild(badge);
				clearUnreadCount(conversation.id);
			}
		}
		//打开会话
		openConversation(conversation);
	}

	//删除会话
	var removeConversation = function(targetId){
		RongIMClient.getInstance().removeConversation(RongIMLib.ConversationType.PRIVATE,targetId,{
		    onSuccess:function(bool){
		    	console.log('删除会话成功');
		       // 删除会话成功。
		    },
		    onError:function(error){
		       // error => 删除会话的错误码
		    }
		});
	}

	//获取会话列表
	var getConversationList = function(callback){
		RongIMClient.getInstance().getConversationList({
		  	onSuccess: function(list) {
		  		//用户信息处理 http://support.rongcloud.cn/kb/NjQ5
		  		var _list = [];
		    	for (var i = 0; i < list.length; i++) {
		    		if (list[i].conversationType == RongIMLib.ConversationType.PRIVATE) {
		    			_list.push(list[i]);
		    		}
		    	}
		    	var temp = _list[0];
		    	for (var i = 0; i < _list.length; i++) {
		    		for (var j = i+1; j < _list.length; j++) {
		    			if (_list[i].sentTime < _list[j].sentTime) {
		    				var temp = _list[i];
		    				_list[i] = _list[j];
		    				_list[j] = temp;
		    			}
		    		}
		    	}
		    	callback && callback(_list);
		  	},
		  	onError: function(error) {
		     	// do something...
		  	}
		},null);
	}

	//更新会话列表
	var updateConversationList = function(){
		var callback = function(list){
			var obj = {};
			obj.list = list;
			$('.rcs-conversation-list')[0].innerHTML = render(templates.conversation, obj);
		}
		getConversationList(callback);
	}

	//清除未读消息数
	var clearUnreadCount = function(targetId){
		var conversationType = RongIMLib.ConversationType.PRIVATE;
		RongIMClient.getInstance().clearUnreadCount(conversationType,targetId,{
		    onSuccess:function(){
		    	console.log('清除未读消息成功');
		        // 清除未读消息成功。
		    },
		    onError:function(error){
		        // error => 清除未读消息数错误码。
		    }
		});
	}

	//进入指定会话
	var openConversation = function(conversation){
		conversation.targetType = RongIMLib.ConversationType.PRIVATE;
		var chat = $(".rcs-chat-wrapper")[0];
		var callbacks = function(list,hasMsg){
			var data = {};
			var messageList = {};
			messageList.firstEnter = true;
			messageList.list = modificateMessage(list);//修饰消息
			//聊天列表模板
			messageList.logo = conversation.logo ? conversation.logo :"images/touxiang.png";//用户头像
			messageList.hosLogo = RCS.config.logoUrl ? RCS.config.logoUrl : "images/touxiang.png" ;//医院头像
			data.messageList = render(templates.imMessage, messageList);
			data.targetName = '用户：'+conversation.name;//用户名字
			data.terminal = terminal;
			//聊天框总模板
			$(".rcs-chat-wrapper")[0].innerHTML = render(templates.chat, data);
			scrollBottom();
			utils.hide($('.rongcloud-mode2')[0]);
			utils.show($('.rongcloud-mode1')[0]);
			//初始化表情
			var emojiList = emoji.getEmoji();
			var strHtml = '';
			for (var i = 0; i < emojiList.length; i++) {
				strHtml += '<div class="emojiItem">'+emojiList[i].outerHTML+'</div>';
			}
			$('.rongcloud-expressionContent')[0].innerHTML += strHtml;

			if (hasMsg) {
				$('.rongcloud-Messages-history')[0].style.display = 'block';
			}
		}
		var count = conversation.mcount < 2 ? 2 : (conversation.mcount > 20 ? 20 : conversation.mcount);
		//获取会话列表数据
		getHisMessage(conversation.id,0,parseInt(count),callbacks);
	}

	//拉取历史消息记录
	var getHisMessage = function(conversationId,timestrap,count,callbacks){
		var conversationType = RongIMLib.ConversationType.PRIVATE; //私聊,其他会话选择相应的消息类型即可。
		var targetId = conversationId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
		// timestrap默认传 null，若从头开始获取历史消息，请赋值为 0 ,timestrap = 0;
		// count每次获取的历史消息条数，范围 0-20 条，可以多次获取。
		var data = {};
		data.messageId = conversation.messageContent.length>0 ? conversation.messageContent[0].messageId :'';
		data.imUserId = targetId;
		data.count = count;
		$1.ajax({
          	type: "post",
          	url: base + "im/queryMessageList",
          	processData: false,
          	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
          	dataType: "json",
          	data: JSON.stringify(data),
          	success: function(res) {
	        	if(res.status=="0"){
	        		var hasMsg = res.data.hasData;
					conversation.messageContent = res.data.rows.concat(conversation.messageContent);
				  	callbacks(res.data.rows,hasMsg);
	        	}
          	}
        });

		
//		RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
//		  onSuccess: function(list, hasMsg) {
//		  	conversation.messageContent = list.concat(conversation.messageContent);
//		  	callbacks(list,hasMsg);
//		  },
//		  onError: function(error) {
//		    console.log("GetHistoryMessages,errorcode:" + error);
//		  }
//		});
	}

	//单条消息修饰
	var modifyMessage = function(msg){
		if (msg.messageType == 'TextMessage') {
			msg.content.content = textMessageFormat(msg.content.content);
		} else if (msg.messageType == 'FileMessage') {
			msg.content.size = utils.getFileSize(msg.content.size);	
		} else if (msg.messageType == 'VoiceMessage'){
			RongIMLib.RongIMVoice.preLoaded(msg.content.content);
		}
		return msg;
	}

	//消息修饰，2条消息之间相差6000毫秒，显示消息发送时间
	var modificateMessage = function(list){
		var listTemp = JSON.parse(JSON.stringify(list));
		var _list = [];
		for (var i = 0; i < listTemp.length; i++) {
			var messageTime = {
				sentTime: utils.getTime(listTemp[i].sentTime),
				messageType: 'TimeMessage'
			};
			var messageMap = [
				"TextMessage",
				"FileMessage",
				"SightMessage",
				"ImageMessage",
				"VoiceMessage",
				"RichContentMessage",
				"TypingStatusMessage",
			];
			if (messageMap.indexOf(listTemp[i].messageType) >= 0) {
				listTemp[i] = modifyMessage(listTemp[i]);
			} else {
				listTemp[i].messageType = 'UnknownMessage';
			}
			if (i == 0) {
				_list.push(messageTime);
			}else if (listTemp[i].sentTime - listTemp[i-1].sentTime >= 60000) {
				_list.push(messageTime);
			}
			_list.push(listTemp[i]);
		}
		return _list;
	}

	//播放音频
	var play = function(event, msgContent){
		RongIMLib.RongIMVoice.stop();
		var thisTarget = event.target || event.srcElement;
		if (thisTarget.className.indexOf('rongcloud-animate') != -1) {
			thisTarget.className = thisTarget.className.replace(' rongcloud-animate','');
			clearTimeout(voicePlay);
		} else {
			var audioStatusNode = thisTarget.parentNode.querySelector('.rongcloud-audioState');
			if (audioStatusNode) {
				audioStatusNode.parentNode.removeChild(audioStatusNode);
			}
			if (voicePlay) {
				clearTimeout(voicePlay);
				var voiceList = $('.rongcloud-audioBox');
				for (var i = 0; i < voiceList.length; i++) {
					voiceList[i].className = 'rongcloud-audioBox rongcloud-clearfix';
				}
			}
			RongIMLib.RongIMVoice.play(msgContent.content, msgContent.duration);
			thisTarget.className = thisTarget.className +' rongcloud-animate';
			voicePlay = setTimeout(function(){
				thisTarget.className = thisTarget.className.replace(' rongcloud-animate','');
			},msgContent.duration * 1000);
		}
	}

	//播放视频
	var playVideo = function (event) {
		var video = event.currentTarget.querySelector('video');
        var btn = event.currentTarget.querySelector('.play-btn');
        if (video.paused) {
            video.play();
            btn.style.display = "none";
        } else {
            video.pause();
            btn.style.display = "block";
        }
        video.onended = function () {
            btn.style.display = "block";  
        }
	}


	//img上传图片
	var imgUpload = function(event){
		var thisTarget = event.target || event.srcElement;
		var _file = thisTarget.files;
		for (var i = 0; i < _file.length; i++) {
//			RCS.imageStartUpload(_file[i],function(data){
//				console.log("文件上传完成：", data);
//				getFileUrl(data);
//			});
			upPictures(_file);
		}
		thisTarget.value = '';
	}
	//上传文件
	var fileUpload = function(event){
		var thisTarget = event.target || event.srcElement;
		var _file = thisTarget.files;
		for (var i = 0; i < _file.length; i++) {
			RCS.fileStartUpload(_file[i],function(data){
				console.log("文件上传完成：", data);
				getFileUrl(data);
			});
		}
		thisTarget.value = '';
	}
	//上传图片
	var upPictures = function(obj){
		var targetId = conversation.id; // 目标 Id
		let param = new FormData(); //创建form对象
			param.append("file", obj[0]); //通过append向form对象添加数据s
			param.append("imUserId", targetId); 
		$1.ajax({
		    url: base + "im/sendImage",
		    type: 'POST',
		    cache: false, //上传文件不需要缓存
		    data: param,
		    processData: false, // 告诉jQuery不要去处理发送的数据
		    contentType: false, // 告诉jQuery不要去设置Content-Type请求头
		    success: function (res) {
		    	if(res.status == "0" && res.data){
	              	updateMessage(res.data);//显示消息
				}
		    },
		    error: function (data) {
		       console.log("上传失败");
		    }
		})  

	}

	var urlItem = {
		file: function(data){
			if (RCS.config.fileConfig && RCS.config.fileConfig.isPrivate) {
				if (data.rc_url.type == 1) {
					data.downloadUrl = data.rc_url.path;
				} else {
					data.downloadUrl = RCS.config.fileConfig.fileServer + data.rc_url.path;
				}
				var msg = messageItem[data.fileType](data);
				sendMessage(msg);
			} else {
				var fileType = RongIMLib.FileType.FILE;
				RongIMClient.getInstance().getFileUrl(fileType, data.filename, data.name, {
					onSuccess: function(result){
						data.downloadUrl = result.downloadUrl;
						var msg = messageItem[data.fileType](data);
						sendMessage(msg);
					},
					onError: function(error){
						showResult('getFileToken error:' + error);
					}
				});
			}
		},
		image: function(data){
			if (RCS.config.upload && RCS.config.upload.isPrivate) {
				if (data.rc_url.type == 1) {
					data.downloadUrl = data.rc_url.path;
				} else {
					data.downloadUrl = RCS.config.upload.fileServer + data.rc_url.path;
				}
				var msg = messageItem[data.fileType](data);
				sendMessage(msg);
			} else {
				var fileType = RongIMLib.FileType.IMAGE;
				RongIMClient.getInstance().getFileUrl(fileType, data.filename, null, {
					onSuccess: function(result){
						data.downloadUrl = result.downloadUrl;
						var msg = messageItem[data.fileType](data);
						sendMessage(msg);
					},
					onError: function(error){
						console.log(error);
					}
				});
			}
		}
	};
	var messageItem = {
        file: function(file){
            var name = file.name || '',
            index = name.lastIndexOf('.') + 1,
            type = name.substring(index);
            // 发送文件消息请参考： http://rongcloud.cn/docs/web_api_demo.html#发送消息
            // 创建文件消息
            return new RongIMLib.FileMessage({ name: file.name, size: file.size, type: type, fileUrl: file.downloadUrl});
        },
        image: function(image){
            return new RongIMLib.ImageMessage({content: image.thumbnail, imageUri: image.downloadUrl});
        }
    };

	var getFileUrl = function(data){
		urlItem[data.fileType](data);
	}

	//关闭聊天窗口
	var endConversation = function(){
		$('.rcs-chat-wrapper')[0].innerHTML = '';
	}

	//最小化
	var minimize = function(){
		utils.hide($('.customer-service')[0]);
	}

	//预览图片
	var viewImage = function(event){
		var thisTarget = event.target || event.srcElement;
		var image = {
			imageUrl: thisTarget.getAttribute('data-img')
		}
		$('.imageViewBox')[0].innerHTML = render(templates.imageView,image);
		utils.fadein($('.imageViewBox')[0]);
	}
	var escImageView = function(){
		$('.imageViewBox')[0].innerHTML = '';
		utils.fadeout($('.imageViewBox')[0]);
	}

	
	//隐藏表情
	var hideEmoji = function(){
		var emojiContent = $('.rongcloud-expressionWrap')[0];
		if (emojiContent) {
			utils.hide(emojiContent);
		}
	}

	//tab点击事件
	var tabShow = function($obj,val){
//		var statu = $obj.attr('val');
		parame.type = val;//改变类型
		parame.pageNum = 1;//切换 初始化为1
		$obj.addClass('btn-primary');
		$obj.siblings().removeClass('btn-primary').not(".todayText").addClass('btn-default');
		//更换用户聊天列表数据
		createIMConversation(RCS.config,val);
	}

	//im组件初始化
	var init = function(config){
		RCS.config = config;
		config.isIM = true;
		var callbacks = {
			getInstance: function(instance){
				var callback = function(){
					if (RCS.config.templates) {
						for (var index in RCS.config.templates) {
							templates[index] = RCS.config.templates[index];
						}
					}
				}
				getTemplates(callback);//获取模板
				emoji.init();//初始化表情
				createButton(config);//创建组件
			},
			getCurrentUser: function(userId){
				showInfo(userId);
			}
		}
		//初始化sdk
		sdkInit(config,callbacks);
	}
	
	//初始化创建tab
	var createButton = function(config){
		$1.ajax({
          	type: "get",
          	url: base + "im/queryConversationCount",
          	processData: false,
          	contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
          	dataType: "json",
          	data: {},
          	success: function(res) {
	        	if (res.status == '0' && res.data) {
	               	config.target.innerHTML = render(templates.button,res.data);
					createIMConversation(config,"1");//初始化创建聊天用户列表	
					addListener(config);//添加监听
	                
	            }else {
	               console.log("初始化创建tab失败")
	            }
          	}
        });
        //创建完成后隐藏加载中
		utils.hide($('.loadings')[0]);
	}
	
	//添加监听
	var addListener = function(config){
		var callback = function(phoneOrPc){
			terminal = phoneOrPc;
		}
		utils.browserRedirect(callback);//检查是什么设备
		if (terminal == 'pc') {
			document.body.onclick = function(){
				hideEmoji();
			}
			if (Notification.permission === "granted") {
			    supportNot = true;
			}
			// Otherwise, we need to ask the user for permission
			else if (Notification.permission !== "denied") {
			    Notification.requestPermission(function (permission) {
			        // If the user accepts, let's create a notification
			        if (permission === "granted") {
			            supportNot = true;
			        }
			    });
			}
		} else {
			document.body.ontouchstart = function(event){
				if (event.target.className.indexOf('emojiItem') < 0 && event.target.className.indexOf('rong-emoji-content') < 0 && event.target.className.indexOf('rongcloud-expressionContent') < 0 ) {
					hideEmoji();
				}
				if (event.target.className.indexOf('rongcloud-rong-btn') < 0 && event.target.className.indexOf('rongcloud-text') < 0) {
					var inputMsg = $(".rongcloud-text")[0];
					if (inputMsg) {
						inputMsg.blur();
					}
				}
			}
		}
	}
	
	//sdk初始化
	var sdkInit = function(params, callbacks){
		var appKey = params.appKey;
		var token = params.token;
		var navi = params.navi || "";

		if(navi !== ""){
			//私有云
			var config = {
				navi : navi
			};
			console.log("私有云");
//			console.log(params);
			RongIMLib.RongIMClient.init(appKey,null,config);
		}else{
			//公有云
			console.log("公有云");
//			console.log(params);
			RongIMLib.RongIMClient.init(appKey);
		}

		var instance = RongIMClient.getInstance();

		// 连接状态监听器
		RongIMClient.setConnectionStatusListener({
			onChanged: function (status) {
				console.log(status);
				var connectDom = $('.rcs-connect-status')[0];
				if (connectDom) {
					connectDom.style.display = 'block';
				}
			    switch (status) {
			        case RongIMLib.ConnectionStatus.CONNECTED:
			        	if (connectDom) {
							connectDom.style.display = 'none';
						}
			            callbacks.getInstance && callbacks.getInstance(instance);
			            break;
			        case RongIMLib.ConnectionStatus.CONNECTING:
		                console.log('正在链接');
		                break;
		            case RongIMLib.ConnectionStatus.DISCONNECTED:
		                console.log('断开连接');
		                break;
		            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
		                console.log('其他设备登录');
		                break;
	              	case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
		                console.log('域名不正确');
		                break;
		            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
		              	console.log('网络不可用');
		                break;
			        case RongIMLib.ConnectionStatus.DISCONNECTED:
	                	console.log('断开连接');
		                break;
	                case 4:
	                	console.log('token无效');
		                break;
	                default:
	                	console.log('未知错误');
		                break;
			        }
			}
		});
		//监听消息
		RongIMClient.setOnReceiveMessageListener({
			// 接收到的消息
			onReceived: function (message) {
			    // 判断消息类型
			    console.log("新消息: " + message.targetId);
			    if (message.offLineMessage) {
			    	return;
			    }
	            console.log(message);
	            if (message.conversationType == RongIMLib.ConversationType.PRIVATE) {
//	            	if (message.targetId == conversation.id) { }
	            		updateMessage(message);//显示新消息
	            		clearUnreadCount(conversation.id);//清除未读消息数
	               
//	            	updateConversationList();//更新会话列表
	            }
			}
		});

		//开始链接
		RongIMClient.connect(token, {
			onSuccess: function(userId) {
				callbacks.getCurrentUser && callbacks.getCurrentUser(userId);
				console.log("链接成功，用户id：");

			},
			onTokenIncorrect: function() {
				console.log('token无效');
			},
			onError:function(errorCode){
				console.log("=============================================");
				console.log(errorCode);
			}
		});
	}
	
	//H5唤醒键盘的时候输入框显示在视野内
	var keyboard = function(event){
		var thisTarget = event.target || event.srcElement;
		setTimeout(function(){
			thisTarget.scrollIntoView(true);
		},500)
	}

	//页面显示当前用户信息
	var showInfo = function(userId){
//		var dialog = document.createElement('h2');
//		dialog.innerText = '当前用户：';
//		var userInfo = document.createElement('span');
//		var app = document.getElementById("groupSearch");
//		userInfo.innerText = userId;
//		dialog.val(userId);
//		app.appendChild(dialog);
//		document.getElementById("groupSearch").value = userId
	}

	//对外暴露
	RCS.init = init;
	RCS.send = send;
	RCS.keySend = keySend;
	RCS.showemoji = showemoji;
	RCS.chooseEmoji = chooseEmoji;
	RCS.loadHisMessages = loadHisMessages;
	RCS.scrollBottom = scrollBottom;
	RCS.imgUpload = imgUpload;
	RCS.fileUpload = fileUpload;
	RCS.endConversation = endConversation;
	RCS.play = play;
	RCS.playVideo = playVideo;
	RCS.minimize = minimize;
	RCS.tabShow = tabShow;
	RCS.confirm = confirm;
	RCS.close = close;
	RCS.viewImage = viewImage;
	RCS.escImageView = escImageView;
	RCS.keyboard = keyboard;
	RCS.startConversation = startConversation;
	RCS.moreDataList = moreDataList;//查看更多消息
})(RCS,jQuery);