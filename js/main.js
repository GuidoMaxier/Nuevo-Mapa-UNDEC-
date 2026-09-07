// main.js — login, navegación entre pantallas, arranque de sesión y Service Worker
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