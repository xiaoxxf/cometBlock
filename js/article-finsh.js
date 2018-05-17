var ui = {
  'loading': false,
  'noMoreData': false,
  'submiting': false
}
var reviewId = ''
window.onload = function(){
  getArticle();
  getMyTopic();
  getRecommendTopic();
  getReadingActivityTopic()
}

// 获取最近一篇文章，即新增的文章
function getArticle(){
  var uri = 'blockchain/quaryReviewByUser?currentPage=1&pageSize=1'
            + '&creator=' + userId + '&type=4';
  doJavaGet(uri,function(res){
    reviewId = res.datas[0].reviewId;
    $('.article_title').text('《' + res.datas[0].textTitle + '》');
    $(".send_sucess").attr('href','comment.html?reviewId='+reviewId)

  })
}

// 获取我管理的专题
function getMyTopic(){
  var uri = 'topic/seachTopic?currentPage=1&pageSize=12&creator=' + userId
  doJavaGet(uri,function(result){

    var search = document.getElementById('my_topic_tpl').innerHTML;
    var content = template(search, {list: result.datas});
    $('.my_topic_list').append(content);

  }, "json");
}


// 获取推荐专题
function getRecommendTopic(){
  var uri = 'topic/seachTopic?currentPage=1&pageSize=6'
	doJavaGet(uri,function(result){

		var search = document.getElementById('recommend_topic_tpl').innerHTML;
		var content = template(search, {list: result.datas});
		$('.recommen_topic_list').append(content);

	}, "json");
}

$('.search_topic_article').on('click',function(){
  searchSubject();
})

$('.search_topic_article').keyup(function(){
  keyEnterSearchSubject(this)
})

// 搜索专题
var search_subject_page = 1;
var key_word_subject = '';
function searchSubject(){

	key_word_subject = $('.search_topic_article').val()
	if (key_word_subject == '') {
		return false
	}
  ui.loading = true;
  ui.noMoreData = false;
  search_subject_page = 1;
  // 隐藏管理、推荐专题，显示搜索结果
  $('.manage_topic_subject').css('display','none')
  $('.comment_topic_subject').css('display','none')
  $('.search_topic').css('display','')


	var uri = 'topic/seachTopic?currentPage=' + search_subject_page + '&pageSize=12'
            + '&topic=' + key_word_subject
	doJavaGet(uri,function(result){
		var search = document.getElementById('search_topic_tpl').innerHTML;
		var content = template(search, {list: result.datas});
    $('.search_topic_list').html('')
		$('.search_topic_list').append(content);
    // 有结果时显示加载更多
    if (result.datas.length == 12) {
      $('.load_more_subject_result').css('display', 'block')
    }
    ui.loading = false;

	}, "json");
}

// 搜索专题绑定键盘事件
function keyEnterSearchSubject(e){
  // 回车键搜索
  if(event.keyCode ==13){
    searchSubject();
  }

  // 删除键，判断显示推荐还是搜索结果
  else if (event.keyCode == 8) {
    if ( !$(e).val() ) {
      // 显示推荐专题，隐藏搜索结果及加载更多
      $('.manage_topic_subject').css('display','')
      $('.comment_topic_subject').css('display','')
      $('.search_topic').css('display','none')
    }
  }
}

// 加载更多搜索专题的结果
function load_more_search_subject_result(){
  if (ui.loading || ui.noMoreData) {
    return
  }
  ui.loading = true;
  search_subject_page++;
  $('.load_more_subject_result').text('加载中')
  var uri = 'topic/seachTopic?currentPage=' + search_subject_page + '&pageSize=12'
            + '&topic=' + key_word_subject
  doJavaGet(uri,function(result){
    if (result.datas.length == 0) {
      ui.noMoreData = true;
      // $('.load_more_subject_result').css('display', 'block')
      $('.load_more_subject_result').text('已无更多数据')
    }else {
      var search = document.getElementById('search_subject_list').innerHTML;
      var content = template(search, {list: result.datas});
      $('.list_subject_item').append(content);
      // $('.load_more_subject_result').css('display', 'block')
      $('.load_more_subject_result').text('查看更多')
    }
    ui.loading = false;
  }, "json");
}


$('.send_to_topic').on('click',function(){
   sendArticleToSubject(this)
})

// 投稿到专题 & 收录文章到专题
function sendArticleToSubject(e){
  // if (ui.submiting) {
  //   return
  // }
  // ui.submiting = true;
  _send_button = e;
  var self =$(e),
      topicId = self.data('subjectid');
  var uri = 'topic/submission?creator=' + userinfo.id + '&password=' + userinfo.userPwd
           + '&topicId=' + topicId + '&reviewId=' + reviewId

  doJavaGet(uri,function(result){
    if (result.code == 0) {
      layer.msg('投稿成功');
      $(_send_button).text('已投稿')
    }else if(result.code == -1){
      layer.msg(result.msg);
    }
    // ui.submiting = false;
  })
}


// 读书活动专题
function getReadingActivityTopic(){
  var subject_page = 1
  var uri = 'topic/seachTopic?currentPage=' + subject_page + '&pageSize=5&creator=db2bc250-1b48-4add-b0c4-bc849bf79723'
  doJavaGet(uri,function(result){
    result.datas.shift();
    result.datas.shift();
    var search = document.getElementById('reading_activity_topic_tpl').innerHTML;
    var content = template(search, {list: result.datas});
    $('.reading_activity_topic_list').append(content);

  }, "json");
}
