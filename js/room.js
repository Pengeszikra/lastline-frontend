'use strict';

  const suit = "CDHS";
  const run = "234567890JQKA";
  const suitArray = [...suit] //[].slice.call(suit)
  const runArray = [...run]
  const runSuitArray = [...run,...suit]

Object.defineProperty( window , 'log' , { 
  set: p =>{ 
    { console.log(p) } 
  },  
  get: ()=>'log = ...'
})

log = 'poker room 3D visualization'

// -----------------------------------[ THREEjs part ]-------------

const RAD = 180/Math.PI

const TABLETOP = 1.35
const playerPos = [
	{ tx:4 , ty:0 , rz:0 , cx:-2 , cy:0 , hx:-1, hy:0 },
	{ tx:3 , ty:-5 , rz:-45/RAD, cx:-2 , cy:2, hx:-1 , hy:1  },
	{ tx:-2, ty:-5 , rz:250/RAD, cx:0 , cy:3, hx:0 , hy:1.5  },
	{ tx:-1, ty:5 , rz:90/RAD, cx:0 , cy:-2, hx:0 , hy:-1  },
	{ tx:-4, ty:0 , rz:180/RAD, cx:1.5 , cy:0, hx:.75 , hy:0  },
]

function TRE () 
{ 

    const RAD = 180/Math.PI // use fok/RAD
    
    log = 'TRE extension started ... '
    
    this.clickFullScreen= function()
    {
        var canv = document.querySelector('canvas') ; canv.onclick = function(){ canv.webkitRequestFullscreen() }
        window.addEventListener( 'resize', this.onWindowResize, false );        
    }

    this.onWindowResize = function()
    {

    }

    this.setpThreeCanvas = function( width, height )
    {

        width = width || window.innerWidth
		this.SCRW = width
        height = height || window.innerHeight
        this.SCRH = height

        // 3D Scene canvas --------------------------------------

        var scene_3D = new THREE.Scene()
        this.scene = scene_3D

        var camera = new THREE.PerspectiveCamera( 55, width / height, 1, 150000 )
	        camera.position.set( 0, 0, 0 )
	        camera.updateProjectionMatrix()
        this.camera = camera

        var canvas_3D = new THREE.WebGLRenderer( { antialias: true } )
	        canvas_3D.setSize( width, height )
	        canvas_3D.setClearColor( 0 , 1 )

        document.body.appendChild( canvas_3D.domElement )

        canvas_3D.domElement.oncontextmenu = e => e.preventDefault()

        var stereo = new THREE.StereoEffect( canvas_3D );
       		stereo.eyeSeparation = 1
       		stereo.setSize( width, height )

        this.renderer3d = canvas_3D

        // if(isMobile){ this.controllByHeadMove() }

		var controls = isMobile()  ? new THREE.DeviceOrientationControls( this.camera, true ) : null // KIHAL!! 

		//this.orientationControl( {alpha:0.1} )

        // Render Animation --------------------------------------

        function animate() 
        {
            requestAnimationFrame( animate ) // self anim

            handleInteraction( scene_3D , camera )
            handleAnimation()
            isMobile() ? stereo.render( scene_3D, camera ) : canvas_3D.render( scene_3D, camera )

            //this.camera.updateProjectionMatrix()
            if( isMobile() )
            {
	            controls.connect()
	           	controls.update()
	       	}
        }

        animate()
    }    

    //https://threejs.org/examples/webgl_lights_hemisphere.html nice lightning 
    // https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/ -- another coole light setup for minimal set 

    this.init = function()
    {

    	TRE = window.TRE 
    	window.RAD = 180/Math.PI
    	
    	TRE.setpThreeCanvas()

    	TRE.camera.position.set(0,0,0)

    	// --------------[ Lightning ]

    	let backgroundColor = 0x9999AA

        TRE.scene.fog = new THREE.FogExp2( backgroundColor , 0.00001 )
		TRE.renderer3d.setClearColor( backgroundColor ) 
		TRE.renderer3d.setClearAlpha(1)
		
		
		let light = new THREE.AmbientLight( 0x999999 )
		TRE.ambient = light		
		TRE.scene.add( light )
		

		//let	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xAAAAAA, .7 );
		let	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xAAAAAA, 1 );
			hemiLight.color.setHSL( 0.6, 1 , 0.6 );
			hemiLight.color.setHex( 0x010101 );
			hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
			hemiLight.groundColor.setHex( 0xAAAAAA );
			hemiLight.position.set( 0, 500, 0 );
		TRE.hemiLight = hemiLight	
		TRE.scene.add( hemiLight );


		this.assetLoader()
    }

	this.assetLoader = function()
    {
		this.coloader( 'assets/pokerRoom6.dae' ).then( room =>
		{
		 	this.room = room 
			this.room.scale.multiplyScalar(50)
			this.room.userData = { id:"room" }
			log = this.room.uuid

			this.room.position.x = 300
			this.room.position.y = 289.8
			this.room.position.z = 1401

			this.room.rotation.x = -0.17453
			this.room.rotation.y = 0
			this.room.rotation.z = 0

			this.coloader( 'assets/table.dae' ).then(   
				table => 
				{
					this.table = table 
					this.room.add( this.table )
					log = this.table.uuid
					this.table.userData = { id:"table" }
				}
			) 	

			this.coloader( 'assets/human.dae' ).then(   
				model => 
				{
					this.human = model 
					this.human.position.set( 3, 5, 0 )
					this.human.rotateZ( -30/RAD )
					this.room.add( this.human )
				}
			) 	



			this.coloader( 'assets/chair.dae').then(
				chair =>
				{
					this.chairs = []
					playerPos.forEach( (pos,i) => 
					{
						let stuff = chair.clone()
							stuff.translateX( pos.tx )
							stuff.translateY( pos.ty )
							stuff.rotateZ( pos.rz )

						this.chairs.push( stuff )
						this.room.add( stuff )
					})
					chair.translateX( -10000 )
				}
			)
		})		
    }

	this.playerArraive = function( game ){
		
		this.coloader( 'assets/humanSit.dae').then(
			player =>
			{
				this.players = []
				playerPos.forEach( (pos,i) => 
				{
					let mob = player.clone()
						mob.translateX( pos.tx )
						mob.translateY( pos.ty )
						mob.rotateZ( pos.rz )

					this.players.push( mob )
					this.room.add( mob )
				})
				player.translateX( -10000 )
			}
		)
	}
	
	this.dealCards  = function( game ){

		this.coloader( 'assets/SQ.dae').then(
			card =>
			{
				card.scale.multiplyScalar( 1 )

				this.cards = []
				playerPos.forEach( (pos,i) => 
				{
					let cc = card.clone()
						cc.translateX( pos.tx + pos.cx + pos.hx/4 )
						cc.translateY( pos.ty + pos.cy + pos.hy/4 )
						cc.translateZ( TABLETOP + .05 )
						cc.rotateX( 180/RAD )
						cc.rotateZ( pos.rz )
						cc.name = "card"+i
					this.cards.push( cc )
					this.room.add( cc )

					let c2 = cc.clone()
						c2.translateY( .42 )					
						c2.name = cc.name + '.second'
						this.room.add( c2 )
					
				})

				this.street = []
				for( let i=0;i<5;i++)
				{
					let pos = playerPos[0] // dealer position 	
					let cc = card.clone()	
						cc.translateX( pos.tx + pos.cx + pos.hx - 1 )
						cc.translateY( pos.ty + pos.cy + pos.hy + i*.42 - 1 )
						cc.translateZ( TABLETOP + .05 )
						// cc.rotateX( 180/RAD )
						cc.rotateZ( pos.rz )
						cc.name = "card.street"+i
					this.street.push( cc )
					this.room.add( cc )				

				}

			}
		)			
		
	}
	
	this.getMoney = function( game ) 
	{
		this.coloader( 'assets/coins.dae').then(
			coin =>
			{
				coin.scale.multiplyScalar( .1 )
				this.coins = []
				playerPos.forEach( (pos,i) => 
				{
					let della = coin.clone()
						della.translateX( pos.tx + pos.cx )
						della.translateY( pos.ty + pos.cy - 0.5 )
						della.translateZ( TABLETOP )
						this.addCoinRow( della, 20 ) // ~~(Math.random()*12)+2
						della.name = "della"+i

					this.coins.push( della )
					this.room.add( della )
				})

			}
		)			
		
	}

    this.addCoinRow = function( coin, amount )
    {
    	let coins = [ coin ]
    	for( let i=0; i<amount; i++ )
    	{
    		let another = coin.clone()
    			another.translateZ( .04 * ( i + 1 ) ) // .21
    			another.rotateZ( ~~(Math.random()*360)/RAD )	
    			another.name = "della.clone."+coin.name
    		coins.push( another )
    		this.room.add( another )

    	}	
    	return coins
    }


    function rgray(){ var c =  parseInt((~~(0xff * Math.random())).toString(16).repeat(3),16); return c }

 	function handleInteraction( scene , camera )
 	{
		let caster = new THREE.Raycaster()
		caster.setFromCamera( {x:0,y:0} , camera )
		let intersects = caster.intersectObjects( scene.children, true )
		if( intersects && intersects.length )
		{
			let pp = intersects[0].object.parent
			
			if( pp && pp.parent && pp.parent.name.match(/card|della/)){
				//log = pp.name
				log = pp.parent.name 
				pp.count = 0
				pp.end = setInterval( p =>
				{ 
					// if( pp.count ++ > 70 ){ return clearInterval( pp.end ) }
					pp.rotateZ( .003 ) 
					pp.translateZ( .005 )									
				}, 5 )
				
			}

			switch( pp.name )
			{
				//case "floor": 
				case "table": 
					// camera.translateZ( -2 ); break;
				default:
					// camera.translateZ( 2 );
			}
			// intersects[0].object.scale.multiplyScalar( 1.01 )	
			//setInterval( p => window.ez.rotateZ( .004 ) , 5 )
		} 		
 	}

 	function handleAnimation(){}

	this.coloader = function( name )
	{
		var loader = new THREE.ColladaLoader();
		return new Promise( (resolve,reject) => {
	        loader.load( name , function ( collada  ) 
	        {
		        var dae = collada.scene;
		        var skin = collada.skins[ 0 ];

		        dae.position.set(0,0,0); //x,z,y- if you think in blender dimensions ;)

		        TRE.scene.add(dae);
		        resolve( dae )
	    	})		
		})
	}	

} // TRE end 


class ThreeSwiper 
{

	constructor( )
	{			

 		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.origo = new THREE.Vector2();
		this.final = new THREE.Vector2(1,1);
		this.focus = this.scene
		this.sensorOn()

	}

	sensorOn()
	{ 

 		window.addEventListener('mousedown', this.moveStart.bind(this),false)
 		window.addEventListener('mousemove', this.moving.bind(this),false)
 		window.addEventListener('mouseup', this.moveStop.bind(this),false)		

		this.isDown = false

	}

	sensorOff()
	{ 
 		window.removeEventListener('mousedown', this.moveStart.bind(this) )
 		window.removeEventListener('mousemove', this.moving.bind(this) )
 		window.removeEventListener('mouseup', this.moveStop.bind(this) )		
	}

	moveStart( e )
	{
		
		this.setMouse( e ) 
		this.isDown = true 		
		this.final = this.origo = this.mouse.clone() 
		requestAnimationFrame( this.swiping.bind(this) )

	}

	moveStop(){ this.isDown = false }

	moving(e)
	{ 

		this.setMouse( e )
	
		if(this.isDown){ 
			
			this.final = this.mouse.clone() 
			// log = this.distance 
		}
	}	

	swiping(){

		if(this.isDown) requestAnimationFrame( this.swiping.bind(this) )
	}

	setMouse(e){ 
		this.mouse.x = ( e.clientX / 1280 ) * 2 - 1
		this.mouse.y = -( e.clientY / 720 ) * 2 + 1 
		
	}

	get distance(){ return Math.sqrt( (this.origo.x-this.final.x)*(this.origo.x-this.final.x) + (this.origo.y-this.final.y)*(this.origo.y-this.final.y)  )  }

	get tilt(){ return (this.origo.x - this.final.x) / (this.origo.y - this.final.y) }

}

class MatrixSwiper extends ThreeSwiper 
{

	constructor( TRE )
	{ 
		super()
		
		this.TRE = TRE 		
		this.SCRW = TRE.SCRW
		this.SCRH = TRE.SCRH

		this.focus = false 
		// this.area = this.areaConsol()

	}

	setMouse(e)
	{ 
		this.mouse.x = ( e.clientX / this.SCRW ) * 2 - 1
		this.mouse.y = -( e.clientY / this.SCRH ) * 2 + 1 
	}	

	swiping()
	{  

		if(this.isDown)
		{

			let distX = (this.origo.x - this.final.x)
			let distY = (this.origo.y - this.final.y)

			if( this.focus )
			{

				if ( this.isFocusRotating )
				{
					this.focus.rotateY( distX  * -.02 )

				} 
				else if( this.isFocusZooming )
				{
					this.focus.translateZ( distY  * 25 ) 

				} 
				else 
				{ 
					this.focus.translateX( distX  * - 42)
					this.focus.translateY( distY  * - 42 )
				}

			} else {

				let direction = TRE.camera.getWorldDirection()

				if ( this.isFocusRotating )
				{
					this.TRE.camera.rotateY( distX  * -.05 )					
				} 
				else if ( this.isFocusZooming )
				{
					this.TRE.camera.translateZ( distY  * 25 )
				} 
				else 
				{
					this.TRE.camera.translateX( distX  * 25 ) 
					this.TRE.camera.translateY( distY  * 25 ) 
				}
			}

			super.swiping()

		}

	}

	moveStart(e){ 
		
		if( e.button == 2 ){ e.stopPropagation() }
		
		// if( e.target.tagName && e.target.tagName == 'TEXTAREA' ) return;
		this.focus = e.altKey ? this.found() : false 
		this.isFocusRotating = e.shiftKey
		this.isFocusZooming = e.ctrlKey
		this.isAltOnStart = e.altKey 
		super.moveStart(e)

	}

	moveStop()
	{
		super.moveStop()
		if( this.isAltOnStart && this.distance < 0.01 ) this.placeCard()

	}

	placeCard()
	{
		this.focus = false 

		// log = this.found()

		let caster = new THREE.Raycaster()
		caster.setFromCamera( {x:0,y:0} , this.TRE.camera )
		let intersects = caster.intersectObjects( this.TRE.scene.children, true )
		log = intersects
		if( intersects && intersects.length )
		{
			window.ez = intersects[0].object
			log = window.ez
			log = window.ez.parent.name
			// intersects[0].object.scale.multiplyScalar( 1.01 )	
			setInterval( p => window.ez.rotateZ( .004 ) , 5 )
		}
		

	}

	found()
	{
		this.raycaster.setFromCamera( this.mouse, this.TRE.camera )
		var intersects = this.raycaster.intersectObjects( this.TRE.room.children , true ) // , true ha a 3d objektumokat is meg akarom fogni 
		//log = intersects
		let found = intersects.filter( e => e.object != this.TRE.room.children[0] )
		return found.length && found[0].object.parent.serial ? found[0].object.parent : false 
		// for( let found of intersects ){	if(found.object != this.TRE.room.children[0] ) log = found.object.serial ? KKK[found.object.serial.slice(0,4)].name : found.object ; }
	}
}	


class RoomPlay extends MatrixSwiper
{

	moveStart(e){ 
	
		// if( e.target.tagName && e.target.tagName == 'TEXTAREA' ) return;
		this.isAltOnStart = e.altKey 
		this.focus = this.found()
		this.isFocusRotating = e.shiftKey
		this.isFocusZooming = e.ctrlKey || e.button == 2
		this.setMouse( e ) 
		this.isDown = true 		
		this.final = this.origo = this.mouse.clone() 
		requestAnimationFrame( this.swiping.bind(this) )

	}	

	swiping(){  

		if(this.isDown){

			let distX = (this.origo.x - this.final.x)
			let distY = (this.origo.y - this.final.y)

			if( this.focus ){

				if ( this.isFocusRotating ){
					this.focus.rotateY( distX  * -.02 )
				} else if( this.isFocusZooming ){
					this.focus.translateZ( distY  * 25 ) 
				} else { 
					this.focus.translateX( distX  * - 42)
					this.focus.translateY( distY  * - 42 )
				}

			} else {

				//let direction = new THREE.Vector3( distX * -42  , 0 , distY * 42 ) ; TRE.camera.position.addVectors( TRE.camera.position , direction )
				
				if ( this.isFocusRotating ){
					
				} else if ( this.isFocusZooming ){
					this.TRE.camera.translateX( distX  * -25 ) 
					this.TRE.camera.translateY( distY  * -25 ) 
				} else {
					this.TRE.camera.rotateY( distX  * .05 )					
					this.TRE.camera.translateZ( distY  * 25 )
				}				
			}

			requestAnimationFrame( this.swiping.bind(this) )

		}
	}

}

// https://w3c.github.io/deviceorientation/spec-source-orientation.html
class Gestures 
{
	constructor( tree )
	{
		this.TRE = tree
		window.addEventListener("deviceorientation", this.handleOrientation, true)
		window.addEventListener("devicemotion", this.handleMotion, true)
	}

	handleOrientation( e )
	{
		if(!e.alpha){ return }

		if(window.logger){window.logger.innerHTML = `${e.alpha} : ${e.beta} : ${e.gamma}`}
		//if( e.alpha != null && e.beta != null && e.gamma != null )
		//{
			/*
			this.TRE.human.rotateX( e.alpha/RAD )
			this.TRE.human.rotateY( e.beta/RAD )
			this.TRE.human.rotateZ( e.gamma/RAD )
			*/
		//}
	}

	handleMotion( e )
	{
		log = `${e.x} : ${e.y} : ${e.z}` // ${e.absolute}
	}
}

function isMobile()
{
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function logger()
{
	let logger = document.createElement( 'div' )
    logger.id = 'logger'
    logger.innerHTML = '.... logger .....'
    document.body.appendChild( logger )
    return document.querySelector('#logger')
}

/*
// https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation
function lockToLandscape()
{
	screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;

	if (screen.lockOrientationUniversal(["landscape-primary", "landscape-secondary"])) {
	  // orientation was locked
	} else {
	  // orientation lock failed
	}
}
*/

// ------------------[  VR poker has starting .... ] 

window.onload = function()
{
	document.ontouchmove = function(e) {e.preventDefault()};
	//window.logger = logger()

	window.TRE = new TRE()
	let tree = window.TRE 	
	tree.init()
	tree.camera.translateY( 343 )
	tree.camera.translateZ( 1500 )
	tree.camera.translateX( -500 )
	if( isMobile() ){ tree.clickFullScreen() }

	window.gestures = new Gestures( tree )

	window.room = new RoomPlay( tree )		
	
	TRE.scene.rotateX( -90/RAD )
}	

/*

  vector = camera.getWorldDirection();
	theta = Math.atan2(vector.x,vector.z);

              var raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(point_mouse, camera);
                var intersects = raycaster.intersectObjects(sceneObjects, true);	


	caster.setFromCamera( {x:0,y:0} , TRE.camera ); intsec = caster.intersectObject( TRE.scene, true )
*/