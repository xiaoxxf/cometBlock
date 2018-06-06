var currentPage_record = 1;
var pageSize=6;
var dic_arr = [];
var dic_arr_id = [];
window.onload = function(){
	searchCoinWalletType();
	huiCoinNum();
	
}

$('.user_name').html(userinfo.realName);
$('.user_icon')[0].src = userinfo.userPic; 

function searchCoinWalletType(){
	var uri = 'blockchain/quary?parentId=31'
	doJavaGet(uri,function(res){
		for(var i = 0; i < res.datas.length; i++){
			dic_arr_id.push(res.datas[i].id)
		}
		dic_arr = res.datas;
		searchWalletData();
	})
}

function searchWalletData(){
	var uri='chainCoinWallet/queryChainCoinRecord?currentPage='+currentPage_record+'&pageSize='+pageSize+'&creator='+userId
   	doJavaGet(uri,function(res){
		for (var i = 0; i < res.datas.length; i++) {
			var temp_coin_type_id = res.datas[i].coinTypeId;
			var temp_index = dic_arr_id.indexOf(temp_coin_type_id )
			if( temp_index > 0 )
   			{	
   				res.datas[i]['type_name'] = dic_arr[temp_index].dicValue
   			}
		}
		if(currentPage_record == 1){
			initPage(res.count);
		}
		$(".paginator-wrap").show();
   		var tpl = document.getElementById('user_wallet_tpl').innerHTML;
    	var content = template(tpl, {list: res.datas});
    	$('.content').html('');
    	$('.content').append(content)
   	},"json")
}
//查彗星币数量
function huiCoinNum(){
	var uri='chainCoinWallet/queryChainCoinBanlaceDetail?creator='+userId+'&coin_id=1'
	doJavaGet(uri,function(res){
		if(res.code==0){
			$(".coin_num").html(res.datas.totalCount)
		}
	},"json")
}

//分頁
function initPage(count) {
    $(".paginator-wrap").pagination({
        currentPage: currentPage_record,
        totalPage: parseInt(count/pageSize)+1,
        isShow: false,
//      count: 2,
        prevPageText: "< 前页",
        nextPageText: "后页 >",
        callback: function(current) {
            currentPage_record = current;
            searchWalletData();
        }
    });
}