const express = require('express');
const app = express();
const emailCheck = require('node-email-check');
const mongoose = require('mongoose');

//AsyncFunction vlidate Email
async function validateEmail(email) {
    try {
      const isValid = await emailValidator(email);
      console.log(`Is "${email}" a valid email address?`, isValid);
    } catch (error) {
      console.error('Error validating email:', error);
    }
  }
  

// Connect to MongoDB
mongoose.connect('mongodb+srv://ExpressUser:20101234014@doriansproyect.2zla2.mongodb.net/Concurrent?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define User schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
});

// Create User model
const User = mongoose.model('User', userSchema);

// Set up JSON body parsing
app.use(express.json());

// Create a placeholder array for user records
const users = [];

// Enum for gender options
const GenderEnum = Object.freeze({
  Male: 'male',
  Female: 'female',
});

// Create a new user
app.post('/users', async (req, res) => {
    console.log('Creando Usuario ...')
  const { firstName, lastName, email, phone, gender } = req.body;

  // Validate required fields
  if (!firstName || typeof firstName !== 'string' ||
      !lastName || typeof lastName !== 'string' ||
      !email || typeof email !== 'string' ||
      !phone || typeof phone !== 'number' ||
      !gender || !Object.values(GenderEnum).includes(gender)) {

    console.log('Error en la validacion del Body')
    return res.status(400).json({ message: 'Invalid data provided' });
  }

  try {

    // Asynchronously validate the email
    await emailCheck.isValid(email);

    // Create a new user object
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      gender,
    });

    // Save the user to the database
    await user.save();
    console.log('Usuario Creado Exitosamente...')
    return res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.log('Error en la Creacion del Usuario ...')
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all user records
app.get('/users', async (req, res) => {
    console.log('Consultando Usuarios ...')
    const users = await User.find();
    console.log('Usuarios Listado Exitosamente...')
  return res.status(200).json({ users });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});