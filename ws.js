import ReconnectingWebSocket from 'reconnecting-websocket';
const wss = new ReconnectingWebSocket('ws://my.site.com');

//var WebSocket = require('ws');
//var WebSocketServer = require('ws').Server,
 // wss = new WebSocketServer({server: httpsServer})
  var userCount = [];

  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
    
        if(client.room.indexOf(JSON.parse(data).room)>-1){
        client.send(data);
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