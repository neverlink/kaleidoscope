const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const createMenu = require('./menuBar.js');
const path = require('path');
const fs = require('fs');

const constructArgs = () => {
    let preferences = JSON.parse(fs.readFileSync(path.join(__dirname, 'static/preferences.json')));
    filePath = process.argv.length == 2 ? process.argv.at(-1) : "none";
    return [preferences, filePath]
}

const createMainWindow = (args) => {
    preferences = args[0];
    filePath = args[1];

    const mainWindow = new BrowserWindow({
        width: preferences['initialWidth'],
        height: preferences['initialHeight'],

        // minWidth: preferences['minWidth'],
        // minHeight: preferences['minHeight'],

        maxWidth: preferences['maxWidth'],
        maxHeight: preferences['maxHeight'],

        center: preferences['centerWindowOnLaunch'],
        autoHideMenuBar: preferences['hideMenuBar'],
        alwaysOnTop: preferences['alwaysOnTop'],

        icon: path.join(__dirname, 'static/icon.png'),

        frame: true, // for now

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            additionalArguments: [JSON.stringify(preferences), filePath]
        }
    })

    mainWindow.webContents.openDevTools();

    mainWindow.setBackgroundColor('#111');
    mainWindow.loadFile('app/static/index.html');

    return mainWindow
}

const setIpcEvents = () => {
    const appLocked = app.requestSingleInstanceLock();

    if (!appLocked) {
        app.quit();
    } else {
        app.on('second-instance', (event, args) => {
            fileURI = args.at(-1);
            mainWindow.webContents.send('create-players', fileURI);
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.focus();
        });
    }

    ipcMain.on('resize-window', (event, newWidth, newHeight) => {
        mainWindow.setSize(newWidth, newHeight);
        mainWindow.center();
    });

    ipcMain.on('quit-app', (event) => {
        app.quit();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
}

const main = () => {
    const args = constructArgs();
    mainWindow = createMainWindow(args);
    Menu.setApplicationMenu(createMenu(mainWindow));
    setIpcEvents();
}

app.whenReady().then(() => {
    main();
});