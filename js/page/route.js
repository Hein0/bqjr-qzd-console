var setDatas = {};
var selectInit = {};
var selectObj = {};
var csDayList = '';
$(function(){
    //初始化资金下拉框
    var className = {36:".party"};
    util.initSelect(className,"36");

    //初始化select
    $.get(base + "dictionary/getInfo?type=36", function(data){
        if (data.status == 0) {
            for(key in data.data[36]){
                selectObj[key] = data.data[36][key];
                selectInit[key] = data.data[36][key];
            };
        } else {
            $.Huimodalalert(data.message, 2000);
        }
    });

    //选择日期
    var content = document.getElementById("content");
    content.onmousedown = function() {
        document.addEventListener("mousedown",clearEventBubble,false);
        var selList = [];
        var fileNodes = document.getElementById("day").getElementsByTagName("li");
        for ( var i = 0; i < fileNodes.length; i++) {
            if (fileNodes[i].className.indexOf("fileDiv") != -1) {
                // fileNodes[i].className = "fileDiv";
                selList.push(fileNodes[i]);
            }
        }

        var isSelect = true;
        var navH = $("nav").height();
        var evt = window.event || arguments[0];
        var startX = (evt.x || evt.clientX);
        var startY = (evt.y - navH || evt.clientY - navH);
        var selDiv = document.createElement("div");
        selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
        selDiv.id = "selectDiv";
        content.appendChild(selDiv);
        selDiv.style.left = startX + "px";
        selDiv.style.top = startY + "px";
        var _x = null;
        var _y = null;

        content.onmousemove = function() {
            evt = window.event || arguments[0];
            if (isSelect) {
                if (selDiv.style.display == "none") {
                    selDiv.style.display = "";
                }
                _x = (evt.x || evt.clientX);
                _y = (evt.y - navH || evt.clientY - navH);
                selDiv.style.left = Math.min(_x, startX) + "px";
                selDiv.style.top = Math.min(_y, startY) + "px";
                selDiv.style.width = Math.abs(_x - startX) + "px";
                selDiv.style.height = Math.abs(_y - startY) + "px";

                // ---------------- 关键算法 ---------------------
                var dayL = $("#day").offset().left;
                var dayT = $("#day").offset().top - navH;

                var _l = selDiv.offsetLeft, _t = selDiv.offsetTop;
                var _w = selDiv.offsetWidth, _h = selDiv.offsetHeight;

                for ( var i = 0; i < selList.length; i++) {
                    var sl = selList[i].offsetWidth + selList[i].offsetLeft;
                    var st = selList[i].offsetHeight + selList[i].offsetTop;
                    if ((sl + dayL) > _l && (st + dayT) > _t && (selList[i].offsetLeft + dayL)  < _l + _w && (selList[i].offsetTop + dayT)  < _t + _h) {
                        if (selList[i].className.indexOf("seled") == -1) {
                            selList[i].className = selList[i].className + " seled";
                        }
                    }else{
                        if(selList[i].className.indexOf("seled") != -1) {
                            selList[i].className = "fileDiv";
                        }
                    }
                }
            }
            // clearEventBubble(evt);
        }

        content.onmouseup = function() {
            document.removeEventListener("mousedown",clearEventBubble,false);
            isSelect = false;
            if (selDiv) {
                content.removeChild(selDiv);
                showSelDiv(selList);
            }
            selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
        };
    };
});

function clearEventBubble(evt) {
    if (evt.stopPropagation)
        evt.stopPropagation();
    else
        evt.cancelBubble = true;

    if (evt.preventDefault)
        evt.preventDefault();
    else
        evt.returnValue = false;
};

//选择日期结果
function showSelDiv(arr) {
    var count = 0;
    for ( var i = 0; i < arr.length; i++) {
        if (arr[i].className.indexOf("seled") != -1) {
            count++;
            var key = $(arr[i]).find("span").text();
            setDatas[key] = {captitalSeekTimeMap: {}};
            csDayList += key;
            csDayList += ",";
            // setDatas.csDay = i+1;
        }
    }
    csDayList = csDayList.substring(0,csDayList.length-1);

    if(count){
        if(seekDays){
            $(".pop").show();
            var key = $(".seled :last").children("span").text();
            if(seekDays[key]){
                var timeMap = seekDays[key].captitalSeekTimeMap;
                for (var i in timeMap) {
                    var priorityText = "";
                    $.each(timeMap[i].captitalSeekRules,function(index,val){
                        priorityText += '<span val="'+val.captital+'">'+(index+1) + val.captitalName + '; </span>';
                    });
                    $(".pop-priority").eq(i).html(priorityText);
                }
            }else{
                $(".pop-priority").text("");
            }

            var popTime = document.getElementById("popTime");
            popTime.onmousedown = function() {
                var selList = [];
                var fileNodes = popTime.getElementsByTagName("td");
                for ( var i = 0; i < fileNodes.length; i++) {
                    if (fileNodes[i].className.indexOf("pop-time") != -1) {
                        fileNodes[i].className = "pop-time";
                        selList.push(fileNodes[i]);
                    }
                }

                var isSelect = true;
                var evt = window.event || arguments[0];
                var startX = (evt.x || evt.clientX);
                var startY = (evt.y || evt.clientY);
                var selDiv = document.createElement("div");
                selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
                selDiv.id = "selectDiv";
                popTime.appendChild(selDiv);
                selDiv.style.left = startX + "px";
                selDiv.style.top = startY + "px";
                var _x = null;
                var _y = null;
                clearEventBubble(evt);

                popTime.onmousemove = function() {

                    evt = window.event || arguments[0];

                    if (isSelect) {
                        if (selDiv.style.display == "none") {
                            selDiv.style.display = "";
                        }
                        _x = (evt.x || evt.clientX);
                        _y = (evt.y || evt.clientY);
                        selDiv.style.left = Math.min(_x, startX) + "px";
                        selDiv.style.top = Math.min(_y, startY) + "px";
                        selDiv.style.width = Math.abs(_x - startX) + "px";
                        selDiv.style.height = Math.abs(_y - startY) + "px";

                        // ---------------- 关键算法 ---------------------
                        var tabL = $("#popTime").find("table").offset().left;
                        var tabT = $("#popTime").find("table").offset().top;

                        var _l = selDiv.offsetLeft, _t = selDiv.offsetTop;
                        var _w = selDiv.offsetWidth, _h = selDiv.offsetHeight;
                        for ( var i = 0; i < selList.length; i++) {
                            var sl = selList[i].offsetWidth + selList[i].offsetLeft;
                            var st = selList[i].offsetHeight + selList[i].offsetTop;
                            if ((sl + tabL) > _l && (st + tabT) > _t && (selList[i].offsetLeft + tabL)  < _l + _w && (selList[i].offsetTop + tabT)  < _t + _h) {
                                if (selList[i].className.indexOf("seled") == -1) {
                                    selList[i].className = selList[i].className + " seled";
                                }
                            }else{
                                if(selList[i].className.indexOf("seled") != -1) {
                                    selList[i].className = "fileDiv";
                                }
                            }
                        }
                    }
                    clearEventBubble(evt);
                }

                popTime.onmouseup = function() {
                    isSelect = false;
                    if (selDiv) {
                        popTime.removeChild(selDiv);
                        timeSelDiv(selList);
                    }
                    selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
                }
            }
        }else{
            $.Huimodalalert("系统异常", 2000);
        }
    }
};

//确定时间资方
function timeCapital(){
    var span = "";
    $(".dist-select .dis-sopt").each(function(i){
        var div = $(".dist-select .dis-sopt").eq(i);
        span += '<span val="'+div.find("select").val()+'">'+(i+1);
        span += div.find("select option:selected").text()+'; </span>';
    });
    $("#popTime").find(".seled").next(".pop-priority").html(span);
    $('#mymodal').modal('hide');
};

//确定配置
var canClick = 1;
function allocation(){
    if(canClick){
        var seekTimeMap = {};
        var td = $("#popTime").find(".pop-priority");;
        td.each(function(i){
            var priorityHtml = td.eq(i).html();
            if(priorityHtml){
                seekTimeMap[i] = {};
                var captitalSeekRules = [];
                td.eq(i).find("span").each(function(j){
                    var captitalSeekRule = {captital: td.eq(i).find("span").eq(j).attr("val")};
                    captitalSeekRules.push(captitalSeekRule);
                });
                // seekTimeMap[i+1].csTime = i+1;
                seekTimeMap[i].captitalSeekRules = captitalSeekRules;
            }
        });
        for (var key in setDatas) {
            setDatas[key].captitalSeekTimeMap = seekTimeMap;
        }
        canClick = 0;
        var param = {captitalSeekDayMap: setDatas, csMonth: changeMonth+1};
        param = JSON.stringify(param);
        $.ajax({
            type: "post",
            url: base + 'cae/saveCaptitalSeek.do',
            contentType: "application/json; charset=utf-8",
            data: param,
            dataType: "JSON",
            success: function (data) {
                canClick = 1;
                if(data.status == 0) {
                    location.reload();
                }else{
                    $.Huimodalalert(data.message, 2000);
                }
            },
            error: function(){
                canClick = 1;
            }
        });
    }
};

//清空
function empty(){
    $(".pop-priority").text("");
    var param = {csMonth: changeMonth+1, csDayArray:csDayList};
    $.post(base + "cae/delCaptitalSeek.do", param, function(data){
        if (data.status == 0) {
            $.Huimodalalert(data.message, 2000);
            setTimeout(function(){
                location.reload();
            },2000);
        } else {
            $.Huimodalalert(data.message, 2000);
        }
    });
};

//新增资方
function addCapital(){
    var len = $(".dist-select").children("div").length;
    var capitalLen = 0;
    $(".dist-select").find("select").each(function(i){
        var val = $(".dist-select").find("select").eq(i).val();
        for(item in selectObj){
            capitalLen++;
            if(val == item){
                delete selectObj[val];
            }
        }
    });
    if(len >= capitalLen){
        $.Huimodalalert("没有资方了", 2000);
        return;
    }
    var div = '<div class="dis-sopt">' +
        '<select>';
        for(key in selectObj){
            div += '<option value="'+key+'">'+selectObj[key]+'</option>';
        }
        div += '</select>';
        div += '&nbsp;&nbsp;<a href="javascript:" onclick="delCapital(this);">删除</a>';
        div += '</div>';
    $(div).appendTo(".dist-select");

    //更改资方
    $(".dist-select").find("select").change(function(){
        var index = $(this).parent().index();
        $(".dist-select").find(".dis-sopt").each(function(i){
            if(i > index){
                $(".dist-select").find(".dis-sopt:last").remove();
            }
        });
        for(key in selectInit){
            selectObj[key] = selectInit[key];
        }
    });
};

//删除资方
function delCapital(obj){
    var index = $(obj).parent().index();
    $(".dist-select").find(".dis-sopt").each(function(i){
        if(i >= index){
            $(".dist-select").find(".dis-sopt:last").remove();
        }
    });
    for(key in selectInit){
        selectObj[key] = selectInit[key];
    }
};

//选择时间结果
function timeSelDiv(arr) {
    var count = 0;
    var selInfo = "";
    for ( var i = 0; i < arr.length; i++) {
        if (arr[i].className.indexOf("seled") != -1) {
            count++;
            selInfo += arr[i].innerHTML + "\n";
        }
    }
    if(count){
        $('#mymodal').modal('show');
        var len = $(".dist-select .dis-sopt").length;
        if(len > 1){
            $(".dist-select").find(".dis-sopt").each(function(i){
                if(i > 0){
                    $(".dist-select").find(".dis-sopt:last").remove();
                }
            });
            for(key in selectInit){
                selectObj[key] = selectInit[key];
            }
        }
    }
};

//关闭
function popClose(){
    $(".pop").hide();
    $("#day").find("li").removeClass("seled");
};