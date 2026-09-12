const express = require('express');
const cors = require('cors');
const usersRoutes = require('./routes/users.routes');
const authRoutes = require('./routes/auth.routes');
const contactsRoutes = require('./routes/contacts.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/contacts', contactsRoutes);

module.exports = app;
