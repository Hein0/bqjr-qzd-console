$(function () {
    $('.table-sort').dataTable({
        "aaSorting": [
            [1, "desc"]
        ], //默认第几个排序
        "bStateSave": true, //状态保存
        "aoColumnDefs": [
            //{"bVisi   ble": false, "aTargets": [ 3 ]} //控制列的隐藏显示
            {
                "orderable": false,
                "aTargets": [0, 8, 9]
            } // 制定列不参与排序
        ]
    });

});
/*用户-添加*/
function member_add(title, url, w, h) {
    layer_show(title, url, w, h);
}
/*用户-查看*/
function member_show(title, url, id, w, h) {
    layer_show(title, url, w, h);
}
/*用户-停用*/
function member_stop(obj, id) {
    layer.confirm('确认要停用吗？', function (index) {
        $.ajax({
            type: 'POST',
            url: '',
            dataType: 'json',
            success: function (data) {
                $(obj).parents("tr").find(".td-manage").prepend('<a style="text-decoration:none" onClick="member_start(this,id)" href="javascript:;" title="启用"><i class="Hui-iconfont">&#xe6e1;</i></a>');
                $(obj).parents("tr").find(".td-status").html('<span class="label label-defaunt radius">已停用</span>');
                $(obj).remove();
                layer.msg('已停用!', {
                    icon: 5,
                    time: 1000
                });
            },
            error: function (data) {
                console.log(data.msg);
            },
        });
    });
}

/*用户-启用*/
function member_start(obj, id) {
    layer.confirm('确认要启用吗？', function (index) {
        $.ajax({
            type: 'POST',
            url: '',
            dataType: 'json',
            success: function (data) {
                $(obj).parents("tr").find(".td-manage").prepend('<a style="text-decoration:none" onClick="member_stop(this,id)" href="javascript:;" title="停用"><i class="Hui-iconfont">&#xe631;</i></a>');
                $(obj).parents("tr").find(".td-status").html('<span class="label label-success radius">已启用</span>');
                $(obj).remove();
                layer.msg('已启用!', {
                    icon: 6,
                    time: 1000
                });
            },
            error: function (data) {
                console.log(data.msg);
            },
        });
    });
}
/*用户-编辑*/
function member_edit(title, url, id, w, h) {
    layer_show(title, url, w, h);
}
/*密码-修改*/
function change_password(title, url, id, w, h) {
    layer_show(title, url, w, h);
}
/*用户-删除*/
function member_del(obj, id) {
    layer.confirm('确认要删除吗？', function (index) {
        $.ajax({
            type: 'POST',
            url: '',
            dataType: 'json',
            success: function (data) {
                $(obj).parents("tr").remove();
                layer.msg('已删除!', {
                    icon: 1,
                    time: 1000
                });
            },
            error: function (data) {
                console.log(data.msg);
            },
        });
    });
}
