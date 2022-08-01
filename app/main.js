const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const createMenu = require('./menuBar.js')
// const createTray = require('./tray.js')

const constructArgs = () => {
    let preferences = JSON.parse(fs.readFileSync(path.join(__dirname, 'static/preferences.json')));
    filePath = process.argv.length == 2 ? process.argv.at(-1) : "none"
    return [preferences, filePath]
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

        icon: path.join(__dirname, 'static/icon.png'),

        frame: true,

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            // preload: path.join(__dirname, 'preload.js'),
            additionalArguments: [JSON.stringify(preferences), filePath]
        }
    })

    mainWindow.loadFile('app/static/index.html');
    mainWindow.webContents.openDevTools();

    mainWindow.on('close', function (event) {
        // prevent default
        // mainWindow.hide();
        app.quit();
    });

    // change this to get size from renderer and resize
    ipcMain.on('resize-window', (event, width, height) => {
        mainWindow.setSize(width, height, true); // ask monyu to try this
        mainWindow.center();
    })

    return mainWindow
}

app.whenReady().then(() => {
    const args = constructArgs();
    mainWindow = createMainWindow(args);

    Menu.setApplicationMenu(createMenu(mainWindow));
    // createTray(mainWindow);

    app.on('window-all-closed', () => {
        console.log('all windows closed');
        app.quit(); // remove this later
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    })
});