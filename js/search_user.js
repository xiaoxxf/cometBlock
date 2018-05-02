var keyWord = getUrlParam('serach_word_by_navbar')
var currentPage = 1;
var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

window.onload = function(){
  searchUser();
}

function searchUser(){
  currentPage = 1;
  ui.loading = true;
  ui.noMoreData = false;

  var uri = 'news/quaryusers?currentPage=' + currentPage + '&pageSize=12&realName=' + keyWord
  $(".waiting-data").fadeIn();

  doJavaGet(uri, function(result){
    if (result.datas.length == 0 ) {
      $(".waiting-data").hide();
      $('.no-result').css('display','')
    }
    $('.search_user_result').html('')
    var tpl = document.getElementById('user_search_tpl').innerHTML;
    var content = template(tpl, {list: result.datas});

    $('.search_user_result').append(content)
    $(".waiting-data").hide();
    ui.loading = false;
  })
}
