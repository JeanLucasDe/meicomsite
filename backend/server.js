const express = require("express");
const cors = require("cors")
const app = express();
const bodyParser = require("body-parser");
const FirebaseRoute = require('./FirebaseRoutes')


app.use(cors())
app.use(bodyParser.json());


app.use('/api/firebase', FirebaseRoute)


// Iniciar o servidor
const PORT = process.env.port || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});