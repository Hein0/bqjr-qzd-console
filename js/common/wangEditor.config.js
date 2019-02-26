/*
*
* 编辑器配置
* */
(function () {
    var E = window.wangEditor
    var editor = new E('#editor')

    // 配置上传图片
    editor.customConfig.uploadImgServer = base + 'common/upload.do';
    editor.customConfig.uploadFileName = 'file';
    editor.customConfig.uploadImgParams = {
        chunk: 0
    };

    editor.customConfig.uploadImgHooks = {
        customInsert: function (insertImg, result, editor) {
            if (result.status == 0) {
                insertImg(imgPath + result.data)
            } else {
                showTit('上传失败')
            }
        }
    };

    // 配置菜单
    editor.customConfig.menus = [
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'link',  // 插入链接
        'list',  // 列表
        'justify',  // 对齐方式
        'image',  // 插入图片
        'undo',  // 撤销
        'redo'  // 重复
    ]
    editor.create();

    window.WEditor = editor;
})()