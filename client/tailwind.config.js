
// tailwind.config.js
const { createNativewindPreset } = require("@gluestack-ui/nativewind-utils");
const { gluestackUIConfig } = require("@gluestack-ui/config");

module.exports = {
  presets: [createNativewindPreset(gluestackUIConfig)],
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
