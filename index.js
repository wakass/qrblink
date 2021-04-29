var $ = require('jquery');
var THREE = require('three');
var glsl = require('glslify');

// import qrshaderFrag from './shaders/qr.frag'

var src = glsl('./shaders/qr.frag');

let camera, scene, renderer;
let geometry, shaderMaterial, mesh;

var default_url = "https://www.paypal.com/donate/?hosted_button_id=LMUTVRN3YDGJE"

$(document).ready(function(){
	$("#qr_textinput").val(default_url);

	$('#qr_textinput').on('input', function() {
		const text = $( this ).val();
	    drawQR(text);
	    window.planemesh.material.uniforms.u_qrcodeTexture.value.needsUpdate = true
	    window.planemesh.material.uniforms.u_logoTexture.value.needsUpdate = true
	});
	

    var myCanvas = document.getElementById('logoDisplay');
    var ctx = myCanvas.getContext('2d');
    var img = new Image;
    img.onload = function(){
      ctx.drawImage(img,0,0); // Or at whatever offset you like
    };
    img.crossOrigin = '';
    img.src = './alab_2.png';

    // img.src = './self_.png';

	init();

	drawQR($('#qr_textinput').val());

	animate(0);
});




function drawQR(text) {
	var QRC = qrcodegen.QrCode;
	var qr0 = QRC.encodeText(text, QRC.Ecc.MEDIUM);

	const canvas = $('#qrcodeDisplay')[0]; //Get the actual dom element by indexing into the jquery array

	qr0.drawCanvas(1, 0, canvas);
	window.planemesh.material.uniforms.u_qrcodeSize.value = qr0.size;
	

}

function init() {
	const container = $('.container')[0];
	const width = (window.innerHeight - window.innerHeight%2);
	const height = width;
	console.log(width,height);
	camera = new THREE.OrthographicCamera( width / -2, width / 2, height / 2, height / -2, -100, 100 );
	
	scene = new THREE.Scene();

	const qrcodeCanvas = $('#qrcodeDisplay')[0];
	const logoCanvas = $('#logoDisplay')[0];

	const qrcodeTexture = new THREE.CanvasTexture(qrcodeCanvas);
	qrcodeTexture.magFilter = THREE.NearestFilter;

	const logoTexture = new THREE.CanvasTexture(logoCanvas);
	logoTexture.magFilter = THREE.NearestFilter;
	

	const plane = new THREE.PlaneGeometry( width, height, 10,10 ); //Plane with same width and height as the ortho camera, and viewport, with 10 divisions
	
	shaderMaterial = new THREE.ShaderMaterial( {
			uniforms: {
				u_time: { value: 1.0 },
				u_resolution: { value: new THREE.Vector2(width,height) },
				u_qrcodeTexture: { type: "t", value: qrcodeTexture },
				u_logoTexture: { type: "t", value: logoTexture },
				u_qrcodeSize: { value: 21.0 },
				u_logoSize: {value: new THREE.Vector2(logoTexture.width,logoTexture.height)}

			}
		}
	);
	

	shaderMaterial.fragmentShader =	src;


	window.planemesh = new THREE.Mesh ( plane, shaderMaterial);
	
	scene.add( planemesh );

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setSize( width, height );
	$('.container').append( renderer.domElement );


}
let previous_timestamp;

function animate(timestamp) {

	if (previous_timestamp === undefined)
		previous_timestamp = timestamp;
	
	const delta = timestamp - previous_timestamp;
	
	requestAnimationFrame( animate );
	if (delta > 60) {
		previous_timestamp = timestamp;
		// planemesh.rotation.x += 0.01;
		// planemesh.rotation.y += 0.02;
		planemesh.material.uniforms.u_time.value += delta*0.001;

		renderer.render( scene, camera );	
	}
	

}