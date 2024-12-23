module.exports = {
    transform: {
      "^.+\\.jsx?$": "babel-jest", // Use babel-jest to transform JS/JSX files
    },
    moduleNameMapper: {
      "\\.(css|less|scss)$": "identity-obj-proxy", // Mock CSS imports
    },
    transformIgnorePatterns: [
        "/node_modules/(?!axios)", // Add any other libraries that need to be transformed
      ],
      testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)",
        "**/SpeechRecognitionComponent.test.js" // Add your specific test file here
      ],
  };