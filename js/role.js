var pageUtil = {
  // 页面缓存
  cache: {},
  // 获取查询参数
  getSearchValue: function() {
    var data = {},
      $wrap = $("#pageSearchForm");
    data.name = $("#searchName").val() || "";
    return data;
  },

  // 过滤空参数
  filterEmpty: function(obj) {
    var keys = Object.keys(obj),
      i = 0,
      length = keys.length;

    for (i; i < length; i++) {
      if (!obj[keys[i]]) {
        delete obj[keys[i]];
      }
    }
    return obj;
  },

  // 获取角色列表
  getRoleList: function(obj) {
    var data = pageUtil.getSearchValue();
    data.pageNum = (obj && obj.curr) || 1; // 默认第1页
    data.pageSize = (obj && obj.pageSize) || 20; // 默认一页20条数据
    pageUtil.cache.pageInfo = {
      curr: data.pageNum,
      pageSize: data.size
    };
    data = pageUtil.filterEmpty(data);
    $.ajax({
      url: base + "sys/getRole",
      type: "post",
      processData: false,
      contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
      dataType: "json",
      data: JSON.stringify(data),
      success: function(res) {
        if (res.status == "0" && res.data) {
          if (res.data.length) {
            pageUtil.cache.listCache = res.data;
            pageUtil.renderRoleList(res.data);
          } else {
            $("#listCtnWrap").html("");
          }
          // 设置分页
          setPagination({
            elem: $("#pagination"),
            totalCount: res.dataCount,
            curr: data["pageNum"],
            callback: function(obj) {
              pageUtil.getRoleList(obj);
            }
          });
        } else if (res.status == "9999") {
          // 未登录
          window.top.location.href = "../../login.html";
        } else {
          $("#listCtnWrap").html("");
          $.Huimodalalert(res.message, 2000);
        }
      }
    });
  },

  // 渲染角色列表
  renderRoleList: function(data) {
    var html = "",
      obj = null,
      category = "";

    $.each(data, function(childIndex, child) {
      html +=
        '<tr class="text-c">\
		        <td>\
		            <input type="checkbox" value="" name="" data-id="' +
        child.id +
        '">\
		        </td>\
		        <td>' +
        child.name +
        "</td>\
		        <td>" +
        (child.role_desc?child.role_desc:"") +
        "</td>\
		        <td>" +
        (child.valid_ind == 0 ? "无效" : "有效") +
        "</td>\
		        <td>" +
        child.create_time +
        /*"</td>\
		        <td>" +
        child.create_user +*/
        '</td>\
		        <td class="f-14">\
		          	<a class="authorise" data-id="' +
        child.id +
        '" title="授权" href="javascript:;" onclick="authorize($(this))" style="text-decoration:none;"><i class="Hui-iconfont">&#xe61d;</i></a>\
		        </td>\
            </tr>';
      //<a class="edit" data-id="'+child.id+'" title="编辑" href="javascript:;" onclick="edit($(this))" style="text-decoration:none;"><i class="Hui-iconfont">&#xe6df;</i></a>\
      //<a class="del" data-id="'+child.id+'" title="删除" href="javascript:;" onclick="admin_role_del($(this),del)" class="ml-5" style="text-decoration:none;"><i class="Hui-iconfont">&#xe6e2;</i></a>\
      //<a class="authorise" data-id="' + child.id + '" title="数据权限授权" href="javascript:;" onclick="data_authorize($(this))" style="text-decoration:none;"><i class="Hui-iconfont">&#xe61d;</i></a>\
    });
    $("#listCtnWrap").html(html);
  }
};

$(function() {
  var $collections = $(".common-form-wrap");

  $collections.on("blur", "input,select", function(e) {
    var $self = $(this),
      $parent = $self.parent(),
      type = $self.attr("data-check"),
      checkList = [];

    if (type && !$self.prop("disabled")) {
      checkList = type.split(",");

      $.each(checkList, function(index, ele) {
        return checkInput[ele] && checkInput[ele]($self, $parent);
      });
    }
  });

  // 查询角色列表
  $("#screeBtn").on("click", function() {
    pageUtil.getRoleList();
  });

  // 重置查询列表
  $("#resetBtn").on("click", function() {
    var $wrap = $("#pageSearchForm");
    $wrap
      .find(".condition-parent")
      .find("input")
      .val("");
    pageUtil.getRoleList({});
  });

  // 列表全选及反选
  $("#checkAll").on("click", function() {
    var $self = $(this),
      $wrap = $("#listCtnWrap").find('input[type="checkbox"]');
    $wrap.prop("checked", $self.prop("checked"));
  });

  // 新增按钮
  $("#addRole").on("click", function() {
    var data = {};
    data.desc = data.desc = ["角色名称", "描述", "状态"];
    var html = template("admin_role_add", data);
    layer.open({
      type: 1,
      area: ["600px", "280px"],
      fix: false, //不固定
      maxmin: true,
      shade: 0.4,
      anim: 2,
      title: "添加",
      content: html,
      success: function(layero, index) {
        $("#admin-role-save").on("click", function() {
          $("#form-admin-role-add").on("click", function() {
            var AjaxURL = base + "sys/addRole";
            var params = $(this).serializeObject();
            params.create_user =
              JSON.parse(localStorage.getItem("storData")).fullName || "";
            $.ajax({
              type: "post",
              url: AjaxURL,
              processData: false,
              contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
              dataType: "json",
              data: JSON.stringify(params),
              success: function(data) {
                $(this).resetForm(); // 提交后重置表单
                layer.close(index); //关闭当前弹层
                pageUtil.getRoleList(); //列表刷新
              }
            });
            return false; // 阻止表单自动提交事件
          });
        });
      }
    });
  });
  $("#screeBtn").trigger("click");
});

/*授权*/
function authorize(obj) {
  var txt = obj.attr("title");
  var id = obj.attr("data-id");
  $.ajax({
    url: base + "sys/getRoleResourceTree",
    type: "get",
    data: {
      id: id
    }
  }).done(function(data) {
    var html = template("admin_role_grant", data);
    layer.open({
      type: 1,
      area: ["600px", "440px"],
      fix: false, //不固定
      maxmin: true,
      shade: 0.4,
      anim: 2,
      title: txt,
      content: html,
      success: function(layero, index) {
        $.fn.zTree.init($("#treeDemo"), setting, data.data);
        $.fn.zTree.getZTreeObj("treeDemo").expandAll(true);
        $("#admin-role-save").on("click", function() {
          var checkedNodes = $.fn.zTree
            .getZTreeObj("treeDemo")
            .getCheckedNodes();
          // console.log(checkedNodes);
          // console.log(id);
          var params = {};
          params.id = id;
          params.list = [];
          checkedNodes.forEach(element => {
            params.list.push(element.id);
          });
          params.create_user =
            JSON.parse(localStorage.getItem("storData")).fullName || "";
          // console.log(params);
          $.ajax({
            type: "post",
            url: base + "sys/updateRoleResource",
            processData: false,
            contentType: "application/json;charset=utf-8", //这个是发送信息至服务器时内容编码类型
            dataType: "json",
            data: JSON.stringify(params),
            success: function(data) {
              $(this).resetForm(); // 提交后重置表单
              layer.close(index);
              pageUtil.getRoleList();
            }
          });
          return false; // 阻止表单自动提交事件
        });
        //   });
      }
    });
  });
}
var setting = {
  check: {
    enable: true
  },
  data: {
    key: {
      children: "resourceList"
    }
  }
};
