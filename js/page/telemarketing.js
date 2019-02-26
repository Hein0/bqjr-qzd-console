var detParam = {},
    param = {};
var noData = '<tr><td colspan="11" style="text-align:center;">暂无相关数据！</td></tr>';
var withdraw = {
    orderStatus: '',
    accouType: {},
    init: function() {
        accouType = JSON.parse(localStorage.getItem('storData'));
        if (accouType && accouType.accountType == 2) {
            $(".allbut").addClass("isAcoType");
            $(".outs").addClass("isAcoType");
            $(".todayText").removeClass("isAcoType");
            $(".todaybut").removeClass("isAcoType");
            orderStatus = '1'
            $('.btn-group span.btn:first-child').addClass('btn-primary');
            $('.btn-group span.btn:first-child').siblings().removeClass('btn-primary').not(".todayText").addClass('btn-default');
        } else {
            $(".allbut").removeClass("isAcoType");
            $(".outs").removeClass("isAcoType");
            $(".todayText").addClass("isAcoType");
            $(".todaybut").addClass("isAcoType");
            orderStatus = ''
            $('.btn-group span.btn:last').addClass('btn-primary');
            $('.btn-group span.btn:last').siblings().removeClass('btn-primary').not(".todayText").addClass('btn-default');
        }

        this.size = $('#selectPageSize :checked').text()
        this.pageing = {
            pageNum: 1,
            pageSize: 10
        };
        this.bindEvents();
        this.initSletype(orderStatus);
        this.search();
        util.checkForm();
        var className = { 25: ".terminal", 27: ".white", 28: ".twoType", 29: ".wdType", 30: ".walletType", 35: ".lessTime" }
        util.initSelect(className, '25,27,28,29,30,35');
    },

    bindEvents: function() {
        var self = this;
        //初始化选项卡状态
        if ($('.btn-group span.btn-primary').attr('val') == "1") {
            $(".panelShow").hide();
        } else {
            $(".panelShow").show();
        }

        //点击选项卡
        $('.btn-group span.btn').bind('click', function(ev) {
            var $target = $(this);
            var statu = $target.attr('val');
            util.reset();
            $target.addClass('btn-primary');
            $target.siblings().removeClass('btn-primary').not(".todayText").addClass('btn-default');
            orderStatus = statu
            if (statu == "1") {
                $(".panelShow").hide();
                $(".outs").addClass("isAcoType");
                $(".todayText").removeClass("isAcoType");
            } else if (statu == "") {
                /*$(".wdTypeDibled").attr('disabled','disabled').addClass("bgcolor");
                $(".whites").attr('disabled','disabled').addClass("bgcolor");*/
            } else {
                $(".panelShow").show();
                $(".outs").removeClass("isAcoType");
                $(".todayText").addClass("isAcoType");
                $(".wdTypeDibled").removeAttr('disabled').removeClass("bgcolor");
                $(".whites").removeAttr('disabled').removeClass("bgcolor");
            }
            self.search()
        });

        //选中短信模板
        $(".right-text .smsSele").click(function() {
            var $self = $(this);
            var texts = $(".smsSele").find('option:selected').attr("data-con");
            var valus = $(".smsSele").find('option:selected').val();
            $(".smsCtent").empty().text(texts);
            $(".hideInpuVal").val(valus);

        });
        //T+N下拉选框关联
        $('.terminal').change(function() {
            var vals = $(this).children('option:selected').val();
            if (orderStatus == "") {
                if (vals != "") {
                    $(".wdTypeDibled").removeAttr('disabled').removeClass("bgcolor");
                    $(".whites").removeAttr('disabled').removeClass("bgcolor");
                } else {
                    $(".wdTypeDibled").attr('disabled', 'disabled').addClass("bgcolor");
                    $(".wdTypeDibled").val("");
                    $(".whites").attr('disabled', 'disabled').addClass("bgcolor");
                    $(".whites").val("");
                };
            }
        });


        //筛选
        $('#screeBtn').bind('click', function(ev) {
            self.pageing.pageNum = 1;
            $('#pagination').html('');
            self.search()
                //			self.scree(self.pageing.pageNum)
        });
        //重置
        $('#resetBtn').bind('click', function(ev) {
            util.reset();
            self.initSletype(orderStatus);
        });
        //导出
        $('#getOut').bind('click', function(ev) {
            var fileName = $('.fileName').text();
            $('#fileName').val(fileName);
            $('#mymodal').modal('show')
        });
        //点击详情
        $('#tableList').on('click', '.toDetail', function() {
            var $self = $(this)
            var orderId = $self.attr('orderId');
            $self.attr('data-href', 'view/order/withdrawDetail.html?orderId=' + orderId);
            $self.attr('data-title', '提现订单详情');

            Hui_admin_tab($self.get());
        })
    },

    //角色权限判断初始二级下拉框是否可以编辑
    initSletype: function(orderStatus) {
        /*if(orderStatus==""){
        	$(".wdTypeDibled").attr('disabled','disabled').addClass("bgcolor");
        	$(".whites").attr('disabled','disabled').addClass("bgcolor");
        }else{
        	$(".wdTypeDibled").removeAttr('disabled').removeClass("bgcolor");
        	$(".whites").removeAttr('disabled').removeClass("bgcolor");
        }*/
    },

    //清除反馈弹窗数据
    clearData: function() {
        $("#modal-feedback").modal("hide");
        $("input[type='radio']").removeAttr('checked');
        $(".modalData").find("input.ids").val("");
        $(".modalData").find("select").val("");
        $(".modalData").find("textarea").val("");
        //$(".ids").attr({"data-id":"","data-nameBel":"","data-name":"","data-sex":"","data-tel":"","data-statu":""});
    },

    //短信弹窗取消按钮
    SmsClearData: function() {
        $(".smsCtent").text("");
        $("#modal-demo").modal("hide");
    },

    //点击反馈显示弹窗
    backButFun: function(ids, nameBel, operatorType, name, sex, tel, statu, types) {
        var self = this;
        $(".feeName").empty().text(name + "（" + sex + "）" + tel);
        $(".ids").attr({ "data-id": ids, "data-nameBel": nameBel, "data-name": name, "data-sex": sex, "data-tel": tel, "data-statu": statu, "data-opeType": operatorType });
        $(".feeStatu").empty().text(statu);
        $(".operator").empty().text(accouType.fullName);
        $("#modal-feedback").modal("show");
        self.getBackListData(ids, types);
        //监听一级结束码选择的是否  “销售拒绝”
        $(".wrap-two-2 .two-2-text1 .white").change(function() {
            var texts = $(this).children('option:selected').text()
            if (texts == "销售拒绝") {
                $(".twoSele").show();
            } else {
                $(".twoSele").hide();
            }
        });
    },
    //反馈弹窗里的短信按钮
    msgButs: function() {
        var self = this;
        $(".msgName").empty().text($(".ids").attr("data-name"));
        $(".magTel").empty().text($(".ids").attr("data-tel"));
        $(".msgInit").empty().text($(".ids").attr("data-statu"));
        self.getMsgList($(".ids").attr("data-id"), $(".ids").attr("data-nameBel"), $(".ids").attr("data-opeType"));
        $("#modal-demo").modal("show");
    },
    //发送反馈事件
    sendBack: function() {
        var self = this,
            // inpval = $('.inpustRadi input:radio[name="radios"]:checked').val(), 去除是否接通选项
            $firstSle = $(".two-2-text1 .white :checked"),
            idsVal = $(".ids").attr("data-id"),
            $twoSle = $(".two-2-text2 .select :checked"),
            memoText = $(".memoText").val();

        var datas = {};
        if (idsVal) {
            datas["telemarketingUserId"] = idsVal
        } else {
            $.Huimodalalert('用户id不能为空', 2000);
            return
        };

        // if (inpval) {
        //     datas["isCallOn"] = inpval
        // } else {
        //     $.Huimodalalert('是否接通不能为空', 2000);
        //     return
        // };

        if (accouType.fullName) {
            datas["operationUserName"] = accouType.fullName
        } else {
            $.Huimodalalert('电销人员名称不能为空', 2000);
            return
        };

        if (accouType.accountId) {
            datas["operationUserId"] = accouType.accountId
        } else {
            $.Huimodalalert('电销人员工号不能为空', 2000);
            return
        };

        if ($firstSle.text() != "请选择") {
            datas['firstEndCode'] = $firstSle.attr('value')
        } else {
            $.Huimodalalert('一级结束码不能为空', 2000);
            return
        };

        if ($(".wrap-two-2 .two-2-text1 .white").children('option:selected').text() != "销售拒绝" || $twoSle.text() != "请选择") {
            datas['secondEndCode'] = $twoSle.attr('value')
        } else {
            $.Huimodalalert('拒绝理由不能为空', 2000);
            return
        };

        if (memoText) {
            datas["memo"] = memoText
        }
        //提交反馈方法
        self.sendBackData(datas);
    },

    //短信按钮事件
    msgButFun: function(id, nameBl, operatorType, name, sta, mobi) {
        var self = this;
        $(".ids").attr({ "data-id": id, "data-nameBel": nameBl, "data-name": name, "data-statu": sta, "data-tel": mobi, "data-opeType": operatorType });
        $(".msgName").empty().text(name);
        $(".magTel").empty().text(mobi);
        $(".msgInit").empty().text(sta);
        self.getMsgList($(".ids").attr("data-id"), $(".ids").attr("data-nameBel"), $(".ids").attr("data-opeType"), $(".ids").attr("data-name"));
        $("#modal-demo").modal("show");
    },
    //点击发送短信按钮
    sendBtns: function() {
        var self = this;
        var Params = {};
        var mobis = $(".magTel").text();
        Params["telemarketingUserId"] = $(".ids").attr("data-id");
        Params["belong"] = $(".ids").attr("data-nameBel");
        Params["templateName"] = $(".hideInpuVal").val();
        if (mobis) {
            Params["mobile"] = mobis
        } else {
            $.Huimodalalert('手机号码不能为空', 2000);
            return
        };
        if ($(".smsCtent").text()) {
            Params["content"] = $(".smsCtent").text();
        } else {
            $.Huimodalalert('请选择短信模板', 2000);
            return
        };
        self.sendMsg(Params);
    },
    //查看反馈事件
    lookBackButFun: function(ids, name, sex, mobi, sta, types) {
        var self = this;
        $(".lookName").empty().text(name + "（" + sex + "）" + mobi);
        $(".lookStatu").empty().text(sta);
        $("#look-feedback").modal("show");
        self.getBackListData(ids, types);
    },

    //获取反馈列表
    getBackListData: function(id, type) {
        $.post(base + 'telemarketing/getFeedbackList.do', { "telemarketingUserId": id }, function(res) {
            if (res.status == 0) {
                if (type == 1) {
                    $("#backLists").empty().append($('#back-List').tmpl(res.data));
                } else if (type == 2) {
                    $("#lookLists").empty().append($('#look-List').tmpl(res.data));
                }
            }
        });
    },

    //获取短信信息模板
    getMsgList: function(Id, Names, oderType, userName) {
        $.post(base + 'sms/getMessegeList.do', { "telemarketingUserId": Id, "belong": Names, "operatorType": oderType, "userName": userName}, function(res) {
            if (res.data && res.status == 0) {
                var Option = '<option value="" selected>请选择</option>';
                $.each(res.data, function(_index, _data) {
                    Option += '<option value="' + _data.templateName + '" data-con="' + _data.content + '">' + _data.templateName + '</option>';
                });
                $(".smsSele").empty().append(Option);
            }
        });
    },

    //发送反馈数据
    sendBackData: function(datas) {
        $.post(base + 'telemarketing/addFeedback.do', datas, function(res) {
            if (res.status == 0) {
                $("#modal-feedback").modal("hide");
                location.reload();
            }
        });
    },

    //发送短信事件
    sendMsg: function(Params) {
        $(".loadings").show();
        $.post(base + 'sms/sendMessege.do', Params, function(res) {
            if (res.status == 0) {
                $("#modal-demo").modal("hide");
                $(".loadings").hide();
                $(".smsCtent").text("");
                $.Huimodalalert(res.message, 2000);
            } else {
                $("#modal-demo").modal("hide");
                $(".loadings").hide();
                $(".smsCtent").text("");
                $.Huimodalalert(res.message, 2000);
            }
        });
    },

    //分页初始化
    pageInit: function() {
        var self = this;
        setPagination({
            elem: $('#pagination'),
            totalPage: 100,
            curr: 1,
            callback: function(obj) {
                console.log(obj)
                self.pageing.pageSize = $('#selectPageSize :checked').text()
                self.scree(obj.curr)
            }
        });
    },
    //列表搜索
    search: function() {
        param = util.serialize();
        detParam = param;
        this.queryList(10);
    },

    //筛选
    scree: function(currentPage, type) {

        var userName = $('.userName').val(), //姓名
            mobile = $('.mobile').val(), //电话
            batchNo = $('.batchNo').val(), //批次
            $terminal = $('.terminal :checked'), //T+N
            $wdType = $('.wdTypeDibled :checked'), //T+N状态
            $appSta = $('.appSta :checked'), //开通状态
            certId = $('.certId').val(), //身份证
            applyTime = $('#applyTime').val(), //申请时间
            $useStatus = $('.walletType :checked'), //钱包使用状态
            datemin = $('#datemin').val(), //批次时间
            datemax = $('#datemax').val(), //批次时间
            $overS = $('.white :checked'); //一级结束码

        var data = {};

        if (userName) {
            data['userName'] = userName
        }

        if (mobile) {
            data['mobile'] = mobile
        }

        if (batchNo) {
            data['batchNo'] = batchNo
        }

        if (certId) {
            data['certId'] = certId
        }

        if ($appSta.text() != "请选择") {
            data['applyStatus'] = $appSta.attr('value')
        }

        if (applyTime) {
            data['applyCreateTime'] = applyTime
        }

        if ($terminal.text() != "请选择") {
            data['currentDay'] = $terminal.attr('value')
        }

        if ($wdType.text() != "请选择") {
            data['currentStatus'] = $wdType.attr('value')
        }

        if ($useStatus.text() != "请选择") {
            data['useStatus'] = $useStatus.attr('value')
        }

        if ($overS.text() != "请选择") {
            data['currentFirstEndCode'] = $overS.attr('value')
        }

        if (datemin) {
            data['startCreateTime'] = datemin
        }
        if (datemax) {
            data['endCreateTime'] = datemax
        }

        data['status'] = this.orderStatus;
        if (type == 'getOut') {
            this.getOut(data)
        } else {
            this.queryList(data)
        }

    },
    //导出
    export: function() {
            var fileName = $("#fileName").val();
            if (fileName == "") {
                $(".p").show();
                return;
            }
            var param = $(".search-form").serialize();
            param = param + "&status=" + orderStatus + "&fileName=" + fileName;
            console.log(param);
            location.href = base + "telemarketing/exportExcel.do?" + param;
            $('#mymodal').modal('hide');
        }
        //发送请求获取数据
        ,
    queryList: function(obj) {
        var self = this;
        detParam['status'] = orderStatus;
        detParam.pageNum = (obj && obj.curr) || 1 // 默认第1页
        detParam.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据
        if (orderStatus == "1") {
            $.get(base + "telemarketing/getTodayDial.do", function(data) {
                if (data.data && data.status == 0) {
                    $(".tableOne").show().siblings('.table-con').hide();
                    $(".adds").empty().text(data.data.todayCallCount);
                    $(".residue").empty().text(data.data.noCallCount);
                    if (data.data.list) {
                        $("#tableOneList").empty().append($('#oneList').tmpl(data.data.list));
                    } else {
                        $("#tableOneList").empty().append(noData);
                    }
                    setPagination({
                        elem: $('#pagination'),
                        totalCount: data.dataCount,
                        curr: detParam.pageNum,
                        callback: function(obj) {
                            self.queryList(obj);
                        }
                    });
                }
            });
        } else {
            $.post(base + 'telemarketing/getTelemarketingList.do', detParam, function(res) {
                if (res.status == 0) {
                    if (orderStatus == "") {
                        if (res.data.length > 0) {
                            $(".tableAll").show().siblings('.table-con').hide();
                            $("#tableAllList").empty().append($('#allList').tmpl(res.data));
                            setPagination({
                                elem: $('#pagination'),
                                totalCount: res.dataCount,
                                curr: detParam.pageNum,
                                callback: function(obj) {
                                    self.queryList(obj);
                                }
                            });
                        } else {
                            $("#tableAllList").empty().append(noData)
                        }

                    } else {
                        $(".tableTwo").show().siblings('.table-con').hide();
                        if (res.data.length > 0) {
                            $("#tableTwoList").empty().append($('#twoList').tmpl(res.data));
                            setPagination({
                                elem: $('#pagination'),
                                totalCount: res.dataCount,
                                curr: detParam.pageNum,
                                callback: function(obj) {
                                    self.queryList(obj);
                                }
                            });
                        } else {
                            $("#pagination").hide();
                            $("#tableTwoList").empty().append(noData)
                        }
                    }

                }
            });
        }
    },

    // 增加查看用户详情操作项
    seeUserDetail: function(id, obj) {
        $(obj).attr('data-href', 'view/emarketing/userDetail.html?id=' + id);
        $(obj).attr('data-title', '用户详情');
        Hui_admin_tab($(obj).get());
    }
};
withdraw.init()