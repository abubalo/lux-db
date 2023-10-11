# Lux DB

![GitHub](https://img.shields.io/github/license/abubalo/lux-db)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![latest](https://img.shields.io/badge/lastest-1.0.3-yellow)
[![NPM Downloads](https://img.shields.io/npm/dw/lux-db)](https://www.npmjs.com/package/lux-db)


Lux DB is your lightweight, developer-friendly document database library, crafted to streamline the storage, manipulation, and retrieval of JSON data in your applications. It's the perfect fit for a wide range of use cases.

## Features

- Lux DB provides a seamless way to store, update, and delete data. It supports both single-item and batch operations, ensuring you have complete control over your data.

- Query capabilities with various `matchers` for retrieving, updating, and deleting data.

- Simple and lightweight implementation suitable for working with small-scale Javascript/Typescript projects.

## Use Cases

Here are some potential use cases of luxDB database:

- Configuration Storage: You can use this database to store and manage configuration settings for your application. Each configuration could be represented as a document in the database.

- **User Preference:** Store user preference with attributes such as theme choices, notification settings, and custom configurations in the database.

- **Content Management:** If you have a content-driven application, you can store articles, posts, or other content as documents in the database.

- **Product Catalog:** Manage product information for an e-commerce website, including product details, prices, and availability.

- **Logging and Audit Trails:** Store logs and audit trails for your application to keep track of user actions and system events.

- **Task Management:** Implement a task management system where each task is a document in the database.

**- Messaging:** For building a simple chat or messaging application, you can store chat messages as documents.

- **Session Management:** Store session data for user sessions in a web application.

- **Data Caching:** Use it as a caching mechanism for frequently accessed data.

- **Custom Data Storage:** For any application where you need to persist custom data structures, this database can be adapted to store and manage that data.

In addition to its boundless possibilities, LuxDB offers the advantage of type safety. By leveraging TypeScript for runtime data validation, it ensures that any inserted data adheres to the defined schema. If a mismatch occurs, an instance error is raised, enhancing the security of your data.

## Getting Started

### Installation

```bash
  npm i lux-db --save-dev
```

### Usage

```ts filename="index.ts"
import luxdb, { createId } from 'lux-db';

// Define the schema of your data
interface Todo {
  id: string;
  name: string;
  status: 'pending' | 'completed' | 'archive';
  author: {
    name: string;
  };
}

// Instantiate the database
const db = luxdb<Todo>('file-name');

// Insert a single item
const insertItem = async () => {
  db.insert({
    id: createId(),
    name: 'Buy groceries',
    status: 'pending',
    author: {
      name: 'Alice',
    },
  });
};

// Insert multiple items
const insertItems = async () => {
  const todos: Todo[] = [
    {
      id: createId(),
      name: 'Write a report',
      status: 'pending',
      author: {
        name: 'Bob',
      },
    },
    // ... more items
  ];

  // Insert multiple items into the database
  const items = await db.insert(todos);

  return items;
};

// Select a single item from the database
const selectItem = async () => {
  // Select an item where the status is "pending"
  const todo = await db.getOne('name', 'author', 'status').where('status').equals('pending').run();
  return todo;
};

// Select all items from the database
const selectItems = async () => {
  // Select items where the author's name is "John Doe"
  const items = await db.getAll('id', 'name', 'author').where('author.name').equals('John Doe').run();
  return items;
};

// Update a single item in the database
const updateItem = async () => {
  // Update an item where the author's name is "John Doe" to have a "completed" status
  await db.updateOne({ status: 'completed' }).where('author.name').equals('John Doe').run();
};

// Update multiple items in the database
const updateAllItems = async () => {
  // Update items where the author's name is "Abu Balo" to have a new name and status
  const items = await db
    .updateAll({ name: 'Cook the meal', status: 'completed' })
    .where('author.name')
    .equals('Abu Balo')
    .run();
  return items;
};

// Delete a single item from the database
const deleteItem = async () => {
  // Delete an item where the author's name is "Abu Balo"
  const item = await db.deleteOne().where('author.name').equals('Abu Balo').run();
  return item;
};

// Delete multiple items from the database
const deleteAllItems = async () => {
  // Delete all items where the author's name is "Abu Balo"
  const items = await db.deleteAll().where('author.name').equals('Abu Balo').run();
  return items;
};
```

You can `ts-node {path/to/your-ts-file.ts}` in the terminal to execute your query

> ⚠️ **Disclaimer:** Please note that this database is relatively simple and may not be suitable for very large-scale or high-performance applications. It lacks features like indexing, complex querying, and transaction support that more robust databases like SQL or NoSQL databases provide. However, for small to medium-sized applications or prototyping, it can be a convenient and lightweight solution.

## License

[MIT License](/LICENSE).
