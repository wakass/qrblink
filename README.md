A simple webGL based qr code blink generator. It's cool mannnn....

Use three.js as webgl framework, with generated bitmap from qr-code-generator

## Testing

Use `npm install -g watchify` to install the "watch"  version of browserify (which bundles all package into bundle.js) to automatically update your bundle.js when changes occur in your code.

Have an index.js (e.g.) to store your code.
`watchify index.js -o bundle.js`.


## Caveat emptor
For testing the canvas element with cross-site (local too) images, the canvas can get "tainted" and unusuble. To fix in firefox: In about:config change privacy.file_unique_origin to false. This prevents CORS checking.