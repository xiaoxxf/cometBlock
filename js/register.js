
function RegisterFromValid(){
	var realName=$("#realName").val();
	var tel=$("#session_phone").val();
	var userPwd=$("#session_password").val();
    if(realName==""){ 
        layer.tips('用戶名不能为空', '#session_phone', {
		  tips: [2, '#3595CC'],
		  time: 2000
		}); 
        return false; 
    }
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
	if(userPwd.length=""){ 
        layer.tips('密码不能为空', '#session_password', {
		  tips: [2, '#3595CC'],
		  time: 2000
		}); 
        return false; 
    }
	if(userPwd.length<6){ 
        layer.tips('密码错误', '#session_password', {
		  tips: [2, '#3595CC'],
		  time: 2000
		}); 
        return false; 
    }
	return true;

}




$("#sign-in-form-submit-btn").click(function() {
	if (RegisterFromValid()){
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
	}
	

});