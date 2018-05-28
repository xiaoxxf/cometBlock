// 隐藏加载更多
$(function(){
	$('.load-more-container-wrap').css('display','none')
})
// 渲染类型
var chainType = []
$(function(){
	var uri = 'blockchain/quary?parentId=1'
	doJavaGet(uri,function(data){

		data.datas.forEach(function(value,index,array){
			chainType.push(value)
		})
		var coinType = document.getElementById('coin-type').innerHTML;
		var content = template(coinType, {list: chainType});
		$('.coin-item').append(content)
	},"json")

})


$('.coin-item').on('click', $('span'), function(e) {
	$('.coin-item').children().removeClass();
	$(e.target).addClass('cur')
})


$('.coin-item').on("mouseenter mouseleave",'span',function(e){
	if(e.type == "mouseenter"){
		$(e.target).css('background-color','#f0f0f0')
		$(e.target).css('border-radius','8px')
	}else if(e.type == "mouseleave"){
		$(e.target).css('background','')
		$(e.target).css('border-radius','')
	};
})
$('.coin-item').on("mouseenter mouseleave",'.cur',function(e){
	if(e.type == "mouseenter"){
		$(e.target).css('background-color','rgb(79, 163, 237)')
		$(e.target).css('border-radius','8px')
		$(e.target).css('color','white')
	}else if(e.type == "mouseleave"){
		$(e.target).css('background','')
		$(e.target).css('border-radius','')
		$(e.target).css('color','')
	};
})
var flag = 1; //判断滚动加载，1-所有项目， 2-搜索项目, 3-分类项目, 4-上新查询， 5-搜不到结果时候不允许滚动
var projectType = ''
var order = '' // 不传->评论数  2->评分（评价） 3->时间
// var search_type_page = null;
var index_page = 1;
var search_page = 1;
// var byTime_page = 1;

if (($(window).width() <= 767)) {
	var pageSize = 12;
}else{
	var pageSize = 15;
}

var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}


function getChain(projectTypeByPass){
	index_page = 1;

	if (projectTypeByPass == 0) {
		projectType = ''
	}else if(projectTypeByPass){
		projectType = projectTypeByPass
	}
	// projectType = projectTypeByPass ? projectTypeByPass : ''
	// order = orderByPass ? orderByPass : ''

	var uri = 'blockchain/quaryProjetList?currentPage=1&pageSize=' + pageSize
						+ '&order=' + order + '&projectType=' + projectType
	ui.loading = true;
	ui.noMoreData = false;
	// $('.load-more-container-wrap').css('display','none')
	$('.coin-list-wrap').html("");
	$(".waiting-data").fadeIn();
	$(".no-more-hook").css('display','none')

	doJavaGet(uri,function(result){
		// console.log(result.datas)

		$('.coin-list-wrap').html("");
		var tpl = document.getElementById('tpl').innerHTML;
		var content = template(tpl, {list: result.datas});
		$('.coin-list-wrap').append(content)
		$(".waiting-data").hide();
		var imgW = $(".coin-list-wrap li .inner-img-wrap").width();
		$(".coin-list-wrap li .inner-img-wrap").css('height',imgW*270/230);
		ui.loading = false;
	}, "json")
	flag = 1;
}

function loadMoreChain(){
	var uri = 'blockchain/quaryProjetList?currentPage=' + index_page + '&pageSize=' + pageSize
						+ '&order=' + order + '&projectType=' + projectType

	$(".loader1").css('display','flex');
  $('.load-more-container-wrap').css('display','')
	doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
			ui.noMoreData = true;
			$(".loader1").css('display','none');
			$(".no-more-hook").fadeIn();
		}else{
			var tpl = document.getElementById('tpl').innerHTML;
			var content = template(tpl, {list: result.datas});
			$('.coin-list-wrap').append(content);
			var imgW = $(".coin-list-wrap li .inner-img-wrap").width();
			$(".coin-list-wrap li .inner-img-wrap").css('height',imgW*270/230);
			$('.load-more-container-wrap').css('display','none')
			$(".loader1").css('display','none');
		}
		ui.loading = false;
	}, "json")
}

function serachChain(){
	search_page = 1;
	ui.loding = true;
	ui.noMoreData = false;

	var key_word = $('.search_bar')[0].value
	if (key_word == '') {
		return false
	}
	var uri = 'blockchain/quaryProjetList?currentPage=' + search_page + '&pageSize=' + pageSize + '&projectName=' + key_word

	// 点击搜索后隐藏分类、币种内容、排序菜单
	$('.category').css('display','none')
	$('.coin-list-wrap').html('')
	$('.search-result-box').html('');
	$(".waiting-data").fadeIn();
	$(".no-more-hook").css('display','none')
	$('.coin_order_list').css('display','none')


	if (($(window).width() <= 767)) {
		$('.load-category-box').css('display','none')
	}

	doJavaGet(uri,function(result){
		$(".waiting-data").hide();
		var search = document.getElementById('search').innerHTML;
		var content = template(search, {searchList: result.datas});
		$('.search-result-box').append(content);
		if (result.datas.length > 0) {
			$('.search-result-box').css('display','')
			$('.no-result').css('display','none')
			// 限制搜索结果描述的长度
			var descriptions = document.getElementsByClassName('coin-description');

			var show_length = 350
			if ($(window).width() <= 767) {
				show_length = 50
			}
			for (var i = 0; i < descriptions.length; i++) {
				// 过滤HTML和style标签
				descriptions[i].innerHTML = descriptions[i].innerText.replace(/<style(([\s\S])*?)<\/style>/g, '')
				descriptions[i].innerHTML = descriptions[i].innerHTML.replace(/<[^>]+>/g,"")

				if (descriptions[i].innerHTML.length > show_length) {
					descriptions[i].innerHTML = descriptions[i].innerHTML.substring(0,show_length) + "..."
				}
			}

      var imgW = $(".search-result .inner-img-wrap").width();
      $(".search-result .inner-img-wrap").css('height',imgW);
			if (result.datas.length < pageSize) {
				ui.noMoreData = true;
				$(".no-more-hook").fadeIn();
			}
			flag = 2;
		}else{
			$('.no-result').css('display','')
			$('.can-not-find').html('找不到"' + key_word +'"项目')
			flag = 5;
		}
	}, "json");
	ui.loading = false;

}

function loadMoreSearch(){
	var key_word = $('.search_bar')[0].value
	var uri = 'blockchain/quaryProjetList?currentPage=' + search_page + '&pageSize=' + pageSize + '&projectName=' + key_word
	$(".loader1").css('display','flex');
	$('.load-more-container-wrap').css('display','')
	doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
			ui.noMoreData = true;
			$(".loader1").css('display','');
			$(".no-more-hook").fadeIn();
		}else {
			ui.noMoreData = false;
			var search = document.getElementById('search').innerHTML;
			var content = template(search, {searchList: result.datas});
			$('.search-result-box').append(content);
			var imgW = $(".search-result .inner-img-wrap").width();
			$(".search-result .inner-img-wrap").css('height',imgW);
			var descriptions = document.getElementsByClassName('coin-description');

			var show_length = 220
			if ($(window).width() <= 767) {
				show_length = 50
			}

			for (var i = 0; i < descriptions.length; i++) {
				if (descriptions[i].innerText.length > show_length) {
					descriptions[i].innerText = descriptions[i].innerText.substring(0,show_length) + "..."
				}
			}
			$('.load-more-container-wrap').css('display','none')
			$(".loader1").css('display','none');
		}
		ui.loading = false;
	}, "json");

}

// 排序
$('.coin_order_list').on('click', 'a', function(e){
	$('.coin_order_list a').removeClass('coin_order_list_on_click')
	$(e.target).addClass('coin_order_list_on_click')
	e.preventDefault()
	switch (e.target.className.split(' ')[0]) {
		case 'order_by_review':
			order = '';
			getChain();
			break;
		case 'order_by_time':
			order = 1;
			getChain();
			break;
		case 'order_by_score':
			order = 2;
			getChain();
			break;
		default:

	}
})

// 搜索
$(".search-click-hook").on('click',function(){
	serachChain();
})
$(".search_bar").bind('keypress',function(event){
	if(event.keyCode == "13")
		serachChain();
})
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
				if (flag == 1 && !ui.noMoreData && !ui.loading) {
					//
					index_page += 1
					ui.loading = true;
					loadMoreChain();
				}else if (flag == 2 && !ui.noMoreData && !ui.loading) {
					search_page += 1;
					ui.loading = true;
					loadMoreSearch();
				}
				// else if (flag == 3 && !ui.noMoreData && !ui.loading){
				// 	search_type_page += 1;
				// 	ui.loading = true;
				// 	loadMoreSearchFromType();
				// }else if (flag == 4 && !ui.noMoreData && !ui.loading){
				// 	byTime_page += 1;
				// 	ui.loading = true;
				// 	lodeMoreChainByTime()
				// }

		}
	},200)
})

// 移动端的分类筛选显示
$(function(){
	if (($(window).width() <= 767)) {
		$('.category').css('display','none')
		$('.load-category-box').css('display','')
	}
})

$('.load-category').on('click',function(){
	$('.category').fadeToggle()
})


var resizeTimer = null;
$(window).on('resize', function () {

	if (resizeTimer) {
			 clearTimeout(resizeTimer)
	 }
	 resizeTimer = setTimeout(function(){
		 // 图片白底适应
		 var imgW = $(".coin-list-wrap li .inner-img-wrap").width();
     $(".coin-list-wrap li .inner-img-wrap").css('height',imgW*270/230);

	}, 100);

})

// 不是从全局搜索进来时候
if ( !getUrlParam('serach_word_by_navbar') ) {
	getChain();
}

// 从全局搜索进来
$(function(){
	var keyWord = getUrlParam('serach_word_by_navbar')

	if (keyWord) {
		$('.search_bar')[0].value = keyWord
		serachChain()
	}
})


// 创建新项目
$('.create_new_project').on('click', function(){
  // 判断是否登录
  if(!wechatBindNotice()){
    return;
  }
	else if(userId == undefined){
    layer.open({
      closeBtn:1,
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
