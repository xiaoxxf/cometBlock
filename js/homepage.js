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
