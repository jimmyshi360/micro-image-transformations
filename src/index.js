module.exports = {

  /** Accepts an Image object and returns the modified grayscale version of the image.
     Uses the luminosity method by doing 0.21 R + 0.72 G + 0.07 B on each pixel(It looks nicer!).
     * */
  grayscale(image) {
    // uses the canvas method for manipulating images
    if (image.width === 0 || image.height === 0) {
      throw new Error('cannot process empty image');
    }
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    const imgWidth = image.width;
    const imgHeight = image.height;

    canvas.width = imgWidth;
    canvas.height = imgHeight;

    canvasContext.drawImage(image, 0, 0);
    const pixelGrid = canvasContext.getImageData(0, 0, imgWidth, imgHeight);
    for (let y = 0; y < pixelGrid.height; y += 1) {
      for (let x = 0; x < pixelGrid.width; x += 1) {
        // calculate pixel index to manipulate
        // We multiply by 4 because pixel data is stored (r,g,b,a) so we traverse 4 blocks at a time
        const i = (y * 4) * pixelGrid.width + x * 4;
        // average values based on the luminosity equation
        const R = pixelGrid.data[i];
        const G = pixelGrid.data[i + 1];
        const B = pixelGrid.data[i + 2];
        const avg = (R * 0.21 + G * 0.72 + B * 0.07);
        pixelGrid.data[i] = avg;
        pixelGrid.data[i + 1] = avg;
        pixelGrid.data[i + 2] = avg;
      }
    }
    // insert modified image and convert into an img element to return
    canvasContext.putImageData(pixelGrid, 0, 0, 0, 0, pixelGrid.width, pixelGrid.height);
    const output = new Image();
    output.src = canvas.toDataURL();
    return output;
  },

  /** Crops an image. cropX and cropY specify the bottom left corner to begin cropping
     cropW is the width to crop and cropH is the height to crop.
     * */
  crop(image, startX, startY, cropWidth, cropHeight) {
    if (image.width === 0 || image.height === 0) {
      throw new Error('cannot process empty image');
    }

    if (startX > image.width || startY > image.height) {
      throw new Error('starting coordinates out of bounds');
    }
    if (startX < 0 || startY < 0) {
      throw new Error('starting coordinates out of bounds');
    }
    if (cropWidth <= 0 || cropHeight <= 0) {
      throw new Error('crop height and width must be positive');
    }

    if (startX + cropWidth > image.width || startY + cropHeight > image.height) {
      throw new Error('crop dimensions must stay in bounds');
    }

    // uses the canvas method for manipulating images
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    const imgWidth = image.width;
    const imgHeight = image.height;
    const cropX = startX;
    const cropY = imgHeight - startY;
    const cropW = cropWidth;
    const cropH = cropHeight;

    canvas.width = imgWidth;
    canvas.height = imgHeight;

    canvasContext.drawImage(image, 0, 0);
    const pixelGrid = canvasContext.getImageData(0, 0, imgWidth, imgHeight);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = cropW;
    canvas.height = cropH;
    const pixelGridCropped = canvasContext.createImageData(cropW, cropH);

    for (let y = cropY - cropH; y < cropY; y += 1) {
      for (let x = cropX; x < cropX + cropW; x += 1) {
        // calculate pixel index to manipulate
        // We multiply by 4 because pixel data is stored (r,g,b,a) so we traverse 4 blocks at a time
        const i = (y * 4) * pixelGrid.width + x * 4;
        const cropI = ((y - cropY + cropH) * 4) * cropW + (x - cropX) * 4;
        // average values based on the luminosity equation
        pixelGridCropped.data[cropI] = pixelGrid.data[i];
        pixelGridCropped.data[cropI + 1] = pixelGrid.data[i + 1];
        pixelGridCropped.data[cropI + 2] = pixelGrid.data[i + 2];
        pixelGridCropped.data[cropI + 3] = 255;
      }
    }
    // insert modified image and convert into an img element to return
    const cWidth = pixelGridCropped.width;
    const cHeight = pixelGridCropped.height;
    canvasContext.putImageData(pixelGridCropped, 0, 0, 0, 0, cWidth, cHeight);
    const output = new Image();
    output.src = canvas.toDataURL();
    return output;
  },
};
