var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}
var topicId = getUrlParam('subjectId') //判断文章是否已被该专题收录

var article_page = 1;

window.onload = function(){
  getTopicDetail();
  getTopicArticle();
}

// 渲染专题信息
function getTopicDetail(){
	// debugger
  var uri = 'topic/seachTopic?currentPage=1&pageSize=12&topicId=' + topicId;

  doJavaGet(uri,function(result){

  $('title').html('专题-' + result.datas[0].topic );
		// if (result.datas[0].description.length > 100) {
		// 	result.datas[0].description = result.datas[0].description.substring(0,100) + "..."
		// }

    var tpl= document.getElementById('topic_detail_tpl').innerHTML;
    var content = template(tpl, {list: result.datas});
    $('.topic_detail').append(content)

    // 渲染左侧专题信息
    $('.topic_title .topic_name').html(result.datas[0].topic);
    $('.topic_title .topic_article_count').html('共收录了 ' + result.datas[0].counts + ' 篇文章');
    $('.topic_info_left .topic_icon')[0].src = result.datas[0].topicPic;
  })
}

// 渲染专题下的文章
function getTopicArticle(){
  ui.loading = true;
  ui.noMoreData = false;

  article_page = 1;
  topicId = getUrlParam('subjectId');
  var uri = 'topic/quaryArticle?topicId=' + topicId + '&currentPage=' + article_page +'&pageSize=12'

  doJavaGet(uri, function(result){
    if (result.datas.length == 0) {
      ui.loading = false;
      ui.noMoreData = true;
      return;
    }

    // 限制内容长度
    for (var i = 0; i < result.datas.length; i++) {

      if (result.datas[i].textContent) {
        result.datas[i].textContent = result.datas[i].textContent.replace(/<[^>]+>/g,"")

        var content_length = null
        if ($(window).width() < 767) {
          content_length = 55
        }else{
          content_length = 120
        }

        if (result.datas[i].textContent.length > content_length) {
          result.datas[i].textContent = result.datas[i].textContent.substring(0,content_length) + "..."
        }
      }
    }

    var tpl= document.getElementById('topic_article_tpl').innerHTML;
    var content = template(tpl, {list: result.datas});
    $('.topic_article_list').html('');
    $('.topic_article_list').append(content);
    ui.loading = false;

  })

}

// 专题文章加载更多
$('.topic_border .read-more').on('click',function(){
  if (ui.loaindg || ui.noMoreData) {
    return
  }
  ui.loading = true;
  $('.topic_border .read-more').text('加载中...')
  article_page++;
  var uri = 'topic/quaryArticle?topicId=' + topicId + '&currentPage=' + article_page +'&pageSize=12'

  doJavaGet(uri, function(result){
    if (result.datas.length == 0) {
      ui.loading = false;
      ui.noMoreData = true;
      $('.topic_border .read-more').text('已无更多');
      return;
    }

    // 限制内容长度
    for (var i = 0; i < result.datas.length; i++) {

      if (result.datas[i].textContent) {
        result.datas[i].textContent = result.datas[i].textContent.replace(/<[^>]+>/g,"")

        var content_length = null
        if ($(window).width() < 767) {
          content_length = 55
        }else{
          content_length = 120
        }

        if (result.datas[i].textContent.length > content_length) {
          result.datas[i].textContent = result.datas[i].textContent.substring(0,content_length) + "..."
        }
      }

    }
    var tpl= document.getElementById('topic_article_tpl').innerHTML;
    var content = template(tpl, {list: result.datas});
    $('.topic_article_list').append(content)
    $('.topic_border .read-more').text('加载更多');
    ui.loading = false;

  })
})

// 删除专题
function deleteTopic(e){
  // debugger
  var subject_id = $(e).data('subjectid');

  layer.confirm('确定删除你的专题么?',
      {
      icon: 3,
      title:0,
      shade:0,
      title: 0,
      skin: 'layui-layer-report', //加上边框
      },
      function(index){
        var uri = 'topic/deleteTopic?topicId=' + subject_id + '&creator=' + userinfo.id + '&password=' + userinfo.userPwd;
        doJavaGet(uri, function(res){
          if (res.code == 0) {
            layer.msg(res.msg);
            window.location.href= localStorage.currentHref ? localStorage.currentHref : 'personal-homepage.html'
          }else if(res.code == -1){
            layer.msg(res.msg)
          }
        })
      layer.close(index);
  });

}



// 文章点赞
$(".topic_article_list").on('click','.like-button',function (e) {
    e.preventDefault()
    var self = $(e.currentTarget);
    var reviewid = self.data('reviewid');
    var likes = 1;
    var like_count = $(self[0]).text().split('')[1];

    if(userinfo == null){
        layer.msg('您还没有登录')
        layer.open({
            type: 1,
            shade:0,
            title: 0,
            skin: 'layui-layer-report', //加上边框
            area: ['550px', '680px'], //宽高
            content: $("#short-comment-commit-layer").html()
        });
        return;
    }

    var uri = "blockchain/addLike?reviewId="+reviewid+"&userId="+userId+"&likes="+likes;
    doJavaGet(uri, function(res) {
        if(res.code == 0) {
          like_count++;
          var str = '<i class="fa fa-heart"></i>'
          self.html(str + ' ' + like_count)
          layer.msg(res.msg);
        } else {
          layer.msg(res.msg);
        }
    }, "json");
});



var ui_search_article = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}
// 收录弹窗
$(".collect_button").on('click',function (e) {

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
  project_alert_close_index = layer.open({
      type: 1,
			shadeClose:true,
      title: 0,
      skin: 'layui-layer-report', //加上边框
      area: [area_width,area_height ], //宽高
      content: $("#templay-search-article").html()
  });
})

// 搜索文章
function searchArticle(e){
	if (event.keyCode == 13) {
		doSearchArticle()
	}
}

var article_page_search = 1;
var key_word = '';

function doSearchArticle(){
	ui_search_article.loading = true;
	ui_search_article.noMoreData = false;

	article_page_search = 1;
	key_word = $('.search_include_items').val();
	var uri = 'blockchain/quaryArticle?articleKeyWord=' + key_word + '&currentPage='
						+ article_page_search + '&pageSize=12'

	doJavaGet(uri,function(result){
		$('.list_item').html('')

		if (result.datas.length == 0) {
			ui_search_article.noMoreData = true;
		}else{

			// 判断文章是被收录
			for (var i = 0; i < result.datas.length; i++) {
				if (result.datas[i].topiclist) {
					result.datas[i].topiclist.indexOf(topicId) > 1 ? result.datas[i]['state'] = 1 : result.datas[i]['state'] = 0
				}
				if (result.datas[i].textTitle.length > 20) {
					result.datas[i].textTitle = result.datas[i].textTitle.substring(0,20) + "..."
				}
			}

			var search = document.getElementById('search_article_result_tpl').innerHTML;
			var content = template(search, {list: result.datas});
			$('.list_item').append(content);
			$('.load_more_article_result').css('display','block');
		}
		ui_search_article.loading = false;

	})
}

// 搜索文章更多
function load_more_search_article_result(){
	if (ui_search_article.noMoreData) {
		return
	}
	ui_search_article.loading = true;
	article_page_search++;

	var uri = 'blockchain/quaryArticle?articleKeyWord=' + key_word + '&currentPage='
						+ article_page_search + '&pageSize=12'

	doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
			ui_search_article.noMoreData = true;
		}else{

			// 判断文章是被收录
			for (var i = 0; i < result.datas.length; i++) {
				if (result.datas[i].topiclist) {
					result.datas[i].topiclist.indexOf(topicId) > 1 ? result.datas[i]['state'] = 1 : result.datas[i]['state'] = 0
				}
				if (result.datas[i].textTitle.length > 10) {
					result.datas[i].textTitle = result.datas[i].textTitle.substring(0,10) + "..."
				}
			}

			var search = document.getElementById('search_article_result_tpl').innerHTML;
			var content = template(search, {list: result.datas});
			$('.list_item').append(content);
		}
		ui_search_article.loading = false;
	})
}

// 收录文章
var _send_button = null;
function collectArticle(e){
	_send_button = e;
	var self =$(e),
			reviewId = self.data('reviewid'),
			topicId = getUrlParam('subjectId');
	var uri = 'topic/submission?creator=' + userinfo.id + '&password=' + userinfo.userPwd
					 + '&topicId=' + topicId + '&reviewId=' + reviewId

	doJavaGet(uri,function(result){
		if (result.code == 0) {
			layer.msg('收录成功');
			$(_send_button).text('已收录')
		}else if(result.code == -1){
			layer.msg(result.msg);
		}
		// ui.submiting = false;
	})
}
