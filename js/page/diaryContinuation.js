/**
 * Created by hp on 2018/1/4.
 */
var diaryDetail = {
  id: null,
  data: {
    content: "",
    after_pics: [],
    case_main_id: 1
  },
  config: {
    width: 828,
    // height: 1104,
    quality: 0.8
  },
  imgs: [],
  saveData: function(id) {
    $.ajax({
      url: base + "case/insertCaseOrLog.do",
      type: "post",
      dataType: "json",
      data: JSON.stringify(diaryDetail.data),
      contentType: "application/json;charset=utf-8",
      success: function(res) {
        if (res.status == "0") {
          location.href = "log.html";
        } else {
          $.Huimodalalert(data.message, 2000);
        }
      },
      error: function(err) {
        $.Huialert(err.message, 1500);
      }
    });
  },
  //上传图片
  uploadImg: function($obj, callback) {
    layer.load(1, {
      shade: [0.8, "#eee"] //0.1透明度的白色背景
    });
    if ($obj.val()) {
      lrz($obj.get(0).files[0], diaryDetail.config)
        .then(function(rst) {
          diaryDetail.imgs.push(rst.base64);
          let param = new FormData(); //创建form对象
          // console.log(file.name);
          let imgTemp = diaryDetail.imgs[0];
          var arr = imgTemp.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          var obj = new Blob([u8arr], { type: mime });
          param.append("file", obj, $obj.get(0).files[0].name); //通过append向form对象添加数据
          param.append("chunk", "0"); //添加form表单中其他数据
          $.ajax({
            url: base + "common/upload.do",
            type: "POST",
            processData: false,
            contentType: false,
            data: param,
            dataType: "JSON",
            success: function(data) {
              diaryDetail.imgs = [];
              if (data.status == "0") {
                layer.closeAll("loading");
                callback(data.data);
                $obj.val("");
              } else {
                layer.closeAll("loading");
                $.Huimodalalert(data.message, 2000);
              }
            }
          });
        })
        .catch(function(err) {
          console.log(err);
          layer.closeAll("loading");
          alert("压缩失败");
        })
        .always(function() {
          // 清空文件上传控件的值
          $obj.value = null;
        });
      $obj.value = null;
    }
  }
};
$(document).ready(function() {
  diaryDetail.id = window.util.getQueryString("id");
  if (diaryDetail.id) {
    diaryDetail.data.case_main_id = diaryDetail.id;
  } else {
    $.Huimodalalert("Id不存在！", 1500);
  }

  $("#but").click(function() {
    diaryDetail.data.content = $("#introduce").val();
    diaryDetail.saveData();
  });

  function getImgEvent(obj, type, i) {
    //type传值说明是手术后7张的
    newUploadImg(obj, function(src) {
      if (src) {
        //$(".layui-layer-shade").remove();
        //$(".layui-layer").remove();
        layer.closeAll("loading");
        obj.attr("data-src", src);
        if (!!type) {
          diaryDetail.data.after_pics[i] = src;
        }
        obj
          .next("label")
          .prepend(
            $(
              '<img style="display: inline-block;width: 100px;height: 100px;" src=' +
                imgPath +
                src +
                ">"
            )
          );
      } else {
        $.Huialert("获取图片路径失败", 1500);
      }
    });
  }
  //手术后7张照片
  $("#after1").on("change", function() {
    getImgEvent($(this), 1, 0);
  });
  $("#after2").on("change", function() {
    getImgEvent($(this), 1, 1);
  });
  $("#after3").on("change", function() {
    getImgEvent($(this), 1, 2);
  });
  $("#after4").on("change", function() {
    getImgEvent($(this), 1, 3);
  });
  $("#after5").on("change", function() {
    getImgEvent($(this), 1, 4);
  });
  $("#after6").on("change", function() {
    getImgEvent($(this), 1, 5);
  });
  $("#after7").on("change", function() {
    getImgEvent($(this), 1, 6);
  });
});

$(function(){
  $(".backtrack").click(function(){
      window.history.go(-1);
    });
})
