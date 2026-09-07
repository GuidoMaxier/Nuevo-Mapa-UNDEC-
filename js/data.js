// data.js — plan de estudios y horarios iniciales (datos puros)
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
