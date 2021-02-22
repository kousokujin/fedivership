const builder = require('electron-builder');

builder.build({
    config: {
        'appId': 'com.kousokujin.fedivership',
        'win':{
            'target': 'portable',
            "icon": "src/icon/icon.ico"
        }
    }
});