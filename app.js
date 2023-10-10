const express = require('express');
const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.static('public'))

app.get('/home', (req, res) => {
    res.redirect('/')
})

app.get('/test', (req, res) => {
    res.send("<p>Тестовая страница</p> <p><a href=\"/home\">Вернуться на главную</a></p>")
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})