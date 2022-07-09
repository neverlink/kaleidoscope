const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1280,
      height: 720
    })
  
    win.loadFile('index.html')
  }

var menu = Menu.buildFromTemplate([
    {
        label: 'Menu1',
        submenu: [
            {label: 'label1'},
            {label: 'label2'},
            {type: 'separator'},
            {
                label: 'Quit',
                click() {
                    app.quit()
                }
            },
        ]
    },
    {
        label: 'info'
    }
])

Menu.setApplicationMenu(menu)

app.whenReady().then(() => {
    createWindow()
})