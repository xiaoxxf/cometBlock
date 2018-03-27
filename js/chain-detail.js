$("#rating #stars img").on('mouseenter',function (e) {
    var self = $(e.currentTarget);
    if(self.attr('id') == 'star5'){
        self.parent().parent().find('img').attr('src','img/star-full.png')
        $("#rateword").text('力荐')
    }
    if(self.attr('id') == 'star4'){
        self.parent().parent().find('img').attr('src','img/star-full.png')
        $("#rating #stars #star5").attr('src','img/star-empty.png')
        $("#rateword").text('推荐')
    }
    if(self.attr('id') == 'star3'){
        self.parent().parent().find('img').attr('src','img/star-full.png')
        $("#rating #stars #star4").attr('src','img/star-empty.png')
        $("#rating #stars #star5").attr('src','img/star-empty.png')
        $("#rateword").text('还行')
    }
    if(self.attr('id') == 'star2'){
        self.parent().parent().find('img').attr('src','img/star-empty.png')
        $("#rating #stars #star1").attr('src','img/star-full.png')
        $("#rating #stars #star2").attr('src','img/star-full.png')
        $("#rateword").text('较差')
    }
    if(self.attr('id') == 'star1'){
        self.parent().parent().find('img').attr('src','img/star-empty.png')
        $("#rating #stars #star1").attr('src','img/star-full.png')
        $("#rateword").text('很差')
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
    $(".short-comment-load-more .loading-more").hide();
    $(".short-comment-load-more .loader1").css('display','flex');
    setTimeout(function () {
        $(".short-comment-load-more .loading-more").show();
        $(".short-comment-load-more .loader1").css('display','none');
    },2000)
})
//长评加载更多
$(".long-comment-load-more .loading-more").on('click',function () {
    //点击ajax请求数据
    $(".long-comment-load-more .loading-more").hide();
    $(".long-comment-load-more .loader1").css('display','flex');
    setTimeout(function () {
        $(".long-comment-load-more .loading-more").show();
        $(".long-comment-load-more .loader1").css('display','none');
    },2000)
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
window.onload=function(){
    ajaxGetChainDetail();
}
function  ajaxGetChainDetail() {
    // var projectId = getUrlParam('projectId');
    var projectId = '510f0622-22db-4d80-a663-6bc96db8acd3';
    var uri = 'blockchain/detail?projectId='+projectId ;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            console.log(res)
        } else {
            layer.msg(res.msg);
        }
    }, "json");

}