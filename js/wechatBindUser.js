var user_name_flag=false;
var phone_flag=false;
var user_password_flag=false;

//关联新用户验证
//校验用户名
$(document).on('blur','#realName',function() {
	var realName = $("#realName").val();
	if(realName == "") {
		layer.tips('用戶名不能为空', '#realName', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		user_name_flag = false;
		return false;
	}else{
		user_name_flag = true;
	}
});

// 校验手机号
$(document).on('blur','#session_phone',function() {
	var tel = $("#session_phone").val();
	if(tel == "" || !(/^1[0-9]{10}$/.test(tel))) {
		console.log(11)
		layer.tips('请填写正确的手机号', '#session_phone', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		phone_flag = false;
		return false;
	}else{
		phone_flag = true;
	}

});
//校验密码
$(document).on('blur','#session_password',function() {
	var userPwd = $("#session_password").val();
	if(userPwd.length = "") {
		layer.tips('密码不能为空', '#session_password', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		user_password_flag = false
		return false;
	}
	else if(userPwd.length < 6) {
		layer.tips('密码不得小于六位数', '#session_password', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		user_password_flag = false
		return false;
	}
	else{
		user_password_flag = true;
	}
});

//绑定新用户弹出框
$("#bind_new_user").on('click',function (e) {
    var area_width
    var area_height
    if($(window).width() <= 767)
 	{
	 	area_width = '320px'
	    area_height = '500px'
 	}else{
 		 area_width = '370px'
	     area_height = '460px'
 	}
  layer.open({
      type: 1,
      shade:0,
      title: 0,
      skin: 'layui-layer-report', //加上边框
      area: [area_width,area_height ], //宽高
      content: $("#bind-new-commit-layer").html()
  });

	$('#bind-new-user-btn').on('click',function(){
    // var currentHref = location.href
    // window.localStorage.setItem('currentHref', currentHref);
		signUpBeforeBind();
	})

})

// 绑定新用户，先注册
function signUpBeforeBind(){
	if(RegisterFromValid()) {
		var param = {
			userName: $("#session_phone").val(),
			realName: $("#realName").val(),
			userPwd: $("#session_password").val(),
			tel: $("#session_phone").val(),
			phoneCode: $("#phone_code").val()
			//userType: 3,
		}
		var uri = 'news/registerUser'
		param = JSON.stringify(param)

		doPostJavaApi(uri, param, function(res) {

			if(res != null && res.code == 0) {

				$(".ouro").attr({
					style: "display:inline-block"
				});

        // 注册后登录，然后绑定
        loginAfterSignUp()
			} else {

				layer.msg('绑定失败，请检查你的信息填写是否正确');

			}

		}, "json");
	}
}

// 绑定新用户，注册后登录
function loginAfterSignUp() {
	if(loginFromValid()) {
		var param = {
			userName: $("#session_phone").val(),
			userPwd: $("#session_password").val(),
			tel: $("#session_phone").val()
			//userType: 2,
		}
		var uri = 'news/login?userName=' + param.userName + '&userPwd=' + hex_md5(param.userName + param.userPwd);
		param = JSON.stringify(param);
		// var currentHref = location.href
		// window.localStorage.setItem('currentHref', currentHref);
		doJavaGet(uri, function(res) {
			if(res != null && res.code == 0) {
				//设置用户信息cookie失效时间，一个小时
				var expireDate = new Date();
				expireDate.setTime(expireDate.getTime() + (60 * 60 * 1000));
				localStorage.setItem('userinfo', res.datas); //存储
				localStorage.setItem('userid', res.datas.id);
				localStorage.setItem('userinfo', JSON.stringify(res.datas));
				$.cookie('token', res.datas.id, {
					expires: expireDate
				});
				$.cookie('userid', res.datas.id, {
					expires: expireDate
				});
				$.cookie('username', res.datas.realName, {
					expires: expireDate
				});

        // 登录后绑定
        bindNewUser()
			} else {
				layer.msg(res.msg);
			}
		}, "json");

	}
}

// 绑定新用户，注册-登录-绑定
function bindNewUser(){
	var userinfo = JSON.parse(localStorage.getItem('userinfo'));
	var userId = $.cookie('userid');//获取userid
	var wechatInfo = JSON.parse($.cookie('wechatInfo'))
	var uri = 'news/bindingUser?userId=' + userId + '&userPwd=' + userinfo.userPwd +'&openid=' + wechatInfo.openid
	doJavaGet(uri, function(res){
		if (res.code == 0) {
      layer.msg('绑定成功', {
        time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
        end:function(){
          // var currentJumpHref = window.localStorage.getItem('currentJumpHref');
          window.location.href = 'personal-homepage.html';
        }
      });
		}else if(res.code == -1){
			layer.msg(res.msg)
		}
	})
}


//绑定现有用户弹出框
$("#bind_now_user").on('click',function (e) {
  var area_width
  var area_height
  if($(window).width() <= 767)
 	{
	 	area_width = '320px'
	    area_height = '500px'
 	}else{
 		 area_width = '370px'
	     area_height = '460px'
 	}
  layer.open({
      type: 1,
      shade:0,
      title: 0,
      skin: 'layui-layer-report', //加上边框
      area: [area_width,area_height ], //宽高
      content: $("#bind-now-commit-layer").html()
  });
	$('#bind-exist-user-btn').on('click',function(){
    // var currentHref = location.href
    // window.localStorage.setItem('currentHref', currentHref);
		loginBeforeBind();
	})


})

// 绑定现有用户前，先登录
function loginBeforeBind(){
	if(loginFromValid()){
		var param = {
		userName: $("#session_phone").val(),
		userPwd: $("#session_password").val(),
		tel: $("#session_phone").val(),
		userType: 2,
	}
	var uri = 'news/login?userName=' + param.userName + '&userPwd=' + hex_md5(param.userName + param.userPwd);
	param = JSON.stringify(param);
	// var currentHref = location.href
	// window.localStorage.setItem('currentHref',currentHref);
	doJavaGet(uri, function(res) {
		if(res != null && res.code == 0) {

			$(".ouro").attr({
				style: "display:inline-block"
			});

			//设置用户信息cookie失效时间，一个小时
			var expireDate= new Date();
			expireDate.setTime(expireDate.getTime() + (60*60* 1000 * 24 * 30));
			localStorage.setItem('userinfo', res.datas); //存储
			localStorage.setItem('userid', res.datas.id);
			localStorage.setItem('userinfo', JSON.stringify(res.datas));
			$.cookie('token', res.datas.id,{ expires: expireDate});
			$.cookie('userid', res.datas.id,{ expires: expireDate });
			$.cookie('username', res.datas.realName,{ expires: expireDate });
			// var localCurrentHref = window.localStorage.getItem('currentHref');

      // 登录后绑定
			bindExistUser()

		} else {
			layer.msg(res.msg);
		}
	}, "json");

	}
}

function bindExistUser(){
	// var userinfo = JSON.parse(localStorage.getItem('userinfo'));
	// var userId = $.cookie('userid');//获取userid
	// var wechatInfo = JSON.parse($.cookie('wechatInfo'))
  var userId = $.cookie('userid');//获取userid
  var userinfo = JSON.parse(localStorage.getItem('userinfo'))
	var uri = 'news/bindingUser?userId=' + userId + '&userPwd=' + userinfo.userPwd +'&openid=' + wechatInfo.openid
	doJavaGet(uri, function(res){
		if (res.code == 0) {
      layer.msg('绑定成功', {
        time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
        end:function(){
          // var currentJumpHref = window.localStorage.getItem('currentJumpHref');
          window.location.href = 'personal-homepage.html';;
        }
      });
		}else if(res.code == -1){
			layer.msg(res.msg)
		}
	})
}









// 登录校验
function loginFromValid(){
	var tel=$("#session_phone").val();
	var userPwd=$("#session_password").val();

    // if(tel==""){
    //     layer.tips('手机号不能为空', '#session_phone', {
		//   tips: [2, '#3595CC'],
		//   time: 2000
		// });
    //     return false;
    // }
    // if(!(/^1(3|4|5|7|8)\d{9}$/.test(tel))){
    // 	layer.tips('输入手机错误', '#session_phone', {
		//   tips: [2, '#3595CC'],
		//   time: 2000
		// });
    //     return false;
    // }
	if(userPwd.length=""){
        layer.tips('密码不能为空', '#session_password', {
		  tips: [2, '#3595CC'],
		  time: 2000
		});
        return false;
    }
	if(userPwd.length<6){
        layer.tips('密码长度不能少于6位', '#session_password', {
		  tips: [2, '#3595CC'],
		  time: 2000
		});
        return false;
    }
	return true;

}

// 注册校验 & 发送验证码
//输入框校验
function RegisterFromValid() {
	var realName = $("#realName").val();
	var tel = $("#session_phone").val();
	var userPwd = $("#session_password").val();
	if(realName == "") {
		layer.tips('用戶名不能为空', '#realName', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	if(tel == "") {
		layer.tips('手机号不能为空', '#session_phone', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	if(!(/^1[0-9]{10}$/.test(tel))) {
		layer.tips('请输入正确的手机号', '#session_phone', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	if(userPwd.length = "") {
		layer.tips('密码不能为空', '#session_password', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	if(userPwd.length < 6) {
		layer.tips('密码错误', '#session_password', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}

	return true;

}
//关联新账户验证
function sendCodeFromValid(){
	var realName = $("#realName").val();
	var tel = $("#session_phone").val();
	var userPwd = $("#session_password").val();
	if(realName == "") {
		layer.tips('用戶名不能为空', '#realName', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	if(tel == "") {
		layer.tips('手机号不能为空', '#session_phone', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	if(!(/^1[0-9]{10}$/.test(tel))) {
		layer.tips('请输入正确的手机号', '#session_phone', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}

	return true;
}

//昵称手机号失去焦点事件
//$("#realName").blur(function() {
//	if(RegisterFromValid()){
//      gainCode()
//	}
//
//});
//
//$("#session_phone").blur(function() {
//  if(RegisterFromValid()){
//      gainCode()
//  }
//});


//点击发送验证码
$('#send_code').click(function() {
	sendCode()
})

//验证昵称手机号
function gainCode() {
	var uri = 'news/virty?'
	if($("#session_phone").val()) { //校验手机号
		uri = uri + 'userName=' + $("#session_phone").val()
	} else if($("#realName").val()) { //校验昵称
		uri = uri + 'realName=' + $("#realName").val()
	} else {
		layer.msg("请输入手机号/昵称");
	}
	doJavaGet(uri, function(res) {
		if(res != null && res.code == 0) {
		} else {
				//layer.msg(res.msg);
			}


	}, "json");

}
var flag_send_code=false;
//校验对象是否存在
function verifyPhone() {
  if(flag_send_code){
    return
  }
	if(!$("#session_phone").val()) { //校验手机号
    layer.tips('手机号不能为空', '#session_phone', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return
	} else {
		var uri = 'news/virty?' + 'userName=' + $("#session_phone").val()
    doJavaGet(uri, function(res) {
      if(res != null && res.code == 0) {
        if(sendCodeFromValid()){
          getCode()
        }
      } else {
        layer.tips('手机号已被注册', '#session_phone', {
    			tips: [2, '#3595CC'],
    			time: 2000
    		});

      }

    }, "json");
	}

}

//发送验证码
function getCode() {
  flag_send_code = true;
	var uri = 'blockchain/getCode?phoneNo=' + $("#session_phone").val();
	doJavaGet(uri, function(res) {
		if(res != null && res.code == 0) {
			layer.msg("验证码已发送");
			//验证码倒计时
			CountDown()

		} else {
			layer.msg(res.msg);
		}

	}, "json");

}

var count = 60;
var countdown;

function dingshiqi() {
	if(count > 0) {
		count = count - 1
		$("#send_code").html(count + " s")

	} else if(count == 0) {

		$("#send_code").html("重新发送验证码")
		clearInterval(countdown);
		flag_send_code=false
	}

}

function CountDown() {
	count = 60;
	countdown = setInterval(dingshiqi, 1000);
}


//关联已有账户校验
