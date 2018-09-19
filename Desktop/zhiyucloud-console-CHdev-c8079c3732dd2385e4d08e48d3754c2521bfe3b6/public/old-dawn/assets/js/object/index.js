/**
 * Created by shun.cao 2018/02/05
 * */
$(function () {
    sessionStorage.clear();
    var page = null;//当前页
    var pageSize = null;//每页多少张
    var totalPage = null;//总条数

    $.get('/dawnBack/bucketinfo/searchbucketlist', function (data) {
        bindHtml(data);
    });

    $(document).keydown(function (e) {
        var keyCode = e.keyCode || e.which || e.charCode;
        if (keyCode === 13) {
            $(".modal").modal('hide');//关闭
            event.preventDefault();//禁用默认回车事件
        }
    });

    function bindHtml(data) {
        $('html,body').animate({scrollTop: 0});
        var code = data.code;
        if (code === 0) {
            var str = '';
            var res = data.resultBean;
            if (res != null && res != undefined) {

                var items = res.items;
                for (var i = 0; i < items.length; i++) {
                    var regions = items[i].region;
                    var region = '—';
                    if (regions != null && regions != undefined) {
                        region = regions;
                    }

                    var isManagement = res.isManagement;
                    str += '<tr>' +
                        '<td><a href="javascript:void(0);" class="goDetail">' + items[i].bucketName + '</a></td>' +
                        '<td>' + region + '</td>' +
                        '<td>' + items[i].size + '</td>' +
                        '<td>' + items[i].creatorName + '</td>' +
                        '<td>' + items[i].createTime + '</td>' +
                        // '<td><a href="file.html?bucketName=' + items[i].bucketName + '"><span>文件列表</span></a></td>' +
                        '</tr>'
                }
                $('.content-table').find('tbody').html(str);

                $('.goDetail').click(function () {
                    if (isManagement === 0) {
                        $(this).attr('href', 'javascript:void(0);');
                    } else if (isManagement === 1) {
                        $(this).attr('href', 'file.html?bucketName=' + $(this).text());
                    }
                });

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
                // window.location.href = "../list.html";
                window.location.href = "/login";
            });
        } else {
            swal('', data.msg, 'warning');
        }
    }

    //分页数据渲染
    PageClick = function (pageclickednumber) {
        $('#pager').pager({pagenumber: pageclickednumber, pagecount: totalPage, buttonClickCallback: PageClick});
        sendAjax(pageclickednumber);
    };

    //获取数据渲染表格
    function sendAjax(param) {
        var reValue = {};
        reValue.page = param;

        $.get('/dawnBack/bucketinfo/searchbucketlist', reValue, function (data) {
            bindHtml(data);
        })
    }

    $('input').blur(function () {
        $('.message').text('');
        $(this).css('borderColor', '#ccc');
    });

    //创建bucket
    $('#createBtn').click(function () {
        var bucketName = $('#bucketName').val();
        if (bucketName === '') {
            $('.message').text('').text('请输入bucket名称');
        } else if (bucketName.length < 3 || bucketName.length > 63) {
            $('.message').text('').text('bucket名称格式不正确');
        } else {
            $('#createBtn').attr('disabled', 'disabled');
            $('.message').text('');
            var param = {};
            param.bucketName = bucketName;
            $.post('/dawnBack/bucketinfo/createbucket', param, function (data) {
                var code = data.code;
                if (code === 0) {
                    $('#createBtn').removeAttr('disabled');
                    $.get('/dawnBack/bucketinfo/searchbucketlist', function (data) {
                        bindHtml(data);
                    });
                    $('#createModal').modal('hide');
                    $('#bucketName').val('');
                } else if (code === 13) {
                    swal({
                        title: '',
                        text: data.msg,
                        type: 'success',
                        confirmButtonText: '确定'
                    }, function () {
                        // window.location.href = "../list.html";
                        window.location.href =  "/login";
                    });
                } else if (code === 4) {
                    $('#createBtn').removeAttr('disabled');
                } else {
                    $('#createBtn').removeAttr('disabled');
                    $('.message').text('').text(data.msg);
                }
            })
        }
    });

    //修改实例名称弹框关闭
    $('#createModal').on('hide.bs.modal', function () {
        $('input').css('borderColor', '#ccc');
        $('input').val('');
        $('.message').text('');
    });
});
