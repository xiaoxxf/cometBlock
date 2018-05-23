// var userId = $.cookie('userid');//获取userid
// var userinfo = JSON.parse(localStorage.getItem('userinfo'))
// var localCookieWechatInfo = $.cookie('wechatInfo');
// localCookieWechatInfo = localCookieWechatInfo == undefined ? localCookieWechatInfo : JSON.parse(localCookieWechatInfo);
var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}



// 判断登录状态才能创建项目
$('.create_project_button').on('click', function(){
	if(!wechatBindNotice()){
		return;
	}
	if(userId == undefined){
		layer.open({
			closeBtn:0,
			title: '',
			content: '请先登录您的账号',
			btn: ['登录', '注册'],
			yes: function(){
				window.location.href='login.html'
			},
			btn2: function(){
				window.location.href='register.html'
			}
		});
	}else{
		window.location.href = 'chain-new.html'
	}

})

// 渲染热门专区
$(function(){

  var uri = 'blockchain/quaryProjetList?currentPage=1&pageSize=18'

  doJavaGet(uri,function(result){
	 // 渲染手机端
	 var tpl = document.getElementById('hot_coin_tpl_mobile').innerHTML;
	 var content = template(tpl, {list: result.datas});
	 $('.mobile-hot-coin').append(content)

   // console.log(result.datas)
	 var first_coin_list = result.datas.splice(0,6);
	 var second_coin_list = result.datas.splice(0,6);
	 var third_coin_list = result.datas
   var tpl = document.getElementById('hot_coin_tpl_1').innerHTML;
   var content = template(tpl, {list: first_coin_list});
   $('.hot_coin_region_1').append(content)

	 var tpl = document.getElementById('hot_coin_tpl_2').innerHTML;
	 var content = template(tpl, {list: second_coin_list});
	 $('.hot_coin_region_2').append(content);

	 var tpl = document.getElementById('hot_coin_tpl_2').innerHTML;
	 var content = template(tpl, {list: third_coin_list});
	 $('.hot_coin_region_3').append(content)

	 $('.project-count').html(result.count)
	 var imgW = $(".hot_coin_region .inner-img-wrap").width();
	 $(".hot_coin_region .inner-img-wrap").css('height',imgW*270/230);

  }, "json")

})

// 手机热门专区
// $(function(){
//
// 	var uri = 'blockchain/quaryProjetList?currentPage=1&pageSize=15'
//
//   doJavaGet(uri,function(result){
//    // console.log(result.datas)
//
//    var tpl = document.getElementById('hot_coin_tpl_mobile').innerHTML;
//    var content = template(tpl, {list: result.datas});
//    $('.mobile-hot-coin').append(content)
//
//   }, "json")
//
// })

// 渲染播报
$(function(){
  var uri = 'http://testapi.blockcomet.com/news/search?currentPage=1&pageSize=5&days=1';
	$.ajax({
		url : uri,
		type: "get",
		async: true,
		processData: false,  // 不处理数据
		contentType: false,   // 不设置内容类型

		// beforeSend: function(){
		//   // ui.fileUpLoading = true
		// },

		success:function(result){
			$('.hot_zone_news').html("");
	    var tpl = document.getElementById('news_tpl').innerHTML;
	    var content = template(tpl, {list: result.datas});
	    $('.hot_zone_news').append(content)


	    // 限制描述播报
	    var descriptions = document.getElementsByClassName('new_title');

	    if ($(window).width() > 990) {
	      var show_length = 60
	    }else if($(window).width() <= 990){
	      var show_length = 40
	    }

	    for (var i = 0; i < descriptions.length; i++) {
	      if (descriptions[i].innerText.length > show_length) {
	        descriptions[i].innerText = descriptions[i].innerText.substring(0,show_length) + "..."
	      }
	    }
		},

	});

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
	$('.hot_review_region').html('');
	$('.read-more').css('display','none');
	$('.topic_article_load').css('display','')

	ui.loading = true;
	ui.noMoreData = false;
  topic_article_page = 1;
  var self = $(e.currentTarget);
	topicName = self.data('topicname');
  topicId = self.data('topicid');

	// if (topicName == '编辑推荐') {
	// 	raise = 1;
	// }else{
	// 	raise = '';
	// }
  var uri = 'topic/quaryArticle?topicId=' + topicId + '&currentPage=' + topic_article_page + '&pageSize=4'
						// + '&raise=' + raise

  doJavaGet(uri, function(result){
    if (result.datas.length == 0) {
      $('.read-more').css('display','none');
			$('.topic_article_load').css('display','none')
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
			$('.topic_article_load').css('display','none')

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

	// if (topicName == '编辑推荐') {
	// 	raise = 1;
	// }else{
	// 	raise = '';
	// }

  var uri = 'topic/quaryArticle?topicId=' + topicId + '&currentPage=' + topic_article_page + '&pageSize=4'
						// + '&raise=' + raise

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
        speed: 1500,
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

//专题点击互相切换效果
$(".hot_review_title").on('click', '.topic_name', function(e) {
	e.preventDefault()
	e.stopPropagation()
	$(this).parent().parent().find('.topic_name').removeClass('hot-span-item');
	$(this).addClass('hot-span-item');
})


// banner跳转
$('.hot_zone_padding').on('click',function(){
	window.location = 'reading-campaign.html'
})

// 加载推荐专题
$(function(){
	var subject_page = 1
	var uri = 'topic/seachTopic?currentPage=' + subject_page + '&pageSize=5&creator=db2bc250-1b48-4add-b0c4-bc849bf79723'
	// ui_subject.loading = true;
	// ui_subject.noMoreData = false;
	doJavaGet(uri, function(res){
		if (res.datas.length > 0) {
			var tpl = document.getElementById('recommend_topic_tpl').innerHTML;
			var content = template(tpl, {list: res.datas});
			$('.hot_zone_topic').append(content);
		}
		// ui_subject.loading = false;
	})

})
