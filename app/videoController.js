// const video = document.querySelector('video');

// // This is generic and works for audio elements
// Object.defineProperty(HTMLMediaElement.prototype, 'isPlaying', {
//     get: function () {
//         return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
//     }
// });

// const playPause = (video) => {
//     if (video.isPlaying) {
//         video.pause();
//     }
//     else {
//         video.play();
//     }
// }

// document.addEventListener('keydown', function (event) {
//     if (event.key === "Space") {
//         video.playPause();
//     }
// });

// export { VideoController }