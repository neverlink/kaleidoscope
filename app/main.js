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

    mainWindow = new BrowserWindow({
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

        title: 'Kaleidoscope',
        frame: false,
        show: false,
        
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            additionalArguments: [JSON.stringify(preferences), filePath]
        }
    })

    // mainWindow.webContents.openDevTools();
    
    mainWindow.setBackgroundColor('#111');
    mainWindow.loadFile('app/static/index.html');

    // Fix default windows app frame appearing first
    mainWindow.webContents.once("dom-ready", () => mainWindow.show());

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

    ipcMain.on('minimize-app', (event) => {
        BrowserWindow.getFocusedWindow().minimize();
    });

    ipcMain.on('maximize-app', (event) => {
        currentWindow = BrowserWindow.getFocusedWindow();
        if (currentWindow.isMaximized())
            currentWindow.restore()
        else
            currentWindow.maximize();
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
    createMainWindow(args);
    Menu.setApplicationMenu(createMenu(mainWindow));
    setIpcEvents();
}

app.whenReady().then(() => {
    main();
});