var THREE = require('three');
var $ = require('jquery');


let camera, scene, renderer;
let geometry, material, mesh;

init();
// animate();
renderer.render(scene,camera);

function init() {
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.z = 1;

	scene = new THREE.Scene();

	
	const plane = new THREE.PlaneGeometry( 1, 1, 10,10 );
	
	shaderMaterial = new THREE.ShaderMaterial( {
			uniforms: {
				u_time: { value: 1.0 },
				u_resolution: { value: new THREE.Vector2(window.innerWidth,window.innerHeight) }
			}
		}
	);
	

	shaderMaterial.fragmentShader = `
	uniform vec2 u_resolution;
	void main() {
		
		vec2 st = gl_FragCoord.xy/u_resolution.xy;

		gl_FragColor =vec4(sin(st.x*10.0*3.13),sin(st.y*10.0*3.14),0.0,0.0);
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