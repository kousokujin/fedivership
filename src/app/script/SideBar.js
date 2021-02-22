var urls = {}

//メインプロセスから受信
window.ipc.urls((event,urllist)=>{
    
    $(".srv_class").remove();
    for(let i in urllist["url_list"]){
        addtab(i,urllist["url_list"][i]);
        urls[i] = urllist["url_list"][i];
    }
    registerevents();
    changeforcus(urllist["forcus"])
    changePage();
})

window.ipc.onload();
registerevents();
addmenu();

function registerevents(){

    $("input:radio[name=check]").change(function() {
       changePage();
    });

}

function changePage(){
    if($("input:radio[name=check]:checked").val() == "add_server"){
        window.ipc.showaddpage();
    }
    else{
        //url = urls[$("input:radio[name=check]:checked").val()];
        key = $("input:radio[name=check]:checked").val()
        window.ipc.changepage(key);
    }
}

function changeforcus(forcus){
    $("#server_tabs li input").each(function(index){
        if($(this).attr('value') == forcus){
            $(this).prop('checked',true);
        }else{
            $(this).prop('checked',false);
        }

    })
}

function addtab(key,url){
    var tab_size = $("#server_tabs li").length;
    var url_replace = url.replace('https://','');
    
    $("#server_tabs").append("<li class=\"srv_class\"></li>");
    $("#server_tabs li").eq(tab_size).append("<input class=\"tab-radio\" id=\"tab" + String(tab_size) +"\"type=\"radio\" name=\"check\" value=\""+ String(key) +"\">");
    $("#server_tabs li").eq(tab_size).append("<label for=\"tab"+String(tab_size) + "\" class=\"balloonoya\"><img src=\""+url+"/favicon.ico\"></label>");
    //$("#server_tabs li").eq(tab_size).append("<label for=\"tab"+String(tab_size) + "\" class=\"balloonoya\"><img src=\""+url+"/favicon.ico\"><span class=\"balloon\">"+url_replace+"</span></label>");
}

function addmenu(){
    //window.menu.menutest();
}