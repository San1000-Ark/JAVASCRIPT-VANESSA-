// 🌐 URL base del servidor JSON Server donde están los usuarios, eventos, inscripciones, etc.
const API_URL = "http://localhost:3000"; // Aquí se indica la raíz de la API que estamos usando

// 📦 Traemos las vistas principales del HTML por su ID para mostrarlas o esconderlas dinámicamente
const loginView = document.getElementById("login-view");       // Vista de login
const registerView = document.getElementById("register-view"); // Vista de registro
const dashboardView = document.getElementById("dashboard-view"); // Vista del panel principal
const notFoundView = document.getElementById("not-found-view"); // Vista para rutas desconocidas

// 🧍 Elementos de interacción del usuario
const loginForm = document.getElementById("login-form");             // Formulario de login
const registerForm = document.getElementById("register-form");       // Formulario de registro
const createEventForm = document.getElementById("create-event-form"); // Formulario para admins
const eventsBody = document.getElementById("events-body");           // Cuerpo de la tabla de eventos
const adminControls = document.getElementById("admin-controls");     // Sección para crear eventos
const userInfo = document.getElementById("user-info");               // Muestra el nombre y rol del usuario actual

// 🔁 Botón para ir al formulario de registro
document.getElementById("go-register").addEventListener("click", (e) => {
  e.preventDefault();        // Evita que se recargue la página (comportamiento por defecto)
  showView("register");      // Cambia a la vista de registro
});

// 🔁 Botón para ir al formulario de login
document.getElementById("go-login").addEventListener("click", (e) => {
  e.preventDefault();//e.preventdefault hace que no se recargue la pagina
  showView("login");//show view es para redirigir el contenido de el ID login
});

// 🔒 Botón para cerrar sesión
document.getElementById("logout-btn").addEventListener("click", () => { //se captura el evento de click y cuando lo haga se eliminara la sesion de la persona que haya ingresado visitor o admin
  localStorage.removeItem("session"); // Elimina la sesión guardada del usuario
  showView("login");                  // Redirige a la vista de login
});

// 🏠 Botón para volver a la página principal desde la vista 404
document.getElementById("back-home").addEventListener("click", () => {// se captura el evento de click para volver a la pagina principal
  const session = getSession();         // Obtenemos la sesión actual
  if (session) showView("dashboard");   // Si hay sesión, vamos al panel principal
  else showView("login");               // Si no, volvemos al login
});

// 🧠 Cuando el DOM (estructura HTML) esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const session = getSession();         // Revisamos si hay sesión guardada en el navegador
  if (session) showView("dashboard");   // Si hay sesión, mostramos el panel
  else showView("login");               // Si no, mostramos el login
});

// 👁️‍🗨️ Función que muestra la vista deseada y oculta las otras
function showView(view) {
  // Ocultamos todas las vistas
  loginView.classList.add("d-none");      // "d-none" es una clase Bootstrap que oculta un elemento
  registerView.classList.add("d-none");
  dashboardView.classList.add("d-none");
  notFoundView.classList.add("d-none");

  // Mostramos la vista correspondiente
  switch (view) {
    case "login":
      loginView.classList.remove("d-none"); // Mostramos login
      break;
    case "register":
      registerView.classList.remove("d-none"); // Mostramos registro
      break;
    case "dashboard":
      dashboardView.classList.remove("d-none"); // Mostramos panel
      loadDashboard(); // Cargamos los eventos y acciones correspondientes
      break;
    default:
      notFoundView.classList.remove("d-none"); // Mostramos error si la vista no existe
  }
}

// 🧠 Función que obtiene la sesión actual desde el localStorage
function getSession() {
  return JSON.parse(localStorage.getItem("session")); // Convierte el string en objeto JavaScript
}

// 💾 Guarda el usuario actual como sesión en el localStorage
function saveSession(user) {
  localStorage.setItem("session", JSON.stringify(user)); // Convierte objeto a texto y lo guarda
}

// ✅ Evento que ocurre al enviar el formulario de login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita recargar la página
  const email = document.getElementById("login-email").value.trim();     // Obtenemos email
  const password = document.getElementById("login-password").value.trim(); // Obtenemos contraseña

  // Usamos fetch para hacer una consulta GET al servidor JSON Server
  const res = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
  const users = await res.json(); // Convertimos respuesta a JSON

  if (users.length === 1) {
    saveSession(users[0]);         // Guardamos la sesión
    showView("dashboard");         // Mostramos el panel
  } else {
    alert("Invalid credentials");  // ALERT > Mostramos alerta si no coincide
  }
});

//AWAIT SE UTILIZA CADA QUE LAS FUNCIONES SEAN ASINCRONAS OSEA (ASYNC FUNCTION) para que pueda realizar una accion pero despues de que se ejecute la anterior

// 📝 Evento que ocurre al enviar el formulario de registro
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita recargar la pagina
  const fullName = document.getElementById("register-name").value.trim();//traemos los valores de register name que serian los inputs que ingreso el usuario
  const email = document.getElementById("register-email").value.trim();//trim para no contar los espacios como caracteres
  const password = document.getElementById("register-password").value.trim();
  const role = document.getElementById("register-role").value;// traer el valor de el login de cada usuario si es visitor o admin

  // Verificamos si ya existe un usuario con ese correo
  const res = await fetch(`${API_URL}/users?email=${email}`);
  const exists = await res.json();// la res que reciba sera convertida a .json para poder enviarlo con el metodo POST 
  if (exists.length > 0) { // si hay mas de 0 usuarios y existe dentro de el json se mostrara un alert en el cual diga que ya existe 
    alert("User already exists");
    return;
  }

  // Si no existe, creamos el nuevo usuario
  const user = { fullName, email, password, role };// creamos un objeto de tipo usuario en el cual se le agregaran todos los atributos y caracteristicas que se le van a mandar por el metodo POST  
  const created = await fetch(`${API_URL}/users`, {
    method: "POST",// metodo utilizado para poder enviar a la base de datos Json 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user), // Convertimos objeto a JSON
  });
  const newUser = await created.json();
  saveSession(newUser);        // Guardamos sesión
  showView("dashboard");       // Mostramos panel
});

// 📋 Función que carga los eventos en el dashboard, según el rol
async function loadDashboard() {
  const session = getSession(); // Obtenemos el usuario actual
  userInfo.textContent = `${session.fullName} (${session.role})`; // Mostramos nombre y rol

  const events = await fetch(`${API_URL}/events`).then((res) => res.json()); // Cargamos eventos
  const enrollments = await fetch(`${API_URL}/enrollments?userId=${session.id}`).then((res) =>
    res.json()
  ); // Cargamos inscripciones del usuario

  eventsBody.innerHTML = ""; // Limpiamos tabla de eventos

  events.forEach((event) => {
    const row = document.createElement("tr"); // Creamos una fila de tabla
    const isEnrolled = enrollments.find((en) => en.eventId.toString() === event.id.toString());

    // Insertamos HTML dentro de la fila desde el javascript con el INNER.HTML
    // se utilizaron operadores ternarios para el filtro de contenidos segun el usuario que ingrese
    row.innerHTML = `
      <td>${event.name}</td>
      <td>${event.description}</td>
      <td>${event.date}</td>
      <td>${event.capacity}</td>
      <td>${event.enrolled}</td>
      <td>
        ${session.role === "admin" ? ` 
          <button class="btn btn-sm btn-danger me-1" onclick="deleteEvent('${event.id}')">Delete</button>
        ` : `
          ${
            isEnrolled
              ? `<span class="badge text-bg-success">Registered</span>`
              : event.enrolled < event.capacity
              ? `<button class="btn btn-sm btn-primary" onclick="registerToEvent('${event.id}')">Join</button>`
              : `<span class="badge text-bg-secondary">Full</span>`
          }
        `}
      </td>
    `;
    eventsBody.appendChild(row); // Añadimos fila a la tabla
  });

  // Mostramos u ocultamos controles de admin
  if (session.role === "admin") {
    adminControls.classList.remove("d-none");//dejar mostrar el contenido de el administrador
  } else {
    adminControls.classList.add("d-none");//sino es admin ocultar el contenido
  }
}

// ➕ Evento al crear nuevo evento desde el formulario del admin
createEventForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("event-name").value.trim();
  const description = document.getElementById("event-description").value.trim();
  const capacity = parseInt(document.getElementById("event-capacity").value); // Convertimos a número
  const date = document.getElementById("event-date").value;

  const newEvent = { name, description, capacity, date, enrolled: ""};

  await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEvent),// lo convertimos a json para posteriormente poder agragar y enviar con metodo POST el objeto newEvent
  });

  createEventForm.reset(); // Limpiamos formulario
  loadDashboard();         // Recargamos lista de eventos
});

// ❌ Función para eliminar un evento (solo admin)
async function deleteEvent(id) {
  if (confirm("Are you sure you want to delete this event?")) {
    await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",//metodo DELETE para eliminar
    });
    loadDashboard(); // Recargamos eventos
  }
}

// 🏃 Función para que el usuario se registre a un evento
async function registerToEvent(eventId) {
  const session = getSession(); // Obtenemos sesión

  const eventRes = await fetch(`${API_URL}/events/${eventId}`);
  const event = await eventRes.json();

  // Si el evento está lleno
  if (event.enrolled >= event.capacity) {
    alert("This event is full");// si esta lleno que me agregue una alerta en el cual me indique que esta lleno el evento
    return;
  }

  // Registramos al usuario en la tabla de inscripciones
  await fetch(`${API_URL}/enrollments`, {
    method: "POST",//metodo POST para enviar el contenido de el objeto en .json y asi poder recibirlo en el archivo db.json
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId, userId: session.id }),//hace un cambio para que los archivos se conviertan a .json
  });

  // Actualizamos el contador de inscritos del evento
  await fetch(`${API_URL}/events/${eventId}`, {
    method: "PATCH",// PATH sirve para actualizar solo los atributos que desee cambiar y no tener que ingresar todos los datos de nuevo
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enrolled: event.enrolled + 1 }),//se suma 1 cada vez que el contador se presiona en la parte de JOIN
  });

  loadDashboard(); // Recargamos para reflejar los cambios
}
