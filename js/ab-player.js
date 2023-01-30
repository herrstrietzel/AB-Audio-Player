/**
* allow multiple player instances:
* buttons are selected via class names
* so update the html template (see index.html)
*/

// init all player instances
let players = document.querySelectorAll(".player__wrapper");
initPlayers(players);


function initPlayers(players) {

  players.forEach(player => {
    //Get button elements
    const playBtns = player.querySelectorAll(".ab__button");
    const aButton = player.querySelector(".a__button");
    const bButton = player.querySelector(".b__button");
    const playButton = player.querySelector(".play__button");
    const stopButton = player.querySelector(".stop__button");
    const progressBar = player.querySelector(".progress__bar");
    const progressFill = player.querySelector(".progress__fill");

    // set icons
    const playIcon = '<i class="fa-solid fa-play"></i>';
    const pauseIcon = '<i class="fa-solid fa-pause"></i>';
    const stopIcon = '<i class="fa-solid fa-stop"></i>';


    //Default loading state for each sound
    var soundAReady = false;
    var soundBReady = false;


    //Set up audio elements
    var soundA = document.createElement("audio");
    soundA.src = player.getAttribute('data-sound-a');
    soundA.preload = "auto";
    soundA.setAttribute("hidden", "true");
    player.append(soundA);


    var soundB = document.createElement("audio");
    soundB.src = player.getAttribute('data-sound-b');
    soundB.preload = "auto";
    soundB.setAttribute("hidden", "true");
    player.append(soundB);


    //playSoundA
    aButton.addEventListener('click', e => {
      playButton.innerHTML = pauseIcon;
      aButton.disabled = true;
      bButton.disabled = false;
      stopButton.disabled = false;
      if (soundB.currentTime > 0) {
        soundA.currentTime = soundB.currentTime;
        soundA.play();
        soundB.pause();
      } else {
        soundA.play();
        soundB.pause();
      }
    })

    //playSoundB
    bButton.addEventListener('click', e => {
      playButton.innerHTML = pauseIcon;
      bButton.disabled = true;
      aButton.disabled = false;
      stopButton.disabled = false;
      if (soundA.currentTime > 0) {
        soundB.currentTime = soundA.currentTime;
        soundB.play();
        soundA.pause();
      } else {
        soundB.play();
      }
    })

    //playSoundA
    soundA.addEventListener('playing', e => {
      console.log('playing');
      progressFill.style.width =
        ((soundA.currentTime / soundA.duration) * 100 || 0) + "%";
      requestAnimationFrame(stepA);
    })

    //playSoundB
    soundB.addEventListener('playing', e => {
      console.log('playing B');
      progressFill.style.width =
        ((soundB.currentTime / soundB.duration) * 100 || 0) + "%";
      requestAnimationFrame(stepA);
    })


    // playPause
    playButton.addEventListener('click', e => {
      if (soundA.paused & soundB.paused) {
        let soundATime = soundA.currentTime;
        let soundBTime = soundB.currentTime;
        if (soundATime >= soundBTime) {
          soundA.play();
          bButton.disabled = false;
          aButton.disabled = true;
          playButton.innerHTML = pauseIcon;
        } else {
          soundB.play();
          bButton.disabled = true;
          aButton.disabled = false;
          playButton.innerHTML = pauseIcon;
        }
        stopButton.disabled = false;
      } else {
        playButton.innerHTML = playIcon;
        soundA.pause();
        soundB.pause();
      }
    });


    // stop
    stopButton.addEventListener('click', e => {
      playButton.innerHTML = playIcon;
      aButton.disabled = false;
      bButton.disabled = true;
      playButton.disabled = false;
      stopButton.disabled = true;
      soundA.pause();
      soundA.currentTime = 0;
      soundB.pause();
      soundB.currentTime = 0;
    });



    //Check for mobile to enable audio playback without waiting for download status.
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      playButton.disabled = false;
    }

    //Default loading state for each sound
    var soundAReady = false;
    var soundBReady = false;

    //When audio can play through (loaded), run the function to enable buttons
    //The canplaythrough event will fire every time the audio switches, so the !soundA/BReady
    //prevents additional checks
    soundA.oncanplaythrough = function () {
      if (!soundAReady) {
        soundAReady = true;
        audioIsReady();
      }
    };
    soundB.oncanplaythrough = function () {
      if (!soundBReady) {
        soundBReady = true;
        audioIsReady();
      }
    };

    // Check if both A & B are ready and enable the correct buttons
    function audioIsReady() {
      if (soundAReady && soundBReady) {
        console.log("...audio loaded!");
        aButton.disabled = false;
        playButton.disabled = false;
      } else {
        console.log("Audio loading...");
      }
    }

    const progress = player.querySelector(".progress");
    // Listen for click on entire progress bar div (to allow skipping ahead)
    progress.addEventListener("click", function (event) {
      // Get X coordinate of click in div
      var rect = this.getBoundingClientRect();
      // Convert click position to percentage value
      var percentage = (event.clientX - rect.left) / this.offsetWidth;
      // Seek to the percentage converted to seconds
      soundA.currentTime = percentage * soundA.duration;
      soundB.currentTime = percentage * soundB.duration;
    });

    //Frame animations for progress bar fill - converts to CSS percentage
    function stepA() {
      progressFill.style.width =
        ((soundA.currentTime / soundA.duration) * 100 || 0) + "%";
      requestAnimationFrame(stepA);
    }
    function stepB() {
      progressFill.style.width =
        ((soundB.currentTime / soundB.duration) * 100 || 0) + "%";
      requestAnimationFrame(stepB);
    }

    //Play/Stop correct audio and toggle A/B, Play/Pause, and Stop buttons
    function playPause() {
      if (soundA.paused & soundB.paused) {
        let soundATime = soundA.currentTime;
        let soundBTime = soundB.currentTime;
        if (soundATime >= soundBTime) {
          soundA.play();
          bButton.disabled = false;
          aButton.disabled = true;
          playButton.innerHTML = pauseIcon;
        } else {
          soundB.play();
          bButton.disabled = true;
          aButton.disabled = false;
          playButton.innerHTML = pauseIcon;
        }
        stopButton.disabled = false;
      } else {
        playButton.innerHTML = playIcon;
        soundA.pause();
        soundB.pause();
      }
    };


    // set auto ids
    let allAudio = document.querySelectorAll('audio');
    allAudio.forEach((audio, i) => {
      audio.id = 'audio_' + i
    });

  });

}
