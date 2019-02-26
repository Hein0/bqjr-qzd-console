var detailUtil = {
    'cache': {},
    //初始化
    'init': function () {
        var path = location.href;
        if (path.indexOf('?') >= 0) {
            var params = path.substring(path.indexOf('?')+1, path.length).split('&'),
                id = '',
                status = '',
                his_id = '';
            for (var i = 0; i < params.length; i++) {
                if (params[i].indexOf('id')!=-1) {
                    id = params[i].split('=')[1];
                }else if(params[i].indexOf('status')!=-1){
                	status = params[i].split('=')[1];
                }else if(params[i].indexOf('hisId')!=-1){
                	his_id = params[i].split('=')[1];
                }
            }
            if(status){
            	detailUtil.status = status;
            }
           
        	if (id) {
        		detailUtil.id = id;
                detailUtil.getHospitalInfo(id,true);
            }
//      	else{
//          	detailUtil.his_id = his_id;
//              detailUtil.getHospitalInfo(his_id,false);
//          }
        }
    },
    'getHospitalInfo': function (ids,boole) {
    	var url = base,
    		data = {};
    		if(boole){
    			data.id = ids;
    			url+="case/getHospitalInfoById";
    		}
//  		else{//暂时不用his_id  后期看后台
//  			url+="hospital/getHospitalByHisId";
//  			data.his_id = ids;
//  		}
    		
        $.get(url, data, function (res) {
            if (res.message) {
                $('.container .table tbody').html('');
                $.Huimodalalert(res.message, 2000);
            } else if (!res.message) {
                detailUtil.cache.details = res.data;
                detailUtil.renderHospitalDetails(res.data);
            } else {
                $('.container .table tbody').html('');
            }
        })
    },
    'renderHospitalDetails': function (data) {
        var html = '';
        switch (data.ziben_type) {
            case 1:
                data.ziben_type = '公立医院';
                break;
            case 3:
                data.ziben_type = '民营医院';
                break;
            default:
                break;
        };
        switch (data.hospital_type) {
            case 26:
                data.hospital_type = '综合型整形医院';
                break;
            case 27:
                data.hospital_type = '整形外科专科医院';
                break;
            case 28:
                data.hospital_type = '齿科专科医院';
                break;
            case 29:
                data.hospital_type = '皮肤科专科医院';
                break;
            case 30:
                data.hospital_type = '医院整形外科';
                break;
            case 147:
                data.hospital_type = '眼科专科医院';
                break;
            case 152:
                data.hospital_type = '综合泌尿科';
                break;
            case 153:
                data.hospital_type = '妇科整形医院';
                break;
            case 154:
                data.hospital_type = '医疗美容诊所';
                break;
            case 155:
                data.hospital_type = '医疗美容地区医院';
                break;
            case 156:
                data.hospital_type = '医疗美容教学医院';
                break;
            case 157:
                data.hospital_type = '医疗美容区域医院';
                break;
            case 158:
                data.hospital_type = '医疗美容医学中心';
                break;
            case 167:
                data.hospital_type = '医疗美容医院';
                break;
            case 168:
                data.hospital_type = '医疗美容门诊部';
                break;
            case 170:
                data.hospital_type = '医疗美容诊所';
                break;
            case 181:
                data.hospital_type = '医疗美容机构';
                break;
            case 124:
                data.hospital_type = '其他';
                break;
            default:
                break;
        };
        switch (data.service_grade) {
            case 1:
                data.service_grade = '一级业务';
                break;
            case 2:
                data.service_grade = '二级业务';
                break;
            case 3:
                data.service_grade = '三级业务';
                break;
            case 4:
                data.service_grade = '四级业务';
                break;
            case 0:
                data.service_grade = '';
                break;
            default:
                break;
        };

        html += '<tr>\
            <th width="20%">医院名称</th>\
            <td>'+ (data.name || '') + '</td>\
        </tr>\
        <tr>\
            <th>医院地址</th>\
            <td>'+ (data.cityName + data.street || '') + '</td>\
        </tr>\
        <tr>\
            <th>医院座机</th>\
            <td>'+ (data.telphone || '') + '</td>\
        </tr>\
        <tr>\
            <th>医院邮箱</th>\
            <td>'+ (data.email || '') + '</td>\
        </tr>\
        <tr>\
            <th>医院Logo</th>\
            <td>\
                <img src="'+ imgPath + data.logo + '" class="img-responsive" width="50%" alt="医院Logo">\
            </td>\
        </tr>\
        <tr>\
            <th>医院宣传语</th>\
            <td>'+ (data.propaganda || '') + '</td>\
        </tr>\
        <tr>\
            <th>医院法人姓名</th>\
            <td>'+ (data.legal_name || '') + '</td>\
        </tr>\
        <tr>\
            <th>医院法人身份证号</th>\
            <td>'+ (data.legal_id_card || '') + '</td>\
        </tr>\
        <tr>\
            <th>医院法人手机号</th>\
            <td>'+ (data.legal_telphone || '') + '</td>\
        </tr>\
        <tr>\
            <th>资本类型</th>\
            <td>'+ (data.ziben_type || '') + '</td>\
        </tr>\
        <tr>\
            <th>医院类型</th>\
            <td>'+ (data.hospital_type || '') + '</td>\
        </tr>\
        <tr>\
            <th>业务等级</th>\
            <td>'+ (data.service_grade || '') + '</td>\
        </tr>\
        <tr>\
            <th>擅长项目</th>\
            <td>'+ (data.good_projects || '') + '</td>\
        </tr>\
        <tr>\
            <th>成立时间</th>\
            <td>'+ (data.build_date || '') + '</td>\
        </tr>\
        <tr>\
            <th>医院介绍</th>\
            <td>'+ (data.introduce || '') + '</td>\
        </tr>\
        <tr>\
            <th>营业执照or民办非企业单位证书</th>\
            <td>\
                <img src="'+ imgPath + data.business_license + '" class="img-responsive" width="50%" alt="营业执照or民办非企业单位证书">\
            </td>\
        </tr>\
        <tr>\
            <th>营业执照or民办非企业单位证书有效期</th>\
            <td>'+ (data.business_date || '') + '</td>\
        </tr>\
        <tr>\
            <th>医疗机构职业许可证</th>\
            <td>\
                <img src="'+ imgPath + data.licence + '" class="img-responsive" width="50%" alt="医疗机构职业许可证">\
            </td>\
        </tr>\
        <tr>\
            <th>医疗机构职业许可证有效期</th>\
            <td>'+ (data.licence_date || '') + '</td>\
        </tr>\
        <tr>\
            <th>医疗广告审查证明</th>\
            <td>\
                <img src="'+ imgPath + data.examination + '" class="img-responsive" width="50%" alt="医疗广告审查证明">\
            </td>\
        </tr>\
        <tr>\
            <th>医疗广告审查证明有效期</th>\
            <td>'+ (data.examination_date || '') + '</td>\
        </tr>';
        
        $('.container .table tbody').html(html);

    }
}

$(function () {
    detailUtil.init();
    
    //修改点击
    $('#modification').on('click', function () {
    	var goUrl = "hospitalAlter.html?";
            if (detailUtil.status == "10" || detailUtil.status == "11") {
                goUrl += "id=" + detailUtil.id + "&status=" + detailUtil.status;
            } else {
                goUrl += "hisId=" + detailUtil.his_id + "&status=" + detailUtil.status;
            }
        parent.layer.open({
            type: 2,
            title: '编辑医院',
            shadeClose: true,
            shade: [0.5, '#000'],
            maxmin: false, //开启最大化最小化按钮
            area: ['90%', '60%'],
            content: goUrl,
            end:function(){
            	window.location.reload();
            }
        });
    })
    // 医院预览
    $('#preview').on('click',function(){
        var toUrl = "../../view/demoPreview/hospitalPreview.html?";
        if (detailUtil.status == "10" || detailUtil.status == "11") {
            toUrl += "id=" + detailUtil.id + "&status=" + detailUtil.status;
        } else {
            toUrl += "hisId=" + detailUtil.his_id + "&status=" + detailUtil.status;
        }
        parent.layer.open({
            type: 2,
            title: "医院信息",
            shadeClose: true,
            shade: [0.5, "#000"],
            maxmin: false, //开启最大化最小化按钮
            area: ["35%", "65%"],
            content: toUrl,
            end:function(){
            }
        })
    })
})