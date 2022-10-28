const express = require('express');
const path = require('path');
const fs = require('fs');
let notes = require('./db/db.json');
const uniqid = require('uniqid');

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
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      id: uniqid(),
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
            writeErr ? console.error(writeErr) : console.info('Successfully saved a note!')
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

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      const index = parsedNotes.findIndex((element) => element == req.params.id);

      parsedNotes.splice(index, 1);
      notes = parsedNotes;

      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes, null, 4),
        (writeErr) =>
          writeErr ? console.error(writeErr) : console.info('Successfully deleted a note!')
      );
    }
  });

  const response = {
    body: "",
  };

  res.json(response);

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