module.exports = {
  transform: {"^.+\\.ts?$": "ts-jest"},
  "transformIgnorePatterns": [
    "/node_modules/",
    "\\.pnp\\.[^\\/]+$"
  ],
  testEnvironment: "node",
  testRegex: ".*\\.(test|spec)?\\.(js|ts)$",
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>"]
  
}