const express = require('express');
const path = require('path');
const fs = require('fs');
let notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.json(JSON.parse(data));
    }
  })
  console.info(`${req.method} request received`);
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a review`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);
        notes = parsedNotes;

        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr ? console.error(writeErr) : console.info('Successfully saved notes!')
        );
      }
    });

    const response = {
      body: newNote,
    };

    res.json(response);
  } 
  else {
    res.json('Error in saving note');
  }
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);