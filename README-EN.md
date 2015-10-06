# Exploring Loopback - Pt. 1.

![Imagen-Devecoop-Loopback](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/Devecoop-Loopback.png)

Hi, this is the first part of a series of articles related to the [Loopback] framework.

Loopback, as its pages says is a javascript framework **based on express**, so if you know express then it should be easy to understand and apply your knowledge.
> LoopBack is an open source Node.js framework built on top of Express optimized for building APIs for mobile, web, and other devices. Connect to multiple data sources, write business logic in Node.js, glue on top of your existing services and data, connect using JS, iOS & Android SDKs

In my last project we choosed to use this powerful and interesting framework. Among the features we find:
- Easy-to-use **CLI wizard**.
- Built-in **API Explorer**.
- Several features for **creation, relationship and ACL on the models**.
- It's **isomorphic**, sharing the same API between client and server side.

The best way to show you the potential is using it, so here we go...

### Step 1 - Installation:

First we need to verify if we have Node and NPM installed, if you need help check [this awesome post by Ale][postInstalNode]

Easy, we have a **npm package**, so run the following command:
```
$ npm install -g strongloop
```

(Yes, it says strongloop, that's the company that develops loopback, it was recently [acquired by IBM][df2])

Once we have it installed, let's get to work!

The first thing we need to do is creating a new project, as I'm someone that forgets the things that I have to do (and I have too much to do), I think that we can create something easy and productive: a **TODO** list. 

How we do that ?, with our Easy-to-use CLI wizard:
```
$ slc loopback
```

In general the CLI wizard guides us asking questions, in this case we have the following (yes!, is a [yeoman] generator):

```
[?] Enter a directory name where to create the project: todo-app
[?] What's the name of your application? todo-app
```

[Here][step0] we can see what we just did.

### Step 2 - Creating our model

Our next step is creating our todo model, which is going to have a text field with string type and a boolean field to know if it is completed or not.

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

What we just chose ?:
- Select the data-source to attach todo to: **db (memory):** Memory options means that **when we stop the app, we will loose every saved data**. On the next issues we will see how to use different datasources.
- Select model's base class: **PersistedModel**: PersistedModel is the base model of built-in models, except for Email. It provides all the standard create, read, update, and delete (CRUD) operations and exposes REST endpoints for them.
- Expose todo via the REST API? **Yes**: We can **use the API Explorer**.

So far we created the model, now we need to add the properties that I mentioned:

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

To finish we just use ctrl+c.

Two files were added, **todo.js** y **todo.json**. The todo.json file is where we define properties, fields, relationships, permissions, etc. And the todo.js file is where we gonna to create the remote methods, hooks and any related code of the model, etc.

This is our todo.json file:
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

And todo.js:

```
module.exports = function(Todo) {

};
```

Additionally the new datasource of the model was added in the model-config.json file

[Here][step1] we can see what we just did.

So, what we do next ?, how about running what we just did ?, we can run the app as the following:

```
$ node .
Browse your REST API at http://0.0.0.0:3000/explorer
Web server listening at: http://0.0.0.0:3000/
```

If we go to http://0.0.0.0:3000/explorer or http://localhost:3000/explorer we will see two models, todo and Users (the exposed models are the ones that have the public property set to true).

Well now is when you guys test the API (I will only show a couple of simple examples), loopback already create the API for us, where we have the most common operations: POST, GET, PUT, find, exists, etc.

####Adding a new item:

Fist we open the accordeon in POST /todos (http://localhost:3000/explorer/#!/todos/create)

We have three separated groups in there: **Response Class, Parameters, Response Messages**.

**Response class** has two visualizations options: Model: shows us how the properties are defined (type, required, not required, etc) and Model Schema: a json with default values.

In **Parameters** we have a textarea called value, in there we can add the item that we want (create the json by hand or click on the Model Schema on the Data Type column on the right to set as parameter value)
 
**In both cases we can set the content type too.**
 
At last, we have the **Response Messages**, which show us where the request from and some data of the response like the body, the code and the headers.

![Imagen-Making-POST](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/POST-todo-app-pt1.es.png)

In this example we add one item, "Clean the kitchen" :(. After we click on "Try it out!", we have the following response:

![Imagen-POST-RESPONSE](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/POST-RESPONSE-todo-app-pt1.es.png)

To see all added items we can do the same steps but with GET option, in addition we can use filter here, but we will leave this for later.

![Imagen-GET](https://raw.githubusercontent.com/Fblind/loopback-todo-example/master/images/GET-RESPONSE-todo-app-pt1.es.png)

That was the first look on what Loopback offers, **we create an API REST without adding a single line of code**.

In the next part we will see how to integrate the client and connect with a database.

   [Loopback]: <http://loopback.io/>
   [df2]:https://strongloop.com/strongblog/ibm-express-loopback-node-js/
   [yeoman]:http://yeoman.io/
   [step0]: https://github.com/Fblind/loopback-todo-example/tree/step-0
   [step1]:https://github.com/Fblind/loopback-todo-example/tree/step-1
   [postInstalNode]: http://braincoop.devecoop.com/es/posts/como-crear-una-app-backbone-requirejs-compass-desde-cero-con-yeoman.html
