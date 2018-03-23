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

// 团队图片上传及预览

$('.input_team_member_image').on('change',function(){
  team_image_box = this.parentNode.parentNode.previousElementSibling // team_image_box
  team_image_box.innerHTML = ""
  var file = this.files[0];

  var img = document.createElement("img");

  $(img).css("width","110px")
  $(img).css("height","100px")
  team_image_box.append(img);

  var reader = new FileReader();
  reader.onload = getOnloadFunc(img);
  reader.readAsDataURL(file);
})

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
