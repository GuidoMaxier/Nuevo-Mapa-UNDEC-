# Contribuyendo al Mapa de Correlativas UNdeC

¡Gracias por querer sumarte! 🎉 Este proyecto nació como una herramienta de estudio para la **Tecnicatura en Desarrollo Web de la UNdeC**, así que los aportes más valiosos suelen venir de quienes la usan a diario: estudiantes y docentes.

Hay dos formas principales de participar:

1. **Reportar un problema o pedir una función** → abrir un [issue](https://github.com/GuidoMaxier/Nuevo-Mapa-UNDEC-/issues/new/choose) con la plantilla correspondiente (🐛 bug o 💡 mejora).
2. **Escribir código** → seguir el flujo de este documento y abrir un Pull Request.

---

## 📌 Antes de empezar

- Leé el [README.md](./README.md): explica **qué es el proyecto, su estructura modular y el orden de carga** de archivos (importante para no romper nada).
- La app es **100 % estática**: HTML + CSS + JS vanilla, **sin build ni framework**. Antes de proponer una dependencia o una herramienta nueva, comentalo en el issue/PR: la filosofía del proyecto es crecer por archivos bien organizados, no por herramientas.
- Si vas a tocar archivos de la PWA (`index.html`, `css/*`, `js/*`, `icons/*`), acordate de **subir `CACHE_NAME` en `sw.js`** (ej. `v5` → `v6`): el Service Worker precachea los assets y sin ese cambio los usuarios ven versiones viejas.

---

## 🐛 Reportar un bug / 💡 pedir una función

1. Buscá primero si ya existe un issue similar (abierto o cerrado).
2. Usá las plantillas de [Issues](https://github.com/GuidoMaxier/Nuevo-Mapa-UNDEC-/issues/new/choose):
   - **Bug**: describí los pasos para reproducirlo, qué esperabas, qué pasó, dispositivo/navegador y, si podés, una captura.
   - **Mejora**: contá la idea, para qué la usarías y cómo la imaginás.
3. **Privacidad:** los datos de alumnos se guardan en el `localStorage`. No publiques nombres reales de otras personas en issues ni capturas; usá datos de ejemplo.

---

## 🚀 Flujo para aportar código (PR)

1. **Forkeá** este repositorio (botón *Fork*) y clonalo:

   ```bash
   git clone https://github.com/<tu-usuario>/Nuevo-Mapa-UNDEC-.git
   cd Nuevo-Mapa-UNDEC-
   ```

2. Creá una **rama** con nombre descriptivo:

   ```bash
   git checkout -b fix/contador-aprobadas      # para bugs
   git checkout -b feat/exportar-calendario    # para funciones
   ```

3. Hacé tus cambios respetando las convenciones de abajo.
4. Verificá que no rompiste nada (lista de pruebas manuales en la sección siguiente).
5. Commit con un mensaje claro y **pusheá**:

   ```bash
   git add .
   git commit -m "fix: el contador de aprobadas no se actualizaba al cambiar el estado"
   git push origin fix/contador-aprobadas
   ```

6. Abrí el Pull Request: la plantilla de PR ya incluye un checklist. Si tu PR resuelve un issue, mencionalo (`closes #12`).

> 💡 Este repositorio es un **fork** del proyecto original ([zzzNata/Nuevo-Mapa-UNDEC-](https://github.com/zzzNata/Nuevo-Mapa-UNDEC-)). Si tu cambio apunta a una mejora general, podés hacer el PR también (o directamente) hacia el **upstream**; si no estás seguro, hacelo acá y lo consolidamos nosotros.

---

## 🧱 Convenciones de código

### Estructura

```
index.html            # única página: cada pantalla es una sección comentada
css/                  # un archivo por área, en este orden de carga:
                      #   base → login-menu → mapa → horarios → responsive (media queries al final)
js/                   # scripts clásicos (NO módulos ES), en este orden:
                      #   utils → data → storage → mapa → horarios → main
                      # las funciones se llaman desde el HTML con onclick globales
sw.js                 # Service Worker (precache + offline)
manifest.json         # PWA
```

- **Datos del plan de estudios** (materias, correlativas, horarios iniciales) → `js/data.js`. Las correlativas "desbloquea" se derivan solas (`unlocks`).
- **Estado del alumno y persistencia** → `js/storage.js` (`localStorage`, claves `usuarios_dw` y `usuarioActivo_dw`). No guardes estado en otro lado.
- **Nueva vista/pantalla** → nueva sección en `index.html` (con su comentario) + sus estilos en el `css` temático correspondiente + la lógica en el `js` que toque.
- **Texto de usuario en HTML** → siempre pasar por `esc()` (helper de `js/utils.js`) antes de interpolar con `innerHTML`.

### Estilo

- Idioma: **español rioplatense con voseo**, igual que la app ("completá", "querés").
- Mensajes de commit: `tipo: descripción en minúscula` — tipos usados en el repo: `feat`, `fix`, `refactor`, `docs`, `chore`, `Bump PWA version…`.
- Nombres de variables/funciones: en español, descriptivos (`mostrarHorarios`, `construirAgendaSemanal`).
- Sin dependencias nuevas sin conversación previa en el issue/PR.

---

## 🧪 Cómo probar (no hay tests automatizados)

La app es estática: abrí `index.html` en el navegador (o `npx serve .` / cualquier servidor estático). Para el Service Worker usá `localhost` o HTTPS.

Checklist rápido antes de pushear:

- [ ] `node --check js/*.js` → sin errores de sintaxis
- [ ] Mapa: click en materias, detalle, leyenda, estados (aprobada/cursando/reprobada)
- [ ] Validación de correlativas: probá marcar una materia aprobada sin tener la correlativa → debe bloquear con aviso
- [ ] Agenda: alta, edición y borrado de clases; que aparezcan el día y horario correctos
- [ ] Calendario: cambiar de mes, ver clases y evaluaciones del día
- [ ] Evaluaciones: alta con tema/descripción (probá con caracteres como `<` o `&` para verificar el escape)
- [ ] Varios alumnos: registrar un segundo usuario y confirmar que cada uno tiene sus datos
- [ ] **Mobile** (devtools ≤ 600 px) y **desktop**
- [ ] PWA: instalar/recargar con red y probar **offline** (DevTools → Application → Service Worker → Offline)
- [ ] Si tocaste assets, `CACHE_NAME` de `sw.js` subió de versión

---

## ❓ Dudas

Abrí un issue del tipo consulta, o un PR aunque esté en progreso (marcalo con `[WIP]` en el título o como Draft). Nadie nace sabiendo: las preguntas también son bienvenidas.
