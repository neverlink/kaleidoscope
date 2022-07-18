const getFileURI = () => {
    args = process.argv
    fileURI = args[args.length - 2]
    return fileURI.startsWith("--fileURI=") ? fileURI.slice(10) : null
}

window.addEventListener('DOMContentLoaded', () => { // var fileType = fileArray[0].type.split('/')[0]
    fileURI = getFileURI()

    if (!fileURI) {
        console.log(`No starting URI provided!`)
        return
    }

    // implement creation of video element (perhaps a library)
})