var userDetail = userDetail || {};
userDetail.getData = function() {
    try {
        var id = util.getQueryString("id");
        var url = base + "/user/getUserDetail.do?r=" + Math.random();
        $.post(url, { "userId": id }, function(data) {
            var result = typeof(data);
            if (result == "string") {
                data = JSON.parse(data);
            }
            util.jumpLogin(data);
            if (data.status == "0") {
                // 格式化身份证有效期
                data.data.userInfoExtend.certStartDate = addLine(data.data.userInfoExtend.certStartDate);
                data.data.userInfoExtend.certEndDate = addLine(data.data.userInfoExtend.certEndDate);

                $("#userDetailContent").empty().append($("#tmplUserDetail").tmpl(data.data));
                $.Huitab("#tab_demo .tab-bar span", "#tab_demo .tab-con", "current", "click", "0");
                $(".photo-close").off("click").on("click", function() {
                    $(this).parent(".show-img").hide();
                    $("#msgshadeDiv").hide();
                });
                $(".table img").each(function() {
                    var img = $(this);
                    img.load(function() {
                        img.attr("isLoad", "true");
                    });
                    img.error(function() {
                        //可以选择替换图片
                    });
                });

            } else {
                $.Huimodalalert(data.message, 1500);
            }

        }, "json");

    } catch (ex) {
        if (window.console) {
            console.log(ex);
        }
    }
}

userDetail.showPhotos = function(index, img) {
    if (!index) return;
    var tab = $("#tab" + index);
    if (tab.find("img").attr("isload") == "true") {
        tab.show();
        $("#msgshadeDiv").show();
    } else {
        $.Huimodalalert("无证件信息！", 1500);
    }

}

jQuery(function($) {
    window.userId = util.getQueryString("id");
    window.updateUrl = '/user/' + window.userId + '/update';

    userDetail.getData();

    $('#userDetailContent').on('click', '.edit-this', function() {
        var $self = $(this),
            type = $self.attr('data-type'),
            oldVal = $self.prev().text(),
            $target = $('#' + type);

        $target.find('.old-value').text(oldVal);
        $target.find('input').val('');
        $target.find('input[type=checkbox]').prop('checked', false);
        $target.modal('show');
    })

    $('#sbtName').click(function() {
        var val = $('#editNameIpt').val(),
            $wrap = $('#editName'),
            $old = $('#lbServerName');

        if (!val) {
            $.Huimodalalert("姓名不能为空", 1500);
            return false;
        } else {
            updateInfo($wrap, $old, { name: val }, val);
        }
    })

    $('#sbtMobile').click(function() {
        var val = $('#editMobileIpt').val(),
            phoneReg = /^1[3|4|5|7|8][0-9]{9}$/,
            $wrap = $('#editMobile'),
            $old = $('#userMobile');

        if (!val) {
            $.Huimodalalert("请填写手机号码", 1500);
            return false;
        } else if (!(phoneReg.test(val))) {
            $.Huimodalalert("手机号码格式错误", 1500);
            return false;
        } else {
            updateInfo($wrap, $old, { mobile: val }, val);
        }
    })

    $('#sbtNumber').click(function() {
        var val = $('#editNumberIpt').val(),
            $wrap = $('#editNumber'),
            $old = $('#userCardNum');

        if (!val) {
            $.Huimodalalert("身份证号码不能为空", 1500);
            return false;
        } else {
            updateInfo($wrap, $old, { certId: val }, val);
        }
    })

    $('#sbtTime').click(function() {
        var start = $('#editTimeOne').val(),
            end = $('#editTimeTwo').val(),
            endTwo = $('#isLong').prop('checked'),
            $wrap = $('#editTime'),
            $old = $('#userCardTime'),
            data = {},
            render = '';

        if (!start) {
            $.Huimodalalert("请选择开始时间", 1500);
            return false
        } else if (!end && !endTwo) {
            $.Huimodalalert("请选择结束时间", 1500);
            return false
        } else {
            render = start + ' 至 ';
            data.certStartDate = removeLine(start);

            if (endTwo) {
                render += '长期';
                data.certEndDate = '长期';
            } else {
                render += end;
                data.certEndDate = removeLine(end);
            }

            updateInfo($wrap, $old, data, render);
        }
    })
});

function updateInfo($wrap, $old, data, renderVal) {
    $.ajax({
        url: base + updateUrl,
        method: 'PUT',
        dataType: 'json',
        data: data,
        success: function(res) {
            if (res.status == '0') {
                $wrap.modal('hide');
                $old.text(renderVal);
            }

            $.Huimodalalert(res.message, 1500);
        }
    })
}

function addLine(str) {
    return str.slice(0, 4) + '-' + str.slice(4, 6) + '-' + str.slice(6, 8);
}

function removeLine(str) {
    return str.replace(/[--]/g, '');
}
