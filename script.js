(function() {
  // --------------------- CONFIG -----------------------
  const paragraphs = [
    "🌙 شب‌های بی‌پایان... تو همچون مهتابی که در آسمان دلم می‌درخشی.",
    "✨ هر ستاره‌ی چشمک‌زن، یادآور نگاه توست. دلم برای صدایت تنگ شده.",
    "🕯️ شمع‌ها روشن‌اند و من در میان این نور، تو را می‌جویم. کاش بودی.",
    "🌹 گلبرگ‌های رز، رنگ رویای من است. عطرت در باد می‌پیچد و دلم لرزان."
  ];
  let paragraphIndex = 0;
  let charIndex = 0;
  let typingInterval = null;
  const typeDisplay = document.getElementById('typeDisplay');
  const cursor = document.getElementById('typeCursor');
  const envelope = document.getElementById('envelope3d');
  const letterContent = document.getElementById('letterContent');
  const closeBtn = document.getElementById('closeLetterBtn');

  // ----- Audio (short loop) ------
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let isMusicOn = false;
  let musicInterval = null;
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');

  // simple generative ambient (two oscillators)
  function playMusic() {
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
    // short tone sequence
    let noteIndex = 0;
    const notes = [523, 659, 784, 1047, 880, 784, 659];
    function playNote() {
      if (!isMusicOn) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = notes[noteIndex % notes.length];
        gain.gain.value = 0.06;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
        noteIndex++;
      } catch(e) {}
    }
    playNote();
    musicInterval = setInterval(playNote, 400);
  }

  function toggleMusic() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    isMusicOn = !isMusicOn;
    if (isMusicOn) {
      musicIcon.className = 'fas fa-volume-up';
      playMusic();
    } else {
      musicIcon.className = 'fas fa-music';
      if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
      }
    }
  }
  musicToggle.addEventListener('click', toggleMusic);

  // ----- Open envelope (click front) -----
  const front = document.getElementById('envelopeFront');
  front.addEventListener('click', function(e) {
    if (e.target.closest('.close-letter-btn')) return;
    if (envelope.classList.contains('open')) return;
    // open envelope
    envelope.classList.add('open');
    envelope.style.transform = 'rotateY(180deg) rotateX(0deg)';
    // start typing paragraphs
    startTyping();
    // play open sound (web audio)
    playOpenSound();
  });

  // ----- Close letter (button) -----
  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    // close envelope
    envelope.classList.remove('open');
    envelope.style.transform = 'rotateY(0deg) rotateX(2deg)';
    // reset typing
    stopTyping();
    typeDisplay.textContent = '';
    paragraphIndex = 0;
    charIndex = 0;
  });

  // ----- Typing effect (paragraph by paragraph) -----
  function startTyping() {
    if (typingInterval) clearInterval(typingInterval);
    paragraphIndex = 0;
    charIndex = 0;
    typeDisplay.textContent = '';
    typeNextParagraph();
  }

  function typeNextParagraph() {
    if (paragraphIndex >= paragraphs.length) {
      cursor.style.display = 'none';
      return;
    }
    const text = paragraphs[paragraphIndex];
    charIndex = 0;
    typeDisplay.textContent = '';
    typingInterval = setInterval(function() {
      if (charIndex < text.length) {
        typeDisplay.textContent += text.charAt(charIndex);
        charIndex++;
        const area = document.getElementById('typingArea');
        area.scrollTop = area.scrollHeight;
      } else {
        clearInterval(typingInterval);
        typingInterval = null;
        paragraphIndex++;
        setTimeout(() => {
          if (paragraphIndex < paragraphs.length) {
            typeDisplay.textContent += '\n\n';
            typeNextParagraph();
          } else {
            cursor.style.display = 'none';
          }
        }, 600);
      }
    }, 40);
  }

  function stopTyping() {
    if (typingInterval) {
      clearInterval(typingInterval);
      typingInterval = null;
    }
    cursor.style.display = 'inline-block';
  }

  // ----- Open sound (click + noise) -----
  function playOpenSound() {
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch(e) {}
  }

  // ----- Starfield canvas (twinkling) -----
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }
  function initStars() {
    stars = [];
    const count = 120;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.4 + 0.4,
        twinkleSpeed: 0.008 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }
  function drawStars(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fffbe6';
    for (let s of stars) {
      const brightness = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.phase);
      ctx.globalAlpha = brightness * 0.9;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStars);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawStars(0);

  // ----- Rose petals (random motion) -----
  const petalsContainer = document.getElementById('petalsContainer');
  for (let i = 0; i < 8; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.top = Math.random() * 100 + '%';
    petal.style.animationDelay = (Math.random() * 10) + 's';
    petal.style.animationDuration = (14 + Math.random() * 12) + 's';
    const size = 18 + Math.random() * 28;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.transform = `rotate(${Math.random()*360}deg) scale(${0.4+Math.random()*0.5})`;
    petalsContainer.appendChild(petal);
  }

  // ----- Light particles (floating) -----
  const particleContainer = document.getElementById('particlesContainer');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.animationDuration = (10 + Math.random() * 15) + 's';
    const s = 4 + Math.random() * 8;
    p.style.width = s + 'px';
    p.style.height = s + 'px';
    p.style.opacity = 0.2 + Math.random() * 0.4;
    particleContainer.appendChild(p);
  }

  console.log('✨ پاکت سه‌بعدی آماده است. کلیک کنید تا باز شود.');
})();
