// storage.js — estado del estudiante y persistencia en localStorage
let estudiante = null;

function guardarEstudianteEnLocalStorage() {
  if (!estudiante) return;
  let usuarios = JSON.parse(localStorage.getItem("usuarios_dw")) || [];
  let idx = usuarios.findIndex(u => u.id === estudiante.id);
  if (idx !== -1) {
    usuarios[idx] = estudiante;
    localStorage.setItem("usuarios_dw", JSON.stringify(usuarios));
  }
}
