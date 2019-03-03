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


global.window = window;
global.document = window.document;

// Utility function for diffing images
// image diff is necessary as
// directly comparing Base64 is unreliable due to varying encoding schemes
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
    // uses a red square to check that all pixels are updated,
    // grayscale does not always change all pixels but it should still operate over all of them
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

    // tests the precondition that empty image objects
    // should result in an exception being thrown (width or height of 0)
    it('should gracefully handle empty images', () => {
      const img = new Image();
      // preload a (255, 0, 0) rgb red 1x1 square.
      // Grayscale should change all pixels to another color
      expect(() => imageTransformations.grayscale(img)).to.throw('cannot process empty image');
    });

    // optional test, assuming same grayscale logic is used.
    // tests that the luminosity equation is accurate
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
});
