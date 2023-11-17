const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const { pool } = require('../database/config');
const { generateJWT } = require('../helpers/generate-jwt');

const singIn = async ( req = request, res = response ) => {

    const { email, password, name, lastname, avatar } = req.body;
    const user_id = uuidv4();
    let query, result;

    try {
        query = `SELECT * FROM users WHERE email=$1`;
        result = await pool.query(query,[email]);

        if(result.rowCount > 0){
            return res.status(400).json({
                ok: false,
                msg: `El usuario ${ email } ya existe`
            });
        }
        
        const pass = bcrypt.hashSync( password, bcrypt.genSaltSync() );
        query = `INSERT INTO users (user_id,name,lastname,email,password,avatar) VALUES ($1,$2,$3,$4,$5,$6)`;
        result = await pool.query(query, [user_id,name,lastname,email,pass,avatar]);

        res.status(201).json({
            ok: true,
            name,
            email
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const logIn = async ( req = request, res = response ) => {

    const { email, password } = req.body;
    let query, result;

    try {
        query = `SELECT * FROM users WHERE email=$1`;
        result = await pool.query(query,[email]);

        if(result.rowCount < 1){
            return res.status(400).json({
                ok: false,
                msg: `El usuario ${ email } no existe`
            });
        }
        
        const validPassword = bcrypt.compareSync( password, result.rows[0]?.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        const token = await generateJWT( result.rows[0]?.user_id );

        res.json({
            ok: true,
            uid: result.rows[0]?.user_id,
            name: result.rows[0]?.name,
            lastname: result.rows[0]?.lastname,
            email: result.rows[0]?.email,
            avatar: result.rows[0]?.avatar,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

module.exports = {
    singIn,
    logIn
}
