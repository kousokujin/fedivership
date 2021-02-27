const { contextBridge, ipcRenderer,shell,remote} = require("electron");
const {Menu,MenuItem} = remote;


contextBridge.exposeInMainWorld(
    "ipc", {
        //addserver
        addserver:(data) =>{
            ipcRenderer.send("addserver",data);
        },
        //addserver
        addserver_onload:()=>{
            ipcRenderer.send("addserver_onload","load")
        },
        //addserver
        remove_server:(server_key) =>{
            ipcRenderer.send("remove_server",server_key)
        },

        //メインプロセスから受信
        urls:(eventarg)=>{
            ipcRenderer.on('seturls',eventarg);
        },
        changepageurl:(url)=>{
            ipcRenderer.on("changepageurl",url)
        },
    }

);

// 右クリされたら
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    menu = genMenu()
    menu.popup({
      window: remote.getCurrentWindow()
    });
}, false);
  
function genMenu(url = ""){
    const menu = new Menu();
  
    const isSelected = (window.getSelection().toString() != "")
        
    // ラベル
    menu.append(new MenuItem({
      label: 'コピー',
      role: 'copy',
      enabled: isSelected
    }));
  
    menu.append(new MenuItem({
      label: '貼り付け',
      role: 'paste'
    }));
  
    menu.append(new MenuItem({
      label: 'Googleで検索',
      enabled: isSelected,
      click() {
        const text = window.getSelection().toString()
        const search_url = "https://google.com/search?q=" + text
        shell.openExternal(search_url)
      }
    }));
  
    return menu
}