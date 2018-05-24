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
// $('.w-e-text-container').attr('style','height:100%;');
// $('.w-e-text-container').attr('style','width:auto;');
// $('#div1').attr('style','height:auto;');
// 读取草稿
// var draft = $.cookie('draft') ? JSON.parse($.cookie('draft')) : ''
var draft = localStorage.getItem('draft') ? JSON.parse(localStorage.getItem('draft')) : ''

if (draft && draft.userId == userId) {
  $('input[name="head"]').val(draft.textTitle);
  editor.txt.html(draft.textContent);
}


// 修改菜单栏样式
$('.w-e-menu').css('font-size','20px');
$('.w-e-text-container').css('border','0px');
var _height=$("body").height()
$('.w-e-text-container').css('height',_height * 0.8);

// $('.w-e-text').css('font-size','18px');
// $('.w-e-text').css('height','150%');

// 提交
$('.submit_comment').on('click',function(){
  if (ui.submiting) {
    return false
  }

  ui.submiting = true;
  $('.submit_comment').text('发布中...')

  var text_content = editor.txt.html().replace(/<script.*?>.*?<\/script>/g,'').replace(/<style(([\s\S])*?)<\/style>/g, '');
  var text_title = $('input[name="head"]')[0].value;
  if (!text_title || !text_content) {
    // $('#identifier').modal()
    layer.msg('请保证标题、内容均填写完整');
    $('.submit_comment').text('发布');
    ui.submiting = false;
    return
  }

  var data = {
    textTitle: $('input[name="head"]')[0].value,
    textContent: text_content,
    type: 4,
    userId: userId, //userId
  }
  var uri = 'blockchain/addReview';
  doPostJavaApi(uri, JSON.stringify(data), function(res){
    if (res.code == 0) {
      // 清除草稿
      save_draft_flag = false; //发表文章后跳转不保存草稿
      localStorage.removeItem('draft');
      layer.msg('提交成功', {
        time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
        end:function(){
          window.location.href='article-finish.html'
        }
      });
    }else{
      $('.submit_comment').text('发布');
      layer.msg('提交失败，请重试')
    }
    ui.submiting = false
  }, 'json')
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

//编辑器强制修改
// var containerW = $(".write-container").width() * 0.9;
// var marL = $(".write-container").width() * 0.05 + 15;
// var marL2 = $(".write-container").width() * 0.05;
// $(".edit-comment").css({ 'width': containerW,'margin-left':marL});
// $(".w-e-toolbar").css({ 'width': containerW});
// $(".input-head").css({ 'width': containerW,'margin-left':marL2 });
// window.onresize = function () {
//   var containerW = $(".write-container").width() * 0.9;
//   var marL = $(".write-container").width() * 0.05 + 15;
//   $(".edit-comment").css({ 'width': containerW,'margin-left':marL});
//   $(".w-e-toolbar").css({ 'width': containerW});
//   $(".input-head").css({ 'width': containerW,'margin-left':marL2 });
// }

$(".edit-comment").on('click', function () {
  if ($(".fake-placeholder").size() > 0) {
    $(".fake-placeholder").remove();
  }
})

$(".w-e-text").focus(function(){
  $(".fake-placeholder").remove();
})

var save_draft_flag = true;//判断是否保存草稿，提交文章后不保存
// 保存草稿
window.setInterval(saveDraft, 30000);
function saveDraft()
{
  var temp_content = {
    'userId': userId,
    'textTitle': $('input[name="head"]')[0].value,
    'textContent': editor.txt.html()
  }
  localStorage.setItem('draft', JSON.stringify(temp_content)); //存储
  // var expireDate= new Date();
  // expireDate.setTime(expireDate.getTime() + (60*60* 1000 * 24 * 30));
  // $.cookie('draft', JSON.stringify(temp_content),{ expires: expireDate });
  // layer.tips('自动保存成功', '.w-e-toolbar', {
  //     tips: [2, '.w-e-text'],
  //     time: 1000
  // });
}


window.onbeforeunload=function(e){
  if (save_draft_flag) {
    var temp_content = {
      'userId': userId,
      'textTitle': $('input[name="head"]')[0].value,
      'textContent': editor.txt.html()
    }

    localStorage.setItem('draft', JSON.stringify(temp_content)); //存储
    // var expireDate= new Date();
    // expireDate.setTime(expireDate.getTime() + (60*60* 1000 * 24 * 30));
    // $.cookie('draft', JSON.stringify(temp_content),{ expires: expireDate });
  }
}
