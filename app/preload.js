const getFileURI = () => {
    args = process.argv;
    console.log(`Preload args: ${args}`)

    fileURI = args[args.length - 2];
    return fileURI;
}

window.addEventListener('DOMContentLoaded', () => {
    //
})

exports.argFileURI = getFileURI();