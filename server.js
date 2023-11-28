const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQLite database.');
});

db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT)');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/xss', (req, res) => {
    
    res.send(`You entered: ${req.body.input}`);
});


app.post('/sql-injection', (req, res) => {
    let username = req.body.username;
    
    let query = `SELECT * FROM users WHERE username = '${username}'`;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.send('An error occurred.');
            throw err;
        }
        
        res.send(`Results: ${JSON.stringify(rows)}`);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
