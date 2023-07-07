const express = require('express');
const fs = require('fs');
const path = require('path');
 
const app = express();
const PORT = process.env.PORT || 3000;
 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
 
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
 
app.get('/api/notes', (req, res) => {
    let data = fs.readFileSync('./db/db.json', 'utf8');
    data = JSON.parse(data);
    res.json(data);
});
 
app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    let data = fs.readFileSync('./db/db.json', 'utf8');
    data = JSON.parse(data);
    newNote.id = data.length + 1;
    data.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(data));
    res.json(newNote);
});
 
app.delete('/api/notes/:id', (req, res) => {
    let noteId = req.params.id;
    let data = fs.readFileSync('./db/db.json', 'utf8');
    data = JSON.parse(data);
    data = data.filter(note => note.id !== parseInt(noteId));
    fs.writeFileSync('./db/db.json', JSON.stringify(data));
    res.json({ message: `Deleted note with id: ${noteId}` });
});
 
app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
 
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});