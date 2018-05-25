var userinfo = JSON.parse(localStorage.getItem('userinfo'))
var loadFlag = null; //1->短评  2->长评  4->文章  3->全部动态
var type = null; //  	1->短评	  2->长评  4->文章  不传->所有
var tpl_id = null;
var currentPage = 1;
var userid_search = null;
var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

// 判断userId
$(function(){
	url_id = getUrlParam('userId');
	cookie_id = $.cookie('userid');
	// 看别人
	if (url_id && url_id != cookie_id ) {
		userid_search = getUrlParam('userId');
		//看别人时隐藏编辑、创建按钮
		$('.edit_btn').css('display','none');
		$('.create_new_topic_list_btn').css('display','none');
		$('.create_new_subject_btn').css('display','none');
	}
	// 看自己
	else{
		userid_search = cookie_id;
	}

  if(!userid_search){
    window.location.href = 'index.html'
  }
})


window.onload = function(){
	getUserInfo();
	getUserProject();
	getUserSubject();

	// 首次加载全部动态
	loadFlag = 3;
	type = null;
	tpl_id = "all_dynamic_tpl";
	getPersonHomePageData();
	$('.read-more').html('点击加载更多数据')
}

$('.dynamic_title').on('click', 'span', function(e){
	// var spanList = $(".dynamic_title span");
	// spanList.splice(0,1);
	$(".dynamic_title span").removeClass('menuOnClick')
	$(e.target).addClass('menuOnClick')
})

// 短评
$('.load_short_comment').on('click',function(){
	loadFlag = 1;
	type = 1;
	tpl_id = "short_comment_tpl"
	getPersonHomePageData();
  // getUserShortComment();
})
// 长评
$('.load_long_comment').on('click',function(){
	loadFlag = 2;
	type = 2;
	tpl_id = "long_comment_tpl"
	getPersonHomePageData();
  // getUserLongComment();
})
// 文章
$('.load_article').on('click',function(){
	loadFlag = 4;
	type = 4;
	tpl_id = "article_tpl"
	getPersonHomePageData();
  // getUserArticle();
})
// 所有动态
$('.load_all_dynamic').on('click',function(){
	loadFlag = 3;
	type = null;
	tpl_id = "all_dynamic_tpl";
	getPersonHomePageData();
  // getUserAllDynamic();
})



// 加载用户信息
function getUserInfo(){
	var uri = 'news/quaryusers?currentPage=1&pageSize=1&userId=' + userid_search + '&loginUser=' + userId

	doJavaGet(uri, function(res){

		$('.person_name').html(res.datas.realName);
		$('.person_logo')[0].src = res.datas.userPic ? res.datas.userPic : 'img/normal-user.png';

		var intro = res.datas.personIntro ? res.datas.personIntro : ''
		$('.personal-intro').html('个人简介:' + intro)

		// 看别人时显示关注
		if (userId != userid_search) {
			// true已关注，false未关注
			if (res.datas.follow) {
				var str_unfollow = '<a href="javascript:void(0)" class="un_follow_btn" onclick="unFollowUser(this)">取消关注</a>'
				$('.edit_person_msg').prepend(str_unfollow)
			}else{
				var str_follow = '<a href="javascript:void(0)" class="follow_btn" onclick="followUser(this)">关注</a>'
				$('.edit_person_msg').prepend(str_follow)
			}
		}

	})

  // $('.person_name').html(userinfo.realName);
  // $('.person_logo')[0].src = userinfo.userPic;
	// $('.personal-intro').html('个人简介：') + userinfo.userIntro
}

function getPersonHomePageData(){
	// loadFlag = 1;
	currentPage = 1;
	ui.loading = true;
	ui.noMoreData = false;
	if (type) {
		var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12'
							+ '&creator=' + userid_search + '&type=' + type;
	}else{
		var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12'
							+ '&creator=' + userid_search;
	}

	// 首次加载
	$('.read-more').css('display','none')
	$(".refresh_load").fadeIn();
	$('.hot_review_region').html('');

	doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
			ui.noMoreData = true
			$(".refresh_load").hide();
			$('.read-more').css('display','block')
			$('.read-more').html('已无更多数据')
			return
		}

		// 限制内容长度，短评时不用
		if (loadFlag != 1) {
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
		}

		var tpl = document.getElementById(tpl_id).innerHTML;
		var content = template(tpl, {list: result.datas});

		$(".refresh_load").hide();
		$('.hot_review_region').append(content)
		$('.read-more').css('display','block')
		$('.read-more').html('点击加载更多')
		ui.loading = false;
	})
}

function loadMore(){
	currentPage++;
	ui.loading = true;
	ui.noMoreData = false;
	if (type) {
		var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12'
							+ '&creator=' + userid_search + '&type=' + type;
	}else{
		var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12'
		 					+ '&creator=' + userid_search;
	}

	// 加载更多
	$('.read-more').html('加载中')

	doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
			ui.noMoreData = true
			$('.read-more').html('已无更多数据')
			return
		}

		// 限制内容长度，短评时不用
		if (loadFlag != 1) {
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
		}

		var tpl = document.getElementById(tpl_id).innerHTML;
		var content = template(tpl, {list: result.datas});

		$(".refresh_load").hide();
		$('.hot_review_region').append(content)
		$('.read-more').html('点击加载更多')
		ui.loading = false;
	})
}

// 加载更多动态
$('.read-more').on('click',function(){
	if (!ui.noMoreData && !ui.loading) {
		loadMore();
	}
})

var ui_project = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

// 加载用户创建的项目
var project_page = 1;
function getUserProject(){
	project_page = 1
	var uri = 'blockchain/quaryProjetList?currentPage=' + project_page + '&pageSize=5&creator=' + userid_search;
	ui_project.loading = true;
	ui_project.noMoreData = false;
	doJavaGet(uri, function(res){
		if (res.datas.length > 0) {
			var tpl = document.getElementById('project_tpl').innerHTML;
			var content = template(tpl, {list: res.datas});
			$('.created_project').append(content);
			$('.load-more-subject').css('display','')
		}
		ui_project.loading = false;

	})
}

// 加载更多项目
$('.load-more-project').on('click',function(){
	if ( ui_project.noMoreData || ui_project.loading) {
		return
	}
	project_page++
	var uri = 'blockchain/quaryProjetList?currentPage=' + project_page + '&pageSize=5&creator=' + userid_search
	ui_project.loading = true;
	doJavaGet(uri, function(res){
		if (res.datas.length == 0) {
			ui_project.noMoreData = true;
			$('.load-more-project').text('已无更多数据')
		}else{
			var tpl = document.getElementById('project_tpl').innerHTML;
			var content = template(tpl, {list: res.datas});
			$('.created_project').append(content);
		}
		ui_project.loading = false;

	})
})

$('.created_project').on('click', $('.project_name'), function(e){
	var self = $(e.target);
	var	project_id = self.data('projectid');
	window.location = 'chain-detail.html?projectId=' + project_id
})

var ui_subject = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

// 加载用户创建的专题
var subject_page = 1;
function getUserSubject(){
	subject_page = 1
	var uri = 'topic/seachTopic?currentPage=' + subject_page + '&pageSize=5&creator=' + userid_search
	ui_subject.loading = true;
	ui_subject.noMoreData = false;
	doJavaGet(uri, function(res){
		if (res.datas.length > 0) {
			var tpl = document.getElementById('subject_tpl').innerHTML;
			var content = template(tpl, {list: res.datas});
			$('.created_subject_list').html('');
			$('.created_subject_list').append(content);
			$('.load-more-subject').css('display','')
		}
		ui_subject.loading = false;
	})
}

// 加载更多专题
$('.load-more-subject').on('click',function(){
	if (ui_subject.noMoreData || ui_subject.loading) {
		return
	}
	subject_page++;
	var uri = 'topic/seachTopic?currentPage=' + subject_page + '&pageSize=5&creator=' + userid_search;

	ui_subject.loading = true;

	doJavaGet(uri, function(res){
		if (res.datas.length == 0) {
			ui_subject.noMoreData = true;
			$('.load-more-subject').text('已无更多数据');
		}else{
			var tpl = document.getElementById('subject_tpl').innerHTML;
			var content = template(tpl, {list: res.datas});
			$('.created_subject_list').append(content)
		}
		ui_subject.loading = false;
	})
})

// 删除专题
$('.created_subject').on('click', '.delete_subject', function(e){
	var self = $(e.target),
			subject_id = self.data('subjectid');

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
						getUserSubject();
					}else if(res.code == -1){
						layer.msg(res.msg)
					}
				})
      layer.close(index);
  });


})



// 点赞
$(".hot_review_region").on('click','.like-button',function (e) {
    e.preventDefault()
    var self = $(e.currentTarget);
    var reviewid = self.data('reviewid');
    var likes = 1;
    var like_count = $(self[0]).text().split('')[1];
		if(!wechatBindNotice()){
    	return;
    }
    if(userinfo == null){
        // layer.msg('您还没有登录')
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

// 关注
var current_follow_button = null
$(".hot_review_region").on('click','.followBtn',function(){
	current_follow_button = this;
	var	followingId = $(this).data('followingid');
	var uri = 'attention/attent?attentionId=' + followingId  + '&creator=' + userId + '&password=' + userinfo.userPwd + '&type=1';

	doJavaGet(uri,function(res){
		if (res.code == 0) {
			$(current_follow_button).text('已关注');
			// layer.msg('关注成功',{time:1000})
			var temp_str = '<li class="load_people_dynamic" data-followingId=' + $(current_follow_button).data('followingId') +'>\
											'  +    +  '</li>'
			$('.follow_people_list')
		}
	});
})

// 关注
function followUser(e){
	var uri = 'attention/attent?attentionId=' + userid_search + '&creator=' + userId + '&password='
	 					+ userinfo.userPwd + '&type=1';

	doJavaGet(uri,function(res){
		if (res.code == 0) {
			layer.msg('关注成功');
			$(e).css('display','none');
			var str_unfollow = '<a href="javascript:void(0)" class="un_follow_btn" onclick="unFollowUser(this)">取消关注</a>'
			$('.edit_person_msg').prepend(str_unfollow)
		}
	})
}

// 取关
function unFollowUser(e){
	var uri = 'attention/delAttent?attentionId=' + userid_search + '&creator=' + userId + '&password='
	 					+ userinfo.userPwd + '&type=1';

	doJavaGet(uri,function(res){
		if (res.code == 0) {
			layer.msg('已取消关注');
			$(e).css('display','none');
			var str_follow = '<a href="javascript:void(0)" class="follow_btn" onclick="followUser(this)">关注</a>'
			$('.edit_person_msg').prepend(str_follow)
		}
	})
}
