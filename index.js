var $ = require('jquery');
var THREE = require('three');
var glsl = require('glslify');

// import qrshaderFrag from './shaders/qr.frag'

var src = glsl('./shaders/qr.frag');

let camera, scene, renderer;
let geometry, shaderMaterial, mesh;


$(document).ready(function(){
	$('#qr_textinput').on('input', function() {
		const text = $( this ).val();
	    drawQR(text);
	    window.planemesh.material.uniforms.u_qrcodeTexture.value.needsUpdate = true
	});
	
	init();

	drawQR($('#qr_textinput').val());

	animate(0);
	// renderer.render(scene,camera);

});




function drawQR(text) {
	var QRC = qrcodegen.QrCode;
	var qr0 = QRC.encodeText(text, QRC.Ecc.MEDIUM);

	const canvas = $('#myawesomecanvas')[0]; //Get the actual dom element by indexing into the jquery array

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

	const canvas = $('#myawesomecanvas')[0];

	const qrcodeTexture = new THREE.CanvasTexture(canvas);
	qrcodeTexture.magFilter = THREE.NearestFilter;
	

	const plane = new THREE.PlaneGeometry( width, height, 10,10 ); //Plane with same width and height as the ortho camera, and viewport, with 10 divisions
	
	shaderMaterial = new THREE.ShaderMaterial( {
			uniforms: {
				u_time: { value: 1.0 },
				u_resolution: { value: new THREE.Vector2(width,height) },
				u_qrcodeTexture: { type: "t", value: qrcodeTexture },
				u_qrcodeSize: { value: 21.0 }

			}
		}
	);
	

	shaderMaterial.fragmentShader =	src;


	window.planemesh = new THREE.Mesh ( plane, shaderMaterial);
	
	scene.add( planemesh );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
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