var userId = $.cookie('userid');//获取userid
var userinfo = JSON.parse(localStorage.getItem('userinfo'))

var article_pgae = 1
// 渲染评测
$(function(){
  article_pgae = 1
  var uri = 'blockchain/quaryReview?currentPage=' + article_pgae + '&pageSize=4&type=2&like=1'
  doJavaGet(uri, function(result){
      $('.article-top-box').html("");
      // debugger
      var tpl = document.getElementById('article_tpl').innerHTML;
      var content = template(tpl, {list: result.datas});
      $('.article-top-box').append(content)
  })

})

var noMoreData = false
// 评测加载更多
$('.read-more').on('click',function(){
  $('.read-more').html('加载中...')
  article_pgae+=1
  var uri = 'blockchain/quaryReview?currentPage=' + article_pgae + '&pageSize=4&type=2&like=1'

  if (!noMoreData) {
    doJavaGet(uri,function(result){
      if (result.datas.length == 0) {
        noMoreData = true
        $('.read-more').html('已无更多数据')
      }else{
        var tpl = document.getElementById('hot_article_tpl').innerHTML;
        var content = template(tpl, {list: result.datas});
        $('.hot_review_region').append(content)
        $('.read-more').html('阅读更多')
      }

    })
  }
})