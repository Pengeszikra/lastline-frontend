'use strict';

var VERSION = 'position : 0.002'; console.log( VERSION )

var WebSocketServer = require('ws').Server

var wss = new WebSocketServer({ port: 17777 });

// var log

// console.log( wss )

var all = []

wss.on('connection', function connection(ws) 
{

  all.push( ws )
 
  ws.on('message', function incoming(message) 
  {

    if( message.slice(0,2) == '{"') 
    { 
      try 
      {
        var msg = JSON.parse( message ) 
        handleMessage( msg , ws )
      } catch(err){}

    } else 

    switch(message) 
    {

      // case "something": console.log( "... something ..." ) ;break;

      default: 

        console.log('>>', message);

        writeLog( message )
        ws.send( message )
    }
  
  });

  function handleMessage( msg, ws )
  {
    console.log( msg )
    // broadcast
    all.forEach( w => w.send( JSON.stringify( msg ) ) )
  }

  ws.answer = function( msg )
  {
    try 
    { 
      if( msg instanceof Object ){ this.send( JSON.stringify( msg ) )}
      else if( msg instanceof String ){ this.send(msg)}         
      else if( msg instanceof Number ){ this.send(''+msg)}        
    } catch(err){ console.error(err)}   
  }  

  ws.on('close',function()
  { 
      // close 
  })

  ws.send(VERSION+' is ready');

});
