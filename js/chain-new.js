var userId = $.cookie('userid');//获取userid

// 判断是否登录
$(function(){
  if(userId == undefined){
    layer.open({
      title: '',
      content: '请先登录您的账号',
      btn: ['登录', '注册'],
      yes: function(){
        window.location.href='login.html'
      },
      btn2: function(){
        window.location.href='register.html'
      },
      cancel: function(){
        return false
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
   var website = new_coin.web_site.value;
   if(website)
  	 window.open(website)
}
//区块链浏览器跳转
function jump_block_browser(){
   var website = new_coin.block_browser.value;
   if(website)
  	 window.open(website)
}

var member_count = 1
// 添加团队成员
function add_team_member()
{
  member_count += 1
  var string = '<div class="col-xs-6 col-md-2 col-sm-3"><div class="team_image_box"><img src="img/no_image.png" class="" /></div><div class="member_mess"><div class=""><a href="javascript:;" class="file">选择<input type="file"  name="file" class="member_pic member_1"></a> <button type="button" class="btn btn-default upload-button upload-member-pic" disabled="disabled"  onclick="doUpload(this.previousElementSibling.childNodes[1])">上传</div><input type="text" class="form-control member_name" name="member_name" value="" placeholder="名称"><input type="text" class="form-control member_position" name="member_position" value="" placeholder="职位" ></div></div>'

  $('.team').append(string);
}

//白皮书上传
$('.click_input_white_paper_file').on('click', function(){
	$(".white_paper").click();
})
//白皮书文件名预览及校验
$('.white_paper').on('change', function(e){
	file = e.currentTarget.files[0];

	if ( !file.type.match(pdfType) || file.size > whitePaperMaxSize) {
    layer.msg('请选择小于20M的PDF文件')
    return false
	}
	var name = file.name;
  $(".white_paper_file_name").val( name );
  $(".upload-white-paper").removeAttr('disabled')
})


var getOnloadFunc = function(aImg) {
	return function(evt) {
		aImg.src = evt.target.result;
	};
}
//币种图片选择及预览
var input_project_logo = document.getElementById("project_logo_input");
input_project_logo.addEventListener("change", function() {
  $(".coin_image_box").html("");
  // 校验图片
  var file = this.files[0];
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
  reader.onload = getOnloadFunc(img);
  reader.readAsDataURL(file);
  // 允许上传
  $('.upload-project-logo').removeAttr('disabled')
}, false);

// 团队图片选择及预览
$('.team').on('change', $('.member_pic'), function(e) {
  if (e.target.type != 'file') {
    return false
  }
  team_image_box = e.target.parentNode.parentNode.parentNode.previousElementSibling // team_image_box
  team_image_box.innerHTML = ""

  var file = e.target.files[0];
  if (!file.type.match(imageType) || file.size > imageMaxSize) {
    layer.msg('请选择小于2M的图片文件',{time:1000})
    e.target.parentElement.nextElementSibling.setAttribute('disabled','disabled')
    return false
  }

  var img = document.createElement("img");

  $(img).css("width","110px")
  $(img).css("height","100px")
  team_image_box.append(img);

  var reader = new FileReader();
  reader.onload = getOnloadFunc(img);
  reader.readAsDataURL(file);
  e.target.parentElement.nextElementSibling.removeAttribute('disabled')
})

// 文件上传
var ui = {
  'submiting': false,
  'fileUpLoading': false
}

var allFile = {
  'projectLogo': '',
  'memberPic': [],
  'whitePaper': ''
}

var t = ''
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
  // var name = e.name;

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
        allFile.projectLogo = (data.datas[0])
        $('.upload-project-logo').attr('disabled','disabled')
      }
      // member_pic
      else if (t.className.split(' ')[0] == 'member_pic') {
        number = t.className.split(' ')[1].split('_')[1]
        allFile.memberPic[number] = data.datas[0]
        t.parentElement.nextElementSibling.setAttribute('disabled','disabled')
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


//表单校验
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
    imageTypeAndSize:function(element, params,field) {
      var filepath = element.files[0];
      if (!filepath.type.match(imageType) || filepath.size > imageMaxSize){
        return "上传有误";
      }else {
        return true;
      }
    },
    pdfTypeAndSize:function(element, params,field) {
      var filepath = element.files[0];
      if (element.files.length == 0) {
        flag = true
      }
      if (!filepath.type.match(pdfType) || filepath.size > imageMaxSize){
        flag = false
        return '!!!!!!!!'
      }else {
        flag = true;
      }
    },
    pdf:function(element, params,field){
      if (flag) {
        return true
      }else{
        return '请上传不大于20M的PDF文件';
      }
    },

    teamNumber:function(element, params, field){
      var numbers = element;
      if (numbers%3 == 0) {
        return true;
      }else {
        return '请完整地填写团队成员的信息'
      }
    }

  },

  fields: {
    'project_logo': 'required;',
		'project_name': 'required',
		'project_big_name': 'required',
    'project_type': 'required',
		'fundraising_time': 'date',
		'currency_count': 'required;integer',
		'compay_website': 'required;url',
		'block_browser': 'url',
		'project_content': 'required',
    'currency_circulation': 'required;integer',
  }
});



// 表单提交

$('.submit_control').on('click', function(){

  if (ui.submiting) {
    return false
  }
  var team = [];
  teamLength = allFile.memberPic.length; // 根据图片数判断team的长度
  memberName = $(" input[name='member_name']");
  memberPosition = $(" input[name='member_position']");

  for (var i = 0; i < teamLength; i++) {
    var temp = {};
    temp.picHref = allFile.memberPic[i];
    temp.name = memberName[i].value;
    temp.position = memberPosition[i].value;
    team.push(temp)
  }

  //判断team的图片、名字、position都必须存在
  temp_length = team.length
  for (var i = 0; i < temp_length; i++) {
    if (!team[i].picHref || !team[i].name || !team[i].position) {
      team.splice(i,1)
    }
  }

  // 发行价格
  var exchangeRate = "";
  $('input[name="exchange_rate"]').each(function(i) {
	exchangeRate += $(this).val();
	if(i!= $('input[name="exchange_rate"]').length-1 )
		exchangeRate += ","
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
    "projectContent":       form1.project_content.value,
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
      },

      success: function (result) {
        if(result.code=="0"){
          ui.submiting = false
          layer.msg('提交成功，请等待审核', {
            time: 2000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
            end:function(){
            window.location.href='chain.html';
            }
          });
        }
        else{
          layer.msg('提交失败，请重试');
          return false
        }
      },
      error: function (err) {
        layer.msg('提交失败，请重试');
      }
  });



})
