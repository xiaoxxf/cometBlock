$(function () {
    var rankPageIndex = 0;
    var tempRankData = [];
    var monthNum = 3;
    var range = 0;             //距下边界长度/单位px
    var elemt = 500;           //插入元素高度/单位px
    var maxnum = 30;            //设置加载最多次数
    var num = 1;
    var totalheight = 0;
    var isLoaded = true;
    var pageSize = 20;
    window.sessionStorage.removeItem('rankList');
    $(".search-click-hook").on('click',function () {
        console.log('点击搜索');
    })
    $(".title-select-wrap .item").on('click',function () {
        var self = $(this);
        self.parent().parent().find('.item').removeClass('item-active');
        self.addClass('item-active')
        monthNum = self.data('month');
        rankPageIndex = 0;
        window.sessionStorage.removeItem('rankList')
        $(".code-rank-wrap").html('');
        getRankData();
    })
    function getTenRankData(rankData){
        var tempRank = [];
        var len = rankData.length-1;
        if(len<=0){
            return tempRank;
        }
        for(i=0;i<pageSize;i++){
            var rankIndex = rankPageIndex*pageSize+i;
            if(rankIndex>=len){
                $(".no-more-hook").fadeIn();
                $(".load-more-hook").hide();
                return tempRank;
            }
            rankData[rankIndex].sortNum = rankIndex;
            tempRank.push(rankData[rankIndex]);
        }
        return tempRank;
    }
    getRankData();
    function getRankData(){
        $(".no-data-tip").fadeOut();
        $(".waiting-data").fadeIn();
        var rankData;
        var cometSeesionStore = window.sessionStorage.getItem('rankList')
        if(cometSeesionStore == null){
            doRankGet('?month='+monthNum, function(data) {
                rankData = data;
                window.sessionStorage.setItem('rankList',JSON.stringify(data));
               // if(rankData != null) {
                    if(rankData.length == 0){
                        $(".load-more-hook").hide();
                        $(".waiting-data").hide();
                        $(".no-data-tip").fadeIn();
                    }else{
                        tempRankData =  getTenRankData(rankData);
                        var rankTpl = $("#rank-item-temp").html();
                        var content = template(rankTpl, {list: tempRankData});
                        $(".code-rank-wrap").append(content);
                        $(".no-data-tip").fadeOut()
                        $(".waiting-data").hide();
                        //$(".load-more-hook").show();
                    }
             /*   } else{
                    //$(".load-more-hook").hide();
                    $(".waiting-data").hide();
                    $(".no-data-tip").show()
                }*/
            }, "json");
        }else{
            rankData = JSON.parse(window.sessionStorage.getItem('rankList'));
            renderCodeList(rankData)
        }
    }
    //首次切换和第一次页面加载
    function renderCodeList(rankData) {
        if(rankData != null) {
            if(rankData.length == 0){
                $(".load-more-hook").hide();
                $(".waiting-data").hide();
                $(".no-data-tip").fadeIn();
            }else{
                tempRankData =  getTenRankData(rankData);
                var rankTpl = $("#rank-item-temp").html();
                var content = template(rankTpl, {list: tempRankData});
                $(".code-rank-wrap").append(content);
                $(".no-data-tip").fadeOut()
                $(".waiting-data").hide();
                //$(".load-more-hook").show();
            }
        } else{
            //$(".load-more-hook").hide();
            $(".waiting-data").hide();
            $(".no-data-tip").show()
        }
    }
    //滚动加载
    $(window).scroll(function(){
        var srollPos = $(window).scrollTop();    //滚动条距顶部距离(页面超出窗口的高度)
        // console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
        //console.log("页面的文档高度 ："+$(document).height());
        //console.log('浏览器的高度：'+$(window).height());
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if(($(document).height()-range) <= totalheight  && num != maxnum && num > 0 && isLoaded) {
            isLoaded = false
            num = num + 1;
            loadCodeRank();
        }
    });
   /* $(".load-more-hook .loading-more").on('click',function () {

    })*/
   //滚动加载
    function  loadCodeRank() {
        $(".loading-more").hide();
        $(".loader1").css('display','flex');
        var rankData;
        var cometSeesionStore = window.sessionStorage.getItem('rankList')
        if(cometSeesionStore == null){
            //首次进入页面加载
            doRankGet('?month='+monthNum, function(data) {
                rankData = data;
                window.sessionStorage.setItem('rankList',JSON.stringify(data));
                srcollToLoadData(rankData)
            }, "json");
        }else{
            //缓存加载
            rankData = JSON.parse(window.sessionStorage.getItem('rankList'));
            srcollToLoadData(rankData)
        }
        $(".loading-more").show();
        $(".loader1").css('display','none');
        isLoaded = true;
    }
    function  srcollToLoadData(rankData) {
        ++rankPageIndex ;
        console.log(rankPageIndex)
        tempRankData =  getTenRankData(rankData);
        var rankTpl = $("#rank-item-temp").html();
        var content = template(rankTpl, {list: tempRankData});
        $(".code-rank-wrap").append(content)

    }
})



