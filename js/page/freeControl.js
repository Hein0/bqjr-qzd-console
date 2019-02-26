// 页面工具类
var pageUtil = {

    // 定时器
    timer: null,

    // 页面缓存
    cache: {},

    // 当前操作按钮
    nowCtlBtn: null,

    // 数字验证
    checkNum: /^(?:\d{1,2}|\d\.\d)$/,

    // 免息活动id
    'freeId': '',

    // 列表状态
    'status': ['', '未开始', '进行中', '已停用', '已结束'],

    // 设置分类信息
    'setSelectType': function($self) {
        var id = $self.attr('data-id');

        $.get(base + 'goodsAdmin/getCategory.do', {
            parentId: id
        }, function(res) {
            var html = '';

            if (res.status == '0') {
                if (res.data && res.data.length) {
                    $.each(res.data, function(index, item) {
                        html += '<li data-id="' + item.id + '">' + item.name + '</li>'
                    });

                    $self.parent().next().html(html);
                }
            } else {
                $.Huimodalalert(res.message, 2000)
            }

            pageUtil.setSelectValue($self);
        })
    },

    // 设置分类信息选择值
    'setSelectValue': function($self) {
        var $wrap = $self.closest('.type-select-panel'),
            $result = $wrap.find('.result em');

        $result.text(pageUtil.getSelectValue($self));
    },

    // 获取分类信息选择
    'getSelectValue': function($self) {
        var $wrap = $self.closest('.type-select-panel'),
            $li = $wrap.find('.check'),
            html = '';

        if ($li.length) {
            $li.each(function(index, item) {
                var $item = $(item);

                if (index) {
                    html += ' > ' + $item.text();
                } else {
                    html += ' ' + $item.text();
                }
            })
        }

        return html;
    },

    // 获取品牌列表
    'getBrand': function(option) {
        var $target = option.$target || $('.name-select-panel'),
            name = option.name || '';

        $.post(base + 'goodsAdmin/getBrand.do', {
            'name': name
        }, function(res) {
            var html = '';

            if (res.status == '0' && res.data && res.data.length) {
                $.each(res.data, function(index, item) {
                    html += '<li data-id="' + item.id + '">' + item.name + '</li>';
                })
            } else {
                $.Huimodalalert(res.message, 2000)
            }

            $target.find('ul').html(html);
        })
    },

    // 获取添加商品查询参数
    'getSearchValue': function() {
        var data = {},
            $wrap = $('#pageSearchForm');

        data.catid = $wrap.find('.select-classify').attr('data-id') || '';
        data.brandId = $wrap.find('.select-brand').attr('data-id') || '';
        data.searchName = $('#searchName').val() || '';

        return data;
    },

    // 过滤空参数
    'filterEmpty': function(obj) {
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

    // 检查添加商品按钮展示
    'checkAddGoodsBtn': function() {
        var $wrap = $('#addGoodsListWrap'),
            $add = $('#addGoods'),
            $remove = $('#removeGoods')

        if ($wrap.find('tr').length) {
            $add.find('span').eq(0).text('继续添加')
            $remove.show()
        } else {
            $add.find('span').eq(0).text('添加商品')
            $remove.hide()
        }
    },

    // 添加免息活动
    'addFree': function($self, data) {
        $.post(base + 'free/addFreeActivity.do', data, function(res) {
            console.log(res)
            $self.removeClass('uping')
            if (res.status == 0) {
                $.Huimodalalert('保存成功', 1500)
                pageUtil.freeId = res.data
            } else {
                $.Huimodalalert(res.message, 2000)
            }
        })
    },

    // 编辑免息活动
    'editFree': function($self, data) {
        $.post(base + 'free/modifyFreeActivity.do', data, function(res) {
            $self.removeClass('uping')
            if (res.status == 0) {
                $.Huimodalalert('保存成功', 1500)
                pageUtil.getFreeInfo()
            } else {
                $.Huimodalalert(res.message, 2000)
            }
        })
    },

    // 获取免息列表
    'getFreeList': function(obj) {
        var $wrap = $('#pageSearchForm'),
            data = {}

        // 获取查询参数
        data.theme = $wrap.find('.s-name').val()
        data.activityType = $wrap.find('.s-type').val()
        data.status = $wrap.find('.s-status').val()
        data.beginTimeStr = $wrap.find('#listStart').val()
        data.endTimeStr = $wrap.find('#listEnd').val()
        data.overBeginTime = $wrap.find('#overBeginTime').val()
        data.overEndTime = $wrap.find('#overEndTime').val()

        data.number = (obj && obj.curr) || 1; // 默认第1页
        data.size = (obj && obj.pageSize) || 20; // 默认一页20条数据

        data = pageUtil.filterEmpty(data);

        $.post(base + 'free/getFreeList.do', data, function(res) {
            $('#freeActList').html('');

            if (res.status == '0' && res.data) {

                if (res.data.length) {
                    pageUtil.renderFreeList(res.data)
                }

                clearInterval(pageUtil.timer)

                pageUtil.timer = setInterval(pageUtil.updateStatus, 1000)

                // 设置分页
                setPagination({
                    elem: $('#pagination'),
                    totalCount: res.dataCount,
                    curr: data['number'],
                    callback: function(obj) {
                        pageUtil.getFreeList(obj);
                    }
                });
            } else if (res.status == '9999') {
                // 未登录
                window.top.location.href = '../../login.html';
            } else {
                $.Huimodalalert(res.message, 2000);
            }
        })
    },

    // 渲染免息列表
    'renderFreeList': function(data) {
        var html = '',
            $wrap = $('#freeActList')

        $.each(data, function(index, item) {
            html += '<tr data-id="' + item.activityId + '">\
                        <td>' + item.theme + '</td>\
                        <td>' + (item.activityType == 0 ? '全场商品免息' : '指定商品免息') + '</td>\
                        <td class="start">' + item.beginTime + '</td>\
                        <td class="end">' + item.endTime + '</td>\
                        ' + pageUtil.renderStatus(item) + '\
                    </tr>'
        })

        $wrap.html(html).find('tr').each(function(index, item) {
            var $self = $(this),
                status = $.trim($self.find('.status').text())

            if (status == '已停用' || status == '已结束') {
                $self.addClass('gray')
            }
        })


    },

    // 渲染免息列表状态
    'renderStatus': function(item) {
        var html = '',
            nowTime = new Date().getTime(),
            startTime = new Date(item.beginTime).getTime(),
            endTime = new Date(item.endTime).getTime()

        if (item.status == 2 && startTime > nowTime) {
            // 修正未开始状态
            item.status = 1
        }

        if (item.status == 2 && endTime < nowTime) {
            // 修正已结束状态
            item.status = 4
        }

        html += '<td class="status">' + pageUtil.status[item.status] + '</td>'

        html += '<td class="control">'

        if (item.status == 1) {
            // 未开始
            html += '<span class="list-ctl edit">编辑</span>'

            if (item.isUse == 1) {
                // 停用状态
                html += '<span class="list-ctl start">启用</span>'
            } else {
                html += '<span class="list-ctl pause">停用</span>'
            }

            html += '<span class="list-ctl delete">删除</span>'
        } else if (item.status == 2) {
            // 进行中
            html += '<span class="list-ctl pause">停用</span>'
        } else {
            // 已停用 已结束
            html += '<span class="list-ctl copy">复制</span>'
        }

        html += '<span class="list-ctl seeActivity">查看活动</span>'

        if (item.activityType == 1) {
            html += '<span class="list-ctl see">查看商品</span>'
        }

        html += '</td>'

        return html
    },

    // 获取活动信息
    'getFreeInfo': function() {
        var id = pageUtil.freeId

        $.post(base + 'free/editFreeActivity.do', {
            activityId: id
        }, function(res) {
            if (res.status == 0 && res.data) {
                pageUtil.initFree(res.data)
            } else if (res.status == '9999') {
                window.top.location = '../../login.html'
            } else {
                $.Huimodalalert(res.message, 2000)
            }
        })

        $.post(base + 'free/getFreeProduct.do', {
            activityId: id
        }, function(res) {
            if (res.status == 0 && res.data) {
                pageUtil.initGoods(res.data)
            } else {
                $.Huimodalalert(res.message, 2000)
            }
        })
    },

    // 初始化编辑活动
    'initFree': function(data) {
        var $freeTypeWrap = $('#freeTypeWrap').find(':radio'),
            $actTitle = $('#actTitle'),
            $freeStart = $('#freeStart'),
            $freeEnd = $('#freeEnd'),
            $freeCountWrap = $('#freeCountWrap').find('input'),
            $extendInfo = $('#extendInfo')

        $freeTypeWrap.eq(data.activityType).trigger('click')
        $actTitle.val(data.theme)
        $freeStart.val(data.beginTime)
        $freeEnd.val(data.endTime)
        $extendInfo.val(data.memo)

        $.each(data.freeinterestActivityRules.sort(function(a, b) {
            a.itemId - b.itemId
        }), function(index, item) {
            $freeCountWrap.eq(index).val(JSON.parse(data.freeinterestActivityRules[index].itemValue)['discount'])
        })
    },

    // 初始化关联商品
    'initGoods': function(data) {
        var html = ''

        $.each(data, function(index, item) {
            html += '<tr data-id="' + item.ruleId + '" data-skuid="' + item.itemId + '">\
                        <td><input type="checkbox"></td>\
                        <td>' + item.skuName + '</td>\
                        <td>' + item.sn + '</td>\
                        <td>' + item.marketPrice + '</td>\
                        <td><input type="number" class="input-text activity-value" value="' + (item.activityPrice || '') + '"></td>\
                        <td><input type="number" class="input-text free-value" value="' + (item.freeinterestPrice || '') + '"></td>\
                        <td class="pointer">删除</td>\
                    </tr>'
        })

        $('#addGoodsListWrap').html(html)
    },

    // 获取商品列表
    'getGoodsList': function(obj) {
        var data = pageUtil.getSearchValue();

        data.number = (obj && obj.curr) || 1; // 默认第1页
        data.size = (obj && obj.pageSize) || 20; // 默认一页20条数据

        data.activityId = pageUtil.freeId;

        data.status = 1; // 只查询上架商品

        data = pageUtil.filterEmpty(data);

        $.post(base + 'free/getProductList.do', data, function(res) {
            var $wrap = $('#addGoodsWrap'),
                html = '';

            $wrap.html('');

            if (res.status == '0' && res.data) {

                if (res.data.length) {
                    pageUtil.cache.goodsListCache = res.data;

                    // 渲染列表
                    $.each(res.data, function(index, item) {
                        html += '<tr>\
                                    <td><input type="checkbox"></td>\
                                    <td>' + item.skuName + '</td>\
                                    <td>' + item.sn + '</td>\
                                    <td>' + item.marketPrice + '</td>\
                                </tr>'
                    })

                    $wrap.html(html);
                }

                // 设置分页
                setPagination({
                    elem: $('#pagination'),
                    totalCount: res.dataCount,
                    curr: data['number'],
                    callback: function(obj) {
                        pageUtil.getGoodsList(obj);
                    }
                })

            } else if (res.status == '9999') {
                // 未登录
                window.top.location.href = '../../login.html';
            } else {
                $.Huimodalalert(res.message, 2000);
            }
        })
    },

    // 添加到免息活动商品列表
    'addToList': function() {
        var html = ''

        $.each(pageUtil.cache.selectedGoods, function(index, item) {
            html += '<tr data-skuid="' + item.skuId + '">\
                        <td><input type="checkbox"></td>\
                        <td>' + item.skuName + '</td>\
                        <td>' + item.sn + '</td>\
                        <td>' + item.marketPrice + '</td>\
                        <td><input type="number" class="input-text activity-value" value="' + item.marketPrice + '"></td>\
                        <td><input type="number" class="input-text free-value" value="' + item.marketPrice + '"></td>\
                        <td class="pointer">删除</td>\
                    </tr>'
        })

        $('#addGoodsListWrap').append(html)
        $('#addGoodsPanel').modal('hide')

        pageUtil.checkAddGoodsBtn()
    },

    // 停用活动
    'pauseFree': function(index) {
        var $self = pageUtil.nowCtlBtn,
            $tr = $self.closest('tr'),
            id = $tr.attr('data-id')

        $.post(base + 'free/operateFreeActivity.do', {
            'activityId': id,
            'useStatus': 1
        }, function(res) {
            if (res.status == 0) {
                layer.close(index)
                pageUtil.getFreeList()
            } else {
                $.Huimodalalert(res.message, 2000)
            }
        })
    },

    // 复制活动
    'copyFree': function(index) {
        var $self = pageUtil.nowCtlBtn,
            $tr = $self.closest('tr'),
            id = $tr.attr('data-id')

        $.post(base + 'free/copyFreeActivity.do', {
            'activityId': id
        }, function(res) {
            if (res.status == 0) {
                layer.close(index)
                pageUtil.getFreeList()
            } else {
                $.Huimodalalert(res.message, 2000)
            }
        })
    },

    // 删除活动
    'deleteFree': function(index) {
        var $self = pageUtil.nowCtlBtn,
            $tr = $self.closest('tr'),
            id = $tr.attr('data-id')

        $.post(base + 'free/deleteFreeActivity.do', {
            'activityId': id
        }, function(res) {
            if (res.status == 0) {
                layer.close(index)
                pageUtil.getFreeList()
            } else {
                $.Huimodalalert(res.message, 2000)
            }
        })
    },

    // 更新活动列表状态
    'updateStatus': function() {
        var $tr = $('#freeActList').find('tr'),
            nowTime = new Date().getTime()

        $tr.each(function(index, item) {
            var $wrap = $(item),
                status = $.trim($wrap.find('.status').text()),
                start = $.trim($wrap.find('.start').text()),
                end = $.trim($wrap.find('.end').text()),
                html = ''

            if (status == '未开始' && $wrap.find('.pause').length && nowTime > new Date(start).getTime()) {
                $wrap.find('.status').text('进行中')

                html = '<span class="list-ctl pause">停用</span>\
                        <span class="list-ctl see">查看</span>'

                $wrap.find('.control').html(html)
            } else if (status == '进行中' && nowTime > new Date(end).getTime()) {
                $wrap.find('.status').text('已结束')

                html = '<span class="list-ctl copy">复制</span>'

                $wrap.find('.control').html(html)
            }
        })
    }

}

// document.ready
$(function() {
    // 获取id 判断是新增还是编辑
    var id = util.getQueryString('id')
    id && (pageUtil.freeId = id) && pageUtil.getFreeInfo()

    // 免息类型选择
    $('#freeTypeWrap').on('click', 'input', function() {
        var $self = $(this),
            $goods = $('#addFreeGoods')

        pageUtil.checkAddGoodsBtn()

        if ($self.val() === 'all') {
            $goods.hide()
        } else {
            $goods.show()
        }
    })

    // 免息折扣输入区域
    $('#freeCountWrap').on('blur', 'input', function() {
        var $self = $(this),
            val = $self.val(),
            flag = false

        if (!val.length) {
            flag = true
            $.Huimodalalert('折扣不能为空', 1500)
        } else if (!pageUtil.checkNum.test(val)) {
            flag = true
            $.Huimodalalert('请输入正确格式', 1500)
        } else {
            val = +val

            if (val < 0 || val > 10) {
                flag = true
                $.Huimodalalert('折扣数字在0到10之间', 1500)
            }
        }

        if (flag) {
            $self.val('').focus()
        }
    })

    // 分类选择弹窗初始化
    $.get(base + 'goodsAdmin/getCategory.do', {
        'parentId': 0
    }, function(res) {
        var html = '';

        if (res.status == '0') {

            $.each(res.data, function(index, item) {
                html += '<li data-id="' + item.id + '">' + item.name + '</li>'
            });

            $('.type-select-panel').find('.ul-1').html(html);
        } else {
            $.Huimodalalert(res.message, 2000)
        }
    })

    // 品牌选择弹窗初始化
    pageUtil.getBrand({});

    // 选择分类弹窗展示隐藏
    $('.select-classify').on('click', function() {
        var $self = $(this),
            $target = $self.siblings('.type-select-panel');

        $target.toggle();
    })

    // 选择品牌弹窗展示隐藏
    $('.select-brand').on('click', function() {
        var $self = $(this),
            $target = $self.siblings('.name-select-panel');

        $target.toggle();
    })

    // 选择分类弹窗点击分类
    $('.type-select-panel')
        .on('click', function(e) {
            e.stopPropagation();
        })
        .on('click', 'li', function() {
            // 点击选择项
            var $self = $(this),
                $parent = $self.parent();

            $self.addClass('check').siblings().removeClass('check');

            $parent.nextAll('ul').html('');

            pageUtil.setSelectType($self);
        })
        .on('click', '.close-panel', function() {
            // 关闭弹窗
            var $self = $(this),
                $parent = $self.closest('.type-select-panel');

            $parent.hide();
        })
        .on('click', '.get-result', function() {
            // 确认选择
            var $self = $(this),
                $parent = $self.closest('.type-select-panel'),
                $target = $parent.siblings('.select-classify');

            $target.text(pageUtil.getSelectValue($self)).attr('data-id', $parent.find('.check:last').attr('data-id'));
            $parent.hide();
        })

    // 选择品牌弹窗
    $('.name-select-panel')
        .on('click', function(e) {
            e.stopPropagation();
        })
        .on('keyup', 'input', function() {
            // 弹窗内搜索删选
            var $self = $(this),
                val = $self.val(),
                $target = $self.closest('.name-select-panel');

            pageUtil.getBrand({
                '$target': $target,
                'name': val
            });
        })
        .on('click', 'li', function() {
            // 点击选择品牌
            var $self = $(this),
                $wrap = $self.closest('.name-select-panel'),
                val = $self.text(),
                id = $self.attr('data-id');

            $wrap.hide().siblings('.select-brand').text(val).attr('data-id', id);
        })

    // 查询商品列表
    $('#screeBtn').on('click', function() {
        pageUtil.getGoodsList();
    })

    // 重置查询列表
    $('#resetBtn').on('click', function() {
        var $wrap = $('#pageSearchForm');

        $wrap.find('.select-classify').attr('data-id', '').text('请选择分类');
        $wrap.find('.condition-panel').find('ul:gt(0)').empty();
        $wrap.find('.condition-panel').find('li').removeClass('check');
        $wrap.find('.select-brand').attr('data-id', '').text('请选择品牌');
        $wrap.find('.name-select-panel').find('input').val('');
        $wrap.find('.name-select-panel').find('ul').empty();
        pageUtil.getBrand({
            '$target': $wrap.find('.name-select-panel')
        });
        $wrap.find('#searchName').val('');
        $wrap.find('#roleStatus').val('');

        pageUtil.getGoodsList();
    })

    // 点击添加更多商品
    $('#addGoods').click(function() {
        var $trList = $('#addGoodsListWrap').find('tr'),
            flag = false

        $trList.length && $.each($trList, function(index, item) {
            if ($(item).attr('data-id') === undefined) {
                flag = true
                return false
            }
        })

        if (pageUtil.freeId === '') {
            $.Huimodalalert('请先保存后再添加商品', 2000)
            return false
        }

        if (flag) {
            $.Huimodalalert('列表中有未保存的商品，请保存后再继续添加', 2000)
            return false
        } else {
            $('#addGoodsPanel').modal('show')
            pageUtil.getGoodsList()
        }

    })

    // 批量删除商品
    $('#removeGoods').click(function() {
        var $wrap = $('#addGoodsListWrap')
        $wrap.find(':checked').closest('tr').remove()
        pageUtil.checkAddGoodsBtn()
    })

    // 单个删除商品
    $('#addGoodsListWrap').on('click', '.pointer', function() {
        var $self = $(this)
        $self.closest('tr').remove()
        pageUtil.checkAddGoodsBtn()
    })

    // 确定添加
    $('#addSelect').click(function() {
        var $select = $('#addGoodsWrap').find(':checked')

        if (!$select.length) {
            $.Huimodalalert('请至少选择一个关联商品', 2000)
            return false
        } else {
            pageUtil.cache.selectedGoods = []

            $select.each(function(index, item) {
                var $wrap = $(item).closest('tr')
                pageUtil.cache.selectedGoods.push(pageUtil.cache.goodsListCache[$wrap.index()])
            })

            pageUtil.addToList()
        }
    })

    // 表格全选
    $('.check-all').click(function() {
        var $self = $(this),
            $table = $self.closest('table'),
            $tbody = $table.find('tbody')

        if ($self.prop('checked')) {
            $tbody.find(':checkbox').prop('checked', true)
        } else {
            $tbody.find(':checkbox').prop('checked', false)
        }
    })

    // 点击保存
    $('#saveFreeAct').click(function() {
        var $self = $(this),
            data = {},
            $title = $('#actTitle'),
            $startTime = $('#freeStart'),
            $endTime = $('#freeEnd'),
            $inputList = $('#freeCountWrap').find('input'),
            $addGoodsList = $('#addGoodsListWrap').find('tr'),
            flag = false,
            flag2 = false,
            msg = ''

        // 检查必填项

        // 检查活动主题
        if (!$title.val()) {
            $.Huimodalalert('请填写活动主题', 1500)
            return false
        }

        // 检查活动开始时间
        if (!$startTime.val()) {
            $.Huimodalalert('请选择活动开始时间', 1500)
            return false
        }

        // 检查活动结束时间
        if (!$endTime.val()) {
            $.Huimodalalert('请选择活动结束时间', 1500)
            return false
        }

        // 检查免息方案
        $inputList.each(function(index, item) {
            if (!$(item).val().length) {
                flag = true
                $(item).focus()
                return false
            }
        })

        if (flag) {
            $.Huimodalalert('免息方案不能为空', 1500)
            return false
        }

        data.activityType = $('#freeTypeWrap').find(':checked').val() === 'all' ? 0 : 1 // 全场免息(0) 或 指定商品免息(1)
        data.theme = $title.val() // 活动主题
        data.beginTimeStr = $startTime.val() // 开始时间
        data.endTimeStr = $endTime.val() // 结束时间
        data.memo = $('#extendInfo').val() || '免息' // 备注
        data.freeListJson = $inputList.map(function(index, item) {
            var $self = $(item),
                data = {
                    'itemId': $self.attr('data-type'),
                    'itemValue': +$self.val()
                }
            return data
        }).get()

        data.freeListJson = JSON.stringify(data.freeListJson)

        if ($addGoodsList.length) {
            // 如果有商品列表，则添加关联的免息商品信息
            data.productListJson = $addGoodsList.map(function(index, item) {
                var $self = $(item),
                    data = {}

                data.itemId = $self.attr('data-skuid')
                data.activityPrice = $self.find('.activity-value').val()
                data.freeinterestPrice = $self.find('.free-value').val()

                return data
            }).get()

            // 检查不能为空
            $.each(data.productListJson, function(index, item) {
                if (item.activityPrice === '') {
                    flag2 = true
                    msg = '活动价不能为空'
                } else if (item.freeinterestPrice === '') {
                    flag2 = true
                    msg = '免息价不能为空'
                }

                if (flag2) {
                    return false
                }
            })

            if (flag2) {
                $.Huimodalalert(msg, 2000)
                return false
            }

            data.productListJson = JSON.stringify(data.productListJson)
        }

        if ($self.hasClass('uping')) {
            return false
        } else {
            $self.addClass('uping')

            // 判断是添加免息活动还是编辑免息活动
            if (pageUtil.freeId !== '') {
                // 编辑
                data.activityId = pageUtil.freeId

                pageUtil.editFree($self, data)
            } else {
                // 添加
                pageUtil.addFree($self, data)
            }
        }
    })

    // -------------------------
    // 免息列表页面
    // -------------------------

    // 获取免息列表
    $('#freeActList').length && pageUtil.getFreeList()

    // 点击筛选按钮
    $('#freeListSearch').click(function() {
        pageUtil.getFreeList()
    })

    // 点击重置按钮
    $('#freeListReset').click(function() {
        $('#pageSearchForm').find('input, select').val('')
    })

    // 列表事件绑定
    $('#freeActList')
        .on('click', '.edit', function(e) {
            // 编辑
            var $parent = $(this).closest('tr'),
                url = 'editFree.html?id=' + $parent.attr('data-id')

            location.href = url
        })
        .on('click', '.start', function(e) {
            // 启用
            var $self = $(this),
                $tr = $self.closest('tr'),
                id = $tr.attr('data-id')

            $.post(base + 'free/operateFreeActivity.do', {
                'activityId': id,
                'useStatus': 2
            }, function(res) {
                if (res.status == 0) {
                    pageUtil.getFreeList()
                } else {
                    $.Huimodalalert(res.message, 2000)
                }
            })
        })
        .on('click', '.pause', function(e) {
            // 停用
            var $self = $(this)

            pageUtil.nowCtlBtn = $self

            layer.open({
                title: '提示',
                content: '活动正在进行中，确定要停用？',
                btn: ["确认", "取消"],
                yes: pageUtil.pauseFree
            })
        })
        .on('click', '.delete', function(e) {
            // 删除
            var $self = $(this)

            pageUtil.nowCtlBtn = $self

            layer.open({
                title: '提示',
                content: '确定删除该活动吗？',
                btn: ["确认", "取消"],
                yes: pageUtil.deleteFree
            })
        })
        .on('click', '.copy', function(e) {
            // 复制
            var $self = $(this)

            pageUtil.nowCtlBtn = $self

            layer.open({
                title: '提示',
                content: '确定新建一条免息活动？',
                btn: ["确认", "取消"],
                yes: pageUtil.copyFree
            })
        })
        .on('click', '.see', function(e) {
            // 列表点击查看 查看绑定免息商品
            var $self = $(this),
                $wrap = $('#freeListSeeWrap')

            $.post(base + 'free/getFreeProduct.do', {
                'activityId': $self.closest('tr').attr('data-id')
            }, function(res) {
                var html = ''

                if (res.status == 0) {
                    $wrap.empty()

                    res.data && res.data.length && $.each(res.data, function(index, item) {
                        html += '<tr>\
                                    <td>' + item.skuName + '</td>\
                                    <td>' + item.sn + '</td>\
                                    <td>' + item.marketPrice + '</td>\
                                    <td>' + item.activityPrice + '</td>\
                                    <td>' + item.freeinterestPrice + '</td>\
                                </tr>'
                    })

                    $wrap.html(html)
                    $('#seeFreeDetail').modal('show')
                } else {
                    $.Huimodalalert(res.message, 2000)
                }
            })

        })
        .on('click', '.seeActivity', function(e) {
            // 查看活动信息
            var $self = $(this)

            $.post(base + 'free/editFreeActivity.do', {
                'activityId': $self.closest('tr').attr('data-id')
            }, function(res) {
                var $wrap = $('#seeActivityDetail'),
                    temp = null,
                    html = ''

                $wrap.find('.empty').empty()

                if (res.status == 0) {
                    temp = res.data

                    $wrap.find('#actType').html(temp.activityType == 1 ? '指定商品免息' : '全场商品免息')
                    $wrap.find('#actTitle').html(temp.theme)
                    $wrap.find('#actTime').html(temp.beginTime + '　至　' + temp.endTime)
                    $wrap.find('#actNotes').html(temp.memo)

                    $.each(temp.freeinterestActivityRules.sort(function(a, b) {
                        a.itemId - b.itemId
                    }), function(index, item) {
                        html += '<span>' + item.itemId + '期：' + JSON.parse(item.itemValue).discount + '折</span>'
                    })

                    $wrap.find('#actStrategy').html(html)

                    $wrap.modal('show')
                } else {
                    $.Huimodalalert(res.message, 2000)
                }

            })
        })
})