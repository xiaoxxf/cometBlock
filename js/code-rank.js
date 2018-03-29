$(function () {
    var rankPageIndex = 1;
    var tempRankData = [];
    var monthNum = 3;
    var range = 0;             //距下边界长度/单位px
    var elemt = 500;           //插入元素高度/单位px
    var maxnum = 30;            //设置加载最多次数
    var num = 1;
    var totalheight = 0;
    var isLoaded = true;
    var pageSize = 20;
    var sortByOrder = 1;//分类排序刷选
    $(".search-click-hook").on('click',function () {
        console.log('点击搜索');
    })
    $(".title-select-wrap .item").on('click',function () {
        var self = $(this);
        self.parent().find('.item').removeClass('item-active');
        self.addClass('item-active')
        if(self.hasClass('time-item')){
            monthNum = self.data('month');
        }
        if(self.hasClass('order-item')){
            sortByOrder = self.data('order');
        }
        rankPageIndex = 1;
        $(".no-more-hook").hide();
        $(".code-rank-wrap").html('');
        getRankData();
    })
    function formatRankData(rankData){
        var tempRank = [];
        for(var i=0;i<pageSize;i++){
            var rankIndex = (rankPageIndex-1)*pageSize+i;
            if(rankData[i] == undefined){
                rankPageIndex++;
                return tempRank;
            }else{
                rankData[i].sortNum = rankIndex;
                tempRank.push(rankData[i]);
            }
        }
        rankPageIndex++;
        return tempRank;
    }
    getRankData();
    function getRankData(){
        $(".no-data-tip").fadeOut();
        $(".waiting-data").fadeIn();
        var rankData;
            doRankGet('?month='+monthNum+'&pageNumber='+rankPageIndex+'&pageSize='+pageSize+'&order='+sortByOrder, function(data) {
                rankData = data;
                    if(rankData.length == 0){
                        $(".load-more-hook").hide();
                        $(".waiting-data").hide();
                        $(".no-data-tip").fadeIn();
                    }else{
                        tempRankData =  formatRankData(rankData);
                        console.log('tempRankData',tempRankData)
                        var rankTpl = $("#rank-item-temp").html();
                        var content = template(rankTpl, {list: tempRankData});
                        $(".code-rank-wrap").append(content);
                        $(".no-data-tip").fadeOut()
                        $(".waiting-data").hide();
                    }
            }, "json");
    }
    //滚动加载  
    $(window).scroll(function(){
        var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
        // console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
        //console.log("页面的文档高度 ："+$(document).height());
        //console.log('浏览器的高度：'+$(window).height());
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if(($(document).height()-range) <= totalheight  && num != maxnum && rankPageIndex > 1 && isLoaded) {
            isLoaded = false
            num = num + 1;
            loadCodeRank();
        }
    });
   //滚动加载
    function  loadCodeRank() {
        $(".loading-more").hide();
        $(".loader1").css('display','flex');
            //首次进入页面加载
            doRankGet('?month='+monthNum+'&pageNumber='+rankPageIndex+'&pageSize='+pageSize+'&order='+sortByOrder, function(data) {
                if(data.length != 0){
                    tempRankData =  formatRankData(data);
                    var rankTpl = $("#rank-item-temp").html();
                    var content = template(rankTpl, {list: tempRankData});
                    $(".code-rank-wrap").append(content)
                }else{
                    $(".no-more-hook").fadeIn();
                }
            }, "json");
        $(".loading-more").show();
        $(".loader1").css('display','none');
        isLoaded = true;
    }
})
