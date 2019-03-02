

module.exports = {

    /** Accepts an Image object and returns the modified grayscale version of the image.
        Uses the luminosity method by doing 0.21 R + 0.72 G + 0.07 B on each pixel(It looks nicer!).
     **/
    grayscale: function(image) {

            //uses the canvas method for manipulating images
        	let canvas = document.createElement('canvas');
        	let canvasContext = canvas.getContext('2d');

        	let imgWidth = image.width;
        	let imgHeight = image.height;
        	canvas.width = imgWidth;
        	canvas.height = imgHeight;

        	canvasContext.drawImage(image, 0, 0);
        	let pixelGrid = canvasContext.getImageData(0, 0, imgWidth, imgHeight);
        	for (y = 0; y < pixelGrid.height; y++) {
        		for (x = 0; x < pixelGrid.width; x++) {
        		    //calculate pixel index to manipulate
        		    //We multiply by 4 because pixel data is stored (r,g,b,a) so we traverse 4 blocks at a time
        			let i = (y * 4) * pixelGrid.width + x * 4;
        			//average values based on the luminosity equation
        			let avg = (pixelGrid.data[i]*0.21 + pixelGrid.data[i + 1]*0.72 + pixelGrid.data[i + 2]*0.07) ;
        			pixelGrid.data[i] = avg;
        			pixelGrid.data[i + 1] = avg;
        			pixelGrid.data[i + 2] = avg;
        		}
        	}
        	//insert modified image and convert into an img element to return
        	canvasContext.putImageData(pixelGrid, 0, 0, 0, 0, pixelGrid.width, pixelGrid.height);
        	let output = new Image();
        		output.src = canvas.toDataURL();
        	return output;
    }
};