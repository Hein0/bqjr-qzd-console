var detailUtil = {
    'cache': {},
    'hospitalList': [],
    //初始化
    'init': function () {
        var path = location.href;
        detailUtil.getHospital();
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
            
        	if (his_id) {
            	detailUtil.his_id = his_id;
                detailUtil.getDoctorInfo(his_id,false);
            }
        }
    },
    'getDoctorInfo': function (ids,boole) {
    	var url = base,
    		data = {};
    		url+="hospital/getDoctorByHisId";
    		data.his_id = ids;
        $.get(url, data, function (res) {
            if (res.message) {
                $('.container .table tbody').html('');
                $.Huimodalalert(res.message, 2000);
            } else if (!res.message) {
                detailUtil.cache.details = res.data;
                detailUtil.renderDoctorDetails(res.data);
            } else {
                $('.container .table tbody').html('');
            }
        })
    },
    
    'getHospital': function () {
        $.ajax({
            async: false,
            type: 'get',
            url: base + 'case/getHospitalByCityIdOrName.do',
            data: { 'cityId': '', 'name': '' },
            success: function (res) {
                if (res.status == '0') {
                    detailUtil.hospitalList = res.data;
                }
            }
        });
    },
    'renderDoctorDetails': function (data) {
        var html = '';
        switch (data.highest_degree) {
            case '5':
                data.highest_degree = '博士后';
                break;
            case '7':
                data.highest_degree = '双博士';
                break;
            case '9':
                data.highest_degree = '博士';
                break;
            case '11':
                data.highest_degree = '双硕士';
                break;
            case '13':
                data.highest_degree = '硕士';
                break;
            case '14':
                data.highest_degree = '本科';
                break;
            case '116':
                data.highest_degree = '进修';
                break;
            case '125':
                data.highest_degree = '专科';
                break;
            default:
                break;
        };
        switch (data.sex) {
            case 1:
                data.sex = '男';
                break;
            case 2:
                data.sex = '女';
                break;
            default:
                break;
        };
        switch (data.position) {
            case '15':
                data.position = '院长';
                break;
            case '16':
                data.position = '代表院长';
                break;
            case '17':
                data.position = '执行院长';
                break;
            case '74':
                data.position = '院长';
                break;
            case '75':
                data.position = '副院长';
                break;
            case '76':
                data.position = '主任医师';
                break;
            case '77':
                data.position = '副主任医师';
                break;
            case '78':
                data.position = '医生';
                break;
            case '79':
                data.position = '实习医生';
                break;
            case '86':
                data.position = '外聘教授';
                break;
            case '142':
                data.position = '中心主任';
                break;
            case '143':
                data.position = '主诊医生';
                break;
            case '144':
                data.position = '研究员';
                break;
            case '145':
                data.position = '副研究员';
                break;
            case '80':
                data.position = '院长';
                break;
            case '81':
                data.position = '整形外科医师';
                break;
            case '82':
                data.position = '外科医师';
                break;
            case '83':
                data.position = '医师';
                break;
            default:
                break;
        };
        data.zizhi = data.zizhi.split(',');
        var zizhiTemp = [];
        data.zizhi.forEach(function (item, index) {
            if (index % 2 == 0 && !isNaN(parseInt(item))) {
                temp = data.zizhi[index + 1];
                zizhiTemp.push(temp);
            }
        })
        data.zizhi = zizhiTemp.join(',');
        
        if (data.hospital_id) {
            detailUtil.hospitalList.forEach(function (hospitalItem) {
                if (hospitalItem.id == data.hospital_id) {
                    data.hospital = hospitalItem.name;
                    return;
                }
            })
        }
        html += '<tr>\
            <th width="20%">医生姓名</th>\
            <td>'+ (data.name || '') + '</td>\
        </tr>\
        <tr>\
            <th>性别</th>\
            <td>'+ (data.sex || '') + '</td>\
        </tr>\
        <tr>\
            <th>所在城市</th>\
            <td>'+ (data.cityName || '') + '</td>\
        </tr>\
        <tr>\
            <th>所在医院</th>\
            <td>'+ (data.hospital || data.hospital_id || '') + '</td>\
        </tr>\
        <tr>\
            <th>最高学历</th>\
            <td>'+ (data.highest_degree || '') + '</td>\
        </tr>\
        <tr>\
            <th>当前职务</th>\
            <td>'+ (data.position || '') + '</td>\
        </tr>\
        <tr>\
            <th>医生资质</th>\
            <td>'+ (data.zizhi || '') + '</td>\
        </tr>\
        <tr>\
            <th>从业时间</th>\
            <td>'+ (data.work_date || '') + '</td>\
        </tr>\
        <tr>\
            <th>擅长项目</th>\
            <td>'+ (data.good_projects || '') + '</td>\
        </tr>\
        <tr>\
            <th>医生头像</th>\
            <td>\
                <img src="'+ imgPath + data.logo + '" class="img-responsive" width="50%" alt="医院Logo">\
            </td>\
        </tr>\
        <tr>\
            <th>医生介绍</th>\
            <td>'+ (data.introduce || '') + '</td>\
        </tr>\
        <tr>\
            <th>学习经历</th>\
            <td>'+ (data.learn_exp || '') + '</td>\
        </tr>\
        <tr>\
            <th>职业经历</th>\
            <td>'+ (data.work_exp || '') + '</td>\
        </tr>\
        <tr>\
            <th>专业协会</th>\
            <td>'+ (data.zhuanye_xiehui || '') + '</td>\
        </tr>\
        <tr>\
            <th>医师资格证书首页与详细信息页</th>\
            <td>\
                <img src="'+ imgPath + data.zige + '" class="img-responsive" width="50%" alt="营业执照or民办非企业单位证书">\
            </td>\
        </tr>\
        <tr>\
            <th>医师执业证书首页与详细信息页</th>\
            <td>\
                <img src="'+ imgPath + data.congye + '" class="img-responsive" width="50%" alt="医疗机构职业许可证">\
            </td>\
        </tr>\
        <tr>\
            <th>医疗美容主诊医生资格证书详细信息页</th>\
            <td>\
                <img src="'+ imgPath + data.zhuzhen + '" class="img-responsive" width="50%" alt="医疗广告审查证明">\
            </td>\
        </tr>';
        $('.container .table tbody').html(html);
    }
}

$(function () {
    detailUtil.init();
    //编辑医生
    $("#docterEdit").on("click",function(){
    	var goUrl = "doctorEdit.html?";
            if (detailUtil.status == "10" || detailUtil.status == "11") {
                goUrl += "id=" + detailUtil.id + "&status=" + detailUtil.status;
            } else {
                goUrl += "hisId=" + detailUtil.his_id + "&status=" + detailUtil.status;
            }
    	parent.layer.open({
            type: 2,
            title: '编辑医生',
            shadeClose: true,
            shade: [0.5, '#000'],
            maxmin: false, //开启最大化最小化按钮
            area: ['90%', '60%'],
            content: goUrl,
            end:function(){
            	parent.window.location.reload();
            }
        });
    })
    
    // 医生预览
    $('#docterPreview').on('click',function(){
        var toUrl = "../../view/demoPreview/docterPreview.html?";
        if (detailUtil.status == "10" || detailUtil.status == "11") {
            toUrl += "id=" + detailUtil.id + "&status=" + detailUtil.status;
        } else {
            toUrl += "hisId=" + detailUtil.his_id + "&status=" + detailUtil.status;
        }
        parent.layer.open({
            type: 2,
            title: "医生信息",
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