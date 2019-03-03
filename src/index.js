

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
        	if(imgWidth ===0 || imgHeight ===0)
        	    throw "cannot process empty image";
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
    },

    /** Crops an image. cropX and cropY specify the bottom left corner to begin cropping
        cropW is the width to crop and cropH is the height to crop.
         **/
    crop: function(image, cropX, cropY, cropW, cropH) {

                           //uses the canvas method for manipulating images
        	let canvas = document.createElement('canvas');
        	let canvasContext = canvas.getContext('2d');

        	let imgWidth = image.width;
        	let imgHeight = image.height;
        	cropY=imgHeight-cropY;
        	if(imgWidth ===0 || imgHeight ===0)
        	    throw "cannot process empty image";
        	canvas.width = imgWidth;
        	canvas.height = imgHeight;

        	canvasContext.drawImage(image, 0, 0);
        	let pixelGrid = canvasContext.getImageData(0, 0, imgWidth, imgHeight);
			canvasContext.clearRect(0, 0, canvas.width, canvas.height);
			canvas.width = cropW;
        	canvas.height = cropH;
			let pixelGridCropped = canvasContext.createImageData(cropW, cropH);
			
        	for (y = cropY-cropH; y < cropY; y++) {
        		for (x = cropX; x < cropX+cropW; x++) {
        		    //calculate pixel index to manipulate
        		    //We multiply by 4 because pixel data is stored (r,g,b,a) so we traverse 4 blocks at a time
        			let i = (y * 4) * pixelGrid.width + x * 4;
					let cropI = ((y-cropY+cropH) * 4) * cropW + (x-cropX) * 4;
        			//average values based on the luminosity equation
        			pixelGridCropped.data[cropI] = pixelGrid.data[i];
        			pixelGridCropped.data[cropI + 1] = pixelGrid.data[i+1];
        			pixelGridCropped.data[cropI + 2] = pixelGrid.data[i+2];
					pixelGridCropped.data[cropI + 3] = 255;
        		}
        	}
        	//insert modified image and convert into an img element to return
        	canvasContext.putImageData(pixelGridCropped, 0, 0, 0, 0, pixelGridCropped.width, pixelGridCropped.height);
        	let output = new Image();
        		output.src = canvas.toDataURL();
        	return output;
        }
};