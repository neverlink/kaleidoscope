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
        // Window size in reality is 1px larger
        // Likely a Windows issue
        width: preferences['initialWidth'] - 1,
        height: preferences['initialHeight'] - 1,

        center: preferences['centerWindowOnLaunch'],
        autoHideMenuBar: preferences['hideMenuBar'],
        alwaysOnTop: preferences['alwaysOnTop'],

        icon: path.join(__dirname, 'static/icon.png'),
        title: 'Kaleidoscope',
        
        frame: process.platform !== 'win32', // Hide default title bar only on Windows
        show: false, // Prevent old Windows app frame from showing first
        
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

    // The window.setSize method moves the window by 1px and adds 1-2px to the provided dimensions
    // due to the underlying setContentSize() call which without x/y coordinates shifts the window by 1px.
    // The 1-2px variable resizing issue remains, which could break the old-new window size comparison.
    ipcMain.on('resize-window', (event, newWidth, newHeight) => {
        // try with the other methods to see if the window moves
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