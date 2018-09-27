/**
 * Created by shun.cao 2018/02/06
 * */
$(function () {
    var $queue = $('.filelist');
    var $progress = $('#progress');

    if (!WebUploader.Uploader.support()) {
        alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
        throw new Error('WebUploader does not support the browser you are using.');
    }

//点击上传照片
    var uploader = WebUploader.create({

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: {
            id: '#filePicker1',
            multiple: false
        },


        // 选完文件后，是否自动上传。
        auto: true,
        withCredentials: true,

        // swf文件路径
        swf: '../../swf/Uploader.swf',

        // 文件接收服务端。
        server: http_url + 'upload/uploadFile',

        // fileNumLimit: 3,//验证文件总数量，超出则不允许加入队列
        fileSizeLimit: 15 * 1024 * 1024,    //验证文件总大小是否超出限制, 超出则不允许加入队列。
        fileSingleSizeLimit: 5 * 1024 * 1024,    //验证单个文件大小是否超出限制, 超出则不允许加入队列。

        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'jpg,png,bmp,gif,jpeg',
            mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif,image/bmp'
        }
    });

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function (file, response) {
        $progress.hide();
        $('.progressing').css('display', 'none');
        $('.progressing').html('');
        $('#' + file.id).addClass('upload-state-done');
        if (response != null && response != '' && response != undefined) {
            var img = response.resultBean;
            var $li = $('<li id="' + file.id + '">' +
                '<p class="imgWrap">' +
                '<img src="http://testsrc.wxhb.facethink.com/' + img + '" alt="">' +
                '</p>' +
                '<div class="file-panel" style="height: 0;">' +
                '<span class="cancel">删除</span>' +
                '</div>' +
                '</li>');
            $li.appendTo($queue);

            var $btns = $('.file-panel');

            $li.mouseenter(function () {
                $btns.stop().animate({height: 30});
            });

            $li.mouseleave(function () {
                $btns.stop().animate({height: 0});
            });

            $('.addImage p span').text('');

            //点击删除按钮
            $btns.on('click', '.cancel', function () {
                $('.addImage p span').text('');
                //删除原来图片
                var $liId = $(this).parents('li');
                $liId.remove();
            });
        }
    });

    uploader.on( 'beforeFileQueued', function( file ) {
        file.name=Math.random()+file.name;
    });

    uploader.onUploadProgress = function (file, percentage) {
        $progress.show();
        $progress.find('.text').text(Math.round(percentage * 100) + '%');
        $progress.find('.percentage').css('width', Math.round(percentage * 100) + '%');
    };

// 文件上传失败，显示上传出错。
    uploader.on('uploadError', function (file, reason) {
        $progress.hide();
        $('.progressing').css('display', 'block');
        $('.progressing').html('上传状态:上传失败!');
    });

//文件判断
    uploader.on('error', function (file, reason) {
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
        $progress.hide();
        $('.progressing').css('display', 'block');
        $('.progressing').html(msg);
    });
});