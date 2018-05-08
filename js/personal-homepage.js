var userinfo = JSON.parse(localStorage.getItem('userinfo'))
var loadFlag = null; //1->短评  2->长评  4->文章  3->全部动态
var type = null; //  	1->短评	  2->长评  4->文章  不传->所有
var tpl_id = null;
var current_page = 1;
var userid_search = null;
var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

// 判断userId
$(function(){
	// 看别人
	if (getUrlParam('userId')) {
		userid_search = getUrlParam('userId');
		$('.edit_person_msg').css('display','none') //看别人时隐藏编辑按钮
	}
	// 看自己
	else{
		userid_search = $.cookie('userid');
	}

  if(!userid_search){
    window.location.href = 'index.html'
  }
})

window.onload = function(){
	getUserInfo();
	getUserProject();

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
	var uri = 'news/quaryusers?currentPage=' + currentPage + '&pageSize=1&userId=' + userid_search

	doJavaGet(uri, function(res){

		$('.person_name').html(res.datas.realName);
		$('.person_logo')[0].src = res.datas.userPic ? res.datas.userPic : 'img/normal-user.png';

		var intro = res.datas.personIntro ? res.datas.personIntro : ''
		$('.personal-intro').html('个人简介:' + intro)
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
	$(".waiting-data").fadeIn();
	$('.hot_review_region').html('');

	doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
			ui.noMoreData = true
			$(".waiting-data").hide();
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

		$(".waiting-data").hide();
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

		$(".waiting-data").hide();
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


// 加载用户创建的项目
var project_page = 1;
function getUserProject(){
	project_page = 1
	var uri = 'blockchain/quaryProjetList?currentPage=' + project_page + '&pageSize=5&creator=' + userid_search

	doJavaGet(uri, function(res){

		var tpl = document.getElementById('project_tpl').innerHTML;
		var content = template(tpl, {list: res.datas});

		$('.created_project').append(content)
	})
}

// 加载更多项目
$('.load-more-project').on('click',function(){
	project_page++
	var uri = 'blockchain/quaryProjetList?currentPage=' + project_page + '&pageSize=5&creator=' + userid_search

	doJavaGet(uri, function(res){

		var tpl = document.getElementById('project_tpl').innerHTML;
		var content = template(tpl, {list: res.datas});

		$('.created_project').append(content)
	})
})

$('.created_project').on('click', $('.project_name'), function(e){
	var self = $(e.target);
	var	project_id = self.data('projectid');
	window.location = 'chain-detail.html?projectId=' + project_id
})



// 点赞
$(".hot_review_region").on('click','.like-button',function (e) {
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


//
// // 加载用所有动态
// function getUserAllDynamic(){
//   loadFlag = 1;
//   // currentPage = 1;
//   ui.loading = true;
//   var article_uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12' + '&creator=' + userId;
//
// 	// 首次加载
// 	if(currentPage == 1){
// 		$('.hot_review_region').html('');
// 	}
// 	// 加载更多的情况
// 	else if (currentPage > 1) {
// 		$('.read-more').html('加载中...')
// 	}
//
// 	doJavaGet(article_uri,function(result){
//     if (result.datas.length == 0) {
// 			ui.noMoreData = true
// 			$('.read-more').html('已无更多数据')
// 			return
//     }
//
// 		// 限制内容长度
//     for (var i = 0; i < result.datas.length; i++) {
//       result.datas[i].textContent = result.datas[i].textContent.replace(/<[^>]+>/g,"")
//
//       var content_length = null
//       if ($(window).width() < 767) {
//         content_length = 55
//       }else{
//         content_length = 120
//       }
//
//       if (result.datas[i].textContent.length > content_length) {
//         result.datas[i].textContent = result.datas[i].textContent.substring(0,content_length) + "..."
//       }
//
//     }
//
//     var tpl = document.getElementById('short_comment_tpl').innerHTML;
//     var content = template(tpl, {list: result.datas});
//
//     $('.hot_review_region').append(content)
// 		$('.read-more').html('点击加载更多')
// 		ui.loading = false;
//   })
//   currentPage++;
// }
//
// // 加载用户文章
// function getUserArticle(){
//   loadFlag = 4;
//   // currentPage = 1
//   ui.loading = true;
//   var article_uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12' + '&type=4' + '&creator=' + userId;
//
// 	// 首次加载
// 	if(currentPage == 1){
// 		$('.hot_review_region').html('');
// 	}
// 	// 加载更多的情况
// 	else if (currentPage > 1) {
// 		$('.read-more').html('加载中...')
// 	}
//
//   doJavaGet(article_uri,function(result){
//     if (result.datas.length == 0) {
//       ui.noMoreData = true
// 			$('.read-more').html('已无更多数据')
// 			return
//     }
//
//     // 限制内容长度
//     for (var i = 0; i < result.datas.length; i++) {
//       result.datas[i].textContent = result.datas[i].textContent.replace(/<[^>]+>/g,"")
//
//       var content_length = null
//       if ($(window).width() < 767) {
//         content_length = 55
//       }else{
//         content_length = 120
//       }
//
//       if (result.datas[i].textContent.length > content_length) {
//         result.datas[i].textContent = result.datas[i].textContent.substring(0,content_length) + "..."
//       }
//
//     }
//
//     var tpl = document.getElementById('article_tpl').innerHTML;
//     var content = template(tpl, {list: result.datas});
//
//     $('.hot_review_region').append(content);
// 		$('.read-more').html('点击加载更多')
// 		ui.loading = false;
//   })
//   currentPage++;
// }
//
// // 加载用户评测
// function getUserLongComment(){
//   loadFlag = 2;
//   // currentPage = 1;
//   ui.loading = true;
//   var article_uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12' + '&type=2' + '&creator=' + userId;
//
// 	// 首次加载
// 	if(currentPage == 1){
// 		$('.hot_review_region').html('');
// 	}
// 	// 加载更多的情况
// 	else if (currentPage > 1) {
// 		$('.read-more').html('加载中...')
// 	}
//
//   doJavaGet(article_uri,function(result){
//     if (result.datas.length == 12) {
// 			ui.noMoreData = true
// 			$('.read-more').html('已无更多数据')
// 			return
//     }
//
//     // 限制内容长度
//     for (var i = 0; i < result.datas.length; i++) {
//       result.datas[i].textContent = result.datas[i].textContent.replace(/<[^>]+>/g,"")
//
//       var content_length = null
//       if ($(window).width() < 767) {
//         content_length = 55
//       }else{
//         content_length = 120
//       }
//
//       if (result.datas[i].textContent.length > content_length) {
//         result.datas[i].textContent = result.datas[i].textContent.substring(0,content_length) + "..."
//       }
//
//     }
//
//     var tpl = document.getElementById('long_comment_tpl').innerHTML;
//     var content = template(tpl, {list: result.datas});
//
//     $('.hot_review_region').append(content)
// 		$('.read-more').html('点击加载更多')
// 		ui.loading = false;
//   })
//   currentPage++;
// }
//
// // 加载用户短评
// function getUserShortComment(){
//   loadFlag = 3;
//   // currentPage = 1;
//   ui.loading = true;
//   var article_uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12' + '&type=1' + '&creator=' + userId;
//   $('.hot_review_region').html('');
//   doJavaGet(article_uri,function(result){
// 		if (result.datas.length == 12) {
// 			ui.noMoreData = true
// 			$('.read-more').html('已无更多数据')
// 			return
//     }
//
//     var tpl = document.getElementById('short_comment_tpl').innerHTML;
//     var content = template(tpl, {list: result.datas});
//
//     $('.hot_review_region').append(content)
// 		$('.read-more').html('点击加载更多')
// 		ui.loading = false;
//   })
//
//   currentPage++;
// }
