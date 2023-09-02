# NodeJsonDb

![GitHub](https://img.shields.io/github/license/abubalo/json-database)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-14.x-green)

NodeJsonDb is a lightweight JSON database library designed to simplify JSON data storage, manipulation, and retrieval in your applications.Suatible for small-scale project where data is store on the server!

## Features

- Create, Read, Update, and Delete (CRUD) operations on JSON data.
- Query capabilities with various `matchers` for retrieving, updating, and deleting data.
- Simple and lightweight implementation suitable for working with small-scale Typescript projects.

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- yarn package manager

### Installation

1. Clone the repository:

```sh
  git clone https://github.com/your-username/json-database.git
```

Navigate to the project directory:

```sh
cd json-database
```

Install dependencies:

```sh
yarn install
```

## Usage

```ts filename="index.ts"

import jsonDatabase from "./src/JsonAPI";
import createId from "./src/lib/generateId"

//Define schema of your data
interface Todo {
id: string;
name: string;
status: "pending" | "completed" | "archive";
author: {
  name: string;
};
}

// Instantiate database
const db = new jsonDatabase<Todo>("file-name");

// insert data
const insertItem = async  () => {
db.insert({
  id: createId(),
  name: "Buy groceries",
  status: "pending",
  author: {
    name: "Alice",
  },
});
}
//Insert many items
const insertItems = async ()=>{
const todos: Todo[] = [
{
  id: createId(),
  name: "Write a report",
  status: "pending",
  author: {
    name: "Bob",
  },
},
{
  id: createId(),
  name: "Pay bills",
  status: "completed",
  author: {
    name: "Charlie",
  },
},
{
  id: createId(),
  name: "Go for a run",
  status: "completed",
  author: {
    name: "David",
  },
},
{
  id: createId(),
  name: "Read a book",
  status: "archive",
  author: {
    name: "Eve",
  },
},
];

// Pass todos items to insert function
const items = db.insert(todos);

return items;

};

// Selecting item from database
const selectItem = async ()=>{
// select todos.name,  todos.author, and todos.status from todos database where status equals pending
const todo = db.getOne("name", "author", "status").where("status")
.equals("pending").run();
return todo;
}

// Selecting all from todo database
const selectItems = async ()=>{
// select all ids, names, and authors from todos database where author name equals John Doe
const item = db.getOne("id","name", "author").where("author.name")
.equals("John Doe").run();
return item;
}

// Update single item from database
const updateItem = async ()=>{
// Delete todos item from todos database where author name equals Abu Balo
db.updateOne({status: "completed"}).where("author.name")
.equals("John Doe").run();
}

// Update many items from database
const updateAllItems = async ()=>{
// update todos.name and todos.status, from todos database where author name equals Abu Balo
const item = db.updateAll({name: "Cook the meal", status : "completed"})
.where("author.name").equals("Abu Balo").run();
return item;
}

// Delete single item from database
const DeleteItem = async ()=>{
// Delete todo item from todos database where author name equals Abu Balo
const item = db.deleteOne().where("author.name").equals("Abu Balo").run();
return item;
}

//  Delete many items from database
const DeleteAllItems = async ()=>{
// Delete  all todos items from todos database where author name equals Abu Balo
const item = db.deleteOne().where("author.name").equals("Abu Balo").run();
return item;
}
```

Modify the src directory to add your improvements and features.

Run the TypeScript compiler to compile the code:

```sh
yarn run local
```

## License
This project is licensed under the [MIT License](/LICENSE).
