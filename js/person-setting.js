//重置密码校验
var userinfo = JSON.parse(localStorage.getItem('userinfo'));
var noMoreData = false
var dictionary = []
$(function(){
	var uri = 'blockchain/quary?parentId=20'
	doJavaGet(uri, function(result){
		for (var i = 0; i < result.datas.length; i++) {
			dictionary[i] = result.datas[i].dicValue
		}
	})
})

function ResetFromValid() {
	var resetPwd = $("#reset-pwd").val();
	var confirmPwd = $("#confirm-pwd").val();

	if(resetPwd.length = "") {
		layer.tips('密码不能为空', '#reset-pwd', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	if(resetPwd.length < 6) {
		layer.tips('密码长度要大于6位', '#reset-pw', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	if(confirmPwd.length = "") {
		layer.tips('密码不能为空', '#reset-pwd', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	if(confirmPwd.length < 6) {
		layer.tips('密码长度要大于6位', '#reset-pw', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	if(resetPwd != confirmPwd) {
		layer.tips('输入密码不一致', '#reset-pw', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return false;
	}
	return true;
}

//左边点击互相切换效果
$(".person-left-menu li a").on('click', function(e) {
	e.preventDefault()
	e.stopPropagation()
	$(this).parent().parent().find('a').removeClass('toogle-acive');
	$(this).addClass('toogle-acive');
})


//修改密码显示隐藏
function changePwdClick() {
	$(".put-newpwd").css("display", "block");

}

//地址栏传入参数，从哪里进来拼上参数即可
//加入personType=1/2  进入基础设置 /消息

var pT = getUrlParam("personType");
$(".person-left-menu li a").removeClass('toogle-acive');
$(function(){
if(pT == 1){
	$(".cont0").fadeIn();
	$(".person-left-menu li a").eq(0).addClass("toogle-acive");
}
else if(pT == 2){
	$(".cont1").fadeIn();
	$(".person-left-menu li a").eq(1).addClass("toogle-acive");
}


})

// 点击已读
$('.show_right').on('click', '.message' , function(e){
	var self = $(e.currentTarget)
	var messageId = self.data('messageid')
	var uri = "news/readMessage?userId=" + userinfo.id + "&userPwd=" + userinfo.userPwd + "&status=1" + "&messageId=" + messageId
	doJavaGet(uri, function(e){
		self.css('background-color','white')
	})
})


var append_class = null
var id = null
var type = null  // 1-引用，2-评论（别人对我的长文进行评论），3-点赞，4-审核通过，5-驳回
var currentPage = 1
var noMoreData = false
var article_flag = false
// 渲染
 $(document).ready(function(){
        $(".person-left-menu li a").click(function(){

        var order = $(".person-left-menu li a").index(this);//获取点击之后返回当前a标签index的值
				switch (order) {
					case 0:
						$(".cont0").css("display","block");
						$(".cont1").css("display","none");
						break;
					case 1:
						$(".cont0").css("display","none");
						$(".cont1").css("display","block");
						break;

					default:
						// console.log('这是默认')
						break;
				}


    });
})

var resetTimer = null;
$(window).scroll(function(){
	if (resetTimer) {
		clearTimeout(resetTimer)
	}
	resetTimer = setTimeout(function(){

		var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
		totalheight = parseFloat($(window).height()) + parseFloat(srollPos);

		if ($(document).height() <= totalheight && !noMoreData){
			if (type) {
				currentPage += 1
				var uri = 'news/getMessage?userId=' + userinfo.id + '&userPwd=' + userinfo.userPwd + '&currentPage=' + currentPage + '&pageSize=12' + '&type=' + type

				doJavaGet(uri, function(result){
					if (result.datas.length == 0) {
						noMoreData = true
					}else{
						console.log(result.datas)
						var tpl = document.getElementById(id).innerHTML;
						var content = template(tpl, {list: result.datas});
						// $(append_class).html('')
						$(append_class).append(content)
					}
				})
			}else if(article_flag){
				currentPage += 1
				var uri = 'blockchain/quaryReview?currentPage=' + currentPage + '&pageSize=12' + '&type=2' + '&creator=' + userinfo.id;

				doJavaGet(uri,function(result){
					var tpl = document.getElementById('article_tpl').innerHTML;
					var content = template(tpl, {list: result.datas});
					// $('.my-article').html('')
					$('.my-article').append(content)
				})
			}


		}
	},100)
})




//验证码校验
function getCodeResetPwd() {
	//var uri = 'blockchain/getCode?phoneNo=' + $("#session_phone").val()
	var str = localStorage.getItem('userinfo');
	var jsonStr = JSON.parse(str)
//	var tel = jsonStr.tel;
	//var tel = jsonStr.userName;
	var userName = jsonStr.userName;
	var uri = 'blockchain/getCode?phoneNo=' + userName //输入手机号请求验证码验证
	doJavaGet(uri, function(res) {
		if(res != null && res.code == 0) {
			layer.msg("验证码已发送");
			//验证码倒计时
			CountDownResetPwd();

		} else {
			layer.msg(res.msg);
		}
	}, "json");

}
var count_reset = 60;
var countdownreset;

function dingshiqi_reset() {
	if(count_reset > 0) {
		count_reset = count_reset - 1
		$("#setting_send_code").html(count_reset + " s")
	} else if(count_reset == 0) {

		$("#setting_send_code").html("重新发送验证码")
		clearInterval(countdownreset);
		count_reset = 60
	}

}

function CountDownResetPwd() {
	countdownreset = setInterval(dingshiqi_reset, 1000);

}
//点击验证
$('#setting_send_code').click(function() {
	$("#setting_send_code").css("text-decoration", "none");
	$("#setting_send_code").css("color", "white");
	getCodeResetPwd();
})


//textarea限制长度
function textareaLenght(){
	var personIntro=$(".person-introduce").val();
	if(personIntro.length>=100){
		layer.tips('请输入100字符以内', '.person-introduce', {
		  tips: [2, '#3595CC'],
		  time: 2000
		});
      return false;
	}
	return true;
}


//修改昵称g
$("#save_realname").click(function(){
	uploadImg();
	if (textareaLenght()){
		changeUser();
	}

})

function changeUser(){
	var str = localStorage.getItem('userinfo');
	var jsonStr = JSON.parse(str); //从一个字符串中解析出json对象
	var realName=jsonStr.realName;
	var userPwd =  jsonStr.userPwd;
	var personIntroduce=$(".person-introduce").val();
	var userId = jsonStr.id;
	var uri = 'news/changeRealname?realName='+realName+"&passWord="+userPwd+"&userId="+userId+"&personIntro="+personIntroduce
	doJavaGet(uri, function(res) {
		if(res != null && res.code == 0) {
			layer.msg(res.msg);
			var realName=$("#ownname").val();
			var str = localStorage.getItem('userinfo');
			var obj=JSON.parse(str);
			obj.realName = realName;
			var nameStr=JSON.stringify(obj);
			localStorage.setItem('userinfo',nameStr); //存储

		} else {
			layer.msg(res.msg);
		}

	}, "json");
}


//保存修改信息
$("#save-register-info").click(function() {

	var param = {}
	var str = localStorage.getItem('userinfo');

	var jsonStr = JSON.parse(str) //从一个字符串中解析出json对象
	if($("#newPwd").val()==""|| !$("#newPwd")){//新密码为空

		layer.tips('请输入新密码', '#newPwd', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return
	}

	if($("#setting_phone_code").val()==""|| !$("#setting_phone_code")){//验证码为空

		layer.tips('请输入验证码', '#setting_phone_code', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return
	}

	if(jsonStr){
		param.userId = jsonStr.id;
		param.tel = jsonStr.tel;
		param.passWord =  jsonStr.userPwd;
		param.realName =  $("#ownname").val();
		param.code = $("#setting_phone_code").val();
		newpassWord =  $("#newPwd").val();
	}else{

		layer.tips('请先登录', '#setting_phone_code', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return
	}

	//param = JSON.stringify(param)

	var str = "userId="+param.userId+"&tel="+ param.tel+"&passWord="+param.passWord +"&realName="+ param.realName+"&code="+param.code+"&newPassword="+newpassWord
	var ownName = $("#ownname").val();
	var uri = 'news/changePassword?'+str
	doJavaGet(uri, function(res) {

		if(res != null && res.code == 0) {

			setTimeout(function() {
				layer.msg(res.msg+",请重新登录");
				Loginout()
			}, 1000);

		} else {

			layer.msg(res.msg);

		}

	}, "json");


});


//注销
function Loginout(){
    localStorage.clear();
    $.removeCookie("token");
    $.removeCookie("userid");
    $.removeCookie("username");
    window.location.href = "login.html";
}

//确认修改密码

$("#save-reset-pwd").click(function() {
	if(ResetFromValid()) {
		var resetPwd = $("#reset-pwd").val() //拿到新密码传到后台
		var uri = 'news/resetPwd?userPwd=' + hex_md5(param.resetPwd);
		doPostJavaApi(uri, function(res) {
			if(res != null && res.code == 0) {

				layer.msg(res.msg);

			} else {

				layer.msg(res.msg);

			}

		}, "json");
	}

});


// 显示头像
$(function(){
	var preview = $('#result').find('img')[0];
	if (userinfo && userinfo.userPic) {
		preview.src = userinfo.userPic
	}else{
		preview.src = 'img/normal-user.png'
	}
	if (userinfo && userinfo.realName) {
		$('#ownname').val(userinfo.realName)
	}
})

var imageType = /image.*/;
var imageMaxSize = 1*1024*1024;

//预览图片
$('#user_logo_input').on('change',function(){
	var file = this.files[0]

  if(!file){
    return false;
  }

  // 校验图片
  if (!file.type.match(imageType) || file.size > imageMaxSize) {
    layer.msg('请选择小于1M的图片文件',{time:1000})
    return false
  }

	var preview = $('#result').find('img')[0];
	var reader = new FileReader();

	reader.addEventListener("load", function() {
		preview.src = reader.result; //拿到图片的结果
	}, false);

	if(file) {
		reader.readAsDataURL(file);
	}
})

//function previewICon() {
//
//}
var ui = {
	'fileUpLoading': false
}
var logo_file = null
//上传头像
//$('.upload-project-logo').on('click',function(){
//
//})

function uploadImg(){
	var file = $('#user_logo_input')[0].files[0]
	// 校验图片
	if(file==null){
//		layer.msg('未更改头像');
		return false
	}
	else if (!file.type.match(imageType) || file.size > imageMaxSize) {
		layer.msg('请选择小于1M的图片文件',{time:1000})
		return false
	}

	var formData = new FormData();
	formData.append('file', file);

	$.ajax({
		url: WebApiHostJavaApi + 'common/upload',
		type: "post",
		data: formData,
		datType: "json",
		processData: false, // 不处理数据
		contentType: false, // 不设置内容类型
		beforeSend: function(){
	    ui.fileUpLoading = true
	    },
		success: function(data) {
			if(data.code == 0){
				uploadIcon(data.datas[0])
			}else if(data.code == -1){
				layer.msg('上传失败请重试')
			}

		},
		 error:function(e){
	       ui.fileUpLoading = false
	       alert("上传错误，请重试！");
	    }

	});
}

function uploadIcon(e){
	var data ={
		'userPic': e,
		'userId':  userinfo.id,
		'userPwd': userinfo.userPwd
	}
	var uri = 'news/changeLogo?userId=' + data.userId + '&userPic=' + data.userPic + '&passWord=' + data.userPwd

	doJavaGet(uri,function(result){
		if(result.code == 0){
			layer.msg('修改成功')

			// 更新localstorage信息
			userinfo.userPic = data.userPic
			userinfo_str = JSON.stringify(userinfo)
			localStorage.setItem('userinfo',userinfo_str)
			$("#user_pic")[0].src = data.userPic
		}else if(result.code == -1){
			layer.msg('修改失败')
		}
	})


}


// 绑定微信显示
$(function(){
	if (userinfo) {
		$('.wechat-bind-user').css('display','none')
	}else{
		$('.wechat-bind-user').css('display','none')
	}
})
