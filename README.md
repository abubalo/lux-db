# JSONDatabase

![GitHub](https://img.shields.io/github/license/abubalo/json-database)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-14.x-green)

A personal project aimed at enhancing TypeScript knowledge by implementing a simple JSON database with query capabilities.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The JSONDatabase project is a personal endeavor to deepen TypeScript skills by building a basic JSON database system. It's designed to provide a hands-on experience with TypeScript concepts and best practices.

## Features

- Create, Read, Update, and Delete (CRUD) operations on JSON data.
- Query capabilities with various `matchers` for retrieving, updating, and deleting data.
- Simple and lightweight implementation suitable for working with small-scale Typescript projects.

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- npm (usually comes with Node.js)

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

```ts
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

//Insantiatite database
const db = new jsonDatabase("file-name");

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
    //Insert many data
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

  // pass todos items to const
  const items = db.insert(todos);

  return items;

};

// Selecting item from database
const selectItem = async ()=>{
  // select todos.name,  todos.author, and todos.status from todos database where status eqauls pending
  const todo = db.getOne("name", "author", "status").where("status").equals("pending").run();
  return todo;
}

// Selecting all from todo database
const selectItems = async ()=>{
  // select all ids, names, and authors from todos database where author name eqauls John Doe
  const item = db.getOne("id","name", "author").where("author.name").equals("John Doe").run();
  return item;
}

const updateItem = async ()=>{
  // Delete todos item from todos database where author name eqauls Abu Balo
  db.updateOne({status: "completed"}).where("author.name").equals("John Doe").run();
}
const updateAllItems = async ()=>{
  // update todos.name and todos.status, from todos database where author name eqauls Abu Balo
  const item = db.updateAll({name: "Cook the meal", status : "Completed"}).where("author.name").equals("Abu Balo").run();
  return item;
}
const DeleteItem = async ()=>{
  // Delete todo item from todos database where author name eqauls Abu Balo
  const item = db.deleteOne().where("author.name").equals("Abu Balo").run();
  return item;
}
const DeleteAllItems = async ()=>{
  // Delete  all todos items from todos database where author name eqauls Abu Balo
  const item = db.deleteOne().where("author.name").equals("Abu Balo").run();
  return item;
}
```

Modify the src directory to add your improvements and features.

Run the TypeScript compiler to compile the code:

```sh
yarn run local
```

License
This project is licensed under the [MIT License](/LICENSE).
