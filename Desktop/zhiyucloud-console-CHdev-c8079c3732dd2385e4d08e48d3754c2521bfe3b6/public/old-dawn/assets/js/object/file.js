/**
 * Created by shun.cao 2018/02/06
 * */

$(function () {
    // 禁用F5刷新
    document.onkeydown = function (e) {
        var ev = window.event || e;
        var code = ev.keyCode || ev.which;
        if (code == 116) {
            ev.keyCode ? ev.keyCode = 0 : ev.which = 0;
            ev.cancelBubble = true;
            return false;
        } else if (ev.ctrlKey && code == 82) {//禁用CTRL+R刷新
            ev.keyCode ? ev.keyCode = 0 : ev.which = 0;
            ev.cancelBubble = true;
            return false;
        }
    };

    function getURLString(string, str) {
        return string.split(str)[0];
    }

    var intofile = false;
    //获取bucketName
    var url = window.location.href;
    var bucketName = getQueryString(url).bucketName;
    var fileNames = getQueryString(url).fileName;

    $('#control').attr('href', 'control.html?bucketName=' + bucketName);

    //获取页面信息
    var page = null;//当前页
    var pageSize = null;//每页多少张
    var totalPage = null;//总条数

    var reValue = {};
    reValue.bucketName = bucketName;
    //获取列表信息(获取最外层列表)
    var createfilepath = sessionStorage.getItem("intofilepath");
    if (createfilepath != '') {
        reValue.path = createfilepath;
    } else {
        reValue.fileName = fileNames;
    }

    $('.uploading').hide();

    $('input').blur(function () {
        $('.message').text('');
        $(this).css('borderColor', '#ccc');
    });

    $(document).keydown(function (e) {
        var keyCode = e.keyCode || e.which || e.charCode;
        if (keyCode === 13) {
            $(".modal").modal('hide');//关闭
            event.preventDefault();//禁用默认回车事件
        }
    });

    // 关闭新建文件夹功能
    $('#createModal').on('hide.bs.modal', function () {
        $('#fileName').val('');
        $('.message').text('');
    });

    // 新建文件夹
    $('#createBtn').click(function () {
        var fileName = $('#fileName').val();
        if (fileName === '') {
            $('.message').text('').text('请输入文件夹名称');
        } else {
            $('#createBtn').attr('disabled', 'disabled');
            $('.message').text('');
            var param = {};
            param.bucketName = bucketName;
            param.path = $("#fileaddress").val() ? $("#fileaddress").val() : null;
            param.fileName = fileName;
            param.nodeType = 'NTE1';
            param.storeType = "STE1";

            $.post('/zuul/dawnBack/filenode/createfilenode', param, function (data) {
                $('#createBtn').removeAttr('disabled');
                var createfilepath = $("#fileaddress").val() ? $("#fileaddress").val() : '';
                var code = data.code;
                reValue.path = createfilepath;
                if (code === 0) {
                    $.get('/dawnBack/filenode/searchfilelist', reValue, function (data) {
                        bindHtml(data);
                    });
                    $('#createModal').modal('hide');
                    $('#fileName').val('');
                } else if (code === 13) {
                    swal({
                        title: '',
                        text: data.msg,
                        type: 'success',
                        confirmButtonText: '确定',
                    }, function () {
                        window.location.href = "/login";
                    });
                } else if (code === 4) {
                    $('#createBtn').removeAttr('disabled');
                } else {
                    $('.message').text('').text(data.msg);
                }
            })
        }
    });

    //上传事件
    function uploader() {
        var $queue = $('.upload-filelist');//上传文件list

        var $uploadList = $('#js-upload-panel-list-container');

        $('.upload-alert-search').show();

        // 上传按钮
        var $upload = $('#uploadBtn');

        // 所有文件的进度信息，key为file id
        var percentages = {};

        var fileSize = 0;

        var countNum = 0;

        var addNum = 0;

        if (!WebUploader.Uploader.support()) {
            alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
            throw new Error('WebUploader does not support the browser you are using.');
        }

        //点击上传照片
        var uploader = WebUploader.create({

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: {
                id: '#filePicker1'
            },
            timeout: 0,//超时时间
            dnd: '.file-uploader-list',//是否允许拖拽

            // 选完文件后，是否自动上传。
            auto: false,
            withCredentials: true,

            // swf文件路径
            swf: '../../swf/Uploader.swf',

            formData: {},

            // 文件接收服务端。
            server: '/zuul/dawnBack/filenode/createfilenode',

            chunked: false,//是否要分片处理大文件上传
            // fileSizeLimit: 15 * 1024 * 1024 * 1024,    //验证文件总大小是否超出限制, 超出则不允许加入队列。
            fileSingleSizeLimit: 5 * 1024 * 1024 * 1024    //验证单个文件大小是否超出限制, 超出则不允许加入队列(5G)。

        });

        // 当有文件添加进来时执行，负责view的创建
        function addFile(file) {
            $('.upload-alert-search').hide();
            var $tr = $('<tr id="' + file.id + '" index="' + file.id + '">' +
                '<td>' + file.source.name + '</td>' +
                '<td>' + bytesToSize(file.size) + '</td>' +
                '<td>' +
                '<span class="upload-delete" index="' + (addNum++) + '">删除</span>' +
                '</td>' +
                '</tr>');

            var $li = $('<li class="' + file.id + '">' +
                '<span>' + file.source.name + '</span>' +
                '<div class="tc-progress">' +
                '<div class="tc-progress-value">' +
                '<span class="percentage"></span>' +
                '</div>' +
                '<p class="brief-info">' + bytesToSize(file.size) + '</p>' +
                '<span class="error"></span>' +
                '</div>' +
                '</li>');

            $tr.appendTo($queue);
            $li.appendTo($uploadList);
            percentages[file.id] = [file.size, 0];
            bindDelete(file);
        }

        function bindDelete(file) {
            $('.upload-delete').click(function () {
                var $tr = $(this).parents('tr');
                var $trId = $tr.attr('index');
                var $trs = $queue.find('tr');
                if ($trs.length) {
                    $('.upload-alert-search').hide();
                }
                for (var i = 0; i < $trs.length; i++) {
                    var index = $($trs[i]).attr('index');
                    if ($trId === index) {
                        uploader.removeFile(file);
                        $(this).parents('tr').remove();
                        $('.' + index).remove();
                    }
                }
            });
        }

        // 负责view的销毁
        function removeFile(file) {
            var $tr = $('#' + file.id);
            delete percentages[file.id];
            $tr.off().end().remove();
        }

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on('uploadSuccess', function (file, response) {
            // reValue.path="";
            var fileurl = window.location.href;
            var createfilepath = $("#fileaddress").val() ? $("#fileaddress").val() : '';
            /*var requirepath = '';
            for (var i = 1; i < createfilepath.split("/").length - 2; i++) {
                requirepath += "/" + createfilepath.split("/")[i];
            }
            var truepath = requirepath.replace(/undefined/, '') + "/";*/
            reValue.path = createfilepath;
            //获取列表信息(获取最外层列表)
            $.get('/dawnBack/filenode/searchfilelist', reValue, function (data) {
                bindHtml(data);
            });
            $('.upload-alert-search').show();
            $queue.html('');
        });

        //当文件添加进来时
        uploader.onFileQueued = function (file) {
            countNum++;
            fileSize += file.size;
            addFile(file);
        };

        //删除文件时
        uploader.onFileDequeued = function (file) {
            countNum--;
            fileSize -= file.size;
            removeFile(file);
        };

        //上传过程中
        uploader.onUploadProgress = function (file, percentage) {

            var $li = $('.' + file.id),
                $percent = $li.find('.percentage');

            $percent.css('width', percentage * 100 + '%');
        };

        // 文件上传失败，显示上传出错。
        uploader.on('uploadError', function (file, reason) {
            alert('上传状态:上传失败!');
            var $li = $('.' + file.id),
                $percent = $li.find('.percentage');
            $percent.css('width', '0%');
        });

        //文件判断
        uploader.on('error', function (file) {
            var msg = '上传状态：上传失败!';
            if (file === 'Q_TYPE_DENIED') {
                msg = '上传状态：失败,只支持jpg,png,bmp,gif,jpeg格式的图片！';
            } else if (file === 'Q_EXCEED_SIZE_LIMIT') {
                msg = '文件大小不能超过5M';
            } else if (file === 'F_DUPLICATE') {
                msg = '文件重复';
            } else if (file === 'F_EXCEED_SIZE') {
                msg = '文件大小超出限制';
            }
            alert(msg);
        });

        $upload.click(function () {
            if (uploader.getFiles().length > 0) {
                uploader.option('formData', {
                    bucketName: bucketName,
                    path: $("#fileaddress").val() ? $("#fileaddress").val() : '',
                    nodeType: "NTE2",
                    storeType: "STE1"
                });
                uploader.upload();

                $('#uploadModal').modal('hide');

                //进度条进度显示
                $('.updateProgress').show();
                $('.uploading').show();
                $('.uploading .num').text('').text('(' + countNum + ')');

                $('.slider-hd-title .num').text('').text('(' + countNum + ')');//上传数量
                $('.slider-hd-title .size').text('').text('共' + WebUploader.formatSize(fileSize));//上传大小
            }
        });

        //上传文件模态框
        $('#uploadModal').on('show.bs.modal', function () {
            $('.upload-filelist').html('');
            $uploadList.html('');
            $('.upload-alert-search').show();

            // 移除所有缩略图并将上传文件移出上传序列
            for (var i = 0; i < uploader.getFiles().length; i++) {
                // 将图片从上传序列移除
                uploader.removeFile(uploader.getFiles()[i]);
                var $li = $('#' + uploader.getFiles()[i].id);
                $li.off().remove();
            }
            percentages = {};
            fileSize = 0;
            countNum = 0;
            addNum = 0;

            // 重置uploader，目前只重置了文件队列
            uploader.reset();
        });
    }

    //点击关闭
    $('.tc-15-btn-close').click(function () {
        $('.updateProgress').hide();
    });

    //关闭上传进度页面
    $(document).click(function (event) {
        var uploadBtn = $('#uploadBtn');   // 设置目标区域
        var uploading = $('.uploading');   // 设置目标区域
        if (!uploadBtn.is(event.target) && !uploading.is(event.target) && uploadBtn.has(event.target).length === 0 && uploading.has(event.target).length === 0) { // Mark 1
            $('.updateProgress').hide();          //淡出消失
        }
    });

    //点击查看列表
    $('.uploading').click(function () {
        $('.updateProgress').show();
        $('.upload-alert-search').show();
    });

    uploader();

    $.get('/dawnBack/filenode/searchfilelist', reValue, function (data) {
        bindHtml(data);
    });

    function bindHtml(data) {
        $('.check-all').prop("checked", false);
        $('.check-one').prop("checked", false);
        $('.js-btn-multi-delete').attr('disabled', 'disabled');
        $('.content-table').find('tbody').html('');
        $('html,body').animate({scrollTop: 0});
        var code = data.code;
        if (code === 0) {
            var str = '';
            var res = data.resultBean;
            if (res != null && res != undefined) {
                $("#fileaddress").attr("value", res.path);
                var items = res.items;
                for (var i = 0; i < items.length; i++) {

                    var fileSize = '—';//文件大小
                    var fileSaveType = '—';//存储类型
                    var fileUpdateTime = '—';//更新时间
                    var fileNameStr = '';//文件名称

                    //文件类型
                    var nodeType = items[i].nodeType;
                    if (nodeType === 'NTE1') {//目录
                        fileSize = '—';
                        fileSaveType = '—';
                        fileUpdateTime = '—';
                        fileNameStr += '<a href="javascript:void(0);" class="goToFile">' + items[i].fileName + '</a>';
                    } else if (nodeType === 'NTE2') {//对象
                        fileSize = items[i].size;
                        fileSaveType = items[i].storeType;
                        fileUpdateTime = items[i].updateTime;
                        fileNameStr += items[i].fileName;
                    }

                    str += '<tr title="' + items[i].fileName + '" index="' + nodeType + '" path="' + (res.path ? res.path : '') + '">' +
                        '<td class="selectCheckbox">' +
                        '<input class="check-one check" type="checkbox"/>' +
                        '<img src="./assets/img/file.png"  style="display:' + (nodeType === 'NTE1' ? "inline-block" : "none") + '">' + fileNameStr + '</a>' +
                        '</td>' +
                        '<td>' + fileSize + '</td>' +
                        '<td>' + fileSaveType + '</td>' +
                        '<td>' + fileUpdateTime + '</td>' +
                        '<td>' +
                        '<span class="' + (nodeType === "NTE2" ? "file-down" : "") + '" style="display:' + (nodeType === 'NTE1' ? "none" : "inline-block") + '">下载</span>' +
                        '<span class="' + (nodeType === "NTE2" ? "file-detail" : "") + '" style="display:' + (nodeType === 'NTE1' ? "none" : "inline-block") + '">详情</span>' +
                        '<span class="file-delete">删除</span>' +
                        '</td>' +
                        '</tr>';
                }
                $('.content-table').find('tbody').html('').html(str);//加了个empty()

                bindEvent();

                //页码渲染
                page = res.currentPage;//当前页
                pageSize = res.pageSize;//每页多少条
                totalPage = res.totalPage;//总条数

                if (items.length === 0) {
                    $('#pager').html('');
                    $('.nohave-search').show();
                } else {
                    $('.nohave-search').hide();
                    //页码控制
                    $('#pager').pager({
                        pagenumber: page,
                        pagecount: totalPage,
                        buttonClickCallback: PageClick
                    })
                }
            }
        } else if (code === 13) {
            swal({
                title: '',
                text: data.msg,
                type: 'success',
                confirmButtonText: '确定'
            }, function () {
                window.location.href = "/login";
            });
        } else if (code != 4) {
            swal('', data.msg, 'warning');
        }
    }

    // 点击操作事件(单个，没有父级)
    function bindEvent() {
        //下载
        $('.file-down').click(function (e) {
            var tr = $(this).parents('tr');
            var fileName = tr.attr('title');
            var path = tr.attr('path');

            var data = '';
            if (bucketName != null && bucketName != undefined) {
                if (data === '') {
                    data += 'bucketName=' + encodeURIComponent(bucketName);
                } else {
                    data += '&bucketName=' + encodeURIComponent(bucketName);
                }
            }
            if (fileName != null && fileName != undefined) {
                if (data === '') {
                    data += 'fileName=' + encodeURIComponent(fileName);
                } else {
                    data += '&fileName=' + encodeURIComponent(fileName);
                }
            }
            if (path != 'null') {
                if (data === '') {
                    data += 'path=' + encodeURIComponent(path);
                } else {
                    data += '&path=' + encodeURIComponent(path);
                }
            }

            $.ajax({
                type: 'get',
                url: '/dawnBack/filenode/downloadobj',
                data: data,
                dataType: 'binary',
                processData: false,
                xhrFields: {
                    responseType: 'blob',
                },
            }).success(function (data, status, xhr) {
                var $aDown = $('<a download href=""></a>');
                var url = URL.createObjectURL(data);
                if (xhr.getResponseHeader('content-disposition')) {
                    $aDown.attr({
                        href: url,
                        download: decodeURI(xhr.getResponseHeader('content-disposition').split(' ')[1]),
                    });
                    $($aDown)[0].click();
                    URL.revokeObjectURL(url);
                }
            });
        });

        // 详情
        $('.file-detail').click(function () {
            var tr = $(this).parents('tr');
            var fileName = tr.attr('title');
            var path = tr.attr('path') ? tr.attr('path') : '';
            var param = {};
            param.bucketName = bucketName;
            param.fileName = fileName;
            param.path = path;
            $.post('/dawnBack/filenode/searchnodeinfo', param, function (data) {
                var code = data.code;
                if (code === 0) {
                    var res = data.resultBean;
                    if (res != null && res != undefined) {
                        $('#fileNames').text(res.fileName);
                        $('#fileSize').text(res.size);
                        $('#fileURL').text(res.url);
                    }
                } else if (code === 13) {
                    swal({
                        title: '',
                        text: data.msg,
                        type: 'success',
                        confirmButtonText: '确定'
                    }, function () {
                        window.location.href = "/login";
                    });
                }
            });
            $('#listDetailModal').modal('show');
        });

        //当个文件删除
        $('.file-delete').click(function () {
            var fileNodeIDList = [];
            var tr = $(this).parents('tr');
            var fileName = tr.attr('title');
            var nodeType = tr.attr('index');
            var path = tr.attr('path') ? tr.attr('path') : '';
            var data = {};
            fileNodeIDList.push({
                fileName: fileName,
                nodeType: nodeType
            });
            data.bucketName = bucketName;
            data.fileList = JSON.stringify(fileNodeIDList);
            data.path = path;

            swal({
                title: '确定删除吗？',
                text: '你将无法恢复该删除文件！',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: false,
            }, function () {
                $.post('/dawnBack/filenode/deletefilenode', data, function (data) {
                    var code = data.code;
                    if (code === 0) {
                        sendAjax(page);
                        swal({
                            title: '删除成功',
                            type: 'success',
                            timer: 2000
                        });
                    } else if (code === 13) {
                        swal({
                            title: '',
                            text: data.msg,
                            type: 'success',
                            confirmButtonText: '确定'
                        }, function () {
                            window.location.href = "/login";
                        });
                    } else if (code != 4) {
                        swal({
                            title: data.msg,
                            type: 'error',
                            timer: 2000,
                        });
                    }
                });
            });
        });

        //点击进入文件夹
        $('.goToFile').click(function () {
            intofile = true;
            var tr = $(this).parents('tr');
            var fileName = $(this).text();
            var filepath = tr.attr('path');
            var param = {};
            param.bucketName = bucketName;
            param.fileName = fileName;
            param.path = filepath;
            $.get('/dawnBack/filenode/searchfilelist', param, function (data) {
                window.history.pushState(null, null, getURLString(url, '?') + '?bucketName=' + bucketName + '&fileName=' + fileName);
                bindHtml(data);
                var path = data.resultBean.path;
                sessionStorage.setItem("intofilepath", path);
                var backPathLength = path.lastIndexOf("/");
                var backPath = path.substr(0, path.lastIndexOf("/", backPathLength - 1));
                sessionStorage.setItem("backPath", (backPath ? (backPath + '/') : ''));
            })
        });

        //批量删除选中事件
        var checkAll = $('.check-all');
        var checkOnes = $('.check-one');
        var deleteAll = $('.js-btn-multi-delete');

        //全选 全不选
        $(".check-all").on("click", function () {
            if ($(".check-all").prop("checked")) {//全选，更多操作按钮可用
                $('.check-one').prop("checked", true);
            } else {//不全选，更多操作按钮不可用
                $('.check-one').prop("checked", false);
            }
            //判断是否有选中的信息
            if ($(".check-one:checked").length > 0) {
                //移除禁用按钮
                $('.js-btn-multi-delete').removeAttr('disabled');
            } else {
                $('.js-btn-multi-delete').attr('disabled', 'disabled');
            }
        });

        //选中反选
        $(".check-one").on("click", function (obj) {
            var flag = false;
            if ($(obj).prop("checked") == false) {
                flag = false;
            } else {
                flag = true;
                $(".check-one").each(function () {
                    if ($(this).prop("checked") == false) {
                        flag = false;
                    }
                })
            }
            //判断是否全部选中
            if (flag) {
                $(".check-all").prop("checked", true);
            } else {
                $(".check-all").prop("checked", false);
            }
            //判断是否有选中的信息
            if ($(".check-one:checked").length > 0) {
                //移除禁用按钮
                $('.js-btn-multi-delete').removeAttr('disabled');
            } else {
                $('.js-btn-multi-delete').attr('disabled', 'disabled');
            }
        });

        //批量删除
        deleteAll.click(function () {
            var fileNodeIDList = [];
            var prePath = $("#fileaddress").val() ? $("#fileaddress").val() : '';
            for (var i = 0; i < checkOnes.length; i++) {
                var checkOne = checkOnes[i];
                if (checkOne.checked) {//只有选中才能删除
                    var tr = $(checkOne).parents('tr');
                    var fileName = tr.attr('title');
                    var nodeType = tr.attr('index');
                    fileNodeIDList.push({
                        fileName: fileName,
                        nodeType: nodeType
                    });
                }
            }
            var data = {};
            data.bucketName = bucketName;
            data.fileList = JSON.stringify(fileNodeIDList);
            data.path = prePath;

            swal({
                title: '确定删除吗？',
                text: '你将无法恢复该删除文件！',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnConfirm: false,
            }, function () {
                $.post('/dawnBack/filenode/deletefilenode', data, function (data) {
                    var code = data.code;
                    if (code === 0) {
                        sendAjax(page);
                        swal({
                            title: '删除成功',
                            type: 'success',
                            timer: 2000
                        });
                    } else if (code === 13) {
                        swal({
                            title: '',
                            text: data.msg,
                            type: 'success',
                            confirmButtonText: '确定'
                        }, function () {
                            window.location.href = "/login";
                        });
                    } else if (code != 4) {
                        swal({
                            title: data.msg,
                            type: 'error',
                            timer: 2000,
                        });
                    }
                });
            });
        });

        //同步选中状态
        function syncChecked() {
            if (checkOnes.length > 0) {
                deleteAll.removeAttr('disabled', 'disabled');
            }
            var checked = true;//默认全选
            for (var i = 0; i < checkOnes.length; i++) {
                //只要有一个没有选中，就将checked重置为false
                if (checkOnes[i].checked == false) {
                    checked = false;
                    break;
                }
            }
            // 改变全选checkbox的状态
            for (var i = 0; i < checkAll.length; i++) {
                checkAll[i].checked = checked;
            }
        }
    }

    //分页数据渲染
    PageClick = function (pageclickednumber) {
        $('#pager').pager({pagenumber: pageclickednumber, pagecount: totalPage, buttonClickCallback: PageClick});
        sendAjax(pageclickednumber);
    };

    //获取数据渲染表格
    function sendAjax(param) {
        var backwardpath = $("#fileaddress").val() ? $("#fileaddress").val() : '';
        //传值
        var reValue = {};
        reValue.bucketName = bucketName;
        reValue.page = param;
        reValue.path = backwardpath;

        $.get('/dawnBack/filenode/searchfilelist', reValue, function (data) {
            bindHtml(data);
        })
    }

    //文件信息复制
    $('.copy-url').click(function () {
        var Url2 = $("#fileURL");
        Url2.select(); // 选择对象
        Url2.blur();
        document.execCommand("Copy"); // 执行浏览器复制命令
    });
    //返回上一级
    $('.break-bucketName').click(function () {
        var prePath = sessionStorage.getItem('backPath');
        var intoPrePath = sessionStorage.getItem('intofilepath');
        if ((prePath === '' && intoPrePath === '') || (prePath === null && intoPrePath === null)) {
            window.location.href = 'list.html';
        } else {
            var reValue = {
                bucketName: bucketName,
                path: prePath
            };
            $.get('/dawnBack/filenode/searchfilelist', reValue, function (data) {
                bindHtml(data);
                var paths = data.resultBean.path;
                var fileNameAll = paths.substr(paths.lastIndexOf("/", paths.lastIndexOf("/") - 1));
                if (paths.lastIndexOf('/') === paths.length - 1) {
                    var fileName = paths.substr(0, (paths.length - 1));
                } else {
                    var fileName = fileNameAll.substr(1, (fileNameAll.length - 2));
                }
                if (paths === '') {
                    window.history.pushState(null, null, getURLString(url, '?') + '?bucketName=' + bucketName);
                } else {
                    window.history.pushState(null, null, getURLString(url, '?') + '?bucketName=' + bucketName + '&fileName=' + fileName);
                }
                sessionStorage.setItem("intofilepath", prePath);
                var backPathLength = prePath.lastIndexOf("/");
                var backPath = prePath.substr(0, prePath.lastIndexOf("/", backPathLength - 1));
                sessionStorage.setItem("backPath", (backPath ? (backPath + '/') : ''));
            });
        }
    });
});