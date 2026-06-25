const LIMITS = { ig: 2200, tw: 280, li: 3000, tk: 2200 };
const COLORS = { ig: '#e040fb', tw: '#38bdf8', li: '#60a5fa', tk: '#f87171' };
const NAMES = { ig: 'Instagram', tw: 'Twitter/X', li: 'LinkedIn', tk: 'TikTok' };
const ICONS = { ig: '📸', tw: '𝕏', li: '💼', tk: '🎵' };

const FORMATS_BY_PLATFORM = {
  ig: [
    { id: 'post', name: 'Post Feed', icon: '🖼️' },
    { id: 'reel', name: 'Reel / Video', icon: '🎥' },
    { id: 'carrusel', name: 'Carrusel', icon: '📄' },
    { id: 'story', name: 'Historia', icon: '📱' }
  ],
  tw: [
    { id: 'post', name: 'Post estándar', icon: '🪶' },
    { id: 'hilo', name: 'Hilo / Thread', icon: '🧵' }
  ],
  li: [
    { id: 'post', name: 'Post profesional', icon: '💼' },
    { id: 'carrusel', name: 'Carrusel (PDF)', icon: '📄' },
    { id: 'image', name: 'Con Imagen', icon: '🖼️' }
  ],
  tk: [
    { id: 'video', name: 'Video / Reel', icon: '🎥' },
    { id: 'story', name: 'Historia', icon: '📱' }
  ]
};

let platform = 'ig', format = 'post', tone = 'Profesional', generating = false, hasResults = false;
let calYear = new Date().getFullYear(), calMonth = new Date().getMonth(), selectedDay = null;
let apiKey = localStorage.getItem('gemini_api_key') || '';

// API Modal Functions
function openApiModal() {
  const modal = document.getElementById('apiModal');
  const input = document.getElementById('api-key-input');
  input.value = apiKey;
  modal.style.display = 'flex';
}

function closeApiModal() {
  document.getElementById('apiModal').style.display = 'none';
}

function saveApiKey() {
  const input = document.getElementById('api-key-input');
  apiKey = input.value.trim();
  localStorage.setItem('gemini_api_key', apiKey);
  updateApiStatusUI();
  closeApiModal();
}

function togglePassVisibility() {
  const input = document.getElementById('api-key-input');
  const btn = document.getElementById('btnTogglePass');
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁️';
  }
}

function updateApiStatusUI() {
  const dot = document.getElementById('apiStatusDot');
  const btn = document.getElementById('btnApi');
  if (apiKey) {
    dot.classList.add('active');
    btn.style.borderColor = 'var(--green)';
    btn.querySelector('.api-btn-text').textContent = 'IA Conectada';
  } else {
    dot.classList.remove('active');
    btn.style.borderColor = 'var(--border)';
    btn.querySelector('.api-btn-text').textContent = 'Configurar API';
  }
}

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Mock posts for current month
function genMockPosts() {
  const today = new Date();
  const y = today.getFullYear(), m = today.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const ps = ['ig', 'tw', 'li', 'tk'];
  const texts = {
    ig: ['🌟 Nueva colección disponible. Cada pieza cuenta una historia. ¿Cuál es la tuya?\n\n#moda #estilo #nuevacoleccion', '✨ El éxito se construye un paso a la vez. Esta semana dimos el nuestro.\n\n#motivacion #crecimiento'],
    tw: ['Lanzamos algo nuevo hoy y estamos muy emocionados. Thread 🧵👇', 'Dato: el 73% de los usuarios prefiere contenido visual. ¿Tu marca ya lo aprovecha?'],
    li: ['Después de 3 años liderando equipos remotos, aprendí que la confianza supera al control. Aquí mis 5 claves:', 'El mercado cambió. Las marcas que no adaptan su comunicación digital quedan atrás. Hablemos de estrategia.'],
    tk: ['POV: cuando tu producto se vende solo porque tu contenido es 🔥', 'Tutorial rápido: 3 trucos para crear reels que enganchan desde el primer segundo']
  };
  const hours = ['08:00', '09:00', '10:00', '12:00', '14:00', '17:00', '19:00', '21:00'];
  const schedule = {};
  const usedDays = [];
  while (usedDays.length < 14) {
    const d = Math.floor(Math.random() * daysInMonth) + 1;
    if (!usedDays.includes(d)) usedDays.push(d);
  }
  usedDays.forEach((d, i) => {
    const p = ps[i % 4];
    const txt = texts[p][i % 2];
    if (!schedule[d]) schedule[d] = [];
    schedule[d].push({ platform: p, text: txt, time: hours[i % hours.length] });
    if (i % 3 === 0 && i > 0) {
      const p2 = ps[(i + 2) % 4];
      schedule[d].push({ platform: p2, text: texts[p2][0], time: hours[(i + 3) % hours.length] });
    }
  });
  return schedule;
}

const mockPosts = genMockPosts();

function setPlatform(p) {
  platform = p;
  document.querySelectorAll('.plat-btn').forEach(b => b.classList.toggle('active', b.dataset.p === p));
  renderFormats();
  updateCount();
}
function renderFormats() {
  const container = document.getElementById('formats');
  const formats = FORMATS_BY_PLATFORM[platform];
  container.innerHTML = formats.map(f => `
    <button class="format-btn" data-f="${f.id}" onclick="setFormat('${f.id}')">
      <span class="ficon">${f.icon}</span>
      <span>${f.name}</span>
    </button>
  `).join('');
  setFormat(formats[0].id);
}
function setFormat(f) {
  format = f;
  document.querySelectorAll('.format-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.f === f);
  });
}
function setTone(el) {
  tone = el.textContent;
  document.querySelectorAll('.tone-btn').forEach(b => b.classList.toggle('active', b === el));
}
function updateCount() {
  const ta = document.getElementById('prompt');
  const limit = LIMITS[platform];
  const remaining = limit - ta.value.length;
  const el = document.getElementById('charCount');
  el.textContent = remaining + ' restantes';
  el.className = 'char-count' + (remaining < 50 ? ' warn' : '');
}

async function generate() {
  if (generating) return;
  generating = true;
  const btn = document.getElementById('btnGen');
  document.getElementById('btnIcon').innerHTML = '<div class="spinner"></div>';
  document.getElementById('btnText').textContent = 'Generando...';
  btn.disabled = true;

  const userPrompt = document.getElementById('prompt').value || 'contenido general para mi marca';
  const limit = LIMITS[platform];
  const pName = NAMES[platform];

  const optObjective = document.getElementById('w-objective').value.trim();
  const optAudience = document.getElementById('w-audience').value.trim();
  const optBenefit = document.getElementById('w-benefit').value.trim();
  const optEngagement = document.getElementById('w-engagement').checked;

  await new Promise(r => setTimeout(r, 600));

  let promptText = `Eres un redactor creativo y estratega de contenido experto en social media.
Genera EXACTAMENTE 2 variantes de post de alto impacto para la plataforma: ${pName}.
Tono de voz solicitado: ${tone}.
Formato de publicación solicitado: ${format.toUpperCase()} (Adapta el estilo de escritura y la estructura al formato).

Tema principal: "${userPrompt}"`;

  if (optObjective) promptText += `\nObjetivo del post: ${optObjective}`;
  if (optAudience) promptText += `\nAudiencia objetivo: ${optAudience}`;
  if (optBenefit) promptText += `\nBeneficio o gancho clave: ${optBenefit}`;
  
  promptText += `\n\nInstrucciones específicas por formato:
- Si el formato es REEL o VIDEO: Estructura el post mostrando el [Gancho de 3s], el [Desarrollo del video (POV/Visuales y audio)], el [Llamado a la acción] y la descripción/caption final de manera clara.
- Si el formato es STORY: Genera una secuencia de historias consecutivas (ej. Historia 1, Historia 2, Historia 3) con ideas de stickers de interacción (encuestas, preguntas) y el texto que debe ir en cada una.
- Si el formato es CARRUSEL: Organiza el contenido diapositiva por diapositiva (Diapositiva 1: Gancho, Diapositiva 2: Valor, etc.) e incluye el caption final para el post.
- Si el formato es HILO / THREAD: Genera una secuencia ordenada de posts enumerados (1/, 2/, 3/...) cortos que quepan en el límite.
- Si el formato es POST Feed / estándar: Genera una redacción persuasiva con espacios limpios y emojis relevantes.

Límite de caracteres del post/caption: ${limit} caracteres.`;

  if (optEngagement) {
    promptText += `\n\nCRÍTICO: Finaliza obligatoriamente cada variante de post (o el caption final) con 1 o 2 preguntas interactivas y potentes relacionadas al tema para fomentar comentarios de la audiencia (engagement).`;
  }

  promptText += `\n\nResponde únicamente con un objeto JSON válido con la clave "posts" conteniendo un array de strings con las 2 variantes generadas. No agregues explicaciones externas ni markdown de código. Formato: {"posts":["variante 1","variante 2"]}`;

  let generatedPosts = null;

  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: promptText
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                posts: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                  description: "Exactly 2 post variations"
                }
              },
              required: ["posts"]
            }
          }
        })
      });
      if (response.ok) {
        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(textResponse);
        if (parsed && parsed.posts && parsed.posts.length >= 2) {
          generatedPosts = parsed.posts;
        }
      } else {
        console.error("Gemini API error status:", response.status);
      }
    } catch (e) {
      console.error("Failed to generate with Gemini API:", e);
    }
  }

  const posts = generatedPosts || generateFallbackPosts(userPrompt, platform, format, tone, optObjective, optAudience, optBenefit, optEngagement);

  renderResults(posts);
  generating = false;
  btn.disabled = false;
  document.getElementById('btnIcon').textContent = '✨';
  document.getElementById('btnText').textContent = 'Generar con IA';
  document.getElementById('btnRegen').style.display = 'block';
  hasResults = true;
}

function generateFallbackPosts(prompt, platform, format, tone, objective, audience, benefit, engagement) {
  const pName = NAMES[platform];
  const objText = objective ? `para ${objective.toLowerCase()}` : '';
  const audText = audience ? `diseñado especialmente para ${audience.toLowerCase()}` : '';
  const benText = benefit ? `Recuerda: ${benefit}.` : 'La clave está en empezar hoy mismo.';
  
  const questions = [
    `¿Qué opinás vos sobre esto? ¡Te leo en comentarios! 👇`,
    `¿Ya aplicaste esto en tu día a día? Contame abajo.`,
    `¿Cuál de estos puntos te pareció más útil? Guardá este post para no perderlo.`,
    `¿Qué otra recomendación sumarías a la lista? Comentá 👇`
  ];
  const selectedQuestion = engagement ? `\n\n💬 ${questions[Math.floor(Math.random() * questions.length)]}` : '';

  let v1 = '', v2 = '';

  if (format === 'reel' || format === 'video') {
    v1 = `🎥 [GUION DE REEL]
⏱️ Gancho (0-3s): "¿Te pasa que querés ${prompt}? Dejá de perder el tiempo y probá esto."
🎬 Visual: Aparecés señalando a la pantalla con texto llamativo.
🗣️ Voz en Off: "${benText} Con este método vas a lograrlo de forma fácil y rápida."
📝 Caption: Si estás buscando ${prompt} ${objText}, este video es para vos. ${audText}. ${selectedQuestion}`;

    v2 = `🎬 [GUION DE VIDEO / REEL]
⏱️ Gancho (0-3s): "El secreto mejor guardado sobre: ${prompt} 🤫"
🎬 Visual: Transición rápida mostrando el resultado final antes del proceso.
🗣️ Voz en Off: "Nadie te dice esto, pero la clave real es enfocarse en el valor. ${benText}"
📝 Caption: 💡 Guardá este video. ¿Sabías que podés mejorar en ${prompt}? Aquí tenés los pasos explicados en el video. ${audText}. ${selectedQuestion}`;
  } 
  
  else if (format === 'carrusel') {
    v1 = `📄 [ESTRUCTURA DE CARRUSEL]
Slide 1 (Gancho): 3 Pasos clave para ${prompt} 🚀
Slide 2: Paso 1 - Definir el problema central. Sin esto no hay avance.
Slide 3: Paso 2 - Aplicar la solución directa. ${benText}
Slide 4: Paso 3 - Medir y optimizar los resultados.
Slide 5 (CTA): ¿Cuál aplicarías hoy? ¡Comentá abajo!

📝 Caption: Te desgloso la guía definitiva de ${prompt} ${objText}. Hecho a medida ${audText}. ¡Desliza para ver el paso a paso! ${selectedQuestion}`;

    v2 = `📄 [ESTRUCTURA DE CARRUSEL]
Slide 1 (Gancho): El error N°1 que cometés al buscar ${prompt} ❌
Slide 2: Pensar que se resuelve con más esfuerzo en vez de estrategia.
Slide 3: El verdadero secreto está en la constancia.
Slide 4: Aquí tenés el cambio de mentalidad que necesitás.
Slide 5 (CTA): Guardá este post y compartí con tu equipo.

📝 Caption: Deja de cometer este error común. Esto es lo que debés hacer si pertenecés a la audiencia de ${audience || 'creadores'}. ${selectedQuestion}`;
  } 
  
  else if (format === 'story') {
    v1 = `📱 [SECUENCIA DE STORIES]
Historia 1: 🧐 ¿Alguna vez te frustró intentar ${prompt}? (Agregar sticker de encuesta: SÍ 🙋 / NO 🙅)
Historia 2: La mayoría falla porque no aplica esto: "${benText}".
Historia 3: ¡Buenas noticias! Hoy te muestro el camino simple. Deslizá hacia arriba o tocá el link en bio para ver todo. 🔗`;

    v2 = `📱 [SECUENCIA DE STORIES]
Historia 1: POV: Estás buscando ${prompt} ${objText} y por fin encontrás la solución exacta... 🎯
Historia 2: 🤔 Pregunta rápida: ¿Cuál es tu mayor obstáculo con esto hoy? (Agregar caja de preguntas de IG)
Historia 3: Mañana subo un post detallando las mejores respuestas. ¡Atentos! 🔔`;
  } 
  
  else if (format === 'hilo') {
    v1 = `1/ ¿Buscás cómo dominar ${prompt}? Hilo imperdible sobre cómo lograrlo con éxito. 👇

2/ Lo primero es entender que no hay fórmulas mágicas, sino procesos sólidos. La clave es el enfoque.

3/ Un factor vital: "${benText}". Si dominás esto, ya tenés el 80% del camino hecho.

4/ Si te sirvió este hilo, dale RT al primer tweet para ayudar a más ${audience || 'personas'}. ${selectedQuestion}`;

    v2 = `1/ El 90% de la gente falla en ${prompt} por no saber esto. Abrí hilo y tomá nota. 🧵👇

2/ El primer paso es definir con claridad tu meta: ${objective || 'crecer'}. Sin un norte claro, todo esfuerzo se diluye.

3/ Aquí tenés mi mejor consejo: centrate en el valor que entregás y sé constante.

4/ ¿Te sirvió? Seguime para más contenido sobre este tema y dejame tu opinión. ${selectedQuestion}`;
  } 
  
  else { // standard post / image
    v1 = `✨ ¿Querés mejorar en ${prompt}?

Mucha gente busca el camino rápido, pero la verdad es que el éxito radica en los detalles y la consistencia en tu estrategia.

💡 Recordá esto:
👉 ${benText}
👉 Definí a tu público objetivo (${audience || 'general'}).
👉 Mantené el enfoque en tu meta: ${objective || 'aportar valor'}.

¿Te sirvió esta información?
${selectedQuestion}`;

    v2 = `🚀 Hablemos de ${prompt}.

Si estás buscando ${objective || 'un cambio real'}, este mensaje es para vos. A veces nos abrumamos con tanta información, pero la solución suele ser simplificar.

Aquí tenés 3 puntos clave:
1️⃣ Enfocá tu mensaje en lo importante.
2️⃣ Conocé a tu audiencia.
3️⃣ Aportá valor real en cada interacción.

Compartilo con alguien que lo necesite leer hoy.
${selectedQuestion}`;
  }

  // Adjust for tone
  if (tone === 'Casual') {
    v1 = v1.replace(/usted/gi, 'vos').replace(/busque/gi, 'buscá').replace(/recuerde/gi, 'recordá');
    v2 = v2.replace(/usted/gi, 'vos').replace(/busque/gi, 'buscá').replace(/recuerde/gi, 'recordá');
  } else if (tone === 'Profesional') {
    v1 = v1.replace(/vos/gi, 'usted').replace(/querés/gi, 'quiere').replace(/probá/gi, 'pruebe').replace(/guardá/gi, 'guarde').replace(/contame/gi, 'cuénteme').replace(/opinás/gi, 'opina').replace(/te leo/gi, 'le leo');
    v2 = v2.replace(/vos/gi, 'usted').replace(/querés/gi, 'quiere').replace(/probá/gi, 'pruebe').replace(/guardá/gi, 'guarde').replace(/contame/gi, 'cuénteme').replace(/opinás/gi, 'opina').replace(/te leo/gi, 'le leo');
  } else if (tone === 'Divertido') {
    v1 = `🎉 ¡Alerta de post copado! 🎉\n\n` + v1 + `\n\n¡No te duermas! 😜`;
    v2 = `🔥 ¡Se picó! 🔥\n\n` + v2 + `\n\nCompartilo antes de que pase de moda 😂`;
  }

  return [v1, v2];
}

function renderResults(posts) {
  const col = COLORS[platform];
  const container = document.getElementById('results');
  container.innerHTML = '';
  posts.forEach((text, i) => {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.style.animationDelay = (i * 0.15) + 's';
    card.innerHTML = `
      <div class="bar" style="background:${col}"></div>
      <div class="post-content">
        <div class="post-label" style="color:${col}">${NAMES[platform]} · Variante ${i + 1}</div>
        <pre class="post-text">${escHtml(text)}</pre>
        <button class="btn-copy" onclick="copyPost(this,'${escHtml(text).replace(/'/g, "\\'")}')">Copiar</button>
      </div>`;
    container.appendChild(card);
  });
}

function copyPost(btn, text) {
  navigator.clipboard.writeText(text.replace(/\\n/g, '\n'));
  btn.textContent = '✓ Copiado';
  btn.className = 'btn-copy copied';
  setTimeout(() => { btn.textContent = 'Copiar'; btn.className = 'btn-copy'; }, 2000);
}

function escHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// CALENDAR
function renderCalendar() {
  const title = MONTHS_ES[calMonth] + ' ' + calYear;
  document.getElementById('calTitle').textContent = title;

  const daysEl = document.getElementById('calDays');
  daysEl.innerHTML = DAYS_ES.map(d => `<div class="day-name">${d}</div>`).join('');

  const first = new Date(calYear, calMonth, 1).getDay();
  const total = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === calYear && today.getMonth() === calMonth;

  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';

  for (let i = 0; i < first; i++) {
    const e = document.createElement('button');
    e.className = 'day-btn empty';
    grid.appendChild(e);
  }

  const monthPosts = getMonthPosts();

  for (let d = 1; d <= total; d++) {
    const btn = document.createElement('button');
    const isToday = isCurrentMonth && today.getDate() === d;
    const isSel = selectedDay === d;
    btn.className = 'day-btn' + (isToday ? ' today' : '') + (isSel && !isToday ? ' selected' : '');
    const posts = monthPosts[d] || [];
    const dots = posts.slice(0, 4).map(p => `<div class="day-dot" style="background:${COLORS[p.platform]}"></div>`).join('');
    btn.innerHTML = `<span class="day-num">${d}</span><div class="day-dots">${dots}</div>`;
    btn.onclick = () => selectDay(d);
    grid.appendChild(btn);
  }

  // stats
  const allPostDays = Object.keys(monthPosts).filter(k => monthPosts[k].length > 0);
  const totalPosts = Object.values(monthPosts).reduce((a, v) => a + v.length, 0);
  document.getElementById('calStats').innerHTML = `
    <div class="mini-stat"><div class="mini-stat-val">${totalPosts}</div><div class="mini-stat-label">Posts programados</div></div>
    <div class="mini-stat"><div class="mini-stat-val">${allPostDays.length}</div><div class="mini-stat-label">Días con posts</div></div>`;

  if (selectedDay) renderDayDetail(selectedDay);
  else document.getElementById('dayDetail').innerHTML = '';
}

function getMonthPosts() {
  const today = new Date();
  if (calYear === today.getFullYear() && calMonth === today.getMonth()) return mockPosts;
  return {};
}

function selectDay(d) {
  selectedDay = selectedDay === d ? null : d;
  renderCalendar();
}

function renderDayDetail(d) {
  const posts = (getMonthPosts()[d] || []);
  const dateStr = `${d} de ${MONTHS_ES[calMonth]}`;
  const det = document.getElementById('dayDetail');
  if (posts.length === 0) {
    det.innerHTML = `<div class="day-detail"><div class="detail-header">${dateStr}</div><div class="empty-state"><div class="empty-icon">📭</div><p>No hay posts programados</p><button class="btn-add">+ Agregar post</button></div></div>`;
    return;
  }
  const items = posts.map(p => `
    <div class="detail-post">
      <div class="detail-icon" style="background:${COLORS[p.platform]}22">${ICONS[p.platform]}</div>
      <div class="detail-body">
        <div class="detail-plat" style="color:${COLORS[p.platform]}">${NAMES[p.platform]}</div>
        <div class="detail-text">${p.text.split('\n')[0]}</div>
        <div class="detail-time">🕐 ${p.time}</div>
      </div>
    </div>`).join('');
  det.innerHTML = `<div class="day-detail"><div class="detail-header">${dateStr} · ${posts.length} post${posts.length > 1 ? 's' : ''}</div>${items}</div>`;
}

function prevMonth() {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  selectedDay = null;
  renderCalendar();
}
function nextMonth() {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  selectedDay = null;
  renderCalendar();
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.getElementById('panelGen').classList.toggle('tab-active', tab === 'gen');
  document.getElementById('panelCal').classList.toggle('tab-active', tab === 'cal');
}

// init
renderCalendar();
renderFormats();
updateApiStatusUI();
updateCount();

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        console.log('Service Worker registrado con éxito. Scope:', reg.scope);
      })
      .catch((err) => {
        console.error('Error al registrar el Service Worker:', err);
      });
  });
}