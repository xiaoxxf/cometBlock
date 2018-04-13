var userId = $.cookie('userid');//获取userid
var userinfo = JSON.parse(localStorage.getItem('userinfo'))
var creator = null
var ui = {
  'submiting': false
}

// 判断是否登录
$(function(){
  if(userId == undefined){
    layer.open({
      closeBtn:0,
      title: '',
      content: '请先登录您的账号',
      btn: ['登录', '注册'],
      yes: function(){
        window.location.href='login.html'
      },
      btn2: function(){
        window.location.href='register.html'
      }
    });
  }
})


window.onload = function(){
  ajaxGetReviewDetail();
}

function  ajaxGetReviewDetail() {
    var reviewId = getUrlParam('reviewId');
    // var reviewId = '21bcb4f3-1855-4272-9441-f0164bf8ea9a';
    var uri = 'blockchain/reviewDetail?reviewId='+reviewId ;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
          var commentInfoData = res.datas
          // console.log(commentInfoData)
          if (commentInfoData.creator == userId) {
            creator = commentInfoData.creator //保存creator信息
            // 评价的币种的信息
            ajaxGetProjectInfo(commentInfoData.projectId)
            // 评价内容
            createEditor(commentInfoData.textContent);
            // 标题
            $('.input-head').val(commentInfoData.textTitle)
            // 评分
            getStarRating(commentInfoData.score)
          }else {
            layer.msg('你没有修改权限')
            setTimeout(function () {
              window.history.back(-1);
            }, 200)
          }
        } else {
            layer.msg(res.msg);
        }
    }, "json");
}


function ajaxGetProjectInfo(projectId){
  // var projectId = location.search.split('?')[1]
  var uri = 'blockchain/detail?projectId='+ projectId

  doJavaGet(uri,function(data){
    var projectData = data.datas
    // 渲染币种信息
    $('.coin-name').find('p').html(projectData.projectBigName)
    var img = document.createElement("img");
    var src = projectData.projectLogo
    img.src = src
    $(".coin-image").append(img);
  },'json')
}


function getStarRating(score){
  // 星星评分
  $(".my-rating").starRating({
    strokeColor:'#ffc900',
    ratedColor:'#ffc900',
    activeColor:'#ffc900',
    hoverColor:'#ffc900',
    strokeWidth: 10,
    useGradient:false,
    starSize: 25,
    initialRating: score,
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


function createEditor(content){
    // 编辑器
    var E = window.wangEditor
    var editor = new E('#editor')
    editor.customConfig.menus = [
      'bold',
      'italic',
      'head',
      'emoticon',
      'link',  // 插入链接
      'image',  // 插入图片
    ]

    var uploadUri = 'common/upload'

    editor.customConfig.uploadImgServer = WebApiHostJavaApi + uploadUri;
    editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024 //图片大小为5M
    editor.customConfig.uploadFileName = 'file'


    editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {

        },
        success: function (xhr, editor, result) {
          console.log('ok')
        },
        fail: function (xhr, editor, result) {
          alert('插入错误')
        },
        error: function (xhr, editor) {
          alert('上传错误')
        },
        timeout: function (xhr, editor) {

        },

        customInsert: function (insertImg, result, editor) {
          var url = result.datas[0]
          insertImg(url)
        }

    }
    // editor.customConfig.debug = true
    editor.create()
    editor.txt.html(content)

    // 修改菜单栏样式
    $('.w-e-toolbar').css(
      {
       'background-color':'white',
       "border-left":"0px",
       "border-right":"0px",
       "border-bottom":"0px",
      }
    );
    $('.w-e-menu').css('font-size','20px')
    $('.w-e-text-container').css('border','0px')
}





// 提交
$('.submit_comment').on('click',function(){

  if (ui.submiting) {
    return false
  }

  ui.submiting = true
  score = parseInt($(".live-rating")[0].innerHTML)
  var data = {
    textTitle: $('input[name="head"]')[0].value,
    textContent: editor.txt.html(),
    projectId: projectData.projectId, //项目Id
    score: score, //评分
    type: 2, //长文的type为2
    userId: userId, //userId
    password:	123,
    creator: creator,
    UserPwd: userinfo.userPwd
  }

  if (data.textTitle.length == 0 || editor.txt.text().length == 0 || !data.score) {
    $('#identifier').modal()
    ui.submiting = false
    return false
  }


  function callback(result){
    ui.submiting = false
    layer.msg('提交成功', {
      time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
      end:function(){
        window.location.href='chain-detail.html?projectId=' + projectData.projectId;
      }
    });
  }
  // TODO: 改成编辑长文的接口
  // var uri = 'blockchain/addReview'
  doPostJavaApi(uri, JSON.stringify(data), callback, 'json')

})
