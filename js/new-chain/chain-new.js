//日期选择
$("#date_pick").datetimepicker({
  language : 'zh-CN', // 语言
  autoclose : true, //  true:选择时间后窗口自动关闭
  format : 'yyyy-mm-dd',
  minView : 2,
  todayBtn : true,
})

//白皮书上传
$('.click_input_white_paper_file').on('click', function(){
	$(".white_paper").click()
})
//白皮书文件名预览及校验
$('.white_paper').on('change', function(e){
	file = e.currentTarget.files[0];
	if (file.type.match(imageType)) {

	}

	if (file.size > whitePaperMaxSize) {
        alert('请上传大小小于20M的PDF文件');
        return false;
	}

	var name = file.name;
    $(".white_paper_file_name").val( name );
})

// 增加发行价格
function add_input()
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


//币种图片上传及预览
var imageType = /image.*/;
var getOnloadFunc = function(aImg) {
	return function(evt) {
		aImg.src = evt.target.result;
	};
}

var imageMaxSize = 2*1024*1024;
var whitePaperMaxSize = 2*1024*1024*10;
var imageType = /image.*/;
var input_project_logo = document.getElementById("project_logo_input");

var getOnloadFunc = function(aImg) {
	return function(evt) {
		aImg.src = evt.target.result;
	};
}
input_project_logo.addEventListener("change", function() {
	$(".coin_image_box").html("");
//			    for (var i = 0, numFiles = this.files.length; i < numFiles; i++) {
    var file = this.files[0];

    var img = document.createElement("img");
    $(img).css("width","110px")
    $(img).css("height","100px")
    $(".coin_image_box").append(img);

    var reader = new FileReader();
    reader.onload = getOnloadFunc(img);
    reader.readAsDataURL(file);
//			    }
}, false);


//表单校验
var pdfType = /pdf.*/;
var imageType = /image.*/;
var imageMaxSize = 2*1024*1024;
var pdfMaxSize  = 2*1024*1024*10;
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
           if (!filepath.type.match(pdfType) || filepath.size > imageMaxSize){
           	flag = false
           	return "上传有误";
           }else {
         	flag = true;
            return true;
           }
        },
        pdfName:function(element){
        		return flag || '请上传不大于20M的PDF文件';
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
    		// 'project_logo': 'required;imageTypeAndSize',
    		// 'project_name': 'required',
    		// 'project_big_name': 'required',
        // 'project_type': 'required',
    		// 'fundraising_time': 'date',
    		// 'currency_count': 'required;integer',
    		// 'compay_website': 'required;url',
    		// 'block_browser': 'url',
    		// 'project_content': 'required',
        // 'currency_circulation': 'required;integer',
        // 'white_paper': 'pdfTypeAndSize',
        // 'white_paper_file_name': 'pdfName',
    }
});

// 添加团队成员
function add_team_member()
{
  var string = '<div class="col-xs-6 col-md-2 col-sm-3"><div class="team_image_box"><img src="img/no_image.png" class="" /></div><div class="member_mess"><div class=""><a href="javascript:;" class="file" style="text-align:center;text-decoration:none">选择<input type="file"  name="team_member_pic" class="input_team_member_image"></a><a href="javascript:;" class="file">上传<input type="button" class="change" value="上传" name="file" onclick="doUpload(this.parentElement.previousElementSibling.childNodes[1])" style="cursor:pointer"/></a></div><input type="text" class="form-control" name="team_member_name" value="" placeholder="名称"><input type="text" class="form-control " name="team_member_position" value="" placeholder="职位" ></div></div>'

  $('.team').append(string);
}

// 团队图片上传及预览
$('.team').on('change', $('.input_team_member_image'), function(e) {
  if(e.target.type != 'file'){
    return false
  }
  team_image_box = e.target.parentNode.parentNode.parentNode.previousElementSibling // team_image_box
  team_image_box.innerHTML = ""
  var file = e.target.files[0];

  var img = document.createElement("img");

  $(img).css("width","110px")
  $(img).css("height","100px")
  team_image_box.append(img);

  var reader = new FileReader();
  reader.onload = getOnloadFunc(img);
  reader.readAsDataURL(file);
})



var allFile = {
  'projectLogo': '',
  'memberPic': [],
  'whitePaper': ''
}
var t
// 表单提交
function doUpload(e){
  var formData = new FormData();
  var file = e.files[0];
  var name = e.name;
  formData.append(name, file);
  t = e;
  $.ajax({
        url : 'http://10.0.0.168:8080/common/upload',
        type: "post",
        data: formData,
        datType: "json",
        processData: false,  // 不处理数据
        contentType: false,   // 不设置内容类型
        success:function(data){
            if (t.className == 'project_logo') {
              allFile.projectLogo = (data.datas[0])
            }else if (t.className == 'member_pic') {
              allFile.memberPic.push(data.datas[0])
            }else if (t.className == 'white_paper') {
              allFile.whitePaper = data.datas[0]
            }
            console.log("ok");
        },
        error:function(e){
            alert("错误！！");
        }
  });
}


$('.submit_control').on('click', function(){

  var team = [];
  var temp = {};
  teamLength = allFile.memberPic.length;
  memberName = $(" input[name='member_name']");
  memberPosition = $(" input[name='member_position']");

  for (var i = 0; i < teamLength; i++) {
    temp.picHref = allFile.memberPic[i];
    temp.name = memberName[i].value;
    temp.position = memberPosition[i].value;
    team.push(temp)
  }

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
    "userId":               1,
    "chainTeamList":        team
  };

  //var param
  var uri = 'http://10.0.0.168:8080/blockchain/addLibrary'
  $.ajax({
      type: 'POST',
      url: uri,
      headers: {
          "request-id": guid() + new Date().getTime()
      },
      data: JSON.stringify(data),
      dataType : 'json',
      contentType: 'application/json; charset=UTF-8',
      success: function (result) {
       if(result.code=="0"){
          alert("保存成功");
        }
        else{
          alert("保存失败");
        }
      },
      error: function (err) {
          //$.dialog.tips("Request Error!");
      }
  });



})
