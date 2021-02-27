const { contextBridge,remote, shell} = require("electron");
const {Menu,MenuItem} = remote;


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
  const browser_open = (url != "")
      
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