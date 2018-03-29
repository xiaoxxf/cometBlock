//举报弹出框
$('#comments .report_comment').on('click',function (e) {
    console.log($(e.currentTarget))
    layer.open({
        type: 1,
        shade:0,
        title: '选择举报原因',
        skin: 'layui-layer-report', //加上边框
        area: ['442px', '200px'], //宽高
        content: $("#template-report-popup").html()
    });
});
//点击引用
$('#comments .reply_comment').on('click',function (e) {
    var self =$(e.currentTarget);
        self.addClass('reply-comment-click');
    $(".reply-comment").fadeIn()
    layer.open({
        type: 1,
        shade:0,
        title: '引用',
        skin: 'layui-layer-report', //加上边框
        area: ['550px', '680px'], //宽高
        content: $("#template-reply").html()
    });
});
//点击关闭
$(".review-comment-form .lnk-close").on('click',function (e) {
    $(".reply-comment").fadeOut();
    $('#comments .reply_comment').removeClass('reply-comment-click')
    console.log($(e.currentTarget))
});
//useful点击
$(".main-panel-useful button").on('click',function (e) {
    var self = $(e.currentTarget)
    var usefull = self.data('useful');
    var reviewid = '0e593b24-8d69-49e5-b09c-09b0166c800d'
    //var reviewid = self.data('reviewid');
    var userId = $.cookie('userid');//获取userid
    if(userId == null){
        layer.msg('您还没有登录')
    }
    var uri = "blockchain/addLike?reviewId="+reviewid+"&userId="+userId+"&usefull="+usefull;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            //todo addClass disabled
            console.log(res.msg)
            var num  = parseInt(self.parent().find(".num").text());
        } else {
            layer.msg(res.msg);
        }
    }, "json");
})

window.onload = function(){
    ajaxGetReviewDetail();
    ajaxGetLongCommentReview();
}
var shortCommentCurrentPage = 1 ;
var longCommentCurrentPage = 1 ;
var pageSize = 10;
function  ajaxGetReviewDetail() {
    var reviewId = getUrlParam('reviewId');
    var uri = 'blockchain/reviewDetail?reviewId='+reviewId ;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            var commentInfoData = res.datas;
            $(".comment-container-wrap .comment-detail-title").text(commentInfoData.textTitle);
            var commentTpl = $("#template-mian-detail").html();
            var content = template(commentTpl, {list: commentInfoData});
            $(".comment-detail-mian-hook").append(content);
        } else {
            layer.msg(res.msg);
        }
    }, "json");
}
//加载长评列表
function ajaxGetLongCommentReview() {
    // var projectId = getUrlParam('projectId');
    var reviewId = getUrlParam('reviewId');
    var uri = 'blockchain/quaryReview?parentId='+reviewId+'&currentPage='+longCommentCurrentPage+'&pageSize='+pageSize+'&type='+1;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            if(res.datas.length >0 ){
                var data = res.datas;
                var commentTpl = $("#template-comment-list").html();
                var teamContent = template(commentTpl, {list: res.datas});
                $(".comment-list-hook").append(teamContent);
                $(".long-comment-load-more .loading-more").show();
                $(".long-comment-load-more .loader1").css('display','none');
                if(res.datas.length < 10){
                }
            }else{
            }
        } else {
            layer.msg(res.msg);
        }
    }, "json");

}
//点击提交评论
$(".add_comment-hook").on('click',function (e) {
    // var projectId = getUrlParam('projectId');
    var userId = $.cookie('userid');//获取userid
    var reviewId = getUrlParam('reviewId');
    var shortTxt = $(".textarea-txt-hook").val();
    if(userId == undefined){
        layer.msg('您还没有登录');
        layer.open({
            type: 1,
            shade:0,
            title: '引用',
            skin: 'layui-layer-report', //加上边框
            area: ['550px', '680px'], //宽高
            content: $("#short-comment-commit-layer").html()
        });
    }
    if($.trim(shortTxt) == ''){
        layer.tips('评论不能为空', '.textarea-txt-hook', {
            tips: [1, '#4fa3ed'],
            time: 2000
        });
        return;
    }
    if(shortTxt.length >= 200){
        layer.tips('文字太多', '.textarea-txt-hook', {
            tips: [1, '#4fa3ed'],
            time: 2000
        });
        return;
    }
    var data = {
        textTitle: shortTxt,
        parentId: reviewId, //项目
        type: 1, //长文的type为2
        userId:userId
    }
    var uri = 'blockchain/addReview';
    var jsonData = JSON.stringify(data);
    doPostJavaApi(uri,jsonData, function(res) {
        if(res != null && res.code == 0) {
            layer.msg(res.msg);
        } else {
            layer.msg(res.msg);
        }
    }, "json");

})