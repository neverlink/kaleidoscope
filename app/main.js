const { app, ipcMain, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const constructArgs = () => {
    let preferences = JSON.parse(fs.readFileSync(path.join(__dirname, 'preferences.json')));
    let filePath = process.argv.at(-1);
    return [ preferences, filePath ]
}

const createMainWindow = (args) => {
    preferences = args[0]
    filePath = args[1]

    const mainWindow = new BrowserWindow({
        width: preferences['initialWidth'],
        height: preferences['initialHeight'],

        minWidth: preferences['minWidth'],
        minHeight: preferences['minHeight'],

        // maxWidth: preferences['maxWidth'],
        // maxHeight: preferences['maxHeight'],

        center: preferences['centerWindowOnLaunch'],
        autoHideMenuBar: preferences['hideMenuBar'],
        alwaysOnTop: preferences['alwaysOnTop'],

        icon: 'swag.png',

        webPreferences: {
            nodeIntegration: true, 
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
            additionalArguments: [ JSON.stringify(preferences), filePath ]
        }
    })

    mainWindow.loadFile('app/index.html');
    // mainWindow.webContents.openDevTools();

    mainWindow.on('close', function (event) {
        // prevent default
        mainWindow.hide();
    });

    ipcMain.on('resize-window', (event, width, height) => {
        mainWindow.setSize(width, height, true); // ask monyu to try this
        mainWindow.center();
    })

    return mainWindow
}

const createTray = () => {
    let tray = new Tray(path.join(__dirname, 'swag.png'));

    const contextMenu = Menu.buildFromTemplate([
        { label: 'About', type: 'normal', role: 'About' },
        { label: 'test', type: 'separator' },
        { label: 'Quit', type: 'normal', role: 'quit' }
    ])

    tray.setContextMenu(contextMenu);
    tray.setToolTip('Kaleidoscope');
    tray.setTitle('Kaleidoscope');

    tray.on('click', () => {
        console.log('not implemented');
        //mainWindow.show()
    })
    return tray
}

app.whenReady().then(() => {
    const args = constructArgs();
    createMainWindow(args);
    createTray();

    app.on('window-all-closed', () => {
        console.log('all windows closed');
        app.quit(); // remove this later
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    })
})