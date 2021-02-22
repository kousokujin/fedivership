window.ipc.addserver_onload();

window.ipc.urls((event,urllists)=>{
    $(".page_wrapper").append("<div id=\"server_wrap\" class=\"wrap\"></div>")
    $("#server_wrap").append("<h3>サーバ一覧</h3>")
    $("#server_wrap").append("<p>登録されてるサーバ一覧です。</p>")
    $("#server_wrap").append("<table id=\"server_lists\"></table>")
    for(let i in urllists["url_list"]){
        var url_replace = urllists["url_list"][i].replace('https://','');
        $("#server_lists").append("<tr id=\"row_" + i +"\"></tr>")
        $("#row_"+i).append("<td class=\"icon\"><img src=\""+urllists["url_list"][i]+"/favicon.ico\"></td>");
        $("#row_"+i).append("<td class=\"address_column\">"+ url_replace +"</td>");
        $("#row_"+i).append("<td class=\"remove_column\"><a href=\"#\" id=\"remove_"+i+"\"class=\"btn_remove\">削除</a></td>");

        $("#remove_"+i).click(function(){
            removeserver(i);
        })
    }
})

$(function(){
    $("#addserver_button").click(function(){
        console.log("addbuttonpushed");
        const texturl = $("#server_address_box").val();
        window.ipc.addserver(texturl);
    });
})

/*
function eventregister(){
    $("#addserver_button").click(function(){
        console.log("addbuttonpushed");
        const texturl = $("#server_address_box").val();
        window.ipc.addserver(texturl);
    });
}
*/

function removeserver(key){
    window.ipc.remove_server(key)
}