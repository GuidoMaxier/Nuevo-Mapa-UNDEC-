const subjects = [
  // AÑO 1 - CUATRIMESTRE 1
  { id: 111, name: "Matemática I",                      year: 1, sem: 1, prereqsCursar: [], prereqsRendir: [] },
  { id: 112, name: "Algoritmos y Estructuras de Datos", year: 1, sem: 1, prereqsCursar: [], prereqsRendir: [] },
  { id: 113, name: "Inglés",                            year: 1, sem: 1, prereqsCursar: [], prereqsRendir: [] },
  { id: 114, name: "Sistemas I",                        year: 1, sem: 1, prereqsCursar: [], prereqsRendir: [] },
  // AÑO 1 - CUATRIMESTRE 2
  { id: 121, name: "Bases de Datos I - Relacional",         year: 1, sem: 2, prereqsCursar: [114], prereqsRendir: [114] },
  { id: 122, name: "Programación Orientada a Objetos",      year: 1, sem: 2, prereqsCursar: [112], prereqsRendir: [112] },
  { id: 123, name: "Arquitectura de Computadoras",          year: 1, sem: 2, prereqsCursar: [],    prereqsRendir: [] },
  { id: 124, name: "Ética y Legislación",                   year: 1, sem: 2, prereqsCursar: [],    prereqsRendir: [] },
  // AÑO 2 - CUATRIMESTRE 1
  { id: 211, name: "Bases de Datos II - No Relacionales",   year: 2, sem: 1, prereqsCursar: [121],      prereqsRendir: [121] },
  { id: 212, name: "Sistemas Operativos",                   year: 2, sem: 1, prereqsCursar: [123],      prereqsRendir: [123] },
  { id: 213, name: "Diseño de Aplicaciones Web I",          year: 2, sem: 1, prereqsCursar: [122],      prereqsRendir: [122] },
  { id: 214, name: "Tecnología de Comunicaciones",          year: 2, sem: 1, prereqsCursar: [123],      prereqsRendir: [123] },
  // AÑO 2 - CUATRIMESTRE 2
  { id: 221, name: "Diseño de Aplicaciones Web II",         year: 2, sem: 2, prereqsCursar: [213], prereqsRendir: [213] },
  { id: 222, name: "Seguridad y Testing en Apps Web",       year: 2, sem: 2, prereqsCursar: [213], prereqsRendir: [213] },
  { id: 223, name: "Desarrollo Móvil",                      year: 2, sem: 2, prereqsCursar: [213], prereqsRendir: [213] },
  { id: 224, name: "Taller Integrador",                     year: 2, sem: 2, prereqsCursar: [111, 112, 113, 114, 121, 122, 123, 124], prereqsRendir: [111, 112, 113, 114, 121, 122, 123, 124, 211, 212, 213, 214] },
];

const horariosIniciales = [
  { materia: "Arquitectura de Computadoras", dia: "Lunes", inicio: "18:00", fin: "20:00", modalidad: "Virtual" },
  { materia: "Bases de Datos I - Relacional", dia: "Lunes", inicio: "20:00", fin: "22:00", modalidad: "Virtual" },
  { materia: "Ética y Legislación", dia: "Martes", inicio: "20:00", fin: "22:00", modalidad: "Virtual" },
  { materia: "Programación Orientada a Objetos", dia: "Miércoles", inicio: "18:00", fin: "20:00", modalidad: "Virtual" }
];

const unlocks = {};
subjects.forEach(s => { unlocks[s.id] = []; });
subjects.forEach(s => {
  const allPrereqs = [...new Set([...s.prereqsCursar, ...s.prereqsRendir])];
  allPrereqs.forEach(p => {
    if (!unlocks[p].includes(s.id)) unlocks[p].push(s.id);
  });
});

function getSubject(id) { return subjects.find(s => s.id === id); }

// Escapa texto de usuario antes de insertarlo en HTML (defensa contra XSS/roturas)
function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

const yearColors  = { 1: 'y1', 2: 'y2' };
const yearAccents = { 1: '#00d4ff', 2: '#00ff9d' };

let estudiante = null;
let activeId = null;
let fechaCalendario = new Date();
let tabAdminActiva = 'horarios';

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

function mostrarHorarios() {
  if (!estudiante) return;
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  dias.forEach(dia => {
    const contenedor = document.querySelector(`.dia-contenido[data-dia="${dia}"]`);
    if (!contenedor) return;

    contenedor.innerHTML = "";

    const listaHorarios = estudiante.horarios || [];
    const horariosDelDia = listaHorarios.filter(horario => horario.dia === dia);

    if (horariosDelDia.length === 0) {
      contenedor.innerHTML = `<div class="dia-vacio">Sin clases</div>`;
      return;
    }

    horariosDelDia.sort((a, b) => a.inicio.localeCompare(b.inicio));

    horariosDelDia.forEach(horario => {
      const clase = document.createElement("div");
      clase.className = "clase-agenda";

      clase.innerHTML = `
        <div class="clase-hora">${esc(horario.inicio)} — ${esc(horario.fin)}</div>
        <div class="clase-materia">${esc(horario.materia)}</div>
        <div class="clase-modalidad">${esc(horario.modalidad)}</div>
      `;

      const materia = subjects.find(subject => subject.name === horario.materia);
      if (materia) {
        clase.onclick = () => showDetail(materia.id);
      }

      contenedor.appendChild(clase);
    });
  });
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

function registrar() {
  let nombre = document.getElementById("nombre").value;
  let apellido = document.getElementById("apellido").value;
  if (nombre === "" || apellido === "") {
    alert("Por favor completá nombre y apellido");
    return;
  }
  
  let nuevoEstudiante = {
    id: Date.now(),
    nombre,
    apellido,
    materias: { aprobadas: [], sin_cursar: [], cursando: [], reprobadas: [] },
    horarios: [...horariosIniciales],
    evaluaciones: []
  };

  subjects.forEach(s => nuevoEstudiante.materias.sin_cursar.push(s.id));
  let usuarios = JSON.parse(localStorage.getItem("usuarios_dw")) || [];
  usuarios.push(nuevoEstudiante);
  localStorage.setItem("usuarios_dw", JSON.stringify(usuarios));
  localStorage.setItem("usuarioActivo_dw", nuevoEstudiante.id);
  location.reload();
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

function mostrarMapa() {
  document.getElementById("pantallaLogin").style.display = "none";
  document.getElementById("mapaMaterias").style.display = "none";
  document.getElementById("pantallaHorarios").style.display = "none";
  document.getElementById("menuPrincipal").style.display = "flex";
}

function entrarMaterias() {
  document.getElementById("menuPrincipal").style.display = "none";
  document.getElementById("mapaMaterias").style.display = "block";

  buildMap();
  actualizarEstilosMaterias();
  actualizarContadores();
}

function entrarHorarios() {
  document.getElementById("menuPrincipal").style.display = "none";
  document.getElementById("pantallaHorarios").style.display = "block";

  mostrarHorarios();
  renderizarCalendario();
}

function volverMenu() {
  document.getElementById("mapaMaterias").style.display = "none";
  document.getElementById("pantallaHorarios").style.display = "none";
  document.getElementById("menuPrincipal").style.display = "flex";
}

function poblarSelectMaterias() {
  const select = document.getElementById("selectMateria");
  const selectEval = document.getElementById("selectMateriaEval");
  
  if (select) {
    select.innerHTML = "";
    subjects.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.name;
      opt.textContent = s.name;
      select.appendChild(opt);
    });
  }

  if (selectEval) {
    selectEval.innerHTML = "";
    subjects.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.name;
      opt.textContent = s.name;
      selectEval.appendChild(opt);
    });
  }
}

function abrirPanelEdicionHorarios() {
  poblarSelectMaterias();
  cambiarTabAdmin(tabAdminActiva);
  resetearFormularioHorario();
  
  const overlay = document.getElementById("overlayHorarios");
  const modal = document.getElementById("modalEdicionHorarios");

  if (overlay) overlay.classList.add("visible");
  if (modal) modal.classList.add("visible");
}

function cerrarPanelEdicionHorarios() {
  const overlay = document.getElementById("overlayHorarios");
  const modal = document.getElementById("modalEdicionHorarios");

  if (overlay) overlay.classList.remove("visible");
  if (modal) modal.classList.remove("visible");
  resetearFormularioHorario();
}

function resetearFormularioHorario() {
  const inputEdit = document.getElementById("horarioEditIndex");
  if (inputEdit) inputEdit.value = "-1";

  const formH = document.getElementById("formHorario");
  if (formH) formH.reset();

  const formEval = document.getElementById("formEvaluacion");
  if (formEval) formEval.reset();

  const titulo = document.getElementById("tituloFormHorario");
  if (titulo) titulo.textContent = "// AGREGAR NUEVA CLASE";

  const btnG = document.getElementById("btnGuardarHorario");
  if (btnG) btnG.textContent = "+ Agregar Clase";

  const btnC = document.getElementById("btnCancelarEdicion");
  if (btnC) btnC.style.display = "none";
}

function renderizarListaHorariosAdmin() {
  const contenedor = document.getElementById("contenedorListaHorarios");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  if (!estudiante || !estudiante.horarios || estudiante.horarios.length === 0) {
    contenedor.innerHTML = `<div style="color:var(--muted); font-size:11px; font-family:'Share Tech Mono'; text-align:center; padding:10px;">No tenés clases cargadas.</div>`;
    return;
  }

  estudiante.horarios.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item-horario-admin";
    div.innerHTML = `
      <div class="item-horario-info">
        <span class="item-horario-titulo">${esc(item.materia)}</span>
        <span class="item-horario-sub">${esc(item.dia)} | ${esc(item.inicio)} - ${esc(item.fin)} | ${esc(item.modalidad)}</span>
      </div>
      <div class="item-horario-acciones">
        <button class="btn-item-edit" onclick="cargarHorarioParaEditar(${index})">✎</button>
        <button class="btn-item-del" onclick="eliminarHorarioDirecto(${index})">🗑</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

function guardarHorario(e) {
  e.preventDefault();

  const editIndex = parseInt(document.getElementById("horarioEditIndex").value);
  const materia = document.getElementById("selectMateria").value;
  const dia = document.getElementById("selectDia").value;
  const modalidad = document.getElementById("selectModalidad").value;
  const inicio = document.getElementById("inputInicio").value;
  const fin = document.getElementById("inputFin").value;

  if (inicio >= fin) {
    alert("La hora de inicio debe ser anterior a la hora de fin.");
    return;
  }

  const nuevoHorario = { materia, dia, inicio, fin, modalidad };

  if (editIndex === -1) {
    estudiante.horarios.push(nuevoHorario);
  } else {
    estudiante.horarios[editIndex] = nuevoHorario;
  }

  guardarEstudianteEnLocalStorage();
  mostrarHorarios();
  renderizarCalendario();
  renderizarListaHorariosAdmin();
  resetearFormularioHorario();
}

function cargarHorarioParaEditar(index) {
  const h = estudiante.horarios[index];
  if (!h) return;

  document.getElementById("horarioEditIndex").value = index;
  document.getElementById("selectMateria").value = h.materia;
  document.getElementById("selectDia").value = h.dia;
  document.getElementById("selectModalidad").value = h.modalidad;
  document.getElementById("inputInicio").value = h.inicio;
  document.getElementById("inputFin").value = h.fin;

  const titulo = document.getElementById("tituloFormHorario");
  if (titulo) titulo.textContent = "// EDITAR CLASE SELECCIONADA";
  
  const btnG = document.getElementById("btnGuardarHorario");
  if (btnG) btnG.textContent = "✓ Guardar Cambios";

  const btnC = document.getElementById("btnCancelarEdicion");
  if (btnC) btnC.style.display = "inline-block";
}

function eliminarHorarioDirecto(index) {
  if (confirm("¿Seguro que querés eliminar esta clase?")) {
    estudiante.horarios.splice(index, 1);
    guardarEstudianteEnLocalStorage();
    mostrarHorarios();
    renderizarCalendario();
    renderizarListaHorariosAdmin();
  }
}

function cambiarTabAdmin(tab) {
  tabAdminActiva = tab;
  const formH = document.getElementById("formHorario");
  const formE = document.getElementById("formEvaluacion");
  const btnH = document.getElementById("tabHorarios");
  const btnE = document.getElementById("tabEvaluaciones");
  const tituloList = document.getElementById("tituloListaAdmin");

  if (tab === 'horarios') {
    if (formH) formH.style.display = "block";
    if (formE) formE.style.display = "none";
    if (btnH) btnH.classList.add("active");
    if (btnE) btnE.classList.remove("active");
    if (tituloList) tituloList.textContent = "// MIS CLASES CARGADAS";
    renderizarListaHorariosAdmin();
  } else {
    if (formH) formH.style.display = "none";
    if (formE) formE.style.display = "block";
    if (btnH) btnH.classList.remove("active");
    if (btnE) btnE.classList.add("active");
    if (tituloList) tituloList.textContent = "// EVALUACIONES PROGRAMADAS";
    renderizarListaEvaluacionesAdmin();
  }
}

function guardarEvaluacion(e) {
  e.preventDefault();

  if (!estudiante.evaluaciones) {
    estudiante.evaluaciones = [];
  }

  const materia = document.getElementById("selectMateriaEval").value;
  const tipo = document.getElementById("selectTipoEval").value;
  const fecha = document.getElementById("inputFechaEval").value;
  const nota = document.getElementById("inputNotaEval").value;

  const nuevaEval = { id: Date.now(), materia, tipo, fecha, nota };

  estudiante.evaluaciones.push(nuevaEval);
  guardarEstudianteEnLocalStorage();
  
  const formEval = document.getElementById("formEvaluacion");
  if (formEval) formEval.reset();

  renderizarListaEvaluacionesAdmin();
  renderizarCalendario();
}

function renderizarListaEvaluacionesAdmin() {
  const contenedor = document.getElementById("contenedorListaHorarios");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  if (!estudiante || !estudiante.evaluaciones || estudiante.evaluaciones.length === 0) {
    contenedor.innerHTML = `<div style="color:var(--muted); font-size:11px; font-family:'Share Tech Mono'; text-align:center; padding:10px;">No tenés evaluaciones cargadas.</div>`;
    return;
  }

  estudiante.evaluaciones.sort((a,b) => a.fecha.localeCompare(b.fecha)).forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item-horario-admin";
    div.innerHTML = `
      <div class="item-horario-info">
        <span class="item-horario-titulo">${esc(item.tipo)}: ${esc(item.materia)}</span>
        <span class="item-horario-sub">Fecha: ${esc(item.fecha)}${item.nota ? ' | ' + esc(item.nota) : ''}</span>
      </div>
      <div class="item-horario-acciones">
        <button class="btn-item-del" onclick="eliminarEvaluacionDirecto(${index})">🗑</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

function eliminarEvaluacionDirecto(index) {
  if (confirm("¿Seguro que querés eliminar esta evaluación?")) {
    estudiante.evaluaciones.splice(index, 1);
    guardarEstudianteEnLocalStorage();
    renderizarListaEvaluacionesAdmin();
    renderizarCalendario();
  }
}

function cambiarVistaHorarios(vista) {
  const contenedor = document.getElementById("pantallaHorarios");
  if (!contenedor) return;

  const esCalendario = vista === 'calendario';
  contenedor.classList.toggle('vista-calendario-activa', esCalendario);

  const btnAgenda = document.getElementById("btnVistaAgenda");
  const btnCal = document.getElementById("btnVistaCalendario");
  if (btnAgenda) btnAgenda.classList.toggle("active", !esCalendario);
  if (btnCal) btnCal.classList.toggle("active", esCalendario);

  if (esCalendario) renderizarCalendario();
}

function cambiarMes(delta) {
  fechaCalendario = new Date(
    fechaCalendario.getFullYear(),
    fechaCalendario.getMonth() + delta,
    1
  );
  renderizarCalendario();
}

function renderizarCalendario() {
  const grid = document.getElementById("calGridDias");
  const titulo = document.getElementById("calTituloMes");
  if (!grid || !titulo) return;

  grid.innerHTML = "";

  const año = fechaCalendario.getFullYear();
  const mes = fechaCalendario.getMonth();

  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  titulo.textContent = `${nombresMeses[mes]} ${año}`;

  const primerDiaMes = new Date(año, mes, 1).getDay();
  const totalDiasMes = new Date(año, mes + 1, 0).getDate();
  const totalDiasMesAnterior = new Date(año, mes, 0).getDate();

  const fechaHoy = new Date();

  for (let i = primerDiaMes; i > 0; i--) {
    const div = document.createElement("div");
    div.className = "cal-dia fuera-mes";
    div.innerHTML = `<span class="cal-num-dia">${totalDiasMesAnterior - i + 1}</span>`;
    grid.appendChild(div);
  }

  for (let d = 1; d <= totalDiasMes; d++) {
    const div = document.createElement("div");
    div.className = "cal-dia";

    if (
      d === fechaHoy.getDate() &&
      mes === fechaHoy.getMonth() &&
      año === fechaHoy.getFullYear()
    ) {
      div.classList.add("hoy");
    }

    div.innerHTML = `<span class="cal-num-dia">${d}</span>`;

    const fechaISO = `${año}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const fechaActual = new Date(año, mes, d);
    const diasMapa = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const nombreDiaActual = diasMapa[fechaActual.getDay()];

    if (estudiante && estudiante.evaluaciones) {
      const evsDelDia = estudiante.evaluaciones.filter(e => e.fecha === fechaISO);
      evsDelDia.forEach(ev => {
        const itemEv = document.createElement("div");
        itemEv.className = "cal-evento evaluacion";
        itemEv.title = `${ev.tipo} - ${ev.materia}: ${ev.nota}`;
        itemEv.textContent = `📝 ${ev.tipo}: ${ev.materia}`;
        div.appendChild(itemEv);
      });
    }

    if (estudiante && estudiante.horarios) {
      const clasesDelDia = estudiante.horarios.filter(h => h.dia === nombreDiaActual);
      clasesDelDia.forEach(c => {
        const itemClase = document.createElement("div");
        itemClase.className = "cal-evento";
        itemClase.title = `${c.materia} (${c.inicio} - ${c.fin})`;
        itemClase.textContent = `${c.inicio} ${c.materia}`;
        div.appendChild(itemClase);
      });
    }

    grid.appendChild(div);
  }
}

function guardarEstudianteEnLocalStorage() {
  if (!estudiante) return;
  let usuarios = JSON.parse(localStorage.getItem("usuarios_dw")) || [];
  let idx = usuarios.findIndex(u => u.id === estudiante.id);
  if (idx !== -1) {
    usuarios[idx] = estudiante;
    localStorage.setItem("usuarios_dw", JSON.stringify(usuarios));
  }
}

if (localStorage.getItem("usuarioActivo_dw")) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios_dw")) || [];
  let idActivo = parseInt(localStorage.getItem("usuarioActivo_dw"));
  estudiante = usuarios.find(u => u.id === idActivo);

  if (estudiante) {
    if (!estudiante.horarios) estudiante.horarios = [...horariosIniciales];
    if (!estudiante.evaluaciones) estudiante.evaluaciones = [];

    guardarEstudianteEnLocalStorage();
    buildMap();
    actualizarEstilosMaterias(); 
    mostrarMapa();
  }
} else {
  const pLogin = document.getElementById("pantallaLogin");
  const pMapa = document.getElementById("mapaMaterias");
  if (pLogin) pLogin.style.display = "flex";
  if (pMapa) pMapa.style.display = "none";
}

function cerrarSesion() {
  localStorage.removeItem("usuarioActivo_dw");
  location.reload();
}

function mostrarUsuarios() {
  let usuarios = JSON.parse(localStorage.getItem("usuarios_dw")) || [];
  if (usuarios.length === 0) {
    alert("No existen usuarios registrados");
  } else {
    const lista = document.getElementById("listaUsuarios");
    const btnYaTengo = document.getElementById("yaTengoBtn");
    if (btnYaTengo) btnYaTengo.style.display = "none";
    if (lista) {
      lista.innerHTML = "";
      for (let usuario of usuarios) {
        const btn = document.createElement("button");
        btn.className = "usuario-btn";
        btn.textContent = `${usuario.nombre} ${usuario.apellido}`;
        btn.onclick = function() {
          localStorage.setItem("usuarioActivo_dw", usuario.id);
          location.reload();
        };
        lista.appendChild(btn);
      }
    }
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('PWA Service Worker listo.'))
      .catch((err) => console.error('Error en Service Worker:', err));
  });
}