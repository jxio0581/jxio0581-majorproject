// The code uses Brush() to paint on the canvas. Using brushes of different sizes and transparency, the entire image is drawn by overlaying it with three draws. 
// The image is adaptive to changes in the window, but because it is loaded with the texture effect of real oil brushes, hundreds of strokes are drawn each time, 
// so you need to wait a few seconds for the update to be successful. 
// Each update will change the random properties of all brushes, so the picture will change.

let brushTexture;  //a variable to hold brush texture image

let img;  //a variable to hold picture

let numSegments = 40;  //divided picture into 40 segments

let segments = [];  //a array to store segments

let savedCanvas;  // store static image of the canvas

function preload() {
  brushTexture = loadImage('assets/brush texture_1.png');
  img = loadImage('assets/Claude_Monet.jpg');
}

function setup() {
  // Initial canvas size based on image
  resizeCanvasToImage();
  savedCanvas = createGraphics(width, height);  // Create a graphics cache to save static image
  calculateSegments();  //calculate segments sizes
  drawImage();  // Draw image to cache
}

function draw() {
  image(savedCanvas, 0, 0);  // Display the image on canvas

}

function windowResized() {
  resizeCanvasToImage();
  savedCanvas = createGraphics(width, height);  // Recreate graphics cache for new canvas size
  calculateSegments();  // Recalculate segments based on new canvas size
  drawImage();  // Redraw image to cache
  redraw();  // Redraw everything
}

function resizeCanvasToImage() {
  // Compare the ratio of the current window to the original image
  let scaleX = windowWidth / img.width;
  let scaleY = windowHeight / img.height;
  let scaleFactor = min(scaleX, scaleY);  // choose the smallest value as the scale value

  // calculate new size while maintain the aspect ratio
  let newWidth = img.width * scaleFactor;
  let newHeight = img.height * scaleFactor;

  resizeCanvas(newWidth, newHeight);  // Resize the canvas
}

function calculateSegments() {
  segments = [];  // Clear existing segments

  let scaleX = width / img.width;
  let scaleY = height / img.height;
  let scaleFactor = min(scaleX, scaleY);  // Keep aspect ratio

  // Calculate the size of each segment
  let segmentWidth = (img.width / numSegments) * scaleFactor;
  let segmentHeight = (img.height / numSegments) * scaleFactor;

  for (let segYPos = 0; segYPos < height; segYPos += segmentHeight) {
    for (let segXPos = 0; segXPos < width; segXPos += segmentWidth) {
      // Get the positions from the center of the segment
      let imgXPos = int(segXPos / scaleFactor);
      let imgYPos = int(segYPos / scaleFactor);
      let segmentColour = img.get(imgXPos, imgYPos);  // Get the color of the pixel from the image, from the center of the segment
      let segment = new ImageSegment(segXPos, segYPos, segmentWidth, segmentHeight, segmentColour);
      segments.push(segment);
    }
  }
}

function drawImage() {
  savedCanvas.background(255);
  // first layer
  for (const segment of segments) {
    Brush(100, 40, 255, savedCanvas, segment.srcImgSegXPos, segment.srcImgSegYPos, segment.srcImgSegWidth, segment.srcImgSegHeight, segment.srcImgSegColour);
  }
  // second layer
  for (const segment of segments) {
    Brush(60, 20, 200, savedCanvas, segment.srcImgSegXPos, segment.srcImgSegYPos, segment.srcImgSegWidth, segment.srcImgSegHeight, segment.srcImgSegColour);
  }
  // third layer
  for (const segment of segments) {
    Brush(30, 0, 150, savedCanvas, segment.srcImgSegXPos, segment.srcImgSegYPos, segment.srcImgSegWidth, segment.srcImgSegHeight, segment.srcImgSegColour);
  }
}


// store information of segments
class ImageSegment {
  constructor(srcImgSegXPosInPrm, srcImgSegYPosInPrm, srcImgSegWidthInPrm, srcImgSegHeightInPrm, srcImgSegColourInPrm) {
    this.srcImgSegXPos = srcImgSegXPosInPrm;
    this.srcImgSegYPos = srcImgSegYPosInPrm;
    this.srcImgSegWidth = srcImgSegWidthInPrm;
    this.srcImgSegHeight = srcImgSegHeightInPrm;
    this.srcImgSegColour = srcImgSegColourInPrm;
  }
}

// draw a random stroke
function Brush(widthAdded, heightAdded, transparency, cache, xPos, yPos, baseWidth, baseHeight, baseColor) {
  // input a number to set the size of brush
  let width = baseWidth + widthAdded;
  let height = baseHeight + heightAdded;

  // Randomize color, shift in hue
  let hueShift = random(-20, 20);
  let newColor = color(
    constrain(red(baseColor) + hueShift, 0, 255),
    constrain(green(baseColor) + hueShift, 0, 255),
    constrain(blue(baseColor) + hueShift, 0, 255),
    transparency  // input a number to set transparency
  );

  // Create a temporary canvas to draw the shape by createGraphics()
  let pg = createGraphics(width, height);  // size of the brush
  pg.fill(newColor);
  pg.noStroke();
  pg.rect(0, 0, pg.width, pg.height);

  // Create a PImage object to store the contents of the temporary canvas, mask can only be applied to PImage
  let pgImage = createImage(pg.width, pg.height);
  pgImage.copy(pg, 0, 0, pg.width, pg.height, 0, 0, pg.width, pg.height);

  // Resize the mask image to match the size of pg1
  brushTexture.resize(pg.width, pg.height);
  // Apply a mask to the image
  pgImage.mask(brushTexture);

  // Randomize rotation angle
  let angle = random(TWO_PI);
  cache.push();
  cache.translate(xPos + pg.width / 2, yPos + pg.height / 2);  // Move origin to the center
  cache.rotate(angle);
  cache.imageMode(CENTER);
  cache.image(pgImage, 0, 0);  // Draw stroke at the new origin
  cache.pop();
}


