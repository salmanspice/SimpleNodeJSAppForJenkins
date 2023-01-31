const express = require('express');
const app = express();


app.get('/', (req,res) => {
  res.send("Do or do not there is no try !! This is added");
});

app.get('/home', (req, res) => {
  res.send("Do or Do Not There isn't is no TRY Home Page");
});

const server = app.listen(3000, ()=>{
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example application is currently listening on port 3000 and at http://%s:%s', host, port);
})