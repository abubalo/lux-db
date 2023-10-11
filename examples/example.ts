//example.ts
import luxdb, { autoId } from '../src/lux-db';

type Users = {
  id: string;
  name: string;
  age: number;
};

const users = luxdb<Users>('users', "db");

// const db = luxdb<{ id: string; name: string }>('test-db');

(async () => {

  

  // const result = await people.getAll("id", "name", "age").where("age").lessThan(50).run()
  // const item =  await  users.insert({ id: autoId(), name: "Abu", age: 25 });
  const item =  await users.getOne('id', 'name').where('name').equals("Abu").run()

  console.log("Result: ", item);
})();

