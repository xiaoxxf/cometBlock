
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
    longCommentCurrentPage++;
    ajaxGetLongComments();
})
//点赞
$(".comment-list-wrap ").on('click','.click-awsome',function (e) {
    var self = $(e.currentTarget);
    var reviewid = self.data('reviewid');
    var userId = $.cookie('userid');//获取userid
    var likes = 0;
    var score = $("#n_rating").val();
    var shortTxt = $(".short-comment").val();
    if(userId == undefined){
        layer.msg('您还没有登录')
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
    if(self.hasClass('on')){
        likes = 0;
    }else{
        likes = 1;
    }
    var uri = "blockchain/addLike?reviewId="+reviewid+"&userId="+userId+"&likes="+likes;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            console.log(res.msg)
            self.toggleClass("on");
            var num  = parseInt(self.parent().find(".num").text());
            if(self.hasClass('on')){
                self.parent().find(".num").text(num+1)
            }else{
                self.parent().find(".num").text(num-1);
            }
        } else {
            layer.msg(res.msg);
        }
    }, "json");
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
    ajaxGetLongComments();
    ajaxGetScoreInfo();
}
var shortCommentCurrentPage = 1 ;
var longCommentCurrentPage = 1 ;
var pageSize = 10;
function  ajaxGetChainDetail() {
    var projectId = getUrlParam('projectId');
    var uri = 'blockchain/detail?projectId='+projectId ;
    $(".write-long-discuss").attr('href','long-comment.html?projectId='+projectId)
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            var chainInfoData = res.datas;
            if(chainInfoData != null){
                $(".coin-detail-desc-wrap .coin-name").text(chainInfoData.projectBigName);
                $(".coin-detail-desc-wrap .coin-img img").attr('src',chainInfoData.projectLogo)
                chainDetailFormat(chainInfoData);
            }
        } else {
            layer.msg(res.msg);
        }
    }, "json");
}

// 获取类型对应项
function chainDetailFormat(chainInfoData) {
    if(chainInfoData.projectType != null ){
        var uri = 'blockchain/quary?parentId=1'
        doJavaGet(uri,function(res){
            var dataArr = res.datas;
            if(res.datas.length > 0){
                dataArr.forEach(function(value,index,array){
                    if(value.dicType == chainInfoData.projectType){
                        chainInfoData.projectType = value.dicValue
                    }
                })
            }
            if(chainInfoData.fundraisingTime == null){
                chainInfoData.fundraisingTime = '';
            }
            var chainTpl = $("#chain-info-temp").html();
            var content = template(chainTpl, {list: chainInfoData});
            $(".chain-info-hook").append(content)
            if(chainInfoData.chainTeamList != null && chainInfoData.chainTeamList.length > 0){
                var teamTpl = $("#team-info-temp").html();
                var teamContent = template(teamTpl, {list: chainInfoData});
                $(".team-intro-hook").append(teamContent);
            }else{
                $(".team-intro-hook").hide();
            }
        },"json")
    }
}
//加载短评列表
function ajaxGetComments(insert) {
    if(insert == true){
        currentPage = 1;
    }
    var projectId = getUrlParam('projectId');
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
                if(insert == true){
                    $(".short-comment-wrap-hook").html('');
                }
                $(".short-comment-wrap-hook").append(teamContent);
                $(".short-comment-load-more .loading-more").show();
                $(".short-comment-load-more .loader1").css('display','none');
                if(res.datas.length < 10){
                    $(".short-comment-load-more .loading-more").text('已无更多评论');
                }
            }else{
                $(".short-comment-load-more .loading-more").text('已无更多评论');
            }
        } else {
            layer.msg(res.msg);
        }
    }, "json");
}
//加载长评列表
function ajaxGetLongComments() {
    var projectId = getUrlParam('projectId');
    var uri = 'blockchain/quaryReview?projectId='+projectId+'&currentPage='+longCommentCurrentPage+'&pageSize='+pageSize+'&type='+2;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            if(res.datas.length >0 ){
                $(".long-comment-load-more .loading-more").hide();
                $(".long-comment-load-more .loader1").css('display','flex');
                var data = res.datas;
                //var formatData = formatStarClass(data);
                var commentTpl = $("#long-comment-temp").html();
                var teamContent = template(commentTpl, {list: res.datas});
                $(".long-comment-wrap-hook").append(teamContent);
                $(".long-comment-load-more .loading-more").show();
                $(".long-comment-load-more .loader1").css('display','none');
                if(res.datas.length < 10){
                    $(".long-comment-load-more .loading-more").text('已无更多评论');
                }
            }else{
                $(".long-comment-load-more .loading-more").text('已无更多评论');
            }
        } else {
            layer.msg(res.msg);
        }
    }, "json");

}
//点击提交评论
$(".short-comment-commit").on('click',function (e) {
    var projectId = getUrlParam('projectId');
    var userId = $.cookie('userid');//获取userid
    var score = $("#n_rating").val();
    var shortTxt = $(".short-comment").val();
    if(userId == undefined){
        layer.msg('您还没有登录')
        layer.open({
            type: 1,
            shade:0,
            title: 0,
            skin: 'layui-layer-report', //加上边框
            area: ['520px', '600px'], //宽高
            content: $("#short-comment-commit-layer").html()
        });
        return;
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
            $(".short-comment").val('');
            ajaxGetComments(true);
        } else {
            layer.msg(res.msg);
        }
    }, "json");
})
function ajaxGetScoreInfo() {
    var projectId = getUrlParam('projectId');
    var uri = 'blockchain/quaryScore?projectId='+projectId ;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            scoreDataFormat(res);
        } else {
            layer.msg(res.msg);
        }
    }, "json");
}
function scoreDataFormat(res) {
    var projectId = getUrlParam('projectId');
    var uri = '/blockchain/compared?projectId='+projectId;
    doJavaGet(uri, function(comparedData) {
        if(comparedData != null && comparedData.code == 0) {
            res.datas.compared = comparedData.datas;
            var tempObj = {};
            var tempArr = [];
            var widthArr = [];
            var tempScore = 0;
            var avaScore = 0;
            var count = res.count;
            for(var i = res.datas.length;i > 0;i--){
                var curScore = res.datas[i-1].scores
                if(curScore== 0){
                    tempArr.push("0%");
                    widthArr.push("1px")
                }else{
                    tempArr.push(Math.floor(curScore/count* 1000)/10+"%");
                    widthArr.push(Math.floor(curScore/count* 100)/100*150+"px");
                }
                tempScore += i*curScore*2
            }
            if(count != 0){
                avaScore = Math.floor(tempScore/count* 10)/10;
            }
            tempObj.avaScore = avaScore;
            tempObj.scores = tempArr;
            tempObj.count =  count;
            tempObj.widthArr =  widthArr;
            tempObj.stars  = Math.round(avaScore)*5;
            tempObj.compared = Math.floor(comparedData.datas* 1000)/10+"%"+$(".project-type-cn").text();
            var commentTpl = $("#chain-score-temp").html();
            var teamContent = template(commentTpl, {list: tempObj});
            $(".rating_wrap-hook").append(teamContent);
            //console.log()
            console.log(tempObj)
        } else {
            layer.msg(res.msg);
        }
    }, "json");
}
//评分的计算,返回的是对应星星的类名
function formatStarClass(data){
    for(var i = 0;i<data.length;i++){
        data[i].score = data[i].score*10/10*10
    }
    return data;
}

