// import { createPlayer } from './playerHandler.js';

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
    // createPlayer(new File(fileURI));
});