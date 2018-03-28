$(function() {

	//验证手机号码输入格式
	jQuery.validator.addMethod("isMobile", function(value, element) {
		var length = value.length;
		var regPhone = /^1([3578]\d|4[57])\d{8}$/;
		return this.optional(element) || (length == 11 && regPhone.test(value));
	}, "请正确填写您的手机号码");

	$('#form-register1').validate({
		rules: {
			//    昵称
			userName: {　　
				required: true,
			},
			//   电话
			tel: {
				required: true,
				minlength: 11,
				isMobile: true

			},
			//   密码
			pwd: {
				required: true,
				minlength: 6
			},
		},
		messages: {
			//   用户名
			userName: {
				required: '请输入用户名',
			},
			//   用户名
			tel: {
				required: '请输入电话',
				minlength: "手机长度为11位",
				//                       isMobile:"请填写11位的手机号码!"
			},
			//   密码
			pwd: {
				required: '请输入密码',
				minlength: "密码长度不能小于 6 个字符"
			},
		},
		// 校验全部通过

		submitHandler: function() {

		},

	})
})

$("#sign-in-form-submit-btn").click(function() {

	var param = {
		userName: $("#session_phone").val(),
		realName: $("#realName").val(),
		userPwd: $("#session_password").val(),
		tel: $("#session_phone").val(),
		//userType: 3,
	}

	var uri = 'news/registerUser'
	param = JSON.stringify(param)

	doPostJavaApi(uri, param, function(res) {

		if(res != null && res.code == 0) {
			$("#load").attr({
				style: "-webkit-animation:loader2 1s 0.23s linear infinite"
			});
			$("#load div").attr({
				style: "display:block"
			});
			setTimeout(function() { //两秒后跳转                                   
				location.href = "index.html";
			}, 1500);

		} else {

			layer.msg(res.msg);

		}

	}, "json");

});