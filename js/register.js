var user_name_flag = false;
var phone_flag = false;
var password_flag = false;
//校验昵称
$("#realName").blur(function() {
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

	// if(RegistergainCodeValid()){
  //       gainCode()
	// }
});


// 校验手机号
$("#session_phone").blur(function() {
	var tel = $("#session_phone").val();

	if(tel == "" || !(/^1[0-9]{10}$/.test(tel))) {
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

// 校验密码
$('#session_password').blur(function(){
	var userPwd = $("#session_password").val();
	if(userPwd.length = "") {
		layer.tips('密码不能为空', '#session_password', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		password_flag = false
		return false;
	}
	else if(userPwd.length < 6) {
		layer.tips('密码不得小于六位数', '#session_password', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		password_flag = false
		return false;
	}
	else{
		password_flag = true;
	}
})


var flag_send_code=false; //防止发送验证码重复点击
$('#send_code').click(function() {
	if(flag_send_code){
		return
	}
	if (!phone_flag) {
		layer.tips('请填写正确的手机号', '#session_phone', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return
	}
	flag_send_code=true;
	$("#send_code").css("text-decoration", "none");
	$("#send_code").css("color", "white");
	sendCode()
})

//验证手机号，然后发送验证码
function sendCode() {

	// 验证手机号是否存在
	var uri = 'news/virty?' + 'userName=' + $("#session_phone").val();
	doJavaGet(uri, function(res) {
		if(res != null && res.code == 0) {
			// 不存在则发送验证注册
			getCode()
		}
		else if(res.code == -1){ //校验手机号
			layer.tips('手机号已被注册', '#session_phone', {
				tips: [2, '#3595CC'],
				time: 2000
			});
			flag_send_code = false;
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
		flag_send_code=false
	}

}

function CountDown() {
	count = 60;
	countdown = setInterval(dingshiqi, 1000);
}


var flag_register_submiting = false;
//注册
$("#sign-in-form-submit-btn1").click(function() {
	// 验证注册信息
	if (!validRegisterInfo()) {
		return
	}
	// loading效果
	$(".ouro").attr({
		style: "display:inline-block"
	});
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
			setTimeout(function() { //两秒后跳转
				login()
				//location.href = "login.html";
			}, 1500);

		} else {
			// 注册失败，去除loading效果
			$(".ouro").attr({
				style: "display:none"
			});
			layer.msg('注册失败,请检查你信息填写是否完整无误');
		}
		flag_register_submiting = false;
	}, "json");


});

// 点击注册时判断信息
function validRegisterInfo(){
	if(flag_register_submiting || !password_flag || !user_name_flag || !phone_flag){
		if (!user_name_flag) {
			layer.tips('用戶名不能为空', '#realName', {
				tips: [2, '#3595CC'],
				time: 2000
			});
		}else if(!phone_flag){
			layer.tips('请填写正确的手机号', '#session_phone', {
				tips: [2, '#3595CC'],
				time: 2000
			});
		}else if(!password_flag){
			layer.tips('请填写正确的密码', '#session_password', {
				tips: [2, '#3595CC'],
				time: 2000
			});
		}
		return false
	}else{
		return true
	}
}

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
			// 账号登录时清除微信cookie信息
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
	if( !(/^1[0-9]{10}$/.test(tel))  ) {
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
