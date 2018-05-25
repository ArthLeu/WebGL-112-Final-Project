"use strict";

var gl;                 // The webgl context.

var a_coords_loc;       // Location of the a_coords attribute variable in the shader program.
var a_coords_buffer;    // Buffer to hold the values for a_coords.
var a_normal_loc;       // Location of a_normal attribute.
var a_normal_buffer;    // Buffer for a_normal.
var index_buffer;       // Buffer to hold vetex indices from model.

var u_diffuseColor;     // Locations of uniform variables in the shader program
var u_specularColor;
var u_specularExponent;
var u_lightPosition;
var u_lightDirection;
var u_modelview;
var u_projection;
var u_normalMatrix;
var u_spot;

var projection = mat4.create();          // projection matrix
var modelview;                           // modelview matrix; value comes from rotator
var normalMatrix = mat3.create();        // matrix, derived from model and view matrix, for transforming normal vectors
var rotator;                             // A TrackballRotator to implement rotation by mouse.

var lastTime = 0;
var colors = [  // RGB color arrays for diffuse and specular color values
    [1,1,1],
];

var timeDegrees = 0;
var timeRadian;
var anim = 0;
var mvStack = [];

var objects = [         // Objects for display
    uvCone(), ring(), uvCylinder(), uvSphere(), uvTorus(), cube()
];

var currentModelNumber;  // contains data for the current object

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function pushMatrix() {
	var copy = mat4.clone(modelview);
    mvStack.push(copy);
}

function popMatrix() {
	if (mvStack.length == 0) {
    	throw "Invalid popMatrix!";
    }
    modelview = mvStack.pop();
}

function perspective(fov, aspect, zNear, zFar // all good
    ){
	mat4.perspective(projection, fov, aspect, zNear, zFar);
}

function translate(params // all good
    ){
	mat4.translate(modelview, modelview, params); 
}

function rotate(degree, axis // all good
    ){
	mat4.rotate(modelview, modelview, degree, axis); 
}

function scale(params // all good
    ){
	mat4.scale(modelview, modelview, params);
	}


function drawCarWheels(modelview, projection) {
	
}


function draw() { 
    gl.clearColor(0.0,0.00,0.0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(projection,Math.PI/5,1,5,30);
    modelview = rotator.getViewMatrix();
	/* perspective(Math.PI/3.5,0.56,10,20); // perspective function for testing*/
	rotate(Math.PI/9,[1,0,0]);
	
	
	// base plate
    // draw the center plate
	currentModelNumber = 2;
	gl.uniform4f(u_diffuseColor, 0.0, 0.3, 0, 1);
	installModel(objects[currentModelNumber]);
	rotate(degToRad(90), [1,0,0])
	scale([4.5,4.5,0.5]); 
    update_uniform(modelview,projection,currentModelNumber);
	scale([0.222, 0.222, 2])

	// draw the 1st ring in cylinder
	gl.uniform4f(u_diffuseColor, 0.5, 0.5, 0.5, 1);
	scale([6.8, 6.8, 0.5])
	translate([0,0,0.01]);
	installModel(objects[currentModelNumber]);
    update_uniform(modelview,projection,currentModelNumber);
	scale([0.147, 0.147, 2])
	
	// second ring in cylinder
	gl.uniform4f(u_diffuseColor, 0.00, 0.3, 0, 1);
	scale([8, 8, 0.5])
	translate([0,0,0.01]);
	installModel(objects[currentModelNumber]);
    update_uniform(modelview,projection,currentModelNumber);
	scale([0.125, 0.125, 2])
    
	// tree trunks
	
	gl.uniform4f(u_diffuseColor, 0.07, 0.03, 0.01, 1);
	scale([0.2, 0.2, 0.6])
	translate([-12,-14,-0.5]);
	installModel(objects[currentModelNumber]); // 01
    update_uniform(modelview,projection,currentModelNumber);
	translate([12,14,0]);
	
	translate([4,-18,0]);
	installModel(objects[currentModelNumber]); // 02
    update_uniform(modelview,projection,currentModelNumber);
	translate([-4,18,0]);
	
	translate([8,-16,0]);
	installModel(objects[currentModelNumber]); // 03
    update_uniform(modelview,projection,currentModelNumber);
	translate([-8,16,0])

	translate([18,-2,0]);
	scale([0.75, 0.75, 1])
	installModel(objects[currentModelNumber]); // 04
    update_uniform(modelview,projection,currentModelNumber);
	scale([1.33, 1.33, 1])
	translate([-18,2,0])
	
	translate([19,0,0]);
	installModel(objects[currentModelNumber]); // 05
    update_uniform(modelview,projection,currentModelNumber);
	translate([-19,0,0])
	
	translate([18,2,0]);
	scale([0.75, 0.75, 1])
	installModel(objects[currentModelNumber]); // 06
    update_uniform(modelview,projection,currentModelNumber);
	scale([1.33, 1.33, 1])
	translate([-18,-2,0])
	
	translate([-2,-2,0]);
	scale([0.75, 0.75, 1])
	installModel(objects[currentModelNumber]); // 07
    update_uniform(modelview,projection,currentModelNumber);
	scale([1.33, 1.33, 1])
	translate([2,2,0])
	
	translate([3,-1,0]);
	installModel(objects[currentModelNumber]); // 08
    update_uniform(modelview,projection,currentModelNumber);
	translate([-3,1,0])
	
	translate([-3,9,0]);
	installModel(objects[currentModelNumber]); // 09
    update_uniform(modelview,projection,currentModelNumber);
	translate([3,-9,0])
	
	translate([-2.5,18,0]);
	scale([0.6,0.6,1]);
	installModel(objects[currentModelNumber]); // 10
    update_uniform(modelview,projection,currentModelNumber);
	scale([1.66,1.66,1]);
	translate([2.5,-18,0])
	
	// lamp stand
	gl.uniform4f(u_diffuseColor, 0.1, 0.1, 0.1, 1);
	translate([0,0,-0.6]);
	scale([0.8,0.8,3]);
	installModel(objects[currentModelNumber]); // 11
    update_uniform(modelview,projection,currentModelNumber);
	translate([0,0,0.6])
	scale([1.25,1.25,0.33]);
	
	// tree leaves
	scale([5, 5, 1.66])
	
	gl.uniform4f(u_diffuseColor, 0.0, 0.3, 0.0, 1);
	currentModelNumber = 0;
	
	rotate(degToRad(180),[0,1,0]);
	scale([0.8, 0.8, 1])
	translate([3,-3.5,1.45]);
	installModel(objects[currentModelNumber]); // 01
    update_uniform(modelview,projection,currentModelNumber);
	translate([-3,3.5,-0.03]);
	
	translate([-1,-4.5,0]);
	scale([0.8, 0.8, 1]);
	installModel(objects[currentModelNumber]); // 02
    update_uniform(modelview,projection,currentModelNumber);
	scale([1.25, 1.25, 1])
	translate([1,4.5,0]);
	
	translate([-2,-4,0.25]);
	scale([1, 1, 1.2])
	installModel(objects[currentModelNumber]); // 03
    update_uniform(modelview,projection,currentModelNumber);
	scale([1, 1, 0.833]);
	translate([2,4,-0.25]);
	
	translate([-4.5,-0.5,-0.1]);
	scale([0.75, 0.75, 0.75])
	installModel(objects[currentModelNumber]); // 04
    update_uniform(modelview,projection,currentModelNumber);
	scale([1.33, 1.33, 1.33])
	translate([4.5,0.5,0.1]);
	
	translate([-4.7,0,0]);
	scale([1, 1, 1])
	installModel(objects[currentModelNumber]); // 05
    update_uniform(modelview,projection,currentModelNumber);
	translate([4.7,0,0]);
	
	translate([-4.5,0.5,-0.15]);
	scale([0.6, 0.6, 0.7])
	installModel(objects[currentModelNumber]); // 06
    update_uniform(modelview,projection,currentModelNumber);
	scale([1.667, 1.667, 1.43])
	translate([4.5,-0.5,0.15]);
	
	translate([0.5,-0.5,-0.25]);
	scale([0.5, 0.5, 0.6])
	installModel(objects[currentModelNumber]); // 07
    update_uniform(modelview,projection,currentModelNumber);
	scale([2, 2, 1.667])
	translate([-0.5,0.5,0.25]);
	
	translate([-0.75,-0.3,0]);
	scale([1, 1, 1])
	installModel(objects[currentModelNumber]); // 08
    update_uniform(modelview,projection,currentModelNumber);
	translate([0.75,0.3,0]);
	
	translate([0.75,2.25,0]);
	scale([0.75, 0.75, 0.8])
	installModel(objects[currentModelNumber]); // 09
    update_uniform(modelview,projection,currentModelNumber);
	scale([1.333, 1.333, 1.25])
	translate([-0.75,-2.25,0]);
	
	translate([0.62,4.5,-0.25]);
	scale([0.5, 0.5, 0.6])
	installModel(objects[currentModelNumber]); // 10
    update_uniform(modelview,projection,currentModelNumber);
	scale([2, 2, 1.667])
	translate([-0.62,-4.5,0.25]);
	
	scale([1.25, 1.25, 1]);
	
	// sun
	pushMatrix();
	currentModelNumber = 3;
	translate([0,0,-1]);
	
	scale([0.6,0.6,0.6]);
	rotate(timeRadian, [0,1,0]);
	translate([0,0,7.5]);
	
	timeRadian = degToRad(timeDegrees);
	
	if (timeDegrees > 90 && timeDegrees < 270) {
		gl.uniform4f(u_diffuseColor, 0.1, 0.1, 0.1, 1);
	}
	else {
		var alpha = Math.sin(degToRad(timeDegrees+90));
		gl.uniform1i(u_spot, 0);
		gl.uniform4f(u_diffuseColor, 0.85*(1+alpha), 0.8*(1+alpha), 0.0, 1); 
		gl.uniform3f(u_specularColor, 0.65+0.4*Math.cos(timeRadian), 0.65+0.4*Math.cos(timeRadian), 0.45+0.4*Math.cos(timeRadian));
		gl.uniform4f(u_lightPosition,  -5*Math.sin(timeRadian), 5*Math.cos(timeRadian), -15+10*Math.cos(timeRadian),  1);
	}
	
	installModel(objects[currentModelNumber]); // 4
	update_uniform(modelview,projection,currentModelNumber);
	
	popMatrix();
	
	// lamp head
	pushMatrix();
	if (timeDegrees > 90 && timeDegrees < 270) {
		gl.uniform1i(u_spot, 0);
		gl.uniform4f(u_diffuseColor, 0.85, 0.85, 0.0, 1);
		gl.uniform4f(u_lightPosition, 0, 1.5, -13.5, 0.05);
		gl.uniform3f(u_specularColor, 0.4, 0.4, 0.3);
	}
	else
		gl.uniform4f(u_diffuseColor, 0.1, 0.1, 0.1, 1);
	
	scale([0.25,0.25,0.25]);
	translate([0,0,2.6]);
	installModel(objects[currentModelNumber]); // 1
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix();
	
	// CAR
	
	pushMatrix(); // car starts
	
	rotate(degToRad(90),[0,0,1]);
	
	pushMatrix(); // combo 1
	currentModelNumber = 2; // 5 cylinders
	gl.uniform4f(u_diffuseColor, 0.2, 0.2, 0.2, 1);
	
	rotate(timeRadian,[0,0,-1]);
	rotate(degToRad(90),[1,0,0]);
	
	translate([-2.85,-0.57,-0.5]);
	rotate(timeRadian*7, [-1,0,0]);

	pushMatrix();  // axis 1
	rotate(degToRad(90),[0,1,0]);
	scale([0.08,0.08,0.95]);
	installModel(objects[currentModelNumber]); 
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix(); // axis 1 ends
	
	pushMatrix(); // wheel 1
	translate([-0.38,0,0]);
	pushMatrix(); // wheel 1 spoke 1 start
	rotate(degToRad(90),[1,0,0]);
	scale([0.08,0.08,0.25]);
	installModel(objects[currentModelNumber]); 
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix();  //spoke 1 ends
	
	pushMatrix(); // spoke 2 start
	rotate(degToRad(90),[0,0,1]);
	scale([0.08,0.08,0.25]);
	installModel(objects[currentModelNumber]);
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix(); // spoke 2 ends
	
	currentModelNumber = 4;
	gl.uniform4f(u_diffuseColor, 0, 0, 0, 1);
	pushMatrix(); // tire 1 starts
	rotate(degToRad(90),[0,1,0]);
	scale([0.35,0.35,0.4]);
	installModel(objects[currentModelNumber]); // wheel 1
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix(); // tire 1 ends
	popMatrix(); // wheel 1 ends;
	
	pushMatrix(); // wheel 2
	currentModelNumber = 2;
	gl.uniform4f(u_diffuseColor, 0.2, 0.2, 0.2, 1);
	translate([0.38,0,0]); 
	pushMatrix(); // wheel 2 spoke 1 starts
	rotate(degToRad(90),[1,0,0]);
	scale([0.08,0.08,0.3]);
	installModel(objects[currentModelNumber]);
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix(); // wheel 2 spoke 1 ends
	
	pushMatrix(); // wheel 2 spoke 2 ends
	rotate(degToRad(90),[0,0,1]);
	scale([0.08,0.08,0.3]);
	installModel(objects[currentModelNumber]); // wheel 2 spoke 2
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix();  // wheel 2 spoke 2 ends
	
	currentModelNumber = 4; // tires
	gl.uniform4f(u_diffuseColor, 0, 0, 0, 1);
	pushMatrix(); // tire 2 starts
	rotate(degToRad(90),[0,1,0]);
	scale([0.35,0.35,0.4]);
	installModel(objects[currentModelNumber]); // wheel 1
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix(); // tire 2 ends;
	popMatrix(); // wheel 2 ends;
	
	popMatrix(); // combo 1 ends
	
	
	pushMatrix(); // combo 2
	currentModelNumber = 2; // 5 cylinders
	gl.uniform4f(u_diffuseColor, 0.2, 0.2, 0.2, 1);
	
	rotate(timeRadian,[0,0,-1]);
	rotate(degToRad(90),[1,0,0]);
	
	translate([-2.85,-0.57,0.5]);
	rotate(timeRadian*6, [-1,0,0]);
	
	pushMatrix();  // axis 1
	rotate(degToRad(90),[0,1,0]);
	scale([0.08,0.08,0.95]);
	installModel(objects[currentModelNumber]); 
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix(); // axis 1 ends
	
	pushMatrix(); // wheel 1
	translate([-0.38,0,0]);
	pushMatrix(); // wheel 1 spoke 1 start
	rotate(degToRad(90),[1,0,0]);
	scale([0.08,0.08,0.25]);
	installModel(objects[currentModelNumber]); 
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix();  //spoke 1 ends
	
	pushMatrix(); // spoke 2 start
	rotate(degToRad(90),[0,0,1]);
	scale([0.08,0.08,0.25]);
	installModel(objects[currentModelNumber]);
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix(); // spoke 2 ends
	
	currentModelNumber = 4;
	gl.uniform4f(u_diffuseColor, 0, 0, 0, 1);
	pushMatrix(); // tire 1 starts
	rotate(degToRad(90),[0,1,0]);
	scale([0.35,0.35,0.4]);
	installModel(objects[currentModelNumber]); // wheel 1
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix(); // tire 1 ends
	popMatrix(); // wheel 1 ends;
	
	pushMatrix(); // wheel 2
	currentModelNumber = 2;
	gl.uniform4f(u_diffuseColor, 0.2, 0.2, 0.2, 1);
	translate([0.38,0,0]); 
	pushMatrix(); // wheel 2 spoke 1 starts
	rotate(degToRad(90),[1,0,0]);
	scale([0.08,0.08,0.3]);
	installModel(objects[currentModelNumber]);
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix(); // wheel 2 spoke 1 ends
	
	pushMatrix(); // wheel 2 spoke 2 ends
	rotate(degToRad(90),[0,0,1]);
	scale([0.08,0.08,0.3]);
	installModel(objects[currentModelNumber]); // wheel 2 spoke 2
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix();  // wheel 2 spoke 2 ends
	
	currentModelNumber = 4; // tires
	gl.uniform4f(u_diffuseColor, 0, 0, 0, 1);
	pushMatrix(); // tire 2 starts
	rotate(degToRad(90),[0,1,0]);
	scale([0.35,0.35,0.4]);
	installModel(objects[currentModelNumber]); // wheel 1
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix(); // tire 2 ends;
	popMatrix(); // wheel 2 ends;
	
	popMatrix(); // combo 2 ends
	
	///////////////////////////////////////// headlights and body
	
	pushMatrix();
	rotate(timeRadian,[0,0,-1]);
	translate([-2.8,0,0]);
	
	pushMatrix();
	currentModelNumber = 3;
	if (timeDegrees > 90 && timeDegrees < 270) {
		gl.uniform4f(u_diffuseColor, 4, 4, 0.2, 1);
		gl.uniform4f(u_lightPosition, 3*Math.sin(timeRadian)+Math.cos(timeRadian), 2.3+2*Math.cos(timeRadian)-1.8*Math.sin(timeRadian), -12-2.0*Math.cos(timeRadian)+3.5*Math.sin(timeRadian), 1);
	}
	else
		gl.uniform4f(u_diffuseColor, 0.05, 0.05, 0.05, 1);
	
	scale([0.15,0.15,0.15]);
	translate([0.8,3.9,-3.25]);
	installModel(objects[currentModelNumber]); // headlight 1
    update_uniform(modelview,projection,currentModelNumber);
	
	translate([-2.25,0,0]);
	installModel(objects[currentModelNumber]); // headlight 2
    update_uniform(modelview,projection,currentModelNumber);
	popMatrix();
	
	pushMatrix();
	translate([-0.05,0,-0.50]);
	currentModelNumber = 5; // car body
	gl.uniform4f(u_diffuseColor, 0.4, 0.698, 1, 1);
	scale([0.6,1.2,0.3]);
	installModel(objects[currentModelNumber]); // lower
    update_uniform(modelview,projection,currentModelNumber);
	
	translate([0,-0.1,0.9]);
	scale([0.9,0.72,0.9]);
	gl.uniform4f(u_diffuseColor, 0.1, 0.1, 0.4, 1);
	installModel(objects[currentModelNumber]); // upper
    update_uniform(modelview,projection,currentModelNumber); 

	popMatrix(); // car ends
}

/*
  this function assigns the computed values to the uniforms for the model, view and projection 
  transform
*/
function update_uniform(modelview,projection,currentModelNumber){

    /* Get the matrix for transforming normal vectors from the modelview matrix,
       and send matrices to the shader program*/
    mat3.normalFromMat4(normalMatrix, modelview);
    
    gl.uniformMatrix3fv(u_normalMatrix, false, normalMatrix);
    gl.uniformMatrix4fv(u_modelview, false, modelview );
    gl.uniformMatrix4fv(u_projection, false, projection );   
    gl.drawElements(gl.TRIANGLES, objects[currentModelNumber].indices.length, gl.UNSIGNED_SHORT, 0);
}

/* 
 * Called and data for the model are copied into the appropriate buffers, and the 
 * scene is drawn.
 */
function installModel(modelData) {
     gl.bindBuffer(gl.ARRAY_BUFFER, a_coords_buffer);
     gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
     gl.vertexAttribPointer(a_coords_loc, 3, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(a_coords_loc);
     gl.bindBuffer(gl.ARRAY_BUFFER, a_normal_buffer);
     gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);
     gl.vertexAttribPointer(a_normal_loc, 3, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(a_normal_loc);
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index_buffer);
     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);
}


/* Initialize the WebGL context.  Called from init() */
function initGL() {
    var prog = createProgram(gl,"vshader-source","fshader-source");
    gl.useProgram(prog);
    a_coords_loc =  gl.getAttribLocation(prog, "a_coords");
    a_normal_loc =  gl.getAttribLocation(prog, "a_normal");
    u_modelview = gl.getUniformLocation(prog, "modelview");
    u_projection = gl.getUniformLocation(prog, "projection");
    u_normalMatrix =  gl.getUniformLocation(prog, "normalMatrix");
    u_lightPosition=  gl.getUniformLocation(prog, "lightPosition");
	u_lightDirection=  gl.getUniformLocation(prog, "lightDirection");
    u_diffuseColor =  gl.getUniformLocation(prog, "diffuseColor");
    u_specularColor =  gl.getUniformLocation(prog, "specularColor");
    u_specularExponent = gl.getUniformLocation(prog, "specularExponent");
	u_spot = gl.getUniformLocation(prog, "spot");
    a_coords_buffer = gl.createBuffer();
    a_normal_buffer = gl.createBuffer();
    index_buffer = gl.createBuffer();
    gl.enable(gl.DEPTH_TEST);
    gl.uniform3f(u_specularColor, 0.5, 0.5, 0.5);
    gl.uniform4f(u_diffuseColor, 1, 1, 1, 1);
    gl.uniform1f(u_specularExponent, 10);
    gl.uniform4f(u_lightPosition, 0, 0, 0, 1);
	gl.uniform1i(u_spot, 0);
}

/* Creates a program for use in the WebGL context gl, and returns the
 * identifier for that program.  If an error occurs while compiling or
 * linking the program, an exception of type String is thrown.  The error
 * string contains the compilation or linking error.  If no error occurs,
 * the program identifier is the return value of the function.
 *    The second and third parameters are the id attributes for <script>
 * elementst that contain the source code for the vertex and fragment
 * shaders.
 */
function createProgram(gl, vertexShaderID, fragmentShaderID) {
    function getTextContent( elementID ) {
            // This nested function retrieves the text content of an
            // element on the web page.  It is used here to get the shader
            // source code from the script elements that contain it.
        var element = document.getElementById(elementID);
        var node = element.firstChild;
        var str = "";
        while (node) {
            if (node.nodeType == 3) // this is a text node
                str += node.textContent;
            node = node.nextSibling;
        }
        return str;
    }
    try {
        var vertexShaderSource = getTextContent( vertexShaderID );
        var fragmentShaderSource = getTextContent( fragmentShaderID );
    }
    catch (e) {
        throw "Error: Could not get shader source code from script elements.";
    }
    var vsh = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource(vsh,vertexShaderSource);
    gl.compileShader(vsh);
    if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
        throw "Error in vertex shader:  " + gl.getShaderInfoLog(vsh);
     }
    var fsh = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource(fsh, fragmentShaderSource);
    gl.compileShader(fsh);
    if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
       throw "Error in fragment shader:  " + gl.getShaderInfoLog(fsh);
    }
    var prog = gl.createProgram();
    gl.attachShader(prog,vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
       throw "Link error in program:  " + gl.getProgramInfoLog(prog);
    }
    return prog;
}


/**
 * initialization function that will be called when the page has loaded
 */
function init() {
    try {
        var canvas = document.getElementById("myGLCanvas");
        gl = canvas.getContext("webgl") || 
                         canvas.getContext("experimental-webgl");
        if ( ! gl ) {
            throw "Browser does not support WebGL";
        }
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not get a WebGL graphics context.</p>";
        return;
    }

    try {
        initGL();  // initialize the WebGL graphics context
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not initialize the WebGL graphics context:" + e + "</p>";
        return;
    }
	
	document.getElementById("animate").onchange = function() {
        var val = Number(this.value);
        anim = anim == 1 ? 0 : 1;
    };
	
	rotator = new TrackballRotator(canvas, draw, 15);
	tick();
}

function animate() {
	timeDegrees = timeDegrees >= 359.25 ? (timeDegrees + 0.75) % 360 : timeDegrees + 0.75;
}

function tick() {
    requestAnimationFrame(tick);
    draw();
	if (anim == 1)
		animate();
}






