document.addEventListener('DOMContentLoaded', () => {
  // Safari viewport fix
  function setVH() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }
  setVH();
  window.addEventListener('resize', setVH);

  // Loading screen
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');
  let p = 0;
  const interval = setInterval(() => {
    p += Math.random() * 15;
    if (p >= 100) {
      p = 100;
      clearInterval(interval);
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
    if (loaderProgress) loaderProgress.style.width = p + '%';
  }, 200);

  // ═══════════════════════════════════════
  // GUESTBOOK
  // ═══════════════════════════════════════

  const STORAGE_KEY = 'lilystdrake_guestbook';
  const now = Date.now();

  const SEED_MESSAGES = [
    { name: 'Sarah', message: 'Lily you are ICONIC. Saw you at pride last year and you literally changed my life. The way you command a stage is pure magic. ✨', time: now - 172800000 },
    { name: 'Marcus', message: 'First time seeing Lily perform and I was completely speechless. The energy, the looks, the presence. We are NOT worthy. 🔥', time: now - 345600000 },
    { name: 'Jess', message: 'Lily St. Drake is what happens when talent meets hard work meets pure star power. So excited to see what you do next! 💚', time: now - 518400000 },
    { name: 'Alex', message: 'booked lily for my birthday and it was the best decision i have ever made. everyone is still talking about it. you are a legend.', time: now - 604800000 },
    { name: 'Priya', message: 'just wanna say lily makes me feel so seen and represented. seeing a queen of color slay this hard gives me life. keep rising. 🌟', time: now - 864000000 },
    { name: 'Danny', message: 'the LSD experience is REAL. lily takes you on a journey every single time. never miss a show if you can help it. ⚡', time: now - 1209600000 },
    { name: 'Maya', message: 'Lily!! met you after the show and you were the sweetest most genuine person. a star on and off stage. rooting for you always!! 💚', time: now - 1814400000 },
    { name: 'Ryan', message: 'honestly lily is one of the hardest working performers i know. every look, every number, every detail is perfection. bow down.', time: now - 2419200000 },
    { name: 'Zoe', message: 'discovered lily on instagram and now im obsessed. the aesthetic, the music choices, the vision. this is what drag is all about. 🎭', time: now - 3024000000 },
    { name: 'Chris', message: 'from the first note to the final bow, lily commands every second of the stage. pure electrifying talent. cannot wait for what comes next.', time: now - 3888000000 },
  ];

  function formatTime(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return `${Math.floor(diff / 604800)}w ago`;
  }

  function getMessages() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  }

  function saveMessages(messages) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(0, 200)));
    } catch {}
  }

  function getDisplayMessages() {
    const userMessages = getMessages();
    const seedCount = Math.min(SEED_MESSAGES.length, Math.max(10, 10 - userMessages.length));
    const visibleSeeds = [...SEED_MESSAGES].slice(0, seedCount);
    const all = [...userMessages, ...visibleSeeds];
    all.sort((a, b) => b.time - a.time);
    return all;
  }

  function renderMessages() {
    const wall = document.getElementById('gbWall');
    const count = document.getElementById('gbCount');
    const messages = getDisplayMessages();
    count.textContent = `${messages.length} message${messages.length !== 1 ? 's' : ''}`;
    wall.innerHTML = messages.map(m => `
      <div class="gb-message">
        <div class="gb-msg-header">
          <span class="gb-msg-name">✦ ${m.name}</span>
          <span class="gb-msg-time">${formatTime(m.time)}</span>
        </div>
        <div class="gb-msg-text">${m.message}</div>
      </div>
    `).join('');
  }

  // Form submission
  const form = document.getElementById('guestbookForm');
  const nameInput = document.getElementById('gbName');
  const msgInput = document.getElementById('gbMessage');
  const submitBtn = document.getElementById('gbSubmitBtn');
  const formNote = document.getElementById('gbFormNote');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    if (!name || !message) return;

    const entry = { name, message, time: Date.now() };
    const messages = getMessages();
    messages.unshift(entry);
    saveMessages(messages);

    nameInput.value = '';
    msgInput.value = '';
    formNote.textContent = '💚 message sent!';

    renderMessages();

    setTimeout(() => { formNote.textContent = ''; }, 3000);
  });

  // Character count hint
  msgInput.addEventListener('input', () => {
    const remaining = 500 - msgInput.value.length;
    if (remaining < 50) {
      formNote.textContent = `${remaining} characters remaining`;
    } else {
      formNote.textContent = '';
    }
  });

  // Initial render
  renderMessages();
});
