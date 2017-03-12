'use strict';
module.exports.vrpokerserver =  (function(){ // START ---------------   

var VERSION = 'vrpokerserver : 0.011'; console.log( VERSION ) ; exports.VERSION

var WebSocketServer = require('ws').Server

var wss = new WebSocketServer({ port: 17777 });

var log

// console.log( wss )

wss.on('connection', function connection(ws) 
{

  exports.ws = ws 

  log = p => ws.send( p )

  var game = new PokerGame()
  game.runner( 15 )  
 
  ws.on('message', function incoming(message) 
  {

    if( message.slice(0,2) == '{"') 
    { 
      try 
      {
        var msg = JSON.parse( message ) 
        // handleMessage( msg , ws )
      } catch(err){}

    } else 

    switch(message) 

    {

      case "something": console.log( "... something ..." ) ;break;

      default: 

        console.log('>>', message);

        writeLog( message )
        ws.send( message )

    }
  
  });

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

// ----------------------------------------------------[ Poker Game ]

// minimal poker game
// Object.defineProperty( this , 'log' , { set: p => console.log(p),  get: ()=>'log( ...' }))
//String.prototype.toArray = () => [].slice.call(this)
  

  const suit = "CDHS";
  const run = "234567890JQKA";
  const suitArray = [].slice.call(suit)
  const runArray = [].slice.call(run)
  const runSuitArray = [].slice.call(run+suit)  // missing leading A for A started straight 
  // const check = {}; runSuitArray.forEach( sign => check[sign]=new RegExp('') )
  
  const check = {
    "2":/.2/g,    "3":/.3/g,    "4":/.4/g,    "5":/.5/g,    "6":/.6/g,    "7":/.7/g,
    "8":/.8/g,    "9":/.9/g,    "0":/.0/g,    "J":/.J/g,    "Q":/.Q/g,    "K":/.K/g,
    "A":/.A/g,    "C":/C./g,    "D":/D./g,    "H":/H./g,    "S":/S./g,
  }
  
  const pokerHands = {
    HIGH_CARD:{ name:'High Card'  ,value: 0 },
    ONE_PAIR:{ name:'One Pair'  ,value: 100 },
    TWO_PAIR:{ name:'Two Pair'  ,value: 200 },
    THREE_OF_KIND:{ name:'Three of kind'  ,value: 300 },
    STRAIGHT:{ name:'Straight'  ,value: 400 },
    FLUSH:{ name:'Flush'  ,value: 500 },
    FULL_HOUSE:{ name:'Full house'  ,value: 600 },
    FOUR_OF_KIND:{ name:'Four of kind'  ,value: 700 },
    STRAIGHT_FLUSH:{ name:'Straight flush'  ,value: 800 },
    ROYAL_FLUSH:{ name:'Royal flush'  ,value: 900 },
  }
  
  var originDeck = [].concat.apply( [], 
      [].slice.call(suit).map( s => [].slice.call(run).map( r => [s,r] )) 
  )
  
  const info = p => console.log( p )
  const shuffle = () => Math.random()>.5 ? 1 : -1
  const logResult = r => `${r.result.run}.${r.result.suit} | ${r.cards} [ ${r.score.name} :: ${r.score.value+r.score.high} ] : ${r.player.name}`

class Player 
{
  constructor( name , chips = 0 ) 
  {
    this.name = name      
    this._hand = ""    
    this._chip = 0
    this._bet = 0
    
    this.chips = chips
    
    this.nameView = name
  }
  
  getHand()
  {
    return this.hand
  }
  
  setAsActive()
  {
    // this.view.addClass('active');
    log( `${this.name} is ` )
  }
  
  get chips(){ return this._chips }
  set chips( value ){ this._chips = value }
  
  get bet(){ return this._bet }
  set bet( value ){ this._bet = value } 
  
  drawBet()
  {
    let draw = this.bet
    this.bet = 0
    return draw
  }
  
  get hand(){ return this._hand }
  set hand( cardString ){ this._hand = cardString }
  
  handAdd( cardString ){ this.hand+=cardString }
  
  handClear(){ this.hand = "" }
  
  placeBet( amount )
  {
    if( amount <= this.chips )
    {
      this.chips -= amount
      this.bet += amount
    }
  }
  
  cardClass( which ){ return this.hand.slice( which*2 , which*2+2 ).replace(/(C|D|H|S)/,"$1 c")  }
 
}

class PokerGame
{
  constructor( deck = originDeck , smallBlind = 2, chipsAmount = n=>1000 )
  {
    this.setSmallBlind( smallBlind )
    this.originDeck = deck
    this.shuffle()
    this.state = 'dealing'
    this.fly = null
    this.all = 'Jack|McMee|Wheeler|Amigo|Banx|Lucy'.split('|').map( (name,i) => new Player( name, null  , chipsAmount(i) ) )    
    this.dealer = new Player( "Street", null )
    this.inactive()
  }
  
  shuffle(){ this.deck = [].concat.apply(this.originDeck).sort( shuffle ) }
  
  inactive(){ /*$('.player,#dealer').removeClass('active')*/ }
    
  showSitu(){}
    
  dealOneCard(){ let card = this.deck.pop(); return card.join("") }
    
  organizeTable(){}
  
  startNewTable(){}
  
  setup(){}
  
  dealCardToPlayer( n )
  {
    info(`Deal card to:${this.all[n].name}`)
    this.all[n].handAdd( this.dealOneCard() )
  }

  setSmallBlind( amount )
  {
    info(`Big Blind amount is:${amount}`)
    this.smallBlindAmount = amount
  }

  nextPlayer( n )
  {
    info(`Active player is: ${this.all[n].name}`)
  }

  setPlayerStartinChips( co ){}
  
  button(){}
  
  smallBlind(){}

  bigBlind(){}
  
  fold(){}
  
  call(){}
  
  raise(){}
  
  check(){}

  collectPots(){}

  *theFlop( co )
  {
    info("The Flop")
    yield this.dealer.handAdd( this.dealOneCard() )
    yield this.dealer.handAdd( this.dealOneCard() )    
    yield this.dealer.handAdd( this.dealOneCard() )
  }

  theTurn()
  {
    info("The Turn")    
    this.dealer.handAdd( this.dealOneCard() )
  }

  theRiver()
  {
    info("The River")
    this.dealer.handAdd( this.dealOneCard() )
  }

  theShowdown( winnerIs )
  {
    
    let winner = winnerIs.sort( (a,b) => a.score.value + a.score.high < b.score.value + b.score.high ? 1 : -1  )
    winner[0].player.setAsActive()
    let winnerMessage = `Winner is: ${winner[0].player.name} :: ${winner[0].score.name}`
    log( "--------\n"+winnerMessage)
    info( winnerMessage )
    return winner[0].player
    // this.all.filter( player => player.name == winner[0].player.name )[0]
  }

  evaluatingHands(){}

  otherPlayerActing(){}
  
  headMoving(){}

  cursorGestureInterface(){}
  
  reShuffle()
  {
    log( "Shuffle ...")
    this.shuffle()
    this.all.forEach( player => player.handClear() )
    this.dealer.handClear()
    this.inactive()
  }
  
  matrixLine( cards )
  {
    let matrix = runSuitArray.map( run => cards.match(check[run]) )
    let line = matrix.map( n => n && n.length ? ""+n.length : "0" ).join("")
    let run = line.slice(12,13)+line.slice(0,13)
    let suit = line.slice(-4)
    return { matrix, run , suit }
  }
  
  highCard( result , found )
  {
    let high = 0
    switch( found.name )
    {
        case pokerHands.HIGH_CARD.name:
        case pokerHands.ONE_PAIR.name:
        case pokerHands.TWO_PAIR.name:
        case pokerHands.THREE_OF_KIND.name:
        case pokerHands.FOUR_OF_KIND.name:
        case pokerHands.STRAIGHT.name:
            high = result.run.lastIndexOf(1)
          break;
        
        case pokerHands.FULL_HOUSE.name:
            high = result.run.lastIndexOf(3) // result.run.lastIndexOf(2)/10
          break;
        
        case pokerHands.STRAIGHT_FLUSH.name:
          break;
        
        case pokerHands.FLUSH.name:
          break;
    }        
    return high
  }
  
  // https://www.pokernews.com/poker-rules/
  // ---------------[ S C O R I N G ]---------------
  score( result )
  {    
    let found = pokerHands.HIGH_CARD

    let pairs = result.run.slice(1).match(/2/g)
    if( pairs && pairs.length )
    { 
      if( pairs.length > 1 ){ found = pokerHands.TWO_PAIR } else { found = pokerHands.ONE_PAIR }
    }    

    if( result.run.match(/3/g) )
    { 
      if( pairs && pairs.length ){ found = pokerHands.FULL_HOUSE } else { found = pokerHands.THREE_OF_KIND }
    }

    if( found != pokerHands.FULL_HOUSE && result.run.match(/[^0]{5}/g) ){ found = pokerHands.STRAIGHT }

    let flushCards = result.matrix.slice(13).filter( e => e && e.length>=5 )
    
    if( flushCards.length )
    {
      if( found != pokerHands.FULL_HOUSE ){ found = pokerHands.FLUSH }
      let flushLine = this.matrixLine( flushCards[0].join("") )     
      if( flushLine.run.match(/[^0]{5}/g) )
      {
        found = ( flushLine.run.match(/[^0]{5}$/) ) ? pokerHands.ROYAL_FLUSH : pokerHands.STRAIGHT_FLUSH
      }      
    }

    if( result.run.match(/4/g) ){ found = pokerHands.FOUR_OF_KIND }    
        
    
    found.high = this.highCard( result, found )

    return found
  }  
  
  result( player )
  {
    let cards = player.hand + this.dealer.hand
    let result = this.matrixLine( cards )         
    let score = this.score(result)
    
    return { player, cards, result, score }
  }
  
  *theBetRound( phase ){
      for( let player of this.all )
      {
        log( logResult(this.result( player )))
        let amount = ~~(Math.random()*5)*10
        yield player.placeBet( amount )
      }
      // this.all.forEach( player => log( logResult(this.result( player )) ))
      log( `--------- [ ${phase} ] -----------`)

      let collect = 0
      this.all.forEach( player => collect+=player.drawBet() )
      yield this.dealer.bet += collect
  }
  
  *dealing()
  {
    for( let i=0;i<this.all.length;i++)
    { 
      yield this.dealCardToPlayer(i)
      yield this.dealCardToPlayer(i)
    }       
  }  
  
  *showScores( winnerIs )
  {
    for( let player of this.all )
    {
      let res = this.result( player )
      winnerIs.push( res )
      log( logResult( res )      )
      yield player.nameView = `${res.player.name} : ${res.score.name}`
    }    
  }

  // ------------ main game flow -----------------
  
  *singleRound(){
    
    for( let deal of this.dealing() ) yield deal
    
    for( let flop of this.theBetRound( 'Flop' ) ) yield flop
    
    for( let flop of this.theFlop() ) yield
    
    for( let turn of this.theBetRound( 'Turn' ) ) yield turn
    yield this.theTurn(); 
    
    for( let river of this.theBetRound( 'River' ) ) yield river
    yield this.theRiver(); 
    
    for( let showdown of this.theBetRound( 'Showdown' ) ) yield showdown
    
    let winnerIs = []
    for( let score of this.showScores( winnerIs )) yield score
    let winner = this.theShowdown( winnerIs )
    yield winner    
    winner.chips += this.dealer.drawBet()
    for( let pause of Array(10)) yield winner
    
    // yield this.theShowdown()
  }
  
  *match()
  {
    for( let round of Array( this.matchNumber ) )
    {
      this.reShuffle()
      for( let step of this.singleRound()  ) yield step
    }
  }
  
  runner( matchNumber )
  {
    this.matchNumber = matchNumber
    let play = this.match(); 
    this.stopPlay = setInterval( ()=>play.next() , 70 )
  }
  
  stop(){ clearInterval( this.stopPlay ) }  
   
} 


// KIHAL


})() // module.exports.exoserver END  --------------