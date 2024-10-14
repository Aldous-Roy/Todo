const express = require('express');
const app = express();
const port = 8000;
const mongoose = require('mongoose');

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const url = "mongodb://localhost:27017/todolist";

mongoose.connect(url)
    .then(() => console.log('Connected to database'))
    .catch(err => console.log('Database connection error:', err));

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },       // Make title required
    description: { type: String, required: true }  // Make description required
});

const Todomodel = mongoose.model('Todo', todoSchema);

// Create new todo item
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newtodo = new Todomodel({ title, description });
        await newtodo.save();
        res.status(201).json(newtodo);
    } catch (error) {
        console.log('Error creating todo:', error);
        res.status(400).json({ message: error.message });
    }
});

// Get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todomodel.find(); 
        res.json(todos);
    } catch (error) {
        console.log('Error fetching todos:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update todo item by ID
app.put('/todos/:id', async (req, res) => {
    console.log('PUT request received for ID:', req.params.id);
    console.log('Request body:', req.body);

    const { title, description } = req.body;
    const id = req.params.id;

    try {
        const updatedTodo = await Todomodel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true, runValidators: true } // runValidators ensures data is validated against schema
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(updatedTodo);
    } catch (error) {
        console.log('Error updating todo:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete todo
app.delete('/todos/:id', async (req, res) => {
    console.log('DELETE request received for ID:', req.params.id);

    const id = req.params.id;

    try {
        const deletedTodo = await Todomodel.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted successfully', todo: deletedTodo });
        res.status(204).end();
    } catch (error) {
        console.log('Error deleting todo:', error);
        res.status(500).json({ message: error.message });
    }
}); 

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});