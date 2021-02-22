const customTitlebar = require("custom-electron-titlebar");

window.addEventListener('DOMContentLoaded', () => {
    var bar = new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#333333'),
        titleHorizontalAlignment: "left",
    });

    bar.updateTitle("Fedivership");
    bar.updateMenu(null);
});
