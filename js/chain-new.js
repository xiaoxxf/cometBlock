var userId = $.cookie('userid');//获取userid

var ui = {
  'submiting': false,
  'fileUpLoading': false
}

var allFile = {
  'projectLogo': '',
  'whitePaper': ''
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

//日期选择
$("#date_pick").datetimepicker({
  language : 'zh-CN', // 语言
  autoclose : true, //  true:选择时间后窗口自动关闭
  format : 'yyyy-mm-dd',
  minView : 2,
  todayBtn : true,
})

// 增加发行价格
function add_issue_price()
{
	var div = '<div class="form-group row"><label class="col-xs-12 col-md-2 col-sm-2 control-label"></label><div class="col-xs-12 col-md-5 col-sm-5"><div class="input-group"><span class="input-group-addon"><img src="img/bitcoin.png"/ style="height: 20px;"></span><input type="text" name="issue_price" class="form-control"></div></div></div>'
	$('#add_issue_price').append(div);
}

//网站跳转
function jump_website(){
   var website = $('.website').val()
   if(website)
  	 window.open(website)
}
//区块链浏览器跳转
function jump_block_browser(){
   var website = new_coin.block_browser.value;
   if(website)
  	 window.open(website)
}


// 添加团队成员
function add_team_member()
{
  var string = '<div class="col-xs-6 col-md-2 col-sm-3"><div class="team_image_box"><img src="" class="" /><span class="glyphicon glyphicon-remove remove" style="display:none" ></span></div><div><a href="javascript:;" class="file">选择<input type="file"  name="file" class="member_pic" ></a> <button type="button" class="btn btn-default upload-button" disabled="disabled" onclick="doUpload(this.previousElementSibling.childNodes[1])">上传</div><div class="member_msg"><input type="hidden" class = "member_pic_name" name="member_pic_name" value=""><input type="text" class="form-control member_name" name="member_name" value="" placeholder="名称"><input type="text" class="form-control member_position" name="member_position" value="" placeholder="职位" ></div></div>'

  $('.team').append(string);
}


// 显示减少团队成员的图标
$('.team').on("mouseenter mouseleave",".team_image_box",function(e){
  if(e.type == "mouseenter"){
    $(e.currentTarget.children[1]).css('display','')
  }else if(e.type == "mouseleave"){
    $(e.currentTarget.children[1]).css('display','none')
  };

});

// 减少团队成员
$('.team').on("click",".remove",function(e){
  $(e.currentTarget.parentElement.parentElement).remove();
})

//白皮书上传
$('.click_input_white_paper_file').on('click', function(){
	$(".white_paper").click();
})
//白皮书文件名预览及校验
$('.white_paper').on('change', function(e){
	file = e.currentTarget.files[0];

  if(!file){
    allFile.whitePaper = ''
    $(".white_paper_file_name").val('');
    $(".upload-white-paper").attr('disabled')
    return false
  }

	if ( !file.type.match(pdfType) || file.size > whitePaperMaxSize) {
    layer.msg('请选择小于20M的PDF文件')
    return false
	}

  $(".white_paper_file_name").val( file.name );
  $(".upload-white-paper").removeAttr('disabled')
})



//币种图片选择及预览
document.getElementById("project_logo_input").addEventListener("change", function() {
  $(".coin_image_box").html("");

  var file = this.files[0]
  if(!file){
    $('.upload-project-logo').attr('disabled','disabled')
    allFile.projectLogo = ''
    return false;
  }

  // 校验图片
  if (!file.type.match(imageType) || file.size > imageMaxSize) {
    layer.msg('请选择小于2M的图片文件',{time:1000})
    $('.upload-project-logo').attr('disabled','disabled')
    return false
  }

  // 预览图片
  var img = document.createElement("img");
  $(img).css("width","110px")
  $(img).css("height","100px")
  $(".coin_image_box").append(img);
  var reader = new FileReader();
  reader.onload = function(){
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
  // 允许上传
  $('.upload-project-logo').removeAttr('disabled')
}, false);

// 团队图片选择及预览
$('.team').on('change', $('.member_pic'), function(e) {
  if (e.target.type != 'file') {
    return false
  }

  team_image_box = e.target.parentNode.parentNode.previousElementSibling// team_image_box
  $(team_image_box).children('img').remove()

  var file = e.target.files[0];
  uploadButton = e.target.parentElement.nextElementSibling;

  // 没选图片
  if (!file) {
    uploadButton.setAttribute('disabled','disabled')
    member_pic_name = e.target.parentElement.parentElement.nextElementSibling.firstElementChild;
    member_pic_name.value = '';
    return false
  }
  // 校验图片
  if (!file.type.match(imageType) || file.size > imageMaxSize) {
    layer.msg('请选择小于2M的图片文件',{time:1000})
    uploadButton.setAttribute('disabled','disabled')
    return false
  }

  // 图片预览
  var img = document.createElement("img");
  $(img).css("width","110px")
  $(img).css("height","100px")
  team_image_box.prepend(img);
  var reader = new FileReader();
  reader.onload = function(){
    img.src = reader.result;
  }
  reader.readAsDataURL(file);
  // 允许上传
  uploadButton.removeAttribute('disabled')
})


var t = null
function doUpload(e){
  var file = e.files[0];
  if (ui.fileUpLoading || e.files.length == 0) {
    return false
  }

  var class_name = e.className;

  //根据className判断应该是什么类型的文件，不一致的返回false
  switch (class_name) {
    case "white_paper":
      if (!file.type.match(pdfType) || file.size > whitePaperMaxSize) {
        return false
      }
      break;
    default:
      if (!file.type.match(imageType) || file.size > imageMaxSize) {
        return false
      }
      break;
  }

  var formData = new FormData();

  t = e;
  formData.append('file', file);
  formData.append(userId, userId);

  $.ajax({
    url : WebApiHostJavaApi + 'common/upload',
    type: "post",
    data: formData,
    datType: "json",
    processData: false,  // 不处理数据
    contentType: false,   // 不设置内容类型

    beforeSend: function(){
      ui.fileUpLoading = true
    },

    success:function(data){
      // project_logo
      if (t.className == 'project_logo') {
        allFile.projectLogo = data.datas[0]
        $('.upload-project-logo').attr('disabled','disabled')
      }
      else if (t.className == 'member_pic') {
        // 把照片的值存在对应的input
        member_pic_name = t.parentElement.parentElement.nextElementSibling.firstElementChild
        member_pic_name.value =  data.datas[0]
        // 上传成功后，上传按钮不可选
        $(t.parentElement.nextElementSibling).attr('disabled','disabled')
      }
      // white_paper
      else if (t.className == 'white_paper') {
        allFile.whitePaper = data.datas[0]
        $(".upload-white-paper").attr('disabled','disabled')
      }
      ui.fileUpLoading = false
      layer.msg('上传成功')
    },
    error:function(e){
      ui.fileUpLoading = false
      alert("上传错误，请重试！");
    }
  });

}

//表单校验与提交
var pdfType = /pdf.*/;
var imageType = /image.*/;
var imageMaxSize = 2*1024*1024;
var whitePaperMaxSize = 2*1024*1024*10;
var flag = true;

$('#form1').validator({
	theme:'bootstrap',
  validClass: "has-succes",
  invalidClass: "has-error",
  bindClassTo: ".form-group",

  rules: {

  },

  fields: {
    'project_logo_file': 'required;',
		'project_name': 'required',
		'project_big_name': 'required',
    'project_type': 'required',
		'fundraising_time': 'date',
		'currency_count': 'integer',
		'compay_website': 'required;url',
		'block_browser': 'url',
		'project_content': 'required',
    'currency_circulation': 'integer',
  },

  valid: function(form) {
      if (ui.submiting) {
        return false
      }

      // 检查团队数据是否完整
      memberName = $(".member_name");
      memberPicName = $(".member_pic_name");

      for (var i = 0; i < memberPicName.length; i++) {
        if ( memberName[i].value == '' || memberPicName[i].value == '' ) {
          layer.msg('团队成员图片必须上传，名称不能为空')
        }
        return
      }

      // 构建team
      var team = buildTeam()

      // 发行价格
      var exchangeRate = "";
      $('input[name="exchange_rate"]').each(function(i) {
    	   exchangeRate += $(this).val();
      });

      // 提交数据
      var data = {
        "projectLogo":          allFile.projectLogo,
        "projectName":          form1.project_name.value,
        "projectBigName":       form1.project_big_name.value ,
        "projectType":          form1.project_type.value,
        "currencyCount":        form1.currency_count.value,
        "currencyCirculation":  form1.currency_circulation.value,
        "fundraisingTime":      form1.fundraising_time.value,
        "companyWebsite":       form1.compay_website.value,
        "projectContent":       editor.txt.html(),
        "whitePaper":           allFile.whitePaper,
        "exchangeRate":			    exchangeRate,
        "userId":               userId,
        "chainTeamList":        team
      };

      $.ajax({
          type: 'POST',
          url : WebApiHostJavaApi + 'blockchain/addLibrary',
          data: JSON.stringify(data),
          dataType : 'json',
          contentType: 'application/json; charset=UTF-8',

          beforeSend: function(){
            ui.submiting = true
            $('.submit_control').css('disabled','disabled')
          },
          success: function (result) {
            ui.submiting = false
            layer.msg('提交成功，请等待审核', {
              time: 2000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
              end:function(){
              window.location.href='chain.html';
              }
            });
          },
          error: function (err) {
            layer.msg('提交失败，请重试');
            $('.submit_control').css('disabled','')
          }
      });

  }

});


function buildTeam(){
  var team = [];

  memberName = $(".member_name");
  memberPosition = $(".member_position");
  memberPicName = $(".member_pic_name");

  teamLength = memberPicName.length; // 根据图片数判断team的长度
  for (var i = 0; i < teamLength; i++) {
    var temp = {};
    temp.picHref = memberPicName[i].value;
    temp.name = memberName[i].value;
    temp.position = memberPosition[i].value;
    temp.projectId = projectId
    team.push(temp)
  }
  //判断team的图片、名字都必须存在
  temp_team = []
  temp_length = team.length

  for (var i = 0; i < temp_length; i++) {
    if (team[i].picHref != "" || team[i].name != "") {
      temp_team.push(team[i])
    }
  }
  return temp_team
}

// 渲染币种类型
$(function(){
	var uri = 'blockchain/quary?parentId=1'
	doJavaGet(uri,function(data){
		var coinType = document.getElementById('project-type').innerHTML;
		var content = template(coinType, {list: data.datas});
		$('.project_type').append(content)
	},"json")
})


// 编辑器

var E = window.wangEditor
var editor = new E('#editor')
editor.customConfig.menus = [
  'bold',
  'italic',
  'head',
  'emoticon',
]

editor.create()

$('.w-e-toolbar').css('display','none');
$('.w-e-text-container').css({
  "border": "1px solid #ccc",
  "height": "300px",
  "z-index": 10000,
  "border-radius": "10px"
});
