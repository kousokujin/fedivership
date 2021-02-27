/*const customTitlebar = require("custom-electron-titlebar");
const { append } = require("custom-electron-titlebar/lib/common/dom");*/
const { contextBridge, ipcRenderer,remote, ipcMain} = require("electron");
const {Menu,MenuItem} = remote;


contextBridge.exposeInMainWorld(
    "ipc", {
        //sidebar
        changepage: (data) => {
            ipcRenderer.send("changepage", data);
        },
        //sidebar
        showaddpage:() => {
            ipcRenderer.send("addpageshow","showaddpage");
        },
        send:(data) =>{
            ipcRenderer.send("message",data);
        },
        //sidebar
        onload:() =>{
            ipcRenderer.send("sidebar_loaded","load");
        },
        //addserver
        addserver:(data) =>{
            ipcRenderer.send("addserver",data);
        },
        //addserver
        addserver_onload:()=>{
            ipcRenderer.send("addserver_onload","load")
        },
        //maiview
        mainview_onload:()=>{
            ipcRenderer.send("mainview_onload","load")
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

contextBridge.exposeInMainWorld(
    "menu",{
        menutest:()=>{
            const menu = new Menu();
      
            // ラベル定義
            menu.append(new MenuItem({
              label: 'MenuItem1',
              click() {
                console.log('item 1 clicked');
              }
            }));
      
            // 右クリされたら
            window.addEventListener('contextmenu', (e) => {
              e.preventDefault();
              menu.popup({
                window: remote.getCurrentWindow()
              });
            }, false);
        }

    }
);