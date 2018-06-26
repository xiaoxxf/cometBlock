//举报弹出框
// var userId = $.cookie('userid');//获取userid
// var userinfo = JSON.parse(localStorage.getItem('userinfo'));
// var wechatInfo = $.cookie('wechatInfo');
// wechatInfo == null ? wechatInfo : JSON.parse(wechatInfo);
var quotedReviewId = null
var originalReviewTitile = '';
var originalReviewId = '';
var originalCreator = '';
var projectId = '';
var projectBigName = '';
var addLikeStatus = null; // 用户点赞状态
var ui = {
  'loading': false,
  'noMoreData': false,
  'submiting': false,
  'deleting': false,
}
var article_topic_list = [];

$('.comment-list-hook').on('click','.comment-item .report_comment',function (e) {
    console.log($(e.currentTarget))
    layer.open({
        type: 1,
        shade:0,
        title: '选择举报原因',
        skin: 'layui-layer-report', //加上边框
        area: ['442px', '200px'], //宽高
        content: $("#template-report-popup").html()
    });
});

window.onload = function(){
    ajaxGetReviewDetail();
}

var longCommentCurrentPage = 1 ;
var pageSize = 5;
function  ajaxGetReviewDetail() {
    var reviewId = getUrlParam('reviewId');
    var uri = 'topic/quaryArticleDeatail?reviewId='+reviewId ;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            // 用户点赞状态
            addLikeStatus = res.status;
            var commentInfoData = res.datas;
            // 给projectId赋值后再用projectId去请求项目信息
            projectId = res.datas.projectId
            // 保存作者id
            originalCreator = res.datas.creator
            // 保存文章标题
            originalReviewTitile = res.datas.textTitle
            // 保存文章id
            originalReviewId = res.datas.reviewId
            // 保存文章的专题id
            for (var i = 0; i < res.datas.topiclist.length; i++) {
              article_topic_list.push(res.datas.topiclist[i].id)
            }
            $('title').html(commentInfoData.textTitle)
            // console.log(commentInfoData)
            $(".comet-navbar .long-comment-title").text(commentInfoData.textTitle);
            $(".comment-container-wrap .comment-detail-title").text(commentInfoData.textTitle);
            var commentTpl = $("#template-mian-detail").html();
            var content = template(commentTpl, {list: commentInfoData});
            $(".comment-detail-mian-hook").append(content);

            // 判断是否已点赞
            addLikeStatus == 1 ? $('.LikeButton').addClass('clicked-like') : '';

            // 手机上不加载投稿等功能
            if ($(window).width() > 767) {
              // 作者打开时可以投稿
              if (userId && commentInfoData.creator == userId) {
                $('.news_alert_subject').css('display','');
                // 没有projectId，即为文章，可以投稿到项目
                if(userId && commentInfoData.creator == userId && !projectId){
                  $('.news_alert_project').css('display','')
                }
              }
              // 登录时可以收录文章到专题
              else if (userId && commentInfoData.creator != userId) {
                $('.news_alert_include').css('display','')
              }

            }

            // 有项目则加载项目
            if (projectId) {
              ajaxGetChainDetail()
            }
            // 加载评论列表
            ajaxGetLongCommentReview();

        } else {
            layer.msg('查询不到该文章');
        }
    }, "json");
}
function  ajaxGetChainDetail() {
    // var projectId = projectId ;
    var uri = 'blockchain/detail?projectId='+projectId ;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
          $(".main-hd .project-name").attr('href','chain-detail.html?projectId='+projectId);
          $(".main-hd .project-name").text(res.datas.projectName)
          projectBigName = res.datas.projectName;
        } else {
            layer.msg(res.msg);
        }

    // 加载完文章再加载评论
    }, "json");
}
//点击引用
$('.comment-list-hook').on('click','.comment-item .reply_comment',function (e) {
    var self =$(e.currentTarget),
        author = self.data('user_name'),
        number = self.data('number')+1,
        id = self.data('reviewid'),
        parentTxt = self.data('parenttxt');
        $(".comment-list-hook").find('.reply-comment-click').removeClass('reply-comment-click')
        self.addClass('reply-comment-click');
    if(!wechatBindNotice()){
    	return;
    }
    if(userId == undefined){
        // layer.msg('您还没有登录');
        layer.open({
            type: 1,
            shade:0,
            title: 0,
            skin: 'layui-layer-report', //加上边框
            area: ['550px', '680px'], //宽高
            content: $("#template-reply").html()
        });
        return;
    }
    $("#add_comment .author").text(author);
    $("#add_comment .number").text(number);
    $("#add_comment .parent-txt .short").text(parentTxt);
    quotedReviewId = id
    $(".reply-comment").fadeIn()
});
//点击删除
$('.comment-list-hook').on('click','.comment-item .reply_delete',function (e) {
    if(!wechatBindNotice()){
      return;
    }
    if(userId == undefined){
        // layer.msg('您还没有登录');
        layer.open({
            type: 1,
            shade:0,
            title: 0,
            skin: 'layui-layer-report', //加上边框
            area: ['550px', '680px'], //宽高
            content: $("#template-reply").html()
        });
        return;
    }

    var self =$(e.currentTarget),
        author = self.data('user_name'),
        passWord = userinfo.userPwd,
        reviewId = self.data('reviewid');

    layer.confirm('确定删除您的评论么?',
        {
        icon: 3,
        title:0,
        shade:0,
        title: 0,
        skin: 'layui-layer-report', //加上边框
        },
        function(index){
        if (ui.deleting) {
          return
        }
        ui.deleting = true;
        $('.layui-layer-btn0').text('删除中...');
        var uri = "blockchain/delReview?reviewId="+reviewId+"&userId="+userId+"&passWord="+passWord
        doJavaGet(uri, function(res) {
            if(res != null && res.code == 0) {
                // console.log(res.msg)
                ajaxGetLongCommentReview();
                setTimeout(layer.msg('删除成功'),1000)
            }else if(res.code == -1){
              layer.msg('删除失败，请重试')
            }
            ui.deleting = false;
        }, "json"),
        layer.close(index),
        ui.deleting = false;
      });
});

// 点击编辑短文
$('.comment-list-hook').on('click','.comment-item .reply_edit',function (e) {
  var self = $(e.currentTarget)

  var reviewId = self.data('reviewid');
  if(!wechatBindNotice()){
    	return;
  }
  if(userId == undefined){
      // layer.msg('您还没有登录');
      layer.open({
          type: 1,
          shade:0,
          title: 0,
          skin: 'layui-layer-report', //加上边框
          area: ['550px', '680px'], //宽高
          content: $("#template-reply").html()
      });
      return;
  }

  layer.confirm('修改评论',
      {
        // icon: 3,
        title:0,
        shade:0,
        title: 0,
        skin: 'layui-layer-report', //加上边框
        content:
            "<div style='width:350px;'>\
              <div style='width:320px;' class='form-group has-feedback'>\
                <p style='margin:10px'>评论内容</p>\
                <textarea id='edit-short-content' class='form-control' type='text' name='awardName' value='' />\
              </div>\
              <br>\
            </div>\
            "
      },
      function(index){
        var uri = 'blockchain/updataReview'

        var data = {
          textTitle: $('#edit-short-content').val(),
          reviewId: reviewId , //项目
          type: 3, //长文的type为2
          userId: userId,
          password: userinfo.userPwd,
        }


        function callback(result){
          if (result.code == -1) {
            layer.msg('修改失败', {
              time: 1000,
            });
          }else{
            ajaxGetLongCommentReview()
            setTimeout(layer.msg('修改成功'),2000)
          }

        }

        doPostJavaApi(uri, JSON.stringify(data), callback, 'json')


        layer.close(index);
      }
  );

})


//点击关闭
$(".comment-list-hook").on('click','.review-comment-form .lnk-close',function (e) {
    $(".reply-comment").fadeOut();
    $('#comments .reply_comment').removeClass('reply-comment-click')
    console.log($(e.currentTarget))
});
//useful点击

//喜欢点击
var ui = {
  'like_submiting' : false
}
$(".comment-detail-mian-hook").on('click','.main-like .LikeButton',function (e) {
    if(!wechatBindNotice()){
      return;
    }
    if(userId == undefined){
        // layer.msg('您还没有登录');
        layer.open({
            type: 1,
            shade:0,
            title: 0,
            skin: 'layui-layer-report', //加上边框
            area: ['550px', '680px'], //宽高
            content: $("#template-reply").html()
        });
        return;
    }
    if (ui.like_submiting) {
      return
    }
    ui.like_submiting = true;
    var self = $(e.currentTarget);
    var reviewid = self.data('reviewid');
    var likesnum= self.data('likes_nums')+1;
    var likes = '';

    addLikeStatus == 1 ? likes = 0 : likes = 1;
    var uri = "blockchain/addLike?reviewId="+reviewid+"&userId="+userId+"&likes="+likes+'&projectBigName='+projectBigName;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            likes == 0 ? addLikeStatus = 0 : addLikeStatus = 1;
            // console.log(res.msg)
            // var num  = parseInt(self.find(".LikeButton-count").text())-1;
            // if(self.hasClass('clicked-like')){
            //     self.find(".LikeButton-count").text(likesnum)
            // }else{
            //     self.find(".LikeButton-count").text(num);
            // }
            $('.LikeButton').toggleClass("clicked-like");
        } else {
          layer.msg(res.msg);
        }

        ui.like_submiting = false;
    }, "json");
})


//点击提交评论

// 防重点击
var add_comment_ui = {
  'submiting': false
}
$(".comment-list-hook").on('click','.add_comment-hook',function (e) {
    if (add_comment_ui.submiting) {
      return
    }
    add_comment_ui.submiting = true;
    $(e.currentTarget).text('提交中...');
    var reviewId = getUrlParam('reviewId');
    var shortTxt = $(".textarea-txt-hook").val();
    var quote = '';
    if($(".reply-comment").is(':visible')){
        quote = $(".reply-comment-wrap .quote-comment-txt").html();
    }
    if(!wechatBindNotice()){
      add_comment_ui.submiting = false;
      $(e.currentTarget).text('加上去');
    	return;
    }

    if(userId == undefined){
        // layer.msg('您还没有登录');
        layer.open({
            type: 1,
            shade:0,
            title: 0,
            skin: 'layui-layer-report', //加上边框
            area: ['550px', '680px'], //宽高
            content: $("#template-reply").html()
        });
        add_comment_ui.submiting = false;
        $(e.currentTarget).text('加上去');
        return;
    }

    if($.trim(shortTxt) == '' || shortTxt.length < 5){

        layer.tips('评论不能少于五个字', '.textarea-txt-hook', {
            tips: [1, '#4fa3ed'],
            time: 2000
        });
        add_comment_ui.submiting = false;
        $(e.currentTarget).text('加上去');
        return;
    }
    if(shortTxt.length >= 500){
        layer.tips('文字太多', '.textarea-txt-hook', {
            tips: [1, '#4fa3ed'],
            time: 2000
        });
        add_comment_ui.submiting = false;
        $(e.currentTarget).text('加上去');
        return;
    }
    // 过滤js和style标签
    shortTxt = shortTxt.replace(/<script.*?>.*?<\/script>/g,'').replace(/<style(([\s\S])*?)<\/style>/g, '');
    var data = {
        textTitle: shortTxt,
        parentId: reviewId, //项目
        type: 3, //长文的type为2
        userId:userId,
        quote:quote,
        quotedReviewId: quotedReviewId, // 引用的评论的id
        originalReviewId: originalReviewId, // 原文id
        originalReviewTitile: originalReviewTitile, // 原文标题（用于发放奖励）
        originalCreator: originalCreator, // 原文作者（用于发放奖励）
        projectId: projectId, // 项目id
        projectBigName: projectBigName // 项目名称（用于发放奖励）
    }
    var uri = 'blockchain/addReview';
    var jsonData = JSON.stringify(data);
    doPostJavaApi(uri,jsonData, function(res) {
        if(res != null && res.code == 0) {
            layer.msg(res.msg);
            $(".short-comment").val('')
            ajaxGetLongCommentReview();
        } else {
            layer.msg(res.msg);
        }
        $(e.currentTarget).text('加上去');
        add_comment_ui.submiting = false;
    }, "json");

})
// 点击删除长文
$('.comment-detail-mian-hook').on('click', '.long_comment_delete',function (e) {
    if(!wechatBindNotice()){
      return;
    }
    if(userId == undefined){
        // layer.msg('您还没有登录');
        layer.open({
            type: 1,
            shade:0,
            title: 0,
            skin: 'layui-layer-report', //加上边框
            area: ['550px', '680px'], //宽高
            content: $("#template-reply").html()
        });
        return;
    }
    if (ui.deleting) {
      return
    }
    ui.deleting = true;
    var self =$(e.currentTarget),
        author = self.data('user_name'),
        passWord = userinfo.userPwd,
        reviewId = self.data('reviewid');
        parentTxt = self.data('parenttxt');

    layer.confirm('确定删除您的文章么?',
    {
      icon: 3,
      title:0,
      shade:0,
      title: 0,
      skin: 'layui-layer-report', //加上边框
    },
    function(){
      $('.layui-layer-btn0').text('删除中...')
      var uri = "blockchain/delReview?reviewId="+reviewId+"&userId="+userId+"&passWord="+passWord
      doJavaGet(uri, function(res) {
          if(res != null && res.code == 0) {
              if (projectId) {
                window.location.href= 'chain-detail.html?projectId=' + projectId
              }else if(!projectId){
                window.location.href= 'personal-homepage.html'
              }
          }else if(res.code == -1){
            $('.layui-layer-btn0').text('确定');
            layer.msg('删除失败，请重试');
          }
          ui.deleting = false;
      }, "json");
    }
    );
});


//点击悬浮投稿到项目
$(".news_alert_project").on('click',function (e) {

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
      content: $("#templay-news-fixed").html()
  });

})

//搜索项目
var search_page_project = 1;
var key_word_project = '';
// 搜索项目
function searchProject(){
  // 判断是否有搜索内容
	key_word_project  = $('.search_project').val()
	if (key_word_project  == '') {
		return false
	}

  ui.loading = true;
  ui.noMoreData = false;
  search_page_project = 1;
	var uri = 'blockchain/quaryProjetList?currentPage=' + search_page_project + '&pageSize=' + pageSize
            + '&projectName=' + key_word_project
	doJavaGet(uri,function(result){
    $('.list_item').html('');
    var search = document.getElementById('search_project_list').innerHTML;
    var content = template(search, {list: result.datas});
    $('.list_item').append(content);
    $('.load_more_project_result').css('display', 'block')
    // 有结果时显示加载更多
    if (result.datas.length != 0) {
      $('.load_more_subject_result').css('display', 'block')
    }
    ui.loading = false;
	}, "json");
}
// 回车搜索项目
function keyEnterSearchProject(){
	if(event.keyCode ==13){
   	 	searchProject();
  }
}

// 加载更多搜索项目
function load_more_search_project_result(){
  if (ui.loading || ui.noMoreData) {
    return
  }
  $('.load_more_project_result').text('加载中')
  ui.loading = true;

  search_page_project ++;

	var uri = 'blockchain/quaryProjetList?currentPage=' + search_page_project + '&pageSize=' + pageSize
            + '&projectName=' + key_word_project
	doJavaGet(uri,function(result){
		// $('.list_item').html('');
    if (result.datas.length == 0) {
      ui.noMoreData = true;
      $('.load_more_project_result').text('已无更多数据');
    }else{
      var search = document.getElementById('search_project_list').innerHTML;
  		var content = template(search, {list: result.datas});
  		$('.list_item').append(content);
      $('.load_more_project_result').text('加载更多')
      ui.loading = false
    }

	}, "json");
}


// 投稿到项目按钮，弹出评分
var _send_project_button = null
function sendArticleToProject(e){

  _send_project_button = e;
  var self =$(e),
      projectId = self.data('projectid');
  layer.open({
    title: '评分',
    content: $('#add_score').html(),
    yes: function(index, layero){
      var score = parseInt($(".live-rating")[0].innerHTML);
      if(!score){
          layer.tips('给这个项目打个分哦', '.my-rating', {
              tips: [1, '#4fa3ed'],
              time: 2000
          });
          return;
      }
      doSendArticle(projectId,score);
      layer.close(index)
    }
  });

  createScore();
}

// 投稿到项目，即新增长评
function doSendArticle(projectId,score){
  var data = {
    textTitle: $('.comment-detail-title').html(),
    textContent: $('.review-content').html(),
    projectId: projectId, //项目Id
    score: score, //评分
    type: 2, //长文的type为2
    userId: userinfo.id, //userId
  }
  var uri = 'blockchain/addReview'
  doPostJavaApi(uri, JSON.stringify(data), function(res){
    if (res.code == 0) {
      layer.msg('投稿成功')
      $('._send_project_button').text('已投稿');
    }else if(res.code == -1){
      layer.msg('投稿失败，请重试')
    }
  }, 'json')

}
// 星星评分
function createScore(){
  $(".my-rating").starRating({
    strokeColor:'#ffc900',
    ratedColor:'#ffc900',
    activeColor:'#ffc900',
    hoverColor:'#ffc900',
    strokeWidth: 10,
    useGradient:false,
    starSize: 25,
    initialRating: 0,
    useFullStars:true,
    disableAfterRate: false,
    onHover: function(currentIndex, currentRating, $el){
      $('.live-rating').text(currentIndex);
    },
    onLeave: function(currentIndex, currentRating, $el){
      $('.live-rating').text(currentRating);
    }
  });
}



//点击悬浮投稿到专题
$(".news_alert_subject").on('click',function (e) {

  var area_width
  var area_height
  if($(window).width() <= 767)
  {
    area_width = '320px'
    area_height = '500px'
  }else{
    area_width = '900px'
    area_height = '600px'
  }
  layer.open({
      type: 1,
      shadeClose:true,
      closeBtn:0,
      anim: 2 ,
      isOutAnim: false,
      scrollbar: false,
      title: 0,
      skin: 'layui-layer-report', //加上边框
      area: [area_width,area_height ], //宽高
      content: $("#templay-news-subject").html()
  });
  getRecommendSubject();
  getMyTopic();
})

// 加载推荐专题
function getRecommendSubject(){
	var uri = 'topic/seachTopic?currentPage=1&pageSize=6'
	doJavaGet(uri,function(result){
    // 判断是否已投稿
    for (var i = 0; i < result.datas.length; i++) {
      // 有
      if ( article_topic_list.indexOf(result.datas[i].id) > -1) {
        result.datas[i]['state'] = 1
      }
      // 无
      else{
        result.datas[i]['state'] = 0
      }
    }
    // console.log(result.datas)
		$('.recommend_topic_result').html('');
		var search = document.getElementById('recommend_topic_tpl').innerHTML;
		var content = template(search, {list: result.datas});
		$('.recommend_topic_result').append(content);

	}, "json");
}

// 搜索专题
var search_subject_page = 1;
var key_word_subject = '';
function searchSubject(){

	key_word_subject = $('.search_subject').val()
	if (key_word_subject == '') {
		return false
	}
  ui.loading = true;
  ui.noMoreData = false;
  search_subject_page = 1;
  // 隐藏推荐专题和我管理的专题，显示搜索结果
  $('.list_subject_recommend').css('display','none')
  $('.list_subject_include').css('display','none')
  $('.list_subject_item').css('display','')
  // 隐藏我管理的专题的加载更多
  $('.load_more_my_subject_result').css('display','none')

  $('.list_subject_item').html('');
	var uri = 'topic/seachTopic?currentPage=' + search_subject_page + '&pageSize=' + pageSize
            + '&topic=' + key_word_subject
	doJavaGet(uri,function(result){
    // 判断是否已投稿
    for (var i = 0; i < result.datas.length; i++) {
      // 有
      if ( article_topic_list.indexOf(result.datas[i].id) > -1) {
        result.datas[i]['state'] = 1
      }
      // 无
      else{
        result.datas[i]['state'] = 0
      }
    }
    // console.log(result.datas)
		var search = document.getElementById('search_subject_list').innerHTML;
		var content = template(search, {list: result.datas});
		$('.list_subject_item').append(content);
    // 有结果时显示加载更多
    if (result.datas.length == pageSize) {
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
      // 显示推荐专题和我管理的专题
      $('.list_subject_recommend').css('display','')
      $('.list_subject_include').css('display','')
      // 隐藏搜索结果及加载更多
      $('.list_subject_item').css('display','none')
      $('.load_more_subject_result').css('display', 'none')

      $('.load_more_my_subject_result').css('display','block')

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
  var uri = 'topic/seachTopic?currentPage=' + search_subject_page + '&pageSize=' + pageSize
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

// 投稿到专题 & 收录文章到专题
var _send_button = null;
function sendArticleToSubject(e){
  // if (ui.submiting) {
  //   return
  // }
  // ui.submiting = true;
  _send_button = e;
  var self =$(e),
      topicId = self.data('subjectid'),
      reviewId = getUrlParam('reviewId');
  var uri = 'topic/submission?creator=' + userId + '&password=' + userinfo.userPwd
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

//点击悬浮收录专题
$(".news_alert_include").on('click',function (e) {
  var area_width
  var area_height
  if($(window).width() <= 767)
  {
    area_width = '320px'
    area_height = '500px'
  }else{
    area_width = '900px'
    area_height = '600px'
  }
  layer.open({
    type: 1,
    shadeClose:true,
    closeBtn:0,
    anim: 2 ,
    isOutAnim: false,
    scrollbar: false,
    title: 0,
    skin: 'layui-layer-report', //加上边框
    area: [area_width,area_height ], //宽高
    content: $("#templay-news-include").html()
  });
  getMyTopic();

})

var myTopic_page = 1;
var myTopic_pageSize = 6;
var load_my_topic_ui = {
  'loading': false,
  'noMoreData': false
}
// 加载我管理的专题
function getMyTopic(){
  if (load_my_topic_ui.loading) {
    return
  }
  load_my_topic_ui.loading = true;
  myTopic_page = 1;
  var uri = 'topic/seachTopic?currentPage=' + myTopic_page + '&pageSize=' + myTopic_pageSize + '&creator=' + userId;
  doJavaGet(uri,function(result){
    // 有结果显示查看更多
    if (result.datas.length == myTopic_pageSize) {
      $('.load_more_my_subject_result').css('display','block')
    }
    // 判断是否已投稿
    for (var i = 0; i < result.datas.length; i++) {
      // 有
      if ( article_topic_list.indexOf(result.datas[i].id) > -1) {
        result.datas[i]['state'] = 1
      }
      // 无
      else{
        result.datas[i]['state'] = 0
      }
    }
    // console.log(result.datas)
    $('.my_topic_list').html('');
    var search = document.getElementById('my_topic_tpl').innerHTML;
    var content = template(search, {list: result.datas});
    $('.my_topic_list').append(content);
    load_my_topic_ui.loading = false;
  }, "json");
}

// 加载更多我管理的专题
function load_more_my_subject_result(){
  if (load_my_topic_ui.noMoreData || load_my_topic_ui.loading) {
    return
  }
  load_my_topic_ui.loading = true;

  myTopic_page++;
  $('.load_more_my_subject_result').text('加载中...')
  var uri = 'topic/seachTopic?currentPage=' + myTopic_page + '&pageSize=' + myTopic_pageSize + '&creator=' + userId;
  doJavaGet(uri,function(result){
    if (result.datas.length == 0) {
      load_my_topic_ui.noMoreData = true;
      $('.load_more_my_subject_result').text('已无更多');
    }else{
      // 判断是否已投稿
      for (var i = 0; i < result.datas.length; i++) {
        // 有
        if ( article_topic_list.indexOf(result.datas[i].id) > -1) {
          result.datas[i]['state'] = 1
        }
        // 无
        else{
          result.datas[i]['state'] = 0
        }
      }
      var search = document.getElementById('my_topic_tpl').innerHTML;
      var content = template(search, {list: result.datas});
      $('.my_topic_list').append(content);
      $('.load_more_my_subject_result').text('查看更多');
    }
    load_my_topic_ui.loading = false;
  }, "json");
}


// 鼠标悬停时提示
var index_subject = null;
$('.news_alert_subject').on("mouseenter mouseleave", function(e){
  if(e.type == "mouseenter"){
    index_subject = layer.tips('投稿到专题', '.news_alert_subject', {
        tips: [4, '#4fa3ed']
    });
  }else if(e.type == "mouseleave"){
    layer.close(index_subject)
  };
})

// 鼠标悬停时提示
var index_project = null;
$('.news_alert_project').on("mouseenter mouseleave", function(e){
  if(e.type == "mouseenter"){
    index_project  = layer.tips('投稿到项目', '.news_alert_project', {
        tips: [4, '#4fa3ed']
    });
  }else if(e.type == "mouseleave"){
    layer.close(index_project )
  };
})

var index_collect = null;
$('.news_alert_include').on("mouseenter mouseleave", function(e){
  if(e.type == "mouseenter"){
    index_subject = layer.tips('收录该文章到专题', '.news_alert_include', {
        tips: [4, '#4fa3ed']
    });
  }else if(e.type == "mouseleave"){
    layer.close(index_subject)
  };
})

var index_qrcode = null;
$('.wechat_share').on("mouseenter mouseleave", function(e){
  if(e.type == "mouseenter"){
    index_subject = layer.tips('点击扫码分享', '.wechat_share', {
        tips: [4, '#4fa3ed']
    });
  }else if(e.type == "mouseleave"){
    layer.close(index_subject)
  };
})




// 生成二维码分享
function showQrCode(){
  $('#qrcode').html('')
  var qrcode = new QRCode(document.getElementById("qrcode"), {
  	width : 260,
  	height : 260
  });
  $('#qrCodeModal').modal()
  qrcode.makeCode(window.location.href);
}

function makeCode(){

}
//页面下拉到一定位置时，右下角出现回到顶部图标
$(function () {
  if ($(window).width() >= 767) {
    function showScroll() {
        $(window).scroll(function () {
            var scrollValue = $(window).scrollTop();
            scrollValue > 100 ? $('.news_alert_return_top').fadeIn() : $('.news_alert_return_top').fadeOut();
        });
        $('.news_alert_return_top').click(function () {
            $("html,body").animate({ scrollTop: 0 }, 500);
        });
    }
    showScroll();
  }
});
