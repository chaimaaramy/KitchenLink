const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Démarrage serveur
app.listen(PORT, () => {
  console.log(` Serveur lancé sur http://localhost:${PORT}`);
});