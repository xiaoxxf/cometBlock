var keyWord = getUrlParam('serach_word_by_navbar')
var currentPage = 1;
var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

window.onload = function(){
  searchUser();
}

function searchUser(){
  currentPage = 1;
  ui.loading = true;
  ui.noMoreData = false;

  var uri = 'news/quaryusers?currentPage=' + currentPage + '&pageSize=12&realName=' + keyWord + '&loginUser=' + userId
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

// 关注用户
var current_follow_button = null;
function followUser(e){
	current_follow_button = e;
	var followingId = $(e).data('followingid');

	var uri = 'attention/attent?attentionId=' + followingId  + '&creator=' + userId + '&password=' + userinfo.userPwd + '&type=1';

	doJavaGet(uri,function(res){
		if (res.code == 0) {
			$(current_follow_button).text('已关注');
			$(current_follow_button).removeClass('pay_attent');
			$(current_follow_button).addClass('has_followed');
			$(current_follow_button).removeAttr('onclick');
			// layer.msg('关注成功',{time:1000});
		}
	});

}

// $('.search_user_result').on('click', $('.user_name'), function(e){
// 	var self = $(e.target);
// 	var	search_id = self.data('userid');
// 	window.location = 'personal-homepage.html?userId=' + search_id
// })
