//举报弹出框
$('#comments .report_comment').on('click',function (e) {
    console.log($(e.currentTarget))
    layer.open({
        type: 1,
        shade:0,
        title: '选择举报原因',
        skin: 'layui-layer-report', //加上边框
        area: ['442px', '200px'], //宽高
        content: $("#template-report-popup").html()
    });
});
//点击引用
$('#comments .reply_comment').on('click',function (e) {
    var self =$(e.currentTarget);
        self.addClass('reply-comment-click');
    $(".reply-comment").fadeIn()
    layer.open({
        type: 1,
        shade:0,
        title: '引用',
        skin: 'layui-layer-report', //加上边框
        area: ['550px', '680px'], //宽高
        content: $("#template-reply").html()
    });
});
//点击关闭
$(".review-comment-form .lnk-close").on('click',function (e) {
    $(".reply-comment").fadeOut();
    $('#comments .reply_comment').removeClass('reply-comment-click')
    console.log($(e.currentTarget))
});
//useful点击
$(".main-panel-useful button").on('click',function (e) {
    var self = $(e.currentTarget)
    console.log(self.data('useful'))
})
