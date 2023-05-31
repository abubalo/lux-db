import { JSONDB } from "./JsonAPI";

interface Todo {
  id: number;
  name: string;
  status: "pending" | "completed" | "archive";
  author: {
    name: string;
  };
}

const db = new JSONDB<Todo>("todo");

(async () => {
    // const todo = db.insert({
    //   id: Math.floor(Math.random() * 10_000_000),
    //   name: "Mop the floor",
    //   status: "pending",
    //   author: {
    //     name: "Jamiu",
    //   },
    // });

  const todo = db
    .select("name", "author.name", "status")
    .where("status")
    .equals("pending")
    .where("author.name")
    .equals("John Doe")
    .run();

  console.log(todo);
})();
