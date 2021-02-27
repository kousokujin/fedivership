const {electron, BrowserWindow,BrowserView,app,ipcMain,shell} = require('electron');
const Store = require('electron-store');
const { url } = require('inspector');
const path = require('path');
const { title } = require('process');

const store = new Store({
  cwd: "fedivership",  // 設定ファイル保存ディレクトリ
  name: 'config'  // 設定ファイル名
});

//サーバURLリスト
var urls = {};

//フォーカス
var forcus = "";

// メインウィンドウ
let mainWindow;
//サイドバー
let sidebar;
//メインページ
let mainview;
//メインウィンドウの位置とか
var WinBound;
//タイトルバー高さ
let titleheight = 30;

function createWindow() {
  //設定ファイル読み込み

  mainWindow = new BrowserWindow({
    frame:false,
  });
  mainWindow.setMenu(null);

  //前回起動時のウィンドウの状態を復元
  bound = store.get("WindowBound","none");
  //urlの読み込み
  urls = store.get("urls",{});
  //forcusキー読み込み
  forcus = store.get("forcus","add_server");

  if(bound != "none"){
    mainWindow.setBounds(bound);
  }
  WinBound = mainWindow.getBounds();

  //タイトルバーview
  title_bar = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      webviewTag: false,
      enableRemoteModule: true,
      contextIsolation:true,
      preload: __dirname+'/preloads/preload_titlebar.js',
    },
  })
  mainWindow.addBrowserView(title_bar);
  title_bar.setBounds({x:0,y:0,width:WinBound.width,height:50});
  title_bar.setAutoResize({width:true,height:false})
  title_bar.webContents.loadFile(__dirname+"/app/titlebar.html")

  //サイドバー表示
  sidebar = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      webviewTag: false,
      enableRemoteModule: true,
      contextIsolation:true,
      preload: __dirname+'/preloads/preload.js',
    },
    transparent: true,
  })
  //mainWindow.loadFile('app/index.html');
  mainWindow.addBrowserView(sidebar)

  sidebar.webContents.loadFile(__dirname+"/app/sidebar.html")
  sidebar.setBounds({ x: 0, y: titleheight, width:60,height:WinBound.height-titleheight})
  sidebar.setAutoResize({width:false,height:true})

  //メイン画面
  mainview = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      webviewTag: true,
      enableRemoteModule: true,
      contextIsolation:true,
      preload: __dirname+'/preloads/preload.js',
    }
  })
  mainWindow.addBrowserView(mainview)
  //mainview.webContents.loadFile( __dirname+"/app/addserver.html")
  mainview.webContents.loadFile(__dirname+"/app/maindisplay.html")
  mainview.setBounds({x:60,y:titleheight,width:WinBound.width - 60,height: WinBound.height - titleheight})
  mainview.setAutoResize({width:true,height:true})
  //sidebar.webContents.openDevTools({mode: 'detach'});
  //mainview.webContents.openDevTools({mode: 'detach'});


  // メインウィンドウが閉じられたときの処理
  mainWindow.on('closed', () => {
    store.set("WindowBound",WinBound);
    store.set("urls",urls);
    store.set("forcus",forcus);
    mainWindow = null;
  });

  //メインウィンドウが動く
  mainWindow.on('move',()=>{
    WinBound = mainWindow.getBounds();
  })
  mainWindow.on('resize',()=>{
    WinBound = mainWindow.getBounds();
  })

  //リンクが開かれたとき
  mainview.webContents.on('new-window',function(e,url){
    e.preventDefault();
    shell.openExternal(url);
  })
}
//  初期化が完了した時の処理
app.on('ready', createWindow);

// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', () => {
  // macOSのとき以外はアプリケーションを終了させます
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

//サーバ切り替えボタン
ipcMain.on("changepage", (event, key) => {
  //mainview.webContents.loadURL(urls[key]);
  mainview.webContents.loadFile(__dirname+"/app/maindisplay.html")
  //mainview.webContents.send("changepageurl",urls[key]);
  forcus = key;
});

//mainview読み込み完了
ipcMain.on("mainview_onload",(event,key)=>{
  mainview.webContents.send("changepageurl",urls[forcus]);
})

//サーバ追加ボタン
ipcMain.on("addpageshow",(event,arg)=>{
  mainview.webContents.loadFile( __dirname+"/app/addserver.html")
  //mainview.webContents.send("changepageurl","addserver.html");
  forcus = "add_server";
})

ipcMain.on("addserver",(event,url)=>{
  //console.log("addserver:"+arg);
  if(String(url).match("https://")){
    fixurl = url;
  }else{
    fixurl = "https://"+url;
  }

  keyname = "tab"+String(parseInt(Math.random()*1145141919))
  urls[keyname] = fixurl;
  senddata = {
    "forcus": keyname,
    "url_list": urls
  }
  sidebar.webContents.send('seturls',senddata)
  forcus = keyname;

  //url保存
  store.set("urls",urls);
})

ipcMain.on("sidebar_loaded",(event,arg)=>{
  senddata = {
    "forcus": forcus,
    "url_list": urls
  }
  sidebar.webContents.send('seturls',senddata)
})

//addserverページが読み込まれたとき
ipcMain.on("addserver_onload",(event,arg)=>{
  senddata = {
    "forcus": forcus,
    "url_list": urls
  }
  let url_len = Object.keys(urls).length; 
  if(url_len > 0){
    mainview.webContents.send("seturls",senddata)
  }
})

//サーバが削除されたとき
ipcMain.on("remove_server",(event,arg)=>{
  delete urls[arg];
  senddata = {
    "forcus": "add_server",
    "url_list": urls
  }
  sidebar.webContents.send("seturls",senddata)
  
  //url保存
  store.set("urls",urls);
})