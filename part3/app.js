const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
// Middleware: JSON parser
app.use(express.json());

// Morgan Logging Middleware
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// Phonebook Data
let persons = [
    { id: 1, name: "Arto Hellas", number: "040-123456" },
    { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
    { id: 3, name: "Dan Abramov", number: "12-43-234345" },
    { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
];

// Routes
app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/info', (req, res) => {
    const numPersons = persons.length;
    const currentTime = new Date();
    res.send(`<p>Phonebook has info for ${numPersons} people</p><p>${currentTime}</p>`);
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
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    // Validation: Name & Number must be present
    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'Name or number is missing' });
    }

    // Validation: Unique Name
    if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({ error: 'Name must be unique' });
    }

    // Add New Person
    const newPerson = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(newPerson);
    res.json(newPerson);
});

// Unknown Endpoint Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Unknown endpoint' });
});

// Global Error Handling Middleware
const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        return res.status(400).json({ error: 'Malformatted ID' });
    }
    res.status(500).json({ error: 'Something went wrong' });
};
app.use(errorHandler);

module.exports = app;
