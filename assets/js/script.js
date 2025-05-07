// == DOMContentLoaded Principal ==
document.addEventListener("DOMContentLoaded", function () {
    const calendarEl = document.getElementById("calendar");
    const monthSelector = document.getElementById("monthSelector");
    const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");
    const videoContainer = document.getElementById("video-container");
    const favoritosContainer = document.getElementById("favoritos-container");
    const btnBorrarFavs = document.getElementById("btn-borrar-favoritos");
    const acordeonContainer = document.getElementById("galeriaAcordeon");
  
    // Cargar días completados desde localStorage
    let completedDays = JSON.parse(localStorage.getItem("completedDays") || "[]");
  
    // ===================== CALENDARIO ===================== //
    if (calendarEl && monthSelector) {
      const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
  
      // Poblar selector de mes
      monthNames.forEach((name, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${name} ${currentYear}`;
        if (index === currentMonth) option.selected = true;
        monthSelector.appendChild(option);
      });
  
      // Mostrar calendario inicial
      renderCalendar(currentYear, currentMonth);
  
      // Actualizar al cambiar mes
      monthSelector.addEventListener("change", () => {
        renderCalendar(currentYear, parseInt(monthSelector.value));
      });
    }
  
    // ===================== RENDER CALENDARIO ===================== //
    function renderCalendar(year, month) {
      calendarEl.innerHTML = "";
  
      // Encabezados de día de semana
      const weekdays = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
      const headerRow = document.createElement("div");
      headerRow.className = "d-flex w-100 mb-2";
      weekdays.forEach(day => {
        const cell = document.createElement("div");
        cell.className = "text-center font-weight-bold";
        cell.style.flex = "0 0 14.28%";
        cell.textContent = day;
        headerRow.appendChild(cell);
      });
      calendarEl.appendChild(headerRow);
  
      // Cálculo de primer día y total de días
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      let dayCounter = 1;
  
      // Construir filas de semanas
      for (let week = 0; week < 6; week++) {
        const weekRow = document.createElement("div");
        weekRow.className = "d-flex w-100 mb-2";
  
        for (let day = 0; day < 7; day++) {
          const cell = document.createElement("div");
          cell.className = "p-1";
          cell.style.flex = "0 0 14.28%";
  
          if ((week === 0 && day < firstDay) || dayCounter > daysInMonth) {
            // Celda vacía antes o después del mes
          } else {
            const date = new Date(year, month, dayCounter);
            const wd = date.getDay();
            const dateKey = date.toISOString().split("T")[0];
  
            const card = document.createElement("div");
            card.className = "card";
            card.style.cursor = "pointer";
  
            const cardBody = document.createElement("div");
            cardBody.className = "card-body p-2 text-center position-relative";
            cardBody.textContent = dayCounter;
  
            // Marcar completado
            if (completedDays.includes(dateKey)) {
              cardBody.style.textDecoration = "line-through";
              cardBody.style.opacity = "0.6";
            }
  
            // Colorear según día
            if ([1, 3, 5].includes(wd)) {
              card.classList.add("bg-primary", "text-white");
            } else if ([2, 4].includes(wd)) {
              card.classList.add("bg-success", "text-white");
            } else if (wd === 6) {
              card.classList.add("bg-secondary", "text-white");
            } else if (wd === 0) {
              card.classList.add("bg-light", "text-dark");
            }
  
            // Doble clic para marcar completado
            cardBody.addEventListener("dblclick", () => {
              toggleComplete(dateKey, cardBody);
            });
  
            // Clic para abrir detalle de día
            card.addEventListener("click", () => openDayWindow(date));
  
            card.appendChild(cardBody);
            cell.appendChild(card);
            dayCounter++;
          }
  
          weekRow.appendChild(cell);
        }
  
        calendarEl.appendChild(weekRow);
        if (dayCounter > daysInMonth) break;
      }
    }
  
    // Alterna estado completado y guarda en localStorage
    function toggleComplete(dateKey, cardBody) {
      const idx = completedDays.indexOf(dateKey);
      if (idx >= 0) {
        completedDays.splice(idx, 1);
        cardBody.style.textDecoration = "";
        cardBody.style.opacity = "";
      } else {
        completedDays.push(dateKey);
        cardBody.style.textDecoration = "line-through";
        cardBody.style.opacity = "0.6";
      }
      localStorage.setItem("completedDays", JSON.stringify(completedDays));
    }
  
    // ===================== VENTANA DETALLE DÍA ===================== //
    function openDayWindow(date) {
      const wd = date.getDay();
      const formatted = formatDate(date);
      const win = window.open("", "DetalleDia", "width=500,height=600");
      let content = `<p>Aquí podrás agregar detalles de la rutina.</p>`;
  
      // Lunes – PUSH
      if (wd === 1) {
        content = `
          <div class="card mb-3">
            <div class="card-header bg-primary text-white"><h5 class="mb-0">🟩🟩🟩🟩 LUNES – PUSH</h5></div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between flex-wrap">Flexiones inclinadas<span class="badge badge-primary badge-pill ml-2">4x10-15</span><small class="text-muted ml-auto">60s</small></li>
              <li class="list-group-item d-flex justify-content-between flex-wrap">Press pecho con mancuernas o barra Z<span class="badge badge-primary badge-pill ml-2">3x8-12</span><small class="text-muted ml-auto">75s</small></li>
              <li class="list-group-item d-flex justify-content-between flex-wrap">Elevaciones laterales<span class="badge badge-primary badge-pill ml-2">3x12-15</span><small class="text-muted ml-auto">45s</small></li>
              <li class="list-group-item d-flex justify-content-between flex-wrap">Fondos en banco<span class="badge badge-primary badge-pill ml-2">3x10-12</span><small class="text-muted ml-auto">60s</small></li>
              <li class="list-group-item d-flex justify-content-between flex-wrap">Plancha frontal<span class="badge badge-primary badge-pill ml-2">2x30-45 seg</span><small class="text-muted ml-auto">30s</small></li>
            </ul>
          </div>`;
      }
  
      // Martes/Jueves – Caminata
      if (wd === 2 || wd === 4) {
        content = `
          <div class="card mb-3">
            <div class="card-header bg-danger text-white"><h5 class="mb-0">🟥🟥🟥🟥 CAMINATA ACTIVA</h5></div>
            <div class="card-body"><p>7500-12000 pasos</p></div>
          </div>`;
      }
  
      // Miércoles – PULL
      if (wd === 3) {
        content = `
          <div class="card mb-3">
            <div class="card-header bg-info text-white"><h5 class="mb-0">🟦🟦🟦🟦 MIÉRCOLES – PULL</h5></div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between flex-wrap">Remo con mancuerna/barra Z<span class="badge badge-info badge-pill ml-2">4x10-12</span><small class="text-muted ml-auto">75s</small></li>
              <li class="list-group-item d-flex justify-content-between flex-wrap">Remo inverso bajo mesa o TRX<span class="badge badge-info badge-pill ml-2">3x8-10</span><small class="text-muted ml-auto">75s</small></li>
              <li class="list-group-item d-flex justify-content-between flex-wrap">Curl bíceps<span class="badge badge-info badge-pill ml-2">3x10-12</span><small class="text-muted ml-auto">60s</small></li>
              <li class="list-group-item d-flex justify-content-between flex-wrap">Face pulls con banda<span class="badge badge-info badge-pill ml-2">3x15</span><small class="text-muted ml-auto">30-45s</small></li>
              <li class="list-group-item d-flex justify-content-between flex-wrap">Superman espalda baja<span class="badge badge-info badge-pill ml-2">3x15-20</span><small class="text-muted ml-auto">30s</small></li>
            </ul>
          </div>`;
      }
  
      // Viernes – Piernas + Full Body
      if (wd === 5) {
        content = `
          <div class="card mb-3">
            <div class="card-header bg-warning text-dark"><h5 class="mb-0">🟨🟨🟨🟨 VIERNES – PIERNAS + FULL BODY</h5></div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between flex-wrap">Sentadillas<span class="badge badge-warning badge-pill ml-2">4x12-15</span><small class="text-muted ml-auto">75s</small></li>
              <li class="list-group-item d-flex justify-content-between flex-wrap">Zancadas caminando<span class="badge badge-warning badge-pill ml-2">3x10 c/pierna</span><small class="text-muted ml-auto">60s</small></li>
              <li class="list-group-item d-flex justify-content-between flex-wrap">Hip Thrust en banco<span class="badge badge-warning badge-pill ml-2">3x12-15</span><small class="text-muted ml-auto">60s</small></li>
              <li class="list-group-item d-flex justify-content-between flex-wrap">Jump Squats o Wall Sit<span class="badge badge-warning badge-pill ml-2">2x30 seg</span><small class="text-muted ml-auto">60s</small></li>
              <li class="list-group-item d-flex justify-content-between flex-wrap">Abdominales bicicleta o plank lateral<span class="badge badge-warning badge-pill ml-2">2x15 o 2x30 seg</span><small class="text-muted ml-auto">30s</small></li>
            </ul>
          </div>`;
      }
  
      // Sábado – Full Body Opcional
      if (wd === 6) {
        content = `
          <div class="card mb-3">
            <div class="card-header bg-secondary text-white"><h5 class="mb-0">⬛⬛⬛⬛ FULL BODY OPCIONAL (20 Minutos)</h5></div>
            <div class="card-body"><p>Elige ejercicios compuestos a tu ritmo.</p></div>
          </div>`;
      }
  
      // Domingo – Descanso
      if (wd === 0) {
        content = `
          <div class="card mb-3">
            <div class="card-header bg-light text-dark"><h5 class="mb-0">⬜⬜⬜⬜ DÍA DE DESCANSO</h5></div>
            <div class="card-body"><p>Disfruta de tu día de descanso y recupérate.</p></div>
          </div>`;
      }
  
      // Escribir HTML en la ventana emergente
      win.document.write(`<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formatted}</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet"/>
    <style>
      body { padding: 20px; }
      .card { max-width: 100%; }
      @media (max-width: 576px) { .card-body, .card-header { padding: 1rem; } }
    </style>
  </head>
  <body>
    <div class="container">
      <h2 class="text-center mb-4">${formatted}</h2>
      ${content}
    </div>
  </body>
  </html>`);
    }
  
    // ===================== FORMATEAR FECHA ===================== //
    function formatDate(d) {
      const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
      return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    }
  
    // ===================== MODO OSCURO ===================== //
    if (toggleDarkModeBtn) {
      const icon = toggleDarkModeBtn.querySelector("i");
      function actualizarIconoModoOscuro() {
        if (document.body.classList.contains("dark-mode")) icon.classList.replace("bi-moon-fill","bi-sun-fill");
        else icon.classList.replace("bi-sun-fill","bi-moon-fill");
      }
      toggleDarkModeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("modo-oscuro", document.body.classList.contains("dark-mode"));
        actualizarIconoModoOscuro();
      });
      if (localStorage.getItem("modo-oscuro") === "true") document.body.classList.add("dark-mode");
      actualizarIconoModoOscuro();
    }
  
    // ===================== FAVORITOS DE VÍDEOS ===================== //
    if (videoContainer) {
      const favoritos = JSON.parse(localStorage.getItem("videos-favoritos") || "[]");
      videoContainer.querySelectorAll(".video-card").forEach(card => {
        const titulo = card.querySelector("h5")?.innerText;
        if (!titulo) return;
        const favBtn = document.createElement("button");
        favBtn.className = "btn btn-sm btn-outline-warning mt-2 favorito-btn";
        favBtn.textContent = "★ Favorito";
        favBtn.addEventListener("click", () => toggleFavorito(titulo, card));
        card.appendChild(favBtn);
        if (favoritos.includes(titulo)) {
          card.classList.add("border-warning");
          favoritosContainer.appendChild(card.cloneNode(true));
        }
      });
      function toggleFavorito(nombre, card) {
        let fav = JSON.parse(localStorage.getItem("videos-favoritos") || "[]");
        if (fav.includes(nombre)) {
          fav = fav.filter(f => f !== nombre);
          card.classList.remove("border-warning");
          document.querySelectorAll("#favoritos-container .video-card").forEach(c => {
            if (c.querySelector("h5")?.innerText === nombre) c.remove();
          });
        } else {
          fav.push(nombre);
          card.classList.add("border-warning");
          favoritosContainer.appendChild(card.cloneNode(true));
        }
        localStorage.setItem("videos-favoritos", JSON.stringify(fav));
      }
    }
    if (btnBorrarFavs) btnBorrarFavs.addEventListener("click", () => {
      localStorage.removeItem("videos-favoritos");
      document.querySelectorAll(".video-card.border-warning").forEach(c => c.classList.remove("border-warning"));
      favoritosContainer.innerHTML = "";
      alert("🎉 Favoritos eliminados correctamente.");
    });
  
    // ===================== GALERÍA ACORDEÓN ===================== //
    const beneficios = [
      { id: "beneficio1", titulo: "Quema Grasa", icono: "bi-fire", texto: "Rutinas de alta intensidad para activar tu metabolismo." },
      { id: "beneficio2", titulo: "Salud Cardiovascular", icono: "bi-heart-pulse", texto: "Mejora tu resistencia con ejercicios funcionales." },
      { id: "beneficio3", titulo: "Progreso Semanal", icono: "bi-bar-chart-line", texto: "Sigue tu evolución con calendario y notas personalizadas." }
    ];
    let idx = 0;
    function mostrarSiguienteBeneficio() {
      if (!acordeonContainer || idx >= beneficios.length) return;
      const { id, titulo, icono, texto } = beneficios[idx];
      const card = document.createElement("div");
      card.className = "card mb-3";
      card.innerHTML = `
        <div class="card-header" id="heading-${id}">
          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left ${idx !== 0 ? "collapsed" : ""}" type="button"
              data-toggle="collapse" data-target="#collapse-${id}" aria-expanded="${idx === 0}" aria-controls="collapse-${id}">
              <i class="bi ${icono} mr-2"></i>${titulo}
            </button>
          </h2>
        </div>
        <div id="collapse-${id}" class="collapse ${idx === 0 ? "show" : ""}" aria-labelledby="heading-${id}" data-parent="#galeriaAcordeon">
          <div class="card-body">${texto}</div>
        </div>
      `;
      acordeonContainer.appendChild(card);
      idx++;
      if (idx < beneficios.length) setTimeout(mostrarSiguienteBeneficio, 20000);
    }
    mostrarSiguienteBeneficio();
  });
  