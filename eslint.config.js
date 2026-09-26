const js = require("@eslint/js");

module.exports = [
  {
    files: ["app.js", "server.js", "test/**/*.js"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        __dirname: "readonly",
        process: "readonly",
        console: "readonly",
        require: "readonly",
        module: "readonly"
      }
    },
    rules: {
      ...js.configs.recommended.rules
    }
  },

  {
    files: ["public/**/*.js"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        document: "readonly",
        fetch: "readonly",
        alert: "readonly",
        console: "readonly"
      }
    },
    rules: {
      ...js.configs.recommended.rules
    }
  }
];