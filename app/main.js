const { app, ipcMain, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')

const createMainWindow = (fileURI) => {
    const mainWindow = new BrowserWindow({
        center: true,
        resizable: false,
        autoHideMenuBar: true,
        // titleBarStyle: 'hidden',
        icon: path.join(__dirname, 'swag.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
            additionalArguments: [fileURI]
        }
    })

    mainWindow.loadFile(path.join(__dirname, 'index.html'))
    mainWindow.webContents.openDevTools();

    mainWindow.on('close', function (event) {
        // prevent default
        mainWindow.hide();
    });

    ipcMain.on('resize-window', (event, width, height) => {
        mainWindow.setSize(width, height, true) // ask monyu to try this
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

    tray.setContextMenu(contextMenu)
    tray.setToolTip('Kaleidoscope')
    tray.setTitle('Kaleidoscope')

    tray.on('click', () => {
        console.log('not implemented')
        //mainWindow.show()
    })
    return tray
}

app.whenReady().then(() => {
    let fileURI = process.argv[2]
    let mainWindow = createMainWindow(fileURI)
    let tray = createTray()

    app.on('window-all-closed', () => {
        console.log('all windows closed')
        app.quit() // remove this later
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
    })
})