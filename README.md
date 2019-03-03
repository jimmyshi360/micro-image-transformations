
![](https://i.imgur.com/lSuYdgF.png)
# micro-image-transformations (v1.0.0)
![travis build](https://api.travis-ci.com/jshi22/micro-image-transformations.svg?token=T8PthyzySUexzMRoGKqp&branch=master)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)<br>
An image processing microlibrary for Node and the web. Though I wrote this as a Node packages, I am targetting the web, for users who would like to modify web images.
<br> Unittests are written in mocha and chai <br><br>
Here is a link to a barebones demo website I put together:
https://jshi22.github.io/image-processing-demo/

The npm package is currently v3.0.0 as I had to publish a few times for testing purposes.

## Thank you Instrumental, your consideration means a lot to me. This project was an enjoyable learning experience!

## Installation

`npm install --save micro-image-transformations`

For setting up browserify to use this npm pacakage, run <br>
`npm install -g browserify`
<br>
Then pass the path of the js file that contains the image transform code
<br>
`browserify src/image_handler.js -o bundle.js`
<br>Run this each time you make changes to the file or simply use watchify (another useful npm package).

If already installed, run `npm update` to check for and install new versions.

### Example Usage

Suppose this js file is src/image_handler.js

```js 
  //include the 
  var imageTransformLibrary = require('micro-image-transformations');
  
  //grayscale transform
  var grayscaleImage=imageTransformLibrary.grayscale(img);
  
  //render it to canvas
  var context = document.getElementById('image-display').getContext('2d');
  context.drawImage(grayscaleImage,0,0);
```

### Methods

```js    
  grayscale(image);  //averages values based on a luminosity equation. (humans are more sensitive to green)
  crop(image, startX, startY, cropWidth, cropHeight);  //uses cartesian coordinates (bottom left corner of image is (0,))
```
## Supported Image Types

- jpeg
- png
- gif
- ico
- may support additional image types like tiff and bmp (not tested)

## Image Transformations Provided

- [grayscale](./src/index.js) - Turn an image into grayscale (luminosity correction algorithm used as humans are more sensitive to green)
- [crop](./src/index.js) - Crop an image.

## Contributing

Clone this repository! Submit your PR and Travis will run some tests to make sure it is compliant with current standards.

### Testing
In the cloned repository, to run tests, run `npm test`. Current tests are written in mocha and chai, testing grayscale and crop functions.

Note: eslint currently disabled due to some Travis complaints.
## License

micro-image-transformations is licensed under the MIT license. 
