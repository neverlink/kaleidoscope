// const playerHandler = require('./playerHandler')

const getFileURI = () => {
    args = process.argv;
    fileURI = args[args.length - 2];
    return fileURI.startsWith("--file=") ? fileURI.slice(7) : null;
}

window.addEventListener('DOMContentLoaded', () => {
    fileURI = getFileURI();

    if (!fileURI) {
        console.log(`No starting URI provided!`);
        return
    }
    // this does not work currently
    // playerHandler.createPlayer(new File([''], fileURI));
});