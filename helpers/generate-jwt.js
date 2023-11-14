const jwt = require('jsonwebtoken');
const { pool } = require('../database/config');

const generateJWT = ( uid = '' ) =>{

    return new Promise ( (resolve, reject) =>{

        const payload = { uid };

        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '4h'
        }, ( err, token ) =>{

            if( err ){
                console.log(err);
                reject('unable to generate token')
            }else{
               resolve( token ); 
            }

        })

    })
}

const verifyJWT = async ( token = '' ) => {

        try {
            if( !token ) {
                return null;
            }
    
            const { uid } = jwt.verify( token, process.env.JWT_SECRET );
            const query = `SELECT * FROM users WHERE user_id=$1`;
            const result = await pool.query(query,[uid]);
            return result.rows[0];
        } catch (error) {
            return null;
        }

    
}

module.exports = {
    generateJWT,
    verifyJWT
}