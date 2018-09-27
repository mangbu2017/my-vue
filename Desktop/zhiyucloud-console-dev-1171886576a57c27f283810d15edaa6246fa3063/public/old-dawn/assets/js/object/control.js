/**
 * Created by shun.cao 2018/06/07
 * */
$(function () {
    //获取实例ID
    var url = window.location.href;
    var bucketName = getQueryString(url).bucketName;

    $('#detail').attr('href', 'file.html?bucketName=' + bucketName);

    //当前时间
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = (myDate.getMonth() + 1) < 10 ? ('0' + (myDate.getMonth() + 1)) : (myDate.getMonth() + 1);
    var day = myDate.getDate() < 10 ? ('0' + myDate.getDate()) : myDate.getDate();
    var currentDay = year + '-' + month + '-' + day;

    function getNextDay(day) {
        day = new Date(day);
        day = +day + 1000 * 60 * 60 * 24;
        day = new Date(day);
        var mon = (day.getMonth() + 1) < 10 ? ('0' + (day.getMonth() + 1)) : (day.getMonth() + 1);
        var days = day.getDate() < 10 ? ('0' + day.getDate()) : day.getDate();
        return day.getFullYear() + "-" + mon + "-" + days;
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
        return tYear + "-" + tMonth + "-" + tDate;
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
        bucketName: bucketName,
        startTime: currentDay + ' 00:00:00',
        endTime: getNextDay(currentDay) + ' 00:00:00',
        timeUnit: 0,
        interval: 1
    };

    //日期配置选项
    var beginTimeStore = '';
    var endTimeStore = '';
    $('#configData').daterangepicker({
            "startDate": moment().subtract(0, 'days'),
            "autoUpdateInput": true,
            "maxDate": moment(),
            "locale": {
                format: 'YYYY-MM-DD',
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
            var startTime = start.format('YYYY-MM-DD');
            var endTime = end.format('YYYY-MM-DD');

            var result = compareDate(startTime, endTime);

            StorageX.splice(0, StorageX.length);
            StorageY.splice(0, StorageY.length);
            VisitX.splice(0, VisitX.length);
            VisitY.splice(0, VisitY.length);
            RequestX.splice(0, RequestX.length);
            RequestY.splice(0, RequestY.length);
            var params = {
                bucketName: bucketName,
                startTime: startTime + ' 00:00:00',
                endTime: getNextDay(endTime) + ' 00:00:00',
                timeUnit: (result === 0 ? 0 : 2),
                interval: 1
            };
            sendAjax(params);
        });

    //随屏幕大小自适应
    var storagechart, visitchart, requestchart;

    // 封装画图函数
    function bindchart(StorageX, YAxisStorage, StorageY, VisitX, YAxisVisit, VisitY, RequestX, YAxisRequest, RequestY) {
        storagechart = echarts.init(document.getElementById("storagedisplay"));
        var storagechartoption = {
            title: {
                text: '',
                left: ''
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
                name: YAxisStorage,
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: true
                }
            }],
            series: [{
                name: '存储量',
                type: 'line',
                color: 'green',
                symbol: 'circle',
                smooth: true,//控制线条平滑
                data: StorageY
            }]
        };
        storagechart.setOption(storagechartoption, true);

        visitchart = echarts.init(document.getElementById("visitdisplay"));
        var visitchartoption = {
            title: {
                text: '',
                left: ''
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
                boundaryGap: false,
                name: '',
                aplitLine: {
                    show: true
                },
                axisLabel: {
                    interval: 0,
                    rotate: 60,//倾斜度 -90 至 90 默认为0
                    margin: 7,
                    textStyle: {
                        color: "#000000"
                    }
                },
                data: VisitX
            }],
            yAxis: [{
                type: 'value',
                name: YAxisVisit,
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: true
                }
            }],
            series: [{
                name: '访问量',
                type: 'line',
                color: 'green',
                symbol: 'circle',
                smooth: true,//控制线条平滑
                data: VisitY
            }]
        };
        visitchart.setOption(visitchartoption, true);

        requestchart = echarts.init(document.getElementById("requestdisplay"));
        var requestchartoption = {
            title: {
                text: '',
                left: ''
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
                boundaryGap: false,
                name: '',
                aplitLine: {
                    show: true
                },
                axisLabel: {
                    interval: 0,
                    rotate: 60,//倾斜度 -90 至 90 默认为0
                    margin: 7,
                    textStyle: {
                        color: "#000000"
                    }
                },
                data: RequestX
            }],
            yAxis: [{
                type: 'value',
                minInterval: 1,
                axisLabel: {
                    interval: 1,
                    splitNumber: 5
                },
                name: YAxisRequest,
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: true
                }
            }],
            series: [{
                name: '请求量',
                type: 'line',
                color: 'green',
                symbol: 'circle',
                smooth: true,//控制线条平滑
                data: RequestY
            }]
        };
        requestchart.setOption(requestchartoption, true);
    }

    window.addEventListener('resize', function () {
        if (storagechart) {
            storagechart.resize();
        }
    });
    window.addEventListener('resize', function () {
        if (visitchart) {
            visitchart.resize();
        }
    });
    window.addEventListener('resize', function () {
        if (requestchart) {
            requestchart.resize();
        }
    });

    //显示顶部值
    var threeData = [];
    //初始化
    var StorageX = [];
    var StorageY = [];
    var VisitX = [];
    var VisitY = [];
    var RequestX = [];
    var RequestY = [];
    var storageYAxis = '';
    var visitYAxis = '';
    var requestYAxis = '';

    function sendAjax(reValue) {
        //显示顶部值
        threeData = [];
        //初始化
        StorageX = [];
        StorageY = [];
        VisitX = [];
        VisitY = [];
        RequestX = [];
        RequestY = [];
        storageYAxis = '';
        visitYAxis = '';
        requestYAxis = '';
        $.get('/dawnBack/monitor/searchbucketinfo', reValue, function (data) {
            var code = data.code;
            if (code === 0) {
                var res = data.resultBean;
                if (res != null && res != undefined) {
                    //顶部数据渲染
                    threeData[0] = data.resultBean.storageCapacity;
                    threeData[1] = data.resultBean.downstream;
                    threeData[2] = data.resultBean.requestQuantity;
                    $('#storageValue').html(threeData[0]);
                    $('#visitValue').html(threeData[1]);
                    $('#requestValue').html(threeData[2]);
                    //初始加载
                    storageYAxis = data.resultBean.storageCapacityTable.verticalDesc;
                    visitYAxis = data.resultBean.downstreamTable.verticalDesc;
                    requestYAxis = data.resultBean.requestQuantityTable.verticalDesc;
                    var storagedata = data.resultBean.storageCapacityTable.tableIssues;
                    var visitdata = data.resultBean.downstreamTable.tableIssues;
                    var requestdata = data.resultBean.requestQuantityTable.tableIssues;
                    var storagedatanum = data.resultBean.storageCapacityTable.tableIssues.length;
                    var visitdatanum = data.resultBean.downstreamTable.tableIssues.length;
                    var requestdatanum = data.resultBean.requestQuantityTable.tableIssues.length;
                    for (var i = 0; i < storagedatanum; i++) {
                        StorageX[i] = storagedata[i].horizontal;
                        StorageY[i] = storagedata[i].vertical;
                    }
                    for (var i = 0; i < visitdatanum; i++) {
                        VisitX[i] = visitdata[i].horizontal;
                        VisitY[i] = visitdata[i].vertical;
                    }
                    for (var i = 0; i < requestdatanum; i++) {
                        RequestX[i] = requestdata[i].horizontal;
                        RequestY[i] = requestdata[i].vertical;
                    }

                    bindchart(StorageX, storageYAxis, StorageY, VisitX, visitYAxis, VisitY, RequestX, requestYAxis, RequestY);
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
                format: 'YYYY-MM-DD',
                applyLabel: "确定",
                cancelLabel: "取消",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        }, function (start, end) {
            $('.btn-group .btn').addClass('btn-default').removeClass('btn-primary');
            //处理初始时间和截止时间
            var startTime = start.format('YYYY-MM-DD');
            var endTime = end.format('YYYY-MM-DD');
            var result = compareDate(startTime, endTime);

            StorageX.splice(0, StorageX.length);
            StorageY.splice(0, StorageY.length);
            VisitX.splice(0, VisitX.length);
            VisitY.splice(0, VisitY.length);
            RequestX.splice(0, RequestX.length);
            RequestY.splice(0, RequestY.length);
            var params = {
                bucketName: bucketName,
                startTime: startTime + ' 00:00:00',
                endTime: getNextDay(endTime) + ' 00:00:00',
                timeUnit: (result === 0 ? 0 : 2),
                interval: 1
            };
            sendAjax(params);
        });
        //切换图表
        $(this).addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        StorageX.splice(0, StorageX.length);
        StorageY.splice(0, StorageY.length);
        VisitX.splice(0, VisitX.length);
        VisitY.splice(0, VisitY.length);
        RequestX.splice(0, RequestX.length);
        RequestY.splice(0, RequestY.length);
        var params = {
            bucketName: bucketName,
            startTime: currentDay + ' 00:00:00',
            endTime: getNextDay(currentDay) + ' 00:00:00',
            timeUnit: 0,
            interval: 1
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
                format: 'YYYY-MM-DD',
                applyLabel: "确定",
                cancelLabel: "取消",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        }, function (start, end) {
            $('.btn-group .btn').addClass('btn-default').removeClass('btn-primary');
            //处理初始时间和截止时间
            var startTime = start.format('YYYY-MM-DD');
            var endTime = end.format('YYYY-MM-DD');
            var result = compareDate(startTime, endTime);

            StorageX.splice(0, StorageX.length);
            StorageY.splice(0, StorageY.length);
            VisitX.splice(0, VisitX.length);
            VisitY.splice(0, VisitY.length);
            RequestX.splice(0, RequestX.length);
            RequestY.splice(0, RequestY.length);
            var params = {
                bucketName: bucketName,
                startTime: startTime + ' 00:00:00',
                endTime: getNextDay(endTime) + ' 00:00:00',
                timeUnit: (result === 0 ? 0 : 2),
                interval: 1
            };
            sendAjax(params);
        });
        //切换图表
        $(this).addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        StorageX.splice(0, StorageX.length);
        StorageY.splice(0, StorageY.length);
        VisitX.splice(0, VisitX.length);
        VisitY.splice(0, VisitY.length);
        RequestX.splice(0, RequestX.length);
        RequestY.splice(0, RequestY.length);

        var params = {
            bucketName: bucketName,
            startTime: getDay(-5) + ' 00:00:00',
            endTime: getDay(1) + ' 00:00:00',
            timeUnit: 2,
            interval: 1
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
                format: 'YYYY-MM-DD',
                applyLabel: "确定",
                cancelLabel: "取消",
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        }, function (start, end) {
            $('.btn-group .btn').addClass('btn-default').removeClass('btn-primary');
            //处理初始时间和截止时间
            var startTime = start.format('YYYY-MM-DD');
            var endTime = end.format('YYYY-MM-DD');
            var result = compareDate(startTime, endTime);

            StorageX.splice(0, StorageX.length);
            StorageY.splice(0, StorageY.length);
            VisitX.splice(0, VisitX.length);
            VisitY.splice(0, VisitY.length);
            RequestX.splice(0, RequestX.length);
            RequestY.splice(0, RequestY.length);
            var params = {
                bucketName: bucketName,
                startTime: startTime + ' 00:00:00',
                endTime: getNextDay(endTime) + ' 00:00:00',
                timeUnit: (result === 0 ? 0 : 2),
                interval: 1
            };
            sendAjax(params);
        });
        //切换图表
        $(this).addClass('btn-primary').removeClass('btn-default').siblings().removeClass('btn-primary').addClass('btn-default');
        StorageX.splice(0, StorageX.length);
        StorageY.splice(0, StorageY.length);
        VisitX.splice(0, VisitX.length);
        VisitY.splice(0, VisitY.length);
        RequestX.splice(0, RequestX.length);
        RequestY.splice(0, RequestY.length);

        var params = {
            bucketName: bucketName,
            startTime: getDay(-29) + ' 00:00:00',
            endTime: getDay(1) + ' 00:00:00',
            timeUnit: 2,
            interval: 1
        };
        sendAjax(params);
    });
});