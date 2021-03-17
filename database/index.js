const express = require('express');
// express app
let app = express();
const cors = require('cors');

// app.use for middleware
app.use(express.json());
app.use(cors());

// initial test route
app.get('/', (req, res) => {
  res.send('hi from the server!');
});

// port where server listens
const PORT = 3000;

console.log('please work!')

// tell app where to listen
app.listen(PORT, () => {
  console.log(`Express server listening on port: ${PORT}`);
});
