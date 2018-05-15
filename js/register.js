
(function(){
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
	if(!(/^1(3|4|5|7|8)\d{9}$/.test(tel))) {
		layer.tips('输入手机错误', '#session_phone', {
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
function RegistergainCodeValid() {
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
	if(!(/^1(3|4|5|7|8)\d{9}$/.test(tel))) {
		layer.tips('输入手机错误', '#session_phone', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	return true;

}

//昵称手机号失去焦点事件
$("#realName").blur(function() {
	if(RegistergainCodeValid()){
        gainCode()
	}

});

$("#session_phone").blur(function() {
    if(RegistergainCodeValid()){
        gainCode()
    }
});

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

//校验对象是否存在
function sendCode() {
	var uri = 'news/virty?'
	if(!$("#session_phone").val()) { //校验手机号
		layer.msg("请输入手机号");
		return
	} else {
		uri = uri + 'userName=' + $("#session_phone").val()
	}
	doJavaGet(uri, function(res) {
		if(res != null && res.code == 0) {
			getCode()
//			CountDown()
		} else {

			if($("#session_phone").val()) { //校验手机号

				layer.msg("手机号已存在");

			}

		}

	}, "json");

}

//发送验证码
function getCode() {
	var uri = 'blockchain/getCode?phoneNo=' + $("#session_phone").val()
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
//		count = 60;
	}

}

function CountDown() {
	count = 60;
	countdown = setInterval(dingshiqi, 1000);

}
//点击发送验证码
$('#send_code').click(function() {
	$("#send_code").css("text-decoration", "none");
	$("#send_code").css("color", "white");

	sendCode()

})

var flag_register_submiting = false;
//注册
$("#sign-in-form-submit-btn1").click(function() {
	if(flag_register_submiting){
		return
	}
	if(RegisterFromValid()) {
		flag_register_submiting = true;
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
				setTimeout(function() { //两秒后跳转
					login()
					//location.href = "login.html";
				}, 1500);

			} else {

				layer.msg('注册失败');

			}
			flag_register_submiting = false;

		}, "json");
	}

});

function login() {
	if(loginFromValid()) {
		var param = {
			userName: $("#session_phone").val(),
			userPwd: $("#session_password").val(),
			tel: $("#session_phone").val()
			//userType: 2,
		}
		var uri = 'news/login?userName=' + param.userName + '&userPwd=' + hex_md5(param.userName + param.userPwd);
		param = JSON.stringify(param);
		var currentHref = location.href
		window.localStorage.setItem('currentHref', currentHref);
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
				var localCurrentHref = window.localStorage.getItem('currentJumpHref');
				if(!localCurrentHref){
						window.location.href = "index.html";
				}else{
						window.location.href = localCurrentHref;
				}

			} else {
				layer.msg(res.msg);
			}
			// 账号登录时清除cookie信息
			$.removeCookie("wechatInfo")
		}, "json");

	}
}

function loginFromValid() {
	var tel = $("#session_phone").val();
	var userPwd = $("#session_password").val();

	if(tel == "") {
		layer.tips('手机号不能为空', '#session_phone', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	if(!(/^1(3|4|5|7|8)\d{9}$/.test(tel))) {
		layer.tips('输入手机错误', '#session_phone', {
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
		layer.tips('密码长度不能少于6位', '#session_password', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	return true;

}
})();
