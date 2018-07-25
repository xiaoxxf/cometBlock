// var userinfo = JSON.parse(localStorage.getItem('userinfo'))

//加载长评列表
var longCommentReviewPageSize = 5;
var longCommentCurrentPage = 1 ;
var commentList = [];
var reviewId = getUrlParam('reviewId');

function ajaxGetLongCommentReview() {
    // var projectId = getUrlParam('projectId');
    var anchorPoint = window.location.toString().split('#')[1];
    var toCommentsId = ''
    if (anchorPoint && anchorPoint != 'toComments') {
      toCommentsId = anchorPoint.split('|')[1];
    }

    if (toCommentsId) {
      var uri = 'blockchain/queryArticles?parentId='+reviewId+'&currentPage='+longCommentCurrentPage
                 +'&pageSize='+longCommentReviewPageSize+'&type=3' + '&toCommentsId=' + toCommentsId;
    }else{
      var uri = 'blockchain/queryArticles?parentId='+reviewId+'&currentPage='+longCommentCurrentPage
                 +'&pageSize='+longCommentReviewPageSize+'&type=3'
    }

    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            commentList = res.datas;
            for (var i = 0; i< commentList.length; i++ ){
            	commentList[i].createTime = changeTimeFormat(commentList[i].createTime);
            	for(var j = 0; j < commentList[i].fedbackList.length; j++){
            	    commentList[i].fedbackList[j].createTime = changeTimeFormat(commentList[i].fedbackList[j].createTime);
            	}
            }
            // console.log(res.datas)
            var commentTpl = $("#template-comment-list").html();
            var teamContent = template(commentTpl, {list: commentList});

            $(".comment-list-hook").html(teamContent);
            //if(res.datas.length >=10){
            // 分页数据处理
            longCommentCurrentPage = parseInt(res.msg);
            // if(longCommentCurrentPage == 1){
            initPage(res.count);
            // }
            $(".paginator-warp").show();

            $(".waiting-data").css('display','none');
        } else {
            layer.msg(res.msg);
        }


        // 有锚点时，滑动到评论处

        if(anchorPoint == 'toComments'){
          $('html,body').animate({scrollTop:$('#comments').position().top}, 800);
          // var t = $('#comments').offset().top;
          // $(window).scrollTop(t);//滚动到锚点位置
        }else if(toCommentsId){
          $('html,body').animate({scrollTop:$('#' + toCommentsId).position().top}, 800);
        }
    }, "json");
}
function initPage(count) {
    $(".paginator-warp").pagination({
        currentPage: longCommentCurrentPage,
        totalPage: parseInt(count/longCommentReviewPageSize)+1,
        isShow: false,
        count: 3,
        prevPageText: "< 前页",
        nextPageText: "后页 >",
        callback: function(current) {
            longCommentCurrentPage = current;
            pageTurning();
        }
    });

}
function pageTurning(){
  var uri = 'blockchain/queryArticles?parentId='+reviewId+'&currentPage='+longCommentCurrentPage
             +'&pageSize='+longCommentReviewPageSize+'&type=3';

  doJavaGet(uri,function(res){
    var commentTpl = $("#template-comment-list").html();
    var teamContent = template(commentTpl, {list: res.datas});
    $(".comment-list-hook").html(teamContent);
    $(".paginator-warp").show();
  })

}
/*
$("#paginator").on('click','.goNext',function (e) {
    var pageNum = $("#paginator .active").text();
    longCommentCurrentPage = pageNum;
    ajaxGetLongCommentReview();
})
$("#paginator").on('click','.goPre',function (e) {
    var pageNum = $("#paginator .active").text();
    longCommentCurrentPage = pageNum;
    ajaxGetLongCommentReview();
})*/

// 转换时间格式
function changeTimeFormat(dateTimeStamp){
	  var result;
	  dateTimeStamp = new Date(dateTimeStamp);
	    var minute = 1000 * 60;
	    var hour = minute * 60;
	    var day = hour * 24;
	    var halfamonth = day * 15;
	    var month = day * 30;
	    var now = new Date().getTime();
	    var diffValue = now - dateTimeStamp;
	    if(diffValue < 0){
	    return;
	  }
	    var monthC =diffValue/month;
	    var weekC =diffValue/(7*day);
	    var dayC =diffValue/day;
	    var hourC =diffValue/hour;
	    var minC =diffValue/minute;
	    if(monthC>=1){
	    if(monthC<=12)
	          result="" + parseInt(monthC) + "月前";
	else{
	  result="" + parseInt(monthC/12) + "年前";
	}
	}
	else if(weekC>=1){
	    result="" + parseInt(weekC) + "周前";
	}
	else if(dayC>=1){
	    result=""+ parseInt(dayC) +"天前";
	}
	else if(hourC>=1){
	    result=""+ parseInt(hourC) +"小时前";
	}
	else if(minC>=1){
	    result=""+ parseInt(minC) +"分钟前";
	}else{
	result="刚刚";
	}
	    return result;
	
}


//楼中楼查看更多
var subComment_pageSize = 10;
//var temp = null;
function moreComment(self){
//	temp = $(self).prev()[0];
	var subComment_currentPage = $(self).data("currentpage");

	var parentId=$(self).data("parentid")
	var uri = '/blockchain/queryArticlesList?currentPage='+ subComment_currentPage +'&pageSize='+ subComment_pageSize + '&type=' + 3 +'&parentId='+ parentId
	subComment_currentPage++

	doJavaGet(uri, function(res) {
		commentList = res.datas;
        for (var i = 0; i< commentList.length; i++ ){
        	commentList[i].createTime = changeTimeFormat(commentList[i].createTime);
        }
        if(res != null && res.code == 0) {
        	var resDataLength = res.datas.length;
			var search = document.getElementById('subCommentTpl').innerHTML;
		    //返回为第1页，去掉前三条数据
		    if($(self).data("currentpage") == 1){
		    	res.datas.splice(0,3);
			}
			var content = template(search, {list: res.datas});
		    $($(self).prev()[0]).append(content);

		    $(self).data("currentpage",subComment_currentPage);
		    var boxLength=$(".answer_container .answer_box").length;
		    if(resDataLength < subComment_pageSize){
//		    	$(".more_comment").removeAttr("onclick");
				$(self).removeAttr("onclick");
				$(self).html("已无更多数据");
		    }

           	
        } else {
            layer.msg(res.msg);
        }		    	
		
    }, "json");

	
}
