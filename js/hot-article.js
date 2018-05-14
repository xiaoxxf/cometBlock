// var userId = $.cookie('userid');//获取userid
// var userinfo = JSON.parse(localStorage.getItem('userinfo'))
var article_page = 1
var article_page_search = 1;
// var key_word = $('.search_bar').val()
var key_word = getUrlParam('serach_word_by_navbar')

// 判断下拉加载，1 -> 加载全部， 2 -> 加载搜索内容
var flag = null

var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}


// 从全局搜索进来，执行搜索
$(function(){

	if ( getUrlParam('serach_word_by_navbar')) {
		key_word = getUrlParam('serach_word_by_navbar');
		$('.search_bar').val(key_word)
	}

	if (key_word) {
		$('.search_bar').val(key_word);
		searchArticle();
	}
})

// 搜索文章
$('.search-click-hook').on('click',function(){
	key_word = $('.search_bar').val();
	if (key_word != '') {
		searchArticle();
	}
})
// 键盘enter搜索
$('.search_bar').keyup(function(){
	if (event.keyCode == 13) {
		key_word = $('.search_bar').val();
		if (key_word != '') {
			searchArticle();
		}
	}
})

// 搜索文章结果
function searchArticle(){
  flag = 2;
	article_page_search = 1;
	$(".waiting-data").fadeIn();
	$(".no-more-hook").css('display','none')

	ui.loading = true;
  ui.noMoreData = false;
	var uri = 'blockchain/quaryArticle?articleKeyWord=' + key_word + '&currentPage='
						+ article_page_search + '&pageSize=12'

  doJavaGet(uri, function(result){
			$('.article-top-box').html("");

      var content_length = null

			if (result.datas.length != 0) {

				for (var i = 0; i < result.datas.length; i++) {
					result.datas[i].textContent = result.datas[i].textContent.replace(/<[^>]+>/g,"")

					if ($(window).width() < 767) {
						content_length = 55
					}else{
						content_length = 300
					}

					if (result.datas[i].textContent.length > content_length) {
						result.datas[i].textContent = result.datas[i].textContent.substring(0,content_length) + "..."
					}

					// if (result.datas[i].textTitle.length > 30) {
					//   result.datas[i].textTitle = result.datas[i].textTitle.substring(0,30) + "..."
					// }

				}

				var tpl = document.getElementById('article_tpl').innerHTML;
				var content = template(tpl, {list: result.datas});
				$('.article-top-box').append(content)

				var imgW = $(".hot_zone .article-detail .article-icon").width();
				$(".hot_zone .article-detail .article-icon").css('height',imgW*270/230);

			}else{
				ui.noMoreData = true;
				$(".no-more-hook").fadeIn();
			}
			$(".waiting-data").hide();
			ui.loading = false
  })

}


// 加载更多（搜索）
function loadMoreSearchArticle(){
	flag = 2;
	ui.loading = true
	$(".loader1").css('display','flex');

	var uri = 'blockchain/quaryArticle?articleKeyWord=' + key_word + '&currentPage='
						+ article_page_search + '&pageSize=12'
	doJavaGet(uri, function(result){

			var content_length = null

			if (result.datas.length != 0) {

				for (var i = 0; i < result.datas.length; i++) {
					result.datas[i].textContent = result.datas[i].textContent.replace(/<[^>]+>/g,"")

					if ($(window).width() < 767) {
						content_length = 55
					}else{
						content_length = 300
					}

					if (result.datas[i].textContent.length > content_length) {
						result.datas[i].textContent = result.datas[i].textContent.substring(0,content_length) + "..."
					}

					// if (result.datas[i].textTitle.length > 30) {
					//   result.datas[i].textTitle = result.datas[i].textTitle.substring(0,30) + "..."
					// }

				}

				var tpl = document.getElementById('article_tpl').innerHTML;
				var content = template(tpl, {list: result.datas});
				$('.article-top-box').append(content)

				var imgW = $(".hot_zone .article-detail .article-icon").width();
				$(".hot_zone .article-detail .article-icon").css('height',imgW*270/230);

			}else{
				ui.noMoreData = true;
				$(".loader1").css('display','none');
				$(".no-more-hook").fadeIn();
			}
			ui.loading = false;

	})

}


// 滚动加载

var resetTimer = null
$(window).scroll(function(){
	if (resetTimer) {
		clearTimeout(resetTimer)
	}

	resetTimer = setTimeout(function(){

		// console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
		// console.log("页面的文档高度 ："+$(document).height());
		// console.log('浏览器的高度：'+$(window).height());

		var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
		totalheight = parseFloat($(window).height()) + parseFloat(srollPos);

		if ($(document).height() <= totalheight){
				//当滚动条到底时,这里是触发内容
				//异步请求数据,局部刷新dom
				if (!ui.noMoreData && !ui.loading && flag == 1) {
					// debugger
					article_page += 1;
					ui.loading = true;
          loadMoreArticle();
        }else if(!ui.noMoreData && !ui.loading && flag == 2){
          // debugger
					article_page_search += 1;
					ui.loading = true;
          loadMoreSearchArticle();
        }

		}
	},200)
})




// // 渲染评测
// function getArticle(){
//   flag = 1;
// 	article_page = 1;
// 	$(".waiting-data").fadeIn();
// 	$(".no-more-hook").css('display','none')
//
// 	ui.loading = true;
//   ui.noMoreData = false;
//   var uri = 'blockchain/quaryReview?currentPage=' + article_page + '&pageSize=4&type=2&like=1'
//   doJavaGet(uri, function(result){
//
// 			$('.article-top-box').html("");
//
//       var content_length = null
//
// 			if (result.datas.length != 0) {
//
// 				for (var i = 0; i < result.datas.length; i++) {
// 					result.datas[i].textContent = result.datas[i].textContent.replace(/<[^>]+>/g,"")
//
// 					if ($(window).width() < 767) {
// 						content_length = 55
// 					}else{
// 						content_length = 300
// 					}
//
// 					if (result.datas[i].textContent.length > content_length) {
// 						result.datas[i].textContent = result.datas[i].textContent.substring(0,content_length) + "..."
// 					}
//
// 					// if (result.datas[i].textTitle.length > 30) {
// 					//   result.datas[i].textTitle = result.datas[i].textTitle.substring(0,30) + "..."
// 					// }
//
// 				}
//
// 				var tpl = document.getElementById('article_tpl').innerHTML;
// 				var content = template(tpl, {list: result.datas});
// 				$('.article-top-box').append(content)
//
// 				var imgW = $(".hot_zone .article-detail .article-icon").width();
// 				$(".hot_zone .article-detail .article-icon").css('height',imgW*270/230);
//
// 			}else{
// 				ui.noMoreData = true;
// 				$(".no-more-hook").fadeIn();
// 			}
// 			$(".waiting-data").hide();
// 			ui.loading = false
//   })
//
// }
//
// // 加载更多（全部）
// function loadMoreArticle(){
// 	flag = 1;
// 	ui.loading = true
// 	$(".loader1").css('display','flex');
//
// 	var uri = 'blockchain/quaryReview?currentPage=' + article_page + '&pageSize=4&type=2&like=1'
// 	doJavaGet(uri, function(result){
//
// 			var content_length = null
//
// 			if (result.datas.length != 0) {
//
// 				for (var i = 0; i < result.datas.length; i++) {
// 					result.datas[i].textContent = result.datas[i].textContent.replace(/<[^>]+>/g,"")
//
// 					if ($(window).width() < 767) {
// 						content_length = 55
// 					}else{
// 						content_length = 300
// 					}
//
// 					if (result.datas[i].textContent.length > content_length) {
// 						result.datas[i].textContent = result.datas[i].textContent.substring(0,content_length) + "..."
// 					}
//
// 					// if (result.datas[i].textTitle.length > 30) {
// 					//   result.datas[i].textTitle = result.datas[i].textTitle.substring(0,30) + "..."
// 					// }
//
// 				}
//
// 				var tpl = document.getElementById('article_tpl').innerHTML;
// 				var content = template(tpl, {list: result.datas});
// 				$('.article-top-box').append(content)
//
// 				var imgW = $(".hot_zone .article-detail .article-icon").width();
// 				$(".hot_zone .article-detail .article-icon").css('height',imgW*270/230);
//
// 			}else{
// 				ui.noMoreData = true;
// 				$(".loader1").css('display','none');
// 				$(".no-more-hook").fadeIn();
// 			}
// 			ui.loading = false;
//
// 	})
//
// }
