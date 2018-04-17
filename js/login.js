
function loginFromValid(){
	var tel=$("#session_phone").val();
	var userPwd=$("#session_password").val();
    
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
        layer.tips('密码长度不能少于6位', '#session_password', {
		  tips: [2, '#3595CC'],
		  time: 2000
		}); 
        return false; 
    }
	return true;

}


$(document).on('click','#sign-in-form-submit-btn',function() {
	if(loginFromValid()){
		var param = {
		userName: $("#session_phone").val(),
		userPwd: $("#session_password").val(),
		tel: $("#session_phone").val(),
		userType: 2,
	}
	var uri = 'news/login?userName=' + param.userName + '&userPwd=' + hex_md5(param.userName + param.userPwd);
	param = JSON.stringify(param);
    var currentHref = location.href
	window.localStorage.setItem('currentHref',currentHref);
	doJavaGet(uri, function(res) {
		debugger
		if(res != null && res.code == 0) {
			$("#load").attr({
				style: "-webkit-animation:loader2 1s 0.23s linear infinite"
			});
			$("#load ").attr({
				style: "display:block"
			});
			setTimeout(function() { //两秒后跳转
				//设置用户信息cookie失效时间，一个小时
                var expireDate= new Date();
                expireDate.setTime(expireDate.getTime() + (60*60* 1000));
				localStorage.setItem('userinfo', res.datas); //存储
				localStorage.setItem('userid', res.datas.id);
				localStorage.setItem('userinfo', JSON.stringify(res.datas));
				$.cookie('token', res.datas.id,{ expires: expireDate});
				$.cookie('userid', res.datas.id,{ expires: expireDate });
                $.cookie('username', res.datas.realName,{ expires: expireDate });
				var localCurrentHref = window.localStorage.getItem('currentHref');
				if(localCurrentHref.indexOf('login.html')>0){
                    window.location.href = "index.html";
                    
                    
				}else{
                    window.location.href = localCurrentHref;
				}
			}, 1500);

		} else {
			layer.msg(res.msg);
		}
	}, "json");
   
	}
	
});

