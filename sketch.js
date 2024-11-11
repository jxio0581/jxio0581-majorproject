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
  calculateSegments();
  background(0);
}

function draw() {
    noLoop();  //Do not update the screen

    //draw the segments(draw the picture stroke by stroke)     
    //Use a large, dark brush to draw the background
    for (const segment of segments) {
      drawStroke(segment.srcImgSegXPos, segment.srcImgSegYPos, segment.srcImgSegWidth, segment.srcImgSegHeight, segment.srcImgSegColour);
    }
}

function calculateSegments() {
  segments = [];  // clear existing segments
  
  let scaleFactorX = width / img.width;
  let scaleFactorY = height / img.height;
  let scaleFactor = min(scaleFactorX, scaleFactorY);  // keep aspect ratio

  // calculate the size of each segment
  let segmentWidth = (img.width / numSegments) * scaleFactor;
  let segmentHeight = (img.height / numSegments) * scaleFactor;

  for (let segYPos = 0; segYPos < height; segYPos += segmentHeight) {
    for (let segXPos = 0; segXPos < width; segXPos += segmentWidth) {
      // get the colour of the pixel from the image, from the centre of the segment
      let imgXPos = int(segXPos / scaleFactor);
      let imgYPos = int(segYPos / scaleFactor);
      let segmentColour = img.get(imgXPos, imgYPos);
      let segment = new ImageSegment(segXPos, segYPos, segmentWidth, segmentHeight, segmentColour);
      segments.push(segment);
    }
  }
}

function windowResized() {
  resizeCanvasToImage();
  calculateSegments();  // Recalculate segments based on new canvas size
  redraw();  // Redraw everything
}

function resizeCanvasToImage() {
  let scaleFactorX = windowWidth / img.width;
  let scaleFactorY = windowHeight / img.height;
  let scaleFactor = min(scaleFactorX, scaleFactorY);  // Keep the aspect ratio

  // Calculate new dimensions while maintaining the aspect ratio
  let newWidth = img.width * scaleFactor;
  let newHeight = img.height * scaleFactor;

  resizeCanvas(newWidth, newHeight);  // Resize the canvas to the new dimensions
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
  // draw1() {
  //   // draw a temporary canvas by p5.Graphics, because mask() can only be applied to PImage or p5.Graphics
  //   let pg1 = createGraphics(this.srcImgSegWidth + 100, this.srcImgSegHeight + 30);  // size of the brush
  //   pg1.fill(this.srcImgSegColour);  // get color from the picture
  //   pg1.noStroke();
  //   pg1.rect(0, 0, pg1.width, pg1.height);  // draw a rectangle

  //   // Create a PImage object to store the contents of the temporary canvas
  //   let pg1Image = createImage(pg1.width, pg1.height);
  //   pg1Image.copy(pg1, 0, 0, pg1.width, pg1.height, 0, 0, pg1.width, pg1.height);

  //   // Resize the mask image to match the size of pg1
  //   brushTexture.resize(pg1.width, pg1.height);
  //   // Apply a mask to the image
  //   pg1Image.mask(brushTexture);

  //   let angle = random(TWO_PI);  // random angle 
  //   push(); 
  //   translate(this.srcImgSegXPos + pg1.width / 2, this.srcImgSegYPos + pg1.height / 2);  // Move the origin to the center of pg1(segments)
  //   // rotate about the center
  //   rotate(angle);
  //   imageMode(CENTER);
  //   // draw a stroke      
  //   image(pg1Image, 0, 0);  
  //   pop(); 
  //   } 

  // draw2() {
  //   // Randomize colors, change hue
  //   let hueShift = random(-30, 30);
  //   let newColor2 = color(
  //     constrain(red(this.srcImgSegColour) + hueShift, 0, 255),  // Limit within 255
  //     constrain(green(this.srcImgSegColour) + hueShift, 0, 255),
  //     constrain(blue(this.srcImgSegColour) + hueShift, 0, 255),
  //     200 // little transparency
  //   );

  //   let pg2 = createGraphics(this.srcImgSegWidth + 50, this.srcImgSegHeight);  // Smaller size
  //   pg2.fill(newColor2); 
  //   pg2.noStroke();
  //   pg2.rect(0, 0, pg2.width, pg2.height); 

  //   let pg2Image = createImage(pg2.width, pg2.height);
  //   pg2Image.copy(pg2, 0, 0, pg2.width, pg2.height, 0, 0, pg2.width, pg2.height);

  //   brushTexture.resize(pg2.width, pg2.height);
  //   pg2Image.mask(brushTexture);

  //   let angle = random(TWO_PI); 
  //   push();
  //   translate(this.srcImgSegXPos + pg2.width / 2, this.srcImgSegYPos + pg2.height / 2);
  //   rotate(angle);
  //   imageMode(CENTER);
  //   image(pg2Image, 0, 0);
  //   pop(); 
  //   }

  // draw3() {
  //   //More subtle color changes
  //   let hueShift = random(-15, 15); 
  //   let newColor3 = color(
  //     constrain(red(this.srcImgSegColour) + hueShift, 0, 255),
  //     constrain(green(this.srcImgSegColour) + hueShift, 0, 255),
  //     constrain(blue(this.srcImgSegColour) + hueShift, 0, 255),
  //     120
  //   );

  //   let pg3 = createGraphics(this.srcImgSegWidth + 20, this.srcImgSegHeight);  // Smaller size
  //   pg3.fill(newColor3);
  //   pg3.noStroke();
  //   pg3.rect(0, 0, pg3.width, pg3.height);

  //   let pg3Image = createImage(pg3.width, pg3.height);
  //   pg3Image.copy(pg3, 0, 0, pg3.width, pg3.height, 0, 0, pg3.width, pg3.height);

  //   brushTexture.resize(pg3.width, pg3.height);
  //   pg3Image.mask(brushTexture);

  //   let angle = random(TWO_PI);
  //   push();
  //   translate(this.srcImgSegXPos + pg3.width / 2, this.srcImgSegYPos + pg3.height / 2);
  //   rotate(angle);
  //   imageMode(CENTER);
  //   image(pg3Image, 0, 0);
  //   pop(); 
  //   }
}

function drawStroke(xPos, yPos, baseWidth, baseHeight, baseColor) {
  // 随机化尺寸，范围为 0.8 到 1.5 倍
  // let sizeMultiplier = random(0.8, 1.5);
  let width = baseWidth;
  let height = baseHeight;

  // 随机化颜色，轻微变动色相
  let hueShift = random(-20, 20);
  let newColor = color(
    constrain(red(baseColor) , 0, 255),
    constrain(green(baseColor) , 0, 255),
    constrain(blue(baseColor) , 0, 255),
    100  // 设置一定透明度
  );

  // 创建临时画布绘制图形
  let pg = createGraphics(width + 100, height + 30);  // size of the brush with some extra margin
  pg.fill(newColor);
  pg.noStroke();
  pg.rect(0, 0, pg.width, pg.height);

  // 创建 PImage 对象存储临时画布内容
  let pgImage = createImage(pg.width, pg.height);
  pgImage.copy(pg, 0, 0, pg.width, pg.height, 0, 0, pg.width, pg.height);

  // 调整遮罩大小并应用
  brushTexture.resize(pg.width, pg.height);
  pgImage.mask(brushTexture);

  // 随机旋转角度
  let angle = random(TWO_PI);
  push();
  translate(xPos + pg.width / 2, yPos + pg.height / 2);  // 移动到中心
  rotate(angle);
  imageMode(CENTER);
  image(pgImage, 0, 0);  // 在新原点处绘制图像
  pop();
}


