//重置密码校验
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

//点击左边显示
//function baseSettingClick() {
//	$(".show_table").css("display", "block");
//	$(".show_table_msg").css("display", "none");
//
//}
//
//function informationClick() {
//	$(".show_table_msg").css("display", "block");
//	$(".show_table").css("display", "none");
//}



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
	$(".show_table").fadeIn();
	$("show-table2").fadeOut();
	$(".person-left-menu li a").eq(0).addClass("toogle-acive");
}
if(pT == 2){
	$(".show_table2").fadeIn();
	$(".person-left-menu li a").eq(1).addClass("toogle-acive");
}

})

 $(document).ready(function(){
        $(".person-left-menu li a").click(function(){
        var order = $(".person-left-menu li a").index(this);//获取点击之后返回当前a标签index的值

				// doJavaGet(uri, function(){
				//
				// 	var append_class = null
				// 	var id = null
				//
				// 	switch (order) {
				// 		case 0:
				// 			console.log('这是头像')
				// 			break;
				// 		case 1:
				// 			append_class = '.quote-list'
				// 			id = 'quote'
				// 			break;
				// 		case 2:
				// 			append_class = '.like-list'
				// 			id = 'like'
				// 			break;
				// 		case 3:
				// 			append_class = '.comment-list'
				// 			id = 'comment'
				// 			break;
				// 		case 4:
				// 			append_class = '.pass-list'
				// 			id = 'pass'
				// 			break;
				// 		case 5:
				// 			append_class = '.reject-list'
				// 			id = 'reject'
				// 			break;
				// 		default:
				// 			// console.log('这是默认')
				// 			break;
				// 	}
				//
				// 	var tpl = document.getElementById(id).innerHTML;
				// 	var content = template(tpl, {list: result.datas});
				//  $(append_class).html('')
				// 	$(append_class).append(content)
				// })

        $(".cont" + order).show().siblings("div").hide();//显示class中con加上返回值所对应的DIV
    });
})

//发送验证码
function sendCode() {
	var str = localStorage.getItem('userinfo');
	var jsonStr = JSON.parse(str) //从一个字符串中解析出json对象
	$("#ownname").val(jsonStr.realName) //输入框获取localStorage中存储值
	var realName = jsonStr.realName;
	var tel = jsonStr.tel;
	var uri = 'news/virty?' + 'realName=' + realName + '&phoneNo' + tel
	doJavaGet(uri, function(res) {

		if(res != null && res.code == 0) {
			getCode() //验证码验证
		} else {
			layer.msg(res.msg);
		}

	}, "json");

}

//验证码校验
function getCode() {
	//var uri = 'blockchain/getCode?phoneNo=' + $("#session_phone").val()
	var str = localStorage.getItem('userinfo');
	var jsonStr = JSON.parse(str)
	var tel = jsonStr.tel;
	var uri = 'blockchain/getCode?phoneNo=' + tel //输入手机号请求验证码验证
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
	sendCode()
})


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
				location.reload()
			}, 1500);

		} else {

			layer.msg(res.msg);

		}

	}, "json");

});

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

//预览图片

function previewICon() {
	var preview = document.querySelector('img');
	var file = document.querySelector('input[type=file]').files[0];
	var reader = new FileReader();

	reader.addEventListener("load", function() {
		preview.src = reader.result; //拿到图片的结果
	}, false);

	if(file) {
		reader.readAsDataURL(file);
	}
}
var ui = {
	'fileUpLoading': false
}
var allFile = {
	'projectLogo': '',
}
var t = null

function doUpload(e) {
	if (ui.fileUpLoading || e.files.length == 0) {
    return false
  }

	var file = e.files[0];
	var formData = new FormData();
	t = e;
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
			if(t.className == 'user_logo') {
				allFile.projectLogo = data.datas[0]
				$('.upload-project-logo').attr('disabled', 'disabled')
			} else if(t.className == 'member_pic') {
				// 把照片的值存在对应的input
				member_pic_name = t.parentElement.parentElement.nextElementSibling.firstElementChild
				member_pic_name.value = data.datas[0]
				// 上传成功后，上传按钮不可选
				$(t.parentElement.nextElementSibling).attr('disabled', 'disabled')
			}
			 ui.fileUpLoading = false
     	 	 layer.msg('上传成功')
		},
		 error:function(e){
	       ui.fileUpLoading = false
	       alert("上传错误，请重试！");
	    }

	});

}

/*消息通知提示

1.把数据定义参数传到后台
2.ajax请求返回后台数据
3.数据显示
*/

var num = 1;
//时间戳转化格式
function changTime(time) {
	var time = time.replace('T', ' ');
	var date1 = new Date(Date.parse(time.replace(/-/g, "/")));
	var timestamp2 = Date.parse(new Date(date1));

	var timeStr = (new Date() - timestamp2) / 1000
	if(timeStr < 60) { //多少分钟以内的
		time = '1 分钟'
	} else if(60 <= timeStr && timeStr < 3600) { //	一个小时以内

		time = parseInt(timeStr / 60) + " 分钟前";

	} else if(24 * 3600 > timeStr && timeStr >= 3600) { //24 小时以内

		time = parseInt(timeStr / 3600) + " 小时前";
	} else {
		time = parseInt(timeStr / 3600 / 24) + " 天前";
	}
	return time
}
//显示内容
function dataShowMesssage(data) {
	var html = ''
	for(var i = 0; i < data.length; i++) {
		var test = data[i].newsId
		//          html = html + '<li data-newId=' + test + ' > <span>' + (i + 1) + '</span><a  href=detail.html?newsId=' + data[i].newsId + '>' + data[i].title + '</a></li>'

		html = html + '<li class="" data-newid=' + test + '><a href="/u/ea0b38543aae" class="avatar_receive"><img src="" ' + data[i].userIcon +
			'></a><div class="info"><div><a class="user" href="">' + data[i].username + ' </a><span class="comment-slogan">评论了我的产品</span></div><div class="time">' + changTime(data[i].time) +

			'</div>	</div><p>' + data[i].content + '</p><div class="meta"><a class="function-btn"><i class="fa fa-commenting-o"></i><span>回复</span></a>'
		'<a href="chain-detail.html" class="function-btn"><i class="	fa fa-external-link"></i><span>查看对话</span></a></div></div></li>'

	}
	$('#datasList').append(html);
};

function loadMessage(days) {
	var uri = 'news/quary?currentPage=' + num + '&pageSize=' + 10;
	doJavaGet(uri, function(res) {
		if(res != null && res.code == 0) {
			dataShowMesssage(res.datas)
		}
	}, "json");
}
///loadMessage(1);
