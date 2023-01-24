const initialize = () => {
    const { toggleSidebar } = require('./playerUI.js')
    const { destroyPlayer, destroyPlayers, restorePlayer } = require('./playerHandler.js');
    const { commandPlayers, getFocusedPlayer, toggleAspectRatio, toggleFullscreen } = require('./playerUtils.js');

    // Actions called once per keypress
    document.addEventListener('keyup', (e) => {
        switch (true) {
            // Sidebar
            case e.key == '`': toggleSidebar(); break;

            // Quit
            case e.ctrlKey && e.key == 'q':  window.activePLayers = []; destroyPlayer(); break;

            // Open file
            case e.ctrlKey && e.key == 'o': fileSelector.click(); break;
            
            // Player lifecycle
            case e.ctrlKey && e.key == 'w': destroyPlayer(getFocusedPlayer()); break;
            case e.ctrlKey && e.shiftKey && e.key == 'T': restorePlayer(); break;
        
            // Utility
            case e.key == 'F1': alert('Kaleidoscope'); break;
            case e.key == 'F10': toggleAspectRatio(); break;
            case e.key == 'F11': toggleFullscreen(); break;
            case e.key == 'F12': break; // Export frame?

            default: break;
        }
    });

    // Actions repeatedly called while key is held
    document.addEventListener('keydown', (e) => {
        console.log('Ctrl:', e.ctrlKey, 'Shift:', e.shiftKey, e.key);
        switch (true) {
            // Seeking
            case e.ctrlKey && e.key == 'ArrowLeft' || e.key == 'Home': commandPlayers('seek', 0); break;
            case e.ctrlKey && e.key == 'ArrowRight' || e.key == 'End': commandPlayers('seek', -1); break;
            case e.shiftKey && e.key == 'ArrowLeft': commandPlayers('seek', -15); break;
            case e.shiftKey && e.key == 'ArrowRight': commandPlayers('seek', +15); break;
            case e.key == 'ArrowLeft': commandPlayers('seek', -5); break;
            case e.key == 'ArrowRight': commandPlayers('seek', +5); break;
            case e.key >= '0' && e.key <= '9': commandPlayers('seekToPercentage', e.key * 10); break;
            
            // Rate Control
            case e.ctrlKey && e.key == 'ArrowUp': commandPlayers('adjustRate', +1); break;
            case e.ctrlKey && e.key == 'ArrowDown': commandPlayers('adjustRate', -1); break;
            case e.ctrlKey && e.key == '/': commandPlayers('togglePitchCorrection'); break;
            
            // Frame Stepping
            case e.key == ',': commandPlayers('stepFrames', -1); break;
            case e.key == '.': commandPlayers('stepFrames', +1); break;

            // Playback
            case e.key == ' ': commandPlayers('togglePause'); break;
            case e.key == 'Backspace': commandPlayers('stop'); break;

            // Volume
            case e.key == 'm': commandPlayers('toggleMute'); break;
            case e.key == 'ArrowUp': commandPlayers('adjustVolume', +5); break;
            case e.key == 'ArrowDown': commandPlayers('adjustVolume', -5); break;

            default: break;
        }
    });
};

module.exports = { initialize }