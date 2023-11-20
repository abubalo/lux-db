# LuxDB

![GitHub](https://img.shields.io/github/license/abubalo/lux-db)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![latest](https://img.shields.io/badge/lastest-1.0.3-yellow)
[![NPM Downloads](https://img.shields.io/npm/dw/lux-db)](https://www.npmjs.com/package/lux-db)


LuxDB is your lightweight, developer-friendly document-based database, crafted to streamline the storage, manipulation, and retrieval of JSON data in your applications. It's the perfect fit for a wide range of use cases.

## Features

- **Query Operations**: Supports CRUD (Create, Read, Update, Delete) operations:
insert: Adds items to the database.
getOne: Retrieves a single item based on specified keys.
getAll: Retrieves multiple items based on specified keys.
updateOne: Updates a single item in the database.
updateAll: Updates multiple items in the database.
deleteOne: Deletes a single item from the database.
deleteAll: Deletes multiple items from the database.


- **Optimized for Small-scale Projects**: With its simple and lightweight implementation, LuxDB is tailored for small-scale JavaScript/TypeScript projects. Its functionality strikes a balance between robust features and simplicity, catering to the needs of smaller applications without unnecessary complexity.

- **Caching**: Utilizes an in-memory cache (Map) to store database items, enhancing read and write operations' speed. Implements a least recently used (LRU) caching mechanism to manage cache size and eviction of less frequently accessed items.

- **Indexing**: Maintains indexes for different fields of the database items to optimize retrieval based on specific keys. Updates indexes whenever items are added, ensuring efficient querying.

- **Error Handling**: Custom error handling for file not found, database errors, and various file system operation failures.
## Use Cases

There are several potential use cases of luxDB, among them are:

- **Configuration Storage**: You can use this database to store and manage configuration settings for your application. Each configuration could be represented as a document in the database.

- **User Preference:** Store user preference with attributes such as theme choices, notification settings, and custom configurations in the database.

- **Content Management System:** If you have a content-driven application, you can store articles, posts, or other content as documents in the database.

- **Product Catalog:** Manage product information for an e-commerce website, including product details, prices, and availability.

- **Small to Medium-Sized Applications**: Simple web or mobile applications where a lightweight database solution is needed for storing and retrieving structured data.

- **Logging and Audit Trails:** Store logs and audit trails for your application to keep track of user actions and system events.

- **Task Management:** Implement a task management system where each task is a document in the database.

- **Messaging:** For building a simple chat or messaging application, you can store chat messages as documents.

- **Configuration Management**: Storing configuration settings or application preferences that can be easily accessed and modified

- **Data Caching:** Use it as a caching mechanism for frequently accessed data.

- **IoT Data Storage**: Storing and managing IoT (Internet of Things) device data in scenarios where a lightweight database is suitable for the scale and complexity of the data.

- **Custom Data Storage:** For any application where you need to persist custom data structures, this database can be adapted to store and manage that data.

In addition to its boundless possibilities, LuxDB offers the advantage of type safety. By leveraging TypeScript for runtime data validation, it ensures that any inserted data adheres to the defined schema. If a mismatch occurs, an instance error is raised, enhancing the security of your data.

## Getting Started

### Installation

```bash
npm i lux-db --save-dev
```

### Usage

```ts filename="index.ts"
import luxdb, { autoId } from 'lux-db';

// Define the schema of your data
interface Todo {
  id: string;
  name: string;
  status: 'pending' | 'completed' | 'archive';
  author: {
    name: string;
  };
}

// Instantiate the database. 
// Specify name with not extionsion, and destination directory(optional). If destination is not provided, the default will be 'db' 
const db = luxdb<Todo>('file-name', "my-db");

// Insert a single item
const insertItem = async () => {
  const item = await db.insert({
    id: autoId(),
    name: 'Buy groceries',
    status: 'pending',
    author: {
      name: 'Alice',
    },
  });

  return item
};

// Insert multiple items
const insertItems = async () => {
  const todos: Todo[] = [
    {
      id: autoId(),
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

You can run `ts-node {path/to/your-ts-file.ts}` in the terminal to execute your query

> ⚠️ **Disclaimer:** Please note that this database is relatively simple and may not be suitable for very large-scale or high-performance applications. It lacks features like indexing, complex querying, and transaction support that more robust databases like SQL or NoSQL databases provide. However, for small to medium-sized applications or prototyping, it can be a convenient and lightweight solution.

## License

[MIT License](/LICENSE).
