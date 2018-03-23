function $(id)
{
  return document.getElementById(id);
}
//验证姓名
//function checkname(){
//var phone=$("session_email_or_mobile_number").value;
//var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
//var reg1 =/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
//if(phone=='')
//{
// $('check_email_phone').innerHTML='电话不能为空';
// $('check_email_phone').style.color='red';
// return false;
//}
//	else if(phone ==reg ||phone==reg1){
//	 $('check_email_phone').innerHTML='ok';
//	 $('check_email_phone').style.color='green';
//	 return true;
//}
//else
//{
//  $('check_email_phone').innerText='输入格式有误';
//  $('check_email_phone').style.color='red';
//  return false;
//}
//}

 //验证邮件格式
 		var obj=$("session_email_or_mobile_number").value;
    function checkname(obj){
      var reg=/[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}\.[a-zA-Z0-9]{1,5}/;
      if(){
      	
      }
      else if(!reg.test(obj)){
        alert("请正确填写邮箱！");
        obj="";
      }
    }
    
//验证密码
function checkpwd(){
  var password=$("session_password").value;
  if(password=='')
  {
   $('check_password').innerHTML='密码不能为空';
   $('check_password').style.color='red';
   return false;
  }
  else
  {
    $('check_password').innerHTML='ok';
    $('check_password').style.color='green';
    return true;
  }
}
//验证所有表单提交
function checkall()
{
  if(checkname()&&checkpwd())
  {
    return true;
  }
  else
  {
    return false;
  }
}