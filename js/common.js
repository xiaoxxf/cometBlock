var username = $.cookie('username');
var userId = $.cookie('userid');//获取userid
var userinfo = JSON.parse(localStorage.getItem('userinfo'))
var wechatInfo = $.cookie('wechatInfo') ? JSON.parse($.cookie('wechatInfo')) : '';
// var wechatInfo_flag = false; // 是否已取得微信返回数据

// 不跳回登录、注册、找回密码的页面
// var login_uri = '/login.html';
// var register_uri = '/register.html';
// var find_pass_word_uri = '/find-pwd.html';
// var wechat_login_uri = "/connect/qrconnect";
// if (document.location.pathname != login_uri && document.location.pathname != register_uri && document.location.pathname != find_pass_word_uri && document.location.pathname != wechat_login_uri ) {
//   var currentJumpHref = window.location.href;
//   window.localStorage.setItem('currentJumpHref',currentJumpHref);
// }

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
// var WebApiHostJavaApi = "http://backend.blockcomet.com/";
// var WebApiHostJavaApi ="http://testapi.blockcomet.com/";
var WebApiHostJavaApi = "http://10.0.0.193:8080/";

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
    var draft = localStorage.getItem('draft')
    localStorage.clear();
    localStorage.setItem('draft', draft); //退出登录后不清除文章草稿
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
    localCookieWechatInfo = localCookieWechatInfo == undefined ? localCookieWechatInfo : JSON.parse(localCookieWechatInfo);

    // 账号登录 或 微信登录后已绑定的
    if(userId){
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
    // 微信登录后，已取得返回数据，但没有绑定的
    else if(localCookieWechatInfo && !localCookieWechatInfo.userinfo ){
      // 显示微信头像和名称
      $("#user_pic")[0].src = localCookieWechatInfo.headimgurl;
      $(".nav-user-account .more-active").css('display', 'block');
      $(".login-right").css('display', 'block');
      // 隐藏个人中心和消息通知
      $('.inform-btn').css('display','none');
      $('.usercenter-btn').css('display','none');
    }
    // 微信登录
    else if(wechatCode && !localCookieWechatInfo){
      // 取得返回信息
      getUserInfoByWeChat();
    }
    // 没有登录时，显示注册/登录
    else if (!userId && !wechatCode && !localCookieWechatInfo ) {
      $("#nav_login").fadeIn();
      $("#nav_register").fadeIn();
      $(".scrollbar-container").fadeIn();
    }


});

// 微信登录后取得返回信息
function getUserInfoByWeChat(wechatCode){
  var wechatCode = getUrlParam('code');
  var uri = 'news/getUserInfo?code='+ wechatCode;
  doJavaGet(uri, function(res) {
      if(res.code === 0){
          console.log(res);
          //cookie保存微信登录标识，设置时效
          var expireDate= new Date();
          var wechatInfo = JSON.stringify(res.datas);

          expireDate.setTime(expireDate.getTime() + (60*60* 1000 * 24 * 30));
          $.cookie('wechatInfo', wechatInfo,{ expires: expireDate});
          wechatInfo = JSON.parse(wechatInfo);

          // wechatInfo_flag = true; //表示已取得返回信息

          // wechatInfo = JSON.stringify(res.datas);
          // wechatInfo = JSON.parse('wechatInfo')

          // 已绑定
          if (wechatInfo.userInfo) {
            // userinfo_wechat = res.datas.userInfo
            // localStorage.setItem('userinfo', userinfo_wechat);
            localStorage.setItem('userid', res.datas.userInfo.id);
            localStorage.setItem('userinfo', JSON.stringify(res.datas.userInfo));
            $.cookie('token', res.datas.id,{ expires: expireDate});
            $.cookie('userid', res.datas.userInfo.id,{ expires: expireDate });
            userId = $.cookie('userid');
            userinfo = JSON.parse(localStorage.getItem('userinfo'))
            // 显示头像，没有则显示默认头像
            if (userinfo.userPic) {
                $("#user_pic")[0].src = userinfo.userPic
            } else {
                $("#user_pic")[0].src = 'img/normal-user.png'
            }
            $(".nav-user-account .more-active").css('display', 'block');
            $(".login-right").css('display', 'block');

            // 清除wechatinfo
            // $.removeCookie("wechatInfo")
          }
          // 未绑定
          else{
            // 显示头像、名称

            $("#user_pic")[0].src = res.datas.headimgurl;
            $(".nav-user-account .more-active").css('display','block');
            $(".login-right").css('display','block');
            // 隐藏个人中心和消息通知
            $('.inform-btn').css('display','none');
            $('.usercenter-btn').css('display','none');
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


// 点击头像跳转
$('.block-comet-main-wrap').on('click', '.nav-user-account .user-icon',function () {
	// 账号登录 or 已绑定的微信账号
	if (userId) {
		window.location = 'personal-homepage.html'
	}
	// 未绑定的微信账号
	else if(wechatInfo && !wechatInfo.userInfo){
		window.location = 'person-setting.html'
	}
})

// 用户下拉选单跳转
$('.block-comet-main-wrap').on('click', '.nav-user-account .logout-btn',function () {
        Loginout();
})

$('.block-comet-main-wrap').on('click', '.nav-user-account .usercenter-btn',function () {
//      window.location.href = "personalCenter.html?personType=1";
			  window.location = "personal-homepage.html";
})

$('.block-comet-main-wrap').on('click','.nav-user-account .inform-btn',function(){
        window.location.href = "notification.html?personType=1";
})
$('.block-comet-main-wrap').on('click','.nav-user-account .setting-btn',function(){
        window.location.href = "person-setting.html?personType=1";


})

//微信登陆
$(document).on('click','.more-sign .wechat-login',function () {
    var uri = 'news/winxinCode' ;
    doJavaGet(uri, function(res) {
        var currentJumpHref = window.localStorage.getItem('currentJumpHref');

        // 截取code和state
        var reg_code = new RegExp("(^|\\?|&)"+ 'code' +"=([^&]*)(\\s|&|$)", "i");
        var reg_state = new RegExp("(^|\\?|&)"+ 'state' +"=([^&]*)(\\s|&|$)", "i");

        if (reg_code.test(currentJumpHref)){
          var code = unescape(RegExp.$2.replace(/\+/g, " "));
          currentJumpHref = currentJumpHref.replace('?code=' + code, '');
          currentJumpHref = currentJumpHref.replace('&code=' + code, '');
        }
        if (reg_state.test(currentJumpHref)) {
          var state = unescape(RegExp.$2.replace(/\+/g, " "));
          currentJumpHref = currentJumpHref.replace('&state=' + state, '');
        }

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
$(document).on('click','.more-sign .wechat-resgister',function () {
  var uri = 'news/winxinCode' ;
  doJavaGet(uri, function(res) {
      var currentJumpHref = window.localStorage.getItem('currentJumpHref');

      // 截取code和state
      var reg_code = new RegExp("(^|\\?|&)"+ 'code' +"=([^&]*)(\\s|&|$)", "i");
      var reg_state = new RegExp("(^|\\?|&)"+ 'state' +"=([^&]*)(\\s|&|$)", "i");

      if (reg_code.test(currentJumpHref)){
        var code = unescape(RegExp.$2.replace(/\+/g, " "));
        currentJumpHref = currentJumpHref.replace('?code=' + code, '');
        currentJumpHref = currentJumpHref.replace('&code=' + code, '');
      }
      if (reg_state.test(currentJumpHref)) {
        var state = unescape(RegExp.$2.replace(/\+/g, " "));
        currentJumpHref = currentJumpHref.replace('&state=' + state, '');
      }

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
                window.location.href='person-setting.html?personType=2'
            }
        });
        return false;
    }
    return true
}
