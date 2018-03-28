
$("#rating #stars img").on('mouseenter',function (e) {
    var self = $(e.currentTarget);
    if(self.attr('id') == 'star5'){
        self.parent().parent().find('img').attr('src','img/star-full.png')
        $("#rateword").text('力荐')
        $("#n_rating").val('5');
    }
    if(self.attr('id') == 'star4'){
        self.parent().parent().find('img').attr('src','img/star-full.png')
        $("#rating #stars #star5").attr('src','img/star-empty.png')
        $("#rateword").text('推荐');
        $("#n_rating").val('4');
    }
    if(self.attr('id') == 'star3'){
        self.parent().parent().find('img').attr('src','img/star-full.png')
        $("#rating #stars #star4").attr('src','img/star-empty.png')
        $("#rating #stars #star5").attr('src','img/star-empty.png')
        $("#rateword").text('还行');
        $("#n_rating").val('3');
    }
    if(self.attr('id') == 'star2'){
        self.parent().parent().find('img').attr('src','img/star-empty.png')
        $("#rating #stars #star1").attr('src','img/star-full.png')
        $("#rating #stars #star2").attr('src','img/star-full.png')
        $("#rateword").text('较差');
        $("#n_rating").val('2');
    }
    if(self.attr('id') == 'star1'){
        self.parent().parent().find('img').attr('src','img/star-empty.png')
        $("#rating #stars #star1").attr('src','img/star-full.png')
        $("#rateword").text('很差');
        $("#n_rating").val('1');
    }
})
$("#rating #stars").on('mouseleave',function (e) {
    var self = $(e.currentTarget);
    $("#rateword").text('')
    //self.parent().parent().find('img').attr('src','img/star-empty.png')
})
//短评加载更多
$(".short-comment-load-more .loading-more").on('click',function () {
    //点击ajax请求数据
    shortCommentCurrentPage++;
    ajaxGetComments();
})
//长评加载更多
$(".long-comment-load-more .loading-more").on('click',function () {
    //点击ajax请求数据
    $(".long-comment-load-more .loading-more").hide();
    $(".long-comment-load-more .loader1").css('display','flex');
    $(".long-comment-load-more .loading-more").show();
    $(".long-comment-load-more .loader1").css('display','none');
})

$(".comment-list-wrap .click-awsome").click(function (e) {
    var self = $(e.currentTarget).toggleClass("on")
});
//点击筛选短评
$(".select-comment-wrap .comment-select").on('click',function (e) {
    var self = $(e.currentTarget)
    self.parent().find(".comment-select").removeClass('current');
    self.addClass('current');
});
window.onload = function(){
    ajaxGetChainDetail();
    ajaxGetComments();
}
var shortCommentCurrentPage = 1 ;
var pageSize = 10;
function  ajaxGetChainDetail() {
    // var projectId = getUrlParam('projectId');
    var projectId = '510f0622-22db-4d80-a663-6bc96db8acd3';
    var uri = 'blockchain/detail?projectId='+projectId ;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            var chainInfoData = res.datas;
            $(".coin-detail-desc-wrap .coin-name").text(chainInfoData.projectBigName);
            $(".coin-detail-desc-wrap .coin-img img").attr('src',chainInfoData.projectLogo)
            var chainTpl = $("#chain-info-temp").html();
            var content = template(chainTpl, {list: chainInfoData});
            $(".chain-info-hook").append(content);
            var teamTpl = $("#team-info-temp").html();
            var teamContent = template(teamTpl, {list: chainInfoData});
            $(".team-intro-hook").append(teamContent);
        } else {
            layer.msg(res.msg);
        }
    }, "json");
}
//加载评论列表
function ajaxGetComments() {
    var projectId = '510f0622-22db-4d80-a663-6bc96db8acd3';
    var uri = 'blockchain/quaryReview?projectId='+projectId+'&currentPage='+shortCommentCurrentPage+'&pageSize='+pageSize+'&type='+1;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            if(res.datas.length >0 ){
                $(".short-comment-load-more .loading-more").hide();
                $(".short-comment-load-more .loader1").css('display','flex');
                var data = res.datas;
                //var formatData = formatStarClass(data);
                var commentTpl = $("#short-comment-temp").html();
                var teamContent = template(commentTpl, {list: res.datas});
                $(".short-comment-wrap-hook").append(teamContent);
                $(".short-comment-load-more .loading-more").show();
                $(".short-comment-load-more .loader1").css('display','none');
            }else{
                $(".short-comment-load-more .loading-more").text('已无更多评论');
            }
        } else {
            layer.msg(res.msg);
        }
    }, "json");
}
//点击提交评论
$(".short-comment-commit").on('click',function (e) {
    // var projectId = getUrlParam('projectId');
    var userId = window.localStorage.getItem('userid');
    var projectId = '510f0622-22db-4d80-a663-6bc96db8acd3';
    var score = $("#n_rating").val();
    var shortTxt = $(".short-comment").val();
    if(userId == null){
        layer.msg('您还没有登录')
    }
    if(score == ''){
        layer.tips('给这个项目打个分哦', '#rating', {
            tips: [1, '#4fa3ed'],
            time: 2000
        });
        return;
    }
    if($.trim(shortTxt) == ''){
        layer.tips('评论不能为空', '.short-comment', {
            tips: [1, '#4fa3ed'],
            time: 2000
        });
        return;
    }
    if(shortTxt.length >= 200){
        layer.tips('文字太多，你可以选择去发表长文', '.short-comment', {
            tips: [1, '#4fa3ed'],
            time: 2000
        });
        return;
    }
    var data = {
        textTitle: shortTxt,
        projectId: projectId, //项目
        score: score, //评分
        type: 1, //长文的type为2
        userId:userId
    }
    var uri = 'blockchain/addReview';
    var jsonData = JSON.stringify(data)
    doPostJavaApi(uri,jsonData, function(res) {
        if(res != null && res.code == 0) {
            layer.msg(res.msg);
        } else {
            layer.msg(res.msg);
        }
    }, "json");
})
//评分的计算,返回的是对应星星的类名
function formatStarClass(data){
    for(var i = 0;i<data.length;i++){
        data[i].score = data[i].score*10/10*10
    }
    return data;
}