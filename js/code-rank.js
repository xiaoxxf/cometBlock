$(function () {
    $(".search-click-hook").on('click',function () {
        console.log('点击搜索');
    })
    var rankPageIndex = 0;
    var tempRankData = [];
    function getTenRankData(rankData){
        var tempRank = [];
        var len = rankData.length-1;
        for(i=1;i<=10;i++){
            var rankIndex = rankPageIndex*10+i;
            rankData[rankIndex].sortNum = rankIndex;
            tempRank.push(rankData[rankIndex]);
            if(rankIndex>=len){
                $(".no-more-hook").fadeIn();
                $(".load-more-hook").hide();
                return tempRank;
            }
        }
        return tempRank;
    }
    doRankGet('', function(data) {
        if(data != null) {
            var rankData;
            var cometSeesionStore = window.sessionStorage.getItem('rankList')
            if(cometSeesionStore == null){
                window.sessionStorage.setItem('rankList',JSON.stringify(data));
                rankData = data;
            }else{
                rankData = JSON.parse(window.sessionStorage.getItem('rankList'));
            }
            tempRankData =  getTenRankData(rankData);
            var rankTpl = $("#rank-item-temp").html();
            var content = template(rankTpl, {list: tempRankData});
            $(".code-rank-wrap").append(content);
            $(".load-more-hook").show();
        } else{
            alert('请求数据出错');
        }
    }, "json");
    $(".load-more-hook .loading-more").on('click',function () {
        $(".loading-more").hide();
        $(".loader1").css('display','flex');
        rankPageIndex++;
        var rankData;
        var cometSeesionStore = window.sessionStorage.getItem('rankList')
        if(cometSeesionStore == null){
            window.sessionStorage.setItem('rankList',JSON.stringify(data))
        }else{
            rankData = JSON.parse(window.sessionStorage.getItem('rankList'));
        }
        tempRankData =  getTenRankData(rankData);
        var rankTpl = $("#rank-item-temp").html();
        var content = template(rankTpl, {list: tempRankData});
        $(".code-rank-wrap").append(content)
        $(".loading-more").show();
        $(".loader1").css('display','none');

    })
})