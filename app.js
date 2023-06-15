const express = require('express');
const app = express();
const port = 1111;
// const databaseURL = process.env.DATABASE_URL || (() => { throw new Error('Could not connect to database'); })();

app.use(express.static('public'))

app.get('*', (req, res) => {
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})
