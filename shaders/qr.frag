
uniform vec2 u_resolution;
uniform sampler2D u_qrcodeTexture;
uniform float u_time;
uniform float u_qrcodeSize;

vec3 colors_desat[8];

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
    #define PAT_SCALE 1.2

    vec2 pos = (vec2(st) - PAT_OFFSET)*u_qrcodeSize*PAT_SCALE;
    
    vec2 texCoord = st - PAT_OFFSET;
    vec3 n = texture2D(u_qrcodeTexture,texCoord*PAT_SCALE).rgb;

    if ((n.r < 0.9) 
    		&&  //Masking of pattern
            (st.x > PAT_OFFSET.x && 
             st.y > PAT_OFFSET.y)
            &&
            (st.x < (PAT_OFFSET.x + 1.0 /PAT_SCALE) && 
             st.y < (PAT_OFFSET.y + 1.0 /PAT_SCALE))
            ) 
            {
        n = blend_(pos);
    }
    else {
        n = vec3(1.0,1.0,1.0);
    }
    
    n= pow(n,vec3(1.5));
    texture2D(u_qrcodeTexture,texCoord*PAT_SCALE).rgb;

    gl_FragColor = vec4(n, 1.0);
}