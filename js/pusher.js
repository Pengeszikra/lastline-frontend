let APP_KEY = "1f0c828eca2f60f054e4"
var pusher = new Pusher(APP_KEY,{cluster:"eu"})
var userID

var channel

const GET = "GET"
const POST = "POST"
const SERVER = "https://api.lastline.fiterik.com"
const AUTH = "/auth/register"
const MATCHMAKING = "/matchmaking/register"
const FOLD  = "/game/fold"
const RAISE = "/game/raise"
const CALL = "/game/call"

var token
var game

function connect( url, params )
{
	if( token )
	{		
		params = params || params + `&token=${token}`
	}
	
	let xhr = new XMLHttpRequest();
		xhr.open(GET, SERVER+url+'?'+params, true ); 
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send()
	return new Promise( (resolve,reject) => {
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				log = this.responseText;
				return resolve( JSON.parse( this.responseText ).data )
			}
		}		
	})
}	

connect( AUTH , "" ).then( getToken ).then( matchmaking )


function getToken( result )
{
	token = result.token
	userID = result.user.id
	channel = pusher.subscribe( "user."+userID );
	channel.bind( "poker" , bindConnection )	
	game = new GamePlay( window.TRE )
}

function matchmaking()
{
	connect( MATCHMAKING ).then( p => log = "... in matchmaking que" )
}	

const EVENT_DEAL_CARD = 'deal.card'
const EVENT_GAME_CALL = 'game.call'
const EVENT_GAME_FOLD = 'game.fold'
const EVENT_GAME_RAISE = 'game.raise'
const EVENT_GAME_CREATED = 'game.created'

function bindConnection( result )
{
	let event = result.event
	let data = result.data 
	log = result
	
	switch( event )
	{
		case EVENT_GAME_CREATED: game.created( data ); break ;
		case EVENT_GAME_FOLD: game.fold( data ); break ;
		case EVENT_GAME_RAISE: game.raise( data ); break ;
		case EVENT_GAME_CALL: game.call( data ); break ;
		case EVENT_DEAL_CARD: game.dealCard( data ); break ;
	}
}	

class GamePlay
{
	constructor( view )
	{
		this.view = view		
		this.view = view		
	}
	
	created( data )
	{
		this.view.playerArraive( this )
		this.view.getMoney( this )
	}
	
	fold( data )
	{
	}
	
	call( data )
	{
	}
	
	dealCard( data )
	{
		this.view.dealCards( this )
	}
	
	callAction()
	{
		connect( CALL )
	}

	foldAction()
	{
		connect( FOLD )
	}

	raiseAction( coins )
	{
		connect( RAISE, `coins=${coins}` )
	}	
	
}	