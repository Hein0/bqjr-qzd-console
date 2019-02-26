var brand = {
    param: {},
    brandUrl: "",
    delId: "",
    editId: "",
    isAdd: 1,
    //添加、编辑弹窗
    openAdd: function(obj){
        $("#modal-add").find("input").val("");
        $("#modal-add").modal("show");
        if(obj){
            brand.isAdd = 0;
            $("#brandName").val($(obj).parent().prev().text());
            $("#brandUrl").val($(obj).parent().prev().find("img").attr("data"));
            brand.editId = $(obj).attr("id");
        }else{
            brand.isAdd = 1;
        }
    },

    //添加、编辑
    edit: function(obj){
        var param = {};
        var brandName = $("#brandName").val();
        var brandUrl = $("#brandUrl").val();
        if(!brandName){
            $.Huimodalalert("品牌名称不能为空", 2500);
            return;
        }
        param.name = brandName || '';
        param.url = brandUrl || '';
        if(brand.isAdd){
            param.opt = "add";
        }else{
            param.opt = "update";
        }
        if(brand.editId){
            param.id = brand.editId;
        }else{
            delete param.id;
        }
        $.post(base+"goodsAdmin/addOrUpdateBrand.do",param,function(data){
            util.jumpLogin(data);
            if(data.status == 0){
                $("#modal-add").modal("hide");
                $.Huimodalalert(data.message, 2000);
                setTimeout(function(){
                    location.reload();
                },2000);
            }else{
                $.Huimodalalert(data.message, 2000);
            }
        });
    },

    //删除弹窗
    openDel: function(obj){
        $("#modal-del").modal("show");
        brand.delId = obj;
    },

    //删除
    del: function(){
        $.post(base+"/goodsAdmin/deleteBrand.do",{id: brand.delId},function(data){
            util.jumpLogin(data);
            $("#modal-del").modal("hide");
            if(data.status == 0){
                $.Huimodalalert(data.message, 2000);
                setTimeout(function(){
                    location.reload();
                },2000);
            }else{
                $.Huimodalalert(data.message, 2000);
            }
        });
    },

    //查询
    search: function(){
        brand.param = util.serialize();
        brand.requestData(1);
    },

    //图片上传
    upLoadImg: function () {
        /*$("#file").takungaeImgup({
            formData: { "path": "Content/Images/", "name": "OrderScrshotCol" }, //path参数会发送给服务器，name参数代表上传图片成功后，自动生成input元素的name属性值
            url:base + 'common/upload',    //发送请求的地址，服务器地址
            success: function (data) {
                alert(1)
                if(data.status == 0){
                    brand.brandUrl = data.data;
                    $("#brandUrl").val(data.message);
                    alert(brand.brandUrl);
                }else{
                    $.Huimodalalert(data.message, 2000);
                }
            },
            error: function (err) {
                $.Huimodalalert(err, 2000);
            }
        });*/

        $("#file").change(function(){
            var formData = new FormData();
            formData.append("file", $("#file").get(0).files[0]);
            $.ajax({
                url: base+"common/upload",
                type: "POST",
                processData: false,
                contentType: false,
                data: formData,
                dataType:"JSON",
                success: function(data){
                    if(data.status=='0'){
                        console.log(data);
                        brand.brandUrl = data.data;
                        $("#brandUrl").val(data.data);
                    }else{
                        $.Huimodalalert(data.message, 2000);
                    }
                }
            });

        });
    },

    //获取数据列表
    requestData: function(obj){
        brand.param.pageNum = obj.curr||1;
        brand.param.pageSize = obj.pageSize||20;
        $.get(base+"/goodsAdmin/getBrands.do",brand.param,function(data){
            util.jumpLogin(data);
            if(data.status == 0){
                $("tbody").html("");
                var dataCount;
                if(brand.param.pageNum == 1){
                    dataCount = data.dataCount;
                }
                setPagination({
                    elem: $('#pagination'),
                    totalCount: dataCount,
                    curr: brand.param.pageNum,
                    callback: function (obj) {
                        brand.requestData(obj);
                    }
                });
                if(data.data.length){
                    $("#brandList").tmpl(data).appendTo("tbody");
                }else{
                    $.Huimodalalert("暂无数据", 2000);
                }
            }else{
                $.Huimodalalert(data.message, 2000);
            }
        });
    }
}

$(function(){
    brand.requestData(1);
    brand.upLoadImg();
});