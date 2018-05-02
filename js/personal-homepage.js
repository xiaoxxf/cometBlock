var userinfo = JSON.parse(localStorage.getItem('userinfo'))
var userId = $.cookie('userid');//获取userid
var loadFlag = null; //1->全部动态 2->长评 3->短评 4->文章
var current_page = 1;
var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

$(function(){
  if(userId == undefined){
    window.location.href = 'index.html'
  }
})

window.onload = function(){
  getUserInfo();
	getUserAllDynamic();
}

$('.dynamic_title').on('click', 'span', function(e){
	// var spanList = $(".dynamic_title span");
	// spanList.splice(0,1);
	$(".dynamic_title span").removeClass('menuOnClick')
	$(e.target).addClass('menuOnClick')
})

$('.load_article').on('click',function(){
  getUserArticle();
})
$('.load_short_comment').on('click',function(){
  getUserShortComment();
})
$('.load_long_comment').on('click',function(){
  getUserLongComment();
})
$('.load_all_dynamic').on('click',function(){
  getUserAllDynamic();
})


// 加载用户信息
function getUserInfo(){
  $('.person_name').html(userinfo.realName);
  $('.person_logo')[0].src = userinfo.userPic;
}

// 加载用所有动态
function getUserAllDynamic(){
  loadFlag = 1;
  currentPage = 1;
  ui.loading = true;
  var article_uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12' + '&creator=' + userinfo.id;
  $('.hot_review_region').html('');
  doJavaGet(article_uri,function(result){
    if (result.datas.length < 12) {
      ui.noMoreData = true
    }

		// 限制内容长度
    for (var i = 0; i < result.datas.length; i++) {
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

    var tpl = document.getElementById('short_comment_tpl').innerHTML;
    var content = template(tpl, {list: result.datas});

    $('.hot_review_region').append(content)
		ui.loading = false;
  })
  currentPage++;
}

// 加载用户文章
function getUserArticle(){
  loadFlag = 4;
  currentPage = 1
  ui.loading = true;
  var article_uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12' + '&type=4' + '&creator=' + userinfo.id;
  $('.hot_review_region').html('');
  doJavaGet(article_uri,function(result){
    if (result.datas.length < 12) {
      ui.noMoreData = true
    }

    // 限制内容长度
    for (var i = 0; i < result.datas.length; i++) {
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

    var tpl = document.getElementById('article_tpl').innerHTML;
    var content = template(tpl, {list: result.datas});

    $('.hot_review_region').append(content);
		ui.loading = false;
  })
  currentPage++;
}

// 加载用户评测
function getUserLongComment(){
  loadFlag = 2;
  currentPage = 1;
  ui.loading = true;
  var article_uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12' + '&type=2' + '&creator=' + userinfo.id;
  $('.hot_review_region').html('');
  doJavaGet(article_uri,function(result){
    if (result.datas.length < 12) {
      ui.noMoreData = true
    }

    // 限制内容长度
    for (var i = 0; i < result.datas.length; i++) {
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

    var tpl = document.getElementById('long_comment_tpl').innerHTML;
    var content = template(tpl, {list: result.datas});

    $('.hot_review_region').append(content)
		ui.loading = false;
  })
  currentPage++;
}

// 加载用户短评
function getUserShortComment(){
  loadFlag = 3;
  currentPage = 1;
  ui.loading = true;
  var article_uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12' + '&type=1' + '&creator=' + userinfo.id;
  $('.hot_review_region').html('');
  doJavaGet(article_uri,function(result){
    if (result.datas.length < 12) {
      ui.noMoreData = true
    }

    var tpl = document.getElementById('short_comment_tpl').innerHTML;
    var content = template(tpl, {list: result.datas});

    $('.hot_review_region').append(content)
		ui.loading = false;
  })
  currentPage++;
}
