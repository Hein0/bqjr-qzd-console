var accountId = util.getQueryString("accountId");
var wallet = {
    param: {},
    detParam: {},
    //跳转
    jump: function(accountId,obj){
        $(obj).attr('data-href', 'view/wallet/walletDetail.html?accountId=' + accountId);
        $(obj).attr('data-title', '钱包详情');
        Hui_admin_tab($(obj).get());
    },

    //列表搜索
    search: function(){
        wallet.param = util.serialize();
        wallet.requestData(1);
    },

    //详情搜索
    detSearch: function(){
        wallet.detParam = util.serialize();
        wallet.detParam.accountId = accountId;
        console.log(wallet.detParam);
        wallet.requestDetDate(1);
    },
	
	//用户管理跳转钱包列表
	userSearch: function (){
		wallet.param = util.serialize();
        wallet.param.userId = util.getQueryString("userId");
        console.log(wallet.detParam);
        wallet.requestData(1);
	},
	
    //列表加载数据
    requestData: function(obj){
        wallet.param.pageNum = obj.curr||1;
        wallet.param.pageRows = obj.pageSize||20;
        
        $.post(base+"burse/getWalletList.do",wallet.param,function(data){
            util.jumpLogin(data);
            if(data.status == 0){
                $("tbody").html("");
                var dataCount;
                if(wallet.param.pageNum == 1){
                    dataCount = data.dataCount;
                }
                setPagination({
                    elem: $('#pagination'),
                    totalCount: dataCount,
                    curr: wallet.param.pageNum,
                    callback: function (obj) {
                        wallet.requestData(obj);
                    }
                });
                if(data.data.length){
                    console.log(dataCount);
                    $("#walletList").tmpl(data).appendTo("tbody");
                }else{
                    $.Huimodalalert(data.message, 2000);
                }
            }else{
                $.Huimodalalert(data.message, 2000);
            }
        });
    },

    //详情加载数据
    requestDetDate: function(obj){
        wallet.detParam.pageNum = obj.curr||1;
        wallet.detParam.pageSize = obj.pageSize||20;
        $.post(base+"burse/getWalletDetail.do",wallet.detParam,function(data){
            util.jumpLogin(data);
            if(data.status == 0){
                $("tbody").html("");
                var dataCount;
                if(wallet.detParam.pageNum == 1){
                    dataCount = data.dataCount;
                }
                setPagination({
                    elem: $('#pagination'),
                    totalCount: dataCount,
                    curr: wallet.detParam.pageNum,
                    callback: function (obj) {
                        wallet.requestDetDate(obj);
                    }
                });
                if(data.data.length){
                    $("#walletDetList").tmpl(data).appendTo("tbody");
                }else{
                    $.Huimodalalert(data.message, 2000);
                }
            }else{
                $.Huimodalalert(data.message, 2000);
            }
        });
    },

    //弹出导出弹窗
    openExport: function(){
        $('#mymodal').modal('show');
    },

    //导出
    export: function(){
        var len = $("#list").children().length;
        if(!len){
            $.Huimodalalert("导出数据不能为空！", 2000);
            return;
        }
        var fileName = $("#fileName").val();
        if(fileName == ""){
            $(".p").show();
            return;
        }
        var param = $(".search-form").serialize();
        param = param + "&fileName="+fileName;
        console.log(param);
        location.href = base+"burse/exportExcel.do?"+param;
        $('#mymodal').modal('hide');
    }
}

$(function(){
    var className = {11:".status",42:".checkType",41:".education"};
    util.initSelect(className,"11,42,41");
    util.checkForm();
    if(accountId){
        wallet.detSearch();
    }
    //用户管理跳转钱包列表
    var userId = util.getQueryString('userId');
    if (userId){
    	 wallet.userSearch()
    }
   
})