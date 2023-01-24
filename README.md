<h1 align="center">
  <img width="100px" height="100px" src="https://raw.githubusercontent.com/neverlink/kaleidoscope/main/app/static/icon.png"></img>
  <p>Kaleidoscope<p>
</h1>

An electron-based video player.

[![CodeFactor](https://www.codefactor.io/repository/github/neverlink/kaleidoscope/badge)](https://www.codefactor.io/repository/github/neverlink/kaleidoscope)

<details>
<summary style=>Screenshots</summary>
<img alt="Single Player" src="https://i.imgur.com/tzfDhl0.png" style="display: inline; width: 100%;"/>
<img alt="Splitscreen" src="https://i.imgur.com/h5hHqKD.png" style="display: inline; width: 100%"/>
</details>

### Features
- Splitscreen
- Seamless Looping
- Speed control
- Frame by frame viewing
- Pitch correction toggle

### Supported Formats
 * Video
     * Containers: mp4, mov, mkv, ogv, webm
     * Codecs: H.264, H.265, VP8, VP9, AV1, Theora
 * Audio (WIP)
     * Containers: mp3, ogg, wav, flac
     * Codecs: MP3, AAC, H.264, H.265, VP8, VP9, AV1, PCM, FLAC, Vorbis, Theora

### Controls

```
Space: Play/Pause
Backspace: Stop

Left/Right: Seek 3s
Shift + Left/Right Arrow: Seek 15s
Ctrl + Left/Right Arrow: Seek to Start/End
Number row: Seek to percentage (e.g 10%, 50%)

Comma: Previous Frame
Period: Next Frame

Up/Down: Change Volume
M: Toggle Mute

Ctrl + Up/Down: Change Rate
Ctrl + Slash: Toggle Pitch Correction

Ctrl + W: Close Focused Player (quits if none present)
Ctrl + Shift + T: Restore Last Player

F11: Toggle Fullscreen
Ctrl + Q: Quit
```
