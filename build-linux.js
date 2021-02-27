const builder = require('electron-builder');

builder.build({
    config: {
        'appId': 'com.kousokujin.fedivership',
        'linux':{
            'target': 'portable',
            "icon": "src/icon/icon.ico"
        }
    }
});