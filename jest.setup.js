// import '@testing-library/jest-dom';



// jest.setup.js
import '@testing-library/jest-dom'; // Keep this for Jest matchers
const { TextEncoder, TextDecoder } = require('text-encoding');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;