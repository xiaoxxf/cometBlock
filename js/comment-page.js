// 分页数据处理
page({
    box:'paginator',//存放分页的容器
    count:50,//总页数
    num:8,//页面展示的页码个数
    step:6,//每次更新页码个数
    callBack:function(i){
        //点击页码的按钮发生回调函数一般都是操作ajax
        console.log('调用'+i)
    }
})
$("#paginator").on('click','.goNext, .goPre',function (e) {
    var pageNum = $("#paginator .active").text();
})