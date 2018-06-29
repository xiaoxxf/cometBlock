var myCaptcha = _dx.Captcha(document.getElementById('c1'), {
		appId: 'f490600e58fd626ab4f5d6d160242873',   //appId,开通服务后可在控制台中“服务管理”模块获取
		style: 'popup',

		success: function (token) {
			var valid_token = token;
			myCaptcha.hide();
			// 验证通过，则发送验证码
			sendCode(valid_token);
		},
		fail: function(){
			// console.log('失败')
			valid_token = '';
		}
})

//点击验证
var flag_resetPwd_sendCode =false;
$('#send_code').click(function() {

 	if(SendCodeFromValid()){
		if(flag_resetPwd_sendCode){
			return
		}
	 	else if(!flag_resetPwd_sendCode && ifRegister){
			// 滑块验证
	 		valid()
	 	}
	}
})
function valid() {
	myCaptcha.reload(); //重置验证码
	myCaptcha.show();
}

//发送验证码
function sendCode(valid_token){
	if(SendCodeFromValid()){
		var userPhone = $("#session_phone").val();
		var uri = 'blockchain/getCode?phoneNo=' + userPhone + '&token=' + valid_token//输入手机号请求验证码验证
		doJavaGet(uri, function(res) {
			if(res != null && res.code == 0) {
				flag_resetPwd_sendCode = true;
				layer.msg("验证码已发送");
				//验证码倒计时
				CountDown()
			} else {
				layer.msg(res.msg);
			}
		}, "json");
	}
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
		flag_resetPwd_sendCode = false;
	}


}

function CountDown() {
	count = 60
	countdown = setInterval(dingshiqi, 1000);
}

//找回密码输入框检测输入手机号时检测是否有注册过
$("#session_phone").blur(function(){
	if(SendCodeFromValid()){
		getRegister()
	}
});

// 校验手机号是否已注册
var ifRegister = false
function getRegister(){
	var userPhone=$("#session_phone").val();
	var uri="news/virty?userName="+userPhone
	doJavaGet(uri,function(res){
		if(res !=null && res.code==-1){
			//返回code为-1为注册过，所以可以直接修改密码
			ifRegister = true;

//			getCode()
		}
		else{
			 //校验手机号
			ifRegister = false;
			layer.msg("手机号未注册过，请先注册");

		}

	},"json");
}

//重置密码
$("#sign-in-form-submit-btn").click(function() {
	if(FindPwdFromValid()){
		var userName=$("#session_phone").val();
		var code=$("#phone_code").val();
		var newPassword=$("#confirm_password").val();
		var str = "userName="+ userName+"&code="+code+"&newPassword="+newPassword+"&type="+2
		var uri = 'news/recoverPassword?'+str
		doJavaGet(uri, function(res) {

			if(res != null && res.code == 0) {
				layer.msg(res.msg+",请登录");
				setTimeout(function() {
					window.location.href = "login.html";
				}, 1500);
				$(".ouro").attr({
					style: "display:inline-block"
				});

			} else {
				layer.msg(res.msg);
				$(".ouro").attr({
					style: "display:none"
				});
			}

		}, "json");
	}
});

//绑定回车
$(document).keydown(function(event){
	if(event.keyCode == 13){
		$('#sign-in-form-submit-btn').click();
		}
});


function FindPwdFromValid() {
	//手机号校验
	var tel=$("#session_phone").val();
   if(tel==""){
       layer.tips('手机号不能为空', '#session_phone', {
	   tips: [2, '#3595CC'],
	   time: 2000
	 });
       return false;
   }
   if(!(/^1(3|4|5|7|8)\d{9}$/.test(tel))){
   	layer.tips('输入手机错误', '#session_phone', {
	   tips: [2, '#3595CC'],
	   time: 2000
	 });
	 return false;
   }
	if($("#confirm_password").val()==""|| !$("#confirm_password")){//新密码为空

		layer.tips('请输入新密码', '#confirm_password', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return
	}
	if($("#confirm_password_again").val()==""|| !$("#confirm_password_again")){//确认密码为空

		layer.tips('请再次输入新密码', '#confirm_password_again', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return
	}
	if($("#confirm_password").val()!= $("#confirm_password_again").val()){
		layer.tips('输入密码不匹配','#confirm_password_again',{
			tips: [2, '#3595CC'],
			time: 2000
		});
		return
	}
	if($("#phone_code").val()==""|| !$("#phone_code")){//验证码为空

		layer.tips('请输入验证码', '#phone_code', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return
	}
	return true;
}

function SendCodeFromValid(){
	var tel=$("#session_phone").val();
   if(tel==""){
       layer.tips('手机号不能为空', '#session_phone', {
	   tips: [2, '#3595CC'],
	   time: 2000
	 });
       return false;
   }
   if(!(/^1(3|4|5|7|8)\d{9}$/.test(tel))){
   	layer.tips('输入手机错误', '#session_phone', {
	   tips: [2, '#3595CC'],
	   time: 2000
	 });
	 return false;

   }
   return true;
}
