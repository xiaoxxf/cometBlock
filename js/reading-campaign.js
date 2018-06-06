var teamTopicInfo = []
var gzteamTopicInfo=[]
var current_topic_id = ''
window.onload = function(){
  getTeamTopic();
  getGZTeamTopic();
}

// 获取深圳三个小队专题信息
function getTeamTopic(){
  var subject_page = 1
  var uri = 'topic/seachTopic?currentPage=' + subject_page + '&pageSize=5&creator=db2bc250-1b48-4add-b0c4-bc849bf79723'
  // ui_subject.loading = true;
  // ui_subject.noMoreData = false;
  doJavaGet(uri, function(res){
    for (var i = 0; i < 3; i++) {
      teamTopicInfo.push(res.datas[i])
    }
    if (res.datas.length > 0) {
      var tpl = document.getElementById('team_topic_tpl').innerHTML;
      var content = template(tpl, {list: teamTopicInfo});
      $('.reading-bottom_box').append(content);
    }
    // ui_subject.loading = false;
  })
}
//获取广州三小分队专题信息
function getGZTeamTopic(){
	var subject_page=1
  var uri = 'topic/seachTopic?currentPage=' + subject_page + '&pageSize=5&creator=c8ed1e11-4603-495f-a57a-2b74e2b12018'
	doJavaGet(uri,function(res){
		for (var i = 0; i < 3; i++) {
      gzteamTopicInfo.push(res.datas[i])
    }
    if (res.datas.length > 0) {
      var tpl = document.getElementById('gzteam_topic_tpl').innerHTML;
      var content = template(tpl, {list: gzteamTopicInfo});
      $('.gz_reading-bottom_box').append(content);
    }
	})
}
// 向专题投稿（弹窗） --- 加载我的文章
function showMyArticle(e){
  // 判断是否登录
  if(!wechatBindNotice()){
    return;
  }
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
    return
  }

  current_topic_id = $(e).data('topicid')
  var area_width
  var area_height
  if($(window).width() <= 767)
  {
    area_width = '320px'
    area_height = '500px'
  }else{
    area_width = '520px'
    area_height = '600px'
  }
  layer.open({
      type: 1,
      shadeClose:true,
      title: 0,
      skin: 'layui-layer-report', //加上边框
      area: [area_width,area_height ], //宽高
      content: $("#templay-send-topic").html()
  });
  getMyArticle();

}

var ui_my_article = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}
var my_article_currentPage = 1;
var my_article_pageSize = 12;
// 加载我的文章
function getMyArticle(){
	if (ui_my_article.loading) {
		return
	}

	ui_my_article.loading = true;

	var uri = 'blockchain/quaryReviewByUser?currentPage=' + my_article_currentPage + '&pageSize=' + my_article_pageSize
						+ '&creator=' + userId + '&type=4';

	doJavaGet(uri, function(result){
		var tpl = document.getElementById('my_article_list').innerHTML;
		var content = template(tpl, {list: result.datas});
		$('.my-article-list').html('');
		$('.my-article-list').append(content);
		if (result.datas.length == my_article_pageSize) {
			$('.load_more_my_article_result').css('display','block')
			$('.load_more_my_article_result').html('点击加载更多')
		}
		ui_my_article.loading = false;
	})

}
// 加载更多我的文章
function load_more_my_article_result(){
	if (ui_my_article.loading || ui_my_article.noMoreData) {
		return
	}
	$('.load_more_my_article_result').html('加载中...');

	ui_my_article.loading = true;
	my_article_currentPage++;

	var uri = 'blockchain/quaryReviewByUser?currentPage=' + my_article_currentPage + '&pageSize=' + my_article_pageSize
						+ '&creator=' + userId + '&type=4';

	doJavaGet(uri, function(result){
		var tpl = document.getElementById('my_article_list').innerHTML;
		var content = template(tpl, {list: result.datas});
		$('.my-article-list').append(content);

		if (result.datas.length < my_article_pageSize) {
			ui_my_article.noMoreData == true
			$('.load_more_my_article_result').html('已无更多')
		}else{
			$('.load_more_my_article_result').html('加载更多')
		}

		ui_my_article.loading = false;

	})

}

// 投稿
var contribute_ui = {
	'submiting': false
}
var _send_button = null;
function contribute_to_topic(e){

	contribute_ui.submiting = true
	_send_button = e;
	var self =  $(e),
			reviewId = self.data('reviewid'),
			topicId = current_topic_id;

	var uri = 'topic/submission?creator=' + userId + '&password=' + userinfo.userPwd
           + '&topicId=' + topicId + '&reviewId=' + reviewId

  doJavaGet(uri,function(result){
    if (result.code == 0) {
      layer.msg('投稿成功');
      $(_send_button).text('已投稿')
			getTopicArticle()
    }else if(result.code == -1){
      layer.msg(result.msg);
    }
		contribute_ui.submiting = false
  })
}

function jumpToArticleDetail(e){
	var self = $(e),
			reviewId = self.data('reviewid');
	window.open('comment.html?reviewId=' + reviewId);
}
