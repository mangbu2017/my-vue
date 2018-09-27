$(function () {
    var url = window.location.href;
    var instanceID = getQueryString(url).id;

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

    // 日期显示配置项
    var options = {
        "startDate": moment().subtract(0, 'days'),
        "showDropdowns": true,
        "autoUpdateInput": true,
        "maxDate": moment(),
        "locale": {
            format: 'YYYY/MM/DD',
            applyLabel: "确定",
            cancelLabel: "取消",
            daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
            monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        }
    };
    $('#datarange').daterangepicker(options, function (start, end, label) {
        $('.btn-group .btn').addClass('btn-default').removeClass('btn-primary');
        if (!this.startDate) {
            this.element.val('');
        } else {
            this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
        }
        // 处理初始时间和截止时间
        var selectstartTime = start.format('YYYY-MM-DD') + " 00:00:00";
        var selectendTime = end.format('YYYY-MM-DD') + " 00:00:00";
        var infotype = Number($('.config-active').attr('index'));
        var result = compareDate(selectstartTime, selectendTime);

        verticaldata.splice(0, verticaldata.length);
        horizontaldata.splice(0, horizontaldata.length);

        var params = {
            instanceID: instanceID,
            startTime: Date.parse(selectstartTime),
            endTime: Date.parse(getNextDay(selectendTime)),
            timeUnit: (result === 0 ? 1 : 2),
            interval: 1,
            infoType: infotype
        };
        sendAjax(params);
    });
    // 时间预处理
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    if (month < 10) {
        month = '0' + (myDate.getMonth() + 1);
    }
    var day = myDate.getDate();
    if (day < 10) {
        day = '0' + myDate.getDate();
    }
    var tomorrow = myDate.getDate();
    if (tomorrow < 9) {
        tomorrow = '0' + (myDate.getDate() + 1);
    } else {
        tomorrow = myDate.getDate() + 1;
    }

    var hour = myDate.getHours();
    if (hour < 10) {
        hour = '0' + myDate.getHours();
    }
    var minute = myDate.getMinutes();
    if (minute < 10) {
        minute = '0' + myDate.getMinutes();
    }
    var second = myDate.getSeconds();
    if (second < 10) {
        second = '0' + myDate.getSeconds();
    }
    var todaystartTime = myDate.getFullYear() + '-' + month + '-' + day + ' 00:00:00';//暂时写死'2018-04-13 00:00:00'
    // var todayendTime = myDate.getFullYear()+'-'+month+'-'+day+' '+hour+":"+minute+":"+second;
    var todayendTime = myDate.getFullYear() + '-' + month + '-' + tomorrow + ' 00:00:00';//到明天

    // 获得下一天
    function getNextDay(day) {
        day = new Date(day);
        day = +day + 1000 * 60 * 60 * 24;
        day = new Date(day);
        var mon = (day.getMonth() + 1) < 10 ? ('0' + (day.getMonth() + 1)) : (day.getMonth() + 1);
        var days = day.getDate() < 10 ? ('0' + day.getDate()) : day.getDate();
        return day.getFullYear() + "-" + mon + "-" + days;
    }

    // 获取时间最近几天
    function getDay(day) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;//当前时间加上多少天
        today.setTime(targetday_milliseconds); //注意，这行是关键代码

        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = doHandle(tMonth + 1);
        tDate = doHandle(tDate);
        return tYear + "-" + tMonth + "-" + tDate;
    }

    function doHandle(time) {
        var m = time;
        if (time.toString().length == 1) {
            m = "0" + time;
        }
        return m;
    }

    // 日期大小比较
    function compareDate(startDate, endDate) {
        var sDate = new Date(startDate.replace(/\//g, "\/"));
        var eDate = new Date(endDate.replace(/\//g, "\/"));
        return eDate - sDate;
    }

    var thisweekstartTime = getDay(-6) + ' 00:00:00';
    var thisweekendTime = getDay(0) + ' 00:00:00';
    var thismonthstartTime = getDay(-29) + ' 00:00:00';
    var thismonthendTime = getDay(0) + ' 00:00:00';

    // 数据指标预处理
    var infotype = Number($('.config-active').attr('index'));

    // 页面初始加载
    var verticaldata = [];
    var horizontaldata = [];
    var verticalunit = "";
    var params = {
        instanceID: instanceID,
        startTime: Date.parse(todaystartTime),
        endTime: Date.parse(todayendTime),
        timeUnit: 1,
        interval: 1,
        infoType: infotype
    }
    sendAjax(params);

    function sendAjax(params) {
        verticaldata = [];
        horizontaldata = [];
        verticalunit = "";
        $.ajax({
            type: "get",
            url:  '/echinusBack/monitor/getInstanceStatus',
            data: params,
            dataType: 'json',
            async: false,
            crossDomain: true,
            success: function (data) {
                if (data.code === 0) {
                    var res = data.resultBean;
                    verticalunit = res.verticalDesc;
                    for (var i = 0; i < res.tableIssues.length; i++) {
                        verticaldata[i] = res.tableIssues[i].vertical;
                        horizontaldata[i] = res.tableIssues[i].horizontal;
                    }
                    bindchart(verticalunit, horizontaldata, verticaldata);
                } else if (data.code === 13) {
                    swal({
                        title: '',
                        text: data.msg,
                        type: 'success',
                        confirmButtonText: '确定'
                    }, function () {
                        window.location.href =  "/login";
                    });
                } else {
                    sweetAlert("", data.msg, "error");
                }
            }
        })
    }

    $("#today").click(function () {
        //实现与日期选择器的联动
        $('#datarange').daterangepicker({
            "startDate": moment().subtract(0, 'days'),
            "endDate": moment().subtract(0, 'days'),
            "autoUpdateInput": true,
            "maxDate": moment(),
            "locale": {
                format: 'YYYY-MM-DD',
                applyLabel: "确定",
                cancelLabel: "取消",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        }, function (start, end, label) {
            $('.btn-group button').addClass('btn-default').removeClass('btn-primary');
            //处理初始时间和截止时间
            var startTime = start.format('YYYY-MM-DD') + " 00:00:00";
            var endTime = end.format('YYYY-MM-DD') + " 00:00:00";
            var infotype = Number($('.config-active').attr('index'));
            var result = compareDate(startTime, endTime);

            verticaldata.splice(0, verticaldata.length);
            horizontaldata.splice(0, horizontaldata.length);

            var params = {
                instanceID: instanceID,
                startTime: Date.parse(startTime),
                endTime: Date.parse(getNextDay(endTime)),
                timeUnit: (result === 0 ? 1 : 2),
                interval: 1,
                infoType: infotype
            };
            sendAjax(params);
        })
        // 切换图表
        $(this).addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        var infotype = Number($('.config-active').attr('index'));

        verticaldata.splice(0, verticaldata.length);
        horizontaldata.splice(0, horizontaldata.length);

        var params = {
            instanceID: instanceID,
            startTime: Date.parse(todaystartTime),
            endTime: Date.parse(todayendTime),
            timeUnit: 1,
            interval: 1,
            infoType: infotype
        };
        sendAjax(params);
    })
    $("#thisweek").click(function () {
        // 实现与日期选择器的联动
        $('#datarange').daterangepicker({
            "startDate": moment().subtract(6, 'days'),
            "endDate": moment().subtract(0, 'days'),
            "autoUpdateInput": true,
            "maxDate": moment(),
            "locale": {
                format: 'YYYY-MM-DD',
                applyLabel: "确定",
                cancelLabel: "取消",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        }, function (start, end) {
            $('.btn-group button').addClass('btn-default').removeClass('btn-primary');
            // 处理初始时间和截止时间
            var startTime = start.format('YYYY-MM-DD');
            var endTime = end.format('YYYY-MM-DD');
            var infotype = Number($('.config-active').attr('index'));
            var result = compareDate(startTime, endTime);

            verticaldata.splice(0, verticaldata.length);
            horizontaldata.splice(0, horizontaldata.length);

            var params = {
                instanceID: instanceID,
                startTime: Date.parse(startTime),
                endTime: Date.parse(getNextDay(endTime)),
                timeUnit: (result === 0 ? 1 : 2),
                interval: 1,
                infoType: infotype
            };
            sendAjax(params);
        });
        // 切换图表
        $(this).addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        verticaldata.splice(0, verticaldata.length);
        horizontaldata.splice(0, horizontaldata.length);
        var infotype = Number($('.config-active').attr('index'));

        var params = {
            instanceID: instanceID,
            startTime: Date.parse(thisweekstartTime),
            endTime: Date.parse(thisweekendTime),
            timeUnit: 2,
            interval: 1,
            infoType: infotype
        };
        sendAjax(params);
    })
    $("#thismonth").click(function () {
        // 实现与日期选择器的联动
        $('#datarange').daterangepicker({
            "startDate": moment().subtract(30, 'days'),
            "endDate": moment().subtract(0, 'days'),
            "autoUpdateInput": true,
            "maxDate": moment(),
            "locale": {
                format: 'YYYY-MM-DD',
                applyLabel: "确定",
                cancelLabel: "取消",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        }, function (start, end) {
            $('.btn-group button').addClass('btn-default').removeClass('btn-primary');
            // 处理初始时间和截止时间
            var startTime = start.format('YYYY-MM-DD');
            var endTime = end.format('YYYY-MM-DD');
            var infotype = Number($('.config-active').attr('index'));
            var result = compareDate(startTime, endTime);

            verticaldata.splice(0, verticaldata.length);
            horizontaldata.splice(0, horizontaldata.length);

            var params = {
                instanceID: instanceID,
                startTime: Date.parse(startTime),
                endTime: Date.parse(getNextDay(endTime)),
                timeUnit: (result === 0 ? 1 : 2),
                interval: 1,
                infoType: infotype
            };
            sendAjax(params);
        });
        // 切换图表
        $(this).addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        verticaldata.splice(0, verticaldata.length);
        horizontaldata.splice(0, horizontaldata.length);
        var infotype = Number($('.config-active').attr('index'));

        var params = {
            instanceID: instanceID,
            startTime: Date.parse(thismonthstartTime),
            endTime: Date.parse(thismonthendTime),
            timeUnit: 2,
            interval: 1,
            infoType: infotype
        };
        sendAjax(params);
    })

    // 点击数量指标--全部显示今天
    $('.basic-config ul li').click(function () {
        $(this).addClass('config-active').siblings().removeClass('config-active');
        var infoType = Number($(this).attr('index'));
        //切换图表
        $('#today').addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        var params = {
            instanceID: instanceID,
            startTime: Date.parse(todaystartTime),
            endTime: Date.parse(todayendTime),
            timeUnit: 1,
            interval: 1,
            infoType: infoType
        };

        sendAjax(params);

        // 实现与日期选择器的联动
        $('#datarange').daterangepicker({
            "startDate": moment().subtract(0, 'days'),
            "endDate": moment().subtract(0, 'days'),
            "autoUpdateInput": true,
            "maxDate": moment(),
            "locale": {
                format: 'YYYY-MM-DD',
                applyLabel: "确定",
                cancelLabel: "取消",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        }, function (start, end) {
            // 处理初始时间和截止时间
            var startTime = start.format('YYYY-MM-DD');
            var endTime = end.format('YYYY-MM-DD');
            var infoType = Number($('.config-active').attr('index'));
            var result = compareDate(startTime, endTime);

            verticaldata.splice(0, verticaldata.length);
            horizontaldata.splice(0, horizontaldata.length);
            var params = {
                instanceID: instanceID,
                startTime: Date.parse(startTime),
                endTime: Date.parse(getNextDay(endTime)),
                timeUnit: (result === 0 ? 1 : 2),
                interval: 1,
                infoType: infoType
            };
            sendAjax(params);
        });
    })

    function bindchart(verticalunit, horizontaldata, verticaldata) {
        var chartdisplay = echarts.init(document.getElementById("chartdisplay"));
        var option = {
            title: {
                text: '',
                left: ''
            },
            grid: {
                top: 50,
                left: 50,
                right: 30,
                bottom: 50,
            },
            tooltip: {
                trigger: 'axis',
                // formatter: function (params) {
                //
                // },
                axisPointer: {
                    animation: false
                }
            },
            legend: {
                // data: ['存储量'],
            },
            xAxis: [{
                type: 'category',
                name: '',
                boundaryGap: 0,
                axisLabel: {
                    interval: 0,
                    rotate: 45,//倾斜度 -90 至 90 默认为0
                    margin: 7,
                    textStyle: {
                        color: "#000000"
                    }
                },
                data: horizontaldata//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            }],
            yAxis: [{
                type: 'value',
                name: verticalunit,
                boundaryGap: [0, '100%'],
                splitLine: {//横向轴刻度线，只有是数值的时候有效
                    lineStyle: {
                        type: 'dashed'
                    }
                },
            }],
            series: [{
                color: '#337ab7',
                type: 'line',
                smooth: true,//控制线条平滑
                symbol: 'circle',//圆点形状
                data: verticaldata//[820, 932, 901, 934, 1290, 1330, 1320],
            }]
        };
        chartdisplay.setOption(option);
    }
})