window.onload=function(){
  getTopicIndex();
}
var ui = {
	"noData": false,
	"noMoreData": false,
	"loading": false
}

var current_page = 1;
function getTopicIndex(){
	if(ui.loading){
		return
	}
	ui.loading = true;
	current_page = 1;
	var uri = 'topic/seachTopic?currentPage=' + current_page +'&pageSize=6'
	doJavaGet(uri ,function(result){
		if(result.code == 0){
		//限制长度
		for(var i = 0; i < result.datas.length; i++){
			if(result.datas[i].description.length > 50){
				result.datas[i].description = result.datas[i].description.substr(0,50) + '...'
			}
		}

		var tpl= document.getElementById('topic_topic_index').innerHTML;
	    var content = template(tpl, {list: result.datas});
	    $('.hot_topic_list').append(content)
		}
		ui.loading = false;
	},"JSON")
}

function getMoreTopicIndex(){
	if(ui.loading || ui.noMoreData){
		return
	}
	ui.loading = true;
	$('.loader1').css('display','')
	current_page++;
	var uri = 'topic/seachTopic?currentPage=' + current_page +'&pageSize=6';
	doJavaGet(uri ,function(result){
	if(result.code == 0){
		//限制长度
		for(var i = 0; i < result.datas.length; i++){
			if(result.datas[i].description.length > 50){
				result.datas[i].description = result.datas[i].description.substr(0,50) + '...'
			}
		}

		var tpl= document.getElementById('topic_topic_index').innerHTML;
	    var content = template(tpl, {list: result.datas});
	    $('.hot_topic_list').append(content);
	    $('.loader1').css('display','none');
	    if(result.datas.length == 0){
	    	ui.noMoreData = true;
	    	$('.no-more-hook').css('display','')
	    }
		ui.loading = false;
	}

	},"JSON")
}

var resetTimer = null;
var range = 50; //距下边界长度/单位px
//滚动加载
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
			getMoreTopicIndex();
		}
	},200)
})


function jumpToTopic(e){
	var topicId = $(e).data('topicid');
	window.location = 'topic-show.html?subjectId=' + topicId
}
