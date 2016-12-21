var soundFile;
var amplitude;
var fft;
var songanalyze;

var audioEl;
var currentLyric = '';
var lyrics = ' ';
var lrcStrings;


var backgroundColor;

// rectangle parameters
var rectRotate = true;
var rectMin = 5;
var rectOffset = 20;
var numRects = 10;


//circle parameters
var radiusMin = 15;

var shakerRadiusMin = 8;

var beads;
var platform;
var bordersX = 200;
var bordersY =200;
var borderSizeX  = 70;
var borderSizeY = 200;
var speedVar = 0.4;
var GRAVITY = 1.4;

var bpm;
var prevbpm = 35;

var circles;
var gravity2 = 15;
var sizeW = 30;
var sizeY = 70;
var shakeposition = 200;
var shakepositionY = 150;
var shake = false;

var futuraBold;

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

var songPlay1 = "Toggle spacebar to control playback.";
var songPlay2 = "Press space to continue playback.";

var bassBlob;
var eggShaker;
var lineString;
var blob1;
var blob2;
var disc;
var marakas;

var spritebassBlob;


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
  //soundFile = loadSound('assets/DREAMDIVISION.mp3');

  lrcStrings = loadStrings('assets/ChildishGambinoCalifornia_01.lrc');
	
	bassBlob = loadImage('assets/bassBlob.svg');
	

	morakas = loadImage('assets/morakas.svg');


futuraBold = loadFont("assets/Futura_Bold.ttf");
	
}

function setup() {
colorMode(RGB, 255, 255, 255, 10);
  c = createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);

  amplitude = new p5.Amplitude();


 
  fft = new p5.FFT();
  
  //audioEl = createAudio('assets/ChildishGambinoCalifornia_01.mp3')
	
  soundFile.play();

  // if( soundFile.isPlaying()){

  // 	audioEl.play();
  // }

  // turn the array of strings into one big string, separated by line breaks.
  lrcStrings = lrcStrings.join('\n');

  // lrc.js library converts Strings to JSON
  var lrcJSON = new Lrc(lrcStrings);

   // iterate through each line of the LRC file to get a Time and Lyric
  for (var i = 0; i < lrcJSON.lines.length; i++) {
    var time = lrcJSON.lines[i].time;
    var lyric = lrcJSON.lines[i].txt.valueOf();

    // schedule events to trigger at specific times during audioEl playback
    soundFile.addCue(time, showLyric, lyric);
  }




  amplitude.setInput(soundFile);
  amplitude.smooth(0.9);
	
  //---new shakers

  circles = new Group();
  
  for(var i=0; i<40; i++)
  {
  var circle = createSprite( random((shakeposition - sizeW), (shakeposition + sizeW)), random((height/2 - sizeY), (height/2 + sizeY)));
  circle.addAnimation("normal", "assets/circleshaker.png");
  circle.setCollider("circle", 0,0,15);
  circle.setSpeed(random(2,5), random(0, 360));
  //circle.restitution = 0.2;
  
  //scale affects the size of the collider
  circle.scale = random(0.1, 0.3);
  //mass determines the force exchange in case of bounce
  //circle.mass = circle.scale;
  circle.mass = 3;
  //restitution is the dispersion of energy at each bounce
  //if = 1 the circles will bounce forever
  //if < 1 the circles will slow down
  //if > 1 the circles will accelerate until they glitch
  circle.restitution = 0.9;
  //circle.debug = true;
  circles.add(circle);
  }

  
	
//----------intstalling beads and shaker
	beads = new Group();
	
	for(var i = 0; i< 25; i++)
  {
var bead = createSprite(random(bordersX, bordersX + borderSizeX),random(bordersY,bordersY + borderSizeY));
  bead.addAnimation("normal", "assets/bead.svg");
  bead.setCollider("circle", 0,0,70);
  bead.setSpeed(speedVar, random(0, 360));
	
  bead.scale = random(0.05, 0.25);
  bead.mass = random(0.2,4);
  bead.restitution = 1;
  bead.depth = 0;
  beads.add(bead);
  
 // bead.debug = true;
  }

 // platform = createSprite(200, 300);
 // platform.addAnimation("normal", "assets/shakerPlatform.svg");
 //platform.immovable = true;
 //platform.setCollider("rectangle", 0, 10 , 189, 12);
 //platform.debug = true;
	
spritebassBlob = createSprite(width/2, height/2);
spritebassBlob.addAnimation("normal", "assets/bassBlob.svg");
spritebassBlob.setSpeed(0.2, random(0, 360));
spritebassBlob.setCollider("circle", 0,0,75);	
//spritebassBlob.debug = true;
spritebassBlob.position.x = 850;
spritebassBlob.position.y = height/2;

//--hairline
  lineString = new Group();

 //blobs

 blob1 = new Group();
 blob2 = new Group();
 disc = new Group();



  
	
}


// callback specified by addCue(time, callback, value).
function showLyric(value) {
  lyrics = value;

  }


function draw() {
  //background(backgroundColor);
	background(237,230,229);
	backgradient();

	//messing with gravity

if (shake === true) {
     gravity = -15;
 } else {
     gravity = 15;
 }
  

  //circles bounce against each others and against boxes
  //circles.bounce(circles);

 //all sprites bounce at the shaker edges
  for(var i=0; i< circles.length; i++) {

  
  circles[i].position.y += gravity;
  
  
  if(circles[i].position.x< (shakeposition  - sizeW)) {
    circles[i].position.x = (shakeposition  - sizeW) +1;
    circles[i].velocity.x = abs(circles[i].velocity.x);
  }
  
  if(circles[i].position.x>(shakeposition  + sizeW)) {
    circles[i].position.x = (shakeposition  + sizeW) -1;
    circles[i].velocity.x = -abs(circles[i].velocity.x);
    }
  
  if(circles[i].position.y<= (shakepositionY - sizeY)  ) {
    circles[i].position.y = (shakepositionY- sizeY)+1;
    circles[i].velocity.y = abs(circles[i].velocity.y);
  }
  
  if(circles[i].position.y> (shakepositionY + sizeY)) {
    circles[i].position.y = (shakepositionY + sizeY)-1;
    circles[i].velocity.y = -abs(circles[i].velocity.y);
    } 

}

//----- adding strings to sketch 
if (lineString.length < 5){
if (frameCount % 120  == 0){

	var strings = createSprite(random(0,width),random(0,height));
  strings.addAnimation("normal", "assets/hairline1.svg", "assets/hairline2.svg", "assets/hairline3.svg" );
  strings.setSpeed(random(-3, 3), random(0,360));
  strings.scale = random(0.2, 0.5);
  strings.depth = random(0,5);

  

  lineString.add(strings);
}

}



 for(var i=0; i< lineString.length; i++) {
 
  
  if(lineString[i].position.x<0) {
  	lineString[i].remove();
    //s.position.x = width;
    //s.velocity.x = abs(s.velocity.x);
  }
  
  if(lineString[i].position.x>width) {
  	lineString[i].remove();
    //s.position.x = 1;
   // s.velocity.x = -abs(s.velocity.x);
    }
  
  if(lineString[i].position.y<0) {
  	lineString[i].remove();
    //s.position.y = height;
  //  s.velocity.y = abs(s.velocity.y);
  }
  
  if(lineString[i].position.y>height) {
  	lineString[i].remove();
    //s.position.y = 1;
   // s.velocity.y = -abs(s.velocity.y);
    } 
  }


//-----------------------adding blobs-------------

if (blob1.length < 2){
if (frameCount % 200  == 0){

var b = createSprite(random(0,width),random(0,height));
  b.addAnimation("normal", "assets/floater1.svg", "assets/floater2.svg", "assets/floater3.svg" );
  b.setSpeed(random(-3, 3), random(0,180));
  b.scale = random(0.1, 0.7);
  b.depth = random(0,5);

  

  blob1.add(b);
}

}



 for(var i=0; i< blob1.length; i++) {
 
  
  if(blob1[i].position.x<0) {
  	//blob1[i].remove();
    blob1[i].position.x = width;
    blob1[i].position.y = random(0, height);

    //s.velocity.x = abs(s.velocity.x);
  }
  
  if(blob1[i].position.x>width) {
    blob1[i].position.x = 0;
    blob1[i].position.y = random(0, height);
   // s.velocity.x = -abs(s.velocity.x);
    }
  
  if(blob1[i].position.y<0) {
    blob1[i].position.x = random(0, width);
    blob1[i].position.y = height;
   
  //  s.velocity.y = abs(s.velocity.y);
  }
  
  if(blob1[i].position.y>height) {
  	blob1[i].position.x = random(0, width);
    blob1[i].position.y = 0;
   // s.velocity.y = -abs(s.velocity.y);
    } 
  }

//adding disc

if (disc.length < 4){
if (frameCount % 20 == 0){

var d = createSprite(random(0,width),random(0,height));
  d.addAnimation("normal", "assets/disc.svg");
  d.setSpeed(random(-2, 2), random(0,90));
  d.scale = random(0.3, 0.7);
  d.depth = 0;

  

  disc.add(d);
}

}



 for(var i=0; i< disc.length; i++) {
 
  
  if(disc[i].position.x<0) {
    disc[i].position.x = width;
    disc[i].position.y = random(0, height);

    //s.velocity.x = abs(s.velocity.x);
  }
  
  if(disc[i].position.x>width) {
    disc[i].position.x = 0;
    disc[i].position.y = random(0, height);
   // s.velocity.x = -abs(s.velocity.x);
    }
  
  if(disc[i].position.y<0) {
    disc[i].position.x = random(0, width);
    disc[i].position.y = height;
   
  //  s.velocity.y = abs(s.velocity.y);
  }
  
  if(disc[i].position.y>height) {
  	disc[i].position.x = random(0, width);
    disc[i].position.y = 0;
   // s.velocity.y = -abs(s.velocity.y);
    } 
  }



	
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
      //rect(0, 0, rectMin, rectMin + distortDiam);
      setGradient( 0,  0, rectMin, rectMin + distortDiam, color(247,150,39), color(247,192,27), 1 );
    }
  pop();

//-------------Extracting Bass Frequencies---------------//
	
// extracting and analyzing loudness of bass frequencies	
 fft.analyze();	
 var bass = fft.getEnergy(1 , 124);
//map bass loudness to circle size
 var bassDistort = map(bass, 0, 255, 0, 600);
 var bassDistort2 = map(bass, 0, 255, 100, 200);
	
	var bassCenter = createVector(900, height/2 +100);

	
	spritebassBlob.scale = bassDistort2 * 0.01;

	//spritebassBlob.bounce(spritebassBlob);

	  if(spritebassBlob.position.x<750) {
	    spritebassBlob.position.x = 751;
	    spritebassBlob.velocity.x = abs(spritebassBlob.velocity.x);
	  }
	  
	  if(spritebassBlob.position.x> 800) {
	    spritebassBlob.position.x = 800-1;
	    spritebassBlob.velocity.x = -abs(spritebassBlob.velocity.x);
	    }
	  
	  if(spritebassBlob.position.y< height/2 -150) {
	    spritebassBlob.position.y = (height/2 -150) + 1;
	    spritebassBlob.velocity.y = abs(spritebassBlob.velocity.y);
	  }
	  
	  if(spritebassBlob.position.y> height/2 +100) {
	    spritebassBlob.position.y = (height/2 +100) -1;
	    spritebassBlob.velocity.y = -abs(spritebassBlob.velocity.y);
	    } 
	  

	

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
	

 drawSprites();
	
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
			//shake =! shake;

			if (frameCount % 8 == 0){

			 	shake =! shake;
			}
		}

	
	
	var shakerYpositions = [ -10, 5, -2, -9, -15, 13, 0, 7]; 

    //for (var i = 0; i < 8; i++) {
//      var x = shakerCenter.x + shakerDistort/2;
//
//     var y = shakerCenter.y + shakerDistort/2;
		
		
		//var x = 200 + (15 * i);
		var x = 200 ;
		var y = 150 + (shakerDistort + shakerYpositions[i] );
      // rotate around the center of this rectangle
	push();
		//translate( x , y);
		scale(0.5);
        image(morakas, x,y);
      // ellipse(0, 0, 10, 10);
	pop();
	
//      ellipse(0 - (shakerDistort/2), 0 - (shakerDistort/2), radiusMin + (shakerDistort/2), radiusMin + (shakerDistort/2));
	
    //}
  	pop();
 
	
//print(shaker); //debug shaker frequency
	

//---beads to show number of beats per minute
	
 //beads bounce against each others and against walls
  beads.bounce(beads);
	
for(var i=0; i<beads.length; i++) {
var s = beads.get(i);

  if(s.position.x<0) {
    s.position.x = 1;
    s.velocity.x = abs(s.velocity.x);
  }
  
  if(s.position.x>width) {
    s.position.x = width-1;
    s.velocity.x = -abs(s.velocity.x);
    }
  
  if(s.position.y<0) {
    s.position.y = 1;
    s.velocity.y = abs(s.velocity.y);
  }
  
  if(s.position.y>height) {
    s.position.y = height-1;
    s.velocity.y = -abs(s.velocity.y);
    } 
  }

// extracting and siplaying bpm bubbles

push();
	fill(255);
	textSize(16);
	textFont(futuraBold );
	text("Average BPM: " + str(bpm), 100, height - 60);
	pop();


	if (prevbpm < bpm ){

		var addBpm = bpm - prevbpm;
		//print("this is how many beads to add" + addBpm);

		prevbpm += addBpm;
	} else if (prevbpm > bpm){

		var takeBpm = prevbpm - bpm;
		//print("this is how many beads to remove" + takeBpm);

		prevbpm -= takeBpm;
	}
	
	
	push();
		translate(100, height - 80);
		fill(255);
		textFont(futuraBold);
		textAlign(LEFT);
		textSize(20);
		text("Music: Childish Gambino - California",0,0);
	pop();

	push();
		translate(100, height - 110);
		fill(255);
		textFont(futuraBold);
		textAlign(LEFT);
		textSize(30);
		text(songPlay1,0,0);
	pop();
	
	
	
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
		
		push();
		translate(width/2 , (height/2 +80));
		fill(255);
		textFont(futuraBold);
		textAlign(CENTER);
		textSize(20);
		text(songPlay2,0,0);
		pop();

		spritebassBlob.scale = 0.4;

	
	}

// //drawing lyrics
	push();
		translate(width - 200, height/2 - 250);
		fill(gradientcolour2);
		textFont(futuraBold);
		textAlign(LEFT);
		textSize(18);
		text(lyrics,0,0, 1000, 250);
	pop();

	

}

function detectBeat(level) {
  if (level  > beatCutoff && level > beatThreshold){
    onBeat();
    beatCutoff = level *1.2;
    framesSinceLastBeat = 0;
	bpmCounter();
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
	//setGradient(0, 0, width, height, color(237, 230,229,200), color(254,251,250, 200), 1);
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

var isbeatHit = 0; 
var calcBPM ;
var timeStamp1 ;
var timeStamp2 ;

function bpmCounter(){

	isbeatHit++
	
var timeDuration = 0;
	
//if first beat	
if( isbeatHit < 2){
	//record current time in milliseconds times 0.001 to take it to seconds.	
	timeStamp1 = (millis() * 0.001);
  	//print("time stamp 1 " + timeStamp1);

} 
if (isbeatHit > 3 && isbeatHit < 5){
	//if on the 4th beat
 //record current time in milliseconds times 0.001 to take it to seconds.
 timeStamp2 = (millis() * 0.001);
	
print("time stamp 2 " + timeStamp2 + " and time stamp 1 is " + timeStamp1);

//print("time stamp 2 " + timeStamp2 );

timeDuration = (timeStamp2 - timeStamp1);
//print("time duration is " + timeDuration);

calcBPM = Math.round((240/timeDuration));

print("bpm is " + calcBPM);
 
 //reset isbeatHit to 0;
	isbeatHit = 0;
	//timeStamp1 = 0;
	//timeStamp2 = 0;
	timeDuration = 0;
}

  bpm = calcBPM;
}

function mousePressed() {
    keyTyped();
    
}