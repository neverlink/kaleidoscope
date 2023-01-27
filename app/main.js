const { app, globalShortcut, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const constructArgs = () => {
    let preferences = JSON.parse(fs.readFileSync(path.join(__dirname, 'static/preferences.json')));
    filePath = process.argv.length == 2 ? process.argv.at(-1) : null;
    return [preferences, filePath]
}

const createMainWindow = (args) => {
    preferences = args[0];
    filePath = args[1];

    mainWindow = new BrowserWindow({
        width: preferences['initialWidth'],
        height: preferences['initialHeight'],

        center: preferences['centerWindowOnLaunch'],
        autoHideMenuBar: preferences['hideMenuBar'],
        alwaysOnTop: preferences['alwaysOnTop'],

        icon: path.join(__dirname, 'static/icon.png'),
        title: 'Kaleidoscope',
        
        // Hide default title bar only on Windows
        frame: process.platform !== 'win32',

        // Prevent default windows app frame from appearing first
        show: false,
        
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            additionalArguments: [JSON.stringify(preferences), filePath]
        }
    })

    mainWindow.setBackgroundColor('#111');
    mainWindow.loadFile('app/static/index.html');

    // Prevent default Windows app frame from appearing first
    mainWindow.webContents.once('dom-ready', () => mainWindow.show());

    return mainWindow
}

const setIpcEvents = () => {
    const appLocked = app.requestSingleInstanceLock();

    if (!appLocked) {
        app.quit();
    } else {
        app.on('second-instance', (event, args) => {
            src = [args.at(-1)];
            mainWindow.webContents.send('create-players', src);
            mainWindow.isMinimized() ? mainWindow.restore() : mainWindow.focus();
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
        currentWindow.isMaximized() ? currentWindow.restore() : currentWindow.maximize();
    });

    ipcMain.on('quit-app', (event) => app.quit());

    app.on('activate', () => {
        BrowserWindow.getAllWindows().length ? createMainWindow() : null;
    });
}

const main = () => {
    const args = constructArgs();
    mainWindow = createMainWindow(args);
    mainWindow.setMenu(null);
    globalShortcut.register('CommandOrControl+Shift+I', () => {
        mainWindow.isFocused() ? mainWindow.webContents.toggleDevTools() : null;
    });
    setIpcEvents();
}

app.whenReady().then(() => main());