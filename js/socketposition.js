//window.location.protocol = "http"

var server = new WebSocket( "ws://datapoint.hu:17777/" )

window.ws = server

// server.close()
// server = { send: p=>p } //

server.onmessage = function(data, flags){
	// console.timeEnd('server')

	if( data.data.slice(0,2) == '{"') { try {
  	  		
  	  	var msg = JSON.parse( data.data )
  	
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