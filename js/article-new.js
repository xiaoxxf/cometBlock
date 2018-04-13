var userId = $.cookie('userid');//获取userid
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


$(function(){
  createEditor()
})


function createEditor(){
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
  editor.customConfig.debug = true
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

}

$('.submit_comment').on('click',function(){
  // TODO: 提交文章
})
