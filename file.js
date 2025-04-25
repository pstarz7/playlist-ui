document.addEventListener('DOMContentLoaded', function() {
    // Sample playlist data
    const playlist = [

        {
            title: "Har Ek Pal",
            artist: "Ashu Shukla",
            duration: "3:32",
            cover: "Har Ek Pal",
            audio: "./audios/Har Ek Pal - Ashu Shukla  Pehchan Music  Latest Hindi Songs 2020.mp3"
        },
        {
            title: "Humdum",
            artist: "Aditya Rikhari",
            duration: "3:02",
            cover: "Jaana",
            audio: "./audios/Aditya Rikhari - Humdum  From the album Jaana.mp3"
        },
        {
            title: "O Yaara ",
            artist: "Abdul Hannan",
            duration: "4:36",
            cover: "O Yaara ",
            audio: "./audios/O Yaara - By Abdul Hannan and Kaavish (lyrical).mp3"
        },

        {
            title: "Chal Diye Tum Kahan",
            artist: "AUR",
            duration: "4:35",
            cover: "Kabhi Main Kabhi Tum",
            audio: "./audios/Chal Diye Tum Kahan.mp3"
        },
      
        {
            title: "Finding Her",
            artist: "Kushagra, Saaheal, Bharath",
            duration: "3:20",
            cover: " Finding Her",
            audio: "./audios/Finding Her - Kushagra 128 Kbps.mp3"
        },

        {
            title: "Kho Gaye",
            artist: "Taaruk",
            duration: "3:18",
            cover: "mismatched",
            audio: "./audios/Kho Gaye Lyrics From Mismatched Season 2 Song  Taaruk Raina.mp3"
        },
      
        {
            title: "Meherban",
            artist: "JANI,Jokhay",
            duration: "3:32",
            cover: "Meherbab",
            audio: "./audios/JANI - Meherban.mp3"
        },
        {
            title: "Paaro",
            artist: "Aditya Rilhari",
            duration: "2:32",
            cover: "Paaro",
            audio: "./audios/Paaro Lyrics  Aditya Rikhari.mp3"
        },
        {
            title: "Meri Baaton Mein",
            artist: "Anuv jain",
            duration: "2:47",
            cover: "meri baaton",
            audio: "./audios/Anuv Jain - Meri Baaton Mein Tu (Official Video).mp3"
        },
        {
            title: "Mazaak",
            artist: "Anuv jain",
            duration: "3:32",
            cover: "Mazaak",
            audio: "./audios/Mazaak- Anuv Jain (Lyrics Video).mp3"
        },
        {
            title: "Aakhari Salaam",
            artist: "The Local Train",
            duration: "4:37",
            cover: "Vaaqif",
            audio: "./audios/The Local Train - Aakhri Salaam (Official Audio).mp3"
        },
    ];

    // DOM Elements
    const audioPlayer = new Audio();
    const playPauseBtn = document.getElementById('play-pause');
    const playIcon = document.getElementById('play-icon');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const shuffleBtn = document.getElementById('shuffle');
    const repeatBtn = document.getElementById('repeat');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const progressBar = document.getElementById('progress-bar');
    const progressKnob = document.getElementById('progress-knob');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
    const volumeBar = document.getElementById('volume-bar');
    const volumeKnob = document.getElementById('volume-knob');
    const playlistContainer = document.getElementById('playlist');

    // App State
    let currentTrackIndex = 0;
    let isPlaying = false;
    let isShuffled = false;
    let isRepeated = false;
    let originalPlaylist = [...playlist];
    let shuffledPlaylist = [];

    // Initialize the app
    function init() {
        renderPlaylist();
        loadTrack(currentTrackIndex);
        
        // Set initial volume
        audioPlayer.volume = 0.75;
        updateVolumeBar();
    }

    // Render playlist
    function renderPlaylist() {
        playlistContainer.innerHTML = '';
        
        const tracksToRender = isShuffled ? shuffledPlaylist : playlist;
        
        tracksToRender.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = `flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-700 ${index === currentTrackIndex ? 'bg-gray-700' : ''}`;
            trackElement.innerHTML = `
                <div class="flex items-center">
                    <div class="w-10 h-10 rounded-md bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center mr-3">
                        <i class="fas fa-music text-white opacity-30"></i>
                    </div>
                    <div>
                        <h3 class="font-medium">${track.title}</h3>
                        <p class="text-sm text-gray-400">${track.artist}</p>
                    </div>
                </div>
                <span class="text-gray-400 text-sm">${track.duration}</span>
            `;
            
            trackElement.addEventListener('click', () => {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                playTrack();
                highlightCurrentTrack();
            });
            
            playlistContainer.appendChild(trackElement);
        });
    }

    // Load track
    function loadTrack(index) {
        const track = isShuffled ? shuffledPlaylist[index] : playlist[index];
        audioPlayer.src = track.audio;
        songTitle.textContent = track.title;
        songArtist.textContent = track.artist;
        
        // Reset progress bar
        progressBar.style.width = '0%';
        currentTimeDisplay.textContent = '0:00';
        
        // Update duration when metadata is loaded
        audioPlayer.addEventListener('loadedmetadata', () => {
            durationDisplay.textContent = formatTime(audioPlayer.duration);
        });
        
        highlightCurrentTrack();
    }

    // Play track
    function playTrack() {
        audioPlayer.play();
        isPlaying = true;
        playIcon.classList.replace('fa-play', 'fa-pause');
        playPauseBtn.classList.add('playing');
    }

    // Pause track
    function pauseTrack() {
        audioPlayer.pause();
        isPlaying = false;
        playIcon.classList.replace('fa-pause', 'fa-play');
        playPauseBtn.classList.remove('playing');
    }

    // Highlight current track in playlist
    function highlightCurrentTrack() {
        const tracks = playlistContainer.querySelectorAll('div');
        tracks.forEach((track, index) => {
            if (index === currentTrackIndex) {
                track.classList.add('bg-gray-700');
            } else {
                track.classList.remove('bg-gray-700');
            }
        });
    }

    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Update progress bar
    function updateProgressBar() {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        const progressPercent = (currentTime / duration) * 100;
        
        progressBar.style.width = `${progressPercent}%`;
        currentTimeDisplay.textContent = formatTime(currentTime);
    }

    // Update volume bar
    function updateVolumeBar() {
        const volumePercent = audioPlayer.volume * 100;
        volumeBar.style.width = `${volumePercent}%`;
    }

    // Shuffle playlist
    function shufflePlaylist() {
        shuffledPlaylist = [...playlist];
        for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
        }
        
        // Find the current track in the shuffled playlist
        if (isPlaying) {
            const currentTrack = playlist[currentTrackIndex];
            currentTrackIndex = shuffledPlaylist.findIndex(track => 
                track.title === currentTrack.title && track.artist === currentTrack.artist
            );
        }
        
        renderPlaylist();
    }

    // Event Listeners
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    });

    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) {
            playTrack();
        }
    });

    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) {
            playTrack();
        }
    });

    shuffleBtn.addEventListener('click', () => {
        isShuffled = !isShuffled;
        shuffleBtn.classList.toggle('text-purple-500', isShuffled);
        shuffleBtn.classList.toggle('text-gray-400', !isShuffled);
        
        if (isShuffled) {
            shufflePlaylist();
        } else {
            // Find the current track in the original playlist
            const currentTrack = shuffledPlaylist[currentTrackIndex];
            currentTrackIndex = playlist.findIndex(track => 
                track.title === currentTrack.title && track.artist === currentTrack.artist
            );
            renderPlaylist();
        }
    });

    repeatBtn.addEventListener('click', () => {
        isRepeated = !isRepeated;
        repeatBtn.classList.toggle('text-purple-500', isRepeated);
        repeatBtn.classList.toggle('text-gray-400', !isRepeated);
    });

    // Progress bar click
    progressBar.parentElement.addEventListener('click', (e) => {
        const progressBarWidth = progressBar.parentElement.clientWidth;
        const clickPosition = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickPosition / progressBarWidth) * duration;
    });

    // Volume bar click
    volumeBar.parentElement.addEventListener('click', (e) => {
        const volumeBarWidth = volumeBar.parentElement.clientWidth;
        const clickPosition = e.offsetX;
        audioPlayer.volume = clickPosition / volumeBarWidth;
        updateVolumeBar();
    });

    // Time update
    audioPlayer.addEventListener('timeupdate', updateProgressBar);

    // Song ended
    audioPlayer.addEventListener('ended', () => {
        if (isRepeated) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            nextBtn.click();
        }
    });

    // Drag progress knob
    progressKnob.addEventListener('mousedown', (e) => {
        e.preventDefault();
        
        const progressBarElement = progressBar.parentElement;
        const progressBarWidth = progressBarElement.clientWidth;
        
        function moveKnob(e) {
            let newWidth = (e.clientX - progressBarElement.getBoundingClientRect().left) / progressBarWidth;
            newWidth = Math.max(0, Math.min(1, newWidth));
            progressBar.style.width = `${newWidth * 100}%`;
            audioPlayer.currentTime = newWidth * audioPlayer.duration;
        }
        
        function stopDrag() {
            document.removeEventListener('mousemove', moveKnob);
            document.removeEventListener('mouseup', stopDrag);
        }
        
        document.addEventListener('mousemove', moveKnob);
        document.addEventListener('mouseup', stopDrag);
    });

    // Drag volume knob
    volumeKnob.addEventListener('mousedown', (e) => {
        e.preventDefault();
        
        const volumeBarElement = volumeBar.parentElement;
        const volumeBarWidth = volumeBarElement.clientWidth;
        
        function moveKnob(e) {
            let newWidth = (e.clientX - volumeBarElement.getBoundingClientRect().left) / volumeBarWidth;
            newWidth = Math.max(0, Math.min(1, newWidth));
            volumeBar.style.width = `${newWidth * 100}%`;
            audioPlayer.volume = newWidth;
        }
        
        function stopDrag() {
            document.removeEventListener('mousemove', moveKnob);
            document.removeEventListener('mouseup', stopDrag);
        }
        
        document.addEventListener('mousemove', moveKnob);
        document.addEventListener('mouseup', stopDrag);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            playPauseBtn.click();
        } else if (e.code === 'ArrowLeft') {
            audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 5);
        } else if (e.code === 'ArrowRight') {
            audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 5);
        } else if (e.code === 'ArrowUp') {
            audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.1);
            updateVolumeBar();
        } else if (e.code === 'ArrowDown') {
            audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.1);
            updateVolumeBar();
        }
    });

    // Initialize the app
    init();
});