# Conociendo Loopback - Parte 2.

![Imagen-Devecoop-Loopback](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/Devecoop-Loopback.png)

Hola!, en esta edición **vamos a agregar otro modelo vía código, ver las relaciones y jugar un poco con los datasources.**

En la [edición anterior][parte1] habíamos creado un modelo **todo** con el wizard.

Ahora vamos a definir otro modelo llamado **category**, pero **esta vez manualmente**, para hacerlo tenemos diferentes formas, hoy vamos a mostrar dos:

1. **vía código.**
2. **definiendo el schema en json.**

### 1 - Definiendo nuestro modelo manualmente vía código
Como vimos en el post anterior los modelos se extienden por lo general de un modelo base (PersistedModel), por ello tenemos que hacer lo siguiente:
1. Crear un nuevo archivo dentro de la carpeta **boot** (server/boot), **para que se inicialice cuando arranque la aplicación**, por ejemplo create-category.js. Podemos copiar alguna estructura de los otros archivos de esta carpeta.

Los scripts que están dentro de esta carpeta "boot" son los archivos que se ejecutaran en orden cuando la aplicación comienza y luego de que se ejecute el bootstrapper (https://github.com/strongloop/loopback-boot). Los ejemplos más comunes son configuraciones, creaciones de modelos, y de data de ejemplo para desarrollo, entre otros

### Forma 1 - con herencia.
Agregando estas lineas creamos el model:
```
  var Model = server.loopback.Model;
  var Category = Model.extend('categories');
```

Se puede ver [aquí][step-2.0] el código

### Forma 2 - con configuraciones.
Pero también lo podemos hacer así:
```
  var config = {
      dataSource: 'db',
      public: true
    };
    server.model('Category', config);
```
Se puede ver [aquí][step-2.1] el código. [Aquí][configs] se pueden ver las configuraciones que se pueden aplicar.

### Forma 3.
O con el metodo createModel:
```
var Category = server.loopback.createModel('Category');
```

Se puede ver [aquí][step-2.2] el código. 

**Esta es la forma recomendada para crear un modelo manualmente.** Para conocer más sobre este método podemos consultar los [apidocs].

También les dejo esta [respuesta][raymondAnswer] de Raymond Feng, co-founder de Loopback, para que vean lo que dice alguien que sabe mucho del tema sobre estas formas.

Ahora que tenemos nuestro modelo creado, cuando se inicie el server vamos a poder utilizar nuestro modelo creando un archivo al que llamaremos category.js en common/models dejándolo de la siguiente manera:
```
module.exports = function(Category) {
  
};
```

Más adelante vamos a ver que otras cosas podemos hacer acá, por ahora dejémoslo vacío y veamos la otra forma.

### Definiendo nuestro modelo manualmente vía schema
Ahora vamos a crear nuestro modelo definiéndolo en un json, en principio tendrá un solo campo nombre.

Creamos category.json dentro de la carpeta common/models
```
  {
    "name": "category",
    "plural": "categories",
    "base": "PersistedModel",
    "idInjection": true,
    "options": {
      "validateUpsert": true
    },
    "properties": {
      "name": {
        "type": "string",
        "required": true
      }
    },
    "validations": [],
    "relations": {},
    "acls": [],
    "methods": []
  }
```

Luego necesitamos crear el category.js al igual que hicimos anteriormente.

Y para terminar de crearlo necesitamos agregarlo en el model-config.json:
```
  "category": {
      "dataSource": "db",
      "public": true
    }
```
Lo que acabamos de hacer lo pueden ver [aquí][step-2.3].

### Validaciones
Se acuerdan que les dije que más adelante íbamos a ver que podemos hacer en el category.js ?, bueno este archivo **se utiliza para darle comportamiento, agregar métodos remotos, hooks, logica, validaciones y demás.**

Por ahora vamos a ver que fácil es validar en LoopBack. Como nuestro modelo tiene un nombre solamente queremos que ese nombre no se repita y sea unico para ello solamente agregamos lo siguiente en el category.js:

```
  module.exports = function(Category) {
    Category.validatesUniquenessOf('name', {message: 'el nombre debe ser unico'});
  };
```

El código se puede ver [aquí][step-3].

Verán que si ya tenemos agregado por ejemplo "Casa" y queremos agregar "Casa" nos mostrara lo siguiente en el explorer:

![Imagen-Duplicate](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/validacion-es.png)

Como no quiero ahondar mucho en este tema les dejo un buen [articulo][validationDoc] donde se encuentran todos los métodos de validación que vienen con el framework.

### Relaciones
Bueno hasta acá vimos casi lo mismo que el post anterior, **ahora es donde vienen las cosas nuevas e interesantes.**

Lo que queremos lograr con este nuevo modelo es **poder cargar listas de cosas pero a su vez también poder categorizarlas para poder agruparlas, hacer búsquedas, etc.** Por lo que diremos que un todo puede tener cero, uno o más categorías, **el modelo todo tiene una relación con el modelo categoría**.

Con loopback tenemos la posibilidad de definir las relaciones en el json, en este caso vamos a utilizar **[hasAndBelongsToMany][hasAndBelongsToMany]** ya que un ítem todo puede tener muchas categorías y una categoría puede estar en muchos todo ítems.

Para agregar esta relación lo que debemos hacer es ir al todo.json y agregar lo siguiente:

```
  "relations": {
    "categories": {
      "type": "hasAndBelongsToMany",
      "model": "category"
    }
  }
```

[Aquí][modelRelationship] se pueden ver todas las posibilidades de relaciones que tenemos entre los modelos.

Veamos un ejemplo:

Primero agreguemos algunas categorías y algunos ítems de todo. Eso es hacer lo mismo que hicimos en la [edición anterior][parte1] así que no voy a mostrarlo, en mi caso creé lo siguiente:
- **3 categorias: Casa, Animales, Auto**

![Imagen-GET-Categories](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-Categories-ES.png)

- **2 ítems: Limpiar el baño, Comprar comida**

![Imagen-GET-Todo](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-Todos-ES.png)

Ahora como hago para agregarle una categoria al item ?, bueno de la siguiente manera:

- Haciéndole un PUT al endpoint que cumple esa función /todos/{id}/categories/rel/{fk}. PUT es un metodo HTTP que modifica el objeto en cuestión, [acá][HTTPMethods] les dejo los diferentes verbos que se usan y son utilizados para los servicios REST.

Vamos a agregar la categoría "Casa" (fk: id 1 de categoria) a el ítem "Limpiar el baño" (id: id 1 de todo), por lo que esto quedará así:

![Imagen-PUT-Categories-TODO](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/PUT-AgregarCategoriaATODO-es.png)

Y nos devolverá esto:

![Imagen-PUT-Categories-TODO-Response](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/PUT-AgregarCategoriaATODO-RESPUESTA-es.png)

Para verificar que se haya agregado la categoría correctamente podemos hacerle un GET a /todos/{id}/categories

![Imagen-GET-Categories-TODO](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-Todo-Categories-ES.png)

Y como vemos nos devolvió "Casa"

![Imagen-GET-Categories-TODO-Response](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-Todo-Categories-Response-ES.png)

#### Filtros
Otra buena característica de Loopback es que tiene varias formas de [consultar nuestra data][queryngData], para esta entrega solo vamos a ver en acción uno de los filtros más comunes, el **where filter**:

Como siempre para probar vamos al explorer y juguemos con las categorías que creamos antes: "Casa", "Animales" y "Auto".

Entonces ahora si queremos buscar el ítem con el nombre "Casa", hacemos lo siguiente en el GET de categories:

![Imagen-GET-Categories-TODO-Filter](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-Categories-Filter-ES.png)

Nos aparece los que matchean exactamente con Casa, pero también podemos buscar todos los que comiencen con "A" por ejemplo:
```
{"where" : {"name":{"like":"A"}}}
```
y nos da como resultados los ítems que contienen a "Animales" y "Auto".

![Imagen-GET-Categories-Filter-Like-Response](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-Categories-Filter-Like-Response-ES.png)

La misma forma se puede utilizar para todos los modelos, **¿cómo haríamos si queremos obtener la lista de todas las tareas que nos faltan realizar?**

Sobre los filtros vamos a ver más en la próxima entrega cuando tengamos integrado el cliente.

#### Persistencia
Vos me dirás "che todo bien con esto, pero cuando bajo el server pierdo todo lo que cargué". Bueno **la solución a eso es persistir los datos**, Loopback viene con la posibilidad de poder conectarse a las [bases de datos][databases] más utilizadas. Nosotros vamos a ver un par de ejemplos, mostrando la facilidad para conectar bases noSQL, con MongoDB, y bases relacionales, con MySQL.

#### Persistencia con MongoDB
Vamos a arrancar con la base que más utilizo, MongoDB. Y la conexión la vamos a hacer a través de la CLI.

Antes que todo si no tenemos mongo instalado necesitamos instalarlo con una versión 2.6 o superior, en la [página][mongoDownload] de mongo están los archivos.

Luego ya podemos instalar el conector de mongo, lo hacemos mediante npm:
```
  $ npm install loopback-connector-mongodb --save
```
Una vez instalado vamos a poder agregar nuestro nuevo datasource:
```
  $ slc loopback:datasource
```
Y nos aparecerá el wizard que ya conocemos:
```
? Enter the data-source name: todoMongo
? Select the connector for todoMongo: 
  PostgreSQL (supported by StrongLoop) 
  Oracle (supported by StrongLoop) 
  Microsoft SQL (supported by StrongLoop) 
❯ MongoDB (supported by StrongLoop) 
  SOAP webservices (supported by StrongLoop) 
  REST services (supported by StrongLoop) 
  Neo4j (provided by community) 
(Move up and down to reveal more choices)
```

y listo ahora vamos a ver que es lo que hicimos, aunque es bastante descriptivo:
- **? Enter the data-source name:** Nombre del data source, acá pueden elegir lo que les parezca, en nuestro caso elegimos todoMongo
- **? Select the connector for todoMongo:** Acá elegimos el conector, en este caso mongoDB, que como ven esta siendo mantenido directamente por strongloop, allí hay muchos más para elegir, hasta la comunidad mantiene algunos !

Si vamos al datasources.json vamos a ver que nos encontramos con que nuestro nuevo datasource se agrego:
```
{
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "todoMongo": {
    "name": "todoMongo",
    "connector": "mongodb"
  }
}
```

Ya tenemos todo lo que necesitamos pero antes de empezar a probar necesitamos hacer 2 cosas:
1. Configurar la conexión:

```
  "todoMongo": {
    "name": "todoMongo",
    "connector": "mongodb",
    "host": "127.0.0.1", 
    "database": "todoDB", 
    "username": "", 
    "password": "", 
    "port": 27017 
  }

```
2. Decirle a los modelos que queramos que se usen como datasource el que acabamos de crear, esto se hace cambiando el campo dataSource de los modelos que queramos del model-config.js, por ejemplo:
```  
  "todo": {
    "dataSource": "todoMongo",
    "public": true
  },
  "category": {
    "dataSource": "todoMongo",
    "public": true
  }
```
[Aquí][step-4] esta lo que hicimos.

Volvamos al explorer, agreguemos un par de categorías y como ven nada cambio, seguimos de la misma forma que antes. Ahora si apagamos el server, lo volvemos a levantar y hacemos un GET a las categorías vamos a obtener las que agregamos antes de apagar el server.

#### Persistencia con MySQL

Lo bueno de esto es que es lo mismo, por lo que no voy a ser muy detallado:
En principio debemos tener MySQL 5.0 o superior, en la [página][mySqlDownloads] lo pueden descargar.

Luego son los mismos pasos que hicimos antes, instalar el conector, configurar los modelos y la conexión y empezar a jugar !

Igualmente [áca][mySqlDocs] dejo la documentación del connector.


Bueno esto fue todo, espero que les haya gustado, a mi como siempre me gustó poder hacerlo, para la próxima entrega vamos a ver como integrar el cliente con todo lo que estuvimos haciendo, espero poder traerla con menos tiempo de diferencia.

  [parte1]: <http://braincoop.devecoop.com/es/posts/conociendo-loopback-parte-1-2.html>
  [step-2.0]: <https://github.com/Fblind/loopback-todo-example/blob/step-2.0/server/boot/create-category.js>
  [step-2.1]: <https://github.com/Fblind/loopback-todo-example/blob/step-2.1/server/boot/create-category.js>
  [step-2.2]: <https://github.com/Fblind/loopback-todo-example/blob/step-2.2/server/boot/create-category.js>
  [configs]: <https://docs.strongloop.com/display/LB/app+class#app-model>
  [apidocs]: <https://apidocs.strongloop.com/loopback/#loopback-createmodel>
  [raymondAnswer]: <https://groups.google.com/d/msg/loopbackjs/n9JSGPAmSMY/yDEmcOQ1EksJ>
  [step-2.3]: <https://github.com/Fblind/loopback-todo-example/tree/step-2.3>
  [validationDoc]: <https://docs.strongloop.com/display/public/LB/Validating+model+data>
  [hasAndBelongsToMany]: <https://docs.strongloop.com/display/public/LB/HasAndBelongsToMany+relations>
  [modelRelationship]: <https://docs.strongloop.com/display/public/LB/Creating+model+relations>
  [queryngData]: <https://docs.strongloop.com/display/public/LB/Querying+data>
  [databases]: <https://docs.strongloop.com/display/public/LB/Database+connectors>
  [mongoDownload]: <https://www.mongodb.org/downloads#production>
  [step-4]: <https://github.com/Fblind/loopback-todo-example/commit/b86facded30ca4e24f5f3680449d6d72105f9d0f>
  [mySqlDownloads]: <http://dev.mysql.com/downloads/>
  [mySqlDocs]: < https://docs.strongloop.com/display/public/LB/MySQL+connector>
  [step-3]: <https://github.com/Fblind/loopback-todo-example/tree/step-3>
  [HTTPMethods]: <https://es.wikipedia.org/wiki/Hypertext_Transfer_Protocol#M.C3.A9todos_de_petici.C3.B3n>