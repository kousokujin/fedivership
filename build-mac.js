const builder = require('electron-builder');

builder.build({
    platform: 'mac',
    config: {
        'appId': 'com.kousokujin.fedivership',
        'mac':{
            'target': 'dmg',
            "icon": "src/icon/icon.png"
        }
    }
});