
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

var flag = 1; //判断滚动加载，1-所有项目， 2-搜索项目, 3-分类项目
var noMoreData = false;
var searchType = ''
var search_type_page = 1;
var index_page = 1;
var search_page = 1;
var pageSize = 12;

// 分类查询
function searchFromType(e){
	$('.coin-list-wrap').html('')
	$(".waiting-data").fadeIn();
	searchType = 	e
	var pageSize = 12
	var uri = 'blockchain/quaryProjetList?currentPage=' + search_type_page + '&pageSize=' + pageSize + '&projectType=' + searchType

	doJavaGet(uri,function(result){
		var tpl = document.getElementById('tpl').innerHTML;
		var content = template(tpl, {list: result.datas});
		$('.coin-list-wrap').append(content)
		$(".waiting-data").hide();
	}, "json")
	flag = 3;
	noMoreData = false;

}

function loadMoreSearchFromType(){

	var uri = 'blockchain/quaryProjetList?currentPage=' + search_type_page + '&pageSize=' + pageSize + '&projectType=' + searchType

	doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
			noMoreData = true;
			return false
		}
		var tpl = document.getElementById('tpl').innerHTML;
		var content = template(tpl, {list: result.datas});
		$('.coin-list-wrap').append(content)
		$(".waiting-data").hide();
	}, "json")
	flag = 3;
}



var uri = 'blockchain/quaryProjetList?currentPage=1&pageSize=' + pageSize

function getChain(){
		doJavaGet(uri,function(result){
		var tpl = document.getElementById('tpl').innerHTML;
		var content = template(tpl, {list: result.datas});
		$('.coin-list-wrap').append(content)
		$(".waiting-data").hide();
	}, "json")
	flag = 1;
	noMoreData = false;
}
getChain();

function loadMoreChain(){
	var uri = 'blockchain/quaryProjetList?currentPage=' + index_page + '&pageSize=' + pageSize
	doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
			noMoreData = true;
			return false
		}
		var tpl = document.getElementById('tpl').innerHTML;
		var content = template(tpl, {list: result.datas});
		$('.coin-list-wrap').append(content)
	}, "json")
}

function serachChain(){
	var key_word = $('.search_bar')[0].value
	if (key_word == '') {
		return false
	}
	var uri = 'blockchain/quaryProjetList?currentPage=' + search_page + '&pageSize=' + pageSize + '&projectName=' + key_word

	// 点击搜索后隐藏分类和币种内容
	$('.coin-item').css('display','none')
	$('.coin-content').css('display','none')
	$(".waiting-data").fadeIn();

	doJavaGet(uri,function(result){
		$(".waiting-data").hide();
		var search = document.getElementById('search').innerHTML;
		var content = template(search, {searchList: result.datas});
		$('.search-result-box').html('');
		$('.search-result-box').append(content);

		if (result.datas.length > 0) {
			// 显示搜索结果
			$('.search-result-box').css('display','')
			$('.no-result').css('display','none')
			// 限制搜索结果描述的长度
			var descriptions = document.getElementsByClassName('coin-description');
			for (var i = 0; i < descriptions.length; i++) {
				if (descriptions[i].innerText.length > 220) {
					descriptions[i].innerText = descriptions[i].innerText.substring(0,220) + "..."
				}
			}
		}else{
			$('.no-result').css('display','')
			$('.can-not-find').html('找不到"' + key_word +'"项目')
		}
		flag = 2;
		noMoreData = false;


	}, "json");

}

function loadMoreSearch(){
	var key_word = $('.search_bar')[0].value
	var uri = 'blockchain/quaryProjetList?currentPage=' + search_page + '&pageSize=' + pageSize + '&projectName=' + key_word

	doJavaGet(uri,function(result){
		if (result.datas.length == 0) {
			noMoreData = true;
			return false
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
}

$(".search-click-hook").on('click',function(){
	serachChain();
})


window.onscroll = function () {
    //监听事件内容
		// console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
		// console.log("页面的文档高度 ："+$(document).height());
		// console.log('浏览器的高度：'+$(window).height());
    if( $(document).height()== $(window).height() + $(window).scrollTop() ){
        //当滚动条到底时,这里是触发内容
        //异步请求数据,局部刷新dom
				if (flag == 1 && !noMoreData) {
					index_page += 1
					loadMoreChain()
				}else if (flag == 2 && !noMoreData) {
					search_page += 1;
					loadMoreSearch();
				}else if (flag == 3 && !noMoreData){
					search_type_page += 1;
					loadMoreSearchFromType();
				}

    }
}
