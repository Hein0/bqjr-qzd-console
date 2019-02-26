/*
 * create by ljc
 * 2017/12/08
 */
var supply = {
	init: function () {
		this.data = {};
		this.bindEvents()
		this.queryData()
	}
	
	,bindEvents: function () {
		var self = this;
		
		//添加
		$('.creat').on('click',function () {
			$("#modal-demo input").val('')
			$("#modal-demo textarea").val('')
			$("#modal-demo select").val(2)
			$('.modal-title').text('添加供应商')
			$('.pop_sure').attr('type','add')
			$('.pop_creat').show()
			$("#modal-demo").modal("show")
		})
		
		//删除
		$('#tableList').on('click','.delete', function () {
			$('.pop_creat').hide()
			$('.pop_sure').attr('supplyId',$(this).attr('supplyId'))
			$('.pop_sure').attr('type','delete')
			$('.modal-title').text('确认删除该供应商吗？')
			$("#modal-demo").modal("show")
		})
		//编辑
		$('#tableList').on('click','.edit', function () {
			self.edit(this)
		})
		
		//点击筛选
		$('#screeBtn').on('click',function () {
			self.data.keyword = $('.searchName').val()
			self.queryData()
		})
		
		//点击重置
		$('#resetBtn').on('click',function () {
			$('.searchName').val('')
		})
		
		//点击保存
		$('.pop_sure').on('click',function (el) {
			self.save(this)
		})
	}
	
	//点击编辑
	,edit: function (el) {
		$self = $(el)
		var id = $self.attr('supplyId')
		$('.modal-title').text('编辑供应商信息')
		$('.pop_sure').attr('type','edit')
		$('.pop_sure').attr('supplyId',id)
		$('.pop_creat').show()
		$("#modal-demo").modal("show")
		
		$('#supplyName').val($self.attr('companyName'));
		$('#oftenUse').val($self.attr('showType'));
		$('#supplyProp').val($self.attr('type'));
		$('#supplySort').val($self.attr('sort'));
		$('#receiveName').val($self.attr('contacts'));
		$('#mobile').val($self.attr('mobile'));
		$('#address').val($self.attr('addressDetail'));
		$('#info_txt').val($self.attr('cooperationIntention'));
	}
	
	//点击保存
	,save: function (el) {
		var self = this
		var supplyId = $(el).attr('supplyId')
		
		if ($(el).attr('type') == 'delete') {
			$.ajax({
				type:"delete",
				url:base + "company/" + supplyId,
				async:true,
				success: function (res) {
					if (res.status == 0) {
						$.Huimodalalert('删除成功', 2000);
						$("#modal-demo").modal("hide")
						self.queryData()
					} else{
						$.Huimodalalert(res.message, 2000);
					}
				},
				error: function (res) {
					$.Huimodalalert(res.message, 2000);
				}
			});
		} else{
			var companyName = $('#supplyName').val();
			var showType = $('#oftenUse option:checked').val();
			var type = $('#supplyProp option:checked').val();
			var sort = $('#supplySort').val();
			var contacts = $('#receiveName').val();
			var mobile = $('#mobile').val();
			var addressDetail = $('#address').val();
			var cooperationIntention = $('#info_txt').val();
			
			 var numReg=/^-?\d+$/;
			var reg = /(^[0-9]{3,4}(\-)?[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^([0-9]{3,4})(\-)?[0-9]{7,8}(\-)([0-9]{1,4})$)|(^(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8})$)/
			if (!companyName) {
				$.Huimodalalert('请输入供应商名称', 2000);
				return false;
			}
			
			if (sort) {
				if (!numReg.test(sort)) {
					$.Huimodalalert('供应商排序必须为数字', 2000);
					return false;
				}
			}
			
			if (mobile) {
				if (!reg.test(mobile)) {
					$.Huimodalalert('请输入正确的联系方式', 2000);
					return false;
				}
			}
			
			var data = {};
			data['companyName'] = companyName;
			data['showType'] = showType;
			data['type'] = type;
			data['sort'] = sort;
			data['contacts'] = contacts;
			data['mobile'] = mobile;
			data['addressDetail'] = addressDetail;
			data['cooperationIntention'] = cooperationIntention;
			
			if ($(el).attr('type') == 'add') {
				$.post(base + 'company',data,function (res) {
					if (res.status == 0) {
						$.Huimodalalert('保存成功', 2000);
						$("#modal-demo").modal("hide")
						self.queryData()
					} else{
						$.Huimodalalert(res.message, 2000);
					}
				})
			} else if($(el).attr('type') == 'edit'){
				$.ajax({
					type:"put",
					url:base + "company/" + supplyId,
					data: data,
					async:true,
					success: function (res) {
						if (res.status == 0) {
							$.Huimodalalert('保存成功', 2000);
							$("#modal-demo").modal("hide")
							self.queryData()
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
	}
	
	//请求数据
	,queryData: function (obj) {
		var self = this;
		self.data.page = (obj && obj.curr) || 1 // 默认第1页
        self.data.size = (obj && obj.pageSize) || 20 // 默认一页20条数据
		$.get(base + 'company', self.data, function (res) {
			if (res.status == 0) {
				$("#tableList").empty().append($('#supplyList').tmpl(res.data));
				setPagination({
			       elem: $('#pagination'),
			       totalCount: res.dataCount,
			       curr: self.data.page,
				   callback: function (obj) {
                            self.queryData(obj);
                        }
			   });
			} else{
				$.Huimodalalert(res.message, 2000);
			}
		})
	}
	
}
supply.init()