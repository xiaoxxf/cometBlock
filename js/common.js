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
var WebApiHostJavaApi ="http://testapi.blockcomet.com/";

// var WebApiHostJavaApi = "http://10.0.0.183:8080/";


var WebRankHostApi = "//rank.blockcomet.com/"
function doRequest(apiHost, method, data, callback, contentType, showtips) {
    //GetCookiew
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
    $.removeCookie("wechatInfo");
    window.location.href = "login.html";
}

//头部尾部全局加载
$.get("footer-tpl.html",function(data){
    if ( window.location.pathname != '/cometBlock/article-new.html') {
      $(".block-comet-main-wrap").append(data);
    }
});
$.get("header-tpl.html",function(data){
    $(".navbar-fixed-container-hook").html(data);
    var href = location.href;
    $(".navbar-fixed-container-hook .navbar-left a").removeClass('cur-nav');
    //判断当前页面加cur-nav样式
   if(href.indexOf('news.html')>0 || href.indexOf('detail.html')>0){
       $(".navbar-fixed-container-hook .navbar-left .new-report").addClass('cur-nav');
   }
    if(href.indexOf('code-rank.html')>0){
        $(".navbar-fixed-container-hook .navbar-left .code-rank").addClass('cur-nav');
    }
    if(href.indexOf('index.html')>0 || href.indexOf('chain-detail.html')>0  || href.indexOf('comment.html')>0 ){
        $(".navbar-fixed-container-hook .navbar-left a").removeClass('cur-nav');
        $(".navbar-fixed-container-hook .navbar-left .chain").addClass('cur-nav');
    }
    //页面加载完成之后做账户信息处理
    var username = $.cookie('username');
    // 微信登陆后用户信息展示
    var wechatCode = getUrlParam('code');
    var localCookieWechatInfo = $.cookie('wechatInfo');
    if(wechatCode != null || localCookieWechatInfo != null){
        if(localCookieWechatInfo == null){
            var uri = '/news/getUserInfo?code='+wechatCode;
            doJavaGet(uri, function(res) {
                if(res.code === 0){
                    console.log(res)
                    //cookie保存微信登录标识，设置时效
                    $(".nav-user-account #nav_user_mes").text(res.datas.nickname);
                    $("#user_pic")[0].src = res.datas.headimgurl;
                    $(".nav-user-account .more-active").css('display','block');
                    $(".login-right").css('display','block');
                    var wechatInfo = JSON.stringify(res.datas);
                    var expireDate= new Date();
                    expireDate.setTime(expireDate.getTime() + (60*60* 1000 * 24 * 30));
                    $.cookie('wechatInfo', wechatInfo,{ expires: expireDate});
                    setTimeout(function () {
                        layer.open({
                            closeBtn:1,
                            title: '',
                            content: '登录成功，前去绑定开启更多权限',
                            btn: ['绑定'],
                            yes: function(){
                                window.location.href='bindUser.html'
                            }
                        });
                    },2000)
                }
            }, "json");
        }else{
            var JsonWechatInfo = JSON.parse(localCookieWechatInfo)
            $(".nav-user-account #nav_user_mes").text(JsonWechatInfo.nickname);
            $("#user_pic")[0].src = JsonWechatInfo.headimgurl;
            $(".nav-user-account .more-active").css('display','block');
            $(".login-right").css('display','block');
        }

    }else {
        var userinfo = JSON.parse(localStorage.getItem('userinfo'))
        if (username == undefined) {
            $("#nav_login").fadeIn();
            $("#nav_register").fadeIn();
            $(".scrollbar-container").fadeIn();
        } else {
            $(".nav-user-account #nav_user_mes").text(username);
            if (userinfo.userPic) {
                $("#user_pic")[0].src = userinfo.userPic
            } else {
                $("#user_pic")[0].src = 'img/normal-user.png'
            }
            $(".nav-user-account .more-active").css('display', 'block');
            $(".login-right").css('display', 'block');
        }
    }
});
$('.block-comet-main-wrap').on('click', '.nav-user-account .logout-btn',function () {
        Loginout();
})


$('.block-comet-main-wrap').on('click', '.nav-user-account .usercenter-btn',function () {
        window.location.href = "personalCenter.html?personType=1";
})
//通知鼠标悬停出现隐藏div

//微信登陆
$(document).on('click','.more-sign .wechat-login',function () {
    var uri = 'news/winxinCode' ;
    doJavaGet(uri, function(res) {
        var currentHref = window.location.href;
        currentHref.indexOf('login.html')>0 ? currentHref = window.location.origin : currentHref;
        //var currentHref = 'http://www.blockcomet.com';
        if(res.code === 0){
            var resData = res.datas;
            var jumpHref = resData.substr(0,resData.indexOf('#'))+'&redirect_uri='+encodeURIComponent(currentHref);
            window.location.href = jumpHref;
    }
    }, "json");
})
//微信注册
$(document).on('click','.more-sign .wechat-resgister',function () {
    var uri = 'news/winxinCode' ;
   var currentJumpHref = window.localStorage.getItem('currentJumpHref');
    if(currentJumpHref == undefined){
        currentJumpHref = window.location.origin;
    }
   //var currentJumpHref = 'http://www.blockcomet.com/comment.html?reviewId=04de1987-0147-41b6-b6ef-e33c6a67de3c&projectId=hx077';
    doJavaGet(uri, function(res) {
        if(res.code === 0){
            var resData = res.datas;
            var jumpHref = resData.substr(0,resData.indexOf('#'))+'&redirect_uri='+encodeURIComponent(currentJumpHref);
            window.location.href = jumpHref;
        }
    }, "json");
})
//页面中的注册跳转
$(document).on('click','#js-sign-up-btn',function () {
    var currentJumpHref = window.location.href;
    if(currentJumpHref.indexOf('register.html')>0 ){
        currentHref = window.location.host
    }else{
        window.location.href = 'register.html';
    }
    window.localStorage.setItem('currentJumpHref',currentJumpHref);
})

