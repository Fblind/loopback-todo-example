# Conociendo loopback - Parte 1.
# Exploring Loopback - Pt. 1.

![Imagen-Devecoop-Loopback](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/Devecoop-Loopback.png)

Buenas!, este articulo es el primero de una serie de varios sobre este framework llamado [Loopback].
Hi, this is the first part of a series of articles related to this framework called [Loopback].

Loopback como dice su pagina es un framework javascript **basado en express**, por lo que si conocen express será fácil de entender y usar el conocimiento que ya tienen. 
> LoopBack is an open source Node.js framework built on top of Express optimized for building APIs for mobile, web, and other devices. Connect to multiple data sources, write business logic in Node.js, glue on top of your existing services and data, connect using JS, iOS & Android SDKs

Loopback, as its pages says is a javascript framework **based on express**, so if you know express then this should be easy to understand and apply your knowledge.
> LoopBack is an open source Node.js framework built on top of Express optimized for building APIs for mobile, web, and other devices. Connect to multiple data sources, write business logic in Node.js, glue on top of your existing services and data, connect using JS, iOS & Android SDKs

En el último proyecto donde estuve optamos por usar este poderoso framework, que tiene varias cosas muy interesantes, entre ellas:
- Easy-to-use **CLI wizard**.
- Built-in **API Explorer**.
- Diversas características para la **creación, relaciones y permisos de los modelos**.
- Es **isomorfico**, compartiendo entre el cliente y el server la misma API.

In my last project we choosed to use this powerfull and interest framework, among the features we find:
- Easy-to-use **CLI wizard**.
- Built-in **API Explorer**.
- Several features for **creation, relationship and ACL on the models**.
- Es **isomorphic**, sharing the same API between client and server side.

Que mejor forma de ver el potencial que usándolo...
The best way to show you the potencial is using it, so here we go...

### Paso 1 - Instalación:
### Step 1 - Instalation:

Primero verifica que tengas Node y NPM instalados, si falta instalarlo tenes este [muy buen post de Ale][postInstalNode]
First we need to verify if we have Node and NPM installed, if you need help check [this awesome post of Ale][postInstalNode]
Fácil, con un **paquete npm** corriendo la siguiente:
Easy, we have a **npm package**, so running the following code:
```
$ npm install -g strongloop
```
(si dice strongloop, strongloop es la empresa que desarrolla loopback, aunque [ahora la adquirió IBM][df2])
(Yes, it says strongloop, is the company that develop loopback, but in the last time [was adquired by IBM][df2])

Ahora que ya lo tenemos instalado vamos a poner manos a la obra !
Once we installed, let's get to work!

Lo primero que tenemos que hacer es crear un proyecto, como soy alguien que se olvida de las cosas (y lamentablemente tengo muchas cosas que hacer) se me ocurrió algo fácil y productivo: un **TODO**.

The first thing we need to do is create a new project, as I'm someone that forget the things that have to do (and I have too much to do), I think that we can create something easy and productive: a **TODO** list. 

Cómo hacemos esto ?, con nuestro Easy-to-use CLI wizard:
How we do that ?, with our Easy-to-use CLI wizard:
```
$ slc loopback
```
Y por lo general este CLI wizard nos va guiando haciéndonos preguntas, en este caso las siguientes (si, es un yeoman generator!):
In general the CLI wizard guides us asking questions, in this case we have the following (yes!, is a yeoman generator):
```
[?] Enter a directory name where to create the project: todo-app
[?] What's the name of your application? todo-app
```

[Aquí][step0] podemos ver lo que acabamos de hacer.
[Here][step0] we can see what we just do.

### Paso 2 - Crear nuestro modelo
### Step 2 - Create our model

Nuestro siguiente paso es crear nuestro model todo, el cual va a tener un campo text de tipo string y un campo booleano para saber si esta completado o no.
Our next step is create our todo model, which going to have a text field with string type and a boolean field to know if is completed or not.

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
What we just choose ?:
- Select the data-source to attach todo to: **db (memory):** En esta entrega elegimos que nuestro datasource sea memory y se guarde en ella, eso quiere decir que **al cerrar nuestra app, se perderá todo lo que guardemos**. Mas adelante veremos como podemos ir cambiando de datasources.
- Select the data-source to attach todo to: **db (memory):** Memory options means that **when we shoot down the app, we will loose every saved data**. On the nexts issues we will prove differents datasources.
- Select model's base class: **PersistedModel**: PersistedModel es el modelo base de todos los modelos que vienen con Loopback, excepto Email y además **nos provee de base las operaciones CRUD y nos expone los REST endpoints**.
- Select model's base class: **PersistedModel**: PersistedModel is the base model of build-in models, exept for Email. It provides all the standard create, read, update, and delete (CRUD) operations and exposes REST endpoints for them.
- Expose todo via the REST API? **Yes**: Nos da la posibilidad de **usar el explorer**.
- Expose todo via the REST API? **Yes**: We can **use the explorer**.

Hasta acá tenemos creado el modelo, y como nos dice la consola vamos a agregar las propiedades que mencionamos anteriormente:
As far we created the model, now we need to add the properties that I mentioned:

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
To finish we just use ctrl+c.

Fíjense que se crearon dos archivos, **todo.js** y **todo.json**. El todo.json es el esqueleto del modelo donde se definen propiedades, campos, relaciones, permisos, etc. Y el todo.js es donde vamos a crear los métodos remotos de este modelo, hooks, etc.
Two files were added, **todo.js** y **todo.json**. The todo.json file is where we define properties, fields, relationships, permissions, etc. And todo.js files is where we gonna to create the remote methods, hooks and any related code of the model, etc.

Cabe agregar que esta forma es común a todos los modelos.
We need to say that this form of use is shared for all models.

Así quedo nuestro todo.json:
That's how our todo.json file is:
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
And the todo.js:
```
module.exports = function(Todo) {

};
```
Además en el model-config.json se agrego el datasource del nuevo modelo.
In addition the new datasource of the model was added in the model-config.json file

[Aquí][step1] podemos ver lo que acabamos de hacer.
[Here][step1] we can see what we just do.

Bueno y ahora ?, lo corremos!:
So, what we do next ?, how about running that we just did ?, we can run the app as the following:
```
$ node .
Browse your REST API at http://0.0.0.0:3000/explorer
Web server listening at: http://0.0.0.0:3000/
```

Si vamos a http://0.0.0.0:3000/explorer o http://localhost:3000/explorer vamos a ver dos modelos, todos y Users (se acuerdan del model-config.json que los modelos tenían una propiedad public ?).
If we go to http://0.0.0.0:3000/explorer o http://localhost:3000/explorer we will see two models, todo and Users (the exposed models are the ones that has the public property in true).

Bueno ahora es la parte donde ustedes se ponen a jugar (yo solo voy a mostrar un par de ejemplos sencillos), loopback ya creo toda la API por nosotros, donde tenemos tenemos las operaciones más comunes: POST, GET, PUT, find, exists, etc.
Well now is when you guys test the API (I will only show a couple of simple examples), loopback already create the API for us, where we have the most common operations: POST, GET, PUT, find, exists, etc.

####Agregar un nuevo ítem:
####Add a new item:

Primero abrimos el acordeón en POST /todos (nos llevara a http://localhost:3000/explorer/#!/todos/create).
Fist we open the accorden in POST /todos (http://localhost:3000/explorer/#!/todos/create)

Una vez abierto tenemos un par de cosas interesantes, en principio esta separado en tres grupos para que sea mejor la visualización de cada paso: Response Class, Parameters, Response Messages.
We have a three separated groups in there: Response Class, Parameters, Response Messages.

La **Response Class** la podemos visualizar de dos maneras, Model: que nos mostrara como estan definidas sus propiedades (de que tipo son, si son requeridas o no, etc) y Model Schema: que nos muestra un json con los valores por defectos.
Response class has two visualizations options: Model: show us how the properties are defined (type, required, not required, etc) and Model Schema: a json with default values .

En **Parameters** en el textarea value agregamos el ítem que queremos (podemos agregarlo directamente o haciendo click sobre la el model schema de la columna Data Type nos setea el esqueleto para que lo completemos).
In Parameters we have a textarea called value, in there we can add the item that we want (create the json by hand or click on the Model Schema on the Data Type column on the right to set as parameter value)
 
**En ambos grupos podemos setear el content type.**
**In both cases we can set the content type too.**
 
Y por ultimo, pero no menos importante, tenemos el **Response Messages**, donde nos muestra de donde vino el request y algunos datos de la respuesta como el body, el code y los headers.
At last, we have the **Response Messages**, which show us where the request from and some data of the response like the body, the code and the headers.

![Imagen-Making-POST](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/POST-todo-app-pt1.es.png)

En este ejemplo agregamos un ítem, limpiar la cocina :( y una vez que hacemos click en "Try it out!" nos muestra la respuesta:
In this example we add one item, "Clean the kitchen" :(. After we click on "Try it out!", we have the following response:

![Imagen-POST-RESPONSE](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/POST-RESPONSE-todo-app-pt1.es.png)

Para ver todos los items que agregamos podemos hacer el mismo procedimiento pero ahora con GET, aquí podemos usar los filtros, pero queda para otra ocasión mostrar el uso de estos.
To see all added items we can do the same steps but with GET option, in addition we can use filter here, but we keep this for another time.

![Imagen-GET](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-RESPONSE-todo-app-pt1.es.png)

Esto fue una primera mirada de lo que nos ofrece Loopback, **sin haber agregado una linea de código por nosotros mismos** tenemos una API REST de un modelo que definimos.
Thats was the first look on what Loopback offers, **we create an API REST without add any line of code**.

En la próxima parte vamos a ver como integrar el cliente y conectarnos a alguna base de datos.
In the next part we will see how to integrate the client and connect with some database.

   [Loopback]: <http://loopback.io/>
   [df2]:https://strongloop.com/strongblog/ibm-express-loopback-node-js/
   [step0]: https://github.com/Fblind/loopback-todo-example/tree/step-0
   [step1]:https://github.com/Fblind/loopback-todo-example/tree/step-1
   [postInstalNode]: http://braincoop.devecoop.com/es/posts/como-crear-una-app-backbone-requirejs-compass-desde-cero-con-yeoman.html