// var userinfo = JSON.parse(localStorage.getItem('userinfo'))

//加载长评列表
function ajaxGetLongCommentReview() {
    // var projectId = getUrlParam('projectId');
    var reviewId = getUrlParam('reviewId');
    var uri = 'blockchain/quaryReview?parentId='+reviewId+'&currentPage='+longCommentCurrentPage+'&pageSize='+pageSize+'&type='+3;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
           // if(res.datas.length >0 ){
                var data = res.datas;
                // console.log(res.datas)
                var commentTpl = $("#template-comment-list").html();
                var teamContent = template(commentTpl, {list: res.datas});
                $(".comment-list-hook").html(teamContent);
                //if(res.datas.length >=10){
                // 分页数据处理
                if(longCommentCurrentPage == 1){
                    initPage(res.count);
                }
                $(".paginator-warp").show();
                //}
           // }else{
            //}
            $(".waiting-data").css('display','none');
        } else {
            layer.msg(res.msg);
        }


        // 有锚点时，滑动到评论处
        var url = window.location.toString();//进这个页面的url
        var id = url.split('#')[1];
        if(id == 'toComments'){
           var t = $('#comments').offset().top;
           $(window).scrollTop(t);//滚动到锚点位置
        }
    }, "json");
}
function initPage(count) {
    $(".paginator-warp").pagination({
        currentPage: longCommentCurrentPage,
        totalPage: parseInt(count/pageSize)+1,
        isShow: false,
        count: 3,
        prevPageText: "< 前页",
        nextPageText: "后页 >",
        callback: function(current) {
            longCommentCurrentPage = current;
            ajaxGetLongCommentReview();
        }
    });

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
