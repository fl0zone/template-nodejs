const express = require('express');
const app = express();
const port = process.env.PORT ?? 3000;
const databaseURL = proces.env.DATABASE_URL ?? throw new Error('Could not connect to database');

app.use(express.static('public'))

app.get('*', (req, res) => {
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})
