const express = require('express');
const app = express();


app.get('/', (req,res) => {
  res.send("Do or do not there is no try !! This is added");
});

const server = app.listen(3000, ()=>{
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example application is currently listening on port 3000 and at http://%s:%s', host, port);
})