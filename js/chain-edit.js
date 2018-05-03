// var userId = $.cookie('userid');//获取userid
// var userinfo = JSON.parse(localStorage.getItem('userinfo'))
var creator = null;
var projectId = null;
window.onload = function(){
    ajaxGetChainDetail();
}

// var chainInfoData = null
function  ajaxGetChainDetail() {
    projectId = getUrlParam('projectId');
    // projectId = 'hx001';
    var uri = 'blockchain/detail?projectId='+projectId;
    doJavaGet(uri, function(res) {
        if(res != null && res.code == 0) {
            var chainInfoData = res.datas;
            console.log(chainInfoData)
            // if (chainInfoData.creator == userId) {
            if (userinfo && (userinfo.level <= 2 || userinfo.id == chainInfoData.creator)) {
              creator = chainInfoData.creator // 保存creator，用于提交
              verbForm(chainInfoData)
              chainDetailJs(chainInfoData)
            }else {
              layer.msg('你没有修改权限')
              setTimeout(function () {
                window.history.back(-1);
              }, 200)
            }
        } else {
            layer.msg(res.msg);
        }
    }, "json");
}


// 渲染form
function verbForm(chainInfoData){
  var form1 = document.getElementById('projectInfo').innerHTML;
  var formContent = template(form1, {list: chainInfoData});
  $('#form1').append(formContent);
  if (chainInfoData.chainTeamList != null) {
    // 渲染团队数据
    verbTeam(chainInfoData.chainTeamList);
  }
  // 渲染发行价格
  if (chainInfoData.exchangeRate.length != 0) {
    verbExchangeRate(chainInfoData.exchangeRate);
  }

  // 渲染币种类型

  var uri = 'blockchain/quary?parentId=1'
  doJavaGet(uri,function(data){
    var coinType = document.getElementById('project-type').innerHTML;
    var content = template(coinType, {list: data.datas});
    $('.project_type').append(content)
    var type = chainInfoData.projectType
    var option = $('.project_type').find('option')[type-1]
    $(option).attr('selected','selected')
  },"json")

}

function verbTeam(chainTeamList){
  var string = '<div class="col-xs-6 col-md-2 col-sm-3">\
  									<div class="team_image_box">\
  										<img src="" class="" />\
  										<span class="glyphicon glyphicon-remove remove" style="display:none" ></span>\
  									</div>\
  									<div>\
  										<input type="file"  name="file" class="member_pic" style="display:none">\
  										<button type="button" name="member_pic_choose_button" class="btn btn-default upload-button member_pic_choose_button">选择</button>\
  									</div>\
  									<div class="member_msg">\
  										<input type="hidden" class="member_pic_name" name="member_pic_name" value="">\
  										<input type="text" class="form-control member_name" name="member_name" value="" placeholder="名称">\
  										<input type="text" class="form-control member_position" name="member_position" value="" placeholder="职位" >\
  									</div>\
  								</div>'

  for (var i = 0; i < chainTeamList.length; i++) {
    $('.team').append(string);
  }
  var img = $('.team_image_box').find('img')
  var member_pic_name = $('.member_pic_name')
  var name = $('.member_name')
  var position = $('.member_position')
  // 预览图片样式
  for (var i = 0; i < img.length; i++) {
    $(img[i]).css("width","110px")
    $(img[i]).css("height","100px")
  }
  // 渲染数据
  for (var i = 0; i < chainTeamList.length; i++) {
    img[i].src = chainTeamList[i].picHref
    $(member_pic_name[i]).val(chainTeamList[i].picHref)
    $(name[i]).val(chainTeamList[i].name)
    $(position[i]).val(chainTeamList[i].position)
  }
}

function verbExchangeRate(exchangeRate){
  var div = '<div class="form-group row"><label class="col-xs-12 col-md-2 col-sm-2 control-label"></label><div class="col-xs-12 col-md-5 col-sm-5"><div class="input-group"><span class="input-group-addon"><img src="img/bitcoin.png"/ style="height: 20px;"></span><input type="text" name="issue_price" class="form-control"></div></div></div>'
  exchangeRate = exchangeRate.split(',')
  for (var i = 0; i < exchangeRate.length; i++) {
    $('#add_issue_price').append(div);
  }
  var exchangeRateValue = $('input[name=issue_price]')
  for (var i = 0; i < exchangeRate.length; i++) {
    $(exchangeRateValue[i]).val(exchangeRate[i])
  }
}


// chainDetail页用到的js操作
function chainDetailJs(chainInfoData){


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
  editor.txt.html(chainInfoData.projectContent)
  $('.w-e-toolbar').css('display','none');
  $('.w-e-text-container').css({
    "border": "1px solid #ccc",
    "height": "300px",
    "z-index": 10000,
    "border-radius": "10px"
  });

  $('.chooseLogo').on('click',function(){
    $('#project_logo_input').click()
  })

  $('.team').on("click",".member_pic_choose_button",function(e){
    $(e.target.previousElementSibling).click()
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
  $('.add_team_member_button').on('click',function(){
    var string = '<div class="col-xs-6 col-md-2 col-sm-3">\
    									<div class="team_image_box">\
    										<img src="" class="" />\
    										<span class="glyphicon glyphicon-remove remove" style="display:none" ></span>\
    									</div>\
    									<div>\
    										<input type="file"  name="file" class="member_pic" style="display:none">\
    										<button type="button" name="member_pic_choose_button" class="btn btn-default upload-button member_pic_choose_button">选择</button>\
    									</div>\
    									<div class="member_msg">\
    										<input type="hidden" class = "member_pic_name" name="member_pic_name" value="">\
    										<input type="text" class="form-control member_name" name="member_name" value="" placeholder="名称">\
    										<input type="text" class="form-control member_position" name="member_position" value="" placeholder="职位" >\
    									</div>\
    								</div>'
    $('.team').append(string);
  })

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
      $(".white_paper_file_name").val('');
      return
    }

  	if ( !file.type.match(pdfType) || file.size > whitePaperMaxSize) {
      layer.msg('请选择小于20M的PDF文件')
      $(".white_paper_file_name").val('');
      return false
  	}

    $(".white_paper_file_name").val( file.name );
  })



  //币种图片选择及预览
  document.getElementById("project_logo_input").addEventListener("change", function() {
    $(".coin_image_box").html("");

    var file = this.files[0]
    if(!file){
      return false;
    }

    // 校验图片
    if (!file.type.match(imageType) || file.size > imageMaxSize) {
      layer.msg('请选择小于2M的图片文件',{time:1000})
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
  }, false);

  // 团队图片选择及预览
  $('.team').on('change', $('.member_pic'), function(e) {
    if (e.target.type != 'file') {
      return false
    }

    team_image_box = e.target.parentNode.previousElementSibling// team_image_box
    $(team_image_box).children('img').remove()

    var file = e.target.files[0];

    // 没选图片
    if (!file) {
      member_pic_name = e.target.parentElement.nextElementSibling.firstElementChild;
      member_pic_name.value = '';
      return false
    }
    // 校验图片
    if (!file.type.match(imageType) || file.size > imageMaxSize) {
      layer.msg('请选择小于2M的图片文件',{time:1000})
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

  })


  var t = null

  // 上传币种图片
  function upLoadPorjectLogo(){
    var file = $('#project_logo_input')[0].files[0]
    if (ui.fileUpLoading || file == undefined) {
      return
    }
    if (!file.type.match(imageType) || file.size > imageMaxSize) {
      return
    }

    var formData = new FormData();

    formData.append('file', file);
    formData.append(userId, userId);

    $.ajax({
      url : WebApiHostJavaApi + 'common/upload',
      type: "post",
      data: formData,
      datType: "json",
      async: false,//使用同步的方式,true为异步方式
      processData: false,  // 不处理数据
      contentType: false,   // 不设置内容类型

      beforeSend: function(){
        ui.fileUpLoading = true
      },

      success:function(data){
        ui.fileUpLoading = false
        // project_logo
        if (data.code == 0) {
          $('#project_logo_file').val(data.datas[0])
          // layer.msg('上传成功')
        }else if(data.code == -1){
          lay.msg(data.msg)
        }
      },

    });
  }

  // 删除白皮书
  $('.remove-white-paper').on('click',function(){
    $('.white_paper').val('')
    $('.white_paper_file_name').val('')
    $('#white_paper_file').val('')
  })

  // 上传白皮书
  function upLoadWhitePaper(){
    var file = $('.white_paper')[0].files[0]
    if (ui.fileUpLoading || file == undefined) {
      return
    }
    if (!file.type.match(pdfType) || file.size > whitePaperMaxSize) {
      return
    }

    var formData = new FormData();

    formData.append('file', file);
    formData.append(userId, userId);

    $.ajax({
      url : WebApiHostJavaApi + 'common/upload',
      type: "post",
      data: formData,
      datType: "json",
      async: false,//使用同步的方式,true为异步方式
      processData: false,  // 不处理数据
      contentType: false,   // 不设置内容类型

      beforeSend: function(){
        ui.fileUpLoading = true
      },

      success:function(data){
        // project_logo
        ui.fileUpLoading = false
        if (data.code == 0) {
          $('#white_paper_file').val(data.datas[0])
          // layer.msg('上传成功')
        }else if(data.code == -1){
          lay.msg(data.msg)
        }
      },
    });

  }

  // 上传团队图片
  function uploadMemberPic(e){
    var file = e.files[0];
    if (ui.fileUpLoading || e.files.length == 0) {
      return
    }

    if (!file.type.match(imageType) || file.size > imageMaxSize) {
      return
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
      async: false,//使用同步的方式,true为异步方式
      processData: false,  // 不处理数据
      contentType: false,   // 不设置内容类型

      beforeSend: function(){
        ui.fileUpLoading = true
      },

      success:function(data){
        ui.fileUpLoading = false
        if (data.code == 0) {
          // 把照片的值存在对应的input
          member_pic_name = t.parentElement.nextElementSibling.firstElementChild
          member_pic_name.value =  data.datas[0]
          // layer.msg('上传成功')
        }else if(data.code == -1){
          layer.msg(data.msg)
        }
      },
      error:function(e){
        ui.fileUpLoading = false
        layer.msg("上传错误，请重试！");
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
      // 'project_logo_file': 'required;',
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

        // 上传图片
        upLoadPorjectLogo();
        upLoadWhitePaper();
        memberpic = $('.member_pic')
        for (var i = 0; i < memberpic.length; i++) {
          uploadMemberPic(memberpic[i])
        }


        // 检查币种图片是否上传
        if ($('#project_logo_file').val() == '') {
          layer.msg('必须上传币种图片')
          return
        }

        // 检查团队数据是否完整
        memberName = $(".member_name");
        memberPicName = $(".member_pic_name");

        for (var i = 0; i < memberPicName.length; i++) {
          if ( memberName[i].value == '' || memberPicName[i].value == '' ) {
            layer.msg('团队成员图片必须上传，名称不能为空')
            return
          }
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
          "projectLogo":          form1.projectLogoFile.value,
          "projectName":          form1.project_name.value,
          "projectBigName":       form1.project_big_name.value ,
          "projectType":          form1.project_type.value,
          "currencyCount":        form1.currency_count.value,
          "currencyCirculation":  form1.currency_circulation.value,
          "fundraisingTime":      form1.fundraising_time.value,
          "companyWebsite":       form1.compay_website.value,
          "projectContent":       editor.txt.html(),
          "whitePaper":           form1.whitePaperFile.value,
          "exchangeRate":			    exchangeRate,
          "userId":               userId,
          "chainTeamList":        team,
          "creator":              creator,
          "UserPwd":              userinfo.userPwd,
          "projectId":            projectId
        };

        $.ajax({
            type: 'POST',
            url : WebApiHostJavaApi + 'blockchain/updateLibrary',
            data: JSON.stringify(data),
            dataType : 'json',
            contentType: 'application/json; charset=UTF-8',

            beforeSend: function(){
              $(".ouro").attr({
                style: "display:inline-block"
              });
              ui.submiting = true
              $('.submit_control').html('上传中')
              $('.submit_control').attr('disabled','disabled')
            },
            success: function (result) {
              if (result.code == 0) {
                layer.msg('编辑成功', {
                  time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
                  end:function(){
                  window.location.href='chain-detail.html?projectId=' + projectId;
                  }
                });
              }else if(result.code == -1){
                layer.msg(result.msg)
                $(".ouro").attr({
                  style: "display:none"
                });
                $('.submit_control').html('提交')
                $('.submit_control').removeAttr('disabled')
              }
              ui.submiting = false
            },
            error: function (err) {
              layer.msg('提交失败，请重试');
              $('.submit_control').css('disabled','')
            }
        });

    }

  });

}




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


var pdfType = /pdf.*/;
var imageType = /image.*/;
var imageMaxSize = 2*1024*1024;
var whitePaperMaxSize = 2*1024*1024*10;
var flag = true;

var ui = {
  'submiting': false,
  'fileUpLoading': false
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
