// Vercel serverless function handler
// This simply exports the Express app from the compiled dist folder
const app = require("../dist/index.js").default || require("../dist/index.js");

module.exports = app;
