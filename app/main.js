const { app, screen, BrowserWindow, Menu, ipcMain } = require('electron');
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

    mainWindow.loadFile('app/static/index.html');
    mainWindow.setBackgroundColor('#111') 
    mainWindow.webContents.openDevTools();

    mainWindow.on('close', function (event) {
        app.quit();
    });

    ipcMain.on('quit', (event) => {
        app.quit();
    })
    
    ipcMain.on('resize-window', (event, newWidth, newHeight) => {
        console.log(mainWindow.webContents.getOwnerBrowserWindow().getBounds());

        let display = screen.getPrimaryDisplay();
        let screenX = parseInt(display['size']['width'] * display['scaleFactor']);
        let screenY = parseInt(display['size']['height'] * display['scaleFactor']);

        let windowSize = mainWindow.getSize()
        windowX = windowSize[0];
        windowY = windowSize[1];

        // logic to change splitscreen direction

        mainWindow.setSize(newWidth, newHeight);
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