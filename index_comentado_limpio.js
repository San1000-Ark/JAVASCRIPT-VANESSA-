// Detectar hash
window.addEventListener('hashchange', () => {
  loadRoute(location.hash.slice(1)); // 110
}); 

//lo pense hacer con ID pero a lo ultimo no me dio tiempo
/*buttons.forEach(button => {
  button.addEventListener('click', () => {
    const route = button.dataset.route;
    localtion.hash = route;
  }); 
});*/ 

// 🌐 URL base del servidor JSON Server donde están los usuarios, eventos, inscripciones, etc.
const API_URL = "http://localhost:3000"; // Aquí se indica la raíz de la API que estamos usando // 1

// 📦 Traemos las vistas principales del HTML por su ID para mostrarlas o esconderlas dinámicamente
const loginView = document.getElementById("login-view");       // Vista de login // 4
const registerView = document.getElementById("register-view"); // Vista de registro // 5
const dashboardView = document.getElementById("dashboard-view"); // Vista del panel principal // 6
const notFoundView = document.getElementById("not-found-view"); // Vista para rutas desconocidas // 7

// 🧍 Elementos de interacción del usuario
const loginForm = document.getElementById("login-form");             // Formulario de login // 10
const registerForm = document.getElementById("register-form");       // Formulario de registro // 11
const createEventForm = document.getElementById("create-event-form"); // Formulario para admins // 12
const eventsBody = document.getElementById("events-body");           // Cuerpo de la tabla de eventos // 13
const adminControls = document.getElementById("admin-controls");     // Sección para crear eventos // 14
const userInfo = document.getElementById("user-info");               // Muestra el nombre y rol del usuario actual // 15

// 🔁 Botón para ir al formulario de registro
document.getElementById("go-register").addEventListener("click", (e) => { // 18
  e.preventDefault();        // Evita que se recargue la página (comportamiento por defecto) // 19
  showView("register");      // Cambia a la vista de registro // 20
}); // 21

// 🔁 Botón para ir al formulario de login
document.getElementById("go-login").addEventListener("click", (e) => { // 22
  e.preventDefault();//e.preventdefault hace que no se recargue la pagina // 23
  showView("login");//show view es para redirigir el contenido de el ID login // 24
}); // 25

// 🔒 Botón para cerrar sesión
document.getElementById("logout-btn").addEventListener("click", () => { //se captura el evento de click y cuando lo haga se eliminara la sesion de la persona que haya ingresado visitor o admin // 26
  localStorage.removeItem("session"); // Elimina la sesión guardada del usuario // 27
  showView("login");                  // Redirige a la vista de login // 28
}); // 29

// 🏠 Botón para volver a la página principal desde la vista 404
document.getElementById("back-home").addEventListener("click", () => {// se captura el evento de click para volver a la pagina principal // 30
  const session = getSession();         // Obtenemos la sesión actual // 31
  if (session) showView("dashboard");   // Si hay sesión, vamos al panel principal // 32
  else showView("login");               // Si no, volvemos al login // 33
}); // 34

// 🧠 Cuando el DOM (estructura HTML) esté completamente cargado
document.addEventListener("DOMContentLoaded", () => { // 37
  const session = getSession();         // Revisamos si hay sesión guardada en el navegador // 38
  if (session) showView("dashboard");   // Si hay sesión, mostramos el panel // 39
  else showView("login");               // Si no, mostramos el login // 40
}); // 41

// 👁️‍🗨️ Función que muestra la vista deseada y oculta las otras
function showView(view) { // 44
  // Ocultamos todas las vistas
  loginView.classList.add("d-none");      // "d-none" es una clase Bootstrap que oculta un elemento // 45
  registerView.classList.add("d-none"); // 46
  dashboardView.classList.add("d-none"); // 47
  notFoundView.classList.add("d-none"); // 48

  // Mostramos la vista correspondiente
  switch (view) { // 50
    case "login": // 51
      loginView.classList.remove("d-none"); // Mostramos login // 52
      break; // 53
    case "register": // 54
      registerView.classList.remove("d-none"); // Mostramos registro // 55
      break; // 55
    case "dashboard": // 57
      dashboardView.classList.remove("d-none"); // Mostramos panel // 58
      loadDashboard(); // Cargamos los eventos y acciones correspondientes // 59
      break; // 60
    default: // 61
      notFoundView.classList.remove("d-none"); // Mostramos error si la vista no existe // 62
  } // 63
} // 64

// 🧠 Función que obtiene la sesión actual desde el localStorage
function getSession() { // 67
  return JSON.parse(localStorage.getItem("session")); // Convierte el string en objeto JavaScript // 68
} // 69

// 💾 Guarda el usuario actual como sesión en el localStorage
function saveSession(user) { // 70
  localStorage.setItem("session", JSON.stringify(user)); // Convierte objeto a texto y lo guarda // 71
} // 72

// ✅ Evento que ocurre al enviar el formulario de login
loginForm.addEventListener("submit", async (e) => { // 75
  e.preventDefault(); // Evita recargar la página // 76
  const email = document.getElementById("login-email").value.trim();     // Obtenemos email // 77
  const password = document.getElementById("login-password").value.trim(); // Obtenemos contraseña // 78

  // Usamos fetch para hacer una consulta GET al servidor JSON Server
  const res = await fetch(`${API_URL}/users?email=${email}&password=${password}`); // 80
  const users = await res.json(); // Convertimos respuesta a JSON // 81

  if (users.length === 1) { // 83
    saveSession(users[0]);         // Guardamos la sesión // 84
    showView("dashboard");         // Mostramos el panel // 85
  } else { // 86
    alert("Invalid credentials");  // ALERT > Mostramos alerta si no coincide // 87
  } // 88
}); // 89

//AWAIT SE UTILIZA CADA QUE LAS FUNCIONES SEAN ASINCRONAS OSEA (ASYNC FUNCTION) para que pueda realizar una accion pero despues de que se ejecute la anterior

// 📝 Evento que ocurre al enviar el formulario de registro
registerForm.addEventListener("submit", async (e) => { // 92
  e.preventDefault(); // Evita recargar la pagina // 93
  const fullName = document.getElementById("register-name").value.trim();//traemos los valores de register name que serian los inputs que ingreso el usuario // 94
  const email = document.getElementById("register-email").value.trim();//trim para no contar los espacios como caracteres // 95
  const password = document.getElementById("register-password").value.trim(); // 96
  const role = document.getElementById("register-role").value;// traer el valor de el login de cada usuario si es visitor o admin // 97

  // Verificamos si ya existe un usuario con ese correo
  const res = await fetch(`${API_URL}/users?email=${email}`); // 99
  const exists = await res.json();// la res que reciba sera convertida a .json para poder enviarlo con el metodo POST  // 100
  if (exists.length > 0) { // si hay mas de 0 usuarios y existe dentro de el json se mostrara un alert en el cual diga que ya existe  // 101
    alert("User already exists"); // 102
    return; // 103
  } // 104

  // Si no existe, creamos el nuevo usuario
  const user = { fullName, email, password, role };// creamos un objeto de tipo usuario en el cual se le agregaran todos los atributos y caracteristicas que se le van a mandar por el metodo POST   // 106
  const created = await fetch(`${API_URL}/users`, { // 107
    method: "POST",// metodo utilizado para poder enviar a la base de datos Json  // 108
    body: JSON.stringify(user), // Convertimos objeto a JSON // 110
  }); // 111
  const newUser = await created.json(); // 112
  saveSession(newUser);        // Guardamos sesión // 113
  showView("dashboard");       // Mostramos panel // 114
}); // 115

// 📋 Función que carga los eventos en el dashboard, según el rol
async function loadDashboard() { // 118
  const session = getSession(); // Obtenemos el usuario actual // 119
  userInfo.textContent = `${session.fullName} (${session.role})`; // Mostramos nombre y rol // 120

  const events = await fetch(`${API_URL}/events`).then((res) => res.json()); // Cargamos eventos // 122
  const enrollments = await fetch(`${API_URL}/enrollments?userId=${session.id}`).then((res) => // 123
    res.json() // 124
  ); // Cargamos inscripciones del usuario

  eventsBody.innerHTML = ""; // Limpiamos tabla de eventos // 127

  events.forEach((event) => { // 129
    const row = document.createElement("tr"); // Creamos una fila de tabla // 130
    const isEnrolled = enrollments.find((en) => en.eventId.toString() === event.id.toString()); // 131

    // Insertamos HTML dentro de la fila desde el javascript con el INNER.HTML
    // se utilizaron operadores ternarios para el filtro de contenidos segun el usuario que ingrese
    row.innerHTML = ` // 133
      <td>${event.name}</td> // 134
      <td>${event.description}</td> // 135
      <td>${event.date}</td> // 136
      <td>${event.capacity}</td> // 137
      <td>${event.enrolled}</td> // 138
      <td> // 139
        ${session.role === "admin" ? `  // 140
          <button class="btn btn-sm btn-danger me-1" onclick="deleteEvent('${event.id}')">Delete</button> // 141
        ` : ` // 142
          ${
            isEnrolled
              ? `<span class="badge text-bg-success">Registered</span>` // 144
              : event.enrolled < event.capacity // 146
              ? `<button class="btn btn-sm btn-primary" onclick="registerToEvent('${event.id}')">Join</button>` // 147
              : `<span class="badge text-bg-secondary">Full</span>` // 148
          } 
        `} 
      </td> 
    `; // 134
    eventsBody.appendChild(row); // Añadimos fila a la tabla // 153
  }); 

  // Mostramos u ocultamos controles de admin
  if (session.role === "admin") { // 157
    adminControls.classList.remove("d-none");//dejar mostrar el contenido de el administrador // 158
  } else { // 159
    adminControls.classList.add("d-none");//sino es admin ocultar el contenido // 160
  } 
} 

// ➕ Evento al crear nuevo evento desde el formulario del admin
createEventForm.addEventListener("submit", async (e) => { // 165
  e.preventDefault(); // 166
  const name = document.getElementById("event-name").value.trim(); // 167
  const description = document.getElementById("event-description").value.trim(); // 168
  const capacity = parseInt(document.getElementById("event-capacity").value); // Convertimos a número // 169
  const date = document.getElementById("event-date").value; // 170

  const newEvent = { name, description, capacity, date, enrolled: ""}; //172

  await fetch(`${API_URL}/events`, { // 174
    method: "POST", // 175
    headers: { "Content-Type": "application/json" }, // 176
    body: JSON.stringify(newEvent),// lo convertimos a json para posteriormente poder agragar y enviar con metodo POST el objeto newEvent // 177
  }); 

  createEventForm.reset(); // Limpiamos formulario // 180
  loadDashboard();         // Recargamos lista de eventos // 181
}); 

// ❌ Función para eliminar un evento (solo admin)
async function deleteEvent(id) { // 185
  if (confirm("Are you sure you want to delete this event?")) { // 186
    await fetch(`${API_URL}/events/${id}`, { // 187
      method: "DELETE",//metodo DELETE para eliminar // 188
    }); // 189
    loadDashboard(); // Recargamos eventos // 190
  }
}

// 🏃 Función para que el usuario se registre a un evento
async function registerToEvent(eventId) { // 195
  const session = getSession(); // Obtenemos sesión // 196

  const eventRes = await fetch(`${API_URL}/events/${eventId}`); // 197
  const event = await eventRes.json(); // 198

  // Si el evento está lleno
  if (event.enrolled >= event.capacity) { // 200
    alert("This event is full");// si esta lleno que me agregue una alerta en el cual me indique que esta lleno el evento // 201
    return; // 202
  }

  // Registramos al usuario en la tabla de inscripciones
  await fetch(`${API_URL}/enrollments`, { // 205
    method: "POST",//metodo POST para enviar el contenido de el objeto en .json y asi poder recibirlo en el archivo db.json // 206
    headers: { "Content-Type": "application/json" }, // 207
    body: JSON.stringify({ eventId, userId: session.id }),//hace un cambio para que los archivos se conviertan a .json // 208
  }); // 182

  // Actualizamos el contador de inscritos del evento
  await fetch(`${API_URL}/events/${eventId}`, { // 212
    method: "PATCH",// PATH sirve para actualizar solo los atributos que desee cambiar y no tener que ingresar todos los datos de nuevo // 213
    headers: { "Content-Type": "application/json" }, // 214
    body: JSON.stringify({ enrolled: event.enrolled + 1 }),//se suma 1 cada vez que el contador se presiona en la parte de JOIN // 215
  }); // 188

  loadDashboard(); // Recargamos para reflejar los cambios // 218
}
