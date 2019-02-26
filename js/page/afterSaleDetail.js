var serveDetail = {
	init: function () {
		this.assId = util.getQueryString('assId') || '';
		this.assServiceId = util.getQueryString('assServiceId') || '';
		this.companyName = '';
		this.jdExpressId = '';
		this.agreeInfo = '';
		this.tipsPopShow = false;
		this.goodsCount = 1;
		this.bindEvents();
		this.queryData();
	}
	
	,bindEvents: function () {
		var self = this;
		
		//点击关闭弹窗按钮
		$('.close, .pop_close').on('click',function () {
			if (self.goodsCount > 1) {
				self.tipsPopShow = true;
			}
		})
		//点击右上角按钮
		$('.statusBtn').on('click',function () {
			self.popShow(this)
		})
		$('.imgList').on('click','img',function () {
			$(this).toggleClass('imgSize')
			$(this).siblings().removeClass('imgSize')
		})
		//点击取消售后
		$('.cancelBtn').on('click',function () {
			self.popShow(this)
		})
		//弹窗确认收货
		$('.goods_comfirm_wrap').on('click',function () {
			self.comfirmFn(this)
		})
		//弹窗拒绝收货
		$('.goods_refuse_wrap').on('click',function () {
			self.refuseFn(this)
		})
		//退换货审核弹窗点击确认
		$('#pop_apply_agree').on('click',function () {
			$('#pop-reason-info').val(self.agreeInfo)
		})
		//退换货审核弹窗点击拒绝
		$('#pop_apply_refuse').on('click',function () {
			$('#pop-reason-info').val("您的退/换货申请审核不通过，原因：")
		})
		//退款选择其他
		$('#others').on('change',function () {
			$('#otherReason').attr('disabled',false)
		})
		//退款选择非其他
		$('.noOthers').on('click',function () {
			$('#otherReason').attr('disabled',true)
		})
		//点击弹窗确定
		$('.pop_sure').on('click',function () {
			self.popSure(this)
		})
	}
	
	//点击右上角状态按钮
	,popShow: function (el) {
		var assType = $(el).attr('assType');
		var statusStr = $(el).text();
		$('.pop_sure').attr('assType',assType)
		if (assType == 1) {
			switch (statusStr){
				case "退货审核":
					$('.modal-title').text("退货审核")
					$('.pop-check').show().siblings('div').hide()
					if (this.goodsCount > 1) {
						$('.pop-check .pop-check-tips').show()
					}
					this.initCheck()
					break;
				case "确认收货":
					$('.modal-title').text("确认收货")
					$('.pop-changeGoods').show().siblings('div').hide()
					break;
				case "取消售后":
					$('.modal-title').text("取消售后")
					$('.cancel').show().siblings('div').hide()
					break;
				default:
					$('.modal-title').text("退款审核")
					$('.pop-refund-wrap').show().siblings('div').hide()
					if (this.goodsCount > 1) {
						$('.pop-refund-wrap .pop-check-tips').show()
					}
					this.initRefund()
					break;
			}
		} else if (assType == 2) {
			switch (statusStr){
				case "换货审核":
					$('.modal-title').text("换货审核")
					$('.pop-check').show().siblings('div').hide()
					this.initCheck()
					break;
				case "确认收货":
					$('.modal-title').text("确认收货")
					$('.pop-changeGoods').show().siblings('div').hide()
					break;
				case "取消售后":
					$('.modal-title').text("取消售后")
					$('.cancel').show().siblings('div').hide()
					break;
				default:
					$('.modal-title').text("填写物流")
					$('.pop_express_wrap').show().siblings('div').hide()
					this.initExpress()
					break;
			}
		}
		$("#modal-demo").modal("show")
	}
	
	//确认收货
	,comfirmFn: function (el) {
		$('.pop_comfirm_tips').show();
		$('.pop_refuse_wrap').hide();
	}
	//拒绝收货
	,refuseFn: function (el) {
		$('.pop_comfirm_tips').hide();
		$('.pop_refuse_wrap').show();
	}
	//点击弹窗确定
	,popSure: function (el) {
		var assType = $(el).attr('assType');
		var statusStr = $('.modal-title').text()
		if (assType == 1) {
			switch (statusStr){
				case "退货审核":
				if (this.tipsPopShow) {
					this.tipsPopShow = false;
					$('.pop-submit-wrap').show().siblings('div').hide()
				} else{
					this.returnCheck()
				}
					break;
				case "确认收货":
					this.returnComfirm()
					break;
				case "取消售后":
					this.cancelFn()
					break;
				default:
					if (this.tipsPopShow) {
						this.tipsPopShow = false;
						$('.pop-submit-wrap').text("审核退款时，请先线下确认客户该单全部商品数量已退货至商家")
						$('.pop-submit-wrap').show().siblings('div').hide()
					} else{
						this.refundSure()
					}//退款审核
					break;
			}
		} else if (assType == 2) {
			switch (statusStr){
				case "换货审核":
					this.returnCheck()
					break;
				case "确认收货":
					this.returnComfirm()
					break;
				case "取消售后":
					this.cancelFn()
					break;
				default://填写物流
					this.expressSure()
					break;
			}
		}
	}
	//确认收货
	,returnComfirm: function () {
		var self = this;
		var data = {};
		var type = $('.pop-changeGoods input[type="radio"]:checked').val();
		data['type'] = type
		if (type == 2) {
			data['refuseReason'] = $('#pop_refuse_select option:checked').text();
			var sendContent = $('#pop-refuse-reason').val();
			if (!sendContent) {
				$.Huimodalalert("请输入推送内容", 2000);
				return;
			}
			data['sendContent'] = sendContent
		}
		data['assId'] = self.assId
		$.post(base + 'afterSales/confirmSendStatus.do',data,function (res) {
			if (res.status != 0) {
				$.Huimodalalert(res.message, 2000);
			} else {
				$('.pop-changeGoods').hide();
				$("#modal-demo").modal("hide");
				self.queryData();
			}
		})
	}
	//退换货审核初始化
	,initCheck: function () {
		var self = this;
		$.get(base + 'afterSales/auditAfterSaleInit.do',{assId:self.assId},function (res) {
			if (res.status == 0) {
				self.agreeInfo = res.data.cause + "收货地址：" + res.data.reason.addressDetail + ";收件人：" + res.data.business.contacts + ";电话：" + res.data.business.mobile;
//				$('#pop-reason-info').val(self.agreeInfo)
				$('.backTo').text(res.data.business.companyName)
			} else{
				$.Huimodalalert(res.message, 2000);
			}
		})
	}
	//退换货审核
	,returnCheck: function () {
		var self = this;
		var data = {};
		var type = $('.pop-check input[type="radio"]:checked').val();
		var resson = $('#pop-reason-info').val()
		var url;
		if ($('.modal-title').text() == "退货审核") {
			url = 'afterSales/applyReturned.do'
		} else{
			url = 'afterSales/applyReplace.do'
		}
		
		data['assId'] = self.assId
		data['type'] = type
		data['resson'] = resson
		
		$.post(base + url,data,function (res) {
			if (res.status != 0) {
				$('.pop-check').show().siblings('div').hide()
				$.Huimodalalert(res.message, 2000);
			} else {
				$('.pop-check').hide();
				$("#modal-demo").modal("hide");
				self.queryData();
			}
		})
	}
	//退款审核初始化数据
	,initRefund: function () {
		var self = this;
		$.get(base + 'afterSales/refundInit.do',{assId:self.assId},function (res) {
			if (res.status == 0) {
				$('.pop-orderNo').text(res.data.tradeInfo.tradeId)
				$('.pop-assServiceId').text(res.data.afterSales.assServiceId)
				$('.pop-amount').text(res.data.tradeInfo.amount)
				$('.pop-cash').text(res.data.tradeInfo.payAmount)
				$('.pop-loan').text(res.data.tradeInfo.loadAmount)
				$('.pop-most-inp').val(res.data.tradeInfo.payAmount)
				$('.pop-most').text(res.data.tradeInfo.payAmount)
			} else {
				$.Huimodalalert(res.message, 2000);
			}
		})
	}
	//退款审核点击确定
	,refundSure: function () {
		var self = this;
		var data = {};
		var money = Number($('.pop-most-inp').val()) ;
		var mostMoney =Number($('.pop-most').text()) ;
		var remark = $('.pop-refund-wrap input[type="radio"]:checked').val();
		var remarkLen = $('.pop-refund-wrap input[type="radio"]:checked').length;
		var numReg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
		if (!money && money !== 0) {
			$.Huimodalalert("请输入实际退款金额", 2000);
			return;
		} else if (!numReg.test(money)) {
			$.Huimodalalert("实际退款金额只能为数字", 2000);
			return;
		} else if (money > mostMoney) {
			$.Huimodalalert("最多只能退款" + mostMoney + "元", 2000);
			return;
		}
		if (!remarkLen) {
			$.Huimodalalert("请选择退款原因", 2000);
			return;
		}
		if (!remark) {
			remark = $('#otherReason').val();
			if (!remark) {
				$.Huimodalalert("请输入退款原因", 2000);
				return;
			}
		}
		data['assId'] = self.assId;
		data['money'] = money;
		data['remark'] = remark;
		$.post(base + 'afterSales/refund.do',data,function (res) {
			if (res.status == 0) {
				$('.pop-refund-wrap').hide();
				$("#modal-demo").modal("hide");
				self.queryData();
			} else{
				$('.pop-refund-wrap').show().siblings('div').hide()
				$.Huimodalalert(res.message, 2000);
			}
		})
	}
	//获取物流公司
	,initExpress: function () {
		var self = this;
		$.post(base + 'trade/getCreditExpressInfoList.do',function (res) {
			if (res.status == 0) {
				var opt = '';
				$.each(res.data, function(i,item) {
					opt += '<option value="'+ item.expressId +'" expressCode="'+ item.expressCode +'">'+ item.expressName +'</option>';
					if (item.expressName == "京东商城") {
						self.jdExpressId = item.expressId;
					}
				});
				$('#pop_express_select').append($(opt))
				if (self.companyName == "京东商城") {
					$('#pop_express_select').val(self.jdExpressId)
				}
			} else {
				$.Huimodalalert(res.message, 2000);
			}
		})
	}
	//提交物流信息
	,expressSure: function function_name () {
		var self = this;
		var data = {};
		var expressId = $('#pop_express_select').val()
		var expressCode = $('#pop_express_select option:checked').attr('expressCode')
		var logisticsNo = $('#pop_exp_num').val();
		var expReg = /^[0-9a-zA-Z]{8,20}$/;
		if (!logisticsNo) {
			$.Huimodalalert("请输入快递单号", 2000);
			return;
		} else if (!expReg.test(logisticsNo)) {
			$.Huimodalalert("请输入正确的快递单号", 2000);
			return;
		}
		
		data['assId'] = self.assId;
		data['expressId'] = expressId;
		data['expressCode'] = expressCode;
		data['logisticsNo'] = logisticsNo;
		$.post(base + 'afterSales/writeLogistics.do',data,function (res) {
			if (res.status == 0) {
				$('#pop_exp_num').val('')
				$('.pop_express_wrap').hide();
				$("#modal-demo").modal("hide");
				self.queryData();
			} else {
				$.Huimodalalert(res.message, 2000);
			}
		})
	}
	
	//取消售后
	,cancelFn: function () {
		var self = this;
		var data = {};
		var remark = $('.cancelRemark').val();
		if (!remark) {
			$.Huimodalalert("备注不能为空", 2000);
			return false;
		}
		
		$.post(base + 'afterSales/cancelAfterSales.do',{remark:remark, assId:self.assId},function (res) {
			if (res.status == 0) {
				$.Huimodalalert(res.message, 2000);
				$("#modal-demo").modal("hide");
				self.queryData();
			} else {
				$.Huimodalalert(res.message, 2000);
			}
		})
	}
	
	//加载数据
	,queryData: function () {
		var self = this;
		$.get(base + 'afterSales/getAfterSaleDetail.do',{assId:self.assId,assServiceId:self.assServiceId},function (res) {
			if (res.status == 0) {
				if (!self.assId) {
					self.assId = res.data.afterSale.assId;
				}
				self.companyName = res.data.afterSale.companyName;
				self.goodsCount = res.data.afterSale.goodsCount;
				if (res.data.afterSale.goodsCount > 1) {
					self.tipsPopShow = true;
				}
				
				if (res.data.afterSale.assType == 2) {
					$('.detailType').text('换货')
				} else{
					$('.detailType').text('退货')
				}
				$('#assId').text(res.data.afterSale.assServiceId);
				$('.currStatus').text(res.data.afterSale.assAdminGoodsStatusStr)
				$('.applyTime').text(res.data.afterSale.assApplyTime)
				$('.updataTime').text(res.data.afterSale.assEndTime)
				$('.remark').text(res.data.afterSale.remark)
				$('#problem').text(res.data.afterSale.assReason)
				$('.contractNo').text(res.data.afterSale.tradeId)
				$('#mobile').text(res.data.afterSale.assContactMobile)
				$('#customName').text(res.data.afterSale.assContactName)
				$('#goodsInfo').text(res.data.afterSale.assGoodsName)
				$('.goodsPrice').text(res.data.afterSale.assGoodsPrice)
				$('.goodsQty').text(res.data.afterSale.goodsCount)
				$('.goodsAmount').text(res.data.afterSale.assGoodsPrice * res.data.afterSale.goodsCount)
				$('#orderCoupon').text(res.data.afterSale.totalTradeDiscountAmount)
				$('#payAmount').text(res.data.afterSale.payMoney)
				$('#platic').text(res.data.afterSale.postage || '包邮')
				$('#userPlatic').text(res.data.afterSale.userPostage || '包邮')
				$('.accontName').text(res.data.afterSale.operationUser)
				$('.customExpressName').text(res.data.userExpressName)
				$('.customExpressNo').text(res.data.userLogisticsNo)
				$('.channelExpressName').text(res.data.supplierExpressName)
				$('.channelExpressNo').text(res.data.supplierLogisticsNo)
				
				if (res.data.afterSale.operationStatus !== '' && res.data.afterSale.operationStatus == 0) {
					$('.dealRes').text("不同意")
				} else if (res.data.afterSale.operationStatus !== '' && res.data.afterSale.operationStatus == 1){
					$('.dealRes').text("同意")
				}
				$('.dealTime').text(res.data.afterSale.assDealTime)
				$('#resInfo').text(res.data.afterSale.assDescribe)
				if (res.data.afterSale.sendStatus !== '' && res.data.afterSale.sendStatus == 0) {
					$('#isGetGoods').text("否")
				} else if (res.data.afterSale.sendStatus !== '' && res.data.afterSale.sendStatus == 1){
					$('#isGetGoods').text("是")
				}
				$('#resion').text(res.data.afterSale.refuseReason)
				
				//右上角按钮显示(1.退货。2.换货)
				//京东（接口）
				if (res.data.afterSale.goodsChannelId == 4) {
					if (res.data.afterSale.assType == 2 && res.data.afterSale.assAdminGoodsStatusStr == "待换货审核" || res.data.afterSale.assType == 2 && res.data.afterSale.assAdminGoodsStatusStr == "审核中") {
						$('.statusBtn').show()
					} else {
						$('.statusBtn').hide()
					}
				}
				$('.cancelBtn').text('');
				$('.statusBtn, .cancelBtn').attr('assType',res.data.afterSale.assType)
				if (res.data.afterSale.assType == 1) {
					switch (res.data.afterSale.assAdminGoodsStatusStr){
						case "待退货审核":
						$('.statusBtn').text('退货审核')
//						$('.cancelBtn').text('取消售后')
							break;
						case "待退款":
						$('.statusBtn').text('退款审核')
							break;
						case "待退款(待现金退款)":
						$('.statusBtn').text('退款审核')
							break;
						case "待退款(待额度退款)":
						$('.statusBtn').text('退款审核')
							break;
						case "待退货":
						$('.statusBtn').text('确认收货')
						$('.cancelBtn').text('取消售后')
							break;
						case "待商家收货(退)":
						$('.statusBtn').text('确认收货')
							break;
						default:
						$('.statusBtn').text('')
							break;
					}
				} else if (res.data.afterSale.assType == 2) {
					switch (res.data.afterSale.assAdminGoodsStatusStr){
						case "待换货审核":
						$('.statusBtn').text('换货审核')
//						$('.cancelBtn').text('取消售后')
							break;
						case "审核中":
						$('.statusBtn').text('换货审核')
							break;
						case "待商家发货":
						$('.statusBtn').text('填写物流')
							break;
						case "待寄回换货商品":
						$('.statusBtn').text('确认收货')
						$('.cancelBtn').text('取消售后')
							break;
						case "待商家收货(换)":
						$('.statusBtn').text('确认收货')
							break;
						default:
						$('.statusBtn').text('')
							break;
					}
				}
				
				
				
				//加载图片附件
				if (res.data.afterSale.assPicture) {
					var picArry = res.data.afterSale.assPicture.split(',')
					var imgStr = '';
					$.each(picArry, function(i,item) {
						imgStr += '<img class="imgSmall" src="'+ imgPath + item +'"/>'
					});
					$('.imgList').empty().append($(imgStr))
				}
				//客户物流列表
				if (res.data.userInfoIogistics.length) {
					var liStr = '';
					$.each(res.data.userInfoIogistics, function(i,item) {
						liStr += '<li><p><span class="expressTime">' + item.createTime + '</span><span class="expListStatus">' + item.progress + '</span></p></li>'
					});
					$('#customExpress').empty().append($(liStr));
					
					$('.custom-hava-info').show();
					$('.custom-no-info').hide();
				} else {
					$('.custom-hava-info').hide();
					$('.custom-no-info').show();
				}
				
				//渠道物流列表
				if (res.data.supplierIogistics.length) {
					var liStr = '';
					$.each(res.data.supplierIogistics, function(i,item) {
						liStr += '<li><p><span class="expressTime">' + item.createTime + '</span><span class="expListStatus">' + item.progress + '</span></p></li>'
					});
					$('#channelExpress').empty().append($(liStr));
					
					$('.supply-hava-info').show();
					$('.supply-no-info').hide();
				} else {
					$('.supply-hava-info').hide();
					$('.supply-no-info').show();
				}
				
			} else {
				$.Huimodalalert(res.message, 2000);
			}
		})
	}
}
serveDetail.init()