# 🗺️ Mapa de Correlativas — Tecnicatura en Desarrollo Web (UNdeC)

**Mapa interactivo de correlativas + agenda de horarios y evaluaciones** para estudiantes de la **Tecnicatura en Desarrollo Web** de la **Universidad Nacional de Chilecito (UNdeC)**.

Aplicación web progresiva (PWA) 100 % estática: sin backend, sin framework y sin build — se sirve tal cual desde cualquier hosting estático (GitHub Pages, Vercel, Netlify…).

---

## ¿Qué es?

Una herramienta de estudio y planificación pensada para resolver una pregunta muy concreta del cursado: *"¿qué materias puedo cursar o rendir si ya tengo aprobadas/regularizadas estas?"*.

- **Mapa de correlativas interactivo**: las 16 materias del plan (2 años / 4 cuatrimestres) organizadas visualmente. Al hacer clic en una materia se muestra:
  - qué correlativas pide **para cursar** (regularizar),
  - qué pide **para rendir** (aprobar),
  - qué materias **desbloquea** al aprobarla.
- **Estado por materia**: cada alumno marca sus materias como *sin cursar / cursando / aprobada / reprobada*; la app valida las correlativas y bloquea estados imposibles (p. ej. aprobar sin tener la correlativa).
- **Agenda semanal** editable por alumno: día, horario y modalidad (virtual / presencial / híbrida) de cada clase.
- **Calendario mensual** con las clases recurrentes de la semana y las **evaluaciones** cargadas (parciales, recuperatorios, entregas/TP y finales).
- **Multi-alumno local**: cada persona registra su nombre/apellido y tiene su propio progreso. Los datos se guardan en `localStorage` del navegador (no salen del dispositivo).
- **PWA instalable**: funciona sin conexión (precache de Service Worker) y se puede "instalar" en el celular o la computadora.

> ⚠️ Al ser datos locales (`localStorage`), cada navegador/perfil guarda sus propios usuarios. No hay sincronización en la nube ni contraseñas (es una app personal/para compartir un dispositivo con cuidado).

---

## ¿Cómo surgió?

El proyecto nació como un proyecto personal de **Natanael Valdovinos**, estudiante de la Tecnicatura en Desarrollo Web de la UNdeC, para resolver una necesidad propia: **llevar la correlatividades del plan "en la cabeza" no alcanzaba** — hacía falta ver, de un vistazo y tocando las materias, qué se podía cursar y qué faltaba aprobar para destrabar el plan.

Arrancó el **20 de agosto de 2026** como un mapa de correlativas simple (commit inicial: *"Mapa de correlativas, agenda PWA y Readme"*), y creció por iteraciones reales de uso:

1. **Mapa de correlativas** estático → clickeable con estados por materia.
2. Se sumó la **PWA** (`manifest.json` + `sw.js`) para tenerla siempre a mano en el celu, incluso sin señal.
3. Después la **agenda semanal** por alumno (clases editables).
4. Y finalmente el **calendario mensual con evaluaciones** (parciales, recuperatorios, TPs, finales) para organizar el cuatrimestre.

El mismo patrón de "mapa de correlatividades interactivo" lo reutilizó después en otro proyecto para la **UNDEF** ([Mapa-Interactivo-CiberDefensa-UNDEF](https://github.com/zzzNata/Mapa-Interactivo-CiberDefensa-UNDEF)).

> **Este repositorio es un fork activo** de [`zzzNata/Nuevo-Mapa-UNDEC-`](https://github.com/zzzNata/Nuevo-Mapa-UNDEC-) (el repo original no tenía README). Sobre la base original se aplicaron correcciones (vista agenda en desktop, salto de meses en el calendario, escape de texto de usuario) y una reorganización modular preparada para el crecimiento, con la idea de aportarlo de vuelta al proyecto original.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | HTML5 + CSS3 + JavaScript **vanilla** (ES6+) |
| Persistencia | `localStorage` (por navegador) |
| PWA | `manifest.json` + Service Worker (`sw.js`) con precache |
| Fuentes | Google Fonts (`Share Tech Mono`, `Exo 2`) |
| Deploy | Estático sin build — pensado para **Vercel** (también funciona en cualquier hosting estático) |

**Sin dependencias, sin bundler, sin framework** — decisión consciente para un proyecto chico-mediano que crece ordenado por archivos, no por herramientas.

---

## Estructura del proyecto (organización actual)

```
Nuevo-Mapa-UNDEC-/
├─ index.html          ← punto de entrada único (SPA por pantallas)
├─ manifest.json       ← configuración PWA (nombre, íconos, standalone)
├─ sw.js               ← Service Worker: precache de assets + offline
├─ css/
│  ├─ base.css         variables, reset, tipografía y estilos compartidos
│  ├─ login-menu.css   pantalla de login/registro y menú principal
│  ├─ mapa.css         mapa de correlativas, detalle de materia y estados
│  ├─ horarios.css     agenda semanal, calendario, evaluaciones y admin
│  └─ responsive.css   adaptación mobile (media queries)
├─ js/
│  ├─ utils.js         helpers genéricos (escape de texto para HTML)
│  ├─ data.js          plan de estudios, horarios iniciales y derivación de correlativas
│  ├─ storage.js       estado del alumno activo + persistencia en localStorage
│  ├─ mapa.js          render del mapa, detalle de materia y estados
│  ├─ horarios.js      agenda, calendario, evaluaciones y panel de administración
│  └─ main.js          login, navegación entre pantallas, arranque y registro del SW
└─ icons/
   ├─ icon-192.png     ícono PWA
   └─ icon-512.png     ícono PWA
```

**Orden de carga (importante si tocás algo):**

- CSS: `base` → `login-menu` → `mapa` → `horarios` → `responsive` (los media queries van al final para que sus overrides ganen).
- JS (scripts clásicos, sin módulos ES): `utils` → `data` → `storage` → `mapa` → `horarios` → `main`. El orden refleja dependencias; las funciones se llaman desde el HTML con `onclick` globales, por eso ningún archivo es un módulo ES.
- Cada pantalla es una sección de `index.html` que se muestra/oculta desde JS (`display`): login, menú, mapa de materias, horarios y los dos modales (detalle de materia y administración).

---

## Cómo usarlo / desplegarlo

### Local
1. Cloná el repo.
2. Abrí `index.html` directamente en el navegador (o servilo con cualquier servidor estático).

### Vercel (deploy recomendado)
1. Importá el repositorio en [Vercel](https://vercel.com).
2. **No hace falta configurar nada**: al no haber build ni framework, Vercel sirve el contenido del directorio raíz tal cual (framework: *Other*).
3. Cada push a `main` se despliega solo.

> 💡 El sitio ya publicado está en **[nuevo-mapa-undec.vercel.app](https://nuevo-mapa-undec.vercel.app)** (cuenta gratuita del autor). Si en un PR de un fork ves el check de Vercel en **rojo**, no te asustes: es normal y casi siempre es config de cuenta/fork, no un problema del código. Detalles en la sección "Sobre el deploy de Vercel" de [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 🤝 Contribuciones y reportes

¿Encontraste un bug, querés sugerir una función o aportar código? ¡Todo suma!

- **Reportar un error o pedir una mejora**: abrí un [issue](https://github.com/GuidoMaxier/Nuevo-Mapa-UNDEC-/issues/new/choose) con la plantilla correspondiente (🐛 *Reporte de error* o 💡 *Solicitud de función*). Es el canal ideal también para que futuros técnicos en desarrollo de software practiquen el flujo real: *reportar → reproducir → corregir → PR*.
- **Escribir código**: leé [CONTRIBUTING.md](./CONTRIBUTING.md) — explica el flujo fork → rama → PR, las convenciones del proyecto y cómo probar sin romper nada.
- La app es pública en GitHub; los issues requieren una **cuenta de GitHub** (gratuita).

---

## Créditos

- **Autor original y desarrollador principal:** [**Natanael Valdovinos**](https://github.com/zzzNata) ([`zzzNata`](https://github.com/zzzNata)) — estudiante de la Tecnicatura en Desarrollo Web de la **UNdeC**. Creó y desarrolló el proyecto desde agosto de 2026.
  - [LinkedIn](https://www.linkedin.com/in/natanael-valdovinos)
  - Proyecto hermano: [Mapa-Interactivo-CiberDefensa-UNDEF](https://github.com/zzzNata/Mapa-Interactivo-CiberDefensa-UNDEF)
- **Repo original:** [zzzNata/Nuevo-Mapa-UNDEC-](https://github.com/zzzNata/Nuevo-Mapa-UNDEC-)
- **Fork y mantenimiento:** [GuidoMaxier](https://github.com/GuidoMaxier) — correcciones de bugs, refactor modular y este README (septiembre de 2026), al día con el repo original y 2 commits adelante.

---

## Licencia

Sin licencia declarada por el autor original. Mientras tanto, el código se comparte con fines educativos; consultá con el autor antes de reutilizarlo en otros proyectos.
