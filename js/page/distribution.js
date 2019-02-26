
var dist = {
    //修改配置
    edit: function(captital,type,nDay,arrivalDay,trial,moreOrnot,sameUserMore,cashPercent,payloadPercent,consumePercent,periodList){
        dist.popOpen();
        $('input[name="nper"]').removeAttr("checked");
        $(".party").val(captital);
        $(".type").val(type);
        $("#nDay").val(nDay);
        $(".arrivalDay").val(arrivalDay);
        $(".trial").val(trial);
        $(".moreOrnot").val(moreOrnot);
        $(".sameUserMore").val(sameUserMore);
        $("#cashPercent").val(cashPercent);
        $("#payloadPercent").val(payloadPercent);
        $("#consumePercent").val(consumePercent);
        var listArray = periodList.split(",");
        $.each(listArray,function(i,item){
            $('input[name="nper"]').each(function(j){
                if($(this).val() == item){
                    $(this).prop("checked",true);
                }
            });
        });
    },

    //弹出导出弹窗
    popOpen: function(){
        $('#mymodal').modal('show');
    },

    //新增
    add: function(obj){
        var nDay = $("#nDay").val();
        var cashPercent = $("#cashPercent").val();
        var payloadPercent = $("#payloadPercent").val();
        var consumePercent = $("#consumePercent").val();
        var periodList = $("#periodList").val();
        if(!nDay){
            $.Huimodalalert("预计到账时间不能为空", 2000);
            return;
        }
        if(!cashPercent){
            $.Huimodalalert("请输入现金分期比例", 2000);
            return;
        }
        if(!payloadPercent){
            $.Huimodalalert("请输入短期借款比例", 2000);
            return;
        }
        if(!consumePercent){
            $.Huimodalalert("请输入消费分期比例", 2000);
            return;
        }
        var param = util.serialize();

        //支持分期期数
        var npers = "";
        $('input[name="nper"]:checked').each(function(){
            npers += $(this).val() + ",";
        });
        param.periodList = npers.substring(0, npers.length-1);
        param.pageNum = obj.curr||1;
        param.pageRows = obj.pageSize||20;
        console.log(param);
        $.post(base + "cae/setCaptitalSeekPercent.do", param, function(data) {
            if (data.status == 0) {
                $.Huimodalalert(data.message, 2000);
                setTimeout(function(){
                    location.reload();
                },2000);
            } else {
                $.Huimodalalert(data.message, 2000);
            }
        });
    }
}

$(function(){
    //初始化资金下拉框
    var className = {36:".party", 39:".arrivalDay"};
    util.initSelect(className,"36,39");

    //获取列表
    $.post(base + "cae/getCaptitalSeekPercent.do", function(data) {
        if (data.status == 0) {
            $("#distList").tmpl(data).appendTo("#list");
        } else {
            $.Huimodalalert(data.message, 2000);
        }
    });
})