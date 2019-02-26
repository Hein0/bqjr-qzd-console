
var holiday = {
    //新增
    add: function(){
        var startDay = $("#startDay").val();
        var endDay = $("#endDay").val();
        if(!startDay){
            $.Huimodalalert("开始时间不能为空", 2000);
            return;
        }
        if(!endDay){
            $.Huimodalalert("结束时间不能为空", 2000);
            return;
        }
        var param = util.serialize();
        $.post(base + "cae/insertVacations.do", param, function(data) {
            if (data.status == 0) {
                $.Huimodalalert(data.message, 2000);
                setTimeout(function(){
                    location.reload();
                },2000);
            } else {
                $.Huimodalalert(data.message, 2000);
            }
        });
    },

    //删除
    delete: function(id){
        var param = {id: id};
        $.post(base + "cae/delVacations.do", param, function(data) {
            if (data.status == 0) {
                $.Huimodalalert(data.message, 2000);
                setTimeout(function(){
                    location.reload();
                },2000);
            } else {
                $.Huimodalalert(data.message, 2000);
            }
        });
    },

    //初始化数据
    initData: function(obj){
        var param = {};
        param.pageNum = obj.curr||1;
        param.pageRows = obj.pageSize||20;
        $.post(base + "cae/getVacations.do", param, function(data) {
            if (data.status == 0) {
                $("#distList").tmpl(data).appendTo("#list");
            } else {
                $.Huimodalalert(data.message, 2000);
            }
        });
    }
}

$(function(){
    //初始化资金下拉框
    var className = {36:".capitals", 40:".type"};
    util.initSelect(className,"36,40");

    //获取列表
    holiday.initData(1);
})