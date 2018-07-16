var follow_people_type = getUrlParam('type');	//查询关注动态数据	type =1 2 3 4//关注：用户 专题 项目 粉丝
var currentPage = 1;
var pageSize = 12;
var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

window.onload = function(){
  searchUser();
}

$(function(){
	if (type == 1) {
		$('title').html('我关注的人')
	}else if(type == 5){
		$('title').html('我的粉丝')
	}
})

function searchUser(){
  currentPage = 1;
  ui.loading = true;
  ui.noMoreData = false;

  var uri = 'attention/quaryAttentionData?currentPage=' + currentPage + '&pageSize='
            + pageSize + '&creator=' + userId  + '&password=' + userinfo.userPwd +'&type=' + follow_people_type
  $(".waiting-data").fadeIn();

  doJavaGet(uri, function(result){
    if (result.datas.length == 0 ) {
      $(".waiting-data").hide();
      $('.no-result').css('display','')
    }
    $('.search_user_result').html('')
    var tpl = document.getElementById('user_search_tpl').innerHTML;
    var content = template(tpl, {list: result.datas});

    $('.search_user_result').append(content)
    $(".waiting-data").hide();
    ui.loading = false;
  })
}

function loadMoreUser(){
	if (ui.loading || ui.noMoreData) {
		return
	}
	currentPage++;
	ui.loading = true;

	var uri = 'attention/quaryAttentionData?currentPage=' + currentPage + '&pageSize='
						+ pageSize + '&creator=' + userId  + '&password=' + userinfo.userPwd +'&type=' + follow_people_type
	$(".waiting-data").fadeIn();

	doJavaGet(uri, function(result){
		if (result.datas.length == 0 ) {
			$(".waiting-data").hide();
			$('.no-result').css('display','');
			ui.noMoreData = true;
		}
		$('.search_user_result').html('')
		var tpl = document.getElementById('user_search_tpl').innerHTML;
		var content = template(tpl, {list: result.datas});

		$('.search_user_result').append(content)
		$(".waiting-data").hide();
		ui.loading = false;
	})
}

// 关注用户
// var current_follow_button = null;
// function followUser(e){
// 	current_follow_button = e;
// 	var followingId = $(e).data('followingid');
//
// 	var uri = 'attention/attent?attentionId=' + followingId  + '&creator=' + userId + '&password=' + userinfo.userPwd + '&type=1';
//
// 	doJavaGet(uri,function(res){
// 		if (res.code == 0) {
// 			$(current_follow_button).text('已关注');
// 			$(current_follow_button).removeClass('pay_attent');
// 			$(current_follow_button).addClass('has_followed');
// 			$(current_follow_button).removeAttr('onclick');
// 			// layer.msg('关注成功',{time:1000});
// 		}
// 	});
// }

// $('.search_user_result').on('click', $('.user_name'), function(e){
// 	var self = $(e.target);
// 	var	search_id = self.data('userid');
// 	window.location = 'personal-homepage.html?userId=' + search_id
// })
