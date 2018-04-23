// 渲染热门专区
$(function(){
  var uri = 'blockchain/quaryProjetList?currentPage=1&pageSize=5'

  doJavaGet(uri,function(result){
    // console.log(result.datas)

    $('.hot_coin_region').html("");
    var tpl = document.getElementById('hot_coin_tpl').innerHTML;
    var content = template(tpl, {list: result.datas});
    $('.hot_coin_region').append(content)

    var imgW = $(".hot_coin_region .inner-img-wrap").width();
    $(".hot_coin_region .inner-img-wrap").css('height',imgW*270/230);
  }, "json")
})


// 渲染播报
$(function(){
  var uri = 'news/quary?currentPage=1&pageSize=5&days=1';
  doJavaGet(uri,function(result){
    // console.log(result.datas)

    $('.hot_zone_news').html("");
    var tpl = document.getElementById('news_tpl').innerHTML;
    var content = template(tpl, {list: result.datas});
    $('.hot_zone_news').append(content)


    // 限制搜索结果描述的长度
    var descriptions = document.getElementsByClassName('new_title');

    var show_length = 16
    // if ($(window).width() <= 767) {
    //   show_length = 5
    // }

    for (var i = 0; i < descriptions.length; i++) {
      if (descriptions[i].innerText.length > show_length) {
        descriptions[i].innerText = descriptions[i].innerText.substring(0,show_length) + "..."
      }
    }


  }, "json")

})


var article_pgae = 1
// 渲染评测
$(function(){
  article_pgae = 1
  var uri = 'blockchain/quaryReview?currentPage=' + article_pgae + '&pageSize=4&type=2&like=1'
  doJavaGet(uri, function(result){
      $('.hot_review_region').html("");
      // debugger
      var tpl = document.getElementById('hot_article_tpl').innerHTML;
      var content = template(tpl, {list: result.datas});
      $('.hot_review_region').append(content)

      $('.article-count').html('共' + result.count +'篇文章被收录')

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
