// ─── STATE ────────────────────────────────────────────────────────
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS_S = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const COLORS = ['#C8FF00', '#E1306C', '#7c3aed', '#06b6d4', '#f97316', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
const TYPE_MAP = { 'Reel': 'Reel', 'Short': 'Short', 'Post estático': 'Post', 'Historia': 'Story', 'Carrusel': 'Car.', 'Live': 'Live' };
const TYPE_CLASS = { 'Reel': 'tb-reel', 'Short': 'tb-short', 'Post estático': 'tb-post', 'Historia': 'tb-story', 'Carrusel': 'tb-car', 'Live': 'tb-live' };
const STATUS_LABEL = { idea: 'Idea', draft: 'Borrador', ready: 'Listo ✓', scheduled: 'Programado', published: 'Publicado' };
const STATUS_CLASS = { idea: 'sb-idea', draft: 'sb-draft', ready: 'sb-ready', scheduled: 'sb-scheduled', published: 'sb-published' };

const FORMAT_ICONS = {
  'Reel': `<svg class="format-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect><path d="M7 2v20M17 2v20M2 7h5M2 17h5M17 17h5M17 7h5M7 12h10"></path></svg>`,
  'Short': `<svg class="format-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2" ry="2"></rect><polygon points="10 9 15 12 10 15 10 9" fill="currentColor"></polygon></svg>`,
  'Post estático': `<svg class="format-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  'Historia': `<svg class="format-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 3"><circle cx="12" cy="12" r="10"></circle></svg>`,
  'Carrusel': `<svg class="format-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="16" height="16" rx="2"></rect><path d="M6 2h14a2 2 0 0 1 2 2v14M10 2h6"></path></svg>`,
  'Live': `<svg class="format-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49"></path></svg>`
};

const PLATFORM_ICONS = {
  ig: `<svg class="plat-icon stroke-only" viewBox="0 0 24 24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
  tt: `<svg class="plat-icon" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.74-3.94-1.72-.01 2.92 0 5.85-.01 8.78-.04 1.75-.48 3.59-1.63 4.9-1.32 1.61-3.52 2.45-5.59 2.27-2.26-.14-4.52-1.57-5.46-3.67-1.12-2.39-.48-5.53 1.58-7.14 1.4-1.15 3.3-1.61 5.08-1.28v4.22c-.88-.23-1.86-.06-2.58.54-.78.61-1.07 1.68-.84 2.65.2 1.01 1.18 1.83 2.21 1.83 1.34.02 2.51-1.02 2.58-2.35.03-3.69 0-7.39.01-11.08-.01-.01-.02-.02-.02-.02H12.5v-.01z"/></svg>`,
  yt: `<svg class="plat-icon" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
};

function load(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d } catch { return d } }
function save(k, v) { localStorage.setItem(k, JSON.stringify(v)) }

let posts = load('ctos_posts', []);
let clients = load('ctos_clients', []);
let currentView = 'calendar';
let activeClient = null;
let activePlatforms = new Set(['ig', 'tt', 'yt']);
let calDate = new Date();
let editingPostId = null;
let modalPlatforms = new Set(['ig']);
let selectedColor = COLORS[1];
let currentTheme = load('ctos_theme', 'light');

// ─── SIDEBAR MOBILE ───────────────────────────────────────────────
function openSidebar() { document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebarOverlay').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('open'); }

// ─── VIEWS ───────────────────────────────────────────────────────
function switchView(v) {
    currentView = v;
    ['calendar', 'ideas', 'checklist'].forEach(x => {
        const desktopBtn = document.getElementById('nav-' + x);
        if (desktopBtn) desktopBtn.classList.toggle('active', x === v);
        
        const mobileBtn = document.getElementById('mob-nav-' + x);
        if (mobileBtn) mobileBtn.classList.toggle('active', x === v);
    });
    closeSidebar();
    render();
}

// ─── TOPBAR NAVIGATION ──────────────────────────────────────────
function updateTopbar() {
    const container = document.getElementById('topbar-dynamic');
    if (!container) return;

    if (currentView === 'calendar') {
        const year = calDate.getFullYear(), month = calDate.getMonth();
        const fp = filtered().filter(p => p.platforms && p.platforms.some(pl => activePlatforms.has(pl)));
        const monthPosts = fp.filter(p => p.date && p.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`));
        
        container.innerHTML = `
          <div class="cal-nav">
            <button class="btn btn-icon btn-ghost" onclick="calNav(-1)">‹</button>
            <div class="cal-month">${MONTHS[month]} ${year}</div>
            <button class="btn btn-icon btn-ghost" onclick="calNav(1)">›</button>
            <button class="btn btn-sm btn-ghost" onclick="calToday()">Hoy</button>
          </div>
          <div id="cal-posts-count" style="font-size:12px;color:var(--t3);margin-left:8px;font-weight:500;">${monthPosts.length} posts</div>
        `;
        document.getElementById('pf-group').style.display = 'flex';
    } else {
        const titles = { ideas: 'Banco de ideas', checklist: 'Checklists' };
        container.innerHTML = `<div class="page-title">${titles[currentView]}</div>`;
        document.getElementById('pf-group').style.display = 'none';
    }
}

// ─── PLATFORM FILTER ─────────────────────────────────────────────
function togglePf(btn, p) {
    activePlatforms.has(p) ? activePlatforms.delete(p) : activePlatforms.add(p);
    btn.classList.toggle('on-' + p, activePlatforms.has(p));
    
    if (currentView === 'calendar') {
        updateCalendarPosts();
        
        // Update count in topbar
        const year = calDate.getFullYear(), month = calDate.getMonth();
        const fp = filtered().filter(p => p.platforms && p.platforms.some(pl => activePlatforms.has(pl)));
        const monthPosts = fp.filter(p => p.date && p.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`));
        const countEl = document.getElementById('cal-posts-count');
        if (countEl) countEl.textContent = `${monthPosts.length} posts`;
    } else {
        render();
    }
}

// ─── CLIENT SIDEBAR ───────────────────────────────────────────────
function renderClients() {
    const el = document.getElementById('client-list');
    const chips = [{ id: null, name: 'Todos', color: 'var(--lime)' }, ...clients];
    el.innerHTML = chips.map(c => `
    <button class="client-chip ${activeClient === c.id ? 'active' : ''}" onclick="setClient(${c.id === null ? 'null' : `'${c.id}'`})">
      <div class="cdot" style="background:${c.color || 'var(--lime)'}"></div>${c.name}
    </button>`).join('');
    // populate f-client select
    const sel = document.getElementById('f-client');
    if (sel) {
        const cur = sel.value;
        sel.innerHTML = '<option value="">— Mi cuenta —</option>' + clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        sel.value = cur;
    }
}
function setClient(id) { activeClient = id; renderClients(); render(); closeSidebar(); }

// ─── STATS ───────────────────────────────────────────────────────
function updateStats() {
    const today = new Date().toISOString().slice(0, 10);
    const weekEnd = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    document.getElementById('s-scheduled').textContent = posts.filter(p => p.status === 'scheduled').length;
    document.getElementById('s-drafts').textContent = posts.filter(p => p.status === 'draft').length;
    document.getElementById('s-ideas').textContent = posts.filter(p => p.status === 'idea').length;
    document.getElementById('s-week').textContent = posts.filter(p => p.date >= today && p.date <= weekEnd).length;
}

// ─── FILTERED POSTS ───────────────────────────────────────────────
function filtered() {
    return posts.filter(p => activeClient === null || (p.client_id || null) === activeClient);
}

// ─── RENDER ──────────────────────────────────────────────────────
function render() {
    updateStats();
    updateTopbar();
    const el = document.getElementById('main-content');
    if (currentView === 'calendar') {
        el.innerHTML = renderCalendar();
        updateCalendarPosts();
    }
    else if (currentView === 'ideas') el.innerHTML = renderIdeas();
    else el.innerHTML = renderChecklist();
}

// ─── CALENDAR ────────────────────────────────────────────────────
function renderCalendar() {
    return renderCalendarSkeleton();
}

function renderCalendarSkeleton() {
    const year = calDate.getFullYear(), month = calDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().toISOString().slice(0, 10);

    let cells = '';
    // prev month cells
    const prevDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        cells += `<div class="cal-cell other-m"><div class="cdate">${prevDays - i}</div></div>`;
    }
    // this month
    for (let d = 1; d <= daysInMonth; d++) {
        const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = key === today;
        cells += `<div class="cal-cell ${isToday ? 'today' : ''}" data-date="${key}" onclick="openPostModal(null,'${key}')">
          <div class="cdate">${isToday ? `<span>${d}</span>` : d}</div>
          <div class="cell-posts-container"></div>
        </div>`;
    }
    // next month
    const lastDay = new Date(year, month, daysInMonth).getDay();
    for (let d = 1; d < 7 - lastDay; d++) {
        cells += `<div class="cal-cell other-m"><div class="cdate">${d}</div></div>`;
    }

    return `<div class="cal-scroller">
    <div class="cal-grid">
      ${DAYS_S.map(d => `<div class="cal-dh">${d}</div>`).join('')}
      ${cells}
    </div>
  </div>`;
}

function updateCalendarPosts() {
    const year = calDate.getFullYear(), month = calDate.getMonth();
    const fp = filtered().filter(p => p.platforms && p.platforms.some(pl => activePlatforms.has(pl)));
    const byDate = {};
    fp.forEach(p => { if (p.date) { if (!byDate[p.date]) byDate[p.date] = []; byDate[p.date].push(p); } });

    const cells = document.querySelectorAll('.cal-cell[data-date]');
    cells.forEach(cell => {
        const date = cell.getAttribute('data-date');
        const container = cell.querySelector('.cell-posts-container');
        if (!container) return;

        const dayPosts = byDate[date] || [];
        dayPosts.sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));

        const pills = dayPosts.slice(0, 3).map(p => {
            const pl = p.platforms?.[0] || 'ig';
            const displayTitle = (p.time ? `${p.time} - ` : '') + p.title;
            return `<div class="ppill ${pl} s-${p.status}" onclick="event.stopPropagation();openPostModal('${p.id}')">
        <span class="ptext" title="${displayTitle}">${displayTitle}</span>
        <span class="tbadge ${TYPE_CLASS[p.type] || 'tb-post'}" title="${p.type}">${FORMAT_ICONS[p.type] || p.type}</span>
      </div>`;
        }).join('');

        const more = dayPosts.length > 3 ? `<div class="more-p" onclick="openPopover(event, this, '${date}')">+${dayPosts.length - 3} más</div>` : '';
        container.innerHTML = pills + more;
    });
}

// ─── POPOVER FOR OVERFLOW POSTS ──────────────────────────────────
function openPopover(e, target, date) {
    if (e) e.stopPropagation();
    const rect = target.getBoundingClientRect();
    const pop = document.getElementById('cal-popover');
    if (!pop) return;

    // Find posts for this day
    const dayPosts = filtered().filter(p => p.date === date && p.platforms?.some(pl => activePlatforms.has(pl)));
    dayPosts.sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));

    let html = `
      <div class="popover-header">
        <span class="popover-title">${new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>
        <button class="popover-close" onclick="closePopover(event)">&times;</button>
      </div>
      <div class="popover-list">
    `;

    dayPosts.forEach(p => {
        const pl = p.platforms?.[0] || 'ig';
        const displayTitle = (p.time ? `${p.time} - ` : '') + p.title;
        html += `
          <div class="ppill ${pl} s-${p.status}" onclick="event.stopPropagation();openPostModal('${p.id}');closePopover(event)">
            <span class="ptext" title="${displayTitle}">${displayTitle}</span>
            <span class="tbadge ${TYPE_CLASS[p.type] || 'tb-post'}" title="${p.type}">${FORMAT_ICONS[p.type] || p.type}</span>
          </div>
        `;
    });

    html += `</div>`;
    pop.innerHTML = html;
    pop.style.display = 'block';

    // Position dynamically
    let top = rect.top + window.scrollY;
    let left = rect.left + window.scrollX;

    // Adjust positions to stay within bounds
    if (left + 250 > window.innerWidth) {
        left = window.innerWidth - 270;
    }
    if (left < 10) left = 10;
    if (top + pop.offsetHeight > window.innerHeight + window.scrollY) {
        top = window.innerHeight + window.scrollY - pop.offsetHeight - 20;
    }
    if (top < 0) top = 10;

    pop.style.top = top + 'px';
    pop.style.left = left + 'px';
}

function closePopover(e) {
    if (e) e.stopPropagation();
    const pop = document.getElementById('cal-popover');
    if (pop) pop.style.display = 'none';
}

// Click outside popover to close it
window.addEventListener('click', (e) => {
    const pop = document.getElementById('cal-popover');
    if (pop && pop.style.display === 'block' && !pop.contains(e.target)) {
        closePopover();
    }
});

function calNav(dir) { calDate = new Date(calDate.getFullYear(), calDate.getMonth() + dir, 1); render(); }
function calToday() { calDate = new Date(); render(); }

// ─── IDEAS ───────────────────────────────────────────────────────
function renderIdeas() {
    let fp = filtered();
    const fStatus = document.getElementById('filter-status')?.value || 'all';
    const fPlat = document.getElementById('filter-plat')?.value || 'all';
    if (fStatus !== 'all') fp = fp.filter(p => p.status === fStatus);
    if (fPlat !== 'all') fp = fp.filter(p => p.platforms?.includes(fPlat));

    const clientName = id => clients.find(c => c.id === id)?.name || 'Mi cuenta';

    const cards = fp.length === 0 ? `<div class="empty">
    <div class="empty-icon">💡</div>
    <div class="empty-title">Sin contenido todavía</div>
    <div class="empty-sub">Agregá tu primer idea</div>
    <button class="btn btn-lime" onclick="openPostModal()">+ Nuevo</button>
  </div>`: fp.map(p => {
    const pl = (p.platforms && p.platforms[0]) || 'ig';
    return `
    <div class="icard ${pl} ${p.status === 'ready' ? 'ready' : ''}" onclick="openPostModal('${p.id}')">
      <div class="itop">
        <div class="pdots">${(p.platforms || ['ig']).map(plat => `<div class="pdot pd-${plat}" title="${plat.toUpperCase()}">${PLATFORM_ICONS[plat] || plat.toUpperCase()}</div>`).join('')}</div>
        <div class="sbadge ${STATUS_CLASS[p.status] || 'sb-draft'}">${STATUS_LABEL[p.status] || p.status}</div>
      </div>
      <div class="ititle">${p.time ? `<strong style="font-weight:600;color:var(--text);">${p.time}</strong> - ` : ''}${p.title}</div>
      ${p.caption ? `<div class="idesc">${p.caption.length > 85 ? p.caption.slice(0, 85) + '…' : p.caption}</div>` : ''}
      <div class="imeta">
        <div class="itype" title="${p.type}">${FORMAT_ICONS[p.type] || ''} <span style="font-size:11px;margin-left:4px;">${p.type || 'Reel'}</span></div>
        <div style="font-size:10px;color:var(--t3)">${clientName(p.client_id)}</div>
      </div>
    </div>`;
  }).join('');

    return `<div class="ideas-toolbar">
    <div style="font-size:13.5px;color:var(--t2)">${fp.length} contenidos</div>
    <div style="display:flex;gap:7px;flex-wrap:wrap">
      <select class="select-sm" id="filter-plat" onchange="render()">
        <option value="all">Todas las plataformas</option>
        <option value="ig">Instagram</option><option value="tt">TikTok</option><option value="yt">YouTube Shorts</option>
      </select>
      <select class="select-sm" id="filter-status" onchange="render()">
        <option value="all">Todos los estados</option>
        <option value="idea">Idea</option><option value="draft">Borrador</option>
        <option value="ready">Listo</option><option value="scheduled">Programado</option><option value="published">Publicado</option>
      </select>
    </div>
  </div>
  <div class="ideas-grid">${cards}</div>`;
}

// ─── CHECKLIST ───────────────────────────────────────────────────
const CL_DATA = {
    reel: {
        title: 'Reel / Short', color: 'var(--lime)', items: [
            { l: 'Definir concepto y hook', s: 'Primeros 3 seg son clave' },
            { l: 'Escribir guión o puntos clave', s: 'Máx 60 palabras' },
            { l: 'Grabar el video', s: 'Buena iluminación y estabilidad' },
            { l: 'Editar con subtítulos', s: 'CapCut / Premiere / DaVinci' },
            { l: 'Agregar música trending', s: 'Revisá tendencias de la semana' },
            { l: 'Caption con CTA', s: 'Primera línea tiene que enganchar' },
            { l: 'Hashtags (5-10 máx)', s: 'Mix de populares + nicho' },
            { l: 'Subir y programar', s: 'Mejor horario según estadísticas' },
        ]
    },
    story: {
        title: 'Historia / Story', color: '#a78bfa', items: [
            { l: 'Definir objetivo de la story', s: 'Awareness / Engagement / Venta' },
            { l: 'Diseñar o grabar el contenido', s: 'Vertical 9:16, bien encuadrado' },
            { l: 'Agregar elementos interactivos', s: 'Encuesta, pregunta, cuenta regresiva' },
            { l: 'Revisar texto y stickers', s: 'Legible en todos los celulares' },
            { l: 'Link o CTA si aplica', s: 'Link en bio / sticker de enlace' },
            { l: 'Publicar en horario pico', s: '11-13hs o 19-21hs' },
        ]
    },
    post: {
        title: 'Post estático', color: '#60a5fa', items: [
            { l: 'Definir mensaje principal', s: 'Una sola idea clara por post' },
            { l: 'Diseñar imagen o carrusel', s: 'Canva / Photoshop / Figma' },
            { l: 'Revisar branding y colores', s: 'Consistente con la marca' },
            { l: 'Caption + pregunta final', s: 'Las preguntas generan más comentarios' },
            { l: 'Alt text para accesibilidad', s: 'También ayuda al algoritmo' },
            { l: 'Hashtags y ubicación', s: 'Geolocalizar si es negocio local' },
            { l: 'Programar en horario óptimo', s: 'Revisá el panel de estadísticas' },
        ]
    }
};
let clDone = { reel: new Set(), story: new Set(), post: new Set() };

function renderChecklist() {
    const cols = Object.entries(CL_DATA).map(([key, d]) => {
        const done = clDone[key];
        const pct = Math.round(done.size / d.items.length * 100);
        const items = d.items.map((item, i) => `
      <div class="cl-item ${done.has(i) ? 'done' : ''}" onclick="toggleCl('${key}',${i})">
        <div class="cl-box">${done.has(i) ? '✓' : ''}</div>
        <div><div class="cl-lbl">${item.l}</div><div class="cl-sub">${item.s}</div></div>
      </div>`).join('');
        return `<div class="cl-col">
      <div class="cl-hdr">
        <div class="cl-title" style="color:${d.color}">${d.title}</div>
        <div class="cl-prog">${done.size}/${d.items.length} · ${pct}%</div>
      </div>
      <div class="cl-bar"><div class="cl-fill" style="width:${pct}%;background:${d.color}"></div></div>
      ${items}
    </div>`;
    }).join('');
    return `<div style="font-size:13.5px;color:var(--t2);margin-bottom:18px;">Hacé click en cada paso para marcarlo como completado.</div>
  <div class="cl-grid">${cols}</div>`;
}
function toggleCl(key, i) {
    clDone[key].has(i) ? clDone[key].delete(i) : clDone[key].add(i);
    render();
}

// ─── POST MODAL ──────────────────────────────────────────────────
function openPostModal(id = null, defaultDate = '') {
    editingPostId = id;
    const post = id ? posts.find(p => p.id === id) : null;
    document.getElementById('modal-title').textContent = post ? 'Editar contenido' : 'Nuevo contenido';
    document.getElementById('btn-delete').style.display = post ? 'flex' : 'none';

    // reset platform buttons
    modalPlatforms = new Set(post?.platforms || ['ig']);
    ['ig', 'tt', 'yt'].forEach(p => {
        const btn = document.getElementById('pb-' + p);
        btn.className = 'pbtn' + (modalPlatforms.has(p) ? ' sel-' + p : '');
    });

    document.getElementById('f-title').value = post?.title || '';
    document.getElementById('f-type').value = post?.type || 'Reel';
    document.getElementById('f-status').value = post?.status || 'idea';
    document.getElementById('f-date').value = post?.date || defaultDate || '';
    document.getElementById('f-time').value = post?.time || '10:00';
    document.getElementById('f-caption').value = post?.caption || '';

    // populate clients
    const sel = document.getElementById('f-client');
    sel.innerHTML = '<option value="">— Mi cuenta —</option>' + clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    sel.value = post?.client_id || '';

    document.getElementById('postOverlay').style.display = 'flex';
    setTimeout(() => document.getElementById('f-title').focus(), 50);
}
function closePostModal() { document.getElementById('postOverlay').style.display = 'none'; editingPostId = null; }

function togglePlatformBtn(p) {
    const btn = document.getElementById('pb-' + p);
    if (modalPlatforms.has(p)) { modalPlatforms.delete(p); btn.className = 'pbtn'; }
    else { modalPlatforms.add(p); btn.className = 'pbtn sel-' + p; }
}

function savePost() {
    const title = document.getElementById('f-title').value.trim();
    if (!title) return document.getElementById('f-title').focus();
    const data = {
        id: editingPostId || crypto.randomUUID(),
        title,
        type: document.getElementById('f-type').value,
        status: document.getElementById('f-status').value,
        platforms: [...modalPlatforms],
        date: document.getElementById('f-date').value || null,
        time: document.getElementById('f-time').value,
        caption: document.getElementById('f-caption').value.trim(),
        client_id: document.getElementById('f-client').value || null,
        created_at: editingPostId ? undefined : (new Date().toISOString()),
    };
    if (editingPostId) {
        const idx = posts.findIndex(p => p.id === editingPostId);
        if (idx > -1) { posts[idx] = { ...posts[idx], ...data }; }
    } else {
        posts.push(data);
    }
    save('ctos_posts', posts);
    closePostModal();
    render();
}

function confirmDeletePost() {
    showConfirm('¿Eliminás este post?', 'Esta acción no se puede deshacer.', () => {
        posts = posts.filter(p => p.id !== editingPostId);
        save('ctos_posts', posts);
        closePostModal();
        render();
    });
}

// ─── CLIENT MODAL ─────────────────────────────────────────────────

function selectColor(c) {
    selectedColor = c;
    COLORS.forEach(col => {
        const el = document.getElementById('cp-' + col.replace('#', ''));
        if (el) el.style.border = `2px solid ${col === c ? 'var(--text)' : 'transparent'}`;
    });
}
function saveClient() {
    const name = document.getElementById('c-name').value.trim();
    if (!name) return;
    clients.push({ id: crypto.randomUUID(), name, color: selectedColor });
    save('ctos_clients', clients);
    document.getElementById('c-name').value = '';
    renderClients();
    renderSettingsClients();
}

// ─── CONFIRM ─────────────────────────────────────────────────────
function showConfirm(title, sub, onOk) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-sub').textContent = sub;
    document.getElementById('confirmOverlay').style.display = 'flex';
    document.getElementById('confirm-ok').onclick = () => { document.getElementById('confirmOverlay').style.display = 'none'; onOk(); };
    document.getElementById('confirm-cancel').onclick = () => document.getElementById('confirmOverlay').style.display = 'none';
}

// ─── INIT ─────────────────────────────────────────────────────────
// Demo data si es primera vez
if (posts.length === 0) {
    const today = new Date();
    const fmt = (offset) => {
        const d = new Date(today); d.setDate(d.getDate() + offset);
        return d.toISOString().slice(0, 10);
    };
    posts = [
        { id: crypto.randomUUID(), title: 'Tips skincare mañanero', type: 'Reel', status: 'scheduled', platforms: ['ig'], date: fmt(-2), time: '10:00', caption: '3 tips rápidos para tu rutina AM ☀️', client_id: null },
        { id: crypto.randomUUID(), title: 'Rutina HIIT 10 minutos', type: 'Short', status: 'scheduled', platforms: ['tt', 'yt'], date: fmt(1), time: '18:00', caption: 'Sin equipamiento, desde casa 🔥', client_id: null },
        { id: crypto.randomUUID(), title: 'Story encuesta verano', type: 'Historia', status: 'draft', platforms: ['ig'], date: fmt(2), time: '12:00', caption: '¿Qué contenido querés ver este verano?', client_id: null },
        { id: crypto.randomUUID(), title: 'Tutorial barba perfecta', type: 'Reel', status: 'idea', platforms: ['ig', 'yt'], date: fmt(5), time: '10:00', caption: '', client_id: null },
        { id: crypto.randomUUID(), title: 'Challenge trending', type: 'Short', status: 'ready', platforms: ['tt'], date: fmt(7), time: '19:00', caption: '', client_id: null },
    ];
    save('ctos_posts', posts);
}

// ─── THEME & SETTINGS ─────────────────────────────────────────────
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme', currentTheme === 'dark');
    save('ctos_theme', currentTheme);
}

function openSettingsModal() {
    document.getElementById('c-name').value = '';
    selectedColor = COLORS[1];
    const picker = document.getElementById('color-picker');
    picker.innerHTML = COLORS.map(c => `
    <div onclick="selectColor('${c}')" id="cp-${c.replace('#', '')}" style="width:26px;height:26px;border-radius:50%;background:${c};cursor:pointer;border:2px solid ${c === selectedColor ? 'var(--text)' : 'transparent'};box-sizing:border-box;transition:border .1s;"></div>
  `).join('');
    
    document.getElementById('settingsOverlay').style.display = 'flex';
    renderSettingsClients();
}

function closeSettingsModal() {
    document.getElementById('settingsOverlay').style.display = 'none';
}

function renderSettingsClients() {
    const container = document.getElementById('settings-client-list');
    if (!container) return;

    if (clients.length === 0) {
        container.innerHTML = `<div style="font-size:12.5px;color:var(--t3);text-align:center;padding:16px 0;">No hay clientes registrados</div>`;
        return;
    }

    container.innerHTML = clients.map(c => `
      <div style="display:flex;align-items:center;justify-content:space-between;background:var(--s2);padding:8px 12px;border:1px solid var(--border);border-radius:var(--r);margin-bottom:4px;">
        <div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text);font-weight:500;">
          <div style="width:10px;height:10px;border-radius:50%;background:${c.color || 'var(--lime)'}"></div>
          <span>${c.name}</span>
        </div>
        <button class="btn btn-icon btn-ghost" onclick="deleteClient('${c.id}')" title="Eliminar cliente" style="color:var(--danger);padding:4px;display:flex;align-items:center;justify-content:center;">
          <svg style="width:14px;height:14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    `).join('');
}

function deleteClient(clientId) {
    showConfirm('¿Eliminás este cliente?', 'Los posts asociados se moverán a "Mi cuenta".', () => {
        clients = clients.filter(c => c.id !== clientId);
        posts = posts.map(p => p.client_id === clientId ? { ...p, client_id: null } : p);
        save('ctos_clients', clients);
        save('ctos_posts', posts);
        if (activeClient === clientId) activeClient = null;
        renderClients();
        render();
        renderSettingsClients();
    });
}

document.body.classList.toggle('dark-theme', currentTheme === 'dark');
renderClients();
render();