// 路径信息 之后可能添加其他路径类型
//sit环境
   var imgPath = "https://sitqz.bqjr.cn/"; //oss
   var base = "https://sitapiqz.bqjr.cn:8080/qzd/admin/";
//uat环境
//var imgPath = "https://uatqz.bqjr.cn/"; //oss
//var base = "https://uatapiqz.bqjr.cn:8080/qzd/admin/";
// 生产
//var imgPath = "https://qz.bqjr.cn/"; //oss
//var base = "https://apiqz.bqjr.cn:8080/qzd/admin/";

// 公共工具类 包含零散的工具方法

$.ajaxSetup({ crossDomain: true, xhrFields: { withCredentials: true } });

var util = util || {
  isBreak: false,

  getFormData: function(obj) {
    var datas = {};
    $.each(obj, function(i, e) {
      if (e.id) {
        var ele = $("#" + e.id);
      } else if (e.name) {
        var eles = $("[name='" + e.name + "']");
      }

      if (ele) {
        datas[e.id] = ele.val();
      } else if (eles) {
        $.each(eles, function(i, e3) {
          if (e3.checked) {
            datas[e.name] = e3.value;
          }
        });
      }
    });
    return datas;
  },

  validate: function(obj) {
    util.isBreak = false;
    var datas = {};
    $.each(obj, function(i, e) {
      if (util.isBreak) return false;
      if (e.id) {
        var ele = $("#" + e.id);
      } else if (e.name) {
        var eles = $("[name='" + e.name + "']");
      }

      $.each(e.items, function(i, e2) {
        if (ele) {
          if (util[e2 + "Valide"](ele, e.message[e2], e.id)) {
            datas[e.id] = ele.val();
          }
        } else if (eles) {
          $.each(eles, function(i, e3) {
            if (e3.checked) {
              datas[e.name] = e3.value;
            }
          });
        }
      });
    });
    return datas;
  },

  // 非空验证
  requireValide: function(ele, message, id) {
    if (!ele.val() && !ele.is(":hidden")) {
      ele.addClass("error");
      $.Huimodalalert(message, 2000);
      ele.focus(function() {
        ele.removeClass("error");
        //$("#"+id+"-error").remove();
      });
      util.isBreak = true;
    } else {
      ele.removeClass("error");
      return true;
    }
  },

  // 获取查询字符串
  // @param name string
  // @return have-result string
  // @return no-result null
  getQueryString: function(name) {
    return (
      decodeURIComponent(
        (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
          location.search
        ) || [, ""])[1].replace(/\+/g, "%20")
      ) || null
    );
  },

  // 序列化筛选表单
  serialize: function() {
    var paramStr = $(".search-form").serialize();
    var arry = paramStr.split("&");
    var param = {};
    $.each(arry, function(i, item) {
      var opt = item.split("=");
      if (opt[1]) {
        if (opt[1].indexOf("%") != -1) {
          param[opt[0]] = decodeURIComponent(opt[1]);
        } else {
          param[opt[0]] = opt[1];
        }
      }
    });
    return param;
  },

  // 重置筛选表单
  reset: function() {
    $(".search")
      .find("input")
      .val("");
    $(".search")
      .find("select")
      .val("");
  },

  // 筛选表单校验
  checkForm: function() {
    // 手机号
    $(".search .mobile").blur(function() {
      var val = $(this).val();
      var telReg = /^((13[0-9]|14[0-9]|15[0-9]|17[6-9]|18[0-9])\d{8}$)/;
      if (val && !telReg.test(val)) {
        $.Huimodalalert("请输入正确的手机号码", 2000);
        $(this).val("");
      }
    });

    // 身份证
    $(".search .idCard").blur(function() {
      var val = $(this).val();
      if (val && !util.validateIdCard(val)) {
        $.Huimodalalert("请输入正确的身份证号码", 2000);
        $(this).val("");
      }
    });
  },

  //跳到登录页面
  jumpLogin: function(data) {
    if (data.status == "9999") {
      window.top.location.href = "../../login.html";
    }
  },

  // 初始化筛选下拉框数据
  initSelect: function(className, type) {
    $.get(base + "dictionary/getInfo?type=" + type, function(data) {
      if (data.status == 0) {
        $.each(data.data, function(i, items) {
          var option = "";
          $.each(items, function(j, item) {
            option += "<option value=" + j + ">" + item + "</option>";
          });
          $(option).appendTo(className[i]);
        });
      } else {
        $.Huimodalalert(data.message, 2000);
      }
    });
  },

  // 验证身份证
  validateIdCard: function(idCard) {
    // 15位和18位身份证号码的正则表达式
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

    // 如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(idCard)) {
      if (idCard.length == 18) {
        var idCardWi = new Array(
          7,
          9,
          10,
          5,
          8,
          4,
          2,
          1,
          6,
          3,
          7,
          9,
          10,
          5,
          8,
          4,
          2
        ); // 将前17位加权因子保存在数组里
        var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); // 这是除以11后，可能产生的11位余数、验证码，也保存成数组
        var idCardWiSum = 0; // 用来保存前17位各自乖以加权因子后的总和
        for (var i = 0; i < 17; i++) {
          idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
        }

        var idCardMod = idCardWiSum % 11; // 计算出校验码所在数组的位置
        var idCardLast = idCard.substring(17); // 得到最后一位身份证号码

        // 如果等于2，则说明校验码是10，身份证号码最后一位应该是X
        if (idCardMod == 2) {
          if (idCardLast == "X" || idCardLast == "x") {
            return true;
          }
        } else {
          // 用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
          if (idCardLast == idCardY[idCardMod]) {
            return true;
          }
        }
      }
    }
    return false;
  },

  // 参数说明：
  // "info":"" // 消息内容,
  // "title":"" // 标题,
  // "ok":function(){
  //      确认后执行
  // },
  // "cancel":function(){
  //      取消后执行
  // }，
  // "time":{
  //      "sec":5,// 多少秒后消失
  //      "run":function(){
  //          消失执行的事件
  //      }
  // }
  popUp: function(opt) {
    if (typeof opt == "object") {
      var info = opt["info"];
      var timeObj = null;
      var _height = Math.max($(document).height(), $("body").height()) + "px";
      var _bg =
        '<div id="msgshadeDiv" class="shade_bg" style="height:' +
        _height +
        '; display: block;"></div>';
      var _msg = '<div id="msgContent" class="pop-up">';
      _msg += '<div class="p-content">';
      _msg += '<div class="flo_right delete-bg">';
      _msg += "<span class=\"delete-icon-logo\" id='msgClose'></span>";
      _msg += "</div>";
      _msg += "<em>";
      _msg += info;
      _msg += "</em>";
      if (opt.msg) {
        _msg += opt.msg;
      }
      _msg += "</div>";
      _msg += '<div class="content-exp fgx-line">';
      _msg += '<div class="btn-box">';
      if (opt.hasOwnProperty("cancel")) {
        _msg += '<span id="msgCancel" class="popup_btn_cancle">取消</span>';
      }
      if (opt.hasOwnProperty("ok")) {
        _msg += "<span id='msgSave' class=\"popup_btn_save\">确认</span>";
      }
      _msg += "</div>";
      _msg += "</div>";
      _msg += "</div>";
      $(document.body).append(_bg + _msg);
      // document.getElementById("msgshadeDiv").style.height = window.screen.height + "px";
      var left = ($(window).width() - $("#msgContent").width()) / 2;
      var top = ($(window).height() - $("#msgContent").height()) / 2;
      $("#msgContent").css({ left: left, top: top });
      if (opt.hasOwnProperty("cancel")) {
        if (typeof (opt["cancel"] == "function")) {
          $("#msgCancel")
            .unbind("click")
            .bind("click", function() {
              clearTimeout(timeObj);
              opt["cancel"]();
              $("#msgshadeDiv").remove();
              $("#msgContent").remove();
            });
        }
      }
      if (opt.hasOwnProperty("ok")) {
        if (typeof (opt["ok"] == "function")) {
          $("#msgSave")
            .unbind("click")
            .bind("click", function() {
              clearTimeout(timeObj);
              opt["ok"]();
              $("#msgshadeDiv").remove();
              $("#msgContent").remove();
            });
        }
      }
      if (opt.hasOwnProperty("cancel") && opt.hasOwnProperty("ok")) {
        $("#msgCancel").css({ borderRight: "solid 1px #dddddd" });
        // $(".btn-box").find("span").css({ "width": "50%" });
      }
      $("#msgClose")
        .unbind("click")
        .bind("click", function() {
          clearTimeout(timeObj);
          if (opt.hasOwnProperty("close")) {
            if (typeof (opt["close"] == "function")) {
              opt["close"]();
            }
          }
          $("#msgshadeDiv").remove();
          $("#msgContent").remove();
        });
      $("#msgshadeDiv").show();
      $("#msgContent").show();
      if (opt["time"]) {
        var time = 0;
        var timeObj = setInterval(function() {
          if (opt["time"].sec == time) {
            $("#msgshadeDiv").remove();
            $("#msgContent").remove();
            if (opt["time"].run) {
              opt["time"].run();
            }
          }
          time++;
        }, 1000);
        timeObj = setTimeout(function() {
          $("#msgSave").click();
          if (opt["time"].run) {
            opt["time"].run();
          }
        }, opt["time"].sec * 1000);
      }
    }
  },
  jqueryAjax: function(options) {
    try {
      var opt = options ? options : {};
      var callback = opt.callback ? opt.callback : "";
      var type = opt.type ? opt.type : "POST";
      $.ajax({
        type: type,
        dataType: "json",
        url: opt.url ? opt.url : "",
        data: opt.data ? opt.data : {},
        cache: false,
        success: function(jsonData) {
          if (callback) {
            var result = typeof jsonData;
            if (result == "string") {
              jsonData = eval("(" + jsonData + ")");
            }
            callback(jsonData);
          }
        },
        error: function(ex) {
          if (window.console) {
            console.log(ex);
          }
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  }
};

// 功能：消息提示框
// 参数说明：msg 提示信息
// flag: 两个参数（yes, no）
// foo：返回函数
// isClose：是否关闭
var showTit = (function($, w) {
  return function(msg, flag, foo, isClose) {
    var isClose = isClose || "true",
      icon = "success_result";
    if (flag == "no") icon = "err_result"; // no的样式
    if ($("#shadeBg").length <= 0) {
      $(document.body).append('<div id="shadeBg" class="shade_bg"></div>');
    }
    $("#successInfor").remove();
    var tipMsg = $(
      '<div class="public_result_div" id="successInfor"><span class="' +
        icon +
        '">' +
        msg +
        "</span></div>"
    );
    $(document.body).append(tipMsg);
    $("#shadeBg").height($(document).height());
    var left = ($(window).width() - $("#successInfor").width()) / 2;
    var top = ($(window).height() - $("#successInfor").height()) / 2;
    $("#successInfor").css({ left: left, top: top });
    $("#shadeBg")
      .css({ opacity: "0.4" })
      .fadeIn("fast");
    $("#successInfor").fadeIn("fast");
    w.titHide = function() {
      if (isClose == "true") {
        $("#successInfor").fadeOut("fast");
        $("#shadeBg").fadeOut("fast");
      }
      if (foo) {
        foo();
      }
    };
    setTimeout("titHide()", 1500);
  };
})(jQuery, window);

// 表单序列化成对象
jQuery.prototype.serializeObject = function() {
  var obj = {};
  $.each(this.serializeArray(), function(index, param) {
    if (!(param.name in obj)) {
      obj[param.name] = param.value;
    }
  });
  return obj;
};

// 分页
// 使用说明 传递一个对象 对象参数说明如下
// elem 分页容器，必须是 jquery 对象，分页 html 将渲染在该容器内
// totalCount 查询出来的总数据条数
// curr 当前页数
// callback 回调函数
// 回调参数 obj 说明
// obj = {
//     curr: 当前页数,
//     pageSize: 每页展示条数
// }

// setPagination({
//     elem: $('#pagination'),
//     totalCount: res.dataCount,
//     curr: 1,
//     callback: function (obj) {}
// });
var setPagination = (function() {
  var temp = [];

  var searchCurr = function(elem) {
    var flag = false,
      result = {};

    $.each(temp, function(index, ele) {
      if (ele.ele.get(0) === elem.get(0)) {
        flag = true;
        result = ele;
      }
    });

    if (!flag) {
      result = {
        ele: elem,
        pageSize: 20,
        totalCount: 0
      };

      temp.push(result);
    }

    return result;
  };

  return function(options) {
    var currentObj = searchCurr(options.elem);

    var option = {
      curr: options.curr || 1, // 当前页 默认第一页
      totalCount: +options.totalCount || 0, // 总条数 默认0条
      jump: function(obj, first) {
        var param = {
          curr: obj.curr,
          pageSize: currentObj.pageSize
        };
        if (!first) {
          options.callback(param);
        }
      },
      first: false,
      last: false,
      skip: true
    };

    var html = "";

    if (!(options.elem instanceof jQuery)) {
      throw new Error("容器需传递jQuery对象");
    }

    if (!options.elem.find(".pagination-wrap").length) {
      html =
        '<p class="show-total-count">共<span class="total-count"></span>条</p>\
                    <div class="select-pagesize-wrap">每页展示\
                        <select id="selectPageSize">\
                            <option value="20">20</option>\
                            <option value="30">30</option>\
                            <option value="50">50</option>\
                        </select>\
                    条数据</div>\
                    <div class="pagination-wrap" id="realPaginationWrap"></div>\
                    <p class="show-total-page">共<span class="total-page"></span>页</p>';

      options.elem.append(html).on("change", "#selectPageSize", function(e) {
        var param = {
          curr: 1
        };
        currentObj.pageSize = +$(this).val();
        param.pageSize = currentObj.pageSize;
        options.callback(param);
      });
    }

    if (option.curr > 1) {
      // 超过第一页，使用缓存的totalCount
      option.totalCount = currentObj.totalCount;
    } else {
      // 检查 totalCount 值是否合法
      if (isNaN(option.totalCount) || option.totalCount < 0) {
        option.totalCount = 0;
      }
      currentObj.totalCount = option.totalCount;
    }

    options.elem.find(".total-count").text(option.totalCount); // 填入总条数

    option.cont = options.elem.find(".pagination-wrap"); // 分页容器

    option.pages = Math.ceil(option.totalCount / currentObj.pageSize); // 计算分页总页数

    options.elem.find(".total-page").text(option.pages); // 填入总页数

    // 如果没有数据 隐藏分页
    if (option.pages) {
      laypage(option);
      options.elem.show();
    } else {
      options.elem.hide();
    }
  };
})();
