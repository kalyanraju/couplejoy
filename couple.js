var express = require('express')
const fs = require('fs');
const https = require('https');
/*const serverConfig = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  ca:fs.readFileSync('ca.pem')
};*/


var app = express()
//var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
//app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));
app.listen(80, function () {
  console.log('Example app listening on port 8080 insecurely!');
});
//var httpsServer = https.createServer(serverConfig, app);

/*httpsServer.listen(443, function () {
  console.log('Example app listening on port 3000!')
})*/
var WebSocket = require('ws');
var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({app})
  var userCount = [];

  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
    
        if(client.room.indexOf(JSON.parse(data).room)>-1){
        client.send(JSON.stringify(data));
       }
    
      }
    });
  };

wss.on('connection', function (ws) {
  ws.room=[];
  
    wss.broadcast(JSON.stringify({userCount: wss.clients.size}));
    
    ws.on('message', function (message) {
      var messag=JSON.parse(message);
      if(messag.join){ws.room.push(messag.join)}

      wss.broadcast(message);
         //console.log(message);
     
  })
  ws.on('error',e=>console.log(e));

 
});




wss.on('close',function(ws){
            wss.broadcast("userCount " + wss.clients.size);
     
});

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/ws.html');
})




