# JSON Database

JSONDB is a lightweight and versatile JSON database that provides a simple yet powerful solution for storing and querying JSON data. With JSONDB, you can easily persist and manipulate structured data in a JSON format. JSONDB is a great choice for simple applications where data can be stored along with server logic.

## Features

- **Easy to Use**: JSONDB offers a user-friendly interface for storing, retrieving, and managing JSON data.
- **Query Capabilities**: Perform advanced queries on your JSON data using a flexible and intuitive query syntax.
  <!-- - **Command-Line Interface (CLI)**: Interact with the database through a command-line interface, allowing for automation and scriptability. -->
  <!-- - **Graphical User Interface (GUI)**: Access the database using a graphical user interface with intuitive data visualization and query building tools. -->
  <!-- - **Data Integrity**: JSONDB ensures data integrity by providing validation and schema evolution mechanisms. -->
- **Performance Optimization**: Optimize database performance using indexing and caching techniques.
  <!-- - **Security**: Protect your data with built-in security features such as authentication and access control. -->
  **Integration**Seamlessly integrates JSONDB with your existing tools, frameworks, and systems.

<!-- ## Installation

To install JSONDB, follow these steps:

1. Clone the repository: `git clone https://github.com/abubalo/jsondb.git`
2. Install dependencies: `npm install`
3. Start the JSONDB server: `npm start` -->

## Usage

To start using JSONdb, follow these steps:

Install JSONdb by running `npm install jsondb` or `yarn add jsondb`.

Import the JSONdb module into your project.
Initialize the database with the path to your JSON data file.

Utilize the provided CRUD APIs to interact with the JSON data.

Example Usage

```ts filename="index.ts" switcher

import JSONdb from 'jsondb';


// Define the  schema
interface Todo {
    id: number;
  name: string;
  status: "pending" | "completed" | "archive";
  author: {
      name: string;
  };
}

// Initialize the database
const db = new JSONdb<Todo>();

// Insert a new record
const data = { name: 'John Doe', age: 30, country: 'USA' };
db.insert(data);

// Retrieve a record
const record = db.find("todo").where("id").equals("3");

// Update a record
record.update.where("id").equals("2").set(age: 31);
db.update(record);

// Delete a record
db.delete({ name: 'John Doe' });

```

<!-- ### Command-Line Interface (CLI)

The CLI provides a powerful way to interact with JSONDB through command-line commands. Here are some examples:

```bash
# Insert data into the database
$ jsondb insert --data '{name: John Doe, age: 30, country: USA}'

# Query data from the database
$ jsondb query --collection users --where 'age > 25' --orderBy 'name' --limit 10

# Update data in the database
$ jsondb update --collection users --where 'name = "John Doe"' --set 'age = 35'

# Delete data from the database
$ jsondb delete --collection users --where 'age < 30'

```

For more details on the available commands and options, refer to the CLI Documentation.
Graphical User Interface (GUI)

The GUI provides a user-friendly interface for managing your JSON data. It offers features such as:

Data visualization
Query building
CRUD operations
Configuration settings

JSONDB GUI

For instructions on how to run the GUI, refer to the GUI Documentation.
Documentation

For detailed information on using JSONDB, refer to the Documentation.

`
Getting Started
API Reference
Querying Data
Advanced Features
` -->

### Licensed under the MIT License.
