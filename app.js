const express = require('express');
const app = express();
const port = 1111;

app.use(express.static('public'))

app.get('*, (req, res) => {
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})
