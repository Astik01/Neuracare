const express = require('express');
const cors = require('cors');
const usersRoutes = require('./routes/users.routes');
const authRoutes = require('./routes/auth.routes');
const contactsRoutes = require('./routes/contacts.routes');
const doctorsRoutes = require('./routes/doctors.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const symptomCheckRoutes = require('./routes/symptomCheck.routes');
const articlesRoutes = require('./routes/articles.routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/symptom-check', symptomCheckRoutes);
app.use('/api/articles', articlesRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
