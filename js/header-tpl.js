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
var currentPage = 1;

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


// 点击写文章页面
$('#writting-article').on('click',function(){
  if(userId == undefined){
    layer.open({
      closeBtn:1,
      title: '',
      content: '请先登录您的账号',
      btn: ['登录', '注册'],
      yes: function(){
        window.location.href='login.html'
      },
      btn2: function(){
        window.location.href='register.html'
      }
    });
  }else{
    window.location.href='article-new.html';
  }
})

//点击登录手动跳转

$(document).on('click','#nav_login',function () {
    var currentJumpHref = window.location.href;
    window.localStorage.setItem('currentJumpHref',currentJumpHref);
    window.location.href = 'login.html';
})

//输入框下拉事件
var liDown=$(".nav_search_list li");
var key_word = $('#head_search').val();
var index = 0; //判断键盘选择
var list_show_flag = false; //判断下拉选单是否已显示

//  输入时显示下拉菜单 & 搜索框内容绑定下拉框内容
$("#head_search").keyup(function(e){
    key_word = $('#head_search').val()
		if (!$('#head_search').val()) {
			$(".nav_search_list").css("display","none");
      list_show_flag = false;
		}else{
			$(".nav_search_list").css("display","block");
      list_show_flag = true;
		}

		key_word = $(e.target).val()
    $('#search_project').html('项目搜索: ' + key_word)
    $('#search_article').html('内容搜索: ' + key_word)
    $('#search_news').html('新闻搜索: ' + key_word)
    $('#search_user').html('用户搜索: ' + key_word)

});

// 鼠标选择
$(".nav_search_list").on("mouseenter mouseleave", 'li',function(e){

  if ((e.type == "mouseenter")) {
    $(liDown).removeClass('nav_search_list_focus')
    $(e.target).addClass('nav_search_list_focus')

  }else if((e.type == "mouseleave")){
    $(e.target).removeClass('nav_search_list_focus')
  }

})

$('#head_search').keydown(function(e){
  if ( !list_show_flag ) {
    return
  }

  for (var i = 0; i < liDown.length; i++) {
    if ( $(liDown[i]).hasClass('nav_search_list_focus') ) {
      index = i;
      break;
    }
  }

	switch (e.keyCode) {
			case 38: //上
        if (index > 0 ) {
          $(liDown).removeClass('nav_search_list_focus')
          index--;
          // console.log(index)
          $(liDown[index]).addClass('nav_search_list_focus')
        }

			  break;
			case 40: // 下
        if (index < 3 ) {
          $(liDown).removeClass('nav_search_list_focus')
          index++;
          // console.log(index)
          $(liDown[index]).addClass('nav_search_list_focus')
        }
        break;
	}

  if (e.keyCode == 13) {
    switch (index) {
      case 0:
    	   window.location.href='chain.html?serach_word_by_navbar=' + key_word
        break;
      case 1:
    	   window.location.href = 'hot-article.html?serach_word_by_navbar=' + key_word
        break;
      case 2:
      	window.location.href = 'news.html?serach_word_by_navbar=' + key_word
        break; 
      case 3:
				window.location.href = 'search_user.html?serach_word_by_navbar=' + key_word
        break;
    }

  }

})


// 失去焦点时隐藏下拉菜单
$("#head_search").blur(function(e){
  $(liDown).removeClass('nav_search_list_focus')
  $(liDown[0]).addClass('nav_search_list_focus')
	$(".nav_search_list").css("display","none");
  	list_show_flag = false;
});

// 搜索项目
var search_project = document.getElementById('search_project')
search_project.addEventListener('mousedown',function() {
	window.location.href='chain.html?serach_word_by_navbar=' + key_word
})


// 搜索内容
var search_article = document.getElementById('search_article')
search_article.addEventListener('mousedown',function() {
	window.location.href = 'hot-article.html?serach_word_by_navbar=' + key_word

})

// 搜索新闻
var search_news = document.getElementById('search_news')
search_news.addEventListener('mousedown',function() {
	window.location.href = 'news.html?serach_word_by_navbar=' + key_word
})

// 搜索用户
var search_user = document.getElementById('search_user')
search_user.addEventListener('mousedown',function() {
	window.location.href = 'search_user.html?serach_word_by_navbar=' + key_word
})
