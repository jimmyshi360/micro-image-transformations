let expect = require('chai').expect;
let imageTransformations = require('../src/index');
let Canvas = require("canvas");
global.Image = Canvas.Image;
var fs = require("fs");
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;


global.window = window;
global.document = window.document;

describe('micro-image-transformations', function () {

	describe('grayscale', function () {

		//uses a red square to check that all pixels are updated,
		//grayscale does not always change all pixels but it should still operate over all of them
		it('should update all pixels', function () {

			let imageDiff = (img) => {

				let canvas = document.createElement('canvas');
				let canvasContext = canvas.getContext('2d');

				let imgWidth = img.width;
				let imgHeight = img.height;
				canvas.width = imgWidth;
				canvas.height = imgHeight;
				canvasContext.drawImage(img, 0, 0);

				let pixelGrid = canvasContext.getImageData(0, 0, imgWidth, imgHeight);

				for (y = 0; y < pixelGrid.height; y++) {
					for (x = 0; x < pixelGrid.width; x++) {

						let i = (y * 4) * pixelGrid.width + x * 4;

						//no pixels should be red
						if (pixelGrid.data[i] === 255)
							return false;
						if (pixelGrid.data[i + 1] === 255)
							return false;
						if (pixelGrid.data[i + 2] === 255)
							return false;
					}
				}
				return true;

			};

			let redSquare = new Image();
			//preload a (255, 0, 0) rgb red 16x16 square. Grayscale should change all pixels to another color
			redSquare.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWP8z8Dwn4ECwESJ5lEDRg0YNWAwGQAAWG0CHpmX3bgAAAAASUVORK5CYII=';

			let grayscaleIMG = imageTransformations.grayscale(redSquare);
			expect(imageDiff(grayscaleIMG)).to.equal(true);

		});

		//tests the precondition that images of size 1x1 or greater should work
		it('should handle 1x1 images', function () {

			let img = new Image();
			//preload a (255, 0, 0) rgb red 1x1 square. Grayscale should change all pixels to another color
			img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWP4z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==';
			try {
				let grayscaleIMG = imageTransformations.grayscale(img);
				expect(true).to.equal(true);
			} catch (e) {
				expect(false).to.equal(true);
			}

		});

		//tests the precondition that empty image objects should result in an exception being thrown (width or height of 0)
		it('should gracefully handle empty images', function () {

			let img = new Image();
			//preload a (255, 0, 0) rgb red 1x1 square. Grayscale should change all pixels to another color

			expect(() => imageTransformations.grayscale(img)).to.throw("cannot process empty image");

		});

		//optional test, assuming same grayscale logic is used. tests that the luminosity equation is accurate
        		it('(OPTIONAL) should calculate correct grayscale luminosity', function () {

        			let img = new Image();
        			//preload a (255, 0, 0) rgb red 16x16 square.
                    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWP8z8Dwn4ECwESJ5lEDRg0YNWAwGQAAWG0CHpmX3bgAAAAASUVORK5CYII=';
                    let targetImage=new Image();
                    //preload the expected 16x16 image based on the luminosity equation
                    targetImage.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4T2M0MzP7z0ABYBw1gGE0DBhGw4BhWIQBABVoGiEEEj37AAAAAElFTkSuQmCC';

        			expect(imageTransformations.grayscale(img).src).to.equal(targetImage.src);
        		});
	})
});