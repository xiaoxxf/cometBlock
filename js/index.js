$(document).ready(function () {
    var range = 50; //距下边界长度/单位px
    var elemt = 500; //插入元素高度/单位px
    var maxnum = 3; //设置加载最多次数
    var num = 1;
    var pageNum = 1;
    //var rankPageIndex = 1;
    var totalheight = 0;
    var isLoaded = true
    //新消息通知
    var count = 0
    //默认不显示通知消息
    $('#div1').css("display", "none")
    function notice() { //请求后台查询最新通报
        var uri = 'news/newestTime'
        doJavaGet(uri, function(res) {
            if(res != null && res.code == 0) {
                if(parseInt(res.datas) != parseInt(count)) {
                    $('#div1').css("display", "block")
                    $('.news_look').html('有 ' + (parseInt(res.datas) - parseInt(count)) + ' 个新话题，点击查看')
                }
            }
        }, "json");

    }
    setInterval(notice, 5000)

    function initeCount() {
        var uri = 'news/newestTime'
        doJavaGet(uri, function(res) {
            if(res != null && res.code == 0) {
                count = res.datas
            }
        }, "json");
    }
    initeCount() //初始化条数
    var newTimeKey = true //新消息通报 key
    function dataShow(data) {
        if(newTimeKey && data) {
            newestTime = data[0].createTime
            newTimeKey = false
        }
        var html = ''
        for(var i = 0; i < data.length; i++) {
            var test = data[i].newsId
            html = html + '<li class="hot_news_item have-img" data-newId=' + test + ' ><div class="content"><a class="title" style="text-decoration: none;" target="_blank" href=detail.html?newsId=' + data[i].newsId + '>' + data[i].title + '</a><div class="meta"><span>' + changTime(data[i].createTime) + " 来自: " + data[i].media + '</span></div></div></li>'
        }
        $('#dataList').append(html);
        isLoaded = true

    };

    function refresh() {
        location.reload()
    }

    function saveData(e) {
        var detail = $(e).attr("data-newid")
        window.localStorage.setItem('detail', detail);
    }
    //点击加载更多
    $(".load-more-hook .loading-more").on('click',function () {
        load();
    })
    $(window).scroll(function() {
        var srollPos = $(window).scrollTop(); //滚动条距顶部距离(页面超出窗口的高度)
        // console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
        //console.log("页面的文档高度 ："+$(document).height());
        //console.log('浏览器的高度：'+$(window).height());
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
        if(($(document).height() - range) <= totalheight && num != maxnum && isLoaded) {
            isLoaded = false
            num = num + 1;
            load();
        }
        if(num == maxnum+1){
           $(".loading-more").show();
            $(".loader1").css('display','none');
        }
    });

    function changTime(time) {
        var time = time.replace('T', ' ');
        var date1 = new Date(Date.parse(time.replace(/-/g, "/")));
        var timestamp2 = Date.parse(new Date(date1));

        var timeStr = (new Date() - timestamp2) / 1000
        if(timeStr < 60) { //多少分钟以内的
            time = '1 分钟'
        } else if(60 <= timeStr && timeStr < 3600) { //	一个小时以内

            time = parseInt(timeStr / 60) + " 分钟前";

        } else if(24 * 3600 > timeStr && timeStr >= 3600) { //24 小时以内

            time = parseInt(timeStr / 3600) + " 小时前";
        } else {
            time = parseInt(timeStr / 3600 / 24) + " 天前";
        }
        return time
    }

    function getQuary() {
        var url = window.location.href;
        if(url.split("?")[1]) {
            var quarys = url.split("?")[1].split("&")
            for(var i = 0; i < quarys.length; i++) {
                if(quarys[i].split("=")[0] == "keys") {
                    $('#head_search').val(decodeURI(quarys[i].split("=")[1]))
                    return
                }
            }
        }
    }

    function load() {
        getQuary();
        $(".loading-more").hide();
        $(".loader1").css('display','flex');
        if($('#head_search').val() != "" && $('#head_search').val() != undefined ) {
            var uri = 'news/search?currentPage=' + pageNum + '&pageSize=' + 20 + '&keywords=' + $('#head_search').val();
        } else {
            var uri = 'news/search?currentPage=' + pageNum + '&pageSize=' + 20;
        }
        doJavaGet(uri, function(res) {
            //                  console.log(res.datas)
            if(res != null && res.code == 0) {
                if(res.datas.length != 0){
                    setTimeout(function () {
                        searchDataShowAppend(res.datas)
                    },200)
                    $(".loading-more").show();
                    $(".loader1").css('display','none');
                }else{
                    $(".no-more-hook").fadeIn();
                }

            }
        }, "json");
        pageNum++;
    }

    load();

    function searchDataShowAppend(data) {
        var html = ''
        for(var i = 0; i < data.length; i++) {
            var creator = ''
            if(data[i].creator != null) {
                creator = ' 编辑 : ' + data[i].creator
            }
            var test = data[i].newsId
            html = html + '<li class="hot_news_item have-img" data-newId=' +
                test + ' onclick="saveData(this)" ><div class="content"><a class="title" style="text-decoration: none;" target="_blank" href=detail.html?newsId=' +
                data[i].newsId + '>' +
                data[i].title + '</a><div class="meta"><span>' + changTime(data[i].createTime) + " 来自: " + data[i].media + '</span>'
            //                          +creator
            //                          +
            '</div></div></li>'
            $(".loading-more").show();
            $(".loader1").css('display','none');
        }
        $('#dataList').append(html);
        isLoaded = true
    }
    $(".navbar-fixed-container").on('keydown','#head_search',function(e) {
        if (e.keyCode == 13) {
            var keywords = $('#head_search').val()
            console.log(keywords)
            $(".loading-more").hide();
            $(".loader1").css('display', 'flex');
            var uri = 'news/search?currentPage=' + pageNum + '&pageSize=' + 20 + '&keywords=' + keywords;
            doJavaGet(uri, function (res) {
                //                      console.log(res.datas)
                if (res != null && res.code == 0) {
                    if (res.datas.length != 0) {
                        setTimeout(function () {
                            searchDataShow(res.datas);
                        }, 200)
                        $(".loading-more").show();
                        $(".loader1").css('display', 'none');
                    } else {
                        $(".no-more-hook").fadeIn();
                    }
                }
            }, "json");

        }
    });

    function searchDataShow(data) {
        var html = ''
        for(var i = 0; i < data.length; i++) {
            var creator = ''
            if(data[i].creator != null) {
                creator = ' 编辑 : ' + data[i].creator
            }
            var test = data[i].newsId
            html = html + '<li class="hot_news_item have-img" data-newId=' +
                test + ' onclick="saveData(this)" ><div class="content"><a class="title" style="text-decoration: none;"  href=detail.html?newsId=' +
                data[i].newsId + '>' +
                data[i].title + '</a><div class="meta"><span>' + changTime(data[i].createTime) + " 来自: " + data[i].media + '</span>' +
                creator +
                '</div></div></li>'
        }
        //$('#dataList').append(html);
        $('#dataList').html(html);
    }
        function dispear() {
            $('#div1').css("display", "none")
        }
    function dataShowRight(data) {

        var html = ''
        for(var i = 0; i < data.length; i++) {
            var test = data[i].newsId
            html = html + '<li data-newId=' + test + ' > <span>' + (i + 1) + '</span><a  href=detail.html?newsId=' + data[i].newsId + '>' + data[i].title + '</a></li>'
        }
        $('#dataRight').append(html);
    };

    function loadRight(days) {
        var uri = 'news/quary?currentPage=' + num + '&pageSize=' + 8 + '&days=' + days;
        doJavaGet(uri, function(res) {
            if(res != null && res.code == 0) {
                dataShowRight(res.datas)
            }
        }, "json");
    }
    loadRight(1);

    //js出来左右边距问题
    $(".right_container").width($(".right-container-wrap").width());
    $(window).resize(function() {
        $(".right_container").width($(".right-container-wrap").width());
    })
})