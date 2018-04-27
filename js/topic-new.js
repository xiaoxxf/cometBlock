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
