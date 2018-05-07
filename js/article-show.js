//举报弹出框
// var userId = $.cookie('userid');//获取userid
// var userinfo = JSON.parse(localStorage.getItem('userinfo'));
// var wechatInfo = $.cookie('wechatInfo');
// wechatInfo == null ? wechatInfo : JSON.parse(wechatInfo);
var quotedReviewId = null

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
        number = self.data('number')+1,
        id = self.data('reviewid'),
        parentTxt = self.data('parenttxt');
        $(".comment-list-hook").find('.reply-comment-click').removeClass('reply-comment-click')
        self.addClass('reply-comment-click');
    if(!wechatBindNotice()){
    	return;
    }
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
    $("#add_comment .number").text(number);
    $("#add_comment .parent-txt .short").text(parentTxt);
    quotedReviewId = id
    $(".reply-comment").fadeIn()
});
//点击删除
$('.comment-list-hook').on('click','.comment-item .reply_delete',function (e) {
    var self =$(e.currentTarget),
        author = self.data('user_name'),
        passWord = userinfo.userPwd,
        reviewId = self.data('reviewid');
    if(!wechatBindNotice()){
    	return;
    }
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
        var uri = "blockchain/delReview?reviewId="+reviewId+"&userId="+userId+"&passWord="+passWord
        doJavaGet(uri, function(res) {
            if(res != null && res.code == 0) {
                // console.log(res.msg)
                ajaxGetLongCommentReview()
            }
        }, "json");
        layer.close(index);
    });
});






// 点击编辑短文
$('.comment-list-hook').on('click','.comment-item .reply_edit',function (e) {
  var self = $(e.currentTarget)

  var reviewId = self.data('reviewid');
  if(!wechatBindNotice()){
    	return;
    }
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

  layer.confirm('修改评论',
      {
        // icon: 3,
        title:0,
        shade:0,
        title: 0,
        skin: 'layui-layer-report', //加上边框
        content:
            "<div style='width:350px;'>\
              <div style='width:320px;' class='form-group has-feedback'>\
                <p style='margin:10px'>评论内容</p>\
                <textarea id='edit-short-content' class='form-control' type='text' name='awardName' value='' />\
              </div>\
              <br>\
            </div>\
            "
      },
      function(index){
        var uri = 'blockchain/updataReview'

        var data = {
          textTitle: $('#edit-short-content').val(),
          reviewId: reviewId , //项目
          type: 3, //长文的type为2
          userId: userId,
          password: userinfo.userPwd,
        }


        function callback(result){
          if (result.code == -1) {
            layer.msg('修改失败', {
              time: 1000,
            });
          }else{
            layer.msg('修改成功', {
              time: 1000,
              end:function(){
                ajaxGetLongCommentReview()
              }
            });
          }

        }

        doPostJavaApi(uri, JSON.stringify(data), callback, 'json')


        layer.close(index);
      }
  );


})

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
    if(!wechatBindNotice()){
    	return;
    }
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
    var likes = 0;
    var score = $("#n_rating").val();
    var shortTxt = $(".short-comment").val();
    if(!wechatBindNotice()){
    	return;
    }
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
    if(self.hasClass('clicked-like')){
        likes = 1;
    }else{
        likes = 0;
    }
    var uri = "blockchain/addLike?reviewId="+reviewid+"&userId="+userId+"&likes="+likes;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            // console.log(res.msg)
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
}

var longCommentCurrentPage = 1 ;
var pageSize = 5;
function  ajaxGetReviewDetail() {
    var reviewId = getUrlParam('reviewId');
    var uri = 'blockchain/reviewDetail?reviewId='+reviewId ;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            var commentInfoData = res.datas;

            $('title').html(commentInfoData.textTitle)
            console.log(commentInfoData)
            $(".comet-navbar .long-comment-title").text(commentInfoData.textTitle);
            $(".comment-container-wrap .comment-detail-title").text(commentInfoData.textTitle);
            var commentTpl = $("#template-mian-detail").html();
            var content = template(commentTpl, {list: commentInfoData});
            $(".comment-detail-mian-hook").append(content);
            // 从消息中心页进来，url不带projectId，需要给projectId赋值后再用projectId去请求项目信息
        } else {
            layer.msg(res.msg);
        }
        ajaxGetLongCommentReview()
    }, "json");
}
//点击提交评论
$(".comment-list-hook").on('click','.add_comment-hook',function (e) {
    var reviewId = getUrlParam('reviewId');
    var shortTxt = $(".textarea-txt-hook").val();
    var quote = '';
    if($(".reply-comment").is(':visible')){
        quote = $(".reply-comment-wrap .quote-comment-txt").html();
    }
    if(!wechatBindNotice()){
    	return;
    }
    /*if( wechatInfo != null && userId == undefined){
        layer.open({
            closeBtn:1,
            title: '',
            content: '您暂未进行账号绑定，请前去进行绑定',
            btn: ['绑定'],
            yes: function(){
                window.location.href='bindUser.html'
            }
        });
        return;
    }*/
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
        parentId: reviewId, 
        type: 3, //长文的type为2
        userId:userId,
        quote:quote,
        quotedReviewId: quotedReviewId,
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
// 点击删除长文
$('.comment-detail-mian-hook').on('click', '.long_comment_delete',function (e) {
    var self =$(e.currentTarget),
        author = self.data('user_name'),
        passWord = userinfo.userPwd,
        reviewId = self.data('reviewid');
        parentTxt = self.data('parenttxt');

    if(!wechatBindNotice()){
    	return;
    }
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
    layer.confirm('确定删除您的评测么?',
    {
      icon: 3,
      title:0,
      shade:0,
      title: 0,
      skin: 'layui-layer-report', //加上边框
    },
    function(){
      var uri = "blockchain/delReview?reviewId="+reviewId+"&userId="+userId+"&passWord="+passWord
      doJavaGet(uri, function(res) {
          if(res != null && res.code == 0) {
              // window.location.href= localStorage.currentHref ? localStorage.currentHref : 'index.html'
              window.location.href = 'personal-homepage.html'
          }
      }, "json");
    }
    );
});
