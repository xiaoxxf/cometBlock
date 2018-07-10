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
