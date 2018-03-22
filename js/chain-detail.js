$("#rating #stars img").on('mouseenter',function (e) {
    var self = $(e.currentTarget);
    if(self.attr('id') == 'star5'){
        self.parent().parent().find('img').attr('src','img/star-full.png')
        $("#rateword").text('力荐')
    }
    if(self.attr('id') == 'star4'){
        self.parent().parent().find('img').attr('src','img/star-full.png')
        $("#rating #stars #star5").attr('src','img/star-empty.png')
        $("#rateword").text('推荐')
    }
    if(self.attr('id') == 'star3'){
        self.parent().parent().find('img').attr('src','img/star-full.png')
        $("#rating #stars #star4").attr('src','img/star-empty.png')
        $("#rating #stars #star5").attr('src','img/star-empty.png')
        $("#rateword").text('还行')
    }
    if(self.attr('id') == 'star2'){
        self.parent().parent().find('img').attr('src','img/star-empty.png')
        $("#rating #stars #star1").attr('src','img/star-full.png')
        $("#rating #stars #star2").attr('src','img/star-full.png')
        $("#rateword").text('较差')
    }
    if(self.attr('id') == 'star1'){
        self.parent().parent().find('img').attr('src','img/star-empty.png')
        $("#rating #stars #star1").attr('src','img/star-full.png')
        $("#rateword").text('很差')
    }
})
$("#rating #stars").on('mouseleave',function (e) {
    var self = $(e.currentTarget);
    $("#rateword").text('')
    //self.parent().parent().find('img').attr('src','img/star-empty.png')
})