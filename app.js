const express = require('express');
const app = express();
if(typeof process.env.PORT === 'undefined') throw new Error();
const port = process.env.PORT;

app.use(express.static('public'))

app.get('*', (req, res) => {
    res.redirect('/');
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})
