let brushTexture;  //a variable to hold brush texture image

let img;  //a variable to hold picture

let numSegments = 40;  //divided picture into 40 segments

let segments = [];  //a array to store segments

function preload() {
  brushTexture = loadImage('assets/brush texture_1.png');
  img = loadImage('assets/Claude_Monet.jpg');
}

function setup() {
  createCanvas(img.width, img.height);  //creat canvas based on the picture
  background(0);

  //calculate the size of each segment: 62×44
  let segmentWidth = img.width / numSegments;     //  2480/40=62
  let segmentHeight = img.height / numSegments;   //  1758/40=44

  for (let segYPos=0; segYPos<img.height; segYPos+=segmentHeight) {  //looping over the height    
    for (let segXPos=0; segXPos<img.width; segXPos+=segmentWidth) {  //looping over the width
      //get the colour of the pixel from the image, from the centre of the segment
      let segmentColour = img.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
      let segment = new ImageSegment(segXPos,segYPos,segmentWidth,segmentHeight,segmentColour);
      segments.push(segment);
    }
  }
}

function draw() {
    // noLoop();  //Do not update the screen

    //draw the segments(draw the picture stroke by stroke)     
    //Use a large, dark brush to draw the background
    for (const segment of segments) {
      segment.draw1();
    }
    // Draw details with a small, transparent brush
    for (const segment of segments) {
      segment.draw2();
    }    
    for (const segment of segments) {
      segment.draw3();
    }
}
//a class for getting information and drawing patterns
class ImageSegment {
  constructor(srcImgSegXPosInPrm,srcImgSegYPosInPrm,srcImgSegWidthInPrm,srcImgSegHeightInPrm,srcImgSegColourInPrm) {
    //these parameters are used to set the internal properties of an instance of the segment
    //These parameters are named as imageSource as they are derived from the image we are using
    this.srcImgSegXPos = srcImgSegXPosInPrm;
    this.srcImgSegYPos = srcImgSegYPosInPrm;
    this.srcImgSegWidth = srcImgSegWidthInPrm;
    this.srcImgSegHeight = srcImgSegHeightInPrm;
    this.srcImgSegColour = srcImgSegColourInPrm;
  }
  // draw a stoke
  draw1() {
    // draw a temporary canvas by p5.Graphics, because mask() can only be applied to PImage or p5.Graphics
    let pg1 = createGraphics(this.srcImgSegWidth + 100, this.srcImgSegHeight + 30);  // size of the brush
    pg1.fill(this.srcImgSegColour);  // get color from the picture
    pg1.noStroke();
    pg1.rect(0, 0, pg1.width, pg1.height);  // draw a rectangle

    // Create a PImage object to store the contents of the temporary canvas
    let pg1Image = createImage(pg1.width, pg1.height);
    pg1Image.copy(pg1, 0, 0, pg1.width, pg1.height, 0, 0, pg1.width, pg1.height);

    // Resize the mask image to match the size of pg1
    brushTexture.resize(pg1.width, pg1.height);
    // Apply a mask to the image
    pg1Image.mask(brushTexture);

    let angle = random(TWO_PI);  // random angle 
    push(); 
    translate(this.srcImgSegXPos + pg1.width / 2, this.srcImgSegYPos + pg1.height / 2);  // Move the origin to the center of pg1(segments)
    // rotate about the center
    rotate(angle);
    imageMode(CENTER);
    // draw a stroke      
    image(pg1Image, 0, 0);  
    pop(); 
    } 

  draw2() {
    // Randomize colors, change hue
    let hueShift = random(-30, 30);
    let newColor2 = color(
      constrain(red(this.srcImgSegColour) + hueShift, 0, 255),  // Limit within 255
      constrain(green(this.srcImgSegColour) + hueShift, 0, 255),
      constrain(blue(this.srcImgSegColour) + hueShift, 0, 255),
      200 // little transparency
    );

    let pg2 = createGraphics(this.srcImgSegWidth + 50, this.srcImgSegHeight);  // Smaller size
    pg2.fill(newColor2); 
    pg2.noStroke();
    pg2.rect(0, 0, pg2.width, pg2.height); 

    let pg2Image = createImage(pg2.width, pg2.height);
    pg2Image.copy(pg2, 0, 0, pg2.width, pg2.height, 0, 0, pg2.width, pg2.height);

    brushTexture.resize(pg2.width, pg2.height);
    pg2Image.mask(brushTexture);

    let angle = random(TWO_PI); 
    push();
    translate(this.srcImgSegXPos + pg2.width / 2, this.srcImgSegYPos + pg2.height / 2);
    rotate(angle);
    imageMode(CENTER);
    image(pg2Image, 0, 0);
    pop(); 
    }

  draw3() {
    //More subtle color changes
    let hueShift = random(-15, 15); 
    let newColor3 = color(
      constrain(red(this.srcImgSegColour) + hueShift, 0, 255),
      constrain(green(this.srcImgSegColour) + hueShift, 0, 255),
      constrain(blue(this.srcImgSegColour) + hueShift, 0, 255),
      120
    );

    let pg3 = createGraphics(this.srcImgSegWidth + 20, this.srcImgSegHeight);  // Smaller size
    pg3.fill(newColor3);
    pg3.noStroke();
    pg3.rect(0, 0, pg3.width, pg3.height);

    let pg3Image = createImage(pg3.width, pg3.height);
    pg3Image.copy(pg3, 0, 0, pg3.width, pg3.height, 0, 0, pg3.width, pg3.height);

    brushTexture.resize(pg3.width, pg3.height);
    pg3Image.mask(brushTexture);

    let angle = random(TWO_PI);
    push();
    translate(this.srcImgSegXPos + pg3.width / 2, this.srcImgSegYPos + pg3.height / 2);
    rotate(angle);
    imageMode(CENTER);
    image(pg3Image, 0, 0);
    pop(); 
    }
}
