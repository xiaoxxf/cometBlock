// var userinfo = JSON.parse(localStorage.getItem('userinfo'))

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

    var area_width
    var area_height

    if($(window).width() <= 767)
 	  {
	 	  var area_width = '320px'
	    var area_height = '500px'
 	  }else{
 		  var area_width = '520px'
	    var area_height = '600px'
 	  }
    var shortTxt = $(".short-comment").val();
    // 判断是否登录
    if(!wechatBindNotice()){
    	return;
    }
    if(userId == undefined){
        // layer.msg('您还没有登录')
        layer.open({
            type: 1,
            shade:0,
            title: 0,
            skin: 'layui-layer-report', //加上边框
            area: [area_width,area_height ], //宽高
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
            // console.log(res.msg)
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
    // $(".write-long-discuss").attr('href','long-comment.html?projectId='+projectId)
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            var chainInfoData = res.datas;
            $('title').html(res.datas.projectName + '详情')
            $('meta[name=description]').attr('content',res.datas.projectContent)
            $('meta[name=keywords]').attr('content', res.datas.projectName + "," + res.datas.projectBigName + ",区块链,数字货币,项目评测" )

            // console.log(chainInfoData)
            if(chainInfoData != null){
                $(".coin-detail-desc-wrap .coin-big-name").text(chainInfoData.projectBigName);
                $(".coin-detail-desc-wrap .coin-name").text(chainInfoData.projectName);

                $(".coin-detail-desc-wrap .coin-img img").attr('src',chainInfoData.projectLogo)
                chainDetailFormat(chainInfoData);
            }
            // 添加编辑按钮
            if (userinfo && (userinfo.level <= 2 || userinfo.id == chainInfoData.creator) ) {
              var id = chainInfoData.projectId
              var string = '<a href="chain-edit.html?projectId=' + id + '"><button type="button" class=" btn btn-default btn-sm edit">编辑</button></a>'

              $('.project-title').append(string)
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
            var imgW = $(".coin-detail-desc-wrap .coin-img").width();
            $(".coin-detail-desc-wrap .coin-img").css('height',imgW);
            $(".coin-detail-desc-wrap .coin-img").show();
            // 渲染projectContent
            var projectInfoTemp = $("#project-info").html();
            var projectInfo = template(projectInfoTemp, {list: chainInfoData});
            $(".project-intro-hook").append(projectInfo);
            showOrHideContent();
            // 渲染projectTeam
            if(chainInfoData.chainTeamList != null && chainInfoData.chainTeamList.length > 0){
              var teamInfoTemp = $("#team-info").html();
              var teamInfo = template(teamInfoTemp, {list: chainInfoData})
              $(".project-intro-hook").append(teamInfo)
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

                // 限制标题和内容长度
                for (var i = 0; i < res.datas.length; i++) {
                  res.datas[i].textContent = res.datas[i].textContent.replace(/<[^>]+>/g,"")

                  var content_length = null
                  if ($(window).width() < 767) {
                    content_length = 55
                  }else{
                    content_length = 180
                  }

                  if (res.datas[i].textContent.length > content_length) {
                    res.datas[i].textContent = res.datas[i].textContent.substring(0,content_length) + "..."
                  }

                  // if (result.datas[i].textTitle.length > 30) {
                  //   result.datas[i].textTitle = result.datas[i].textTitle.substring(0,30) + "..."
                  // }


                }

                //var formatData = formatStarClass(data);
                var commentTpl = $("#long-comment-temp").html();
                var teamContent = template(commentTpl, {list: res.datas});
                $(".long-comment-wrap-hook").append(teamContent);

                // 限制长度
                long_comment_content = $('.long-comment-content')
                for (var i = 0; i < long_comment_content.length; i++) {
                  if (long_comment_content[i].innerText.length > 225) {
          					long_comment_content[i].innerText = long_comment_content[i].innerText.substring(0,225) + "..."
          				}
                }

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
// 防重点击
var short_comment_ui = {
  'submiting': false
}
//点击提交评论
$(".short-comment-commit").on('click',function (e) {
    if (short_comment_ui.submiting) {
      return
    }
    $(".short-comment-commit").text('提交中...');
    short_comment_ui.submiting = true;
    var projectId = getUrlParam('projectId');
    var userId = $.cookie('userid');//获取userid
    var score = $("#n_rating").val();
    var shortTxt = $(".short-comment").val();
    var area_width
    var area_height
    if($(window).width() <= 767)
 	  {
	 	area_width = '320px'
	    area_height = '500px'
   	}else{
   		 area_width = '520px'
  	     area_height = '600px'
   	}

    // 判断是否登录
    if(!wechatBindNotice()){
      short_comment_ui.submiting = false;
      $(".short-comment-commit").text('评论');
    	return;
    }
    if(userId == undefined){
        // layer.msg('您还没有登录')
        layer.open({
            type: 1,
            shade:0,
            title: 0,
            skin: 'layui-layer-report', //加上边框
            area: [area_width,area_height ], //宽高
            content: $("#short-comment-commit-layer").html()
        });
        short_comment_ui.submiting = false;
        $(".short-comment-commit").text('评论');
        return;
    }
    if(score == ''){
        layer.tips('给这个项目打个分哦', '#rating', {
            tips: [1, '#4fa3ed'],
            time: 2000
        });
        short_comment_ui.submiting = false;
        $(".short-comment-commit").text('评论');
        return;
    }
    if($.trim(shortTxt) == ''){
        layer.tips('评论不能为空', '.short-comment', {
            tips: [1, '#4fa3ed'],
            time: 2000
        });
        short_comment_ui.submiting = false;
        $(".short-comment-commit").text('评论');
        return;
    }
    if(shortTxt.length >= 200){
        layer.tips('文字太多，你可以选择去发表长文', '.short-comment', {
            tips: [1, '#4fa3ed'],
            time: 2000
        });
        short_comment_ui.submiting = false;
        $(".short-comment-commit").text('评论');
        return;
    }
    // 过滤js和style标签
    shortTxt = shortTxt.replace(/<script.*?>.*?<\/script>/g,'').replace(/<style(([\s\S])*?)<\/style>/g, '');
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
            ajaxGetScoreInfo(true);
            $(".short-comment-wrap  #rating").find('img').attr('src','img/star-empty.png');
        } else {
            layer.msg(res.msg);
        }
        short_comment_ui.submiting = false;
        $(".short-comment-commit").text('评论');
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
        // if(comparedData != null && comparedData.code == 0) {
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
            $(".rating_wrap-hook").html('');
            $(".rating_wrap-hook").append(teamContent);
            // console.log(tempObj)
        // } else {
            // layer.msg(comparedData.msg);
        // }
    }, "json");
}
//评分的计算,返回的是对应星星的类名
function formatStarClass(data){
    for(var i = 0;i<data.length;i++){
        data[i].score = data[i].score*10/10*10
    }
    return data;
}

// 删除短评
function delete_short_comment(e){
  var self =$(e),
      passWord = userinfo.userPwd,
      reviewId = self.data('reviewid');
  if(!wechatBindNotice()){
    return;
  }
  if(userId == undefined){
      // layer.msg('您还没有登录');
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
      try
      {
        doJavaGet(uri, function(res) {
            if(res != null && res.code == 0) {
                // console.log(res.msg)
                // ajaxGetComments(true);
                // 去除删除的评论
                $(e.parentNode.parentNode.parentNode).remove();
                ajaxGetScoreInfo(true);
            }else{
              layer.msg('删除失败，请重试')
            }
        }, "json");
        layer.close(index);
      }
      catch(err)
      {
        layer.msg('删除失败，请重试')
      }

  });
}

// 编辑短评
var current_socre = null //存储短评原来的评分，如果不修改评分就用原来的评分
function edit_short_comment(e){
  var self =$(e),
      content = self.data('content'),
      score = self.data('score'),
      passWord = userinfo.userPwd,
      reviewId = self.data('reviewid');
  current_socre = score;
  layer.open({
    title: '编辑短评',
    content: $('#add_score').html(),
    yes: function(index, layero){
      var score = parseInt($(".live-rating")[0].innerHTML) || current_socre;
      if(!score){
          layer.tips('给这个项目打个分哦', '.my-rating', {
              tips: [1, '#4fa3ed'],
              time: 2000
          });
          return;
      }
      // 修改
      var uri = 'blockchain/updataReview'
      var data = {
        textTitle: $('.edit-short-comment').val(),
        reviewId: reviewId , //短评id
        projectId: getUrlParam('projectId'),
        score: parseInt($(".live-rating")[0].innerHTML), //评分
        type: 1, //短评的type为2
        userId: userId,
        password: userinfo.userPwd,
      }
      data = JSON.stringify(data);
      doPostJavaApi(uri,data,function(res){
        if (res.code == 0) {
          layer.msg('修改成功')
          ajaxGetComments(true);
          ajaxGetScoreInfo(true);
          layer.close(index)
        }else if(res.code == -1){
          layer.msg('修改失败，请重试')
        }
      })
      // doUpdateShortComment(reviewId);
    }
  });
  $('.edit-short-comment').val(content);
  createScore(score);
}

function createScore(original_score){
  $(".my-rating").starRating({
    strokeColor:'#ffc900',
    ratedColor:'#ffc900',
    activeColor:'#ffc900',
    hoverColor:'#ffc900',
    strokeWidth: 10,
    useGradient:false,
    starSize: 25,
    initialRating: original_score,
    useFullStars:true,
    disableAfterRate: false,
    onHover: function(currentIndex, currentRating, $el){
      $('.live-rating').text(currentIndex);
    },
    onLeave: function(currentIndex, currentRating, $el){
      $('.live-rating').text(currentRating);
    }
  });
}

function doUpdateShortComment(reviewId){

}

// 展开 & 折叠
var full_content = ''
var short_content = ''

function showOrHideContent(){
  projectContent =  $(".project-desc")
  if (projectContent.html().length > 400) {
    full_content = projectContent.html()
    short_content = projectContent.html().substring(0,400) + "..."
    projectContent.html(short_content)
    var show = '<a onclick="showMore()">展开</a>'
    projectContent.append(show)
  }else{
    return
  }
}

function showMore(){
  projectContent =  $(".project-desc")
  projectContent.html("")
  projectContent.append(full_content)
  var hide = '<a onclick="Hide()">折叠</a>'
  projectContent.append(hide)
}

function Hide(){
  projectContent =  $(".project-desc")
  projectContent.html("")
  projectContent.append(short_content)
  var show = '<a onclick="showMore()">展开</a>'
  projectContent.append(show)
}


var resizeTimer = null;
//团队高度自适应
var teamImgW = $(".img-wrap .team-img").width();
$(".img-wrap .team-img").css('height',teamImgW*120/150);
$(window).on('resize', function () {
	if (resizeTimer) {
			 clearTimeout(resizeTimer)
	 }
	 resizeTimer = setTimeout(function(){
     // 图片白底适应
     var imgW = $(".coin-detail-desc-wrap .coin-img").width();
     $(".coin-detail-desc-wrap .coin-img").css('height',imgW*270/230);
     var teamImgW = $(".img-wrap .team-img").width();
     $(".img-wrap .team-img").css('height',teamImgW*120/150);
	}, 100);

})


$('.write-long-discuss').on('click',function(){

  // 判断是否登录
  if(!wechatBindNotice()){
    return;
  }
  if(userId == undefined){
    var area_width
    var area_height
    if($(window).width() <= 767)
    {
      area_width = '320px'
        area_height = '500px'
    }else{
       area_width = '520px'
         area_height = '600px'
    }
    // layer.msg('您还没有登录')
    layer.open({
        type: 1,
        shade:0,
        title: 0,
        skin: 'layui-layer-report', //加上边框
        area: [area_width,area_height ], //宽高
        content: $("#short-comment-commit-layer").html()
    });
    return;
  }
  window.location.href = 'long-comment.html?projectId=' + getUrlParam('projectId')
})
