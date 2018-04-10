//更改图片
function previewFile() {
  var preview = document.querySelector('img');
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    preview.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

//消息栏点击隐藏显示
function baseSettingClick(){
	$(".show_table").css("display","block");
	$(".show_table_msg").css("display","none");
	

}
function informationClick(){
	
	$(".show_table_msg").css("display","block");
	$(".show_table").css("display","none");
}
//修改密码显示隐藏
function changePwdClick(){
	$(".put-newpwd").css("display","block");
	
}


$(function(){  
    $('#lol').click(function(){//点击a标签  
        if($('#timo').is(':hidden')){//如果当前隐藏  
        $('#timo').show();//那么就显示div  
        }else{//否则  
        $('#timo').hide();//就隐藏div  
        }  
    })  
})  