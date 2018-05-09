var username = $.cookie('username');
var userId = $.cookie('userid');//获取userid
var userinfo = JSON.parse(localStorage.getItem('userinfo'))
var wechatInfo = $.cookie('wechatInfo') ? JSON.parse($.cookie('wechatInfo')) : '';

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

// var WebApiHostJavaApi = "http://10.0.0.186:8080/";


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
    if(href.indexOf('index.html')>0 || href.indexOf('comment.html')>0 ){
        $(".navbar-fixed-container-hook .navbar-left a").removeClass('cur-nav');
        $(".navbar-fixed-container-hook .navbar-left .index").addClass('cur-nav');
    }

    if (href.indexOf('chain.html')>0 || href.indexOf('chain-detail.html')>0 || href.indexOf('comment.html')>0 ) {
      $(".navbar-fixed-container-hook .navbar-left a").removeClass('cur-nav');
      $(".navbar-fixed-container-hook .navbar-left .chain-category").addClass('cur-nav');
    }

    if (href.indexOf('attention.html')>0) {
      $(".navbar-fixed-container-hook .navbar-left a").removeClass('cur-nav');
      $(".navbar-fixed-container-hook .navbar-left .attetion-category").addClass('cur-nav');
    }

    //页面加载完成之后做账户信息处理
    // var username = $.cookie('username');
    // var userid = $.cookie('userid');
    // var userinfo = JSON.parse(localStorage.getItem('userinfo'))
    // 微信登陆后用户信息展示

    var wechatCode = getUrlParam('code');
    var localCookieWechatInfo = $.cookie('wechatInfo');
    var wechatInfo_flag = false; // 是否已取得微信返回数据
    localCookieWechatInfo = localCookieWechatInfo == undefined ? localCookieWechatInfo : JSON.parse(localCookieWechatInfo);

    // 没有登录时，显示注册/登录
    if (!username && !wechatCode && !localCookieWechatInfo ) {
      $("#nav_login").fadeIn();
      $("#nav_register").fadeIn();
      $(".scrollbar-container").fadeIn();
    }
    // 微信登录
    else if(wechatCode && !wechatInfo_flag){
      // 取得返回信息
      getUserInfoByWeChat();
    }
    // 微信登录后，已取得返回数据，但没有绑定的
    else if(localCookieWechatInfo && wechatInfo_flag){
      var wechatInfo_data = $.cookie('wechatInfo') ? JSON.parse($.cookie('wechatInfo')) : '';

      // 显示头像，没有则显示默认头像
      if (userinfo.userPic && $("#user_pic")[0]) {
          $("#user_pic")[0].src = wechatInfo_data.userPic
      } else if(!wechatInfo_data.userPic && $("#user_pic")[0]){
          $("#user_pic")[0].src = 'img/normal-user.png'
      }
      $(".nav-user-account .more-active").css('display', 'block');
      $(".login-right").css('display', 'block');
    }
    // 账号登录 或 微信登录后已绑定的
    else if(userId){
      userinfo = JSON.parse(localStorage.getItem('userinfo'))
      $(".nav-user-account #nav_user_mes").text(username);

      // 显示头像，没有则显示默认头像
      if (userinfo.userPic && $("#user_pic")[0]) {
          $("#user_pic")[0].src = userinfo.userPic
      } else if(!userinfo.userPic && $("#user_pic")[0]){
          $("#user_pic")[0].src = 'img/normal-user.png'
      }
      $(".nav-user-account .more-active").css('display', 'block');
      $(".login-right").css('display', 'block');

    }

});

// 微信登录后取得返回信息
function getUserInfoByWeChat(wechatCode){
  var wechatCode = getUrlParam('code');
  var uri = '/news/getUserInfo?code='+ wechatCode;
  doJavaGet(uri, function(res) {
      if(res.code === 0){
          wechatInfo_flag = true;
          console.log(res);
          //cookie保存微信登录标识，设置时效
          var expireDate= new Date();
          var wechatInfo = JSON.stringify(res.datas);

          expireDate.setTime(expireDate.getTime() + (60*60* 1000 * 24 * 30));
          $.cookie('wechatInfo', wechatInfo,{ expires: expireDate});

          // wechatInfo = JSON.stringify(res.datas);
          // wechatInfo = JSON.parse('wechatInfo')
          // 已绑定
          if (res.datas.userInfo) {
            // userinfo_wechat = res.datas.userInfo
            // localStorage.setItem('userinfo', userinfo_wechat);
            localStorage.setItem('userid', res.datas.userInfo.id);
            localStorage.setItem('userinfo', JSON.stringify(res.datas.userInfo));
            $.cookie('token', res.datas.id,{ expires: expireDate});
            $.cookie('userid', res.datas.userInfo.id,{ expires: expireDate });

            userinfo = JSON.parse(localStorage.getItem('userinfo'))
            // 显示头像，没有则显示默认头像
            if (userinfo.userPic) {
                $("#user_pic")[0].src = userinfo.userPic
            } else {
                $("#user_pic")[0].src = 'img/normal-user.png'
            }
            $(".nav-user-account .more-active").css('display', 'block');
            $(".login-right").css('display', 'block');

          }
          // 未绑定
          else{
            // 显示头像、名称
            $(".nav-user-account #nav_user_mes").text(res.datas.nickname);
            $("#user_pic")[0].src = res.datas.headimgurl;
            $(".nav-user-account .more-active").css('display','block');
            $(".login-right").css('display','block');

            window.location.href='person-setting.html?personType=2'
            // setTimeout(function () {
            //     layer.open({
            //         closeBtn:1,
            //         title: '',
            //         content: '登录成功，前去绑定开启更多权限',
            //         btn: ['绑定'],
            //         yes: function(){
            //             window.location.href='personalCenter.html?personType=1'
            //         }
            //     });
            // },2000)
          }


      }else if(res.code == -1){
        layer.msg('登录失败，请重试');
        $("#nav_login").fadeIn();
        $("#nav_register").fadeIn();
        $(".scrollbar-container").fadeIn();
      }
  }, "json");
}



$('.block-comet-main-wrap').on('click', '.nav-user-account .logout-btn',function () {
        Loginout();
})


$('.block-comet-main-wrap').on('click', '.nav-user-account .usercenter-btn',function () {
//      window.location.href = "personalCenter.html?personType=1";
		window.location.href = "personal-homepage.html";
})

$('.block-comet-main-wrap').on('click','.nav-user-account .inform-btn',function(){
        window.location.href = "notification.html?personType=1";

})
$('.block-comet-main-wrap').on('click','.nav-user-account .setting-btn',function(){
        window.location.href = "person-setting.html?personType=1";


})
//通知鼠标悬停出现隐藏div

//微信登陆
$(document).on('click','.more-sign .wechat-login',function () {
    var uri = 'news/winxinCode' ;
    doJavaGet(uri, function(res) {
        var currentJumpHref = window.localStorage.getItem('currentJumpHref');
        if(currentJumpHref == undefined){
            currentJumpHref = window.location.origin;
        }
        // var currentJumpHref = 'http://www.blockcomet.com';
        if(res.code === 0){
            var resData = res.datas;
            var jumpHref = resData.substr(0,resData.indexOf('#'))+'&redirect_uri='+encodeURIComponent(currentJumpHref);
            window.location.href = jumpHref;
        }
    }, "json");
})
//微信注册
/*$(document).on('click','.more-sign .wechat-resgister',function () {
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
})*/
//页面中的注册跳转
/*
$(document).on('click','#js-sign-up-btn',function () {
    var currentJumpHref = window.location.href;
    if(currentJumpHref.indexOf('register.html')>0 ){
        currentHref = window.location.href
    }else{
        window.location.href = 'register.html';
    }
    window.localStorage.setItem('currentJumpHref',currentJumpHref);
})
*/

//微信登录绑定提示
function wechatBindNotice(){

	 if( wechatInfo && !wechatInfo.userInfo){
        layer.open({
            closeBtn:1,
            title: '',
            content: '您暂未进行账号绑定，请前去进行绑定',
            btn: ['绑定'],
            yes: function(){
                window.location.href='bindUser.html'
            }
        });
        return false;
    }
    return true
}
