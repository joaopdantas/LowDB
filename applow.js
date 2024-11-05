import { JSONFilePreset } from 'lowdb/node';

const defaultData = { users: [] };
const db = await JSONFilePreset('db.json', defaultData);

async function addUser(name, age) {
  await db.read();
  const newUser = { id: newId(), name, age };
  db.data.users.push(newUser);
  await db.write();
  console.log(`User ${name} added.`);
}

async function updateUser(id, updatedData) {
  await db.read();
  const user = db.data.users.find((user) => user.id === id);
  if (user) {
    Object.assign(user, updatedData);
    await db.write();
    console.log(`User with id ${id} updated.`);
  } else {
    console.log(`User with id ${id} not found.`);
  }
}

async function listUsers() {
  await db.read();
  console.log("Users:", db.data.users);
}

// Helper function to generate a new ID
function newId() {
  return db.data.users.length > 0 
    ? Math.max(...db.data.users.map(user => user.id)) + 1
    : 1;
}

async function main() {
  await addUser('Alice', 25);
  await addUser('Bob', 30);
  await listUsers();
  await updateUser(1, { age: 60 });
  await listUsers();
}

// Test the implementation
main().catch((err) => {
  console.error('Error:', err);
});
