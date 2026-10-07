// oldmilo.xyz

const CONFIG = {
  discordId: '920277732288516117',
  tiktok: 'user81737491837',
  spotifyProfile: 'https://open.spotify.com/user/31m6ciqimxrfobgx45ibn7wowaky',
  birthDate: '2004-12-12'
};

(() => {
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Pantalla de carga
  const loader = document.getElementById('loader-screen');
  const reveal = () => document.body.classList.add('loaded');

  try { sessionStorage.setItem('om-visited', '1'); } catch (e) { }

  if (loader && !root.classList.contains('no-loader')) {
    const percent = document.getElementById('loaderPercent');
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      if (percent) percent.textContent = Math.floor(eased * 100);
      if (p < 1) return requestAnimationFrame(step);
      setTimeout(() => {
        loader.classList.add('hidden');
        loader.setAttribute('aria-hidden', 'true');
        reveal();
      }, 200);
    };
    requestAnimationFrame(step);
  } else {
    if (loader) loader.remove();
    requestAnimationFrame(reveal);
  }

  // Edad calculada automáticamente
  document.querySelectorAll('[data-age]').forEach((el) => {
    const b = new Date(CONFIG.birthDate + 'T00:00:00');
    const t = new Date();
    let age = t.getFullYear() - b.getFullYear();
    if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) age--;
    el.textContent = age;
  });

  // Enlaces configurables
  const links = {
    discord: CONFIG.discordId ? `https://discord.com/users/${CONFIG.discordId}` : '',
    tiktok: CONFIG.tiktok ? `https://www.tiktok.com/@${CONFIG.tiktok.replace(/^@/, '')}` : ''
  };
  document.querySelectorAll('[data-link]').forEach((el) => {
    const url = links[el.dataset.link];
    if (url) { el.href = url; el.hidden = false; }
    else if (el.dataset.optional !== undefined) el.hidden = true;
  });

  // Partículas e inclinación 3D
  if (finePointer && !reduceMotion) {
    let last = 0;
    document.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - last < 40) return;
      last = now;
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.left = e.clientX + (Math.random() * 10 - 5) + 'px';
      s.style.top = e.clientY + (Math.random() * 10 - 5) + 'px';
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 800);
    });

    const card = document.getElementById('tiltCard');
    if (card) {
      const max = Number(card.dataset.tilt || 5);
      document.addEventListener('mousemove', (e) => {
        const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
        const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
        card.style.transform = `rotateX(${-y * max}deg) rotateY(${x * max}deg)`;
      });
      document.documentElement.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    }
  }

  // Modales accesibles
  const FOCUSABLE = 'a[href]:not([hidden]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const main = document.querySelector('main');
  let openOverlay = null;
  let lastTrigger = null;

  const closeModal = () => {
    if (!openOverlay) return;
    openOverlay.classList.remove('open');
    openOverlay.setAttribute('aria-hidden', 'true');
    if (main) main.inert = false;
    openOverlay = null;
    if (lastTrigger) lastTrigger.focus();
  };

  const openModal = (overlay, trigger) => {
    lastTrigger = trigger;
    openOverlay = overlay;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    if (main) main.inert = true;
    const first = overlay.querySelector('.dialog').querySelectorAll(FOCUSABLE)[0];
    setTimeout(() => (first || overlay.querySelector('.dialog')).focus(), 50);
  };

  document.querySelectorAll('[data-open]').forEach((btn) => {
    const overlay = document.getElementById(btn.dataset.open);
    if (!overlay) return;
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.addEventListener('click', () => openModal(overlay, btn));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('[data-close]')) closeModal();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (!openOverlay) return;
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
    if (e.key !== 'Tab') return;
    const items = [...openOverlay.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Botones de copiar
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const label = btn.textContent;
    btn.addEventListener('click', async () => {
      const target = document.querySelector(btn.dataset.copy);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        btn.textContent = '¡Copiado!';
      } catch (e) {
        const range = document.createRange();
        range.selectNodeContents(target);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
        btn.textContent = 'Selecciónalo y copia';
      }
      setTimeout(() => (btn.textContent = label), 2000);
    });
  });

  // Transiciones entre páginas
  const nativeVT = 'CSSViewTransitionRule' in window;
  if (!nativeVT && !reduceMotion) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
      e.preventDefault();
      root.classList.add('is-leaving');
      setTimeout(() => (location.href = url.href), 280);
    });
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) root.classList.remove('is-leaving');
    });
  }

  // Estado real de Discord + Spotify con Lanyard
  const widget = document.querySelector('[data-lanyard]');
  if (!widget) return;

  const pill = document.getElementById('spotifyPill');
  const cover = document.getElementById('spotifyCover');
  const track = document.getElementById('spotifyTrack');
  const label = document.getElementById('spotifyLabel');
  const bar = document.getElementById('spotifyProgress');
  const dAvatar = document.getElementById('discordImg');
  const dUser = document.getElementById('discordUser');
  const dText = document.getElementById('discordStatus');
  const dDot = document.getElementById('discordDot');
  const defaultCover = cover ? cover.src : '';

  const STATUS = {
    online: 'En línea',
    idle: 'Ausente',
    dnd: 'No molestar',
    offline: 'Desconectado'
  };

  let progressTimer = null;

  const setSpotifyIdle = () => {
    clearInterval(progressTimer);
    pill.classList.remove('is-playing');
    pill.href = CONFIG.spotifyProfile;
    cover.src = defaultCover;
    label.textContent = 'Spotify';
    track.textContent = 'Ahora mismo no suena nada';
    pill.setAttribute('aria-label', 'Mi perfil de Spotify');
    bar.style.transform = 'scaleX(0)';
  };

  const render = (d) => {
    // Discord
    const u = d.discord_user || {};
    if (u.avatar) {
      const ext = u.avatar.startsWith('a_') ? 'gif' : 'png';
      dAvatar.src = `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.${ext}?size=128`;
    }
    if (u.username) dUser.textContent = '@' + u.username;
    const status = d.discord_status || 'offline';
    dDot.dataset.status = status;

    const custom = (d.activities || []).find((a) => a.type === 4 && a.state);
    const game = (d.activities || []).find((a) => a.type === 0);
    let text = STATUS[status] || STATUS.offline;
    if (game) text = `Jugando a ${game.name}`;
    else if (custom) text = (custom.emoji && !custom.emoji.id ? custom.emoji.name + ' ' : '') + custom.state;
    dText.textContent = text;
    widget.setAttribute('aria-label', `Discord: ${STATUS[status] || STATUS.offline}. ${text}`);

    // Spotify
    if (!d.listening_to_spotify || !d.spotify) return setSpotifyIdle();
    const s = d.spotify;
    pill.classList.add('is-playing');
    pill.href = `https://open.spotify.com/track/${s.track_id}`;
    cover.src = s.album_art_url || defaultCover;
    label.textContent = 'Escuchando';
    track.textContent = `${s.song} · ${s.artist.replace(/;/g, ',')}`;
    pill.setAttribute('aria-label', `Escuchando ${s.song} de ${s.artist} en Spotify`);

    clearInterval(progressTimer);
    const { start, end } = s.timestamps || {};
    if (start && end) {
      const tick = () => {
        const p = Math.min(Math.max((Date.now() - start) / (end - start), 0), 1);
        bar.style.transform = `scaleX(${p})`;
      };
      tick();
      progressTimer = setInterval(tick, 1000);
    }
  };

  if (!CONFIG.discordId) {
    setSpotifyIdle();
    track.textContent = 'Mi perfil de Spotify';
    dText.textContent = 'Discord';
    return;
  }

  let heartbeat = null;
  let pollTimer = null;
  let retries = 0;

  const poll = async () => {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${CONFIG.discordId}`);
      const json = await res.json();
      if (json.success) render(json.data);
    } catch (e) { }
  };

  const connect = () => {
    let ws;
    try { ws = new WebSocket('wss://api.lanyard.rest/socket'); }
    catch (e) { poll(); pollTimer = setInterval(poll, 30000); return; }

    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.op === 1) {
        retries = 0;
        clearInterval(heartbeat);
        heartbeat = setInterval(() => ws.send(JSON.stringify({ op: 3 })), msg.d.heartbeat_interval);
        ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: CONFIG.discordId } }));
      } else if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
        render(msg.d);
      }
    });

    ws.addEventListener('close', () => {
      clearInterval(heartbeat);
      if (++retries > 3) {
        if (!pollTimer) { poll(); pollTimer = setInterval(poll, 30000); }
        return;
      }
      setTimeout(connect, 3000 * retries);
    });
  };

  poll();
  connect();
})();
