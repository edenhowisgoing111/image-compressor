# Image Compressor

A sleek Apple-style web application for compressing PNG and JPG images without losing significant quality.

## Features

- Upload PNG and JPG images via drag & drop or file browser
- Adjust compression level using a convenient slider
- Preview original and compressed images side by side
- See original and compressed file sizes
- Calculate size reduction percentage
- Download compressed images with a single click
- Responsive design for both desktop and mobile devices

## How to Use

1. Open `index.html` in your web browser
2. Upload an image by dragging and dropping it onto the upload area or by clicking "Browse Files"
3. Adjust the compression level using the slider (80% is the default)
4. Click "Compress" to compress the image
5. Preview the compressed image and compare with the original
6. Click "Download" to save the compressed image
7. Use "Upload New Image" to start over with a new image

## Technical Details

- The application uses the [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) library for client-side image compression
- All compression happens locally in your browser - no images are uploaded to any server
- The app supports PNG and JPG/JPEG formats
- Maximum image dimensions are limited to 1920px (width or height) to ensure good performance

## Browser Compatibility

This application is compatible with modern browsers that support ES6+ JavaScript features:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open-source and freely available for personal and commercial use. 