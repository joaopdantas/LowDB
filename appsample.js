// lowdb setup
import { JSONFilePreset } from 'lowdb/node';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name from the current module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultData = { students: [{ id: 1, name: "Marília", age: 30, study: "LEI" }] };
const db = await JSONFilePreset('students.json', defaultData);

// express setup
const app = express();
app.use(express.json()); // for parsing JSON in POST/PUT requests
app.use(express.static('public/'));

// Helper function to generate a new ID
function newId() {
    return db.data.students.length > 0 
        ? Math.max(...db.data.students.map(student => student.id)) + 1
        : 1;
}

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'table.html'));
});

// GET all students
app.get('/students', async (req, res) => {
    await db.read();
    res.json(db.data.students);
});

// GET a single student by ID
app.get('/students/:id', async (req, res) => {
    await db.read();
    const student = db.data.students.find(student => student.id === parseInt(req.params.id));
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

// POST to add a new student
app.post('/students', async (req, res) => {
    await db.read();
    const newStudent = {
        id: newId(),
        ...req.body
    };
    db.data.students.push(newStudent);
    await db.write();
    res.status(201).json(newStudent);
});

// PUT to update an existing student by ID
app.put('/students/:id', async (req, res) => {
    await db.read();
    const student = db.data.students.find(student => student.id === parseInt(req.params.id));
    if (student) {
        Object.assign(student, req.body); // Update student data
        await db.write();
        res.json(student);
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

// DELETE a student by ID
app.delete('/students/:id', async (req, res) => {
    await db.read();
    const studentIndex = db.data.students.findIndex(student => student.id === parseInt(req.params.id));
    if (studentIndex !== -1) {
        const deletedStudent = db.data.students.splice(studentIndex, 1);
        await db.write();
        res.json(deletedStudent);
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
