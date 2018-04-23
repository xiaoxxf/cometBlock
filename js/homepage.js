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
