var userId = $.cookie('userid');//获取userid
var userinfo = JSON.parse(localStorage.getItem('userinfo'))
$(function(){
  var uri = 'blockchain/quaryProjetList?currentPage=1&pageSize=15'

  doJavaGet(uri,function(result){
   // console.log(result.datas)

   var tpl = document.getElementById('hot_coin_tpl_mobile').innerHTML;
   var content = template(tpl, {list: result.datas});
   $('.mobile-hot-coin').append(content)

  }, "json")
})

// 渲染热门专区
$(function(){
  var uri = 'blockchain/quaryProjetList?currentPage=1&pageSize=5'

  doJavaGet(uri,function(result){
   // console.log(result.datas)

   var tpl = document.getElementById('hot_coin_tpl_1').innerHTML;
   var content = template(tpl, {list: result.datas});
   $('.hot_coin_region_1').append(content)

  }, "json")
})

// 2
$(function(){
  var uri = 'blockchain/quaryProjetList?currentPage=2&pageSize=5'

  doJavaGet(uri,function(result){
   // console.log(result.datas)


   var tpl = document.getElementById('hot_coin_tpl_2').innerHTML;
   var content = template(tpl, {list: result.datas});
   $('.hot_coin_region_2').append(content)

  }, "json")
})

// 3
$(function(){
  var uri = 'blockchain/quaryProjetList?currentPage=3&pageSize=5'

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


    // 限制搜索结果描述的长度
    var descriptions = document.getElementsByClassName('new_title');

    if ($(window).width() > 970 && $(window).width() < 1260) {
      var show_length = 10
    }else if($(window).width() <= 990){
      var show_length = 50
    }
    else{
      var show_length = 15
    }
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

var article_loading = false
var article_pgae = 1
// 渲染评测
$(function(){
  article_pgae = 1
  article_loading = true
  var uri = 'blockchain/quaryReview?currentPage=' + article_pgae + '&pageSize=4&type=2&like=1'
  doJavaGet(uri, function(result){
      // $('.hot_review_region').html("");

      // 限制标题和内容长度
      for (var i = 0; i < result.datas.length; i++) {
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

        // if (result.datas[i].textTitle.length > 30) {
        //   result.datas[i].textTitle = result.datas[i].textTitle.substring(0,30) + "..."
        // }


      }

      var tpl = document.getElementById('hot_article_tpl').innerHTML;
      var content = template(tpl, {list: result.datas});
      $('.hot_review_region').append(content)

      var imgW = $(".hot_zone .article-detail .article-icon").width();
      $(".hot_zone .article-detail .article-icon").css('height',imgW*270/230);

      $('.article-count').html(result.count)
      article_loading = false
  })
})

var noMoreData = false
// 评测加载更多
$('.read-more').on('click',function(){

  article_pgae+=1
  var uri = 'blockchain/quaryReview?currentPage=' + article_pgae + '&pageSize=4&type=2&like=1'

  if (!noMoreData && !article_loading) {
    $('.read-more').html('加载中...')

    doJavaGet(uri,function(result){

      if (result.datas.length == 0) {
        noMoreData = true
        $('.read-more').html('已无更多数据')
      }else{

        var content_length = null
        if ($(window).width() < 767) {
          content_length = 55
        }else{
          content_length = 120
        }

        // 限制标题和内容长度
        for (var i = 0; i <result.datas.length; i++) {
          result.datas[i].textContent = result.datas[i].textContent.replace(/<[^>]+>/g,"")

          if (result.datas[i].textContent.length > content_length) {
            result.datas[i].textContent = result.datas[i].textContent.substring(0,content_length) + "..."
          }
          // if (result.datas[i].textTitle.length > 30) {
          //   result.datas[i].textTitle = result.datas[i].textTitle.substring(0,30) + "..."
          // }

        }


        var tpl = document.getElementById('hot_article_tpl').innerHTML;
        var content = template(tpl, {list: result.datas});
        $('.hot_review_region').append(content)

        var imgW = $(".hot_zone .article-detail .article-icon").width();
        $(".hot_zone .article-detail .article-icon").css('height',imgW*270/230);
        $('.read-more').html('阅读更多')
      }

    })
  }
})


// 长文点赞
// $(".hot_review_region").on('click','.like-button',function (e) {
//     e.preventDefault()
//     var self = $(e.currentTarget);
//     var reviewid = self.data('reviewid');
//     var likes = 0;
//     var like_count = $(self[0]).text().split('')[1];
//     debugger
//
//     if(userinfo == null){
//         layer.msg('您还没有登录')
//         layer.open({
//             type: 1,
//             shade:0,
//             title: 0,
//             skin: 'layui-layer-report', //加上边框
//             area: ['550px', '680px'], //宽高
//             content: $("#short-comment-commit-layer").html()
//         });
//         return;
//     }
//
//     var uri = "blockchain/addLike?reviewId="+reviewid+"&userId="+userId+"&likes="+likes;
//     doJavaGet(uri, function(res) {
//         if(res.code == 0) {
//           $(self[0]).text('' + like_count++)
//           layer.msg(res.msg);
//         } else {
//           layer.msg(res.msg);
//         }
//     }, "json");
// });

var resizeTimer = null;
$(window).on('resize', function () {
  if (resizeTimer) {
			 clearTimeout(resizeTimer)
	 }
	 resizeTimer = setTimeout(function(){
     var imgW = $(".hot_zone .article-detail .article-icon").width();
     $(".hot_zone .article-detail .article-icon").css('height',imgW*270/230);

     // 限制搜索结果描述的长度
     var descriptions = document.getElementsByClassName('new_title');
     var show_length = null
     if ( $(window).width() > 767 && $(window).width() < 1200) {
       show_length = 10
     }else{
       show_length = 25
     }

     for (var i = 0; i < descriptions.length; i++) {
       if (descriptions[i].innerText.length > show_length) {
         descriptions[i].innerText = descriptions[i].innerText.substring(0,show_length) + "..."
       }
     }
	}, 100);


})
$(document).ready(function () {
    //api 参考地址 http://www.swiper.com.cn/api/index.html
    var mySwiper = new Swiper ('.swiper-container', {
        autoplay: 5000,
        speed: 2000,
        autoplay: true,
        disableOnInteraction:false,
        loop : true,
        effect : 'flip',
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
})
