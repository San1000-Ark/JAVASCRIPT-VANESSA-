# ¿Qué es este módulo?
Es una aplicación web tipo SPA (Single Page Application) hecha en JavaScript puro (sin frameworks) que permite a usuarios:

Registrarse o iniciar sesión.

Crear eventos (si son administradores).

Ver y registrarse a eventos (si son visitantes).

Guardar los datos en una base de datos falsa (db.json) usando json-server.

Usar Postman para probar manualmente las peticiones a la API.


## index.html
Define la estructura visual de la aplicación, dividida en 4 vistas principales:

Login (#login-view)

Registro (#register-view)

Dashboard principal (#dashboard-view)

Error 404 (#not-found-view)

Estas se muestran u ocultan con JavaScript dependiendo de la acción del usuario.index.html
Define la estructura visual de la aplicación, dividida en 4 vistas principales:

Login (#login-view)

Registro (#register-view)

Dashboard principal (#dashboard-view)

Error 404 (#not-found-view)

Estas se muestran u ocultan con JavaScript dependiendo de la acción del usuario.

error en la linea 190 o 172 donde dice la creacion de el objeto newEvent(const newEvent = { name, description, capacity, date, enrolled: 0 };) y cambiarlo al siguiente...>

 const newEvent = { name, description, capacity, date, enrolled: ""};
