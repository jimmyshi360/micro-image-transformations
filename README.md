# micro-image-transformations (v1.0.0)
![travis build](https://api.travis-ci.com/jshi22/micro-image-transformations.svg?token=T8PthyzySUexzMRoGKqp&branch=master)

An image processing microlibrary for Node and the web. Though I wrote this as a Node packages, I am targetting the web, for users who would like to modify web images.

Here is a link to an example demo website that uses these transformations:
[pending]

## Installation

`npm install --save micro-image-transformations`

###Example Usage

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
  crop(iamge, startX, startY, cropWidth, cropHeight);  //uses cartesian coordinates (bottom left corner of image is (0,))
```
## Supported Image Types

- jpeg
- png
- tiff
- bmp
- gif

## Image Transformations Provided

- [grayscale](./src/index.js) - Turn an image into grayscale (luminosity correction algorithm used as humans are more sensitive to green)
- [crop](./src/index.js) - Crop an image.

## Contributing

Clone this repository! Submit your PR and Travis will run some tests to make sure it is compliant with current standards.

In the cloned repository, to run tests, run `npm test`. Current tests are written in mocha and chai the for grayscale and crop functions.

Note: eslint currently disabled due to some Travis complaints.
## License

micro-image-transformations is licensed under the MIT license. 
