# micro-image-transformations

An image processing micro library for Node and the web.

Installation: `npm install --save micro-image-transformations`

Since this is a small library, I will include the API usage in this doc.

## Supported Image Types

- [jpeg](./packages/type-jpeg)
- [png](./packages/type-png)
- [tiff](./packages/type-tiff)
- [bmp](./packages/type-bmp)
- [gif](./packages/type-gif)

## Image Transformations Provided

- [grayscale](./packages/plugin-blit) - Turn an image into grayscale (luminosity correction algorithm used as humans are more sensitive to green)
- [crop](./packages/plugin-blur) - Crop an image.

## API

- [grayscale](./packages/plugin-blit) - Turn an image into grayscale (luminosity correction algorithm used as humans are more sensitive to green)
- [crop](./packages/plugin-blur) - Crop an image.


## Contributing

Clone this repository and submit a pull request!

Please read the [CONTRIBUTING documentation](CONTRIBUTING.md).

## License

micro-image-transformations is licensed under the MIT license. 