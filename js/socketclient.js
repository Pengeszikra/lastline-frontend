//window.location.protocol = "http"

//var server = new WebSocket( "ws://datapoint.hu:17777/" )



//ws.pusherapp.com:[port]/app/[key]
let app_id = "305291"
let key = "1f0c828eca2f60f054e4"
let port = 80

//var server = new WebSocket( `wss://ws.pusherapp.com/app/${key}` )

//var server = new WebSocket( 'wss://ws-eu.pusher.com/app/1f0c828eca2f60f054e4?protocol=7&client=js&version=3.2.4&flash=false' )

window.ws = server

// server.close()
// server = { send: p=>p } //

server.onmessage = function(data, flags){
	// console.timeEnd('server')

	if( data.data.slice(0,2) == '{"') { try {
  	  		
  	  	var msg = JSON.parse( data.data )	
	  	console.log( msg )  	  	
  	
 	} catch(err){}} else { console.log( data.data ) }
 	
}

server.onclose = function(){ console.log("server :: onclose") }

server.onerror = function(){ console.log("server :: onerror") ; server = false }

server.onopen = function(){ console.log("server :: onopen") }

server.answer = function( msg ){ // atob , btoa 	
	try { 
		if( msg instanceof Object ){server.send( JSON.stringify( msg ) )}
		else if( msg instanceof String ){server.send(msg)} 	
 	} catch(err){ console.error(err)}
}