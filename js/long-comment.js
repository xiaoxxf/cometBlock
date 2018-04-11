var userId = $.cookie('userid');//获取userid

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


var getOnloadFunc = function(aImg) {
	return function(evt) {
		aImg.src = evt.target.result;
	};
}



var projectData = {}

$(function(){

  var projectId = location.search.split('?')[1]
  var uri = 'blockchain/detail?'+ projectId

  doJavaGet(uri,function(data){
    projectData = data.datas
    $('.coin-name').find('p').html(projectData.projectBigName)
    var img = document.createElement("img");
    var src = projectData.projectLogo

    img.src = src
    $(".coin-image").append(img);



  },'json')

})


var ui = {
  'submiting': false
}
$(function(){
  // 星星评分
  $(".my-rating").starRating({
    strokeColor:'#ffc900',
    ratedColor:'#ffc900',
    activeColor:'#ffc900',
    hoverColor:'#ffc900',
    strokeWidth: 10,
    useGradient:false,
    starSize: 25,
    initialRating: 0,
    useFullStars:true,
    disableAfterRate: false,
    onHover: function(currentIndex, currentRating, $el){
      $('.live-rating').text(currentIndex);
    },
    onLeave: function(currentIndex, currentRating, $el){
      $('.live-rating').text(currentRating);
    }
  });

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
  		password:	123
  	}

    if (data.textTitle.length == 0 || editor.txt.text().length == 0 || !data.score) {
      $('#identifier').modal()
      ui.submiting = false
      return false
    }

    // var uri = 'http://10.0.0.169:8080/blockchain/addReview'

    function callback(result){
      ui.submiting = false
      layer.msg('提交成功', {
        time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
        end:function(){
          window.location.href='chain-detail.html?projectId=' + projectData.projectId;
        }
      });
    }
    var uri = 'blockchain/addReview'
    doPostJavaApi(uri, JSON.stringify(data), callback, 'json')



  })

})
