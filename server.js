const path = require('path');
const noteJSON = require('./db/db.json');
const fs = require('fs');
const express = require('express');

const PORT = 1008;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
// Displays html in local browser
app.use(express.static('./'));

// User middleware to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(noteJSON);
});
app.post('/api/notes', (req, res) => {
// gets the Id of last note if it's been created
const lastId = noteJSON.length ? Math.max(...(noteJSON.map(note => note.id))) : 0;
const id = lastId + 1;
noteJSON.push( { id, ...req.body} );
res.json(noteJSON.slice(-1));
});

// Erases note by ID 
app.delete('/api/notes/:id', (req, res) => {
let note = noteJSON.find( ({ id }) => id === JSON.parse(req.params.id));
// removes object at index of note id
noteJSON.splice( noteJSON.indexOf(note), 1);
res.end("Note erased!");
});

app.listen(PORT, () => 
console.log(`Server is listening on port ${PORT}`)
);