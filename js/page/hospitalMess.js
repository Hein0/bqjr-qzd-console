var spuUtils = {
	hospitalSpuData: {
		id:"",//医院id
		name: "", //医院名称--
		qiao_code: "", //商桥获取代码
		qiao_url: "", //商桥独立沟通链接
		
		his_id:"",//his_id
		status:"",//状态 

	},
	
	//初始化
	init: function() {
		var path = location.href;
		
		if(path.indexOf("?") >= 0) {
			var params = path.substring(path.indexOf("?") + 1, path.length).split("&"),
				id = "",
				his_id = "",
				status = "";
			for(var i = 0; i < params.length; i++) {
				if(params[i].indexOf("id") != -1) {
					id = params[i].split("=")[1];
				} else if(params[i].indexOf("hisId") != -1) {
					his_id = params[i].split("=")[1];
				} else if(params[i].indexOf("status") != -1) {
					status = params[i].split("=")[1];
				}
			}
			//设置状态
			spuUtils.hospitalSpuData.status = status;
			spuUtils.hospitalSpuData.id = id;
		    spuUtils.getHospitalData(id, true, callBack);
		    
			
			function callBack() {
				//填充内容
				$(".spu-cont #hospitalId").val(spuUtils.hospitalSpuData.id);
				$(".spu-cont #hospitalName").val(spuUtils.hospitalSpuData.name);
				$(".spu-cont #qiao_code").val(spuUtils.hospitalSpuData.qiao_code);
				$(".spu-cont #qiao_url").val(spuUtils.hospitalSpuData.qiao_url);

			}
		}
	},
	
	//获取SPU数据
	getHospitalData: function(id,boolean, callback) {
		var url = base,
      		data = {};
      		data.id = id;
    		url+="hospital/getCustomerServiceInfo";

		$.get(url , data , function(res) {
			if(res.data != null) {
				spuUtils.cache = res.data;
				spuUtils.hospitalSpuData.id = res.data.id; //id
				spuUtils.hospitalSpuData.name = res.data.name;//医院名称
				spuUtils.hospitalSpuData.qiao_code = res.data.qiao_code; //商桥获取代码
				spuUtils.hospitalSpuData.qiao_url = res.data.qiao_url; //商桥独立沟通链接
				
			}
			callback();
		});
	},

	//保存SPU数据
	saveSPUData: function() {
		var data = {};
		data.id = spuUtils.hospitalSpuData.id; //医院id
		data.qiao_code = spuUtils.hospitalSpuData.qiao_code; //商桥获取代码
		data.qiao_url = spuUtils.hospitalSpuData.qiao_url; //商桥独立沟通链接

		layer.load(2);
		
		$.ajax({
			type: "POST",
			url: base + "hospital/updateCustomerServiceInfo",
			data: JSON.stringify(data),
			contentType: "application/json;charset=utf-8",
			success: function(res) {
				if(res.status == "0") {
					$.Huimodalalert("提交成功！", 1500);
					setTimeout(function() {
						var index = parent.layer.getFrameIndex(window.name);
						//刷新列表
						//          window.parent.location.href = window.parent.location.href;
						parent.layer.close(index);
					}, 1500);
				} else {
					$.Huimodalalert(res.message, 1500);
				}
			},
			complete: function() {
				layer.closeAll("loading");
			}
		});
	}
};

$(function() {
	//初始化
	spuUtils.init();

	//提交
	$(".spu-cont .submit-btn").on("click", function() {

		//记录医院id
		spuUtils.hospitalSpuData.id = $(".spu-cont #hospitalId").val();
		//医院名称
		spuUtils.hospitalSpuData.name = $(".spu-cont #hospitalName").val();
		//商桥获取代码
		spuUtils.hospitalSpuData.qiao_code = $(".spu-cont #qiao_code").val();
		//商桥独立沟通链接
		spuUtils.hospitalSpuData.qiao_url = $(".spu-cont #qiao_url").val();
		

		// 商桥获取代码
		if(!spuUtils.hospitalSpuData.qiao_code) {
			$.Huimodalalert("请填写商桥获取代码", 1500);
			return false;
		}
		//商桥独立沟通链接
		if(!spuUtils.hospitalSpuData.qiao_url) {
			$.Huimodalalert("请填写商桥获取代码", 1500);
			return false;
		}
		spuUtils.saveSPUData();
	});

});