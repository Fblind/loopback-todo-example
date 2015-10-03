# Conociendo loopback - Parte 1.

**IMAGEN DE DEVECOOP LOOPBACK**

Buenas!, este articulo es el primero de una serie de varios sobre este framework llamado [Loopback].

Loopback como dice su pagina es un framework javascript basado en express. 
> LoopBack is an open source Node.js framework built on top of Express optimized for building APIs for mobile, web, and other devices. Connect to multiple data sources, write business logic in Node.js, glue on top of your existing services and data, connect using JS, iOS & Android SDKs

En el último proyecto donde estuve optamos por usar este poderoso framework, que tiene varias cosas muy interesantes, entre ellas:
- Easy-to-use CLI wizard.
- Built-in API Explorer.
- Diversas caracteristicas para la creacion, relaciones y permisos de los modelos.
- Es isomorfico, compartiendo entre el cliente y el server la misma API.

Que mejor forma de ver el potencial que usandolo...

### Paso 1 - Instalación:

Facil, con un paquete npm corriendo la siguiente:
```
$ npm install -g strongloop
```
(si dice strongloop, strongloop es la empresa que desarrolla loopback, aunque [ahora la adquirio IBM][df2])

Ahora que ya lo tenemos instalado vamos a poner manos a la obra !

Lo primero que tenemos que hacer es crear un proyecto, como soy alguien que se olvida de las cosas (y lamentablemente tengo muchas cosas que hacer) se me ocurrio algo fácil y productivo: un TODO.

Cómo hacemos esto ?, con nuestro Easy-to-use CLI wizard:
```
$ slc loopback
```
Y por lo general este CLI wizard nos va guiando haciendonos preguntas, en este caso las siguientes (si, es un yeoman generator!):
```
[?] Enter a directory name where to create the project: todo-app
[?] What's the name of your application? todo-app
```

[Aqui][step0] podemos ver lo que acabamos de hacer.

### Paso 2 - Crear nuestro modelo
Nuestro siguiente paso es crear nuestro model todo, el cual va a tener un campo text de tipo string y un campo booleano para saber si esta completado o no.
```
$ cd todo-app
$ slc loopback:model
```
```
? Enter the model name: todo
? Select the data-source to attach todo to: db (memory)
? Select model's base class: PersistedModel
? Expose todo via the REST API? Yes
? Custom plural form (used to build REST URL): todos
Let's add some todo properties now.
```

Que son todas esas selecciones que hicimos:
- Select the data-source to attach todo to: **db (memory):** En esta entrega elegimos que nuestro datasource sea memory y se guarde en ella, eso quiere decir que al cerrar nuestra app, se perdera todo lo que guardemos. Mas adelante veremos como podemos ir cambiando de datasources.
- Select model's base class: **PersistedModel**: PersistedModel es el modelo base de todos los modelos que vienen con Loopback, exepto Email y ademas nos provee de base las operaciones CRUD y nos expone los REST endpoints.
- Expose todo via the REST API? **Yes**: Nos da la posiblidad de usar el explorer.

Hasta acá tenemos creado el modelo, y como nos dice la consola vamos a agregar las propiedades que mencionamos anteriormente:

```
Enter an empty property name when done.
? Property name: text
   invoke   loopback:property
? Property type: string
? Required? Yes
Let's add another todo property.
Enter an empty property name when done.
? Property name: completed
   invoke   loopback:property
? Property type: boolean
? Required? Yes
```
Cuando no queremos agregar más propiedades le damos ctrl+c

Fijense que se crearon dos archivos, todo.js y todo.json. El todo.json es el esqueleto del modelo donde se definen propiedades, campos, relaciones, permisos, etc. Y el todo.js es donde vamos a crear los metodos remotos de este modelo, hooks, etc.
Cabe agregar que esta forma es comun a todos los modelos.
Asi quedo nuestro todo.json:
```
{
  "name": "todo",
  "plural": "todos",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "text": {
      "type": "string",
      "required": true
    },
    "completed": {
      "type": "boolean",
      "required": true
    }
  },
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": []
}
```
Y asi nuestro todo.js:
```
module.exports = function(Todo) {

};
```
Ademas en el model-config.json se agrego el datasource del nuevo modelo.

[Aqui][step1] podemos ver lo que acabamos de hacer.

Bueno y ahora ?, lo corremos!:
```
$ node .
Browse your REST API at http://0.0.0.0:3000/explorer
Web server listening at: http://0.0.0.0:3000/
```

Si vamos a http://0.0.0.0:3000/explorer o http://localhost:3000/explorer vamos a ver dos modelos, todos y Users (se acuerdan del model-config.json que los modelos tenian una propiedad public ?).

Bueno ahora es la parte donde ustedes se ponen a jugar (yo solo voy a mostrar un par de ejemplos sencillos), loopback ya creo toda la API por nosotros, donde tenemos tenemos las operaciones más comunes: POST, GET, PUT, find, exists, etc.

Agregar un nuevo item:
 - 1 - Abrimos el acordeon en POST /todos (nos llevara a http://localhost:3000/explorer/#!/todos/create). 

 Una vez abierto tenemos un par de cosas interesantes, en principio esta separado en tres grupos para que sea mejor la visualizacion de cada paso: Response Class, Parameters, Response Messages.
 La Response Class la podemos visualizar de dos maneras, Model: que nos mostrara como estan definidan sus propiedades (de que tipo son, si son requiridas o no, etc) y Model Schema: que nos muestra un json con los valores por defectos.
 En parameters en el textarea value agregamos el item que queremos (podemos agregarlo directamente o haciendo click sobre la el model schema de la columna Data Type nos setea el esqueleto para que lo completemos).
 En ambos grupos podemos setear el content type.
 Y por ultimo, pero no menos importante, tenemos el Response Messages, donde nos muestra de donde vino el request y algunos datos de la respuesta como el body, el code y los headers.

 ** IMAGEN DE LA PREPARACION **
 En este ejemplo agregamos un item, limpiar la cocina :( y una vez que hacemos click en "Try it out!" nos muestra la respuesta:
 ** IMAGEN DE LA RESPUESTA **

Para ver todos los items que agregamos podemos hacer el mismo procedimiento pero ahora con GET, aqui podemos usar los filtros, pero queda para otra ocasion mostrar el uso de estos.

** IMAGEN DEL GET **

Esto fue una primera mirada de lo que nos ofrece Loopback, sin haber agregado una linea de codigo por nosotros mismos tenemos una API REST de un modelo que definimos.

En la proxima parte vamos a ver como integrar el cliente y conectarnos a alguna base de datos.

   [Loopback]: <http://loopback.io/>
   [df2]:https://strongloop.com/strongblog/ibm-express-loopback-node-js/
   [step0]: https://github.com/Fblind/loopback-todo-example/tree/step-0
   [step1]:https://github.com/Fblind/loopback-todo-example/tree/step-1