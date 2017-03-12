'use strict';

// -----------------------------------[ THREEjs part ]-------------

const RAD = 180/Math.PI

function TRE ( document ) { 

    const RAD = 180/Math.PI // use fok/RAD
    
    log = 'TRE extension started ... '

    this.clickFullScreen= function(){
        var canv = document.querySelector('canvas') ; canv.onclick = function(){ canv.webkitRequestFullscreen() }
        window.addEventListener( 'resize', this.onWindowResize, false );        
    }

    this.onWindowResize = function()
    {
    	log = "resize ... "
    }

    this.combinePIXIandTRE = function( width, height ){

        width = width || window.innerWidth
		this.SCRW = width
        height = height || window.innerHeight
        this.SCRH = height

        // 3D Scene canvas --------------------------------------

        var scene_3D = new THREE.Scene()
        this.scene = scene_3D

        var camera = new THREE.PerspectiveCamera( 55, width / height, 1, 150000 )
        camera.position.set( 0, 0, 700)
        camera.updateProjectionMatrix()

        this.camera = camera

        var canvas_3D = new THREE.WebGLRenderer( { antialias: true } )
        canvas_3D.setSize( width, height )
        canvas_3D.setClearColor( 0 , 1 )
        log = document
        document.body.appendChild( canvas_3D.domElement )

        this.renderer3d = canvas_3D

        scene_3D.fog = new THREE.FogExp2( 0x000000, 0.00001 )
		var light = new THREE.AmbientLight( 0x252525 )        
		scene_3D.add( light )


        // Render Animation --------------------------------------

        function animate() {
            requestAnimationFrame( animate )
            handleInteraction()
            handleAnimation()
            canvas_3D.render( scene_3D, camera )
        }

        animate()

    }

    this.good = function(){

    	TRE = window.TRE 
    	window.RAD = 180/Math.PI
    	
    	// pixi off 
	    document.querySelectorAll('canvas')[0].style.display = 'none'
    	document.body.style.overflow = 'hidden'

    	TRE.combinePIXIandTRE()

    	var timg = TRE.pixi2three( new PIXI.Sprite.fromImage( folder+'galaxy.jpg' ) ); TRE.scene.add(timg)
    	timg.position.z = -100000 ; timg.scale.set(170,170,170)

    	TRE.camera.position.set(0,0,0)

    	let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.2 );
		hemiLight.color.setHSL( 0.6, 1, 0.6 );
		hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 500, 0 );
		TRE.scene.add( hemiLight );

    }    

    this.forgoDoboz = function(){
	        var geometry = new THREE.BoxGeometry( 500, 500, 500 )
	        var material = new THREE.MeshNormalMaterial()
	        var cube = new THREE.Mesh( geometry, material )
	        cube.position.z = -500
	        cube.rotation.z = -45
	        this.scene.add( cube )
    }

    this.pixi2three = function ( pix , width , height , isOpaque ){

    	var pt = new PIXI.RenderTexture( renderer , width || pix.width , height || pix.height )
    	pt.render( pix )
		var texTRE = new THREE.Texture( pt.getCanvas() ) 
		texTRE.needsUpdate = true  
      	var matTRE = new THREE.MeshBasicMaterial( {map: texTRE , side:THREE.DoubleSide  } )
    	matTRE.transparent = !isOpaque
    	matTRE.map.minFilter = THREE.LinearFilter
		var mesh = new THREE.Mesh(	new THREE.PlaneBufferGeometry( pt.width, pt.height),  matTRE )

 	return mesh }

    this.randomActor = function( rn ){ // image direct to TRE 
        
        var sprite 
        rn = rn || ('00'+(~~(Math.random()*50)+1)).slice(-2)
        var spriteImage = THREE.ImageUtils.loadTexture( `img/actors/${rn}.png` , null , function(){

        	sprite.scale.set( spriteMat.map.image.width , spriteMat.map.image.height , 1.0 ); // KIHAL 

        })

        var spriteMat = new THREE.SpriteMaterial( { 
            map: spriteImage , 
            useScreenCoordinates: true, 
            alignment: new THREE.Vector2(1,-1)
            // THREE.SpriteAlignment.topLeft  
        });
        spriteMat.map.minFilter = THREE.LinearFilter
        sprite = new THREE.Sprite( spriteMat )
        
        sprite.position.set( 100, 100, 0 );
        return sprite 
    }


    this.placeModel = function( name , holder ){
        var loader = new THREE.JSONLoader();
        loader.load( name || '3d/ram1.json', function ( geometry, materials ) {
            
            let model = new THREE.Mesh( geometry , new THREE.MeshPhongMaterial( { color: rgray() } ) )

            log = model
            
            model.scale.multiplyScalar( 170 * Math.random() ) 
        })
        
    }    


    function rgray(){ var c =  parseInt((~~(0xff * Math.random())).toString(16).repeat(3),16); return c }

    this.bad = function(){
    	var canvases = document.querySelectorAll('canvas')
    	canvases[1].style.display = 'none'
    	canvases[0].style.display = 'block'
    }

    this.swiper = function(){

    	const PADDING = 5
    	TRE = window.TRE
    	var swiper = new THREE.Mesh()
    	var nextx = 0 
    	for(var card of who.collection.cards){

    		let tcard = TRE.cardRender( card )
    		swiper.add( tcard )
    		let w = tcard.material.map.image.width
    		tcard.position.x = nextx + w/2 
    		nextx += w + PADDING 

    	}

    return swiper }


 	this.cardRender = function( card , isInPlay , isInfoBox , side ){ // KIHAL 

 		var cardTexture = skeletonCardRender( card , isInPlay || 0 , isInfoBox || 0 , side || 0 , true )
		var texTRE = new THREE.Texture( cardTexture.getCanvas() ) 
		texTRE.needsUpdate = true  

		card.width = card.width ? card.width : 1

		var pix = new PIXI.Sprite.fromImage( folder + `card-bckg-gz-w${card.width}.png` )
    	var pt = new PIXI.RenderTexture( renderer , card.width*250 , 320 )
    	pt.render( pix )
		var backTRE = new THREE.Texture( pt.getCanvas() ) 
		backTRE.needsUpdate = true 		
      	var matTREbck = new THREE.MeshBasicMaterial( {map: backTRE , side:THREE.FrontSide  } )
      	var matTRE = new THREE.MeshBasicMaterial( {map: texTRE , side:THREE.FrontSide  } )
    	matTRE.transparent = true
    	matTREbck.transparent = true
    	matTRE.map.minFilter = THREE.LinearFilter
    	matTREbck.map.minFilter = THREE.LinearFilter
		let front = new THREE.Mesh(	new THREE.PlaneBufferGeometry( cardTexture.width, cardTexture.height),  matTRE )
		let back = new THREE.Mesh(	new THREE.PlaneBufferGeometry( cardTexture.width, cardTexture.height),  matTREbck )
		var mesh = new THREE.Mesh()
		back.rotateY(180/RAD)
		mesh.add( front )
		mesh.add( back )		
		mesh.serial = card.serial

 	return mesh }    

 	function handleInteraction(){}

 	function handleAnimation(){}


	this.initPostprocessing = function() {

	var depthMaterial, effectComposer, depthRenderTarget;
	var ssaoPass;
	var group;
	var depthScale = 1.0;
	var postprocessing = { enabled : true, renderMode: 0 }; // renderMode: 0('framebuffer'), 1('onlyAO')


		// Setup render pass
		var renderPass = new THREE.RenderPass( TRE.scene, TRE.camera );		
		let camera = TRE.camera 

		// Setup depth pass
		var depthShader = THREE.ShaderLib[ "depthRGBA" ];
		var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );

		depthMaterial = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader,
			uniforms: depthUniforms, blending: THREE.NoBlending } );

		var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
		depthRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );

		// Setup SSAO pass
		ssaoPass = new THREE.ShaderPass( THREE.SSAOShader );
		ssaoPass.renderToScreen = true;
		//ssaoPass.uniforms[ "tDiffuse" ].value will be set by ShaderPass
		ssaoPass.uniforms[ "tDepth" ].value = depthRenderTarget;
		ssaoPass.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
		ssaoPass.uniforms[ 'cameraNear' ].value = camera.near;
		ssaoPass.uniforms[ 'cameraFar' ].value = camera.far;
		ssaoPass.uniforms[ 'onlyAO' ].value = ( postprocessing.renderMode == 1 );
		ssaoPass.uniforms[ 'aoClamp' ].value = 0.3;
		ssaoPass.uniforms[ 'lumInfluence' ].value = 0.5;

		// Add pass to effect composer
		effectComposer = new THREE.EffectComposer( renderer );
		effectComposer.addPass( renderPass );
		effectComposer.addPass( ssaoPass );
	}
    
} // TRE end 

window.TRE = new TRE()
this.TREstart = function(){ this.directLogin(); window.TRE.good() }

// THREE JS SWIPER 

class ThreeSwiper {

	constructor( ){			

 		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.origo = new THREE.Vector2();
		this.final = new THREE.Vector2(1,1);
		this.focus = this.scene
		this.sensorOn()

	}

	sensorOn(){ 

 		window.addEventListener('mousedown', this.moveStart.bind(this),false)
 		window.addEventListener('mousemove', this.moving.bind(this),false)
 		window.addEventListener('mouseup', this.moveStop.bind(this),false)		

		this.isDown = false

	}

	sensorOff(){ 
 		window.removeEventListener('mousedown', this.moveStart.bind(this) )
 		window.removeEventListener('mousemove', this.moving.bind(this) )
 		window.removeEventListener('mouseup', this.moveStop.bind(this) )		
	}

	moveStart( e ){
		
		this.setMouse( e ) 
		//log = this.mouse 
		this.isDown = true 		
		this.final = this.origo = this.mouse.clone() 
		requestAnimationFrame( this.swiping.bind(this) )

	}

	moveStop(){ this.isDown = false }

	moving(e){ 

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

class MatrixSwiper extends ThreeSwiper {

	constructor( TRE ){ 

		super()
		
		this.TRE = TRE 		
		this.SCRW = TRE.SCRW
		this.SCRH = TRE.SCRH

		this.focus = false 
		this.area = this.areaConsol()

	}

	setMouse(e){ 
		this.mouse.x = ( e.clientX / this.SCRW ) * 2 - 1
		this.mouse.y = -( e.clientY / this.SCRH ) * 2 + 1 
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

				let direction = TRE.camera.getWorldDirection()

				if ( this.isFocusRotating ){
					this.TRE.camera.rotateY( distX  * -.05 )					
				} else if ( this.isFocusZooming ){
					this.TRE.camera.translateZ( distY  * 25 )

				} else {
					this.TRE.camera.translateX( distX  * 25 ) 
					this.TRE.camera.translateY( distY  * 25 ) 
					
				}
			}

			super.swiping()

		}

	}

	moveStart(e){ 
		
		if( e.button == 2 ){ e.stopPropagation() }
		
		if( e.target.tagName && e.target.tagName == 'TEXTAREA' ) return;
		this.focus = e.altKey ? this.found() : false 
		this.isFocusRotating = e.shiftKey
		this.isFocusZooming = e.ctrlKey
		this.isAltOnStart = e.altKey 
		super.moveStart(e)

	}

	moveStop(){

		super.moveStop()
		if( this.isAltOnStart && this.distance < 0.01 ) this.placeCard()

	}

	placeCard(){

		this.focus = false 

		var card = TRE.cardRender( afs_collection.randomPick() , 0 , 0 , 0 , 1 ) 
		card.position.addVectors( TRE.camera.position , new THREE.Vector3(  this.mouse.x * this.SCRW ,  this.mouse.y * this.SCRH , 0  ) )
		card.translateZ( -800 - Math.random()*1500  ) 

		TRE.scene.add( card )	

	}

	add3Dmodel( search ){

		let found = search.match(/dae\s*(.*)/)
		if( found ){
			this.coloader( `3d/${found[1]}.dae` )
		}		

	}

	found(){

		this.raycaster.setFromCamera( this.mouse, this.TRE.camera )
		var intersects = this.raycaster.intersectObjects( this.TRE.scene.children , true ) // , true ha a 3d objektumokat is meg akarom fogni 
		//log = intersects
		let found = intersects.filter( e => e.object != this.TRE.scene.children[0] )
		return found.length && found[0].object.parent.serial ? found[0].object.parent : false 
		// for( let found of intersects ){	if(found.object != this.TRE.scene.children[0] ) log = found.object.serial ? KKK[found.object.serial.slice(0,4)].name : found.object ; }

	}

	areaConsol(){

	 	let area = document.createElement('textarea')
		area.className = 'overArea'
		area.setAttribute('spellcheck','false')
		document.body.appendChild( area )
		// area.on('mousedown',(e)=>{ e.preventDefault() })
		area.addEventListener('keydown', e=> e.keyCode==13 ? e.preventDefault()+this.searchFilter( this.area.value )  : 0 )
		return area 

	}

	searchFilter( search ){

		log = search 

		if(search == 'room'){ this.coloader( 'assets/pokerRoom2.dae' ) }
		if(search == 'exit'){ TRE.bad() }
		if(search == 'play'){ this.placeCardsToDesk() }
		if(search.match(/dae\s*.*/)){ this.add3Dmodel( search ) }			 
	}

	coloader( name ){

       var loader = new THREE.ColladaLoader();
        loader.load( name || '3d/virtualParty8high.dae', function ( collada  ) {

	        var dae = collada.scene;

	        var skin = collada.skins[ 0 ];

	        dae.position.set(0,0,0); //x,z,y- if you think in blender dimensions ;)
	        	        
	        //dae.scale.multiplyScalar(50)
	        //dae.rotateX(-90/RAD)

	        window.dae = dae

	        TRE.scene.add(dae);

    	})		


	}

	placeCardsToDesk(){

		let dae = window.dae
		if(!dae) return log = 'load room first!'

			let hand = {x: -239.90710628841492, y: 270.2757916241069, z: 73.25056268785534}
		let downscale = .1
		let ww = 0
		for( var i=0;i<5;i++){
			let card = TRE.cardRender( afs_collection.randomPick() , 0 , 0 , 0 , 1 ) 
			card.scale.multiplyScalar( downscale )
			card.position.set( hand.x + ww , hand.y, hand.z  )
			ww+= 255 * downscale
			TRE.scene.add( card )	
		}


	}


}

class RoomPlay extends MatrixSwiper {

	moveStart(e){ 
	
		if( e.target.tagName && e.target.tagName == 'TEXTAREA' ) return;
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


this.matrixArea = function(){

	let TRE = window.TRE 
	TRE.good()
	TRE.camera.translateY( 343 )
	TRE.camera.translateZ( 1500 )
	TRE.camera.translateX( -500 )

	TRE.clickFullScreen()

	var iact = new RoomPlay( TRE )		
	window.ms = iact

}

window.afterall = function(){ log = afterall }

window.rendere = renderer

// ---------------------------------------------[ onload ]--------------------------------

/*
window.onload = function strickModeStart(){

	PIXI.utils._saidHello = true // don't need pink line 
 	window.zone = new GravitonZoneCCG( window,document )	
 	zone.initZone()

 	log = `Forum.find({},daerr).sort({wroteDate:-1}).limit(20)`

}
*/