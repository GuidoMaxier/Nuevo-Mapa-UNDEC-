// horarios.js — agenda semanal, calendario, evaluaciones y panel de administración
const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

let fechaCalendario = new Date();
let tabAdminActiva = 'horarios';

// Construye las columnas de la agenda semanal (una por día hábil)
function construirAgendaSemanal() {
  const agenda = document.getElementById("agendaSemanal");
  if (!agenda || agenda.querySelector(".columna-dia")) return;

  DIAS_SEMANA.forEach(dia => {
    const columna = document.createElement("div");
    columna.className = "columna-dia";

    const header = document.createElement("div");
    header.className = "dia-header";
    header.textContent = dia;

    const contenido = document.createElement("div");
    contenido.className = "dia-contenido";
    contenido.setAttribute("data-dia", dia);

    columna.appendChild(header);
    columna.appendChild(contenido);
    agenda.appendChild(columna);
  });
}

function mostrarHorarios() {
  if (!estudiante) return;

  DIAS_SEMANA.forEach(dia => {
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
