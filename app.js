require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { pool } = require('./database/config');

class Server {

    constructor(){
        this.app  = express();
        this.port = process.env.PORT;

        this.DBconnection();
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use( cors() );
        this.app.use( express.json() );
        this.app.use( express.urlencoded({extended: false}) ); 

        this.app.use( express.static('public') );

        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use( '/auth', require('./routes/auth') );
        this.app.use( '/task', require('./routes/task') );
    }

    async DBconnection() {
        await pool.connect();    
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log(`Server http://localhost:${this.port}`);
        });
    }

}

const server = new Server();
server.listen();
