var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

window.onload = function(){
  getAllUserDynamic();
}

var tpl_id = 'all_dynamic';
var currentPage_dynamics = 1;
var pageSize_dynamics = 6;
var like = '';

$('.side_menu').on('click','.load_all_user_dynamic', function(){
	if (ui.loading) {
		return
	}
	$('.side_menu span').removeClass('dynamic_menu_on_focus');
	$('.load_all_user_dynamic').addClass('dynamic_menu_on_focus');
	like = '';
	getAllUserDynamic();
})

$('.side_menu').on('click','.load_recommend_dynamic', function(){
	if (ui.loading) {
		return
	}
	$('.side_menu span').removeClass('dynamic_menu_on_focus');
	$('.load_recommend_dynamic').addClass('dynamic_menu_on_focus');
	like = 1;
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

  var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage_dynamics + '&pageSize=' + pageSize_dynamics + '&like=' + like

  // 首次加载
  // $('.read-more').css('display','none')
  $(".refresh_load").fadeIn();
  $('.dynamic_region').html('');

  doJavaGet(uri,function(result){
    if (result.datas.length == 0) {
      ui.noMoreData = true
      $(".refresh_load").hide();
      // $('.read-more').css('display','block')
      // $('.read-more').html('已无更多数据')
      return
    }

    // 限制内容长度
    for (var i = 0; i < result.datas.length; i++) {

      if (result.datas[i].textContent) {
				// 去除HTML标签和无用的空格
        result.datas[i].textContent = result.datas[i].textContent.replace(/<[^>]+>/g,"").replace(/^\s+|\s+$/g,"")

        var content_length = null
        if ($(window).width() < 767) {
          content_length = 85
        }else{
          content_length = 150
        }

        if (result.datas[i].textContent.length > content_length) {
          result.datas[i].textContent = result.datas[i].textContent.substring(0,content_length) + "..."
        }
      }

    }


    var tpl = document.getElementById(tpl_id).innerHTML;
    var content = template(tpl, {list: result.datas});

    $(".refresh_load").hide();
    $('.dynamic_region').append(content)
    // $('.read-more').css('display','block')
    // $('.read-more').html('点击加载更多')
    ui.loading = false;
  })
}

// 加载更多
function loadMoreDynamic(){
  currentPage++;
  ui.loading = true;
  ui.noMoreData = false;

	var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage_dynamics + '&pageSize=' + pageSize_dynamics + '&like=' + like

  // TODO: loading效果
	$(".loader1").css('display','flex');
  // $('.load-more-container-wrap').css('display','')

  doJavaGet(uri,function(result){
    if (result.datas.length == 0) {
      ui.noMoreData = true
      // TODO: loading效果结束
			$(".loader1").css('display','none');
			$(".no-more-hook").fadeIn();
      return
    }

    // 限制内容长度
    for (var i = 0; i < result.datas.length; i++) {

      if (result.datas[i].textContent) {
				// 去除HTML标签和无用的空格
        result.datas[i].textContent = result.datas[i].textContent.replace(/<[^>]+>/g,"").replace(/^\s+|\s+$/g,"")
        var content_length = null
        if ($(window).width() < 767) {
          content_length = 55
        }else{
          content_length = 150
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

		// $('.load-more-container-wrap').css('display','none')
		$(".loader1").css('display','none');
    ui.loading = false;
  })

}


var resetTimer = null;
var range = 50; //距下边界长度/单位px

$(window).scroll(function(){
	if (resetTimer) {
		clearTimeout(resetTimer)
	}

	resetTimer = setTimeout(function(){
		var srollPos = $(window).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)
		console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
		console.log("页面的文档高度 ："+$(document).height());
		console.log('浏览器的高度：'+$(window).height());
		totalheight = parseFloat($(window).height()) + parseFloat(srollPos);

		if (($(document).height() - range) <= totalheight){
			//当滚动条到底时,这里是触发内容
			//异步请求数据,局部刷新dom
			if (!ui.noMoreData && !ui.loading) {
				//
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


// 关注
var current_follow_button = null
$(".hot_review_region").on('click','.followBtn',function (e) {
	current_follow_button = e.currentTarget;
	var self = $(e.currentTarget),
			followingId = self.data('followingId');

	var uri = 'attention/attent?attentionId=' + followingId  + '&creator=' + userId + '&password=' + userinfo.userPwd + '&type=1';

	doJavaGet(uri,function(res){
		if (res.code == 0) {
			$(current_follow_button).text('已关注');
			// layer.msg('关注成功',{time:1000})
		}
	});
})

// 侧边栏
$('.follow_people .load_follow_people').on('click',function(){
	$('.follow_people_list').toggle();

})

$('.follow_project .load_follow_project').on('click',function(){
	$('.follow_project_list').toggle();
})

$('.follow_topic .load_follow_topic').on('click',function(){
	$('.follow_topic_list').toggle();
})

// 加载关注的人、项目、专题
// var currentPage_follow = 0;
// var pageSize_follow = 12;
// $(function(){
// 	var type = null;
// 	var noMoreDataFlag = false;
// 	var append_class = null;
// 	for (var i = 0; i < 3; i++) {
// 		type = i;
// 		noMoreDataFlag = false;
// 		switch (i) {
// 			case 0:
// 				append_class = '.ollow_people_list'
// 				break;
// 			case 1:
// 				append_class = '.follow_project_list'
// 				break;
// 			case 2:
// 				append_class = '.follow_topic_list'
// 				break;
// 			default:
// 		}
//
// 		while(!noMoreDataFlag)
// 		{
// 			currentPage_follow++;
// 			var uri = 'attention/quaryAttentionData?creator=' + userId + '&password=' + userinfo.userPwd
// 								+ '&currentPage=' + currentPage_follow + '&pageSize=' + pageSize_follow + '&type=' + type;
// 			// 使用同步
// 			$.ajax({
// 		    url : WebApiHostJavaApi + uri,
// 		    type: "get",
// 		    async: false,//使用同步的方式,true为异步方式
// 		    processData: false,  // 不处理数据
// 		    contentType: false,   // 不设置内容类型
//
// 		    success:function(res){
// 					var tpl= document.getElementById('coin-type').innerHTML;
// 					var content = template(tpl, {list: chainType});
// 					$(append_class).append(content)
// 					res.datas.length < pageSize_follow ? noMoreDataFlag = true : noMoreDataFlag = false
// 		    },
//
// 		  });
//
// 		}
// 	}
//
// })
