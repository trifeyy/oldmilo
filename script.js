const CONFIG = {
  discordId: '920277732288516117',
  tiktok: 'user81737491837',
  spotifyProfile: 'https://open.spotify.com/user/31m6ciqimxrfobgx45ibn7wowaky',
  birthDate: '2004-12-12',
  timeZone: 'Europe/Madrid'
};

const PLAYLIST = [
  { id: '4WkyOBjeLPk7rAisyKl0uN', title: 'VETE A LA FREGADA', artist: 'Eslabon Armado', cover: '5ba60b8e0ba5ed0d8b275ca2' },
  { id: '3vP62cjz1b4QvUS5vSyEVY', title: 'La Canción Feliz Del Disco', artist: 'Eladio Carrión, Milo J', cover: 'ec105eaf625391e95540ba97' },
  { id: '5WEF0icHWmAZBBMglBd599', title: 'WELTiTA', artist: 'Bad Bunny, Chuwi', cover: 'bbd45c8d36e0e045ef640411' },
  { id: '6VNXmo59yDYgcwLS17UNAW', title: 'CAFé CON RON', artist: 'Bad Bunny, Los Pleneros de la Cresta', cover: 'bbd45c8d36e0e045ef640411' },
  { id: '6r6IPuFvUX72kQGc9b46rk', title: 'Amor', artist: 'Emmanuel Cortes', cover: 'c6c1db32c9b68f4659795763' },
  { id: '4dWY6RpM9zmYvwqxrNvwtV', title: 'Tocame', artist: 'La Santa Grifa', cover: '3d97cd87f1d68903bf1ea3a6' },
  { id: '2pPjtn3Pd3nTueJXeizwGk', title: 'Niña Elegante', artist: 'La Santa Grifa', cover: '2984d4cb03ccde15afc59b90' },
  { id: '1wYFvhxzKJ8W3B8TM0Ag2k', title: 'Aparentemente', artist: 'Yaga & Mackie, Arcángel, De La Ghetto', cover: '3805b73889aebcf17d527d3d' }
];

(() => {
  const root = document.documentElement;
  const EN = root.lang === 'en';
  const L = (es, en) => (EN ? en : es);

  if (EN) {
    document.querySelectorAll('[data-en]').forEach((el) => { el.textContent = el.dataset.en; });
    document.querySelectorAll('[data-en-href]').forEach((a) => { a.href = a.dataset.enHref; });
  }
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // 1. Loader
  const loader = document.getElementById('loader-screen');
  const reveal = () => document.body.classList.add('loaded');

  try { sessionStorage.setItem('om-visited', '1'); } catch (e) { }

  if (loader && !root.classList.contains('no-loader')) {
    const percent = document.getElementById('loaderPercent');
    const win = loader.querySelector('.ld-win');
    const later = (ms) => new Promise((r) => setTimeout(r, ms));
    const frame = () => new Promise((r) => requestAnimationFrame(r));

    const zoom = () => {
      const size = win.offsetWidth || 86;
      const end = (2.4 * Math.hypot(innerWidth, innerHeight)) / size;
      const keys = [];
      for (let i = 0; i <= 16; i++) {
        const t = i / 16;
        const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        keys.push({ transform: `translateZ(0) scale(${Math.pow(end, e)})` });
      }
      return win.animate(keys, { duration: 1100, easing: 'linear', fill: 'forwards' }).finished;
    };

    const open = async () => {
      loader.classList.add('is-open');
      await later(220);
      loader.classList.add('is-clear');
      await later(260);
      await frame();
      reveal();
      loader.setAttribute('aria-hidden', 'true');
      await zoom().catch(() => { });
      loader.remove();
    };

    const run = () => {
      loader.classList.add('is-go');
      const duration = 2200;
      const start = performance.now();
      let last = -1;
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        const n = Math.floor(eased * 100);
        if (n !== last && percent) { percent.textContent = n; last = n; }
        if (p < 1) return requestAnimationFrame(step);
        setTimeout(open, 180);
      };
      requestAnimationFrame(step);
    };

    const sheet = document.querySelector('link[href*="fontshare"]');
    const sheetReady = !sheet || sheet.media === 'all' ? Promise.resolve() : new Promise((r) => { sheet.addEventListener('load', r, { once: true }); sheet.addEventListener('error', r, { once: true }); });
    const fonts = sheetReady.then(() => (document.fonts ? document.fonts.load('700 40px "Clash Display"') : null));
    Promise.race([fonts, later(700)]).catch(() => { }).then(() => requestAnimationFrame(run));
  } else {
    if (loader) loader.remove();
    requestAnimationFrame(reveal);
  }

  // 2. Edad
  document.querySelectorAll('[data-age]').forEach((el) => {
    const b = new Date(CONFIG.birthDate + 'T00:00:00');
    const t = new Date();
    let age = t.getFullYear() - b.getFullYear();
    if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) age--;
    el.textContent = age;
  });

  const todayIn = () => {
    try {
      const p = new Intl.DateTimeFormat('en-CA', { timeZone: CONFIG.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      const [y, m, d] = p.split('-').map(Number);
      return { y, m, d };
    } catch (e) {
      const t = new Date();
      return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() };
    }
  };
  const [, bMonth, bDay] = CONFIG.birthDate.split('-').map(Number);
  const now = todayIn();
  const isBirthday = now.m === bMonth && now.d === bDay;
  const daysLeft = (() => {
    const t = Date.UTC(now.y, now.m - 1, now.d);
    let next = Date.UTC(now.y, bMonth - 1, bDay);
    if (next < t) next = Date.UTC(now.y + 1, bMonth - 1, bDay);
    return Math.round((next - t) / 86400000);
  })();

  document.querySelectorAll('[data-birthday]').forEach((el) => {
    const span = el.querySelector('span') || el;
    span.textContent = isBirthday ? L('HOY ES MI CUMPLE', "IT'S MY BIRTHDAY") : daysLeft === 1 ? L('CUMPLO MAÑANA', 'BIRTHDAY TOMORROW') : L(`CUMPLO EN ${daysLeft} DÍAS`, `BIRTHDAY IN ${daysLeft} DAYS`);
    el.hidden = false;
  });

  // 3. Links
  const links = {
    discord: CONFIG.discordId ? `https://discord.com/users/${CONFIG.discordId}` : '',
    tiktok: CONFIG.tiktok ? `https://www.tiktok.com/@${CONFIG.tiktok.replace(/^@/, '')}` : ''
  };
  document.querySelectorAll('[data-link]').forEach((el) => {
    const url = links[el.dataset.link];
    if (url) { el.href = url; el.hidden = false; }
    else if (el.dataset.optional !== undefined) el.hidden = true;
  });

  // 4. Partículas e Inclinación 3D
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

    document.querySelectorAll('.card-border-wrap').forEach((wrap) => {
      const inner = wrap.firstElementChild;
      if (inner && !inner.querySelector('.card-glow')) {
        const g = document.createElement('div');
        g.className = 'card-glow';
        g.setAttribute('aria-hidden', 'true');
        inner.prepend(g);
      }
      let raf = 0, mx = 0, my = 0;
      wrap.addEventListener('pointermove', (e) => {
        const r = wrap.getBoundingClientRect();
        mx = e.clientX - r.left;
        my = e.clientY - r.top;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          wrap.style.setProperty('--mx', mx + 'px');
          wrap.style.setProperty('--my', my + 'px');
        });
      });
      wrap.addEventListener('pointerenter', () => wrap.classList.add('is-lit'));
      wrap.addEventListener('pointerleave', () => wrap.classList.remove('is-lit'));
    });

    document.querySelectorAll('.action-btn, .icon-btn').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        btn.style.translate = `${x * 4}px ${y * 3}px`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.translate = ''; });
    });

    const name = document.querySelector('.username');
    if (name) {
      const word = name.textContent.trim();
      const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>';
      let busy = false;
      name.setAttribute('aria-label', word);
      name.addEventListener('pointerenter', () => {
        if (busy) return;
        busy = true;
        const t0 = performance.now();
        const step = (now) => {
          const p = Math.min((now - t0) / 520, 1);
          const k = Math.floor(p * word.length);
          name.textContent = word.split('').map((c, i) => (i < k ? c : CH[Math.floor(Math.random() * CH.length)].toLowerCase())).join('');
          if (p < 1) return requestAnimationFrame(step);
          name.textContent = word;
          setTimeout(() => (busy = false), 300);
        };
        requestAnimationFrame(step);
      });
    }

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

  if (!reduceMotion) {
    document.addEventListener('pointerdown', (e) => {
      const btn = e.target.closest('.action-btn, .icon-btn');
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2.2;
      const w = document.createElement('span');
      w.className = 'ripple';
      w.style.width = w.style.height = size + 'px';
      w.style.left = e.clientX - r.left - size / 2 + 'px';
      w.style.top = e.clientY - r.top - size / 2 + 'px';
      btn.appendChild(w);
      setTimeout(() => w.remove(), 650);
    });
  }

  // 5. Control de Modales
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

  // 6. Copiar
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const label = btn.textContent;
    btn.addEventListener('click', async () => {
      const target = document.querySelector(btn.dataset.copy);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        btn.textContent = L('¡Copiado!', 'Copied!');
      } catch (e) {
        const range = document.createRange();
        range.selectNodeContents(target);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
        btn.textContent = L('Selecciónalo y copia', 'Select and copy it');
      }
      setTimeout(() => (btn.textContent = label), 2000);
    });
  });

  // 7. Transiciones
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

  // 8. Easter Egg
  const egg = (() => {
    let running = false;
    let found = false;
    return () => {
      if (running) return;
      running = true;

      const card = document.querySelector('.card-border-wrap');
      if (card && !reduceMotion) {
        card.classList.remove('egg-jump');
        void card.offsetWidth;
        card.classList.add('egg-jump');
      }

      if (!reduceMotion) {
        const layer = document.createElement('div');
        layer.className = 'egg-rain';
        layer.setAttribute('aria-hidden', 'true');
        const shades = ['#ffffff', '#e4e5e9', '#b9bdc8', '#8a8f9c', '#5b606d'];
        const count = innerWidth < 600 ? 28 : 46;
        for (let i = 0; i < count; i++) {
          const b = document.createElement(Math.random() < 0.18 ? 'img' : 'span');
          const size = 14 + Math.random() * 26;
          if (b.tagName === 'IMG') {
            b.src = '/milopack/logo.svg';
            b.alt = '';
          } else {
            const c1 = shades[Math.floor(Math.random() * shades.length)];
            const c2 = shades[Math.floor(Math.random() * shades.length)];
            b.style.background = `linear-gradient(135deg, ${c1} 0 50%, ${c2} 50% 100%)`;
          }
          b.className = 'egg-block';
          b.style.width = b.style.height = size + 'px';
          b.style.left = Math.random() * 100 + 'vw';
          b.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
          b.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
          b.style.animationDuration = 1.8 + Math.random() * 1.6 + 's';
          b.style.animationDelay = Math.random() * 0.9 + 's';
          layer.appendChild(b);
        }
        document.body.appendChild(layer);
        setTimeout(() => layer.remove(), 4600);
      }

      const toast = document.createElement('div');
      toast.className = 'egg-toast';
      toast.setAttribute('role', 'status');
      toast.innerHTML = `<img src="/milopack/logo.svg" alt="" width="40" height="40">
        <span><strong>${L('¡Logro desbloqueado!', 'Achievement unlocked!')}</strong><small></small></span>`;
      toast.querySelector('small').textContent = found
        ? L('Otra vez por aquí, ¿eh? 👀', 'Back again, huh? 👀')
        : L('Has encontrado el secreto de oldmilo', "You found oldmilo's secret");
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('is-in'));
      setTimeout(() => toast.classList.remove('is-in'), 3600);
      setTimeout(() => { toast.remove(); running = false; }, 4200);

      if (!found) window.goatcounter?.count?.({ path: 'easter-egg', title: 'Easter egg encontrado', event: true });
      found = true;
    };
  })();

  let typed = '';
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    if (e.target.closest('input, textarea, [contenteditable]')) return;
    typed = (typed + e.key.toLowerCase()).slice(-4);
    if (typed === 'milo') { typed = ''; egg(); }
  });

  const avatarImg = document.querySelector('.avatar');
  if (avatarImg) {
    let taps = 0;
    let tapTimer = null;
    avatarImg.addEventListener('click', () => {
      taps++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => (taps = 0), 1200);
      if (taps >= 5) { taps = 0; egg(); }
    });
  }

  if (reduceMotion) document.querySelectorAll('video[autoplay]').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });

  // 9. Animación Scroll
  const revealItems = document.querySelectorAll('.gear-card, .spec-row, .wall-card');
  if (revealItems.length && 'IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('reveal-ready');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add('is-visible');
        io.unobserve(el);
        setTimeout(() => { el.classList.remove('reveal', 'is-visible'); el.style.transitionDelay = ''; }, 800);
      });
    }, { threshold: 0.15 });
    revealItems.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 3) * 60 + 'ms';
      io.observe(el);
    });
  }

  // 10. Reproductor
  const player = document.getElementById('player');
  if (player) {
    const $ = (id) => document.getElementById(id);
    const list = $('playerList');
    const coverUrl = (hash, size) => `https://i.scdn.co/image/ab67616d0000${size === 'sm' ? '4851' : '1e02'}${hash}`;
    const fmt = (ms) => {
      const t = Math.max(0, Math.floor(ms / 1000));
      return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
    };

    let current = 0;
    let controller = null;
    let apiRequested = false;
    let playWhenReady = false;
    let isPaused = true;
    let duration = 0;
    let position = 0;
    let wasPlaying = false;
    let hasStarted = false;
    const quick = $('musicQuick');

    PLAYLIST.forEach((t, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<button type="button" class="player-track">
          <img src="${coverUrl(t.cover, 'sm')}" alt="" width="36" height="36" loading="lazy">
          <span class="player-track-text"><span class="player-track-title"></span><span class="player-track-artist"></span></span>
          <span class="music-eq" aria-hidden="true"><span></span><span></span><span></span></span>
        </button>`;
      li.querySelector('.player-track-title').textContent = t.title;
      li.querySelector('.player-track-artist').textContent = t.artist;
      li.querySelector('button').addEventListener('click', () => select(i, true));
      list.appendChild(li);
    });

    const paint = () => {
      const t = PLAYLIST[current];
      $('playerCover').src = coverUrl(t.cover);
      $('playerCover').alt = L(`Portada de ${t.title}`, `${t.title} cover art`);
      $('playerTitle').textContent = t.title;
      $('playerArtist').textContent = t.artist;
      [...list.children].forEach((li, i) => {
        const b = li.querySelector('button');
        b.classList.toggle('is-current', i === current);
        if (i === current) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
      paintState();
    };

    const paintState = () => {
      const playing = !isPaused;
      player.classList.toggle('is-playing', playing);
      document.dispatchEvent(new CustomEvent('om:song', { detail: { from: 'player', url: playing ? coverUrl(PLAYLIST[current].cover) : null } }));
      document.getElementById('musicBtn')?.classList.toggle('is-playing', playing);
      if (quick) {
        quick.hidden = !hasStarted;
        quick.parentElement.classList.toggle('has-quick', hasStarted);
        quick.classList.toggle('is-playing', playing);
        quick.setAttribute('aria-label', playing ? L('Pausar música', 'Pause music') : L('Reanudar música', 'Resume music'));
      }
      $('playerPlay').setAttribute('aria-label', playing ? L('Pausar', 'Pause') : L('Reproducir', 'Play'));
      $('playerPos').textContent = fmt(position);
      $('playerDur').textContent = fmt(duration);
      const pct = duration ? (position / duration) * 100 : 0;
      $('playerFill').style.transform = `scaleX(${pct / 100})`;
      $('playerBar').setAttribute('aria-valuenow', Math.round(pct));
    };

    const loadApi = () => {
      if (apiRequested) return;
      apiRequested = true;
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        IFrameAPI.createController($('spotifyEmbed'), {
          uri: `spotify:track:${PLAYLIST[current].id}`,
          width: '100%',
          height: 80
        }, (c) => {
          controller = c;
          const frame = document.querySelector('.player-embed iframe');
          if (frame && !frame.title) frame.title = L('Reproductor de Spotify', 'Spotify player');
          c.addListener('ready', () => {
            if (playWhenReady) { playWhenReady = false; c.play(); }
          });
          c.addListener('playback_update', (e) => {
            const d = e.data;
            if (d.playingURI && d.playingURI !== `spotify:track:${PLAYLIST[current].id}`) return;
            isPaused = d.isPaused;
            duration = d.duration;
            position = d.position;
            if (!isPaused && position > 0 && !wasPlaying) {
              window.goatcounter?.count?.({ path: 'musica-' + PLAYLIST[current].title, title: 'Música: ' + PLAYLIST[current].title, event: true });
            }
            if (!isPaused && position > 0) { wasPlaying = true; hasStarted = true; }
            if (wasPlaying && duration && position >= duration - 800) {
              wasPlaying = false;
              select((current + 1) % PLAYLIST.length, true);
              return;
            }
            paintState();
          });
        });
      };
      const sc = document.createElement('script');
      sc.src = 'https://open.spotify.com/embed/iframe-api/v1';
      sc.async = true;
      document.body.appendChild(sc);
    };

    const select = (i, autoplay) => {
      current = (i + PLAYLIST.length) % PLAYLIST.length;
      position = 0; duration = 0; wasPlaying = false;
      paint();
      if (!controller) { playWhenReady = autoplay; loadApi(); return; }
      playWhenReady = autoplay;
      controller.loadUri(`spotify:track:${PLAYLIST[current].id}`);
    };

    $('playerPlay').addEventListener('click', () => {
      if (!controller) { playWhenReady = true; loadApi(); return; }
      controller.togglePlay();
    });
    $('playerPrev').addEventListener('click', () => {
      if (controller && position > 3000) controller.seek(0);
      else select(current - 1, true);
    });
    $('playerNext').addEventListener('click', () => select(current + 1, true));
    quick?.addEventListener('click', () => controller && controller.togglePlay());

    const seekTo = (ratio) => {
      if (!controller || !duration) return;
      controller.seek((Math.min(Math.max(ratio, 0), 1) * duration) / 1000);
    };
    $('playerBar').addEventListener('click', (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      seekTo((e.clientX - r.left) / r.width);
    });
    $('playerBar').addEventListener('keydown', (e) => {
      if (!duration) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); seekTo((position + 5000) / duration); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); seekTo((position - 5000) / duration); }
    });

    document.querySelector('[data-open="musicOverlay"]')?.addEventListener('click', loadApi);
    paint();
  }

  // 11. Compartir
  const shareNative = document.getElementById('shareNative');
  if (shareNative && navigator.share) {
    shareNative.hidden = false;
    shareNative.addEventListener('click', () => {
      navigator.share({ title: 'oldmilo', text: L('Mira la página de oldmilo', 'Check out oldmilo'), url: EN ? 'https://oldmilo.xyz/en/' : 'https://oldmilo.xyz' }).catch(() => { });
    });
  }

  // 12. Hora y estado
  const lt = {
    clock: document.getElementById('ltClock'),
    text: document.getElementById('ltText'),
    dot: document.getElementById('ltDot')
  };
  let presence = null;

  const hourNow = () => {
    try {
      const parts = new Intl.DateTimeFormat('es-ES', { timeZone: CONFIG.timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      const get = (t) => (parts.find((p) => p.type === t) || {}).value || '00';
      return { h: +get('hour'), label: `${get('hour')}:${get('minute')}` };
    } catch (e) {
      const d = new Date();
      return { h: d.getHours(), label: d.toTimeString().slice(0, 5) };
    }
  };

  const paintTime = () => {
    if (!lt.clock) return;
    const { h, label } = hourNow();
    const status = presence ? presence.discord_status : 'offline';
    const game = presence && (presence.activities || []).find((a) => a.type === 0);
    const awake = status === 'online' || status === 'idle' || status === 'dnd';
    const night = h >= 1 && h < 8;
    let text, mood;

    if (isBirthday) { text = L('hoy es mi cumpleaños', "it's my birthday"); mood = 'play'; }
    else if (game) { text = L(`jugando a ${game.name}`, `playing ${game.name}`); mood = 'play'; }
    else if (status === 'dnd') { text = L('ocupado', 'busy'); mood = 'busy'; }
    else if (night) { text = awake ? L('despierto a estas horas', 'still up at this hour') : L('probablemente durmiendo', 'probably asleep'); mood = awake ? 'online' : 'sleep'; }
    else {
      if (h < 13) text = L('empezando el día', 'starting the day');
      else if (h < 16) text = L('hora de comer', 'lunch time');
      else if (h < 20) text = L('por la tarde', 'afternoon mode');
      else text = L('hora de jugar', 'gaming time');
      mood = status === 'online' ? 'online' : 'day';
    }

    lt.clock.textContent = label;
    lt.text.textContent = text;
    lt.dot.dataset.mood = mood;
  };

  paintTime();
  setInterval(paintTime, 15000);
  document.addEventListener('om:presence', (e) => { presence = e.detail; paintTime(); });

  // 13. Anillo de estado
  const ring = document.querySelector('.avatar-wrap');
  if (ring && document.querySelector('[data-lanyard]')) {
    document.addEventListener('om:presence', (e) => {
      const d = e.detail || {};
      const playing = (d.activities || []).some((a) => a.type === 0);
      ring.dataset.ring = playing ? 'play' : d.discord_status || 'offline';
    });
  }

  // 14. Color de la canción
  const songs = { player: null, lanyard: null };
  let songUrl = null;
  const tint = (url) => {
    if (url === songUrl) return;
    songUrl = url;
    if (!url) { root.classList.remove('has-song'); return; }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (songUrl !== url) return;
      try {
        const c = document.createElement('canvas');
        c.width = c.height = 24;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, 24, 24);
        const px = ctx.getImageData(0, 0, 24, 24).data;
        let r = 0, g = 0, b = 0, w = 0;
        for (let i = 0; i < px.length; i += 4) {
          const max = Math.max(px[i], px[i + 1], px[i + 2]);
          const min = Math.min(px[i], px[i + 1], px[i + 2]);
          const k = (max - min) / 255 + 0.05;
          r += px[i] * k; g += px[i + 1] * k; b += px[i + 2] * k; w += k;
        }
        r /= w; g /= w; b /= w;
        const m = Math.max(r, g, b, 1);
        const lift = Math.min(220 / m, 2.2);
        root.style.setProperty('--song', `rgb(${Math.round(r * lift)}, ${Math.round(g * lift)}, ${Math.round(b * lift)})`);
        root.classList.add('has-song');
      } catch (e) { root.classList.remove('has-song'); }
    };
    img.onerror = () => root.classList.remove('has-song');
    img.src = url;
  };
  document.addEventListener('om:song', (e) => {
    songs[e.detail.from] = e.detail.url;
    tint(songs.player || songs.lanyard);
  });

  // 15. Tarjeta reversible
  let cardFlip = null;
  const flipCard = document.getElementById('tiltCard');
  const flipWrap = flipCard && flipCard.closest('.card-border-wrap');
  const back = document.getElementById('cardBack');
  if (flipWrap && back) {
    let flipping = false;
    const flip = async () => {
      if (flipping) return;
      flipping = true;
      const toBack = !flipCard.classList.contains('is-back');
      if (!reduceMotion && flipWrap.animate) {
        await flipWrap.animate([{ transform: 'perspective(1200px) rotateY(0deg)' }, { transform: 'perspective(1200px) rotateY(90deg)' }], { duration: 230, easing: 'cubic-bezier(0.55, 0, 1, 0.45)' }).finished;
      }
      flipCard.classList.toggle('is-back', toBack);
      back.setAttribute('aria-hidden', !toBack);
      if (!reduceMotion && flipWrap.animate) {
        await flipWrap.animate([{ transform: 'perspective(1200px) rotateY(-90deg)' }, { transform: 'perspective(1200px) rotateY(0deg)' }], { duration: 320, easing: 'cubic-bezier(0, 0.55, 0.45, 1)' }).finished;
      }
      if (toBack) window.goatcounter?.count?.({ path: 'tarjeta-girada', title: 'Tarjeta girada', event: true });
      flipping = false;
    };
    cardFlip = flip;

    const blocked = (t) => t.closest('a, button, img, input, .accent-menu');
    let hold = null;
    let held = false;
    flipCard.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' || blocked(e.target)) return;
      hold = setTimeout(() => { hold = null; held = true; navigator.vibrate?.(12); flip(); }, 550);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => flipCard.addEventListener(ev, () => { clearTimeout(hold); hold = null; }));
    flipCard.addEventListener('contextmenu', (e) => { if (!blocked(e.target)) e.preventDefault(); });
    flipCard.addEventListener('mousedown', (e) => { if (e.detail > 1 && !blocked(e.target)) e.preventDefault(); });
    flipCard.addEventListener('dblclick', (e) => { if (!blocked(e.target) && !e.target.closest('.card-back')) flip(); });
    back.addEventListener('click', () => {
      if (held) { held = false; return; }
      if (flipCard.classList.contains('is-back')) flip();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && flipCard.classList.contains('is-back')) flip(); });
  }

  // 16. Visitas
  const visitBox = document.getElementById('visitCount');
  if (visitBox) {
    fetch('https://oldmilo.goatcounter.com/counter/TOTAL.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || !d.count) return;
        document.getElementById('visitNum').textContent = String(d.count).replace(/[,.\s\u202f]/g, L('.', ','));
        visitBox.hidden = false;
      })
      .catch(() => { });
  }

  // 17. Color
  const ACCENTS = [
    { id: 'rojo', name: L('Rojo', 'Red'), rgb: '255, 74, 36' },
    { id: 'azul', name: L('Azul', 'Blue'), rgb: '76, 141, 255' },
    { id: 'verde', name: L('Verde', 'Green'), rgb: '52, 211, 153' },
    { id: 'morado', name: L('Morado', 'Purple'), rgb: '167, 139, 250' },
    { id: 'rosa', name: L('Rosa', 'Pink'), rgb: '255, 92, 154' },
    { id: 'amarillo', name: L('Amarillo', 'Yellow'), rgb: '251, 191, 36' }
  ];
  const accentBtn = document.getElementById('accentBtn');
  const accentMenu = document.getElementById('accentMenu');

  const setAccent = (rgb, save) => {
    root.style.setProperty('--accent', `rgb(${rgb})`);
    root.style.setProperty('--accent-rgb', rgb);
    if (save) { try { localStorage.setItem('om-accent', rgb); } catch (e) { } }
    if (accentMenu) accentMenu.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.rgb === rgb));
  };

  if (accentBtn && accentMenu) {
    let saved = ACCENTS[0].rgb;
    try { saved = localStorage.getItem('om-accent') || saved; } catch (e) { }
    accentMenu.innerHTML = ACCENTS.map((a) => `<button type="button" data-rgb="${a.rgb}" data-id="${a.id}" style="--c:${a.rgb}" aria-label="${a.name}" title="${a.name}" aria-pressed="${a.rgb === saved}"></button>`).join('');

    const toggle = (open) => {
      accentMenu.hidden = !open;
      accentBtn.setAttribute('aria-expanded', open);
    };
    accentBtn.addEventListener('click', (e) => { e.stopPropagation(); toggle(accentMenu.hidden); });
    accentMenu.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      setAccent(b.dataset.rgb, true);
      window.goatcounter?.count?.({ path: 'color-' + b.dataset.id, title: 'Color: ' + b.dataset.id, event: true });
    });
    document.addEventListener('click', (e) => { if (!accentMenu.hidden && !e.target.closest('.accent-pick')) toggle(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !accentMenu.hidden) { toggle(false); accentBtn.focus(); } });
  }

  // 18. Confeti
  const confetti = () => {
    const cv = document.createElement('canvas');
    cv.className = 'confetti';
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);
    const acc = getComputedStyle(root).getPropertyValue('--accent-rgb').trim() || '255, 74, 36';
    const cols = [`rgb(${acc})`, '#ffffff', '#9ca3af'];
    const bits = Array.from({ length: 140 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 120,
      y: innerHeight * 0.45,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 14 - 4,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      w: 5 + Math.random() * 5,
      c: cols[Math.floor(Math.random() * cols.length)]
    }));
    const t0 = performance.now();
    const tick = (now) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - 2.2) / 0.8);
      bits.forEach((b) => {
        b.vy += 0.35; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.r += b.vr;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
        ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.w / 4, b.w, b.w / 2);
        ctx.restore();
      });
      if (t < 3) requestAnimationFrame(tick); else cv.remove();
    };
    requestAnimationFrame(tick);
  };

  if (isBirthday && document.getElementById('tiltCard') && !reduceMotion) {
    let seen = false;
    try { seen = sessionStorage.getItem('om-cumple'); sessionStorage.setItem('om-cumple', '1'); } catch (e) { }
    if (!seen) {
      setTimeout(confetti, root.classList.contains('no-loader') ? 500 : 4200);
    }
  }

  // 19. Idioma
  document.querySelectorAll('[data-lang]').forEach((a) => {
    a.addEventListener('click', () => { try { localStorage.setItem('om-lang', a.dataset.lang); } catch (e) { } });
  });

  const otherLang = () => {
    const alt = document.querySelector(`link[rel="alternate"][hreflang="${EN ? 'es' : 'en'}"]`);
    return alt ? new URL(alt.href).pathname : (EN ? '/' : '/en/');
  };

  // 20. Menú Ctrl+K
  const toast = (msg) => {
    const t = document.createElement('div');
    t.className = 'egg-toast';
    t.setAttribute('role', 'status');
    t.innerHTML = '<img src="/milopack/logo.svg" alt="" width="40" height="40"><span><strong></strong></span>';
    t.querySelector('strong').textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('is-in'));
    setTimeout(() => t.classList.remove('is-in'), 2400);
    setTimeout(() => t.remove(), 3000);
  };

  const copy = async (text, msg) => {
    try { await navigator.clipboard.writeText(text); toast(msg); } catch (e) { prompt('', text); }
  };

  const matrix = () => {
    if (reduceMotion) return toast('Wake up, Neo...');
    const cv = document.createElement('canvas');
    cv.className = 'confetti';
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    cv.width = innerWidth; cv.height = innerHeight;
    const size = 16, cols = Math.ceil(innerWidth / size);
    const drops = Array.from({ length: cols }, () => Math.random() * -40);
    const acc = getComputedStyle(root).getPropertyValue('--accent-rgb').trim() || '255, 74, 36';
    const chars = 'OLDMILO0123456789';
    const t0 = performance.now();
    const tick = (now) => {
      const t = (now - t0) / 1000;
      ctx.fillStyle = 'rgba(8, 9, 12, 0.18)';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.font = `${size}px ui-monospace, Menlo, Consolas, monospace`;
      drops.forEach((y, i) => {
        ctx.fillStyle = Math.random() < 0.08 ? '#ffffff' : `rgb(${acc})`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, y * size);
        drops[i] = y * size > cv.height && Math.random() > 0.96 ? 0 : y + 1;
      });
      cv.style.opacity = Math.max(0, 1 - Math.max(0, t - 3.2) / 0.8);
      if (t < 4) requestAnimationFrame(tick); else cv.remove();
    };
    requestAnimationFrame(tick);
  };

  const go = (path) => () => { location.href = path; };
  const ext = (url) => () => { window.open(url, '_blank', 'noopener'); };
  const has = (id) => !!document.getElementById(id);
  const P = (es, en) => (EN ? en : es);

  const ICON = {
    page: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
    link: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    act: '<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>',
    dot: '<circle cx="12" cy="12" r="5"/>',
    lang: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
  };

  const COMMANDS = [
    { g: L('Ir a', 'Go to'), i: 'page', t: L('Inicio', 'Home'), k: 'home inicio principal', run: go(P('/', '/en/')) },
    { g: L('Ir a', 'Go to'), i: 'page', t: L('Sobre mí', 'About me'), k: 'about sobre quien bio camilo', run: go(P('/aboutme/', '/en/aboutme/')) },
    { g: L('Ir a', 'Go to'), i: 'page', t: L('Ahora', 'Now'), k: 'now ahora jugando bucle objetivo', run: go(P('/ahora/', '/en/now/')) },
    { g: L('Ir a', 'Go to'), i: 'page', t: L('Mi setup', 'My setup'), k: 'setup pc specs gpu perifericos teclado raton monitor', run: go(P('/setup/', '/en/setup/')) },
    { g: L('Ir a', 'Go to'), i: 'page', t: L('Fondos de pantalla', 'Wallpapers'), k: 'fondos wallpapers 4k descargar', run: go(P('/fondos/', '/en/wallpapers/')) },
    { g: L('Ir a', 'Go to'), i: 'page', t: 'miloPack', k: 'milopack pack texturas minecraft', run: go(P('/milopack/', '/en/milopack/')) },
    { g: L('Ir a', 'Go to'), i: 'page', t: L('Recursos para creadores', 'Creator resources'), k: 'recursos resources logo creators', run: go(P('/milopack/recursos/', '/en/milopack/resources/')) },
    { g: L('Ir a', 'Go to'), i: 'page', t: L('Versiones anteriores', 'Older versions'), k: 'versiones versions antiguas old', run: go(P('/milopack/versiones/', '/en/milopack/versions/')) },
    { g: L('Ir a', 'Go to'), i: 'page', t: L('Historial de cambios', 'Changelog'), k: 'historial changelog cambios novedades', run: go(P('/milopack/historial/', '/en/milopack/changelog/')) },
    { g: L('Acciones', 'Actions'), i: 'act', t: L('Copiar mi email', 'Copy my email'), k: 'email correo contacto contact mail', run: () => copy('contacto@oldmilo.xyz', L('Email copiado', 'Email copied')) },
    { g: L('Acciones', 'Actions'), i: 'act', t: L('Copiar el enlace de esta página', 'Copy link to this page'), k: 'copiar link enlace url', run: () => copy(location.href.split('#')[0], L('Enlace copiado', 'Link copied')) },
    { g: L('Acciones', 'Actions'), i: 'act', t: L('Compartir y QR', 'Share and QR code'), k: 'share compartir qr', when: () => has('shareOverlay'), run: () => openModal(document.getElementById('shareOverlay'), document.querySelector('[data-open="shareOverlay"]')) },
    { g: L('Acciones', 'Actions'), i: 'act', t: L('Abrir mi música', 'Open my music'), k: 'musica music spotify canciones songs player', when: () => has('musicOverlay'), run: () => openModal(document.getElementById('musicOverlay'), document.getElementById('musicBtn')) },
    { g: L('Acciones', 'Actions'), i: 'act', t: L('Girar la tarjeta', 'Flip the card'), k: 'girar flip tarjeta card qr', when: () => !!cardFlip, run: () => cardFlip() },
    { g: L('Acciones', 'Actions'), i: 'lang', t: L('Ver en inglés', 'Ver en español'), k: 'english ingles español spanish idioma language', run: () => { try { localStorage.setItem('om-lang', EN ? 'es' : 'en'); } catch (e) { } location.href = otherLang(); } },
    ...ACCENTS.map((a) => ({ g: 'Color', i: 'dot', c: a.rgb, t: `Color: ${a.name}`, k: 'color colour tema theme ' + a.id + ' ' + a.name.toLowerCase(), run: () => setAccent(a.rgb, true) })),
    { g: L('Redes', 'Socials'), i: 'link', t: 'YouTube', k: 'youtube videos', run: ext('https://www.youtube.com/@oldmiilo') },
    { g: L('Redes', 'Socials'), i: 'link', t: 'Twitch', k: 'twitch directo stream live', run: ext('https://twitch.tv/plaiices') },
    { g: L('Redes', 'Socials'), i: 'link', t: 'TikTok', k: 'tiktok', run: ext('https://www.tiktok.com/@' + CONFIG.tiktok) },
    { g: L('Redes', 'Socials'), i: 'link', t: 'Instagram', k: 'instagram ig', run: ext('https://www.instagram.com/camilo.magiic/') },
    { g: L('Redes', 'Socials'), i: 'link', t: 'Discord', k: 'discord', run: ext('https://discord.com/users/' + CONFIG.discordId) },
    { g: L('Redes', 'Socials'), i: 'link', t: 'Spotify', k: 'spotify', run: ext(CONFIG.spotifyProfile) }
  ];

  const SECRETS = {
    milo: () => egg(),
    sudo: () => toast(L('Buen intento 😏', 'Nice try 😏')),
    matrix: () => matrix(),
    fiesta: () => (reduceMotion ? toast('🎉') : confetti()),
    party: () => (reduceMotion ? toast('🎉') : confetti()),
    hola: () => toast(L('¡Hola! Gracias por pasarte 👋', 'Hey! Thanks for stopping by 👋')),
    hello: () => toast(L('¡Hola! Gracias por pasarte 👋', 'Hey! Thanks for stopping by 👋')),
    gg: () => toast('GG WP 🏆')
  };

  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

  const cmdk = document.createElement('div');
  cmdk.className = 'cmdk';
  cmdk.hidden = true;
  cmdk.innerHTML = `
    <div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="${L('Menú de comandos', 'Command menu')}">
      <div class="cmdk-head">
        <span class="cmdk-prompt" aria-hidden="true">&gt;</span>
        <input class="cmdk-input" type="text" role="combobox" aria-label="${L('Buscar', 'Search')}" aria-expanded="true" aria-controls="cmdkList" aria-autocomplete="list" autocomplete="off" spellcheck="false" placeholder="${L('Busca una página o acción', 'Search for a page or action')}">
        <kbd class="cmdk-esc">esc</kbd>
      </div>
      <ul class="cmdk-list" id="cmdkList" role="listbox"></ul>
      <div class="cmdk-foot">
        <span class="cmdk-keys"><kbd>↑</kbd><kbd>↓</kbd> ${L('moverse', 'navigate')} <kbd>↵</kbd> ${L('abrir', 'open')}</span>
        <span>${L('Hay comandos secretos 👀', 'There are secret commands 👀')}</span>
      </div>
    </div>`;
  document.body.appendChild(cmdk);

  const input = cmdk.querySelector('.cmdk-input');
  const list = cmdk.querySelector('.cmdk-list');
  let shown = [];
  let sel = 0;
  let lastFocus = null;

  const paint = () => {
    const q = norm(input.value);
    const pool = COMMANDS.filter((c) => !c.when || c.when());
    shown = !q ? pool : pool
      .map((c) => {
        const hay = norm(c.t + ' ' + c.k + ' ' + c.g);
        const title = norm(c.t);
        let score = title.startsWith(q) ? 3 : title.includes(q) ? 2 : hay.includes(q) ? 1 : 0;
        if (!score) {
          let i = 0;
          for (const ch of hay) if (ch === q[i]) i++;
          if (i === q.length) score = 0.5;
        }
        return { c, score };
      })
      .filter((x) => x.score)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.c);

    const secret = SECRETS[q] ? [{ g: '???', i: 'act', t: L(`Ejecutar "${q}"`, `Run "${q}"`), secret: true, run: SECRETS[q] }] : [];
    shown = secret.concat(shown);
    sel = Math.min(sel, Math.max(shown.length - 1, 0));

    let html = '';
    let group = '';
    shown.forEach((c, i) => {
      if (c.g !== group) { group = c.g; html += `<li class="cmdk-group" role="presentation">${group}</li>`; }
      const icon = c.i === 'dot'
        ? `<span class="cmdk-dot" style="--c:${c.c}"></span>`
        : `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[c.i]}</svg>`;
      html += `<li class="cmdk-item${c.secret ? ' is-secret' : ''}" role="option" id="cmdk-${i}" data-i="${i}" aria-selected="${i === sel}">${icon}<span></span>${c.i === 'link' ? '<em>↗</em>' : ''}</li>`;
    });
    if (!shown.length) html = `<li class="cmdk-empty" role="presentation">${L('Nada por aquí. Prueba otra cosa', 'Nothing here. Try something else')}</li>`;
    list.innerHTML = html;
    list.querySelectorAll('.cmdk-item').forEach((li) => { li.querySelector('span').textContent = shown[+li.dataset.i].t; });
    input.setAttribute('aria-activedescendant', shown.length ? 'cmdk-' + sel : '');
    list.querySelector(`[data-i="${sel}"]`)?.scrollIntoView({ block: 'nearest' });
  };

  const openCmdk = () => {
    if (!cmdk.hidden) return;
    lastFocus = document.activeElement;
    input.value = '';
    sel = 0;
    paint();
    cmdk.hidden = false;
    input.focus();
    requestAnimationFrame(() => cmdk.classList.add('is-open'));
    document.querySelector('main')?.setAttribute('inert', '');
    window.goatcounter?.count?.({ path: 'menu-comandos', title: 'Menú de comandos', event: true });
  };

  const closeCmdk = () => {
    if (cmdk.hidden) return;
    cmdk.classList.remove('is-open');
    document.querySelector('main')?.removeAttribute('inert');
    setTimeout(() => { cmdk.hidden = true; }, 160);
    lastFocus?.focus?.();
  };

  const runSel = () => {
    const c = shown[sel];
    if (!c) return;
    closeCmdk();
    setTimeout(c.run, 120);
    if (c.secret) window.goatcounter?.count?.({ path: 'secreto-' + norm(input.value), title: 'Comando secreto', event: true });
  };

  input.addEventListener('input', () => { sel = 0; paint(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) { e.preventDefault(); sel = (sel + 1) % Math.max(shown.length, 1); paint(); }
    else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(shown.length, 1); paint(); }
    else if (e.key === 'Enter') { e.preventDefault(); runSel(); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeCmdk(); }
  });
  list.addEventListener('pointermove', (e) => {
    const li = e.target.closest('.cmdk-item');
    if (li && +li.dataset.i !== sel) { sel = +li.dataset.i; list.querySelectorAll('.cmdk-item').forEach((x) => x.setAttribute('aria-selected', +x.dataset.i === sel)); }
  });
  list.addEventListener('click', (e) => {
    const li = e.target.closest('.cmdk-item');
    if (li) { sel = +li.dataset.i; runSel(); }
  });
  cmdk.addEventListener('click', (e) => { if (e.target === cmdk) closeCmdk(); });
  cmdk.querySelector('.cmdk-esc').addEventListener('click', closeCmdk);

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      cmdk.hidden ? openCmdk() : closeCmdk();
    } else if (e.key === '/' && cmdk.hidden && !openOverlay && !e.target.closest('input, textarea, [contenteditable]')) {
      e.preventDefault();
      openCmdk();
    }
  });
  document.querySelectorAll('[data-cmdk]').forEach((b) => b.addEventListener('click', openCmdk));

  // 21. Discord + Spotify (Lanyard)
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
    online: L('En línea', 'Online'),
    idle: L('Ausente', 'Away'),
    dnd: L('No molestar', 'Do not disturb'),
    offline: L('Desconectado', 'Offline')
  };

  let progressTimer = null;

  const gameIcon = document.getElementById('discordGame');
  const paintGame = (game) => {
    if (!gameIcon) return;
    let src = '';
    if (game) {
      const big = (game.assets || {}).large_image || '';
      if (big.startsWith('mp:')) src = `https://media.discordapp.net/${big.slice(3)}`;
      else if (big && game.application_id) src = `https://cdn.discordapp.com/app-assets/${game.application_id}/${big}.png`;
      else if (game.application_id) src = `https://dcdn.dstn.to/app-icons/${game.application_id}`;
    }
    if (!src) { gameIcon.hidden = true; gameIcon.removeAttribute('src'); return; }
    if (gameIcon.getAttribute('src') !== src) {
      gameIcon.onload = () => { gameIcon.hidden = false; };
      gameIcon.onerror = () => { gameIcon.hidden = true; };
      gameIcon.src = src;
    }
    gameIcon.alt = game.name;
    gameIcon.title = game.name;
  };

  const setSpotifyIdle = () => {
    document.dispatchEvent(new CustomEvent('om:song', { detail: { from: 'lanyard', url: null } }));
    clearInterval(progressTimer);
    pill.classList.remove('is-playing');
    pill.href = CONFIG.spotifyProfile;
    cover.src = defaultCover;
    label.textContent = 'Spotify';
    track.textContent = L('Ahora mismo no suena nada', 'Nothing playing right now');
    pill.setAttribute('aria-label', L('Mi perfil de Spotify', 'My Spotify profile'));
    bar.style.transform = 'scaleX(0)';
  };

  const render = (d) => {
    document.dispatchEvent(new CustomEvent('om:presence', { detail: d }));
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
    if (game) text = L(`Jugando a ${game.name}`, `Playing ${game.name}`);
    else if (custom) text = (custom.emoji && !custom.emoji.id ? custom.emoji.name + ' ' : '') + custom.state;
    dText.textContent = text;
    paintGame(game);
    widget.setAttribute('aria-label', `Discord: ${STATUS[status] || STATUS.offline}. ${text}`);

    if (!d.listening_to_spotify || !d.spotify) return setSpotifyIdle();
    const s = d.spotify;
    pill.classList.add('is-playing');
    document.dispatchEvent(new CustomEvent('om:song', { detail: { from: 'lanyard', url: s.album_art_url } }));
    pill.href = `https://open.spotify.com/track/${s.track_id}`;
    cover.src = s.album_art_url || defaultCover;
    label.textContent = L('Escuchando', 'Listening to');
    track.textContent = `${s.song} · ${s.artist.replace(/;/g, ',')}`;
    pill.setAttribute('aria-label', L(`Escuchando ${s.song} de ${s.artist} en Spotify`, `Listening to ${s.song} by ${s.artist} on Spotify`));

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
    track.textContent = L('Mi perfil de Spotify', 'My Spotify profile');
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
