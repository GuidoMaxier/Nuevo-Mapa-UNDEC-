// mapa.js — mapa de correlativas, detalle de materia y estados
const yearColors  = { 1: 'y1', 2: 'y2' };
const yearAccents = { 1: '#00d4ff', 2: '#00ff9d' };

let activeId = null;

function buildMap() {
  const grid = document.getElementById('yearsGrid');
  if (!grid) return;
  grid.innerHTML = "";
  for (let y = 1; y <= 2; y++) {
    const col = document.createElement('div');
    col.className = `year-col ${yearColors[y]}`;
    col.innerHTML = `<div class="year-header" style="color:${yearAccents[y]};border-color:${yearAccents[y]}">Año ${y}</div>`;
    for (let sem = 1; sem <= 2; sem++) {
      const group = document.createElement('div');
      group.className = 'semester-group';
      group.style.borderColor = `${yearAccents[y]}33`;
      group.innerHTML = `<div class="semester-label">${sem === 1 ? '1er' : '2do'} Cuatrimestre</div>`;
      const subs = subjects.filter(s => s.year === y && s.sem === sem);
      subs.forEach(s => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.id = `card-${s.id}`;
        const allPrereqs = [...new Set([...s.prereqsCursar, ...s.prereqsRendir])];
        const freeLabel = allPrereqs.length === 0 ? '<span class="badge badge-free">Libre</span>' : '';
        const prereqLabel = allPrereqs.length > 0 ? `<span class="badge badge-prereq">Req: ${allPrereqs.join(', ')}</span>` : '';
        const unlocksLabel = unlocks[s.id].length > 0 ? `<span class="badge badge-unlocks">→ ${unlocks[s.id].join(', ')}</span>` : '';
        card.innerHTML = `
          <div class="card-num">${s.id}</div>
          <div class="card-info">
            <div class="card-name">${s.name}</div>
            <div class="card-meta">
              ${freeLabel}${prereqLabel}${unlocksLabel}
            </div>
          </div>`;
        card.addEventListener('click', () => showDetail(s.id));
        group.appendChild(card);
      });
      col.appendChild(group);
    }
    grid.appendChild(col);
  }
}

function highlightRelated(id) {
  const s = getSubject(id);
  const allPrereqs = [...new Set([...s.prereqsCursar, ...s.prereqsRendir])];
  const prereqSet = new Set(allPrereqs);
  const unlocksSet = new Set(unlocks[id]);
  subjects.forEach(sub => {
    const card = document.getElementById(`card-${sub.id}`);
    if (!card) return;
    card.classList.remove('highlighted', 'prereq', 'unlocks', 'dimmed');
    if (sub.id === id) card.classList.add('highlighted');
    else if (prereqSet.has(sub.id)) card.classList.add('prereq');
    else if (unlocksSet.has(sub.id)) card.classList.add('unlocks');
    else card.classList.add('dimmed');
  });
}

function clearHighlights() {
  subjects.forEach(sub => {
    const card = document.getElementById(`card-${sub.id}`);
    if (!card) return;
    card.classList.remove('highlighted', 'prereq', 'unlocks', 'dimmed');
  });
}

function showDetail(id) {
  activeId = id;
  const s = getSubject(id);
  highlightRelated(id);
  updateStateButtons(id);

  document.getElementById('dNum').textContent = s.id;
  document.getElementById('dName').textContent = s.name;
  document.getElementById('dMeta').textContent = `AÑO ${s.year}  ·  ${s.sem === 1 ? '1° CUATRIMESTRE' : '2° CUATRIMESTRE'}`;

  const cursarSec = document.getElementById('dCursarSection');
  if (s.prereqsCursar.length > 0) {
    const pills = s.prereqsCursar.map(pid => {
      const ps = getSubject(pid);
      return `<div class="detail-pill pill-prereq" onclick="showDetail(${pid})"><span class="pill-num">${pid}</span><span class="pill-name">${ps.name}</span></div>`;
    }).join('');
    cursarSec.innerHTML = `<div class="detail-section-title">Para cursar (regular)</div><div class="detail-pills">${pills}</div>`;
  } else {
    cursarSec.innerHTML = `<div class="detail-section-title">Para cursar</div><div class="detail-pills"><div class="detail-pill" style="background:rgba(255,255,255,0.03);border:1px solid #1a3a5c;color:#4a7a9b">Sin requisitos — libre cursada</div></div>`;
  }

  const rendirSec = document.getElementById('dRendirSection');
  if (s.prereqsRendir.length > 0) {
    const pills = s.prereqsRendir.map(pid => {
      const ps = getSubject(pid);
      return `<div class="detail-pill pill-rendir" onclick="showDetail(${pid})"><span class="pill-num">${pid}</span><span class="pill-name">${ps.name}</span></div>`;
    }).join('');
    rendirSec.innerHTML = `<div class="detail-section-title">Para rendir (aprobada)</div><div class="detail-pills">${pills}</div>`;
  } else {
    rendirSec.innerHTML = `<div class="detail-section-title">Para rendir</div><div class="detail-pills"><div class="detail-pill" style="background:rgba(255,255,255,0.03);border:1px solid #1a3a5c;color:#4a7a9b">Sin requisitos previos</div></div>`;
  }

  const unlocksSec = document.getElementById('dUnlocksSection');
  const ul = unlocks[id];
  if (ul.length > 0) {
    const pills = ul.map(uid => {
      const us = getSubject(uid);
      return `<div class="detail-pill pill-unlocks" onclick="showDetail(${uid})"><span class="pill-num">${uid}</span><span class="pill-name">${us.name}</span></div>`;
    }).join('');
    unlocksSec.innerHTML = `<div class="detail-section-title">Al aprobar, desbloquea</div><div class="detail-pills">${pills}</div>`;
  } else {
    unlocksSec.innerHTML = `<div class="detail-section-title">Al aprobar, desbloquea</div><div class="detail-pills"><div class="detail-pill" style="background:rgba(255,255,255,0.03);border:1px solid #1a3a5c;color:#4a7a9b">No desbloquea otras materias</div></div>`;
  }

  document.getElementById('overlay').classList.add('visible');
  document.getElementById('detailPanel').classList.add('visible');
}

function closeDetail() {
  activeId = null;
  clearHighlights();
  document.getElementById('overlay').classList.remove('visible');
  document.getElementById('detailPanel').classList.remove('visible');
}

function setMateriaState(nuevoEstado) {
  if (!activeId || !estudiante) return;
  const s = getSubject(activeId);

  if (nuevoEstado === "cursando") {
    const faltantes = s.prereqsCursar.filter(id =>
      !estudiante.materias.aprobadas.includes(id) &&
      !estudiante.materias.cursando.includes(id)
    );
    if (faltantes.length > 0) {
      const nombres = faltantes.map(id => getSubject(id).name);
      alert(`Para cursar esta materia primero debés regularizar:\n${nombres.join(", ")}`);
      return;
    }
  }

  if (nuevoEstado === "aprobadas") {
    const faltantes = s.prereqsRendir.filter(id =>
      !estudiante.materias.aprobadas.includes(id)
    );
    if (faltantes.length > 0) {
      const nombres = faltantes.map(id => getSubject(id).name);
      alert(`Para aprobar esta materia primero debés tener aprobadas:\n${nombres.join(", ")}`);
      return;
    }
  }

  for (let key in estudiante.materias) {
    estudiante.materias[key] = estudiante.materias[key].filter(id => id !== activeId);
  }
  estudiante.materias[nuevoEstado].push(activeId);

  guardarEstudianteEnLocalStorage();
  actualizarEstilosMaterias();
  updateStateButtons(activeId);
  actualizarContadores();
}

function updateStateButtons(id) {
  if (!estudiante) return;
  document.querySelectorAll('.state-btn').forEach(btn => btn.classList.remove('active'));
  let estadoActual = 'sin_cursar';
  if (estudiante.materias.aprobadas.includes(id)) estadoActual = 'aprobadas';
  else if (estudiante.materias.cursando.includes(id)) estadoActual = 'cursando';
  else if (estudiante.materias.reprobadas.includes(id)) estadoActual = 'reprobadas';
  const btnActivo = document.querySelector(`.state-btn[data-state="${estadoActual}"]`);
  if (btnActivo) btnActivo.classList.add('active');
}

function actualizarEstilosMaterias() {
  if (!estudiante) return;
  subjects.forEach(m => {
    const card = document.getElementById(`card-${m.id}`);
    if (!card) return;
    card.classList.remove('state-aprobadas', 'state-cursando', 'state-reprobadas');
    if (estudiante.materias.aprobadas.includes(m.id)) card.classList.add('state-aprobadas');
    else if (estudiante.materias.cursando.includes(m.id)) card.classList.add('state-cursando');
    else if (estudiante.materias.reprobadas.includes(m.id)) card.classList.add('state-reprobadas');
  });
}

function actualizarContadores() {
  if (!estudiante) return;
  const numAprobadas = estudiante.materias.aprobadas.length;
  document.getElementById('statAprobadas').textContent = `${numAprobadas} / 16`;
}
