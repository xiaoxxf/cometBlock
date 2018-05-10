
window.onload = function(){
  getTopicDetail();
}

function getTopicDetail(){
  topicId = getUrlParam('subjectId')
  var uri = 'topic/seachTopic?currentPage=1&pageSize=12&topicId=' + topicId;

  doJavaGet(uri,function(result){

    var tpl= document.getElementById('topic_detail_tpl').innerHTML;
    var content = template(tpl, {list: result.datas});
    $('.topic_detail').append(content)

    // 渲染左侧专题信息
    $('.topic_title .topic_name').html(result.datas[0].topic);
    $('.topic_info_left .topic_icon')[0].src = result.datas[0].topicPic;
  })
}


// 删除专题
function deleteTopic(e){
  debugger
  var subject_id = $(e).data('subjectid');

  layer.confirm('确定删除你的专题么?',
      {
      icon: 3,
      title:0,
      shade:0,
      title: 0,
      skin: 'layui-layer-report', //加上边框
      },
      function(index){
        var uri = 'topic/deleteTopic?topicId=' + subject_id + '&creator=' + userinfo.id + '&password=' + userinfo.userPwd;
        doJavaGet(uri, function(res){
          if (res.code == 0) {
            layer.msg(res.msg);
            window.location.href= localStorage.currentHref ? localStorage.currentHref : 'personal-homepage.html'
          }else if(res.code == -1){
            layer.msg(res.msg)
          }
        })
      layer.close(index);
  });

}
