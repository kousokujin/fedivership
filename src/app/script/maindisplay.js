$(function(){
    window.ipc.changepageurl((event,url)=>{
        console.log(url)
        $("#mainview").attr("src",url);
    });

    window.ipc.mainview_onload();

    var wv = document.getElementById('mainview')
    // webviewのロード完了イベント。onloadみたいな感じ。
    wv.addEventListener("did-finish-load", function(){
        wv.send("getContent");
    });
});