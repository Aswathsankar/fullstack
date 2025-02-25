const express = require('express');
const app = express();

let persons = [  // Change `const` to `let` so it can be reassigned
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];
app.use(express.json());

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    const numPersons = persons.length; 
    const currentTime = new Date();

    res.send(`
        <p>Phonebook has info for ${numPersons} people</p>
        <p>${currentTime}</p>
    `);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).json({ error: 'Person not found' });
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = persons.findIndex(p => p.id === id);
    
    if (index != -1) {
        persons.splice(index, 1); // Remove person from array
        res.status(204).end(); // Success, no content
    } else {
        res.status(404).json({ error: "Person not found" });
    }
});
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.post('/api/persons', (request, response) => {
    const body = request.body;

    // 🔴 Check if name or number is missing
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number is missing'
        });
    }

    // 🔴 Check if name already exists
    const nameExists = persons.find(person => person.name === body.name);
    if (nameExists) {
        return response.status(400).json({
            error: 'Name must be unique'
        });
    }

    // ✅ If no errors, add new entry
    const person = {
        id: Math.floor(Math.random() * 10000), // Generate a random ID
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);
    response.json(person);
});
app.use((request, response) => {
    response.status(404).json({ error: 'Unknown endpoint' });
});

// 2️⃣ Middleware for Handling Errors (Place this **at the bottom**, just before `app.listen`)
const errorHandler = (error, request, response, next) => {
    console.error(error.message); // Log error details for debugging

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'Malformatted ID' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    response.status(500).json({ error: 'Something went wrong' });
};

// Add error-handling middleware at the **end** of all routes
app.use(errorHandler);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
