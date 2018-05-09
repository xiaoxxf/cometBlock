//专题图片选择及预览
var imageType = /image.*/;
var imageMaxSize = 2*1024*1024;
document.getElementById("topic_logo_input").addEventListener("change", function() {
  $(".topic_image_box").html("");

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
  $(".topic_image_box").append(img);
  var reader = new FileReader();
  reader.onload = function(){
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}, false);


function uploadFile(){
  let file = $('#topic_logo_input')[0].files[0]

  // debugger
  if (file == undefined) {
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

    success:function(data){
      // ui.fileUpLoading = false
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


function createTopic(){
  
}
