

var soundFile;
var amplitude;
var fft;
var songanalyze;

var backgroundColor;

// rectangle parameters
var rectRotate = true;
var rectMin = 15;
var rectOffset = 20;
var numRects = 10;


//circle parameters
var radiusMin = 15;

var shakerRadiusMin = 8;

var beads;
var bordersX = 200;
var bordersY =200;
var borderSizeX  = 70;
var borderSizeY = 200;
var speedVar = 0.4;
var GRAVITY = 1.4;

// :: Beat Detect Variables
// how many draw loop frames before the beatCutoff starts to decay
// so that another beat can be triggered.
// frameRate() is usually around 60 frames per second,
// so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
// we wont respond to every beat.
var beatHoldFrames = 30;

// what amplitude level can trigger a beat?
var beatThreshold = 0.11; 

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
var beatCutoff = 0;
var beatDecayRate = 0.98; // how fast does beat cutoff decay?
var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.

//---gradient contsants---
//Y_AXIS = 1;
///X_AXIS = 2;

var gradientcolour1;
var gradientcolour2;

var songPlay1 = "Press space to pause playback.";
var songPlay2 = "Press space to start playback.";

var bassBlob
var eggShaker
var lineString



//var c1 = color(84,172,71); //light green
//var c2 = color(19,48,40);  //dark green
//var c3 = color(113,94,133); //light purple
//var c4 = color(214,31,52); //fire red
//var c5 = color(233,93,37); //fire orange
//var c6 = color(149,86,54); //brown
//var c7 = color(68,72,158); //soft blue
//var c8 = color(107,38,111); //purple
//var c9 = color(157,71,70); //burgundy

function preload() {
  soundFile = loadSound('assets/ChildishGambinoCalifornia_01.mp3');
	
	bassBlob = loadImage('assets/bassBlob.svg');
	eggShaker = loadImage('assets/egg.svg');
	lineString = loadImage('assets/hairLine.svg');
}

function setup() {
colorMode(RGB, 255, 255, 255, 10);
  c = createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);

  amplitude = new p5.Amplitude();


 
  fft = new p5.FFT();
  
	
  soundFile.play();

  amplitude.setInput(soundFile);
  amplitude.smooth(0.9);
	
//intstalling beads and shaker
	beads = new Group();
	
	for(var i = 0; i<20; i++)
  {
var bead = createSprite(random(bordersX, bordersX +       borderSizeX),random(bordersY,bordersY + borderSizeY));
  bead.addAnimation("normal", "assets/bead.png");
  bead.setCollider("circle", 0,0,2);
  bead.setSpeed(speedVar, random(0, 360));
	
  bead.scale = random(0.2, 0.5);
  bead.mass = random(0.2,4);
  bead.restitution = 1;
  beads.add(bead);
  }
	

  
	
}

function draw() {
  //background(backgroundColor);
	background(237,230,229);
	backgradient();

	

	
//-------------Extracting overall loudness/apmlitude ---------------//
  var level = amplitude.getLevel();
  detectBeat(level);

  // distort the rectangle based based on the amp
  var distortDiam = map(level, 0, 1, 0, 1200);
  var w = rectMin;
  var h = rectMin;

  // distortion direction shifts each beat
  if (rectRotate) {
    var rotation = PI/ 2;
  } else {
    var rotation = PI/ 3;
  }

  // rotate the drawing coordinates to rectCenter position
  var rectCenter = createVector(width/3, height/2);

  push();
	fill(255);
	noStroke();
    // draw the rectangles
    for (var i = 0; i < numRects; i++) {
      var x = rectCenter.x + rectOffset * i;
      var y = rectCenter.y + distortDiam/2;
      // rotate around the center of this rectangle
      translate(x, y); 
      rotate(rotation);
      rect(0, 0, rectMin, rectMin + distortDiam);
    }
  pop();

//-------------Extracting Bass Frequencies---------------//
	
// extracting and analyzing loudness of bass frequencies	
 fft.analyze();	
 var bass = fft.getEnergy(1 , 124);
//map bass loudness to circle size
 var bassDistort = map(bass, 0, 255, 0, 600);
	
	var bassCenter = createVector(850, height/2);

	ellipseMode(CENTER);
  push();
	fill(255);
	noStroke();
    // draw the rectangles
    for (var i = 0; i < 1; i++) {
      var x = bassCenter.x + bassDistort/2;
      var y = bassCenter.y + bassDistort/2;
      // rotate around the center of this rectangle
      translate(x, y ); 
      //rotate(rotation);
	
      ellipse(0 - (bassDistort/2), 0 - (bassDistort/2), radiusMin + (bassDistort/2), radiusMin + (bassDistort/2));
    }
  pop();
	

 
	
// print(bass); //debug bass frequency
	
	
//-------------Extracting very high/Shaker Frequencies---------------//
	
// extracting and analyzing loudness of bass frequencies	

fft.analyze();	
 var shaker = fft.getEnergy(3500, 10000);
//map bass loudness to circle size
 var shakerDistort = map(shaker, 0, 255, 0, 300);
	
	var shakerCenter = createVector(200, 200);

	//ellipseMode(CENTER);
    push();
	fill(255);
	noStroke();

    // draw the circle bunches
	var shakeVariable;
		if( shakerDistort <200){
			
			shakeVariable = random(-20, 20);
		}
	
	var shakerYpositions = [ -10, 5, -2, -9, -15, 13, 0, 7]; 

    for (var i = 0; i < 8; i++) {
//      var x = shakerCenter.x + shakerDistort/2;
//
//     var y = shakerCenter.y + shakerDistort/2;
		
		
		var x = 200 + (15 * i);
		var y = 200 + (shakerDistort + shakerYpositions[i] );
      // rotate around the center of this rectangle
	push();
		translate( x , y);
     
       ellipse(0, 0, 10, 10);
	pop();
	
//      ellipse(0 - (shakerDistort/2), 0 - (shakerDistort/2), radiusMin + (shakerDistort/2), radiusMin + (shakerDistort/2));
	
    }
  	pop();
 
	
//print(shaker); //debug shaker frequency
	
	//-------bouncing beads----------//
	beads.bounce(beads);
	
	if( bassDistort > 50){
	bordersY = 200 + (bassDistort/2);
	}
	
	
	for(var i=0; i<beads.length; i++) {
  var s = beads.get(i);
		
	s.velocity.y += GRAVITY;
	
  if(s.position.x< bordersX) {
    s.position.x = bordersX +1;
    s.velocity.x = abs(s.velocity.x);
	  
	
  }
  
  if(s.position.x>bordersX + borderSizeX) {
    s.position.x = (bordersX +borderSizeX) -1;
    s.velocity.x = -abs(s.velocity.x);
    }
  
  if(s.position.y<bordersY) {
    s.position.y = bordersY +1;
    s.velocity.y = abs(s.velocity.y);
  }
  
  if(s.position.y>bordersY + borderSizeY) {
    s.position.y = (bordersY +borderSizeY)-1;
   // s.velocity.y = -abs(s.velocity.y);
    } 
  }

	
	
  push();
	
	fill
	
push();
	translate(800,200);
	scale(1.5);
	//image(bassBlob, 0, 0);	
pop();
	

	
	
	drawSprites();
	
	
//--------Paused graphic
	
	if(soundFile.isPaused()){
		
		push();
		translate(0,0);
		scale(2);
		fill(30,30,30, 150 );
		rect(0, 0 , width + width/2, height +height/2);
		pop();
		
		fill(255, 255, 255);
		noStroke();
		push();
		translate(width/2 - 50, height/2);
		scale(2);
		rect( 0, 0, 20, 50);
		rect( 45, 0, 20, 50);
		
		pop();
		
		
	}

}

function detectBeat(level) {
  if (level  > beatCutoff && level > beatThreshold){
    onBeat();
    beatCutoff = level *1.2;
    framesSinceLastBeat = 0;
  } else{
    if (framesSinceLastBeat <= beatHoldFrames){
      framesSinceLastBeat ++;
    }
    else{
      beatCutoff *= beatDecayRate;
      beatCutoff = Math.max(beatCutoff, beatThreshold);
    }
  }
	

}


//----colour list-----
//light green
//dark green
//light purple
//fire red
//fire orange
//brown
//soft blue
//purple
//burgundy

//outer light pink
//inner eggshell white




function onBeat() {
	
	var colourArray = [color(84,172,71), 
						   color(19,48,40,110),
						   color(113,94,133,150),
						   color(214,31,52,150),
						   color(233,93,37,110),
						   color(149,86,54,150),
						   color(68,72,158,110),
						   color(107,38,111,150),
						   color(157,71,70,150),
					   		color(237, 230,229,200),
					   		color(254,251,250, 200)
						   ]
	var randomizer = int(random(1,11));
	var randomizer2 = int(random(1,11));
	
	gradientcolour1 = colourArray[randomizer];
	gradientcolour2 = colourArray[randomizer2];
		

	
  //backgroundColor = colourArray[randomizer];
  rectRotate = !rectRotate;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(237,230,229);
}

function backgradient(){
	setGradient(0, 0, width, height, gradientcolour1, gradientcolour2, 1);
}

function setGradient( x,  y, w, h,  c1, c2, axis ) {

  noFill();

  if (axis == 1) {  // Top to bottom gradient
    for (var i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
  else if (axis == 2) {  // Left to right gradient
    for (var i = x; i <= x+w; i++) {
      var inter = map(i, x, x+w, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y+h);
    }
  }
}



//to be converted to p5js

function keyTyped() {

  if ( key === ' ') {
    if ( soundFile.isPlaying() )
    {
		
       soundFile.pause();
		
    }
    // if the player is at the end of the file,
    // we have to rewind it before telling it to play again
    else if ( soundFile.currentTime() == soundFile.duration() )
    {
 	 soundFile.loop(0);
      soundFile.play();
    } else
    {
      soundFile.play();
    }
  }
}
