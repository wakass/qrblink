var THREE = require('three');
var $ = require('jquery');


let camera, scene, renderer;
let geometry, material, mesh;

drawQR();
init();

// animate();
renderer.render(scene,camera);

function drawQR() {
	var QRC = qrcodegen.QrCode;
	var qr0 = QRC.encodeText("Hello, world!", QRC.Ecc.MEDIUM);

	const canvas = $('#myawesomecanvas')[0]; //Get the actual dom element by indexing into the jquery array

	qr0.drawCanvas(1, 0, canvas);

}

function init() {
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.z = 1;

	scene = new THREE.Scene();

	const canvas = $('#myawesomecanvas')[0];

	const qrcodeTexture = new THREE.CanvasTexture(canvas);
	qrcodeTexture.magFilter = THREE.NearestFilter;
	

	const plane = new THREE.PlaneGeometry( 1.5, 1.5, 10,10 );
	
	shaderMaterial = new THREE.ShaderMaterial( {
			uniforms: {
				u_time: { value: 1.0 },
				u_resolution: { value: new THREE.Vector2(window.innerWidth,window.innerHeight) },
				u_qrcodeTexture: { type: "t", value: qrcodeTexture }

			}
		}
	);
	

	shaderMaterial.fragmentShader = `
	uniform vec2 u_resolution;
	uniform sampler2D u_qrcodeTexture;

	void main() {
		
		vec2 st = gl_FragCoord.xy/u_resolution.xy;

		vec4 color = texture2D(u_qrcodeTexture, st);

		gl_FragColor = vec4(color.xyz,0.0);
	}	
	`


	planemesh = new THREE.Mesh ( plane, shaderMaterial);
	
	scene.add( planemesh );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	$('.container').append( renderer.domElement );


}

function animate() {

	requestAnimationFrame( animate );

	planemesh.rotation.x += 0.01;
	planemesh.rotation.y += 0.02;

	renderer.render( scene, camera );

}