# micro-image-transformations
![travis build](https://api.travis-ci.com/jshi22/micro-image-transformations.svg?token=T8PthyzySUexzMRoGKqp&branch=master)

An image processing micro library for Node and the web.

Installation: `npm install --save micro-image-transformations`

Since this is a small library, I will include the API usage in this doc.

## Supported Image Types

- jpeg
- png
- tiff
- bmp
- gif

## Image Transformations Provided

- [grayscale](./src/index.js) - Turn an image into grayscale (luminosity correction algorithm used as humans are more sensitive to green)
- [crop](./src/index.js) - Crop an image.

## API

Usage:<br>
First make sure to include the library:<br>
`const imageTransformLibrary = require('micro-image-transformations');`

You can pass an HTML image element as an argument to a transformation function like so: <br>
`let newImage=imageTransformLibrary.grayscale(img);` where `img` is an HTML img object.

<br>Now you can do whatever you want with that new image object. Perhaps you want to render it on a canvas:<br>
`const context = document.getElementById('image-display').getContext('2d');`
`context.drawImage(newImage,0,0);`

## Contributing

Clone this repository and submit a pull request!

Please read the [CONTRIBUTING documentation](CONTRIBUTING.md).

## License

micro-image-transformations is licensed under the MIT license. 