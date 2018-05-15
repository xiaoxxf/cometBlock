// var userId = $.cookie('userid');//获取userid
// var userinfo = JSON.parse(localStorage.getItem('userinfo'))
// var localCookieWechatInfo = $.cookie('wechatInfo');
// localCookieWechatInfo = localCookieWechatInfo == undefined ? localCookieWechatInfo : JSON.parse(localCookieWechatInfo);
var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

$(function(){
  var uri = 'blockchain/quaryProjetList?currentPage=1&pageSize=15'

  doJavaGet(uri,function(result){
   // console.log(result.datas)

   var tpl = document.getElementById('hot_coin_tpl_mobile').innerHTML;
   var content = template(tpl, {list: result.datas});
   $('.mobile-hot-coin').append(content)

  }, "json")
})

// 判断登录状态才能创建项目
$('.create_project_button').on('click', function(){
	if (userId) {
		window.location.href = 'chain-new.html'
	}else{
		layer.open({
			closeBtn:0,
			title: '',
			closeBtn:1,
			content: '请先登录您的账号',
			btn: ['登录', '注册'],
			yes: function(){
				window.location.href='login.html'
			},
			btn2: function(){
				window.location.href='register.html'
			}
		});
	}
})

// 渲染热门专区
$(function(){
  var uri = 'blockchain/quaryProjetList?currentPage=1&pageSize=6'

  doJavaGet(uri,function(result){
   // console.log(result.datas)

   var tpl = document.getElementById('hot_coin_tpl_1').innerHTML;
   var content = template(tpl, {list: result.datas});
   $('.hot_coin_region_1').append(content)
   $('.project-count').html(result.count)

  }, "json")
})

// 2
$(function(){
  var uri = 'blockchain/quaryProjetList?currentPage=2&pageSize=6'

  doJavaGet(uri,function(result){
   // console.log(result.datas)


   var tpl = document.getElementById('hot_coin_tpl_2').innerHTML;
   var content = template(tpl, {list: result.datas});
   $('.hot_coin_region_2').append(content)

  }, "json")
})

// 3
$(function(){
  var uri = 'blockchain/quaryProjetList?currentPage=3&pageSize=6'

  doJavaGet(uri,function(result){
   // console.log(result.datas)


   var tpl = document.getElementById('hot_coin_tpl_2').innerHTML;
   var content = template(tpl, {list: result.datas});
   $('.hot_coin_region_3').append(content)

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


    // 限制描述播报
    var descriptions = document.getElementsByClassName('new_title');

    if ($(window).width() > 990) {
      var show_length = 15
    }else if($(window).width() <= 990){
      var show_length = 40
    }

    for (var i = 0; i < descriptions.length; i++) {
      if (descriptions[i].innerText.length > show_length) {
        descriptions[i].innerText = descriptions[i].innerText.substring(0,show_length) + "..."
      }
    }


  }, "json")

})

// 渲染专题
$(function(){
  var uri = 'topic/seachTopic?&currentPage=1&pageSize=6'

  doJavaGet(uri, function(result){
    var tpl = document.getElementById('topic_tpl').innerHTML;
    var content = template(tpl, {list: result.datas});
    $('.hot_review_title').append(content);
    $($('.hot_review_title .topic_name')[0]).addClass('hot-span-item');
    $($('.hot_review_title .topic_name')[0]).click();

  })

})

var topicId = ''
var topic_article_page = 1;
var topicName = '';
var raise = ''
// 渲染专题下的文章
$('.hot_review_title').on('click', '.topic_name', function(e){
	ui.loading = true;
	ui.noMoreData = false;
  topic_article_page = 1;
  var self = $(e.currentTarget);
	topicName = self.data('topicname');
  topicId = self.data('topicid');

	if (topicName == '编辑推荐') {
		raise = 1;
	}else{
		raise = '';
	}
  var uri = 'topic/quaryArticle?topicId=' + topicId + '&currentPage=' + topic_article_page + '&pageSize=12'
						+ '&raise=' + raise

  doJavaGet(uri, function(result){
    if (result.datas.length == 0) {
      $('.hot_review_region').html('');
      $('.read-more').css('display','none');
    }else{
      $('.read-more').css('display','');
      // 限制内容长度
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

      var tpl= document.getElementById('hot_article_tpl').innerHTML;
      var content = template(tpl, {list: result.datas});
      $('.hot_review_region').html('');
      $('.hot_review_region').append(content);
      $('.read-more').css('display','');
      $('.read-more').text('阅读更多');
    }

    ui.loading = false;

  })

})

// 专题下的文章加载更多
$('.read-more').on('click',function(){
  if (ui.loading || ui.noMoreData ) {
    return
  }

  ui.loading = true;
  $('.read-more').text('加载中...')
  topic_article_page++

	if (topicName == '编辑推荐') {
		raise = 1;
	}else{
		raise = '';
	}

  var uri = 'topic/quaryArticle?topicId=' + topicId + '&currentPage=' + topic_article_page + '&pageSize=12'
						+ '&raise=' + raise

  doJavaGet(uri, function(result){
    if (result.datas.length == 0) {
      ui.noMoreData = true;
      $('.read-more').text('已无更多数据');

    }else{
      // 限制内容长度
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

      var tpl= document.getElementById('hot_article_tpl').innerHTML;
      var content = template(tpl, {list: result.datas});
      $('.hot_review_region').append(content);
      $('.read-more').text('阅读更多');

    }

    ui.loading = false;

  })
})

// 长文点赞
$(".hot_review_region").on('click','.like-button',function (e) {
    e.preventDefault()
    var self = $(e.currentTarget);
    var reviewid = self.data('reviewid');
    var likes = 1;
    var like_count = $(self[0]).text().split('')[1];

    if(userinfo == null){
        layer.msg('您还没有登录')
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

// 调整浏览器宽度时自适应
var resizeTimer = null;
$(window).on('resize', function () {
  if (resizeTimer) {
			 clearTimeout(resizeTimer)
	 }
	 resizeTimer = setTimeout(function(){
     var imgW = $(".hot_zone .article-detail .article-icon").width();
     $(".hot_zone .article-detail .article-icon").css('height',imgW*270/230);

     // 限制搜索结果描述的长度
     // var descriptions = document.getElementsByClassName('new_title');
     // var show_length = null
		 // if ($(window).width() < 767) {
			//  show_length = 55
		 // }else{
			//  show_length = 120
		 // }
		 //
     // for (var i = 0; i < descriptions.length; i++) {
     //   if (descriptions[i].innerText.length > show_length) {
     //     descriptions[i].innerText = descriptions[i].innerText.substring(0,show_length) + "..."
     //   }
     // }
	}, 100);
})
$(document).ready(function () {
    //api 参考地址 http://www.swiper.com.cn/api/index.html
    var mySwiper = new Swiper ('.swiper-container', {
        autoplay: 5000,
        speed: 2500,
        autoplay: true,
        disableOnInteraction:false,
        loop : true,
        effect : 'slide',
        flipEffect: {
            slideShadows : true,
            limitRotation : true,
        },
        on: {
            slideChangeTransitionEnd: function(){
                var switchNum = this.activeIndex;
                if(switchNum == 4){
                    switchNum = 1;
                }
                if(switchNum == 0){
                    switchNum = 3;
                }
                $(".page-nums-switch").text(switchNum);
                //console.log(this.activeIndex);//切换结束时，告诉我现在是第几个slide
            },
        },
    })

    $('.swiper-btn-prev').click(function(){
        mySwiper.slidePrev();
        mySwiper.autoplay.start();
    })
    $('.swiper-btn-next').click(function(){
        mySwiper.slideNext();
       // $(".page-nums-switch").text(switchNum);
        mySwiper.autoplay.start();
    })

    // 鼠标悬停停止翻转
    $('.swiper-slide').mouseenter(function () {
      mySwiper.autoplay.stop();
    })
    $('.swiper-slide').mouseleave(function () {
       mySwiper.autoplay.start();
    })
})

//热门推荐点击互相切换效果
$(".hot_review_title").on('click', '.topic_name', function(e) {
	e.preventDefault()
	e.stopPropagation()
	$(this).parent().parent().find('.topic_name').removeClass('hot-span-item');
	$(this).addClass('hot-span-item');
})
