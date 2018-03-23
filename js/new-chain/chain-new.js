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
	$(".input_white_paper_file").click()
})
//白皮书文件名预览及校验
$('.input_white_paper_file').on('change', function(e){
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
	var div = '<div class="form-group row"><label class="col-xs-12 col-md-2 col-sm-2 control-label"></label><div class="col-xs-12 col-md-5 col-sm-5"><div class="input-group"><span class="input-group-addon"><img src="img/bitcoin.png"/ style="height: 20px;"></span><input type="text" name="issue_price[]" class="form-control"></div></div></div>'
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
    		'project_logo': 'required;imageTypeAndSize',
    		'project_name': 'required',
    		'project_big_name': 'required',
        'project_type': 'required',
    		'fundraising_time': 'date',
    		'currency_count': 'required;integer',
    		'compay_website': 'required;url',
    		'block_browser': 'url',
    		'project_content': 'required',
        'currency_circulation': 'required;integer',
        'white_paper': 'pdfTypeAndSize',
        'white_paper_file_name': 'pdfName',
    }
});

// 添加团队成员
function add_team_member()
{
  var string = '<div class="col-xs-6 col-md-2 col-sm-3"><div class="team_image_box"><img src="img/no_image.png" class="" /></div><div class="member_mess"><a href="javascript:;" class="file" style="width:110px;text-align:center">选择<input type="file"  name="team_member_pic" class="input_team_member_image t_m"></a><input type="text" class="form-control team_member_attribute t_m" name="team_member_name" value="" placeholder="名称"><input type="text" class="form-control team_member_attribute t_m" name="team_member_position" value="" placeholder="职位" ></div></div>'
  $('.team').append(string);
}

// 团队图片上传及预览
$('.team').on('change', $('.input_team_member_image'), function(e) {
  if(e.target.type != 'file'){
    return false
  }
  team_image_box = e.target.parentNode.parentNode.previousElementSibling // team_image_box
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

// 表单提交
function submit_control() {
  /*
  构建team属性结构
  team:[
        0: {picHref: "", name: "", position: ""},
        1: {picHref: "", name: "", position: ""}
        ]
  */
  var teamArr = []; //最终数据
  var temp = []; //临时存储
  var team_member = {}


  $(".t_m").map(function () {
    temp.push($(this).val()) ;
  });

  for (var i = 0; i < temp.length; i+=3) {
    team_member = {}
    team_member.picHref = temp[i];
    team_member.name = temp[i+1];
    team_member.position = temp[i+2];
    teamArr.push(team_member)
  };

  // 图片、名称、职位都没填的数据删除掉
  for (i = 0; i < teamArr.length; i++) {
    if (teamArr[i].picHref == '' & teamArr[i].name == '' & teamArr[i].position == '') {
      teamArr.splice(i,1)
    }
  }
  // 提交数据
  var form = new FormData();
  form.append("projectLogo", 					$("input[name='mobile']").val() );
  form.append("projectName", 					$(" input[name='project_name']").val()  );
  form.append("projectBigName", 			$(" input[name='project_big_name']").val()  );
  form.append("projectType", 					$(" input[name='project_type']").val()  );
  form.append("currencyCount", 				$(" input[name='currency_count']").val()  );
  form.append("currencyCirculation",	$(" input[name='currency_circulation']").val()  );
  form.append("fundraisingTime", 			$(" input[name='fundraising_time']").val()  );
  form.append("companyWebsite", 			$(" input[name='company_website']").val()  );
  form.append("whitePaper", 					$(" input[name='white_paper']").val()  );
  form.append("projectContent", 			$(" textarea[name='project_content']").val()  );
  form.append("team", 								teamArr);

  $.ajax({
    url:"",
    type:"post",
    data:form,
    processData:false,
    contentType:false,
    success:function(data){
       console.log("data");
    },
  });

}
