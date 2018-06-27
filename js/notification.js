//重置密码校验
// var userinfo = JSON.parse(localStorage.getItem('userinfo'));
var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

var dictionary = [];
$(function(){
	var uri = 'blockchain/quary?parentId=20'
	doJavaGet(uri, function(result){
		for (var i = 0; i < result.datas.length; i++) {
			dictionary[i] = result.datas[i].dicValue
		}
	})
})

//左边点击互相切换效果
$(".person-left-menu li a").on('click', function(e) {
	e.preventDefault()
	e.stopPropagation()
	$(this).parent().parent().find('a').removeClass('toogle-acive');
	$(this).addClass('toogle-acive');
})


//地址栏传入参数，从哪里进来拼上参数即可
//加入personType=1/2  进入基础设置 /消息

var pT = getUrlParam("personType");
$(".person-left-menu li a").removeClass('toogle-acive');
$(function(){
	if(pT == 1){
		// $(".cont0").fadeIn();
		$(".person-left-menu li a").eq(0).addClass("toogle-acive");
		// 首次加载时显示引用
		var quote_click = $(".person-left-menu li a").eq(0)[0]
		getMessage(quote_click)
	}
})

// 点击已读
$('.show_right').on('click', '.message' , function(e){
	var self = $(e.currentTarget)
	var messageId = self.data('messageid')
	var uri = "news/readMessage?userId=" + userId + "&userPwd=" + userinfo.userPwd + "&status=1" + "&messageId=" + messageId
	doJavaGet(uri, function(result){
		if (result.code == 0) {
			self.css('background-color','white')
			// 未读条数-1
			var count = $('.badge-inform').html()
			if ( count == "" || count-1 == 0) {
				$('.badge-inform').html('')
			}else{
				$('.badge-inform').html(count-1)
			}

		}else if(result.code == -1){
			layer.msg(result.msg)
		}
	})
})


var append_class = null
var id = null
var type = null  // 1-引用，2-评论（别人对我的长文进行评论），3-点赞，4-审核通过，5-驳回
var currentPage = 1
var noMoreData = false

// 渲染
$(".person-left-menu li a").click(function(){
	getMessage(this);
});

function getMessage(e){
	ui.noMoreData = false;
	ui.loading = true;

	$('.load-more-container-wrap').css('display','none')
	$(".loader1").css('display','none');

	var order = $(".person-left-menu li a").index(e);//获取点击之后返回当前a标签index的值
	switch (order) {
	// case 0:
	// 	type = 0;
	// 	count_class = ''
	// 	break;
	case 0:
		append_class = '.quote-list'
		count_class = '.quote-count'
		id = 'quote'
		type = '1'
		break;
	case 1:
		append_class = '.comment-list'
		count_class = '.comment-count'
		id = 'comment'
		type = '2'
		break;
	case 2:
		append_class = '.like-list'
		count_class = '.like-count'
		id = 'like'
		type = '3'
		break;
	case 3:
		append_class = '.pass-list'
		count_class = '.pass-count'
		id = 'pass'
		type = '4'
		break;
	case 4:
		append_class = '.reject-list'
		count_class = '.reject-count'
		id = 'reject'
		type = '5'
		break;
	case 5:
		append_class = '.topic-list'
		count_class = '.topic-count'
		id = 'topic'
		type = '6'
		break;
	default:
		// console.log('这是默认')
		break;
	}

	if (type) {
	currentPage = 1
	var uri = 'news/getMessage?userId=' + userId + '&userPwd=' + userinfo.userPwd + '&currentPage=' + currentPage + '&pageSize=12' + '&type=' + type

	// $(".waiting-data").fadeIn();
	$(".no-more-hook").css('display','none');


	doJavaGet(uri, function(result){

		if (result.code == 0) {
			if (result.datas.length == 0) {
				ui.noMoreData = true
			}
			// console.log(result)
			var tpl = document.getElementById(id).innerHTML;
			var content = template(tpl, {list: result.datas});
			// $(".waiting-data").hide();

			$(append_class).html('');
			$(append_class).append(content);
		}else if(result.code == -1){
			layer.msg(result.msg)
		}


		ui.loading = false;
	})
	}

	$(".cont" + order).show().siblings("div").hide();//显示class中con加上返回值所对应的DIV
}

var resetTimer = null;
$(window).scroll(function(){
	if (resetTimer) {
		clearTimeout(resetTimer)
	}
	resetTimer = setTimeout(function(){

		var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
		totalheight = parseFloat($(window).height()) + parseFloat(srollPos);

		if ($(document).height() <= totalheight && !noMoreData){
			if (type && !ui.loading && !ui.noMoreData) {
				currentPage += 1
				ui.loading = true
				var uri = 'news/getMessage?userId=' + userId + '&userPwd=' + userinfo.userPwd + '&currentPage=' + currentPage + '&pageSize=12' + '&type=' + type

				$(".loader1").css('display','flex');
				$('.load-more-container-wrap').css('display','')

				doJavaGet(uri, function(result){
					if (result.datas.length == 0) {

						$(".loader1").css('display','none');
						$(".no-more-hook").fadeIn();

						ui.noMoreData = true
					}else{
						console.log(result.datas)
						var tpl = document.getElementById(id).innerHTML;
						var content = template(tpl, {list: result.datas});
						// $(append_class).html('')

						$('.load-more-container-wrap').css('display','none')
						$(".loader1").css('display','none');

						$(append_class).append(content)
						ui.loading = false
					}
				})
			}
		}
	},100)
})

// 全部已读
function readAllMessage(type){
	// 清除未读状态样式
	var uri = "news/readAllMessage?userId=" + userinfo.id + "&userPwd=" + userinfo.userPwd + "&type=" + type

	doJavaGet(uri,function(res){
		if (res.code == 0) {
			$($('.notification—list')[type-1]).children('.unread').removeClass('unread');
			countUnreadMessage(); //重新计算未读消息
		}
	})
}

// 计算未读消息
function countUnreadMessage(){
	if (userId) {
		var uri = 'news/getMessage?userId=' + userinfo.id + '&userPwd=' + userinfo.userPwd + '&currentPage=1'  + '&pageSize=12'
		doJavaGet(uri,function(result){
			if (result.code == 0) {
				result.count ? $('.badge-inform').text(result.count) : $('.badge-inform').text('')
			}

		})
	}
}
