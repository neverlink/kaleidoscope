const { Tray, Menu } = require('electron')
const path = require('path');

const createTray = (mainWindow = undefined) => {
    let tray = new Tray(path.join(__dirname, '/static/swag.png'));

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

module.exports = createTray