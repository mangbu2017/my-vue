/**
 * Created by shun.cao 2018/06/20
 * */
$(function () {
    //获取实例ID
    var url = window.location.href;
    var id = getQueryString(url).id;

    function getQueryString(str) {// 解析URL
        var reg = /([^?&=#]+)=([^?&=#]+)/g;
        var obj = {};
        str.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    }

    // 日历图标可点击
    $('.timeselect i').click(function () {
        $(this).parent().find('input').click();
    });

    // 获取节点名称
    $.post('/kafkaBack/monitor/getPodnameList', {instanceID: id}, function (data) {
        var code = data.code;
        if (code === 0) {
            var res = data.resultBean;
            if (res != null && res != undefined && res.length > 0) {
                var str = '';
                for (var i = 0; i < res.length; i++) {
                    str += '<option value="' + res[i] + '">' + res[i] + '</option>';
                }
                $('#podName').html(str);
                var reValue = {
                    instanceID: id,
                    podName: $('#podName').val(),
                    startTimeStr: Date.parse(currentDay),
                    endTimeStr: Date.parse(getNextDay(currentDay)),
                    unit: 1,
                    interval: 1,
                    infoType: infoType
                };
                sendAjax(reValue);
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
        } else {
            swal('', data.msg, 'error');
        }
    });

    // 当前时间
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = (myDate.getMonth() + 1) < 10 ? ('0' + (myDate.getMonth() + 1)) : (myDate.getMonth() + 1);
    var day = myDate.getDate() < 10 ? ('0' + myDate.getDate()) : myDate.getDate();
    var currentDay = year + '/' + month + '/' + day;

    function getNextDay(day) {
        day = new Date(day);
        day = +day + 1000 * 60 * 60 * 24;
        day = new Date(day);
        var mon = (day.getMonth() + 1) < 10 ? ('0' + (day.getMonth() + 1)) : (day.getMonth() + 1);
        var days = day.getDate() < 10 ? ('0' + day.getDate()) : day.getDate();
        return day.getFullYear() + "/" + mon + "/" + days;
    }

    //获取时间最近几天
    function getDay(day) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;//当前时间加上多少天
        today.setTime(targetday_milliseconds); //注意，这行是关键代码

        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = doHandle(tMonth + 1);
        tDate = doHandle(tDate);
        return tYear + "/" + tMonth + "/" + tDate;
    }

    function doHandle(time) {
        var m = time;
        if (time.toString().length == 1) {
            m = "0" + time;
        }
        return m;
    }

    //日期大小比较
    function compareDate(startDate, endDate) {
        var sDate = new Date(startDate.replace(/\//g, "\/"));
        var eDate = new Date(endDate.replace(/\//g, "\/"));
        return eDate - sDate;
    }

    var infoType = Number($('.config-active').attr('index'));

    //日期配置选项
    var beginTimeStore = '';
    var endTimeStore = '';
    $('#configData').daterangepicker({
            "startDate": moment().subtract(0, 'days'),
            "autoUpdateInput": true,
            "maxDate": moment(),
            "locale": {
                format: 'YYYY/MM/DD',
                applyLabel: "确定",
                cancelLabel: "取消",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        },
        function (start, end) {
            $('.btn-group .btn').addClass('btn-default').removeClass('btn-primary');
            beginTimeStore = start;
            endTimeStore = end;
            if (!this.startDate) {
                this.element.val('');
            } else {
                this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
            }
            //处理初始时间和截止时间
            var startTime = start.format('YYYY/MM/DD');
            var endTime = end.format('YYYY/MM/DD');
            var infoType = Number($('.config-active').attr('index'));

            var result = compareDate(startTime, endTime);

            StorageX.splice(0, StorageX.length);
            StorageY1.splice(0, StorageY1.length);
            StorageY2.splice(0, StorageY2.length);
            var params = {
                instanceID: id,
                podName: $('#podName').val(),
                startTimeStr: Date.parse(startTime),
                endTimeStr: Date.parse(getNextDay(endTime)),
                unit: (result === 0 ? 1 : 2),
                interval: 1,
                infoType: infoType
            };
            sendAjax(params);
        });

    //绘图
    function drawEchart(StorageX, YAxisStorage, StorageY1, StorageY2, seriesName1, seriesName2) {
        var seriesStr = [];
        seriesStr.push({
            name: seriesName1,
            type: 'line',
            color: '#337ab7',
            smooth: true,//控制线条平滑
            symbol: 'circle',
            data: StorageY1
        });
        if (seriesName2 != null && seriesName2 != undefined) {
            seriesStr.push({
                name: seriesName2,
                type: 'line',
                smooth: true,//控制线条平滑
                symbol: 'circle',
                data: StorageY2
            })
        }

        var storagechart = echarts.init(document.getElementById("show"));
        var storagechartoption = {
            title: {
                text: YAxisStorage
            },
            grid: {
                top: 40,
                left: 45,
                right: 30,
                bottom: 80
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false
                }
            },
            legend: {
                data: ['']
            },
            xAxis: [{
                type: 'category',
                name: '',
                aplitLine: {
                    show: true
                },
                boundaryGap: false,
                axisLabel: {
                    interval: 0,
                    rotate: 60,//倾斜度 -90 至 90 默认为0
                    margin: 7,
                    textStyle: {
                        color: "#000000"
                    }
                },
                data: StorageX
            }],
            yAxis: [{
                type: 'value',
                name: '',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: true
                }
            }],
            series: seriesStr
        };
        storagechart.setOption(storagechartoption, true);
        //随屏幕大小自适应
        window.onresize = storagechart.resize;
    }

    //初始化
    var StorageX = [];
    var StorageY1 = [];
    var StorageY2 = [];
    var storageYAxis = '';
    var seriesName1 = '';
    var seriesName2 = '';

    function sendAjax(reValue) {
        StorageX = [];
        StorageY1 = [];
        StorageY2 = [];
        storageYAxis = '';
        seriesName1 = '';
        seriesName2 = '';
        $.post('/kafkaBack/monitor/searchInstanceMonitorInfo', reValue, function (data) {
            var code = data.code;
            if (code === 0) {
                var res = data.resultBean;
                if (res != null && res != undefined) {
                    //初始加载
                    storageYAxis = res.verticalDes;
                    seriesName1 = res.seriesName1;
                    seriesName2 = res.seriesName2;
                    var storagedata = res.list;
                    for (var i = 0; i < storagedata.length; i++) {
                        StorageX[i] = storagedata[i].horizontal;
                        StorageY1[i] = storagedata[i].vertical1;
                        StorageY2[i] = storagedata[i].vertical2;
                    }

                    drawEchart(StorageX, storageYAxis, StorageY1, StorageY2, seriesName1, seriesName2);
                }
            } else if (code === 13) {
                swal({
                    title: '',
                    text: data.msg,
                    type: 'success',
                    confirmButtonText: '确定'
                }, function () {
                    window.location.href =  "/login";
                });
            } else {
                swal('', data.msg, 'error');
            }
        })
    }

    //点击今天
    $('#today').click(function () {
        //实现与日期选择器的联动
        $('#configData').daterangepicker({
            "startDate": moment().subtract(0, 'days'),
            "endDate": moment().subtract(0, 'days'),
            "autoUpdateInput": true,
            "maxDate": moment(),
            "locale": {
                format: 'YYYY/MM/DD',
                applyLabel: "确定",
                cancelLabel: "取消",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        }, function (start, end) {
            $('.btn-group .btn').addClass('btn-default').removeClass('btn-primary');
            //处理初始时间和截止时间
            var startTime = start.format('YYYY/MM/DD');
            var endTime = end.format('YYYY/MM/DD');
            var result = compareDate(startTime, endTime);
            var infoType = Number($('.config-active').attr('index'));

            StorageX.splice(0, StorageX.length);
            StorageY1.splice(0, StorageY1.length);
            StorageY2.splice(0, StorageY2.length);
            var params = {
                instanceID: id,
                podName: $('#podName').val(),
                startTimeStr: Date.parse(startTime),
                endTimeStr: Date.parse(getNextDay(endTime)),
                unit: (result === 0 ? 1 : 2),
                interval: 1,
                infoType: infoType
            };
            sendAjax(params);
        });
        //切换图表
        $(this).addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        var infoType = Number($('.config-active').attr('index'));

        StorageX.splice(0, StorageX.length);
        StorageY1.splice(0, StorageY1.length);
        StorageY2.splice(0, StorageY2.length);
        var params = {
            instanceID: id,
            podName: $('#podName').val(),
            startTimeStr: Date.parse(currentDay),
            endTimeStr: Date.parse(getNextDay(currentDay)),
            unit: 1,
            interval: 1,
            infoType: infoType
        };
        sendAjax(params);
    });

    //点击本周
    $('#week').click(function () {
        //实现与日期选择器的联动
        $('#configData').daterangepicker({
            "startDate": moment().subtract(6, 'days'),
            "endDate": moment().subtract(0, 'days'),
            "autoUpdateInput": true,
            "maxDate": moment(),
            "locale": {
                format: 'YYYY/MM/DD',
                applyLabel: "确定",
                cancelLabel: "取消",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        }, function (start, end) {
            $('.btn-group .btn').addClass('btn-default').removeClass('btn-primary');
            //处理初始时间和截止时间
            var startTime = start.format('YYYY/MM/DD');
            var endTime = end.format('YYYY/MM/DD');
            var result = compareDate(startTime, endTime);
            var infoType = Number($('.config-active').attr('index'));

            StorageX.splice(0, StorageX.length);
            StorageY1.splice(0, StorageY1.length);
            StorageY2.splice(0, StorageY2.length);
            var params = {
                instanceID: id,
                podName: $('#podName').val(),
                startTimeStr: Date.parse(startTime),
                endTimeStr: Date.parse(getNextDay(endTime)),
                unit: (result === 0 ? 1 : 2),
                interval: 1,
                infoType: infoType
            };
            sendAjax(params);
        });
        //切换图表
        $(this).addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        StorageX.splice(0, StorageX.length);
        StorageY1.splice(0, StorageY1.length);
        StorageY2.splice(0, StorageY2.length);
        var infoType = Number($('.config-active').attr('index'));

        var params = {
            instanceID: id,
            podName: $('#podName').val(),
            startTimeStr: Date.parse(getDay(-5)),
            endTimeStr: Date.parse(getDay(1)),
            unit: 2,
            interval: 1,
            infoType: infoType
        };
        sendAjax(params);
    });

    //点击本月
    $('#mouth').click(function () {
        //实现与日期选择器的联动
        $('#configData').daterangepicker({
            "startDate": moment().subtract(30, 'days'),
            "endDate": moment().subtract(0, 'days'),
            "autoUpdateInput": true,
            "maxDate": moment(),
            "locale": {
                format: 'YYYY/MM/DD',
                applyLabel: "确定",
                cancelLabel: "取消",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        }, function (start, end) {
            $('.btn-group .btn').addClass('btn-default').removeClass('btn-primary');
            //处理初始时间和截止时间
            var startTime = start.format('YYYY/MM/DD');
            var endTime = end.format('YYYY/MM/DD');
            var result = compareDate(startTime, endTime);
            var infoType = Number($('.config-active').attr('index'));

            StorageX.splice(0, StorageX.length);
            StorageY1.splice(0, StorageY1.length);
            StorageY2.splice(0, StorageY2.length);
            var params = {
                instanceID: id,
                podName: $('#podName').val(),
                startTimeStr: Date.parse(startTime),
                endTimeStr: Date.parse(getNextDay(endTime)),
                unit: (result === 0 ? 1 : 2),
                interval: 1,
                infoType: infoType
            };
            sendAjax(params);
        });
        //切换图表
        $(this).addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        StorageX.splice(0, StorageX.length);
        StorageY1.splice(0, StorageY1.length);
        StorageY2.splice(0, StorageY2.length);
        var infoType = Number($('.config-active').attr('index'));

        var params = {
            instanceID: id,
            podName: $('#podName').val(),
            startTimeStr: Date.parse(getDay(-29)),
            endTimeStr: Date.parse(getDay(1)),
            unit: 2,
            interval: 1,
            infoType: infoType
        };
        sendAjax(params);
    });

    //点击数量指标
    $('.basic-config ul li').click(function () {
        $(this).addClass('config-active').siblings().removeClass('config-active');
        var infoType = Number($(this).attr('index'));
        //切换图表
        $('#today').addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        var reValue = {
            instanceID: id,
            podName: $('#podName').val(),
            startTimeStr: Date.parse(currentDay),
            endTimeStr: Date.parse(getNextDay(currentDay)),
            unit: 1,
            interval: 1,
            infoType: infoType
        };

        sendAjax(reValue);

        //实现与日期选择器的联动
        $('#configData').daterangepicker({
            "startDate": moment().subtract(0, 'days'),
            "endDate": moment().subtract(0, 'days'),
            "autoUpdateInput": true,
            "maxDate": moment(),
            "locale": {
                format: 'YYYY/MM/DD',
                applyLabel: "确定",
                cancelLabel: "取消",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        }, function (start, end) {
            $('.btn-group .btn').addClass('btn-default').removeClass('btn-primary');
            //处理初始时间和截止时间
            var startTime = start.format('YYYY/MM/DD');
            var endTime = end.format('YYYY/MM/DD');
            var result = compareDate(startTime, endTime);
            var infoType = Number($('.config-active').attr('index'));

            StorageX.splice(0, StorageX.length);
            StorageY1.splice(0, StorageY1.length);
            StorageY2.splice(0, StorageY2.length);
            var params = {
                instanceID: id,
                podName: $('#podName').val(),
                startTimeStr: Date.parse(startTime),
                endTimeStr: Date.parse(getNextDay(endTime)),
                unit: (result === 0 ? 1 : 2),
                interval: 1,
                infoType: infoType
            };
            sendAjax(params);
        });
    });

    //选中节点名称
    $('#podName').change(function () {
        //切换图表
        $('#today').addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        var reValue = {
            instanceID: id,
            podName: $('#podName').val(),
            startTimeStr: Date.parse(currentDay),
            endTimeStr: Date.parse(getNextDay(currentDay)),
            unit: 1,
            interval: 1,
            infoType: infoType
        };

        sendAjax(reValue);

        //实现与日期选择器的联动
        $('#configData').daterangepicker({
            "startDate": moment().subtract(0, 'days'),
            "endDate": moment().subtract(0, 'days'),
            "autoUpdateInput": true,
            "maxDate": moment(),
            "locale": {
                format: 'YYYY/MM/DD',
                applyLabel: "确定",
                cancelLabel: "取消",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        }, function (start, end) {
            $('.btn-group .btn').addClass('btn-default').removeClass('btn-primary');
            //处理初始时间和截止时间
            var startTime = start.format('YYYY/MM/DD');
            var endTime = end.format('YYYY/MM/DD');
            var result = compareDate(startTime, endTime);
            var infoType = Number($('.config-active').attr('index'));

            StorageX.splice(0, StorageX.length);
            StorageY1.splice(0, StorageY1.length);
            StorageY2.splice(0, StorageY2.length);
            var params = {
                instanceID: id,
                podName: $('#podName').val(),
                startTimeStr: Date.parse(startTime),
                endTimeStr: Date.parse(getNextDay(endTime)),
                unit: (result === 0 ? 1 : 2),
                interval: 1,
                infoType: infoType
            };
            sendAjax(params);
        });
    })
});