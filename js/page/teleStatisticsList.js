var detParam = {},
    param = {};
var noData = '<tr><td colspan="8" style="text-align:center;">暂无相关数据！</td></tr>';
var withdraw = {
    orderStatus: '',
    accouType: {},
    init: function() {
        accouType = JSON.parse(localStorage.getItem('storData'));
        orderStatus = '1';
        this.size = $('#selectPageSize :checked').text();
        this.pageing = {
            pageNum: 1,
            pageSize: 10
        };
        this.bindEvents();
        this.search();
        util.checkForm();
    },

    bindEvents: function() {
        var self = this;

        // 点击选项卡
        $('.btn-group span.btn').bind('click', function(ev) {
            var $target = $(this);
            var statu = $target.attr('val');
            if (statu == 0) {
                $(".allocate").hide();
                $(".statistical").show();
            } else {
                $(".allocate").show();
                $(".statistical").hide();
            }
            util.reset();
            $target.addClass('btn-primary');
            $target.siblings().removeClass('btn-primary').not(".todayText").addClass('btn-default');
            orderStatus = statu

            self.search()
        });

        // 筛选
        $('#screeBtn').bind('click', function(ev) {
            self.pageing.pageNum = 1;
            $('#pagination').html('');
            self.search();
            // self.scree(self.pageing.pageNum)
        });

        // 重置
        $('#resetBtn').bind('click', function(ev) {
            util.reset();
        });

        // 导出
        $('#getOut').bind('click', function(ev) {
            var fileName = $('.fileName').text();
            $('#fileName').val(fileName);
            $('#mymodal').modal('show')
        });

    },

    // 分页初始化
    pageInit: function() {
        var self = this;
        setPagination({
            elem: $('#pagination'),
            totalPage: 100,
            curr: 1,
            callback: function(obj) {
                self.pageing.pageSize = $('#selectPageSize :checked').text()
                self.scree(obj.curr)
            }
        });
    },

    // 列表搜索
    search: function() {
        param = util.serialize();
        detParam = param;
        this.queryList(10);
    },

    // 筛选
    scree: function(currentPage, type) {
        var userName = $('.userName').val(), // 姓名
            datemin = $('#datemin').val(), // 开始统计日期
            datemax = $('#datemax').val(), // 结束统计日期
            startDistribute = $('#startDistribute').val(), // 开始分配日期
            endDistribute = $('#endDistribute').val(); // 结束分配日期

        var data = {};

        if (userName) {
            data['currentOperationName'] = userName
        }

        if (datemin) {
            data['startCountDate'] = datemin
        }
        if (datemax) {
            data['endCountDate'] = datemax
        }
        if (startDistribute) {
            data['startDistributeTime'] = startDistribute
        }
        if (endDistribute) {
            data['endDistributeTime'] = endDistribute
        }

        data['status'] = this.orderStatus;
        if (type == 'getOut') {
            this.getOut(data)
        } else {
            this.queryList(data)
        }

    },

    // 导出
    export: function() {
        var fileName = $("#fileName").val();
        if (fileName == "") {
            $(".p").show();
            return;
        }
        var param = $(".search-form").serialize();
        param = param + "&status=" + orderStatus + "&fileName=" + fileName;

        if (orderStatus > 0) {
            // 电销统计总表
            if (orderStatus == 1) {
                // 统计15天
                location.href = base + "telemarketing/exportTeleCount.do?" + param;
            } else if (orderStatus == 2) {
                // 统计累计数据
                location.href = base + "telemarketing/exportTeleCountTotal.do?" + param;
            }
        } else {
            // 电销每日产出表
            location.href = base + "telemarketing/exportTeleEvertyDayCount.do?" + param;
        }

        $('#mymodal').modal('hide');
    },

    // 发送请求获取数据
    queryList: function(obj) {
        var self = this,
            url = '';

        detParam.pageNum = (obj && obj.curr) || 1 // 默认第1页
        detParam.pageSize = (obj && obj.pageSize) || 20 // 默认一页20条数据

        if (orderStatus > 0) {
            // 电销统计总表

            if (orderStatus == 1) {
                // 统计15天
                url = base + 'telemarketing/getTelemarketingCount.do';
            } else if (orderStatus == 2) {
                // 统计累计数据
                url = base + 'telemarketing/getTelemarketingCountTotal.do';
            }

            $.post(url, detParam, function(res) {
                if (res.status == 0 && res.data) {
                    $(".tableAll").show().siblings('.table-con').hide();

                    if (orderStatus == 1) {
                        // 统计15天
                        $("#tableAllList").empty().append($('#allList').tmpl(res.data));
                    } else if (orderStatus == 2) {
                        // 统计累计数据
                        $("#tableAllList").empty().append($('#allListOther').tmpl(res.data));
                    }

                    setPagination({
                        elem: $('#pagination'),
                        totalCount: res.dataCount,
                        curr: detParam.pageNum,
                        callback: function(obj) {
                            self.queryList(obj);
                        }
                    });
                } else {
                    $("#tableAllList").empty().append(noData);
                }
            });

        } else {
            // 电销每日产出表
            $.post(base + "telemarketing/getTelemarketingEverydayCount.do", detParam, function(data) {
                if (data.status == 0) {
                    $(".tableTwo").show().siblings('.table-con').hide();
                    $("#tableTwoList").empty().append($('#twoList').tmpl(data.data));
                    setPagination({
                        elem: $('#pagination'),
                        totalCount: data.dataCount,
                        curr: detParam.pageNum,
                        callback: function(obj) {
                            self.queryList(obj);
                        }
                    });
                } else {
                    $("#tableTwoList").empty().append(noData)
                }
            });
        }
    }
};
withdraw.init()
