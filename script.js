/* =========================================================
   13 RAJAB — JASHN-E-HAIDER | JAVASCRIPT ENGINE
   Dedicated to Syed Behroz Shah Shamsi Sarkar
   ========================================================= */

const CONFIG = {
  totalSlides: 6,
  slideDuration: 12000, // Approximate time per slide if speech length varies
  nasihats: [
    { theme: "محبت و اخلاص", text: "دلوں کو جوڑنا اور مخلوقِ خدا سے بے لوث محبت کرنا ہی اصل روحانیت ہے۔" },
    { theme: "صبر و استقامت", text: "مشکلات میں صبر کا دامن تھامنا اور اچھے وقت کی امید رکھنا مومن کی شان ہے۔" },
    { theme: "حسنِ اخلاق", text: "اپنے اخلاق کی خوشبو سے محفلوں کو معطر کرنا اور ہر ایک کے ساتھ بھلائی کرنا سکھایا گیا۔" },
    { theme: "انسانیت اور آسانی", text: "دوسروں کے لیے آسانی پیدا کرنا اور دکھی دلوں کو سکون دینا سب سے بڑی عبادت ہے۔" },
    { theme: "نیک نیتی اور شکر", text: "ہر حال میں مالک کا شکر ادا کرنا اور نیت کو خالص رکھنا زندگی کو نور سے بھر دیتا ہے۔" },
    { theme: "روحانی سکون", text: "ذکرِ مولا اور محبتِ اہل بیتؑ سے دلوں کو جو اطمینان ملتا ہے، وہی اصل دولت ہے۔" }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const coverScreen = document.getElementById('coverScreen');
  const experienceScreen = document.getElementById('experienceScreen');
  const finaleScreen = document.getElementById('finaleScreen');
  const openGiftBtn = document.getElementById('openGiftBtn');
  const speechAudio = document.getElementById('speechAudio');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioBtnLabel = document.getElementById('audioBtnLabel');
  const eqBars = document.getElementById('eqBars');
  const audioRetryBanner = document.getElementById('audioRetryBanner');
  const retryAudioBtn = document.getElementById('retryAudioBtn');

  const slidePhoto = document.getElementById('slidePhoto');
  const nasihatTheme = document.getElementById('nasihatTheme');
  const nasihatText = document.getElementById('nasihatText');
  const slideCounter = document.getElementById('slideCounter');
  const speechProgressFill = document.getElementById('speechProgressFill');
  const sceneTitleText = document.getElementById('sceneTitleText');

  const replayBtn = document.getElementById('replayBtn');
  const shareBtn = document.getElementById('shareBtn');
  const shareFeedback = document.getElementById('shareFeedback');

  let currentSlide = 1;
  let slideshowTimer = null;
  let isPlaying = false;
  let audioTriedRootFallback = false;

  // Fallback for Missing Images: tries root path if assets/ fails before showing fallback
  window.handleMissingImage = function(imgElement, isCover) {
    const currentSrc = imgElement.getAttribute('src') || '';
    if (currentSrc.startsWith('assets/') && !imgElement.dataset.triedRoot) {
      imgElement.dataset.triedRoot = 'true';
      imgElement.src = currentSrc.replace(/^assets\//, '');
      return;
    }

    console.warn("Asset missing, rendering sacred calligraphic fallback:", currentSrc);
    imgElement.style.display = 'none';
    const parent = imgElement.parentElement;
    if (!parent.querySelector('.svg-fallback')) {
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'svg-fallback';
      fallbackDiv.style.cssText = "width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#031f16,#020d0a);color:#f7e29c;text-align:center;padding:15px;";
      fallbackDiv.innerHTML = `
        <span style="font-size:24px;margin-bottom:6px;">✦ ؑ ✦</span>
        <span style="font-size:13px;font-weight:700;">سید بہروز شاہ شمسی سرکار</span>
        <span style="font-size:10px;color:#d1c7b7;margin-top:4px;">${isCover ? 'جشنِ حیدرؑ' : '۱۳ رجب — جشنِ حیدرؑ'}</span>
      `;
      parent.appendChild(fallbackDiv);
    }
  };

  // Ensure inner-photo.jpg is set on load
  if (slidePhoto) {
    slidePhoto.src = 'assets/inner-photo.jpg';
  }

  // If assets/speech.mp3 errors, try root speech.mp3 once
  if (speechAudio) {
    speechAudio.addEventListener('error', () => {
      if (!audioTriedRootFallback) {
        audioTriedRootFallback = true;
        speechAudio.src = 'speech.mp3';
        speechAudio.load();
      }
    }, true);
  }

  // Canvas Noor Particles Animation
  function initNoorCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    window.addEventListener('resize', () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const particles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.5,
        color: Math.random() > 0.4 ? '#f7e29c' : '#10b981',
        speedY: -(Math.random() * 0.4 + 0.2),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.7 + 0.2
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) { p.y = height; p.x = Math.random() * width; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  initNoorCanvas('coverNoorCanvas');
  initNoorCanvas('livingNoorCanvas');
  initNoorCanvas('finaleNoorCanvas');

  function playSpeechAudio() {
    if (!speechAudio) return Promise.resolve();
    if (!speechAudio.currentSrc && !speechAudio.src) {
      speechAudio.src = 'assets/speech.mp3';
      speechAudio.load();
    } else if (speechAudio.readyState === 0) {
      speechAudio.load();
    }

    return speechAudio.play().then(() => {
      isPlaying = true;
      audioRetryBanner.classList.add('hidden');
      audioBtnLabel.textContent = 'جاری ہے';
      eqBars.style.opacity = '1';
    }).catch(err => {
      console.warn("Audio playback issue:", err);
      audioRetryBanner.classList.remove('hidden');
      isPlaying = false;
      audioBtnLabel.textContent = 'رکا ہوا ہے';
    });
  }

  // One-Tap Opening Event on Play Portrait / Button
  openGiftBtn.addEventListener('click', () => {
    startExperience();
  });

  retryAudioBtn.addEventListener('click', () => {
    playSpeechAudio();
  });

  function startExperience() {
    if (slideshowTimer) clearInterval(slideshowTimer);
    currentSlide = 1;
    coverScreen.classList.remove('active');
    experienceScreen.classList.add('active');

    // Start speech immediately on user tap
    playSpeechAudio();

    startSlideshowSequence();
  }

  function startSlideshowSequence() {
    updateSlideData(currentSlide);

    // Audio progress sync
    speechAudio.ontimeupdate = () => {
      if (speechAudio.duration) {
        const percent = (speechAudio.currentTime / speechAudio.duration) * 100;
        speechProgressFill.style.width = percent + '%';
      }
    };

    speechAudio.onended = () => {
      triggerFinale();
    };

    // Cycle nasihats and worlds while keeping inner-photo.jpg displayed
    slideshowTimer = setInterval(() => {
      currentSlide++;
      if (currentSlide > CONFIG.totalSlides) {
        clearInterval(slideshowTimer);
        triggerFinale();
      } else {
        updateSlideData(currentSlide);
      }
    }, CONFIG.slideDuration);
  }

  function updateSlideData(slideNum) {
    // Keep inner-photo.jpg displayed across inner slides
    if (slidePhoto && !slidePhoto.dataset.triedRoot && !slidePhoto.getAttribute('src').includes('inner-photo.jpg')) {
      slidePhoto.src = 'assets/inner-photo.jpg';
    }

    // Update Nasihat
    const nasihat = CONFIG.nasihats[(slideNum - 1) % CONFIG.nasihats.length];
    nasihatTheme.textContent = nasihat.theme;
    nasihatText.textContent = nasihat.text;
    slideCounter.textContent = `${slideNum} / ${CONFIG.totalSlides}`;

    // Switch Worlds & Scene Titles based on Slide
    updateActiveWorld(slideNum);
  }

  function updateActiveWorld(slideNum) {
    document.querySelectorAll('.noor-world').forEach(w => w.classList.remove('active'));

    let worldId, titleText;
    if (slideNum <= 1) {
      worldId = 'world-1';
      titleText = 'بابِ نور و تجلیات';
    } else if (slideNum <= 3) {
      worldId = 'world-2';
      titleText = 'صبحِ زرّیں و بہارِ عقیدت';
    } else if (slideNum <= 5) {
      worldId = 'world-3';
      titleText = 'دریائے نور و کہکشاں';
    } else {
      worldId = 'world-4';
      titleText = 'گلشنِ حیدرؑ و چراغاں';
    }

    document.getElementById(worldId).classList.add('active');
    sceneTitleText.textContent = titleText;
  }

  // Audio Play/Pause Toggle in Topbar
  audioToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      speechAudio.pause();
      isPlaying = false;
      audioBtnLabel.textContent = 'رکا ہوا ہے';
      eqBars.style.opacity = '0.3';
    } else {
      playSpeechAudio();
    }
  });

  function triggerFinale() {
    if (slideshowTimer) clearInterval(slideshowTimer);
    experienceScreen.classList.remove('active');
    finaleScreen.classList.add('active');
    speechAudio.pause();
  }

  // Replay Button
  replayBtn.addEventListener('click', () => {
    if (slideshowTimer) clearInterval(slideshowTimer);
    currentSlide = 1;
    speechAudio.currentTime = 0;
    finaleScreen.classList.remove('active');
    experienceScreen.classList.add('active');
    playSpeechAudio();
    startSlideshowSequence();
  });

  // Native Share Button with Fallback
  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: '۱۳ رجب — جشنِ حیدرؑ',
      text: 'ولادتِ باسعادت حضرت امام علی علیہ السلام کے پرمسرت موقع پر سید بہروز شاہ شمسی سرکار کی جانب سے ایک نورانی روحانی تحفہ:',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        shareFeedback.textContent = 'تحفہ کامیابی سے شیئر ہو گیا!';
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        shareFeedback.textContent = 'لنک کاپی ہو گیا! اب آپ اسے واٹس ایپ پر شیئر کر سکتے ہیں۔';
        setTimeout(() => { shareFeedback.textContent = ''; }, 4000);
      });
    }
  });
});
