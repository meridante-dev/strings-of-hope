// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// This project lives on an exFAT volume, which makes macOS scatter AppleDouble
// "._*" shadow files next to every real file. Metro must never treat those as
// source modules (they are binary and break the bundler / route scanner).
const appleDouble = /.*\/\._.*/;
const existing = config.resolver.blockList;
config.resolver.blockList = existing
  ? Array.isArray(existing)
    ? [...existing, appleDouble]
    : [existing, appleDouble]
  : appleDouble;

module.exports = config;
