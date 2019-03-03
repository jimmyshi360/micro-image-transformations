/*
  Author: Jimmy Shi
  Testing suite for unittesting image transform functions.
  We use Base64 to encode test images compactly.
  Use an online decoder to see the image for each test case.
*/

const { expect } = require('chai');
const Canvas = require('canvas');
const { describe, it } = require('mocha');

global.Image = Canvas.Image;
const {
  JSDOM,
} = require('jsdom');
const imageTransformations = require('../src/index');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const {
  window,
} = jsdom;

// initialize virtual dom for testing
global.window = window;
global.document = window.document;

/** Utility function for diffing images
   image diff is necessary as
   directly comparing Base64 is unreliable due to varying encoding schemes * */
function imageDiff(img1, img2) {
  const canvas1 = document.createElement('canvas');
  const canvasContext1 = canvas1.getContext('2d');

  const canvas2 = document.createElement('canvas');
  const canvasContext2 = canvas2.getContext('2d');

  const imgWidth1 = img1.width;
  const imgHeight1 = img1.height;

  const imgWidth2 = img2.width;
  const imgHeight2 = img2.height;

  canvas1.width = imgWidth1;
  canvas1.height = imgHeight1;

  canvas2.width = imgWidth2;
  canvas2.height = imgHeight2;

  canvasContext1.drawImage(img1, 0, 0);
  canvasContext2.drawImage(img2, 0, 0);

  const pixelGrid1 = canvasContext1.getImageData(0, 0, imgWidth1, imgHeight1);
  const pixelGrid2 = canvasContext2.getImageData(0, 0, imgWidth2, imgHeight2);

  for (let y = 0; y < pixelGrid1.height; y += 1) {
    for (let x = 0; x < pixelGrid1.width; x += 1) {
      const i = (y * 4) * pixelGrid1.width + x * 4;

      // no pixels should be red
      if (pixelGrid1.data[i] !== pixelGrid2.data[i]) { return false; }
      if (pixelGrid1.data[i + 1] !== pixelGrid2.data[i + 1]) { return false; }
      if (pixelGrid1.data[i + 2] !== pixelGrid2.data[i + 2]) { return false; }
    }
  }
  return true;
}

describe('micro-image-transformations', () => {
  describe('grayscale', () => {
    /** uses a red square to check that all pixels are updated,
       output should no longer be a red square.
       grayscale does not always change all pixels but it should still operate over all of them * */
    it('should update/check all pixels', () => {
      const imageNotRed = (img) => {
        const canvas = document.createElement('canvas');
        const canvasContext = canvas.getContext('2d');

        const imgWidth = img.width;
        const imgHeight = img.height;
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        canvasContext.drawImage(img, 0, 0);

        const pixelGrid = canvasContext.getImageData(0, 0, imgWidth, imgHeight);

        for (let y = 0; y < pixelGrid.height; y += 1) {
          for (let x = 0; x < pixelGrid.width; x += 1) {
            const i = (y * 4) * pixelGrid.width + x * 4;

            // no pixels should be red
            if (pixelGrid.data[i] === 255) { return false; }
            if (pixelGrid.data[i + 1] === 255) { return false; }
            if (pixelGrid.data[i + 2] === 255) { return false; }
          }
        }
        return true;
      };

      const redSquare = new Image();
      // preload a (255, 0, 0) rgb red 16x16 square.
      // Grayscale should change all pixels to another color
      redSquare.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWP8z8Dwn4ECwESJ5lEDRg0YNWAwGQAAWG0CHpmX3bgAAAAASUVORK5CYII=';

      const grayscaleIMG = imageTransformations.grayscale(redSquare);
      expect(imageNotRed(grayscaleIMG)).to.equal(true);
    });

    // tests the precondition that images of size 1x1 or greater should work
    it('should handle 1x1 images', () => {
      const img = new Image();
      // preload a (255, 0, 0) rgb red 1x1 square.
      // Grayscale should change all pixels to another color
      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==';
      try {
        imageTransformations.grayscale(img);
        expect(true).to.equal(true);
      } catch (e) {
        expect(false).to.equal(true);
      }
    });

    /** tests the precondition that empty image objects
       should result in an exception being thrown (width and/or height of 0)* */
    it('should gracefully handle empty images', () => {
      // initiliaze empty image
      const img = new Image();
      expect(() => imageTransformations.grayscale(img)).to.throw('cannot process empty image');
    });

    /** optional test, assuming same grayscale logic is used.
       tests that the luminosity equation is accurate * */
    it('(OPTIONAL) should calculate correct grayscale luminosity', () => {
      const img = new Image();
      // preload a (255, 0, 0) rgb red 1x1 square.
      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==';
      const targetImage = new Image();
      // preload the expected 1x1 image based on the luminosity equation
      targetImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2MwMzP7DwAC6gGi4bvgyAAAAABJRU5ErkJggg==';
      expect(imageDiff(imageTransformations.grayscale(img), targetImage)).to.equal(true);
    });
  });

  describe('crop', () => {
    /** tests the precondition that empty image objects
       should result in an exception being thrown (width and/or height of 0)* */
    it('should gracefully handle empty images', () => {
      // initialize empty image
      const img = new Image();
      expect(() => imageTransformations.crop(img, 0, 0, 2, 2)).to.throw('cannot process empty image');
    });

    /** tests the precondition that startX and startY for
     cropping cannot exceed the image height or width
     should result in an exception being thrown* */
    it('should not accept starting coordinates outside of image dimensions (too large)', () => {
      // initialize empty image
      const img = new Image();
      // preload 16x16 dimension image
      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWP8z8Dwn4ECwESJ5lEDRg0YNWAwGQAAWG0CHpmX3bgAAAAASUVORK5CYII=';
      expect(() => imageTransformations.crop(img, 17, 17, 2, 2)).to.throw('starting coordinates out of bounds');
    });

    /** tests the precondition that startX and startY for
        cropping cannot be negative, should result in exception being thrown * */
    it('should not accept starting coordinates outside of image dimensions (too small)', () => {
    // initialize empty image
      const img = new Image();
      // preload 16x16 dimension image
      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWP8z8Dwn4ECwESJ5lEDRg0YNWAwGQAAWG0CHpmX3bgAAAAASUVORK5CYII=';
      expect(() => imageTransformations.crop(img, -1, -1, 2, 2)).to.throw('starting coordinates out of bounds');
    });

    it('should execute properly for valid inputs',
      () => {
        const img = new Image();
        // preload 16x16 dimension image
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWP8z8Dwn4ECwESJ5lEDRg0YNWAwGQAAWG0CHpmX3bgAAAAASUVORK5CYII=';

        // if try results in exception, then we have a failure
        try {
          imageTransformations.crop(img, 2, 2, 2, 2);
          expect(true).to.equal(true);
        } catch (e) {
          expect(false).to.equal(true);
        }
      });

    it('should only accept positive cropWidth and cropHeight',
      () => {
        const img = new Image();
        // preload 16x16 dimension image
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWP8z8Dwn4ECwESJ5lEDRg0YNWAwGQAAWG0CHpmX3bgAAAAASUVORK5CYII=';

        expect(() => imageTransformations.crop(img, 2, 2, -1, -1)).to.throw('crop height and width must be positive');
      });

    /** if startX + cropWidth exceeds the width of the image,
        or startY + cropHeight exceeds the height of the images,
     then we get an out of bounds problem * */
    it('should accept crop dimensions that stay in bounds based on starting coordinates',
      () => {
        const img = new Image();
        // preload 16x16 dimension image
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWP8z8Dwn4ECwESJ5lEDRg0YNWAwGQAAWG0CHpmX3bgAAAAASUVORK5CYII=';

        expect(() => imageTransformations.crop(img, 2, 2, 15, 15)).to.throw('crop dimensions must stay in bounds');
      });

    /** cropping dimmensions should equal cropWidth and cropHeight * */
    it('cropping output has expected new dimensions ',
      () => {
        const img = new Image();
        // preload 16x16 dimension image
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWP8z8Dwn4ECwESJ5lEDRg0YNWAwGQAAWG0CHpmX3bgAAAAASUVORK5CYII=';

        // test two different outputs
        const output = imageTransformations.crop(img, 2, 2, 14, 14);
        expect(output.width).to.equal(14);
        expect(output.height).to.equal(14);

        const smallerOutput = imageTransformations.crop(img, 0, 0, 5, 5);
        expect(smallerOutput.width).to.equal(5);
        expect(smallerOutput.height).to.equal(5);
      });

    /** simple cropping test to see that cropping works.
     *  takes a 2x2 square, with bottom left corner completely black.
     *  all other pixels are white. Crops the bottom left quarter.
     *  Therefore the output should be a 1x1 black square* */
    it('should crop pixels properly',
      () => {
        const img = new Image();
        // 2x2 test image
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGD4DwABBAEAfbLI3wAAAABJRU5ErkJggg==';
        const target = new Image();
        // 1x1 black square
        target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2NgYGD4DwABBAEAcCBlCwAAAABJRU5ErkJggg==';
        const output = imageTransformations.crop(img, 0, 0, 1, 1);

        expect(imageDiff(output, target)).to.equal(true);
      });
  });
});
