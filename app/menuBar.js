const { dialog, Menu, BrowserWindow } = require('electron');

const createMenu = (windowTarget) => {
    const playerAction = (action, value) => windowTarget.webContents.send('control-player', action, value)

    const menuTemplate = ([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open File...',
                    accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                    click() {
                        dialog.showOpenDialog({
                            properties: ['openFile'], filters: [
                                { name: 'Video Files', extensions: ['mp4', 'avi', 'mkv', 'webm'] },
                                { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg', 'flac'] },
                                { name: 'All Files', extensions: ['*'] }
                            ]
                        }).then(result => {
                            windowTarget.webContents.executeJavaScript('console.log(window)')
                            if (!result['canceled']) {
                                // windowTarget.webContents.send('create-player', result['filePaths'][0])
                            }
                        }).catch(err => {
                            dialog.showErrorBox('Error', err)
                        });
                    }
                },
                {
                    label: 'Open URL...',
                    click() {
                        //
                    }
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
                    click: () => windowTarget.setAlwaysOnTop(!windowTarget.isAlwaysOnTop())
                },
                {
                    label: 'Keep Aspect Ratio',
                    type: 'checkbox',
                    checked: true,
                    click: () => console.log('WIP')
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
                    click: () => playerAction('togglePause')
                },
                {
                    label: 'Stop',
                    accelerator: 'Backspace',
                    click: () => playerAction('stop')
                },
                { type: 'separator' },
                {
                    label: 'Increase Volume',
                    accelerator: 'Up',
                    click: () => playerAction('changeVolume', +10)
                },
                {
                    label: 'Decrease Volume',
                    accelerator: 'Down',
                    click: () => playerAction('changeVolume', -10)
                },
                {
                    label: 'Mute',
                    type: 'checkbox',
                    accelerator: 'M',
                    click: () => playerAction('toggleMute')
                },
                { type: 'separator' },
                {
                    label: 'Jump to Start',
                    accelerator: process.platform == 'darwin' ? 'Command+Left' : 'Ctrl+Left',
                    click: () => playerAction('seek', 0)
                },
                {
                    label: 'Jump to End',
                    accelerator: process.platform == 'darwin' ? 'Command+Right' : 'Ctrl+Right',
                    click: () => playerAction('seek', -1)
                },
                {
                    label: 'Seek Forwards',
                    accelerator: 'Shift+Right',
                    click: () => playerAction('seek', +15)
                },
                {
                    label: 'Seek Backwards',
                    accelerator: 'Shift+Left',
                    click: () => playerAction('seek', -15)
                },
                {
                    label: 'Peek Forwards',
                    accelerator: 'Right',
                    click: () => playerAction('seek', +2.5)
                },
                {
                    label: 'Peek Backwards',
                    accelerator: 'Left',
                    click: () => playerAction('seek', -2.5)
                },
                { type: 'separator' },
                {
                    label: 'Increase Rate',
                    accelerator: process.platform == 'darwin' ? 'Command+Left' : 'Ctrl+Up',
                    click: () => playerAction('changeSpeed', +1)
                },
                {
                    label: 'Decrease Rate',
                    accelerator: process.platform == 'darwin' ? 'Command+Down' : 'Ctrl+Down',
                    click: () => playerAction('changeSpeed', -1)
                },
                { type: 'separator' },
            ]
        },
        {
            label: 'Player',
            submenu: [
                {
                    label: 'Pitch Correction',
                    type: 'checkbox',
                    accelerator: process.platform == 'darwin' ? 'Command+/' : 'Ctrl+/',
                    click: () => playerAction('togglePitchCorrection')
                },
                {
                    label: 'Add Screen',
                    accelerator: process.platform == 'darwin' ? 'Command+T' : 'Ctrl+T',
                    // click: () => 
                },
                {
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