var userId = $.cookie('userid');//获取userid
var userinfo = JSON.parse(localStorage.getItem('userinfo'))

var article_pgae = 1
// 渲染评测
$(function(){

  article_pgae = 1
  ui.noMoreData = false;
  var uri = 'blockchain/quaryReview?currentPage=' + article_pgae + '&pageSize=4&type=2&like=1'
  doJavaGet(uri, function(result){
      $('.article-top-box').html("");
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

})

var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}


// 评测加载更多
function loadMoreArticle(){
  article_pgae+=1
  var uri = 'blockchain/quaryReview?currentPage=' + article_pgae + '&pageSize=4&type=2&like=1'

  $(".loader1").css('display','flex');

  doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
      ui.noMoreData = true;
			$(".loader1").css('display','none');
			$(".no-more-hook").fadeIn();
		}else{

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

      }


      var tpl = document.getElementById('article_tpl').innerHTML;
      var content = template(tpl, {list: result.datas});
      $('.article-top-box').append(content)

      var imgW = $(".hot_zone .article-detail .article-icon").width();
      $(".hot_zone .article-detail .article-icon").css('height',imgW*270/230);

      $(".loader1").css('display','none');
		}
		ui.loading = false;
	}, "json")

}

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
				if (!ui.noMoreData && !ui.loading) {
					// debugger
					ui.loading = true;
          loadMoreArticle();
        }

		}
	},200)
})
