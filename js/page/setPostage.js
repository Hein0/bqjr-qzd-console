/**
 * creat by ljc 
 * 2017/11/27
 * **/

var setPostage = {
	init: function () {
		this.initType = '';
		this.initPrice = 99;
		this.isSave = false;
		this.initSet();
		this.bindEvents()
	}
	
	,bindEvents: function () {
		var self = this;
		
		$('#m_price').bind('dblclick',function (ev) {
			if ($('input[type=radio]:checked').val() == 1){
				$(this).attr('readonly',false)
			}
		})
		
		$('#m_price').on('blur',function () {
			$(this).attr('readonly',true)
		})
		
		$('#m_price').keyup(function () {
			self.isSave = false;
			console.log(self.isSave)
			var numReg = /^[0-9]+(.[0-9]{2})?$/;
			var price = $(this).val();
			if (!price) {
				$.Huimodalalert("请输入包邮金额", 2000);
				return;
			}
			if (!numReg.test(price)) {
				$.Huimodalalert("只能输入数字，并且最多2位小数", 2000);
				return;
			}
			self.initPrice = price;
		})
		
		$('input[type=radio]').on('click', function () {
			self.isSave = false;
			if ($(this).val() == 0) {
				$('#m_price').val('99')
			} else{
				$('#m_price').val(self.initPrice)
			}
		})
		
		//保存
		$('.save').on('click',function () {
			self.clickSave(this)
		})
		
		$('button').on('click',function () {
			self.useSet()
		})
	}
	
	//保存
	,clickSave: function (el) {
		var $this = $(el);
		var radioVal = $('input[type=radio]:checked').val()
		var jdMarketPrice = $('#m_price').val(),
			datas = {};
		var numReg = /^[0-9]+(.[0-9]{2})?$/;
		if (!jdMarketPrice) {
			$.Huimodalalert("请输入包邮金额", 2000);
			return;
		} else if (!numReg.test(jdMarketPrice)) {
			$.Huimodalalert("只能输入数字，并且最多2位小数", 2000);
			return;
		}
		datas['type'] = radioVal;
		if (radioVal == 0) {
			datas['price'] = 99
		} else{
			datas['price'] = jdMarketPrice;
		}
		var type = $this.attr('type')
		if (type == 'update') {
			var dataId = $this.attr('dataId')
			this.updateSet(datas,dataId)
		} else if (type == 'save') {
			this.saveSet(datas)
		}
		
	}
	
	//更新设置
	,updateSet: function (data,id) {
		var self = this;
		$.ajax({
			type:"put",
			url:base + "shipping/" + id,
			data:data,
			async:true,
			success: function (res) {
				if (res.status == 0) {
					self.initSet();
					self.isSave = true;
					$.Huimodalalert("已保存", 2000);
				} else{
					$.Huimodalalert(res.message, 2000);
				}
			},
			error: function (res) {
				$.Huimodalalert(res.message, 2000);
			}
		});
	}
	//保存设置
	,saveSet: function (data) {
		var self = this;
		$.post(base + 'shipping',data, function (res) {
			if (res.status == 0) {
				self.initSet();
				self.isSave = true;
				$.Huimodalalert("已保存", 2000);
			} else{
				$.Huimodalalert(res.message, 2000);
			}
		})
	}
	
	//初始化设置
	,initSet: function () {
		var self = this;
		$.get(base + 'shipping/latest', function (res) {
			if (res.status == 0) {
				if (res.data[0]) {
					self.initType = res.data[0].type;
					$('.save').attr('type','update')
					$('.save').attr('dataId',res.data[0].id)
					var radioArr = $('.wrap input[type=radio]')
					if (res.data[0].type == 1) {
						$('#m_price').val(res.data[0].marketPrice);
						self.initPrice = res.data[0].marketPrice;
					} else{
						$('#m_price').val('99')
					}
					$.each(radioArr,function (i,item) {
						if ($(item).val() == res.data[0].type) {
							$(item).attr('checked',true)
						}
					})
					
					//初始化现在生效
					if (res.data[1]) {
						if (res.data[1].type == 1) {
							$('.nowTxt').text('京东市场价包邮');
						} else{
							$('.nowTxt').text('京东渠道价包邮')
						}
					}
					
				} else{
					$('.save').attr('type','save')
				}
			}
		})
		
	}
	
	//发布
	,useSet: function () {
		var self = this;
		if (!self.isSave) {
			$.Huimodalalert("请先保存设置", 2000);
			return;
		}
		var dataId = $('.save ').attr('dataId')
		
		$.ajax({
			type:"put",
			url:base + 'shipping/'+ dataId +'/enable',
			async:true,
			success: function (res) {
				if (res.status == 0) {
					self.initSet();
					$.Huimodalalert("已发布", 2000);
				} else{
					$.Huimodalalert(res.message, 2000);
				}
			},
			error: function (res) {
				$.Huimodalalert(res.message, 2000);
			}
		});
		
	}
}
setPostage.init()