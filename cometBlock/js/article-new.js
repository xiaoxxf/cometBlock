window.wangEditor.fullscreen = {
	// editor create之后调用
	init: function(editorSelector){
		$(editorSelector + " .w-e-toolbar").append('<div class="w-e-menu"><a class="_wangEditor_btn_fullscreen" href="###" onclick="window.wangEditor.fullscreen.toggleFullscreen(\'' + editorSelector + '\')">全屏</a></div>');
	},
	toggleFullscreen: function(editorSelector){
		$(editorSelector).toggleClass('fullscreen-editor');
		if($(editorSelector + ' ._wangEditor_btn_fullscreen').text() == '全屏'){
			$(editorSelector + ' ._wangEditor_btn_fullscreen').text('退出全屏');
		}else{
			$(editorSelector + ' ._wangEditor_btn_fullscreen').text('全屏');
		}
	}
};

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

var E = window.wangEditor
var editor = new E('#editor')
// 编辑器

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
editor.create();
$('.w-e-text-container').attr('style','height:auto;');
E.fullscreen.init('#editor');

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
$('.w-e-text').css('font-size','18px')


// 提交
$('.submit_comment').on('click',function(){

  if (ui.submiting) {
    return false
  }

  ui.submiting = true
  var data = {
    textTitle: $('input[name="head"]')[0].value,
    textContent: editor.txt.html(),
    type: 4,
    userId: userId, //userId
  }

  if (data.textTitle.length == 0 || editor.txt.text().length == 0) {
    // $('#identifier').modal()
    layer.msg('请保证标题、内容均填写完整')
    ui.submiting = false
    return false
  }

  function callback(result){
    ui.submiting = false
    layer.msg('提交成功', {
      time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
      end:function(){
        window.location.href='personal-homepage.html'
      }
    });
  }
  var uri = 'blockchain/addReview'
  doPostJavaApi(uri, JSON.stringify(data), callback, 'json')


})
