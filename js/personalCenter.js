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
//http://127.0.0.1:8020/cometBlock/personalCenter.html?personType=1
//加入personType=1/2  进入基础设置 /消息

var pT = getUrlParam("personType");
$(".person-left-menu li a").removeClass('toogle-acive');
$(function(){
if(pT == 1){
	$(".cont0").fadeIn();
	$(".person-left-menu li a").eq(0).addClass("toogle-acive");
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
				article_flag = false
				noMoreData = false
        var order = $(".person-left-menu li a").index(this);//获取点击之后返回当前a标签index的值
				switch (order) {
					case 0:
						type = 0;
						count_class = ''
						break;
					case 1:
						append_class = '.quote-list'
						count_class = '.quote-count'
						id = 'quote'
						type = '1'
						break;
					case 2:
						append_class = '.comment-list'
						count_class = '.comment-count'
						id = 'comment'
						type = '2'
						break;
					case 3:
						append_class = '.like-list'
						count_class = '.like-count'
						id = 'like'
						type = '3'
						break;
					case 4:
						append_class = '.pass-list'
						count_class = '.pass-count'
						id = 'pass'
						type = '4'
						break;
					case 5:
						append_class = '.reject-list'
						count_class = '.reject-count'
						id = 'reject'
						type = '5'
						break;
					case 6:
						type = null
						article_flag = true
						break;
					default:
						// console.log('这是默认')
						break;
				}

				if (type) {
					currentPage = 1
					var uri = 'news/getMessage?userId=' + userinfo.id + '&userPwd=' + userinfo.userPwd + '&currentPage=' + currentPage + '&pageSize=12' + '&type=' + type

					doJavaGet(uri, function(result){
						if (result.datas.length < 12) {
							noMoreData = true
						}
						// console.log(result)
						var tpl = document.getElementById(id).innerHTML;
						var content = template(tpl, {list: result.datas});
					 	$(append_class).html('')
						$(append_class).append(content)

					})
				}else if(article_flag) {
					var currentPage = 1
					var long_comment_uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12' + '&type=2' + '&creator=' + userinfo.id;
					$('.my-article').html('')
					doJavaGet(long_comment_uri,function(result){
						if (result.datas.length < 12) {
							noMoreData = true
						}
						var tpl = document.getElementById('article_tpl').innerHTML;
						var content = template(tpl, {list: result.datas});

						$('.my-article').append(content)
					})
					var article_uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12' + '&type=4' + '&creator=' + userinfo.id;
					doJavaGet(article_uri,function(result){
						if (result.datas.length < 12) {
							noMoreData = true
						}
						var tpl = document.getElementById('article_tpl').innerHTML;
						var content = template(tpl, {list: result.datas});
						$('.my-article').append(content)
					})

				}

        $(".cont" + order).show().siblings("div").hide();//显示class中con加上返回值所对应的DIV
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


//发送验证码
//function sendCode() {
//	var str = localStorage.getItem('userinfo');
//	var jsonStr = JSON.parse(str) //从一个字符串中解析出json对象
//	$("#ownname").val(jsonStr.realName) //输入框获取localStorage中存储值
//	var realName = jsonStr.realName;
//	var tel = jsonStr.tel;
//	var uri = 'news/virty?' + 'realName=' + realName + '&phoneNo' + tel
//	doJavaGet(uri, function(res) {
//		debugger
//		if(res != null && res.code == 0) {
//			getCode() //验证码验证
//		} else {
//			layer.msg(res.msg);
//		}
//
//	}, "json");
//
//}

//验证码校验
function getCode() {
	//var uri = 'blockchain/getCode?phoneNo=' + $("#session_phone").val()
	var str = localStorage.getItem('userinfo');
	var jsonStr = JSON.parse(str)
	var tel = jsonStr.tel;
	var uri = 'blockchain/getCode?phoneNo=' + tel //输入手机号请求验证码验证
	doJavaGet(uri, function(res) {
		if(res != null && res.code == 0) {
			debugger
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
		count = 60
	}

}

function CountDown() {
	countdown = setInterval(dingshiqi, 1000);

}
//点击验证
$('#send_code').click(function() {
	$("#send_code").css("text-decoration", "none");
	$("#send_code").css("color", "white");
	getCode()
})


//修改昵称

$("#save_realname").click(function(){
	var str = localStorage.getItem('userinfo');
	var jsonStr = JSON.parse(str); //从一个字符串中解析出json对象
	var realName=jsonStr.realName;
	var userPwd =  jsonStr.userPwd;
	var userId = jsonStr.id;
	var uri = 'news/changeRealname?realName='+realName+"&passWord="+userPwd+"&userId="+userId
	doJavaGet(uri, function(res) {
		debugger
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

})
/*
 	var tempStr=JSON.stringify(temp);
			localStorage.setItem("temp",tempStr);
			debugger
			var obj=localStorage.getItem("temp");
			var tempStr=JSON.parse(obj);
			var objvalue=JSON.stringify(tempStr);
			localStorage.setItem("temp",objvalue);
 * */

//保存修改信息
$("#save-register-info").click(function() {

	var param = {}
	var str = localStorage.getItem('userinfo');
	debugger
	var jsonStr = JSON.parse(str) //从一个字符串中解析出json对象
	if($("#newPwd").val()==""|| !$("#newPwd")){//新密码为空

		layer.tips('请输入新密码', '#newPwd', {
			tips: [2, '#3595CC'],
			time: 2000
		});
		return
	}

	if($("#phone_code").val()==""|| !$("#phone_code")){//新密码为空

		layer.tips('请输入验证码', '#phone_code', {
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
		param.code = $("#phone_code").val();
		newpassWord =  $("#newPwd").val();
	}else{

		layer.tips('请先登录', '#phone_code', {
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
		$('#ownname').val(userinfo.realName)
	}else{
		preview.src = 'img/normal-user.png'
	}
})

//预览图片
$('#user_logo_input').on('change',function(){
	var preview = $('#result').find('img')[0];
	var file = this.files[0]
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

$('.upload-project-logo').on('click',function(){

	var file = $('#user_logo_input')[0].files[0]
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
})

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


//新建专题
// $("#new_subject").click(function(){
//  	$("#show_subject").toggle();
//  	$(".menu").toggle();
//  });
