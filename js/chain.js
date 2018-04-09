
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
var flag = 1; //判断滚动加载，1-所有项目， 2-搜索项目, 3-分类项目
var searchType = ''
var search_type_page = 1;
var index_page = 1;
var search_page = 1;
var pageSize = 12;
var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

// 分类查询
function searchFromType(e){
	ui.loading = true;
	ui.noMoreData = false;
	$('.load-more-container-wrap').css('display','none')

	search_type_page = 1;
	$('.coin-list-wrap').html('')
	$(".waiting-data").fadeIn();
	searchType = 	e
	var pageSize = 12
	var uri = 'blockchain/quaryProjetList?currentPage=' + search_type_page + '&pageSize=' + pageSize + '&projectType=' + searchType

	doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
			ui.noMoreData = true;
			$('.load-more-container-wrap').css('display','')
		}else{
			var tpl = document.getElementById('tpl').innerHTML;
			var content = template(tpl, {list: result.datas});
			$('.coin-list-wrap').append(content)
	    var imgW = $(".coin-list-wrap li .inner-img-wrap").width();
	    $(".coin-list-wrap li .inner-img-wrap").css('height',imgW*270/230);
		}
		$(".waiting-data").hide();
		ui.loading = false;
	}, "json")
	flag = 3;
}

function loadMoreSearchFromType(){
	var uri = 'blockchain/quaryProjetList?currentPage=' + search_type_page + '&pageSize=' + pageSize + '&projectType=' + searchType

	doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
			ui.noMoreData = true;
			ui.loading = false;
			$('.load-more-container-wrap').css('display','')
		}else {
			var tpl = document.getElementById('tpl').innerHTML;
			var content = template(tpl, {list: result.datas});
			$('.coin-list-wrap').append(content)
			var imgW = $(".coin-list-wrap li .inner-img-wrap").width();
			$(".coin-list-wrap li .inner-img-wrap").css('height',imgW*270/230);
		}
		$(".waiting-data").hide();
	}, "json")
	flag = 3;
	ui.loading = false;
}


function getChain(){
	index_page = 1;
	var uri = 'blockchain/quaryProjetList?currentPage=1&pageSize=' + pageSize
	ui.loading = true;
	ui.noMoreData = false;
	$('.load-more-container-wrap').css('display','none')
	$('.coin-list-wrap').html("");
	$(".waiting-data").fadeIn();
	doJavaGet(uri,function(result){
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
getChain();

function loadMoreChain(){
	var uri = 'blockchain/quaryProjetList?currentPage=' + index_page + '&pageSize=' + pageSize
	doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
			ui.noMoreData = true;
			ui.loading = false;
			$('.load-more-container-wrap').css('display','')
		}else{
			var tpl = document.getElementById('tpl').innerHTML;
			var content = template(tpl, {list: result.datas});
			$('.coin-list-wrap').append(content);
			var imgW = $(".coin-list-wrap li .inner-img-wrap").width();
			$(".coin-list-wrap li .inner-img-wrap").css('height',imgW*270/230)
		}
		ui.loading = false;
	}, "json")
}

function serachChain(){
	search_page = 1;
	ui.loding = true;
	ui.noMoreData = false;
	$('.load-more-container-wrap').css('display','none')
	var key_word = $('.search_bar')[0].value
	if (key_word == '') {
		return false
	}
	var uri = 'blockchain/quaryProjetList?currentPage=' + search_page + '&pageSize=' + pageSize + '&projectName=' + key_word

	// 点击搜索后隐藏分类和币种内容
	$('.coin-item').css('display','none')
	$('.coin-content').css('display','none')
	$('.search-result-box').html('');
	$(".waiting-data").fadeIn();

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
			for (var i = 0; i < descriptions.length; i++) {
				if (descriptions[i].innerText.length > 220) {
					descriptions[i].innerText = descriptions[i].innerText.substring(0,220) + "..."
				}
			}
            var imgW = $(".search-result .inner-img-wrap").width();
            $(".search-result .inner-img-wrap").css('height',imgW);
		}else{
			$('.no-result').css('display','')
			$('.can-not-find').html('找不到"' + key_word +'"项目')
		}
	}, "json");
	flag = 2;
	ui.loading = false;

}

function loadMoreSearch(){
	var key_word = $('.search_bar')[0].value
	var uri = 'blockchain/quaryProjetList?currentPage=' + search_page + '&pageSize=' + pageSize + '&projectName=' + key_word

	doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
			ui.noMoreData = true;
			return false
		}else {
			ui.noMoreData = false;
		}
		var search = document.getElementById('search').innerHTML;
		var content = template(search, {searchList: result.datas});
		$('.search-result-box').append(content);

		var descriptions = document.getElementsByClassName('coin-description');
		for (var i = 0; i < descriptions.length; i++) {
			if (descriptions[i].innerText.length > 220) {
				descriptions[i].innerText = descriptions[i].innerText.substring(0,220) + "..."
			}
		}
	}, "json");
	ui.loading = false;

}

// 搜索
$(".search-click-hook").on('click',function(){
	serachChain();
})
$(".search_bar").bind('keypress',function(event){
	if(event.keyCode == "13")
		serachChain();
})
window.onscroll = function () {
    var srollPos = $(window).scrollTop();
    var totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
    //监听事件内容

		var srollPos = $(window).scrollTop();
		totalheight = parseFloat($(window).height()) + parseFloat(srollPos);


		console.log("total：" +  totalheight)
		console.log("页面的文档高度 ："+$(document).height());


    if( $(document).height() <= totalheight ){
        //当滚动条到底时,这里是触发内容
        //异步请求数据,局部刷新dom
				if (flag == 1 && !ui.noMoreData && !ui.loading) {
					index_page += 1
					ui.loading = true;
					loadMoreChain();
				}else if (flag == 2 && !ui.noMoreData && !ui.loading) {
					search_page += 1;
					ui.loading = true;
					loadMoreSearch();
				}else if (flag == 3 && !ui.noMoreData && !ui.loading){
					search_type_page += 1;
					ui.loading = true;
					loadMoreSearchFromType();
				}

    }
}
$(window).resize(function () {
    var imgW = $(".coin-list-wrap li .inner-img-wrap").width();
    $(".coin-list-wrap li .inner-img-wrap").css('height',imgW*270/230);
})
