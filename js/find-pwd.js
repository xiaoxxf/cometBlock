//找回密码
//手机校验
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

//发送验证码
function getCode() {
	if(SendCodeFromValid()){
		var userPhone = $("#session_phone").val();
		var uri = 'blockchain/getCode?phoneNo=' + userPhone//输入手机号请求验证码验证
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
		count = 60
	}

}

function CountDown() {
	countdown = setInterval(dingshiqi, 1000);

}
//点击验证
$('#send_code').click(function() {
	getCode()
})




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
