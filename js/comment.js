//举报弹出框
$('.comment-list-hook').on('click','.comment-item .report_comment',function (e) {
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
$('.comment-list-hook').on('click','.comment-item .reply_comment',function (e) {
    var self =$(e.currentTarget),
        author = self.data('user_name'),
        parentTxt = self.data('parenttxt');
        self.addClass('reply-comment-click');
    var userId = $.cookie('userid');//获取userid
    if(userId == undefined){
        layer.msg('您还没有登录');
        layer.open({
            type: 1,
            shade:0,
            title: 0,
            skin: 'layui-layer-report', //加上边框
            area: ['550px', '680px'], //宽高
            content: $("#template-reply").html()
        });
        return;
    }
    $("#add_comment .author").text(author);
    $("#add_comment .parent-txt .short").text(parentTxt);
    $(".reply-comment").fadeIn()
});
//点击删除
$('.comment-list-hook').on('click','.comment-item .reply_delete',function (e) {
    var self =$(e.currentTarget),
        author = self.data('user_name'),
        userPwd = JSON.parse(window.localStorage.getItem('userinfo')).userPwd,
        reviewId = self.data('reviewid');
        parentTxt = self.data('parenttxt');
    var userId = $.cookie('userid');//获取userid
    if(userId == undefined){
        layer.msg('您还没有登录');
        layer.open({
            type: 1,
            shade:0,
            title: 0,
            skin: 'layui-layer-report', //加上边框
            area: ['550px', '680px'], //宽高
            content: $("#template-reply").html()
        });
        return;
    }
    layer.confirm('确定删除您的评论么?',
        {
        icon: 3,
        title:0,
        shade:0,
        title: 0,
        skin: 'layui-layer-report', //加上边框
        },
        function(index){
        //do something
        layer.close(index);
    });
});
//点击关闭
$(".comment-list-hook").on('click','.review-comment-form .lnk-close',function (e) {
    $(".reply-comment").fadeOut();
    $('#comments .reply_comment').removeClass('reply-comment-click')
    console.log($(e.currentTarget))
});
//useful点击
$(".comment-detail-mian-hook").on('click','.main-panel-useful button',function (e) {
    var self = $(e.currentTarget)
    var usefull = self.data('useful');
    var reviewId = getUrlParam('reviewId');
    //var reviewid = self.data('reviewid');
    var userId = $.cookie('userid');//获取userid
    if(userId == undefined){
        layer.msg('您还没有登录');
        layer.open({
            type: 1,
            shade:0,
            title: 0,
            skin: 'layui-layer-report', //加上边框
            area: ['550px', '680px'], //宽高
            content: $("#template-reply").html()
        });
        return;
    }
    var uri = "blockchain/addLike?reviewId="+reviewId+"&userId="+userId+"&usefull="+usefull;
    if(self.hasClass('disabled')){
        return;
    }
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            var parentDom =  self.parent();
            var siblingNum = parseInt(self.siblings('.btn').find('.num').text());
            var selfNum = parseInt(self.find('.num').text());
            if(parentDom.find('.disabled').length > 0){
                self.siblings('.btn').find('.num').text(siblingNum-1);
            }
            self.siblings('.btn').removeClass('disabled');
            self.addClass('disabled');
            self.find('.num').text(selfNum+1)
            var num  = parseInt(self.parent().find(".num").text());
        } else {
            layer.msg(res.msg);
        }
    }, "json");
})

//喜欢点击
$(".comment-detail-mian-hook").on('click','.main-like .LikeButton',function (e) {
    var self = $(e.currentTarget).toggleClass("clicked-like");
    var reviewid = self.data('reviewid');
    var likesnum= self.data('likes_nums')+1;
    var userId = $.cookie('userid');//获取userid
    var likes = 0;
    var score = $("#n_rating").val();
    var shortTxt = $(".short-comment").val();
    if(userId == null){
        layer.msg('您还没有登录');
    }
    if(self.hasClass('clicked-like')){
        likes = 1;
    }else{
        likes = 0;
    }
    var uri = "blockchain/addLike?reviewId="+reviewid+"&userId="+userId+"&likes="+likes;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            console.log(res.msg)
            var num  = parseInt(self.find(".LikeButton-count").text())-1;
            if(self.hasClass('clicked-like')){
                self.find(".LikeButton-count").text(likesnum)
            }else{
                self.find(".LikeButton-count").text(num);
            }
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
$(".comment-list-hook").on('click','.add_comment-hook',function (e) {
    // var projectId = getUrlParam('projectId');
    var userId = $.cookie('userid');//获取userid
    var reviewId = getUrlParam('reviewId');
    var shortTxt = $(".textarea-txt-hook").val();
    if(userId == undefined){
        layer.msg('您还没有登录');
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
            ajaxGetLongCommentReview();
        } else {
            layer.msg(res.msg);
        }
    }, "json");

})