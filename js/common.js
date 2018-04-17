function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '' + s4() + '' + s4() + '' +
        s4() + '' + s4() + s4() + s4();
}
//依赖全局WebApiHost参数
var WebApiToken;
//var WebApiHost="http://localhost:2579/";
// var WebApiHost="http://221.209.110.28:5700/";
var WebApiHost="https://api.blockcomet.com/";
//var WebApiHostJavaApi = "http://backend.blockcomet.com/";
// var WebApiHostJavaApi ="http://testapi.blockcomet.com/";


var WebApiHostJavaApi = "http://10.0.0.178:8080/";


var WebRankHostApi = "//rank.blockcomet.com/"
function doRequest(apiHost, method, data, callback, contentType, showtips) {
    //GetCookie
    if (!WebApiToken) {
        var cookies = document.cookie.split('; ');
        for (var i = 0, parts; (parts = cookies[i] && cookies[i].split('=')); i++) {
            if (parts.shift() === 'token') {
                WebApiToken = parts.join('=');
            }
        }
    }
    var requestType = 'application/x-www-form-urlencoded';
    if (contentType && contentType === 'json') {
        requestType = 'application/json;charset=UTF-8';
    }

    $.ajax({
        type: method,
        url: apiHost,
        headers: {
            token: decodeURIComponent(WebApiToken),
            "request-id": guid() + new Date().getTime()
        },
        data: data,
        contentType: requestType,
        dataType:contentType,
        //xhrFields: {
        //    withCredentials: true
        //},
        //crossDomain: true,
        success: function (data) {
            callback(data);
        },
        error: function (err) {
            //$.dialog.tips("Request Error!");
        }
    });
}

function doGet(baseUrl, callback, showtips) {
    var requestUri = WebApiHost +"v0" + baseUrl;
    doRequest(requestUri, "GET", null, callback);
}
function doRankGet(baseUrl, callback, dataType) {
    var requestUri = WebRankHostApi + baseUrl;
    doRequest(requestUri, "GET", null, callback, dataType);
}
function doJavaGet(baseUrl, callback, showtips) {
    var requestUri = WebApiHostJavaApi + baseUrl;
    doRequest(requestUri, "GET", '', callback);
}
function doPostJavaApi(baseUrl, data, callback, contentType, showtips) {
    var requestUri = WebApiHostJavaApi + baseUrl;
    doRequest(requestUri, "POST", data, callback, contentType);
}


function doPost(baseUrl, data, callback, contentType, showtips) {
    var requestUri = WebApiHost + "v0" + baseUrl;
    doRequest(requestUri, "POST", data, callback, contentType);
}

function doPut(baseUrl, data, callback, contentType, showtips) {
    var requestUri = WebApiHost + "v0" + baseUrl;
    doRequest(requestUri, "PUT", data, callback, contentType);
}

function doDelete(baseUrl, data, callback, contentType, showtips) {
    var requestUri = WebApiHost + "v0" + baseUrl;
    doRequest(requestUri, "Delete", data, callback, contentType);
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; //返回参数值
}

//退出登录
function Loginout(){
    localStorage.clear();
    $.removeCookie("token");
    $.removeCookie("userid");
    $.removeCookie("username");
    window.location.href = "login.html";
}

//头部尾部全局加载
$.get("footer-tpl.html",function(data){
    $(".block-comet-main-wrap").append(data);
});
$.get("header-tpl.html",function(data){
    $(".navbar-fixed-container-hook").html(data);
    var href = location.href;
    $(".navbar-fixed-container-hook .navbar-left a").removeClass('cur-nav');
    //判断当前页面加cur-nav样式
   if(href.indexOf('index.html')>0 || href.indexOf('detail.html')>0){
       $(".navbar-fixed-container-hook .navbar-left .new-report").addClass('cur-nav');
   }
    if(href.indexOf('code-rank.html')>0){
        $(".navbar-fixed-container-hook .navbar-left .code-rank").addClass('cur-nav');
    }
    if(href.indexOf('chain.html')>0 || href.indexOf('chain-detail.html')>0  || href.indexOf('comment.html')>0 ){
        $(".navbar-fixed-container-hook .navbar-left a").removeClass('cur-nav');
        $(".navbar-fixed-container-hook .navbar-left .chain").addClass('cur-nav');
    }
    //页面加载完成之后做账户信息处理
    var username = $.cookie('username');
    if(username == undefined){
        $("#nav_login").fadeIn();
        $("#nav_register").fadeIn()
    }else {
        $(".nav-user-account #nav_user_mes").text(username);
        $(".nav-user-account .more-active").css('display','block');
    }
});
$('.block-comet-main-wrap').on('click', '.nav-user-account .logout-btn',function () {
        Loginout();
})


$('.block-comet-main-wrap').on('click', '.nav-user-account .usercenter-btn',function () {
        window.location.href = "personalCenter.html?personType=1";
})
