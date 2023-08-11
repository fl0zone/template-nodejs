const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();

app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Configura la ruta para manejar el formulario POST
const pool = new Pool({
    connectionString: 'postgres://fl0user:G1g4rzTWNPfk@ep-sweet-bread-02408629.us-east-2.aws.neon.tech:5432/kumanima?sslmode=require',
    ssl: {
        rejectUnauthorized: false // Opción para deshabilitar la verificación de certificado SSL (en entorno de desarrollo)
    }
});
// Configuración de express-session
app.use(session({
    secret: 'kumanima060701', // Cambia esto a una cadena secreta más segura en producción
    resave: false,
    saveUninitialized: true,
}));
app.post('/login', (req, res) => {
    const query = 'SELECT * FROM usuarios WHERE email = $1 AND password = $2';
    const email = req.body.email;
    const password = req.body.password;
    const values = [email, password];
    pool.query(query, values, (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).send('Error en el servidor');
        } else {
            if (result.rows.length > 0) {
                req.session.id = result.rows[0].id;
                req.session.usuario = result.rows[0].email;
                req.session.rol = result.rows[0].rol
                var mensaje ="Iniciando sesion";
                res.send(mensaje); // Redirige al usuario a la página deseada
            } else {
                var mensaje = 'Credenciales incorrectas';
                res.send(mensaje);

            }
        }
    });
});

console.log('3');
function validarSesion(req, res, next) {
    if (req.session.email & req.session.rol & req.session.id) {
      // Si hay una sesión iniciada, continuar
      next();
    } else {
      // Si no hay una sesión iniciada, redirigir a página de inicio de sesión
      res.redirect('/index'); // Cambia la ruta según tu aplicación
    }
  }
  
  // Ruta protegida que requiere una sesión iniciada
  app.get('/dashboard', validarSesion, (req, res) => {

    // Acciones que solo los usuarios autenticados pueden hacer
  });
const port = process.env.PORT ?? 3000;
app.use(express.static('public'))
app.get('*', (req, res) => {
    res.redirect('/');
})
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})