var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

window.onload = function(){
  getAllUserDynamic();
}

var tpl_id = 'all_dynamic';
var currentPage = 1;

function getAllUserDynamic(){
  // loadFlag = 1;
  currentPage = 1;
  ui.loading = true;
  ui.noMoreData = false;

  var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12'

  // 首次加载
  // $('.read-more').css('display','none')
  $(".waiting-data").fadeIn();
  $('.dynamic_region').html('');

  doJavaGet(uri,function(result){
    if (result.datas.length == 0) {
      ui.noMoreData = true
      $(".waiting-data").hide();
      // $('.read-more').css('display','block')
      // $('.read-more').html('已无更多数据')
      return
    }

    // 限制内容长度，短评时不用
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


    var tpl = document.getElementById(tpl_id).innerHTML;
    var content = template(tpl, {list: result.datas});

    $(".waiting-data").hide();
    $('.dynamic_region').append(content)
    // $('.read-more').css('display','block')
    // $('.read-more').html('点击加载更多')
    ui.loading = false;
  })
}


function loadMoreDynamic(){
  currentPage++;
  ui.loading = true;
  ui.noMoreData = false;

  var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=12'

  // TODO: loading效果

  doJavaGet(uri,function(result){
    if (result.datas.length == 0) {
      ui.noMoreData = true
      // TODO: loading效果结束
      return
    }

    // 限制内容长度，短评时不用
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

    var tpl = document.getElementById(tpl_id).innerHTML;
    var content = template(tpl, {list: result.datas});
    // TODO: loading效果结束
    $('.dynamic_region').append(content)
    // $('.read-more').css('display','block')
    // $('.read-more').html('点击加载更多')
    ui.loading = false;
  })

}
