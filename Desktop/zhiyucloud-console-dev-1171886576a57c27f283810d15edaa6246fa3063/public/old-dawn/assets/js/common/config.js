/**
 * Created by shun.cao 2018/02/05
 * */
function getQueryString(str) {//解析URL
    var reg = /([^?&=#]+)=([^?&=#]+)/g;
    var obj = {};
    str.replace(reg, function () {
        obj[arguments[1]] = arguments[2];
    });
    return obj;
}

function getFileSuffix(filename) {
    return filename.substring(filename.lastIndexOf('.') + 1).toUpperCase();
}

// bytes字符转换
function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';

    var k = 1024;

    var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toFixed(0) + ' ' + sizes[i];
}
