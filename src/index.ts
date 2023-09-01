import { createId } from "@paralleldrive/cuid2";
import JSONDatatbase from "./JsonAPI";
import ID from "./lib/generateId";

interface Todo {
  id: string;
  name: string;
  status: "pending" | "completed" | "archive";
  author: {
    name: string;
  };
}

const db = new JSONDatatbase<Todo>("todo");

(async () => {
  const todos: Todo[] = [
    {
      id: createId(),
      name: "Buy groceries",
      status: "pending",
      author: {
        name: "Alice",
      },
    },
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
  
  db.insert(todos);
  
  

  // const todo = db
  //   .select("name", "author.name", "status")
  //   .where("status")
  //   .equals("pending")
  //   .where("author.name")
  //   .equals("John Doe")
  //   .run();

  // const todo = db.getOne("name", "author", "status").where("status").equals("pending").run();
  // const todo = db.getAll("name", "author", "status").where("status").equals("pending").run();
  // const todo = db.updateOne({status: "completed"}).where("name").equals("John doe").run();
  // console.log(todo);
})();
