/**
 * Created by shun.cao 2018/07/03
 * */
$(function () {
    //获取实例ID
    var url = window.location.href;
    var id = getQueryString(url).id;

    function getQueryString(str) {//解析URL
        var reg = /([^?&=#]+)=([^?&=#]+)/g;
        var obj = {};
        str.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    }

    var cpuChart = null;
    var memoryChart = null;

    //绘图
    function drawEchart(horizontal1, horizontal2, vertical1, vertical2, seriesName1, seriesName2) {
        //cpu usage
        cpuChart = echarts.init(document.getElementById("cpuShow"));
        var cpuOption = {
            title: {
                text: seriesName1
            },
            grid: {
                top: 30,
                left: 50,
                right: 20,
                bottom: 50
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
                    rotate: 40,//倾斜度 -90 至 90 默认为0
                    margin: 7,
                    textStyle: {
                        color: "#000000"
                    }
                },
                data: horizontal1
            }],
            yAxis: [{
                type: 'value',
                name: '',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: true
                }
            }],
            series: {
                name: seriesName1,
                type: 'line',
                color: 'green',
                smooth: true,//控制线条平滑
                symbol: 'circle',
                areaStyle: {//区域填充
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#15c95d'
                        }, {
                            offset: 1,
                            color: '#ffe'
                        }])
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#15c95d',
                        bordercolor: '#15c95d',
                        lineStyle: {}
                    }
                },
                data: vertical1
            }
        };
        cpuChart.setOption(cpuOption, true);
        //memory usage
        memoryChart = echarts.init(document.getElementById("memoryShow"));
        var memoryOption = {
            title: {
                text: seriesName2
            },
            grid: {
                top: 30,
                left: 50,
                right: 20,
                bottom: 50
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
                    rotate: 40,//倾斜度 -90 至 90 默认为0
                    margin: 7,
                    textStyle: {
                        color: "#000000"
                    }
                },
                data: horizontal2
            }],
            yAxis: [{
                type: 'value',
                name: '',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: true
                }
            }],
            series: {
                name: seriesName2,
                type: 'line',
                color: 'green',
                smooth: true,//控制线条平滑
                symbol: 'circle',
                areaStyle: {//区域填充
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#316de6'
                        }, {
                            offset: 1,
                            color: '#ffe'
                        }])
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#316de6',
                        bordercolor: '#316de6',
                        lineStyle: {}
                    }
                },
                data: vertical2
            }
        };
        memoryChart.setOption(memoryOption, true);
    }

    window.addEventListener('resize', function () {
        if (memoryChart) {
            memoryChart.resize();
        }
        if (cpuChart) {
            cpuChart.resize();
        }
    });

    //初始化
    var horizontal1 = [];
    var horizontal2 = [];
    var vertical1 = [];
    var vertical2 = [];
    var seriesName1 = '';
    var seriesName2 = '';

    function sendAjax(reValue) {
        horizontal1 = [];
        horizontal2 = [];
        vertical1 = [];
        vertical2 = [];
        seriesName1 = '';
        seriesName2 = '';
        $.get('/sprayBack/appmgr/searchPodInfo', reValue, function (data) {
            var code = data.code;
            if (code === 0) {
                var res = data.resultBean;
                if (res != null && res != undefined) {
                    //cpu usage
                    var cpuUsageTable = res.cpuUsageTable;
                    if (cpuUsageTable != null && cpuUsageTable != undefined) {
                        seriesName1 = cpuUsageTable.verticalDesc;
                        var tableIssues = cpuUsageTable.tableIssues;
                        for (var i = 0; i < tableIssues.length; i++) {
                            horizontal1[i] = tableIssues[i].horizontal;
                            vertical1[i] = tableIssues[i].vertical;
                        }
                    }
                    //memory usage
                    var memoryUsageTable = res.memoryUsageTable;
                    if (memoryUsageTable != null && memoryUsageTable != undefined) {
                        seriesName2 = memoryUsageTable.verticalDesc;
                        var tableIssues = memoryUsageTable.tableIssues;
                        for (var j = 0; j < tableIssues.length; j++) {
                            horizontal2[j] = tableIssues[j].horizontal;
                            vertical2[j] = tableIssues[j].vertical;
                        }
                    }

                    drawEchart(horizontal1, horizontal2, vertical1, vertical2, seriesName1, seriesName2);
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
        })
    }

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

    var reValue = {
        applicationID: id,
        startTime: Date.parse(currentDay),
        endTime: Date.parse(getNextDay(currentDay)),
        timeUnit: 1,
        interval: 2
    };

    sendAjax(reValue);
});