var userinfo = JSON.parse(localStorage.getItem('userinfo'))
var like_tpl_flag = false
var comment_tpl_flag = false
var notification_tpl_flag = false

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
var currentPage = 1

$(document).ready(function(){
  $(".login-right").hover(function(){
    	$(".show-alert-inform").css("display","block");

			if ( !like_tpl_flag ) {
				// 渲染点赞
				currentPage = 1
				type = 3
				var uri = 'news/getMessage?userId=' + userinfo.id + '&userPwd=' + userinfo.userPwd + '&currentPage=' + currentPage +
										'&pageSize=12'
				 						+ '&type=' + type
				doJavaGet(uri,function(result){
					if (result.datas.length != 0) {
						var tpl = document.getElementById('like_tpl').innerHTML;
						var content = template(tpl, {list: result.datas});
						$('.like-message').html('')
						$('.like-message').append(content)
					}
					like_tpl_flag = true
				})
			}


    },function(){
    	$(".show-alert-inform").css("display","none");
  });
});

//通知

// li弹出通知
$(document).ready(function(){
    $(".show-alert-inform-top li a").click(function(){
        var order = $(".show-alert-inform-top li a").index(this);//获取点击之后返回当前a标签index的值
				console.log('order:' + order)
        $(".inform" + order).show().siblings("div").hide();//显示class中con加上返回值所对应的DIV
   			$(".show-alert-inform-bottom").css("display","block");

				// 点击渲染
				// 评论2 + 引用1
				if (order == 1) {
					if ( !comment_tpl_flag ) {
						currentPage = 1
						type = 1
						var uri = 'news/getMessage?userId=' + userinfo.id + '&userPwd=' + userinfo.userPwd +
											'&currentPage=' + currentPage + '&pageSize=12' + '&type=2'

						// 先渲染评论
						doJavaGet(uri,function(result){

							var tpl = document.getElementById('comment_tpl').innerHTML;
							var content = template(tpl, {list: result.datas});

							$('.comment-message').html('')
							$('.comment-message').append(content)

							// 渲染引用
							var uri_quote = 'news/getMessage?userId=' + userinfo.id + '&userPwd=' + userinfo.userPwd +
							 					'&currentPage=' + currentPage + '&pageSize=12' + '&type=1'
							doJavaGet(uri_quote,function(result){
								if (result.datas.length == 0) {
									return
								}
								var tpl = document.getElementById('quote_tpl').innerHTML;
								var content = template(tpl, {list: result.datas});
								$('.comment-message').append(content)
							})

							comment_tpl_flag = true
						})
					}

				}
				// 审核通过4 + 驳回5
				else if(order == 2){
					if ( !notification_tpl_flag ) {
						currentPage = 1
						type = 4
						var uri = 'news/getMessage?userId=' + userinfo.id + '&userPwd=' + userinfo.userPwd +
											'&currentPage=' + currentPage + '&pageSize=12' + '&type=' + type

						// 先渲染审核
						doJavaGet(uri,function(result){
							if (result.datas.length !== 0) {
								var tpl = document.getElementById('notification_tpl').innerHTML;
								var content = template(tpl, {list: result.datas});
								$('.notification-message').html('')
								$('.notification-message').append(content)
							}

							// 渲染驳回
							var uri = 'news/getMessage?userId=' + userinfo.id + '&userPwd=' + userinfo.userPwd +
												'&currentPage=' + currentPage + '&pageSize=12' + '&type=5'
							doJavaGet(uri,function(result){
								if (result.datas.length != 0) {
									var tpl = document.getElementById('reject_tpl').innerHTML;
									var content = template(tpl, {list: result.datas});
									$('.notification-message').append(content)
								}

								notification_tpl_flag = true
							})

						})
					}

				}
    });
})





$(function(){
	if (userinfo) {
		var uri = 'news/getMessage?userId=' + userinfo.id + '&userPwd=' + userinfo.userPwd + '&currentPage=1'  + '&pageSize=12'
		doJavaGet(uri,function(result){
			count = result.count
			if (count!=0) {
				$('.badge-inform').html(count)
			}
		})
	}

})


var dictionary = []
$(function(){
	var uri = 'blockchain/quary?parentId=20'
	doJavaGet(uri, function(result){
		for (var i = 0; i < result.datas.length; i++) {
			dictionary[i] = result.datas[i].dicValue
		}
	})
})

// 头部通知中心点击已读
$('.notification').on('click', '.show-alert-inform-list' , function(e){
	if (userinfo) {
		var self = $(e.currentTarget)
		var messageId = self.data('messageid')
		var status = self.data('status')
		if ( $(self).hasClass('unread') ) {
			var uri = "news/readMessage?userId=" + userinfo.id + "&userPwd=" + userinfo.userPwd + "&status=1" + "&messageId=" + messageId
			doJavaGet(uri, function(e){
				self.removeClass('unread')
				count = $('.badge-inform').html()
				if ( count == "" || count-1 == 0) {
					$('.badge-inform').html('')
				}else{
					$('.badge-inform').html(count-1)
				}
			})
		}
	}
})

$('#writting-article').on('click',function(){
	window.location.href='article-new.html';
})
