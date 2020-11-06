var THREE = require('three');
var $ = require('jquery');


let camera, scene, renderer;
let geometry, material, mesh;


$(document).ready(function(){
	drawQR();
	init();
	animate(0);
	// renderer.render(scene,camera);

});

function drawQR() {
	var QRC = qrcodegen.QrCode;
	var qr0 = QRC.encodeText("Hello, world!", QRC.Ecc.MEDIUM);

	const canvas = $('#myawesomecanvas')[0]; //Get the actual dom element by indexing into the jquery array

	qr0.drawCanvas(1, 0, canvas);

}

function init() {
	const container = $('.container')[0];
	const width = 500;
	const height = 500;
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
				u_qrcodeTexture: { type: "t", value: qrcodeTexture }

			}
		}
	);
	

	shaderMaterial.fragmentShader = `
	uniform vec2 u_resolution;
	uniform sampler2D u_qrcodeTexture;
	uniform float u_time;

	void main() {
		
		vec2 st = gl_FragCoord.xy/u_resolution.xy;

		vec4 color = texture2D(u_qrcodeTexture, st);

		// color = vec4(0.0,1.0,0.0,0.0);
		gl_FragColor = vec4(color.xyz,0.0);
	}	
	`
	shaderMaterial.fragmentShader =	`
	uniform vec2 u_resolution;
	uniform sampler2D u_qrcodeTexture;
	uniform float u_time;


	vec3 colors_desat[8];

	#define QR_SIZE 21.0
	float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(15.12312555,13.1213131)))
                 * 43758.5453123 * sin(10.1 +u_time/20000.)); //utime controls the randomness over time
}



vec3 blend_ (in vec2 st) {
    
    vec2 i = floor(st);
    vec2 f = fract(st);
    // f.x=f.x*.2;
    // Four corners in 2D of a tile
    float brightness = 1.2;


    vec3 basecolor;
    basecolor = colors_desat[int(random(i)*7.0)];
    vec3 a = basecolor;
    vec3 b = basecolor;
    vec3 c = basecolor;
    vec3 d = basecolor;

    // Smooth Interpolation

    // Cubic Hermine Curve, modified
    vec2 u = f*f*(2.41-3.14*f);
     //u = smoothstep(0.,.9,f);

    // Mix 4 corners percentages
    return mix(a, b, u.x) +
             (c - a) * u.y * (1.0 - u.x)+
             (d - b) * u.x * u.y;
}

	void main() {

    
    colors_desat[0] = vec3(0.882, 0.416, 0.525);
    colors_desat[1] = vec3(0.788, 0.506, 0.149);
    colors_desat[2] = vec3(0.596, 0.588, 0 );
    colors_desat[3] = vec3(0.208, 0.651, 0.196);
    colors_desat[4] = vec3(0, 0.678, 0.537);
    colors_desat[5] = vec3(0, 0.655, 0.773);
    colors_desat[6] = vec3(0.388, 0.565, 0.898);
    colors_desat[7] = vec3(0.769, 0.435, 0.855);



    vec2 st = gl_FragCoord.xy/u_resolution.xy;

//Guarantee a border around the pattern - QR specification
    #define PAT_OFFSET vec2(0.05,0.05)
    #define PAT_SCALE 1.1

    vec2 pos = (vec2(st) - PAT_OFFSET)*QR_SIZE*PAT_SCALE;
    
    vec2 texCoord = st - PAT_OFFSET;
    vec3 n = texture2D(u_qrcodeTexture,texCoord*PAT_SCALE).rgb;

    if ((n.r < 0.9) &&  //Masking of pattern
            (st.x > PAT_OFFSET.x && 
             st.y > PAT_OFFSET.y)
            &&
            (st.x < (PAT_OFFSET.x + 1.0 /PAT_SCALE) && 
             st.y < (PAT_OFFSET.y + 1.0 /PAT_SCALE))
            ) {
        n = blend_(pos);
    }
    else {
        n = vec3(1.0,1.0,1.0);
    }
    
    n= pow(n,vec3(1.5));
    
    gl_FragColor = vec4(n, 1.0);
}`


	planemesh = new THREE.Mesh ( plane, shaderMaterial);
	
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
		planemesh.material.uniforms.u_time.value += delta*0.01;

		console.log(delta);

		
	}
	renderer.render( scene, camera );

}