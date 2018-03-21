$(function () {
    var rankPageIndex = 0;
    var tempRankData = [];
    var monthNum = 3;
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
    getRankData();
    function getRankData(){
        $(".no-data-tip").fadeOut();
        $(".waiting-data").fadeIn();
        doRankGet('?month='+monthNum, function(data) {
            if(data != null) {
                var rankData;
                var cometSeesionStore = window.sessionStorage.getItem('rankList')
                if(cometSeesionStore == null){
                    window.sessionStorage.setItem('rankList',JSON.stringify(data));
                    rankData = data;
                }else{
                    rankData = JSON.parse(window.sessionStorage.getItem('rankList'));
                }
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
                    $(".load-more-hook").show();
                }
            } else{
                $(".load-more-hook").hide();
                $(".waiting-data").hide();
                $(".no-data-tip").show()
            }
        }, "json");
    }

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



