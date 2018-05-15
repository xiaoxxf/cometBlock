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
var pageSize = 6;
var like = '';

$('.attention_box').on('click', 'span', function(e){
	var index_menu = $('.attention_box span').index(e.currentTarget);
	$('.attention_box span').removeClass('dynamic_menu_on_focus');
	$(e.currentTarget).addClass('dynamic_menu_on_focus');
	switch (index_menu) {
		case 0:
			like = '';
			break;
		case 1:
			like = 1;
			break;
		default:
	}

	getAllUserDynamic();

})

// $('.load_all_user_dynamic').on('click',function(){
// 	like = '';
// 	getAllUserDynamic();
// })
//
// $('.load_recommend_dynamic').on('click',function(){
// 	like = 1;
// 	getAllUserDynamic();
// })

function getAllUserDynamic(){
	if (ui.loading) {
		return
	}
  // loadFlag = 1;
  currentPage = 1;
  ui.loading = true;
  ui.noMoreData = false;

  var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=' + pageSize + '&like=' + like

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

	var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage + '&pageSize=' + pageSize + '&like=' + like

  // TODO: loading效果
	$(".loader1").css('display','flex');
  $('.load-more-container-wrap').css('display','')

  doJavaGet(uri,function(result){
    if (result.datas.length == 0) {
      ui.noMoreData = true
      // TODO: loading效果结束
			$(".loader1").css('display','none');
			$(".no-more-hook").fadeIn();
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

		$('.load-more-container-wrap').css('display','none')
		$(".loader1").css('display','none');
    ui.loading = false;
  })

}



var resetTimer = null;
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
					loadMoreDynamic();
				}
		}
	},200)
})


// 点赞
$(".hot_review_region").on('click','.like-button',function (e) {
    e.preventDefault()
    var self = $(e.currentTarget);
    var reviewid = self.data('reviewid');
    var likes = 1;
    var like_count = $(self[0]).text().split('')[1];
		// 判断是否登录或绑定
		if(!wechatBindNotice()){
    	return;
    }
    if(userinfo == null){
        // layer.msg('您还没有登录')
        layer.open({
            type: 1,
            shade:0,
            title: 0,
            skin: 'layui-layer-report', //加上边框
            area: ['550px', '680px'], //宽高
            content: $("#short-comment-commit-layer").html()
        });
        return;
    }

    var uri = "blockchain/addLike?reviewId="+reviewid+"&userId="+userId+"&likes="+likes;
    doJavaGet(uri, function(res) {
        if(res.code == 0) {
          like_count++;
          var str = '<i class="fa fa-heart"></i>'
          self.html(str + ' ' + like_count)
          layer.msg(res.msg);
        } else {
          layer.msg(res.msg);
        }
    }, "json");
});
