var userId = $.cookie('userid');//获取userid
var userinfo = JSON.parse(localStorage.getItem('userinfo'))
var article_pgae = 1
var article_page_search = 1;
var key_word = $('.search_bar').val()

// 判断下拉加载，1 -> 加载全部， 2 -> 加载搜索内容
var flag = null

var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

// 不是从全局搜索进来时候，默认加载全部
if ( !getUrlParam('serach_word_by_navbar') ) {
	getArticle();
}

// 从全局搜索进来，执行搜索
$(function(){
	var keyWord = getUrlParam('serach_word_by_navbar')

	if (keyWord) {
		$('.search_bar').val(keyWord);
		searchArticle(keyWord);
	}
})

// 渲染评测
function getArticle(){
  flag = 1

  ui.noMoreData = false;
  var uri = 'blockchain/quaryReview?currentPage=' + article_pgae + '&pageSize=4&type=2&like=1'
  doJavaGet(uri, function(result){
			if (	article_pgae == 1) {
				$('.article-top-box').html("");
			}
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
				// $(".no-more-hook").fadeIn();
			}

  })
	article_pgae++;

}


// 搜索文章
$('.search-click-hook').on('click',function(){
  if (key_word != '') {
    searchArticle(key_word);
  }
})


function searchArticle(keyWord){
  flag = 2;
  var uri = 'blockchain/quaryArticle?articleKeyWord=' + keyWord + 'currentPage=' + articl_pgae + 'pageSize=12'

  doJavaGet(uri, function(){

		if (article_page_search == 1) {
			$('.article-top-box').html("");

		}
    var content_length = null

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

  })
	article_page_search++;
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
					ui.loading = true;
          getArticle();
        }else if(!ui.noMoreData && !ui.loading && flag == 2){
          // debugger
					ui.loading = true;
          searchArticle();
        }

		}
	},200)
})
