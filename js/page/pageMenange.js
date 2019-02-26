var pageMenange = {
	init: function () {
		this.queryLeftPlate();

        //跳转到发现
        $(".pannel-discover").bind("click",function(){
        	$(this).find('.activityImg').addClass('activity')
        	 $(this).closest('.swiper-slide').siblings().find('.activityImg').removeClass('activity')
            $(".page-con").load("pageDiscover.html");
        });
	}

    //跳转到板块
    ,loadPhone: function(leftId,el){
        $(".page-con").load("pagePhone.html");
        localStorage.setItem('leftId',leftId)
        $(el).find('.activityImg').addClass('activity')
        $(el).closest('.swiper-slide').siblings().find('.activityImg').removeClass('activity')
    }
	
	//初始化左向菜单（顶部面板轮播）
	,queryLeftPlate: function () {
		var self = this;
		$.get(base + 'plate/getMenuLeftList.do', function (res) {
			if (res.status == 0) {
				var strHtml = '';
				$.each(res.data, function(i,item) {
                    strHtml += '<div class="swiper-slide red-slide"> <a leftId="'+ item.leftId +'" class="change-panel change-panel-plate" href="javascript:;" onclick="pageMenange.loadPhone('+ item.leftId +',this);"><img src="../../images/phonePlate.jpg"/><img class="activityImg" src="../../images/activityIcon.png"/><p>'+ item.leftMenuName +'</p></a></div>'
				});
//				$('#left-menu-panel').empty()
				$(strHtml).appendTo('#left-menu-panel')
					self.openLeftSwiper()
					$(".pannel-discover").click();
//				$('#left-menu-panel .change-panel:first').click();
			}
		})
	}
	
		//启动轮播
	,openLeftSwiper: function () {
		var mySwiper = new Swiper('.swiper-container1', {
				//autoplay: 2000,//可选选项，自动滑动
	//			watchSlidesProgress : true,
	//			watchSlidesVisibility : true,
				width:200,
				height: 200,
				prevButton:'.swiper-button-prev',
				nextButton:'.swiper-button-next',
				initialSlide :0,
				grabCursor : true,
				autoHeight: true, //高度随内容变化
				mousewheelControl : true,//开启鼠标控制Swiper切换。
				keyboardControl : true,//使用键盘方向键控制slide滑动
				//pagination : '.swiper-pagination',//分页器
				paginationClickable :true,
		})
	}
}
pageMenange.init()