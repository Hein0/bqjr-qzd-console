//上传图片
 function uploadImg($obj, callback) {
 	var imgs = [];
 	var config = {
			width: 828, //图片最大不超过的宽度，默认为原图宽度，高度不设时会适应宽度。
		 	height: 1104, //图片最大不超过的高度，默认为原图高度，高度不设时会适应高度。
			quality: 0.8, //图片压缩质量，取值 0 - 1，默认为0.7
//			fieldName: "file", //后端接收的字段名，默认：file
		};
	//loading层
	var index = layer.load(1, {
		shade: [0.1, "#fff"] //0.1透明度的白色背景
	});
	if($obj.val()) {
		lrz($obj.get(0).files[0], config)
			.then(function(rst) {
				imgs.push(rst.base64);
				let param = new FormData(); //创建form对象
				// console.log(file.name);
				let imgTemp = imgs[0];
				var arr = imgTemp.split(","),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while(n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				var obj = new Blob([u8arr], {
					type: mime
				});
				param.append("file", obj, $obj.get(0).files[0].name); //通过append向form对象添加数据
				param.append("chunk", "0"); //添加form表单中其他数据
				$.ajax({
					url: base + "common/upload.do",
					type: "POST",
					processData: false,
					contentType: false,
					data: param,
					dataType: "JSON",
					success: function(data) {
						imgs = [];
						if(data.status == "0") {
							layer.closeAll("loading");
							callback(data.data);
							$obj.val("");
						} else {
							layer.closeAll("loading");
							$.Huimodalalert(data.message, 2000);
						}
					}
				});
			})
			.catch(function(err) {
				console.log(err);
				layer.closeAll("loading");
				alert("压缩失败");
			})
			.always(function() {
				// 清空文件上传控件的值
				$obj.value = null;
			});
		$obj.value = null;
	}
}
 
/*没有压缩的图片上传*/
function newUploadImg($obj, callback) {
	var imgs = [];
	var size = $obj.get(0).files[0].size,upType = $obj.get(0).files[0].type;
	var maxSize = 9*1024*1024,vdioMax = 10*1024*1024;//最大图片，视频
	var quality = 0.8; //图片压缩质量

	//loading层
	var index = layer.load(1, {
		shade: [0.8, "#fff"] //0.1透明度的白色背景
	});
	if(upType.indexOf("video")>-1){///上传视频
		if($obj.val() && size>=vdioMax) {
			layer.msg('请上传小于10M的视频');
			layer.closeAll("loading");
			return
		}
		let paramData = new FormData(); //创建form对象
			paramData.append("file", $obj.get(0).files[0], $obj.get(0).files[0].name); //通过append向form对象添加数据
			paramData.append("chunk", "0"); //添加form表单中其他数据
			$.ajax({
				url: base + "sys/uploadVideo.do",
				type: "POST",
				processData: false,
				contentType: false,
				data: paramData,
				dataType: "JSON",
				success: function(data) {
					if(data.status == "0") {
						layer.closeAll("loading");
						callback(data.data,upType);
						$obj.val("");
					} else {
						layer.closeAll("loading");
						$.Huimodalalert(data.message, 2000);
					}
				},
				error:function(err){
					layer.closeAll("loading");
					$.Huimodalalert(err.message? err.message :"上传有误，请重新上传！", 2000);
				},
				complete: function() {
					layer.closeAll("loading");
				}
			});
		$obj.value = null;
		
	}else{//上传图片
		if($obj.val() && size>=maxSize) {
			lrz($obj.get(0).files[0], {quality:0.8})
				.then(function(rst) {
					imgs.push(rst.base64);
					let param = new FormData(); //创建form对象
					// console.log(file.name);
					let imgTemp = imgs[0];
					var arr = imgTemp.split(","),
						mime = arr[0].match(/:(.*?);/)[1],
						bstr = atob(arr[1]),
						n = bstr.length,
						u8arr = new Uint8Array(n);
					while(n--) {
						u8arr[n] = bstr.charCodeAt(n);
					}
					var obj = new Blob([u8arr], {
						type: mime
					});
					param.append("file", obj, $obj.get(0).files[0].name); //通过append向form对象添加数据
					param.append("chunk", "0"); //添加form表单中其他数据
					$.ajax({
						url: base + "common/upload.do",
						type: "POST",
						processData: false,
						contentType: false,
						data: param,
						dataType: "JSON",
						success: function(data) {
							imgs = [];
							if(data.status == "0") {
								layer.closeAll("loading");
								callback(data.data,upType);
								$obj.val("");
							} else {
								layer.closeAll("loading");
								$.Huimodalalert(data.message, 2000);
							}
						}
					});
				})
				.catch(function(err) {
					console.log(err+"压缩失败");
					layer.closeAll("loading");
					$.Huimodalalert("压缩失败", 2000);
				})
				.always(function() {
					// 清空文件上传控件的值
					$obj.value = null;
				});
			$obj.value = null;
			
		}else{
			let param = new FormData(); //创建form对象
				param.append("file", $obj.get(0).files[0], $obj.get(0).files[0].name); //通过append向form对象添加数据
				param.append("chunk", "0"); //添加form表单中其他数据
				$.ajax({
					url: base + "common/upload.do",
					type: "POST",
					processData: false,
					contentType: false,
					data: param,
					dataType: "JSON",
					success: function(data) {
						if(data.status == "0") {
							layer.closeAll("loading");
							callback(data.data,upType);
							$obj.val("");
						} else {
							layer.closeAll("loading");
							$.Huimodalalert(data.message, 2000);
						}
					},
					error:function(err){
						layer.closeAll("loading");
						$.Huimodalalert(err.message? err.message :"上传有误，请重新上传！", 2000);
					},
					complete: function() {
						layer.closeAll("loading");
					}
				});
			$obj.value = null;
		}
	}
}
/*针对商品预览图片上传压缩*/
function commodityUploadImg($obj, callback) {
	var imgs = [];
	var size = $obj.get(0).files[0].size;
//	var maxSize = 9*1024*1024;
	var quality = 0.7; //图片压缩质量

	//loading层
	var index = layer.load(1, {
		shade: [0.8, "#fff"] //0.1透明度的白色背景
	});
	if($obj.val() && size>=200) {
		lrz($obj.get(0).files[0], {quality:0.7})
			.then(function(rst) {
				imgs.push(rst.base64);
				let param = new FormData(); //创建form对象
				// console.log(file.name);
				let imgTemp = imgs[0];
				var arr = imgTemp.split(","),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while(n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				var obj = new Blob([u8arr], {
					type: mime
				});
				param.append("file", obj, $obj.get(0).files[0].name); //通过append向form对象添加数据
				param.append("chunk", "0"); //添加form表单中其他数据
				$.ajax({
					url: base + "common/upload.do",
					type: "POST",
					processData: false,
					contentType: false,
					data: param,
					dataType: "JSON",
					success: function(data) {
						imgs = [];
						if(data.status == "0") {
							layer.closeAll("loading");
							callback(data.data);
							$obj.val("");
						} else {
							layer.closeAll("loading");
							$.Huimodalalert(data.message, 2000);
						}
					}
				});
			})
			.catch(function(err) {
				console.log(err+"压缩失败");
				layer.closeAll("loading");
				$.Huimodalalert("压缩失败", 2000);
			})
			.always(function() {
				// 清空文件上传控件的值
				$obj.value = null;
			});
		$obj.value = null;
		
	}else{
		let param = new FormData(); //创建form对象
			param.append("file", $obj.get(0).files[0], $obj.get(0).files[0].name); //通过append向form对象添加数据
			param.append("chunk", "0"); //添加form表单中其他数据
			$.ajax({
				url: base + "common/upload.do",
				type: "POST",
				processData: false,
				contentType: false,
				data: param,
				dataType: "JSON",
				success: function(data) {
					if(data.status == "0") {
						layer.closeAll("loading");
						callback(data.data);
						$obj.val("");
					} else {
						layer.closeAll("loading");
						$.Huimodalalert(data.message, 2000);
					}
				},
				error:function(err){
					layer.closeAll("loading");
					$.Huimodalalert(err.message? err.message :"上传有误，请重新上传！", 2000);
				},
				complete: function() {
					layer.closeAll("loading");
				}
			});
		$obj.value = null;
	}
}


/*
*
* @des 上传视频
* @param $file 文本框
* @param callback 上传成功的回调
* @param before 上传之前的操作，before参数存在，则必须在函数中手动调用upload，
* */
function uploadVideoHandle($file, callback, before) {

    var url = base + 'sys/uploadVideo.do';
        data = new FormData(),
		file = $file.get(0).files[0];
	var load;
	before?before(file, upload): upload()
    // 上传
	function upload() {
		
		load = layer.load();
        data.append('file', file);
        $.ajax({
            url: url,
            type: 'POST',
            processData: false,
            contentType: false,
            cache: false,
            dataType: 'json',
            data: data,
            success: function (res) {
                layer.close(load);
                layer.msg(res.message);
                res.status == '0' && callback(res.data);
            }
        });
    }
}

/*
* @param $obj jq对象
* @param callback 上传成功的回调
* @param before 上传之前
* @return void
* */
function dragUploadFile($obj, callback, before) {

	var file, self;
	$obj.next().bind('dragover', function (ev) {
        ev.preventDefault();
    }).bind('drop', function (ev) {
        ev.preventDefault();
        file = ev.originalEvent.dataTransfer.files[0];
        self = $(this).prev();
        before?before(file, upload):upload(file);
    })
	
	function upload(file) {
        var param = new FormData();
        var load = layer.load();

		param.append("file", file, file.name);
		param.append('chunk', 0);
        $.ajax({
            url: base + "common/upload.do",
            type: "POST",
            cache: false,
            processData: false,
            contentType: false,
            data: param,
            dataType: "JSON",
			success:function (res) {
				layer.close(load);
                layer.msg(res.message);
                res.status == '0' && callback(res.data, self);
            }
        })
    }
}

// 缓存数据
var CacheData = (function () {
	return {
		_setData:function (key, value) {
			value = typeof value == 'object' ?JSON.stringify(value):value;
			sessionStorage.setItem(key, value)
        },
        _selectAllCategory: function (callback, key) {
			this._ajax('mall/selectAllCategory.do', callback, 'get', {parentId: 0}, key)
        },
        _getArea:function (callback, key) {
			this._ajax('adminAddress/provinceCity', callback, 'get', {}, key)
        },
		_brand:function(callback, key){
			this._ajax('mall/brand', callback, 'get', {},key)
		},
		_standard:function (callback, key){
            this._ajax('mall/standard', callback, 'get', {},key)
		},
		_ajax: function (url, callback, type, data, key) {
			var self = this;
            $.ajax({
                url: base + url,
                type: type,
				data: data,
                success:function (res) {
					if (res.status == 0) {
						self._setData(key, res.data)
                        callback(res.data)
					}
                }
            })
        },
        getData:function (key, callback) {
            var data = JSON.parse(sessionStorage.getItem(key));
            data?callback(data):this['_' + key](callback, key)
        },
	}
})()


//上传apk文件

 function uploadFile($obj, callback) {
 	var imgs = [];
 	var config = {
			width: 828, //图片最大不超过的宽度，默认为原图宽度，高度不设时会适应宽度。
		 	height: 1104, //图片最大不超过的高度，默认为原图高度，高度不设时会适应高度。
			quality: 0.8, //图片压缩质量，取值 0 - 1，默认为0.7
//			fieldName: "file", //后端接收的字段名，默认：file
		};
	//loading层
	var index = layer.load(1, {
		shade: [0.1, "#fff"] //0.1透明度的白色背景
	});
	if($obj.val()) {
		let param = new FormData(); //创建form对象
				
			param.append("file", $obj.get(0).files[0], $obj.get(0).files[0].name); //通过append向form对象添加数据
			$.ajax({
//				url: base + "version/uploadApp",
				url:  base + "version/uploadApp",
				type: "POST",
//				timeout : 300000, //超时时间设置，单位毫秒
				cache: false,//上传文件无需缓存
				processData: false,//用于对data参数进行序列化处理 这里必须false
				contentType: false,
				data: param,
				dataType: "JSON",
				success: function(data) {
					imgs = [];
					if(data.status == "0") {
						layer.closeAll("loading");
						callback(data.data);
						$obj.val("");
					} else {
						layer.closeAll("loading");
						$.Huimodalalert(data.message, 2000);
					}
				},
				error:function(err){
					layer.closeAll("loading");
					$.Huimodalalert(err.message? err.message :"上传有误，请重新上传！", 2000);
				},
				complete: function() {
					layer.closeAll("loading");
				}
			});
		
		$obj.value = null;
	}
}
 //时间格式
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


// 表单输入验证
var checkInput = {
    // 验证非空
    empty: function ($self, $parent) {
        var val = $self.val(),
            title = $parent.find('.title').text();
        if (val == '') {
            $self.addClass('error');
            $.Huimodalalert(title + '不能为空', 2000);
            return false;
        }
        $self.removeClass('error');
    },

    // 验证值必须为数字
    number: function ($self, $parent) {
        var $collections = $parent.find('input'),
            length = $collections.length,
            val = +$self.val(),
            index = 0,
            compare;
        if (val === 0) {
            $self.val('');
        }
        if (isNaN(val)) {
            $self.addClass('error');
            $.Huimodalalert('请填写一个数字值', 2000);
            return false;
        }

        if (val < 0) {
            $self.addClass('error');
            $.Huimodalalert('数字值应为正数', 2000);
            return false;
        }

        if (length > 1) {
            if ($self.get(0) == $collections.get(0)) {
                compare = +$collections.eq(1).val();
                compare = isNaN(compare) ? 0 : compare;
                if (val && compare && val > compare) {
                    $self.addClass('error');
                    $.Huimodalalert('最小值应小于最大值', 2000);
                    return false;
                }
            } else {
                compare = +$collections.eq(0).val();
                compare = isNaN(compare) ? 0 : compare;
                if (val && compare && val < compare) {
                    $self.addClass('error');
                    $.Huimodalalert('最大值应大于最小值', 2000);
                    return false;
                }
            }
        }
        $self.removeClass('error');
    },

    // 验证值必须为手机号格式
    phone: function ($self, $parent) {
        var phoneReg = /^1[3|4|5|7|8][0-9]{9}$/,
            val = $self.val();
        if (val && !(phoneReg.test(val))) {
            $self.addClass('error');
            $.Huimodalalert('手机号码格式错误', 2000);
            return false;
        }
        $self.removeClass('error');
    },
    
    // 格式化当前时间// return 2010-05-05 05:05:05
    formatNowTime: function () {
        var helper = function (val) {
            return +val < 10 ? ('0' + val) : val
        },
        time = new Date(),
        result = '';
        result += time.getFullYear() + '-' + (helper(time.getMonth() + 1)) + '-' + helper(time.getDate()) + ' ' + helper(time.getHours()) + ':' + helper(time.getMinutes()) + ':' + helper(time.getSeconds());
        return result;
    },
    // 过滤空参数
    filterEmpty: function (obj) {
        var keys = Object.keys(obj),
            i = 0,
            length = keys.length;

        for (i; i < length; i++) {
            if (!obj[keys[i]]) {
                delete obj[keys[i]];
            }
        }
        return obj;
    },
}
