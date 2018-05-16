var userId = $.cookie('userid');//获取userid
var ui = {
  'submiting': false
}

// 判断是否登录
$(function(){
	if(!wechatBindNotice()){
    return;
  }
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
  'head',  // 标题
  'bold',  // 粗体
  'fontSize',  // 字号
  'fontName',  // 字体
  'italic',  // 斜体
  'underline',  // 下划线
  'strikeThrough',  // 删除线
  'foreColor',  // 文字颜色
  'backColor',  // 背景颜色
  'link',  // 插入链接
  'list',  // 列表
  'justify',  // 对齐方式
  'quote',  // 引用
  'image',  // 插入图片
  'table',  // 表格
  'code',  // 插入代码
  'undo',  // 撤销
  'redo'  // 重复

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
$('.w-e-text-container').attr('style','width:auto;');

// 修改菜单栏样式

$('.w-e-menu').css('font-size','20px')
$('.w-e-text-container').css('border','0px')
$('.w-e-text').css('font-size','18px')


// 提交
$('.submit_comment').on('click',function(){

  if (ui.submiting) {
    return false
  }

  ui.submiting = true
  // var text_content = encodeURI(editor.txt.html())
  // 过滤js标签
  var text_content = editor.txt.html().replace(/<script.*?>.*?<\/script>/g,'')

  var data = {
    textTitle: $('input[name="head"]')[0].value,
    textContent: text_content,
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
    layer.msg('提交成功', {
      time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
      end:function(){
        window.location.href='article-finsh.html'
      }
    });
    ui.submiting = false
  }
  var uri = 'blockchain/addReview';
  doPostJavaApi(uri, JSON.stringify(data), callback, 'json')
})


var preivew_flag = false
function preview(){
	preivew_flag = true
	$('.preview-article').html('退出预览')
	$('.preview-container').css('display','')
	$('.write-container').css('display', 'none')
	var textContent = editor.txt.html();
	$('.review-content').html(textContent);
	var textTitle = $('.input-head').val()
	$('.comment-detail-title').html(textTitle);
	$('.realName').html(userinfo.realName);
	if (userinfo.userPic) {
		$('.avatar img')[0].src = userinfo.userPic
	}
}

function quitPreview(){
	preivew_flag = false
	$('.preview-article').html('预览')
	$('.preview-container').css('display','none')
	$('.write-container').css('display', '')
}

$('.preview-article').on('click',function(){
	if (!preivew_flag) {
		preview()
	}else{
		quitPreview()
	}
})
