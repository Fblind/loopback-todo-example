# Exploring Loopback - Part 2.

![Imagen-Devecoop-Loopback](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/Devecoop-Loopback.png)

Hi! In this new post **we will add another model through code, see the relationships, and play a little with datasources.**

In the [previous post][parte1] we created a **todo** model using the wizard.

Now we will create another model, **category**, **this time manually.** To do this we have many ways, we will see two of them:

1. **through code**
2. **through a JSON schema**

### 1 - Creating a model manually through code
As seen in the previous post, models are generally exstended from a base model (PersistedModel), so we have to do the following:
1. Create a new file , for instance "create-category.js", inside the **boot** (server/boot) folder, **to have the model initialized when the application starts.** You can copy the content from other files in that same folder.
The files inside the "boot" folder are scripts to be executed in order when the application starts, and after the bootstrapper runs (https://github.com/strongloop/loopback-boot). 

These scripts are usually used for configuration, models creation, and testing data creation.

### Method 1 - using inheritance.
Adding these lines we create the model:
```
  var Model = server.loopback.Model;
  var Category = Model.extend('categories');
```

[Here][step-2.0] you can find the code.

### Method 2 - using configurations.
The model can be created like this also:
```
  var config = {
      dataSource: 'db',
      public: true
    };
    server.model('Category', config);
```

[Here][step-2.1] you can find the code. [Here][configs] you can see the configurations that can be applied.

### Method 3 - using the createModel method:
```
var Category = server.loopback.createModel('Category');
```

[Here][step-2.2] you can find the code.

**This one is the recommended way to create a model manually.** To know more about createModel, we can read the [apidocs].

I also include here [this answer][raymondAnswer] by Raymond Feng, co-founder of Loopback, if you want to know what he thinks about this different methods.


Now that we have our model created, when the server starts we will be able to use it creating a file "category.js" inside "common/models", with this content:
```
module.exports = function(Category) {
  
};
```

We will see next what other things can be done inside this model, for now, leave it empty.

We will review another way of defining a model.

### Defining a model manually via JSON schema
To begin with, let's add a "name" field.

Create "category.json" inside the common/models folder:
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

Then create "category.js", just like we did before.

Finally, we add this into "model-config.json":
```
  "category": {
      "dataSource": "db",
      "public": true
    }
```

You can see this code [here][step-2.3].

### Validations

So we said that inside "category.js" we could do other things.
What we do in this file is **adding behaviour to the model, adding remote methods, hooks, bussiness logic, validations and more.**

For now, let's take a look at validations, and how LoopBack makes them really easy.
Our model has a name, and we want it to be unique.
To achieve this, let's add in category.js the following:

```
  module.exports = function(Category) {
    Category.validatesUniquenessOf('name', {message: 'el nombre debe ser unico'});
  };
```

You can find the code [here][step-3]

As you can test, if we have an "Example" and we want to add another "Example", the explorer will display:

![Imagen-Duplicate](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/validacion-en.png)

Validations is a long topic. For those interested, here's a [very good article][validationDoc] about all the validation methods provided by the framework.


### Relationships
So far, we haven't gone too deep. **Here's when the interesting part begins.**

With our new model, we want to categorize our ToDos, to group them, search, etc.
Let's say that a "todo" model can have zero, one or more categories. **The todo model has a **relationship** with the model category.**

We can define relationships in the JSON schema, for this example we'll use **[hasAndBelongsToMany][hasAndBelongsToMany]** since a todo can have many categories, and a category can include many todos.

To add this relationship, we go to todo.json and add:

```
  "relations": {
    "categories": {
      "type": "hasAndBelongsToMany",
      "model": "category"
    }
  }
```

[Here][modelRelationship] is the list of all possible relationships.

Let's see an example:

Add some categories and todos first, like we did in the previous post.
- **I created 3 categories: House, Animals, Car**

![Imagen-GET-Categories](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-Categories-EN.png)

- **And I created 2 items: Clean bathroom, Buy food**

![Imagen-GET-Todo](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-Todos-EN.png)

And to add a category to an item, I send a PUT request to the endpoint /todos/{id}/categories/rel/{fk}. [Here][HTTPMethods] you can see all the HTTP methods.

Let's add category "House" (fk: category id 1) to the item "Clean bathroom" (id: todo id 1):

![Imagen-PUT-Categories-TODO](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/PUT-AgregarCategoriaATODO-es.png)

And we get:

![Imagen-PUT-Categories-TODO-Response](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/PUT-AgregarCategoriaATODO-RESPUESTA-es.png)

To verify, make a GET request to /todos/{id}/categories

![Imagen-GET-Categories-TODO](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-Todo-Categories-ES.png)

We can see we now have "House"

![Imagen-GET-Categories-TODO-Response](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-Todo-Categories-Response-EN.png)

#### Filters
Another great LoopBack feature is the different ways to [query our data][queryngData], in this post we will see the most common one, **the "where" filter**:

If we want to search the item with name "House", we do this in the GET to categories:

![Imagen-GET-Categories-TODO-Filter](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-Categories-Filter-EN.png)

We get all those that match "House" exactly. We can search the ones starting with "A":
```
{"where" : {"name":{"like":"A"}}}
```
and we get "Animals".

![Imagen-GET-Categories-Filter-Like-Response](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-Categories-Filter-Like-Response-EN.png)

We can do this for all the models. Try yourself, **how do you get the list of all the pending ToDos ?**

We will see more on filters in the next part, when we integrate the client.

#### Persistance
Right now it's all great, but we lose the data as soon as the server stops!
We need to persist our data. LoopBack can connect to all the most popular [databases][databases]. Let's see how easy it is to connect to a noSQL database like MongoDB, and relational databases like MySQL.

#### Persistance with MongoDB
Let's connect to my database of choice, MongoDB, through the CLI.

First of course we need Mongo installed, version 2.6 or higher, the downloads are [here][mongoDownload].

The we install the mongo connector, using npm:
```
  $ npm install loopback-connector-mongodb --save
```
And add our new datasource:
```
  $ slc loopback:datasource
```
We get the familiar wizard:
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
Let's review the choices, they are self-descriptive:
- **? Enter the data-source name:** Name of the data source, any name you want, in this case, todoMongo
- **? Select the connector for todoMongo:** The connector name, in this case mongoDB, you can see it is supported by strongloop. There are many more to choose.

In datasources.json we will find the new one:
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
It's all set. Before using the app, do the following:
1. Configurate the connection:

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
2. Order the models to use the new datasource, changing the dataSource field in model-config.js, like this:
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
[Here][step-4] you'll find the code so far.

Go back to the explorer, add some categories. Now if you quit the server, start it again, and GET the categories, we will see they were persisted.

#### Persistance with MySQL

This works very similar as with Mongo.

Make sure you have MySQL 5.0 or higher, downloads are [here][mySqlDownloads].

Then follow the same steps as we did with Mongo: installing the connector, configuring models and connection, and that's it.

[Here][mySqlDocs] you can find the connector documentation if needed.



That's it for this part, I hope you enjoyed it, I sure did.

Next time we will integrate the client with our application.

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
  [mySqlDocs]: <https://docs.strongloop.com/display/public/LB/MySQL+connector>
  [step-3]: <https://github.com/Fblind/loopback-todo-example/tree/step-3>
  [HTTPMethods]: <https://es.wikipedia.org/wiki/Hypertext_Transfer_Protocol#M.C3.A9todos_de_petici.C3.B3n>