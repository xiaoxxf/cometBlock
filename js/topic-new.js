//专题图片选择及预览
var imageType = /image.*/;
var imageMaxSize = 2*1024*1024;
var ui = {
  'submiting': false
};
document.getElementById("topic_logo_input").addEventListener("change", function() {
  $(".topic_image_box").html("");

  var file = this.files[0];
  if(!file){
    return;
  }

  // 校验图片
  if (!file.type.match(imageType) || file.size > imageMaxSize) {
    layer.msg('请选择小于2M的图片文件',{time:1000});
    return;
  }

  // 预览图片
  var img = document.createElement("img");
  $(img).css("width","110px");
  $(img).css("height","100px");
  $(".topic_image_box").append(img);
  var reader = new FileReader();
  reader.onload = function(){
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}, false);


function uploadFile(){
  let file = $('#topic_logo_input')[0].files[0];

  // debugger
  if (file == undefined || !file.type.match(imageType) || file.size > imageMaxSize) {
    $('.topic_logo_file_name').val('');
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

    success:function(data){
      // ui.fileUpLoading = false
      // project_logo
      if (data.code == 0) {
        $('.topic_logo_file_name').val(data.datas[0])
        // layer.msg('上传成功')
      }else if(data.code == -1){
        lay.msg(data.msg)
      }
    },

  });
}


function createTopic(){
  // 先传图片
  uploadFile();

  // 判断是否有图片
  if ($('.topic_logo_file_name').val() == '') {
    layer.msg('必须上传专题图片')
    return
  }

  // 判断投稿是否审核
  var topicType = undefined;
  // 需要审核
  if (  $(newTopicForm.apply).is(':checked') )
  {
    topicType = 0;
  }
  // 不需要审核
  else if( $(newTopicForm.apply_not).is(':checked') )
  {
    topicType = 1;
  }
  else if(topicType == undefined){
    layer.tips('请选择投稿是否需要审核', '.allow_submit', {
        tips: [1, '#4fa3ed'],
        time: 2000
    });
    return;
  }

  // 过滤js和style标签
  var topic_des = newTopicForm.topic_description.value.replace(/<script.*?>.*?<\/script>/g,'').replace(/<style(([\s\S])*?)<\/style>/g, '')
  var data = {
    'topicPic':  newTopicForm.topic_logo_file_name.value,
    'topic':    newTopicForm.topic_name.value, //专题名称
    'description': topic_des,
    'topicType': topicType, //0->投稿的文章需要审核， 1->不需要审核
    'creator': userId,
    'password': userinfo.userPwd,
  }

  ui.submiting = true;
  // data = JSON.stringify(data);

  var uri = 'topic/addtopic?topicPic=' + data.topicPic + '&topic=' + data.topic + '&description=' + data.description
            + '&topicType=' + data.topicType + '&creator=' + data.creator + '&password=' + data.password;

  doJavaGet(uri, function(result){
    if (result.code == 0) {
      layer.msg('提交成功', {
        time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
        end:function(){
          // layer.msg(result.msg);
          setTimeout(function(){
            window.location.href='personal-homepage.html';
          },200)
        }
      });
    }else if(result.code == -1){
      layer.msg(result.msg)
    }
    ui.submiting = false
  })
}


$('#newTopicForm').validator({
	theme:'bootstrap',
  validClass: "has-succes",
  invalidClass: "has-error",
  bindClassTo: ".form-group",

  rules: {
    topicNameLength: function(element, params) {
      if (element.value.length > 50) {
        return '请填写小于50个字的名称'
      }
    },
    topicDesLength: function(element, params) {
      if (element.value.length > 500) {
        return '请填写小于500个字的描述'
      }
    }
  },

  fields: {
    // 'project_logo_file': 'required;',
		'topic_name': 'required;topicNameLength',
    'topic_description': 'required;topicDesLength'
  },

  valid: function(form) {
    createTopic()
  }

});



// 只能选中一个CheckBox
$('.allow_submit').find('input[type=checkbox]').bind('click', function(){
  $('.allow_submit').find('input[type=checkbox]').not(this).attr("checked", false);
  console.log($(newTopicForm.apply).is(':checked'));
  console.log($(newTopicForm.apply_not).is(':checked'));
});
