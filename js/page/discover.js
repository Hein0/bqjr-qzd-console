var discover = {
	parm: {},
	detParam: {},
    initPlateArry: [],
    plateCode: "",
    terminal: 0,    //显示终端
    leftId: 0,      //左菜单Id
    imgList: [],
    plateIndex: 0,
    imgIndex: 0,
    //启动板块轮播
    openPlateSwiper: function () {
        var mySwipers = new Swiper('.swiper-container3', {
            autoplay: 2000,//可选选项，自动滑动
            width:320,
            height: 100,
            prevButton:'.swiper-button-prev',
            nextButton:'.swiper-button-next',
            initialSlide :0,
            grabCursor : true,//鼠标为手指形状
            mousewheelControl : true,//开启鼠标控制Swiper切换。
            keyboardControl : true,//使用键盘方向键控制slide滑动
            pagination : '.swiper-pagination-2',//分页器
            paginationClickable :true,
        })
    },

    //发布主题
    release: function(){
        $.post(base+"plate/sendPlate.do",{leftId: 0},function(data){
            util.jumpLogin(data);
            if(data.status == 0){
                $.Huimodalalert(data.message, 2000);
            }else{
                $.Huimodalalert(data.message, 2000);
            }
        });
    },

    //打开添加商品弹窗
    openAddPop: function(){
        var self = this;
        $.get(base + 'plate/getClassify.do',function (res) {
            if (res.status == 0) {
                self.treeList(res.data,1);
                var data = {};
                self.queryGoods(data,0);
            }
        })
        $('.pop_goods').show();
    },

    //获取商品列表
    queryGoods: function (data,obj) {
        var self = this;
        data.pageNum = (obj && obj.curr) || 1 // 默认第1页
        data.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
        $.get(base + 'plate/getSkuGoodsCollectRightMenu.do',data,function (res) {
            if (res.status == 0) {
                $("#link_goods").empty().append($('#popGoodsList').tmpl(res.data));

                //设置分页
                setPagination({
                    elem: $('#pop_pagination'),
                    totalCount: res.dataCount,
                    curr: data.pageNum,
                    callback: function (obj) {
                        $("#link_goods").empty()
                        self.queryGoods(data,obj);
                    }
                });
            }
        })
    },

    //选择商品
    goodsSubmit: function () {
        var checkbox = $('.link_goods input[type=radio]:checked');
        if(checkbox.length){
            $(".ph-ass").show();
            var skuId = $(checkbox).closest('li').attr('skuid');
            $("#ph-skuId").val(skuId);
            $(".ph-acon img").attr("src",$(checkbox).closest('li').children("img").attr("src"));
            $(".ph-acon p").text($(checkbox).closest('li').children(".link_name").text());
            $('.pop_goods').hide();
            $('.pop_add').show();
        }else{
            $.Huimodalalert("请选择关联商品", 2000);
        }
    },

    //树形列表
    treeList:function (obj) {
        var self = this;
        /*递归实现获取无级树数据并生成DOM结构*/
        var str = "";
        var forTree = function(o,num){

            for(var i=0;i<o.length;i++){
                var urlstr = "";
                try{
                    urlstr = "<div><span class='tree_span"+num+"' leftId='"+o[i]["leftId"]+"'><b>[+]</b>"+ o[i]["leftMenuName"] +"</span><ul>";
                    if (o[i]["rightMenusExtend"].length) {
                        $.each(o[i]["rightMenusExtend"], function(i,item) {
                            urlstr += "<div><span class='tree_span"+num+"' rightId='"+item.rightId+"'><img src='../../images/sub.gif'/>"+ item.rightMenuName +"</span>";
                        });

                    }

                    str += urlstr;
                    str += "</ul></div>";
                }catch(e){}
            }
            return str;
        }
        /*添加无级树*/
        document.getElementById("menuTree").innerHTML = forTree(obj,1);

        /*树形菜单*/
        var menuTree = function(){
            //给有子对象的元素加
            $("#menuTree ul").each(function(index, element) {
                var ulContent = $(element).html();
                var spanContent = $(element).siblings("span").html();
                if(ulContent){
                    $(element).siblings("span").html(spanContent)
                }
            });

            $("#menuTree").find("div span").click(function(){
                var ul = $(this).siblings("ul");
                var spanStr = $(this).text();
                $(this).addClass('choose')
                $(this).parents('div').siblings('div').removeClass('choose').find('span').removeClass('choose')

                if(ul.find("div").html() != null){
                    if(ul.css("display") == "none"){
                        ul.show(300);
                        $(this).find('b').html("[-]");
                    }else{
                        ul.hide(300);
                        $(this).find('b').html("[+]");
                    }
                }
                var data = {};
                data['rightId'] = $(this).attr('rightId')
                if (data['rightId']) {
                    self.queryGoods(data,0)
                }


            })
        }()

        /*树形列表展开*/
        $("#btn_open").click(function(){
            $("#menuTree ul").show(300);
            curzt("-");
        })

        /*收缩*/
        $("#btn_close").click(function(){
            $("#menuTree ul").hide(300);
            curzt("+");
        })
        function curzt(v){
            $("#menuTree span").each(function(index, element) {
                var ul = $(this).siblings("ul");
                var spanStr = $(this).html();
                var spanContent = spanStr.substr(3,spanStr.length);
                if(ul.find("div").html() != null){
                    $(this).html("["+ v +"] " + spanContent);
                }
            });
        }
    },

    //选择图片
    checkImg: function(obj){
        $(obj).addClass("ph-img-li").siblings().removeClass("ph-img-li");
        var index = $(obj).index();
        discover.imgIndex = index;
        var img = discover.initPlateArry[discover.plateIndex][index];
        if(img.skuId != -1){
            $(".ph-ass").show();
            if(img.skuId){
                $(".ph-ass img").attr("src",imgPath+img.thumb);
                $(".ph-ass p").text(img.skuName);
            }else{
                $(".ph-ass").hide();
            }
        }else{
            $(".ph-ass").hide();
        }
        $("#ph-madel-link").val(img.imgLink);
        $("#ph-madel-img").val(img.imgUrl);
        $("#ph-skuId").val(img.skuId);
    },

    //添加图片
    addImg: function(){
        var phLink = $("#ph-madel-link").val();
        var phImg = $("#ph-madel-img").val();
        var phSkuId = $("#ph-skuId").val() || -1;
        var len = $(".ph-img-list li").length + 1;
        var index = $(".ph-img-li").index() || 0;
        $("#ph-madel-link").val("");
        $("#ph-madel-img").val("");
        $("#ph-skuId").val("");
        $(".ph-img-list li").removeClass("ph-img-li");
        $(".ph-ass").hide();
        var li = '<li onclick="discover.checkImg(this)" class="ph-img-li">图片<span>'+len+'</span></li>';
        $(li).appendTo(".ph-img-list");
        discover.initPlateArry[discover.plateIndex].push({leftId:discover.leftId, plateCode:discover.plateCode, imgSort:len,imgLink:"",imgUrl:"",skuId:-1,terminal:discover.terminal});
        discover.initPlateArry[discover.plateIndex][index].imgLink = phLink;
        discover.initPlateArry[discover.plateIndex][index].imgUrl = phImg;
        discover.initPlateArry[discover.plateIndex][index].skuId = phSkuId;
    },

    //清空input里面的数据
    clearVal: function(){
        var len = $(".ph-img-list li").length;
        if(len == 1){
            $("#ph-madel-link").val("");
            $("#ph-madel-img").val("");
            $("#ph-skuId").val("");
            $(".ph-ass").hide();
            discover.initPlateArry[discover.plateIndex] = [];
            return;
        }
        $("#ph-madel-link").val("");
        $("#ph-madel-img").val("");
        $("#ph-skuId").val("");
        $(".ph-ass").hide();
        $(".ph-img-list li:last").remove();
        var index = $(".ph-img-li").index() || 0;
        discover.initPlateArry[discover.plateIndex].splice(index,1);
        for (var i=discover.imgIndex+1; i<discover.initPlateArry[discover.plateIndex].length;i++) {
            discover.initPlateArry[discover.plateIndex].imgSort = discover.initPlateArry[discover.plateIndex].imgSort - 1;
        }
        $(".ph-img-list li:last").click();
    },

    //打开编辑弹窗
	openPop: function(obj){
		var top = $(obj).offset().top;
		$(".ph-img-list").html("");
		$("#ph-madel-link").val("");
        $("#ph-madel-img").val("");
        $("#ph-skuId").val("");
        var index = $(obj).attr("index");
        discover.plateIndex = $(obj).attr("index");
        discover.plateCode = $(obj).attr("plateCode");

        $(".ph-right").show();
        $(".ph-right").css("top",top);

        var imgList = discover.initPlateArry[index];
        if(!imgList.length){
            imgList.push({leftId:discover.leftId, plateCode:discover.plateCode, imgSort:"",imgLink:"",imgUrl:"",skuId:"",terminal:discover.terminal});
        }
        var li = "";
        $.each(imgList,function(i,item){
            li += '<li onclick="discover.checkImg(this)" class="ph-img-li">图片<span>'+(i+1)+'</span></li>';
        });
        $(".ph-img-list").html(li);

        if(index <= 3){
            $(".plate-name").hide();
            $(".ph-goods").hide();
        }else{
            $(".ph-goods").show();
            var index1 = $(".ph-img-li").index() || 0;
            var img = imgList[index1];
            $("#ph-madel-name").val(img.plateName);
            if(img.skuId){
                $(".ph-ass").show();
                $(".ph-ass img").attr("src",imgPath+img.thumb);
                $(".ph-ass p").text(img.skuName);
            }else{
                $(".ph-ass").hide();
            }
        }
        if(index == 2 || index == 5){
            $(".plate-name").show();
            $("#ph-madel-name").val(imgList[0].plateName);
        }else{
            $(".plate-name").hide();
        }
        $(".ph-img-list li:first").click();
	},

	//关闭弹窗
	closePop: function(){
        $(".ph-right").hide();
	},

    //图片上传
    upLoadImg: function () {
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
                        $("#ph-madel-img").val(data.data);
                    }else{
                        $.Huimodalalert(data.message, 2000);
                    }
                }
            });

        });
    },

    //保存主题
    save: function(){
	    var phLink = $("#ph-madel-link").val();
	    var phImg = $("#ph-madel-img").val();
	    var index = $(".ph-img-li").index() || 0;
	    var skuId = -1;
	    if($("#ph-skuId").val()){
            skuId = $("#ph-skuId").val();
        }

        var plateImageList = discover.initPlateArry[discover.plateIndex];
	    var plateImage = plateImageList[index];
	    if(plateImage){
            plateImage.leftId = discover.leftId;
            plateImage.plateCode = discover.plateCode;
            plateImage.imgLink = phLink;
            plateImage.imgSort = index + 1;
            plateImage.imgUrl = phImg;
            plateImage.skuId = skuId;
            plateImage.terminal = discover.terminal;
        }
	    var param = {leftId: discover.leftId, plateCode:discover.plateCode, plateName:$("#ph-madel-name").val(), plateExtendListJson:JSON.stringify(plateImageList)};
        $.ajax({
            url: base+"plate/editPlate.do",
            type: "POST",
            data: param,
            dataType:"JSON",
            success: function(data){
                if(data.status == 0){
                    $.Huimodalalert(data.message, 2000);
                    setTimeout(function(){
                        $(".swiper-wrapper").html("");
                        $(".swiper-wrapper").css("transform","translate3d(0,0,0)");
                        $(".dis-class span").css("background-image","none");
                        $(".dis-all span").css("background-image","none");
                        discover.initData();
                    },2000);
                }else{
                    $.Huimodalalert(data.message, 2000);
                }
            }
        });
    },

	//获取数据
	initData: function(){
        $.get(base+"plate/getPlate.do?leftId=0",function(data){
            util.jumpLogin(data);
            if(data.status == 0){
                // discover.initPlateArry = data.data;
                var data = data.data;
                if(data.FX01){
                    discover.initPlateArry.push(data.FX01.plateImageList);
                }else{
                    discover.initPlateArry.push([]);
                }

                if(data.FX02){
                    discover.initPlateArry.push(data.FX02.plateImageList);
                }else{
                    discover.initPlateArry.push([]);
                }

                if(data.FX03){
                    $(".first-title").text(data.FX03.plateName);
                    discover.initPlateArry.push(data.FX03.plateImageList);
                }else{
                    discover.initPlateArry.push([]);
                }

                if(data.FX04){
                    discover.initPlateArry.push(data.FX04.plateImageList);
                }else{
                    discover.initPlateArry.push([]);
                }

                if(data.FX05){
                    discover.initPlateArry.push(data.FX05.plateImageList);
                }else{
                    discover.initPlateArry.push([]);
                }

                if(data.FX06){
                    $(".second-title").text(data.FX06.plateName);
                    discover.initPlateArry.push(data.FX06.plateImageList);
                }else{
                    discover.initPlateArry.push([]);
                }
                discover.renderData();
            }else{
                $.Huimodalalert(data.message, 2000);
            }
        });
	},

    //初始化页面
    renderData: function(){
        $.each(discover.initPlateArry,function(i,item){
            if(i == 0 && item.length){
                $.each(item,function(index,res){
                    var imgSrc = imgPath + res.imgUrl;
                    var div = '<div class="swiper-slide ph-banner-edit"><a class="top-banner-a" href="javascript:;"><img src="'+imgSrc+'"/><p>点击我进行编辑</p></a></div>';
                    $(div).appendTo($(".dis-plate0").find(".swiper-wrapper"));
                });
            }

            if(i == 1 && item.length){
                $.each(item,function(index,res){
                    var imgSrc = imgPath + res.imgUrl;
                    if(index == 3){
                        return false;
                    }
                    $(".dis-plate1 span").eq(index).css({"background-repeat":"no-repeat","background-image":"url("+imgSrc+")","background-position":"center"});
                });
            }

            if(i == 2 && item.length){
                $.each(item,function(index,res){
                    var imgSrc = imgPath + res.imgUrl;
                    var div = '<div class="swiper-slide ph-banner-edit"><a class="top-banner-a" href="javascript:;"><img src="'+imgSrc+'"/><p>点击我进行编辑</p></a></div>';
                    $(div).appendTo($(".dis-plate2").find(".swiper-wrapper"));
                });
            }

            if(i == 3 && item.length){
                $.each(item,function(index,res){
                    var imgSrc = imgPath + res.imgUrl;
                    var div = '<div class="swiper-slide ph-banner-edit"><a class="top-banner-a" href="javascript:;"><img src="'+imgSrc+'"/><p>点击我进行编辑</p></a></div>';
                    $(div).appendTo($(".dis-plate3").find(".swiper-wrapper"));
                });
            }

            if(i == 4 && item.length){
                $.each(item,function(index,res){
                    var imgSrc = imgPath + res.imgUrl;
                    if(index == 3){
                        return false;
                    }
                    $(".dis-plate4 span").eq(index).css({"background-repeat":"no-repeat","background-image":"url("+imgSrc+")","background-position":"center"});
                });
            }

            if(i == 5 && item.length){
                $.each(item,function(index,res){
                    var imgSrc = imgPath + res.imgUrl;
                    if(index == 4){
                        return false;
                    }
                    $(".dis-plate5 span").eq(index).css({"background-repeat":"no-repeat","background-image":"url("+imgSrc+")","background-position":"center"});
                });
            }
        });
        discover.openPlateSwiper();
    },

    //判断空对象
    isEmptyObject: function (e) {
        var t;
        for (t in e)
            return !1;
        return !0
    }
    
    //列表加载、筛选
    ,search: function(){
        this.param = util.serialize();
        this.detParam = this.param;
        this.queryGoods(this.detParam,0)
    }
}

$(function(){
	discover.initData();
	discover.upLoadImg();
	// discover.openPlateSwiper();

    //商品弹窗方法开始
    //关闭弹窗
    $('.close_btn, .pop_cancel').on('click',function () {
        $('.pop_goods').hide()
    })
    //打开弹窗，初始化商品列表
    $('.open-pop').on('click',function (ev) {
        discover.openPop()
    })
    //点击搜索
    $('#screeBtn').on('click',function (ev) {
        discover.search()
    })
    //重置
	$('#resetBtn').bind('click',function (ev) {
		util.reset()
	})
    
    //点击弹窗确定
    $('.pop_goods_submit').on('click',function (ev) {
        discover.goodsSubmit();
    })
});
