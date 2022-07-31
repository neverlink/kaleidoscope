const { Menu, BrowserWindow } = require('electron');
const playerHandler = require('./playerHandler.js');

const createMenu = (windowTarget) => {

    // console.log(playerHandler.getFocusedPlayer())
    const playerAction = (action, value) => windowTarget.webContents.send('control-player', action, value)

    const menuTemplate = ([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open File...',
                    click() {
                        dialog.showOpenDialog({
                            properties: ['openFile'], filters: [
                                { name: 'Video Files', extensions: ['mp4', 'avi', 'mkv', 'webm'] },
                                { name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg', 'flac'] },
                                { name: 'All Files', extensions: ['*'] }
                            ]
                        }).then(result => {
                            console.log(result);
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
                { label: 'Exit', role: 'Quit', accelerator: 'Ctrl+W' } // add darwin
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
                { label: 'Keep Aspect Ratio' },
                { label: 'Show Title Bar' },
                {
                    label: 'Frameless (dysfunctional)',
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
            label: 'Player',
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
                    click: () => playerAction('changeSpeed', +10)
                },
                {
                    label: 'Decrease Rate',
                    accelerator: process.platform == 'darwin' ? 'Command+Down' : 'Ctrl+Down',
                    click: () => playerAction('changeSpeed', -10)
                },
                {
                    label: 'Pitch Correction',
                    type: 'checkbox',
                    accelerator: process.platform == 'darwin' ? 'Command+/' : 'Ctrl+/',
                    click: () => playerAction('togglePitchCorrection')
                },
                { type: 'separator' },
                { label: 'Filters...' }
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
                            icon: 'swag.png'
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