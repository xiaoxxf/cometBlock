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
var current_attentionId = null; //当前要加载的关注的对象
var current_attentionType = null; //当前要加载的关注的类型

// 加载全部动态
$('.side_menu').on('click','.load_all_user_dynamic', function(){
	if (ui.loading) {
		return
	}
	$('.side_menu span').removeClass('dynamic_menu_on_focus');
	$('.side_menu li').removeClass('attention_dynamic_on_focus');
	$('.load_all_user_dynamic').addClass('dynamic_menu_on_focus');
	like = '';
	current_attentionId = null;
	current_attentionType = null;
	getAllUserDynamic();
})

// 加载推荐动态
$('.side_menu').on('click','.load_recommend_dynamic', function(){
	if (ui.loading) {
		return
	}
	$('.side_menu span').removeClass('dynamic_menu_on_focus');
	$('.side_menu li').removeClass('attention_dynamic_on_focus');
	$('.load_recommend_dynamic').addClass('dynamic_menu_on_focus');
	like = 1;
	current_attentionId = null;
	current_attentionType = null;
	getAllUserDynamic();
})


// 加载关注的人的动态
$('.follow_people_list').on('click', '.load_people_dynamic', function(e){
	$('.side_menu span').removeClass('dynamic_menu_on_focus');
	$('.side_menu li').removeClass('attention_dynamic_on_focus');
	$(this).addClass('attention_dynamic_on_focus');
	var self = $(this);
			current_attentionId = self.data('followingid'),
			current_attentionType = 1;
	getAllUserDynamic();
})

// 加载关注的专题的动态
$('.follow_topic_list').on('click', '.load_topic_dynamic',function(e){
	$('.side_menu span').removeClass('dynamic_menu_on_focus');
	$('.side_menu li').removeClass('attention_dynamic_on_focus');
	$(this).addClass('attention_dynamic_on_focus');
	current_attentionId = $(this).data('topicid'),
	current_attentionType = 2;
	getAllUserDynamic();
})

// 加载关注的项目的动态
$('.follow_project_list').on('click', '.load_project_dynamic' ,function(e){
	$('.side_menu span').removeClass('dynamic_menu_on_focus');
	$('.side_menu li').removeClass('attention_dynamic_on_focus');
	$(this).addClass('attention_dynamic_on_focus');
	var self = $(this);
			current_attentionId = self.data('projectid'),
			current_attentionType = 3;
	getAllUserDynamic();
})

function getAllUserDynamic(){
	if (ui.loading) {
		return
	}
  // loadFlag = 1;
  currentPage_dynamics = 1;
  ui.loading = true;
  ui.noMoreData = false;
	$(".no-more-hook").css('display','none');
	// 加载关注的人、项目、专题动态
	if (current_attentionId && current_attentionType) {
		switch (current_attentionType) {
			// 加载关注人的动态
			case 1:
			var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage_dynamics
								+ '&pageSize=' + pageSize_dynamics + '&creator=' + current_attentionId;
			break;
			// 加载关注专题的动态
			case 2:
				var uri = 'topic/quaryArticle?topicId=' + current_attentionId
									+ '&currentPage=' + currentPage_dynamics +'&pageSize=' + pageSize_dynamics
				break;
			// 加载关注项目的动态
			case 3:
				var uri = 'attention/quaryReviewById?projectId=' + current_attentionId + '&currentPage='
										+ currentPage_dynamics + '&pageSize=' + pageSize_dynamics
				break;
			default:

		}
	}
	// 加载全部动态或推荐动态
	else{
		var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage_dynamics + '&pageSize=' + pageSize_dynamics
							+ '&like=' + like

	}

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
  currentPage_dynamics++;
  ui.loading = true;
  ui.noMoreData = false;

	// 加载关注的人、项目、专题动态
	if (current_attentionId && current_attentionType) {
		switch (current_attentionType) {
			// 加载关注人的动态
			case 1:
			var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage_dynamics
								+ '&pageSize=' + pageSize_dynamics + '&creator=' + current_attentionId;
			break;
			// 加载关注专题的动态
			case 2:
				var uri = 'topic/quaryArticle?topicId=' + current_attentionId
									+ '&currentPage=' + currentPage_dynamics +'&pageSize=' + pageSize_dynamics
				break;
			// 加载关注项目的动态
			case 3:
				var uri = 'attention/quaryReviewById?projectId=' + current_attentionId + '&currentPage='
									+ currentPage_dynamics + '&pageSize=' + pageSize_dynami
				break;
			default:

		}
	}
	// 加载全部动态或推荐动态
	else{
		var uri = 'blockchain/quaryReviewByUser?currentPage=' + currentPage_dynamics + '&pageSize=' + pageSize_dynamics
							+ '&like=' + like
	}

  // TODO: loading效果
	$(".loader1").css('display','flex');
  // $('.load-more-container-wrap').css('display','')

  doJavaGet(uri,function(result){
    if (result.datas.length == 0) {
      ui.noMoreData = true;
			ui.loading = false;
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


// 滚动加载
var resetTimer = null;
var range = 50; //距下边界长度/单位px

$(window).scroll(function(){
	if (resetTimer) {
		clearTimeout(resetTimer)
	}

	resetTimer = setTimeout(function(){
		var srollPos = $(window).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)
		// console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
		// console.log("页面的文档高度 ："+$(document).height());
		// console.log('浏览器的高度：'+$(window).height());
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
$(".hot_review_region").on('click','.followBtn',function(){
	current_follow_button = this;
	var	followingId = $(this).data('followingid');
	var uri = 'attention/attent?attentionId=' + followingId  + '&creator=' + userId + '&password=' + userinfo.userPwd + '&type=1';

	doJavaGet(uri,function(res){
		if (res.code == 0) {
			$(current_follow_button).text('已关注');
			// layer.msg('关注成功',{time:1000})
			var temp_str = '<li class="load_people_dynamic" data-followingId=' + $(current_follow_button).data('followingId') +'>\
											'  +    +  '</li>'
			$('.follow_people_list')
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

// 加载关注的人、项目、专题列表

$(function(){
	var type = 0;  // 1->人 2->专题 3->项目
	var noMoreDataFlag = false;
	var append_class = null;
	var tpl_id = null;
	var currentPage_follow = 0;
	var pageSize_follow = 12;
	for (var i = 0; i < 3; i++) {
		type++;
		currentPage_follow = 0;
		noMoreDataFlag = false;
		switch (type) {
			case 1:
				append_class = '.follow_people_list';
				tpl_id = 'follow_people_list_tpl';
				break;
			case 2:
				append_class = '.follow_topic_list'
				tpl_id = 'follow_topic_list_tpl';
				break;
			case 3:
				append_class = '.follow_project_list'
				tpl_id = 'follow_project_list_tpl';

				break;
			default:
		}

		while(!noMoreDataFlag)
		{
			currentPage_follow++;
			var uri = 'attention/quaryAttentionData?creator=' + userId + '&password=' + userinfo.userPwd
								+ '&currentPage=' + currentPage_follow + '&pageSize=' + pageSize_follow + '&type=' + type;
			// 使用同步
			$.ajax({
		    url : WebApiHostJavaApi + uri,
		    type: "get",
		    async: false,//使用同步的方式,true为异步方式
		    processData: false,  // 不处理数据
		    contentType: false,   // 不设置内容类型

		    success:function(res){
					var tpl= document.getElementById(tpl_id).innerHTML;
					var content = template(tpl, {list: res.datas});
					$(append_class).append(content);
					res.datas.length < pageSize_follow ? noMoreDataFlag = true : noMoreDataFlag = false
					// noMoreDataFlag = true
		    },

		  });

		}
	}

})

// 侧边栏宽度
$(function(){
	var width = $('.hot_review_box').width() * 0.25;
	$('.side_menu').css({'width':width, 'transition': '0.5s'});
})

var resizeTimer = null;
$(window).on('resize', function () {

	if (resizeTimer) {
			 clearTimeout(resizeTimer)
	 }
	 resizeTimer = setTimeout(function(){
		 var width = $('.hot_review_box').width() * 0.25;
	 		$('.side_menu').css({'width':width, 'transition': '0.5s'});
	}, 100);
})
