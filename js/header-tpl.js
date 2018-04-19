//将id保存在cookie
var userMsg = localStorage.getItem('userinfo'); //存储
userMsg = JSON.parse(userMsg);

$(document).ready(function() {
	$("#user_mess_click").click(function() {
		$(".more-items").toggle();
	});
});

//	通知
$(document).ready(function() {
	$(".login-right").on("hover",function(){
		$(".show-alert-inform").toggle();
	})
});

//通知显示隐藏提示面板
$(document).ready(function(){
  $(".login-right").hover(function(){
    $(".show-alert-inform").css("display","block");
    },function(){
    $(".show-alert-inform").css("display","none");
  });
});

//通知

// li弹出通知
$(document).ready(function(){
    $(".show-alert-inform-top li a").click(function(){
        var order = $(".show-alert-inform-top li a").index(this);//获取点击之后返回当前a标签index的值
        $(".inform" + order).show().siblings("div").hide();//显示class中con加上返回值所对应的DIV
   		$(".show-alert-inform-bottom").css("display","block");
    });
})
