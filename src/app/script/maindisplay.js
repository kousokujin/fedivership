let clientX, clientY

$(function(){
    window.ipc.changepageurl((event,url)=>{
        console.log(url)
        $("#mainview").attr("src",url);
    });

    window.ipc.mainview_onload();

    var wv = document.getElementById('mainview')

    wv.addEventListener('new-window', (e) => console.log(e.url))
});

function onLoad() {
  const webview = document.querySelector('webview')
  window.addEventListener('mousedown', e => {
    // mousedownイベント時に座標を保存しておく
    clientX = e.clientX;
    clientY = e.clientY;
  })
  webview.addEventListener('dom-ready', () => {
    webview.addEventListener('new-window', (e) => {
      e.preventDefault();
      const bbox = webview.getBoundingClientRect();
      const guestPageX = clientX - bbox.left;
      const guestPageY = clientY - bbox.top;
      // 座標からaタグを取得し、そこからhrefを取得する
      const script = 'document.elementFromPoint('+guestPageX+','+guestPageY+')["href"]'
      webview.executeJavaScript(
        "document.elementFromPoint(".concat(guestPageX, ",", guestPageY, ")['href']"),
        false,
        (realURL) => {
          window.shell.openExternal(realURL)
        }
      );
    })
  })
}