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
  // GUESTBOOK — Supabase
  // ═══════════════════════════════════════

  const SUPABASE_URL = 'https://rwdqcgrcerjkjxtokica.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_RK5HTSJPXHNgoCuSegJE3g_ymmV1GHP';

  const SEED_MESSAGES = [
    { name: 'Sarah', message: 'Lily you are ICONIC. Saw you at pride last year and you literally changed my life. The way you command a stage is pure magic. ✨', created_at: new Date(Date.now() - 172800000).toISOString() },
    { name: 'Marcus', message: 'First time seeing Lily perform and I was completely speechless. The energy, the looks, the presence. We are NOT worthy. 🔥', created_at: new Date(Date.now() - 345600000).toISOString() },
    { name: 'Jess', message: 'Lily St. Drake is what happens when talent meets hard work meets pure star power. So excited to see what you do next! 💚', created_at: new Date(Date.now() - 518400000).toISOString() },
    { name: 'Alex', message: 'booked lily for my birthday and it was the best decision i have ever made. everyone is still talking about it. you are a legend.', created_at: new Date(Date.now() - 604800000).toISOString() },
    { name: 'Priya', message: 'just wanna say lily makes me feel so seen and represented. seeing a queen of color slay this hard gives me life. keep rising. 🌟', created_at: new Date(Date.now() - 864000000).toISOString() },
    { name: 'Danny', message: 'the LSD experience is REAL. lily takes you on a journey every single time. never miss a show if you can help it. ⚡', created_at: new Date(Date.now() - 1209600000).toISOString() },
    { name: 'Maya', message: 'Lily!! met you after the show and you were the sweetest most genuine person. a star on and off stage. rooting for you always!! 💚', created_at: new Date(Date.now() - 1814400000).toISOString() },
    { name: 'Ryan', message: 'honestly lily is one of the hardest working performers i know. every look, every number, every detail is perfection. bow down.', created_at: new Date(Date.now() - 2419200000).toISOString() },
    { name: 'Zoe', message: 'discovered lily on instagram and now im obsessed. the aesthetic, the music choices, the vision. this is what drag is all about. 🎭', created_at: new Date(Date.now() - 3024000000).toISOString() },
    { name: 'Chris', message: 'from the first note to the final bow, lily commands every second of the stage. pure electrifying talent. cannot wait for what comes next.', created_at: new Date(Date.now() - 3888000000).toISOString() },
  ];

  function formatTime(isoString) {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return `${Math.floor(diff / 604800)}w ago`;
  }

  function supabaseFetch(path, options = {}) {
    return fetch(`${SUPABASE_URL}${path}`, {
      ...options,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  }

  async function loadMessages() {
    try {
      const res = await supabaseFetch('/rest/v1/messages?select=*&order=created_at.desc&limit=100');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (data.length > 0) return data;
    } catch {}
    return SEED_MESSAGES;
  }

  let allMessages = [];

  async function renderMessages() {
    const wall = document.getElementById('gbWall');
    const count = document.getElementById('gbCount');
    allMessages = await loadMessages();
    count.textContent = `${allMessages.length} message${allMessages.length !== 1 ? 's' : ''}`;
    wall.innerHTML = allMessages.map(m => `
      <div class="gb-message">
        <div class="gb-msg-header">
          <span class="gb-msg-name">✦ ${m.name}</span>
          <span class="gb-msg-time">${formatTime(m.created_at)}</span>
        </div>
        <div class="gb-msg-text">${m.message}</div>
      </div>
    `).join('');
  }

  // Form submission
  const form = document.getElementById('guestbookForm');
  const nameInput = document.getElementById('gbName');
  const msgInput = document.getElementById('gbMessage');
  const formNote = document.getElementById('gbFormNote');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    if (!name || !message) return;

    const submitBtn = form.querySelector('.gb-submit');
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';

    try {
      const res = await supabaseFetch('/rest/v1/messages', {
        method: 'POST',
        body: JSON.stringify({ name, message }),
      });
      if (!res.ok) throw new Error('Failed to save');
      nameInput.value = '';
      msgInput.value = '';
      formNote.textContent = '💚 message sent!';
      renderMessages();
    } catch {
      formNote.textContent = '💔 could not send — try again!';
    }

    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    setTimeout(() => { formNote.textContent = ''; }, 3000);
  });

  msgInput.addEventListener('input', () => {
    const remaining = 500 - msgInput.value.length;
    if (remaining < 50) {
      formNote.textContent = `${remaining} characters remaining`;
    } else {
      formNote.textContent = '';
    }
  });

  renderMessages();
});
