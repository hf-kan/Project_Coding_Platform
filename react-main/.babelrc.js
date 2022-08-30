module.exports = {
    presets: ["@babel/preset-react", "@babel/preset-env"]
  },
  {
    "plugins": [
      ["prismjs", {
          "languages": ["javascript", "css", "markup", "java"],
          "plugins": ["line-numbers"],
          "theme": "twilight",
          "css": true
      }]
    ]
  }
  