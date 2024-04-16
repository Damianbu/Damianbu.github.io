const video = document.querySelector("#video-main");
// Video sources
const videoSources = {
    desktop: "assets/video/HS_Film.mp4",
    mobile: "assets/video/Video_Hochformat.mp4",
};
// Video Posters (optional)    
// const videoPosters = {
//     desktop: "assets/img/studiom_poster.webp",
//     mobile: "assets/img/studiom_poster_sq.webp",   
// };

/* --- Video loading (+ posters) depending on device width --- */
if (window.matchMedia("(min-width: 576px)").matches) {
    if (typeof videoPosters !== "undefined" && videoPosters.desktop) {
        video.setAttribute("poster", videoPosters.desktop);
    }
    if (videoSources.desktop) {
        video.setAttribute("src", videoSources.desktop);
    }
} else {
    if (typeof videoPosters !== "undefined" && videoPosters.mobile) {
        video.setAttribute("poster", videoPosters.mobile);
    }
    if (videoSources.mobile) {
        video.setAttribute("src", videoSources.mobile);
    } 
}

// setup audio related stuff
const audioContext = new AudioContext();
audioContext.suspend();
const bgSound = document.querySelector("#bg-sound");
// initial volumes for bg audio and video sound
bgSound.volume = 1;
video.volume = 0.5;
const track_1 = audioContext.createMediaElementSource(bgSound);
const track_2 = audioContext.createMediaElementSource(video);
track_1.connect(audioContext.destination);
track_2.connect(audioContext.destination);
const gainNode_1 = audioContext.createGain();
const gainNode_2 = audioContext.createGain();
gainNode_1.gain.value = -1.00;
gainNode_2.gain.value = -1.00;
track_1.connect(gainNode_1).connect(audioContext.destination);
track_2.connect(gainNode_2).connect(audioContext.destination);

// setup mute/unmute button
const muteBtn = document.querySelector("#mute-btn");

muteBtn.addEventListener("click", () => {
    // unmute bg audio and video if muted (initially!)
    if (bgSound.muted) bgSound.muted = false;
    if (video.muted) video.muted = false;
    // toggle suspended state as a way to mute/unmute audio
    if (audioContext.state === "suspended") {
        audioContext.resume();
    } else {
        audioContext.suspend();
        // as a good practice, pause audio stream when not audible
        bgSound.paused = true;
    } 
});

function playBGAudio() {
    if (audioContext.state === "suspended") return;
    // if video playback is not paused, mute video
    if (!video.paused) {
        gainNode_2.gain.setTargetAtTime(-1.00, audioContext.currentTime, 0.5);
    }
    if (bgSound.paused) bgSound.play();
    gainNode_1.gain.setTargetAtTime(1.00, audioContext.currentTime, 1.0);
  }

function stopBGAudio() {
    if (audioContext.state === "suspended") return;
    gainNode_1.gain.setTargetAtTime(-1.00, audioContext.currentTime, 0.5);
    // if video playback is still going on, increase volume again
    if (!video.paused) {
        gainNode_2.gain.setTargetAtTime(1.00, audioContext.currentTime, 1.0);
    } 
}

/* --- video helper function --- */
video.addEventListener("play", () => {
    gainNode_2.gain.setTargetAtTime(1.00, audioContext.currentTime, 1.0);
    // stop bg audio sound when video is playing
    if (!bgSound.paused) stopBGAudio();
});

/* --- Lottie related --- */
bodymovin.loadAnimation({
  container: document.getElementById('lottie'), // Required
  path: 'assets/lottie/lottie_anim.json', // Required
  renderer: 'svg', // Required
  loop: false, // Optional
  autoplay: false, // Optional
  name: "Clock animation", // Name for future reference. Optional.
})