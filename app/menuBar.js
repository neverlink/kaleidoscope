const { dialog, Menu, BrowserWindow } = require('electron');

const createMenu = (windowTarget) => {
    const createPlayers = (action, fileURI) => windowTarget.webContents.send('create-players', action, fileURI);
    const destroyPlayer = (action) => windowTarget.webContents.send('destroy-player', action);
    const restorePlayer = (action) => windowTarget.webContents.send('restore-player', action);
    const commandPlayers = (action, value) => windowTarget.webContents.send('command-players', action, value);
    const toggleAspectRatio = (action) => windowTarget.webContents.send('toggle-aspect-ratio', action);

    const menuTemplate = ([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open...',
                    accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                    click() {
                        dialog.showOpenDialog({
                            properties: [
                                'openFiles', 'multiSelections'
                            ],
                            filters: [
                                { name: 'Video Files', extensions: ['mp4', 'avi', 'mkv', 'webm'] },
                                { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg', 'flac'] },
                                { name: 'All Files', extensions: ['*'] }
                            ]
                        }).then(result => {
                            if (!result['canceled']) {
                                createPlayers(result['filePaths']);
                            }
                        });
                    }
                },
                {
                    label: 'Open URL...',
                },
                { type: 'separator' },
                {
                    label: 'Open File Location',
                    click: () => windowTarget.setAlwaysOnTop(!windowTarget.isAlwaysOnTop())
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    role: 'Quit',
                    accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q'
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Always on Top',
                    type: 'checkbox',
                    click: () => {
                        windowTarget.setAlwaysOnTop(!windowTarget.isAlwaysOnTop());
                    }
                },
                {
                    label: 'Keep Aspect Ratio',
                    type: 'checkbox',
                    checked: true,
                    click: () => toggleAspectRatio()
                },
                {
                    label: 'Title Bar',
                    type: 'checkbox',
                    checked: true,
                    accelerator: 'F2',
                    click: () => windowTarget.setMenuBarVisibility(!windowTarget.isMenuBarVisible())
                },
                {
                    label: 'Frameless (WIP)',
                    type: 'checkbox',
                    accelerator: 'F10',
                },
                {
                    label: 'Fullscreen',
                    type: 'checkbox',
                    accelerator: 'F11',
                    click: () => windowTarget.setFullScreen(!windowTarget.fullScreen)
                },
                {
                    label: 'Developer Tools',
                    type: 'checkbox',
                    accelerator: 'F12',
                    click: () => windowTarget.toggleDevTools()
                }
            ]
        },
        {
            label: 'Controls',
            submenu: [
                {
                    label: 'Play/Pause',
                    accelerator: 'Space',
                    click: () => commandPlayers('togglePause')
                },
                {
                    label: 'Stop',
                    accelerator: 'Backspace',
                    click: () => commandPlayers('stop')
                },
                { type: 'separator' },
                {
                    label: 'Increase Volume',
                    accelerator: 'Up',
                    click: () => commandPlayers('adjustVolume', +5)
                },
                {
                    label: 'Decrease Volume',
                    accelerator: 'Down',
                    click: () => commandPlayers('adjustVolume', -5)
                },
                {
                    label: 'Mute',
                    type: 'checkbox',
                    accelerator: 'M',
                    click: () => commandPlayers('toggleMute')
                },
                { type: 'separator' },
                {
                    label: 'Jump to Start',
                    accelerator: process.platform == 'darwin' ? 'Command+Left' : 'Ctrl+Left',
                    click: () => commandPlayers('seek', 0)
                },
                {
                    label: 'Jump to End',
                    accelerator: process.platform == 'darwin' ? 'Command+Right' : 'Ctrl+Right',
                    click: () => commandPlayers('seek', -1)
                },
                {
                    label: 'Seek Forwards',
                    accelerator: 'Shift+Right',
                    click: () => commandPlayers('seek', +15)
                },
                {
                    label: 'Seek Backwards',
                    accelerator: 'Shift+Left',
                    click: () => commandPlayers('seek', -15)
                },
                {
                    label: 'Peek Forwards',
                    accelerator: 'Right',
                    click: () => commandPlayers('seek', +2.5)
                },
                {
                    label: 'Peek Backwards',
                    accelerator: 'Left',
                    click: () => commandPlayers('seek', -2.5)
                },
                { type: 'separator' },
                {
                    label: 'Increase Rate',
                    accelerator: process.platform == 'darwin' ? 'Command+Left' : 'Ctrl+Up',
                    click: () => commandPlayers('adjustRate', +1)
                },
                {
                    label: 'Decrease Rate',
                    accelerator: process.platform == 'darwin' ? 'Command+Down' : 'Ctrl+Down',
                    click: () => commandPlayers('adjustRate', -1)
                },
                { type: 'separator' },
            ]
        },
        {
            label: 'Player',
            submenu: [
                {
                    label: 'Add Player',
                    accelerator: process.platform == 'darwin' ? 'Command+T' : 'Ctrl+T',
                    // click: () => 
                },
                {
                    label: 'Close Player',
                    accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+W',
                    click: () => destroyPlayer()
                },
                {
                    label: 'Restore Player',
                    accelerator: process.platform == 'darwin' ? 'Command+Shift+T' : 'Ctrl+Shift+T',
                    click: () => restorePlayer()
                },
                { type: 'separator' },
                {
                    label: 'Pitch Correction',
                    type: 'checkbox',
                    accelerator: process.platform == 'darwin' ? 'Command+/' : 'Ctrl+/',
                    click: () => commandPlayers('togglePitchCorrection')
                },
                {
                    // Open window with sliders for each filter
                    label: 'Filters...',
                    submenu: [
                        {
                            label: 'Invert'
                        },
                        {
                            label: 'Greyscale'
                        },
                        {
                            label: 'Hue Shift'
                        },
                        {
                            label: 'Flip'
                        },
                        {
                            label: 'Rotate'
                        }
                    ]
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                { role: 'about' },
                {
                    label: 'Hotkeys',
                    accelerator: 'F1',
                    click: () => {
                        const aboutWindow = new BrowserWindow({
                            width: 500,
                            height: 400,
                            center: true,
                            autoHideMenuBar: true,
                            alwaysOnTop: true,
                            icon: 'swag.png' // change this
                        })
                        aboutWindow.loadFile('app/static/about.html');
                    }
                }
            ]
        }
    ]);

    if (process.platform == 'darwin') {
        menuTemplate.unshift({});
    }

    return Menu.buildFromTemplate(menuTemplate);
}

module.exports = createMenu