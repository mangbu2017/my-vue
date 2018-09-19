/**
 * Created by shun.cao 2018/05/25
 * */
$(function () {
    // 获取实例ID
    var url = window.location.href;
    var id = Number(getQueryString(url).id);

    function getQueryString(str) {//解析URL
        var reg = /([^?&=#]+)=([^?&=#]+)/g;
        var obj = {};
        str.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    }

    //日历图标可点击
    $('.timeselect i').click(function () {
        $(this).parent().find('input').click();
    });

    //当前时间
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

    var reValue = {
        instanceID: id,
        startTimeStr: Date.parse(currentDay),
        endTimeStr: Date.parse(getNextDay(currentDay)),
        timeUnit: 1
    };

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

            var result = compareDate(startTime, endTime);

            StorageX.splice(0, StorageX.length);
            StorageY.splice(0, StorageY.length);
            var params = {
                instanceID: id,
                startTimeStr: Date.parse(startTime),
                endTimeStr: Date.parse(getNextDay(endTime)),
                timeUnit: (result === 0 ? 1 : 2)
            };
            sendAjax(params);
        });

    //绘图
    function drawEchart(StorageX, YAxisStorage, StorageY) {
        var storagechart = echarts.init(document.getElementById("keyShow"));
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
                boundaryGap: 0,
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
            series: [{
                name: YAxisStorage,
                type: 'line',
                color: '#337ab7',
                smooth: true,//控制线条平滑
                symbol: 'circle',
                data: StorageY
            }]
        };
        storagechart.setOption(storagechartoption, true);
        //随屏幕大小自适应
        window.onresize = storagechart.resize;
    }

    //初始化
    var StorageX = [];
    var StorageY = [];
    var storageYAxis = '';

    function sendAjax(reValue) {
        $.get('/redisserverBack/monitor/getInstanceStatus', reValue, function (data) {
            var code = data.code;
            if (code === 0) {
                var res = data.resultBean;
                if (res != null && res != undefined) {
                    //初始加载
                    storageYAxis = res.keyStatusView.verticalDesc;
                    var storagedata = res.keyStatusView.redisStatuses;
                    for (var i = 0; i < storagedata.length; i++) {
                        StorageX[i] = storagedata[i].date;
                        StorageY[i] = storagedata[i].keyNum;
                    }

                    drawEchart(StorageX, storageYAxis, StorageY);
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
                swal('', data.result, 'error');
            }
        })
    }

    sendAjax(reValue);

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

            StorageX.splice(0, StorageX.length);
            StorageY.splice(0, StorageY.length);
            var params = {
                instanceID: id,
                startTimeStr: Date.parse(startTime),
                endTimeStr: Date.parse(getNextDay(endTime)),
                timeUnit: (result === 0 ? 1 : 2)
            };
            sendAjax(params);
        });
        //切换图表
        $(this).addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        StorageX.splice(0, StorageX.length);
        StorageY.splice(0, StorageY.length);
        var params = {
            instanceID: id,
            startTimeStr: Date.parse(currentDay),
            endTimeStr: Date.parse(getNextDay(currentDay)),
            timeUnit: 1
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

            StorageX.splice(0, StorageX.length);
            StorageY.splice(0, StorageY.length);
            var params = {
                instanceID: id,
                startTimeStr: Date.parse(startTime),
                endTimeStr: Date.parse(getNextDay(endTime)),
                timeUnit: (result === 0 ? 1 : 2)
            };
            sendAjax(params);
        });
        //切换图表
        $(this).addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        StorageX.splice(0, StorageX.length);
        StorageY.splice(0, StorageY.length);
        var params = {
            instanceID: id,
            startTimeStr: Date.parse(getDay(-5)),
            endTimeStr: Date.parse(getDay(1)),
            timeUnit: 2
        };
        sendAjax(params);
    });

    //点击本月
    $('#mouth').click(function () {
        // 实现与日期选择器的联动
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
            // 处理初始时间和截止时间
            var startTime = start.format('YYYY/MM/DD');
            var endTime = end.format('YYYY/MM/DD');
            var result = compareDate(startTime, endTime);

            StorageX.splice(0, StorageX.length);
            StorageY.splice(0, StorageY.length);
            var params = {
                instanceID: id,
                startTimeStr: Date.parse(startTime),
                endTimeStr: Date.parse(getNextDay(endTime)),
                timeUnit: (result === 0 ? 1 : 2)
            };
            sendAjax(params);
        });
        // 切换图表
        $(this).addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        StorageX.splice(0, StorageX.length);
        StorageY.splice(0, StorageY.length);
        var params = {
            instanceID: id,
            startTimeStr: Date.parse(getDay(-29)),
            endTimeStr: Date.parse(getDay(1)),
            timeUnit: 2
        };
        sendAjax(params);
    });
});
