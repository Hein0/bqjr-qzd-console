/**
 * Created by kuangMin on 2017/8/28.
 */
var pageNum = 1;
var pageSize = 20;
var validates = [
    {
        id: "name"
    },
    {
        id: "number"
    },
    {
        id: "timeStart"

    },
    {
        id: "timeEnd"
    },
    {
        id: "orderStatus"
    }
];
$(function () {
    $("#resetBtn").click(function () {
        resetForm(validates);
    });
    var className = { 12: ".msg-leixin", 13: ".msg-tuisong", 14: ".msg-bankuai" };
    util.initSelect(className, "12,13,14");
    //初始化列表
    initList({ pageNum: pageNum, pageSize: pageSize });
});

function resetForm(obj) {
    var datas = {};
    $.each(obj, function (i, e) {
        if (e.id) {
            var ele = $("#" + e.id);
        } else if (e.name) {
            var eles = $("[name='" + e.name + "']");
        }

        if (ele) {
            ele.val("");
        } else if (eles) {
            $.each(eles, function (i, e3) {
                if (e3.checked) {
                    e3.value = "";
                }
            })
        }
    });
    return datas;
}

function getDetailMsg(id, obj, txt, pushType) {
    $(obj).attr('data-href', 'view/operate/createMessage.html?info=' + txt + '+&groupId=' + id + '+&pushType=' + pushType);
    if (txt == 1) {
        $(obj).attr('data-title', '用户编辑');
    } else {
        $(obj).attr('data-title', '消息详情');
    }

    Hui_admin_tab($(obj).get());

}
function initList(options) {
    $.post(base + "/message/getMessageInfos.do", options, function (json) {
        util.jumpLogin(json);
        if (json.status == "0" && json.data) {
            if (json.data.length) {
                $('#itemsList').html(doT.template($('#itemsListTmp').html())(json));

            } else {
                $('#itemsList').html('');
            }
        } else {
            $.Huimodalalert(json.message, 1500);
        }
        // 设置分页
        setPagination({
            elem: $('#pagination'),
            totalCount: json.dataCount,
            curr: options["pageNum"],
            callback: function (obj) {
                options.pageNum = obj.curr;
                options.pageSize = obj.pageSize;
                initList(options)
            }
        });
      
    });
}

function listScreen() {
    var datas = util.getFormData(validates);
    // console.log(datas);
    datas["pageNum"] = pageNum;
    datas["pageSize"] = pageSize;
    initList(datas);
}